
/* ================================================================
   clause-panel-v4.js  —  Clause Breakdown Panel (v4)
   CHANGES vs v3:
   - LEFT NAV: Collapses when user clicks right panel (workspace)
   - LEFT NAV: Collapsible toggle button on nav head
   - RIGHT header: "Chapter 2" badge + title + total clauses COUNT in ONE aligned row
   - RIGHT header: Filter chips REMOVED (commented out)
   - CLAUSE ROW: White background, clause ID + title text (no badges inline),
                 right side shows obligation/action counts only
   - EXPAND: When expanded → row shows dept badge, risk badge, ⓘ icon, blue ✦ icon in same tab row
   - EXPAND: Only 2 tabs now: "Text & Info" | "Obligations" (Actions tab removed)
   - EXPAND: Footer "Regen with AI Context" removed from Text panel
   - OBLIGATIONS: Header row = number + title text + pen + search + ✦ + expand icon ONLY (one row)
   - OBLIGATIONS: Dept/page chip badges removed from obligation header
   - OBLIGATIONS: When expanded, meta strip shows, but does NOT repeat obl text below meta
   - OBLIGATIONS: "Regen with AI Context" button REMOVED from obl body (was in btn-row)
   - OBLIGATIONS: Actions still shown inside obligation body (unchanged)
   All modals (AI Context, Evidence, Relationship FAB) unchanged from v3
   ================================================================ */

/* ─────────────────────────────────────── BUILD */
function buildClausePanel() {
  injectSharedCSS();
  injectClauseCSS();
  _clInjectRelFAB();
  return `
  <div class="cl-wrap">
    <div id="cl-empty" class="cl-empty-state" style="display:none;">
      <div class="cl-empty-icon">📄</div>
      <div class="cl-empty-title">No Circular Selected</div>
      <div class="cl-empty-sub">Go to Overview and confirm a circular first.</div>
      <button class="cl-empty-cta" onclick="document.querySelector('[data-tab=\\'overview\\']')?.click()">← Go to Overview</button>
    </div>
    <div id="cl-main" style="display:none;">
     <div class="cl-filter-card">

        <!-- ROW 1: Circular selector + Generate -->
        <div class="cl-fc-row1">
          <button class="cl-back-btn" id="cl-back-btn">← Overview</button>

          <div class="cl-fc-field cl-fc-field-circ">
            <span class="cl-fc-label">Circular</span>
            <div class="cl-circ-sel-wrap" id="cl-circ-switcher-wrap" style="display:flex;">
              <button class="cl-circ-sel-btn" id="cl-circ-edit-btn">
                <span class="cl-circ-id-chip" id="cl-circ-id-chip">—</span>
                <span class="cl-circ-name-chip" id="cl-circ-name-chip">—</span>
                <span class="cl-csel-arr">▾</span>
              </button>
              <div class="cl-sw-dropdown" id="cl-sw-dropdown" style="display:none;">
                <div class="cl-sw-search-wrap">
                  <span class="cl-sw-icon">⌕</span>
                  <input class="cl-sw-input" id="cl-sw-input" type="text" placeholder="Search circulars…" autocomplete="off"/>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-left:auto;display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <div class="cl-level-toggle">
              <button class="cl-lvl-btn active" data-level="2">L2</button>
              <button class="cl-lvl-btn" data-level="3">L3</button>
            </div>
            <label style="display:inline-flex;align-items:center;gap:6px;padding:7px 13px;background:#fff;border:1.5px solid #e5e7eb;border-radius:6px;font-size:11px;font-weight:700;color:#6b7280;cursor:pointer;white-space:nowrap;" title="Bulk upload Excel">
              📊 Import Excel
              <input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast('Excel uploaded. Processing…','success')"/>
            </label>
            <button class="cl-topbar-btn cl-btn-generate" id="cl-btn-generate">◈ Generate</button>
          </div>
        </div>

        <!-- ROW 2: Filters -->
        <div class="cl-fc-row2">
          <div class="cl-fc-field">
            <span class="cl-fc-label">Status</span>
            <select class="cl-fc-sel" id="cl-adv-status" onchange="_clApplyAdvFilters()">
              <option value="">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div class="cl-fc-field">
            <span class="cl-fc-label">Frequency</span>
            <select class="cl-fc-sel" id="cl-adv-freq" onchange="_clApplyAdvFilters()">
              <option value="">All Frequency</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Annual">Annual</option>
              <option value="Ongoing">Ongoing</option>
              <option value="One-time">One-time</option>
            </select>
          </div>
          <div class="cl-fc-field">
            <span class="cl-fc-label">From Date</span>
            <input class="cl-fc-date" type="date" id="cl-adv-from" onchange="_clApplyAdvFilters()"/>
          </div>
          <div class="cl-fc-field">
            <span class="cl-fc-label">To Date</span>
            <input class="cl-fc-date" type="date" id="cl-adv-to" onchange="_clApplyAdvFilters()"/>
          </div>
          <div class="cl-fc-field cl-fc-field-search">
            <span class="cl-fc-label">Search</span>
            <input class="cl-fc-search-inp" id="cl-adv-search" placeholder="Search clauses, obligations…" oninput="_clApplyAdvFilters()"/>
          </div>
          <button class="cl-fc-clear-btn" onclick="_clClearAdvFilters()">✕ Clear</button>
        </div>

      </div>

      <div class="cl-split" id="cl-split" style="display:none;">
        <!-- LEFT NAV -->
        <div class="cl-nav" id="cl-nav">
          <div class="cl-nav-head">
            <span class="cl-nav-title">Structure</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="cl-nav-count" id="cl-nav-count">—</span>
              <div style="position:relative;" id="cl-nav-dots-wrap">
                <button onclick="event.stopPropagation();document.getElementById('cl-nav-dots-wrap').classList.toggle('open')" style="width:20px;height:20px;border-radius:4px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:#6b7280;font-weight:700;line-height:1;" title="Structure options">⋮</button>
                <div id="cl-nav-dots-menu" style="display:none;position:absolute;right:0;top:calc(100% + 4px);background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);min-width:170px;z-index:600;overflow:hidden;">
                  <div style="padding:4px 10px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">Add</div>
                  <button onclick="document.getElementById('cl-nav-dots-wrap').classList.remove('open');_clOpenStructureAdd('chapter')" style="display:block;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;">📖 Add Chapter</button>
                  <button onclick="document.getElementById('cl-nav-dots-wrap').classList.remove('open');_clOpenStructureAdd('section')" style="display:block;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;">§ Add Section</button>
                  <button onclick="document.getElementById('cl-nav-dots-wrap').classList.remove('open');_clOpenStructureAdd('subsection')" style="display:block;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;">¶ Add Subsection</button>
                  <div style="border-top:1px solid #f3f4f6;margin:4px 0;"></div>
                  <div style="padding:4px 10px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">Edit</div>
                  <button onclick="document.getElementById('cl-nav-dots-wrap').classList.remove('open');_clRenameActiveChapter()" style="display:block;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;">✎ Rename Chapter</button>
                </div>
              </div>
              <button class="cl-nav-collapse-btn" id="cl-nav-collapse-btn" onclick="clNavCollapse()" title="Collapse panel">‹</button>
            </div>
          </div>
          <div class="cl-nav-tree" id="cl-nav-tree">
            <div class="cl-nav-placeholder">Generate to view structure</div>
          </div>
        </div>

        <!-- RIGHT WORKSPACE -->
        <div class="cl-workspace" id="cl-workspace">
          <!-- Collapsed nav restore button -->
          <button class="cl-nav-expand-btn" id="cl-nav-expand-btn" onclick="clNavExpand()" title="Show structure" style="display:none;">››</button>
          <div class="cl-ws-placeholder" id="cl-ws-ph">
            <div class="cl-ws-ph-icon">📋</div>
            <div class="cl-ws-ph-title">Select a section</div>
            <div class="cl-ws-ph-sub">Click any section in the left panel to see its clauses</div>
          </div>
          <div id="cl-ws-main" style="display:none; padding:10px 24px;"></div>
        </div>
      </div>

      <div class="cl-footer" id="cl-footer" style="display:none;">
        <button class="cl-foot-save" id="cl-foot-save">🔖 &nbsp;Save Obligations</button>
      </div>
    </div>
  </div>`;
}

/* ─────────────────────────────────────── INIT */
function initClauseListeners() {
  injectSharedCSS();
  injectClauseCSS();
  _clInjectRelFAB();

  const circId = AI_LIFECYCLE_STATE.selectedCircularId;
  const circ = circId ? (CMS_DATA?.circulars || []).find(x => x.id === circId) : null;

  if (!circ) {
    document.getElementById('cl-empty').style.display = 'flex';
    document.getElementById('cl-main').style.display = 'none';
    return;
  }
  document.getElementById('cl-empty').style.display = 'none';
  document.getElementById('cl-main').style.display = 'block';
  document.getElementById('cl-circ-id-chip').textContent = circ.id;
  document.getElementById('cl-circ-name-chip').textContent = circ.title;
  window._CL_ACTIVE_CIRC = circ;
  window._CL_ACTIVE_SECTION_CLAUSES = [];
  window._CL_ACTIVE_LABELS = {};

  document.querySelectorAll('.cl-lvl-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.cl-lvl-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      /* Close any open expand so it re-renders fresh on next click */
      window._CL_ACTIVE_EXPANDED_CLAUSE = null;
      if (window._CL_ACTIVE_SECTION_CLAUSES?.length)
        _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
    });
  });

  /* Clicking the workspace collapses the nav */
  const ws = document.getElementById('cl-workspace');
  if (ws) {
    ws.addEventListener('click', function (e) {
      /* Only collapse if nav is open and the click is NOT on the expand button */
      const nav = document.getElementById('cl-nav');
      if (nav && !nav.classList.contains('cl-nav-collapsed') && !e.target.closest('#cl-nav-expand-btn')) {
        clNavCollapse();
      }
    }, { capture: false });
  }

