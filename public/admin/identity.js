/* Netlify Identity bootstrap (CSP-safe, no inline) */
(function () {
  var HASH = location.hash || "";
  var ON_ADMIN = location.pathname.startsWith("/admin/");
  var TOKEN = (function () {
    if (!HASH) return null;
    if (HASH.indexOf("#invite_token=") === 0) return "invite";
    if (HASH.indexOf("&invite_token=") !== -1) return "invite";
    if (HASH.indexOf("#recovery_token=") === 0) return "recovery";
    if (HASH.indexOf("&recovery_token=") !== -1) return "recovery";
    return null;
  })();

  // Если пришли по ссылке с токеном не на /admin — перебросить
  if (TOKEN && !ON_ADMIN) {
    location.replace("/admin/" + HASH);
    return;
  }
})();

function waitForIdentity(cb, waited) {
  if (window.netlifyIdentity && typeof window.netlifyIdentity === "object") {
    return cb(window.netlifyIdentity);
  }
  if ((waited || 0) > 10000) return; // сдаёмся через 10с
  setTimeout(function () { waitForIdentity(cb, (waited || 0) + 200); }, 200);
}

waitForIdentity(function (ni) {
  // Иногда сторонние куки выключены → виджет закрывается. Подскажем в консоль.
  try {
    if (document && !document.hasStorageAccess) {
      console.info("[Identity] Если модалка закрывается сразу — разрешите third-party cookies для identity.netlify.com");
    }
  } catch (_e) {}

  ni.on("init", function (user) {
    var h = location.hash || "";
    var hasInvite = h.indexOf("invite_token") !== -1;
    var hasRecovery = h.indexOf("recovery_token") !== -1;

    if (!user && hasInvite) {
      ni.open("signup");
      return;
    }
    if (!user && hasRecovery) {
      // У некоторых версий виджет сам определяет recovery по хэшу,
      // но чтоб наверняка, открываем логин, он подхватит токен и покажет reset.
      ni.open("login");
      return;
    }
  });

  ni.on("login", function () {
    // Убираем токен из адреса и перезагружаем админку уже залогиненным
    history.replaceState(null, "", "/admin/");
    location.reload();
  });

  ni.init();
});