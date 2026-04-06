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
      <div style="display:flex;justify-content:flex-end;margin-bottom:8px;position:absolute;top:-52px;right:0;">
        <div class="ov-mode-toggle">
          <button class="ov-mode-btn active" data-mode="existing">🗂 Existing</button>
          <button class="ov-mode-btn" data-mode="new">➕ New</button>
        </div>
      </div>
      
      <div class="sh-card-body">

        <!-- MODE A: EXISTING — search + confirm -->
        <div id="ov-mode-existing-panel">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:#9499aa;text-transform:uppercase;margin-bottom:6px;">Select Circular</div>
          <div class="ov-inline-row">
            <div class="ov-search-wrap">
              <span class="ov-search-icon">⌕</span>
              <input class="ov-search-input" id="ov-search-input" type="text"
                placeholder="🔍  Search circulars by ID, title or regulator…" autocomplete="off"/>
              <div class="ov-dropdown" id="ov-dropdown" style="display:none;"></div>
            </div>
            <button class="ov-confirm-btn" id="ov-confirm-btn" disabled>Pull Details →</button>
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
            <button class="ov-confirm-btn" id="ov-confirm-new-btn" disabled>Extract Details →</button>
          </div>
        </div>

      </div>
    </div>

    <!-- CARD 2: CIRCULAR DETAILS (revealed after confirm) -->
    <div id="ov-details-wrap" class="ov-reveal-wrap" style="display:none;">
      <div class="sh-card" id="ov-card2">
        <div class="sh-card-head">
  <div class="sh-dot done" id="ov-s2">✓</div>
  <div style="flex:1;min-width:0;">
    <div class="sh-card-title" id="ov-details-heading">Circular Overview</div>
    <div class="sh-card-sub" id="ov-details-sub">Key information about this circular</div>
  </div>
  <div class="ov-details-actions" id="ov-details-actions" style="display:none;">
   
  
    <!-- APPLICABILITY BADGE -->
    <button class="ov-saved-toggle"
     id="ov-saved-toggle" data-saved="false">
  🔖 Save
</button>
    <div class="ov-applic-badge" id="ov-applic-badge" style="display:none;" title="Click to view Applicability">
      <span id="ov-applic-icon">—</span>
      <span id="ov-applic-label">Applicability</span>
    </div>
    <!-- 3-DOTS -->
    <div class="ov-dots-wrap" id="ov-dots-wrap" style="display:none;">
      <button class="ov-dots-btn" id="ov-dots-btn">⋮</button>
      <div class="ov-dots-menu" id="ov-dots-menu" style="display:none;">
        <div class="ov-dots-item" id="ov-mi-edit">✏️&nbsp; Edit</div>
        <div class="ov-dots-item" id="ov-mi-history">🕓&nbsp; History</div>
        <div class="ov-dots-item" id="ov-mi-upload">📁&nbsp; Upload</div>
        <div class="ov-dots-item" id="ov-mi-regen">↺&nbsp; Regenerate</div>
        <div class="ov-dots-item" id="ov-mi-execsummary">📝&nbsp; Executive Summary</div>
      </div>
    </div>
  </div>
</div>
        <div class="sh-card-body" id="ov-details-body"></div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="ov-footer ov-reveal-wrap" id="ov-footer" style="display:none;">
     
      <button class="ov-next-btn" id="ov-btn-next">Generate Clause →</button>
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
      const aiScore = Force_Fail ? 0.3 : 0.8; // replace with real score

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
      this.style.color = "Yellow"
      this.disabled = false;
      showToast('AI extraction complete.', 'success');

    }, 1600);
  });

  /* ── NEXT → APPLICABILITY ── */
