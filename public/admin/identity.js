// если в урле есть invite_token или recovery_token — перенаправим на /admin/ и сохраним хэш
(function () {
  const hash = window.location.hash || '';
  if (hash.startsWith('#invite_token=') || hash.startsWith('#recovery_token=')) {
    try {
      localStorage.setItem('netlify-cms-token', hash);
    } catch (e) {}

    if (!window.location.pathname.startsWith('/admin/')) {
      window.location.replace('/admin/' + hash);
      return;
    }
  }
})();

// дождёмся виджета
function onIdentityReady(cb) {
  if (window.netlifyIdentity) return cb();
  document.addEventListener('NetlifyIdentityLoaded', cb, { once: true });
}

onIdentityReady(() => {
  const ni = window.netlifyIdentity;
  if (!ni) return;

  ni.on('init', (user) => {
    const hash = window.location.hash || '';

    if (!user && hash.includes('invite_token')) {
      ni.open('signup');
    }

    if (!user && hash.includes('recovery_token')) {
      ni.open('recovery');
    }
  });

  ni.on('login', () => {
    // убираем токены из хэша и перезагружаем
    history.replaceState(null, '', '/admin/');
    window.location.reload();
  });

  ni.init();
});