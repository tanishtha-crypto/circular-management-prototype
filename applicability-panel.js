


/**
 * applicability-panel.js  —  Panel 1: Applicability Analysis (v2)
 * NEW: Edit toggles (Table 1 & 2), N/A status, Version History modal,
 *      Regenerate with AI Context modal, inline cell editing (Table 2)
 */

function buildApplicabilityPanel() {
  injectSharedCSS();
  injectAppCSS();
  return `
  <div class="app-wrap">

    <!-- CIRCULAR SELECTOR (always visible, pre-filled if coming from overview) -->
    <div class="sh-card" id="app-circ-selector-card">
      <div class="sh-card-head">
        <div class="sh-dot" id="app-sel-dot">1</div>
        <div style="flex:1;min-width:0;">
          <div class="sh-card-title">Select Circular</div>
          <div class="sh-card-sub">Search and confirm a circular to analyse applicability</div>
        </div>
      </div>
      <div class="sh-card-body" style="overflow:visible;">
        <div class="app-sel-row">
          <div class="app-sel-search-wrap">
            <span class="app-sel-icon">⌕</span>
            <input class="app-sel-input" id="app-sel-input" type="text"
              placeholder="Search by ID, title, regulator…" autocomplete="off"/>
            <div class="app-sel-dropdown" id="app-sel-dropdown" style="display:none;"></div>
          </div>
          <button class="app-sel-confirm-btn" id="app-sel-confirm-btn" disabled>Confirm →</button>
        </div>
        <!-- confirmed strip -->
        <div class="app-sel-confirmed" id="app-sel-confirmed" style="display:none;">
          <div class="app-sel-conf-left">
            <span class="app-sel-conf-id" id="app-sel-conf-id"></span>
            <span class="app-sel-conf-sep">·</span>
            <span class="app-sel-conf-name" id="app-sel-conf-name"></span>
          </div>
          <button class="app-sel-change-btn" id="app-sel-change-btn">⇄ Change</button>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT (shown when circular selected) -->
    <div id="app-main">

      
    

      <!-- ANALYSIS CARD -->
      <div class="sh-card" style="margin-top:5px;">
        <div class="sh-card-head">
          <div class="sh-dot" id="app-s1">1</div>
          <div style="flex:1;min-width:0; display:flex;justify-content:space-between;">
            <div class="sh-card-title" style="align-self:center">Applicability Analysis</div>
            <div class="ap-header-controls">
              <div class="app-scope-field">
                <label class="sh-field-label">Entity Type Override</label>
                <select class="app-select" id="app-etype">
                  <option value="">Use organisation default</option>
                  <option value="NBFC">NBFC</option>
                  <option value="HFC">HFC</option>
                  <option value="Bank">Commercial Bank</option>
                  <option value="MFI">Microfinance Institution</option>
                  <option value="Insurance">Insurance Company</option>
                  <option value="SEBI">SEBI-registered Entity</option>
                </select>
              </div>
              <div class="app-scope-field">
                <label class="sh-field-label">Analysis Scope</label>
                <select class="app-select" id="app-scope">
                  <option value="full">Full — All parameters</option>
                  <option value="risk">Risk-focused</option>
                  <option value="ops">Operational only</option>
                </select>
              </div>
              <button class="app-btn-run" id="app-btn-run">
                ◈ &nbsp;Analyse Applicability
              </button>
            </div>
          </div>
        </div>
        <div class="sh-card-body">
          <div id="app-output"></div>
        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <div class="app-footer" id="app-next-wrapper" style="display:none;">
      <button class="app-footer-btn app-btn-regen" id="app-btn-regen">↺ &nbsp;Regenerate</button>
      <button class="app-footer-btn app-btn-save"  id="app-btn-save">🔖 &nbsp;Save to My Library</button>
      <button class="app-footer-btn app-btn-next"  id="app-btn-next">Next → Executive Summary</button>
    </div>

  </div>

  <!-- ═══════════════════════════════════════════════════════════
       AI CONTEXT MODAL
  ═══════════════════════════════════════════════════════════ -->
  <div class="app-modal-overlay" id="app-ctx-modal" onclick="_appCloseCtxModal(event)">
    <div class="app-modal-box" onclick="event.stopPropagation()">
      <div class="app-modal-header">
        <div class="app-modal-title">✦ Regenerate with AI Context</div>
        <button class="app-modal-close" onclick="_appCloseCtxModal()">✕</button>
      </div>
      <div class="app-modal-body">
        <p class="app-modal-desc">
          Add any extra context, specific details, or instructions you want the AI to incorporate during regeneration.
        </p>
        <div class="app-ctx-chips" id="app-ctx-chips">
          <span class="app-chip" onclick="_appToggleChip(this,'Focus on risk thresholds')">Risk Thresholds</span>
          <span class="app-chip" onclick="_appToggleChip(this,'Include provisioning norms')">Provisioning Norms</span>
          <span class="app-chip" onclick="_appToggleChip(this,'Highlight SEBI overlaps')">SEBI Overlaps</span>
          <span class="app-chip" onclick="_appToggleChip(this,'Consider recent amendments')">Recent Amendments</span>
          <span class="app-chip" onclick="_appToggleChip(this,'Emphasise capital adequacy')">Capital Adequacy</span>
          <span class="app-chip" onclick="_appToggleChip(this,'Include FDI norms')">FDI Norms</span>
        </div>
        <textarea class="app-ctx-textarea" id="app-ctx-input" placeholder="e.g. We have recently crossed ₹500 Cr AUM — please adjust threshold assessments accordingly. Also include analysis on the new RBI liquidity framework."></textarea>
        <div class="app-modal-footer">
          <button class="app-modal-btn-cancel" onclick="_appCloseCtxModal()">Cancel</button>
          <button class="app-modal-btn-go" onclick="_appRunWithContext()">✦ &nbsp;Regenerate with Context</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════
       VERSION HISTORY MODAL
  ═══════════════════════════════════════════════════════════ -->
  <div class="app-modal-overlay" id="app-ver-modal" onclick="_appCloseVerModal(event)">
    <div class="app-modal-box app-ver-box" onclick="event.stopPropagation()">
      <div class="app-modal-header">
        <div class="app-modal-title">🕑 &nbsp;Version History</div>
        <button class="app-modal-close" onclick="_appCloseVerModal()">✕</button>
      </div>
      <div class="app-modal-body">
        <div class="app-ver-subtitle" id="app-ver-label">Changes made to this table</div>
        <div id="app-ver-list" class="app-ver-list"></div>
      </div>
    </div>
  </div>`;
}

/* ─────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────── */
const _APP_HISTORY = {
  entities: [],   // [{ts, label, snapshot:[{name,match},...]}]
  params:   [],   // [{ts, label, snapshot:[{name,threshold,status},...]}]
};

/* ─────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────── */
function initApplicabilityListeners() {
  injectSharedCSS();
  injectAppCSS();

  const mainEl = document.getElementById('app-main');
  if (mainEl) mainEl.style.display = 'block';

  /* ── CIRCULAR SELECTOR ── */
  const selInput    = document.getElementById('app-sel-input');
  const selDropdown = document.getElementById('app-sel-dropdown');
  const selConfirm  = document.getElementById('app-sel-confirm-btn');
  const selConfirmed= document.getElementById('app-sel-confirmed');
  const selChange   = document.getElementById('app-sel-change-btn');
  const selDot      = document.getElementById('app-sel-dot');
  let _selCirc      = null;

  /* pre-fill if coming from overview */
  const preId = AI_LIFECYCLE_STATE.selectedCircularId;
  if (preId) {
    const preCirc = (CMS_DATA?.circulars || []).find(c => c.id === preId);
    if (preCirc) _appConfirmCircular(preCirc);
  }

  if (selInput) {
    selInput.addEventListener('input', () => {
      const q = selInput.value.trim().toLowerCase();
      if (!q) { selDropdown.style.display = 'none'; return; }
      const matches = (CMS_DATA?.circulars || [])
        .filter(c =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.regulator || '').toLowerCase().includes(q)
        ).slice(0, 8);
      if (!matches.length) { selDropdown.style.display = 'none'; return; }
      selDropdown.innerHTML = matches.map(c => `
        <div class="app-sel-dd-item" data-id="${c.id}">
          <div class="app-sel-dd-meta">
            <span class="app-sel-dd-id">${c.id}</span>
            <span class="app-sel-dd-reg">${c.regulator || ''}</span>
            ${c.risk ? `<span class="app-sel-dd-risk app-risk-${c.risk.toLowerCase()}">${c.risk}</span>` : ''}
          </div>
          <div class="app-sel-dd-title">${c.title}</div>
        </div>`).join('');
      selDropdown.style.display = 'block';
      selDropdown.querySelectorAll('.app-sel-dd-item').forEach(item => {
        item.addEventListener('click', () => {
          const circ = (CMS_DATA?.circulars || []).find(c => c.id === item.dataset.id);
          if (circ) {
            selInput.value = `${circ.id} – ${circ.title}`;
            selDropdown.style.display = 'none';
            _selCirc = circ;
            selConfirm.disabled = false;
          }
        });
      });
    });
    document.addEventListener('click', e => {
      if (!selInput.contains(e.target) && !selDropdown?.contains(e.target))
        selDropdown.style.display = 'none';
    });
  }

  selConfirm?.addEventListener('click', () => {
    if (_selCirc) _appConfirmCircular(_selCirc);
  });

  selChange?.addEventListener('click', () => {
    /* reset selector */
    _selCirc = null;
    AI_LIFECYCLE_STATE.selectedCircularId = null;
    if (selInput)     selInput.value = '';
    if (selConfirm)   selConfirm.disabled = true;
    if (selConfirmed) selConfirmed.style.display = 'none';
    if (selInput)     selInput.closest('.app-sel-row').style.display = 'flex';
    if (selDot)       { selDot.classList.remove('done'); selDot.textContent = '1'; }
    /* clear results */
    const out = document.getElementById('app-output');
    if (out) out.innerHTML = '';
    document.getElementById('app-next-wrapper').style.display = 'none';
    const dot = document.getElementById('app-s1');
    if (dot) { dot.classList.remove('done'); dot.textContent = '1'; }
  });

  function _appConfirmCircular(circ) {
    _selCirc = circ;
    AI_LIFECYCLE_STATE.selectedCircularId = circ.id;
    /* show confirmed strip, hide search row */
    if (selInput) selInput.closest('.app-sel-row').style.display = 'none';
    document.getElementById('app-sel-conf-id').textContent   = circ.id;
    document.getElementById('app-sel-conf-name').textContent = circ.title;
    if (selConfirmed) selConfirmed.style.display = 'flex';
    if (selDot) { selDot.classList.add('done'); selDot.textContent = '✓'; }
    _appFillStrip(circ.id);
  }

  document.getElementById('app-btn-run')?.addEventListener('click', _appRunAnalysis);

  document.getElementById('app-btn-regen')?.addEventListener('click', () => {
    const out = document.getElementById('app-output');
    if (out) out.innerHTML = '';
    document.getElementById('app-next-wrapper').style.display = 'none';
    const dot = document.getElementById('app-s1');
    if (dot) { dot.classList.remove('done'); dot.textContent = '1'; }
    _appRunAnalysis();
  });

  document.getElementById('app-btn-save')?.addEventListener('click', function () {
    this.innerHTML = '✓ &nbsp;Saved';
    this.classList.add('app-btn-save-done');
    this.disabled = true;
    showToast('✓ Analysis saved to your library.', 'success');
  });

  document.getElementById('app-btn-next')?.addEventListener('click', () => {
    document.querySelector('[data-tab="summary"]')?.click();
  });
}

