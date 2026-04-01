/**
 * overview-panel.js  —  Panel 0: Circular Overview
 * Mode A: Existing Circular — search + confirm
 * Mode B: New Circular     — drop/browse + from email + confirm → AI extract
 */

/* ================================================================ BUILD */
function buildOverviewPanel() {
  injectSharedCSS();
  injectOverviewCSS();
  return `
  <div class="ov-wrap">

    <!-- CARD 1: SELECT CIRCULAR -->
    <div class="sh-card" id="ov-card1">
      <div class="sh-card-head">
        <div class="sh-dot" id="ov-s1">1</div>
        <div style="flex:1;min-width:0;">
          <div class="sh-card-title">Select Circular</div>
          <div class="ov-sub-row">
            <span class="sh-card-sub">Choose from the repository or upload a new circular</span>
            <div class="ov-mode-toggle">
              <button class="ov-mode-btn active" data-mode="existing">🗂 Existing</button>
              <button class="ov-mode-btn"        data-mode="new">➕ New</button>
            </div>
          </div>
        </div>
      </div>
      <div class="sh-card-body">

        <!-- MODE A: EXISTING — search + confirm -->
        <div id="ov-mode-existing-panel">
          <div class="ov-inline-row">
            <div class="ov-search-wrap">
              <span class="ov-search-icon">⌕</span>
              <input class="ov-search-input" id="ov-search-input" type="text"
                placeholder="Search by ID, title, regulator…" autocomplete="off"/>
              <div class="ov-dropdown" id="ov-dropdown" style="display:none;"></div>
            </div>
            <button class="ov-confirm-btn" id="ov-confirm-btn" disabled>Confirm →</button>
          </div>
        </div>

        <!-- MODE B: NEW — file + email + confirm -->
        <div id="ov-mode-new-panel" style="display:none;">
          <div class="ov-inline-row">
            <label class="ov-upload-btn" id="ov-drop-zone" title="Drop or browse PDF / DOCX">
              <input type="file" id="ov-file-input" accept=".pdf,.docx,.doc" style="display:none;"/>
              <span>📁</span>
              <span id="ov-upload-label">Drop / Browse</span>
            </label>
            <button class="ov-upload-btn ov-upload-btn-disabled" disabled title="Coming soon">
              <span>📧</span><span>From Email</span>
              <span class="ov-soon-badge">Soon</span>
            </button>
            <button class="ov-confirm-btn" id="ov-confirm-new-btn" disabled>Confirm →</button>
          </div>
        </div>

      </div>
    </div>

    <!-- CARD 2: CIRCULAR DETAILS (revealed after confirm) -->
    <div id="ov-details-wrap" class="ov-reveal-wrap" style="display:none;">
      <div class="sh-card" id="ov-card2">
        <div class="sh-card-head">
          <div class="sh-dot done" id="ov-s2">✓</div>
          <div style="flex:1;">
            <div class="sh-card-title" id="ov-details-heading">Circular Overview</div>
            <div class="sh-card-sub" id="ov-details-sub">Key information about this circular</div>
          </div>
          <!-- HEADER ACTIONS — shown after confirm -->
          <div class="ov-details-actions" id="ov-details-actions" style="display:none;">
            <button class="ov-action-btn" id="ov-btn-change">✕ Change</button>
            <button class="ov-action-btn ov-action-btn-primary" id="ov-btn-regenerate" style="display:none;">
              ✦ Generate with AI
            </button>
            <button class="ov-action-btn ov-action-btn-regen" id="ov-btn-regen-existing" style="display:none;">
              ↺ Regenerate
            </button>
          </div>
        </div>
        <div class="sh-card-body" id="ov-details-body"></div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="ov-footer ov-reveal-wrap" id="ov-footer" style="display:none;">
      <button class="ov-next-btn" id="ov-btn-next">Proceed to Applicability Analysis →</button>
    </div>

  </div>`;
}

