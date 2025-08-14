// identity.js — без ручного init, без повторных подписок

// Если пришли с токеном НЕ на /admin — перебросить на /admin c тем же hash
(function () {
  var h = location.hash || "";
  var onAdmin = location.pathname.startsWith("/admin/");
  var hasToken =
    h.indexOf("invite_token=") !== -1 ||
    h.indexOf("recovery_token=") !== -1;

  if (hasToken && !onAdmin) {
    location.replace("/admin/" + h);
    return;
  }
})();

// Ждём, пока виджет поднимется САМ (мы init не вызываем)
function whenIdentity(cb, waited) {
  if (window.netlifyIdentity && typeof window.netlifyIdentity === "object") return cb(window.netlifyIdentity);
  if ((waited || 0) > 10000) return; // сдаёмся через 10с
  setTimeout(function () { whenIdentity(cb, (waited || 0) + 200); }, 200);
}

whenIdentity(function (ni) {
  // Флаг: провели проводку один раз
  if (window.__IDENTITY_WIRED__) return;
  window.__IDENTITY_WIRED__ = true;

  // Откроем модалку только если реально пришли с токеном
  var h = location.hash || "";
  var hasInvite = h.indexOf("invite_token=") !== -1;
  var hasRecovery = h.indexOf("recovery_token=") !== -1;

  ni.on("init", function (user) {
    if (!user && (hasInvite || hasRecovery)) {
      // login подхватит recovery_token, signup — invite_token
      ni.open(hasInvite ? "signup" : "login");
    }
  });

  ni.on("login", function () {
    // после входа чистим hash и перегружаем админку
    if (location.hash) history.replaceState(null, "", "/admin/");
    location.reload();
  });

  // НИКАКОГО ni.init() тут нет. Виджет и так инициализируется автоматически.
});