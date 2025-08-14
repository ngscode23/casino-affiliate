// Переброс токенов на /admin и поддержка инвайта/восстановления
(function () {
  const h = location.hash || '';
  if ((h.startsWith('#invite_token=') || h.startsWith('#recovery_token=')) && !location.pathname.startsWith('/admin/')) {
    location.replace('/admin/' + h);
    return;
  }
})();

// Подождать загрузку виджета Netlify Identity
function whenIdentity(cb, waited) {
  if (window.netlifyIdentity) return cb(window.netlifyIdentity);
  if ((waited || 0) > 10000) return; // через 10 сек сдаёмся
  setTimeout(() => whenIdentity(cb, (waited || 0) + 200), 200);
}

whenIdentity((ni) => {
  ni.on('init', (user) => {
    const h = location.hash || '';
    if (!user && h.includes('invite_token')) ni.open('signup');
    if (!user && h.includes('recovery_token')) ni.open('recovery');
  });

  ni.on('login', () => {
    history.replaceState(null, '', '/admin/');
    location.reload();
  });

  ni.init();
});