/* ================================================================ INIT */
function initOverviewListeners() {
  injectSharedCSS();
  injectOverviewCSS();

  let _sel = null;
  let _mode = 'existing'; // 'existing' | 'new'

  const searchInput = document.getElementById('ov-search-input');
  const dropdown = document.getElementById('ov-dropdown');
  const confirmBtn = document.getElementById('ov-confirm-btn');
  const confirmNewBtn = document.getElementById('ov-confirm-new-btn');
  const fileInput = document.getElementById('ov-file-input');
  const uploadLabel = document.getElementById('ov-upload-label');

  /* ── MODE TOGGLE ── */
  document.querySelectorAll('.ov-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.mode === _mode) return;
      _mode = btn.dataset.mode;
      document.querySelectorAll('.ov-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const existingPanel = document.getElementById('ov-mode-existing-panel');
      const newPanel = document.getElementById('ov-mode-new-panel');
      if (_mode === 'existing') {
        existingPanel.style.display = 'block';
        newPanel.style.display = 'none';
      } else {
        existingPanel.style.display = 'none';
        newPanel.style.display = 'block';
      }

      /* reset selection on mode switch */
      _sel = null;
      if (confirmBtn) confirmBtn.disabled = true;
      if (confirmNewBtn) confirmNewBtn.disabled = true;
      if (searchInput) searchInput.value = '';
      if (uploadLabel) uploadLabel.textContent = 'Drop / Browse';
      _ovHide('ov-details-wrap');
      _ovHide('ov-footer');
    });
  });

  /* ── SEARCH (existing mode) ── */
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) { dropdown.style.display = 'none'; return; }
      const matches = (CMS_DATA?.circulars || [])
        .filter(c =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.regulator || '').toLowerCase().includes(q)
        ).slice(0, 8);
      if (!matches.length) { dropdown.style.display = 'none'; return; }
      dropdown.innerHTML = matches.map(c => `
        <div class="ov-dd-item" data-id="${c.id}">
          <div class="ov-dd-meta">
            <span class="ov-dd-id">${c.id}</span>
            <span class="ov-dd-reg">${c.regulator || ''}</span>
            ${c.risk ? `<span class="ov-dd-risk ov-risk-${c.risk.toLowerCase()}">${c.risk}</span>` : ''}
          </div>
          <div class="ov-dd-title">${c.title}</div>
        </div>`).join('');
      dropdown.style.display = 'block';
      dropdown.querySelectorAll('.ov-dd-item').forEach(item => {
        item.addEventListener('click', () => {
          const circ = CMS_DATA.circulars.find(c => c.id === item.dataset.id);
          if (circ) _selectExisting(circ);
        });
      });
    });
    document.addEventListener('click', e => {
      if (!searchInput.contains(e.target) && !dropdown?.contains(e.target))
        dropdown.style.display = 'none';
    });
  }

  function _selectExisting(circ) {
    _sel = circ;
    AI_LIFECYCLE_STATE.selectedCircularId = circ.id;
    searchInput.value = `${circ.id} – ${circ.title}`;
    dropdown.style.display = 'none';
    if (confirmBtn) confirmBtn.disabled = false;
  }

  /* ── CONFIRM EXISTING ── */
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (!_sel) return;
      _ovMarkStep1Done();
      _ovReveal('ov-details-wrap', () => {
        _ovRenderDetails(_sel, 'existing');
        document.getElementById('ov-card2')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => _ovReveal('ov-footer'), 300);
      });
    });
  }

  /* ── FILE INPUT (new mode) ── */
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) _handleFile(fileInput.files[0]);
    });
  }

  function _handleFile(file) {
    AI_LIFECYCLE_STATE.uploadedCircular = file;
    _sel = { id: 'UPLOAD', title: file.name, uploaded: true };
    if (uploadLabel) uploadLabel.textContent = `✓ ${file.name.substring(0, 22)}${file.name.length > 22 ? '…' : ''}`;
    if (confirmNewBtn) confirmNewBtn.disabled = false;
  }

  /* ── CONFIRM NEW ── */
  if (confirmNewBtn) {
    confirmNewBtn.addEventListener('click', () => {
      if (!_sel) return;
      _ovMarkStep1Done();
      _ovReveal('ov-details-wrap', () => {
        _ovRenderDetails(_sel, 'new');
        document.getElementById('ov-card2')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => _ovReveal('ov-footer'), 300);
      });
    });
  }

  /* ── CHANGE BUTTON ── */
  document.getElementById('ov-btn-change')?.addEventListener('click', () => {
    _sel = null;
    AI_LIFECYCLE_STATE.selectedCircularId = null;
    AI_LIFECYCLE_STATE.uploadedCircular = null;
    if (confirmBtn) confirmBtn.disabled = true;
    if (confirmNewBtn) confirmNewBtn.disabled = true;
    if (searchInput) searchInput.value = '';
    if (uploadLabel) uploadLabel.textContent = 'Drop / Browse';
    _ovHide('ov-details-wrap');
    _ovHide('ov-footer');
    const s1 = document.getElementById('ov-s1');
    if (s1) { s1.classList.remove('done'); s1.textContent = '1'; }
  });

  /* ── REGENERATE (existing) ── */
  document.getElementById('ov-btn-regenerate')?.addEventListener('click', function () {
    const circId = AI_LIFECYCLE_STATE.selectedCircularId;
    const circ = circId ? (CMS_DATA?.circulars || []).find(c => c.id === circId) : null;
    if (!circ) return;
    this.textContent = '↺ …';
    this.disabled = true;
    setTimeout(() => {
      _ovRenderDetails(circ, 'existing');
      this.textContent = '↺ Regenerate';
      this.disabled = false;
      showToast('Overview regenerated.', 'success');
    }, 900);
  });

  /* ── EXTRACT WITH AI (new upload) ── */
  document.getElementById('ov-confirm-new-btn')?.addEventListener('click', function () {
    const body = document.getElementById('ov-details-body');
    if (!body) return;
    this.textContent = '✦ Extracting…';
    this.disabled = true;
    body.style.opacity = '0.4';
    setTimeout(() => {
      const Force_Fail = true;
      const aiScore = Force_Fail ? 0.3 :0.8; // replace with real score

      if (aiScore < 0.5) {
        showExtractionFailureModal();
        this.textContent = '✦ Extract with AI';
        this.disabled = false;
        body.style.opacity = '1';
        return;
      }

      body.innerHTML = _ovUploadExtractedHTML();
      body.style.opacity = '1';
      this.textContent = '✦ Re-extract';
      this.style.color="Yellow"
      this.disabled = false;
      showToast('AI extraction complete.', 'success');

    }, 1600);
  });

  /* ── NEXT → APPLICABILITY ── */
  document.getElementById('ov-btn-next')?.addEventListener('click', () => {
    document.querySelector('[data-tab="applicability"]')?.click();
  });

  /* ── AUTO-RESTORE ── */
  if (AI_LIFECYCLE_STATE.selectedCircularId) {
    const c = (CMS_DATA?.circulars || []).find(x => x.id === AI_LIFECYCLE_STATE.selectedCircularId);
    if (c) {
      _sel = c;
      if (searchInput) searchInput.value = `${c.id} – ${c.title}`;
      if (confirmBtn) confirmBtn.disabled = false;
      _ovMarkStep1Done();
      _ovShowInstant('ov-details-wrap');
      _ovShowInstant('ov-footer');
      _ovRenderDetails(c, 'existing');
    }
  }

  /* ── HELPERS ── */
  function _ovMarkStep1Done() {
    const s1 = document.getElementById('ov-s1');
    if (s1) { s1.classList.add('done'); s1.textContent = '✓'; }
  }
}

