// i18n — loads data/translations.json, applies data-i18n bindings
(function(){
  var LANGS=['tr','en','ru','uk','el'];
  var STORAGE_KEY='ows_lang';
  var strings=null;
  var ready=false;
  var lang=localStorage.getItem(STORAGE_KEY)||'tr';
  if(LANGS.indexOf(lang)===-1) lang='tr';

  function captureFallbacks(){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      if(el.dataset.i18nFallback==null) el.dataset.i18nFallback=el.textContent;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function(el){
      if(el.dataset.i18nAttrFallback==null) el.dataset.i18nAttrFallback=el.getAttribute('data-i18n-attr');
    });
    document.querySelectorAll('[data-i18n-content]').forEach(function(el){
      if(el.dataset.i18nContentFallback==null){
        el.dataset.i18nContentFallback=el.getAttribute('content')||'';
      }
    });
    if(document.documentElement.dataset.i18nTitleFallback==null){
      document.documentElement.dataset.i18nTitleFallback=document.title;
    }
  }

  function lookup(key){
    if(!strings) return null;
    var bucket=strings[lang]||strings.tr||{};
    if(Object.prototype.hasOwnProperty.call(bucket,key) && bucket[key]!=='') return bucket[key];
    if(strings.tr&&Object.prototype.hasOwnProperty.call(strings.tr,key) && strings.tr[key]!=='') return strings.tr[key];
    return null;
  }

  function t(key,el){
    var hit=lookup(key);
    if(hit!=null) return hit;
    if(el){
      if(el.dataset.i18nFallback!=null && el.dataset.i18nFallback!=='') return el.dataset.i18nFallback;
      if(el.dataset.i18nContentFallback!=null && el.dataset.i18nContentFallback!=='') return el.dataset.i18nContentFallback;
    }
    return key;
  }

  function apply(){
    captureFallbacks();
    if(!strings) return;
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key=el.getAttribute('data-i18n');
      var val=t(key,el);
      if(val!=null && val!=='') el.textContent=val;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function(el){
      var spec=(el.dataset.i18nAttrFallback||el.getAttribute('data-i18n-attr')||'').split(';');
      spec.forEach(function(pair){
        var parts=pair.split(':');
        if(parts.length!==2) return;
        var attr=parts[0].trim();
        var key=parts[1].trim();
        var val=lookup(key);
        if(val==null){
          var current=el.getAttribute(attr);
          if(current!=null && current!=='') return;
        }
        if(val!=null && val!=='') el.setAttribute(attr,val);
      });
    });
    document.querySelectorAll('[data-i18n-content]').forEach(function(el){
      var key=el.getAttribute('data-i18n-content');
      var val=t(key,el);
      if(val!=null && val!=='') el.setAttribute('content',val);
    });
    var titleKey=document.documentElement.getAttribute('data-i18n-title');
    if(titleKey){
      var titleVal=lookup(titleKey);
      if(titleVal==null) titleVal=document.documentElement.dataset.i18nTitleFallback||document.title;
      if(titleVal) document.title=titleVal;
    }
    document.querySelectorAll('.lang-btn').forEach(function(btn){
      btn.classList.toggle('on',btn.dataset.lang===lang);
      btn.disabled=!ready;
      var label=lookup('lang.'+btn.dataset.lang);
      if(label) btn.setAttribute('aria-label',label);
    });
  }

  function setLang(code){
    if(!ready||!strings) return;
    if(LANGS.indexOf(code)===-1) return;
    lang=code;
    try{ localStorage.setItem(STORAGE_KEY,lang); }catch(e){}
    apply();
  }

  function init(){
    captureFallbacks();
    document.querySelectorAll('.lang-btn').forEach(function(btn){
      btn.addEventListener('click',function(){ setLang(btn.dataset.lang); });
      btn.disabled=true;
    });
    fetch('data/translations.json')
      .then(function(r){
        if(!r.ok) throw new Error('translations load failed: '+r.status);
        return r.json();
      })
      .then(function(data){
        if(!data||!data.tr) throw new Error('translations shape invalid');
        strings=data;
        ready=true;
        apply();
      })
      .catch(function(err){
        ready=false;
        strings=null;
        console.error('[i18n]',err);
        document.querySelectorAll('.lang-btn').forEach(function(btn){ btn.disabled=true; });
      });
  }

  window.owsI18n={ setLang:setLang, apply:apply, ready:function(){ return ready; } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
