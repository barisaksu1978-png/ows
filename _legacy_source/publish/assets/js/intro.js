// intro.js — curtain + haritalı intro → app shell
window.OWSIntro = (function(){
  var STORAGE_INTRO = 'ows_intro';

  function initCurtain(){
    var intro = document.getElementById('intro-curtain');
    if (!intro) return;
    var EXIT = 'fade';
    var ONCE_PER_SESSION = true;
    var EXIT_AT = 3000, DUR = (EXIT === 'curtain') ? 1200 : 900, t1, t2;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function startExit(){ intro.classList.add(EXIT === 'curtain' ? 'split' : 'fade-exit'); }
    function run(){
      intro.classList.remove('done','split','fade-exit');
      clearTimeout(t1); clearTimeout(t2);
      t1 = setTimeout(startExit, EXIT_AT);
      t2 = setTimeout(function(){ intro.classList.add('done'); }, EXIT_AT + DUR);
    }
    function finishNow(){
      clearTimeout(t1); clearTimeout(t2);
      startExit();
      setTimeout(function(){ intro.classList.add('done'); }, DUR);
    }
    var b = intro.querySelector('.icv-skip');
    if (b) b.addEventListener('click', function(ev){ ev.stopPropagation(); finishNow(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') finishNow(); });
    if (reduce){ intro.classList.add('done'); return; }
    if (ONCE_PER_SESSION){
      try {
        if (sessionStorage.getItem(STORAGE_INTRO)){ intro.classList.add('done'); return; }
        sessionStorage.setItem(STORAGE_INTRO, '1');
      } catch(e){}
    }
    run();
  }

  function enterApp(){
    var stage = document.getElementById('intro-stage');
    if (stage) stage.classList.add('hidden');
    document.body.classList.add('app-ready', 'shell-mode');
    if (window.OWSRouter) OWSRouter.navigate('home', true);
  }

  function initIntroScreen(){
    var btn = document.getElementById('intro-enter');
    if (btn) btn.addEventListener('click', enterApp);
    // skip intro if hash already set (direct link)
    if (location.hash && location.hash !== '#intro'){
      var stage = document.getElementById('intro-stage');
      if (stage) stage.classList.add('hidden');
      document.body.classList.add('app-ready', 'shell-mode');
    }
  }

  function init(){
    initCurtain();
    initIntroScreen();
  }

  return { init: init, enterApp: enterApp };
})();
