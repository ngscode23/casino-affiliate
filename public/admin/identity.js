// public/admin/identity.js

(function () {
  const h = window.location.hash || "";

  // полный список возможных хэшей, которые присылает Netlify Identity
  const isIdentityHash =
    /#(?:invite_token|recovery_token|confirmation_token|access_token|token)=/i.test(h);

  // если хэш с токеном пришёл не на /admin — перенаправим туда с тем же хэшем
  if (isIdentityHash && !location.pathname.startsWith("/admin/")) {
    try {
      localStorage.setItem("netlify-cms-token", h);
    } catch (_) {}
    location.replace("/admin/" + h);
    return;
  }

  // если пришли на /admin/ без хэша, но ранее мы сохраняли его — вернём обратно
  if (!h) {
    const saved = localStorage.getItem("netlify-cms-token");
    if (saved && /#(?:invite_token|recovery_token|confirmation_token|access_token|token)=/i.test(saved)) {
      localStorage.removeItem("netlify-cms-token");
      history.replaceState(null, "", "/admin/" + saved);
    }
  }
})();

// Ждём, пока скрипт виджета подключится
(function whenIdentity(cb) {
  if (window.netlifyIdentity && window.netlifyIdentity.on) return cb(window.netlifyIdentity);
  setTimeout(() => whenIdentity(cb), 50);
})(function (ni) {
  // Диагностика в консоли
  ni.on("init", (user) => console.log("[identity] init:", !!user));
  ni.on("open",     () => console.log("[identity] open"));
  ni.on("close",    () => console.log("[identity] close"));
  ni.on("login",    (user) => console.log("[identity] login:", !!user));
  ni.on("logout",   () => console.log("[identity] logout"));
  ni.on("error",    (e) => console.error("[identity] error:", e));

  // Если пришёл инвайт — откроем форму регистрации
  if ((location.hash || "").includes("invite_token")) {
    ni.open("signup");
  }

  // Начинаем
  ni.init();

  // После логина просто попадаем на /admin/ без хэша
  ni.on("login", () => {
    try { localStorage.removeItem("netlify-cms-token"); } catch (_) {}
    // убираем хэш, остаёмся на админке
    history.replaceState(null, "", "/admin/");
    // лёгкая перезагрузка, чтобы CMS точно подцепила user
    location.reload();
  });
});