function _appFillStrip(circId) {
  const circ = CMS_DATA.circulars.find(c => c.id === circId);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('app-cs-id',   circId);
  set('app-cs-name', circ?.title || '—');

  const regEl  = document.getElementById('app-cs-reg');
  const riskEl = document.getElementById('app-cs-risk');
  if (regEl && circ?.regulator) { regEl.textContent = circ.regulator; regEl.style.display = 'inline-flex'; }
  if (riskEl && circ?.risk) {
    riskEl.textContent = `${circ.risk} Risk`;
    riskEl.className   = `app-cs-risk app-risk-${circ.risk.toLowerCase()}`;
    riskEl.style.display = 'inline-flex';
  }
}

/* ─────────────────────────────────────────────────────────
   MAIN ANALYSIS RENDER
───────────────────────────────────────────────────────── */
function _appRunAnalysis(extraCtx) {
  const circId = AI_LIFECYCLE_STATE.selectedCircularId;
  if (!circId) {
    showToast('Please select a circular in the Overview tab first.', 'warning');
    document.querySelector('[data-tab="overview"]')?.click();
    return;
  }

  const out = document.getElementById('app-output');
  const et  = document.getElementById('app-etype')?.value
    || (typeof ORG_PROFILE !== 'undefined' ? ORG_PROFILE.entityType : 'NBFC');

  out.innerHTML = loadingHTML('AI is analysing circular applicability for your organisation…');

  setTimeout(() => {
    const circ    = CMS_DATA.circulars.find(c => c.id === circId);
    const params   = _appDeriveParams(et, circ);
    const entities = _appDeriveEntities(et, circ);

    _APP_HISTORY.entities = [];
    _APP_HISTORY.params   = [];

    const yesC  = params.filter(p => p.status === 'yes').length;
    const partC = params.filter(p => p.status === 'partial').length;
    const noC   = params.filter(p => p.status === 'no').length;
    const naC   = params.filter(p => p.status === 'na').length;

    let vClass = 'app-v-yes', vLabel = 'Applicable', vIcon = '✅';
    let vReason = `This circular is <strong>directly applicable</strong> to your organisation. ${yesC} of ${params.length} parameters match your entity profile (${et}).`;
    if (noC >= params.length / 2) {
      vClass  = 'app-v-no'; vLabel = 'Not Applicable'; vIcon = '🚫';
      vReason = `This circular is <strong>not applicable</strong> to your organisation. The regulatory scope does not match your entity profile.`;
    } else if (partC >= 2) {
      vClass  = 'app-v-partial'; vLabel = 'Partially Applicable'; vIcon = '⚠️';
      vReason = `This circular is <strong>partially applicable</strong>. ${partC} parameter${partC > 1 ? 's' : ''} require further legal review.`;
    }

    const ctxBanner = extraCtx ? `
      <div class="app-ctx-banner">
        <span class="app-ctx-banner-icon">✦</span>
        <div><strong>Regenerated with custom context:</strong> ${extraCtx}</div>
      </div>` : '';

    out.innerHTML = `
    <div class="app-results">

      ${ctxBanner}

      <!-- VERDICT -->
      <div class="app-verdict-banner ${vClass}">
        <div class="app-verdict-icon">${vIcon}</div>
        <div class="app-verdict-body">
          <div class="app-verdict-title">AI Verdict — ${vLabel}</div>
          <div class="app-verdict-text">${vReason}</div>
        </div>
        <span class="app-verdict-badge">${vLabel}</span>
      </div>

      <!-- TABLE 1: APPLICABLE ENTITIES -->
      <div class="app-section-card">
        <div class="app-sec-head">
          <div>
            <span class="app-sec-title">Applicable Entities</span>
            <span class="app-sec-sub">Entity types this circular is issued for</span>
          </div>
          <div class="app-sec-actions">
            <div class="app-dots-wrap">
              <button class="app-dots-btn" id="app-ent-dots-btn">⋮</button>
              <div class="app-dots-menu" id="app-ent-dots-menu" style="display:none;">
                <div class="app-dots-item" id="app-ent-mi-edit">✏️&nbsp; Edit</div>
                <div class="app-dots-item" id="app-ent-mi-history">🕑&nbsp; History</div>
                <div class="app-dots-item" id="app-ent-mi-regen">✦&nbsp; Regenerate with AI Context</div>
              </div>
            </div>
</div>
        </div>
        <div class="app-table-wrap">
          <table class="app-table" id="app-ent-table">
            <thead><tr>
              <th style="width:55%">Entity Type</th>
              <th style="width:110px;">Applicable</th>
              <th class="app-th-edit-only" style="width:80px;display:none;">Action</th>
            </tr></thead>
            <tbody id="app-ent-tbody">
              ${entities.map((e, i) => _appEntityRow(e, i)).join('')}
            </tbody>
          </table>
        </div>
        <!-- edit save bar -->
        <div class="app-edit-bar" id="app-ent-edit-bar" style="display:none;">
          <span class="app-edit-bar-info">✎ Edit mode — toggle Applicable status per row</span>
          <button class="app-edit-bar-cancel" onclick="_appCancelEntityEdit()">Cancel</button>
          <button class="app-edit-bar-save"   onclick="_appSaveEntityEdit()">Save Changes</button>
        </div>
      </div>

      <!-- TABLE 2: PARAMETERS -->
      <div class="app-section-card">
        <div class="app-sec-head">
          <div>
            <span class="app-sec-title">Applicability Parameters</span>
            <span class="app-sec-sub">Requirements, thresholds &amp; conditions</span>
          </div>
          <div class="app-sec-actions">
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <span class="app-pill app-pill-yes">${yesC} Met</span>
              ${partC > 0 ? `<span class="app-pill app-pill-part">${partC} Partial</span>` : ''}
              ${noC   > 0 ? `<span class="app-pill app-pill-no">${noC} Not Met</span>`   : ''}
              ${naC   > 0 ? `<span class="app-pill app-pill-na">${naC} N/A</span>`        : ''}
            </div>
           <div class="app-dots-wrap">
            <button class="app-dots-btn" id="app-param-dots-btn">⋮</button>
            <div class="app-dots-menu" id="app-param-dots-menu" style="display:none;">
              <div class="app-dots-item" id="app-param-mi-edit">✏️&nbsp; Edit</div>
              <div class="app-dots-item" id="app-param-mi-history">🕑&nbsp; History</div>
              <div class="app-dots-item" id="app-param-mi-regen">✦&nbsp; Regenerate with AI Context</div>
            </div>
            </div>
          </div>
        </div>
       <div class="app-table-wrap">
          <table class="app-table" id="app-param-table">
            <thead><tr>
              <th>Requirement</th>
              <th>Threshold / Condition</th>
              <th style="width:120px;">Applicable</th>
              <th style="width:54px;text-align:center;">Why</th>
              <th class="app-th-edit-only" style="width:70px;display:none;text-align:center;">Action</th>
            </tr></thead>
            <tbody id="app-param-tbody">
              ${params.map((p, i) => _appParamRow(p, i)).join('')}
            </tbody>
          </table>
        </div>
        <!-- edit save bar -->
        <div class="app-edit-bar" id="app-param-edit-bar" style="display:none;">
          <span class="app-edit-bar-info">✎ Edit mode — click cells to edit values</span>
          <button class="app-edit-bar-cancel" onclick="_appCancelParamEdit()">Cancel</button>
          <button class="app-edit-bar-save"   onclick="_appSaveParamEdit()">Save Changes</button>
        </div>
      </div>
    </div>

    </div>`;

    /* store initial snapshot */
    window._APP_ENT_DATA   = entities.map(e => ({ ...e }));
    window._APP_PARAM_DATA = params.map(p => ({ ...p }));

    /* show footer */
    const footer = document.getElementById('app-next-wrapper');
    if (footer) {
      footer.style.display  = 'flex';
      footer.style.opacity  = '0';
      footer.style.transition = 'opacity 0.3s ease';
      requestAnimationFrame(() => requestAnimationFrame(() => { footer.style.opacity = '1'; }));
    }
    const dot = document.getElementById('app-s1');
    if (dot) { dot.classList.add('done'); dot.textContent = '✓'; }
    _appWireDotsMenus();
  }, 1800);
}

