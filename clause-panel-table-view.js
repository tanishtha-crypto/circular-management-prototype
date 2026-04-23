/* ================================================================
   clause-panel-table-view.js  —  Table View for Clause Breakdown Panel
   Depends on clause-panel-v4.js for all modals and helper functions.
   Adds a Table / Chapter toggle to the workspace header.
   Columns: Obl ID | Obligation Name | Action | Departments |
            Applicable | Status | Due Date | View
   ================================================================ */

/* ─────────────────────────────────────── VIEW TOGGLE INJECTION
   Call this once after _clRenderStack builds .cl-stack-header.
   Injects a Table | Chapter pill toggle into the header right side.
*/
window._clInjectViewToggle = function () {
  /* avoid duplicates */
  if (document.getElementById('cl-view-toggle-wrap')) return;

  const header = document.querySelector('.cl-stack-header');
  if (!header) return;

  const wrap = document.createElement('div');
  wrap.id = 'cl-view-toggle-wrap';
  wrap.style.cssText = [
    'display:flex',
    'align-items:center',
    'gap:0',
    'border:1px solid #e5e7eb',
    'border-radius:7px',
    'overflow:hidden',
    'flex-shrink:0',
    'margin-right:6px',
  ].join(';');

  wrap.innerHTML = `
    <button
      id="cl-vtog-chapter"
      onclick="_clViewToggle('chapter')"
      style="
        padding:5px 13px;
        font-size:11px;
        font-weight:700;
        border:none;
        cursor:pointer;
        font-family:inherit;
        background:#1e293b;
        color:#fff;
        transition:all .15s;
      "
    >≡ Chapter</button>
    <button
      id="cl-vtog-table"
      onclick="_clViewToggle('table')"
      style="
        padding:5px 13px;
        font-size:11px;
        font-weight:700;
        border:none;
        cursor:pointer;
        font-family:inherit;
        background:#fff;
        color:#6b7280;
        transition:all .15s;
      "
    >⊞ Table</button>`;

  /* insert before the dots-wrap */
  const dotsWrap = document.getElementById('cl-stack-dots-wrap');
  const rightDiv = header.querySelector('div[style*="display:flex"]') || header;
  if (dotsWrap && dotsWrap.parentNode === rightDiv) {
    rightDiv.insertBefore(wrap, dotsWrap);
  } else {
    rightDiv.appendChild(wrap);
  }
};

/* ─────────────────────────────────────── TOGGLE HANDLER */
window._clViewToggle = function (mode) {
  window._CL_ACTIVE_VIEW = mode;

  /* update pill styles */
  const chBtn = document.getElementById('cl-vtog-chapter');
  const tbBtn = document.getElementById('cl-vtog-table');
  if (chBtn && tbBtn) {
    if (mode === 'chapter') {
      chBtn.style.background = '#1e293b'; chBtn.style.color = '#fff';
      tbBtn.style.background = '#fff';    tbBtn.style.color = '#6b7280';
    } else {
      tbBtn.style.background = '#1e293b'; tbBtn.style.color = '#fff';
      chBtn.style.background = '#fff';    chBtn.style.color = '#6b7280';
    }
  }

  const clauses = window._CL_ACTIVE_SECTION_CLAUSES || [];
  const labels  = window._CL_ACTIVE_LABELS || {};

  if (mode === 'table') {
    _clShowTableView(clauses, labels);
  } else {
    clNavExpand();
    _clRenderStack(clauses, labels);
  }
};

/* ─────────────────────────────────────── FLATTEN CLAUSES → OBL ROWS
   Same logic as _clRenderStack so both views share identical data.
*/
window._clFlattenOblRows = function (allClauses) {
  const statusF = document.getElementById('cl-adv-status')?.value || '';
  const searchQ = (document.getElementById('cl-adv-search')?.value || '').toLowerCase();

  const rows = [];

  allClauses.forEach(cl => {
    const obligsRaw  = cl.obligations || cl.obligation || null;
    const obligsArr  = Array.isArray(obligsRaw) ? obligsRaw
      : typeof obligsRaw === 'string' && obligsRaw ? [obligsRaw] : [];
    const actsRaw    = cl.actionables || cl.actionable || [];
    const actsArr    = Array.isArray(actsRaw) ? actsRaw
      : typeof actsRaw === 'string' ? actsRaw.split(';').map(a => a.trim()).filter(Boolean) : [];

    const oblSource  = obligsArr.length ? obligsArr : [cl.text || cl.id];

    oblSource.forEach((ob, oi) => {
      const obText = typeof ob === 'string' ? ob : (ob.text || ob.name || '');
      const obId   = typeof ob === 'object' && ob.id
        ? ob.id
        : `OBL-${cl.id}-${oi + 1}`;
      const uid    = `${cl.id}-${oi}`;

      /* apply status filter */
      const oblStatus = window._CL_OBL_STATUS?.[uid] || '';
      if (statusF && oblStatus !== statusF) return;

      /* apply search filter */
      if (searchQ && !`${obId} ${obText} ${cl.id}`.toLowerCase().includes(searchQ)) return;

      rows.push({ uid, obId, obText, actsArr, cl, oi, oblStatus });
    });
  });

  return rows;
};

