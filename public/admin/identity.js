/* Netlify Identity bootstrap for Decap CMS (no inline scripts; CSP-safe) */
(function () {
  var HASH_KEY = 'netlify-identity-hash';

  // detect invite/recovery tokens in the URL hash
  var hash = window.location.hash || '';
  var hasInvite =
    hash.indexOf('#invite_token=') === 0 || hash.indexOf('&invite_token=') !== -1;
  var hasRecovery =
    hash.indexOf('#recovery_token=') === 0 || hash.indexOf('&recovery_token=') !== -1;

  // if got a token outside /admin/, remember it and redirect to /admin/ with hash
  if ((hasInvite || hasRecovery) && !location.pathname.startsWith('/admin/')) {
    sessionStorage.setItem(HASH_KEY, hash);
    location.replace('/admin/' + hash);
    return;
  }
  // keep the hash while we initialize the widget
  if (hasInvite || hasRecovery) {
    sessionStorage.setItem(HASH_KEY, hash);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function waitForIdentity(cb, waited) {
    if (window.netlifyIdentity && typeof window.netlifyIdentity === 'object') {
      return cb(window.netlifyIdentity);
    }
    if ((waited || 0) > 10000) return; // give up after 10s
    setTimeout(function () { waitForIdentity(cb, (waited || 0) + 200); }, 200);
  }

  ready(function () {
    waitForIdentity(function (identity) {
      identity.on('init', function (user) {
        var savedHash = sessionStorage.getItem(HASH_KEY) || window.location.hash || '';
        var isInvite = savedHash.indexOf('invite_token') !== -1;
        var isRecovery = savedHash.indexOf('recovery_token') !== -1;

        if (!user) {
          // Open appropriate view. For recovery the widget switches to reset form when token is present.
          if (isInvite) identity.open('signup');
          else if (isRecovery) identity.open('login');
        }
      });

      identity.on('login', function () {
        sessionStorage.removeItem(HASH_KEY);
        if (location.hash) history.replaceState(null, '', location.pathname);
        location.reload();
      });

      identity.on('logout', function () {
        sessionStorage.removeItem(HASH_KEY);
      });

      identity.init();
    });
  });
})();