/* circular switcher removed from topbar */
/* ── CIRCULAR SWITCHER (pen button) ── */
  const circEditBtn   = document.getElementById('cl-circ-edit-btn');
  const switcherWrap  = document.getElementById('cl-circ-switcher-wrap');
  const swInput       = document.getElementById('cl-sw-input');
  const swDropdown    = document.getElementById('cl-sw-dropdown');

  circEditBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = switcherWrap.style.display !== 'none';
    switcherWrap.style.display = open ? 'none' : 'flex';
    if (!open) setTimeout(() => swInput?.focus(), 50);
  });

  swInput?.addEventListener('input', () => {
    const q = swInput.value.trim().toLowerCase();
    if (!q) { swDropdown.style.display = 'none'; return; }
    const matches = (CMS_DATA?.circulars || []).filter(c =>
      c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    ).slice(0, 7);
    if (!matches.length) { swDropdown.style.display = 'none'; return; }
    swDropdown.innerHTML = matches.map(c => `
      <div class="cl-sw-dd-item" data-id="${c.id}">
        <div class="cl-sw-dd-id">${c.id}</div>
        <div class="cl-sw-dd-title">${c.title}</div>
      </div>`).join('');
    swDropdown.style.display = 'block';
    swDropdown.querySelectorAll('.cl-sw-dd-item').forEach(item => {
      item.addEventListener('click', () => {
        const newCirc = (CMS_DATA?.circulars || []).find(c => c.id === item.dataset.id);
        if (!newCirc) return;
        window._CL_ACTIVE_CIRC = newCirc;
        AI_LIFECYCLE_STATE.selectedCircularId = newCirc.id;
        document.getElementById('cl-circ-id-chip').textContent   = newCirc.id;
        document.getElementById('cl-circ-name-chip').textContent = newCirc.title;
        switcherWrap.style.display = 'none';
        swInput.value = '';
        swDropdown.style.display = 'none';
        _clRunGenerate(newCirc);
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!switcherWrap?.contains(e.target) && e.target !== circEditBtn) {
      if (switcherWrap) switcherWrap.style.display = 'none';
      if (swDropdown)   swDropdown.style.display   = 'none';
    }
  });

  document.getElementById('cl-btn-generate')?.addEventListener('click', () => _clRunGenerate(circ));
  document.getElementById('cl-back-btn')?.addEventListener('click', () => {
    document.querySelector('[data-tab="overview"]')?.click();
  });

  /* filters now use onchange="_clApplyAdvFilters()" inline — no separate listeners needed */
  document.getElementById('cl-foot-save')?.addEventListener('click', function () {
    this.textContent = '✓ Saved'; this.disabled = true; showToast('Saved to library.', 'success');
  });
}

/* ─────────────────────────────────────── NAV COLLAPSE / EXPAND */
window.clNavCollapse = function () {
  const nav = document.getElementById('cl-nav');
  const expandBtn = document.getElementById('cl-nav-expand-btn');
  const split = document.getElementById('cl-split');
  if (!nav) return;
  nav.classList.add('cl-nav-collapsed');
  if (expandBtn) expandBtn.style.display = 'flex';
  if (split) split.style.gridTemplateColumns = '0px 1fr';
};

window.clNavExpand = function () {
  const nav = document.getElementById('cl-nav');
  const expandBtn = document.getElementById('cl-nav-expand-btn');
  const split = document.getElementById('cl-split');
  if (!nav) return;
  nav.classList.remove('cl-nav-collapsed');
  if (expandBtn) expandBtn.style.display = 'none';
  if (split) split.style.gridTemplateColumns = '248px 1fr';
};

/* wire nav dots menu */
document.addEventListener('click', (e) => {
  const w = document.getElementById('cl-nav-dots-wrap');
  const m = document.getElementById('cl-nav-dots-menu');
  if (!w || !m) return;

  /* do not close when clicking inside the dots menu */
  if (w.contains(e.target)) return;

  w.classList.remove('open');
  m.style.display = 'none';
});
(function _clNavDotsObserver() {
  const interval = setInterval(() => {
    const wrap = document.getElementById('cl-nav-dots-wrap');
    const menu = document.getElementById('cl-nav-dots-menu');
    if (wrap && menu) {
      clearInterval(interval);
      new MutationObserver(() => {
        menu.style.display = wrap.classList.contains('open') ? 'block' : 'none';
      }).observe(wrap, {attributes:true, attributeFilter:['class']});
    }
  }, 200);
})();

window._clRenameActiveChapter = function() {
  var ex = document.getElementById('cl-rename-ch-modal'); if(ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-rename-ch-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:420px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-head-title">Rename Chapter / Section</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-rename-ch-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:16px;display:flex;flex-direction:column;gap:10px;">
      <label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;">New Name</label>
      <input id="cl-rename-ch-input" type="text" placeholder="Enter new chapter name…" style="padding:9px 10px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:13px;width:100%;outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#e5e7eb'"/>
    </div>
    <div class="cl-eye-foot">
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-rename-ch-modal').remove()">Cancel</button>
      <button class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;" onclick="var v=document.getElementById('cl-rename-ch-input')?.value?.trim();if(v){showToast('Chapter renamed to: '+v,'success');document.getElementById('cl-rename-ch-modal').remove();}else{showToast('Name required','error');}">Rename</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  setTimeout(() => document.getElementById('cl-rename-ch-input')?.focus(), 50);
};

/* ─────────────────────────────────────── GENERATE */
function _clRunGenerate(circ) {
  document.getElementById('cl-nav-tree').innerHTML =
    `<div class="cl-nav-loading">${loadingHTML('Building structure…')}</div>`;
  _clResetWorkspace();
  setTimeout(() => {
    document.getElementById('cl-split').style.display = 'grid';
    _clBuildTree(circ);
    /* auto-collapse nav if circular has no chapters (flat/notification type) */
      /* auto-collapse nav for flat circulars and load right workspace */
    const hasChapters = !!(circ.chapters?.length || circ.annexures?.length);
    const isCircularType = (circ.type || '').toLowerCase() === 'circular';

    if (!hasChapters || isCircularType) {
      clNavCollapse();

      let allClauses = [];

      /* flat clauses */
      if (Array.isArray(circ.clauses) && circ.clauses.length) {
        allClauses = circ.clauses.slice();
      }

      /* chapter-based clauses */
      if (!allClauses.length && Array.isArray(circ.chapters)) {
        circ.chapters.forEach(ch => {
          (ch.clauses || []).forEach(cl => allClauses.push(cl));
        });
      }

      /* annexure-based clauses */
      if (!allClauses.length && Array.isArray(circ.annexures)) {
        circ.annexures.forEach(an => {
          (an.clauses || []).forEach(cl => allClauses.push(cl));
        });
      }

      if (allClauses.length) {
        window._CL_ACTIVE_SECTION_CLAUSES = allClauses;
        window._CL_ACTIVE_LABELS = {
          chLabel: '',
          secLabel: 'All Obligations',
          chTitle: circ.title
        };
        _clRenderStack(allClauses, window._CL_ACTIVE_LABELS);
        _clRestoreFilters();
      }
    }
    const f = document.getElementById('cl-footer');
    f.style.display = 'flex'; f.style.opacity = '0'; f.style.transition = 'opacity .3s';
    requestAnimationFrame(() => requestAnimationFrame(() => { f.style.opacity = '1'; }));
  }, 1200);
}

function _clResetWorkspace() {
  document.getElementById('cl-ws-ph').style.display = 'flex';
  const m = document.getElementById('cl-ws-main');
  m.style.display = 'none'; m.innerHTML = '';
  window._CL_ACTIVE_SECTION_CLAUSES = [];
  window._CL_ACTIVE_EXPANDED_CLAUSE = null;
}

/* ─────────────────────────────────────── LEFT NAV TREE */
function _clBuildTree(circ) {
  const navTree = document.getElementById('cl-nav-tree');
  const navCount = document.getElementById('cl-nav-count');

  let total = 0;
  (circ.chapters || []).forEach(ch => { total += (ch.clauses || []).length; });
  (circ.annexures || []).forEach(an => { total += (an.clauses || []).length; });
  if (!circ.chapters?.length && !circ.annexures?.length)
    total = (circ.clauses || []).length;
  if (navCount) navCount.textContent = `${total} obligations`;

  let html = '';

  /* — Chapters — */
  if (circ.chapters?.length) {
    circ.chapters.forEach((ch, ci) => {
      const hasChapterStructure = circ.type !== 'notification' && circ.type !== 'circular_plain' && circ.chapters?.some(c => c.sections?.length > 0);
      const chLabel = hasChapterStructure ? `Chapter ${ci + 1}` : `Title ${ci + 1}`;
      let inner = '';
      if (ch.sections?.length) {
        ch.sections.forEach((sec, si) => {
          const secClauses = (sec.clauses || [])
            .map(id => (ch.clauses || []).find(c => c.id === id))
            .filter(Boolean);
          const secId = sec.id || '';
          const secTitle = sec.text || 'Section';
          const secLabel = `${secId ? secId + ' – ' : ''}${secTitle.substring(0, 34)}${secTitle.length > 34 ? '…' : ''}`;
          inner += `
          <div class="cl-nav-sec-group">
            <button class="cl-nav-sec-btn cl-nav-sec-btn-titled" data-key="${ci}-${si}"
              onclick="clNavSelect(event,${ci},${si},'${chLabel}','${secLabel.replace(/'/g, "\\'")}','${(ch.title || '').replace(/'/g, "\\'")}')">
              <div class="cl-nav-sec-info">
                <div class="cl-nav-sec-top-row">
                  <span class="cl-nav-sec-num">${secId || '§'}</span>
                  <span class="cl-nav-sec-count">${secClauses.length}</span>
                </div>
                <span class="cl-nav-sec-title-label">${secTitle.substring(0, 48)}${secTitle.length > 48 ? '…' : ''}</span>
              </div>
            </button>
          </div>`;
        });
      } else {
        inner = `<button class="cl-nav-all-btn"
          onclick="clNavSelectChapter(event,${ci},'${chLabel}','${(ch.title || '').replace(/'/g, "\\'")}')">
          View all obligations →
        </button>`;
      }
      const chClauses = ch.clauses || [];
      const chAccepted = chClauses.filter(c => (window._CL_CLAUSE_STATUS?.[c.id] || '') === 'Accepted').length;
      const chReview = chClauses.filter(c => (window._CL_CLAUSE_STATUS?.[c.id] || '') === 'Under Review').length;
      const chRejected = chClauses.filter(c => (window._CL_CLAUSE_STATUS?.[c.id] || '') === 'Rejected').length;
      html += `
      <div class="cl-nav-chapter">
        <button class="cl-nav-ch-btn" onclick="clNavToggleCh(this,'cl-ch-body-${ci}','cl-ch-arr-${ci}')">
          <span class="cl-nav-ch-arrow" id="cl-ch-arr-${ci}">▶</span>
          <div class="cl-nav-ch-info">
            <span class="cl-nav-ch-num">${chLabel}</span>
            <span class="cl-nav-ch-label">${ch.title || ''}</span>
          </div>
          <div class="cl-nav-ch-right">
            <span class="cl-nav-ch-count">${chClauses.length}</span>
            <div class="cl-nav-ch-badges">
              ${chAccepted ? `<span class="cl-nav-stat-badge cl-nav-stat-acc" title="Accepted">${chAccepted}✓</span>` : ''}
              ${chReview ? `<span class="cl-nav-stat-badge cl-nav-stat-rev" title="Under Review">${chReview}⟳</span>` : ''}
              ${chRejected ? `<span class="cl-nav-stat-badge cl-nav-stat-rej" title="Rejected">${chRejected}✗</span>` : ''}
            </div>
          </div>
        </button>
        <div class="cl-nav-ch-body" id="cl-ch-body-${ci}">${inner}</div>
      </div>`;
    });
  }

  /* — Annexures — */
  if (circ.annexures?.length) {
    html += `<div class="cl-nav-group-head">Annexures</div>`;
    circ.annexures.forEach((an, ai) => {
      const lbl = `${an.id || ''} – ${(an.title || 'Annexure').substring(0, 28)}`;
      html += `
      <div class="cl-nav-sec-group">
        <button class="cl-nav-sec-btn" data-ann="${ai}"
          onclick="clNavSelectAnn(event,${ai},'${lbl.replace(/'/g, "\\'")}')">
          <span class="cl-nav-sec-icon cl-nav-ann-icon">A</span>
          <span class="cl-nav-sec-label">${lbl}</span>
          <span class="cl-nav-sec-count">${(an.clauses || []).length}</span>
          <span class="cl-nav-sec-arrow">›</span>
        </button>
      </div>`;
    });
  }

  /* — Flat clauses (no chapters/annexures) — */
  if (!circ.chapters?.length && !circ.annexures?.length && circ.clauses?.length) {
    html += `<div class="cl-nav-group-head">Clauses</div>`;
    circ.clauses.forEach((cl) => {
      html += `
      <button class="cl-nav-sec-btn cl-nav-flat-btn"
        onclick="clNavSelectFlat(event,'${cl.id}')">
        <span class="cl-nav-sec-icon" style="font-family:monospace;">${cl.id}</span>
        <span class="cl-nav-sec-label">${(cl.text || '').substring(0, 32)}${(cl.text || '').length > 32 ? '…' : ''}</span>
      </button>`;
    });
  }

  navTree.innerHTML = html || '<div class="cl-nav-placeholder">No structure found.</div>';
}

/* Nav collapse/expand — immediate */
window.clNavToggleCh = function (btn, bodyId, arrId) {
  const body = document.getElementById(bodyId);
  const arr = document.getElementById(arrId);
  if (!body) return;
  const open = body.classList.toggle('open');
  if (arr) arr.textContent = open ? '▼' : '▶';
};

window.clNavSelect = function (e, chIdx, secIdx, chLabel, secLabel, chTitle) {
  e.stopPropagation();
  _clSetNavActive(e.currentTarget);
  const circ = window._CL_ACTIVE_CIRC;
  const ch = circ?.chapters?.[chIdx];
  if (!ch) return;
  const sec = ch.sections?.[secIdx];
  const clauses = (sec?.clauses || [])
    .map(id => (ch.clauses || []).find(c => c.id === id))
    .filter(Boolean);
  window._CL_ACTIVE_SECTION_CLAUSES = clauses;
  window._CL_ACTIVE_LABELS = { chLabel, secLabel, chTitle };
  _clRenderStack(clauses, { chLabel, secLabel, chTitle });
  _clRestoreFilters();
};

window.clNavSelectChapter = function (e, chIdx, chLabel, chTitle) {
  e.stopPropagation();
  _clSetNavActive(e.currentTarget);
  const circ = window._CL_ACTIVE_CIRC;
  const ch = circ?.chapters?.[chIdx];
  if (!ch) return;
  window._CL_ACTIVE_SECTION_CLAUSES = ch.clauses || [];
  window._CL_ACTIVE_LABELS = { chLabel, secLabel: 'All Clauses', chTitle };
  _clRenderStack(ch.clauses || [], { chLabel, secLabel: 'All Clauses', chTitle });
};

window.clNavSelectAnn = function (e, annIdx, lbl) {
  e.stopPropagation();
  _clSetNavActive(e.currentTarget);
  const circ = window._CL_ACTIVE_CIRC;
  const an = circ?.annexures?.[annIdx];
  if (!an) return;
  const clauses = an.clauses || [];
  window._CL_ACTIVE_SECTION_CLAUSES = clauses;
  window._CL_ACTIVE_LABELS = { chLabel: 'Annexure', secLabel: an.title || lbl, chTitle: an.title || '' };
  _clRenderStack(clauses, { chLabel: 'Annexure', secLabel: an.title || lbl, chTitle: an.title || '' });
};

window.clNavSelectFlat = function (e, clauseId) {
  e.stopPropagation();
  _clSetNavActive(e.currentTarget);
  const circ = window._CL_ACTIVE_CIRC;
  const clauses = circ?.clauses || [];
  window._CL_ACTIVE_SECTION_CLAUSES = clauses;
  window._CL_ACTIVE_LABELS = { chLabel: 'Clauses', secLabel: '', chTitle: '' };
  _clRenderStack(clauses, { chLabel: 'Clauses', secLabel: '', chTitle: '' });
  _clRestoreFilters();
};

function _clSetNavActive(btn) {
  document.querySelectorAll('.cl-nav-sec-btn, .cl-nav-flat-btn')
    .forEach(b => b.classList.remove('cl-nav-active'));
  btn.classList.add('cl-nav-active');
}

/* ─────────────────────────────────────── RIGHT PANEL: CLAUSE STACK (L1)
   Header: [Chapter 2 badge] [Chapter title] ———————— [N clauses]  in one row
   Filter chips: REMOVED (commented out)
   Clause row: white bg, ID + title text (no inline badges), counts on right
*/
window._clApplyAdvFilters = function () {
  if (window._CL_ACTIVE_SECTION_CLAUSES?.length)
    _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
};
window._clClearAdvFilters = function () {
  ['cl-filter-dept','cl-adv-status','cl-adv-freq','cl-adv-from','cl-adv-to'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  window._CL_FILTER_STATE = {};
  _clApplyAdvFilters();
};

window._clRestoreFilters = function () {
  const s = window._CL_FILTER_STATE || {};
  if (s.dept)    { const el = document.getElementById('cl-filter-dept');  if (el) el.value = s.dept; }
  if (s.statusF) { const el = document.getElementById('cl-adv-status');   if (el) el.value = s.statusF; }
  if (s.freq)    { const el = document.getElementById('cl-adv-freq');     if (el) el.value = s.freq; }
  if (s.fromD)   { const el = document.getElementById('cl-adv-from');     if (el) el.value = s.fromD; }
  if (s.toD)     { const el = document.getElementById('cl-adv-to');       if (el) el.value = s.toD; }
};
window._clSwitchCircular = function (circId) {
  const circ = (CMS_DATA?.circulars || []).find(c => c.id === circId);
  if (!circ) return;
  window._CL_ACTIVE_CIRC = circ;
  AI_LIFECYCLE_STATE.selectedCircularId = circId;
  document.getElementById('cl-circ-id-chip').textContent = circ.id;
  document.getElementById('cl-circ-name-chip').textContent = circ.title;
  const sw = document.getElementById('cl-circ-switcher');
  if (sw) sw.value = circId;
  _clRunGenerate(circ);
};

function _clRenderStack(allClauses, labels) {
  const statusF = document.getElementById('cl-adv-status')?.value || '';
  window._CL_FILTER_STATE = { statusF };

  /* ── Flatten all clauses into obligation rows ── */
  const oblRows = [];
  allClauses.forEach(function(cl) {
    const obligsRaw = cl.obligations || cl.obligation || null;
    const obligsArr = Array.isArray(obligsRaw) ? obligsRaw
      : typeof obligsRaw === 'string' && obligsRaw ? [obligsRaw]
      : [];
    const actsRaw = cl.actionables || cl.actionable || [];
    const actsArr = Array.isArray(actsRaw) ? actsRaw
      : typeof actsRaw === 'string' ? actsRaw.split(';').map(a => a.trim()).filter(Boolean)
      : [];

    if (obligsArr.length) {
      obligsArr.forEach(function(ob, oi) {
        const obText = typeof ob === 'string' ? ob : (ob.text || ob.name || '');
        const obId   = (typeof ob === 'object' && ob.id) ? ob.id : ('OBL-' + cl.id + '-' + (oi + 1));
        const uid    = cl.id + '-' + oi;
        oblRows.push({ uid, obId, obText, actsArr, cl, oi });
      });
    } else {
      /* clause has no obligations — show clause text as the obligation */
      const uid = cl.id + '-0';
      oblRows.push({ uid, obId: 'OBL-' + cl.id, obText: cl.text || cl.id, actsArr, cl, oi: 0 });
    }
  });

  /* filter by status if set */
  const filtered = statusF
    ? oblRows.filter(r => (window._CL_OBL_STATUS?.[r.uid] || '') === statusF)
    : oblRows;

  const ws = document.getElementById('cl-ws-main');
  const ph = document.getElementById('cl-ws-ph');
  ph.style.display = 'none';
  ws.style.display = 'block';
  window._CL_ACTIVE_EXPANDED_CLAUSE = null;

  ws.innerHTML = `
  <div class="cl-stack-wrap">
    <div class="cl-stack-header">
      <div class="cl-stack-header-left">
        ${labels.chLabel ? `<span class="cl-stack-ch-num">${labels.chLabel}</span>` : ''}
        ${labels.chTitle ? `<span class="cl-stack-ch-title">${labels.chTitle}</span>` : ''}
        ${labels.secLabel ? `<span class="cl-stack-sec-sep">·</span><span class="cl-stack-sec-label" onclick="_clOpenAllClausesPopup()" style="cursor:pointer;text-decoration:underline;text-underline-offset:2px;" title="View all obligations">${labels.secLabel}</span>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        <span class="cl-stack-count">${filtered.length} obligation${filtered.length !== 1 ? 's' : ''}</span>
        <div style="position:relative;" id="cl-stack-dots-wrap">
          <button onclick="event.stopPropagation();document.getElementById('cl-stack-dots-wrap').classList.toggle('open')" style="width:28px;height:28px;border-radius:6px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-size:16px;display:inline-flex;align-items:center;justify-content:center;color:#6b7280;">⋮</button>
          <div style="display:none;position:absolute;right:0;top:calc(100% + 4px);background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);min-width:200px;z-index:500;overflow:hidden;" class="cl-sdots-menu">
            <div style="padding:4px 10px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">AI</div>
            <button onclick="document.getElementById('cl-stack-dots-wrap').classList.remove('open');_clOpenCtxModal('all_obligations','All Obligations')" style="display:flex;align-items:center;gap:9px;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#7c3aed;cursor:pointer;" onmouseover="this.style.background='#f5f3ff'" onmouseout="this.style.background='none'">✦ Regenerate All Obligations</button>
            <div style="border-top:1px solid #f3f4f6;margin:4px 0;"></div>
            <div style="padding:4px 10px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">Add</div>
            <button onclick="document.getElementById('cl-stack-dots-wrap').classList.remove('open');_clAddObligationPopup()" style="display:flex;align-items:center;gap:9px;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">+ Add Obligation</button>
            <button onclick="document.getElementById('cl-stack-dots-wrap').classList.remove('open');_clAddActionPopup()" style="display:flex;align-items:center;gap:9px;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">+ Add Action</button>
            <div style="border-top:1px solid #f3f4f6;margin:4px 0;"></div>
            <div style="padding:4px 10px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">Data</div>
            <button onclick="document.getElementById('cl-stack-dots-wrap').classList.remove('open');_clOpenExportPopup()" style="display:flex;align-items:center;gap:9px;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">⬆ Export</button>
          </div>
        </div>
      </div>
    </div>

    <div class="cl-stack-list" id="cl-stack-list">
      ${filtered.length
        ? filtered.map(r => _clOblRowHTML(r)).join('')
        : '<div class="cl-stack-empty">No obligations found.</div>'
      }
    </div>
  </div>`;

  /* dots menu toggle */
  document.addEventListener('click', () => {
    document.getElementById('cl-stack-dots-wrap')?.classList.remove('open');
  });
  const sdm = ws.querySelector('.cl-sdots-menu');
  if (sdm) {
    const wrap = document.getElementById('cl-stack-dots-wrap');
    if (wrap) new MutationObserver(() => {
      sdm.style.display = wrap.classList.contains('open') ? 'block' : 'none';
    }).observe(wrap, {attributes:true, attributeFilter:['class']});
  }

  /* obligation row accordion toggle */
  ws.querySelectorAll('.cl-obl-stack-row').forEach(row => {
    row.addEventListener('click', function(e) {
      if (e.target.closest('.cl-row-eye-btn') || e.target.closest('.cl-obl-applic-badge')) return;
      const uid = this.dataset.uid;
      _clToggleOblStackRow(uid);
    });
  });
}

// window._clOpenAllClausesPopup = function() {
//   var ex = document.getElementById('cl-all-clauses-modal'); if(ex) ex.remove();
//   const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
//   var overlay = document.createElement('div');
//   overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-all-clauses-modal';
//   overlay.innerHTML = `
//   <div class="cl-eye-box cl-eye-box-wide" style="max-width:680px;" onclick="event.stopPropagation()">
//     <div class="cl-eye-head">
//       <div class="cl-eye-head-left">
//         <span class="cl-eye-id-chip">${allClauses.length}</span>
//         <span class="cl-eye-head-title">All Clauses</span>
//       </div>
//       <button class="cl-eye-close" onclick="document.getElementById('cl-all-clauses-modal').remove()">✕</button>
//     </div>
//     <div class="cl-eye-body" style="padding:0;max-height:65vh;overflow-y:auto;">
//       <table style="width:100%;border-collapse:collapse;font-size:12px;">
//         <thead>
//           <tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;position:sticky;top:0;z-index:1;">
//             <th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;width:110px;">Obligation ID</th>
//             <th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Obligation Text</th>
//             <th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;width:80px;">Actions</th>
//             <th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;width:90px;">Status</th>
//             <th style="padding:10px 14px;width:40px;"></th>
//           </tr>
//         </thead>
//         <tbody>
//           ${allClauses.map((cl, idx) => {
//             const oblsRaw = cl.obligations || cl.obligation || null;
//             const oblCount = Array.isArray(oblsRaw) ? oblsRaw.length : oblsRaw ? 1 : 0;
//             const actCount = Array.isArray(cl.actionables) ? cl.actionables.length : 0;
//             const status = window._CL_CLAUSE_STATUS?.[cl.id] || '';
//             const statusStyle = status === 'Accepted'
//               ? 'background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;'
//               : status === 'Rejected'
//               ? 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;'
//               : status === 'Under Review'
//               ? 'background:#fef9c3;color:#b45309;border:1px solid #fcd34d;'
//               : 'background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;';
//             return `
//             <tr style="border-bottom:1px solid #f3f4f6;${idx % 2 === 1 ? 'background:#fafbff;' : ''}">
//               <td style="padding:10px 14px;">
//                 <span style="font-family:monospace;font-size:10px;font-weight:700;color:#fff;background:#7c3aed;padding:2px 8px;border-radius:4px;white-space:nowrap;">${cl.id}</span>
//               </td>
//               <td style="padding:10px 14px;font-size:11px;color:#374151;line-height:1.5;max-width:260px;">${(cl.text || '').substring(0, 90)}${(cl.text||'').length > 90 ? '…' : ''}</td>
              
//               <td style="padding:10px 14px;text-align:center;">
//                 ${actCount ? `<span style="font-size:10px;font-weight:700;background:#eff6ff;color:#2563eb;padding:2px 8px;border-radius:10px;">${actCount}</span>` : '<span style="color:#d1d5db;font-size:11px;">—</span>'}
//               </td>
//               <td style="padding:10px 14px;">
//                 <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;white-space:nowrap;${statusStyle}">${status || 'Pending'}</span>
//               </td>
//               <td style="padding:10px 14px;">
//                 <button onclick="document.getElementById('cl-all-clauses-modal').remove();clOpenClauseEyeModal('${cl.id}')" style="width:24px;height:24px;border-radius:50%;background:none;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#9ca3af;" title="View clause">
//                   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
//                 </button>
//               </td>
//             </tr>`;
//           }).join('')}
//         </tbody>
//       </table>
//       ${allClauses.length === 0 ? '<div style="padding:32px;text-align:center;color:#9ca3af;font-size:13px;">No clauses available.</div>' : ''}
//     </div>
//     <div class="cl-eye-foot" style="justify-content:space-between;">
//       <span style="font-size:11px;color:#9ca3af;">${allClauses.reduce((acc, cl) => { const o = cl.obligations || cl.obligation; return acc + (Array.isArray(o) ? o.length : o ? 1 : 1); }, 0)} obligation${allClauses.length !== 1 ? 's' : ''} in this section</span>
//       <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-all-clauses-modal').remove()">Close</button>
//     </div>
//   </div>`;
//   document.body.appendChild(overlay);
//   overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
//   overlay.querySelectorAll('.cl-all-obl-eye-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const uid = btn.dataset.uid;
//       const clauseId = btn.dataset.clauseid;
//       const oi = parseInt(btn.dataset.oi);
//       document.getElementById('cl-all-clauses-modal').remove();
//       setTimeout(() => {
//         const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
//         const cl = allClauses.find(c => c.id === clauseId);
//         if (!cl) { showToast('Clause not found.', 'error'); return; }
//         clOpenOblEyeModal(uid, clauseId, oi);
//       }, 50);
//     });
//   });
// };

window._clOpenAllClausesPopup = function() {
  var ex = document.getElementById('cl-all-clauses-modal'); if(ex) ex.remove();
  const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
  const oblRows = [];
  allClauses.forEach(function(cl) {
    const obligsRaw = cl.obligations || cl.obligation || null;
    const obligsArr = Array.isArray(obligsRaw) ? obligsRaw : obligsRaw ? [obligsRaw] : [];
    const actsRaw = cl.actionables || [];
    const actsArr = Array.isArray(actsRaw) ? actsRaw : typeof actsRaw === 'string' ? actsRaw.split(';').map(a=>a.trim()).filter(Boolean) : [];
    if (!obligsArr.length) obligsArr.push(cl.text || cl.id);
    obligsArr.forEach(function(ob, oi) {
      const obText = typeof ob === 'string' ? ob : (ob.text || '—');
      const obId = `OBL-${cl.id}-${oi+1}`;
      const uid = `${cl.id}-${oi}`;
      const status = window._CL_OBL_STATUS?.[uid] || '';
      oblRows.push({ uid, obId, obText, actsArr, cl, oi, status });
    });
  });

  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-all-clauses-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box cl-eye-box-wide" style="max-width:700px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left">
        <span class="cl-eye-id-chip" style="background:#7c3aed;">${oblRows.length}</span>
        <span class="cl-eye-head-title">All Obligations</span>
      </div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-all-clauses-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:0;max-height:65vh;overflow-y:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;position:sticky;top:0;z-index:1;">
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;width:130px;">Obligation ID</th>
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Obligation Text</th>
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;width:80px;">Actions</th>
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;width:100px;">Status</th>
            <th style="padding:10px 14px;width:40px;"></th>
          </tr>
        </thead>
        <tbody>
          ${oblRows.map((r, idx) => {
            const statusStyle = r.status === 'Accepted'
              ? 'background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;'
              : r.status === 'Rejected'
              ? 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;'
              : r.status === 'Under Review'
              ? 'background:#fef9c3;color:#b45309;border:1px solid #fcd34d;'
              : 'background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;';
            return `
            <tr style="border-bottom:1px solid #f3f4f6;${idx%2===1?'background:#fafbff;':'background:#fff;'}">
              <td style="padding:10px 14px;">
                <span style="font-family:monospace;font-size:10px;font-weight:700;color:#fff;background:#7c3aed;padding:2px 8px;border-radius:4px;white-space:nowrap;">${r.obId}</span>
              </td>
              <td style="padding:10px 14px;font-size:11px;color:#374151;line-height:1.5;max-width:280px;">${r.obText.substring(0,90)}${r.obText.length>90?'…':''}</td>
              <td style="padding:10px 14px;text-align:center;">
                ${r.actsArr.length ? `<span style="font-size:10px;font-weight:700;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;padding:2px 8px;border-radius:10px;">${r.actsArr.length}</span>` : '<span style="color:#d1d5db;font-size:11px;">—</span>'}
              </td>
              <td style="padding:10px 14px;">
                <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;white-space:nowrap;${statusStyle}">${r.status||'Pending'}</span>
              </td>
              <td style="padding:10px 14px;">
                <button data-uid="${r.uid}" data-clauseid="${r.cl.id}" data-oi="${r.oi}" class="cl-all-obl-eye-btn" style="width:24px;height:24px;border-radius:50%;background:none;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#9ca3af;" title="View obligation">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      ${oblRows.length === 0 ? '<div style="padding:32px;text-align:center;color:#9ca3af;font-size:13px;">No obligations found.</div>' : ''}
    </div>
    <div class="cl-eye-foot" style="justify-content:space-between;">
      <span style="font-size:11px;color:#9ca3af;">${oblRows.length} obligation${oblRows.length!==1?'s':''} total</span>
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-all-clauses-modal').remove()">Close</button>
    </div>
  </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });

  overlay.querySelectorAll('.cl-all-obl-eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      const clauseId = btn.dataset.clauseid;
      const oi = parseInt(btn.dataset.oi);
      document.getElementById('cl-all-clauses-modal').remove();
      setTimeout(() => clOpenOblEyeModal(uid, clauseId, oi), 50);
    });
  });
};

/* ── Obligation row HTML for the stack list ── */
function _clOblRowHTML(r) {
  const { uid, obId, obText, actsArr, cl, oi } = r;
  const oblStatus  = window._CL_OBL_STATUS?.[uid] || '';
  const isApplicable = !window._CL_OBL_APPLICABILITY || window._CL_OBL_APPLICABILITY[uid] !== false;
  const statusClass = oblStatus === 'Accepted' ? 'cl-status-accepted' : oblStatus === 'Rejected' ? 'cl-status-rejected' : oblStatus === 'Under Review' ? 'cl-status-review' : '';

  /* action rows inside accordion */
  const actRowsHTML = actsArr.length
    ? actsArr.map((a, ai) => {
        const aStatus = window._CL_ACT_STATUS?.[`${uid}-${ai}`] || '';
        const actUid = `${uid}-${ai}`;
        const actDept = window._CL_ACT_DEPT?.[actUid] || cl.department || '';
        const actApplicable = !window._CL_ACT_APPLICABILITY || window._CL_ACT_APPLICABILITY[actUid] !== false;
        return `
        <div style="display:flex;align-items:center;gap:8px;padding:9px 14px;border-bottom:1px solid #f0f4ff;background:${ai%2===0?'#fff':'#fafbff'};">
          <span style="font-family:monospace;font-size:10px;font-weight:700;color:#fff;background:#2563eb;padding:2px 7px;border-radius:4px;flex-shrink:0;white-space:nowrap;">ACT-${cl.id}-${oi+1}-${ai+1}</span>
          <span style="flex:1;font-size:12px;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;">${a.substring(0, 65)}${a.length > 65 ? '…' : ''}</span>
          <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
            <button onclick="event.stopPropagation();_clPickActDept('${actUid}')" style="font-size:9px;font-weight:600;padding:2px 7px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;color:#2563eb;white-space:nowrap;cursor:pointer;">${actDept||'+ Dept'}</button>
            <span onclick="event.stopPropagation();_clShowActApplicabilityReason('${uid}',${ai},'ACT-${cl.id}-${oi+1}-${ai+1}')" style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;cursor:pointer;white-space:nowrap;${actApplicable?'background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;':'background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;'}">${actApplicable?'✓':'N/A'}</span>
            <button onclick="event.stopPropagation();_clCycleActStatus('${actUid}')" style="padding:2px 9px;border-radius:10px;font-size:9px;font-weight:700;cursor:pointer;border:1px solid;white-space:nowrap;${aStatus==='Accepted'?'background:#dcfce7;color:#15803d;border-color:#6ee7b7;':aStatus==='Rejected'?'background:#fee2e2;color:#dc2626;border-color:#fca5a5;':'background:#f3f4f6;color:#6b7280;border-color:#d1d5db;'}">${aStatus||'Status'}</button>
            <button class="cl-row-eye-btn" onclick="event.stopPropagation();clOpenActionEyeModal('${uid}',${ai},'${cl.id}')" title="View action" style="width:22px;height:22px;border-radius:50%;background:none;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#9ca3af;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>`;
      }).join('')
    : '<div style="padding:10px 14px;font-size:11px;color:#9ca3af;font-style:italic;">No action items defined.</div>';

  return `
  <div style="border:1px solid #e5e7eb;border-radius:10px;margin-bottom:6px;overflow:hidden;" id="cl-obl-stack-card-${uid}">

    <!-- OBLIGATION HEADER ROW -->
    <div class="cl-obl-stack-row" data-uid="${uid}" style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#fff;cursor:pointer;transition:background .12s;">

      <!-- left: accordion arrow + expand zone -->
      <!-- left: accordion arrow + expand zone -->
<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
  <span style="font-size:9px;color:#9ca3af;transition:transform .2s;flex-shrink:0;" id="cl-obl-sarr-${uid}">▶</span>
  
  <!-- Circ ID chip → opens doc -->
  <span onclick="event.stopPropagation();window.open(window._CL_ACTIVE_CIRC?.docUrl||'#','_blank')"
    style="font-family:monospace;font-size:10px;font-weight:700;color:#2563eb;background:#eff6ff;border:1px solid #bfdbfe;padding:2px 8px;border-radius:4px;flex-shrink:0;white-space:nowrap;cursor:pointer;"
    title="Open circular document">
    ${window._CL_ACTIVE_CIRC?.id || '—'}
  </span>

 <!-- Section chip → opens doc -->
<span onclick="event.stopPropagation();window.open(window._CL_ACTIVE_CIRC?.docUrl||'#','_blank')"
  style="font-size:10px;font-weight:700;color:#0369a1;background:#e0f2fe;border:1px solid #bae6fd;padding:2px 8px;border-radius:4px;flex-shrink:0;white-space:nowrap;cursor:pointer;"
  title="Open section in document">
  §${_clObligMeta(oi).section.replace('Section ','')}
</span>

  <!-- Obl ID chip -->
  <span style="font-family:monospace;font-size:10px;font-weight:700;color:#fff;background:#7c3aed;padding:2px 8px;border-radius:4px;flex-shrink:0;white-space:nowrap;">${obId}</span>

  <!-- Obl text -->
  <span style="flex:1;font-size:12px;font-weight:500;color:#1f2937;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;">${obText.substring(0, 80)}${obText.length > 80 ? '…' : ''}</span>
</div>

      <!-- right: badges + eye -->
      <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
        ${actsArr.length ? `<span style="font-size:9px;font-weight:600;color:#2563eb;background:#eff6ff;border:1px solid #bfdbfe;padding:2px 9px;border-radius:10px;white-space:nowrap;">${actsArr.length} Action${actsArr.length > 1 ? 's' : ''}</span>` : ''}
        ${cl.department ? `<span style="font-size:9px;font-weight:600;padding:2px 7px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;color:#2563eb;white-space:nowrap;">${cl.department}</span>` : ''}
        <span class="cl-obl-applic-badge" onclick="event.stopPropagation();_clShowApplicabilityReason('${uid}','${obId}')" style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;cursor:pointer;white-space:nowrap;${isApplicable ? 'background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;' : 'background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;'}">${isApplicable ? '⊕ Applicable' : 'N/A'}</span>
        <button onclick="event.stopPropagation();_clCycleOblStatus('${uid}','${cl.id}',${oi})" style="padding:2px 9px;border-radius:10px;font-size:9px;font-weight:700;cursor:pointer;border:1px solid;white-space:nowrap;${oblStatus==='Accepted'?'background:#dcfce7;color:#15803d;border-color:#6ee7b7;':oblStatus==='Rejected'?'background:#fee2e2;color:#dc2626;border-color:#fca5a5;':'background:#f3f4f6;color:#6b7280;border-color:#d1d5db;'}">${oblStatus||'Set Status'}</button>
        <span onclick="event.stopPropagation();_clOpenOblSectionPopup('${uid}','${obId}',${oi})"
  style="font-size:9px;font-weight:700;padding:2px 9px;border-radius:10px;background:#f0f9ff;border:1px solid #bae6fd;color:#0369a1;white-space:nowrap;cursor:pointer;"
  title="View all circular references">Others</span>
        <button class="cl-row-eye-btn" onclick="event.stopPropagation();clOpenOblEyeModal('${uid}','${cl.id}',${oi})" title="View obligation" style="width:22px;height:22px;border-radius:50%;background:none;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#9ca3af;transition:all .12s;">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

    </div>

    <!-- ACTION LIST (accordion body) -->
    <div id="cl-obl-sbody-${uid}" style="display:none;border-top:1px solid #f3f4f6;background:#fafbfd;">
      ${actRowsHTML}
    </div>

  </div>`;
}

window._clCycleActStatus = function(actUid) {
  if (!window._CL_ACT_STATUS) window._CL_ACT_STATUS = {};
  const cur = window._CL_ACT_STATUS[actUid] || '';
  const next = cur === '' ? 'Accepted' : cur === 'Accepted' ? 'Rejected' : '';
  window._CL_ACT_STATUS[actUid] = next;
  showToast(next ? `Action ${next.toLowerCase()}.` : 'Status cleared.', 'success');
  if (window._CL_ACTIVE_SECTION_CLAUSES?.length) _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
};

window._clPickActDept = function(actUid) {
  const allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement'];
  var ex = document.getElementById('cl-act-dept-modal'); if(ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-act-dept-modal';
  const current = window._CL_ACT_DEPT?.[actUid] ? window._CL_ACT_DEPT[actUid].split(',').map(d=>d.trim()) : [];
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:400px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-id-chip">Dept</span><span class="cl-eye-head-title">Select Departments</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-act-dept-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:16px;display:flex;flex-direction:column;gap:6px;">
      ${allDepts.map(d => `
      <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;border:1px solid #e5e7eb;border-radius:6px;background:#f9fafb;cursor:pointer;transition:background .1s;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='#f9fafb'">
        <input type="checkbox" value="${d}" ${current.includes(d)?'checked':''} style="width:15px;height:15px;accent-color:#3b82f6;"/>
        <span style="font-size:13px;font-weight:500;color:#374151;">${d}</span>
      </label>`).join('')}
    </div>
    <div class="cl-eye-foot">
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-act-dept-modal').remove()">Cancel</button>
      <button class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;" onclick="
        var checked=Array.from(document.querySelectorAll('#cl-act-dept-modal input:checked')).map(c=>c.value);
        if(!window._CL_ACT_DEPT)window._CL_ACT_DEPT={};
        window._CL_ACT_DEPT['${actUid}']=checked.join(', ');
        document.getElementById('cl-act-dept-modal').remove();
        if(window._CL_ACTIVE_SECTION_CLAUSES?.length)_clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES,window._CL_ACTIVE_LABELS);
        showToast('Departments updated.','success');
      ">Save</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};




window._clCycleOblStatus = function(uid, clauseId, oblIdx) {
  if (!window._CL_OBL_STATUS) window._CL_OBL_STATUS = {};
  const cur = window._CL_OBL_STATUS[uid] || '';
  const next = cur === '' ? 'Accepted' : cur === 'Accepted' ? 'Under Review' : cur === 'Under Review' ? 'Rejected' : '';
  window._CL_OBL_STATUS[uid] = next;
  if (next === 'Accepted' && window._CL_ACT_STATUS) {
    const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
    const cl = allClauses.find(c => c.id === clauseId);
    if (cl) {if (!window._CL_ACT_STATUS) window._CL_ACT_STATUS = {};
  if (next === 'Accepted') {
    const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
    const cl = allClauses.find(c => c.id === clauseId);
    if (cl) {
      const actRaw = cl.actionables || [];
      const actArr = Array.isArray(actRaw) ? actRaw : typeof actRaw === 'string' ? actRaw.split(';').map(a=>a.trim()).filter(Boolean) : [];
      const count = actArr.length || 4;
      for (let i = 0; i < count; i++) window._CL_ACT_STATUS[`${uid}-${i}`] = 'Accepted';
      showToast(`Obligation accepted — ${count} action${count>1?'s':''} auto-accepted.`, 'success');
    }
  }
      const actRaw = cl.actionables || [];
      const actArr = Array.isArray(actRaw) ? actRaw : typeof actRaw === 'string' ? actRaw.split(';').map(a=>a.trim()).filter(Boolean) : [];
      for (let i = 0; i < actArr.length; i++) window._CL_ACT_STATUS[`${uid}-${i}`] = 'Accepted';
    }
  }
  showToast(next ? `Obligation ${next.toLowerCase()}.` : 'Status cleared.', 'success');
  if (window._CL_ACTIVE_SECTION_CLAUSES?.length) _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
};

/* Toggle obligation stack row accordion */
window._clToggleOblStackRow = function(uid) {
  const body = document.getElementById('cl-obl-sbody-' + uid);
  const arr  = document.getElementById('cl-obl-sarr-' + uid);
  const card = document.getElementById('cl-obl-stack-card-' + uid);
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  /* close all */
  document.querySelectorAll('[id^="cl-obl-sbody-"]').forEach(b => { b.style.display = 'none'; });
  document.querySelectorAll('[id^="cl-obl-sarr-"]').forEach(a => { a.style.transform = ''; });
  document.querySelectorAll('[id^="cl-obl-stack-card-"]').forEach(c => { c.style.borderColor = '#e5e7eb'; });
  if (!isOpen) {
    body.style.display = 'block';
    if (arr)  arr.style.transform = 'rotate(90deg)';
    if (card) card.style.borderColor = '#3b82f6';
  }
};

window._clOpenOblSectionPopup = function(uid, oblId, oblIdx) {
  var ex = document.getElementById('cl-obl-sec-popup'); if(ex) ex.remove();
  const m = _clObligMeta(oblIdx);
  const circ = window._CL_ACTIVE_CIRC;
  const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
  const clauseId = uid.split('-').slice(0, -1).join('-');
  const cl = allClauses.find(c => c.id === clauseId);

  const DUMMY_OBL_NAMES = [
    'REs shall submit a list of digital platforms provided by them for the investors',
    'Entities shall maintain records of all transactions for a minimum period of 5 years',
    'All regulated entities shall file quarterly compliance reports with the authority',
  ];

  const refs = [
    { circId: circ?.id || 'SEBI/2025/111', issueDate: '31 July 2025',     section: m.section, subset: m.subset, oblName: DUMMY_OBL_NAMES[0], dueDate: m.dueDate,            docUrl: circ?.docUrl || '#', isOriginal: true  },
    { circId: 'SEBI/2025/142',             issueDate: '29 August 2025',   section: '3(2)',    subset: 'Clause (b)', oblName: DUMMY_OBL_NAMES[1], dueDate: 'September 30, 2025', docUrl: '#',                isOriginal: false },
    { circId: 'SEBI/2025/198',             issueDate: '08 December 2025', section: '4(c)',    subset: 'Clause (c)', oblName: DUMMY_OBL_NAMES[2], dueDate: 'March 31, 2026',    docUrl: '#',                isOriginal: false },
  ];

  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-obl-sec-popup';
  overlay.style.zIndex = '6500';
  overlay.innerHTML = `
  <div class="cl-eye-box cl-eye-box-wide" style="max-width:780px;" onclick="event.stopPropagation()">

    <!-- DARK HEADER -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:#1e293b;flex-shrink:0;border-radius:14px 14px 0 0;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:monospace;font-size:11px;font-weight:700;color:#fff;background:#7c3aed;padding:3px 10px;border-radius:5px;">${oblId}</span>
        <span style="font-size:14px;font-weight:700;color:#fff;">Circular Reference</span>
      </div>
      <button onclick="document.getElementById('cl-obl-sec-popup').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.12);border:none;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>

    <div class="cl-eye-body" style="padding:0;max-height:65vh;overflow-y:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#1e293b;">
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;">Circular ID</th>
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;">Issue Date</th>
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;">Section</th>
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">Obligation Name</th>
            <th style="padding:10px 14px;text-align:left;font-weight:700;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;">Due Date</th>
            <th style="padding:10px 14px;text-align:center;font-weight:700;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;">Document</th>
          </tr>
        </thead>
        <tbody>
          ${refs.map(function(ref, ri) {
            var rowBg = ri % 2 === 0 ? '#fff' : '#f8fafc';
            return '<tr style="border-bottom:1px solid #f0f0f0;background:' + rowBg + ';">' +

              /* Circular ID → opens doc */
              '<td style="padding:10px 14px;vertical-align:top;">' +
                '<button onclick="window.open(\'' + (ref.docUrl||'#') + '\',\'_blank\')" style="font-size:11px;font-weight:700;color:#4f46e5;background:none;border:none;cursor:pointer;text-decoration:underline;padding:0;font-family:inherit;display:block;">' + ref.circId + '</button>' +
                '<div style="margin-top:4px;">' +
                  (ref.isOriginal
                    ? '<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:#dcfce7;color:#15803d;">Original</span>'
                    : '<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:#fef3c7;color:#b45309;">Amended</span>') +
                '</div>' +
              '</td>' +

              /* Issue Date */
              '<td style="padding:10px 14px;font-size:11px;color:#6b7280;white-space:nowrap;vertical-align:top;">' + ref.issueDate + '</td>' +

              /* Section → opens doc */
              '<td style="padding:10px 14px;vertical-align:top;">' +
                '<button onclick="window.open(\'' + (ref.docUrl||'#') + '\',\'_blank\')" style="font-size:11px;font-weight:600;color:#0369a1;background:#e0f2fe;border:1px solid #bae6fd;border-radius:4px;cursor:pointer;padding:2px 8px;font-family:inherit;white-space:nowrap;">' + ref.section + '</button>' +
              '</td>' +

              /* Obligation Name → opens obl eye modal */
              '<td style="padding:10px 14px;font-size:11px;color:#374151;line-height:1.5;max-width:220px;vertical-align:top;">' +
                '<button onclick="document.getElementById(\'cl-obl-sec-popup\').remove();setTimeout(()=>clOpenOblEyeModal(\'' + uid + '\',\'' + clauseId + '\',' + oblIdx + '),50)" style="font-size:11px;font-weight:500;color:#374151;background:none;border:none;cursor:pointer;text-align:left;padding:0;font-family:inherit;line-height:1.5;text-decoration:underline;text-underline-offset:2px;">' + ref.oblName.substring(0,70) + (ref.oblName.length>70?'…':'') + '</button>' +
              '</td>' +

              /* Due Date */
              '<td style="padding:10px 14px;font-size:12px;font-weight:600;color:' + (ref.isOriginal?'#1f2937':'#b45309') + ';white-space:nowrap;vertical-align:top;">' + ref.dueDate + '</td>' +

              /* View Doc */
              '<td style="padding:10px 14px;text-align:center;vertical-align:top;">' +
                '<button onclick="window.open(\'' + (ref.docUrl||'#') + '\',\'_blank\')" style="padding:4px 10px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;font-size:11px;font-weight:600;color:#374151;cursor:pointer;white-space:nowrap;">📄 View Doc</button>' +
              '</td>' +

            '</tr>';
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="cl-eye-foot" style="justify-content:space-between;">
      <span style="font-size:11px;color:#9ca3af;">${refs.length} circular references for this obligation</span>
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-obl-sec-popup').remove()">Close</button>
    </div>
  </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};

window._clOpenSectionDetailPopup = function(circId, section, subset, oblId) {
  var ex = document.getElementById('cl-sec-detail-popup'); if(ex) ex.remove();
  const circ = window._CL_ACTIVE_CIRC;
  const m = _clObligMeta(0);
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-sec-detail-popup';
  overlay.style.zIndex = '7000';
  overlay.innerHTML = `
  <div class="cl-eye-box cl-eye-box-wide" style="max-width:580px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left">
        <span class="cl-eye-id-chip" style="background:#0369a1;">${section}</span>
        <span class="cl-eye-head-title">Section Reference</span>
      </div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-sec-detail-popup').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:18px 20px;display:flex;flex-direction:column;gap:12px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">
          <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Circular ID</div>
          <div style="font-size:13px;font-weight:700;color:#4f46e5;">${circId}</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">
          <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Section</div>
          <div style="font-size:13px;font-weight:700;color:#0369a1;">${section}</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">
          <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Sub-Section</div>
          <div style="font-size:13px;font-weight:700;color:#1f2937;">${subset}</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">
          <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Obligation ID</div>
          <div style="font-size:12px;font-weight:700;color:#7c3aed;">${oblId}</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">
          <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Frequency</div>
          <div style="font-size:13px;font-weight:700;color:#1f2937;">${m.frequency}</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">
          <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Regulatory Body</div>
          <div style="font-size:13px;font-weight:700;color:#1f2937;">SEBI</div>
        </div>
      </div>
      <div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:14px;">
        <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Extracted Clause Text</div>
        <div style="font-size:12px;color:#374151;line-height:1.8;">${(window._CL_ACTIVE_SECTION_CLAUSES||[]).find(c=>c.id===oblId.split('-').slice(1,-1).join('-'))?.text || 'The entity shall ensure compliance with all reporting requirements as specified under the relevant circular, including timely submission of returns and maintenance of records.'}</div>
      </div>
    </div>
    <div class="cl-eye-foot">
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-sec-detail-popup').remove()">Close</button>
      <button class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;" onclick="window.open('${circ?.docUrl||'#'}','_blank')">📄 Open Document</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};

/* Clause row: white bg, ID chip + title text left, counts right
   No risk/dept badges inline — those appear inside the expand tabs row */
function _clClauseRowHTML(cl) {
  const oblCount = cl.obligations
    ? (Array.isArray(cl.obligations) ? cl.obligations.length : 1)
    : (cl.obligation ? (Array.isArray(cl.obligation) ? cl.obligation.length : 1) : 0);
  const actCount = Array.isArray(cl.actionables) ? cl.actionables.length : 0;
  const activeLevel = document.querySelector('.cl-lvl-btn.active')?.dataset.level || '2';
  const oblLabel = 'Obligations';
  const statusVal = window._CL_CLAUSE_STATUS?.[cl.id] || '';
  const statusClass = statusVal === 'Accepted' ? 'cl-status-accepted' : statusVal === 'Rejected' ? 'cl-status-rejected' : statusVal === 'Under Review' ? 'cl-status-review' : '';

  /* derive status icon from obligations */
  const oblsRaw = cl.obligations || cl.obligation || null;
  const oblsArr = Array.isArray(oblsRaw) ? oblsRaw : oblsRaw ? [oblsRaw] : [];
  const totalObls = oblsArr.length || oblCount;
  const allAccepted = totalObls > 0 && oblsArr.every((_, i) => (window._CL_OBL_STATUS?.[`${cl.id}-${i}`] || '') === 'Accepted');
  const anyReview  = oblsArr.some((_, i) => (window._CL_OBL_STATUS?.[`${cl.id}-${i}`] || '') === 'Under Review');
  const anyRej     = oblsArr.some((_, i) => (window._CL_OBL_STATUS?.[`${cl.id}-${i}`] || '') === 'Rejected');
  const statusIcon = allAccepted ? `<span title="All obligations accepted" style="font-size:13px;color:#15803d;">✓</span>`
    : anyRej     ? `<span title="Some obligations rejected" style="font-size:13px;color:#c92a2a;">✗</span>`
    : anyReview  ? `<span title="Under review" style="font-size:13px;color:#b45309;">⚠</span>`
    : totalObls  ? `<span title="Pending review" style="font-size:13px;color:#b45309;background:#fef9c3;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #fcd34d;">ℹ</span>`
    : '';
  return `
  <div class="cl-clause-row" id="cl-row-${cl.id}" data-cid="${cl.id}">
    <span class="cl-row-arrow" id="cl-rowarr-${cl.id}">▶</span>
    ${statusIcon}
    <span class="cl-row-id">${cl.id}</span>
    <span class="cl-row-title-text">${cl.text || ''}</span>
    <div class="cl-row-right">
      ${oblCount ? `<span class="cl-row-pill">${oblCount} ${oblLabel}</span>` : ''}
      ${actCount && activeLevel === '3' ? `<span class="cl-row-pill">${actCount} Actions</span>` : ''}
      ${statusVal ? `<span class="cl-row-status-pill ${statusClass}">${statusVal}</span>` : ''}
      <button class="cl-row-eye-btn" onclick="event.stopPropagation();clOpenClauseEyeModal('${cl.id}')" title="View clause details">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </div>
  </div>
  <div class="cl-inline-expand" id="cl-expand-${cl.id}" style="display:none;"></div>`;
}

/* ── CLAUSE EYE MODAL */
window.clOpenClauseEyeModal = function (clauseId) {
  const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
  const cl = allClauses.find(c => c.id === clauseId);
  if (!cl) return;
  const meta = _clMockDetailMeta(0);
  const currentStatus = window._CL_CLAUSE_STATUS?.[clauseId] || '';

  let modal = document.getElementById('cl-clause-eye-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'cl-clause-eye-modal';
  modal.className = 'cl-eye-overlay';
  modal.innerHTML = `
  <div class="cl-eye-box" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left">
        <span class="cl-eye-id-chip">${cl.id}</span>
        <span class="cl-eye-head-title">Clause Details</span>
      </div>
      <div class="cl-eye-head-right">
        <button class="cl-eye-regen-btn" onclick="_clOpenCtxModal('clause_${cl.id}','Clause ${cl.id}')">✦ Regenerate</button>
        <button class="cl-eye-close" onclick="document.getElementById('cl-clause-eye-modal').remove()">✕</button>
      </div>
    </div>
    <div class="cl-eye-body">

      <!-- Clause Text -->
      <div class="cl-eye-section">
        <div class="cl-eye-sec-label" style="display:flex;align-items:center;justify-content:space-between;">
          <span>Clause Text</span>
          <button class="cl-eye-pen-btn" id="cl-cl-pen-${cl.id}" onclick="clClauseEnableEdit('${cl.id}')" title="Edit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
        </div>
        <textarea class="cl-eye-textarea cl-eye-disabled" id="cl-eye-text-${cl.id}" rows="4" disabled>${cl.text || ''}</textarea>
      </div>

      <!-- Core Fields Row — all disabled by default -->
      <div class="cl-eye-fields-row">
        <div class="cl-eye-field">
          <label class="cl-eye-field-label">Department</label>
          <input class="cl-eye-input cl-eye-disabled" id="cl-eye-dept-${cl.id}" value="${cl.department || ''}" placeholder="e.g. Compliance" disabled/>
        </div>
        <div class="cl-eye-field">
          <label class="cl-eye-field-label">Risk Level</label>
          <select class="cl-eye-select cl-eye-disabled" id="cl-eye-risk-${cl.id}" disabled>
            <option value="">— Select —</option>
            <option ${cl.risk === 'High' ? 'selected' : ''}>High</option>
            <option ${cl.risk === 'Medium' ? 'selected' : ''}>Medium</option>
            <option ${cl.risk === 'Low' ? 'selected' : ''}>Low</option>
          </select>
        </div>
        <div class="cl-eye-field">
          <label class="cl-eye-field-label">Page No.</label>
          <input class="cl-eye-input cl-eye-disabled" id="cl-eye-page-${cl.id}" value="${cl.pageNo || ''}" placeholder="e.g. 12" disabled/>
        </div>
        <div class="cl-eye-field">
          <label class="cl-eye-field-label">Status</label>
          <select class="cl-eye-select cl-eye-status-select cl-eye-disabled" id="cl-eye-status-${cl.id}" disabled>
            <option value="">— Select —</option>
            <option ${currentStatus === 'Accepted' ? 'selected' : ''}>Accepted</option>
            <option ${currentStatus === 'Under Review' ? 'selected' : ''}>Under Review</option>
            <option ${currentStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </div>
      </div>

      <!-- Regulatory Metadata Grid — disabled -->
      <div class="cl-eye-section">
        <div class="cl-eye-sec-label">Regulatory Details</div>
        <div class="cl-eye-meta-grid">
          ${_clMetaFields(meta).map(f => `
          <div class="cl-eye-meta-cell">
            <label class="cl-eye-field-label">${f.label}</label>
            <input class="cl-eye-input cl-eye-disabled" value="${f.value}" placeholder="${f.label}" disabled/>
          </div>`).join('')}
        </div>
      </div>

    </div>
    <div class="cl-eye-foot">
      <span class="cl-eye-foot-note">Changes are saved locally to this session.</span>
      <div style="display:flex;gap:8px;">
        <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-clause-eye-modal').remove()">Cancel</button>
        <button class="cl-eye-save-btn" onclick="clSaveClauseEye('${cl.id}')" style="opacity:.4;pointer-events:none;">💾 Save</button>
      </div>
    </div>
  </div>`;
  modal.addEventListener('click', e => {
    const dotsWrapEl = document.getElementById(`cl-obl-dots-${uid}`);
    if (dotsWrapEl && !dotsWrapEl.contains(e.target)) dotsWrapEl.classList.remove('cl-open');
    if (e.target === modal) modal.remove();
  });
  document.body.appendChild(modal);

  /* wire three-dots menu */
  const dotsWrap = modal.querySelector(`#cl-obl-dots-${uid}`);
  const dotsMenu = modal.querySelector(`#cl-obl-dots-menu-${uid}`);
  if (dotsWrap && dotsMenu) {
    new MutationObserver(() => {
      dotsMenu.style.display = dotsWrap.classList.contains('cl-open') ? 'block' : 'none';
    }).observe(dotsWrap, { attributes: true, attributeFilter: ['class'] });
  }
};

window.clSaveClauseEye = function (clauseId) {
  if (!window._CL_CLAUSE_STATUS) window._CL_CLAUSE_STATUS = {};
  const status = document.getElementById(`cl-eye-status-${clauseId}`)?.value || '';
  window._CL_CLAUSE_STATUS[clauseId] = status;
  /* Update clause object in memory */
  const cl = (window._CL_ACTIVE_SECTION_CLAUSES || []).find(c => c.id === clauseId);
  if (cl) {
    cl.text = document.getElementById(`cl-eye-text-${clauseId}`)?.value || cl.text;
    cl.department = document.getElementById(`cl-eye-dept-${clauseId}`)?.value || cl.department;
    cl.risk = document.getElementById(`cl-eye-risk-${clauseId}`)?.value || cl.risk;
    cl.pageNo = document.getElementById(`cl-eye-page-${clauseId}`)?.value || cl.pageNo;
  }
  /* cascade accepted status to all child obligations and actions */
  if (status === 'Accepted') {
    if (!window._CL_OBL_STATUS)  window._CL_OBL_STATUS  = {};
    if (!window._CL_ACT_STATUS)  window._CL_ACT_STATUS  = {};
    const targetCl = (window._CL_ACTIVE_SECTION_CLAUSES || []).find(c => c.id === clauseId);
    if (targetCl) {
      const oblsRaw = targetCl.obligations || targetCl.obligation || null;
      const oblsArr = Array.isArray(oblsRaw) ? oblsRaw : oblsRaw ? [oblsRaw] : [];
      const actRaw  = targetCl.actionables || [];
      const actArr  = Array.isArray(actRaw) ? actRaw : typeof actRaw === 'string' ? actRaw.split(';').map(a=>a.trim()).filter(Boolean) : [];
      const oblCount = oblsArr.length || 3; /* fallback to mock count */
      for (let i = 0; i < oblCount; i++) {
        window._CL_OBL_STATUS[`${clauseId}-${i}`] = 'Accepted';
        for (let j = 0; j < (actArr.length || 4); j++) {
          window._CL_ACT_STATUS[`${clauseId}-${i}-${j}`] = 'Accepted';
        }
      }
    }
  }

  document.getElementById('cl-clause-eye-modal')?.remove();
  showToast('Clause details saved.', 'success');
  /* Re-render the pill */
  const pill = document.querySelector(`#cl-row-${clauseId} .cl-row-status-pill`);
  if (pill && status) { pill.textContent = status; pill.style.display = ''; }
};

window.clClauseEnableEdit = function (clauseId) {
  const modal = document.getElementById('cl-clause-eye-modal');
  if (!modal) return;
  modal.querySelectorAll('.cl-eye-disabled').forEach(el => { el.disabled = false; el.classList.remove('cl-eye-disabled'); });
  const pen = document.getElementById(`cl-cl-pen-${clauseId}`);
  if (pen) pen.style.display = 'none';
  const saveBtn = modal.querySelector('.cl-eye-save-btn');
  if (saveBtn) { saveBtn.style.opacity = '1'; saveBtn.style.pointerEvents = 'auto'; }
  modal.querySelector('.cl-eye-foot-note') && (modal.querySelector('.cl-eye-foot-note').textContent = 'Fields are now editable.');
};

window.clOblEnableEdit = function (uid) {
  const modal = document.getElementById('cl-obl-eye-modal');
  if (!modal) return;
  /* enable all disabled/readonly fields */
  modal.querySelectorAll('.cl-eye-disabled').forEach(el => {
    el.disabled = false;
    el.readOnly = false;
    el.classList.remove('cl-eye-disabled');
    el.style.background = '#fff';
    el.style.borderColor = '#3b82f6';
    el.style.opacity = '1';
    el.style.cursor = 'text';
  });
  /* also hit inputs/selects that may not have the class but are inside the meta grid */
  modal.querySelectorAll(`#cl-obl-meta-grid-${uid} input, #cl-obl-meta-grid-${uid} select`).forEach(el => {
    el.disabled = false;
    el.readOnly = false;
    el.style.background = '#fff';
    el.style.border = '1.5px solid #3b82f6';
    el.style.opacity = '1';
    el.style.cursor = 'text';
  });
  /* inject edit banner below header */
  const existingBanner = document.getElementById(`cl-obl-edit-banner-${uid}`);
  if (!existingBanner) {
    const head = modal.querySelector('.cl-eye-head');
    if (head) {
      const b = document.createElement('div');
      b.id = `cl-obl-edit-banner-${uid}`;
      b.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 20px;background:#eff6ff;border-bottom:2px solid #bfdbfe;flex-shrink:0;';
      b.innerHTML = `<span style="font-size:12px;font-weight:600;color:#1d4ed8;">✏️ Edit mode — fields are now editable</span>
        <button onclick="clOblSaveInline('${uid}')" style="padding:5px 14px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">💾 Save Changes</button>`;
      head.insertAdjacentElement('afterend', b);
    }
  } else {
    existingBanner.style.display = 'flex';
  }
  const pen = document.getElementById(`cl-obl-pen-${uid}`);
  if (pen) pen.style.display = 'none';
  const note = document.getElementById(`cl-obl-footnote-${uid}`);
  if (note) note.textContent = '✏️ Fields are now editable. Click Save to apply.';
};

window.clOblSaveInline = function(uid) {
  const modal = document.getElementById('cl-obl-eye-modal');
  if (!modal) return;
  /* persist due date, freq, section, dept back into clause object */
  const clauseId = uid.split('-').slice(0, -1).join('-');
  const cl = (window._CL_ACTIVE_SECTION_CLAUSES || []).find(c => c.id === clauseId);
  const deptEl = document.getElementById(`cl-of-dept-${uid}`);
  const riskEl = document.getElementById(`cl-of-risk-${uid}`);
  if (cl) {
    if (deptEl) cl.department = deptEl.querySelector('input,div')?.textContent || deptEl.textContent.trim() || cl.department;
    if (riskEl) cl.risk = riskEl.value || cl.risk;
  }
  /* re-disable fields */
  modal.querySelectorAll('input, select, textarea').forEach(el => {
    if (!el.closest('.cl-eye-foot') && el.type !== 'checkbox') {
      el.disabled = true;
      el.classList.add('cl-eye-disabled');
      el.style.background = '#f9fafb';
      el.style.borderColor = '#e5e7eb';
      el.style.opacity = '0.55';
      el.style.cursor = 'not-allowed';
    }
  });
  /* keep the status select always active */
  const statusSel = modal.querySelector(`[onchange*="_clSetOblStatus"]`);
  if (statusSel) {
    statusSel.disabled = false;
    statusSel.classList.remove('cl-eye-disabled');
    statusSel.style.opacity = '1';
    statusSel.style.cursor = 'pointer';
  }
  const banner = document.getElementById(`cl-obl-edit-banner-${uid}`);
  if (banner) banner.style.display = 'none';
  const note = document.getElementById(`cl-obl-footnote-${uid}`);
  if (note) note.textContent = 'Changes saved to session.';
  if (window._CL_ACTIVE_SECTION_CLAUSES?.length)
    _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
  showToast('Obligation details saved.', 'success');
};

/* ── OBLIGATION EYE MODAL */
window.clOpenOblEyeModal = function (uid, clauseId, oblIdx) {
  const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
  const cl = allClauses.find(c => c.id === clauseId);
  if (!cl) return;

  const obligsRaw = cl.obligations || cl.obligation || null;
  const obligsArray = Array.isArray(obligsRaw) ? obligsRaw : typeof obligsRaw === 'string' ? [obligsRaw] : null;
  const actionsRaw = cl.actionables || [];
  const actionsArray = Array.isArray(actionsRaw) ? actionsRaw : typeof actionsRaw === 'string' ? actionsRaw.split(';').map(a => a.trim()).filter(Boolean) : [];

  const MOCK_OBL = [
    { text: 'Establish and maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.', actions: ['Draft or update the compliance policy', 'Present policy to Board for formal approval', 'Distribute updated policy to all departments', 'Schedule annual review'] },
    { text: 'All relevant staff must complete mandatory training within 60 days of the effective date.', actions: ['Identify all staff roles impacted', 'Design training module', 'Track completion records', 'Conduct re-training annually'] },
    { text: 'The entity shall implement robust internal controls and conduct periodic testing.', actions: ['Map all processes to control owners', 'Design control tests', 'Execute quarterly control testing', 'Escalate control failures within 5 business days'] },
  ];
  const obligs = obligsArray
    ? obligsArray.map(ob => ({ text: typeof ob === 'string' ? ob : (ob.text || '—'), actions: actionsArray }))
    : MOCK_OBL;
  const ob = obligs[oblIdx] || obligs[0];
  const m = _clObligMeta(oblIdx);
  const currentStatus = window._CL_OBL_STATUS?.[uid] || '';
  const actList = ob.actions || actionsArray;
  const oblId = `OBL-${clauseId}-${oblIdx + 1}`;
  const deptDisplay = cl.department || '—';
  const isApplicable = !window._CL_OBL_APPLICABILITY || window._CL_OBL_APPLICABILITY[uid] !== false;

  const EV = [
    { icon: '📋', name: 'Compliance Policy Document', type: 'Policy', source: 'Internal Repository', needed: 'Board-approved policy covering this compliance area.', status: 'Required' },
    { icon: '🔍', name: 'Internal Audit Report', type: 'Audit Record', source: 'Internal Audit Dept', needed: 'Audit findings confirming controls are operating effectively.', status: 'Required' },
    { icon: '🎓', name: 'Staff Training Completion Record', type: 'Training Record', source: 'HR System', needed: 'Completion records for all relevant staff.', status: 'Required' },
    { icon: '💻', name: 'System Audit Trail / Access Log', type: 'System Log', source: 'IT Department', needed: 'System-generated logs showing automated controls.', status: 'Recommended' },
    { icon: '🏛️', name: 'Board Resolution / Meeting Minutes', type: 'Board Record', source: 'Company Secretary', needed: 'Board-level approval in formal meeting minutes.', status: 'Required' },
  ];

  let modal = document.getElementById('cl-obl-eye-modal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'cl-obl-eye-modal';
  modal.className = 'cl-eye-overlay';

  modal.innerHTML = `
  <div class="cl-eye-box cl-eye-box-wide" onclick="event.stopPropagation()" style="max-width:720px;">

    <!-- CARD HEADER -->
    <div class="cl-eye-head" style="align-items:flex-start;">
      <div class="cl-eye-head-left" style="flex-direction:column;align-items:flex-start;gap:4px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="cl-eye-id-chip" style="background:#7c3aed;">${oblId}</span>
          ${isApplicable
            ? `<span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;cursor:pointer;" onclick="_clShowApplicabilityReason('${uid}','${oblId}')">✓ Applicable</span>`
            : `<span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;cursor:pointer;" onclick="_clShowApplicabilityReason('${uid}','${oblId}')">— Not Applicable</span>`
          }
        </div>
        <div style="font-size:13px;font-weight:600;color:#1f2937;max-width:480px;line-height:1.4;">${ob.text}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <!-- three-dots menu -->
<div style="position:relative;" id="cl-obl-dots-${uid}">
  <button onclick="event.stopPropagation();document.getElementById('cl-obl-dots-${uid}').classList.toggle('cl-open')" style="width:30px;height:30px;border-radius:8px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:16px;display:inline-flex;align-items:center;justify-content:center;color:#6b7280;">⋮</button>
  <div id="cl-obl-dots-menu-${uid}" style="display:none;position:absolute;right:0;top:calc(100% + 4px);background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.15);min-width:190px;z-index:700;overflow:hidden;">
            <div style="padding:5px 12px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid #f3f4f6;">Actions</div>
            <button onclick="event.stopPropagation();document.getElementById('cl-obl-dots-${uid}').classList.remove('cl-open');clOblEnableEdit('${uid}')" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;transition:background .1s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">
              <span style="font-size:14px;">✎</span> Edit Fields
            </button>
            <button onclick="event.stopPropagation();document.getElementById('cl-obl-dots-${uid}').classList.remove('cl-open');_clOpenMappedObligations('${oblId}')" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;transition:background .1s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">
              <span style="font-size:14px;">⇄</span> Mapped Obligations
            </button>
           <!--- <button onclick="event.stopPropagation();document.getElementById('cl-obl-dots-${uid}').classList.remove('cl-open');_clOpenMappedActions('${oblId}')" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;transition:background .1s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">
              <span style="font-size:14px;">⚡</span> Mapped Actions
            </button> --->
            <button onclick="event.stopPropagation();document.getElementById('cl-obl-dots-${uid}').classList.remove('cl-open');document.getElementById('cl-obl-eye-modal').remove();_clAddActionPopup()" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;transition:background .1s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">
              <span style="font-size:14px;">+</span> Add Action
            </button>
            <div style="border-top:1px solid #f3f4f6;"></div>
            <button onclick="event.stopPropagation();document.getElementById('cl-obl-dots-${uid}').classList.remove('cl-open');_clOpenCtxModal('oblig_${uid}','Obligation ${oblIdx + 1}')" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#7c3aed;cursor:pointer;transition:background .1s;" onmouseover="this.style.background='#f5f3ff'" onmouseout="this.style.background='none'">
              <span style="font-size:14px;">✦</span> Regenerate with AI
            </button>
            <!--- <button onclick="event.stopPropagation();document.getElementById('cl-obl-dots-${uid}').classList.remove('cl-open');_clToggleOblApplicability('${uid}')" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;transition:background .1s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">
            //   <span style="font-size:14px;">◎</span> Toggle Applicability
            // </button> !-->
          </div>
        </div>
        <button class="cl-eye-close" onclick="document.getElementById('cl-obl-eye-modal').remove()">✕</button>
      </div>
    </div>

    <!-- CARD BODY -->
    <div class="cl-eye-body" style="padding:0;max-height:70vh;overflow-y:auto;">

      <!-- OBLIGATION DETAILS -->
      <div style="border-bottom:1px solid #dbeafe;background:#fafbff;">
        <div style="padding:12px 20px 0 20px;font-size:10px;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;margin-bottom:10px;">
          <span style="width:3px;height:14px;background:#2563eb;border-radius:2px;display:inline-block;"></span>
          Obligation Details
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;padding:0 20px 14px;" id="cl-obl-meta-grid-${uid}">
          ${_clOblDetailField('Due Date', m.dueDate, `cl-of-due-${uid}`)}
          ${_clOblDetailField('Effective Date', '—', `cl-of-eff-${uid}`)}
          ${_clOblDetailField('Frequency', m.frequency, `cl-of-freq-${uid}`)}
          ${_clOblDetailField('Section', m.section, `cl-of-sec-${uid}`)}
          ${_clOblDetailField('Sub-Section', m.subset, `cl-of-sub-${uid}`)}
          ${_clOblDetailField('Department', deptDisplay, `cl-of-dept-${uid}`, true)}
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">
            <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">Compliance Status</div>
            <select onchange="_clSetOblStatus('${uid}',this.value)" style="width:100%;padding:7px 10px;border:1.5px solid ${currentStatus==='Accepted'?'#6ee7b7':currentStatus==='Rejected'?'#fca5a5':'#e5e7eb'};border-radius:6px;font-size:12px;font-weight:700;background:${currentStatus==='Accepted'?'#dcfce7':currentStatus==='Rejected'?'#fee2e2':'#fff'};color:${currentStatus==='Accepted'?'#15803d':currentStatus==='Rejected'?'#dc2626':'#6b7280'};cursor:pointer;outline:none;">

              <option value="Accepted" ${currentStatus==='Accepted'?'selected':''}>✓ Accepted</option>
              <option value="Under Review" ${currentStatus==='Under Review'?'selected':''}>⟳ Under Review</option>
              <option value="Rejected" ${currentStatus==='Rejected'?'selected':''}>✗ Rejected</option>
            </select>
          </div>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">
            <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">Risk</div>
            <select id="cl-of-risk-${uid}" class="cl-eye-disabled" disabled style="width:100%;padding:5px 8px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;background:#fff;">
              <option value="">— Select —</option>
              <option ${cl.risk==='High'?'selected':''}>High</option>
              <option ${cl.risk==='Medium'?'selected':''}>Medium</option>
              <option ${cl.risk==='Low'?'selected':''}>Low</option>
            </select>
          </div>
          ${cl.pageNo ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;display:flex;align-items:center;justify-content:center;"><button onclick="clOpenDocPage(${cl.pageNo})" style="padding:6px 14px;background:#3b82f6;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">📄 View Page ${cl.pageNo}</button></div>` : ''}
        </div>
      </div><!-- end obligation details -->

      <!-- ACTION ITEMS ACCORDION -->
      <div style="border-bottom:1px solid #dbeafe;background:#fafbff;">
        <div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="var el=document.getElementById('cl-obl-acts-body-${uid}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';">
          <div style="font-size:10px;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#2563eb;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▼</span> Action Items
            <span style="background:#e0f2fe;color:#0369a1;padding:1px 8px;border-radius:10px;font-size:10px;font-weight:700;">${actList.length}</span>
          </div>
        </div>
        <div id="cl-obl-acts-body-${uid}" style="display:block;padding:0 20px 14px;">
          ${actList.length ? `
          <table style="width:100%;border-collapse:collapse;font-size:12px;">
            <thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">
              <th style="padding:8px 12px;text-align:left;font-weight:700;color:#374151;width:110px;">Action ID</th>
              <th style="padding:8px 12px;text-align:left;font-weight:700;color:#374151;">Action</th>
              <th style="padding:8px 12px;text-align:left;font-weight:700;color:#374151;width:90px;">Dept</th>
              <th style="padding:8px 12px;text-align:left;font-weight:700;color:#374151;width:110px;">Status</th>
            </tr></thead>
            <tbody>
              ${actList.map((a, ai) => {
                const aStatus = window._CL_ACT_STATUS?.[`${uid}-${ai}`] || '';
                const aOblIdx = uid.split('-').pop();
                const actId = `ACT-${clauseId}-${parseInt(aOblIdx)+1}-${ai+1}`;
                const actDeptVal = window._CL_ACT_DEPT?.[`${uid}-${ai}`] || cl.department || '';
                return `<tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:9px 12px;">
                    <button onclick="clOpenActionEyeModal('${uid}',${ai},'${clauseId}')" style="font-family:monospace;font-size:10px;font-weight:700;color:#fff;background:#2563eb;padding:2px 7px;border-radius:4px;border:none;cursor:pointer;white-space:nowrap;">${actId}</button>
                  </td>
                  <td style="padding:9px 12px;font-size:11px;color:#374151;max-width:220px;">${a}</td>
                  <td style="padding:9px 12px;">
                    <button onclick="event.stopPropagation();_clPickActDept('${uid}-${ai}')" style="font-size:9px;font-weight:600;padding:2px 7px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;color:#2563eb;white-space:nowrap;cursor:pointer;">${actDeptVal||'+ Dept'}</button>
                  </td>
                  <td style="padding:9px 12px;">
                    <div style="display:flex;gap:4px;align-items:center;">
                      <button onclick="_clSetActStatus('${uid}',${ai},'Accepted',this)" style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;border:1px solid ${aStatus==='Accepted'?'#6ee7b7':'#e5e7eb'};background:${aStatus==='Accepted'?'#dcfce7':'#f9fafb'};color:${aStatus==='Accepted'?'#15803d':'#6b7280'};">✓</button>
                      <button onclick="_clSetActStatus('${uid}',${ai},'Rejected',this)" style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;border:1px solid ${aStatus==='Rejected'?'#fca5a5':'#e5e7eb'};background:${aStatus==='Rejected'?'#fee2e2':'#f9fafb'};color:${aStatus==='Rejected'?'#dc2626':'#6b7280'};">✗</button>
                      ${aStatus ? `<span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;${aStatus==='Accepted'?'background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;':'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;'}">${aStatus}</span>` : ''}
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>` : '<div style="padding:12px 20px;font-size:12px;color:#9ca3af;font-style:italic;">No action items.</div>'}
        </div>
      </div>

      <!-- EXTRACTED CLAUSE DESCRIPTION -->
      <div style="border-bottom:1px solid #bbf7d0;background:#f0fdf4;">
        <div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="var el=document.getElementById('cl-obl-clause-${uid}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';">
          <div style="font-size:10px;font-weight:800;color:#15803d;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#22c55e;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▶</span> Extracted Clause Description
          </div>
        </div>
        <div id="cl-obl-clause-${uid}" style="display:none;padding:0 20px 14px;">
          <div style="background:#fff;border:1px solid #bbf7d0;border-radius:8px;padding:12px 14px;">
            <div style="font-size:10px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">Clause Text</div>
            <div style="font-size:13px;color:#1f2937;line-height:1.7;">${cl.text || 'The entity shall ensure compliance with all reporting requirements as specified under the relevant circular.'}</div>
          </div>
        </div>
      </div>

      <!-- REGULATORY DETAILS -->
      <div style="border-bottom:1px solid #e9d5ff;background:#faf5ff;">
        <div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="var el=document.getElementById('cl-obl-reg-${uid}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';">
          <div style="font-size:10px;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#7c3aed;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▼</span> Regulatory Details
          </div>
        </div>
        <div id="cl-obl-reg-${uid}" style="display:block;padding:0 20px 14px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            ${_clOblDetailField('Regulatory Body', 'RBI', '')}
            ${_clOblDetailField('Legislative Area', m.category, '')}
            ${_clOblDetailField('Section', m.section, '')}
            ${_clOblDetailField('Sub-Section', m.subset, '')}
          </div>
        </div>
      </div>

      <!-- EVIDENCE LIST -->
      <div style="background:#fffbeb;">
        <div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="var el=document.getElementById('cl-obl-ev-${uid}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';">
          <div style="font-size:10px;font-weight:800;color:#b45309;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#f59e0b;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▶</span> Evidence Required
          </div>
          <span style="background:#fef9c3;color:#92400e;padding:2px 9px;border-radius:10px;font-size:9px;font-weight:700;border:1px solid #fde68a;">💡 AI Suggested</span>
        </div>
        <div id="cl-obl-ev-${uid}" style="display:none;padding:0 20px 16px;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">
              <th style="padding:8px 12px;text-align:left;font-weight:700;color:#374151;">Action</th>
              <th style="padding:8px 12px;text-align:left;font-weight:700;color:#374151;">Evidence Needed</th>
              <th style="padding:8px 12px;text-align:center;width:110px;font-weight:700;color:#374151;">Status</th>
            </tr></thead>
            <tbody>
              ${actList.map((a, ai) => {
                const ev = EV[ai % EV.length];
                return `<tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:9px 12px;font-size:11px;color:#374151;">${a}</td>
                  <td style="padding:9px 12px;">
                    <div style="font-size:12px;font-weight:600;color:#1f2937;">${ev.icon} ${ev.name}</div>
                    <div style="font-size:11px;color:#6b7280;">${ev.type} · ${ev.source}</div>
                    <div style="font-size:11px;color:#374151;margin-top:2px;">${ev.needed}</div>
                  </td>
                  <td style="padding:9px 12px;text-align:center;"><span style="padding:3px 9px;border-radius:10px;font-size:10px;font-weight:700;${ev.status==='Required'?'background:#fee2e2;color:#dc2626;':'background:#fef3c7;color:#b45309;'}">${ev.status}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
          <div style="font-size:11px;color:#6b7280;margin-top:8px;">💡 Evidence suggestions are AI-generated based on obligation type and regulatory context.</div>
        </div>
      </div>



      <!-- LINKED REFERENCE accordion -->
      <div style="border-bottom:1px solid #c7d2fe;background:#f5f7ff;">
        <div onclick="var el=document.getElementById('cl-obl-linked-ref-body-${uid}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;">
          <div style="font-size:10px;font-weight:800;color:#3730a3;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#4f46e5;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▶</span> Linked Reference
          </div>
        </div>
        <div id="cl-obl-linked-ref-body-${uid}" style="display:none;padding:0;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;">
            <tbody>
              <tr>
                <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Circular ID</td>
                <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Issue Date</td>
                <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Section</td>
                <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;">Obligation Name</td>
                <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Due Date</td>
                <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;text-align:center;white-space:nowrap;">Document</td>
              </tr>
              ${[
                { circId:'SEBI/2025/111', issueDate:'31 July 2025',     section:'5(1)', oblName:'REs shall submit a list of digital platforms provided by them for the investors', dueDate:'August 31, 2025',    docUrl:'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf', isOriginal:true },
                { circId:'SEBI/2025/142', issueDate:'29 August 2025',   section:'3(2)', oblName:'REs shall submit a list of digital platforms provided by them for the investors', dueDate:'September 30, 2025', docUrl:'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf', isOriginal:false },
                { circId:'SEBI/2025/198', issueDate:'08 December 2025', section:'4(c)', oblName:'REs shall submit a list of digital platforms provided by them for the investors', dueDate:'March 31, 2026',    docUrl:'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf', isOriginal:false },
              ].map(function(ref, ri) {
                var rowBg = ri % 2 === 0 ? '#fff' : '#fafafa';
                return '<tr style="border-bottom:1px solid #f0f0f0;background:' + rowBg + ';">' +
                  '<td style="padding:10px 14px;white-space:nowrap;vertical-align:top;">' +
                    '<span style="font-size:11px;font-weight:700;color:#4f46e5;">' + ref.circId + '</span>' +
                    '<div style="margin-top:3px;">' +
                      (ref.isOriginal
                        ? '<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:#dcfce7;color:#15803d;">Original</span>'
                        : '<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:#fef3c7;color:#b45309;">Amended</span>') +
                    '</div>' +
                  '</td>' +
                  '<td style="padding:10px 14px;font-size:11px;color:#6b7280;white-space:nowrap;vertical-align:top;">' + ref.issueDate + '</td>' +
                  '<td style="padding:10px 14px;white-space:nowrap;vertical-align:top;">' +
                    '<span class="cl-obl-ref-section-link" data-circid="' + ref.circId + '" data-uid="${uid}" style="font-size:11px;font-weight:600;color:#0369a1;cursor:pointer;text-decoration:underline;">' + ref.section + '</span>' +
                  '</td>' +
                  '<td style="padding:10px 14px;font-size:11px;color:#374151;line-height:1.5;max-width:200px;vertical-align:top;">' + ref.oblName.substring(0,70) + (ref.oblName.length>70?'…':'') + '</td>' +
                  '<td style="padding:10px 14px;font-size:12px;font-weight:600;color:' + (ref.isOriginal?'#1f2937':'#b45309') + ';white-space:nowrap;vertical-align:top;">' + ref.dueDate + '</td>' +
                  '<td style="padding:10px 14px;text-align:center;vertical-align:top;">' +
                    '<button class="cl-obl-ref-doc-btn" data-url="' + ref.docUrl + '" style="padding:4px 10px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;font-size:11px;font-weight:600;color:#374151;cursor:pointer;white-space:nowrap;">&#x1F4C4; View Doc</button>' +
                  '</td>' +
                '</tr>';
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>


      

    </div>

    <div class="cl-eye-foot">
      <span class="cl-eye-foot-note" id="cl-obl-footnote-${uid}">Click ⋮ Edit to modify fields.</span>
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-obl-eye-modal').remove()">Close</button>
    </div>
  </div>`;

  /* close dots on outside click */
  modal.addEventListener('click', e => {
    document.getElementById(`cl-obl-dots-${uid}`)?.classList.remove('open');
    const menu = document.querySelector(`#cl-obl-dots-${uid} .cl-obl-dots-menu`);
    if (menu) menu.style.display = 'none';
    if (e.target === modal) modal.remove();
  });
  document.body.appendChild(modal);

  // Wire section link clicks → open OBL ref popup
modal.querySelectorAll('.cl-obl-ref-section-link').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.stopPropagation();
    var ex = document.getElementById('cl-obl-ref-section-modal'); if(ex) ex.remove();
    var sectionOverlay = document.createElement('div');
    sectionOverlay.className = 'cl-eye-overlay';
    sectionOverlay.id = 'cl-obl-ref-section-modal';
    sectionOverlay.style.zIndex = '6000';
    sectionOverlay.innerHTML =
      '<div class="cl-eye-box cl-eye-box-wide" style="max-width:600px;" onclick="event.stopPropagation()">' +
        '<div class="cl-eye-head">' +
          '<div class="cl-eye-head-left">' +
            '<span class="cl-eye-id-chip" style="background:#7c3aed;">' + oblId + '</span>' +
            '<span class="cl-eye-head-title">Obligation Reference</span>' +
          '</div>' +
          '<button class="cl-eye-close" onclick="document.getElementById(\'cl-obl-ref-section-modal\').remove()">✕</button>' +
        '</div>' +
        '<div class="cl-eye-body" style="padding:20px;display:flex;flex-direction:column;gap:14px;">' +

          // Obligation text banner
          '<div style="background:#f5f3ff;border:1px solid #e9d5ff;border-radius:6px;padding:12px 14px;">' +
            '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">Obligation</div>' +
            '<div style="font-size:13px;color:#1f2937;line-height:1.7;">' + ob.text + '</div>' +
          '</div>' +

          // Meta grid
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
            '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Due Date</div>' +
              '<div style="font-size:13px;font-weight:700;color:#1f2937;">' + m.dueDate + '</div>' +
            '</div>' +
            '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Frequency</div>' +
              '<div style="font-size:13px;font-weight:700;color:#1f2937;">' + m.frequency + '</div>' +
            '</div>' +
            '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Section</div>' +
              '<div style="font-size:13px;font-weight:700;color:#1f2937;">' + el.textContent + '</div>' +
            '</div>' +
            '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Effective Date</div>' +
              '<div style="font-size:13px;font-weight:700;color:#1f2937;">—</div>' +
            '</div>' +
            '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Regulatory Body</div>' +
              '<div style="font-size:13px;font-weight:700;color:#1f2937;">SEBI</div>' +
            '</div>' +
            '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Circular ID</div>' +
              '<div style="font-size:12px;font-weight:700;color:#7c3aed;">' + (el.dataset.circid || clauseId) + '</div>' +
            '</div>' +
          '</div>' +

          // Extracted clause text
          '<div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:14px;">' +
            '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Extracted Clause Text</div>' +
            '<div style="font-size:12px;color:#374151;line-height:1.8;">' + (cl.text || 'The entity shall ensure compliance with all reporting requirements as specified under the relevant circular, including timely submission of returns and maintenance of records as directed by the regulatory authority.') + '</div>' +
          '</div>' +

        '</div>' +
        '<div class="cl-eye-foot">' +
          '<button class="cl-eye-cancel-btn" onclick="document.getElementById(\'cl-obl-ref-section-modal\').remove()">Close</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(sectionOverlay);
    sectionOverlay.addEventListener('click', function(e) {
      if (e.target === sectionOverlay) sectionOverlay.remove();
    });
  });
});

// Wire View Doc clicks
modal.querySelectorAll('.cl-obl-ref-doc-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var url = btn.dataset.url;
    if (url) window.open(url, '_blank');
    else showToast('No document available.', 'error');
  });
});
  /* wire dots menu display */
  const dotsWrapObl = document.getElementById(`cl-obl-dots-${uid}`);
  const dotsMenuObl = document.getElementById(`cl-obl-dots-menu-${uid}`);
  if (dotsWrapObl && dotsMenuObl) {
    new MutationObserver(() => {
      dotsMenuObl.style.display = dotsWrapObl.classList.contains('cl-open') ? 'block' : 'none';
    }).observe(dotsWrapObl, {attributes:true, attributeFilter:['class']});
  }
};

/* Helper: detail field */
window._clOblDetailField = function(label, value, id, clickable) {
  return `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;"${id ? ` id="${id}"` : ''}>
    <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">${label}</div>
    <div style="font-size:12px;font-weight:600;color:#1f2937;">${value}</div>
  </div>`;
};

/* Set obligation status with cascade to actions */
window._clSetOblStatus = function(uid, status) {
  if (!window._CL_OBL_STATUS) window._CL_OBL_STATUS = {};
  window._CL_OBL_STATUS[uid] = status;
  if (status === 'Accepted') {
    if (!window._CL_ACT_STATUS) window._CL_ACT_STATUS = {};
    const parts = uid.split('-');
    const clauseId = parts.slice(0, -1).join('-');
    const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
    const cl = allClauses.find(c => c.id === clauseId);
    if (cl) {
      const actRaw = cl.actionables || [];
      const actArr = Array.isArray(actRaw) ? actRaw : typeof actRaw === 'string' ? actRaw.split(';').map(a=>a.trim()).filter(Boolean) : [];
      const count = actArr.length || 4;
      for (let i = 0; i < count; i++) window._CL_ACT_STATUS[`${uid}-${i}`] = 'Accepted';
    }
  }
  /* re-open modal to reflect new state */
  const clauseId2 = uid.split('-').slice(0,-1).join('-');
  const oblIdx2 = parseInt(uid.split('-').pop());
  document.getElementById('cl-obl-eye-modal')?.remove();
  setTimeout(() => clOpenOblEyeModal(uid, clauseId2, oblIdx2), 50);
  showToast(`Obligation ${status.toLowerCase()}.`, 'success');
};

/* Set individual action status */
window._clSetActStatus = function(uid, actIdx, status, btn) {
  if (!window._CL_ACT_STATUS) window._CL_ACT_STATUS = {};
  window._CL_ACT_STATUS[`${uid}-${actIdx}`] = status;
  /* update both buttons in the row */
  const row = btn.closest('tr');
  if (row) {
    const btns = row.querySelectorAll('button');
    btns.forEach(b => {
      const isAcc = b.textContent.trim() === '✓';
      const isRej = b.textContent.trim() === '✗';
      if (isAcc) {
        const active = status === 'Accepted';
        b.style.border = `1px solid ${active ? '#6ee7b7' : '#e5e7eb'}`;
        b.style.background = active ? '#dcfce7' : '#f9fafb';
        b.style.color = active ? '#15803d' : '#6b7280';
      }
      if (isRej) {
        const active = status === 'Rejected';
        b.style.border = `1px solid ${active ? '#fca5a5' : '#e5e7eb'}`;
        b.style.background = active ? '#fee2e2' : '#f9fafb';
        b.style.color = active ? '#dc2626' : '#6b7280';
      }
    });
  }
  showToast(`Action ${status.toLowerCase()}.`, 'success');
};

/* Applicability toggle */
window._clToggleOblApplicability = function(uid) {
  if (!window._CL_OBL_APPLICABILITY) window._CL_OBL_APPLICABILITY = {};
  window._CL_OBL_APPLICABILITY[uid] = !window._CL_OBL_APPLICABILITY[uid];
  showToast('Applicability updated.', 'success');
  /* re-open to reflect */
  const clauseId = uid.split('-').slice(0,-1).join('-');
  const oblIdx = parseInt(uid.split('-').pop());
  document.getElementById('cl-obl-eye-modal')?.remove();
  setTimeout(() => clOpenOblEyeModal(uid, clauseId, oblIdx), 50);
};

/* Applicability reason popup */
window._clShowApplicabilityReason = function(uid, oblId) {
  var ex = document.getElementById('cl-applic-modal'); if(ex) ex.remove();
  const isApp = !window._CL_OBL_APPLICABILITY || window._CL_OBL_APPLICABILITY[uid] !== false;
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-applic-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:480px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-id-chip" style="background:#7c3aed;">${oblId}</span><span class="cl-eye-head-title">Applicability</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-applic-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:20px;display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:${isApp?'#f0fdf4':'#f9fafb'};border:1px solid ${isApp?'#6ee7b7':'#e5e7eb'};border-radius:8px;">
        <span style="font-size:18px;">${isApp?'✓':'—'}</span>
        <div>
          <div style="font-size:13px;font-weight:700;color:${isApp?'#15803d':'#6b7280'};">${isApp?'Applicable':'Not Applicable'}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">${isApp?'This obligation applies to your entity based on the criteria below.':'This obligation has been marked as not applicable.'}</div>
        </div>
      </div>
      ${isApp ? `
      <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:4px;">Why is this applicable?</div>
      <ul style="margin:0;padding:0 0 0 16px;display:flex;flex-direction:column;gap:6px;">
        <li style="font-size:12px;color:#374151;line-height:1.5;">Your entity type matches the regulated category covered by this circular.</li>
        <li style="font-size:12px;color:#374151;line-height:1.5;">The obligation falls within the regulatory scope applicable to your licence type.</li>
        <li style="font-size:12px;color:#374151;line-height:1.5;">The effective date of this obligation is within your current compliance period.</li>
      </ul>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 12px;font-size:11px;color:#92400e;">💡 AI-determined based on entity profile, circular scope, and regulatory metadata.</div>` : ''}
      <div style="display:flex;gap:8px;">
        <button onclick="_clToggleOblApplicability('${uid}');document.getElementById('cl-applic-modal').remove()" style="flex:1;padding:9px;border:1px solid #e5e7eb;border-radius:6px;background:#f9fafb;font-size:12px;font-weight:600;cursor:pointer;">${isApp?'Mark Not Applicable':'Mark Applicable'}</button>
        <button class="cl-eye-regen-btn" onclick="document.getElementById('cl-applic-modal').remove();_clOpenCtxModal('applic_${uid}','Applicability')" style="flex:1;padding:9px;">✦ Regenerate with AI</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};

/* Mapped Obligations popup */
window._clOpenMappedObligations = function(oblId) {
  var ex = document.getElementById('cl-mapped-obl-modal'); if(ex) ex.remove();
  const mockMapped = [
    { clauseId:'CL-2024-01', clauseName:'Quarterly Regulatory Reporting — submission of financial and compliance returns to the designated regulatory authority.', tags:['Reporting','KYC'], status:'Assigned' },
    { clauseId:'CL-2024-02', clauseName:'KYC Maintenance — periodic update and verification of Know Your Customer records across all active customer accounts.', tags:['KYC','AML'], status:'Assigned' },
    { clauseId:'CL-2024-03', clauseName:'Risk Assessment Review — conduct structured internal risk assessment covering operational and compliance risks.', tags:['Risk'], status:'Unassigned' },
  ];
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-mapped-obl-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box cl-eye-box-wide" style="max-width:720px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left">
        <div style="font-size:9px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Mapped Clauses</div>
        <div style="font-size:14px;font-weight:700;color:#1f2937;">${oblId}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="cl-eye-regen-btn">+ Map More Clauses</button>
        <button class="cl-eye-close" onclick="document.getElementById('cl-mapped-obl-modal').remove()">✕</button>
      </div>
    </div>
    <div class="cl-eye-body" style="padding:0;">
      <div style="padding:10px 20px;background:#fffbeb;border-bottom:1px solid #fde68a;font-size:12px;color:#92400e;">⚠ This obligation is mapped to the following clauses.</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">
          <th style="padding:10px 14px;text-align:left;font-weight:700;width:32px;"><input type="checkbox" style="accent-color:#3b82f6;"/></th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Clause ID</th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Clause Name</th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Tags</th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Status</th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Action</th>
        </tr></thead>
        <tbody>
          ${mockMapped.map(m => `
          <tr style="border-bottom:1px solid #f3f4f6;">
            <td style="padding:10px 14px;"><input type="checkbox" style="accent-color:#3b82f6;"/></td>
            <td style="padding:10px 14px;font-family:monospace;font-size:11px;font-weight:700;color:#7c3aed;">${m.clauseId}</td>
            <td style="padding:10px 14px;font-size:11px;color:#374151;max-width:240px;line-height:1.45;">${m.clauseName}</td>
            <td style="padding:10px 14px;">${m.tags.map(t=>`<span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;margin-right:3px;">${t}</span>`).join('')}</td>
            <td style="padding:10px 14px;"><span style="padding:3px 9px;border-radius:10px;font-size:10px;font-weight:700;${m.status==='Assigned'?'background:#dcfce7;color:#15803d;':'background:#fef3c7;color:#b45309;'}">${m.status}</span></td>
            <td style="padding:10px 14px;"><button onclick="this.closest('tr').style.opacity='0.4';showToast('Unmapped.','success')" style="padding:3px 9px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer;">Unmap</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="cl-eye-foot" style="justify-content:space-between;">
      <button style="padding:6px 14px;background:#fee2e2;border:1px solid #fca5a5;border-radius:6px;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;">Unmap Selected</button>
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-mapped-obl-modal').remove()">Close</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};





window._clOpenMappedActions = function(oblId) {
  var ex = document.getElementById('cl-mapped-act-modal'); if(ex) ex.remove();
  const mockMapped = [
    { actId:'ACT-001', actName:'Submit quarterly compliance certificate to regulator within prescribed timelines.', dept:'Compliance', status:'Assigned' },
    { actId:'ACT-002', actName:'Update internal compliance tracking system with obligation completion status.', dept:'Risk', status:'Assigned' },
    { actId:'ACT-003', actName:'Obtain Board sign-off on compliance report for the reporting period.', dept:'Legal', status:'Unassigned' },
  ];
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-mapped-act-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box cl-eye-box-wide" style="max-width:720px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left">
        <div style="font-size:9px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Mapped Actions</div>
        <div style="font-size:14px;font-weight:700;color:#1f2937;">${oblId}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="cl-eye-regen-btn" onclick="_clAddActionPopup()">+ Add Action</button>
        <button class="cl-eye-close" onclick="document.getElementById('cl-mapped-act-modal').remove()">✕</button>
      </div>
    </div>
    <div class="cl-eye-body" style="padding:0;">
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">
          <th style="padding:10px 14px;text-align:left;font-weight:700;width:32px;"><input type="checkbox" style="accent-color:#3b82f6;"/></th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Action ID</th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Action Name</th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Dept</th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Status</th>
          <th style="padding:10px 14px;text-align:left;font-weight:700;">Action</th>
        </tr></thead>
        <tbody>
          ${mockMapped.map(m => `
          <tr style="border-bottom:1px solid #f3f4f6;">
            <td style="padding:10px 14px;"><input type="checkbox" style="accent-color:#3b82f6;"/></td>
            <td style="padding:10px 14px;font-family:monospace;font-size:11px;font-weight:700;color:#2563eb;">${m.actId}</td>
            <td style="padding:10px 14px;font-size:11px;color:#374151;max-width:240px;line-height:1.45;">${m.actName}</td>
            <td style="padding:10px 14px;"><span style="background:#eff6ff;color:#2563eb;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;">${m.dept}</span></td>
            <td style="padding:10px 14px;"><span style="padding:3px 9px;border-radius:10px;font-size:10px;font-weight:700;${m.status==='Assigned'?'background:#dcfce7;color:#15803d;':'background:#fef3c7;color:#b45309;'}">${m.status}</span></td>
            <td style="padding:10px 14px;"><button onclick="this.closest('tr').style.opacity='0.4';showToast('Unlinked.','success')" style="padding:3px 9px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer;">Unlink</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="cl-eye-foot" style="justify-content:space-between;">
      <button style="padding:6px 14px;background:#fee2e2;border:1px solid #fca5a5;border-radius:6px;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;">Unlink Selected</button>
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-mapped-act-modal').remove()">Close</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};

window.clSaveOblEye = function (uid, oblIdx) {
  if (!window._CL_OBL_STATUS) window._CL_OBL_STATUS = {};
  const status = document.getElementById(`cl-obl-eye-status-${uid}`)?.value || '';
  window._CL_OBL_STATUS[uid] = status;
  document.getElementById('cl-obl-eye-modal')?.remove();
  showToast('Obligation details saved.', 'success');
  /* Update status pill in the obligation header */
  const header = document.getElementById(`cl-oblig-${uid}`)?.querySelector('.cl-oblig-hdr-icons');
  if (header && status) {
    let pill = header.querySelector('.cl-row-status-pill');
    if (!pill) { pill = document.createElement('span'); pill.className = 'cl-row-status-pill'; header.prepend(pill); }
    pill.textContent = status;
    pill.className = `cl-row-status-pill ${status === 'Accepted' ? 'cl-status-accepted' : status === 'Rejected' ? 'cl-status-rejected' : 'cl-status-review'}`;
  }
};

/* ── ACTION EYE MODAL */
window.clOpenActionEyeModal = function (uid, actIdx, clauseId) {
  const allClauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
  const cl = allClauses.find(c => c.id === clauseId);
  const actionsRaw = cl?.actionables || [];
  const actionsArray = Array.isArray(actionsRaw) ? actionsRaw
    : typeof actionsRaw === 'string' ? actionsRaw.split(';').map(a => a.trim()).filter(Boolean) : [];
  const MOCK_ACTS = ['Draft or update the compliance policy','Present policy to Board for formal approval','Distribute updated policy to all departments','Schedule annual review and assign policy owner','Identify all staff roles impacted','Design training module covering key requirements'];
  const acts = actionsArray.length ? actionsArray : MOCK_ACTS;
  const action = acts[actIdx] || acts[0] || '';
  const m = _clObligMeta(actIdx);
  const currentStatus = window._CL_ACT_STATUS?.[`${uid}-${actIdx}`] || '';
  const actId = `ACT-${clauseId}-${uid.split('-').pop()}-${actIdx+1}`;
  const isApplicable = !window._CL_ACT_APPLICABILITY || window._CL_ACT_APPLICABILITY[`${uid}-${actIdx}`] !== false;
  const actDept = window._CL_ACT_DEPT?.[`${uid}-${actIdx}`] || cl?.department || '';

  const EV = [
    { icon: '📋', name: 'Compliance Policy Document', type: 'Policy', source: 'Internal Repository', needed: 'Board-approved policy covering this compliance area, reviewed and signed off by senior management.', priority: 'Required' },
    { icon: '🔍', name: 'Internal Audit Report', type: 'Audit Record', source: 'Internal Audit Dept', needed: 'Audit findings confirming that controls are designed adequately and operating effectively.', priority: 'Required' },
    { icon: '🎓', name: 'Staff Training Completion Record', type: 'Training Record', source: 'HR System', needed: 'Completion records for all relevant staff showing training within the mandated timeline.', priority: 'Required' },
    { icon: '💻', name: 'System Audit Trail / Access Log', type: 'System Log', source: 'IT Department', needed: 'System-generated logs demonstrating that automated controls are functioning as intended.', priority: 'Recommended' },
    { icon: '🏛️', name: 'Board Resolution / Meeting Minutes', type: 'Board Record', source: 'Company Secretary', needed: 'Formal board-level approval documented in meeting minutes or a signed resolution.', priority: 'Required' },
  ];
  const ev = EV[actIdx % EV.length];

  /* obligation details from parent */
  const oblsRaw = cl?.obligations || cl?.obligation || null;
  const oblsArr = Array.isArray(oblsRaw) ? oblsRaw : oblsRaw ? [oblsRaw] : [];
  const parentOblText = oblsArr[parseInt(uid.split('-').pop())]
    ? (typeof oblsArr[parseInt(uid.split('-').pop())] === 'string' ? oblsArr[parseInt(uid.split('-').pop())] : oblsArr[parseInt(uid.split('-').pop())]?.text || '')
    : (oblsArr[0] ? (typeof oblsArr[0] === 'string' ? oblsArr[0] : oblsArr[0]?.text || '') : '');

  let modal = document.getElementById('cl-act-eye-modal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'cl-act-eye-modal';
  modal.className = 'cl-eye-overlay';

  const sectionStyle = (bg, border) => `padding:16px 20px;border-bottom:1px solid ${border};background:${bg};`;
  const fieldStyle = `background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;`;
  const labelStyle = `font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:4px;`;
  const inputStyle = `width:100%;padding:7px 10px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:12px;font-family:inherit;outline:none;color:#1f2937;background:#fff;`;

  modal.innerHTML = `
  <div class="cl-eye-box cl-eye-box-wide" style="max-width:700px;max-height:92vh;" onclick="event.stopPropagation()">

    <!-- ── CARD HEADER ── -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:16px 20px;border-bottom:2px solid #e0e7ff;background:linear-gradient(135deg,#eff6ff 0%,#f5f3ff 100%);flex-shrink:0;">
      <div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-family:monospace;font-size:11px;font-weight:700;color:#fff;background:#2563eb;padding:3px 10px;border-radius:5px;">${actId}</span>
          <span onclick="_clShowActApplicabilityReason('${uid}',${actIdx},'${actId}')" style="font-size:9px;font-weight:700;padding:2px 9px;border-radius:10px;cursor:pointer;${isApplicable?'background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;':'background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;'}">${isApplicable?'✓ Applicable':'— Not Applicable'}</span>
        </div>
        <div style="font-size:13px;font-weight:600;color:#1e2433;line-height:1.45;max-width:500px;">${action}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <!-- THREE DOTS -->
        <div style="position:relative;" id="cl-act-dots-${uid}-${actIdx}">
          <button onclick="event.stopPropagation();document.getElementById('cl-act-dots-${uid}-${actIdx}').classList.toggle('cl-open')" style="width:30px;height:30px;border-radius:8px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:16px;display:inline-flex;align-items:center;justify-content:center;color:#6b7280;">⋮</button>
          <div id="cl-act-dots-menu-${uid}-${actIdx}" style="display:none;position:absolute;right:0;top:calc(100% + 4px);background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.15);min-width:190px;z-index:700;overflow:hidden;">
            <div style="padding:5px 12px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid #f3f4f6;">Options</div>
            <button onclick="event.stopPropagation();document.getElementById('cl-act-dots-${uid}-${actIdx}').classList.remove('cl-open');clActEnableEdit('${uid}',${actIdx})" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'"><span>✎</span> Edit Fields</button>
            <button onclick="event.stopPropagation();document.getElementById('cl-act-dots-${uid}-${actIdx}').classList.remove('cl-open');_clOpenCtxModal('action_${uid}_${actIdx}','Action ${actIdx+1}')" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#7c3aed;cursor:pointer;" onmouseover="this.style.background='#f5f3ff'" onmouseout="this.style.background='none'"><span>✦</span> Regenerate with AI</button>
            <button onclick="event.stopPropagation();document.getElementById('cl-act-dots-${uid}-${actIdx}').classList.remove('cl-open');_clToggleActApplicability('${uid}',${actIdx})" style="display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'"><span>◎</span> Toggle Applicability</button>
          </div>
        </div>
        <button class="cl-eye-close" onclick="document.getElementById('cl-act-eye-modal').remove()">✕</button>
      </div>
    </div>

    <!-- ── SCROLLABLE BODY ── -->
    <div style="flex:1;overflow-y:auto;max-height:75vh;">

      <!-- ACTION DETAILS SECTION -->
      <div style="${sectionStyle('#fafbff','#dbeafe')}">
        <div style="font-size:10px;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
          <span style="width:3px;height:14px;background:#2563eb;border-radius:2px;display:inline-block;"></span>
          Action Details
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">
          <div style="${fieldStyle}">
            <label style="${labelStyle}">Internal Due Date</label>
            <input id="cl-act-intdue-${uid}-${actIdx}" class="cl-eye-disabled" value="2025-02-12" disabled type="date" style="${inputStyle}background:#f9fafb;"/>
          </div>
          <div style="${fieldStyle}">
            <label style="${labelStyle}">External Due Date</label>
            <input id="cl-act-extdue-${uid}-${actIdx}" class="cl-eye-disabled" disabled value="2025-03-12" type="date" style="${inputStyle}background:#f9fafb;"/>
          </div>
          <div style="${fieldStyle}">
            <label style="${labelStyle}">Frequency</label>
            <input id="cl-act-freq-inp-${uid}-${actIdx}" class="cl-eye-disabled" disabled value="${m.frequency}" style="${inputStyle}background:#f9fafb;"/>
          </div>
          <div style="${fieldStyle}">
            <label style="${labelStyle}">Section</label>
            <input id="cl-act-sec-${uid}-${actIdx}" class="cl-eye-disabled" disabled value="${m.section}" style="${inputStyle}background:#f9fafb;"/>
          </div>
          <div style="${fieldStyle}">
            <label style="${labelStyle}">Department</label>
            <div style="display:flex;gap:6px;align-items:center;">
              <input id="cl-act-dept-inp-${uid}-${actIdx}" class="cl-eye-disabled" disabled value="${actDept}" placeholder="Click to select" style="${inputStyle}background:#f9fafb;flex:1;" readonly/>
              <button onclick="_clPickActDept('${uid}-${actIdx}')" style="padding:5px 9px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:5px;font-size:11px;font-weight:700;color:#2563eb;cursor:pointer;white-space:nowrap;">+ Dept</button>
            </div>
          </div>
          <div style="${fieldStyle}">
            <label style="${labelStyle}">Compliance Status</label>
            <select onchange="_clSetActStatusBtn('${uid}',${actIdx},this.value)" style="width:100%;padding:7px 10px;border:1.5px solid ${currentStatus==='Accepted'?'#6ee7b7':currentStatus==='Rejected'?'#fca5a5':'#e5e7eb'};border-radius:6px;font-size:12px;font-weight:700;background:${currentStatus==='Accepted'?'#dcfce7':currentStatus==='Rejected'?'#fee2e2':'#fff'};color:${currentStatus==='Accepted'?'#15803d':currentStatus==='Rejected'?'#dc2626':'#6b7280'};cursor:pointer;outline:none;" id="cl-act-status-sel-${uid}-${actIdx}">
              <option value="" ${!currentStatus?'selected':''}>— Set Status —</option>
              <option value="Accepted" ${currentStatus==='Accepted'?'selected':''}>✓ Accepted</option>
              <option value="Under Review" ${currentStatus==='Under Review'?'selected':''}>⟳ Under Review</option>
              <option value="Rejected" ${currentStatus==='Rejected'?'selected':''}>✗ Rejected</option>
            </select>
          </div>
        </div>
       
      </div>

      <!-- OBLIGATION DETAILS SECTION — collapsible accordion -->
      <div style="border-bottom:1px solid #fde68a;background:#fefce8;">
        <div onclick="var el=document.getElementById('cl-act-obl-body-${uid}-${actIdx}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;">
          <div style="font-size:10px;font-weight:800;color:#b45309;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#f59e0b;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▶</span> Parent Obligation Details
          </div>
        </div>
        <div id="cl-act-obl-body-${uid}-${actIdx}" style="display:none;padding:0 20px 14px;">
          <div style="background:#fff;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;">
            <div style="font-size:11px;font-weight:600;color:#92400e;line-height:1.6;">${parentOblText || 'Obligation details from parent clause.'}</div>
          </div>
        </div>
      </div>

      <!-- EXTRACTED CLAUSE DESCRIPTION -->
      <div style="${sectionStyle('#f0fdf4','#bbf7d0')}">
        <div onclick="var el=document.getElementById('cl-act-clause-body-${uid}-${actIdx}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;">
          <div style="font-size:10px;font-weight:800;color:#15803d;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#22c55e;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▶</span> Extracted Clause Description
          </div>
        </div>
        <div id="cl-act-clause-body-${uid}-${actIdx}" style="display:none;margin-top:12px;">
          <div style="background:#fff;border:1px solid #bbf7d0;border-radius:8px;padding:12px 14px;">
            <div style="font-size:10px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">Clause Text</div>
            <div style="font-size:13px;color:#1f2937;line-height:1.7;">${cl?.text || 'The entity shall ensure compliance with all reporting requirements as specified under the relevant circular.'}</div>
          </div>
        </div>
      </div>

      <!-- REGULATORY DETAILS -->
      <div style="${sectionStyle('#faf5ff','#e9d5ff')}">
        <div onclick="var el=document.getElementById('cl-act-reg-body-${uid}-${actIdx}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;">
          <div style="font-size:10px;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#7c3aed;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▼</span> Regulatory Details
          </div>
        </div>
        <div id="cl-act-reg-body-${uid}-${actIdx}" style="display:block;margin-top:12px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${[
              ['Regulatory Body','RBI'],
              ['Category', m.category],
              ['Section', m.section],
              ['Sub-Section', m.subset],
            ].map(([l,v]) => `<div style="background:#fff;border:1px solid #e9d5ff;border-radius:6px;padding:9px 12px;">
              <div style="font-size:9px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;">${l}</div>
              <div style="font-size:12px;font-weight:600;color:#1f2937;">${v}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- EVIDENCE SECTION — collapsed by default -->
      <div style="border-bottom:1px solid #fde68a;background:#fffbeb;">
        <div onclick="var el=document.getElementById('cl-act-ev-body-${uid}-${actIdx}');el.style.display=el.style.display==='none'?'block':'none';this.querySelector('.cl-macc-arr').textContent=el.style.display==='none'?'▶':'▼';" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;">
          <div style="font-size:10px;font-weight:800;color:#b45309;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:6px;">
            <span style="width:3px;height:14px;background:#f59e0b;border-radius:2px;display:inline-block;"></span>
            <span class="cl-macc-arr">▶</span> Evidence Required
          </div>
          <span style="background:#fef9c3;color:#92400e;padding:2px 9px;border-radius:10px;font-size:9px;font-weight:700;border:1px solid #fde68a;">💡 AI Suggested</span>
        </div>
        <div id="cl-act-ev-body-${uid}-${actIdx}" style="display:none;padding:0 20px 16px;">
        <div style="background:#fff;border:1px solid #fde68a;border-radius:10px;overflow:hidden;">
          <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-bottom:1px solid #fef9c3;">
            <span style="font-size:24px;flex-shrink:0;">${ev.icon}</span>
            <div style="flex:1;">
              <div style="font-size:13px;font-weight:700;color:#1f2937;margin-bottom:3px;">${ev.name}</div>
              <div style="font-size:11px;color:#6b7280;margin-bottom:6px;">${ev.type} · ${ev.source}</div>
              <div style="font-size:12px;color:#374151;line-height:1.6;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:9px 12px;">${ev.needed}</div>
            </div>
            <span style="padding:3px 9px;border-radius:10px;font-size:10px;font-weight:700;flex-shrink:0;${ev.priority==='Required'?'background:#fee2e2;color:#dc2626;':'background:#fef3c7;color:#b45309;'}">${ev.priority}</span>
         </div>
          <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:11px;color:#9ca3af;">AI-suggested based on action type and regulatory context</span>
            <button onclick="_clOpenCtxModal('evidence_${uid}_${actIdx}','Evidence for Action ${actIdx+1}')" style="padding:4px 12px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;font-size:11px;font-weight:700;color:#b45309;cursor:pointer;">✦ Refine with AI</button>
          </div>
        </div>
        </div><!-- close cl-act-ev-body -->
      </div>

    <div class="cl-eye-foot" style="border-top:2px solid #e5e7eb;">
      <span style="font-size:11px;color:#9ca3af;" id="cl-act-footnote-${uid}-${actIdx}">Click ⋮ to edit or regenerate.</span>
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-act-eye-modal').remove()">Close</button>
    </div>
  </div>`;

  modal.addEventListener('click', e => {
    const dotsWrap = document.getElementById(`cl-act-dots-${uid}-${actIdx}`);
    if (dotsWrap && !dotsWrap.contains(e.target)) dotsWrap.classList.remove('cl-open');
    if (e.target === modal) modal.remove();
  });
  document.body.appendChild(modal);

  /* wire three-dots menu */
  const actDotsWrap = document.getElementById(`cl-act-dots-${uid}-${actIdx}`);
  const actDotsMenu = document.getElementById(`cl-act-dots-menu-${uid}-${actIdx}`);
  if (actDotsWrap && actDotsMenu) {
    new MutationObserver(() => {
      actDotsMenu.style.display = actDotsWrap.classList.contains('cl-open') ? 'block' : 'none';
    }).observe(actDotsWrap, {attributes:true, attributeFilter:['class']});
  }
  /* close dots on outside click */
  modal.addEventListener('click', e => {
    const dw = document.getElementById(`cl-act-dots-${uid}-${actIdx}`);
    if (dw && !dw.contains(e.target)) dw.classList.remove('cl-open');
    if (e.target === modal) modal.remove();
  });
};
window._clSetActStatusBtn = function(uid, actIdx, status) {
  if (!window._CL_ACT_STATUS) window._CL_ACT_STATUS = {};
  window._CL_ACT_STATUS[`${uid}-${actIdx}`] = status;
  /* update the select dropdown styling */
  const sel = document.getElementById(`cl-act-status-sel-${uid}-${actIdx}`);
  if (sel) {
    sel.style.borderColor = status==='Accepted'?'#6ee7b7':status==='Rejected'?'#fca5a5':'#e5e7eb';
    sel.style.background  = status==='Accepted'?'#dcfce7':status==='Rejected'?'#fee2e2':'#fff';
    sel.style.color       = status==='Accepted'?'#15803d':status==='Rejected'?'#dc2626':'#6b7280';
  }
  showToast(status ? `Action ${status.toLowerCase()}.` : 'Status cleared.', 'success');
  if (window._CL_ACTIVE_SECTION_CLAUSES?.length) _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
};

window._clToggleActApplicability = function(uid, actIdx) {
  if (!window._CL_ACT_APPLICABILITY) window._CL_ACT_APPLICABILITY = {};
  const key = `${uid}-${actIdx}`;
  window._CL_ACT_APPLICABILITY[key] = !window._CL_ACT_APPLICABILITY[key];
  showToast('Applicability updated.', 'success');
  const clauseId = uid.split('-').slice(0,-1).join('-');
  document.getElementById('cl-act-eye-modal')?.remove();
  setTimeout(() => clOpenActionEyeModal(uid, actIdx, clauseId), 50);
};

window._clShowActApplicabilityReason = function(uid, actIdx, actId) {
  const isApp = !window._CL_ACT_APPLICABILITY || window._CL_ACT_APPLICABILITY[`${uid}-${actIdx}`] !== false;
  var ex = document.getElementById('cl-act-applic-modal'); if(ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-act-applic-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:440px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-id-chip" style="background:#2563eb;">${actId}</span><span class="cl-eye-head-title">Applicability</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-act-applic-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:20px;display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:${isApp?'#f0fdf4':'#f9fafb'};border:1px solid ${isApp?'#6ee7b7':'#e5e7eb'};border-radius:8px;">
        <span style="font-size:18px;">${isApp?'✓':'—'}</span>
        <div>
          <div style="font-size:13px;font-weight:700;color:${isApp?'#15803d':'#6b7280'};">${isApp?'Applicable':'Not Applicable'}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">${isApp?'This action applies to your entity.':'This action has been marked as not applicable.'}</div>
        </div>
      </div>
      ${isApp ? `
      <ul style="margin:0;padding:0 0 0 16px;display:flex;flex-direction:column;gap:6px;">
        <li style="font-size:12px;color:#374151;line-height:1.5;">The parent obligation is applicable to your entity type.</li>
        <li style="font-size:12px;color:#374151;line-height:1.5;">This action falls within the compliance scope for your licence category.</li>
        <li style="font-size:12px;color:#374151;line-height:1.5;">No exemption criteria apply for this specific action item.</li>
      </ul>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 12px;font-size:11px;color:#92400e;">💡 AI-determined from entity profile and action-level regulatory metadata.</div>` : ''}
      <div style="display:flex;gap:8px;">
        <button onclick="_clToggleActApplicability('${uid}',${actIdx});document.getElementById('cl-act-applic-modal').remove()" style="flex:1;padding:9px;border:1px solid #e5e7eb;border-radius:6px;background:#f9fafb;font-size:12px;font-weight:600;cursor:pointer;">${isApp?'Mark Not Applicable':'Mark Applicable'}</button>
        <button class="cl-eye-regen-btn" onclick="document.getElementById('cl-act-applic-modal').remove();_clOpenCtxModal('applic_act_${uid}_${actIdx}','Action Applicability')" style="flex:1;padding:9px;">✦ Regenerate</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};
window.clActEnableEdit = function (uid, actIdx) {
  const modal = document.getElementById('cl-act-eye-modal');
  if (!modal) return;
  modal.querySelectorAll('.cl-eye-disabled').forEach(el => {
    el.disabled = false;
    el.classList.remove('cl-eye-disabled');
    el.style.background = '#fff';
    el.style.border = '1.5px solid #3b82f6';
    el.style.cursor = 'auto';
  });
  const note = document.getElementById(`cl-act-footnote-${uid}-${actIdx}`);
  if (note) note.textContent = '✏️ Fields are now editable. Changes apply on close.';
  showToast('Action fields are now editable.', 'info');
};

window.clSaveActionEye = function (uid, actIdx) {
  if (!window._CL_ACT_STATUS) window._CL_ACT_STATUS = {};
  const status = document.getElementById(`cl-act-status-${uid}-${actIdx}`)?.value || '';
  window._CL_ACT_STATUS[`${uid}-${actIdx}`] = status;
  document.getElementById('cl-act-eye-modal')?.remove();
  showToast('Action details saved.', 'success');
  /* Re-render so badge appears immediately */
  if (window._CL_ACTIVE_SECTION_CLAUSES?.length)
    _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
};

/* Toggle inline clause expansion */
function _clToggleInlineExpand(clauseId, allClauses) {
  const row = document.getElementById(`cl-row-${clauseId}`);
  const expand = document.getElementById(`cl-expand-${clauseId}`);
  const arr = document.getElementById(`cl-rowarr-${clauseId}`);
  if (!row || !expand) return;

  const isOpen = row.classList.contains('cl-row-expanded');

  /* Close all */
  document.querySelectorAll('.cl-clause-row').forEach(r => r.classList.remove('cl-row-expanded'));
  document.querySelectorAll('.cl-inline-expand').forEach(e => { e.style.display = 'none'; });
  document.querySelectorAll('.cl-row-arrow').forEach(a => a.classList.remove('open'));

  if (!isOpen) {
    row.classList.add('cl-row-expanded');
    expand.style.display = 'block';
    if (arr) arr.classList.add('open');
    window._CL_ACTIVE_EXPANDED_CLAUSE = clauseId;
    const cl = allClauses.find(c => c.id === clauseId);
    if (cl) _clBuildExpand(expand, cl, window._CL_ACTIVE_CIRC);
  }
}

/* ─────────────────────────────────────── INLINE EXPAND (L2)
   Tab row shows: [Text & Info] [Obligations]
   SAME tab row ALSO shows on the right: dept badge, risk badge, ⓘ, ✦ star icon
   Actions tab REMOVED — actions live inside the Obligations accordion body
*/
function _clBuildExpand(el, cl, circ) {
   const activeLevel = document.querySelector('.cl-lvl-btn.active')?.dataset.level || '2';
  const level = activeLevel;
  const riskCls = cl.risk === 'High' ? 'cl-wc-risk-high' : cl.risk === 'Medium' ? 'cl-wc-risk-medium' : 'cl-wc-risk-low';
  const metaId = `cl-meta-expand-${cl.id}`;

  
  el.innerHTML = `
  <div class="cl-expand-wrap">
    <!-- TAB ROW: hidden on L2 -->
    <div class="cl-expand-tabrow" id="cl-etabs-${cl.id}" style="display:none;">
      <div class="cl-expand-tabs-left">
        <button class="cl-etab active" data-ti="0">Text &amp; Info</button>
        <button class="cl-etab" data-ti="1">${level === '2' ? 'Actions' : 'Obligations'}</button>
      </div>
      <div class="cl-expand-tabs-right">
        ${cl.risk ? `<span class="cl-wc-badge ${riskCls}">${cl.risk}</span>` : ''}
        ${cl.department ? `<span class="cl-wc-badge cl-wc-dept">${cl.department}</span>` : ''}
        ${cl.pageNo ? `<button class="cl-wc-page-chip" onclick="clOpenDocPage(${cl.pageNo})">📄 Page ${cl.pageNo}</button>` : ''}
        <button class="cl-wc-info-btn" data-meta="${metaId}" title="Regulatory details">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </button>
        <button class="cl-wc-regen-btn cl-wc-star-btn" onclick="_clOpenCtxModal('clause_${cl.id}','Clause ${cl.id}')" title="Add Business Context">✦</button>
      </div>
    </div>

    <!-- METADATA TABLE (hidden until ⓘ clicked) — sits just below tab row, spans full width -->
    <div class="cl-meta-table-wrap" id="${metaId}" style="display:none;">
      <div class="cl-meta-table-inner">
        ${_clMetaFields(_clMockDetailMeta(0)).map(f => `
        <div class="cl-meta-row">
          <span class="cl-meta-label">${f.label}</span>
          <span class="cl-meta-value">${f.value}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="cl-expand-body" id="cl-ebody-${cl.id}">
      <div class="cl-expand-panel" data-panel="0" style="display:none;">${_clBuildTextPanel(cl, circ)}</div>
      <div class="cl-expand-panel" data-panel="1">${_clBuildOblPanel(cl, level)}</div>
    </div>
  </div>`;

  /* Tab switching */
  el.querySelectorAll('.cl-etab').forEach(tab => {
    tab.addEventListener('click', function () {
      el.querySelectorAll('.cl-etab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      el.querySelectorAll('.cl-expand-panel').forEach((p, i) => {
        p.style.display = parseInt(this.dataset.ti) === i ? '' : 'none';
      });
    });
  });

  /* ⓘ metadata toggle */
  el.querySelectorAll('.cl-wc-info-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const metaEl = document.getElementById(this.dataset.meta);
      if (!metaEl) return;
      const vis = metaEl.style.display !== 'none';
      metaEl.style.display = vis ? 'none' : 'block';
      this.classList.toggle('cl-wc-info-btn-active', !vis);
    });
  });

  /* Obligation accordions — L3: full row click opens body; L2: ⓘ button only opens meta strip */
  
  el.querySelectorAll('.cl-oblig-item').forEach(item => {
    const trigger = item.querySelector('.cl-oblig-header');
    const body = item.querySelector('.cl-oblig-body');
    const arrow = item.querySelector('.cl-oblig-arr');
    const metaToggleBtn = item.querySelector('.cl-oblig-meta-toggle-btn');
    if (!trigger || !body) return;

    /* Always wire the header click to open/close body — both L2 and L3 */
  trigger.addEventListener('click', (e) => {
    /* Don't fire if clicking the eye btn or edit btn */
    if (e.target.closest('.cl-obl-eye-btn') || e.target.closest('.cl-oblig-edit-btn')) return;
    const uid = item.id.replace('cl-oblig-', '');
    const metaEl = document.getElementById(`cl-oblig-meta-${uid}`);
    const open = body.classList.contains('open');
    el.querySelectorAll('.cl-oblig-body.open').forEach(b => b.classList.remove('open'));
    el.querySelectorAll('.cl-oblig-arr.rotated').forEach(a => a.classList.remove('rotated'));
    el.querySelectorAll('.cl-oblig-meta-strip.cl-meta-strip-open').forEach(s => s.classList.remove('cl-meta-strip-open'));
    if (!open) {
      body.classList.add('open');
      arrow?.classList.add('rotated');
      if (activeLevel === '3') metaEl?.classList.add('cl-meta-strip-open');
    }
  });

    if (activeLevel === '2' && metaToggleBtn) {
      metaToggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        const uid = metaToggleBtn.dataset.uid;
        const metaEl = document.getElementById(`cl-oblig-meta-${uid}`);
        if (!metaEl) return;
        const open = metaEl.classList.contains('cl-meta-strip-open');
        el.querySelectorAll('.cl-oblig-meta-strip.cl-meta-strip-open').forEach(s => s.classList.remove('cl-meta-strip-open'));
        el.querySelectorAll('.cl-oblig-meta-toggle-btn.active').forEach(b => b.classList.remove('active'));
        if (!open) { metaEl.classList.add('cl-meta-strip-open'); metaToggleBtn.classList.add('active'); }
      });
    }
  });

  /* Obligation inline edit — pen button */
  el.querySelectorAll('.cl-oblig-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const uid = btn.dataset.uid;
      document.getElementById(`cl-oblig-view-${uid}`).style.display = 'none';
      document.getElementById(`cl-oblig-edit-${uid}`).style.display = 'block';
      document.getElementById(`cl-oblig-editbar-${uid}`).style.display = 'flex';
      btn.style.display = 'none';
      document.getElementById(`cl-oblig-edit-${uid}`).focus();
    });
  });
  el.querySelectorAll('.cl-oblig-edit-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      document.getElementById(`cl-oblig-view-${uid}`).style.display = 'block';
      document.getElementById(`cl-oblig-edit-${uid}`).style.display = 'none';
      document.getElementById(`cl-oblig-editbar-${uid}`).style.display = 'none';
      document.getElementById(`cl-oblig-editbtn-${uid}`).style.display = 'inline-flex';
    });
  });
  el.querySelectorAll('.cl-oblig-edit-save').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      const ta = document.getElementById(`cl-oblig-edit-${uid}`);
      const view = document.getElementById(`cl-oblig-view-${uid}`);
      if (view && ta) view.textContent = ta.value;
      view.style.display = 'block'; ta.style.display = 'none';
      document.getElementById(`cl-oblig-editbar-${uid}`).style.display = 'none';
      document.getElementById(`cl-oblig-editbtn-${uid}`).style.display = 'inline-flex';
      showToast('Obligation updated.', 'success');
    });
  });

  /* Action ⓘ toggle */
  el.querySelectorAll('.cl-action-info-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const panel = document.getElementById(btn.dataset.panel);
      if (!panel) return;
      const open = panel.classList.contains('open');
      el.querySelectorAll('.cl-action-meta-panel.open').forEach(p => p.classList.remove('open'));
      el.querySelectorAll('.cl-action-info-btn.active').forEach(b => b.classList.remove('active'));
      if (!open) { panel.classList.add('open'); btn.classList.add('active'); }
    });
  });

  /* Evidence buttons */
  el.querySelectorAll('.cl-ev-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      try {
        const acts = JSON.parse(atob(this.dataset.actions));
        clShowEvidenceModal(this.dataset.clauseId, acts, this.dataset.obligation);
      } catch (e) { showToast('Error.', 'error'); }
    });
  });
}

/* ─────────────────────────────────────── TAB 1: TEXT & INFO
   No footer "Regen with AI Context" button
   Full clause text only
*/
function _clBuildTextPanel(cl, circ) {
  return `
  <div class="cl-text-panel">
    <div class="cl-tp-text">${cl.text || ''}</div>
  </div>`;
}

/* ─────────────────────────────────────── TAB 2: OBLIGATIONS
   Each obligation header row (one line):
     [O1 num] [obligation text preview — truncated]  [✎ pen] [🔍 search/evidence] [✦ star] [▾ expand]
   NO dept/page chips in header.
   When expanded: meta strip → then actions (NO repeated obl text, NO regen-with-AI btn)
*/
function _clBuildOblPanel(cl, level) {
  level = level || document.querySelector('.cl-lvl-btn.active')?.dataset.level || '2';
  const obligsRaw = cl.obligations || cl.obligation || null;
  const actionsRaw = cl.actionables || [];
  const obligsArray = Array.isArray(obligsRaw) ? obligsRaw
    : typeof obligsRaw === 'string' ? [obligsRaw] : null;
  const actionsArray = Array.isArray(actionsRaw) ? actionsRaw
    : typeof actionsRaw === 'string' ? actionsRaw.split(';').map(a => a.trim()).filter(Boolean) : [];

  const MOCK_OBL = [
    { text: 'Establish and maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.', actions: ['Draft or update the compliance policy', 'Present policy to Board for formal approval', 'Distribute updated policy to all departments', 'Schedule annual review and assign policy owner'] },
    { text: 'All relevant staff must complete mandatory training on obligations under this circular within 60 days of the effective date.', actions: ['Identify all staff roles impacted', 'Design training module covering key requirements', 'Track completion records in HR system', 'Conduct re-training annually or upon material amendment'] },
    { text: 'The entity shall implement robust internal controls and conduct periodic testing to verify operational effectiveness.', actions: ['Map all processes to control owners', 'Design control tests and document methodology', 'Execute quarterly control testing', 'Escalate control failures to senior management within 5 business days'] },
  ];

  const obligs = obligsArray
    ? obligsArray.map((ob) => ({
        text: typeof ob === 'string' ? ob : (ob.text || '—'),
        actions: actionsArray
      }))
    : MOCK_OBL;

  if (!obligs.length)
    return '<div class="cl-oblig-empty">No obligations found.</div>';

  return `<div class="cl-oblig-list">
  <span class="cl-actions-title">Obligations</span>
    ${obligs.map((ob, oi) => {
      const m = _clObligMeta(oi);
      const uid = `${cl.id}-${oi}`;
      const actList = ob.actions || actionsArray;
      const previewText = ob.text.substring(0, 80) + (ob.text.length > 80 ? '…' : '');
      return `
      <div class="cl-oblig-item" id="cl-oblig-${uid}">
       

        <!-- HEADER: one single row — num | text preview | status | eye icon | expand -->
        <div class="cl-oblig-header">
          <span class="cl-oblig-num">${level === '2' ? 'A' : 'O'}${oi + 1}</span>
          <span class="cl-oblig-preview" id="cl-oblig-view-${uid}">${previewText}</span>
          <div class="cl-oblig-hdr-icons">
            ${(window._CL_OBL_APPLICABILITY?.[uid] === false)
              ? `<span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px;background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;cursor:pointer;" onclick="event.stopPropagation();_clShowApplicabilityReason('${uid}','OBL-${cl.id}-${oi+1}')">N/A</span>`
              : `<span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px;background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;cursor:pointer;" onclick="event.stopPropagation();_clShowApplicabilityReason('${uid}','OBL-${cl.id}-${oi+1}')">⊕</span>`
            }
            ${(window._CL_OBL_STATUS?.[uid]) ? `<span class="cl-row-status-pill ${window._CL_OBL_STATUS[uid] === 'Accepted' ? 'cl-status-accepted' : window._CL_OBL_STATUS[uid] === 'Rejected' ? 'cl-status-rejected' : 'cl-status-review'}">${window._CL_OBL_STATUS[uid]}</span>` : ''}
            <button class="cl-oblig-icon-btn cl-obl-eye-btn" onclick="event.stopPropagation();clOpenOblEyeModal('${uid}','${cl.id}',${oi})" title="View obligation details">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            ${level === '3'
              ? `<span class="cl-oblig-arr" title="Expand">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </span>`
              : ''
            }
          </div>
        </div>

        <!-- Inline edit area (hidden by default) -->
        <textarea class="cl-oblig-edit-ta" id="cl-oblig-edit-${uid}" style="display:none;">${ob.text}</textarea>
        <div class="cl-oblig-editbar" id="cl-oblig-editbar-${uid}" style="display:none;">
          <button class="cl-oblig-edit-cancel" data-uid="${uid}">Cancel</button>
          <button class="cl-oblig-edit-save" data-uid="${uid}">Save</button>
        </div>

        <!-- Meta strip: outside body so L2 ⓘ can show it independently -->
       

        <!-- Accordion body: actions only -->
        <div class="cl-oblig-body" id="cl-oblig-body-${uid}">

          ${actList.length && document.querySelector('.cl-lvl-btn.active')?.dataset.level === '3' ? `
          <div class="cl-actions-wrap">
            <div class="cl-actions-title">
              <span>Actions</span>
              <span class="cl-actions-badge">${actList.length}</span>
            </div>
            <div class="cl-actions-list">
              ${actList.map((a, ai) => {
                const m2 = _clObligMeta(ai);
                const panelId = `cl-act-meta-${uid}-${ai}`;
                return `
                <div class="cl-action-item">
                  <div class="cl-action-main-row">
                    <span class="cl-action-num">${ai + 1}</span>
                    <span class="cl-action-text">${a}</span>
                    <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
                      ${(window._CL_ACT_STATUS?.[`${uid}-${ai}`]) ? `<span class="cl-row-status-pill ${window._CL_ACT_STATUS[`${uid}-${ai}`] === 'Accepted' ? 'cl-status-accepted' : window._CL_ACT_STATUS[`${uid}-${ai}`] === 'Rejected' ? 'cl-status-rejected' : 'cl-status-review'}">${window._CL_ACT_STATUS[`${uid}-${ai}`]}</span>` : ''}
                      <button class="cl-act-eye-btn" onclick="event.stopPropagation();clOpenActionEyeModal('${uid}',${ai},'${cl.id}')" title="View action details">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

/* ─────────────────────────────────────── METADATA HELPERS (unchanged) */
function _clMockDetailMeta(i) {
  const d = [
    { regulatoryBody: 'RBI', legalArea: 'Banking Regulation', subLegalArea: 'Prudential Norms', act: 'Banking Regulation Act 1949', section: 'Section 12', subset: 'Clause (a)', category: 'Mandatory Compliance', frequency: 'Monthly', dueDate: '15th of following month' },
    { regulatoryBody: 'SEBI', legalArea: 'Securities Law', subLegalArea: 'Market Conduct', act: 'SEBI Act 1992', section: 'Section 21', subset: 'Clause (b)', category: 'Periodic Reporting', frequency: 'Quarterly', dueDate: '30 days from FY end' },
    { regulatoryBody: 'IRDAI', legalArea: 'Insurance Law', subLegalArea: 'Solvency', act: 'Insurance Act 1938', section: 'Section 34A', subset: 'Sub-section (1)', category: 'System Control', frequency: 'Half-Yearly', dueDate: 'Within 7 business days' },
  ]; return d[i % d.length];
}
function _clMetaFields(meta) {
  return [
    { label: 'Regulatory Body', value: meta.regulatoryBody },
    { label: 'Legislative Area', value: meta.legalArea },
    { label: 'Sub-Legislative Area', value: meta.subLegalArea },
    { label: 'Act', value: meta.act },
    { label: 'Section', value: meta.section },
    { label: 'Sub-section', value: meta.subset },
    { label: 'Category', value: meta.category },
    { label: 'Frequency', value: meta.frequency },
    { label: 'Due Date', value: meta.dueDate },
  ];
}
function _clObligMeta(i) {
  const F = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual', 'Ongoing', 'One-time'];
  const D = ['15th of following month', '30 days from FY end', 'Within 7 business days', 'On occurrence', '31st March', 'Within 60 days'];
  const S = ['Section 12', 'Section 21', 'Section 34A', 'Section 19', 'Section 134', 'Section 80C'];
  const SS = ['Clause (a)', 'Clause (b)', 'Sub-section (1)', 'Sub-section (2)', 'Proviso', 'Explanation'];
  const C = ['Mandatory Compliance', 'Periodic Reporting', 'System Control', 'Governance', 'Disclosure', 'Risk Management'];
  return { frequency: F[i % 6], dueDate: D[i % 6], section: S[i % 6], subset: SS[i % 6], category: C[i % 6] };
}

window.clOpenDocPage = function (p) {
  const circ = window._CL_ACTIVE_CIRC;
  const docUrl = circ?.docUrl || './RBI Master Circular.pdf';
  window.open(`${docUrl}#page=${p || 1}`, '_blank');
};

/* ─────────────────────────────────────── AI CONTEXT MODAL (unchanged) */
window._clOpenCtxModal = function (target, label) {
  window._clCtxTarget = target;
  let modal = document.getElementById('cl-ctx-modal');
  if (!modal) {
    modal = document.createElement('div'); modal.id = 'cl-ctx-modal'; modal.className = 'cl-ctx-overlay';
    modal.innerHTML = `
    <div class="cl-ctx-box" onclick="event.stopPropagation()">
      <div class="cl-ctx-head">
        <div class="cl-ctx-title">✦ Regenerate with AI Context</div>
        <button class="cl-ctx-close" onclick="_clCloseCtxModal()">✕</button>
      </div>
      <div class="cl-ctx-body">
        <div class="cl-ctx-for" id="cl-ctx-for-lbl"></div>
        <div class="cl-ctx-scope-row">
          <span class="cl-ctx-scope-label">Scope:</span>
          <div class="cl-ctx-scope-toggle">
            <button class="cl-ctx-scope-btn active" data-scope="clause">Clause</button>
            <button class="cl-ctx-scope-btn" data-scope="obligation">Obligation</button>
            <button class="cl-ctx-scope-btn" data-scope="action">Action</button>
          </div>
        </div>
        <div class="cl-ctx-chips">
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Risk Thresholds')">Risk Thresholds</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Provisioning Norms')">Provisioning Norms</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'SEBI Overlaps')">SEBI Overlaps</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Recent Amendments')">Recent Amendments</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Capital Adequacy')">Capital Adequacy</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'PMLA Context')">PMLA Context</span>
        </div>
        <textarea class="cl-ctx-ta" id="cl-ctx-ta" placeholder="Add specific context or instructions for the AI…"></textarea>
        <div class="cl-ctx-footer">
          <button class="cl-ctx-cancel" onclick="_clCloseCtxModal()">Cancel</button>
          <button class="cl-ctx-go" onclick="_clSubmitCtx()">✦ Regenerate</button>
        </div>
      </div>
    </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) _clCloseCtxModal(); });
    modal.addEventListener('click', e => {
      if (e.target.classList.contains('cl-ctx-scope-btn')) {
        modal.querySelectorAll('.cl-ctx-scope-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
    document.body.appendChild(modal);
  }
  document.getElementById('cl-ctx-for-lbl').textContent = `Regenerating: ${label}`;
  modal.classList.add('cl-ctx-open');
  setTimeout(() => document.getElementById('cl-ctx-ta')?.focus(), 50);
};
window._clCloseCtxModal = function () {
  document.getElementById('cl-ctx-modal')?.classList.remove('cl-ctx-open');
  document.querySelectorAll('.cl-ctx-chip').forEach(c => c.classList.remove('cl-ctx-chip-active'));
  const ta = document.getElementById('cl-ctx-ta'); if (ta) ta.value = '';
};
window._clChipToggle = function (el, text) {
  el.classList.toggle('cl-ctx-chip-active');
  const ta = document.getElementById('cl-ctx-ta');
  ta.value = el.classList.contains('cl-ctx-chip-active')
    ? (ta.value ? ta.value + '\n' + text : text)
    : ta.value.replace(text, '').replace(/\n+/g, '\n').trim();
};
window._clSubmitCtx = function () {
  const scope = document.querySelector('.cl-ctx-scope-btn.active')?.dataset.scope || 'clause';
  _clCloseCtxModal();
  showToast(`✓ Regenerating ${scope} with context…`, 'success');
};

/* ─────────────────────────────────────── RELATIONSHIP FAB (unchanged from v3) */
function _clInjectRelFAB() {
  if (document.getElementById('cl-rel-fab')) return;

  const fab = document.createElement('button');
  fab.id = 'cl-rel-fab'; fab.className = 'cl-rel-fab'; fab.title = 'Circular Relationships';
  fab.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
   `;
  fab.addEventListener('click', clOpenRelDialog);
  document.body.appendChild(fab);

  const REL_DATA = {
    type: { label: 'Circular', desc: 'Classification of this circular in the regulatory hierarchy.', items: [{ id: 'RBI-HF-2024-001', type: 'Master Circular', title: 'Master Circular on Housing Finance', reg: 'RBI', date: '2024-04-02', status: 'Active', hierarchy: 'Top-level consolidation of all housing finance instructions issued up to March 31, 2024.', tags: ['Housing Finance', 'Prudential', 'Lending'], docUrl: './RBI Master Circular.pdf' }] },
    belongs: { label: 'Belongs To which ACT', desc: 'The statutory framework under which RBI issues housing finance directions.', items: [{ id: 'RBI-ACT-1934', type: 'Legislation', title: 'Reserve Bank of India Act, 1934', reg: 'Parliament of India', date: '1934', status: 'Active', hierarchy: 'Primary legislation empowering RBI to regulate banking system.', tags: ['Primary Law', 'RBI Authority'], docUrl: '#' }, { id: 'BR-ACT-1949', type: 'Legislation', title: 'Banking Regulation Act, 1949 – Section 21 & 35A', reg: 'Parliament of India', date: '1949', status: 'Active', hierarchy: 'Provides RBI power to issue directions on advances and lending practices.', tags: ['Banking Law', 'Lending Powers'], docUrl: '#' }] },
    based: { label: 'Based On which Circular', desc: 'Earlier RBI circulars consolidated into this Master Circular.', items: [{ id: 'RBI/2015-16/LTV', type: 'Circular', title: 'Housing Loans – LTV Ratio Guidelines', reg: 'RBI', date: '2015', status: 'Superseded', hierarchy: 'Foundation for Loan-to-Value ratio norms.', tags: ['LTV', 'Risk'], docUrl: '#' }, { id: 'RBI/2017-18/RISK', type: 'Circular', title: 'Risk Weights for Housing Loans', reg: 'RBI', date: '2017', status: 'Superseded', hierarchy: 'Defines capital adequacy treatment for housing loans.', tags: ['Risk Weight', 'Capital'], docUrl: '#' }, { id: 'RBI/2018-19/DISB', type: 'Circular', title: 'Disbursement of Housing Loans Linked to Construction Stages', reg: 'RBI', date: '2018', status: 'Superseded', hierarchy: 'Introduced stage-wise disbursement norms.', tags: ['Disbursement', 'Construction'], docUrl: '#' }] },
    refers: { label: 'Refers To which Circular', desc: 'Other RBI directions and frameworks referenced in this circular.', items: [{ id: 'RBI-IRD-2023', type: 'Master Direction', title: 'Interest Rate on Advances Directions', reg: 'RBI', date: '2023', status: 'Active', hierarchy: 'Defines interest rate framework applicable to housing loans.', tags: ['Interest Rate', 'Lending'], docUrl: '#' }, { id: 'RBI-FLP-2023', type: 'Guidelines', title: 'Fair Lending Practice Guidelines – Penal Charges & Transparency', reg: 'RBI', date: '2023', status: 'Active', hierarchy: 'Referenced for borrower protection and transparency norms.', tags: ['Fair Lending', 'Customer Protection'], docUrl: '#' }, { id: 'NBC-NDMA', type: 'Guidelines', title: 'National Building Code & NDMA Guidelines', reg: 'Government of India', date: '—', status: 'Active', hierarchy: 'Safety and construction compliance standards referenced in housing finance.', tags: ['Safety', 'Construction'], docUrl: '#' }] },
    version: { label: 'Version Chain', desc: 'Annual consolidation history of Housing Finance Master Circular.', items: [{ id: 'RBI-HF-2021', type: 'Master Circular', title: 'Master Circular – Housing Finance 2021', reg: 'RBI', date: '2021-07-01', status: 'Superseded', hierarchy: 'Earlier consolidated version.', tags: ['v1', 'Historical'], docUrl: '#' }, { id: 'RBI-HF-2022', type: 'Master Circular', title: 'Master Circular – Housing Finance 2022', reg: 'RBI', date: '2022-07-01', status: 'Superseded', hierarchy: 'Updated consolidation with revised norms.', tags: ['v2', 'Update'], docUrl: '#' }, { id: 'RBI-HF-2023', type: 'Master Circular', title: 'Master Circular – Housing Finance 2023', reg: 'RBI', date: '2023-07-01', status: 'Superseded', hierarchy: 'Immediate previous version.', tags: ['v3', 'Previous'], docUrl: '#' }, { id: 'RBI-HF-2024', type: 'Master Circular', title: 'Master Circular – Housing Finance 2024', reg: 'RBI', date: '2024-04-02', status: 'Active', hierarchy: 'Current version consolidating all instructions up to March 31, 2024.', tags: ['v4', 'Current'], docUrl: './RBI Master Circular.pdf' }] }
  };

  const overlay = document.createElement('div');
  overlay.id = 'cl-rel-overlay'; overlay.className = 'cl-rel-overlay';
  overlay.innerHTML = `
  <div class="cl-rel-dialog" onclick="event.stopPropagation()">
    <div class="cl-rel-dhead">
      <div class="cl-rel-dhead-left">
        <div class="cl-rel-dhead-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </div>
        <div>
          <div class="cl-rel-dhead-title">Circular Relationships</div>
          <div class="cl-rel-dhead-sub" id="cl-rel-dsub">—</div>
        </div>
      </div>
      <button class="cl-rel-dclose" onclick="clCloseRelDialog()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="cl-rel-tabs" id="cl-rel-tabs">
      ${Object.entries(REL_DATA).map(([k, v], i) =>
        `<button class="cl-rel-tab${i === 0 ? ' active' : ''}" data-rel="${k}" onclick="clRelTab('${k}')">${v.label}</button>`
      ).join('')}
    </div>
    <div class="cl-rel-body" id="cl-rel-body"></div>
  </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) clCloseRelDialog(); });
  document.body.appendChild(overlay);
  window._CL_REL_DATA = REL_DATA;
  setTimeout(() => clRelTab('type'), 0);
}

window.clOpenRelDialog = function () {
  const overlay = document.getElementById('cl-rel-overlay');
  if (!overlay) { _clInjectRelFAB(); setTimeout(clOpenRelDialog, 50); return; }
  const sub = document.getElementById('cl-rel-dsub'), circ = window._CL_ACTIVE_CIRC;
  if (sub && circ) sub.textContent = `${circ.id} · ${circ.title}`;
  overlay.classList.add('cl-rel-open');
  document.getElementById('cl-rel-fab')?.classList.add('cl-fab-active');
};
window.clCloseRelDialog = function () {
  document.getElementById('cl-rel-overlay')?.classList.remove('cl-rel-open');
  document.getElementById('cl-rel-fab')?.classList.remove('cl-fab-active');
};
window.clRelTab = function (key) {
  document.querySelectorAll('.cl-rel-tab').forEach(t => t.classList.toggle('active', t.dataset.rel === key));
  const data = window._CL_REL_DATA?.[key], body = document.getElementById('cl-rel-body');
  if (!body || !data) return;
  body.innerHTML = `
  <div class="cl-rel-tab-desc">${data.desc}</div>
  <div class="cl-rel-items">${data.items.map((item, idx) => _clRelItemHTML(item, idx, key)).join('')}</div>`;
};
function _clRelItemHTML(item, idx, key) {
  const sc = item.status === 'Active' ? 'cl-rs-active' : item.status === 'Superseded' ? 'cl-rs-super' : 'cl-rs-other';
  const dId = `cl-rd-${key}-${idx}`;
  return `
  <div class="cl-rel-item" id="cl-ri-${key}-${idx}">
    <div class="cl-rel-item-main" onclick="clRelToggle('${key}',${idx})">
      <div class="cl-rel-item-left">
        <div class="cl-rel-item-top-row">
          <span class="cl-ri-id">${item.id}</span>
          <span class="cl-ri-type">${item.type}</span>
          <span class="cl-ri-status ${sc}">${item.status}</span>
        </div>
        <div class="cl-ri-title">${item.title}</div>
        <div class="cl-ri-meta">
          <span class="cl-ri-reg">🏛 ${item.reg}</span>
          ${item.date !== '—' ? `<span class="cl-ri-date">📅 ${item.date}</span>` : ''}
          ${item.tags.map(t => `<span class="cl-ri-tag">${t}</span>`).join('')}
        </div>
      </div>
      <span class="cl-ri-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="cl-rel-detail" id="${dId}">
      <div class="cl-rel-detail-inner">
        <div class="cl-rd-section"><div class="cl-rd-sec-label">Hierarchy &amp; Context</div><div class="cl-rd-hierarchy">${item.hierarchy}</div></div>
        <div class="cl-rd-section"><div class="cl-rd-sec-label">Details</div>
          <div class="cl-rd-grid">
            <div class="cl-rd-field"><span class="cl-rd-label">Circular ID</span><span class="cl-rd-value">${item.id}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Type</span><span class="cl-rd-value">${item.type}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Regulator</span><span class="cl-rd-value">${item.reg}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Issue Date</span><span class="cl-rd-value">${item.date}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Status</span><span class="cl-rd-value">${item.status}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Tags</span><span class="cl-rd-value">${item.tags.join(', ')}</span></div>
          </div>
        </div>
        <div class="cl-rd-section"><div class="cl-rd-sec-label">Links &amp; Documents</div>
          <div class="cl-rd-links">
            <a class="cl-rd-link cl-rd-link-pri" href="${item.docUrl}" target="_blank" onclick="event.stopPropagation()">📄 View Full Circular</a>
            <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Opening in doc viewer…','info')">🔍 Open in Doc Viewer</a>
            <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Downloading PDF…','info')">⬇ Download PDF</a>
            <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Link copied!','success')">🔗 Copy Reference</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
window.clRelToggle = function (key, idx) {
  const det = document.getElementById(`cl-rd-${key}-${idx}`), item = document.getElementById(`cl-ri-${key}-${idx}`);
  if (!det) return;
  const open = det.classList.contains('open');
  document.querySelectorAll('.cl-rel-detail').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.cl-rel-item').forEach(i => i.classList.remove('cl-ri-exp'));
  if (!open) { det.classList.add('open'); item?.classList.add('cl-ri-exp'); }
};

/* ─────────────────────────────────────── STRUCTURE MENU */
window._clOpenStructureMenu = function() {
  var ex = document.getElementById('cl-struct-modal'); if(ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-struct-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:380px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-id-chip">+</span><span class="cl-eye-head-title">Add Structure</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-struct-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:16px;display:flex;flex-direction:column;gap:8px;">
      ${[
        {type:'chapter', label:'📖 Chapter', sub:'A new top-level chapter'},
        {type:'section', label:'§ Section', sub:'A section within the active chapter'},
        {type:'subsection', label:'¶ Subsection', sub:'A subsection within the active section'},
      ].map(opt => `
        <button onclick="_clOpenStructureAdd('${opt.type}')" style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;cursor:pointer;text-align:left;width:100%;font-family:inherit;">
          <span style="font-size:13px;font-weight:600;color:#1f2937;">${opt.label}</span>
          <span style="font-size:11px;color:#6b7280;">${opt.sub}</span>
        </button>`).join('')}
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};

window._clOpenStructureAdd = function(type) {
  document.getElementById('cl-struct-modal').remove();
  const labels = {chapter:'Chapter', section:'Section', subsection:'Subsection'};
  var ex = document.getElementById('cl-struct-add-modal'); if(ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-struct-add-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:440px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-head-title">Add ${labels[type]}</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-struct-add-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:16px;display:flex;flex-direction:column;gap:10px;">
      <label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;">Title</label>
      <input id="cl-sadd-title" type="text" placeholder="Enter ${labels[type]} title…" style="padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;width:100%;"/>
    </div>
    <div class="cl-eye-foot">
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-struct-add-modal').remove()">Cancel</button>
      <button class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;" onclick="_clCommitStructureAdd('${type}')">Add ${labels[type]}</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  setTimeout(() => document.getElementById('cl-sadd-title')?.focus(), 50);
};

window._clCommitStructureAdd = function(type) {
  const title = document.getElementById('cl-sadd-title')?.value?.trim();
  if (!title) { showToast('Title required.','error'); return; }
  document.getElementById('cl-struct-add-modal').remove();
  showToast(`${type.charAt(0).toUpperCase()+type.slice(1)} "${title}" added.`, 'success');
};

/* ── Add Obligation popup ── */
window._clAddObligationPopup = function() {
  var ex = document.getElementById('cl-add-obl-modal'); if(ex) ex.remove();
  const allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement'];
  const freqOpts = ['Monthly','Quarterly','Annually','Ad-hoc','As per Regulation'];
  const circ = window._CL_ACTIVE_CIRC;
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-add-obl-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:560px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-id-chip">OBL</span><span class="cl-eye-head-title">Add Obligation</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-add-obl-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:16px;display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow-y:auto;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Obligation ID</label><input id="cl-aob-id" type="text" placeholder="OBL-XXX" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Circular Title</label><input id="cl-aob-circ" type="text" value="${(circ?.title||'').replace(/"/g,'&quot;')}" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Clause ID</label><input id="cl-aob-clauseid" type="text" placeholder="e.g. CL-1.1" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Department</label><select id="cl-aob-dept" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;background:#fff;"><option value="">— Select —</option>${allDepts.map(d=>`<option>${d}</option>`).join('')}</select></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Section</label><input id="cl-aob-sec" type="text" placeholder="e.g. Section 12" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Sub-Section</label><input id="cl-aob-subsec" type="text" placeholder="e.g. Clause (a)" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Frequency</label><select id="cl-aob-freq" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;background:#fff;">${freqOpts.map(f=>`<option>${f}</option>`).join('')}</select></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Due Date</label><input id="cl-aob-due" type="date" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
      </div>
      <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Obligation Name <span style="color:#ef4444;">*</span></label><textarea id="cl-aob-text" placeholder="Describe the obligation…" style="width:100%;height:70px;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;font-family:inherit;resize:vertical;"></textarea></div>
    </div>
    <div class="cl-eye-foot">
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-add-obl-modal').remove()">Cancel</button>
      <button class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;" onclick="_clSaveNewObligation()">Add Obligation</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  setTimeout(() => document.getElementById('cl-aob-id')?.focus(), 50);
};

window._clSaveNewObligation = function() {
  const text = document.getElementById('cl-aob-text')?.value?.trim();
  if (!text) { showToast('Obligation name is required.','error'); return; }
  document.getElementById('cl-add-obl-modal').remove();
  showToast('Obligation added.','success');
};

/* ── Add Action popup ── */
window._clAddActionPopup = function() {
  var ex = document.getElementById('cl-add-act-modal'); if(ex) ex.remove();
  const allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement'];
  const freqOpts = ['Monthly','Quarterly','Annually','Ad-hoc','As per Regulation'];
  const statusOpts = ['Assigned','Unassigned','Not Applicable'];
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-add-act-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:580px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-id-chip">ACT</span><span class="cl-eye-head-title">Add Action</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-add-act-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:16px;display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow-y:auto;">
      <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Parent Obligation <span style="color:#ef4444;">*</span></label>
        <select id="cl-aact-obl" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;background:#fff;">
          <option value="">— Select Obligation —</option>
          ${(window._CL_ACTIVE_SECTION_CLAUSES||[]).flatMap((cl,ci) => {
            const oblsRaw = cl.obligations||cl.obligation||null;
            const oblsArr = Array.isArray(oblsRaw)?oblsRaw:oblsRaw?[oblsRaw]:[];
            return oblsArr.map((ob,oi) => `<option value="${cl.id}-${oi}">${cl.id}-OBL${oi+1}: ${(typeof ob==='string'?ob:(ob.text||'')).substring(0,50)}</option>`);
          }).join('')}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Action ID</label><input id="cl-aact-id" type="text" placeholder="ACT-XXX" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Assignment Status</label><select id="cl-aact-status" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;background:#fff;">${statusOpts.map(s=>`<option>${s}</option>`).join('')}</select></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Frequency</label><select id="cl-aact-freq" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;background:#fff;">${freqOpts.map(f=>`<option>${f}</option>`).join('')}</select></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Internal Due Date</label><input id="cl-aact-intdue" type="date" value="2025-02-12" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
        <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">External Due Date</label><input id="cl-aact-extdue" type="date" value="2025-02-12" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
      </div>
      <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Departments</label>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">${allDepts.map(d=>`<label style="display:flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid #e5e7eb;border-radius:20px;cursor:pointer;font-size:11px;font-weight:500;color:#374151;background:#f9fafb;"><input type="checkbox" value="${d}" style="accent-color:#3b82f6;width:13px;height:13px;"/>${d}</label>`).join('')}</div>
      </div>
      <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Tags</label><input id="cl-aact-tags" type="text" placeholder="e.g. Compliance, Reporting (comma-separated)" style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/></div>
      <div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px;">Action Name <span style="color:#ef4444;">*</span></label><textarea id="cl-aact-text" placeholder="Describe the action…" style="width:100%;height:70px;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;font-family:inherit;resize:vertical;"></textarea></div>
    </div>
    <div class="cl-eye-foot">
      <button class="cl-eye-cancel-btn" onclick="document.getElementById('cl-add-act-modal').remove()">Cancel</button>
      <button class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;" onclick="_clSaveNewAction()">Add Action</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};

window._clSaveNewAction = function() {
  const text = document.getElementById('cl-aact-text')?.value?.trim();
  if (!text) { showToast('Action name is required.','error'); return; }
  document.getElementById('cl-add-act-modal').remove();
  showToast('Action added.','success');
};

/* ── Export popup ── */
window._clOpenExportPopup = function() {
  var ex = document.getElementById('cl-export-modal'); if(ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'cl-eye-overlay'; overlay.id = 'cl-export-modal';
  overlay.innerHTML = `
  <div class="cl-eye-box" style="max-width:420px;" onclick="event.stopPropagation()">
    <div class="cl-eye-head">
      <div class="cl-eye-head-left"><span class="cl-eye-head-title">Export / Import</span></div>
      <button class="cl-eye-close" onclick="document.getElementById('cl-export-modal').remove()">✕</button>
    </div>
    <div class="cl-eye-body" style="padding:20px;display:flex;flex-direction:column;gap:12px;">
      <button class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;width:100%;padding:12px;justify-content:flex-start;gap:10px;" onclick="_clDownloadOblTemplate()">📥 Download Template CSV</button>
      <button class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;width:100%;padding:12px;justify-content:flex-start;gap:10px;" onclick="_clExportOblData()">📊 Export Current Data</button>
      <label class="cl-eye-save-btn" style="opacity:1;pointer-events:auto;width:100%;padding:12px;justify-content:flex-start;gap:10px;cursor:pointer;">📤 Upload Excel / CSV<input type="file" accept=".csv,.xlsx,.xls" style="display:none;" onchange="showToast('Uploaded. Processing…','success');document.getElementById('cl-export-modal').remove();"/></label>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
};
window._clDownloadOblTemplate = function() {
  const csv = 'Obligation ID,Obligation Name,Clause ID,Section,Sub-Section,Department,Frequency,Due Date,Action ID,Action Name,Status,Tags\nOBL-001,Ensure compliance,CL-1.1,Section 12,Clause (a),Compliance,Monthly,2025-03-31,ACT-001,Submit certificate,Assigned,Reporting\n';
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='obligations_template.csv'; a.click();
  document.getElementById('cl-export-modal').remove();
};
window._clExportOblData = function() {
  showToast('Exported current obligations data.','success');
  document.getElementById('cl-export-modal').remove();
};

/* ─────────────────────────────────────── EVIDENCE MODAL (unchanged) */
window.clShowEvidenceModal = function (clauseId, actions, obligation) {
  const EV = [
    { icon: '📋', name: 'Compliance Policy Document', type: 'Policy', source: 'Internal Repository', needed: 'Board-approved policy covering this compliance area.', status: 'Required' },
    { icon: '🔍', name: 'Internal Audit Report', type: 'Audit Record', source: 'Internal Audit Dept', needed: 'Audit findings confirming controls are operating effectively.', status: 'Required' },
    { icon: '🎓', name: 'Staff Training Completion Record', type: 'Training Record', source: 'HR System', needed: 'Completion records for all relevant staff.', status: 'Required' },
    { icon: '💻', name: 'System Audit Trail / Access Log', type: 'System Log', source: 'IT Department', needed: 'System-generated logs showing automated controls.', status: 'Recommended' },
    { icon: '🏛️', name: 'Board Resolution / Meeting Minutes', type: 'Board Record', source: 'Company Secretary', needed: 'Board-level approval in formal meeting minutes.', status: 'Required' },
    { icon: '📨', name: 'Regulatory Submission Receipt', type: 'Regulatory Filing', source: 'Compliance Team', needed: 'Regulator acknowledgement of timely submission.', status: 'Recommended' },
  ];
  const mapped = (Array.isArray(actions) ? actions : [actions]).map((a, i) => ({ action: a, ev: EV[i % EV.length] }));
  const req = mapped.filter(m => m.ev.status === 'Required').length, rec = mapped.length - req;
  const ov = document.createElement('div'); ov.className = 'cl-modal-overlay';
  ov.innerHTML = `
  <div class="cl-modal cl-modal-ev">
    <div class="cl-modal-head">
      <div class="cl-modal-head-left">
        <span class="cl-modal-clause-id">${clauseId}</span>
        ${obligation ? `<span class="cl-modal-oblig-short">${obligation.substring(0, 90)}${obligation.length > 90 ? '…' : ''}</span>` : ''}
      </div>
      <button class="cl-modal-close" onclick="this.closest('.cl-modal-overlay').remove()">✕</button>
    </div>
    <div class="cl-ev-summary">
      <span class="cl-ev-pill">${mapped.length} items</span>
      <span class="cl-ev-pill cl-ev-pill-req">🔴 ${req} Required</span>
      <span class="cl-ev-pill cl-ev-pill-rec">🟡 ${rec} Recommended</span>
      <span class="cl-ev-pill cl-ev-pill-saved">✅ <span id="cl-ev-sc">0</span> Saved</span>
    </div>
    <div class="cl-ev-table-wrap">
      <table class="cl-ev-table">
        <thead><tr>
          <th class="cl-ev-th cl-ev-th-num">#</th>
          <th class="cl-ev-th">Action</th>
          <th class="cl-ev-th">Evidence Needed</th>
          <th class="cl-ev-th cl-ev-th-st">Status</th>
          <th class="cl-ev-th cl-ev-th-sv"></th>
        </tr></thead>
        <tbody>
          ${mapped.map((m, i) => `
          <tr class="cl-ev-tr" id="cl-ev-row-${i}">
            <td class="cl-ev-td cl-ev-td-num">${i + 1}</td>
            <td class="cl-ev-td">${m.action}</td>
            <td class="cl-ev-td">
              <div class="cl-ev-doc-name">${m.ev.icon} ${m.ev.name}</div>
              <div class="cl-ev-doc-sub">${m.ev.type} · ${m.ev.source}</div>
              <div class="cl-ev-doc-needed">${m.ev.needed}</div>
            </td>
            <td class="cl-ev-td cl-ev-td-st"><span class="cl-ev-badge ${m.ev.status === 'Required' ? 'cl-ev-badge-req' : 'cl-ev-badge-rec'}">${m.ev.status}</span></td>
            <td class="cl-ev-td cl-ev-td-sv">
              <button class="cl-ev-save-btn" onclick="this.textContent='✓';this.classList.add('cl-ev-saved');this.disabled=true;document.getElementById('cl-ev-row-${i}').classList.add('cl-ev-tr-saved');const c=document.getElementById('cl-ev-sc');if(c)c.textContent=parseInt(c.textContent||0)+1;showToast('Saved.','success');">Save</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="cl-modal-foot">
      <span class="cl-modal-foot-note">💡 AI-suggested based on clause and obligation context</span>
      <div style="display:flex;gap:8px;">
        <button class="cl-modal-btn cl-modal-btn-sec" onclick="showToast('Refreshing…','info')">↺ Refresh</button>
        <button class="cl-modal-btn cl-modal-btn-pri" onclick="this.closest('.cl-modal-overlay').remove()">Done</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
};

/* ─────────────────────────────────────── CSS */
function injectClauseCSS() {
  if (document.getElementById('cl-css')) return;
  const s = document.createElement('style'); s.id = 'cl-css';
  s.textContent = `
:root{
  --cl-bg:#f4f6f9;--cl-card:#fff;--cl-nav-bg:#f8f9fb;--cl-hover:#eef1f6;
  --cl-border:#e2e6ed;--cl-border-lt:#edf0f5;
  --cl-t1:#1e2433;--cl-t2:#5a6478;--cl-t3:#9aa3b5;
  --cl-blue:#0d7fa5;--cl-blue-lt:#e6f4f9;--cl-blue-mid:#b2ddef;
  --cl-purple:#5b5fcf;--cl-purple-lt:#ededfc;
  --cl-green:#0e9f6e;--cl-green-lt:#e8faf4;
  --cl-amber:#b45309;--cl-amber-lt:#fef3c7;
  --cl-red:#c92a2a;--cl-red-lt:#fdecea;
  --cl-r-sm:6px;--cl-r-md:10px;--cl-r-lg:14px;
  --cl-sh:0 1px 3px rgba(30,36,51,.07);--cl-sh-md:0 4px 16px rgba(30,36,51,.10);
  --cl-font:'DM Sans',system-ui,sans-serif;--cl-mono:'DM Mono',monospace;
}
*{box-sizing:border-box;}
.cl-wrap{display:flex;flex-direction:column;gap:12px;font-family:var(--cl-font);color:var(--cl-t1);}

/* ── EMPTY */
.cl-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px 28px;background:var(--cl-card);border:2px dashed var(--cl-border);border-radius:var(--cl-r-lg);text-align:center;}
.cl-empty-icon{font-size:36px;opacity:.5;}
.cl-empty-title{font-size:15px;font-weight:700;}
.cl-empty-sub{font-size:13px;color:var(--cl-t3);max-width:280px;line-height:1.6;}
.cl-empty-cta{padding:9px 22px;background:var(--cl-t1);color:#fff;border:none;border-radius:var(--cl-r-sm);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}

/* ── TOP BAR */
.cl-topbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 16px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-md);box-shadow:var(--cl-sh);}
.cl-topbar-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1;flex-wrap:wrap;}
.cl-topbar-right{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap;}
.cl-circ-id-chip{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:3px 10px;border-radius:5px;white-space:nowrap;}
.cl-circ-name-chip{font-size:12px;color:var(--cl-t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;}
.cl-filter-select{padding:6px 10px;background:var(--cl-nav-bg);border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;color:var(--cl-t2);outline:none;cursor:pointer;}
.cl-level-toggle{display:flex;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);overflow:hidden;}
.cl-lvl-btn{padding:6px 12px;background:var(--cl-card);border:none;border-right:1px solid var(--cl-border);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t3);cursor:pointer;transition:all .12s;}
.cl-lvl-btn:last-child{border-right:none;}
.cl-lvl-btn.active{background:var(--cl-t1);color:#fff;}
.cl-topbar-btn{padding:7px 15px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .13s;white-space:nowrap;border:1.5px solid;}
.cl-btn-generate{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}
.cl-btn-generate:hover{background:#2a3248;}
.sum-foot-btn{padding:10px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid;display:inline-flex;align-items:center;gap:7px;transition:all 0.14s;}
.sum-foot-save{background:#fff;border-color:#86efac;color:#16a34a;}

/* ── SPLIT */
.cl-split{display:grid;grid-template-columns:248px 1fr;gap:0;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-lg);overflow:hidden;min-height:560px;box-shadow:var(--cl-sh);transition:grid-template-columns .2s ease;}

/* ── LEFT NAV */
.cl-nav{border-right:1px solid var(--cl-border-lt);display:flex;flex-direction:column;background:var(--cl-nav-bg);overflow:hidden;transition:width .2s ease, opacity .2s ease;}
.cl-nav.cl-nav-collapsed{width:0;opacity:0;pointer-events:none;border-right:none;}
.cl-nav-head{display:flex;align-items:center;justify-content:space-between;padding:11px 13px;border-bottom:1px solid var(--cl-border-lt);flex-shrink:0;}
.cl-nav-title{font-size:10px; margin-bottom:5px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
.cl-nav-count{font-size:10px;color:var(--cl-t3);background:var(--cl-border-lt);border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px;}
.cl-nav-collapse-btn{width:20px;height:20px;border-radius:4px;background:none;border:1px solid var(--cl-border);font-size:13px;font-weight:700;color:var(--cl-t3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;flex-shrink:0;}
.cl-nav-collapse-btn:hover{background:var(--cl-hover);color:var(--cl-t1);}
.cl-nav-tree{flex:1;overflow-y:auto;padding:4px 0;}
.cl-nav-placeholder,.cl-nav-loading{padding:24px 16px;font-size:12px;color:var(--cl-t3);text-align:center;line-height:1.6;}

/* ── NAV EXPAND BUTTON (shown in workspace when nav is collapsed) */
.cl-nav-expand-btn{position:absolute;top:12px;left:12px;z-index:10;padding:5px 11px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-blue);cursor:pointer;display:none;align-items:center;gap:4px;transition:all .12s;box-shadow:var(--cl-sh);}
.cl-nav-expand-btn:hover{border-color:var(--cl-blue-mid);background:var(--cl-blue-lt);}
.cl-workspace{position:relative;}

/* chapter button */
.cl-nav-ch-btn{width:100%;display:flex;align-items:center;gap:7px;padding:9px 12px 9px 10px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background .1s;}
.cl-nav-ch-btn:hover{background:var(--cl-hover);}
.cl-nav-ch-arrow{font-size:9px;color:var(--cl-t3);flex-shrink:0;width:12px;text-align:center;}
.cl-nav-ch-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.cl-nav-ch-num{font-size:9px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;line-height:1.2;}
.cl-nav-ch-label{font-size:11.5px;font-weight:600;color:var(--cl-t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.35;}
.cl-nav-ch-count{font-size:10px;color:var(--cl-t3);background:#e8ebf1;padding:1px 7px;border-radius:10px;flex-shrink:0;}
.cl-nav-ch-body{display:none;padding-bottom:4px;border-left:2px solid var(--cl-border-lt);margin-left:14px;}
.cl-nav-ch-body.open{display:block;}

/* section btn */
.cl-nav-sec-group{margin-bottom:1px;}
.cl-nav-sec-btn{width:100%;display:flex;align-items:center;gap:6px;padding:7px 10px 7px 28px;background:none;border:none;border-left:2.5px solid transparent;cursor:pointer;font-family:inherit;font-size:11px;text-align:left;color:var(--cl-t2);transition:all .1s;}
.cl-nav-sec-btn:hover{background:var(--cl-hover);}
.cl-nav-active{background:var(--cl-blue-lt)!important;border-left-color:var(--cl-blue)!important;color:var(--cl-blue)!important;}
.cl-nav-sec-icon{font-size:9px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:1px 5px;border-radius:3px;flex-shrink:0;}
.cl-nav-ann-icon{color:var(--cl-purple);background:var(--cl-purple-lt);border-color:#c5c8f5;}
.cl-nav-sec-label{flex:1;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-nav-sec-count{font-size:9px;color:var(--cl-t3);flex-shrink:0;}
.cl-nav-sec-arrow{font-size:10px;color:var(--cl-t3);flex-shrink:0;}
.cl-nav-group-head{padding:8px 10px 4px 12px;font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;border-top:1px solid var(--cl-border-lt);margin-top:4px;}
.cl-nav-all-btn{display:block;width:100%;padding:7px 12px 7px 22px;background:none;border:none;font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-blue);text-align:left;cursor:pointer;}
.cl-nav-all-btn:hover{background:var(--cl-hover);}
.cl-nav-flat-btn{padding-left:12px;}

/* ── WORKSPACE */
.cl-workspace{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-width:0;background:var(--cl-card);}
.cl-ws-placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:40px;text-align:center;}
.cl-ws-ph-icon{font-size:32px;opacity:.3;}
.cl-ws-ph-title{font-size:14px;font-weight:700;color:var(--cl-t3);}
.cl-ws-ph-sub{font-size:12px;color:#c0c7d6;max-width:260px;line-height:1.6;}

/* ── CLAUSE STACK WRAPPER */
.cl-stack-wrap{padding:18px 20px;}

/* Header: all in ONE row — badge + title + count aligned */
.cl-stack-header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--cl-border-lt);}
.cl-stack-header-left{display:flex;align-items:center;gap:8px;flex:1;min-width:0;flex-wrap:wrap;}
.cl-stack-ch-num{font-size:10px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.08em;background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 8px;border-radius:4px;flex-shrink:0;}
.cl-stack-ch-title{font-size:13px;font-weight:700;color:var(--cl-t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-stack-sec-sep{font-size:12px;color:var(--cl-t3);flex-shrink:0;}
.cl-stack-sec-label{font-size:12px;color:var(--cl-t2);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-stack-count{font-size:11px;color:var(--cl-t3);background:var(--cl-hover);border:1px solid var(--cl-border);padding:3px 10px;border-radius:10px;flex-shrink:0;white-space:nowrap;}
.cl-stack-header .cl-nav-stat-badge{font-size:10px;padding:2px 8px;border-radius:10px;}


.cl-ctx-scope-row{display:flex;align-items:center;gap:10px;}
.cl-ctx-scope-label{font-size:11px;font-weight:700;color:var(--cl-t3);white-space:nowrap;}
.cl-ctx-scope-toggle{display:flex;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);overflow:hidden;}
.cl-ctx-scope-btn{padding:6px 14px;background:var(--cl-card);border:none;border-right:1px solid var(--cl-border);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t3);cursor:pointer;transition:all .12s;}
.cl-ctx-scope-btn:last-child{border-right:none;}
.cl-ctx-scope-btn.active{background:var(--cl-t1);color:#fff;}

.cl-nav-sec-btn-titled{flex-direction:column;align-items:flex-start;padding:8px 10px 8px 28px;gap:2px;}
.cl-nav-sec-info{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;width:100%;}
.cl-nav-sec-top-row{display:flex;align-items:center;justify-content:space-between;width:100%;}
.cl-nav-sec-num{font-size:9px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;line-height:1.2;}
.cl-nav-sec-title-label{font-size:11.5px;font-weight:600;color:var(--cl-t1);line-height:1.35;white-space:normal;word-break:break-word;}

/* ── CLAUSE ROW — white bg, no badges inline */
.cl-stack-list{display:flex;flex-direction:column;gap:4px;}
.cl-clause-row{display:flex;align-items:center;gap:8px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-md);padding:10px 14px;cursor:pointer;transition:all .14s;}
.cl-clause-row:hover{border-color:var(--cl-blue-mid);box-shadow:0 1px 6px rgba(13,127,165,.08);}
.cl-clause-row.cl-row-expanded{border-color:var(--cl-blue);border-bottom-left-radius:0;border-bottom-right-radius:0;margin-bottom:0;background:var(--cl-blue-lt);}
.cl-row-id{font-family:var(--cl-mono);font-size:10px;font-weight:700;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:2px 7px;border-radius:4px;flex-shrink:0;white-space:nowrap;}
.cl-row-title-text{flex:1;font-size:12.5px;color:var(--cl-t2);line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}
.cl-row-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.cl-row-left{display:none;}
.cl-row-top{display:none;}
.cl-row-pill{font-size:9px;font-weight:600;color:var(--cl-t3);background:var(--cl-hover);border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px;white-space:nowrap;}
.cl-row-arrow{font-size:11px;color:var(--cl-t3);transition:transform .2s;flex-shrink:0;}
.cl-row-arrow.open{transform:rotate(180deg);}
.cl-stack-empty{padding:24px;text-align:center;font-size:13px;color:var(--cl-t3);background:var(--cl-nav-bg);border-radius:var(--cl-r-md);border:1px dashed var(--cl-border);}

/* ── INLINE EXPAND */
.cl-inline-expand{background:var(--cl-card);border:1px solid var(--cl-blue);border-top:none;border-radius:0 0 var(--cl-r-md) var(--cl-r-md);margin-bottom:6px;overflow:hidden;}
.cl-expand-wrap{display:flex;flex-direction:column;}

/* TAB ROW: tabs left, badges + icons right — one full-width flex row */
.cl-expand-tabrow{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--cl-border-lt);background:var(--cl-nav-bg);padding:0 14px;gap:8px;}
.cl-expand-tabs-left{display:flex;align-items:center;}
.cl-etab{padding:9px 12px;background:none;border:none;border-bottom:2px solid transparent;font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t3);cursor:pointer;transition:all .12s;margin-bottom:-1px;white-space:nowrap;}
.cl-etab:hover{color:var(--cl-t1);}
.cl-etab.active{color:var(--cl-blue);border-bottom-color:var(--cl-blue);}
.cl-expand-tabs-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}

/* Badges in tab row */
.cl-wc-badge{padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;border:1px solid;}
.cl-wc-risk-high{background:var(--cl-red-lt);border-color:#f5b8b8;color:var(--cl-red);}
.cl-wc-risk-medium{background:var(--cl-amber-lt);border-color:#fcd34d;color:var(--cl-amber);}
.cl-wc-risk-low{background:var(--cl-green-lt);border-color:#6ee7b7;color:var(--cl-green);}
.cl-wc-dept{background:#eef1fd;border-color:#c5cff8;color:var(--cl-purple);}

/* ⓘ and ✦ icon buttons in tab row */
.cl-wc-info-btn{width:24px;height:24px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;flex-shrink:0;}
.cl-wc-info-btn:hover,.cl-wc-info-btn-active{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}
.cl-wc-star-btn{width:21px;height:21px;border-radius:50%;background:none;border:1px solid gray;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-purple);font-size:11px;transition:all .12s;flex-shrink:0;}
.cl-wc-star-btn:hover{background:var(--cl-purple-lt);}

/* Metadata table (toggled by ⓘ) — full width below tab row */
.cl-meta-table-wrap{border-bottom:1px solid var(--cl-border-lt);animation:cl-fadeIn .15s ease;}
@keyframes cl-fadeIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
.cl-meta-table-inner{display:grid;grid-template-columns:repeat(3,1fr);}
.cl-meta-row{padding:7px 12px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt);display:flex;flex-direction:column;gap:2px;background:#f9fbfc;}
.cl-meta-row:nth-child(3n){border-right:none;}
.cl-meta-row:nth-last-child(-n+3){border-bottom:none;}
.cl-meta-label{font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;}
.cl-meta-value{font-size:11px;font-weight:600;color:var(--cl-t1);}


.cl-back-btn{padding:5px 12px;background:none;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .12s;white-space:nowrap;flex-shrink:0;}
.cl-back-btn:hover{background:var(--cl-hover);border-color:var(--cl-t2);color:var(--cl-t1);}


/* Panel content */
.cl-expand-body{padding:0;}
.cl-expand-panel{padding:16px 18px;}

/* ── TEXT PANEL */
.cl-text-panel{display:flex;flex-direction:column;gap:10px;}
.cl-tp-text{font-size:13.5px;font-weight:400;color:var(--cl-t1);line-height:1.8;}
.cl-tp-page-row{display:flex;gap:6px;}
.cl-wc-page-chip{padding:3px 9px;background:#fff;border:1.5px solid var(--cl-border);border-radius:10px;font-family:inherit;font-size:10px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .12s;display:inline-block;}
.cl-wc-page-chip:hover{border-color:var(--cl-blue);color:var(--cl-blue);background:var(--cl-blue-lt);}

/* ── OBLIGATIONS */
.cl-oblig-list{display:flex;flex-direction:column;gap:0;}
.cl-oblig-empty{padding:20px;font-size:12px;color:var(--cl-t3);text-align:center;}
.cl-oblig-item{border-bottom:1px solid var(--cl-border-lt);background:var(--cl-card);}
.cl-oblig-item:last-child{border-bottom:none;}

/* ONE-ROW header: num | preview text | icons */
.cl-oblig-header{display:flex;align-items:center;gap:9px;padding:10px 14px;cursor:pointer;transition:background .1s;user-select:none;}
.cl-oblig-header:hover{background:var(--cl-hover);}
.cl-oblig-num{flex-shrink:0;width:22px;height:22px;background:var(--cl-purple);color:#fff;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
.cl-oblig-preview{flex:1;font-size:12px;font-weight:500;color:var(--cl-t1);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}
.cl-oblig-hdr-icons{display:flex;align-items:center;gap:5px;flex-shrink:0;}
.cl-oblig-icon-btn{width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;flex-shrink:0;}
.cl-oblig-icon-btn:hover{background:var(--cl-blue-lt);border-color:var(--cl-blue-mid);color:var(--cl-blue);}
.cl-oblig-star-btn{width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-purple);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-purple);font-size:10px;transition:all .12s;flex-shrink:0;}
.cl-oblig-star-btn:hover{background:var(--cl-purple-lt);}
.cl-oblig-arr{color:var(--cl-t3);display:flex;align-items:center;transition:transform .2s;cursor:pointer;}
.cl-oblig-arr.rotated{transform:rotate(180deg);}

/* Inline edit */
.cl-oblig-edit-ta{width:100%;min-height:70px;padding:10px 14px;background:#fffbeb;border:none;border-top:1px solid #fcd34d;font-family:inherit;font-size:13px;color:var(--cl-t1);outline:none;resize:vertical;display:block;}
.cl-oblig-editbar{display:flex;justify-content:flex-end;gap:8px;padding:8px 14px;background:#fefce8;border-top:1px solid #fcd34d;}
.cl-oblig-edit-cancel{padding:5px 12px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;}
.cl-oblig-edit-save{padding:5px 12px;background:var(--cl-t1);border:none;border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:#fff;cursor:pointer;}

/* Accordion body: meta strip → actions (no repeated text) */
.cl-oblig-body{display:none;border-top:1px solid var(--cl-border-lt);background:#fafbfd;}
.cl-oblig-body.open{display:block;}
.cl-oblig-meta-strip{display:none;gap:0;border-bottom:1px solid var(--cl-blue-mid);background:var(--cl-blue-lt);}
.cl-oblig-meta-strip.cl-meta-strip-open{display:flex;}
.cl-oblig-body.open + .cl-oblig-meta-strip, .cl-oblig-meta-strip.cl-meta-strip-open{display:flex;}
.cl-oblig-meta-field{flex:1;padding:7px 10px;border-right:1px solid var(--cl-blue-mid);display:flex;flex-direction:column;gap:2px;}
.cl-oblig-meta-field:last-child{border-right:none;}
.cl-omf-label{font-size:9px;font-weight:700;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;opacity:.8;}
.cl-omf-value{font-size:11px;font-weight:600;color:var(--cl-t1);}

/* ── ACTIONS (inside obligation body) */
.cl-actions-wrap{padding:10px 14px 14px;}
.cl-actions-title{display:flex;align-items:center;gap:7px;margin-bottom:10px;font-size:10px;font-weight:800;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
.cl-actions-badge{min-width:18px;height:18px;padding:0 5px;background:var(--cl-border-lt);color:var(--cl-t2);border-radius:10px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;}
.cl-actions-list{display:flex;flex-direction:column;gap:5px;}
.cl-action-item{border:1px solid var(--cl-border-lt);border-radius:var(--cl-r-sm);overflow:hidden;background:#fff;}
.cl-action-main-row{display:flex;align-items:flex-start;gap:8px;padding:8px 11px;}
.cl-action-num{flex-shrink:0;width:18px;height:18px;background:var(--cl-blue-lt);color:var(--cl-blue);border:1px solid var(--cl-blue-mid);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;margin-top:1px;}
.cl-action-text{flex:1;font-size:12px;color:var(--cl-t1);line-height:1.5;}
.cl-action-info-btn{flex-shrink:0;width:20px;height:20px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;margin-top:1px;}
.cl-action-info-btn:hover,.cl-action-info-btn.active{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}
.cl-action-meta-panel{display:none;background:var(--cl-blue-lt);border-top:1px solid var(--cl-blue-mid);padding:9px 11px;animation:cl-fadeIn .15s ease;}
.cl-action-meta-panel.open{display:block;}
.cl-action-meta-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;}
.cl-amp-field{padding:4px 8px;border-right:1px solid var(--cl-blue-mid);}
.cl-amp-field:last-child{border-right:none;}
.cl-amp-label{display:block;font-size:8px;font-weight:700;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;opacity:.75;margin-bottom:2px;}
.cl-amp-value{display:block;font-size:10px;font-weight:600;color:var(--cl-t1);}
.cl-no-actions{font-size:12px;color:var(--cl-t3);font-style:italic;padding:10px 14px;}

/* ── FOOTER */
.cl-footer{display:flex;gap:10px;align-items:center;}
.cl-foot-save{padding:10px 20px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #6ee7b7;background:var(--cl-card);color:var(--cl-green);display:inline-flex;align-items:center;gap:7px;transition:all .14s;}
.cl-foot-save:hover{background:var(--cl-green-lt);}

/* ── AI CONTEXT MODAL */
.cl-ctx-overlay{position:fixed;inset:0;background:rgba(20,25,40,.5);z-index:3000;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
.cl-ctx-overlay.cl-ctx-open{display:flex;}
.cl-ctx-box{background:#fff;border-radius:14px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);animation:cl-popIn .22s ease;}
@keyframes cl-popIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
.cl-ctx-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #edf0f5;background:#f8f9fb;}
.cl-ctx-title{font-size:14px;font-weight:700;color:var(--cl-t1);}
.cl-ctx-close{width:28px;height:28px;border-radius:50%;background:#e2e5eb;border:none;font-size:13px;color:var(--cl-t2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;}
.cl-ctx-close:hover{background:var(--cl-t1);color:#fff;}
.cl-ctx-body{padding:18px 20px;display:flex;flex-direction:column;gap:12px;}
.cl-ctx-for{font-size:11px;font-weight:700;color:var(--cl-t3);padding:4px 10px;background:#f0f1f4;border-radius:4px;display:inline-block;align-self:flex-start;}
.cl-ctx-chips{display:flex;flex-wrap:wrap;gap:6px;}
.cl-ctx-chip{padding:5px 12px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:20px;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;transition:all .13s;user-select:none;}
.cl-ctx-chip:hover{border-color:#a5b4fc;color:#4f46e5;background:#eef2ff;}
.cl-ctx-chip-active{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}
.cl-ctx-ta{width:100%;min-height:90px;padding:10px 12px;background:#f0f1f4;border:1.5px solid #dde0e6;border-radius:8px;font-family:inherit;font-size:13px;color:var(--cl-t1);line-height:1.6;resize:vertical;outline:none;}
.cl-ctx-ta:focus{border-color:var(--cl-t1);background:#fff;}
.cl-ctx-footer{display:flex;justify-content:flex-end;gap:10px;padding-top:8px;border-top:1px solid #f0f1f4;}
.cl-ctx-cancel{padding:9px 18px;background:#fff;border:1.5px solid #dde0e6;border-radius:8px;font-size:13px;font-weight:600;color:var(--cl-t2);cursor:pointer;font-family:inherit;}
.cl-ctx-go{padding:9px 18px;background:var(--cl-t1);border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;}
.cl-ctx-go:hover{background:#2a3248;}

/* ── RELATIONSHIP FAB */
.cl-rel-fab{position:fixed;bottom:28px;right:28px;z-index:3500;display:inline-flex;align-items:center;gap:8px;padding:13px 20px;background:var(--cl-t1);color:#fff;border:none;border-radius:40px;font-family:var(--cl-font);font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(30,36,51,.30);transition:all .2s cubic-bezier(.34,1.56,.64,1);}
.cl-rel-fab:hover{background:#2a3248;box-shadow:0 8px 28px rgba(30,36,51,.40);transform:translateY(-2px);}
.cl-fab-label{letter-spacing:.01em;}
.cl-rel-fab.cl-fab-active{background:var(--cl-purple);box-shadow:0 6px 20px rgba(91,95,207,.40);}

/* ── RELATIONSHIP DIALOG */
.cl-rel-overlay{position:fixed;inset:0;background:rgba(15,20,35,.5);z-index:4000;display:none;align-items:flex-end;justify-content:flex-end;padding:28px;backdrop-filter:blur(3px);}
.cl-rel-overlay.cl-rel-open{display:flex;}
.cl-rel-dialog{background:#fff;border-radius:16px;width:100%;max-width:640px;max-height:78vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.25);animation:cl-slideUp .25s cubic-bezier(.34,1.56,.64,1);}
@keyframes cl-slideUp{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
.cl-rel-dhead{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #edf0f5;background:#f8f9fb;flex-shrink:0;}
.cl-rel-dhead-left{display:flex;align-items:center;gap:11px;}
.cl-rel-dhead-icon{width:36px;height:36px;background:var(--cl-purple-lt);border:1px solid #c5c8f5;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--cl-purple);}
.cl-rel-dhead-title{font-size:14px;font-weight:700;color:var(--cl-t1);}
.cl-rel-dhead-sub{font-size:11px;color:var(--cl-t3);margin-top:1px;}
.cl-rel-dclose{width:28px;height:28px;border-radius:50%;background:#e2e5eb;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t2);transition:all .12s;}
.cl-rel-dclose:hover{background:var(--cl-t1);color:#fff;}
.cl-rel-tabs{display:flex;border-bottom:1px solid #edf0f5;padding:0 20px;flex-shrink:0;overflow-x:auto;}
.cl-rel-tab{padding:10px 13px;background:none;border:none;border-bottom:2px solid transparent;font-family:inherit;font-size:12px;font-weight:600;color:var(--cl-t3);cursor:pointer;white-space:nowrap;transition:all .13s;margin-bottom:-1px;}
.cl-rel-tab:hover{color:var(--cl-t1);}
.cl-rel-tab.active{color:var(--cl-purple);border-bottom-color:var(--cl-purple);}
.cl-rel-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px;}
.cl-rel-tab-desc{font-size:12px;color:var(--cl-t3);padding:8px 12px;background:#f8f9fb;border-radius:6px;border:1px solid #edf0f5;line-height:1.6;}
.cl-rel-items{display:flex;flex-direction:column;gap:8px;}
.cl-rel-item{border:1px solid var(--cl-border);border-radius:var(--cl-r-md);overflow:hidden;transition:border-color .13s;}
.cl-rel-item:hover{border-color:#a5b4fc;}
.cl-ri-exp{border-color:var(--cl-purple);box-shadow:0 2px 10px rgba(91,95,207,.12);}
.cl-rel-item-main{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 15px;cursor:pointer;background:#fafbfc;transition:background .12s;gap:10px;}
.cl-rel-item-main:hover{background:var(--cl-hover);}
.cl-rel-item-left{display:flex;flex-direction:column;gap:5px;flex:1;min-width:0;}
.cl-rel-item-top-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.cl-ri-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 8px;border-radius:4px;}
.cl-ri-type{font-size:10px;font-weight:700;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:2px 8px;border-radius:10px;}
.cl-ri-status{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;}
.cl-rs-active{background:#dcfce7;color:#15803d;}
.cl-rs-super{background:#fef3c7;color:#b45309;}
.cl-rs-other{background:#f1f5f9;color:#64748b;}
.cl-ri-title{font-size:13px;font-weight:600;color:var(--cl-t1);line-height:1.4;}
.cl-ri-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.cl-ri-reg,.cl-ri-date{font-size:11px;color:var(--cl-t2);}
.cl-ri-tag{font-size:9px;font-weight:700;padding:2px 7px;background:#f0f1f4;border:1px solid var(--cl-border);border-radius:10px;color:var(--cl-t2);}
.cl-ri-arrow{color:var(--cl-t3);display:flex;align-items:center;flex-shrink:0;margin-top:2px;transition:transform .2s;}
.cl-ri-exp .cl-ri-arrow{transform:rotate(180deg);}
.cl-rel-detail{display:none;border-top:1px solid #edf0f5;}
.cl-rel-detail.open{display:block;animation:cl-fadeIn .18s ease;}
.cl-rel-detail-inner{padding:14px 16px;display:flex;flex-direction:column;gap:12px;}
.cl-rd-sec-label{font-size:9.5px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
.cl-rd-hierarchy{font-size:12.5px;color:var(--cl-t2);line-height:1.65;background:#f8f9fb;padding:9px 12px;border-radius:6px;border-left:3px solid var(--cl-purple);}
.cl-rd-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--cl-border-lt);border-radius:6px;overflow:hidden;}
.cl-rd-field{padding:8px 10px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt);background:#fbfcfd;}
.cl-rd-field:nth-child(3n){border-right:none;}
.cl-rd-field:nth-last-child(-n+3){border-bottom:none;}
.cl-rd-label{display:block;font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
.cl-rd-value{display:block;font-size:11.5px;font-weight:600;color:var(--cl-t1);}
.cl-rd-links{display:flex;flex-wrap:wrap;gap:7px;}
.cl-rd-link{padding:6px 13px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11.5px;font-weight:600;color:var(--cl-t2);cursor:pointer;text-decoration:none;transition:all .13s;display:inline-flex;align-items:center;gap:5px;}
.cl-rd-link:hover{border-color:var(--cl-blue);color:var(--cl-blue);background:var(--cl-blue-lt);}
.cl-rd-link-pri{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}
.cl-rd-link-pri:hover{background:#2a3248;color:#fff;}

/* ── EVIDENCE MODAL */
.cl-modal-overlay{position:fixed;inset:0;background:rgba(20,25,40,.45);z-index:5000;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;backdrop-filter:blur(2px);}
.cl-modal-ev{background:var(--cl-card);border-radius:var(--cl-r-lg);width:100%;max-width:820px;max-height:86vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:var(--cl-sh-md),0 0 0 1px var(--cl-border);font-family:inherit;}
.cl-modal-head{padding:14px 20px;border-bottom:1px solid var(--cl-border-lt);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
.cl-modal-head-left{flex:1;min-width:0;display:flex;align-items:center;gap:10px;}
.cl-modal-clause-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 9px;border-radius:4px;flex-shrink:0;}
.cl-modal-oblig-short{font-size:12px;color:var(--cl-t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-modal-close{background:none;border:none;cursor:pointer;font-size:18px;color:var(--cl-t3);padding:2px 6px;flex-shrink:0;}
.cl-modal-close:hover{color:var(--cl-t1);}
.cl-ev-summary{display:flex;align-items:center;gap:8px;padding:10px 20px;background:var(--cl-nav-bg);border-bottom:1px solid var(--cl-border-lt);flex-shrink:0;flex-wrap:wrap;}
.cl-ev-pill{font-size:11px;font-weight:600;color:var(--cl-t2);background:var(--cl-card);border:1px solid var(--cl-border);padding:3px 11px;border-radius:20px;}
.cl-ev-pill-req{color:var(--cl-red);background:var(--cl-red-lt);border-color:#f5b8b8;}
.cl-ev-pill-rec{color:var(--cl-amber);background:var(--cl-amber-lt);border-color:#fcd34d;}
.cl-ev-pill-saved{color:var(--cl-green);background:var(--cl-green-lt);border-color:#6ee7b7;}
.cl-ev-table-wrap{flex:1;overflow-y:auto;}
.cl-ev-table{width:100%;border-collapse:collapse;table-layout:fixed;}
.cl-ev-th-num{width:36px;}.cl-ev-th-st{width:110px;}.cl-ev-th-sv{width:70px;}
.cl-ev-th{padding:10px 14px;background:#f0f4f8;border-bottom:2px solid var(--cl-border);font-size:10px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.07em;text-align:left;position:sticky;top:0;z-index:1;}
.cl-ev-tr{border-bottom:1px solid var(--cl-border-lt);transition:background .13s;}
.cl-ev-tr:hover{background:#f8fafc;}
.cl-ev-tr-saved{background:var(--cl-green-lt)!important;}
.cl-ev-td{padding:12px 14px;vertical-align:top;font-size:12.5px;color:var(--cl-t1);line-height:1.55;}
.cl-ev-td-num{text-align:center;font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-t3);vertical-align:middle;}
.cl-ev-td-st,.cl-ev-td-sv{vertical-align:middle;text-align:center;}
.cl-ev-doc-name{font-size:12.5px;font-weight:700;margin-bottom:2px;}
.cl-ev-doc-sub{font-size:10.5px;color:var(--cl-t3);margin-bottom:4px;}
.cl-ev-doc-needed{font-size:11.5px;color:var(--cl-t2);line-height:1.55;}
.cl-ev-badge{display:inline-block;font-size:9px;font-weight:700;padding:3px 9px;border-radius:4px;white-space:nowrap;}
.cl-ev-badge-req{background:var(--cl-red-lt);color:var(--cl-red);}
.cl-ev-badge-rec{background:var(--cl-amber-lt);color:var(--cl-amber);}
.cl-ev-save-btn{padding:5px 11px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:6px;font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .13s;white-space:nowrap;}
.cl-ev-save-btn:hover{border-color:var(--cl-green);color:var(--cl-green);background:var(--cl-green-lt);}
.cl-ev-saved{background:var(--cl-green-lt)!important;border-color:#6ee7b7!important;color:var(--cl-green)!important;cursor:default!important;}
.cl-modal-foot{padding:11px 20px;border-top:1px solid var(--cl-border-lt);background:var(--cl-nav-bg);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
.cl-modal-foot-note{font-size:11px;color:var(--cl-t3);flex:1;line-height:1.5;}
.cl-modal-btn{padding:7px 16px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .13s;}
.cl-modal-btn-sec{background:var(--cl-card);border:1.5px solid var(--cl-border);color:var(--cl-t1);}
.cl-modal-btn-sec:hover{background:var(--cl-hover);}
.cl-modal-btn-pri{background:var(--cl-t1);border:none;color:#fff;}
.cl-modal-btn-pri:hover{background:#2a3248;}

/* ── CLAUSE & OBL STATUS PILLS */
.cl-row-status-pill{font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;border:1px solid;white-space:nowrap;}
.cl-status-accepted{background:#dcfce7;color:#15803d;border-color:#6ee7b7;}
.cl-status-review{background:#fef3c7;color:#b45309;border-color:#fcd34d;}
.cl-status-rejected{background:#fdecea;color:#c92a2a;border-color:#f5b8b8;}

/* ── CLAUSE ROW eye btn */
.cl-row-eye-btn{width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);flex-shrink:0;transition:all .12s;}
.cl-row-eye-btn:hover{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}

/* ── EYE MODAL */
.cl-eye-overlay{position:fixed;inset:0;background:rgba(20,25,40,.5);z-index:5500;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(3px);}
.cl-eye-box{background:#fff;border-radius:14px;width:100%;max-width:620px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);animation:cl-popIn .22s ease;}
.cl-eye-box-wide{max-width:820px;}
.cl-eye-head{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--cl-border-lt);background:var(--cl-nav-bg);flex-shrink:0;}
.cl-eye-head-left{display:flex;align-items:center;gap:10px;}
.cl-eye-head-right{display:flex;align-items:center;gap:8px;}
.cl-eye-id-chip{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:white;background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 9px;border-radius:4px;}
.cl-eye-head-title{font-size:13px;font-weight:700;color:var(--cl-t1);}
.cl-eye-regen-btn{padding:5px 12px;background:#fff;border:1.5px solid var(--cl-purple);border-radius:20px;font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-purple);cursor:pointer;transition:all .13s;white-space:nowrap;}
.cl-eye-regen-btn:hover{background:var(--cl-purple-lt);}
.cl-eye-close{width:28px;height:28px;border-radius:50%;background:#e2e5eb;border:none;font-size:13px;color:var(--cl-t2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;}
.cl-eye-close:hover{background:var(--cl-t1);color:#fff;}
.cl-eye-body{flex:1;overflow-y:auto;padding:18px 20px;display:flex;flex-direction:column;gap:14px;}
.cl-eye-section{display:flex;flex-direction:column;gap:6px;}
.cl-eye-sec-label{font-size:9px;font-weight:800;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
.cl-eye-textarea{width:100%;padding:10px 12px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:8px;font-family:inherit;font-size:13px;color:var(--cl-t1);line-height:1.65;resize:vertical;outline:none;}
.cl-eye-textarea:focus{border-color:var(--cl-blue);background:#fff;}
.cl-eye-fields-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;}
.cl-eye-field{display:flex;flex-direction:column;gap:4px;}
.cl-eye-field-label{font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;}
.cl-eye-input{padding:7px 10px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:6px;font-family:inherit;font-size:12px;color:var(--cl-t1);outline:none;transition:border .12s;}
.cl-eye-input:focus{border-color:var(--cl-blue);background:#fff;}
.cl-eye-select{padding:7px 10px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:6px;font-family:inherit;font-size:12px;color:var(--cl-t1);outline:none;cursor:pointer;}
.cl-eye-status-select{font-weight:700;}
.cl-eye-meta-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.cl-eye-meta-cell{display:flex;flex-direction:column;gap:4px;}
.cl-eye-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px;border-top:1px solid var(--cl-border-lt);background:var(--cl-nav-bg);flex-shrink:0;}
.cl-eye-foot-note{font-size:11px;color:var(--cl-t3);}
.cl-eye-cancel-btn{padding:8px 16px;background:#fff;border:1.5px solid var(--cl-border);border-radius:8px;font-size:12px;font-weight:600;color:var(--cl-t2);cursor:pointer;font-family:inherit;}
.cl-eye-save-btn{padding:8px 18px;background:var(--cl-t1);border:none;border-radius:8px;font-size:12px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;}
.cl-eye-save-btn:hover{background:#2a3248;}


/* ── ADVANCED FILTERS BAR */
.cl-adv-filters{padding:0 0 12px 0;display:flex;flex-direction:column;gap:8px;border-bottom:1px solid var(--cl-border-lt);margin-bottom:14px;}
.cl-adv-filter-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.cl-adv-select{padding:5px 10px;background:#fff;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;color:var(--cl-t2);outline:none;cursor:pointer;transition:border .12s;}
.cl-adv-select:focus{border-color:var(--cl-blue);}
.cl-adv-date{padding:5px 10px;background:#fff;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;color:var(--cl-t2);outline:none;transition:border .12s;}
.cl-adv-date:focus{border-color:var(--cl-blue);}
.cl-adv-clear{padding:5px 12px;background:none;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;color:var(--cl-t3);cursor:pointer;transition:all .12s;}
.cl-adv-clear:hover{border-color:var(--cl-red);color:var(--cl-red);}
.cl-circ-switch-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.cl-circ-switch-label{font-size:10px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}
.cl-circ-switch-select{max-width:320px;flex:1;}
.cl-adv-overview-btn{padding:5px 12px;background:none;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t2);cursor:pointer;white-space:nowrap;transition:all .12s;}
.cl-adv-overview-btn:hover{background:var(--cl-hover);color:var(--cl-t1);}

/* ── EYE PEN BUTTON */
.cl-eye-pen-btn{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:#fff;border:1.5px solid var(--cl-border);border-radius:20px;font-family:inherit;font-size:10px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .12s;}
.cl-eye-pen-btn:hover{border-color:var(--cl-purple);color:var(--cl-purple);}

/* ── EYE DISABLED FIELDS */
.cl-eye-disabled{opacity:.55;background:#f0f1f4!important;cursor:not-allowed!important;}

/* ── ACTION EYE BTN */
.cl-act-eye-btn{flex-shrink:0;width:20px;height:20px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;margin-top:1px;}
.cl-act-eye-btn:hover{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}


/* ── TOPBAR FILTER EXTRAS */
.cl-filter-date{padding:5px 8px;background:#fff;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;color:var(--cl-t2);outline:none;transition:border .12s;cursor:pointer;}
.cl-filter-date:focus{border-color:var(--cl-blue);}
.cl-filter-clear-btn{padding:5px 10px;background:none;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;color:var(--cl-t3);cursor:pointer;transition:all .12s;white-space:nowrap;}
.cl-filter-clear-btn:hover{border-color:var(--cl-red);color:var(--cl-red);}

/* ── CHAPTER NAV STATUS BADGES */
.cl-nav-ch-right{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;}
.cl-nav-ch-badges{display:flex;align-items:center;gap:3px;}
.cl-nav-stat-badge{font-size:8px;font-weight:700;padding:1px 5px;border-radius:8px;white-space:nowrap;}
.cl-nav-stat-acc{background:#dcfce7;color:#15803d;}
.cl-nav-stat-rev{background:#fef3c7;color:#b45309;}
.cl-nav-stat-rej{background:#fdecea;color:#c92a2a;}





.cl-topbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 16px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-md);box-shadow:var(--cl-sh);}
.cl-topbar-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1;flex-wrap:wrap;}
.cl-topbar-right{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap;}

/* loading spinner */
.ai-loading{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 20px;}
.ai-loading-text{font-size:13px;color:#9499aa;font-family:var(--cl-font);}
.spinner{width:28px;height:28px;border:3px solid #eef0f3;border-top-color:#1a1a2e;border-radius:50%;animation:cl-spin .7s linear infinite;}
@keyframes cl-spin{to{transform:rotate(360deg)}}

/* ── FILTER CARD ── */
.cl-filter-card{background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-md);box-shadow:var(--cl-sh);padding:12px 16px;display:flex;flex-direction:column;gap:10px;}

/* Row 1 */
.cl-fc-row1{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.cl-fc-field-circ{flex:1;min-width:220px;}
.cl-fc-label{display:block;font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;}

/* Circular selector button */
.cl-circ-sel-wrap{position:relative;}
.cl-circ-sel-btn{display:flex;align-items:center;gap:7px;padding:7px 11px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);cursor:pointer;font-family:inherit;width:100%;transition:border-color .13s;}
.cl-circ-sel-btn:hover{border-color:var(--cl-blue);}
.cl-circ-sel-btn .cl-circ-id-chip{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 7px;border-radius:4px;flex-shrink:0;white-space:nowrap;}
.cl-circ-sel-btn .cl-circ-name-chip{font-size:12px;color:var(--cl-t2);flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-csel-arr{font-size:11px;color:var(--cl-t3);flex-shrink:0;}
.cl-sw-dropdown{position:absolute;top:calc(100% + 4px);left:0;min-width:100%;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-md);z-index:9999;box-shadow:0 8px 24px rgba(26,26,46,.14);overflow:hidden;}
.cl-sw-search-wrap{display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid var(--cl-border-lt);}
.cl-sw-icon{color:var(--cl-t3);font-size:14px;flex-shrink:0;}
.cl-sw-input{flex:1;border:none;outline:none;font-family:inherit;font-size:12px;color:var(--cl-t1);background:transparent;}
.cl-sw-dd-item{padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--cl-border-lt);transition:background .1s;}
.cl-sw-dd-item:last-child{border-bottom:none;}
.cl-sw-dd-item:hover{background:var(--cl-hover);}
.cl-sw-dd-id{font-family:var(--cl-mono);font-size:10px;font-weight:700;color:var(--cl-blue);display:block;}
.cl-sw-dd-title{font-size:11px;color:var(--cl-t2);display:block;margin-top:1px;}

/* Row 2 */
.cl-fc-row2{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;padding-top:10px;border-top:1px solid var(--cl-border-lt);}
.cl-fc-field{display:flex;flex-direction:column;gap:4px;flex:1;min-width:120px;}
.cl-fc-field-search{flex:2;min-width:200px;}
.cl-fc-sel{padding:7px 10px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;color:var(--cl-t1);outline:none;cursor:pointer;width:100%;transition:border-color .13s;}
.cl-fc-sel:focus{border-color:var(--cl-blue);background:#fff;}
.cl-fc-date{padding:7px 10px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;color:var(--cl-t1);outline:none;width:100%;transition:border-color .13s;cursor:pointer;}
.cl-fc-date:focus{border-color:var(--cl-blue);background:#fff;}
.cl-fc-search-inp{padding:7px 11px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;color:var(--cl-t1);outline:none;width:100%;transition:border-color .13s;}
.cl-fc-search-inp:focus{border-color:var(--cl-blue);background:#fff;}
.cl-fc-clear-btn{padding:7px 14px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t3);cursor:pointer;white-space:nowrap;align-self:flex-end;transition:all .13s;}
.cl-fc-clear-btn:hover{border-color:var(--cl-red);color:var(--cl-red);}
  `;
  document.head.appendChild(s);
}