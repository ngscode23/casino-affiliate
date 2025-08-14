(function () {
  var h = location.hash || "";
  var onAdmin = location.pathname.startsWith("/admin/");
  var hasToken = /#(?:invite_token|recovery_token|confirmation_token|access_token|token)=/i.test(h);

  // Если пришли с токеном — перенаправляем на /admin
  if (hasToken && !onAdmin) {
    try { localStorage.setItem("netlify-cms-token", h); } catch (_) {}
    location.replace("/admin/" + h);
    return;
  }

  // Если уже на /admin без hash, но есть сохранённый токен — восстанавливаем
  if (onAdmin && !h) {
    try {
      var saved = localStorage.getItem("netlify-cms-token");
      if (saved && /#(?:invite_token|recovery_token|confirmation_token|access_token|token)=/i.test(saved)) {
        localStorage.removeItem("netlify-cms-token");
        history.replaceState(null, "", "/admin/" + saved);
      }
    } catch (_) {}
  }

  // Ждём полной загрузки, затем инициализируем и открываем форму
  document.addEventListener("DOMContentLoaded", function () {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init();
      window.netlifyIdentity.open("login"); // форма откроется сразу
    }
  });
})();