/* ================================================================ RENDER DETAILS */
function _ovRenderDetails(circ, mode) {
  const body = document.getElementById('ov-details-body');
  const actionsBar = document.getElementById('ov-details-actions');
  const heading = document.getElementById('ov-details-heading');
  const sub = document.getElementById('ov-details-sub');
  const btnAI = document.getElementById('ov-btn-regenerate');
  const btnRegen = document.getElementById('ov-btn-regen-existing');
  if (!body) return;

  /* show actions bar */
  if (actionsBar) actionsBar.style.display = 'flex';

  if (mode === 'new' || circ?.uploaded) {
    if (heading) heading.textContent = 'Uploaded Circular';
    if (sub) sub.textContent = 'AI will extract details — click "Extract with AI"';
    if (btnAI) btnAI.style.display = 'inline-flex';
    if (btnRegen) btnRegen.style.display = 'none';
    /* show same layout as existing, with placeholder values */
    const fname = circ?.title || 'Uploaded file';
    body.innerHTML = `
    <div class="ov-hero">
      <div class="ov-hero-left">
        <div class="ov-hero-id">PENDING EXTRACTION</div>
        <div class="ov-hero-title">${fname}</div>
        <div class="ov-hero-meta">
          <span class="ov-meta-chip">RBI</span>
          <span class="ov-meta-chip ov-chip-type">Master Circular</span>
          <span class="ov-risk-badge ov-risk-medium">— Risk</span>
          <span class="ov-status-badge">Active</span>
        </div>
      </div>
    </div>
    <div class="ov-detail-grid">
      ${[['Issue Date', 'April 02, 2024 '], ['Effective Date', '2024-03-01'], ['Regulator', 'RBI'],
      ['Circular Type', 'Master'], ['Department', '—'], ['Reference No.', 'RBI/2024-25/11 ']]
        .map(([l, v]) => `<div class="ov-detail-cell"><div class="ov-dc-label">${l}</div><div class="ov-dc-val ov-val-pending">${v}</div></div>`).join('')}
    </div>
    <div class="ov-summary-block ov-summary-pending">
      <div class="ov-sb-head">Summary</div>
      <div class="ov-sb-text ov-val-pending">Click <strong>Extract with AI</strong> in the header to automatically populate all fields from the uploaded document.</div>
    </div>`;
    return;
  }

  /* EXISTING CIRCULAR */
  if (heading) heading.textContent = 'Circular Overview';
  if (sub) sub.textContent = 'Key information extracted from the repository';
  if (btnAI) btnAI.style.display = 'none';
  if (btnRegen) btnRegen.style.display = 'inline-flex';

  const riskClass = (circ.risk || '').toLowerCase();
  const statusClass = (circ.status || '').toLowerCase().replace(/\s+/g, '-');

  const hero = `
    <div class="ov-hero">
      <div class="ov-hero-left">
        <div class="ov-hero-id">${circ.id}</div>
        <div class="ov-hero-title">${circ.title}</div>
        <div class="ov-hero-meta">
          <span class="ov-meta-chip">${circ.regulator || 'N/A'}</span>
          ${circ.type ? `<span class="ov-meta-chip ov-chip-type">${circ.type}</span>` : ''}
          <span class="ov-risk-badge ov-risk-${riskClass}">${circ.risk || 'N/A'} Risk</span>
          <span class="ov-status-badge ov-status-${statusClass}">${circ.status || 'N/A'}</span>
        </div>
      </div>
      ${circ.deadline ? `
      <div class="ov-deadline-box">
        <div class="ov-dl-label">Compliance Deadline</div>
        <div class="ov-dl-date">${circ.deadline}</div>
      </div>` : ''}
    </div>`;

  const grid = `
    <div class="ov-detail-grid">
      ${[
      ['Issue Date', circ.issuedDate || circ.date || '—'],
      ['Effective Date', circ.effectiveDate || '—'],
      ['Regulator', circ.regulator || '—'],
      ['Circular Type', circ.type || '—'],
      ['Department', circ.departments || '—'],
      ['Reference No.', circ.refNo || circ.referenceNo || circ.id],
    ].map(([l, v]) => `
        <div class="ov-detail-cell">
          <div class="ov-dc-label">${l}</div>
          <div class="ov-dc-val">${v}</div>
        </div>`).join('')}
    </div>`;

  const summary = circ.summary || circ.description || circ.overview || '';
  const summaryBlock = summary ? `
    <div class="ov-summary-block">
      <div class="ov-sb-head">Summary</div>
      <div class="ov-sb-text">${summary}</div>
    </div>` : '';

  const tags = circ.tags || circ.topics || circ.keywords || [];
  const tagsBlock = tags.length ? `
    <div class="ov-tags-row">${tags.map(t => `<span class="ov-tag">${t}</span>`).join('')}</div>` : '';

  const chapCount = circ.chapters?.length || 0;
  const clauseCount = circ.chapters?.reduce((s, ch) => s + (ch.clauses?.length || 0), 0) || 0;
  const statsBlock = (chapCount || clauseCount) ? `
    <div class="ov-stats-row">
      ${chapCount ? `<div class="ov-stat-pill"><span class="ov-stat-num">${chapCount}</span><span class="ov-stat-lbl">Chapters</span></div>` : ''}
      ${clauseCount ? `<div class="ov-stat-pill"><span class="ov-stat-num">${clauseCount}</span><span class="ov-stat-lbl">Clauses</span></div>` : ''}
    </div>` : '';

  body.innerHTML = hero + grid + summaryBlock + tagsBlock + statsBlock;
}

