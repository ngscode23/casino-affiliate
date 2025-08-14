// identity.js — единоразовая инициализация Netlify Identity + обработка токенов
(function () {
  // Если пришли по токену НЕ на /admin — переносим на /admin c тем же hash
  var h = location.hash || "";
  var onAdmin = location.pathname.startsWith("/admin/");
  var hasToken =
    h.startsWith("#invite_token=") ||
    h.indexOf("&invite_token=") !== -1 ||
    h.startsWith("#recovery_token=") ||
    h.indexOf("&recovery_token=") !== -1;

  if (hasToken && !onAdmin) {
    location.replace("/admin/" + h);
    return;
  }
})();

// Ждём появления виджета (скрипт identity.netlify.com)
function waitForIdentity(cb, waited) {
  if (window.netlifyIdentity && typeof window.netlifyIdentity === "object") return cb(window.netlifyIdentity);
  if ((waited || 0) > 10000) return; // через 10с сдаёмся
  setTimeout(function () { waitForIdentity(cb, (waited || 0) + 200); }, 200);
}

waitForIdentity(function (ni) {
  // Глобальный флаг: уже инициализировали — ничего не делаем
  if (window.__IDENTITY_WIRED__) return;
  window.__IDENTITY_WIRED__ = true;

  // Навешиваем обработчики ровно один раз
  ni.on("init", function (user) {
    var h = location.hash || "";
    var hasInvite = h.indexOf("invite_token") !== -1;
    var hasRecovery = h.indexOf("recovery_token") !== -1;

    if (!user && hasInvite) {
      ni.open("signup");
      return;
    }
    if (!user && hasRecovery) {
      // Откроем login: виджет сам подхватит recovery_token и покажет reset
      ni.open("login");
      return;
    }
  });

  ni.on("login", function () {
    // Чистим hash и перегружаем админку
    if (location.hash) history.replaceState(null, "", "/admin/");
    location.reload();
  });

  // Лог ошибок (для диагностики)
  ni.on("error", function (e) {
    console.error("[Identity error]", e);
  });

  // КРИТИЧНО: инициализируем ОДИН РАЗ
  // Некоторые сборки уже инициализируют автоматически — тогда повторный init дергает модалку.
  // Проверим признак из внутреннего store, если есть.
  try {
    var maybeInited =
      (ni.store && (ni.store.isInitialized || ni.store.gotrue)) ||
      (ni.currentUser && typeof ni.currentUser === "function" && ni.currentUser());
    if (!maybeInited) {
      ni.init();
    }
  } catch (_e) {
    // На всякий случай, если апи другое — всё равно пробуем init один раз
    if (!window.__IDENTITY_INIT_DONE__) {
      window.__IDENTITY_INIT_DONE__ = true;
      ni.init();
    }
  }
});