/* ─────────────────────────────────────── MAIN TABLE VIEW RENDERER */
window._clShowTableView = function (allClauses, labels) {
  allClauses = allClauses || window._CL_ACTIVE_SECTION_CLAUSES || [];
  labels     = labels     || window._CL_ACTIVE_LABELS || {};

  const ws = document.getElementById('cl-ws-main');
  const ph = document.getElementById('cl-ws-ph');
  if (!ws) return;
  ph.style.display = 'none';
  ws.style.display = 'block';
  window._CL_ACTIVE_EXPANDED_CLAUSE = null;

  /* hide left nav in table view */
  clNavCollapse();

  const rows = _clFlattenOblRows(allClauses);

  ws.innerHTML = `
  <div class="cl-stack-wrap">

    <!-- ── HEADER (same as chapter view) ── -->
    <div class="cl-stack-header">
      <div class="cl-stack-header-left">
        ${labels.chLabel  ? `<span class="cl-stack-ch-num">${labels.chLabel}</span>` : ''}
        ${labels.chTitle  ? `<span class="cl-stack-ch-title">${labels.chTitle}</span>` : ''}
        ${labels.secLabel ? `<span class="cl-stack-sec-sep">·</span><span class="cl-stack-sec-label">${labels.secLabel}</span>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        <span class="cl-stack-count">${rows.length} obligation${rows.length !== 1 ? 's' : ''}</span>

        <!-- view toggle injected here by _clInjectViewToggle -->

        <!-- dots menu (same as chapter view) -->
        <div style="position:relative;" id="cl-stack-dots-wrap">
          <button
            onclick="event.stopPropagation();document.getElementById('cl-stack-dots-wrap').classList.toggle('open')"
            style="width:28px;height:28px;border-radius:6px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-size:16px;display:inline-flex;align-items:center;justify-content:center;color:#6b7280;"
          >⋮</button>
          <div style="display:none;position:absolute;right:0;top:calc(100% + 4px);background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);min-width:200px;z-index:500;overflow:hidden;" class="cl-sdots-menu">
            <div style="padding:4px 10px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">AI</div>
            <button onclick="document.getElementById('cl-stack-dots-wrap').classList.remove('open');_clOpenCtxModal('all_obligations','All Obligations')"
              style="display:flex;align-items:center;gap:9px;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#7c3aed;cursor:pointer;"
              onmouseover="this.style.background='#f5f3ff'" onmouseout="this.style.background='none'">✦ Regenerate All Obligations</button>
            <div style="border-top:1px solid #f3f4f6;margin:4px 0;"></div>
            <div style="padding:4px 10px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">Add</div>
            <button onclick="document.getElementById('cl-stack-dots-wrap').classList.remove('open');_clAddObligationPopup()"
              style="display:flex;align-items:center;gap:9px;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;"
              onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">+ Add Obligation</button>
            <button onclick="document.getElementById('cl-stack-dots-wrap').classList.remove('open');_clAddActionPopup()"
              style="display:flex;align-items:center;gap:9px;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;"
              onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">+ Add Action</button>
            <div style="border-top:1px solid #f3f4f6;margin:4px 0;"></div>
            <div style="padding:4px 10px;font-size:9px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">Data</div>
            <button onclick="document.getElementById('cl-stack-dots-wrap').classList.remove('open');_clOpenExportPopup()"
              style="display:flex;align-items:center;gap:9px;width:100%;padding:9px 14px;background:none;border:none;text-align:left;font-size:12px;font-weight:600;color:#374151;cursor:pointer;"
              onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">⬆ Export</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TABLE ── -->
    <div style="overflow-x:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-top:2px;">
      <table id="cl-tbl-view" style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead>
          <tr style="background:#f8fafc;border-bottom:2px solid #e5e7eb;">
            <th style="${_clTh()}width:110px;">Obl ID</th>
            <th style="${_clTh()}">Obligation Name</th>
            <th style="${_clTh()}">Actions</th>
            <th style="${_clTh()}width:110px;">Departments</th>
            <th style="${_clTh()}width:100px;text-align:center;">Applicable</th>
            <th style="${_clTh()}width:120px;text-align:center;">Status</th>
            <th style="${_clTh()}width:95px;">Due Date</th>
            <th style="${_clTh()}width:48px;text-align:center;">View</th>
          </tr>
        </thead>
        <tbody id="cl-tbl-body">
          ${rows.length
            ? rows.map((r, idx) => _clTableRowHTML(r, idx)).join('')
            : `<tr><td colspan="8" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">No obligations found.</td></tr>`
          }
        </tbody>
      </table>
    </div>

  </div>`;

  /* ── wire dots menu ── */
  const sdm  = ws.querySelector('.cl-sdots-menu');
  const sdWrap = document.getElementById('cl-stack-dots-wrap');
  if (sdm && sdWrap) {
    new MutationObserver(() => {
      sdm.style.display = sdWrap.classList.contains('open') ? 'block' : 'none';
    }).observe(sdWrap, { attributes: true, attributeFilter: ['class'] });
  }
  document.addEventListener('click', () => {
    document.getElementById('cl-stack-dots-wrap')?.classList.remove('open');
  });

  /* ── inject view toggle into the freshly rendered header ── */
  _clInjectViewToggle();

  /* ── set table button as active ── */
  const tbBtn = document.getElementById('cl-vtog-table');
  const chBtn = document.getElementById('cl-vtog-chapter');
  if (tbBtn) { tbBtn.style.background = '#1e293b'; tbBtn.style.color = '#fff'; }
  if (chBtn) { chBtn.style.background = '#fff';    chBtn.style.color = '#6b7280'; }
};

/* ─────────────────────────────────────── TH STYLE HELPER */
function _clTh() {
  return 'padding:10px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;white-space:nowrap;';
}

/* ─────────────────────────────────────── ROW HTML */
function _clTableRowHTML(r, idx) {
  const { uid, obId, obText, actsArr, cl, oi, oblStatus } = r;

  /* ── status chip style ── */
  const statusStyle = oblStatus === 'Accepted'
    ? 'background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;'
    : oblStatus === 'Under Review'
    ? 'background:#fef9c3;color:#b45309;border:1px solid #fcd34d;'
    : oblStatus === 'Rejected'
    ? 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;'
    : 'background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;';

  /* ── applicability ── */
  const isApplicable = !window._CL_OBL_APPLICABILITY || window._CL_OBL_APPLICABILITY[uid] !== false;
  const applicStyle = isApplicable
    ? 'background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;'
    : 'background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;';
  const applicLabel = isApplicable ? '⊕ Applicable' : '— N/A';

  /* ── department ── */
  const dept = window._CL_ACT_DEPT?.[`${uid}-0`] || cl.department || '';

  /* ── due date from meta ── */
  const meta    = typeof _clObligMeta === 'function' ? _clObligMeta(oi) : {};
  const dueDate = meta.dueDate || '—';

  /* ── action preview (first action, truncated) ── */
  const actPreview = actsArr.length
    ? `<span style="font-size:11.5px;color:#374151;">${actsArr[0].substring(0, 55)}${actsArr[0].length > 55 ? '…' : ''}</span>
       ${actsArr.length > 1 ? `<span style="font-size:10px;color:#6b7280;margin-left:4px;">+${actsArr.length - 1} more</span>` : ''}`
    : '<span style="font-size:11px;color:#d1d5db;font-style:italic;">No actions</span>';

  return `
  <tr id="cl-tbl-row-${uid}"
    style="border-bottom:1px solid #f4f5f8;transition:background .1s;cursor:default;"
    onmouseover="this.style.background='#f8f9ff'"
    onmouseout="this.style.background=''"
  >

    <!-- OBL ID -->
    <td style="padding:11px 12px;vertical-align:middle;">
      <span style="
        font-family:monospace;font-size:10.5px;font-weight:700;
        color:#fff;background:#7c3aed;
        padding:2px 8px;border-radius:4px;
        white-space:nowrap;display:inline-block;
      ">${obId}</span>
    </td>

    <!-- OBLIGATION NAME -->
    <td style="padding:11px 12px;vertical-align:middle;max-width:240px;">
      <div style="font-size:12.5px;font-weight:500;color:#1f2937;line-height:1.45;">
        ${obText.substring(0, 80)}${obText.length > 80 ? '…' : ''}
      </div>
    </td>

    <!-- ACTIONS -->
    <td style="padding:11px 12px;vertical-align:middle;max-width:220px;">
      ${actPreview}
    </td>

    <!-- DEPARTMENTS — click to pick -->
    <td style="padding:11px 12px;vertical-align:middle;">
      <button
        onclick="event.stopPropagation();_clPickActDept('${uid}-0')"
        title="Click to assign departments"
        style="
          font-size:10.5px;font-weight:600;
          padding:3px 9px;border-radius:10px;
          background:#eff6ff;border:1px solid #bfdbfe;color:#2563eb;
          cursor:pointer;white-space:nowrap;
          font-family:inherit;
        "
      >${dept || '+ Dept'}</button>
    </td>

    <!-- APPLICABLE — click opens applicability popup -->
    <td style="padding:11px 12px;vertical-align:middle;text-align:center;">
      <button
        onclick="event.stopPropagation();_clShowApplicabilityReason('${uid}','${obId}')"
        title="View applicability reason"
        style="
          font-size:10px;font-weight:700;
          padding:3px 10px;border-radius:10px;
          cursor:pointer;white-space:nowrap;
          font-family:inherit;
          ${applicStyle}
        "
      >${applicLabel}</button>
    </td>

    <!-- STATUS — toggle button -->
    <td style="padding:11px 12px;vertical-align:middle;text-align:center;">
      <button
        onclick="event.stopPropagation();_clCycleOblStatus('${uid}','${cl.id}',${oi})"
        title="Click to cycle status"
        style="
          font-size:10px;font-weight:700;
          padding:3px 10px;border-radius:10px;
          cursor:pointer;white-space:nowrap;
          font-family:inherit;min-width:90px;
          ${statusStyle}
        "
        id="cl-tbl-status-${uid}"
      >${oblStatus || 'Set Status'}</button>
    </td>

    <!-- DUE DATE -->
    <td style="padding:11px 12px;vertical-align:middle;font-size:12px;color:#6b7280;white-space:nowrap;">
      ${dueDate}
    </td>

    <!-- VIEW — eye icon → clOpenOblEyeModal -->
    <td style="padding:11px 12px;vertical-align:middle;text-align:center;">
      <button
        onclick="event.stopPropagation();clOpenOblEyeModal('${uid}','${cl.id}',${oi})"
        title="View obligation details"
        style="
          width:28px;height:28px;border-radius:50%;
          background:#fff;border:1px solid #e5e7eb;
          display:inline-flex;align-items:center;justify-content:center;
          cursor:pointer;color:#6b7280;
          transition:all .12s;
        "
        onmouseover="this.style.background='#eef2ff';this.style.borderColor='#c7d2fe';this.style.color='#4338ca'"
        onmouseout="this.style.background='#fff';this.style.borderColor='#e5e7eb';this.style.color='#6b7280'"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
    </td>

  </tr>`;
}

/* ─────────────────────────────────────── RE-RENDER TABLE IN PLACE
   Called by _clCycleOblStatus and _clPickActDept after they mutate
   window state, so the table reflects the new values without a full
   rebuild (same pattern as chapter view's _clRenderStack call).
   We hook into the existing pattern by patching the two functions
   to also refresh the table when the table view is active.
*/
(function _clPatchCycleForTable() {
  const _originalCycle = window._clCycleOblStatus;
  window._clCycleOblStatus = function (uid, clauseId, oblIdx) {
    _originalCycle(uid, clauseId, oblIdx);
    if (window._CL_ACTIVE_VIEW === 'table') {
      /* _originalCycle already calls _clRenderStack which re-renders chapter;
         for table view we need to re-render the table instead */
      _clShowTableView(
        window._CL_ACTIVE_SECTION_CLAUSES,
        window._CL_ACTIVE_LABELS
      );
    }
  };
})();

/* ─────────────────────────────────────── PATCH _clRenderStack
   After the chapter view re-renders, inject the view toggle so
   switching back to chapter view also shows the toggle.
*/
(function _clPatchRenderStackForToggle() {
  const _originalRender = window._clRenderStack;
  if (!_originalRender) return; /* guard: load order */
  window._clRenderStack = function (allClauses, labels) {
    _originalRender(allClauses, labels);
    /* inject toggle into chapter view header */
    _clInjectViewToggle();
    /* ensure chapter button is marked active */
    const chBtn = document.getElementById('cl-vtog-chapter');
    const tbBtn = document.getElementById('cl-vtog-table');
    if (chBtn && window._CL_ACTIVE_VIEW !== 'table') {
      chBtn.style.background = '#1e293b'; chBtn.style.color = '#fff';
      if (tbBtn) { tbBtn.style.background = '#fff'; tbBtn.style.color = '#6b7280'; }
    }
  };
})();

/* ─────────────────────────────────────── FILTER SUPPORT
   Table view re-renders when the shared filter bar changes.
*/
(function _clPatchApplyAdvFiltersForTable() {
  const _originalFilter = window._clApplyAdvFilters;
  window._clApplyAdvFilters = function () {
    if (window._CL_ACTIVE_VIEW === 'table') {
      _clShowTableView(
        window._CL_ACTIVE_SECTION_CLAUSES,
        window._CL_ACTIVE_LABELS
      );
    } else {
      _originalFilter();
    }
  };
})();