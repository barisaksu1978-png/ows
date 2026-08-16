// app.js — uygulama başlangıcı
(function(){
  function bindNav(){
    document.querySelectorAll('.nav-link').forEach(function(el){
      el.addEventListener('click', function(ev){
        ev.preventDefault();
        var route = el.dataset.route;
        if (route) location.hash = '#' + route;
      });
    });
  }

  function boot(){
    bindNav();
    OWSI18n.init().then(function(){
      return OWSContent.preload();
    }).then(function(){
      OWSRouter.init();
      OWSIntro.init();
      OWSRouter.onRoute(function(route){
        OWSContent.renderRoute(route);
      });
      if (document.body.classList.contains('shell-mode')) {
        OWSRouter.handleRoute && OWSRouter.handleRoute();
      }
    }).catch(function(err){
      console.error('[OWSApp]', err);
      OWSRouter.init();
      OWSIntro.init();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
