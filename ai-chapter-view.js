window._mlShowChapterView = function () {
  window._mlActiveView = 'chapter';
  if (typeof injectClauseCSS === 'function') injectClauseCSS();
  if (typeof injectSharedCSS === 'function') injectSharedCSS();
  var area = document.getElementById('ml-view-area');
  if (!area) return;
  area.innerHTML = _mlBuildFilterBar() + '<div id="ml-chapter-mount"></div>';
  _mlBindFilterBar();
  _mlRenderChapterView(_mlGetFilteredCircs());
}

window._mlRenderChapterView = function (circs) {
  var mount = document.getElementById('ml-chapter-mount');
  if (!mount) return;
  if (!circs.length) {
    mount.innerHTML = '<div style="text-align:center;padding:40px;color:var(--dr-t3);">No circulars match filters</div>';
    return;
  }

  /* seed savedFlow for each circ so chapter data is available */
  circs.forEach(function(c) { if (typeof _seedSavedFlow === 'function') _seedSavedFlow(c); });

  /* use first circ by default, or last selected */
  var activeCirc = circs[0];
  if (window._mlActiveChapterCircId) {
    var found = circs.find(function(c){ return c.id === window._mlActiveChapterCircId; });
    if (found) activeCirc = found;
  }
  window._mlActiveChapterCircId = activeCirc.id;

  mount.innerHTML =
    '<div style="display:flex;flex-direction:column;height:100%;">' +
      /* circular selector if multiple */
      (circs.length > 1 ?
        '<div style="padding:8px 16px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;gap:8px;">' +
          '<span style="font-size:11px;color:#6b7280;font-weight:600;">Circular:</span>' +
          '<select id="ml-ch-circ-sel" style="font-size:12px;padding:4px 8px;border:1px solid #d1d5db;border-radius:6px;color:#374151;">' +
            circs.map(function(c) {
              return '<option value="' + c.id + '"' + (c.id === activeCirc.id ? ' selected' : '') + '>' + c.id + ' — ' + c.title.substring(0,40) + '</option>';
            }).join('') +
          '</select>' +
        '</div>' : '') +
      '<div class="cl-split" id="ml-ch-split">' +
        '<div class="cl-nav" id="ml-ch-nav">' +
          '<div class="cl-nav-head">' +
            '<span class="cl-nav-title">Chapters</span>' +
            '<div style="display:flex;align-items:center;gap:6px;">' +
              '<span class="cl-nav-count" id="ml-ch-nav-count">—</span>' +
              '<button class="cl-nav-collapse-btn" id="ml-ch-collapse-btn" onclick="_mlChNavCollapse()" title="Collapse">‹</button>' +
            '</div>' +
          '</div>' +
          '<div class="cl-nav-tree" id="ml-ch-nav-tree"></div>' +
        '</div>' +
        '<div class="cl-workspace" id="ml-ch-workspace">' +
          '<button class="cl-nav-expand-btn" id="ml-ch-expand-btn" onclick="_mlChNavExpand()" style="display:none;">›</button>' +
          '<div class="cl-ws-placeholder" id="ml-ch-ws-ph">' +
            '<div class="cl-ws-ph-icon">📋</div>' +
            '<div class="cl-ws-ph-title">Select a chapter</div>' +
            '<div class="cl-ws-ph-sub">Click any chapter on the left to view its clauses</div>' +
          '</div>' +
          '<div id="ml-ch-ws-main" style="display:none;padding:16px 24px;"></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  _mlChBuildTree(activeCirc);

  /* circular switcher */
  var sel = document.getElementById('ml-ch-circ-sel');
  if (sel) {
    sel.addEventListener('change', function() {
      window._mlActiveChapterCircId = sel.value;
      var circ = circs.find(function(c){ return c.id === sel.value; });
      if (circ) {
        if (typeof _seedSavedFlow === 'function') _seedSavedFlow(circ);
        _mlChBuildTree(circ);
        document.getElementById('ml-ch-ws-ph').style.display = 'flex';
        document.getElementById('ml-ch-ws-main').style.display = 'none';
      }
    });
  }
}

window._mlChNavCollapse = function() {
  var nav = document.getElementById('ml-ch-nav');
  var btn = document.getElementById('ml-ch-expand-btn');
  var split = document.getElementById('ml-ch-split');
  if (!nav) return;
  nav.style.display = 'none';
  if (btn) btn.style.display = 'flex';
  if (split) split.style.gridTemplateColumns = '0px 1fr';
}

window._mlChNavExpand = function() {
  var nav = document.getElementById('ml-ch-nav');
  var btn = document.getElementById('ml-ch-expand-btn');
  var split = document.getElementById('ml-ch-split');
  if (!nav) return;
  nav.style.display = 'block';
  if (btn) btn.style.display = 'none';
  if (split) split.style.gridTemplateColumns = '248px 1fr';
}

function _mlChBuildTree(circ) {
  var tree = document.getElementById('ml-ch-nav-tree');
  var countEl = document.getElementById('ml-ch-nav-count');
  if (!tree) return;

  var flow = window._savedFlow && window._savedFlow[circ.id];
  var chapters = (flow && flow.clauses) || (circ.chapters) || _buildDemoClauses();
  var total = chapters.reduce(function(s,ch){ return s + (ch.clauses||[]).length; }, 0);
  if (countEl) countEl.textContent = total + ' clauses';

  tree.innerHTML = '<div class="cl-nav-sec-group">' +
    chapters.map(function(ch, ci) {
      return '<button class="cl-nav-sec-btn cl-nav-sec-btn-titled" id="ml-ch-nav-btn-' + ci + '" onclick="_mlChSelectChapter(' + ci + ')">' +
        '<div class="cl-nav-sec-info">' +
          '<div class="cl-nav-sec-top-row">' +
            '<span class="cl-nav-ch-num">Ch ' + (ci+1) + '</span>' +
            '<span class="cl-nav-sec-count">' + (ch.clauses||[]).length + '</span>' +
          '</div>' +
          '<span class="cl-nav-sec-title-label">' + (ch.title||'').substring(0,48) + ((ch.title||'').length>48?'…':'') + '</span>' +
        '</div>' +
      '</button>';
    }).join('') +
  '</div>';

  /* store chapters on window for click handler */
  window._mlChActiveChapters = chapters;
  window._mlChActiveCirc = circ;
}

