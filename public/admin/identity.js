// identity.js — безопасный поток входа/выхода без двойной инициализации

(function () {
  var h = location.hash || "";
  var onAdmin = location.pathname.startsWith("/admin/");
  var TOKEN_RE = /#(?:invite_token|recovery_token|confirmation_token|access_token|token)=/i;

  // Если пришли с любым identity-токеном НЕ на /admin — перенаправим туда
  if (TOKEN_RE.test(h) && !onAdmin) {
    try { localStorage.setItem("netlify-cms-token", h); } catch (_) {}
    location.replace("/admin/" + h);
    return;
  }

  // Если уже на /admin без hash, но ранее сохраняли токен — восстановим один раз
  if (onAdmin && !h) {
    try {
      var saved = localStorage.getItem("netlify-cms-token");
      if (saved && TOKEN_RE.test(saved)) {
        localStorage.removeItem("netlify-cms-token");
        history.replaceState(null, "", "/admin/" + saved);
      }
    } catch (_) {}
  }
})();

// Ждём загрузки виджета (init вызывает сам Decap; мы init НЕ зовём)
(function waitNI(cb){
  if (window.netlifyIdentity && typeof window.netlifyIdentity.on === "function") return cb(window.netlifyIdentity);
  setTimeout(function(){ waitNI(cb); }, 50);
})(function(ni){
  if (window.__IDENTITY_WIRED__) return;
  window.__IDENTITY_WIRED__ = true;

  // Простые логи — хватит гадать втемную
  ni.on("init",  function(u){ console.log("[identity] init:", !!u); });
  ni.on("open",  function(){ console.log("[identity] open"); });
  ni.on("close", function(){ console.log("[identity] close"); });
  ni.on("error", function(e){ console.error("[identity] error:", e); });

  // После успешного логина — чистим мусор и обновляем админку
  ni.on("login", function(){
    try { localStorage.removeItem("netlify-cms-token"); } catch(_) {}
    if (location.hash) history.replaceState(null, "", "/admin/");
    location.reload();
  });

  // После logout — возвращаемся на /admin и принудительно откроем логин на следующем init
  ni.on("logout", function(){
    try { localStorage.removeItem("netlify-cms-token"); } catch(_) {}
    sessionStorage.setItem("ni_force_login", "1");
    location.replace("/admin/");
  });

  // Открывать модалку будем ТОЛЬКО после init и ТОЛЬКО по делу
  ni.on("init", function(user){
    if (user) return; // уже залогинен — ничего не открываем

    var h = location.hash || "";
    var hasInvite   = h.indexOf("invite_token=")   !== -1;
    var hasRecovery = h.indexOf("recovery_token=") !== -1;
    var hasMagic    = /#(?:access_token|confirmation_token|token)=/i.test(h);
    var forceLogin  = sessionStorage.getItem("ni_force_login") === "1";

    // чтобы не дёргать повторно, сразу сбрасываем флаг
    if (forceLogin) sessionStorage.removeItem("ni_force_login");

    if (hasInvite) {
      // Режим Invite only: показываем форму регистрации
      ni.open("signup");
      return;
    }

    if (hasRecovery || hasMagic) {
      // Recovery и magic-link обрабатываются внутри login
      // Дадим виджету 50мс, чтобы он точно инициализировался
      setTimeout(function(){ ni.open("login"); }, 50);
      return;
    }

    if (forceLogin) {
      // Возврат после logout: аккуратно открыть логин
      setTimeout(function(){ ni.open("login"); }, 50);
      return;
    }

    // В остальных случаях ничего не делаем: юзер сам жмёт "Login with Netlify Identity"
  });
});