/* ── Mock AI-extracted result for new upload ── */
function _ovUploadExtractedHTML() {
  return `
  <div class="ov-hero">
    <div class="ov-hero-left">
      <div class="ov-hero-id">AI-EXTRACTED</div>
      <div class="ov-hero-title">Uploaded Circular — Details Extracted by AI</div>
      <div class="ov-hero-meta">
        <span class="ov-meta-chip">RBI</span>
        <span class="ov-meta-chip ov-chip-type">Master Direction</span>
        <span class="ov-risk-badge ov-risk-high">High Risk</span>
        <span class="ov-status-badge ov-status-active">Active</span>
      </div>
    </div>
    <div class="ov-deadline-box">
      <div class="ov-dl-label">Compliance Deadline</div>
      <div class="ov-dl-date">Extracted from doc</div>
    </div>
  </div>
  <div class="ov-detail-grid">
    ${[
      ['Issue Date', 'Extracted by AI'], ['Effective Date', 'Extracted by AI'],
      ['Regulator', 'Extracted by AI'], ['Circular Type', 'Extracted by AI'],
      ['Department', 'Extracted by AI'], ['Reference No.', 'Extracted by AI'],
    ].map(([l, v]) => `<div class="ov-detail-cell"><div class="ov-dc-label">${l}</div><div class="ov-dc-val">${v}</div></div>`).join('')}
  </div>
  <div class="ov-summary-block">
    <div class="ov-sb-head">AI Extracted Summary</div>
    <div class="ov-sb-text">Summary extracted from uploaded document. Connect to the AI API to populate real extracted content from the PDF/DOCX.</div>
  </div>`;
}