/* ─────────────────────────────────────────────────────────
   ROW BUILDERS
───────────────────────────────────────────────────────── */
function _appEntityRow(e, i) {
  return `
  <tr id="app-ent-row-${i}" data-match="${e.applicable}">
    <td>
      <span class="app-ent-name app-editable-cell" id="app-e-name-${i}"
        contenteditable="false"
        onblur="if(window._APP_ENT_DATA&&window._APP_ENT_DATA[${i}])window._APP_ENT_DATA[${i}].name=this.textContent.trim()">
        ${e.name}
      </span>
      ${e.sub ? `<div class="app-ent-sub">${e.sub}</div>` : ''}
    </td>
    <td>
  <span class="app-status ${
    e.applicable === 'yes' ? 'app-s-yes' :
    e.applicable === 'no'  ? 'app-s-no'  :
    e.applicable === 'na'  ? 'app-s-na'  : 'app-s-part'
  } app-ent-badge" id="app-ent-badge-${i}">
    ${e.applicable === 'yes' ? '✓ Yes' : e.applicable === 'no' ? '✗ No' : e.applicable === 'na' ? '— N/A' : '~ Partial'}
  </span>
  <select class="ov-applic-select app-ent-select" id="app-ent-select-${i}"
    style="display:none;"
    onchange="_appChangeEntityStatus(${i}, this.value)">
    <option value="yes"     ${e.applicable === 'yes'     ? 'selected' : ''}>✓ Yes</option>
    <option value="no"      ${e.applicable === 'no'      ? 'selected' : ''}>✕ No</option>
    <option value="partial" ${e.applicable === 'partial' ? 'selected' : ''}>~ Partial</option>
    <option value="na"      ${e.applicable === 'na'      ? 'selected' : ''}>— N/A</option>
  </select>
</td>
    <td class="app-th-edit-only" style="display:none;text-align:center;">
      <div style="display:flex;flex-direction:row;align-items:center;justify-content:center;gap:4px;">
        <button class="app-row-action-btn" onclick="_appAddEntityRow(${i})">＋</button>
        <button class="app-row-action-btn app-row-remove-btn" onclick="_appRemoveEntityRow(${i})">✕</button>
      </div>
    </td>
  </tr>`;
}

function _appParamRow(p, i) {
  const statusClass = p.status === 'yes' ? 'app-s-yes' : p.status === 'no' ? 'app-s-no' : p.status === 'na' ? 'app-s-na' : 'app-s-part';
  const statusLabel = p.status === 'yes' ? '✓ Yes' : p.status === 'no' ? '✗ No' : p.status === 'na' ? '— N/A' : '~ Partial';
  return `
  <tr id="app-param-row-${i}" data-status="${p.status}">
    <td>
      <span class="app-p-name app-editable-cell" id="app-p-name-${i}" data-field="name" data-idx="${i}">${p.name}</span>
    </td>
    <td style="font-size:12px;color:#4a5068;">
      <span class="app-editable-cell" id="app-p-thresh-${i}" data-field="threshold" data-idx="${i}">${p.threshold}</span>
    </td>
   <td>
      <span class="app-status ${
        p.status === 'yes' ? 'app-s-yes' :
        p.status === 'no'  ? 'app-s-no'  :
        p.status === 'na'  ? 'app-s-na'  : 'app-s-part'
      } app-param-badge" id="app-param-badge-${i}">
        ${p.status === 'yes' ? '✓ Yes' : p.status === 'no' ? '✗ No' : p.status === 'na' ? '— N/A' : '~ Partial'}
      </span>
      <select class="ov-applic-select app-param-select" id="app-param-select-${i}"
        style="display:none;"
        onchange="_appChangeParamStatus(${i}, this.value)">
        <option value="yes"     ${p.status === 'yes'     ? 'selected' : ''}>✓ Yes</option>
        <option value="no"      ${p.status === 'no'      ? 'selected' : ''}>✕ No</option>
        <option value="partial" ${p.status === 'partial' ? 'selected' : ''}>~ Partial</option>
        <option value="na"      ${p.status === 'na'      ? 'selected' : ''}>— N/A</option>
      </select>
    </td>
    <td style="text-align:center;position:relative;">
      <button class="app-reason-btn" onclick="_appToggleTip(event,'app-tip-${i}')">?</button>
      <div class="app-tooltip" id="app-tip-${i}">
        <div class="app-tt-arrow"></div>
        <div class="app-tt-text" id="app-tip-text-${i}">${p.reason}</div>
        <div class="app-tt-edit" id="app-tip-edit-${i}" style="display:none;margin-top:8px;">
          <textarea class="app-tip-textarea" id="app-tip-ta-${i}" placeholder="Add your reason…">${p.reason}</textarea>
          <button class="app-tip-save-btn" onclick="_appSaveReason(${i})">Save</button>
        </div>
        <button class="app-tip-edit-btn" id="app-tip-editbtn-${i}" onclick="_appToggleReasonEdit(${i})">✏️ Edit reason</button>
      </div>
    </td>
    <td class="app-th-edit-only" style="display:none;text-align:center;">
      <div style="display:flex;flex-direction:row;align-items:center;justify-content:center;gap:4px;">
        <button class="app-row-action-btn" onclick="_appAddParamRow(${i})">＋</button>
        <button class="app-row-action-btn app-row-remove-btn" onclick="_appRemoveParamRow(${i})">✕</button>
      </div>
    </td>
  </tr>`;
}


window._appToggleReasonEdit = function(i) {
  const editDiv  = document.getElementById(`app-tip-edit-${i}`);
  const textDiv  = document.getElementById(`app-tip-text-${i}`);
  const editBtn  = document.getElementById(`app-tip-editbtn-${i}`);
  const isEditing = editDiv.style.display !== 'none';
  editDiv.style.display  = isEditing ? 'none' : 'block';
  textDiv.style.display  = isEditing ? 'block' : 'none';
  editBtn.textContent    = isEditing ? '✏️ Edit reason' : '✕ Cancel';
};

window._appSaveReason = function(i) {
  const ta  = document.getElementById(`app-tip-ta-${i}`);
  const txt = document.getElementById(`app-tip-text-${i}`);
  if (!ta || !txt) return;
  const val = ta.value.trim();
  if (window._APP_PARAM_DATA?.[i]) window._APP_PARAM_DATA[i].reason = val;
  txt.textContent = val;
  /* close edit mode */
  document.getElementById(`app-tip-edit-${i}`).style.display  = 'none';
  txt.style.display = 'block';
  document.getElementById(`app-tip-editbtn-${i}`).textContent = '✏️ Edit reason';
  showToast('✓ Reason updated.', 'success');
};

function _appAddEntityRow(afterIdx) {
  window._APP_ENT_DATA.splice(afterIdx + 1, 0, {
    name:       '',
    applicable: 'na',
    sub:        null
  });
  _appRefreshEntityTable();
}


function _appRemoveEntityRow(idx) {
  if (window._APP_ENT_DATA.length <= 1) return;
  window._APP_ENT_DATA.splice(idx, 1);
  _appRefreshEntityTable();
}
function _appRefreshEntityTable() {
  const tbody = document.getElementById('app-ent-tbody');
  if (!tbody) return;
  tbody.innerHTML = window._APP_ENT_DATA.map((e, i) => _appEntityRow(e, i)).join('');
  if (_appEntEditMode) {
    document.querySelectorAll('#app-ent-tbody td.app-th-edit-only').forEach(c => c.style.display = '');
    document.querySelectorAll('#app-ent-tbody .app-editable-cell').forEach(cell => {
      cell.contentEditable = 'true';
      cell.classList.add('app-cell-editing');
    });
    document.querySelectorAll('.app-ent-badge').forEach(b => b.style.display = 'none');
    document.querySelectorAll('.app-ent-select').forEach(s => s.style.display = 'inline-block');
  }
}

// Same pattern for params:
function _appAddParamRow(afterIdx) {
  window._APP_PARAM_DATA.splice(afterIdx + 1, 0, {
    name:      '',
    threshold: '',
    status:    'na',
    reason:    'Manually added row.'
  });
  _appRefreshParamTable();
}


function _appRemoveParamRow(idx) {
  if (window._APP_PARAM_DATA.length <= 1) return;
  window._APP_PARAM_DATA.splice(idx, 1);
  _appRefreshParamTable();
}
function _appRefreshParamTable() {
  const tbody = document.getElementById('app-param-tbody');
  if (!tbody) return;
  tbody.innerHTML = window._APP_PARAM_DATA.map((p, i) => _appParamRow(p, i)).join('');
  if (_appParamEditMode) {
    document.querySelectorAll('#app-param-tbody td.app-th-edit-only').forEach(c => c.style.display = '');
    document.querySelectorAll('.app-editable-cell').forEach(cell => {
      cell.contentEditable = 'true';
      cell.classList.add('app-cell-editing');
    });
    document.querySelectorAll('.app-param-badge').forEach(b => b.style.display = 'none');
    document.querySelectorAll('.app-param-select').forEach(s => s.style.display = 'inline-block');
  }
}

function _appWireDotsMenus() {
  /* ENTITIES dots */
  document.getElementById('app-ent-dots-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('app-ent-dots-menu');
    const pm   = document.getElementById('app-param-dots-menu');
    if (pm)   pm.style.display = 'none';
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('app-ent-mi-edit')?.addEventListener('click', () => {
    document.getElementById('app-ent-dots-menu').style.display = 'none';
    _appToggleEntityEdit();
  });
  document.getElementById('app-ent-mi-history')?.addEventListener('click', () => {
    document.getElementById('app-ent-dots-menu').style.display = 'none';
    _appOpenVerModal('entities');
  });
  document.getElementById('app-ent-mi-regen')?.addEventListener('click', () => {
    document.getElementById('app-ent-dots-menu').style.display = 'none';
    _appOpenCtxModal();
    /* ensure modal is visible */
    const m = document.getElementById('app-ctx-modal');
    if (m) m.classList.add('app-modal-open');
  });

  /* PARAMS dots */
  document.getElementById('app-param-dots-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('app-param-dots-menu');
    const em   = document.getElementById('app-ent-dots-menu');
    if (em)   em.style.display = 'none';
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('app-param-mi-edit')?.addEventListener('click', () => {
    document.getElementById('app-param-dots-menu').style.display = 'none';
    _appToggleParamEdit();
  });
  document.getElementById('app-param-mi-history')?.addEventListener('click', () => {
    document.getElementById('app-param-dots-menu').style.display = 'none';
    _appOpenVerModal('params');
  });
  document.getElementById('app-param-mi-regen')?.addEventListener('click', () => {
    document.getElementById('app-param-dots-menu').style.display = 'none';
    _appOpenCtxModal();
    const m = document.getElementById('app-ctx-modal');
    if (m) m.classList.add('app-modal-open');
  });

  /* close both on outside click */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.app-dots-wrap')) {
      document.getElementById('app-ent-dots-menu') && (document.getElementById('app-ent-dots-menu').style.display = 'none');
      document.getElementById('app-param-dots-menu') && (document.getElementById('app-param-dots-menu').style.display = 'none');
    }
  });
}

