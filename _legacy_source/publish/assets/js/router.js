// router.js — hash tabanlı route yönetimi
window.OWSRouter = (function(){
  var ROUTES = ['home','method','dossiers','atlas','archive','human-ai','about'];
  var current = null;
  var listeners = [];

  function normalize(hash){
    var h = (hash || location.hash || '#home').replace(/^#\/?/, '').toLowerCase();
    if (h.indexOf('dossiers/') === 0) return { page: 'dossiers', sub: h.split('/')[1] };
    if (ROUTES.indexOf(h) === -1) return { page: 'home', sub: null };
    return { page: h, sub: null };
  }

  function setActiveNav(page){
    document.querySelectorAll('.nav-link').forEach(function(el){
      el.classList.toggle('active', el.dataset.route === page);
    });
  }

  function navigate(page, replace){
    var target = '#' + page;
    if (replace) history.replaceState(null, '', target);
    else if (location.hash !== target) location.hash = target;
    else handleRoute();
  }

  function handleRoute(){
    if (!document.body.classList.contains('shell-mode')) return;
    var route = normalize(location.hash);
    current = route;
    setActiveNav(route.sub ? 'dossiers' : route.page);
    listeners.forEach(function(fn){ fn(route); });
  }

  function onRoute(fn){ listeners.push(fn); }

  function init(){
    window.addEventListener('hashchange', handleRoute);
    if (document.body.classList.contains('shell-mode')) handleRoute();
  }

  return { init: init, navigate: navigate, onRoute: onRoute, handleRoute: handleRoute, normalize: normalize, routes: ROUTES };
})();