window._mlChSelectChapter = function(ci) {
  /* highlight */
  document.querySelectorAll('[id^="ml-ch-nav-btn-"]').forEach(function(b) {
    b.style.background = '#fff';
    b.style.borderLeft = document.querySelectorAll('[id^="ml-ch-nav-btn-"]').forEach(function(b) {
    b.classList.remove('cl-nav-active');
  });
  var btn = document.getElementById('ml-ch-nav-btn-' + ci);
  if (btn) btn.classList.add('cl-nav-active');'none';
  });
  var btn = document.getElementById('ml-ch-nav-btn-' + ci);
  if (btn) { btn.style.background = '#eff6ff'; btn.style.borderLeft = '3px solid #3b82f6'; }

  var chapters = window._mlChActiveChapters || [];
  var circ = window._mlChActiveCirc || {};
  var ch = chapters[ci];
  if (!ch) return;
  var clauses = ch.clauses || [];

  document.getElementById('ml-ch-ws-ph').style.display = 'none';
  var main = document.getElementById('ml-ch-ws-main');
  main.style.display = 'block';

  main.innerHTML =
    '<div class="cl-stack-wrap">' +
    '<div class="cl-stack-header">' +
      '<div class="cl-stack-header-left">' +
        '<span class="cl-stack-ch-num">Chapter ' + (ci+1) + '</span>' +
        (ch.title ? '<span class="cl-stack-ch-title">' + ch.title + '</span>' : '') +
      '</div>' +
      '<span class="cl-stack-count">' + clauses.length + ' clause' + (clauses.length!==1?'s':'') + '</span>' +
    '</div>' +
    '<div class="cl-stack-list">' +
    /* clause list */
    (clauses.length ? clauses.map(function(cl, cli) {
      var actions = (cl.actionable||'').split(';').map(function(a){return a.trim();}).filter(Boolean);
      var obligs = cl.obligation ? [cl.obligation] : [];
      var riskCls = cl.risk === 'High' ? 'background:#fee2e2;color:#b91c1c;' : cl.risk === 'Medium' ? 'background:#fef3c7;color:#b45309;' : 'background:#dcfce7;color:#15803d;';
      return '<div class="cl-clause-row" id="ml-cl-row-' + ci + '-' + cli + '" onclick="_mlChToggleClause(' + ci + ',' + cli + ')">' +
          '<span class="cl-row-arrow" id="ml-cl-arr-' + ci + '-' + cli + '">▶</span>' +
          '<span class="cl-row-id">' + cl.id + '</span>' +
          '<span class="cl-row-title-text">' + (cl.text||cl.obligation||'').substring(0,90) + ((cl.text||'').length>90?'…':'') + '</span>' +
          '<div class="cl-row-right">' +
            (obligs.length ? '<span class="cl-row-pill">' + obligs.length + ' Obl</span>' : '') +
            (actions.length ? '<span class="cl-row-pill">' + actions.length + ' Act</span>' : '') +
            (cl.risk ? '<span class="cl-row-pill" style="background:' + (cl.risk==='High'?'#fee2e2;color:#b91c1c':cl.risk==='Medium'?'#fef3c7;color:#b45309':'#dcfce7;color:#15803d') + ';">' + cl.risk + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="cl-inline-expand" id="ml-cl-body-' + ci + '-' + cli + '" style="display:none;">' +
          '<div class="cl-expand-wrap">' +
            /* clause full text */'<div class="cl-expand-wrap">' +
          '<div class="cl-expand-tabrow" style="display:flex;">' +
            '<div class="cl-expand-tabs-left">' +
              '<button class="cl-etab active" onclick="_mlChTab(this,0,\'' + ci + '\',\'' + cli + '\')">Text</button>' +
              '<button class="cl-etab" onclick="_mlChTab(this,1,\'' + ci + '\',\'' + cli + '\')">Obligations</button>' +
            '</div>' +
            '<div class="cl-expand-tabs-right">' +
              (cl.risk ? '<span class="cl-wc-badge cl-wc-risk-' + (cl.risk||'').toLowerCase() + '">' + cl.risk + '</span>' : '') +
              (cl.department ? '<span class="cl-wc-badge cl-wc-dept">' + cl.department + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<div id="ml-cl-panels-' + ci + '-' + cli + '">' +
            '<div class="cl-expand-panel" data-panel="0" style="">' +
              (cl.text ? '<div class="cl-text-panel"><div class="cl-tp-text">' + cl.text + '</div></div>' : '') +
            '</div>' +
            '<div class="cl-expand-panel" data-panel="1" style="display:none;">' +
            (cl.text ? '<div class="cl-text-panel"><div class="cl-tp-text">' + cl.text + '</div></div>' : '') +
            /* obligations */
            (obligs.length ?
              '<div class="cl-oblig-list" style="padding:12px 16px;">' +
                '<div class="cl-actions-title">Obligations</div>' +
                obligs.map(function(ob, oi) {
                  return '<div class="cl-oblig-item" style="margin-bottom:6px;">' +
                    '<div class="cl-oblig-header" style="cursor:default;">' +
                      '<span class="cl-oblig-num">O' + (oi+1) + '</span>' +
                      '<span class="cl-oblig-preview">' + (typeof ob==='string'?ob:ob.text||'') + '</span>' +
                    '</div>' +
                  '</div>';
                }).join('') +
              '</div>' : '') +
            /* actions */
            (actions.length ?
              '<div class="cl-actions-wrap" style="padding:0 16px 12px;">' +
                '<div class="cl-actions-title">Actions <span class="cl-actions-badge">' + actions.length + '</span></div>' +
                '<div class="cl-actions-list">' +
                  actions.map(function(act, ai) {
                    return '<div class="cl-action-item">' +
                      '<div class="cl-action-main-row">' +
                        '<span class="cl-action-num">' + (ai+1) + '</span>' +
                        '<span class="cl-action-text">' + act + '</span>' +
                        '<span class="cl-row-status-pill">' + (cl.status||'Pending') + '</span>' +
                      '</div>' +
                    '</div>';
                  }).join('') +
                '</div>' +
              '</div>' : '') +
          '</div>' +
          '</div>' +
        '</div>';
    }).join('') : '<div class="cl-stack-empty">No clauses in this chapter.</div>') +
    '</div>' +
    '</div>';
}


window._mlChTab = function(btn, panelIdx, ci, cli) {
  var wrap = document.getElementById('ml-cl-panels-' + ci + '-' + cli);
  if (!wrap) return;
  wrap.querySelectorAll('.cl-expand-panel').forEach(function(p, i) {
    p.style.display = i === panelIdx ? '' : 'none';
  });
  var tabrow = btn.closest('.cl-expand-tabrow');
  if (tabrow) tabrow.querySelectorAll('.cl-etab').forEach(function(t) {
    t.classList.remove('active');
  });
  btn.classList.add('active');
}


/* ================================================================
   PANEL 3 — CLAUSE GENERATION
   Left nav: matches clause-panel-v2 exactly
     - "Chapter N" blue pill + title on second line
     - Clause items as stacked card buttons (id + risk + dept + text preview)
   Right workspace: clause-panel style card header + obligations
   Mapped refs: always visible
   Evidence button: removed
================================================================ */
function _drPanelClauses(flow, circId) {
  var chapters = flow.clauses || [];
  if (!chapters.length) return _drNotSaved('Clause Generation');
  var totalClauses = chapters.reduce(function(s,ch){return s+(ch.clauses||[]).length;},0);

  return (
    '<div class="dr-panel dr-panel-clauses">' +

    /* ── TOOLBAR ── */
    '<div class="dr-panel-toolbar">' +
      '<div class="dr-panel-title-wrap">' +
        '<span class="dr-panel-icon">&#x1F4CB;</span>' +
        '<span class="dr-panel-title">Clause Generation</span>' +
        '<span class="dr-cl-total-badge">' + totalClauses + ' clauses</span>' +
      '</div>' +
      '<div class="dr-toolbar-actions">' +
        '<label class="dr-tool-btn" title="Upload Excel to bulk-import clauses">' +
          '<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="_drRecordHistory(window._drCurrentCircId,\'Clause Generation\',\'Excel Imported\',\'Bulk clause import via Excel\');showToast(\'Excel imported successfully.\',\'success\')"/>' +
          '&#x1F4CA; Import Excel' +
        '</label>' +
        '<button class="dr-tool-btn dr-tool-btn-pri" id="dr-cl-add-ch-btn">+ Add Chapter</button>' +
        '<button class="dr-btn dr-btn-sec dr-btn-sm" onclick="_drRecordHistory(window._drCurrentCircId,\'Clause Generation\',\'Clauses Saved\',\'Clause data saved\');showToast(\'Clauses saved.\',\'success\')">&#x1F4BE; Save</button>' +
        '<button class="dr-tool-btn" onclick="window._cmsShowHistoryModal(\'Clause Generation History\', window._drGetHistory(\'Clause Generation\'))">&#x1F551; History</button>' +
      '</div>' +
    '</div>' +

    /* ── SPLIT PANE ── */
    '<div class="dr-cl-split">' +

      /* LEFT NAV — clause-panel-v2 style */
      '<div class="dr-cl-nav" id="dr-cl-nav">' +
        '<div class="dr-cl-nav-head">' +
          '<span class="dr-cl-nav-title">Structure</span>' +
          '<span class="dr-cl-nav-count" id="dr-cl-nav-count">' + totalClauses + ' clauses</span>' +
        '</div>' +
        '<div class="dr-cl-nav-tree" id="dr-cl-nav-tree">' +
          chapters.map(function(ch, ci) { return _drBuildNavChapter(ch, ci, circId); }).join('') +
        '</div>' +
      '</div>' +

      /* RIGHT WORKSPACE */
      '<div class="dr-cl-workspace" id="dr-cl-workspace">' +
        '<div class="dr-cl-ws-placeholder" id="dr-cl-ws-ph">' +
          '<div class="dr-ws-ph-icon">&#x1F4CB;</div>' +
          '<div class="dr-ws-ph-title">Select a section</div>' +
          '<div class="dr-ws-ph-sub">Click any section in the left panel to see its clauses, then select a clause to view full details</div>' +
        '</div>' +
        '<div id="dr-cl-ws-stack" style="display:none;"></div>' +
        '<div id="dr-cl-ws-content" style="display:none;"></div>' +
      '</div>' +

    '</div>' +
    '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(3)">Evidence &#x2192;</button></div>' +
    '</div>'
  );
}


window._mlChToggleClause = function(ci, cli) {
  var row = document.getElementById('ml-cl-row-' + ci + '-' + cli);
  var body = document.getElementById('ml-cl-body-' + ci + '-' + cli);
  var arr = document.getElementById('ml-cl-arr-' + ci + '-' + cli);
  if (!row || !body) return;
  var isOpen = row.classList.contains('cl-row-expanded');
  /* close all */
  document.querySelectorAll('.cl-clause-row').forEach(function(r){ r.classList.remove('cl-row-expanded'); });
  document.querySelectorAll('.cl-inline-expand').forEach(function(e){ e.style.display='none'; });
  document.querySelectorAll('.cl-row-arrow').forEach(function(a){ a.classList.remove('open'); });
  if (!isOpen) {
    row.classList.add('cl-row-expanded');
    body.style.display = 'block';
    if (arr) arr.classList.add('open');
  }
}

/* ────────────────────────────────────────────
   LEFT NAV — clause-panel-v2 structure
   Chapter → Section only (NO clauses in left nav)
   Clicking a section → shows clause stack on RIGHT panel
   Data model has no sections, so we auto-create one
   "Section" per chapter containing all its clauses
──────────────────────────────────────────── */
function _drBuildNavChapter(ch, ci, circId) {
  var clauses = ch.clauses || [];
  var chNum   = 'Chapter ' + (ci + 1);
  var chTitle = ch.title || '';

  /* Auto-build sections from clauses if none exist.
     If chapter has sections use them, else make one default section. */
  var sections = ch.sections && ch.sections.length ? ch.sections : [
    { text: chTitle || 'All Clauses', id: '', clauses: clauses.map(function(c){return c.id;}) }
  ];

  var sectionsHtml = sections.map(function(sec, si) {
    var secKey    = ci + '-' + si;
    var secLabel  = (sec.id ? sec.id + ' \u2013 ' : '') + (sec.text || 'Section ' + (si+1));
    var secShort  = secLabel.substring(0,34) + (secLabel.length>34?'\u2026':'');
    /* get actual clause objects for this section */
    var secClauses = sec.clauses
      ? sec.clauses.map(function(id){ return clauses.find(function(c){return c.id===id;}); }).filter(Boolean)
      : clauses;
    var cnt = secClauses.length;
    /* encode clause data safely as a data attribute (JSON stringified, base64) */
    var encoded = btoa(unescape(encodeURIComponent(JSON.stringify(secClauses))));
    return (
      '<div class="dr-cl-nav-sec-group">' +
        '<button class="dr-cl-nav-sec-btn" data-sec="' + secKey + '" data-ci="' + ci + '"' +
          ' data-clauses="' + encoded + '"' +
          ' data-chnum="' + chNum + '" data-chtitle="' + chTitle.replace(/"/g,'') + '"' +
          ' data-seclabel="' + secShort.replace(/"/g,'') + '">' +
          '<span class="dr-cl-nav-sec-icon">\u00a7</span>' +
          '<span class="dr-cl-nav-sec-label">' + secShort + '</span>' +
          '<span class="dr-cl-nav-sec-count">' + cnt + '</span>' +
          '<span class="dr-cl-nav-sec-arrow">\u25b8</span>' +
        '</button>' +
      '</div>'
    );
  }).join('');

  return (
    '<div class="dr-cl-nav-chapter" id="dr-cl-nav-ch-' + ci + '">' +
      '<div class="dr-cl-nav-ch-row">' +
        '<button class="dr-cl-nav-ch-btn" data-ci="' + ci + '">' +
          '<span class="dr-cl-nav-ch-arrow">&#x25B6;</span>' +
          '<div class="dr-cl-nav-ch-info">' +
            '<span class="dr-cl-nav-ch-num">' + chNum + '</span>' +
            (chTitle ? '<span class="dr-cl-nav-ch-label">' + chTitle + '</span>' : '') +
          '</div>' +
          '<span class="dr-cl-nav-ch-count">' + clauses.length + '</span>' +
        '</button>' +
        '<div class="dr-cl-ch-actions">' +
          '<label class="dr-cl-ch-action-btn" title="Import Excel for this chapter">' +
            '<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast(\'Excel mapped to ' + chNum + '.\',\'success\')"/>' +
            '&#x1F4CA;' +
          '</label>' +
          '<button class="dr-cl-ch-action-btn" title="Add clause" onclick="_drAddClause(' + ci + ',\'' + (circId||'') + '\')">+</button>' +
        '</div>' +
      '</div>' +
      /* Section list (hidden until chapter expanded) */
      '<div class="dr-cl-nav-ch-body" id="dr-cl-nav-body-' + ci + '">' +
        sectionsHtml +
      '</div>' +
    '</div>'
  );
}

/* Clause card for the RIGHT panel stack — used by _drShowClauseStack */
function _drBuildClauseCard(cl, ci, cli, circId) {
  var riskCls = cl.risk ? 'dr-cl-risk-' + cl.risk.toLowerCase() : '';
  return (
    '<button class="dr-cl-clause-card" id="dr-card-' + cl.id + '"' +
      ' data-ck="' + ci + '-' + cli + '" data-ci="' + ci + '" data-cli="' + cli + '" data-circ="' + (circId||'') + '">' +
      '<div class="dr-cl-card-top">' +
        '<span class="dr-cl-nav-cl-id">' + cl.id + '</span>' +
        '<div class="dr-cl-card-badges">' +
          (cl.risk ? '<span class="dr-cl-nav-risk ' + riskCls + '">' + cl.risk + '</span>' : '') +
          (cl.department ? '<span class="dr-cl-nav-dept">' + cl.department + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<span class="dr-cl-nav-cl-text">' + (cl.text||'').substring(0,96) + ((cl.text||'').length>96?'\u2026':'') + '</span>' +
    '</button>'
  );
}

/* ────────────────────────────────────────────
   RIGHT PANEL — CLAUSE STACK
   Shows when a section is clicked in left nav
   Displays chapter + section header, then stacked clause cards
──────────────────────────────────────────── */
window._drShowClauseStack = function(ci, circId, clauses, chNum, chTitle, secLabel) {
  var ph      = document.getElementById('dr-cl-ws-ph');
  var stack   = document.getElementById('dr-cl-ws-stack');
  var content = document.getElementById('dr-cl-ws-content');
  if (ph) ph.style.display = 'none';
  if (content) { content.style.display = 'none'; content.innerHTML = ''; }
  if (!stack) return;

  /* store for filter re-render */
  window._drActiveSection = { ci: ci, circId: circId, clauses: clauses, chNum: chNum, chTitle: chTitle, secLabel: secLabel };

  stack.style.display = 'block';
  stack.innerHTML =
    '<div class="dr-stack-wrap">' +
      '<div class="dr-stack-header">' +
        '<div class="dr-stack-breadcrumb">' +
          '<div class="dr-stack-ch-row">' +
            '<span class="dr-stack-ch-num">' + chNum + '</span>' +
            (chTitle ? '<span class="dr-stack-ch-title">' + chTitle + '</span>' : '') +
          '</div>' +
          (secLabel ? '<div class="dr-stack-sec-row"><span class="dr-stack-sec-icon">\u00a7</span><span class="dr-stack-sec-label">' + secLabel + '</span></div>' : '') +
        '</div>' +
        '<span class="dr-stack-count">' + clauses.length + ' clause' + (clauses.length!==1?'s':'') + '</span>' +
      '</div>' +
      '<div class="dr-stack-list">' +
        (clauses.length
          ? clauses.map(function(cl, cli) { return _drBuildClauseCard(cl, ci, cli, circId); }).join('')
          : '<div class="dr-stack-empty">No clauses in this section.</div>'
        ) +
      '</div>' +
    '</div>';

    // Inline dept click
tbody.querySelectorAll('.ml-inline-dept').forEach(function(cell) {
  cell.addEventListener('click', function(e) {
    e.stopPropagation();
    var idx = parseInt(cell.dataset.idx);
    _mlOpenInlineDeptPicker(cell, idx);
  });
});
// Inline assignee click
tbody.querySelectorAll('.ml-inline-assignee').forEach(function(cell) {
  cell.addEventListener('click', function(e) {
    e.stopPropagation();
    var idx = parseInt(cell.dataset.idx);
    _mlOpenInlineAssigneePicker(cell, idx);
  });
});
// Inline status click
tbody.querySelectorAll('.ml-inline-status').forEach(function(cell) {
  cell.addEventListener('click', function(e) {
    e.stopPropagation();
    var idx = parseInt(cell.dataset.idx);
    _mlOpenInlineStatusPicker(cell, idx);
  });
});

  /* bind clause card clicks */
  stack.querySelectorAll('.dr-cl-clause-card').forEach(function(btn) {
    btn.addEventListener('click', function() {
      stack.querySelectorAll('.dr-cl-clause-card').forEach(function(b){b.classList.remove('dr-clause-card-active');});
      btn.classList.add('dr-clause-card-active');
      var cii  = parseInt(btn.dataset.ci);
      var clii = parseInt(btn.dataset.cli);
      var cId  = btn.dataset.circ;
      var fl   = window._savedFlow[cId];
      var ch   = fl && fl.clauses && fl.clauses[cii];
      var cl   = ch && ch.clauses && ch.clauses[clii];
      if (cl) {
        stack.style.display = 'none';
        window._drShowClauseWorkspace(cl, cii, clii, cId);
      }
    });
  });

};

/* ────────────────────────────────────────────
   RIGHT WORKSPACE — clause-panel-v2 style card
──────────────────────────────────────────── */
window._drShowClauseWorkspace = function(cl, ci, cli, circId) {
  var ph      = document.getElementById('dr-cl-ws-ph');
  var content = document.getElementById('dr-cl-ws-content');
  if (ph) ph.style.display = 'none';
  if (!content) return;
  content.style.display = 'block';

  var ck           = ci + '-' + cli;
  var flow         = window._savedFlow[circId];
  var chapter      = flow && flow.clauses && flow.clauses[ci];
  var chapterTitle = chapter ? (chapter.title || 'Chapter ' + (ci+1)) : '';
  var chNum        = 'Chapter ' + (ci + 1);
  var actions      = (cl.actionable||'').split(';').map(function(a){return a.trim();}).filter(Boolean);
  var mapKey       = (circId||'') + ':' + cl.id;
  var mappedClauses= window._mappedClauses[mapKey] || [];

  var mappedHtml =
    '<div class="dr-mapped-refs" id="dr-mapped-refs-' + ck + '">' +
      (mappedClauses.length
        ? '<span class="dr-mapped-label">Mapped:</span>' +
          mappedClauses.map(function(m){return '<span class="dr-mapped-chip">'+m.circId+' · '+m.clauseId+'</span>';}).join('')
        : '<span class="dr-mapped-empty">No cross-references mapped yet</span>'
      ) +
    '</div>';

  var clauseText = cl.text || '';
  var metaId     = 'dr-meta-' + ck;

  content.innerHTML =
    '<div class="dr-cl-ws-inner">' +

    '<button class="dr-ws-back-btn" onclick="_drBackToStack()">← Back to clauses</button>' +

    '<div class="dr-ws-clause-card">' +
      '<div class="dr-wc-header">' +
        '<div class="dr-wc-header-left">' +
          '<div class="dr-cl-ws-bc">' +
            '<span class="dr-ws-bc-ch">' + chNum + (chapterTitle ? ' · ' + chapterTitle : '') + '</span>' +
            '<span class="dr-ws-bc-sep">›</span>' +
            '<span class="dr-ws-bc-id">' + cl.id + '</span>' +
          '</div>' +
          '<div class="dr-wc-badges">' +
            (cl.risk       ? '<span class="dr-wc-badge dr-wc-risk-' + (cl.risk||'').toLowerCase() + '">' + cl.risk + ' Risk</span>' : '') +
            (cl.department ? '<span class="dr-wc-badge dr-wc-dept">' + cl.department + '</span>' : '') +
            (cl.status     ? '<span class="dr-wc-badge dr-wc-status">' + cl.status + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="dr-wc-header-right">' +
          '<button class="dr-wc-info-btn" id="dr-info-btn-' + ck + '" onclick="_drToggleMeta(\'' + metaId + '\',\'dr-info-btn-' + ck + '\')" title="Show regulatory details">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' +
          '</button>' +
          '<button class="dr-map-btn" onclick="_drOpenMapModal(\'' + (circId||'') + '\',\'' + cl.id + '\',\'' + ck + '\',\'clause\')" title="Map to other clauses">&#x21C4; Map Clause</button>' +
          '<button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-cl-edit-' + ck + '" data-hide="dr-cl-view-' + ck + '">&#x270E; Edit</button>' +
        '</div>' +
      '</div>' +

      '<div class="dr-wc-text dr-txt-clamped" id="dr-cl-txt-' + ck + '">' + clauseText + '</div>' +
      (clauseText.length > 200 ?
        '<button class="dr-view-more-btn" id="dr-vmore-' + ck + '" onclick="_drToggleTxt(\'' + ck + '\')">' +
          'Show more &#x25BE;' +
        '</button>' : '') +

      '<div class="dr-meta-table-wrap" id="' + metaId + '" style="display:none;">' +
        '<div class="dr-meta-table-inner">' +
          [
            {label:'Regulatory Body', value:'RBI'},
            {label:'Legislative Area', value:'Banking Regulation'},
            {label:'Sub-Legislative Area', value:'Prudential Norms'},
            {label:'Act', value:'Banking Regulation Act 1949'},
            {label:'Section', value:'Section 12'},
            {label:'Sub-section', value:'Clause (a)'},
            {label:'Category', value:'Mandatory Compliance'},
            {label:'Frequency', value:'Monthly'},
            {label:'Due Date', value:'15th of following month'},
          ].map(function(f) {
            return '<div class="dr-meta-row"><span class="dr-meta-label">' + f.label + '</span><span class="dr-meta-value">' + f.value + '</span></div>';
          }).join('') +
        '</div>' +
      '</div>' +

    '</div>' +

    mappedHtml +

    '<div class="dr-clause-controls">' +
      '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Dept</span>' +
        '<select class="dr-ctrl-select">' +
          ['Compliance','Risk','Legal','IT','Operations','HR','Finance'].map(function(d){return '<option'+(d===cl.department?' selected':'')+'>'+d+'</option>';}).join('') +
        '</select>' +
      '</div>' +
      '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Status</span>' +
        '<select class="dr-ctrl-select">' +
          ['Pending','In Progress','Compliant'].map(function(s){return '<option'+(s===cl.status?' selected':'')+'>'+s+'</option>';}).join('') +
        '</select>' +
      '</div>' +
      '<div class="dr-tags-ctrl">' +
        '<span class="dr-ctrl-label">Tags</span>' +
        '<div class="dr-tags-list" id="dr-tlist-' + ck + '">' +
          (cl.tags||[]).map(function(t){return '<span class="dr-ctag">'+t+'<button onclick="this.parentElement.remove()">&#xD7;</button></span>';}).join('') +
        '</div>' +
        '<input class="dr-tag-input" id="dr-tinput-' + ck + '" placeholder="+ tag" onkeydown="if(event.key===\'Enter\'||event.key===\',\'){_drAddTag(\'' + ck + '\');event.preventDefault();}"/>' +
        '<button class="dr-tag-add-btn" onclick="_drAddTag(\'' + ck + '\')">+</button>' +
      '</div>' +
    '</div>' +

    '<div id="dr-cl-view-' + ck + '">' +
      '<div class="dr-ws-section">' +
        '<div class="dr-ws-section-head">' +
          '<span class="dr-ws-section-label">Obligations</span>' +
          '<button class="dr-add-sub-btn" onclick="_drAddObligation(\'' + ck + '\',\'' + (circId||'') + '\',\'' + cl.id + '\')">+ Add Obligation</button>' +
        '</div>' +
        '<div class="dr-ws-oblig-list" id="dr-oblig-wrap-' + ck + '">' +
          (cl.obligation
            ? _drBuildObligationItem(cl.obligation, actions, ck, circId, cl.id, 0, true)
            : '<div class="dr-empty-hint" id="dr-no-oblig-' + ck + '">No obligation yet — click + Add Obligation above</div>'
          ) +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="dr-edit-drawer" id="dr-cl-edit-' + ck + '" style="display:none;">' +
      '<div class="dr-edit-grid">' +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Clause Text</label><textarea class="dr-edit-ta" id="dr-cl-edit-text-' + ck + '">' + cl.text + '</textarea></div>' +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Obligation</label><textarea class="dr-edit-ta" id="dr-cl-edit-obl-' + ck + '">' + (cl.obligation||'') + '</textarea></div>' +
      '</div>' +
      '<div class="dr-edit-foot">' +
        '<button class="dr-btn dr-btn-ghost" data-close="dr-cl-edit-' + ck + '" data-show="dr-cl-view-' + ck + '">&#x2715; Cancel</button>' +
        '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="_drSaveClauseEdit(\'' + ck + '\')">&#x2713; Save</button>' +
      '</div>' +
    '</div>' +

    '</div>';

  window._drToggleTxt = function(ck2) {
    var el  = document.getElementById('dr-cl-txt-' + ck2);
    var btn = document.getElementById('dr-vmore-' + ck2);
    if (!el || !btn) return;
    var c = el.classList.toggle('dr-txt-clamped');
    btn.innerHTML = c ? 'Show more &#x25BE;' : 'Show less &#x25B4;';
  };

  window._drToggleMeta = function(mid, btnId) {
    var el = document.getElementById(mid), btn = document.getElementById(btnId);
    if (!el) return;
    var visible = el.style.display !== 'none';
    el.style.display = visible ? 'none' : 'block';
    if (btn) btn.classList.toggle('dr-wc-info-btn-active', !visible);
  };

  var editToggle = content.querySelector('.dr-tool-edit-toggle[data-target="dr-cl-edit-' + ck + '"]');
  if (editToggle) editToggle.addEventListener('click', function() {
    var drawer = document.getElementById('dr-cl-edit-' + ck);
    var view   = document.getElementById('dr-cl-view-' + ck);
    var opening = drawer.style.display === 'none';
    drawer.style.display = opening ? 'block' : 'none';
    view.style.display   = opening ? 'none'  : 'block';
  });

  content.querySelectorAll('.dr-oblig-trigger').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var oi   = btn.dataset.oi;
      var body = document.getElementById('dr-oblig-body-' + oi + '-' + ck);
      var arr  = btn.querySelector('.dr-oblig-arr');
      if (!body) return;
      var open = body.classList.contains('open');
      body.classList.toggle('open', !open);
      if (arr) arr.textContent = open ? '▶' : '▼';
    });
  });
};

/* REMOVED NEW FUNCTIONS START — delete through _drBindMsDropdowns */
function _drBuildClauseAccordion_DELETED(cl, ci, cli, circId, ck) {
  var riskCls = cl.risk ? 'dr-wc-risk-' + (cl.risk||'').toLowerCase() : '';
  var depts   = Array.isArray(cl.departments) ? cl.departments : (cl.department ? [cl.department] : []);
  var hasSubs = cl.subClauses && cl.subClauses.length > 0;
  var obligs  = Array.isArray(cl.obligations) ? cl.obligations : (cl.obligation ? [cl.obligation] : []);
  var actions = Array.isArray(cl.actionables) ? cl.actionables : ((cl.actionable||'').split(';').map(function(a){return a.trim();}).filter(Boolean));
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit'];

  /* Multi-select dept chips */
  var deptPickerHtml =
    '<div class="dr-ms-wrap" id="dr-ms-' + ck + '">' +
      '<div class="dr-ms-selected" id="dr-ms-sel-' + ck + '">' +
        (depts.length
          ? depts.map(function(d){return '<span class="dr-ms-chip">' + d + '<button onclick="event.stopPropagation();_drMsRemove(\'' + ck + '\',\'' + d + '\')">&#xD7;</button></span>';}).join('')
          : '<span class="dr-ms-placeholder">Select departments\u2026</span>'
        ) +
      '</div>' +
      '<div class="dr-ms-dropdown" id="dr-ms-drop-' + ck + '">' +
        allDepts.map(function(d){
          var sel = depts.indexOf(d) >= 0;
          return '<label class="dr-ms-opt"><input type="checkbox" value="' + d + '"' + (sel?' checked':'') + ' onchange="_drMsChange(\'' + ck + '\')">' + d + '</label>';
        }).join('') +
      '</div>' +
    '</div>';

  /* Status badge */
  var statusOpts = ['Reviewed & Applicable','Assigned'];
  var currentStatus = (cl.status === 'Open' || cl.status === 'In Progress') ? 'Reviewed & Applicable' : 'Assigned';
  var statusHtml =
    '<select class="dr-ctrl-select dr-status-sel" onchange="">' +
      statusOpts.map(function(s){return '<option'+(s===currentStatus?' selected':'')+'>'+s+'</option>';}).join('') +
    '</select>';

  /* Sub-clause table */
  var subClauseTable = '';
  if (hasSubs) {
    subClauseTable =
      '<div class="dr-subcl-table-wrap">' +
        '<div class="dr-subcl-table-title">Sub-clauses</div>' +
        '<table class="dr-subcl-table">' +
          '<thead><tr>' +
            '<th>Clause ID</th>' +
            '<th>Obligations</th>' +
            '<th>Actions</th>' +
            '<th>Departments</th>' +
            '<th>Status</th>' +
          '</tr></thead>' +
          '<tbody>' +
            cl.subClauses.map(function(sc, sci) {
              var scObligs  = Array.isArray(sc.obligations) ? sc.obligations : [];
              var scActions = Array.isArray(sc.actionables) ? sc.actionables : [];
              var scDepts   = Array.isArray(sc.departments) ? sc.departments : [];
              var scStatus  = (sc.status === 'Assigned') ? 'Assigned' : 'Reviewed & Applicable';
              var scStatusCls = scStatus === 'Assigned' ? 'dr-subcl-badge-assigned' : 'dr-subcl-badge-reviewed';
              return '<tr class="dr-subcl-row" data-ck="' + ck + '" data-sci="' + sci + '" onclick="_drToggleSubClause(\'' + ck + '\',' + sci + ',this)">' +
                '<td><span class="dr-cl-nav-cl-id">' + sc.id + '</span></td>' +
                '<td>' + (scObligs[0] ? scObligs[0].substring(0,40) + (scObligs[0].length>40?'\u2026':'') : '\u2014') + '</td>' +
                '<td>' + (scActions[0] ? scActions[0].substring(0,30) + (scActions[0].length>30?'\u2026':'') : '\u2014') + '</td>' +
                '<td>' + scDepts.join(', ') + '</td>' +
                '<td><span class="dr-subcl-badge ' + scStatusCls + '">' + scStatus + '</span></td>' +
              '</tr>' +
              '<tr class="dr-subcl-detail-row" id="dr-subcl-detail-' + ck + '-' + sci + '" style="display:none;">' +
                '<td colspan="5">' + _drBuildSubClauseCard(sc, ck, sci, circId) + '</td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>';
  }

  return (
    '<div class="dr-cl-accordion" id="dr-cl-acc-' + ck + '">' +
      /* Trigger row */
      '<button class="dr-cl-acc-btn" data-ck="' + ck + '">' +
        '<div class="dr-cl-acc-left">' +
          '<span class="dr-cl-nav-cl-id">' + cl.id + '</span>' +
          (cl.risk ? '<span class="dr-wc-badge ' + riskCls + '">' + cl.risk + ' Risk</span>' : '') +
          (cl.category ? '<span class="dr-wc-badge dr-wc-dept">' + cl.category + '</span>' : '') +
          (cl.status ? '<span class="dr-wc-badge dr-wc-status">' + currentStatus + '</span>' : '') +
        '</div>' +
        '<div class="dr-cl-acc-right">' +
          '<span class="dr-cl-acc-preview">' + (cl.text||'').substring(0,80) + ((cl.text||'').length>80?'\u2026':'') + '</span>' +
          '<span class="dr-cl-acc-arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>' +
        '</div>' +
      '</button>' +
      /* Body */
      '<div class="dr-cl-acc-body" id="dr-cl-acc-body-' + ck + '">' +
        /* Clause info card */
        '<div class="dr-cl-detail-card">' +
          '<div class="dr-cl-detail-top">' +
            '<div class="dr-cl-detail-id-row">' +
              '<span class="dr-ws-bc-id">' + cl.id + '</span>' +
              (cl.risk ? '<span class="dr-wc-badge ' + riskCls + '">' + cl.risk + ' Risk</span>' : '') +
              (cl.category ? '<span class="dr-wc-badge dr-wc-dept">' + cl.category + '</span>' : '') +
            '</div>' +
            '<div class="dr-cl-detail-actions">' +
              '<button class="dr-map-btn" onclick="_drOpenMapModal(\'' + (circId||'') + '\',\'' + cl.id + '\',\'' + ck + '\',\'clause\')">&#x21C4; Map Clause</button>' +
              '<button class="dr-tool-btn" onclick="var d=document.getElementById(\'dr-cl-edit2-' + ck + '\');var v=document.getElementById(\'dr-cl-view2-' + ck + '\');if(d.style.display===\'none\'){d.style.display=\'block\';v.style.display=\'none\';}else{d.style.display=\'none\';v.style.display=\'block\';}">&#x270E; Edit</button>' +
            '</div>' +
          '</div>' +
          '<div class="dr-wc-text" id="dr-cl-view2-' + ck + '">' + (cl.text||'') + '</div>' +
          /* Edit drawer */
          '<div id="dr-cl-edit2-' + ck + '" style="display:none;padding:10px 16px;">' +
            '<textarea class="dr-edit-ta" id="dr-cl-edit2-ta-' + ck + '" style="width:100%;">' + (cl.text||'') + '</textarea>' +
            '<div style="display:flex;gap:8px;margin-top:8px;">' +
              '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'dr-cl-edit2-' + ck + '\').style.display=\'none\';document.getElementById(\'dr-cl-view2-' + ck + '\').style.display=\'block\';">&#x2715; Cancel</button>' +
              '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="document.getElementById(\'dr-cl-view2-' + ck + '\').textContent=document.getElementById(\'dr-cl-edit2-ta-' + ck + '\').value;document.getElementById(\'dr-cl-edit2-' + ck + '\').style.display=\'none\';document.getElementById(\'dr-cl-view2-' + ck + '\').style.display=\'block\';showToast(\'Saved.\',\'success\');">&#x2713; Save</button>' +
            '</div>' +
          '</div>' +
          /* Controls */
          '<div class="dr-clause-controls" style="margin:10px 16px 0;">' +
            '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Dept</span>' + deptPickerHtml + '</div>' +
            '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Status</span>' + statusHtml + '</div>' +
            '<div class="dr-tags-ctrl">' +
              '<span class="dr-ctrl-label">Tags</span>' +
              '<div class="dr-tags-list" id="dr-tlist-' + ck + '">' +
                (cl.tags||[]).map(function(t){return '<span class="dr-ctag">'+t+'<button onclick="this.parentElement.remove()">&#xD7;</button></span>';}).join('') +
              '</div>' +
              '<input class="dr-tag-input" id="dr-tinput-' + ck + '" placeholder="+ tag" onkeydown="if(event.key===\'Enter\'||event.key===\',\'){_drAddTag(\'' + ck + '\');event.preventDefault();}"/>' +
              '<button class="dr-tag-add-btn" onclick="_drAddTag(\'' + ck + '\')">+</button>' +
            '</div>' +
          '</div>' +
          /* Obligations */
          '<div class="dr-ws-section" style="padding:12px 16px;">' +
            '<div class="dr-ws-section-head">' +
              '<span class="dr-ws-section-label">Obligations</span>' +
              '<button class="dr-add-sub-btn" onclick="_drAddObligation(\'' + ck + '\',\'' + (circId||'') + '\',\'' + cl.id + '\')">+ Add Obligation</button>' +
            '</div>' +
            '<div class="dr-ws-oblig-list" id="dr-oblig-wrap-' + ck + '">' +
              (obligs.length
                ? obligs.map(function(ob, oi) {
                    var obText = typeof ob === 'string' ? ob : (ob.text || '');
                    return _drBuildObligationItem(obText, actions, ck, circId, cl.id, oi, false);
                  }).join('')
                : '<div class="dr-empty-hint" id="dr-no-oblig-' + ck + '">No obligations yet — click + Add Obligation above</div>'
              ) +
            '</div>' +
          '</div>' +
        '</div>' +
        /* Sub-clause table */
        subClauseTable +
      '</div>' +
    '</div>'
  );
}

/* Build sub-clause detail card (shown when table row clicked) */
function _drBuildSubClauseCard(sc, parentCk, sci, circId) {
  var riskCls = sc.risk ? 'dr-wc-risk-' + (sc.risk||'').toLowerCase() : '';
  var depts   = Array.isArray(sc.departments) ? sc.departments : [];
  var obligs  = Array.isArray(sc.obligations) ? sc.obligations : [];
  var actions = Array.isArray(sc.actionables) ? sc.actionables : [];
  var statusOpts = ['Reviewed & Applicable','Assigned'];
  var currentStatus = sc.status === 'Assigned' ? 'Assigned' : 'Reviewed & Applicable';
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit'];
  var ck2 = parentCk + '-sc' + sci;

  var deptPickerHtml =
    '<div class="dr-ms-wrap" id="dr-ms-' + ck2 + '">' +
      '<div class="dr-ms-selected" id="dr-ms-sel-' + ck2 + '">' +
        (depts.length
          ? depts.map(function(d){return '<span class="dr-ms-chip">' + d + '<button onclick="event.stopPropagation();_drMsRemove(\'' + ck2 + '\',\'' + d + '\')">&#xD7;</button></span>';}).join('')
          : '<span class="dr-ms-placeholder">Select departments\u2026</span>'
        ) +
      '</div>' +
      '<div class="dr-ms-dropdown" id="dr-ms-drop-' + ck2 + '">' +
        allDepts.map(function(d){
          return '<label class="dr-ms-opt"><input type="checkbox" value="' + d + '"' + (depts.indexOf(d)>=0?' checked':'') + ' onchange="_drMsChange(\'' + ck2 + '\')"> ' + d + '</label>';
        }).join('') +
      '</div>' +
    '</div>';

  return (
    '<div class="dr-cl-detail-card dr-subcl-detail-card">' +
      '<div class="dr-cl-detail-top">' +
        '<div class="dr-cl-detail-id-row">' +
          '<span class="dr-ws-bc-id">' + sc.id + '</span>' +
          (sc.risk ? '<span class="dr-wc-badge ' + riskCls + '">' + sc.risk + ' Risk</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="dr-wc-text">' + (sc.text||'') + '</div>' +
      '<div class="dr-clause-controls" style="margin:10px 16px 0;">' +
        '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Dept</span>' + deptPickerHtml + '</div>' +
        '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Status</span>' +
          '<select class="dr-ctrl-select dr-status-sel">' +
            statusOpts.map(function(s){return '<option'+(s===currentStatus?' selected':'')+'>'+s+'</option>';}).join('') +
          '</select>' +
        '</div>' +
      '</div>' +
      (obligs.length ? '<div class="dr-ws-section" style="padding:10px 16px;">' +
        '<div class="dr-ws-section-head"><span class="dr-ws-section-label">Obligations</span></div>' +
        '<div class="dr-ws-oblig-list">' +
          obligs.map(function(ob,oi){
            return '<div class="dr-subcl-oblig"><span class="dr-oblig-badge" style="font-size:9px;min-width:20px;height:20px;">O'+(oi+1)+'</span><span>'+ob+'</span></div>';
          }).join('') +
        '</div>' +
      '</div>' : '') +
    '</div>'
  );
}

/* Toggle sub-clause detail row */
window._drToggleSubClause = function(ck, sci, row) {
  var detailRow = document.getElementById('dr-subcl-detail-' + ck + '-' + sci);
  if (!detailRow) return;
  var isOpen = detailRow.style.display !== 'none';
  /* close all other detail rows in same clause */
  var tbody = row.closest('tbody');
  if (tbody) tbody.querySelectorAll('.dr-subcl-detail-row').forEach(function(r){ r.style.display='none'; });
  tbody && tbody.querySelectorAll('.dr-subcl-row').forEach(function(r){ r.classList.remove('dr-subcl-row-active'); });
  if (!isOpen) {
    detailRow.style.display = '';
    row.classList.add('dr-subcl-row-active');
    /* bind multi-select in sub-clause card */
    _drBindMsDropdowns(detailRow);
  }
};

/* Bind clause accordions — one open at a time */
function _drBindClauseAccordions(container, circId) {
  container.querySelectorAll('.dr-cl-acc-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var ck   = btn.dataset.ck;
      var body = document.getElementById('dr-cl-acc-body-' + ck);
      var isOpen = body && body.classList.contains('open');
      /* close all */
      container.querySelectorAll('.dr-cl-acc-body').forEach(function(b){ b.classList.remove('open'); });
      container.querySelectorAll('.dr-cl-acc-btn').forEach(function(b){ b.classList.remove('dr-cl-acc-active'); });
      if (!isOpen && body) {
        body.classList.add('open');
        btn.classList.add('dr-cl-acc-active');
        /* bind obligation accordions inside */
        body.querySelectorAll('.dr-oblig-trigger').forEach(function(t){
          if (t._drBound) return; t._drBound = true;
          t.addEventListener('click', function(){
            var oi   = t.dataset.oi;
            var obBody = document.getElementById('dr-oblig-body-' + oi + '-' + ck);
            if (!obBody) return;
            var obOpen = obBody.classList.contains('open');
            body.querySelectorAll('.dr-oblig-body.open').forEach(function(b){b.classList.remove('open');});
            body.querySelectorAll('.dr-oblig-arr').forEach(function(a){a.textContent='▶';});
            if (!obOpen) { obBody.classList.add('open'); var arr=t.querySelector('.dr-oblig-arr'); if(arr)arr.textContent='▼'; }
          });
        });
        /* bind multi-select dropdowns */
        _drBindMsDropdowns(body);
      }
    });
  });
}

/* Multi-select dept dropdown helpers */
window._drMsChange = function(ck) {
  var drop = document.getElementById('dr-ms-drop-' + ck);
  var sel  = document.getElementById('dr-ms-sel-' + ck);
  if (!drop || !sel) return;
  var checked = Array.from(drop.querySelectorAll('input:checked')).map(function(i){return i.value;});
  sel.innerHTML = checked.length
    ? checked.map(function(d){return '<span class="dr-ms-chip">'+d+'<button onclick="event.stopPropagation();_drMsRemove(\''+ck+'\',\''+d+'\')">&#xD7;</button></span>';}).join('')
    : '<span class="dr-ms-placeholder">Select departments\u2026</span>';
};
window._drMsRemove = function(ck, dept) {
  var drop = document.getElementById('dr-ms-drop-' + ck);
  if (drop) { var cb = drop.querySelector('input[value="'+dept+'"]'); if(cb) cb.checked = false; }
  window._drMsChange(ck);
};
function _drBindMsDropdowns(container) {
  container.querySelectorAll('.dr-ms-selected').forEach(function(sel) {
    if (sel._drMsBound) return; sel._drMsBound = true;
    sel.addEventListener('click', function(e) {
      e.stopPropagation();
      var wrap = sel.closest('.dr-ms-wrap');
      var drop = wrap && wrap.querySelector('.dr-ms-dropdown');
      if (!drop) return;
      var isOpen = drop.classList.contains('open');
      document.querySelectorAll('.dr-ms-dropdown.open').forEach(function(d){d.classList.remove('open');});
      if (!isOpen) drop.classList.add('open');
    });
  });
  document.addEventListener('click', function() {
    document.querySelectorAll('.dr-ms-dropdown.open').forEach(function(d){d.classList.remove('open');});
  }, {once:false, capture:false});
}

/* ── Build obligation item (NO evidence button) ── */
function _drBuildObligationItem(obligText, actionsArr, ck, circId, clauseId, oi, actionsOpen) {
  var actRows = (actionsArr||[]).map(function(a,ai){
    return '<div class="dr-action-row">' +
      '<span class="dr-action-num">'+(ai+1)+'</span>' +
      '<span class="dr-action-txt dr-editable" contenteditable="true">'+a+'</span>' +
      '<button class="dr-row-del" onclick="this.closest(\'.dr-action-row\').remove()">&#x2715;</button>' +
    '</div>';
  }).join('');

  return (
    '<div class="dr-oblig-item" id="dr-oblig-' + oi + '-' + ck + '">' +
      '<button class="dr-oblig-trigger" data-oi="' + oi + '">' +
        '<div class="dr-oblig-trigger-left">' +
          '<span class="dr-oblig-badge">O' + (oi+1) + '</span>' +
          '<span class="dr-oblig-preview">' + obligText + '</span>' +
        '</div>' +
        '<span class="dr-oblig-arr">▶</span>' +
      '</button>' +
      '<div class="dr-oblig-body" id="dr-oblig-body-' + oi + '-' + ck + '">' +
        '<div class="dr-oblig-text-full dr-editable" contenteditable="true">' + obligText + '</div>' +
        '<div class="dr-oblig-controls">' +
          '<div class="dr-oblig-tags-row">' +
            '<span class="dr-ctrl-label" style="white-space:nowrap;">Tags</span>' +
            '<div class="dr-tags-list" id="dr-ob-tlist-' + oi + '-' + ck + '"></div>' +
            '<input class="dr-tag-input" id="dr-ob-tinput-' + oi + '-' + ck + '" placeholder="+ tag" ' +
              'onkeydown="if(event.key===\'Enter\'||event.key===\',\'){_drAddObligTag(\'' + oi + '\',\'' + ck + '\');event.preventDefault();}"/>' +
            '<button class="dr-tag-add-btn" onclick="_drAddObligTag(\'' + oi + '\',\'' + ck + '\')">+</button>' +
          '</div>' +
          '<div class="dr-oblig-actions-row">' +
            '<button class="dr-map-btn" onclick="_drOpenClauseMapModal(\'' + (circId||'') + '\',\'' + clauseId + '\',\'' + ck + '\',\'' + oi + '\')">&#x21C4; Map to Clause</button>' +
            '<button class="dr-row-del dr-oblig-del" onclick="this.closest(\'.dr-oblig-item\').remove()">&#x2715; Remove</button>' +
          '</div>' +
        '</div>' +
        '<div class="dr-actions-wrap">' +
          '<div class="dr-nb-label-row">' +
            '<span class="dr-nb-label">Actions <span class="dr-actions-count">' + (actionsArr||[]).length + '</span></span>' +
            '<button class="dr-add-sub-btn" onclick="_drAddAction(\'' + oi + '\',\'' + ck + '\')">+ Action</button>' +
          '</div>' +
          '<div class="dr-actions-list" id="dr-alist-' + oi + '-' + ck + '">' + actRows + '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

window._drSaveClauseEdit = function(ck) {
  var textEl = document.getElementById('dr-cl-edit-text-' + ck);
  var oblEl  = document.getElementById('dr-cl-edit-obl-' + ck);
  var viewEl = document.getElementById('dr-cl-view-' + ck);
  if (textEl) {
    var clauseTxt = document.getElementById('dr-cl-txt-' + ck);
    if (clauseTxt) clauseTxt.textContent = textEl.value;
  }
  if (oblEl && viewEl) {
    var oblPrev = viewEl.querySelector('.dr-oblig-preview');
    if (oblPrev) oblPrev.textContent = oblEl.value;
    var oblFull = viewEl.querySelector('.dr-oblig-text-full');
    if (oblFull) oblFull.textContent = oblEl.value;
  }
  var editEl = document.getElementById('dr-cl-edit-' + ck);
  if (editEl) editEl.style.display = 'none';
  if (viewEl) viewEl.style.display = 'block';
  showToast('Clause saved.', 'success');
};

window._drBackToStack = function() {
  /* no-op — kept for any stray references; new design doesn't use a back button */
};

window._drAddObligTag = function(oi, ck) {
  var input = document.getElementById('dr-ob-tinput-' + oi + '-' + ck);
  var list  = document.getElementById('dr-ob-tlist-'  + oi + '-' + ck);
  if (!input || !list) return;
  var val = input.value.trim().replace(/,/g,'');
  if (!val) return;
  var span = document.createElement('span');
  span.className = 'dr-ctag';
  span.innerHTML = val + '<button onclick="this.parentElement.remove()">&#xD7;</button>';
  list.appendChild(span);
  input.value = '';
};

/* ================================================================ MAP MODALS */
window._drOpenClauseMapModal = function(circId, clauseId, ck, oi) {
  var allRows = [];
  (CMS_DATA && CMS_DATA.circulars || []).forEach(function(c) {
    (c.chapters||[]).forEach(function(ch){
      (ch.clauses||[]).forEach(function(cl){
        allRows.push({ circId:c.id, circTitle:c.title, chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'' });
      });
    });
  });
  Object.keys(window._savedFlow||{}).forEach(function(cid){
    (window._savedFlow[cid].clauses||[]).forEach(function(ch){
      (ch.clauses||[]).forEach(function(cl){
        if (!allRows.find(function(r){return r.circId===cid&&r.clauseId===cl.id;})) {
          allRows.push({ circId:cid, circTitle:'(Draft) '+cid, chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'' });
        }
      });
    });
  });
  var mapKey  = circId + ':' + clauseId + ':ob:' + oi;
  var existing = window._mappedObligs[mapKey] || [];
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'dr-clause-map-modal';
  var rowsHtml = allRows.map(function(r,i){
    var already  = existing.some(function(e){return e.clauseId===r.clauseId&&e.circId===r.circId;});
    var rowData  = JSON.stringify({circId:r.circId,clauseId:r.clauseId,clauseText:r.clauseText}).replace(/"/g,'&quot;');
    return '<tr class="dr-map-row' + (already?' dr-map-row-mapped':'') + '" data-search="'+r.circId+' '+r.clauseId+' '+r.clauseText.substring(0,60)+' '+r.circTitle+'">' +
      '<td><button class="dr-map-row-btn'+(already?' mapped':'')+'" data-row="'+rowData+'" data-mapkey="'+mapKey+'" data-ck="'+ck+'">' + (already?'&#x2713; Mapped':'Map') + '</button></td>' +
      '<td><span class="dr-map-cid">'+r.clauseId+'</span></td>' +
      '<td><div class="dr-map-circ-id">'+r.circId+'</div><div class="dr-map-circ-title">'+r.circTitle.substring(0,36)+(r.circTitle.length>36?'…':'')+'</div></td>' +
      '<td class="dr-map-ch">'+r.chTitle.substring(0,28)+(r.chTitle.length>28?'…':'')+'</td>' +
      '<td class="dr-map-text">'+r.clauseText.substring(0,80)+(r.clauseText.length>80?'…':'')+'</td>' +
    '</tr>';
  }).join('');
  overlay.innerHTML =
    '<div class="dr-modal">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Map Obligation to Clause</div><div class="dr-modal-subject">Obligation ' + (parseInt(oi)+1) + ' of Clause ' + clauseId + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'dr-clause-map-modal\').remove()">&#x2715;</button></div>' +
      (existing.length ? '<div class="dr-modal-mapped-bar"><span class="dr-modal-mapped-label">Currently mapped ('+existing.length+')</span>' + existing.map(function(m){return '<span class="dr-mapped-chip dr-mapped-chip-sm">'+m.circId+' · '+m.clauseId+'</span>';}).join('') + '</div>' : '') +
      '<div class="dr-modal-search-bar"><input class="dr-modal-search" id="dr-cmap-search" placeholder="Search by clause ID, text, circular\u2026" autocomplete="off"/></div>' +
      '<div class="dr-modal-body"><table class="dr-map-table"><thead><tr><th></th><th>Clause</th><th>Circular</th><th>Chapter</th><th>Text</th></tr></thead><tbody id="dr-cmap-tbody">' + rowsHtml + '</tbody></table></div>' +
      '<div class="dr-modal-foot"><span class="dr-modal-foot-note">Map this obligation to related clauses across circulars</span><button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'dr-clause-map-modal\').remove();showToast(\'Obligation mapped.\',\'success\')">Done</button></div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
  document.getElementById('dr-cmap-search').addEventListener('input', function(){
    var q = this.value.toLowerCase();
    overlay.querySelectorAll('.dr-map-row').forEach(function(row){ row.style.display = row.dataset.search.toLowerCase().includes(q) ? '' : 'none'; });
  });
  overlay.querySelectorAll('.dr-map-row-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var mk=btn.dataset.mapkey, bck=btn.dataset.ck;
      window._mappedObligs[mk]=window._mappedObligs[mk]||[];
      var rowData; try{rowData=JSON.parse(btn.dataset.row.replace(/&quot;/g,'"'));}catch(e){return;}
      var idx=window._mappedObligs[mk].findIndex(function(x){return x.clauseId===rowData.clauseId&&x.circId===rowData.circId;});
      if(idx>=0){window._mappedObligs[mk].splice(idx,1);btn.innerHTML='Map';btn.classList.remove('mapped');btn.closest('tr').classList.remove('dr-map-row-mapped');}
      else{window._mappedObligs[mk].push(rowData)
        // Auto-assign same person to mapped action
if (item.assignedTo && window._mlActionItems) {
  window._mlActionItems.forEach(function(a) {
    if (a.action === item.action && !a.assignedTo) {
      a.assignedTo = item.assignedTo;
    }
  });
};btn.innerHTML='&#x2713; Mapped';btn.classList.add('mapped');btn.closest('tr').classList.add('dr-map-row-mapped');}
    });
  });
};

window._mlOpenInlineDeptPicker = function(cell, idx) { /* multi-select search dropdown anchored to cell */ };
window._mlOpenInlineAssigneePicker = function(cell, idx) { /* search+select dropdown */ };
window._mlOpenInlineStatusPicker = function(cell, idx) { /* Assigned / Unassigned dropdown */ };