/* ================================================================ UTILS */
function _ovReveal(id, cb) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  el.style.transition = 'opacity 0.35s ease,transform 0.35s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    if (typeof cb === 'function') setTimeout(cb, 370);
  }));
}
function _ovShowInstant(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = 'block'; el.style.opacity = '1'; el.style.transform = 'none'; }
}
function _ovHide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function closeModal() {
  document.querySelector('.ov-modal-overlay')?.remove();
}

function retryExtraction() {
  closeModal();
  renderAIEngine('overview')
  document.getElementById('ov-btn-regenerate')?.click();
}

function manualEntry() {
  closeModal();
   renderAISuggestionPage();
  showToast('Switching to manual entry mode...', 'info');
}


function showExtractionFailureModal() {
  const modal = document.createElement('div');
  modal.className = 'ov-modal-overlay';
  modal.innerHTML = `
    <div class="ov-modal">
      <div class="ov-modal-icon">⚠️</div>
      <div class="ov-modal-title">Extraction Needs Review</div>
      <div class="ov-modal-text">
        We couldn’t confidently extract details from this document.
        <br/><br/>
        This may be due to low quality, scanned content, or complex formatting.
      </div>
      <div class="ov-modal-actions">
        <button onclick="retryExtraction()" class="ov-btn-primary" style="color:#ff5500;font-weight:600">Re-Extract</button>
        <button onclick="closeModal()" class="ov-btn" style="color:#ff5500;font-weight:600">Upload New File</button>
        <button onclick="manualEntry()" class="ov-btn-link" style="color:#ff5500;font-weight:600">Fill Manually</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

/* ================================================================ CSS */
function injectOverviewCSS() {
  if (document.getElementById('ov-css')) return;
  const s = document.createElement('style');
  s.id = 'ov-css';
  s.textContent = `
  .ov-wrap        { display:flex;flex-direction:column;gap:14px;font-family:'DM Sans',sans-serif; }
  .ov-reveal-wrap { will-change:opacity,transform; }


  .ov-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.ov-modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 360px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.ov-modal-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.ov-modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.ov-modal-text {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
}

.ov-modal-actions button {
  margin: 6px;
}


  /* ── SUB ROW: subtitle + mode buttons on same line ── */
  .ov-sub-row     { display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:2px; }
  .ov-mode-toggle { display:flex;gap:4px;flex-shrink:0; }
  .ov-mode-btn    { display:inline-flex;align-items:center;gap:4px;padding:3px 10px;
    background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:6px;
    font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:#4a5068;
    cursor:pointer;transition:all 0.14s;white-space:nowrap; }
  .ov-mode-btn:hover  { background:#eef0f3;border-color:#c4c8d4;color:#1a1a2e; }
  .ov-mode-btn.active { background:#1a1a2e;border-color:#1a1a2e;color:#fff; }

  /* ── INLINE ROW: search/upload + confirm ── */
  .ov-inline-row  { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }

  /* search */
  .ov-search-wrap { position:relative;flex:1 1 280px;min-width:220px; }
  .ov-search-icon { position:absolute;left:10px;top:50%;transform:translateY(-50%);
    color:#9499aa;font-size:15px;pointer-events:none;z-index:1; }
  .ov-search-input {
    width:100%;padding:9px 12px 9px 30px;background:#f5f6f8;border:1.5px solid #dde0e6;
    border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:#1a1a2e;
    outline:none;box-sizing:border-box;transition:border-color 0.14s,background 0.14s;
  }
  .ov-search-input:focus { border-color:#1a1a2e;background:#fff; }
  .ov-search-input::placeholder { color:#9499aa; }
  #ov-card1 .sh-card-body { overflow:visible !important; }
  #ov-card1               { overflow:visible !important; }

  /* dropdown */
  .ov-dropdown { position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;
    border:1.5px solid #dde0e6;border-radius:10px;z-index:9999;max-height:240px;
    overflow-y:auto;box-shadow:0 8px 24px rgba(26,26,46,0.12); }
  .ov-dd-item  { padding:9px 13px;cursor:pointer;border-bottom:1px solid #f0f1f4;transition:background 0.1s; }
  .ov-dd-item:last-child { border-bottom:none; }
  .ov-dd-item:hover { background:#f5f6f8; }
  .ov-dd-meta  { display:flex;align-items:center;gap:7px;margin-bottom:3px; }
  .ov-dd-id    { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:#1a1a2e; }
  .ov-dd-reg   { font-size:11px;color:#9499aa; }
  .ov-dd-risk  { font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px; }
  .ov-risk-high   { background:#fee2e2;color:#b91c1c; }
  .ov-risk-medium { background:#fef9c3;color:#b45309; }
  .ov-risk-low    { background:#dcfce7;color:#15803d; }
  .ov-dd-title { font-size:12px;color:#4a5068;line-height:1.4; }

  /* upload buttons */
  .ov-upload-btn { display:inline-flex;align-items:center;gap:6px;padding:9px 14px;
    background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:8px;
    font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#4a5068;
    cursor:pointer;white-space:nowrap;transition:all 0.14s;position:relative; }
  .ov-upload-btn:hover:not(.ov-upload-btn-disabled) { background:#fff;border-color:#9499aa;color:#1a1a2e; }
  .ov-upload-btn-disabled { cursor:default;opacity:0.5; }
  .ov-soon-badge { font-size:9px;font-weight:700;padding:1px 5px;background:#eef0f3;
    border:1px solid #dde0e6;border-radius:4px;color:#9499aa;text-transform:uppercase;
    letter-spacing:.04em;margin-left:2px; }

  /* confirm button */
  .ov-confirm-btn { padding:9px 18px;background:#1a1a2e;border:none;border-radius:8px;
    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#fff;
    cursor:pointer;white-space:nowrap;flex-shrink:0;transition:background 0.14s,opacity 0.14s; }
  .ov-confirm-btn:disabled { background:#c4c8d4;cursor:not-allowed;opacity:0.65; }
  .ov-confirm-btn:not(:disabled):hover { background:#2d2d4e; }

  /* ── DETAILS CARD HEADER ACTIONS ── */
  .ov-details-actions { display:flex;align-items:center;gap:8px;flex-shrink:0;margin-left:auto; }
  .ov-action-btn { padding:5px 12px;background:#fff;border:1px solid #dde0e6;border-radius:6px;
    font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:#4a5068;
    cursor:pointer;transition:all 0.13s;display:inline-flex;align-items:center;gap:5px;white-space:nowrap; }
  .ov-action-btn:hover { border-color:#1a1a2e;color:#1a1a2e; }
  .ov-action-btn-primary { background:#6366f1;border-color:#6366f1;color:#fff; }
  .ov-action-btn-primary:hover { background:#4f46e5;border-color:#4f46e5;color:#fff; }
  .ov-action-btn-regen { border-color:#c4c8d4;color:#9499aa; }
  .ov-action-btn-regen:hover { border-color:#1a1a2e;color:#1a1a2e; }

  /* hero */
  .ov-hero        { display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px;flex-wrap:wrap; }
  .ov-hero-left   { flex:1;min-width:0; }
  .ov-hero-id     { font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px; }
  .ov-hero-title  { font-size:14px;font-weight:700;color:#1a1a2e;line-height:1.4;margin-bottom:8px; }
  .ov-hero-meta   { display:flex;align-items:center;gap:6px;flex-wrap:wrap; }
  .ov-meta-chip   { padding:2px 9px;background:#f0f1f4;border:1px solid #dde0e6;border-radius:20px;font-size:11px;font-weight:700;color:#4a5068; }
  .ov-chip-type   { background:#eff6ff;border-color:#bfdbfe;color:#2563eb; }
  .ov-risk-badge  { padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid; }
  .ov-risk-high   { background:#fee2e2;border-color:#fca5a5;color:#b91c1c; }
  .ov-risk-medium { background:#fef9c3;border-color:#fcd34d;color:#b45309; }
  .ov-risk-low    { background:#dcfce7;border-color:#86efac;color:#15803d; }
  .ov-status-badge   { padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;background:#f3f4f6;color:#52525b; }
  .ov-status-active  { background:#dcfce7;color:#15803d; }
  .ov-deadline-box { padding:10px 16px;background:#fef3c7;border:1.5px solid #fcd34d;border-radius:10px;text-align:center;flex-shrink:0; }
  .ov-dl-label    { font-size:10px;font-weight:700;color:#b45309;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px; }
  .ov-dl-date     { font-size:13px;font-weight:700;color:#92400e; }

  /* detail grid */
  .ov-detail-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#dde0e6;border-radius:8px;overflow:hidden;margin-bottom:12px; }
  .ov-detail-cell { background:#fafbfc;padding:9px 13px; }
  .ov-dc-label    { font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px; }
  .ov-dc-val      { font-size:12px;font-weight:600;color:#1a1a2e; }

  /* summary */
  .ov-summary-block { background:#f5f6f8;border:1px solid #dde0e6;border-radius:8px;padding:12px 14px;margin-bottom:12px; }
  .ov-sb-head       { font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px; }
  .ov-sb-text       { font-size:12px;color:#4a5068;line-height:1.6; }

  /* tags */
  .ov-tags-row { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px; }
  .ov-tag      { padding:2px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;font-size:11px;font-weight:600;color:#2563eb; }

  /* stats */
  .ov-stats-row { display:flex;gap:8px;flex-wrap:wrap; }
  .ov-stat-pill { display:flex;flex-direction:column;align-items:center;padding:8px 18px;background:#fff;border:1px solid #dde0e6;border-radius:8px;min-width:72px; }
  .ov-stat-num  { font-size:18px;font-weight:800;color:#1a1a2e;line-height:1; }
  .ov-stat-lbl  { font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.06em;margin-top:3px; }

  /* upload notice */
  .ov-upload-notice { display:flex;align-items:flex-start;gap:12px;padding:14px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px; }
  .ov-un-icon  { font-size:24px;flex-shrink:0; }
  .ov-un-title { font-size:13px;font-weight:700;color:#0369a1;margin-bottom:4px; }
  .ov-un-sub   { font-size:12px;color:#0284c7;line-height:1.6; }

  /* footer */
  .ov-footer   { display:flex;justify-content:flex-end;padding-top:2px; }
  .ov-next-btn { padding:10px 22px;background:#1a1a2e;color:#fff;border:none;border-radius:8px;
    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:background 0.14s; }
  .ov-next-btn:hover { background:#2d2d4e; }
  `;
  document.head.appendChild(s);
}