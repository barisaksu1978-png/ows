// content-loader.js — JSON içerik yükleme ve sayfa render
window.OWSContent = (function(){
  var cache = { nav: null, dossiers: null, atlas: null, archive: null, pages: {} };

  function t(key, fb){
    if (window.OWSI18n && OWSI18n.t) return OWSI18n.t(key);
    return fb || key;
  }

  function esc(s){
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function fetchJson(url){
    return fetch(url).then(function(r){
      if (!r.ok) throw new Error(url + ' HTTP ' + r.status);
      return r.json();
    });
  }

  function loadNav(){
    if (cache.nav) return Promise.resolve(cache.nav);
    return fetchJson('data/navigation.json').then(function(d){ cache.nav = d; return d; })
      .catch(function(e){ console.error('[OWSContent] navigation', e); cache.nav = null; return null; });
  }

  function loadDossierIndex(){
    if (cache.dossiers) return Promise.resolve(cache.dossiers);
    return fetchJson('data/dossiers.json').then(function(d){ cache.dossiers = d; return d; })
      .catch(function(e){ console.error('[OWSContent] dossiers index', e); cache.dossiers = null; return null; });
  }

  function loadAtlasIndex(){
    if (cache.atlas) return Promise.resolve(cache.atlas);
    return fetchJson('data/atlas.json').then(function(d){ cache.atlas = d; return d; })
      .catch(function(e){ console.error('[OWSContent] atlas index', e); cache.atlas = null; return null; });
  }

  function loadArchiveIndex(){
    if (cache.archive) return Promise.resolve(cache.archive);
    return fetchJson('data/archive.json').then(function(d){ cache.archive = d; return d; })
      .catch(function(e){ console.error('[OWSContent] archive index', e); cache.archive = null; return null; });
  }

  function loadPage(id){
    if (cache.pages[id]) return Promise.resolve(cache.pages[id]);
    return fetchJson('content/pages/' + id + '.json').then(function(d){ cache.pages[id] = d; return d; })
      .catch(function(e){ console.error('[OWSContent] page ' + id, e); return null; });
  }

  function loadDossierDetail(id){
    return fetchJson('content/dossiers/' + id + '.json').catch(function(e){
      console.error('[OWSContent] dossier ' + id, e);
      return null;
    });
  }

  function loadAtlasDetail(id){
    return fetchJson('content/atlas/' + id + '.json').catch(function(e){
      console.error('[OWSContent] atlas ' + id, e);
      return null;
    });
  }

  function metaBadge(labelKey, valueKey, valueRaw){
    var label = t(labelKey, labelKey);
    var val = valueRaw != null ? valueRaw : t(valueKey, valueKey);
    return '<span class="meta-badge"><strong>' + esc(label) + '</strong> ' + esc(val) + '</span>';
  }

  function renderTags(keys){
    if (!keys || !keys.length) return '';
    return '<div class="tag-row">' + keys.map(function(k){
      return '<span class="tag" data-i18n="' + esc(k) + '">' + esc(t(k, k)) + '</span>';
    }).join('') + '</div>';
  }

  function renderCard(card){
    var html = '<article class="card' + (card.full ? ' card-full' : '') + '">';
    if (card.titleKey) html += '<h2 data-i18n="' + esc(card.titleKey) + '">' + esc(t(card.titleKey)) + '</h2>';
    if (card.tags) html += renderTags(card.tags);
    if (card.bodyKey) html += '<p data-i18n="' + esc(card.bodyKey) + '">' + esc(t(card.bodyKey)) + '</p>';
    if (card.items) {
      html += '<ul class="card-list">';
      card.items.forEach(function(k){
        html += '<li data-i18n="' + esc(k) + '">' + esc(t(k)) + '</li>';
      });
      html += '</ul>';
    }
    if (card.tagDesc) {
      html += '<dl class="tag-desc">';
      card.tagDesc.forEach(function(row){
        html += '<dt data-i18n="' + esc(row.term) + '">' + esc(t(row.term)) + '</dt>';
        html += '<dd data-i18n="' + esc(row.desc) + '">' + esc(t(row.desc)) + '</dd>';
      });
      html += '</dl>';
    }
    html += '</article>';
    return html;
  }

  function renderPageShell(page, inner){
    var html = '<article class="page page-' + esc(page.id) + '">';
    if (page.labelKey) html += '<div class="page-label" data-i18n="' + esc(page.labelKey) + '">' + esc(t(page.labelKey)) + '</div>';
    if (page.titleKey) html += '<h1 data-i18n="' + esc(page.titleKey) + '">' + esc(t(page.titleKey)) + '</h1>';
    if (page.quoteKey) html += '<blockquote class="page-quote" data-i18n="' + esc(page.quoteKey) + '">' + esc(t(page.quoteKey)) + '</blockquote>';
    if (page.leadKey) html += '<p class="page-lead" data-i18n="' + esc(page.leadKey) + '">' + esc(t(page.leadKey)) + '</p>';
    html += inner;
    html += '</article>';
    return html;
  }

  function renderStaticPage(pageId){
    return loadPage(pageId).then(function(page){
      if (!page) return '<div class="error-box">Sayfa yüklenemedi.</div>';
      var cards = (page.cards || []).map(renderCard).join('');
      return renderPageShell(page, '<div class="card-grid">' + cards + '</div>');
    });
  }

  function renderDossierCard(entry){
    var href = '#dossiers/' + entry.id;
    return '<article class="card dossier-card" data-dossier="' + esc(entry.id) + '">' +
      '<h2 data-i18n="' + esc(entry.titleKey) + '">' + esc(t(entry.titleKey)) + '</h2>' +
      '<p data-i18n="' + esc(entry.summaryKey) + '">' + esc(t(entry.summaryKey)) + '</p>' +
      '<div class="meta-row">' +
        metaBadge('dossiers.meta.status', 'status.' + entry.status, null) +
        metaBadge('dossiers.meta.risk', 'risk.' + entry.risk, null) +
      '</div>' +
      '<a class="enter" href="' + href + '" data-route-link="dossiers/' + esc(entry.id) + '">' +
        esc(t('dossiers.title', 'Vaka dosyaları')) + ' →</a>' +
      '</article>';
  }

  function renderDossiersList(){
    return loadDossierIndex().then(function(index){
      if (!index || !index.items || !index.items.length)
        return '<div class="error-box">Dosyalar yüklenemedi.</div>';
      return loadPage('dossiers').then(function(page){
        var cards = index.items.map(renderDossierCard).join('');
        var shell = page || { id: 'dossiers', labelKey: 'dossiers.label', titleKey: 'dossiers.title', leadKey: 'dossiers.lead' };
        return renderPageShell(shell, '<div class="card-grid">' + cards + '</div>');
      });
    });
  }

  function renderDossierDetail(id){
    return Promise.all([loadDossierDetail(id), loadDossierIndex()]).then(function(res){
      var detail = res[0];
      var index = res[1];
      if (!detail) return '<div class="error-box">Dosya yüklenemedi.</div>';
      var entry = (index && index.items) ? index.items.find(function(x){ return x.id === id; }) : null;

      var html = '<article class="page page-dossier-detail">';
      html += '<div class="page-label">' + esc(detail.code || id) + '</div>';
      html += '<h1 data-i18n="' + esc(detail.titleKey) + '">' + esc(t(detail.titleKey)) + '</h1>';
      html += '<div class="meta-row">';
      html += metaBadge('dossiers.meta.status', 'status.' + detail.status, null);
      html += metaBadge('dossiers.meta.version', null, detail.version);
      html += metaBadge('dossiers.meta.evidence', 'evidence.' + detail.evidence, null);
      html += metaBadge('dossiers.meta.risk', 'risk.' + detail.risk, null);
      html += metaBadge('dossiers.meta.red_team', null, detail.redTeam);
      html += metaBadge('dossiers.meta.updated', null, detail.updated);
      html += '</div>';
      if (detail.tags && detail.tags.length)
        html += '<div class="tag-row">' + detail.tags.map(function(tag){ return '<span class="tag">' + esc(tag) + '</span>'; }).join('') + '</div>';

      html += '<div class="card-grid">';
      (detail.sections || []).forEach(function(sec){
        html += '<article class="card' + (sec.type === 'narrative' ? ' card-full' : '') + '">';
        if (sec.titleKey) html += '<h2 data-i18n="' + esc(sec.titleKey) + '">' + esc(t(sec.titleKey)) + '</h2>';
        if (sec.bodyKey) html += '<p data-i18n="' + esc(sec.bodyKey) + '">' + esc(t(sec.bodyKey)) + '</p>';
        if (sec.items && sec.items.length) {
          html += '<ul class="card-list">';
          sec.items.forEach(function(item){
            if (typeof item === 'string') html += '<li>' + esc(item) + '</li>';
            else html += '<li>' + esc(item.text || item.key || '') + '</li>';
          });
          html += '</ul>';
        }
        html += '</article>';
      });
      html += '</div>';
      html += '<p><a class="enter" href="#dossiers">← ' + esc(t('nav.dossiers', 'Dosyalar')) + '</a></p>';
      html += '</article>';
      return html;
    });
  }

  function renderAtlasCard(entry){
    var img = entry.image ? '<img src="' + esc(entry.image) + '" alt="" loading="lazy" onerror="this.hidden=true">' : '';
    return '<article class="card">' + img +
      '<h2 data-i18n="' + esc(entry.titleKey) + '">' + esc(t(entry.titleKey)) + '</h2>' +
      '<p data-i18n="' + esc(entry.bodyKey) + '">' + esc(t(entry.bodyKey)) + '</p>' +
      '<div class="meta-row">' + metaBadge('dossiers.meta.risk', 'risk.' + entry.risk, null) + '</div>' +
      '</article>';
  }

  function renderAtlasList(){
    return loadAtlasIndex().then(function(index){
      return loadPage('atlas').then(function(page){
        var cards = '';
        if (index && index.items && index.items.length)
          cards += index.items.map(renderAtlasCard).join('');
        else if (!page || !page.cards)
          return '<div class="error-box">Atlas kayıtları yüklenemedi.</div>';
        if (page && page.cards) cards += page.cards.map(renderCard).join('');
        var shell = page || { id: 'atlas', labelKey: 'atlas.label', titleKey: 'atlas.title', leadKey: 'atlas.lead' };
        return renderPageShell(shell, '<div class="card-grid">' + cards + '</div>');
      });
    });
  }

  function renderArchiveList(){
    return loadArchiveIndex().then(function(index){
      return loadPage('archive').then(function(page){
        var cards = '';
        if (index && index.items && index.items.length) {
          cards = index.items.map(function(item){
            return '<article class="card"><h2>' + esc(item.title || item.id) + '</h2><p>' + esc(item.summary || '') + '</p></article>';
          }).join('');
        }
        if (page && page.cards) cards += page.cards.map(renderCard).join('');
        if (!cards) cards = renderCard({ titleKey: 'archive.card.shelves.title', bodyKey: 'archive.card.shelves.body' });
        var shell = page || { id: 'archive', labelKey: 'archive.label', titleKey: 'archive.title', leadKey: 'archive.lead' };
        return renderPageShell(shell, '<div class="card-grid">' + cards + '</div>');
      });
    });
  }

  function renderRoute(route){
    var root = document.getElementById('route-root');
    if (!root) return Promise.resolve();
    root.innerHTML = '<p class="page-label">…</p>';

    var p;
    if (route.sub && route.page === 'dossiers') p = renderDossierDetail(route.sub);
    else if (route.page === 'home') p = renderStaticPage('home');
    else if (route.page === 'method') p = renderStaticPage('method');
    else if (route.page === 'dossiers') p = renderDossiersList();
    else if (route.page === 'atlas') p = renderAtlasList();
    else if (route.page === 'archive') p = renderArchiveList();
    else if (route.page === 'human-ai') p = renderStaticPage('human-ai');
    else if (route.page === 'about') p = renderStaticPage('about');
    else p = renderStaticPage('home');

    return p.then(function(html){
      root.innerHTML = html;
      if (window.OWSI18n) OWSI18n.apply(root);
      root.querySelectorAll('[data-route-link]').forEach(function(a){
        a.addEventListener('click', function(ev){
          ev.preventDefault();
          location.hash = a.getAttribute('href').replace(/^#/, '#');
        });
      });
    });
  }

  function preload(){
    return Promise.all([loadNav(), loadDossierIndex(), loadAtlasIndex(), loadArchiveIndex()]);
  }

  return {
    preload: preload,
    renderRoute: renderRoute,
    loadPage: loadPage
  };
})();
