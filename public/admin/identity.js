// identity.js — минимально-инвазивный виджет + кнопка "Установить/сменить пароль".

// 1) Перенаправляем любые identity-токены на /admin, чтобы виджет их съел
(function () {
  var h = location.hash || "";
  var onAdmin = location.pathname.startsWith("/admin/");
  var hasToken = /#(?:invite_token|recovery_token|confirmation_token|access_token|token)=/i.test(h);

  if (hasToken && !onAdmin) {
    try { localStorage.setItem("netlify-cms-token", h); } catch (_) {}
    location.replace("/admin/" + h);
    return;
  }

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

// 2) Ждем загрузки виджета
(function waitNI(cb){
  if (window.netlifyIdentity && typeof window.netlifyIdentity.on === "function") return cb(window.netlifyIdentity);
  setTimeout(function(){ waitNI(cb); }, 50);
})(function(ni){
  if (window.__IDENTITY_WIRED__) return;
  window.__IDENTITY_WIRED__ = true;

  // Диагностика
  ni.on("init",  function(u){ console.log("[identity] init:", !!u); });
  ni.on("open",  function(){ console.log("[identity] open"); });
  ni.on("close", function(){ console.log("[identity] close"); });
  ni.on("login", function(u){
    try { localStorage.removeItem("netlify-cms-token"); } catch (_) {}
    if (location.hash) history.replaceState(null, "", "/admin/");
    location.reload();
  });
  ni.on("error", function(e){ console.error("[identity] error:", e); });

  // 3) Плавающая кнопка "Установить/сменить пароль"
  createRecoveryButton(ni);
});

// Создаем FAB-кнопку и вешаем обработчик без инлайна (CSP-friendly)
function createRecoveryButton(ni) {
  var btn = document.createElement("button");
  btn.textContent = "Установить/сменить пароль";
  btn.setAttribute("type", "button");
  btn.style.position = "fixed";
  btn.style.right = "16px";
  btn.style.bottom = "16px";
  btn.style.zIndex = "9999";
  btn.style.padding = "10px 12px";
  btn.style.borderRadius = "10px";
  btn.style.border = "1px solid rgba(148,163,184,0.3)";
  btn.style.background = "rgba(15,23,42,0.9)";
  btn.style.color = "#e2e8f0";
  btn.style.fontSize = "12px";
  btn.style.cursor = "pointer";
  btn.style.backdropFilter = "blur(6px)";

  btn.addEventListener("click", async function () {
    try {
      // если есть текущий пользователь — берем его email
      var user = (ni.currentUser && ni.currentUser()) || null;
      var email = user && user.email;

      if (!email) {
        email = prompt("Введите e-mail, на который прислать ссылку для установки пароля:");
        if (!email) return;
      }

      // у виджета внутри есть GoTrue-клиент
      var go = ni.gotrue && ni.gotrue;
      if (!go || !go.requestPasswordRecovery) {
        // fallback на HTTP, если API недоступен
        await fetch("/.netlify/identity/recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email })
        });
      } else {
        await go.requestPasswordRecovery(email);
      }

      alert("Отправили письмо для установки/сброса пароля. Открой ссылку на этом устройстве.\nЕсли форма не откроется — зайдите на /admin с включенными third-party cookies для identity.netlify.com.");
    } catch (e) {
      console.error("Recovery error:", e);
      alert("Не удалось отправить письмо. Проверь e-mail и попробуйте снова.");
    }
  });

  document.addEventListener("DOMContentLoaded", function(){
    // чтобы не было дублей при hot-reload
    if (!document.getElementById("__pw_fab__")) {
      btn.id = "__pw_fab__";
      document.body.appendChild(btn);
    }
  });
}