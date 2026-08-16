// INTRO CURTAIN
(function(){
  var intro=document.getElementById('intro-curtain'); if(!intro) return;
  var EXIT='fade';               // 'fade' (sakin, kilitli estetik) | 'curtain' (perde yarilir)
  var ONCE_PER_SESSION=true;     // prod: oturum basina bir kez. her aciliste gormek icin false yap
  var EXIT_AT=3000, DUR=(EXIT==='curtain')?1200:900, t1,t2;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  function startExit(){ intro.classList.add(EXIT==='curtain'?'split':'fade-exit'); }
  function run(){ intro.classList.remove('done','split','fade-exit'); clearTimeout(t1);clearTimeout(t2); t1=setTimeout(startExit,EXIT_AT); t2=setTimeout(function(){intro.classList.add('done');},EXIT_AT+DUR); }
  function finishNow(){ clearTimeout(t1);clearTimeout(t2); startExit(); setTimeout(function(){intro.classList.add('done');},DUR); }
  var b=intro.querySelector('.icv-skip'); if(b) b.addEventListener('click',function(ev){ev.stopPropagation();finishNow();});
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') finishNow(); });
  if(reduce){ intro.classList.add('done'); return; }
  if(ONCE_PER_SESSION){ try{ if(sessionStorage.getItem('ows_intro')){ intro.classList.add('done'); return; } sessionStorage.setItem('ows_intro','1'); }catch(e){} }
  run();
})();