/* ─────────────────────────────────────────────────────────
   ENTITY EDIT
───────────────────────────────────────────────────────── */
let _appEntEditMode   = false;
let _appEntSnapshot   = null;

function _appToggleEntityEdit() {
  _appEntEditMode = !_appEntEditMode;
  const bar      = document.getElementById('app-ent-edit-bar');
  const editCols = document.querySelectorAll('#app-ent-table .app-th-edit-only');

  if (_appEntEditMode) {
    _appEntSnapshot = (window._APP_ENT_DATA || []).map(e => ({ ...e }));
    bar.style.display = 'flex';
    editCols.forEach(c => c.style.display = '');
    document.querySelectorAll('#app-ent-tbody td.app-th-edit-only').forEach(c => c.style.display = '');
    // Show dropdowns, hide badges
    document.querySelectorAll('.app-ent-badge').forEach(b => b.style.display = 'none');
    document.querySelectorAll('.app-ent-select').forEach(s => s.style.display = 'inline-block');
    document.querySelectorAll('#app-ent-tbody .app-editable-cell').forEach(cell => {
      cell.contentEditable = 'true';
      cell.classList.add('app-cell-editing');
    });
  } else {
    _appCancelEntityEdit();
  }
}

function _appCancelEntityEdit() {
  _appEntEditMode = false;
  document.getElementById('app-ent-edit-bar').style.display = 'none';

  /* restore snapshot */
  if (_appEntSnapshot) {
    _appEntSnapshot.forEach((e, i) => {
      const row = document.getElementById(`app-ent-row-${i}`);
      if (!row) return;
      row.dataset.match = e.match;
      const badge = document.getElementById(`app-ent-badge-${i}`);
      if (badge) { badge.className = `app-status ${e.match ? 'app-s-yes' : 'app-s-no'}`; badge.textContent = e.match ? '✓ Yes' : '✗ No'; }
    });
  }
  document.querySelectorAll('#app-ent-tbody .app-editable-cell').forEach(cell => {
      cell.contentEditable = 'false';
      cell.classList.remove('app-cell-editing');
    });
  document.querySelectorAll('#app-ent-table .app-th-edit-only').forEach(c => c.style.display = 'none');
  document.querySelectorAll('#app-ent-tbody td.app-th-edit-only').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.app-ent-badge').forEach(b => b.style.display = '');
  document.querySelectorAll('.app-ent-select').forEach(s => s.style.display = 'none');
}

function _appSaveEntityEdit() {
  _appEntEditMode = false;
  document.getElementById('app-ent-edit-bar').style.display = 'none';
  document.querySelectorAll('#app-ent-table .app-th-edit-only').forEach(c => c.style.display = 'none');
  document.querySelectorAll('#app-ent-tbody td.app-th-edit-only').forEach(c => c.style.display = 'none');
document.querySelectorAll('#app-ent-tbody .app-editable-cell').forEach(cell => {
      cell.contentEditable = 'false';
      cell.classList.remove('app-cell-editing');
    });
  document.querySelectorAll('.app-ent-badge').forEach(b => b.style.display = '');
  document.querySelectorAll('.app-ent-select').forEach(s => s.style.display = 'none');
  /* push to history */
  const snapshot = (window._APP_ENT_DATA || []).map(e => ({ ...e }));
  _APP_HISTORY.entities.push({
    ts: new Date(),
    label: 'Manual edit',
    snapshot,
  });
  showToast('✓ Entity applicability updated.', 'success');
}

window._appToggleEntity = function (i) {
  const row   = document.getElementById(`app-ent-row-${i}`);
  const badge = document.getElementById(`app-ent-badge-${i}`);
  if (!row || !badge) return;
  const current = row.dataset.match === 'true';
  const next    = !current;
  row.dataset.match   = next;
  badge.className     = `app-status ${next ? 'app-s-yes' : 'app-s-no'}`;
  badge.textContent   = next ? '✓ Yes' : '✗ No';
  if (window._APP_ENT_DATA?.[i]) window._APP_ENT_DATA[i].match = next;
};

/* ─────────────────────────────────────────────────────────
   PARAM EDIT
───────────────────────────────────────────────────────── */
let _appParamEditMode = false;
let _appParamSnapshot = null;

function _appToggleParamEdit() {
  _appParamEditMode = !_appParamEditMode;
  const bar      = document.getElementById('app-param-edit-bar');
  const editCols = document.querySelectorAll('#app-param-table .app-th-edit-only');

  if (_appParamEditMode) {
    _appParamSnapshot = (window._APP_PARAM_DATA || []).map(p => ({ ...p }));
    bar.style.display = 'flex';
    editCols.forEach(c => c.style.display = '');
    document.querySelectorAll('#app-param-tbody td.app-th-edit-only').forEach(c => c.style.display = '');
    document.querySelectorAll('.app-editable-cell').forEach(cell => {
      cell.contentEditable = 'true';
      cell.classList.add('app-cell-editing');
    });
    document.querySelectorAll('.app-param-badge').forEach(b => b.style.display = 'none');
    document.querySelectorAll('.app-param-select').forEach(s => s.style.display = 'inline-block');
  } else {
    _appCancelParamEdit();
  }
}
function _appCancelParamEdit() {
  _appParamEditMode = false;
  document.getElementById('app-param-edit-bar').style.display = 'none';
  document.querySelectorAll('#app-param-table .app-th-edit-only').forEach(c => c.style.display = 'none');
  document.querySelectorAll('#app-param-tbody td.app-th-edit-only').forEach(c => c.style.display = 'none');

  /* restore snapshot */
  if (_appParamSnapshot) {
    _appParamSnapshot.forEach((p, i) => {
      const nameEl   = document.getElementById(`app-p-name-${i}`);
      const threshEl = document.getElementById(`app-p-thresh-${i}`);
      const badge    = document.getElementById(`app-param-badge-${i}`);
      if (nameEl)   nameEl.textContent   = p.name;
      if (threshEl) threshEl.textContent = p.threshold;
      if (badge)    _appSetParamBadge(badge, p.status);
      if (window._APP_PARAM_DATA?.[i]) Object.assign(window._APP_PARAM_DATA[i], p);
    });
  }
  document.querySelectorAll('.app-editable-cell').forEach(cell => {
    cell.contentEditable = 'false';
    cell.classList.remove('app-cell-editing');
  });
  document.querySelectorAll('.app-param-badge').forEach(b => b.style.display = '');
  document.querySelectorAll('.app-param-select').forEach(s => s.style.display = 'none');
}

function _appSaveParamEdit() {
  (window._APP_PARAM_DATA || []).forEach((p, i) => {
    const nameEl   = document.getElementById(`app-p-name-${i}`);
    const threshEl = document.getElementById(`app-p-thresh-${i}`);
    if (nameEl)   p.name      = nameEl.textContent.trim();
    if (threshEl) p.threshold = threshEl.textContent.trim();
  });

  _appParamEditMode = false;
  document.getElementById('app-param-edit-bar').style.display = 'none';
  document.querySelectorAll('#app-param-table .app-th-edit-only').forEach(c => c.style.display = 'none');
  document.querySelectorAll('#app-param-tbody td.app-th-edit-only').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.app-editable-cell').forEach(cell => {
    cell.contentEditable = 'false';
    cell.classList.remove('app-cell-editing');
  });

  document.querySelectorAll('.app-param-badge').forEach(b => b.style.display = '');
  document.querySelectorAll('.app-param-select').forEach(s => s.style.display = 'none');
  const snapshot = (window._APP_PARAM_DATA || []).map(p => ({ ...p }));
  _APP_HISTORY.params.push({ ts: new Date(), label: 'Manual edit', snapshot });
  showToast('✓ Parameters updated.', 'success');
}

window._appChangeParamStatus = function (i, val) {
  const badge = document.getElementById(`app-param-badge-${i}`);
  if (badge) _appSetParamBadge(badge, val);
  const row = document.getElementById(`app-param-row-${i}`);
  if (row) row.dataset.status = val;
  if (window._APP_PARAM_DATA?.[i]) window._APP_PARAM_DATA[i].status = val;
};

function _appSetParamBadge(badge, status) {
  const map = {
    yes:     ['app-s-yes',  '✓ Yes'],
    no:      ['app-s-no',   '✗ No'],
    partial: ['app-s-part', '~ Partial'],
    na:      ['app-s-na',   '— N/A'],
  };
  const [cls, label] = map[status] || map.na;
  badge.className   = `app-status app-param-badge ${cls}`;
  badge.textContent = label;
}

/* ─────────────────────────────────────────────────────────
   TOOLTIP
───────────────────────────────────────────────────────── */
window._appToggleTip = function (e, id) {
  e.stopPropagation();
  document.querySelectorAll('.app-tooltip').forEach(t => { if (t.id !== id) t.classList.remove('app-tt-show'); });
  document.getElementById(id)?.classList.toggle('app-tt-show');
};
document.addEventListener('click', () => {
  document.querySelectorAll('.app-tooltip').forEach(t => t.classList.remove('app-tt-show'));
});

