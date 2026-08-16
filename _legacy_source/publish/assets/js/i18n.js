// i18n.js — translations loader with Turkish HTML fallback
window.OWSI18n = (function(){
  var LANGS = ['tr','en','ru','uk','el'];
  var STORAGE_KEY = 'ows_lang';
  var strings = null;
  var ready = false;
  var lang = localStorage.getItem(STORAGE_KEY) || 'tr';
  var listeners = [];
  if (LANGS.indexOf(lang) === -1) lang = 'tr';

  function captureFallbacks(root){
    (root || document).querySelectorAll('[data-i18n]').forEach(function(el){
      if (el.dataset.i18nFallback == null) el.dataset.i18nFallback = el.textContent;
    });
    (root || document).querySelectorAll('[data-i18n-content]').forEach(function(el){
      if (el.dataset.i18nContentFallback == null)
        el.dataset.i18nContentFallback = el.getAttribute('content') || '';
    });
    if (document.documentElement.dataset.i18nTitleFallback == null)
      document.documentElement.dataset.i18nTitleFallback = document.title;
  }

  function lookup(key){
    if (!strings) return null;
    var bucket = strings[lang] || strings.tr || {};
    if (Object.prototype.hasOwnProperty.call(bucket, key) && bucket[key] !== '') return bucket[key];
    if (strings.tr && Object.prototype.hasOwnProperty.call(strings.tr, key) && strings.tr[key] !== '')
      return strings.tr[key];
    return null;
  }

  function t(key, el){
    var hit = lookup(key);
    if (hit != null) return hit;
    if (el && el.dataset.i18nFallback) return el.dataset.i18nFallback;
    return key;
  }

  function apply(root){
    captureFallbacks(root);
    if (!strings) return;
    document.documentElement.lang = lang;
    var scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var val = t(key, el);
      if (val) el.textContent = val;
    });
    scope.querySelectorAll('[data-i18n-content]').forEach(function(el){
      var key = el.getAttribute('data-i18n-content');
      var val = t(key, el);
      if (val) el.setAttribute('content', val);
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach(function(el){
      el.getAttribute('data-i18n-attr').split(';').forEach(function(pair){
        var parts = pair.split(':');
        if (parts.length !== 2) return;
        var val = lookup(parts[1].trim());
        if (val) el.setAttribute(parts[0].trim(), val);
      });
    });
    var titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey){
      var titleVal = lookup(titleKey) || document.documentElement.dataset.i18nTitleFallback;
      if (titleVal) document.title = titleVal;
    }
    document.querySelectorAll('.lang-btn').forEach(function(btn){
      btn.classList.toggle('on', btn.dataset.lang === lang);
      btn.disabled = !ready;
      var label = lookup('lang.' + btn.dataset.lang);
      if (label) btn.setAttribute('aria-label', label);
    });
    listeners.forEach(function(fn){ fn(lang); });
  }

  function setLang(code){
    if (!ready || !strings) return;
    if (LANGS.indexOf(code) === -1) return;
    lang = code;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch(e){}
    apply();
  }

  function onChange(fn){ listeners.push(fn); }

  function init(){
    captureFallbacks();
    document.querySelectorAll('.lang-btn').forEach(function(btn){
      btn.addEventListener('click', function(){ setLang(btn.dataset.lang); });
      btn.disabled = true;
    });
    return fetch('data/translations.json')
      .then(function(r){
        if (!r.ok) throw new Error('translations load failed: ' + r.status);
        return r.json();
      })
      .then(function(data){
        if (!data || !data.tr) throw new Error('translations shape invalid');
        strings = data;
        ready = true;
        apply();
        return data;
      })
      .catch(function(err){
        ready = false;
        strings = null;
        console.error('[OWSI18n]', err);
        document.querySelectorAll('.lang-btn').forEach(function(b){ b.disabled = true; });
        return null;
      });
  }

  return { init: init, t: t, apply: apply, setLang: setLang, onChange: onChange, ready: function(){ return ready; }, lang: function(){ return lang; } };
})();
