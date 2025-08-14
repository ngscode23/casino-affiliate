// identity.js — без ручного init, без автологина; открываем модалку ТОЛЬКО после init и ТОЛЬКО при токене

// 1) Если пришли с токеном (invite/recovery/confirmation/access) не на /admin — перенаправим на /admin с тем же hash
(function () {
  var h = location.hash || "";
  var onAdmin = location.pathname.startsWith("/admin/");
  var hasToken = /#(?:invite_token|recovery_token|confirmation_token|access_token|token)=/i.test(h);

  if (hasToken && !onAdmin) {
    try { localStorage.setItem("netlify-cms-token", h); } catch (_) {}
    location.replace("/admin/" + h);
  }

  // Если пришли на /admin без hash, но ранее сохраняли — вернём
  if (onAdmin && !h) {
    try {
      var saved = localStorage.getItem("netlify-cms-token");
      if (saved && /#(?:invite_token|recovery_token|confirmation_token|access_token|token)=/i.test(saved)) {
        localStorage.removeItem("netlify-cms-token");
        history.replaceState(null, "", "/admin/" + saved);
      }
    } catch (_) {}
  }
})();

// 2) Ждём, пока виджет загрузится (мы НЕ вызываем init сами)
(function waitNI(cb){
  if (window.netlifyIdentity && typeof window.netlifyIdentity.on === "function") return cb(window.netlifyIdentity);
  setTimeout(function(){ waitNI(cb); }, 50);
})(function(ni){
  if (window.__IDENTITY_WIRED__) return;
  window.__IDENTITY_WIRED__ = true;

  // Логи для диагностики
  ni.on("init",  function(u){ console.log("[identity] init:", !!u); });
  ni.on("open",  function(){ console.log("[identity] open"); });
  ni.on("close", function(){ console.log("[identity] close"); });
  ni.on("error", function(e){ console.error("[identity] error:", e); });
  ni.on("login", function(u){
    try { localStorage.removeItem("netlify-cms-token"); } catch (_) {}
    if (location.hash) history.replaceState(null, "", "/admin/");
    location.reload();
  });

  // 3) Открываем модалку ТОЛЬКО ПОСЛЕ init и ТОЛЬКО если есть токен
  var hasInvite   = (location.hash || "").indexOf("invite_token=")   !== -1;
  var hasRecovery = (location.hash || "").indexOf("recovery_token=") !== -1;

  ni.on("init", function(user){
    if (!user && (hasInvite || hasRecovery)) {
      ni.open(hasInvite ? "signup" : "login"); // recovery токен обрабатывается внутри login
    }
  });

  // ВАЖНО: ни одного ni.init() здесь нет — Decap инициализирует сам (см. "Manually initializing identity widget")
});