document.getElementById('ov-btn-next')?.addEventListener('click', () => {
    const clauseTab = document.querySelector('[data-tab="clause"]');
    if (clauseTab) {
      clauseTab.click();
    } else {
      /* tab bar not in DOM — navigate directly */
      document.querySelectorAll('.ai-tab').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.ai-panel').forEach(x => x.classList.remove('active'));
      const panel = document.getElementById('panel-clause');
      if (panel) {
        panel.classList.add('active');
        sessionStorage.setItem('cms_active_tab', 'clause');
        _renderPanel('clause');
      }
    }
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
 /* ── 3-DOTS MENU — event delegation so elements don't need to exist yet ── */
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('ov-dots-menu');
    const btn  = document.getElementById('ov-dots-btn');

    /* toggle menu on dots button click */
    if (e.target === btn || btn?.contains(e.target)) {
      e.stopPropagation();
      if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      return;
    }

    /* close menu on outside click */
    if (menu && !menu.contains(e.target)) {
      menu.style.display = 'none';
    }

    /* EDIT */
    if (e.target.id === 'ov-mi-edit' || e.target.closest('#ov-mi-edit')) {
      if (menu) menu.style.display = 'none';
      const circId = AI_LIFECYCLE_STATE.selectedCircularId;
      const circ   = circId ? (CMS_DATA?.circulars || []).find(c => c.id === circId) : null;
      if (!circ) { showToast('No circular selected.', 'warning'); return; }
      _ovOpenEditModal(circ);
    }

    /* HISTORY */
    if (e.target.id === 'ov-mi-history' || e.target.closest('#ov-mi-history')) {
      if (menu) menu.style.display = 'none';
      _ovOpenHistoryModal();
    }

    /* UPLOAD */
    if (e.target.id === 'ov-mi-upload' || e.target.closest('#ov-mi-upload')) {
      if (menu) menu.style.display = 'none';
      const newBtn = document.querySelector('.ov-mode-btn[data-mode="new"]');
      if (newBtn) newBtn.click();
      document.getElementById('ov-card1')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => document.getElementById('ov-file-input')?.click(), 400);
    }

    /* REGENERATE */
    if (e.target.id === 'ov-mi-regen' || e.target.closest('#ov-mi-regen')) {
      if (menu) menu.style.display = 'none';
      const circId = AI_LIFECYCLE_STATE.selectedCircularId;
      const circ   = circId ? (CMS_DATA?.circulars || []).find(c => c.id === circId) : null;
      if (!circ) { showToast('No circular selected.', 'warning'); return; }
      const body = document.getElementById('ov-details-body');
      if (body) {
        body.style.opacity = '0.4';
        body.innerHTML = `<div class="ai-loading"><div class="spinner"></div><div class="ai-loading-text">Regenerating overview…</div></div>`;
      }
      setTimeout(() => {
        _ovRenderDetails(circ, 'existing');
        if (body) body.style.opacity = '1';
        showToast('Overview regenerated.', 'success');
      }, 900);
    }

    /* EXECUTIVE SUMMARY */
    if (e.target.id === 'ov-mi-execsummary' || e.target.closest('#ov-mi-execsummary')) {
      if (menu) menu.style.display = 'none';
      const circId = AI_LIFECYCLE_STATE.selectedCircularId;
      const circ   = circId ? (CMS_DATA?.circulars || []).find(c => c.id === circId) : null;
      if (!circ) { showToast('Please select a circular first.', 'warning'); return; }
      _ovOpenExecSummaryPopup(circ);
    }
  });

  document.getElementById('ov-saved-toggle')?.addEventListener('click', function () {
  const saved = this.dataset.saved === 'true';
  this.dataset.saved = (!saved).toString();
  this.innerHTML = saved ? '🔖 Save' : '✓ Saved';
  this.style.background    = saved ? '' : '#dcfce7';
  this.style.borderColor   = saved ? '' : '#86efac';
  this.style.color         = saved ? '' : '#15803d';
  showToast(saved ? 'Removed from library.' : '✓ Saved to library.', saved ? 'warning' : 'success');
});
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

  /* set heading to circular name */
  if (heading) heading.textContent = circ.title;
  if (sub) sub.textContent = 'Key information about this circular';

  /* show 3-dots and applicability badge */
  const dotsWrap = document.getElementById('ov-dots-wrap');
  if (dotsWrap) dotsWrap.style.display = 'block';

  /* update applicability badge */
  _ovUpdateApplicBadge(circ);

  const hero = `
    <div class="ov-hero">
      
      ${circ.deadline ? `
      <div class="ov-deadline-box">
        <div class="ov-dl-label">Compliance Deadline</div>
        <div class="ov-dl-date">${circ.deadline}</div>
      </div>` : ''}
    </div>`;

  const summary = circ.summary || circ.description || circ.overview || '';
  const summaryBlock = summary ? `
    <div class="ov-summary-block">
      <div class="ov-sb-head">Summary</div>
      <div class="ov-sb-text">${summary}</div>
    </div>` : '';

  const docUrl = circ.docUrl || '#';
  const grid = `
    <div class="ov-detail-grid-2r5c">
      ${[
        ['Reference No.', circ.refNo || circ.referenceNo || circ.id],
        ['View Doc',      docUrl !== '#'
          ? `<a href="${docUrl}" target="_blank" class="ov-view-doc-link">📄 Open</a>`
          : `<span class="ov-no-doc">—</span>`],
           ['Type',          circ.type || '—'],
        ['Issue Date',    circ.issuedDate || circ.date || '—'],
        ['Effective Date',circ.effectiveDate || '—'],
         ['Due Date',      circ.dueDate || '—'],
        ['Regulator',     circ.regulator || '—'],
        ['Department',    circ.departments || '—'],
        ['Status',        circ.status || '—'],
        ['Risk',          circ.risk || '—'],
       
       
      ].map(([l, v]) => `
        <div class="ov-detail-cell">
          <div class="ov-dc-label">${l}</div>
          <div class="ov-dc-val">${v}</div>
        </div>`).join('')}
    </div>`;

  body.innerHTML = hero + summaryBlock + grid;
  /* update applicability badge */
  _ovUpdateApplicBadge(circ);


/* ── EXECUTIVE SUMMARY POPUP ── */

}