/* ─────────────────────────────────────────────────────────
   AI CONTEXT MODAL
───────────────────────────────────────────────────────── */
window._appOpenCtxModal = function () {
  let modal = document.getElementById('app-ctx-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'app-ctx-modal';
    modal.className = 'app-modal-overlay';
    modal.innerHTML = `
      <div class="app-modal-box" onclick="event.stopPropagation()">
        <div class="app-modal-header">
          <div class="app-modal-title">✦ Regenerate with AI Context</div>
          <button class="app-modal-close" onclick="_appCloseCtxModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <p class="app-modal-desc">Add extra context or instructions for the AI to incorporate during regeneration.</p>
          <div class="app-ctx-chips" id="app-ctx-chips">
            <span class="app-chip" onclick="_appToggleChip(this,'Focus on risk thresholds')">Risk Thresholds</span>
            <span class="app-chip" onclick="_appToggleChip(this,'Include provisioning norms')">Provisioning Norms</span>
            <span class="app-chip" onclick="_appToggleChip(this,'Highlight SEBI overlaps')">SEBI Overlaps</span>
            <span class="app-chip" onclick="_appToggleChip(this,'Consider recent amendments')">Recent Amendments</span>
            <span class="app-chip" onclick="_appToggleChip(this,'Emphasise capital adequacy')">Capital Adequacy</span>
            <span class="app-chip" onclick="_appToggleChip(this,'Include FDI norms')">FDI Norms</span>
          </div>
          <textarea class="app-ctx-textarea" id="app-ctx-input" placeholder="e.g. We have recently crossed ₹500 Cr AUM…"></textarea>
          <div class="app-modal-footer">
            <button class="app-modal-btn-cancel" onclick="_appCloseCtxModal()">Cancel</button>
            <button class="app-modal-btn-go" onclick="_appRunWithContext()">✦ &nbsp;Regenerate with Context</button>
          </div>
        </div>
      </div>`;
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  modal.classList.add('app-modal-open');
  document.getElementById('app-ctx-input')?.focus();
};
window._appCloseCtxModal = function (e) {
  if (e && e.target !== document.getElementById('app-ctx-modal')) return;
  document.getElementById('app-ctx-modal').classList.remove('app-modal-open');
};
window._appToggleChip = function (el, text) {
  el.classList.toggle('app-chip-active');
  const ta = document.getElementById('app-ctx-input');
  if (el.classList.contains('app-chip-active')) {
    ta.value = (ta.value ? ta.value + '\n' : '') + text;
  } else {
    ta.value = ta.value.replace(text, '').replace(/\n+/g, '\n').trim();
  }
};
window._appRunWithContext = function () {
  const ctx = document.getElementById('app-ctx-input').value.trim();
  document.getElementById('app-ctx-modal').classList.remove('app-modal-open');
  /* reset chips */
  document.querySelectorAll('.app-chip').forEach(c => c.classList.remove('app-chip-active'));
  document.getElementById('app-ctx-input').value = '';
  /* clear & re-run */
  const out = document.getElementById('app-output');
  if (out) out.innerHTML = '';
  document.getElementById('app-next-wrapper').style.display = 'none';
  const dot = document.getElementById('app-s1');
  if (dot) { dot.classList.remove('done'); dot.textContent = '1'; }
  _appRunAnalysis(ctx || null);
};

/* ─────────────────────────────────────────────────────────
   VERSION HISTORY MODAL
───────────────────────────────────────────────────────── */
window._appOpenVerModal = function (type) {
  let modal  = document.getElementById('app-ver-modal');
  let label, list;

  /* modal may not exist when called from overview popup — create inline */
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'app-ver-modal';
    modal.className = 'app-modal-overlay';
    modal.innerHTML = `
      <div class="app-modal-box app-ver-box" onclick="event.stopPropagation()">
        <div class="app-modal-header">
          <div class="app-modal-title">🕑 &nbsp;Version History</div>
          <button class="app-modal-close" onclick="_appCloseVerModal()">✕</button>
        </div>
        <div class="app-modal-body">
          <div class="app-ver-subtitle" id="app-ver-label"></div>
          <div id="app-ver-list" class="app-ver-list"></div>
        </div>
      </div>`;
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  label = document.getElementById('app-ver-label');
  list  = document.getElementById('app-ver-list');
  const history = _APP_HISTORY[type] || [];

  label.textContent = type === 'entities' ? 'Changes to Applicable Entities table' : 'Changes to Applicability Parameters table';

  if (!history.length) {
    list.innerHTML = `<div class="app-ver-empty">No edits recorded yet. Make changes using the Edit button and save them — they'll appear here.</div>`;
  } else {
    list.innerHTML = [...history].reverse().map((v, vi) => {
      const ts      = v.ts instanceof Date ? v.ts : new Date(v.ts);
      const timeStr = ts.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
      const rows    = type === 'entities'
        ? v.snapshot.map(e => `<li>${e.name} — <strong>${e.match ? 'Yes' : 'No'}</strong></li>`).join('')
        : v.snapshot.map(p => `<li>${p.name} — <strong>${_appStatusLabel(p.status)}</strong></li>`).join('');
      return `
        <div class="app-ver-entry">
          <div class="app-ver-meta">
            <span class="app-ver-num">v${history.length - vi}</span>
            <span class="app-ver-ts">${timeStr}</span>
            <span class="app-ver-badge">${v.label}</span>
          </div>
          <ul class="app-ver-rows">${rows}</ul>
          <button class="app-ver-restore" onclick="_appRestoreVersion('${type}',${history.length - 1 - vi})">↩ Restore this version</button>
        </div>`;
    }).join('');
  }

  modal.classList.add('app-modal-open');
};

window._appCloseVerModal = function (e) {
  const modal = document.getElementById('app-ver-modal');
  if (!modal) return;
  if (e && e.target !== modal) return;
  modal.classList.remove('app-modal-open');
};

window._appRestoreVersion = function (type, idx) {
  const v = _APP_HISTORY[type]?.[idx];
  if (!v) return;

  if (type === 'entities') {
    v.snapshot.forEach((e, i) => {
      window._APP_ENT_DATA[i] = { ...e };
      const badge = document.getElementById(`app-ent-badge-${i}`);
      const row   = document.getElementById(`app-ent-row-${i}`);
      if (badge) { badge.className = `app-status ${e.match ? 'app-s-yes' : 'app-s-no'}`; badge.textContent = e.match ? '✓ Yes' : '✗ No'; }
      if (row)    row.dataset.match = e.match;
    });
    /* log the restore as a new history entry */
    _APP_HISTORY.entities.push({ ts: new Date(), label: `Restored v${idx + 1}`, snapshot: v.snapshot.map(e => ({ ...e })) });
  } else {
    v.snapshot.forEach((p, i) => {
      Object.assign(window._APP_PARAM_DATA[i], p);
      const nameEl   = document.getElementById(`app-p-name-${i}`);
      const threshEl = document.getElementById(`app-p-thresh-${i}`);
      const badge    = document.getElementById(`app-param-badge-${i}`);
      if (nameEl)   nameEl.textContent   = p.name;
      if (threshEl) threshEl.textContent = p.threshold;
      if (badge)    _appSetParamBadge(badge, p.status);
    });
    _APP_HISTORY.params.push({ ts: new Date(), label: `Restored v${idx + 1}`, snapshot: v.snapshot.map(p => ({ ...p })) });
  }

  document.getElementById('app-ver-modal').classList.remove('app-modal-open');
  showToast(`✓ Restored to version ${idx + 1}.`, 'success');
};

function _appStatusLabel(s) {
  return s === 'yes' ? 'Yes' : s === 'no' ? 'No' : s === 'na' ? 'N/A' : 'Partial';
}

/* ── DOTS MENU HELPERS ── */
window._appToggleDotsMenu = function(e, menuId) {
  e.stopPropagation();
  document.querySelectorAll('.app-dots-menu').forEach(m => {
    if (m.id !== menuId) m.style.display = 'none';
  });
  const menu = document.getElementById(menuId);
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
};

window._appCloseDots = function(menuId) {
  const menu = document.getElementById(menuId);
  if (menu) menu.style.display = 'none';
};

document.addEventListener('click', (e) => {
  if (!e.target.closest('.app-dots-wrap')) {
    document.querySelectorAll('.app-dots-menu').forEach(m => m.style.display = 'none');
  }
});

/* ─────────────────────────────────────────────────────────
   DERIVE ENTITIES
───────────────────────────────────────────────────────── */
function _appDeriveEntities(entityType, circ) {
  const reg = circ?.regulator || 'RBI';
  const et  = entityType || 'NBFC';

  if (circ?.id === 'RBI-HF-2024-001') {
    return [
      { name: 'Scheduled Commercial Banks (excluding Regional Rural Banks)', sub: null, match: et === 'Bank', applicable: 'no' },
      { name: 'Housing Finance Companies', sub: 'In aligned contexts where applicable via NHB/RBI guidance', match: et === 'HFC', applicable: 'yes' },
      { name: 'Banks engaged in housing finance lending activities', sub: null, match: et === 'Bank', applicable: 'no' },
    ];
  }

  // existing fallback below — unchanged
if (Array.isArray(circ?.applicableEntities) && circ.applicableEntities.length) {
  return circ.applicableEntities.map(ent => ({
    name:       typeof ent === 'string' ? ent : ent.name,
    sub:        typeof ent === 'object' ? ent.description || null : null,
    applicable: typeof ent === 'object' ? (ent.applicable ? 'yes' : 'partial') : 'no',  // ← key fix
    match:      typeof ent === 'object' ? ent.applicable : false,
  }));
}

  const rbiEntities = [
    { name: 'Scheduled Commercial Banks (excluding RRBs)', match: true },
    { name: 'Housing Finance Companies', sub: 'In aligned contexts via NHB/RBI guidance', match: false },
    { name: 'Banks engaged in housing finance lending', match: true },
  ];
  const sebiEntities = [
    
  { name: 'Mutual Funds', sub: 'SEBI regulated mutual fund entities', match: false },
  { name: 'Asset Management Companies', sub: 'AMCs managing mutual fund schemes', match: et === 'SEBI' || et === 'AMC' },
  { name: 'Trustee Companies / Boards of Trustees of Mutual Funds', sub: 'Trustee oversight entities for mutual funds', match: false },
 
  { name: 'Association of Mutual Funds in India', sub: 'Industry association for mutual funds', match: false },
  // { name: 'Recognized Stock Exchanges & Clearing Corporations', sub: 'Market infrastructure institutions', match: false },
  //  { name: 'Registrars to an Issue and Share Transfer Agents', sub: 'RTAs supporting mutual fund folios and servicing', match: false },
  // { name: 'Stock Brokers', sub: 'SEBI registered brokers and intermediaries', match: false },
  // { name: 'Depositories', sub: 'Depository participants and institutions', match: false },
  // { name: 'Custodians', sub: 'Entities providing custody services for securities', match: false }

  ];
  return (reg === 'SEBI' ? sebiEntities : rbiEntities).map(e => ({ ...e, circTarget: reg }));
}

/* ─────────────────────────────────────────────────────────
   DERIVE PARAMS
───────────────────────────────────────────────────────── */
function _appDeriveParams(entityType, circ) {
  const reg = circ?.regulator || 'SEBI';
  const et  = entityType || 'NBFC';
  const org = typeof ORG_PROFILE !== 'undefined' ? ORG_PROFILE : {};

  // RBI Master Circular on Housing Finance specific data
  if (reg === 'SEBI') {
    return [
      // {
      //   name: 'Entity Type',
      //   threshold: 'Scheduled Commercial Bank engaged in housing finance lending',
      //   status: et === 'Bank' ? 'yes' : 'no',
      //   reason: et === 'Bank'
      //     ? 'Your entity is a Scheduled Commercial Bank — directly within scope.'
      //     : 'Circular applies only to banks engaged in housing finance lending. Your entity type does not meet this criterion.'
      // },
      // {
      //   name: 'Housing Loan Origination',
      //   threshold: 'Entity must originate or service housing loans',
      //   status: et === 'Bank' ? 'yes' : 'no',
      //   reason: et === 'Bank'
      //     ? 'Banks originate housing loans and are subject to these directions.'
      //     : 'AMCs and non-lending entities do not originate loans — not applicable.'
      // },
      // {
      //   name: 'On-book Credit Exposure to Real Estate',
      //   threshold: 'LTV and risk weights apply to lender balance sheet',
      //   status: et === 'Bank' ? 'yes' : 'no',
      //   reason: 'LTV and risk weight norms are prudential lending requirements for banks\' balance sheet exposures only.'
      // },
      // {
      //   name: 'Investment in Real Estate-linked Securities',
      //   threshold: 'Exposure through debt/equity instruments of real estate sector',
      //   status: 'partial',
      //   reason: 'Indirect exposure via REITs or real estate company securities may be impacted through market risk and SEBI-imposed exposure limits.'
      // },
      // {
      //   name: 'RBI vs SEBI Jurisdiction',
      //   threshold: 'RBI regulates banks/NBFCs; SEBI regulates AMCs',
      //   status: reg === 'RBI' && et === 'Bank' ? 'yes' : 'partial',
      //   reason: 'RBI directly regulates banks. For SEBI-regulated entities, RBI macro-prudential signals influence the risk environment but are not directly binding.'
      // },
      // {
      //   name: 'Risk Management & Prudential Norms',
      //   threshold: 'Concentration and exposure norms via applicable regulator',
      //   status: 'partial',
      //   reason: 'Though RBI norms apply directly only to banks, equivalent controls exist under SEBI Mutual Fund Regulations for other entity types.'
      // },
      
  {
    name: 'Scope of Application',
    threshold: 'Applicable to Mutual Funds, AMCs, Trustee Companies / Board of Trustees of Mutual Funds, and AMFI',
    orgVal: et,
    status: reg === 'SEBI' ? 'yes' : 'partial',
    reason: 'This circular applies to mutual fund governance entities including AMCs and Trustees.'
  },
  {
    name: 'Trustee Oversight Responsibility',
    threshold: 'Applicable where trustee company / board of trustees has fiduciary oversight over mutual funds',
    orgVal: org.entityType || et,
    status: 'partial',
    reason: 'The circular assigns core responsibilities to Trustees for protection of unitholders.'
  },
  {
    name: 'AMC Board Governance Responsibility',
    threshold: 'Applicable where AMC board is responsible for protecting unitholder interests',
    orgVal: org.entityType || et,
    status: 'partial',
    reason: 'AMC boards are accountable for ensuring that unitholder interests are protected.'
  },
  {
    name: 'Core Responsibilities of Trustees',
    threshold: 'Fee fairness, scheme performance review, prevention of mis-selling, conflict management, market abuse controls',
    orgVal: org.industry || 'Financial Services',
    status: 'yes',
    reason: 'These are the central governance and supervisory requirements under the circular.'
  },
  {
    name: 'Fraud Prevention and System-level Checks',
    threshold: 'System-level checks to prevent fraudulent transactions including front running, form splitting and mis-selling',
    orgVal: 'Governance / Risk Controls',
    status: 'yes',
    reason: 'The circular requires Trustees to ensure AMCs have system-level fraud prevention controls.'
  },
  {
    name: 'Unit Holder Protection Committee (UHPC)',
    threshold: 'Applicable where AMC constitutes and operates UHPC for investor protection, complaints, disclosures and compliance review',
    orgVal: org.entityType || et,
    status: 'partial',
    reason: 'UHPC requirements apply where the entity is involved in AMC governance and investor protection.'
  },
  {
    name: 'Conflict of Interest and Fair Treatment',
    threshold: 'Required where conflicts between AMC stakeholders / associates and unitholders must be managed or disclosed',
    orgVal: 'Applicable if mutual fund governance role exists',
    status: 'yes',
    reason: 'The circular requires Trustees to address conflicts of interest and prevent undue advantage to associates.'
  },
  {
    name: 'Compliance Nature',
    threshold: 'Ongoing governance and supervisory compliance effective from 2024-01-01',
    orgVal: circ?.effectiveDate || '2024-01-01',
    status: 'yes',
    reason: 'This is an ongoing governance obligation from the effective date.'
  }
]
    
  }

  // Default fallback for all other circulars
  return [
    { name: 'Scope of Application', threshold: reg === 'RBI' ? 'Applicable to all Scheduled Commercial Banks (excluding RRBs)' : reg === 'SEBI' ? 'Listed Companies, Brokers' : 'Regulated Entities', orgVal: et, status: (['NBFC', 'HFC', 'Bank'].includes(et) && reg === 'RBI') || (et === 'SEBI' && reg === 'SEBI') ? 'yes' : 'partial', reason: `Your entity type (${et}) ${['NBFC', 'HFC', 'Bank'].includes(et) ? 'falls within' : 'may fall within'} the circular's defined scope.` },
    { name: 'Individual Housing Loans (LTV & Risk)', threshold: 'LTV caps & risk weights prescribed', orgVal: reg, status: 'yes', reason: `Your organisation is registered under ${reg}, which directly issues this circular.` },
    { name: 'CRE – Residential Housing', threshold: circ?.type === 'Prudential' ? 'CRE classification & provisioning norms' : 'Financial Services', orgVal: org.industry || 'Financial Services', status: 'yes', reason: 'Core business activities overlap with the prescribed scope of this circular.' },
    { name: 'Builder Financing', threshold: 'Restriction on land acquisition finance; project-linked lending', orgVal: org.turnover || 'Verify against audited financials', status: 'partial', reason: 'Asset/net worth threshold requires verification against latest audited financials.' },
    { name: 'Upfront Disbursal (80:20 schemes)', threshold: 'Disbursal must be stage-linked', orgVal: 'India', status: 'yes', reason: 'Organisation operates within India — fully within the geographic jurisdiction.' },
    { name: 'Interest Rate Regulations', threshold: circ?.type === 'Governance' ? 'Listed on recognised exchange' : 'All entities', orgVal: org.listed || 'Unknown', status: circ?.type === 'Governance' ? 'na' : 'yes', reason: circ?.type === 'Governance' ? 'Governance circulars apply conditionally based on listing status.' : 'Listing status is not a restricting condition for this circular type.' },
  ];
}

/* ─────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────── */
function injectAppCSS() {
  if (document.getElementById('app-css')) return;
  const s = document.createElement('style');
  s.id = 'app-css';
  s.textContent = `
  .app-wrap        { display:flex;flex-direction:column;gap:14px;font-family:'DM Sans',sans-serif; }

  /* empty state */
  .app-empty-state { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px 20px;background:#fff;border:1px solid #dde0e6;border-radius:12px;text-align:center; }
  .app-empty-icon  { font-size:40px; }
  .app-empty-title { font-size:16px;font-weight:700;color:#1a1a2e; }
  .app-empty-sub   { font-size:13px;color:#9499aa;max-width:320px;line-height:1.5; }
  .app-empty-btn   { padding:9px 20px;background:#1a1a2e;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer; }
  .app-empty-btn:hover { background:#2d2d4e; }

  /* context strip */
  .app-circ-strip  { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding:10px 16px;background:#f5f6f8;border:1px solid #dde0e6;border-radius:8px; }
  .app-cs-left     { display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0; }
  .app-cs-id       { font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:#1a1a2e;white-space:nowrap; }
  .app-cs-sep      { color:#c4c8d4;font-size:14px; }
  .app-cs-name     { font-size:12px;color:#4a5068;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:340px; }
  .app-cs-right    { display:flex;align-items:center;gap:8px;flex-shrink:0; }
  .app-cs-reg      { font-size:11px;font-weight:700;padding:2px 9px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;color:#2563eb; }
  .app-cs-risk     { font-size:10px;font-weight:700;padding:2px 9px;border-radius:10px;border:1px solid; }
  .app-risk-high   { background:#fee2e2;border-color:#fca5a5;color:#b91c1c; }
  .app-risk-medium { background:#fef9c3;border-color:#fcd34d;color:#b45309; }
  .app-risk-low    { background:#dcfce7;border-color:#86efac;color:#15803d; }
  .app-cs-change   { padding:4px 10px;background:#fff;border:1px solid #dde0e6;border-radius:6px;font-size:11px;font-weight:600;color:#4a5068;cursor:pointer;transition:all 0.12s; }
  .app-cs-change:hover { background:#f5f6f8;color:#1a1a2e; }

.ov-acc-trigger { cursor:pointer; user-select:none; }
.ov-acc-trigger:hover { background:#f5f6f8; }
.ov-acc-arrow { font-size:11px; color:#9499aa; margin-right:8px; transition:transform 0.2s; flex-shrink:0; }

.ov-applic-select { padding:3px 7px; border:1.5px solid #dde0e6; border-radius:6px;
  font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600;
  background:#fff; color:#1a1a2e; cursor:pointer; outline:none; }
.ov-applic-select:focus { border-color:#1a1a2e; }

  /* ── CIRCULAR SELECTOR ── */
.app-sel-row        { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
.app-sel-search-wrap{ position:relative;flex:1 1 280px;min-width:220px; }
.app-sel-icon       { position:absolute;left:10px;top:50%;transform:translateY(-50%);
  color:#9499aa;font-size:15px;pointer-events:none;z-index:1; }
.app-sel-input      { width:100%;padding:9px 12px 9px 30px;background:#f5f6f8;
  border:1.5px solid #dde0e6;border-radius:8px;font-family:'DM Sans',sans-serif;
  font-size:13px;color:#1a1a2e;outline:none;box-sizing:border-box;transition:border-color 0.14s; }
.app-sel-input:focus{ border-color:#1a1a2e;background:#fff; }
.app-sel-input::placeholder { color:#9499aa; }
.app-sel-dropdown   { position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;
  border:1.5px solid #dde0e6;border-radius:10px;z-index:9999;max-height:240px;
  overflow-y:auto;box-shadow:0 8px 24px rgba(26,26,46,0.12); }
.app-sel-dd-item    { padding:9px 13px;cursor:pointer;border-bottom:1px solid #f0f1f4;transition:background 0.1s; }
.app-sel-dd-item:last-child { border-bottom:none; }
.app-sel-dd-item:hover { background:#f5f6f8; }
.app-sel-dd-meta    { display:flex;align-items:center;gap:7px;margin-bottom:3px; }
.app-sel-dd-id      { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:#1a1a2e; }
.app-sel-dd-reg     { font-size:11px;color:#9499aa; }
.app-sel-dd-risk    { font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px; }
.app-sel-dd-title   { font-size:12px;color:#4a5068;line-height:1.4; }
.app-sel-confirm-btn{ padding:9px 18px;background:#1a1a2e;border:none;border-radius:8px;
  font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#fff;
  cursor:pointer;white-space:nowrap;flex-shrink:0;transition:background 0.14s,opacity 0.14s; }
.app-sel-confirm-btn:disabled { background:#c4c8d4;cursor:not-allowed;opacity:0.65; }
.app-sel-confirm-btn:not(:disabled):hover { background:#2d2d4e; }
.app-sel-confirmed  { display:flex;align-items:center;justify-content:space-between;
  margin-top:10px;padding:9px 13px;background:#f0fdf4;border:1.5px solid #86efac;
  border-radius:8px;flex-wrap:wrap;gap:8px; }
.app-sel-conf-left  { display:flex;align-items:center;gap:7px;min-width:0;flex-wrap:wrap; }
.app-sel-conf-id    { font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:#15803d; }
.app-sel-conf-sep   { color:#86efac; }
.app-sel-conf-name  { font-size:12px;color:#166534;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:380px; }
.app-sel-change-btn { padding:4px 11px;background:#fff;border:1.5px solid #86efac;border-radius:6px;
  font-size:11px;font-weight:600;color:#15803d;cursor:pointer;transition:all 0.12s;flex-shrink:0; }
.app-sel-change-btn:hover { background:#dcfce7; }



  /* scope controls */
  .ap-header-controls { display:flex;align-items:center;gap:6px;flex-shrink:0; }
  .app-scope-field { flex:1;min-width:160px; }
  .app-select      { width:100%;padding:9px 12px;background:#f0f1f4;border:1.5px solid #dde0e6;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:13px;color:#1a1a2e;outline:none;box-sizing:border-box; }
  .app-select:focus{ border-color:#1a1a2e;background:#fff; }
  .app-btn-run     { padding:10px 20px;background:#1a1a2e;border:none;border-radius:8px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:background 0.15s;white-space:nowrap;flex-shrink:0;align-self:flex-end; }
  .app-btn-run:hover { background:#2d2d4e; }

  /* results */
  .app-results     { display:flex;flex-direction:column;gap:14px;margin-top:4px; }

  /* ctx banner */
  .app-ctx-banner  { display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#f5f3ff;border:1px solid #c4b5fd;border-radius:8px;font-size:12px;color:#4c1d95;line-height:1.5; }
  .app-ctx-banner-icon { font-size:14px;flex-shrink:0;margin-top:1px; }

  /* verdict */
  .app-verdict-banner { display:flex;align-items:flex-start;gap:14px;padding:16px 18px;border-radius:10px;border:1.5px solid; }
  .app-v-yes     { background:#f0fdf4;border-color:#86efac; }
  .app-v-no      { background:#fef2f2;border-color:#fca5a5; }
  .app-v-partial { background:#fefce8;border-color:#fcd34d; }
  .app-verdict-icon  { font-size:22px;flex-shrink:0;margin-top:1px; }
  .app-verdict-body  { flex:1;min-width:0; }
  .app-verdict-title { font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:3px; }
  .app-verdict-text  { font-size:12px;color:#4a5068;line-height:1.6; }
  .app-verdict-badge { padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;flex-shrink:0;align-self:flex-start;border:1.5px solid; }
  .app-v-yes .app-verdict-badge     { background:#dcfce7;color:#15803d;border-color:#86efac; }
  .app-v-no .app-verdict-badge      { background:#fee2e2;color:#b91c1c;border-color:#fca5a5; }
  .app-v-partial .app-verdict-badge { background:#fef9c3;color:#b45309;border-color:#fcd34d; }

  /* section cards */
  .app-section-card { background:#fff;border:1px solid #dde0e6;border-radius:8px;overflow:hidden; }
  .app-sec-head     { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding:11px 16px;background:#f5f6f8;border-bottom:1px solid #dde0e6; }
  .app-sec-title    { font-size:12px;font-weight:700;color:#1a1a2e; }
  .app-sec-sub      { font-size:11px;color:#9499aa;margin-left:8px; }
  .app-sec-actions  { display:flex;align-items:center;gap:6px;flex-wrap:wrap; }

  /* pills */
  .app-pill         { padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid; }
  .app-pill-yes     { background:#dcfce7;color:#15803d;border-color:#86efac; }
  .app-pill-part    { background:#fef9c3;color:#b45309;border-color:#fcd34d; }
  .app-pill-no      { background:#fee2e2;color:#b91c1c;border-color:#fca5a5; }
  .app-pill-na      { background:#f1f5f9;color:#64748b;border-color:#cbd5e1; }

  /* table-header action buttons */
  .app-tbl-btn         { padding:4px 10px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.13s;border:1.5px solid;display:inline-flex;align-items:center;gap:4px;white-space:nowrap; }
  .app-tbl-btn-edit    { background:#fff;border-color:#dde0e6;color:#4a5068; }
  .app-tbl-btn-edit:hover { background:#f5f6f8;color:#1a1a2e; }
  .app-tbl-btn-active  { background:#1a1a2e !important;color:#fff !important;border-color:#1a1a2e !important; }
  .app-tbl-btn-hist    { background:#fff;border-color:#c4b5fd;color:#6d28d9; }
  .app-tbl-btn-hist:hover { background:#f5f3ff; }
  .app-tbl-btn-ctx     { background:#fff;border-color:#dde0e6;color:#4a5068; }
  .app-tbl-btn-ctx:hover { background:#f5f3ff;border-color:#c4b5fd;color:#6d28d9; }

  /* edit save bar */
  .app-edit-bar        { display:flex;align-items:center;gap:10px;padding:8px 16px;background:#fefce8;border-top:1px solid #fcd34d;flex-wrap:wrap; }
  .app-edit-bar-info   { font-size:11px;color:#92400e;flex:1;min-width:120px; }
  .app-edit-bar-cancel { padding:5px 14px;background:#fff;border:1.5px solid #dde0e6;border-radius:6px;font-size:12px;font-weight:600;color:#4a5068;cursor:pointer; }
  .app-edit-bar-cancel:hover { background:#f5f6f8; }
  .app-edit-bar-save   { padding:5px 14px;background:#1a1a2e;border:none;border-radius:6px;font-size:12px;font-weight:700;color:#fff;cursor:pointer; }
  .app-edit-bar-save:hover { background:#2d2d4e; }

  /* table */
  .app-table-wrap  { overflow-x:auto; }
  .app-table       { width:100%;border-collapse:collapse; }
  .app-table th    { padding:9px 14px;text-align:left;font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.07em;background:#f5f6f8;border-bottom:1px solid #dde0e6;white-space:nowrap; }
  .app-table td    { padding:10px 14px;font-size:12px;color:#4a5068;border-bottom:1px solid #f0f1f4;vertical-align:middle;line-height:1.5; }
  .app-table tr:last-child td { border-bottom:none; }
  .app-table tr:hover td { background:#fafafa; }
  .app-ent-name    { font-size:12px;font-weight:600;color:#1a1a2e; }
  .app-ent-sub     { font-size:11px;color:#9499aa;margin-top:2px; }
  .app-p-name      { font-size:12px;font-weight:600;color:#1a1a2e; }

  /* status badges */
  .app-status      { display:inline-flex;align-items:center;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700; }
  .app-s-yes       { background:#dcfce7;color:#15803d; }
  .app-s-no        { background:#fee2e2;color:#b91c1c; }
  .app-s-part      { background:#fef9c3;color:#b45309; }
  .app-s-na        { background:#f1f5f9;color:#64748b; }

  /* entity status pills */
  .app-status-pill { padding:3px 9px;border-radius:6px;font-size:10px;font-weight:700;
    border:1.5px solid #dde0e6;background:#f5f6f8;color:#4a5068;cursor:pointer;transition:all 0.12s; }
  .app-status-pill:hover { border-color:#9499aa;color:#1a1a2e; }
  .app-status-pill.app-pill-yes  { background:#dcfce7;border-color:#86efac;color:#15803d; }
  .app-status-pill.app-pill-no   { background:#fee2e2;border-color:#fca5a5;color:#b91c1c; }
  .app-status-pill.app-pill-part { background:#fef9c3;border-color:#fcd34d;color:#b45309; }
  .app-status-pill.app-pill-na   { background:#f1f5f9;border-color:#cbd5e1;color:#64748b; }

  /* inline status select (param) */
  .app-inline-select { padding:3px 6px;background:#f0f1f4;border:1.5px solid #dde0e6;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:11px;color:#1a1a2e;cursor:pointer;outline:none; }
  .app-inline-select:focus { border-color:#1a1a2e; }

  /* editable cells */
  .app-editable-cell      { display:inline-block;min-width:40px;border-radius:4px;transition:background 0.12s; }
  .app-editable-cell.app-cell-editing {
    background:#fffbeb;
    border:1.5px dashed #fcd34d;
    padding:2px 6px;
    outline:none;
    cursor:text;
  }
  .app-editable-cell.app-cell-editing:focus { border-color:#f59e0b;background:#fef3c7; }

  /* reason button + tooltip */
  .app-reason-btn  { width:22px;height:22px;border-radius:50%;background:#f0f1f4;border:1.5px solid #dde0e6;font-size:11px;font-weight:700;color:#6b7280;cursor:pointer;transition:all 0.12s;display:inline-flex;align-items:center;justify-content:center; }
  .app-reason-btn:hover { background:#1a1a2e;color:#fff;border-color:#1a1a2e; }
  .app-tooltip     { display:none;position:absolute;right:0;top:calc(100% + 6px);z-index:200;background:#1a1a2e;color:#fff;border-radius:8px;padding:10px 13px;font-size:12px;line-height:1.55;width:260px;box-shadow:0 8px 24px rgba(0,0,0,0.2); }
  .app-tooltip.app-tt-show { display:block; }
  .app-tt-arrow    { position:absolute;top:-5px;right:9px;width:10px;height:10px;background:#1a1a2e;transform:rotate(45deg);border-radius:2px; }
  .app-tt-text     { position:relative;z-index:1; }

  .app-tip-textarea { width:100%;min-height:60px;padding:6px 8px;background:#2a2a3e;
  border:1px solid #4a4a6a;border-radius:6px;color:#fff;font-family:'DM Sans',sans-serif;
  font-size:11px;line-height:1.5;resize:vertical;outline:none;box-sizing:border-box;margin-bottom:6px; }
.app-tip-save-btn { padding:4px 12px;background:#6366f1;border:none;border-radius:5px;
  color:#fff;font-size:11px;font-weight:700;cursor:pointer;width:100%; }
.app-tip-save-btn:hover { background:#4f46e5; }
.app-tip-edit-btn { display:block;margin-top:8px;background:none;border:none;
  color:#a5b4fc;font-size:10px;font-weight:600;cursor:pointer;padding:0;text-align:left; }
.app-tip-edit-btn:hover { color:#fff; }

  /* footer */
  .app-footer      { display:flex;gap:10px;align-items:center;padding-top:2px;flex-wrap:wrap; }
  .app-footer-btn  { padding:10px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.14s;display:inline-flex;align-items:center;gap:7px;border:1.5px solid; }
  .app-btn-regen   { background:#fff;border-color:#dde0e6;color:#4a5068; }
  .app-btn-regen:hover { background:#f5f6f8;color:#1a1a2e; }
  .app-btn-save    { background:#fff;border-color:#86efac;color:#16a34a; }
  .app-btn-save:hover { background:#f0fdf4; }
  .app-btn-save-done { background:#f0fdf4 !important;opacity:0.7; }
  .app-btn-next    { background:#1a1a2e;color:#fff;border-color:#1a1a2e;margin-left:auto; }
  .app-btn-next:hover { background:#2d2d4e; }

  /* ── MODAL SHARED ── */
  .app-modal-overlay  { position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:10000;display:none;align-items:center;justify-content:center;padding:20px; }
  .app-modal-overlay.app-modal-open { display:flex; }
  .app-modal-box      { background:#fff;border-radius:14px;width:100%;max-width:540px;box-shadow:0 24px 60px rgba(0,0,0,0.22);overflow:hidden;animation:appModalIn 0.22s ease; }
  .app-ver-box        { max-width:600px;max-height:80vh;display:flex;flex-direction:column; }
  @keyframes appModalIn { from { opacity:0;transform:translateY(12px) scale(0.97); } to { opacity:1;transform:none; } }
  .app-modal-header   { display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #dde0e6;background:#f5f6f8; }
  .app-modal-title    { font-size:14px;font-weight:700;color:#1a1a2e; }
  .app-modal-close    { width:28px;height:28px;border-radius:50%;background:#e2e5eb;border:none;font-size:13px;color:#4a5068;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.12s; }
  .app-modal-close:hover { background:#1a1a2e;color:#fff; }
  .app-modal-body     { padding:20px;overflow-y:auto; }
  .app-modal-desc     { font-size:13px;color:#4a5068;margin:0 0 14px;line-height:1.6; }
  .app-modal-footer   { display:flex;justify-content:flex-end;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid #f0f1f4; }
  .app-modal-btn-cancel { padding:9px 18px;background:#fff;border:1.5px solid #dde0e6;border-radius:8px;font-size:13px;font-weight:600;color:#4a5068;cursor:pointer; }
  .app-modal-btn-cancel:hover { background:#f5f6f8; }
  .app-modal-btn-go   { padding:9px 18px;background:#1a1a2e;border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif; }
  .app-modal-btn-go:hover { background:#2d2d4e; }

  /* AI context modal specifics */
  .app-ctx-chips      { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px; }
  .app-chip           { padding:5px 12px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:20px;font-size:11px;font-weight:600;color:#4a5068;cursor:pointer;transition:all 0.13s;user-select:none; }
  .app-chip:hover     { border-color:#a5b4fc;color:#4f46e5;background:#eef2ff; }
  .app-chip-active    { background:#1a1a2e;color:#fff;border-color:#1a1a2e; }
  .app-ctx-textarea   { width:100%;min-height:110px;padding:10px 12px;background:#f0f1f4;border:1.5px solid #dde0e6;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:#1a1a2e;line-height:1.6;resize:vertical;outline:none;box-sizing:border-box; }
  .app-ctx-textarea:focus { border-color:#1a1a2e;background:#fff; }

  /* version history modal specifics */
  .app-ver-subtitle   { font-size:11px;font-weight:600;color:#9499aa;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px; }
  .app-ver-list       { display:flex;flex-direction:column;gap:10px; }
  .app-ver-empty      { font-size:13px;color:#9499aa;text-align:center;padding:30px 20px;background:#f5f6f8;border-radius:8px;border:1px dashed #dde0e6; }
  .app-ver-entry      { background:#f5f6f8;border:1px solid #dde0e6;border-radius:8px;padding:12px 14px;display:flex;flex-direction:column;gap:8px; }
  .app-ver-meta       { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
  .app-ver-num        { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;background:#1a1a2e;color:#fff;padding:1px 7px;border-radius:4px; }
  .app-ver-ts         { font-size:11px;color:#9499aa; }
  .app-ver-badge      { font-size:10px;font-weight:700;padding:2px 8px;background:#eff6ff;border:1px solid #bfdbfe;color:#2563eb;border-radius:20px; }
  .app-ver-rows       { margin:0;padding-left:18px;font-size:12px;color:#4a5068;line-height:1.8; }
  .app-ver-restore    { align-self:flex-start;padding:4px 12px;background:#fff;border:1.5px solid #dde0e6;border-radius:6px;font-size:11px;font-weight:600;color:#4a5068;cursor:pointer;transition:all 0.12s; }
  .app-ver-restore:hover { background:#1a1a2e;color:#fff;border-color:#1a1a2e; }


  .app-row-action-btn { width:24px;height:24px;border-radius:5px;border:1.5px solid #dde0e6;
  background:#fff;font-size:13px;line-height:1;cursor:pointer;color:#4a5068;
  display:inline-flex;align-items:center;justify-content:center;
  transition:all 0.12s;margin:0 2px; }
.app-row-action-btn:hover { background:#f5f6f8;border-color:#9499aa;color:#1a1a2e; }
.app-row-remove-btn:hover { background:#fee2e2;border-color:#fca5a5;color:#b91c1c; }

  /* loading */
  .ai-loading      { display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 20px; }
  .ai-loading-text { font-size:13px;color:#9499aa;font-family:'DM Sans',sans-serif; }
  .spinner         { width:28px;height:28px;border:3px solid #eef0f3;border-top-color:#1a1a2e;border-radius:50%;animation:spin 0.7s linear infinite; }
  @keyframes spin  { to { transform:rotate(360deg); } }

  `;
  document.head.appendChild(s);
}

window._appChangeEntityStatus = function(idx, status) {
  if (!window._APP_ENT_DATA || !window._APP_ENT_DATA[idx]) return;
  window._APP_ENT_DATA[idx].applicable = status;
  var badge = document.getElementById('app-ent-badge-' + idx);
  if (!badge) return;
  var classMap = {yes:'app-s-yes', no:'app-s-no', partial:'app-s-part', na:'app-s-na'};
  var labelMap = {yes:'✓ Yes', no:'✗ No', partial:'~ Partial', na:'— N/A'};
  badge.className   = 'app-status app-ent-badge ' + (classMap[status] || 'app-s-part');
  badge.textContent = labelMap[status] || status;
};

window._appUpdateStatus = function(type, idx, val) {
  if (type === 'entity') _appChangeEntityStatus(idx, val);
  else _appChangeParamStatus(idx, val);
};