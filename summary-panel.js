/**
 * summary-panel.js  —  Panel 2: Executive Summary
 * Accordion document view — board-ready, scannable, printable
 */

/* ================================================================ BUILD */
function buildSummaryPanel() {
  injectSharedCSS();
  injectSumCSS();
  return `
  <div class="sum-wrap">

    <!-- CIRCULAR SELECTOR -->
    <div class="sh-card" id="sum-circ-selector-card">
      <div class="sh-card-head">
        <div class="sh-dot" id="sum-sel-dot">1</div>
        <div style="flex:1;min-width:0;">
          <div class="sh-card-title">Select Circular</div>
          <div class="sh-card-sub">Search and confirm a circular to generate executive summary</div>
        </div>
      </div>
      <div class="sh-card-body" style="overflow:visible;">
        <div class="sum-sel-row">
          <div class="sum-sel-search-wrap">
            <span class="sum-sel-icon">⌕</span>
            <input class="sum-sel-input" id="sum-sel-input" type="text"
              placeholder="Search by ID, title, regulator…" autocomplete="off"/>
            <div class="sum-sel-dropdown" id="sum-sel-dropdown" style="display:none;"></div>
          </div>
          <button class="sum-sel-confirm-btn" id="sum-sel-confirm-btn" disabled>Confirm →</button>
        </div>
        <div class="sum-sel-confirmed" id="sum-sel-confirmed" style="display:none;">
          <div class="sum-sel-conf-left">
            <span class="sum-sel-conf-id" id="sum-sel-conf-id"></span>
            <span class="sum-sel-conf-sep">·</span>
            <span class="sum-sel-conf-name" id="sum-sel-conf-name"></span>
          </div>
          <button class="sum-sel-change-btn" id="sum-sel-change-btn">⇄ Change</button>
        </div>
      </div>
    </div>

    <!-- MAIN -->
    <div id="sum-main" style="display:none;">

      <!-- CONTROLS — one row -->
      <div class="sum-controls-bar" style="position:relative;">

        <div class="sum-ctrl-group">
          <label class="sum-ctrl-label">Target Audience</label>
          <select class="sum-ctrl-select" id="sum-audience">
            <option>Board / Executive Management</option>
            <option>Compliance Team</option>
            <option>Department Heads</option>
            <option>External Auditors</option>
          </select>
        </div>
        <div class="sum-ctrl-group">
          <label class="sum-ctrl-label">Summary Depth</label>
          <select class="sum-ctrl-select" id="sum-depth">
            <option value="brief">Brief — 1 page</option>
            <option value="standard" selected>Standard — 2–3 pages</option>
            <option value="detailed">Detailed — Full analysis</option>
          </select>
        </div>
        <button class="sum-ctrl-btn" id="btn-gen-summary">◈ &nbsp;Generate Executive Summary</button>
      </div>

      <!-- DOCUMENT OUTPUT -->
      <div id="sum-output"></div>


    </div>
  </div>`;
}