function _ovOpenExecSummaryPopup(circ) {
  document.querySelector('.ov-execsum-popup-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'ov-applic-popup-overlay ov-execsum-popup-overlay';
  overlay.innerHTML = `
    <div class="ov-applic-popup">
      <div class="ov-applic-popup-head">
        <button class="ov-applic-popup-back" onclick="this.closest('.ov-execsum-popup-overlay').remove()">←</button>
        <div>
          <div class="ov-applic-popup-title">Executive Summary</div>
          <div class="ov-applic-popup-sub" style="display:flex;align-items:center;gap:6px;">
            <span id="ov-execsum-circ-label">${circ.id} — ${circ.title}</span>
            <button onclick="_ovOpenCircularSwitcher('execsum',this)" style="background:none;border:none;cursor:pointer;font-size:11px;color:#9499aa;padding:0;line-height:1;" title="Change circular">✏️</button>
          </div>
        </div>
        <div style= "
    justify-items: end;
    margin-left: auto;
    display: flex;
    gap: 5px;
">
        <button class="ov-popup-save-btn" id="ov-execsum-save-btn">🔖 Save to My Library</button>
        <div class="ov-dots-wrap">
          <button class="ov-dots-btn" id="ov-execsum-dots-btn">⋮</button>
          <div class="ov-dots-menu" id="ov-execsum-dots-menu" style="display:none;">
            <div class="ov-dots-item" id="ov-execsum-mi-regen">↺&nbsp; Regenerate</div>
            <div class="ov-dots-item" id="ov-execsum-mi-depth">📊&nbsp; Summary Depth</div>
            <div class="ov-dots-item" id="ov-execsum-mi-audience">👥&nbsp; Target Audience</div>
            <div class="ov-dots-item" id="ov-execsum-mi-print">🖨&nbsp; Print</div>
          </div>
        </div>
        <button class="ov-applic-popup-close" onclick="this.closest('.ov-execsum-popup-overlay').remove()">✕</button>
        </div>
       
      </div>
      <div class="ov-applic-popup-body" id="ov-execsum-popup-body">
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('ov-execsum-save-btn')?.addEventListener('click', function() {
    this.innerHTML = '✓ Saved';
    this.disabled  = true;
    this.style.background  = '#f0fdf4';
    this.style.borderColor = '#86efac';
    this.style.color       = '#16a34a';
    showToast('✓ Summary saved to your library.', 'success');
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  /* wire exec summary dots */
  document.getElementById('ov-execsum-dots-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const m = document.getElementById('ov-execsum-dots-menu');
    if (m) m.style.display = m.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', function _closeExecDots(e) {
    if (!e.target.closest('#ov-execsum-dots-btn') && !e.target.closest('#ov-execsum-dots-menu')) {
      const m = document.getElementById('ov-execsum-dots-menu');
      if (m) m.style.display = 'none';
    }
  });

  document.getElementById('ov-execsum-mi-regen')?.addEventListener('click', () => {
    document.getElementById('ov-execsum-dots-menu').style.display = 'none';
    const pb = document.getElementById('ov-execsum-popup-body');
    if (pb) { pb.style.opacity = '0.4'; }
    setTimeout(() => {
      const pb2 = document.getElementById('ov-execsum-popup-body');
      if (pb2) {
        pb2.innerHTML = typeof buildSummaryPanel === 'function' ? buildSummaryPanel() : '';
        pb2.style.opacity = '1';
        if (typeof initSummaryListeners === 'function') initSummaryListeners();
      }
      showToast('Summary regenerated.', 'success');
    }, 800);
  });

  document.getElementById('ov-execsum-mi-depth')?.addEventListener('click', () => {
    document.getElementById('ov-execsum-dots-menu').style.display = 'none';
    _ovShowDepthModal();
  });

  document.getElementById('ov-execsum-mi-audience')?.addEventListener('click', () => {
    document.getElementById('ov-execsum-dots-menu').style.display = 'none';
    _ovShowAudienceModal();
  });

  document.getElementById('ov-execsum-mi-print')?.addEventListener('click', () => {
    document.getElementById('ov-execsum-dots-menu').style.display = 'none';
    window.print();
  });

  /* immediately render summary */
  const popBody = document.getElementById('ov-execsum-popup-body');
  if (popBody) {
    popBody.innerHTML = typeof buildSummaryPanel === 'function'
      ? buildSummaryPanel({ popupMode: true })
      : '<div style="padding:16px;color:#9499aa;font-size:13px;">Not available.</div>';
    if (typeof initSummaryListeners === 'function') setTimeout(() => initSummaryListeners({ popupMode: true }), 50);
  }
}

function _ovShowDepthModal() {
  const existing = document.getElementById('ov-depth-modal');
  if (existing) { existing.remove(); return; }
  const el = document.createElement('div');
  el.id = 'ov-depth-modal';
  el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:1.5px solid #dde0e6;border-radius:12px;padding:20px;width:280px;z-index:10001;box-shadow:0 12px 32px rgba(26,26,46,0.16);';
  el.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:12px;">Summary Depth</div>
    ${['Brief — 1 paragraph','Standard — 3–5 paragraphs','Detailed — Full breakdown'].map((opt,i) => `
      <label style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;color:#4a5068;transition:background 0.1s;" onmouseover="this.style.background='#f5f6f8'" onmouseout="this.style.background=''">
        <input type="radio" name="ov-depth" value="${i}" ${i===1?'checked':''} style="accent-color:#1a1a2e;"/>
        ${opt}
      </label>`).join('')}
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
      <button onclick="document.getElementById('ov-depth-modal').remove()" style="padding:6px 14px;background:#f5f6f8;border:1px solid #dde0e6;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Cancel</button>
      <button onclick="document.getElementById('ov-depth-modal').remove();showToast('Depth updated.','success');" style="padding:6px 14px;background:#1a1a2e;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Apply</button>
    </div>`;
  document.body.appendChild(el);
}

function _ovShowAudienceModal() {
  const existing = document.getElementById('ov-audience-modal');
  if (existing) { existing.remove(); return; }
  const el = document.createElement('div');
  el.id = 'ov-audience-modal';
  el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:1.5px solid #dde0e6;border-radius:12px;padding:20px;width:280px;z-index:10001;box-shadow:0 12px 32px rgba(26,26,46,0.16);';
  el.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:12px;">Target Audience</div>
    ${['Legal & Compliance','Risk Management','Board / CXO','Operations Team'].map((opt,i) => `
      <label style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;color:#4a5068;transition:background 0.1s;" onmouseover="this.style.background='#f5f6f8'" onmouseout="this.style.background=''">
        <input type="radio" name="ov-audience" value="${i}" ${i===0?'checked':''} style="accent-color:#1a1a2e;"/>
        ${opt}
      </label>`).join('')}
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
      <button onclick="document.getElementById('ov-audience-modal').remove()" style="padding:6px 14px;background:#f5f6f8;border:1px solid #dde0e6;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Cancel</button>
      <button onclick="document.getElementById('ov-audience-modal').remove();showToast('Audience updated.','success');" style="padding:6px 14px;background:#1a1a2e;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Apply</button>
    </div>`;
  document.body.appendChild(el);
}




/* ── EDIT MODAL ── */
function _ovOpenEditModal(circ) {
  document.querySelector('.ov-edit-modal-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'ov-applic-popup-overlay ov-edit-modal-overlay';
  overlay.innerHTML = `
    <div class="ov-applic-popup" style="max-width:560px;">
      <div class="ov-applic-popup-head">
        <button class="ov-applic-popup-back" onclick="this.closest('.ov-edit-modal-overlay').remove()">←</button>
        <div>
          <div class="ov-applic-popup-title">Edit Circular Details</div>
          <div class="ov-applic-popup-sub">${circ.id} — ${circ.title}</div>
        </div>
        <button class="ov-applic-popup-close" onclick="this.closest('.ov-edit-modal-overlay').remove()">✕</button>
      </div>
      <div class="ov-applic-popup-body">
        <div class="ov-edit-form">
          ${[
            ['Title',          'title',         circ.title           || ''],
            ['Regulator',      'regulator',     circ.regulator       || ''],
            ['Type',           'type',          circ.type            || ''],
            ['Status',         'status',        circ.status          || ''],
            ['Risk',           'risk',          circ.risk            || ''],
            ['Issue Date',     'issuedDate',    circ.issuedDate      || circ.date || ''],
            ['Effective Date', 'effectiveDate', circ.effectiveDate   || ''],
            ['Deadline',       'deadline',      circ.deadline        || ''],
            ['Department',     'departments',   circ.departments     || ''],
            ['Reference No.',  'refNo',         circ.refNo || circ.referenceNo || circ.id],
          ].map(([label, field, val]) => `
            <div class="ov-edit-field">
              <label class="ov-dc-label">${label}</label>
              <input class="ov-edit-input" data-field="${field}" value="${val}" />
            </div>`).join('')}
          <div class="ov-edit-field" style="grid-column:1/-1;">
            <label class="ov-dc-label">Summary</label>
            <textarea class="ov-edit-textarea" data-field="summary">${circ.summary || circ.description || ''}</textarea>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
          <button class="ov-action-btn" onclick="this.closest('.ov-edit-modal-overlay').remove()">Cancel</button>
          <button class="ov-action-btn ov-action-btn-primary" onclick="_ovSaveEdit(this)">✓ Save Changes</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

window._ovSaveEdit = function(btn) {
  const overlay = btn.closest('.ov-edit-modal-overlay');
  const circId  = AI_LIFECYCLE_STATE.selectedCircularId;
  const circ    = circId ? (CMS_DATA?.circulars || []).find(c => c.id === circId) : null;
  if (!circ) return;

  /* push snapshot to history before saving */
  if (!window._OV_HISTORY) window._OV_HISTORY = [];
  window._OV_HISTORY.push({ ts: new Date(), snapshot: { ...circ } });

  /* apply edits */
  overlay.querySelectorAll('[data-field]').forEach(el => {
    circ[el.dataset.field] = el.value ?? el.textContent;
  });

  overlay.remove();
  /* re-render with updated data */
  _ovRenderDetails(circ, 'existing');
  showToast('✓ Changes saved.', 'success');
};

/* ── HISTORY MODAL ── */
function _ovOpenHistoryModal() {
  document.querySelector('.ov-history-modal-overlay')?.remove();
  const history = window._OV_HISTORY || [];
  const overlay = document.createElement('div');
  overlay.className = 'ov-applic-popup-overlay ov-history-modal-overlay';
  overlay.innerHTML = `
    <div class="ov-applic-popup" style="max-width:520px;">
      <div class="ov-applic-popup-head">
        <button class="ov-applic-popup-back" onclick="this.closest('.ov-history-modal-overlay').remove()">←</button>
        <div>
          <div class="ov-applic-popup-title">🕓 Edit History</div>
          <div class="ov-applic-popup-sub">All saved versions of this circular's details</div>
        </div>
        <button class="ov-applic-popup-close" onclick="this.closest('.ov-history-modal-overlay').remove()">✕</button>
      </div>
      <div class="ov-applic-popup-body">
        ${!history.length ? `
          <div style="text-align:center;padding:40px 20px;color:#9499aa;font-size:13px;background:#f5f6f8;border-radius:8px;border:1px dashed #dde0e6;">
            No edits recorded yet. Use Edit to make changes — they'll appear here.
          </div>` :
          [...history].reverse().map((v, i) => {
            const ts  = v.ts instanceof Date ? v.ts : new Date(v.ts);
            const num = history.length - i;
            const timeStr = ts.toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' });
            return `
            <div class="ov-hist-entry">
              <div class="ov-hist-meta">
                <span class="ov-hist-num">v${num}</span>
                <span class="ov-hist-ts">${timeStr}</span>
                <span class="ov-hist-badge">Manual Edit</span>
              </div>
              <div class="ov-hist-title">${v.snapshot.title || '—'}</div>
              <button class="ov-hist-restore" onclick="_ovRestoreVersion(${history.length - 1 - i})">↩ Restore</button>
            </div>`;
          }).join('')
        }
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

window._ovRestoreVersion = function(idx) {
  const v = (window._OV_HISTORY || [])[idx];
  if (!v) return;
  const circId = AI_LIFECYCLE_STATE.selectedCircularId;
  const circ   = circId ? (CMS_DATA?.circulars || []).find(c => c.id === circId) : null;
  if (!circ) return;
  Object.assign(circ, v.snapshot);
  document.querySelector('.ov-history-modal-overlay')?.remove();
  _ovRenderDetails(circ, 'existing');
  showToast(`✓ Restored to v${idx + 1}.`, 'success');
};




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



function _ovUpdateApplicBadge(circ) {
  const badge = document.getElementById('ov-applic-badge');
  const icon = document.getElementById('ov-applic-icon');
  const label = document.getElementById('ov-applic-label');
  if (!badge || !icon || !label) return;

  /* Compute verdict the same way the popup does */
  const et     = (typeof ORG_PROFILE !== 'undefined' ? ORG_PROFILE.entityType : '') || 'NBFC';
  const params = typeof _appDeriveParams === 'function' ? _appDeriveParams(et, circ) : [];
  const yesC   = params.filter(p => p.status === 'yes').length;
  const partC  = params.filter(p => p.status === 'partial').length;
  const noC    = params.filter(p => p.status === 'no').length;

  let vClass = 'ov-applic-yes', vIcon = '✓', vLabel = 'Applicable ⓘ';
  if (params.length && noC >= params.length / 2) {
    vClass = 'ov-applic-no';    vIcon = '✗';  vLabel = 'Not Applicable ⓘ';
  } else if (params.length && partC >= 2) {
    vClass = 'ov-applic-partial'; vIcon = '⚠'; vLabel = 'Partially Applicable ⓘ';
  }

  badge.className   = 'ov-applic-badge ' + vClass;
  icon.textContent  = vIcon;
  label.textContent = vLabel;
  badge.style.display = 'inline-flex';

  badge.onclick = () => _ovOpenApplicabilityPopup(circ);
}

function _ovOpenApplicabilityPopup(circ) {
  document.querySelector('.ov-applic-popup-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'ov-applic-popup-overlay';
  overlay.innerHTML = `
    <div class="ov-applic-popup">

      <!-- HEADER -->
      <div class="ov-applic-popup-head">
        <button class="ov-applic-popup-back" onclick="this.closest('.ov-applic-popup-overlay').remove()">←</button>
        <div style="flex:1;min-width:0;">
          <div class="ov-applic-popup-title">Applicability Analysis</div>
          <div class="ov-applic-popup-sub" style="display:flex;align-items:center;gap:6px;">
            <span id="ov-applic-circ-label">${circ.id} — ${circ.title}</span>
            <button onclick="_ovOpenCircularSwitcher('applic',this)" style="background:none;border:none;cursor:pointer;font-size:11px;color:#9499aa;padding:0;line-height:1;" title="Change circular">✏️</button>
          </div>
        </div>
        <button class="ov-popup-save-btn" id="ov-popup-save-btn">🔖 Save to My Library</button>
        <button class="ov-applic-popup-close" onclick="this.closest('.ov-applic-popup-overlay').remove()">✕</button>
      </div>

      <!-- BODY -->
      <div class="ov-applic-popup-body" id="ov-applic-popup-body">
        <div class="ai-loading"><div class="spinner"></div><div class="ai-loading-text">Analysing applicability…</div></div>
      </div>

    </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  /* Save button */
  document.getElementById('ov-popup-save-btn')?.addEventListener('click', function() {
    this.innerHTML = '✓ Saved';
    this.disabled  = true;
    this.style.background   = '#f0fdf4';
    this.style.borderColor  = '#86efac';
    this.style.color        = '#16a34a';
    showToast('✓ Analysis saved to your library.', 'success');
  });

  setTimeout(() => {
    const popBody = document.getElementById('ov-applic-popup-body');
    if (!popBody) return;

    /* inject CSS */
    injectAppCSS();

    AI_LIFECYCLE_STATE.selectedCircularId = circ.id;

    const et       = (typeof ORG_PROFILE !== 'undefined' ? ORG_PROFILE.entityType : '') || 'NBFC';
    const params   = _appDeriveParams(et, circ);
    const entities = _appDeriveEntities(et, circ);

    window._APP_ENT_DATA   = entities.map(e => ({ ...e }));
    window._APP_PARAM_DATA = params.map(p => ({ ...p }));
    _APP_HISTORY.entities  = [];
    _APP_HISTORY.params    = [];

    const yesC  = params.filter(p => p.status === 'yes').length;
    const partC = params.filter(p => p.status === 'partial').length;
    const noC   = params.filter(p => p.status === 'no').length;
    const naC   = params.filter(p => p.status === 'na').length;

    /* verdict */
    let vClass = 'app-v-yes', vLabel = 'Applicable', vIcon = '✅';
    let vReason = `This circular is <strong>directly applicable</strong> to your organisation. ${yesC} of ${params.length} parameters match your entity profile (${et}).`;
    if (noC >= params.length / 2) {
      vClass  = 'app-v-no';
      vLabel  = 'Not Applicable';
      vIcon   = '🚫';
      vReason = `This circular is <strong>not applicable</strong> to your organisation. The regulatory scope does not match your entity profile.`;
    } else if (partC >= 2) {
      vClass  = 'app-v-partial';
      vLabel  = 'Partially Applicable';
      vIcon   = '⚠️';
      vReason = `This circular is <strong>partially applicable</strong>. ${partC} parameter${partC > 1 ? 's' : ''} require further legal review.`;
    }

    /* Sync the badge label/style to the popup's verdict without changing onclick */
    const _badge = document.getElementById('ov-applic-badge');
    const _icon  = document.getElementById('ov-applic-icon');
    const _lbl   = document.getElementById('ov-applic-label');
    if (_badge && _icon && _lbl) {
      if (vClass === 'app-v-yes') {
        _badge.className = 'ov-applic-badge ov-applic-yes';
        _icon.textContent = '✓';
        _lbl.textContent  = 'Applicable ⓘ';
      } else if (vClass === 'app-v-no') {
        _badge.className = 'ov-applic-badge ov-applic-no';
        _icon.textContent = '✗';
        _lbl.textContent  = 'Not Applicable ⓘ';
      } else {
        _badge.className = 'ov-applic-badge ov-applic-partial';
        _icon.textContent = '⚠';
        _lbl.textContent  = 'Partially Applicable ⓘ';
      }
    }

    popBody.innerHTML = `
    <div class="app-results">

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
              <button class="app-dots-btn" id="ov-ent-dots-btn">⋮</button>
              <div class="app-dots-menu" id="ov-ent-dots-menu" style="display:none;">
                <div class="app-dots-item" id="ov-ent-edit">✏️&nbsp; Edit</div>
                <div class="app-dots-item" id="ov-ent-history">🕑&nbsp; History</div>
                <div class="app-dots-item" id="ov-ent-regen">✦&nbsp; Regen with AI Context</div>
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
              ${noC   > 0 ? `<span class="app-pill app-pill-no">${noC} Not Met</span>`     : ''}
              ${naC   > 0 ? `<span class="app-pill app-pill-na">${naC} N/A</span>`         : ''}
            </div>
            <div class="app-dots-wrap">
              <button class="app-dots-btn" id="ov-param-dots-btn">⋮</button>
              <div class="app-dots-menu" id="ov-param-dots-menu" style="display:none;">
                <div class="app-dots-item" id="ov-param-edit">✏️&nbsp; Edit</div>
                <div class="app-dots-item" id="ov-param-history">🕑&nbsp; History</div>
                <div class="app-dots-item" id="ov-param-regen">✦&nbsp; Regen with AI Context</div>
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
        <div class="app-edit-bar" id="app-param-edit-bar" style="display:none;">
          <span class="app-edit-bar-info">✎ Edit mode — click cells to edit values</span>
          <button class="app-edit-bar-cancel" onclick="_appCancelParamEdit()">Cancel</button>
          <button class="app-edit-bar-save"   onclick="_appSaveParamEdit()">Save Changes</button>
        </div>
      </div>

    </div>`;

    /* wire dots with event delegation AFTER innerHTML is set */
    _ovWireApplicPopupDots();

  }, 600);
}

/* ── wire dots inside applicability popup ── */
function _ovWireApplicPopupDots() {

  /* ENTITIES dots */
  document.getElementById('ov-ent-dots-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('ov-ent-dots-menu');
    const pm   = document.getElementById('ov-param-dots-menu');
    if (pm) pm.style.display = 'none';
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('ov-ent-edit')?.addEventListener('click', () => {
    document.getElementById('ov-ent-dots-menu').style.display = 'none';
    _appToggleEntityEdit();
  });
  document.getElementById('ov-ent-history')?.addEventListener('click', () => {
    document.getElementById('ov-ent-dots-menu').style.display = 'none';
    _appOpenVerModal('entities');
  });
  document.getElementById('ov-ent-regen')?.addEventListener('click', () => {
    document.getElementById('ov-ent-dots-menu').style.display = 'none';
    _appOpenCtxModal();
  });

  /* PARAMS dots */
  document.getElementById('ov-param-dots-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('ov-param-dots-menu');
    const em   = document.getElementById('ov-ent-dots-menu');
    if (em) em.style.display = 'none';
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('ov-param-edit')?.addEventListener('click', () => {
    document.getElementById('ov-param-dots-menu').style.display = 'none';
    _appToggleParamEdit();
  });
  document.getElementById('ov-param-history')?.addEventListener('click', () => {
    document.getElementById('ov-param-dots-menu').style.display = 'none';
    _appOpenVerModal('params');
  });
  document.getElementById('ov-param-regen')?.addEventListener('click', () => {
    document.getElementById('ov-param-dots-menu').style.display = 'none';
    _appOpenCtxModal();
  });

  /* close both menus on outside click */
  document.addEventListener('click', function _closePopupDots(e) {
    if (!e.target.closest('.app-dots-wrap')) {
      document.getElementById('ov-ent-dots-menu')?.style && (document.getElementById('ov-ent-dots-menu').style.display = 'none');
      document.getElementById('ov-param-dots-menu')?.style && (document.getElementById('ov-param-dots-menu').style.display = 'none');
    }
  });
}


function _ovOpenCircularSwitcher(context, triggerEl) {
  document.querySelector('.ov-switcher-popup')?.remove();
  const popup = document.createElement('div');
  popup.className = 'ov-switcher-popup';
  popup.innerHTML = `
    <div class="ov-switcher-inner">
      <div class="ov-switcher-title">Switch Circular</div>
      <div class="ov-search-wrap" style="min-width:0;flex:1;">
        <span class="ov-search-icon">⌕</span>
        <input class="ov-search-input" id="ov-switcher-input" type="text"
          placeholder="Search by ID or title…" autocomplete="off" style="font-size:12px;"/>
        <div class="ov-dropdown" id="ov-switcher-dropdown" style="display:none;"></div>
      </div>
    </div>`;
  document.body.appendChild(popup);

  /* position anchored to trigger button */
  if (triggerEl) {
    const r = triggerEl.getBoundingClientRect();
    popup.style.top  = (r.bottom + 6) + 'px';
    popup.style.left = Math.max(8, r.left - 260) + 'px';
  }

  const inp = document.getElementById('ov-switcher-input');
  const dd  = document.getElementById('ov-switcher-dropdown');
  inp?.focus();

  inp?.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    if (!q) { dd.style.display = 'none'; return; }
    const matches = (CMS_DATA?.circulars || []).filter(c =>
      c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    ).slice(0, 6);
    if (!matches.length) { dd.style.display = 'none'; return; }
    dd.innerHTML = matches.map(c => `
      <div class="ov-dd-item" data-id="${c.id}">
        <div class="ov-dd-meta"><span class="ov-dd-id">${c.id}</span><span class="ov-dd-reg">${c.regulator||''}</span></div>
        <div class="ov-dd-title">${c.title}</div>
      </div>`).join('');
    dd.style.display = 'block';
    dd.querySelectorAll('.ov-dd-item').forEach(item => {
      item.addEventListener('click', () => {
        const circ = CMS_DATA.circulars.find(c => c.id === item.dataset.id);
        if (!circ) return;
        AI_LIFECYCLE_STATE.selectedCircularId = circ.id;
        if (context === 'applic') {
          document.getElementById('ov-applic-circ-label').textContent = `${circ.id} — ${circ.title}`;
          _ovOpenApplicabilityPopup(circ);
        } else {
          document.getElementById('ov-execsum-circ-label').textContent = `${circ.id} — ${circ.title}`;
          _ovOpenExecSummaryPopup(circ);
        }
        popup.remove();
      });
    });
  });

  document.addEventListener('click', function _sw(e) {
    if (!popup.contains(e.target)) { popup.remove(); document.removeEventListener('click', _sw); }
  }, true);
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
  #ov-card1               { overflow:visible !important; position:relative; margin-bottom:}


.ov-saved-toggle { padding:4px 10px;background:#fff;border:1.5px solid #dde0e6;border-radius:8px;
  font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#4a5068;
  cursor:pointer;transition:all 0.14s;
  }

.ov-saved-toggle:hover { border-color:#86efac;color:#15803d; }


  /* ── 2-ROW 5-COL GRID ── */
  .ov-detail-grid-2r5c { display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:#dde0e6;border-radius:8px;overflow:hidden;margin-bottom:12px; }

  /* ── 3-DOTS ── */
  .ov-dots-wrap { position:relative;flex-shrink:0; }
  .ov-dots-btn  { width:30px;height:30px;border:1px solid #dde0e6;border-radius:6px;
    background:#fff;font-size:20px;line-height:1;cursor:pointer;color:#4a5068;
    display:flex;align-items:center;justify-content:center;transition:all 0.13s; }
  .ov-dots-btn:hover { background:#f5f6f8;border-color:#9499aa;color:#1a1a2e; }
  .ov-dots-menu { position:absolute;top:calc(100% + 5px);right:0;background:#fff;
    border:1.5px solid #dde0e6;border-radius:10px;min-width:180px;z-index:9999;
    box-shadow:0 8px 24px rgba(26,26,46,0.12);overflow:hidden; }
  .ov-dots-item { padding:9px 14px;font-size:12px;font-weight:600;color:#4a5068;
    cursor:pointer;transition:background 0.1s;display:flex;align-items:center;gap:8px; }
  .ov-dots-item:hover { background:#f5f6f8;color:#1a1a2e; }
  .ov-dots-item + .ov-dots-item { border-top:1px solid #f0f1f4; }


  /* ── EDIT MODAL ── */
  .ov-edit-form { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
  .ov-edit-field { display:flex;flex-direction:column;gap:4px; }
  .ov-edit-input { padding:8px 10px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:7px;
    font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;outline:none;transition:border-color 0.13s; }
  .ov-edit-input:focus { border-color:#1a1a2e;background:#fff; }
  .ov-edit-textarea { padding:8px 10px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:7px;
    font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;outline:none;min-height:80px;
    resize:vertical;transition:border-color 0.13s; }
  .ov-edit-textarea:focus { border-color:#1a1a2e;background:#fff; }

  /* ── HISTORY MODAL ── */
  .ov-hist-entry { background:#f5f6f8;border:1px solid #dde0e6;border-radius:8px;
    padding:12px 14px;display:flex;flex-direction:column;gap:6px;margin-bottom:8px; }
  .ov-hist-meta  { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
  .ov-hist-num   { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;
    background:#1a1a2e;color:#fff;padding:1px 7px;border-radius:4px; }
  .ov-hist-ts    { font-size:11px;color:#9499aa; }
  .ov-hist-badge { font-size:10px;font-weight:700;padding:2px 8px;background:#eff6ff;
    border:1px solid #bfdbfe;color:#2563eb;border-radius:20px; }
  .ov-hist-title { font-size:12px;font-weight:600;color:#1a1a2e; }
  .ov-hist-restore { align-self:flex-start;padding:4px 12px;background:#fff;
    border:1.5px solid #dde0e6;border-radius:6px;font-size:11px;font-weight:600;
    color:#4a5068;cursor:pointer;transition:all 0.12s; }
  .ov-hist-restore:hover { background:#1a1a2e;color:#fff;border-color:#1a1a2e; }


  /* ── APPLICABILITY BADGE ── */
  .ov-applic-badge { display:none;align-items:center;gap:5px;padding:4px 11px;
    border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;
    border:1.5px solid;transition:all 0.14s;flex-shrink:0; }
  .ov-applic-yes { background:#dcfce7;border-color:#86efac;color:#15803d; }
  .ov-applic-yes:hover { background:#bbf7d0; }
  .ov-applic-no  { background:#fee2e2;border-color:#fca5a5;color:#b91c1c; }
  .ov-applic-no:hover  { background:#fecaca; }

  /* ── APPLICABILITY + EXEC SUMMARY POPUP ── */
  .ov-applic-popup-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.45);
    display:flex;align-items:center;justify-content:center;z-index:9998;padding:20px; }
  .ov-applic-popup { background:#fff;border-radius:16px;width:min(820px,95vw);
    max-height:88vh;display:flex;flex-direction:column;overflow:hidden;
    box-shadow:0 20px 48px rgba(26,26,46,0.18); }
  .ov-applic-popup-head { display:flex;align-items:center;gap:10px;
    padding:16px 20px;border-bottom:1px solid #dde0e6;flex-shrink:0; }
  .ov-applic-popup-back { width:30px;height:30px;border:1px solid #dde0e6;border-radius:6px;
    background:#fff;cursor:pointer;font-size:15px;color:#4a5068;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;transition:all 0.12s; }
  .ov-applic-popup-back:hover { background:#f5f6f8;color:#1a1a2e; }
  .ov-applic-popup-title { font-size:15px;font-weight:700;color:#1a1a2e; }
  .ov-applic-popup-sub   { font-size:11px;color:#9499aa;margin-top:2px; }
  .ov-applic-popup-close { width:28px;height:28px;border:1px solid #dde0e6;border-radius:6px;
    background:#fff;cursor:pointer;font-size:13px;color:#9499aa;margin-left:auto;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;transition:all 0.12s; }
  .ov-applic-popup-close:hover { background:#fee2e2;color:#b91c1c;border-color:#fca5a5; }
  .ov-applic-popup-body { flex:1;overflow-y:auto;padding:18px 20px; }

  /* ── VIEW DOC ── */
  .ov-view-doc-link { color:#2563eb;font-weight:600;text-decoration:none;font-size:12px; }
  .ov-view-doc-link:hover { text-decoration:underline; }
  .ov-no-doc { color:#9499aa;font-size:12px; }

/* ── 3-DOTS MENU ── */
.app-dots-wrap { position:relative;flex-shrink:0; }
.app-dots-btn  { width:30px;height:30px;border:1.5px solid #dde0e6;border-radius:6px;
  background:#fff;font-size:18px;line-height:1;cursor:pointer;color:#4a5068;
  display:flex;align-items:center;justify-content:center;transition:all 0.13s;
  font-family:'DM Sans',sans-serif; }
.app-dots-btn:hover { background:#f5f6f8;border-color:#9499aa;color:#1a1a2e; }
.app-dots-menu { position:absolute;top:calc(100% + 5px);right:0;background:#fff;
  border:1.5px solid #dde0e6;border-radius:10px;min-width:190px;z-index:9999;
  box-shadow:0 8px 24px rgba(26,26,46,0.12);overflow:hidden; }
.app-dots-item { padding:9px 14px;font-size:12px;font-weight:600;color:#4a5068;
  cursor:pointer;transition:background 0.1s;display:flex;align-items:center;gap:8px; }
.app-dots-item:hover { background:#f5f6f8;color:#1a1a2e; }
.app-dots-item + .app-dots-item { border-top:1px solid #f0f1f4; }
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


  /* ── POPUP SAVE BUTTON ── */
  .ov-popup-save-btn { padding:5px 12px;background:#fff;border:1.5px solid #86efac;
    border-radius:6px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;
    color:#16a34a;cursor:pointer;white-space:nowrap;transition:all 0.13s;flex-shrink:0; }
  .ov-popup-save-btn:hover { background:#f0fdf4; }
  .ov-popup-save-btn:disabled { opacity:0.7;cursor:default; }

  
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

  .ov-switcher-popup { position:fixed;background:#fff;border:1.5px solid #dde0e6;
    border-radius:12px;padding:14px;width:300px;z-index:10000;
    box-shadow:0 8px 28px rgba(26,26,46,0.16); }
  .ov-switcher-inner { display:flex;flex-direction:column;gap:8px; }
  .ov-switcher-title { font-size:11px;font-weight:700;color:#9499aa;text-transform:uppercase;
    letter-spacing:.06em;margin-bottom:2px; }

  `;
  document.head.appendChild(s);
}