/* ================================================================ INIT */
function initSummaryListeners() {
  injectSharedCSS();
  injectSumCSS();

  const selInput    = document.getElementById('sum-sel-input');
  const selDropdown = document.getElementById('sum-sel-dropdown');
  const selConfirm  = document.getElementById('sum-sel-confirm-btn');
  const selConfirmed= document.getElementById('sum-sel-confirmed');
  const selChange   = document.getElementById('sum-sel-change-btn');
  const selDot      = document.getElementById('sum-sel-dot');
  const mainEl      = document.getElementById('sum-main');
  let _selCirc      = null;

  /* pre-fill if coming from overview */
  const preId = AI_LIFECYCLE_STATE.selectedCircularId;
  if (preId) {
    const preCirc = (CMS_DATA?.circulars || []).find(c => c.id === preId);
    if (preCirc) _sumConfirmCircular(preCirc);
  }

  /* search input */
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
        <div class="sum-sel-dd-item" data-id="${c.id}">
          <div class="sum-sel-dd-meta">
            <span class="sum-sel-dd-id">${c.id}</span>
            <span class="sum-sel-dd-reg">${c.regulator || ''}</span>
            ${c.risk ? `<span class="sum-sel-dd-risk sum-srisk-${c.risk.toLowerCase()}">${c.risk}</span>` : ''}
          </div>
          <div class="sum-sel-dd-title">${c.title}</div>
        </div>`).join('');
      selDropdown.style.display = 'block';
      selDropdown.querySelectorAll('.sum-sel-dd-item').forEach(item => {
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
    if (_selCirc) _sumConfirmCircular(_selCirc);
  });

  selChange?.addEventListener('click', () => {
    _selCirc = null;
    AI_LIFECYCLE_STATE.selectedCircularId = null;
    if (selInput)     selInput.value = '';
    if (selConfirm)   selConfirm.disabled = true;
    if (selConfirmed) selConfirmed.style.display = 'none';
    if (selInput)     selInput.closest('.sum-sel-row').style.display = 'flex';
    if (selDot)       { selDot.classList.remove('done'); selDot.textContent = '1'; }
    if (mainEl)       mainEl.style.display = 'none';
    const out = document.getElementById('sum-output');
    if (out) out.innerHTML = '';
  });

  function _sumConfirmCircular(circ) {
    _selCirc = circ;
    AI_LIFECYCLE_STATE.selectedCircularId = circ.id;
    if (selInput) selInput.closest('.sum-sel-row').style.display = 'none';
    document.getElementById('sum-sel-conf-id').textContent   = circ.id;
    document.getElementById('sum-sel-conf-name').textContent = circ.title;
    if (selConfirmed) selConfirmed.style.display = 'flex';
    if (selDot) { selDot.classList.add('done'); selDot.textContent = '✓'; }
    if (mainEl) {
      mainEl.style.display        = 'flex';
      mainEl.style.flexDirection  = 'column';
      mainEl.style.gap            = '10px';
    }
    _sumFillStrip(circ);

    /* wire generate button with confirmed circ */
    const genBtn = document.getElementById('btn-gen-summary');
    genBtn?.removeEventListener('click', genBtn._handler);
    genBtn._handler = () => {
      _sumRun(circ);
      genBtn.innerHTML = '◈ &nbsp;Regenerate Executive Summary';
    };
    genBtn?.addEventListener('click', genBtn._handler);
  }

  document.getElementById('sum-btn-save')?.addEventListener('click', function() {
    this.innerHTML = '✓ &nbsp;Saved';
    this.disabled  = true;
    this.style.opacity = '0.7';
    showToast('Summary saved to your library.', 'success');
  });

  document.getElementById('sum-btn-next')?.addEventListener('click', () => {
    document.querySelector('[data-tab="clause"]')?.click();
  });
}
/* ================================================================ GENERATE */
function _sumRun(circ) {
  const btn = document.getElementById('btn-gen-summary');
  const out = document.getElementById('sum-output');
  btn.disabled = true; btn.style.opacity = '0.65';
  out.innerHTML = `<div class="sum-loading">${loadingHTML('Building executive summary document…')}</div>`;

  setTimeout(() => {
    const data = CMS_DATA?.aiSummaryResults?.[circ.id]
              || CMS_DATA?.aiSummaryResults?.['default']
              || {};
    const org  = typeof ORG_PROFILE !== 'undefined' ? ORG_PROFILE : { entityType:'NBFC', name:'Your Organisation' };
    const aud  = document.getElementById('sum-audience')?.value || 'Board / Executive Management';
    const dep  = document.getElementById('sum-depth')?.value    || 'standard';
    const date = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});

    out.innerHTML = _sumBuildDoc(circ, data, org, aud, dep, date);
    _sumBindDocEvents(circ);

    const footer = document.getElementById('sum-footer');
    footer.style.display    = 'flex';
    footer.style.opacity    = '0';
    footer.style.transition = 'opacity 0.3s';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ footer.style.opacity='1'; }));

    btn.disabled = false; btn.style.opacity = '1';
btn.innerHTML = '◈ &nbsp;Regenerate Executive Summary';
  }, 1700);
}

/* ================================================================ BUILD DOCUMENT */
function _sumBuildDoc(circ, data, org, aud, dep, date) {
  const depLabel = {brief:'Brief',standard:'Standard',detailed:'Detailed'}[dep]||'Standard';
  const sections = _sumSections(circ, data, org);
  const purpose  = data.summary ||
    `This directive issued by <strong>${circ.regulator||'the regulator'}</strong> introduces a
    revised compliance framework for regulated financial entities. All entities within the defined
    scope must achieve full compliance by the prescribed deadline. Non-compliance exposes entities
    to supervisory action, regulatory penalties, and reputational risk.`;

  return `
  <div class="sum-doc" id="sum-doc">

    <!-- ── DOCUMENT HEADER ── -->
    <div class="sum-doc-header">

      <!-- top bar: title + actions -->
      <div class="sum-dh-topbar">
        <div class="sum-dh-eyebrow">
          <span class="sum-dh-label">Executive Summary</span>
          <span class="sum-dh-sep">·</span>
          <span class="sum-dh-aud">${aud}</span>
          <span class="sum-dh-sep">·</span>
          <span class="sum-dh-date">${date}</span>
        </div>
        <button class="sum-dh-btn" onclick="_sumOpenDoc()">🖨 Print</button>
      </div>

      <!-- circular title -->
      <div class="sum-dh-title">${circ.title}</div>

      <!-- meta pills row -->
      <div class="sum-dh-meta">
        <span class="sum-dh-pill sum-dh-pill-reg">${circ.regulator||'N/A'}</span>
        <span class="sum-dh-pill">${circ.id}</span>
        <span class="sum-dh-pill">Issued: ${circ.date||circ.issuedDate||'—'}</span>
        <span class="sum-dh-pill">Effective: ${circ.effectiveDate||'Immediate'}</span>
        <span class="sum-dh-pill sum-dh-pill-deadline">⚠ Comply by: ${circ.deadline||'As specified'}</span>
        <span class="sum-dh-pill sum-dh-pill-risk-${(circ.risk||'medium').toLowerCase()}">${circ.risk||'Medium'} Risk</span>
      </div>

      <!-- purpose & background -->
      <div class="sum-dh-purpose">
        <div class="sum-dh-purpose-label">Purpose &amp; Background</div>
        <p class="sum-dh-purpose-text">${purpose}</p>
      </div>

    </div>

    <!-- ── ACCORDION SECTIONS ── -->
    <div class="sum-accordion" id="sum-accordion">
      ${sections.map((sec) => _sumRenderAccordion(sec, false)).join('')}
    </div>

  </div>`;
}

/* ── Render single accordion item ── */
function _sumRenderAccordion(sec, open) {
  return `
  <div class="sum-acc-item ${open ? 'sum-acc-open' : ''}" id="sum-acc-${sec.id}">
    <button class="sum-acc-trigger" data-sec="${sec.id}">
      <div class="sum-acc-trigger-left">
        <span class="sum-acc-num">${sec.num}</span>
        <span class="sum-acc-ico">${sec.icon}</span>
        <div class="sum-acc-titles">
          <span class="sum-acc-title">${sec.title}</span>
          <span class="sum-acc-sub">${sec.sub}</span>
        </div>
      </div>
      <div class="sum-acc-trigger-right">
        ${sec.badge ? `<span class="sum-acc-badge sum-acc-badge-${sec.badgeType||'neutral'}">${sec.badge}</span>` : ''}
        <span class="sum-acc-arrow">${open ? '▲' : '▼'}</span>
      </div>
    </button>

    <div class="sum-acc-body" style="display:${open ? 'block' : 'none'};">
      <div class="sum-acc-inner">

        <!-- section content -->
        <div class="sum-sec-content" id="sscontent-${sec.id}">${sec.html}</div>

        <!-- edit drawer -->
        <div class="sum-edit-drawer" id="ssdrawer-${sec.id}" style="display:none;">
          <div class="sum-edit-drawer-head">
            <span class="sum-edit-drawer-title">✎ &nbsp;Add context for AI regeneration</span>
            <button class="sum-edit-cancel" data-sec="${sec.id}">✕</button>
          </div>
          <textarea class="sum-edit-ta" id="ssta-${sec.id}"
            placeholder="e.g. 'Focus more on technology risks' or 'Add mention of PMLA obligations'…"></textarea>
          <div class="sum-edit-actions">
            <button class="sum-edit-apply" data-sec="${sec.id}">↺ Regenerate this section</button>
          </div>
        </div>

        <!-- section footer -->
        <div class="sum-sec-footer">
          <button class="sum-sec-edit-btn" data-sec="${sec.id}">✎ Add context &amp; regenerate</button>
        </div>

      </div>
    </div>
  </div>`;
}


function _sumOpenDoc() {
  const url = './Executive Summary RBI MC.pdf';
  const win = window.open(encodeURI(url), '_blank');

  if (win) {
    win.onload = () => win.print();
  }
}


/* ================================================================ BIND EVENTS */
function _sumBindDocEvents(circ) {
  /* regen whole doc */

  /* expand all */


  /* accordion toggles */
  document.querySelectorAll('.sum-acc-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = btn.dataset.sec;
      const item = document.getElementById(`sum-acc-${id}`);
      const body = item?.querySelector('.sum-acc-body');
      const arrow= item?.querySelector('.sum-acc-arrow');
      const open = item?.classList.contains('sum-acc-open');
      item?.classList.toggle('sum-acc-open', !open);
      if (body)  body.style.display = open ? 'none' : 'block';
      if (arrow) arrow.textContent  = open ? '▼' : '▲';
    });
  });

  /* open edit drawer */
  document.querySelectorAll('.sum-sec-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = btn.dataset.sec;
      const drawer = document.getElementById(`ssdrawer-${id}`);
      if (!drawer) return;
      drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
      if (drawer.style.display === 'block') document.getElementById(`ssta-${id}`)?.focus();
    });
  });

  /* cancel edit */
  document.querySelectorAll('.sum-edit-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.sec;
      document.getElementById(`ssdrawer-${id}`).style.display = 'none';
      document.getElementById(`ssta-${id}`).value = '';
    });
  });

  /* apply regen */
  document.querySelectorAll('.sum-edit-apply').forEach(btn => {
    btn.addEventListener('click', () => {
      const id      = btn.dataset.sec;
      const ta      = document.getElementById(`ssta-${id}`);
      const content = document.getElementById(`sscontent-${id}`);
      const drawer  = document.getElementById(`ssdrawer-${id}`);
      const ctx     = ta?.value?.trim();

      btn.textContent    = 'Updating…';
      btn.disabled       = true;
      content.style.opacity = '0.35';

      setTimeout(() => {
        if (ctx) {
          content.innerHTML += `
          <div class="sum-ctx-note">
            <span class="sum-ctx-badge">Context added</span>
            <span class="sum-ctx-text">${ctx}</span>
          </div>`;
        }
        content.style.opacity = '1';
        drawer.style.display  = 'none';
        ta.value              = '';
        btn.textContent       = '↺ Regenerate this section';
        btn.disabled          = false;
        showToast('Section updated.', 'success');
      }, 900);
    });
  });
}

/* ================================================================ SECTIONS */
function _sumSections(circ, data, org) {
  const risk = (circ.risk||'Medium').toLowerCase();

  return [
    /* 1 — Key Updates */
    {
      id:'key-updates', num:'01', icon:'🔄',
      title:'Key Updates',
      sub:'What has changed vs previous regulations',
      badge:`${(data.keyChanges||[1,2,3,4,5]).length} changes`, badgeType:'blue',
      html:`
        <div class="sum-change-list">
          ${(data.keyChanges||[
            `Unified framework replacing multiple earlier ${circ.regulator||'regulatory'} directives applicable separately to different entity types.`,
            'Mandatory auto-escalation timelines introduced — all complaints to be escalated within 20 days.',
            'Technology-driven requirements including automated complaint management and regulator portal integration.',
            'Board oversight strengthened with mandatory annual audit of the compliance framework.',
            'New eligibility thresholds — entities crossing prescribed limits must comply within 6 months.',
          ]).map((item, i) => `
          <div class="sum-change-row">
            <div class="sum-change-num">${i+1}</div>
            <div class="sum-change-text">${item}</div>
          </div>`).join('')}
        </div>`,
    },

    /* 2 — Compliance Risks */
    {
      id:'comp-risk', num:'02', icon:'🚨',
      title:'Compliance Risks',
      sub:'Risks of non-compliance',
      badge:`${risk === 'high' ? 'High Risk' : risk === 'medium' ? 'Medium Risk' : 'Low Risk'}`, badgeType:risk,
      html:`
        <div class="sum-risk-list">
          ${(data.risks||[
            {level:'High',   text:'Supervisory risk — compliance assessed during regulatory examinations and risk assessments.'},
            {level:'High',   text:'Regulatory enforcement exposure under Banking Regulation Act, RBI Act and applicable statutes.'},
            {level:'Medium', text:'Governance risk if independence criteria, tenure protection, or reporting obligations are violated.'},
            {level:'Medium', text:'Operational risk from absence of automated escalation or delayed grievance resolution timelines.'},
            {level:'Low',    text:'Reputational and customer trust erosion due to ineffective grievance redress mechanisms.'},
          ]).map(r => `
          <div class="sum-risk-row">
            <span class="sum-risk-pill sum-risk-${(r.level||'medium').toLowerCase()}">${r.level||'Medium'}</span>
            <span class="sum-risk-txt">${r.text||r}</span>
          </div>`).join('')}
        </div>`,
    },

    /* 3 — Immediate Actions */
    {
      id:'imm-actions', num:'03', icon:'⚡',
      title:'Immediate Actions',
      sub:'Actions required now',
      badge:'Action Required', badgeType:'red',
      html:`
        <div class="sum-action-list">
          ${(data.immediateActions || [
            { group:'Governance & Structure',   items:['Confirm appointment or eligibility requirement for Internal Ombudsman.','Ensure independence criteria and tenure compliance.','Update Board / Customer Service Committee oversight mechanisms.'] },
            { group:'Systems & Process',        items:['Implement or upgrade automated Complaint Management System.','Enable auto-escalation of rejected complaints within 20 days.','Provide IO access to complaint systems and regulator CMS.'] },
            { group:'Policy & Documentation',   items:['Issue Board-approved SOP for grievance escalation.','Update internal grievance redress policy aligned with new direction.','Disseminate guidelines across all branches and operating units.'] },
            { group:'Regulatory Reporting',     items:['Submit IO contact details and appointment information to regulator.','Establish quarterly and annual reporting workflows.'] },
          ]).map(g => `
          <div class="sum-action-group">
            <div class="sum-action-group-title">${g.group}</div>
            <div class="sum-action-rows">
              ${g.items.map(item => `
              <div class="sum-action-row">
                <span class="sum-action-dot"></span>
                <span class="sum-action-text">${item}</span>
              </div>`).join('')}
            </div>
          </div>`).join('')}
        </div>`,
    },

    /* 4 — Organisational Impact */
    {
      id:'org-impact', num:'04', icon:'🏢',
      title:'Organisational Impact',
      sub:'How this affects your organisation',
      badge:null,
      html:`
        <div class="sum-impact-strip">
          ${[
            {lbl:'Risk Level',      val:circ.risk||'High',  clr:risk==='low'?'#16a34a':risk==='medium'?'#d97706':'#dc2626'},
            {lbl:'Depts Impacted',  val:'4+',               clr:'#1a1a2e'},
            {lbl:'Effort',          val:'Medium',            clr:'#d97706'},
            {lbl:'Timeline',        val:'90 Days',           clr:'#2563eb'},
          ].map(c=>`
            <div class="sum-impact-cell">
              <div class="sum-impact-val" style="color:${c.clr};">${c.val}</div>
              <div class="sum-impact-lbl">${c.lbl}</div>
            </div>`).join('')}
        </div>
        <p class="sum-para sum-para-sm" style="margin-top:12px;">${data.orgImpact||
          `As a <strong>${org.entityType}</strong>, direct obligations apply under this circular.
          Compliance programme, internal SOPs, and technology infrastructure must be reviewed
          and updated before the regulatory deadline.`
        }</p>`,
    },

    /* 5 — Technical Changes */
    {
      id:'tech-impact', num:'05', icon:'⚙️',
      title:'Technical Changes Required',
      sub:'Systems & technology obligations',
      badge:null,
      html:`
        <div class="sum-tech-list">
          ${(data.technicalChanges||[
            'Update core banking / loan management system to support revised reporting formats and new data fields.',
            'Integrate API endpoints for automated regulatory data submission to the regulator portal.',
            'Implement immutable audit trail mechanisms for all relevant transaction types.',
            'Upgrade KYC / AML screening modules to meet revised threshold and velocity requirements.',
            'Deploy real-time compliance monitoring dashboards for management visibility.',
          ]).map(item => `
          <div class="sum-tech-row">
            <span class="sum-tech-dot"></span>
            <span class="sum-tech-text">${item}</span>
          </div>`).join('')}
        </div>`,
    },
  ];
}

/* ================================================================ HELPERS */
function _sumFillStrip(c) {
  const $ = id => document.getElementById(id);
  if ($('sum-strip-id'))   $('sum-strip-id').textContent   = c.id;
  if ($('sum-strip-name')) $('sum-strip-name').textContent = c.title;
  if (c.regulator) {
    const r = $('sum-strip-reg');
    if (r) { r.textContent = c.regulator; r.style.display = 'inline-flex'; }
  }
  if (c.risk) {
    const r = $('sum-strip-risk');
    if (r) {
      r.textContent = `${c.risk} Risk`;
      r.className   = `sum-strip-risk sum-srisk-${c.risk.toLowerCase()}`;
      r.style.display = 'inline-flex';
    }
  }
}

/* ================================================================ CSS */
function injectSumCSS() {
  if (document.getElementById('sum-css')) return;
  const s = document.createElement('style');
  s.id = 'sum-css';
  s.textContent = `
 @media print {
  /* hide all chrome */
  .ai-tab-bar, .sum-strip, .sum-controls-bar, .sum-footer,
  .sum-sec-footer, .sum-edit-drawer, .sum-dh-actions,
  .sum-dh-eyebrow { display:none !important; }

  /* open all accordion panels */
  .sum-acc-body { display:block !important; }
  .sum-doc { box-shadow:none !important; border:none !important; }

  /* flatten the accordion trigger into a heading */
  .sum-acc-trigger {
    display:block !important;
    background:none !important;
    padding:18px 0 4px !important;
    border-bottom:1.5px solid #000 !important;
    border-top:none !important;
  }
  .sum-acc-num, .sum-acc-ico, .sum-acc-arrow,
  .sum-acc-trigger-right { display:none !important; }
  .sum-acc-titles { display:block !important; }
  .sum-acc-title {
    font-size:14pt !important;
    font-weight:700 !important;
    color:#000 !important;
    display:block !important;
  }
  .sum-acc-sub {
    font-size:9pt !important;
    color:#555 !important;
    display:block !important;
  }

  /* flatten accordion body */
  .sum-acc-inner { padding:8px 0 16px !important; }
  .sum-acc-item { break-inside:avoid; border-bottom:none !important; }

  /* document header as plain text */
  .sum-dh-title {
    font-size:18pt !important;
    font-weight:700 !important;
    color:#000 !important;
    margin-bottom:8px !important;
  }
  .sum-dh-meta { display:none !important; }
  .sum-dh-purpose { border-top:none !important; padding-top:6px !important; }
  .sum-dh-purpose-label {
    font-size:10pt !important;
    font-weight:700 !important;
    color:#000 !important;
  }
  .sum-dh-purpose-text { font-size:10pt !important; color:#222 !important; }

  /* strip colored pills and replace with plain text */
  .sum-risk-pill, .sum-acc-badge, .sum-dh-pill { 
    background:none !important; 
    border:none !important;
    color:#000 !important;
    font-weight:700 !important;
    padding:0 !important;
  }
  .sum-risk-pill::after { content:":"; }

  /* change list → plain numbered */
  .sum-change-row {
    background:none !important;
    border:none !important;
    padding:2px 0 !important;
  }
  .sum-change-num {
    background:none !important;
    color:#000 !important;
    font-weight:700 !important;
    border:none !important;
  }
  .sum-change-text { font-size:10pt !important; color:#222 !important; }

  /* risk rows → plain */
  .sum-risk-row {
    background:none !important;
    border:none !important;
    padding:2px 0 !important;
  }
  .sum-risk-txt { font-size:10pt !important; color:#222 !important; }

  /* action groups */
  .sum-action-group-title {
    font-size:11pt !important;
    font-weight:700 !important;
    color:#000 !important;
    border-bottom:1px solid #ccc !important;
  }
  .sum-action-dot {
    background:#000 !important;
    width:4px !important;
    height:4px !important;
  }
  .sum-action-text { font-size:10pt !important; color:#222 !important; }

  /* impact strip → plain grid */
  .sum-impact-strip { background:none !important; border:none !important; }
  .sum-impact-cell { border:1px solid #ccc !important; }
  .sum-impact-val { font-size:14pt !important; color:#000 !important; }
  .sum-impact-lbl { color:#555 !important; }

  /* tech rows */
  .sum-tech-row {
    background:none !important;
    border:none !important;
    padding:2px 0 !important;
  }
  .sum-tech-dot { background:#000 !important; }
  .sum-tech-text { font-size:10pt !important; color:#222 !important; }

  /* page setup */
  @page { margin:2cm; }
  body { font-family:'Times New Roman', serif !important; }
}

.sum-wrap  { display:flex;flex-direction:column;gap:12px;font-family:'DM Sans',sans-serif; }

/* empty */
.sum-empty       { display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;padding:56px 24px;background:#fff;border:1.5px dashed #dde0e6;border-radius:12px;text-align:center; }
.sum-empty-icon  { font-size:34px; }
.sum-empty-title { font-size:15px;font-weight:700;color:#1a1a2e; }
.sum-empty-sub   { font-size:12px;color:#9499aa;max-width:320px;line-height:1.55; }
.sum-empty-cta   { padding:9px 20px;background:#1a1a2e;color:#fff;border:none;border-radius:8px;
  font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer; }

/* context strip */
.sum-strip       { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;
  gap:8px;padding:9px 14px;background:#f5f6f8;border:1px solid #dde0e6;border-radius:8px; }
.sum-strip-left  { display:flex;align-items:center;gap:7px;min-width:0; }
.sum-strip-id    { font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:#1a1a2e;white-space:nowrap; }
.sum-strip-sep   { color:#c4c8d4; }
.sum-strip-name  { font-size:12px;color:#4a5068;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:340px; }
.sum-strip-right { display:flex;align-items:center;gap:7px;flex-shrink:0; }
.sum-strip-reg   { font-size:11px;font-weight:700;padding:2px 9px;background:#eff6ff;
  border:1px solid #bfdbfe;border-radius:10px;color:#2563eb; }
.sum-strip-risk  { font-size:10px;font-weight:700;padding:2px 9px;border-radius:10px;border:1px solid; }
.sum-srisk-high  { background:#fee2e2;border-color:#fca5a5;color:#b91c1c; }
.sum-srisk-medium{ background:#fef9c3;border-color:#fcd34d;color:#b45309; }
.sum-srisk-low   { background:#dcfce7;border-color:#86efac;color:#15803d; }
.sum-strip-change{ padding:4px 10px;background:#fff;border:1px solid #dde0e6;border-radius:6px;
  font-size:11px;font-weight:600;color:#4a5068;cursor:pointer; }

/* controls bar */
.sum-controls-bar { display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;
  padding:13px 16px;background:#fff;border:1px solid #dde0e6;border-radius:10px; }
.sum-ctrl-group   { display:flex;flex-direction:column;gap:4px;flex:1;min-width:150px; }
.sum-ctrl-label   { font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.06em; }
.sum-ctrl-select  { padding:8px 11px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:7px;
  font-family:'DM Sans',sans-serif;font-size:13px;color:#1a1a2e;outline:none;width:100%; }
.sum-ctrl-select:focus { border-color:#1a1a2e;background:#fff; }
.sum-ctrl-btn     { padding:9px 20px;background:#1a1a2e;border:none;border-radius:8px;
  font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#fff;
  cursor:pointer;white-space:nowrap;flex-shrink:0;align-self:flex-end;transition:background 0.14s; }
.sum-ctrl-btn:hover    { background:#2d2d4e; }
.sum-ctrl-btn:disabled { opacity:0.6;cursor:not-allowed; }
.sum-loading { padding:40px;text-align:center; }

/* ═══════════════════ DOCUMENT ═══════════════════ */
.sum-doc { background:#fff;border:1px solid #dde0e6;border-radius:12px;overflow:hidden;
  box-shadow:0 2px 20px rgba(0,0,0,0.07); }

/* ── DOCUMENT HEADER ── */
.sum-doc-header   { padding:22px 28px 0;border-bottom:2px solid #eef0f3; }

.sum-dh-topbar    { display:flex;align-items:center;justify-content:space-between;
  gap:12px;margin-bottom:10px;flex-wrap:wrap; }
.sum-dh-eyebrow   { display:flex;align-items:center;gap:7px;font-size:11px;color:#9499aa; }
.sum-dh-label     { font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:.07em;font-size:10px; }
.sum-dh-sep       { color:#dde0e6; }
.sum-dh-aud       { color:#4a5068; }
.sum-dh-date      { color:#9499aa; }
.sum-dh-actions   { display:flex;gap:7px; }
.sum-dh-btn       { padding:5px 12px;background:#f5f6f8;border:1px solid #dde0e6;border-radius:6px;
  font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:#4a5068;
  cursor:pointer;transition:all 0.13s;white-space:nowrap; }
.sum-dh-btn:hover { background:#eef0f3;color:#1a1a2e; }

.sum-dh-title     { font-size:18px;font-weight:700;color:#1a1a2e;line-height:1.4;
  margin-bottom:14px;letter-spacing:-0.01em; }

.sum-dh-meta      { display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:18px; }
.sum-dh-pill      { padding:3px 10px;background:#f5f6f8;border:1px solid #dde0e6;
  border-radius:20px;font-size:11px;font-weight:600;color:#4a5068; }
.sum-dh-pill-reg  { background:#eff6ff;border-color:#bfdbfe;color:#2563eb; }
.sum-dh-pill-deadline { background:#fef3c7;border-color:#fcd34d;color:#b45309; }
.sum-dh-pill-risk-high   { background:#fee2e2;border-color:#fca5a5;color:#b91c1c; }
.sum-dh-pill-risk-medium { background:#fef9c3;border-color:#fcd34d;color:#b45309; }
.sum-dh-pill-risk-low    { background:#dcfce7;border-color:#86efac;color:#15803d; }

/* purpose block inside header */
.sum-dh-purpose       { padding:16px 0 20px; border-top:1px solid #eef0f3; }
.sum-dh-purpose-label { font-size:10px;font-weight:700;color:#9499aa;
  text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px; }
.sum-dh-purpose-text  { font-size:13px;color:#4a5068;line-height:1.75;margin:0; }

/* ── ACCORDION ── */
.sum-accordion  { background:#fff; }
.sum-acc-item   { border-bottom:1px solid #eef0f3; }
.sum-acc-item:last-child { border-bottom:none; }

.sum-acc-trigger { width:100%;display:flex;align-items:center;justify-content:space-between;
  padding:14px 24px;background:#fff;border:none;cursor:pointer;
  font-family:'DM Sans',sans-serif;transition:background 0.13s;gap:12px;text-align:left; }
.sum-acc-trigger:hover  { background:#fafafa; }
.sum-acc-open .sum-acc-trigger { background:#f8f9ff; }

.sum-acc-trigger-left  { display:flex;align-items:center;gap:12px; }
.sum-acc-num    { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:#c4c8d4;
  width:22px;flex-shrink:0; }
.sum-acc-ico    { width:32px;height:32px;background:#f0f1f4;border-radius:8px;
  display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0; }
.sum-acc-open .sum-acc-ico { background:#eef2ff; }
.sum-acc-titles { display:flex;flex-direction:column;gap:2px; }
.sum-acc-title  { font-size:13px;font-weight:700;color:#1a1a2e; }
.sum-acc-sub    { font-size:11px;color:#9499aa; }

.sum-acc-trigger-right { display:flex;align-items:center;gap:9px;flex-shrink:0; }
.sum-acc-badge  { padding:2px 9px;border-radius:4px;font-size:10px;font-weight:700;white-space:nowrap; }
.sum-acc-badge-blue    { background:#dbeafe;color:#1d4ed8; }
.sum-acc-badge-green   { background:#dcfce7;color:#15803d; }
.sum-acc-badge-red     { background:#fee2e2;color:#b91c1c; }
.sum-acc-badge-high    { background:#fee2e2;color:#b91c1c; }
.sum-acc-badge-medium  { background:#fef9c3;color:#b45309; }
.sum-acc-badge-low     { background:#dcfce7;color:#15803d; }
.sum-acc-badge-neutral { background:#f0f1f4;color:#4a5068; }
.sum-acc-arrow  { font-size:9px;color:#9499aa; }



/* ── CIRCULAR SELECTOR ── */
.sum-sel-row         { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
.sum-sel-search-wrap { position:relative;flex:1 1 280px;min-width:220px; }
.sum-sel-icon        { position:absolute;left:10px;top:50%;transform:translateY(-50%);
  color:#9499aa;font-size:15px;pointer-events:none;z-index:1; }
.sum-sel-input       { width:100%;padding:9px 12px 9px 30px;background:#f5f6f8;
  border:1.5px solid #dde0e6;border-radius:8px;font-family:'DM Sans',sans-serif;
  font-size:13px;color:#1a1a2e;outline:none;box-sizing:border-box;transition:border-color 0.14s; }
.sum-sel-input:focus { border-color:#1a1a2e;background:#fff; }
.sum-sel-input::placeholder { color:#9499aa; }
.sum-sel-dropdown    { position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;
  border:1.5px solid #dde0e6;border-radius:10px;z-index:9999;max-height:240px;
  overflow-y:auto;box-shadow:0 8px 24px rgba(26,26,46,0.12); }
.sum-sel-dd-item     { padding:9px 13px;cursor:pointer;border-bottom:1px solid #f0f1f4;transition:background 0.1s; }
.sum-sel-dd-item:last-child { border-bottom:none; }
.sum-sel-dd-item:hover { background:#f5f6f8; }
.sum-sel-dd-meta     { display:flex;align-items:center;gap:7px;margin-bottom:3px; }
.sum-sel-dd-id       { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:#1a1a2e; }
.sum-sel-dd-reg      { font-size:11px;color:#9499aa; }
.sum-sel-dd-risk     { font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px; }
.sum-sel-dd-title    { font-size:12px;color:#4a5068;line-height:1.4; }
.sum-sel-confirm-btn { padding:9px 18px;background:#1a1a2e;border:none;border-radius:8px;
  font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#fff;
  cursor:pointer;white-space:nowrap;flex-shrink:0;transition:background 0.14s,opacity 0.14s; }
.sum-sel-confirm-btn:disabled { background:#c4c8d4;cursor:not-allowed;opacity:0.65; }
.sum-sel-confirm-btn:not(:disabled):hover { background:#2d2d4e; }
.sum-sel-confirmed   { display:flex;align-items:center;justify-content:space-between;
  margin-top:10px;padding:9px 13px;background:#f0fdf4;border:1.5px solid #86efac;
  border-radius:8px;flex-wrap:wrap;gap:8px; }
.sum-sel-conf-left   { display:flex;align-items:center;gap:7px;min-width:0;flex-wrap:wrap; }
.sum-sel-conf-id     { font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:#15803d; }
.sum-sel-conf-sep    { color:#86efac; }
.sum-sel-conf-name   { font-size:12px;color:#166534;overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap;max-width:380px; }
.sum-sel-change-btn  { padding:4px 11px;background:#fff;border:1.5px solid #86efac;border-radius:6px;
  font-size:11px;font-weight:600;color:#15803d;cursor:pointer;transition:all 0.12s;flex-shrink:0; }
.sum-sel-change-btn:hover { background:#dcfce7; }



/* accordion body */
.sum-acc-body   { border-top:1px solid #eef0f3; }
.sum-acc-inner  { padding:20px 24px 16px; }

/* ── CONTENT TYPES ── */

/* paragraph */
.sum-para    { font-size:13px;color:#4a5068;line-height:1.75;margin:0; }
.sum-para-sm { font-size:12px; }

/* numbered change list */
.sum-change-list { display:flex;flex-direction:column;gap:10px; }
.sum-change-row  { display:flex;align-items:flex-start;gap:12px;padding:10px 14px;
  background:#f8f9fc;border:1px solid #eef0f3;border-radius:8px; }
.sum-change-num  { flex-shrink:0;width:22px;height:22px;background:#1a1a2e;color:#fff;
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:700;margin-top:1px; }
.sum-change-text { font-size:13px;color:#1a1a2e;line-height:1.6; }

/* applicability table */
.sum-app-grid    { border:1px solid #dde0e6;border-radius:8px;overflow:hidden; }
.sum-app-row     { display:grid;grid-template-columns:1fr 1fr auto;padding:9px 14px;
  border-bottom:1px solid #f0f1f4;align-items:center;gap:12px; }
.sum-app-row:last-child { border-bottom:none; }
.sum-app-row:first-child { background:#f5f6f8;font-size:10px;font-weight:700;
  color:#9499aa;text-transform:uppercase;letter-spacing:.06em; }
.sum-app-type    { font-size:12px;font-weight:600;color:#1a1a2e; }
.sum-app-cond    { font-size:11px;color:#4a5068; }
.sum-app-badge   { padding:2px 9px;border-radius:4px;font-size:10px;font-weight:700;white-space:nowrap; }
.sum-app-yes     { background:#dcfce7;color:#15803d; }
.sum-app-no      { background:#f3f4f6;color:#9499aa; }

/* risk list */
.sum-risk-list   { display:flex;flex-direction:column;gap:8px; }
.sum-risk-row    { display:flex;align-items:flex-start;gap:10px;padding:8px 12px;
  border-radius:6px;background:#fafafa;border:1px solid #f0f1f4; }
.sum-risk-pill   { flex-shrink:0;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;margin-top:2px; }
.sum-risk-high   { background:#fee2e2;color:#b91c1c; }
.sum-risk-medium { background:#fef9c3;color:#b45309; }
.sum-risk-low    { background:#dcfce7;color:#15803d; }
.sum-risk-txt    { font-size:12px;color:#4a5068;line-height:1.6; }

/* action list with groups */
.sum-action-list  { display:flex;flex-direction:column;gap:16px; }
.sum-action-group { }
.sum-action-group-title { font-size:11px;font-weight:700;color:#1a1a2e;text-transform:uppercase;
  letter-spacing:.06em;margin-bottom:8px;padding-bottom:6px;border-bottom:1.5px solid #eef0f3; }
.sum-action-rows  { display:flex;flex-direction:column;gap:6px; }
.sum-action-row   { display:flex;align-items:flex-start;gap:10px;padding:4px 0; }
.sum-action-dot   { flex-shrink:0;width:6px;height:6px;border-radius:50%;background:#2563eb;margin-top:5px; }
.sum-action-text  { font-size:12px;color:#4a5068;line-height:1.6; }

/* impact strip */
.sum-impact-strip { display:grid;grid-template-columns:repeat(4,1fr);gap:1px;
  background:#eef0f3;border:1px solid #eef0f3;border-radius:8px;overflow:hidden; }
.sum-impact-cell  { background:#fff;padding:12px 8px;text-align:center; }
.sum-impact-val   { font-size:18px;font-weight:800;line-height:1;margin-bottom:4px; }
.sum-impact-lbl   { font-size:9px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em; }

/* tech list */
.sum-tech-list  { display:flex;flex-direction:column;gap:8px; }
.sum-tech-row   { display:flex;align-items:flex-start;gap:10px;padding:9px 13px;
  background:#f8f9fc;border:1px solid #eef0f3;border-radius:7px; }
.sum-tech-dot   { flex-shrink:0;width:6px;height:6px;border-radius:50%;background:#6366f1;margin-top:5px; }
.sum-tech-text  { font-size:12px;color:#4a5068;line-height:1.6; }

/* section footer */
.sum-sec-footer   { margin-top:14px;padding-top:12px;border-top:1px solid #f0f1f4;display:flex;justify-content:flex-end; }
.sum-sec-edit-btn { padding:4px 11px;background:#fff;border:1px solid #dde0e6;border-radius:6px;
  font-size:11px;font-weight:600;color:#9499aa;cursor:pointer;transition:all 0.12s; }
.sum-sec-edit-btn:hover { border-color:#2563eb;color:#2563eb; }

/* edit drawer */
.sum-edit-drawer      { margin-top:12px;background:#f0f6ff;border:1.5px solid #bfdbfe;border-radius:8px;overflow:hidden; }
.sum-edit-drawer-head { display:flex;align-items:center;justify-content:space-between;
  padding:9px 14px;border-bottom:1px solid #dbeafe; }
.sum-edit-drawer-title{ font-size:12px;font-weight:700;color:#1d4ed8; }
.sum-edit-cancel      { background:none;border:none;font-size:13px;color:#9499aa;cursor:pointer;padding:2px 6px; }
.sum-edit-ta          { width:100%;min-height:72px;padding:10px 14px;background:#fff;border:none;
  font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;outline:none;resize:vertical;
  box-sizing:border-box;border-top:1px solid #dbeafe; }
.sum-edit-actions     { display:flex;justify-content:flex-end;padding:8px 12px;background:#f0f6ff;border-top:1px solid #dbeafe; }
.sum-edit-apply       { padding:6px 14px;background:#2563eb;border:none;border-radius:6px;
  font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#fff;cursor:pointer; }

/* context note */
.sum-ctx-note  { display:flex;align-items:flex-start;gap:9px;margin-top:12px;
  padding:9px 13px;background:#f0fdf4;border-left:3px solid #86efac;border-radius:0 6px 6px 0; }
.sum-ctx-badge { font-size:9px;font-weight:700;color:#15803d;white-space:nowrap;
  background:#dcfce7;padding:2px 7px;border-radius:4px;flex-shrink:0;margin-top:2px; }
.sum-ctx-text  { font-size:12px;color:#166534;line-height:1.55; }

/* footer */
.sum-footer    { display:flex;gap:10px;align-items:center;flex-wrap:wrap; }
.sum-foot-btn  { padding:10px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;
  font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid;display:inline-flex;
  align-items:center;gap:7px;transition:all 0.14s; }
.sum-foot-save { background:#fff;border-color:#86efac;color:#16a34a; }
.sum-foot-save:hover { background:#f0fdf4; }
.sum-foot-next { background:#1a1a2e;color:#fff;border-color:#1a1a2e;margin-left:auto; }
.sum-foot-next:hover { background:#2d2d4e; }
`;
  document.head.appendChild(s);
}