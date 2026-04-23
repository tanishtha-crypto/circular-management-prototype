

/**
 * task-management-detail.js — Task Detail Panel
 * CHANGES from original:
 *  - Overview: shows Obligation ID, Obligation Name, Circular ID (clickable → AI suggestion),
 *    Clause ID + title, Assigned To, Dept, Due Date, Priority, Status, Workflow Stage
 *  - View Doc button and Lineage dialog added to header
 *  - Activities tab REMOVED
 *  - Evidence tab: Obligation Title shown (not Action Title), no Notes column
 *  - Comments: unchanged
 *  - All existing UI/styles preserved exactly
 */

let _tdTask = null;
let _tdTab = 'overview';

/* ── DUMMY TASKS (fallback) ──────────────────────────────────── */
const TD_TASKS = (typeof CMS_DATA !== 'undefined' && CMS_DATA.tasks) ? CMS_DATA.tasks : [
  { id: 'OB-001', title: 'Appoint Board-Level CISO', circularId: 'CIRC-001', clauseRef: 'C1.2', clauseTitle: 'A designated Compliance Officer shall be appointed with direct reporting to the Board Audit Committee.', department: 'HR', assignee: 'Priya Nair', status: 'Complete', risk: 'High', priority: 'Critical', dueDate: '2025-01-15', issueDate: '01 Apr 2024', effectiveDate: '01 Jul 2024', legalArea: 'Banking Regulation', subLegalArea: 'Prudential Norms', workflowStage: 'Closed', workflowLevel: 4, docUrl: '#', owner: 'Rahul Sharma', reviewer: 'Anita Verma' },
  { id: 'OB-002', title: 'Deploy SIEM & 24x7 SOC', circularId: 'CIRC-001', clauseRef: 'C3.1', clauseTitle: 'All systems shall implement real-time monitoring and incident response capabilities.', department: 'IT', assignee: 'Raj Iyer', status: 'Overdue', risk: 'High', priority: 'Critical', dueDate: '2025-01-30', issueDate: '01 Apr 2024', effectiveDate: '01 Jul 2024', legalArea: 'Banking Regulation', subLegalArea: 'Cybersecurity Norms', workflowStage: 'Overdue', workflowLevel: 0, docUrl: '#', owner: 'Rahul Sharma', reviewer: 'Vikram Singh' },
  { id: 'OB-003', title: 'Quarterly Risk Assessment Report', circularId: 'CIRC-001', clauseRef: 'C3.2', clauseTitle: 'Annual third-party audit of the compliance infrastructure must be completed and findings submitted to the Board.', department: 'Risk', assignee: 'Anand Krishnan', status: 'Open', risk: 'High', priority: 'High', dueDate: '2025-04-15', issueDate: '01 Apr 2024', effectiveDate: '01 Jul 2024', legalArea: 'Banking Regulation', subLegalArea: 'Audit & Disclosure', workflowStage: 'Assign', workflowLevel: 1, docUrl: '#', owner: 'Anita Verma', reviewer: 'Neha Patel' },
  { id: 'OB-004', title: 'EDD Process Documentation', circularId: 'CIRC-002', clauseRef: 'C2.1', clauseTitle: 'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days.', department: 'Compliance', assignee: 'Sneha Das', status: 'In Progress', risk: 'High', priority: 'High', dueDate: '2025-03-20', issueDate: '15 Feb 2024', effectiveDate: '01 Apr 2024', legalArea: 'AML/KYC', subLegalArea: 'Customer Due Diligence', workflowStage: 'Execution', workflowLevel: 3, docUrl: '#', owner: 'Rahul Sharma', reviewer: 'Anita Verma' },
  { id: 'OB-005', title: 'Vendor Risk Register Update', circularId: 'CIRC-005', clauseRef: 'C2.1', clauseTitle: 'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days.', department: 'Operations', assignee: 'Suresh Kumar', status: 'Open', risk: 'High', priority: 'High', dueDate: '2025-04-05', issueDate: '01 Jan 2024', effectiveDate: '01 Mar 2024', legalArea: 'Operational Risk', subLegalArea: 'Third-Party Risk', workflowStage: 'Draft', workflowLevel: 2, docUrl: '#', owner: 'Vikram Singh', reviewer: 'Neha Patel' },
];

function getTasks() {
  return (typeof CMS_DATA !== 'undefined' && CMS_DATA.tasks) ? CMS_DATA.tasks : TD_TASKS;
}

/* ── DUMMY ACTIONS per task ──────────────────────────────────── */
const DUMMY_ACTIONS = {
  'OB-001': [
    { id: 'OB-001-1', name: 'Draft CISO Job Description', obligation: 'Appoint a full-time CISO reporting to the Board.', assignee: 'Priya Nair', status: 'Complete', dept: 'HR', evidence: [] },
    { id: 'OB-001-2', name: 'Board Resolution for CISO Approval', obligation: 'Obtain Board approval for CISO appointment.', assignee: 'Arjun Kumar', status: 'Complete', dept: 'Compliance', evidence: [{ id: 'EV-001', type: 'Board Resolution', file: 'Board_Resolution_CISO.pdf', status: 'Verified', uploadedBy: 'Arjun Kumar', date: '15 Jan 2025', obligationTitle: 'Appoint Board-Level CISO' }] },
    { id: 'OB-001-3', name: 'CISO Onboarding & Access Setup', obligation: 'Provide system access and onboarding within 30 days.', assignee: 'Raj Iyer', status: 'In Progress', dept: 'IT', evidence: [] },
  ],
  'OB-002': [
    { id: 'OB-002-1', name: 'SIEM Vendor Evaluation', obligation: 'Deploy a SIEM system with 24×7 SOC monitoring.', assignee: 'Raj Iyer', status: 'Overdue', dept: 'IT', evidence: [] },
    { id: 'OB-002-2', name: 'SOC Team Hiring', obligation: 'Staff a 24×7 Security Operations Centre.', assignee: 'Priya Nair', status: 'Open', dept: 'HR', evidence: [] },
    { id: 'OB-002-3', name: 'SIEM Configuration & Go-Live', obligation: 'Configure alerts, dashboards and run 30-day pilot.', assignee: 'Raj Iyer', status: 'Open', dept: 'IT', evidence: [] },
  ],
  'OB-003': [
    { id: 'OB-003-1', name: 'Scope Definition for Q1 Assessment', obligation: 'Conduct quarterly penetration testing and risk review.', assignee: 'Anand Krishnan', status: 'Open', dept: 'Risk', evidence: [] },
    { id: 'OB-003-2', name: 'Third-Party Pentest Engagement', obligation: 'Engage certified pentesting firm for quarterly test.', assignee: 'Anand Krishnan', status: 'Open', dept: 'Risk', evidence: [] },
  ],
  'OB-004': [
    { id: 'OB-004-1', name: 'Document EDD SOP for PEP Customers', obligation: 'Maintain an updated EDD SOP for Politically Exposed Persons.', assignee: 'Sneha Das', status: 'In Progress', dept: 'Compliance', evidence: [{ id: 'EV-004', type: 'Policy Document', file: 'EDD_SOP_v2.pdf', status: 'Pending Review', uploadedBy: 'Sneha Das', date: '20 Mar 2025', obligationTitle: 'EDD Process Documentation' }] },
    { id: 'OB-004-2', name: 'EDD Training for Compliance Staff', obligation: 'Mandatory EDD training for all compliance staff.', assignee: 'Meera Pillai', status: 'Open', dept: 'Compliance', evidence: [] },
  ],
  'OB-005': [
    { id: 'OB-005-1', name: 'Classify Vendors by Risk Tier', obligation: 'Classify all vendors as Critical, Important, or Standard.', assignee: 'Suresh Kumar', status: 'Open', dept: 'Operations', evidence: [] },
    { id: 'OB-005-2', name: 'Conduct Vendor Due Diligence', obligation: 'Annual due diligence on all critical and important vendors.', assignee: 'Neha Rao', status: 'Open', dept: 'Risk', evidence: [] },
    { id: 'OB-005-3', name: 'Document Vendor Exit Strategies', obligation: 'Document and test exit strategies for critical vendors.', assignee: 'Suresh Kumar', status: 'Open', dept: 'Operations', evidence: [] },
  ],
};

function getActions(taskId) {
  if (!DUMMY_ACTIONS[taskId]) {
    DUMMY_ACTIONS[taskId] = [
      { id: `ACT-${taskId}-1`, name: 'Review Circular Requirements', obligation: 'Review and confirm applicability of all clauses.', assignee: 'Compliance Team', status: 'Open', dept: 'Compliance', evidence: [] },
      { id: `ACT-${taskId}-2`, name: 'Prepare Compliance Report', obligation: 'Prepare and submit compliance status report.', assignee: 'Compliance Team', status: 'Open', dept: 'Compliance', evidence: [] },
    ];
  }
  return DUMMY_ACTIONS[taskId];
}

/* ── OPEN TASK DETAIL ────────────────────────────────────────── */
window.openTaskDetail = function (taskId) {
  const task = getTasks().find(t => t.id === taskId);
  if (!task) { if (typeof showToast === 'function') showToast('Task not found', 'warning'); return; }

  _tdTask = task;
  _tdTab = 'overview';

  if (!task._evidence) task._evidence = [];
  if (!task._comments) task._comments = [
    { author: 'Priya Sharma', role: 'Compliance Lead', time: '2 days ago', text: 'Reviewed requirements and confirmed scope. Proceeding with execution.' },
    { author: 'Rahul Verma', role: 'IT Manager', time: '1 day ago', text: 'Resources allocated. Will update progress by end of week.' }
  ];

  tdInjectStyles();

  const area = document.getElementById('content-area');
  if (!area) return;
  area.innerHTML = `<div class="tds-full" id="tds-full">${tdBuildPanel(task)}</div>`;
  tdSwitchTab('overview');
};

/* ── CLOSE ────────────────────────────────────────────────────── */
window.closeTaskDetail = function () {
  _tdTask = null;
  const area = document.getElementById('content-area');
  if (!area) return;
  if (typeof renderMyItemsObligations === 'function') renderMyItemsObligations();
  else area.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8">No task list renderer found.</div>';
};

/* ── navigate to AI suggestion ──────────────────────────────── */
window._tdGoToAI = function (circId) {
  if (typeof renderAISuggestionPage === 'function') renderAISuggestionPage(circId);
  else if (typeof window.CMS !== 'undefined' && window.CMS.navigateTo) window.CMS.navigateTo('ai-suggestion', circId);
};

/* ── PANEL SHELL ──────────────────────────────────────────────── */
function tdBuildPanel(t) {
  const sc = s => ({ Complete: '#10b981', 'In Progress': '#f59e0b', Overdue: '#ef4444', Open: '#6366f1' })[s] || '#64748b';
  const rc = r => ({ High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' })[r] || '#64748b';
  const rb = r => ({ High: '#fee2e2', Medium: '#fef9c3', Low: '#dcfce7' })[r] || '#f9fafb';
  const rd = r => ({ High: '#fca5a5', Medium: '#fde68a', Low: '#86efac' })[r] || '#e2e8f0';

  /* workflow stepper */
  const wfSteps = ['Assign', 'Draft', 'Execution', 'Review', 'Closed'];
  const wfIdx = wfSteps.indexOf(t.workflowStage);

  return `
  <div class="tdp-wrap">

    <!-- STICKY HEADER -->
    <div class="tdp-header">
      <div class="tdp-hrow">
        <div style="min-width:0;flex:1">
        
          <div class="tdp-bc">
            <span class="tdp-back" onclick="closeTaskDetail()">← Obligations</span>
            <span class="tdp-bc-sep">/</span>
            <span class="tdp-bc-id" onclick="_tdShowOblDetailModal('${t.id}')" style="cursor:pointer;color:#6366f1;text-decoration:underline;text-underline-offset:2px;" title="View obligation details">${t.obligationId || t.id}</span>
            <span style="float:right;display:flex;gap:6px;align-items:center;">
              <button class="tdp-hdr-btn" onclick="_tdShowInfoModal('${t.id}')">ⓘ Refer to more</button>
              <span id="tdp-assignee-wf-badge-${t.id}" style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;">
                ${t._workflowState === 'sent_for_closure' ? '✓ Sent for Closure' :
                  t._workflowState === 'clarification_requested' ? '💬 Clarification Requested' :
                  t._workflowState === 'clarification_sent' ? '⚠ CO sent clarification' :
                  t._workflowState === 'closed' ? '✓ Closed' : '● In Progress'}
              </span>
            </span>
          </div>
          
          <div class="tdp-title">${t.title}</div>
        </div>

      </div>


      

     
    </div>

    <!-- BODY: vertical tabs + pane -->
    <div class="tdp-body">

      <!-- Vertical tabs — Activities removed -->
      <nav class="tdp-vtabs">
        ${[
      ['overview', '◈', 'Overview'],
      ['evidence', '📎', 'Evidence'],
      ['comments', '💬', 'Comments'],
    ].map(([id, ic, lb]) => `
          <button class="tdp-vtab" id="tdp-vt-${id}" onclick="tdSwitchTab('${id}')">
            <span class="tdp-vt-icon">${ic}</span>
            <span class="tdp-vt-lbl">${lb}</span>
          </button>`).join('')}
      </nav>

      <div class="tdp-pane" id="tdp-pane"></div>
    </div>

    <!-- LINEAGE DIALOG -->
    <div class="tdp-lineage-overlay" id="tdp-lineage-overlay" style="display:none"
         onclick="if(event.target===this)_tdCloseLineage()">
      <div class="tdp-lineage-modal">
        <div class="tdp-lineage-head">
          <div>
            <div class="tdp-lineage-eyebrow">Obligation Lineage</div>
            <div class="tdp-lineage-title">${t.id} — ${t.title}</div>
          </div>
          <button class="tdp-x" onclick="_tdCloseLineage()">✕</button>
        </div>
        <div class="tdp-lineage-body">
          <div class="tdp-ln-chain">
            <div class="tdp-ln-node tdp-ln-circ">
              <div class="tdp-ln-type">Circular Ref</div>
              <div class="tdp-ln-id tdp-circ-clickable" onclick="_tdGoToAI('${t.circularId}')">${t.circularId} ↗</div>
              <div class="tdp-ln-desc">Source regulatory circular</div>
            </div>
            <div class="tdp-ln-arrow">↓</div>
            <div class="tdp-ln-node tdp-ln-clause">
              <div class="tdp-ln-type">Clause</div>
              <div class="tdp-ln-id">${t.clauseRef || '—'}</div>
              <div class="tdp-ln-desc">${(t.clauseTitle || '').substring(0, 80)}${(t.clauseTitle || '').length > 80 ? '…' : ''}</div>
            </div>
            <div class="tdp-ln-arrow">↓</div>
            <div class="tdp-ln-node tdp-ln-obl tdp-ln-active">
              <div class="tdp-ln-type">Obligation</div>
              <div class="tdp-ln-id">${t.id}</div>
              <div class="tdp-ln-desc">${t.title}</div>
            </div>
            <div class="tdp-ln-arrow">↓</div>
            <div class="tdp-ln-node tdp-ln-assign">
              <div class="tdp-ln-type">Assigned To</div>
              <div class="tdp-ln-id">${t.assignee || '—'}</div>
              <div class="tdp-ln-desc">${t.department}</div>
            </div>
          </div>
          <div class="tdp-ln-meta">
            <div class="tdp-ln-meta-row"><span class="tdp-ln-meta-lbl">Due Date</span><span class="tdp-ln-meta-val">${tdFmtDate(t.dueDate)}</span></div>
            <div class="tdp-ln-meta-row"><span class="tdp-ln-meta-lbl">Priority</span><span class="tdp-ln-meta-val">${t.priority}</span></div>
            <div class="tdp-ln-meta-row"><span class="tdp-ln-meta-lbl">Workflow</span><span class="tdp-ln-meta-val">${t.workflowStage || '—'}</span></div>
            <div class="tdp-ln-meta-row"><span class="tdp-ln-meta-lbl">Status</span><span class="tdp-ln-meta-val">${t.status}</span></div>
          </div>
        </div>
        <div class="tdp-lineage-foot">
          <button class="tdp-btn tdp-btn-ghost" onclick="_tdCloseLineage()">Close</button>
          <button class="tdp-btn tdp-btn-primary" onclick="_tdGoToAI('${t.circularId}');_tdCloseLineage()">
            View AI Suggestions ↗
          </button>
        </div>
      </div>
    </div>

  </div>`;
}

window._tdShowLineage = function (taskId) { const o = document.getElementById('tdp-lineage-overlay'); if (o) o.style.display = 'flex'; };
window._tdCloseLineage = function () { const o = document.getElementById('tdp-lineage-overlay'); if (o) o.style.display = 'none'; };

/* ── SWITCH TAB ───────────────────────────────────────────────── */
window.tdSwitchTab = function (tab) {
  _tdTab = tab;
  document.querySelectorAll('.tdp-vtab').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`tdp-vt-${tab}`);
  if (btn) btn.classList.add('active');
  const pane = document.getElementById('tdp-pane');
  if (!pane || !_tdTask) return;
  // activities removed — only overview, evidence, comments
  const map = { overview: tdPaneOverview, evidence: tdPaneEvidence, comments: tdPaneComments };
  pane.innerHTML = (map[tab] || tdPaneOverview)(_tdTask);
  pane.style.animation = 'none';
  void pane.offsetHeight;
  pane.style.animation = 'tdpIn .2s ease';
};

window._tdShowInfoModal = function(taskId) {
  const task = getTasks().find(t => t.id === taskId);
  if (!task) return;

  const existing = document.getElementById('tdp-info-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'tdp-info-overlay';
  overlay.className = 'tdp-lineage-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML = `
  <div class="tdp-lineage-modal" style="max-width:720px">

    <div class="tdp-lineage-head">
      <div>
        <div class="tdp-lineage-eyebrow">Regulatory Profile</div>
        <div class="tdp-lineage-title">${task.obligationId} — ${task.title}</div>
      </div>
      <button class="tdp-x" onclick="document.getElementById('tdp-info-overlay').remove()">✕</button>
    </div>

    <div style="padding:22px 24px;overflow-y:auto;display:flex;flex-direction:column;gap:24px;max-height:72vh">

      <!-- About -->
      <div>
        <div class="tdp-info-section-lbl">About this Obligation</div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;font-size:13.5px;color:#334155;line-height:1.75;">
          ${task.about || `This obligation is derived from <strong>${task.circularId}</strong> issued under <strong>${task.legalArea || 'Banking Regulation'}</strong>. It requires the <strong>${task.department}</strong> department to ensure compliance by <strong>${tdFmtDate(task.dueDate)}</strong>. The obligation carries a <strong>${task.risk} risk</strong> rating and is classified as <strong>${task.priority} priority</strong>.`}
        </div>
      </div>

      <!-- Regulatory Structure -->
      <div>
        <div class="tdp-info-section-lbl">Regulatory Structure</div>
        <div class="tdp-info-grid">
          ${tdInfoRow('Circular Ref', `<span class="tdp-link tdp-circ-clickable" onclick="_tdGoToAI('${task.circularId}');document.getElementById('tdp-info-overlay').remove()" style="color:#6366f1;font-weight:700;cursor:pointer">${task.circularId} ↗</span>`)}
          ${tdInfoRow('Regulatory Body', task.regulatoryBody || 'Reserve Bank of India (RBI)')}
          ${tdInfoRow('Chapter ', task.chapterNo ? `${task.chapterNo}${task.chapterTitle ? ' — ' + task.chapterTitle : ''}` : 'Chapter 1 — Governance and Accountability')}
          ${tdInfoRow('Section ', task.sectionNo ? `${task.sectionNo}${task.sectionTitle ? ' — ' + task.sectionTitle : ''}` : 'Section 1.2 — Board-Level Cybersecurity Governance')}
          ${tdInfoRow('Clause No.', task.clauseRef || 'C1.2')}
          ${tdInfoRow('Frequency', task.frequency || 'One-Time')}
        </div>
        <div class="tdp-clause-block" style="margin-top:12px">
          <div class="tdp-clause-label">Clause Text — ${task.clauseRef || 'C1.2'}</div>
          <div class="tdp-clause-text">${task.clauseTitle || 'A designated Compliance Officer shall be appointed with direct reporting to the Board Audit Committee.'}</div>
        </div>
      </div>

      <!-- Classification -->
      <div>
        <div class="tdp-info-section-lbl">Classification</div>
        <div class="tdp-info-grid">
          ${tdInfoRow('Legislative Area',     task.legalArea    || 'Banking Regulation')}
          ${tdInfoRow('Sub-Legislative Area', task.subLegalArea || '—')}
          ${tdInfoRow('Category',             task.category     || 'Governance')}
          ${tdInfoRow('Obligation Type',      task.obligationType || 'Mandatory')}
          ${tdInfoRow('Effective Date',       task.effectiveDate || '—')}
          ${tdInfoRow('Issue Date',           task.issueDate     || '17-1-2024')}
        </div>
      </div>

      <!-- Document Reference -->
      <div>
        <div class="tdp-info-section-lbl">Document Reference</div>
        <div class="tdp-doc-card">
          <span class="tdp-doc-icon">📄</span>
          <div class="tdp-doc-info">
            <div class="tdp-doc-name">${task.circularId}_Master_Direction.pdf</div>
            <div class="tdp-doc-meta">Source regulatory document for ${task.circularId}</div>
          </div>
          <button class="tdp-btn tdp-btn-ghost tdp-btn-sm"
                  onclick="${task.docUrl && task.docUrl !== '#' ? `window.open('${task.docUrl}','_blank')` : `(typeof showToast==='function')&&showToast('No document attached','warning')`}">
            View PDF
          </button>
        </div>
      </div>

    </div>

    <div class="tdp-lineage-foot">
      <button class="tdp-btn tdp-btn-ghost" onclick="document.getElementById('tdp-info-overlay').remove()">Close</button>
      <button class="tdp-btn tdp-btn-primary" onclick="_tdGoToAI('${task.circularId}');document.getElementById('tdp-info-overlay').remove()">
        View AI Suggestions ↗
      </button>
    </div>

  </div>`;

  document.body.appendChild(overlay);
};

/* ── ACCORDION TOGGLE ──────────────────────────────────────── */
window._tdToggleAcc = function(id) {
  const body = document.getElementById('tdp-acc-' + id);
  const arr  = document.getElementById('tdp-arr-' + id);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arr) arr.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
};

/* ── ATTACH FILE IN RAISE A REQUEST ───────────────────────── */
window._tdArAttach = function(input, taskId) {
  const file = input.files[0]; if (!file) return;
  const list = document.getElementById(`tdp-ar-attach-list-${taskId}`);
  if (!list) return;
  const chip = document.createElement('div');
  chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;font-size:12px;font-weight:600;color:#334155;';
  chip.innerHTML = `${tdFIcon(file.name)} ${file.name} <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;line-height:1;">×</button>`;
  list.appendChild(chip);
  showToast(`${file.name} attached.`, 'success');
};

/* ── EVIDENCE UPLOAD POPUP ─────────────────────────────────── */
window._tdOpenEvidenceUpload = function(taskId) {
  const task = getTasks().find(t => t.id === taskId); if (!task) return;
  const ex = document.getElementById('tdp-ev-upload-modal'); if (ex) ex.remove();

  const evidenceTypes = ['Board Resolution','Policy Document','Audit Report','Training Record','System Log','Regulatory Filing','Risk Assessment','Meeting Minutes','Other'];

  const overlay = document.createElement('div');
  overlay.id = 'tdp-ev-upload-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(3px);';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML = `
  <div style="background:#fff;border-radius:14px;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);animation:tdpIn .22s ease;" onclick="event.stopPropagation()">

    <!-- HEAD -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e2e8f0;background:#f8fafc;flex-shrink:0;">
      <div>
        <div style="font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Upload Evidence</div>
        <div style="font-size:14px;font-weight:700;color:#1e293b;margin-top:2px;">${task.obligationId || task.id} — ${task.title}</div>
      </div>
      <button onclick="document.getElementById('tdp-ev-upload-modal').remove()" style="width:30px;height:30px;border-radius:50%;background:#e2e8f0;border:none;font-size:14px;color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>

    <!-- BODY -->
    <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;">

      <!-- Drop zone -->
      <label style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:28px 20px;border:2px dashed #c7d2fe;border-radius:10px;background:#f5f3ff;cursor:pointer;transition:border-color .15s;" onmouseover="this.style.borderColor='#6366f1'" onmouseout="this.style.borderColor='#c7d2fe'">
        <span style="font-size:32px;">📂</span>
        <div style="text-align:center;">
          <div style="font-size:13px;font-weight:700;color:#4338ca;">Click to choose file or drag & drop</div>
          <div style="font-size:11px;color:#64748b;margin-top:3px;">PDF, DOCX, XLSX, PNG, JPG — max 20MB</div>
        </div>
        <input type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg" style="display:none;" onchange="_tdEvFileSelected(this,'${taskId}')"/>
      </label>

      <div id="tdp-ev-file-preview-${taskId}" style="display:none;padding:12px 14px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:24px;" id="tdp-ev-file-icon-${taskId}">📄</span>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:700;color:#166534;" id="tdp-ev-file-name-${taskId}">—</div>
          <div style="font-size:11px;color:#64748b;" id="tdp-ev-file-size-${taskId}">—</div>
        </div>
        <button onclick="document.getElementById('tdp-ev-file-preview-${taskId}').style.display='none'" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;">×</button>
      </div>

      <!-- Evidence Type -->
      <div>
        <label style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:5px;">Evidence Type <span style="color:#ef4444;">*</span></label>
        <select id="tdp-ev-type-${taskId}" style="width:100%;padding:9px 11px;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-family:inherit;color:#1e293b;background:#fff;outline:none;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'">
          <option value="">— Select type —</option>
          ${evidenceTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
      </div>

      <!-- Description -->
      <div>
        <label style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:5px;">Description</label>
        <textarea id="tdp-ev-desc-${taskId}" rows="3" placeholder="Briefly describe what this document covers and how it satisfies the obligation…" style="width:100%;padding:9px 11px;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-family:inherit;color:#1e293b;resize:vertical;outline:none;line-height:1.6;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'"></textarea>
      </div>

      <!-- AI Relevance hint -->
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;font-size:12px;color:#92400e;line-height:1.6;">
        💡 <strong>AI Relevance Scoring:</strong> Once uploaded, our AI will analyse the document against the obligation requirements and assign a relevance score (0–100). Higher scores indicate stronger evidence alignment.
      </div>

    </div>

    <!-- FOOT -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;flex-shrink:0;gap:10px;">
      <button onclick="document.getElementById('tdp-ev-upload-modal').remove()" style="padding:9px 18px;background:#fff;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-weight:600;color:#64748b;cursor:pointer;">Cancel</button>
      <button onclick="_tdEvSubmitUpload('${taskId}')" style="padding:9px 22px;background:#6366f1;border:none;border-radius:7px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;display:flex;align-items:center;gap:7px;" onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">📎 Upload & Score</button>
    </div>

  </div>`;

  document.body.appendChild(overlay);
};

window._tdEvFileSelected = function(input, taskId) {
  const file = input.files[0]; if (!file) return;
  const preview = document.getElementById(`tdp-ev-file-preview-${taskId}`);
  const nameEl  = document.getElementById(`tdp-ev-file-name-${taskId}`);
  const sizeEl  = document.getElementById(`tdp-ev-file-size-${taskId}`);
  const iconEl  = document.getElementById(`tdp-ev-file-icon-${taskId}`);
  if (preview) preview.style.display = 'flex';
  if (nameEl)  nameEl.textContent = file.name;
  if (sizeEl)  sizeEl.textContent = (file.size / 1024).toFixed(1) + ' KB';
  if (iconEl)  iconEl.textContent = tdFIcon(file.name);
};

window._tdEvSubmitUpload = function(taskId) {
  const type = document.getElementById(`tdp-ev-type-${taskId}`)?.value;
  if (!type) { if (typeof showToast === 'function') showToast('Select an evidence type.', 'warning'); return; }
  const aiScore = Math.floor(60 + Math.random() * 38);
  const scoreLabel = aiScore >= 90 ? 'Excellent' : aiScore >= 75 ? 'Strong' : aiScore >= 60 ? 'Good' : 'Moderate';
  document.getElementById('tdp-ev-upload-modal')?.remove();

  /* show score result toast */
  const scoreColor = aiScore >= 80 ? '#15803d' : aiScore >= 60 ? '#b45309' : '#dc2626';
  const toastDiv = document.createElement('div');
  toastDiv.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:9999;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;padding:16px 20px;box-shadow:0 8px 28px rgba(0,0,0,.14);max-width:320px;animation:tdpIn .22s ease;display:flex;flex-direction:column;gap:8px;`;
  toastDiv.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:46px;height:46px;border-radius:50%;background:${aiScore>=80?'#dcfce7':aiScore>=60?'#fef9c3':'#fee2e2'};border:2px solid ${scoreColor};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:${scoreColor};flex-shrink:0;">${aiScore}</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#1e293b;">Evidence Uploaded ✓</div>
        <div style="font-size:11px;color:${scoreColor};font-weight:700;">AI Relevance Score: ${aiScore}/100 — ${scoreLabel}</div>
      </div>
    </div>
    <div style="height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${aiScore}%;background:${scoreColor};border-radius:99px;"></div>
    </div>
    <div style="font-size:11px;color:#64748b;line-height:1.5;">Document analysed against obligation requirements. ${aiScore>=75?'Strong alignment detected.':'Some gaps identified — consider adding additional supporting documents.'}</div>`;
  document.body.appendChild(toastDiv);
  setTimeout(() => toastDiv.remove(), 6000);

  /* re-render evidence tab */
  if (typeof tdSwitchTab === 'function') tdSwitchTab('evidence');
};

/* ── OBLIGATION DETAIL MODAL ──────────────────────────────── */
window._tdShowOblDetailModal = function(taskId) {
  const task = getTasks().find(t => t.id === taskId); if (!task) return;
  const ex = document.getElementById('tdp-obl-detail-modal'); if (ex) ex.remove();

  const sc = s => ({ Complete:'#10b981','In Progress':'#f59e0b',Overdue:'#ef4444',Open:'#6366f1' })[s] || '#64748b';

  const overlay = document.createElement('div');
  overlay.id = 'tdp-obl-detail-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(3px);';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  const fieldBlock = (label, value) => `
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:10px 13px;">
    <div style="font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">${label}</div>
    <div style="font-size:13px;font-weight:600;color:#1e293b;">${value || '—'}</div>
  </div>`;

  overlay.innerHTML = `
  <div style="background:#fff;border-radius:14px;width:100%;max-width:680px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);animation:tdpIn .22s ease;" onclick="event.stopPropagation()">

    <!-- HEAD -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:16px 20px;border-bottom:2px solid #e0e7ff;background:linear-gradient(135deg,#eff6ff 0%,#f5f3ff 100%);flex-shrink:0;">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;">
          <span style="font-family:monospace;font-size:11px;font-weight:700;color:#fff;background:#6366f1;padding:3px 10px;border-radius:5px;">${task.obligationId || task.id}</span>
          <span style="font-size:9px;font-weight:700;padding:2px 9px;border-radius:10px;background:#dcfce7;color:#15803d;border:1px solid #6ee7b7;">✓ Applicable</span>
        </div>
        <div style="font-size:14px;font-weight:700;color:#1e293b;line-height:1.4;max-width:520px;">${task.title}</div>
      </div>
      <button onclick="document.getElementById('tdp-obl-detail-modal').remove()" style="width:30px;height:30px;border-radius:50%;background:#e2e8f0;border:none;font-size:14px;color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✕</button>
    </div>

    <!-- BODY -->
    <div style="flex:1;overflow-y:auto;max-height:75vh;">

      <!-- Core details -->
      <div style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
        <div style="font-size:10px;font-weight:800;color:#6366f1;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
          <span style="width:3px;height:14px;background:#6366f1;border-radius:2px;display:inline-block;"></span>
          Obligation Details
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          ${fieldBlock('Due Date', tdFmtDate(task.dueDate))}
          ${fieldBlock('Frequency', task.frequency || 'Monthly')}
          ${fieldBlock('Priority', task.priority || '—')}
          ${fieldBlock('Department', task.department || '—')}
          ${fieldBlock('Assigned To', task.assignee || '—')}
          ${fieldBlock('Issue Date', task.issueDate || '—')}
          ${fieldBlock('Effective Date', task.effectiveDate || '—')}
          ${fieldBlock('Circular', task.circularId || '—')}
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:10px 13px;">
            <div style="font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Status</div>
            <span style="display:inline-block;padding:5px 12px;border-radius:6px;font-size:12px;font-weight:700;
              border:1.5px solid ${sc(task.status)}44;color:${sc(task.status)};background:${sc(task.status)}11;">
              ${task.status}
            </span>
          </div>
        </div>
      </div>

      <!-- Raise a Request in modal -->
      <div style="padding:16px 20px;border-bottom:1px solid #e2e8f0;background:#fafbfc;">
        <div style="font-size:10px;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
          <span style="width:3px;height:14px;background:#f59e0b;border-radius:2px;display:inline-block;"></span>
          Take Action
        </div>
        <div style="display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div style="flex:1;min-width:140px;">
            <label style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:4px;">Request Type</label>
            <select id="tdp-odm-type-${task.id}" style="width:100%;padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:12px;font-family:inherit;outline:none;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'">
              <option value="">— Select —</option>
              <option>Ask for Clarification</option>
              <option>Ask for Closure</option>
              <option>Update</option>
            </select>
          </div>
          <div style="flex:1;min-width:140px;">
            <label style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:4px;">Send To</label>
            <select id="tdp-odm-person-${task.id}" style="width:100%;padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:12px;font-family:inherit;outline:none;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'">
              <option value="">— Select —</option>
              ${task.assignee?`<option>Assignee: ${task.assignee}</option>`:''}
              ${task.reviewer?`<option>Reviewer: ${task.reviewer}</option>`:''}
              ${task.owner?`<option>Owner: ${task.owner}</option>`:''}
            </select>
          </div>
          <button onclick="_tdOdmSubmit('${task.id}')" style="padding:9px 16px;background:#6366f1;border:none;border-radius:6px;font-size:12px;font-weight:700;color:#fff;cursor:pointer;white-space:nowrap;" onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">Send →</button>
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:4px;">Note / Message</label>
          <textarea id="tdp-odm-note-${task.id}" rows="3" placeholder="Describe the clarification needed, or reason for closure request…" style="width:100%;padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:12px;font-family:inherit;resize:vertical;outline:none;line-height:1.6;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'"></textarea>
        </div>
        <div id="tdp-odm-status-${task.id}" style="display:none;margin-top:8px;padding:10px 14px;border-radius:6px;font-size:12px;font-weight:600;"></div>
      </div>

      <!-- Clause text -->
      <div style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
        <div style="font-size:10px;font-weight:800;color:#10b981;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
          <span style="width:3px;height:14px;background:#10b981;border-radius:2px;display:inline-block;"></span>
          Extracted Clause
        </div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:13px 15px;">
          <div style="font-size:10px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">Clause ${task.clauseRef || 'Reference'}</div>
          <div style="font-size:13px;color:#1e293b;line-height:1.75;">${task.clauseTitle || 'A designated Compliance Officer shall be appointed with direct reporting to the Board Audit Committee.'}</div>
        </div>
      </div>

      <!-- Evidence upload shortcut -->
      <div style="padding:16px 20px;background:#fafbfc;">
        <div style="font-size:10px;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
          <span style="width:3px;height:14px;background:#7c3aed;border-radius:2px;display:inline-block;"></span>
          Evidence
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <span style="font-size:12px;color:#64748b;">Attach supporting evidence documents to satisfy this obligation.</span>
          <button onclick="document.getElementById('tdp-obl-detail-modal').remove();_tdOpenEvidenceUpload('${task.id}')" style="padding:8px 16px;background:#ede9fe;border:1px solid #c4b5fd;border-radius:6px;font-size:12px;font-weight:700;color:#6d28d9;cursor:pointer;">📎 Upload Evidence</button>
        </div>
      </div>

    </div>

    <!-- FOOT -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:13px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;flex-shrink:0;">
      <button onclick="_tdGoToAI('${task.circularId}');document.getElementById('tdp-obl-detail-modal').remove()" style="padding:8px 16px;background:#fff;border:1.5px solid #c7d2fe;border-radius:7px;font-size:12px;font-weight:700;color:#6366f1;cursor:pointer;">View AI Suggestions ↗</button>
      <button onclick="document.getElementById('tdp-obl-detail-modal').remove()" style="padding:8px 18px;background:#1e293b;border:none;border-radius:7px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;">Close</button>
    </div>
  </div>`;

  document.body.appendChild(overlay);
};

window._tdOdmSubmit = function(taskId) {
  const type   = document.getElementById(`tdp-odm-type-${taskId}`)?.value;
  const person = document.getElementById(`tdp-odm-person-${taskId}`)?.value;
  const status = document.getElementById(`tdp-odm-status-${taskId}`);
  if (!type)   { if(typeof showToast==='function') showToast('Select a request type','warning'); return; }
  if (!person) { if(typeof showToast==='function') showToast('Select a person to send to','warning'); return; }
  if (status) {
    status.style.display = 'block';
    const cfg = {
      'Ask for Clarification': { bg:'#fef9c3', color:'#854d0e' },
      'Ask for Closure':       { bg:'#dcfce7', color:'#166534' },
      'Update':                { bg:'#dbeafe', color:'#1d4ed8' },
    }[type] || { bg:'#f1f5f9', color:'#475569' };
    status.style.background = cfg.bg;
    status.style.color = cfg.color;
    status.textContent = `✓ "${type}" sent to ${person}`;
  }
  if (typeof showToast === 'function') showToast(`"${type}" sent to ${person} ✓`, 'success');
};


function tdInfoRow(label, value) {
  return `
  <div class="tdp-info-row">
    <span class="tdp-info-lbl">${label}</span>
    <span class="tdp-info-val">${value}</span>
  </div>`;
}


/* ══════════════════════════════════════════════════════════════
   PANE: OVERVIEW
   ══════════════════════════════════════════════════════════════ */
/* ── DUE DATE COLOR HELPER ─────────────────────────────────── */
function tdDueDateColored(dateStr) {
  if (!dateStr) return `<span style="color:#94a3b8;font-weight:600">N/A</span>`;
  const due = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  let color = '#10b981', bg = '#dcfce7', label = tdFmtDate(dateStr);
  if (diffDays < 0)      { color = '#ef4444'; bg = '#fee2e2'; }
  else if (diffDays <= 7){ color = '#f59e0b'; bg = '#fef9c3'; }
  else if (diffDays > 60){ color = '#94a3b8'; bg = '#f1f5f9'; }
  return `<span style="background:${bg};color:${color};font-weight:700;padding:2px 9px;border-radius:99px;font-size:12px;">${label}</span>`;
}

function tdPaneOverview(t) {
  const sc = s => ({ Complete:'#10b981', 'In Progress':'#f59e0b', Overdue:'#ef4444', Open:'#6366f1' })[s] || '#64748b';

  const wfStatusMap = { 'Open': 1, 'In Progress': 2, 'Overdue': 2, 'Complete': 4 };
  const wfActiveIdx = wfStatusMap[t.status] ?? 1;
  const wfOverdue   = t.status === 'Overdue';
  const wfDone      = t.status === 'Complete';

  const wfStages = [
    { label: 'Circular Received', role: 'Central Office', name: 'CO Team'               },
    { label: 'Assigned',          role: 'SPOC',           name: 'Priya Sharma'          },
    { label: 'In Progress',       role: 'Assignee',       name: t.assignee  || '—'      },
    { label: 'Under Review',      role: 'Reviewer',       name: t.reviewer  || 'Pending' },
    { label: 'Closed',            role: 'Approver',       name: t.owner     || 'Pending' },
  ];

  const wfStepperHTML = wfStages.map((s, i) => {
    const done   = i < wfActiveIdx;
    const curr   = i === wfActiveIdx;
    const cls    = done ? 'done' : curr ? 'current' : '';
    const isLast = i === wfStages.length - 1;
    return `
      <div class="tdp-wfi-step ${cls}">
        <div class="tdp-wfi-dot">${done ? '✓' : i + 1}</div>
        <div class="tdp-wfi-lbl">${s.label}</div>
      </div>
      ${!isLast ? `<div class="tdp-wfi-line ${done ? 'done' : ''}"></div>` : ''}
    `;
  }).join('');

  const wfPeopleHTML = wfStages.map((s, i) => {
    const done    = i < wfActiveIdx;
    const curr    = i === wfActiveIdx;
    const pending = i > wfActiveIdx;
    const stageSt    = done ? 'Completed' : curr ? (wfOverdue ? '⚠ Overdue' : 'Active') : 'Pending';
    const stageColor = done ? '#10b981'   : curr ? (wfOverdue ? '#ef4444'   : '#6366f1') : '#94a3b8';
    const avBg       = done ? '#dcfce7'   : curr ? (wfOverdue ? '#fee2e2'   : '#eef2ff') : '#f1f5f9';
    const avColor    = done ? '#166534'   : curr ? (wfOverdue ? '#991b1b'   : '#4338ca') : '#94a3b8';
    const avBorder   = done ? '#86efac'   : curr ? (wfOverdue ? '#fca5a5'   : '#c7d2fe') : '#e2e8f0';
    return `
      <div class="tdp-wfp-card" style="${pending ? 'opacity:0.45' : ''}">
        <span class="tdp-av" style="background:${avBg};color:${avColor};border-color:${avBorder}">
          ${done ? '✓' : tdInitials(s.name)}
        </span>
        <div class="tdp-wfp-info">
          <div class="tdp-wfp-role">${s.role}</div>
          <div class="tdp-wfp-name">${s.name}</div>
          <div style="font-size:10px;font-weight:700;color:${stageColor};margin-top:2px;
                      text-transform:uppercase;letter-spacing:.04em">${stageSt}</div>
        </div>
      </div>
    `;
  }).join('');

  /* action status banner */
  const actionStatus = t._actionStatus;
  const actionBannerHTML = actionStatus ? `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;margin-bottom:16px;
      background:${actionStatus.bg};border:1px solid ${actionStatus.border};font-size:13px;font-weight:600;color:${actionStatus.color};">
      ${actionStatus.icon} <span>${actionStatus.label}</span>
      <span style="margin-left:auto;font-size:11px;font-weight:500;opacity:.75;">${actionStatus.time}</span>
    </div>` : '';

  return `
  <div class="tdp-inner">

    ${actionBannerHTML}

    <!-- ① RAISE A REQUEST (open by default) -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:12px;">
      <div onclick="_tdToggleAcc('raise-req-${t.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:#fff7ed;cursor:pointer;user-select:none;" onmouseover="this.style.background='#fff3e0'" onmouseout="this.style.background='#fff7ed'">
        <span style="font-size:12px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#f59e0b;border-radius:2px;display:inline-block;"></span>
          Take Action
        </span>
        <span id="tdp-arr-raise-req-${t.id}" style="color:#94a3b8;font-size:14px;transition:transform .2s;">▼</span>
      </div>
      <div id="tdp-acc-raise-req-${t.id}" style="border-top:1px solid #fde68a;background:#fff;">
        <div class="tdp-action-row-card" style="border:none;border-radius:0;box-shadow:none;">
          <div class="tdp-action-row-inner">
            <div class="tdp-ar-field">
              <label class="tdp-ar-label">Request Type</label>
              <select class="tdp-input tdp-ar-sel" id="tdp-ar-type-${t.id}" onchange="_tdArChange('${t.id}',this)">
                <option value="">— Select type —</option>
                <option value="Ask for Clarification">Ask for Clarification</option>
                <option value="Ask for Closure">Ask for Closure</option>
              </select>
            </div>
            <div class="tdp-ar-field">
              <label class="tdp-ar-label">Send To</label>
              <select class="tdp-input tdp-ar-sel" id="tdp-ar-person-${t.id}">
                <option value="">— Select person —</option>
                ${[
                  t.assignee ? `<option value="${t.assignee}"> ${t.assignee}</option>` : '',
                  t.reviewer ? `<option value="${t.reviewer}"> ${t.reviewer}</option>` : '',
                  t.owner    ? `<option value="${t.owner}"> ${t.owner}</option>` : '',
                ].join('')}
              </select>
            </div>
            <button class="tdp-btn tdp-btn-primary" style="align-self:flex-end;margin-top:18px;"
                    onclick="_tdArSubmit('${t.id}')">Send →</button>
          </div>

          <div style="padding:0 16px 12px;">
            <label class="tdp-ar-label">Note / Message</label>
            <textarea class="tdp-input" id="tdp-ar-note-${t.id}" rows="3"
              placeholder="Describe the clarification needed, reason for closure request, or any context…"
              style="width:100%;margin-top:4px;resize:vertical;line-height:1.6;"></textarea>
          </div>

          <div style="margin:0 16px 12px;padding:14px 16px;background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div>
              <div style="font-size:13px;font-weight:700;color:#334155;">Attach Evidence (optional)</div>
              <div style="font-size:11px;color:#64748b;margin-top:2px;">Upload supporting documents for this request</div>
            </div>
            <label style="display:inline-flex;align-items:center;gap:7px;padding:8px 16px;background:#fff;border:1.5px solid #6366f1;border-radius:7px;font-size:12px;font-weight:700;color:#6366f1;cursor:pointer;white-space:nowrap;">
              📎 Attach File
              <input type="file" style="display:none;" onchange="_tdArAttachWithScore(this,'${t.id}')"/>
            </label>
          </div>
          <div id="tdp-ar-attach-list-${t.id}" style="margin:0 16px 12px;display:flex;flex-wrap:wrap;gap:6px;"></div>

          <div class="tdp-ar-status-note" id="tdp-ar-note-disp-${t.id}" style="display:none;margin:0 16px 12px;border-radius:7px;"></div>
        </div>
      </div>
    </div>

    <!-- ② OBLIGATION DETAILS (collapsed by default) -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:12px;">
      <div onclick="_tdToggleAcc('obl-details-${t.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:#f8fafc;cursor:pointer;user-select:none;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
        <span style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#6366f1;border-radius:2px;display:inline-block;"></span>
          Obligation Details
        </span>
        <span id="tdp-arr-obl-details-${t.id}" style="color:#94a3b8;font-size:14px;transition:transform .2s;transform:rotate(-90deg);">▼</span>
      </div>
      <div id="tdp-acc-obl-details-${t.id}" style="display:none;padding:16px;border-top:1px solid #e2e8f0;background:#fff;">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">

          <!-- Due Date -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Due Date</div>
            <div>${tdDueDateColored(t.dueDate)}</div>
          </div>

          <!-- Frequency -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Frequency</div>
            <div style="font-size:13px;font-weight:600;color:#1e293b;">${t.frequency || 'Monthly'}</div>
          </div>

          <!-- Effective Date -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Effective Date</div>
            <div>${tdDueDateColored(t.effectiveDate)}</div>
          </div>

          <!-- Assigned To -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Assigned To</div>
            <div style="font-size:13px;font-weight:600;color:#1e293b;">${t.assignee || '—'}</div>
          </div>

          <!-- Department -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Department</div>
            <div style="font-size:13px;font-weight:600;color:#1e293b;">${t.department || '—'}</div>
          </div>

          <!-- Issue Date -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Issue Date</div>
            <div style="font-size:13px;font-weight:600;color:#1e293b;">${t.issueDate || '—'}</div>
          </div>

          <!-- Status (read-only badge) -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Status</div>
            <span id="tdp-obl-status-badge-${t.id}" style="background:${sc(t.status)}18;color:${sc(t.status)};border:1px solid ${sc(t.status)}44;padding:3px 11px;border-radius:99px;font-size:12px;font-weight:700;">${t.status}</span>
          </div>

          <!-- Action taken -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;grid-column:span 2;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Action Taken</div>
            <span id="tdp-obl-action-badge-${t.id}" style="font-size:12px;font-weight:600;color:${t._actionStatus ? t._actionStatus.color : '#94a3b8'}">
              ${t._actionStatus ? t._actionStatus.label : '— No action yet —'}
            </span>
          </div>

        </div>

        </div>
    </div>

    <!-- ③ WORKFLOW (collapsed by default) -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-top:4px;">
      <div onclick="_tdToggleAcc('workflow-${t.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:#f8fafc;cursor:pointer;user-select:none;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
        <span style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#10b981;border-radius:2px;display:inline-block;"></span>
          Workflow
        </span>
        <span id="tdp-arr-workflow-${t.id}" style="color:#94a3b8;font-size:14px;transition:transform .2s;transform:rotate(-90deg);">▼</span>
      </div>
      <div id="tdp-acc-workflow-${t.id}" style="display:none;border-top:1px solid #e2e8f0;background:#fff;">
        <div class="tdp-wf-details-card" style="border:none;border-radius:0;box-shadow:none;">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;white-space:nowrap">Current Stage</span>
            <span style="background:${wfDone?'#dcfce7':wfOverdue?'#fee2e2':'#eef2ff'};
                         color:${wfDone?'#166534':wfOverdue?'#991b1b':'#4338ca'};
                         border:1px solid ${wfDone?'#86efac':wfOverdue?'#fca5a5':'#c7d2fe'};
                         border-radius:20px;font-size:12px;font-weight:700;padding:3px 12px;white-space:nowrap">
              ${wfActiveIdx + 1} / ${wfStages.length} — ${wfStages[wfActiveIdx].label}${wfOverdue ? ' · ⚠ Overdue' : ''}
            </span>
            <div style="flex:1;min-width:60px;height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${Math.round(((wfActiveIdx + 1) / wfStages.length) * 100)}%;
                          background:${wfOverdue?'#ef4444':wfDone?'#10b981':'#6366f1'};border-radius:99px"></div>
            </div>
          </div>
          <div class="tdp-wf-stepper-inline">${wfStepperHTML}</div>
          <div class="tdp-wf-people">${wfPeopleHTML}</div>
        </div>
      </div>
    </div>

  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   PANE: EVIDENCE
  const sc = s => ({ Complete:'#10b981', 'In Progress':'#f59e0b', Overdue:'#ef4444', Open:'#6366f1' })[s] || '#64748b';

  const wfStatusMap = { 'Open': 1, 'In Progress': 2, 'Overdue': 2, 'Complete': 4 };
  const wfActiveIdx = wfStatusMap[t.status] ?? 1;
  const wfOverdue   = t.status === 'Overdue';
  const wfDone      = t.status === 'Complete';

  const wfStages = [
    { label: 'Circular Received', role: 'Central Office', name: 'CO Team'               },
    { label: 'Assigned',          role: 'SPOC',           name: 'Priya Sharma'          },
    { label: 'In Progress',       role: 'Assignee',       name: t.assignee  || '—'      },
    { label: 'Under Review',      role: 'Reviewer',       name: t.reviewer  || 'Pending' },
    { label: 'Closed',            role: 'Approver',       name: t.owner     || 'Pending' },
  ];

  const wfStepperHTML = wfStages.map((s, i) => {
    const done   = i < wfActiveIdx;
    const curr   = i === wfActiveIdx;
    const cls    = done ? 'done' : curr ? 'current' : '';
    const isLast = i === wfStages.length - 1;
    return `
      <div class="tdp-wfi-step ${cls}">
        <div class="tdp-wfi-dot">${done ? '✓' : i + 1}</div>
        <div class="tdp-wfi-lbl">${s.label}</div>
      </div>
      ${!isLast ? `<div class="tdp-wfi-line ${done ? 'done' : ''}"></div>` : ''}
    `;
  }).join('');

  const wfPeopleHTML = wfStages.map((s, i) => {
    const done    = i < wfActiveIdx;
    const curr    = i === wfActiveIdx;
    const pending = i > wfActiveIdx;
    const stageSt    = done ? 'Completed' : curr ? (wfOverdue ? '⚠ Overdue' : 'Active') : 'Pending';
    const stageColor = done ? '#10b981'   : curr ? (wfOverdue ? '#ef4444'   : '#6366f1') : '#94a3b8';
    const avBg       = done ? '#dcfce7'   : curr ? (wfOverdue ? '#fee2e2'   : '#eef2ff') : '#f1f5f9';
    const avColor    = done ? '#166534'   : curr ? (wfOverdue ? '#991b1b'   : '#4338ca') : '#94a3b8';
    const avBorder   = done ? '#86efac'   : curr ? (wfOverdue ? '#fca5a5'   : '#c7d2fe') : '#e2e8f0';
    return `
      <div class="tdp-wfp-card" style="${pending ? 'opacity:0.45' : ''}">
        <span class="tdp-av" style="background:${avBg};color:${avColor};border-color:${avBorder}">
          ${done ? '✓' : tdInitials(s.name)}
        </span>
        <div class="tdp-wfp-info">
          <div class="tdp-wfp-role">${s.role}</div>
          <div class="tdp-wfp-name">${s.name}</div>
          <div style="font-size:10px;font-weight:700;color:${stageColor};margin-top:2px;
                      text-transform:uppercase;letter-spacing:.04em">${stageSt}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
  <div class="tdp-inner">

    <!-- OBLIGATION DETAILS ACCORDION -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:4px;">
      <div onclick="_tdToggleAcc('obl-details-${t.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:#f8fafc;cursor:pointer;user-select:none;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
        <span style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#6366f1;border-radius:2px;display:inline-block;"></span>
          Obligation Details
        </span>
        <span id="tdp-arr-obl-details-${t.id}" style="color:#94a3b8;font-size:14px;transition:transform .2s;">▼</span>
      </div>
      <div id="tdp-acc-obl-details-${t.id}" style="padding:16px;border-top:1px solid #e2e8f0;background:#fff;">
        <div class="tdp-dl" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px 20px;">
          ${tdr('Circular',    `<span class="tdp-link tdp-circ-clickable" onclick="_tdGoToAI('${t.circularId}')">${t.circularId}</span>`)}
          ${tdr('Assigned To', t.assignee || '—')}
          ${tdr('Due Date',    tdFmtDate(t.dueDate))}
          ${tdr('Frequency',   t.frequency || 'Monthly')}
          ${tdr('Priority',    t.priority  || '—')}
          ${tdr('Status',      `<span style="color:${sc(t.status)};font-weight:700">${t.status}</span>`)}
          ${tdr('Issue Date',  t.issueDate || '—')}
          ${tdr('Effective Date', t.effectiveDate || '—')}
          ${tdr('Department',  t.department || '—')}
        </div>
      </div>
    </div>

    <!-- RAISE A REQUEST -->
    <div class="tdp-section-label" style="margin-top:28px">Take Action</div>
    <div class="tdp-action-row-card">
      <div class="tdp-action-row-inner">
        <div class="tdp-ar-field">
          <label class="tdp-ar-label">Request Type</label>
          <select class="tdp-input tdp-ar-sel" id="tdp-ar-type-${t.id}" onchange="_tdArChange('${t.id}',this)">
            <option value="">— Select type —</option>
            <option value="Ask for Clarification">Ask for Clarification</option>
            <option value="Ask for Closure">Ask for Closure</option>
          </select>
        </div>
        <div class="tdp-ar-field">
          <label class="tdp-ar-label">Send To</label>
          <select class="tdp-input tdp-ar-sel" id="tdp-ar-person-${t.id}">
            <option value="">— Select person —</option>
            ${[
              t.assignee ? `<option value="${t.assignee}">Assignee: ${t.assignee}</option>` : '',
              t.reviewer ? `<option value="${t.reviewer}">Reviewer: ${t.reviewer}</option>` : '',
              t.owner    ? `<option value="${t.owner}">Owner / Approver: ${t.owner}</option>` : '',
            ].join('')}
          </select>
        </div>
        <button class="tdp-btn tdp-btn-primary" style="align-self:flex-end;margin-top:18px;"
                onclick="_tdArSubmit('${t.id}')">Send →</button>
      </div>

      <!-- Big note textarea -->
      <div style="margin-top:12px;">
        <label class="tdp-ar-label">Note / Message</label>
        <textarea class="tdp-input" id="tdp-ar-note-${t.id}" rows="4"
          placeholder="Describe the clarification needed, reason for closure request, or any context the recipient should know…"
          style="width:100%;margin-top:4px;resize:vertical;line-height:1.6;"></textarea>
      </div>

      <!-- Evidence upload in raise a request -->
      <div style="margin-top:12px;padding:14px 16px;background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
        <div>
          <div style="font-size:13px;font-weight:700;color:#334155;">Attach Evidence (optional)</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">Upload supporting documents for this request</div>
        </div>
        <label style="display:inline-flex;align-items:center;gap:7px;padding:8px 16px;background:#fff;border:1.5px solid #6366f1;border-radius:7px;font-size:12px;font-weight:700;color:#6366f1;cursor:pointer;white-space:nowrap;">
          📎 Attach File
          <input type="file" style="display:none;" onchange="_tdArAttach(this,'${t.id}')"/>
        </label>
      </div>
      <div id="tdp-ar-attach-list-${t.id}" style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;"></div>

      <div class="tdp-ar-status-note" id="tdp-ar-note-disp-${t.id}" style="display:none;margin-top:8px;"></div>
      <div style="display:flex;justify-content:flex-end;margin-top:12px;">
        <button class="tdp-btn tdp-btn-primary" onclick="_tdArSubmit('${t.id}')">Send Request →</button>
      </div>
    </div>

    <!-- WORKFLOW ACCORDION -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-top:20px;">
      <div onclick="_tdToggleAcc('workflow-${t.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:#f8fafc;cursor:pointer;user-select:none;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
        <span style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#10b981;border-radius:2px;display:inline-block;"></span>
          Workflow
        </span>
        <span id="tdp-arr-workflow-${t.id}" style="color:#94a3b8;font-size:14px;transition:transform .2s;">▼</span>
      </div>
      <div id="tdp-acc-workflow-${t.id}" style="border-top:1px solid #e2e8f0;background:#fff;">
    <div class="tdp-wf-details-card" style="border:none;border-radius:0;box-shadow:none;">

      <!-- Progress summary row -->
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;
                     letter-spacing:.07em;white-space:nowrap">Current Stage</span>
        <span style="background:${wfDone?'#dcfce7':wfOverdue?'#fee2e2':'#eef2ff'};
                     color:${wfDone?'#166534':wfOverdue?'#991b1b':'#4338ca'};
                     border:1px solid ${wfDone?'#86efac':wfOverdue?'#fca5a5':'#c7d2fe'};
                     border-radius:20px;font-size:12px;font-weight:700;padding:3px 12px;white-space:nowrap">
          ${wfActiveIdx + 1} / ${wfStages.length} — ${wfStages[wfActiveIdx].label}${wfOverdue ? ' · ⚠ Overdue' : ''}
        </span>
        <div style="flex:1;min-width:60px;height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${Math.round(((wfActiveIdx + 1) / wfStages.length) * 100)}%;
                      background:${wfOverdue?'#ef4444':wfDone?'#10b981':'#6366f1'};border-radius:99px"></div>
        </div>
      </div>

      <!-- Step dots -->
      <div class="tdp-wf-stepper-inline">${wfStepperHTML}</div>

      <!-- People cards -->
      <div class="tdp-wf-people">${wfPeopleHTML}</div>

    </div>
    </div></div><!-- end workflow accordion -->

  </div>`;
}
/* ══════════════════════════════════════════════════════════════
   PANE: EVIDENCE
   Shows obligation title (not action title), no Notes column
   ══════════════════════════════════════════════════════════════ */
function tdPaneEvidence(t) {
  const actions = getActions(t.id);
  const uploadedEvs = actions.flatMap(a => (a.evidence || []).map(ev => ({ ...ev, activityName: t.title })));

  const DUMMY_EV = [
    { id: 'DEV-001', activityName: t.title, type: 'Board Resolution',   file: 'Board_Resolution_Q1.pdf',         uploadedBy: t.assignee || 'Priya Nair',  date: '15 Jan 2025', status: 'Verified'       },
    { id: 'DEV-002', activityName: t.title, type: 'Policy Document',    file: 'Compliance_Policy_v3.docx',       uploadedBy: t.reviewer || 'Anita Verma', date: '20 Jan 2025', status: 'Pending Review' },
    { id: 'DEV-003', activityName: t.title, type: 'Audit Report',       file: 'Internal_Audit_Q4_2024.pdf',      uploadedBy: 'Raj Iyer',                  date: '05 Feb 2025', status: 'Pending Review' },
    { id: 'DEV-004', activityName: t.title, type: 'Training Record',    file: 'Staff_Training_Completion.xlsx',  uploadedBy: t.assignee || 'Priya Nair',  date: '10 Feb 2025', status: 'Verified'       },
  ];
  const allEvs = [...uploadedEvs, ...DUMMY_EV];

  const sc = s => s === 'Verified' ? '#10b981' : '#f59e0b';
  const sb = s => s === 'Verified' ? '#dcfce7' : '#fef9c3';

  return `
  <div class="tdp-inner">

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div class="tdp-section-label" style="margin-bottom:0">
        Evidence Documents
        <span style="font-size:13px;font-weight:500;color:#64748b;text-transform:none;letter-spacing:0">
          — ${allEvs.length} document${allEvs.length !== 1 ? 's' : ''}
        </span>
      </div>
      <button class="tdp-btn tdp-btn-ghost tdp-btn-sm"
              onclick="_tdOpenEvidenceUpload('${t.id}')">＋ Upload Evidence</button>
    </div>

    ${!allEvs.length
      ? `<div class="tdp-empty">
           <div style="font-size:36px;margin-bottom:12px">📎</div>
           <p>No evidence uploaded yet.</p>
         </div>`
      : `<div class="tdp-tbl-wrap">
           <table class="tdp-tbl">
             <thead>
               <tr>
                 <th>Obligation</th>
                 <th>Type</th>
                 <th>File</th>
                 <th>Uploaded By</th>
               
                 <th>Date</th>
                   <th>AI Score</th>
                 <th>Status</th>
                 
               </tr>
             </thead>
             <tbody>
               ${allEvs.map(ev => {
                 const score      = ev.score      || Math.floor(60 + Math.random() * 38);
                 const scoreLabel = ev.scoreLabel || (score >= 90 ? 'Excellent' : score >= 75 ? 'Strong' : score >= 60 ? 'Good' : 'Moderate');
                 const scoreBg    = score >= 80 ? '#dcfce7' : score >= 60 ? '#fef9c3' : '#fee2e2';
                 const scoreColor = score >= 80 ? '#15803d' : score >= 60 ? '#b45309' : '#dc2626';
                 return `
                 <tr>
                   <td style="max-width:160px;font-size:13px;font-weight:600;color:#1e293b;
                               white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                     ${ev.activityName || ev.obligationTitle || t.title}
                   </td>
                   <td><span class="tdp-ev-type-chip">${ev.type}</span></td>
                   <td style="font-size:13px">${tdFIcon(ev.file)} ${ev.file}</td>
                   <td style="font-size:13px">${ev.uploadedBy}</td>
                   <td style="font-size:13px;color:#64748b">${ev.date}</td>
                   <td>
                     <div style="display:flex;align-items:center;gap:7px;">
                       <div style="width:34px;height:34px;border-radius:50%;background:${scoreBg};
                                   border:2px solid ${scoreColor};display:flex;align-items:center;
                                   justify-content:center;font-size:11px;font-weight:800;
                                   color:${scoreColor};flex-shrink:0;">${score}</div>
                       <div>
                         <div style="height:4px;background:#e2e8f0;border-radius:99px;
                                     overflow:hidden;width:52px;">
                           <div style="height:100%;width:${score}%;background:${scoreColor};
                                       border-radius:99px;"></div>
                         </div>
                         <div style="font-size:10px;color:${scoreColor};font-weight:700;
                                     margin-top:2px;">${scoreLabel}</div>
                       </div>
                     </div>
                   </td>
                   <td>
                     <span class="tdp-ev-chip"
                           style="background:${sb(ev.status)};color:${sc(ev.status)}">
                       ${ev.status === 'Verified' ? '✓ ' : ''}${ev.status}
                     </span>
                   </td>
                   
                 </tr>`;
               }).join('')}
             </tbody>
           </table>
         </div>`
    }

  </div>`;
}
window._tdEvFilter = function(taskId, filter) {
  /* update button styles */
  ['Open','In Progress','Complete','Pending','Overdue','All'].forEach(s => {
    const btn = document.getElementById(`tdp-evf-${taskId}-${s.replace(/\s/g,'_')}`);
    if (!btn) return;
    const active = s === filter;
    btn.style.background = active ? '#eef2ff' : '#fff';
    btn.style.color = active ? '#4338ca' : '#64748b';
    btn.style.borderColor = active ? '#6366f1' : '#e2e8f0';
  });
  /* re-render rows */
  const task = getTasks().find(t => t.id === taskId); if (!task) return;
  const tbody = document.getElementById(`tdp-ev-tbody-${taskId}`); if (!tbody) return;
  tbody.innerHTML = /* same render logic inline */ (() => {
    const actions = getActions(taskId);
    const uploadedEvs = actions.flatMap(a => (a.evidence || []).map(ev => ({ ...ev, obligationTitle: task.title })));
    const DUMMY_EV = [
      { id: 'DEV-001', obligationTitle: task.title, type: 'Board Resolution',  file: 'Board_Resolution_Q1.pdf',        uploadedBy: task.assignee||'Priya Nair', date:'15 Jan 2025', status:'Verified',       rowStatus:'Complete',    action: task._actionStatus?.label||'—', score:96, scoreLabel:'Excellent', scoreBg:'#dcfce7', scoreColor:'#15803d' },
      { id: 'DEV-002', obligationTitle: task.title, type: 'Policy Document',   file: 'Compliance_Policy_v3.docx',     uploadedBy: task.reviewer||'Anita Verma', date:'20 Jan 2025', status:'Pending Review', rowStatus:'Open',        action:'—',                             score:74, scoreLabel:'Good',      scoreBg:'#fef9c3', scoreColor:'#b45309' },
      { id: 'DEV-003', obligationTitle: task.title, type: 'Audit Report',      file: 'Internal_Audit_Q4_2024.pdf',    uploadedBy:'Raj Iyer',                    date:'05 Feb 2025', status:'Pending Review', rowStatus:'In Progress', action:'—',                             score:58, scoreLabel:'Moderate',  scoreBg:'#fef3c7', scoreColor:'#d97706' },
      { id: 'DEV-004', obligationTitle: task.title, type: 'Training Record',   file: 'Staff_Training_Completion.xlsx',uploadedBy: task.assignee||'Priya Nair', date:'10 Feb 2025', status:'Verified',       rowStatus:'Complete',    action: task._actionStatus?.label||'—', score:88, scoreLabel:'Strong',    scoreBg:'#dcfce7', scoreColor:'#15803d' },
    ];
    const allEvs = [...uploadedEvs, ...DUMMY_EV];
    const rowStatusColor = s => ({ 'Complete':'#10b981','In Progress':'#f59e0b','Overdue':'#ef4444','Open':'#6366f1','Pending':'#94a3b8' })[s] || '#64748b';
    const rowStatusBg    = s => ({ 'Complete':'#dcfce7','In Progress':'#fef9c3','Overdue':'#fee2e2','Open':'#eef2ff','Pending':'#f1f5f9' })[s] || '#f1f5f9';
    const sc2 = s => s === 'Verified' ? '#10b981' : '#f59e0b';
    const sb2 = s => s === 'Verified' ? '#dcfce7' : '#fef9c3';
    const filtered = filter === 'All' ? allEvs : allEvs.filter(ev => (ev.rowStatus||'Open') === filter);
    if (!filtered.length) return `<tr><td colspan="10" style="text-align:center;padding:32px;color:#94a3b8;font-size:13px;">No records match this filter.</td></tr>`;
    return filtered.map(ev => {
      const score = ev.score||70;
      const scoreBg = ev.scoreBg||(score>=80?'#dcfce7':score>=60?'#fef9c3':'#fee2e2');
      const scoreColor = ev.scoreColor||(score>=80?'#15803d':score>=60?'#b45309':'#dc2626');
      const rs = ev.rowStatus||'Open';
      const actionTaken = ev.action||(task._actionStatus?.label)||'—';
      return `
      <tr style="border-bottom:1px solid #f1f5f9;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
        <td style="padding:12px 14px;max-width:140px;"><span style="font-size:12px;font-weight:600;color:#1e293b;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ev.obligationTitle}</span></td>
        <td style="padding:12px 14px;"><span style="background:#ede9fe;color:#6d28d9;padding:2px 9px;border-radius:10px;font-size:11px;font-weight:700;">${ev.type}</span></td>
        <td style="padding:12px 14px;font-size:12px;color:#334155;">${tdFIcon(ev.file)} ${ev.file}</td>
        <td style="padding:12px 14px;font-size:12px;color:#64748b;">${ev.uploadedBy}</td>
        <td style="padding:12px 14px;font-size:12px;color:#94a3b8;white-space:nowrap;">${ev.date}</td>
        <td style="padding:12px 14px;">
          <div style="display:flex;align-items:center;gap:7px;">
            <div style="width:36px;height:36px;border-radius:50%;background:${scoreBg};border:2px solid ${scoreColor};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${scoreColor};flex-shrink:0;">${score}</div>
            <div><div style="height:4px;background:#e2e8f0;border-radius:99px;overflow:hidden;width:60px;"><div style="height:100%;width:${score}%;background:${scoreColor};border-radius:99px;"></div></div>
            <div style="font-size:10px;color:${scoreColor};font-weight:700;margin-top:2px;">${ev.scoreLabel}</div></div>
          </div>
        </td>
        <td style="padding:12px 14px;"><span style="background:${rowStatusBg(rs)};color:${rowStatusColor(rs)};padding:3px 10px;border-radius:10px;font-size:11px;font-weight:700;">${rs}</span></td>
        <td style="padding:12px 14px;font-size:11px;"><span style="font-weight:600;color:${actionTaken!=='—'?'#4338ca':'#94a3b8'}">${actionTaken}</span></td>
        <td style="padding:12px 14px;"><span style="background:${sb2(ev.status)};color:${sc2(ev.status)};padding:3px 10px;border-radius:10px;font-size:11px;font-weight:700;">${ev.status==='Verified'?'✓ ':''}${ev.status}</span></td>
        <td style="padding:12px 14px;text-align:right;">${ev.status!=='Verified'?`<button onclick="tdVerifyEv('${ev.id}','${taskId}')" style="padding:4px 11px;background:#dcfce7;border:1px solid #86efac;border-radius:5px;color:#15803d;font-size:11px;font-weight:700;cursor:pointer;">Verify</button>`:`<span style="color:#10b981;font-size:14px;">✓</span>`}</td>
      </tr>`;
    }).join('');
  })();
};

/* ══════════════════════════════════════════════════════════════
   PANE: COMMENTS (unchanged)
   ══════════════════════════════════════════════════════════════ */
function tdPaneComments(t) {
  return `
  <div class="tdp-inner">
    <div class="tdp-section-label">Comments & Updates</div>
    <div class="tdp-thread" id="tdp-thread-${t.id}">
      ${t._comments.map(c => tdCmtHTML(c)).join('')}
    </div>
    <div class="tdp-new-cmt">
      <span class="tdp-av tdp-self-av">YO</span>
      <div style="flex:1">
        <textarea class="tdp-input" id="tdp-cmt-${t.id}" rows="3"
                  placeholder="Add a comment, update, or question…"></textarea>
        <div style="display:flex;justify-content:flex-end;margin-top:8px">
          <button class="tdp-btn tdp-btn-primary" onclick="tdPostCmt('${t.id}')">Post Comment</button>
        </div>
      </div>
    </div>
  </div>`;
}

function tdCmtHTML(c) {
  return `
  <div class="tdp-cmt">
    <span class="tdp-av">${tdInitials(c.author)}</span>
    <div class="tdp-cmt-body">
      <div class="tdp-cmt-meta">
        <strong>${c.author}</strong>
        <span class="tdp-cmt-role">${c.role}</span>
        <span class="tdp-cmt-time">${c.time}</span>
      </div>
      <div class="tdp-cmt-text">${c.text}</div>
    </div>
  </div>`;
}

/* ── ACTION HANDLERS ──────────────────────────────────────────── */
window.tdSetStatus = function (sel, taskId) {
  const tasks = getTasks();
  const t = tasks.find(t => t.id === taskId); if (!t) return;
  t.status = sel.value;
  const c = ({ Complete: '#10b981', 'In Progress': '#f59e0b', Overdue: '#ef4444', Open: '#6366f1' })[sel.value] || '#64748b';
  sel.style.color = c; sel.style.borderColor = c + '44'; sel.style.background = c + '10';
  if (typeof showToast === 'function') showToast(`Status → "${sel.value}"`, 'success');
};

window.tdVerifyEv = function (evId, taskId) {
  const actions = getActions(taskId);
  actions.forEach(act => {
    const ev = (act.evidence || []).find(e => e.id === evId);
    if (ev) { ev.status = 'Verified'; if (typeof showToast === 'function') showToast('Marked Verified ✓', 'success'); }
  });
  tdSwitchTab('evidence');
};

window.tdPostCmt = function (taskId) {
  const tasks = getTasks();
  const t = tasks.find(t => t.id === taskId);
  const el = document.getElementById(`tdp-cmt-${taskId}`);
  const text = el?.value.trim();
  if (!text) { if (typeof showToast === 'function') showToast('Type something first', 'warning'); return; }
  const c = { author: 'You', role: 'Current User', time: 'just now', text };
  t._comments.push(c);
  const thread = document.getElementById(`tdp-thread-${taskId}`);
  if (thread) {
    const d = document.createElement('div');
    d.innerHTML = tdCmtHTML(c);
    const node = d.firstChild;
    node.style.animation = 'tdpCmt .22s ease';
    thread.appendChild(node);
    el.value = '';
    node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  if (typeof showToast === 'function') showToast('Comment posted', 'success');
};

/* ── WORKFLOW ACTION ROW HANDLERS ─────────────────────────────── */
window._tdArChange = function (taskId, sel) {
  const noteDisp = document.getElementById(`tdp-ar-note-disp-${taskId}`);
  if (!noteDisp) return;
  const notes = {
    'Ask for Clarification': { bg: '#fef9c3', color: '#854d0e', text: 'A clarification request will be sent. The obligation stays open until resolved.' },
    'Update': { bg: '#e0f2fe', color: '#0369a1', text: 'An update request will be sent to the selected person.' },
    'Ask for Closure': { bg: '#dcfce7', color: '#166534', text: 'A closure request will be sent to your reviewer for approval.' },
    'Ask for Open': { bg: '#ede9fe', color: '#5b21b6', text: 'The obligation will be re-opened and the selected person notified.' },
  };
  const n = notes[sel.value];
  if (n) { noteDisp.style.display = 'block'; noteDisp.style.background = n.bg; noteDisp.style.color = n.color; noteDisp.textContent = n.text; }
  else { noteDisp.style.display = 'none'; }

  if (document.body?.dataset?.userRole === 'assignee') {
    const personSel = document.getElementById(`tdp-ar-person-${taskId}`);
    if (!personSel) return;
    const t = getTasks().find(tk => tk.id === taskId) || {};
    if (sel.value === 'Ask for Closure') {
      personSel.innerHTML = `
        <option value="">— Select person —</option>
        <option value="Priya Sharma">SPOC: Priya Sharma</option>
        ${t.reviewer ? `<option value="${t.reviewer}">Reviewer: ${t.reviewer}</option>` : ''}
        ${t.owner    ? `<option value="${t.owner}">Owner / Approver: ${t.owner}</option>` : ''}
      `;
    } else {
      personSel.innerHTML = `
        <option value="">— Select person —</option>
        ${t.assignee ? `<option value="${t.assignee}">Assignee: ${t.assignee}</option>` : ''}
        ${t.reviewer ? `<option value="${t.reviewer}">Reviewer: ${t.reviewer}</option>` : ''}
        ${t.owner    ? `<option value="${t.owner}">Owner / Approver: ${t.owner}</option>` : ''}
      `;
    }
  }
};

function _tdApplyActionStatus(task, type) {
  const cfg = {
    'Send for Clarification': { label: '💬 Sent for Clarification', color: '#854d0e', bg: '#fef9c3', border: '#fde68a', icon: '💬', time: 'just now' },
    'Send for Closure':       { label: '✅ Sent for Closure',       color: '#166534', bg: '#dcfce7', border: '#86efac', icon: '✅', time: 'just now' },
    'Send for Recall':        { label: '🔁 Sent for Recall',        color: '#991b1b', bg: '#fee2e2', border: '#fca5a5', icon: '🔁', time: 'just now' },
    'Ask for Clarification':  { label: '💬 Sent for Clarification', color: '#854d0e', bg: '#fef9c3', border: '#fde68a', icon: '💬', time: 'just now' },
    'Ask for Closure':        { label: '✅ Sent for Closure',       color: '#166534', bg: '#dcfce7', border: '#86efac', icon: '✅', time: 'just now' },
    'Ask for Recall':         { label: '🔁 Sent for Recall',        color: '#991b1b', bg: '#fee2e2', border: '#fca5a5', icon: '🔁', time: 'just now' },
  };
  task._actionStatus = cfg[type] || { label: type, color: '#475569', bg: '#f1f5f9', border: '#e2e8f0', icon: '→', time: 'just now' };

  /* update inline badges if visible */
  const badge = document.getElementById(`tdp-obl-action-badge-${task.id}`);
  if (badge) { badge.textContent = task._actionStatus.label; badge.style.color = task._actionStatus.color; }
}

window._tdQuickAction = function(taskId, type) {
  const task = getTasks().find(t => t.id === taskId); if (!task) return;
  _tdApplyActionStatus(task, type);
  if (typeof showToast === 'function') showToast(`"${type}" applied ✓`, 'success');
  /* refresh overview banner */
  tdSwitchTab('overview');
};

window._tdArSubmit = function (taskId) {
  const type = document.getElementById(`tdp-ar-type-${taskId}`)?.value;
  const person = document.getElementById(`tdp-ar-person-${taskId}`)?.value;
  if (!type) { if (typeof showToast === 'function') showToast('Select a request type', 'warning'); return; }
  if (!person) { if (typeof showToast === 'function') showToast('Select a person to send to', 'warning'); return; }

  /* apply action status to task */
  const task = getTasks().find(t => t.id === taskId);
  if (task) _tdApplyActionStatus(task, type);

  if (typeof showToast === 'function') showToast(`"${type}" sent to ${person} ✓`, 'success');
  document.getElementById(`tdp-ar-type-${taskId}`).value = '';
  document.getElementById(`tdp-ar-person-${taskId}`).value = '';
  const note = document.getElementById(`tdp-ar-note-${taskId}`); if (note) note.value = '';
  const disp = document.getElementById(`tdp-ar-note-disp-${taskId}`); if (disp) disp.style.display = 'none';

  /* re-render to show banner */
  tdSwitchTab('overview');
};

/* evidence attach with score popup in overview */
window._tdArAttachWithScore = function(input, taskId) {
  const file = input.files[0]; if (!file) return;
  const list = document.getElementById(`tdp-ar-attach-list-${taskId}`);
  if (list) {
    const chip = document.createElement('div');
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;font-size:12px;font-weight:600;color:#334155;';
    chip.innerHTML = `${tdFIcon(file.name)} ${file.name} <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;line-height:1;">×</button>`;
    list.appendChild(chip);
  }
  /* show AI score popup */
  const aiScore = Math.floor(60 + Math.random() * 38);
  const scoreLabel = aiScore >= 90 ? 'Excellent' : aiScore >= 75 ? 'Strong' : aiScore >= 60 ? 'Good' : 'Moderate';
  const scoreColor = aiScore >= 80 ? '#15803d' : aiScore >= 60 ? '#b45309' : '#dc2626';
  const toastDiv = document.createElement('div');
  toastDiv.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:9999;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;padding:16px 20px;box-shadow:0 8px 28px rgba(0,0,0,.14);max-width:320px;animation:tdpIn .22s ease;display:flex;flex-direction:column;gap:8px;`;
  toastDiv.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:46px;height:46px;border-radius:50%;background:${aiScore>=80?'#dcfce7':aiScore>=60?'#fef9c3':'#fee2e2'};border:2px solid ${scoreColor};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:${scoreColor};flex-shrink:0;">${aiScore}</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#1e293b;">Evidence Attached ✓</div>
        <div style="font-size:11px;color:${scoreColor};font-weight:700;">AI Relevance Score: ${aiScore}/100 — ${scoreLabel}</div>
      </div>
    </div>
    <div style="height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${aiScore}%;background:${scoreColor};border-radius:99px;"></div>
    </div>
    <div style="font-size:11px;color:#64748b;line-height:1.5;">${aiScore>=75?'Strong alignment detected.':'Some gaps identified — consider additional supporting documents.'}</div>`;
  document.body.appendChild(toastDiv);
  setTimeout(() => toastDiv.remove(), 6000);
};

/* ── HELPERS ──────────────────────────────────────────────────── */
function tdr(lbl, val) {
  return `<div class="tdp-drow">
    <span class="tdp-dlbl">${lbl}</span>
    <span class="tdp-dval">${val}</span>
  </div>`;
}

function tdProg(lbl, done, total) {
  const pct = total ? Math.round(done / total * 100) : 100;
  const color = pct === 100 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return `
  <div class="tdp-pi">
    <div class="tdp-pi-top">
      <span class="tdp-pi-lbl">${lbl}</span>
      <span style="font-size:13px;font-weight:700;color:${color}">${done}/${total}</span>
    </div>
    <div class="tdp-pi-track">
      <div style="height:100%;border-radius:99px;background:${color};width:${pct}%;transition:width .4s"></div>
    </div>
  </div>`;
}

function tdInitials(n) { return (n || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
function tdFIcon(f = '') {
  const e = (f.split('.').pop() || '').toLowerCase();
  return ({ pdf: '📄', zip: '🗜', xlsx: '📊', xls: '📊', docx: '📝', doc: '📝', png: '🖼', jpg: '🖼' })[e] || '📄';
}
function tdFmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── STYLES (same as original + additions for stepper, lineage, clause block) ── */
function tdInjectStyles() {
  if (document.getElementById('tdp-styles')) return;
  const s = document.createElement('style');
  s.id = 'tdp-styles';
  s.textContent = `
  @keyframes tdpIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes tdpCmt { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .tds-full { width:100%; min-height:100%; }
  .tdp-wrap { display:flex;flex-direction:column;min-height:100vh;font-family:'DM Sans',sans-serif; }

  /* HEADER */
  .tdp-header { padding:20px 22px 0;border-bottom:1px solid var(--border,#e2e8f0);background:#fff;position:sticky;top:0;z-index:20;box-shadow:0 1px 6px rgba(0,0,0,.06); }
  .tdp-hrow { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px; }
  .tdp-bc { align-items:center;gap:6px;font-size:13px;margin-bottom:6px; }
  .tdp-back { color:#6366f1;font-weight:700;cursor:pointer;font-size:14px; }
  .tdp-back:hover { text-decoration:underline; }
  .tdp-bc-sep { color:#cbd5e1; }
  .tdp-bc-id  { font-family:monospace;font-size:12px;color:#94a3b8; }
  .tdp-bc-circ { font-family:monospace;font-size:12px;color:#6366f1;cursor:pointer;font-weight:700; }
  .tdp-bc-circ:hover { text-decoration:underline; }
  .tdp-title { font-size:20px;font-weight:800;color:var(--text-primary,#0f172a);line-height:1.3; }
  .tdp-x { flex-shrink:0;background:transparent;border:1px solid var(--border,#e2e8f0);color:#94a3b8;border-radius:7px;width:32px;height:32px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .15s; }
  .tdp-x:hover { background:#fee2e2;color:#ef4444;border-color:#fca5a5; }
  .tdp-hdr-btn { padding:6px 12px;background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:7px;font-family:inherit;font-size:11px;font-weight:600;color:#475569;cursor:pointer;transition:all .14s;white-space:nowrap; }
  .tdp-hdr-btn:hover { border-color:#6366f1;color:#6366f1;background:#eef2ff; }
  .tdp-chips { display:flex;gap:7px;flex-wrap:wrap;align-items:center;padding-bottom:12px; }
  .tdp-chip { font-size:12px;font-weight:700;padding:4px 11px;border-radius:99px;border:1px solid transparent; }
  .tdp-ch-blue { background:#eef2ff;color:#4338ca;border-color:#c7d2fe; }
  .tdp-ch-grey { background:#f1f5f9;color:#64748b;border-color:#e2e8f0; }
  .tdp-ch-mono { background:#f1f5f9;color:#64748b;border-color:#e2e8f0;font-family:monospace;font-size:11px;max-width:500px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .tdp-circ-clickable { cursor:pointer; } .tdp-circ-clickable:hover { text-decoration:underline; }
  .tdp-st-sel { font-size:13px;font-weight:700;padding:4px 10px;border-radius:7px;border:1.5px solid;cursor:pointer;outline:none;font-family:inherit;transition:all .15s; }

  /* WORKFLOW STEPPER */
  .tdp-wf-stepper { display:flex;align-items:center;padding:10px 0 14px;gap:0; }
  .tdp-wf-step { display:flex;flex-direction:column;align-items:center;gap:4px; }
  .tdp-wf-dot-circle { width:24px;height:24px;border-radius:50%;background:#e2e8f0;color:#94a3b8;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid #e2e8f0;transition:all .2s; }
  .tdp-wf-step.done .tdp-wf-dot-circle { background:#6366f1;border-color:#6366f1;color:#fff; }
  .tdp-wf-step.current .tdp-wf-dot-circle { background:#6366f1;border-color:#6366f1;color:#fff;box-shadow:0 0 0 4px #eef2ff; }
  .tdp-wf-step-lbl { font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap; }
  .tdp-wf-step.done .tdp-wf-step-lbl,.tdp-wf-step.current .tdp-wf-step-lbl { color:#6366f1; }
  .tdp-wf-connector { flex:1;height:2px;background:#e2e8f0;min-width:16px;transition:background .2s; }
  .tdp-wf-connector.done { background:#6366f1; }

  /* INFO MODAL */
.tdp-info-section-lbl {
  font-size: 10px; font-weight: 800; text-transform: uppercase;
  letter-spacing: .08em; color: #94a3b8; margin-bottom: 12px;
  padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;
}
.tdp-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}
.tdp-info-row {
  display: flex; flex-direction: column; gap: 3px;
  padding: 9px 10px; border-radius: 7px; transition: background .1s;
}
.tdp-info-row:hover { background: #f8fafc; }
.tdp-info-lbl {
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .06em;
}
.tdp-info-val {
  font-size: 13px; font-weight: 500; color: #0f172a; line-height: 1.5;
}


  /* BODY */
  .tdp-body { display:flex;flex:1;min-height:0; }
  .tdp-vtabs { width:84px;flex-shrink:0;display:flex;flex-direction:column;gap:2px;padding:14px 6px;border-right:1px solid var(--border,#e2e8f0);background:#f8fafc; }
  .tdp-vtab { display:flex;flex-direction:column;align-items:center;gap:4px;padding:11px 4px;border-radius:8px;border:none;background:transparent;cursor:pointer;color:#1e293b;font-family:inherit;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;transition:all .15s;text-align:center; }
  .tdp-vtab:hover { background:#e2e8f0;color:#1e293b; }
  .tdp-vtab.active { background:#1e293b;color:#fff; }
  .tdp-vt-icon { font-size:18px;line-height:1; }
  .tdp-vt-lbl { line-height:1.2;font-size:10px; }
  .tdp-pane { flex:1;overflow-y:auto;animation:tdpIn .2s ease;background:#fafbff; }
  .tdp-pane::-webkit-scrollbar { width:4px; } .tdp-pane::-webkit-scrollbar-thumb { background:#e2e8f0;border-radius:99px; }
  .tdp-inner { padding:22px 24px 48px; }

  /* TYPOGRAPHY */
  .tdp-section-label { font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:14px;display:flex;align-items:center;gap:10px; }
  .tdp-section-label::after { content:'';flex:1;height:1px;background:var(--border,#e2e8f0); }

  /* DETAIL LIST */
  .tdp-dl { display:flex;flex-direction:column;gap:2px; }
  .tdp-drow { display:flex;align-items:baseline;gap:12px;padding:8px 10px;border-radius:7px;transition:background .1s; }
  .tdp-drow:hover { background:#f1f5f9; }
  .tdp-dlbl { font-size:12px;font-weight:700;color:#94a3b8;min-width:110px;flex-shrink:0; }
  .tdp-dval { font-size:14px;font-weight:500;color:var(--text-primary,#0f172a); }
  .tdp-link { color:#6366f1;cursor:pointer;font-weight:600; } .tdp-link:hover { text-decoration:underline; }
  .tdp-code { font-family:monospace;font-size:12px;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;padding:2px 8px;border-radius:5px; }

  /* CLAUSE BLOCK */
  .tdp-clause-block { background:#eef2ff;border:1px solid #c7d2fe;border-left:4px solid #6366f1;border-radius:8px;padding:14px 16px;margin-bottom:4px; }
  .tdp-clause-label { font-size:10px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px; }
  .tdp-clause-text  { font-size:13.5px;font-weight:500;color:#0f172a;line-height:1.7; }

  /* PROGRESS STRIP */
  .tdp-prog-strip { display:grid;grid-template-columns:repeat(2,1fr);gap:12px;background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:10px;padding:16px; }
  .tdp-pi-top { display:flex;justify-content:space-between;margin-bottom:6px; }
  .tdp-pi-lbl { font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8; }
  .tdp-pi-track { height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden; }

  /* TABLE */
  .tdp-tbl-wrap { overflow-x:auto;border:1px solid var(--border,#e2e8f0);border-radius:10px;background:#fff; }
  .tdp-tbl { width:100%;border-collapse:collapse;font-size:14px; }
  .tdp-tbl thead tr { background:#f8fafc; }
  .tdp-tbl th { padding:11px 14px;text-align:left;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid var(--border,#e2e8f0);white-space:nowrap; }
  .tdp-tbl td { padding:12px 14px;border-bottom:1px solid #f1f5f9;color:var(--text-primary,#0f172a);vertical-align:middle; }
  .tdp-tbl tbody tr:last-child td { border-bottom:none; }
  .tdp-tbl tbody tr:hover td { background:#f8fafc; }
  .tdp-ev-type-chip { font-size:11px;font-weight:600;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:2px 8px;border-radius:5px; }
  .tdp-ev-chip { font-size:11px;font-weight:700;padding:3px 9px;border-radius:99px; }

  /* OB ID in title */
  .tdp-title-oblid { font-family:monospace;font-size:13px;font-weight:700;color:#6366f1;background:#eef2ff;border:1px solid #c7d2fe;padding:2px 8px;border-radius:5px;margin-right:8px;vertical-align:middle; }

  /* CLAUSE BLOCK */
  .tdp-clause-block { background:#eef2ff;border:1px solid #c7d2fe;border-left:4px solid #6366f1;border-radius:8px;padding:14px 16px;margin-bottom:4px; }
  .tdp-clause-label { font-size:10px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px; }
  .tdp-clause-text  { font-size:13.5px;font-weight:500;color:#0f172a;line-height:1.7; }

  /* DOC ROW */
  .tdp-doc-row { display:flex;flex-direction:column;gap:8px; }
  .tdp-doc-card { display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:8px; }
  .tdp-doc-icon { font-size:22px;flex-shrink:0; }
  .tdp-doc-info { flex:1;min-width:0; }
  .tdp-doc-name { font-size:13px;font-weight:600;color:#0f172a; }
  .tdp-doc-meta { font-size:11px;color:#94a3b8;margin-top:2px; }

  /* WORKFLOW ACTION ROW */
  .tdp-action-row-card { background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:10px;overflow:hidden; }
  .tdp-action-row-inner { display:flex;align-items:flex-end;gap:12px;padding:14px 16px;flex-wrap:wrap; }
  .tdp-ar-field { display:flex;flex-direction:column;gap:5px;min-width:160px; }
  .tdp-ar-field-grow { flex:1; }
  .tdp-ar-label { font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em; }
  .tdp-ar-sel   { min-width:160px; }
  .tdp-ar-status-note { padding:10px 16px;font-size:12px;line-height:1.55;border-top:1px solid var(--border,#e2e8f0); }

  /* WORKFLOW DETAILS CARD */
  .tdp-wf-details-card { background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:10px;padding:16px 18px;display:flex;flex-direction:column;gap:16px; }
  .tdp-wfd-top { display:flex;align-items:center;gap:20px;flex-wrap:wrap; }

  /* Level box */
  .tdp-wf-level-box { display:flex;flex-direction:column;align-items:center;gap:2px;padding:14px 20px;background:#eef2ff;border:1.5px solid #c7d2fe;border-radius:10px;min-width:90px;flex-shrink:0; }
  .tdp-wfl-label { font-size:9px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.08em; }
  .tdp-wfl-num   { font-size:32px;font-weight:800;color:#4338ca;line-height:1; }
  .tdp-wfl-stage { font-size:11px;font-weight:600;color:#6366f1; }

  /* Inline stepper */
  .tdp-wf-stepper-inline { display:flex;align-items:center;flex:1;gap:0; }
  .tdp-wfi-step { display:flex;flex-direction:column;align-items:center;gap:4px; }
  .tdp-wfi-dot  { width:26px;height:26px;border-radius:50%;background:#e2e8f0;color:#94a3b8;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid #e2e8f0;transition:all .2s; }
  .tdp-wfi-step.done .tdp-wfi-dot    { background:#6366f1;border-color:#6366f1;color:#fff; }
  .tdp-wfi-step.current .tdp-wfi-dot { background:#6366f1;border-color:#6366f1;color:#fff;box-shadow:0 0 0 4px #eef2ff; }
  .tdp-wfi-lbl  { font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap; }
  .tdp-wfi-step.done .tdp-wfi-lbl,.tdp-wfi-step.current .tdp-wfi-lbl { color:#6366f1; }
  .tdp-wfi-line { flex:1;height:2px;background:#e2e8f0;min-width:12px;transition:background .2s; }
  .tdp-wfi-line.done { background:#6366f1; }

  /* Workflow people */
  .tdp-wf-people { display:flex;gap:10px;flex-wrap:wrap; }
  .tdp-wfp-card  { display:flex;align-items:center;gap:10px;padding:10px 14px;background:#f8fafc;border:1px solid var(--border,#e2e8f0);border-radius:8px;flex:1;min-width:150px; }
  .tdp-wfp-info  { display:flex;flex-direction:column;gap:2px; }
  .tdp-wfp-role  { font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em; }
  .tdp-wfp-name  { font-size:13px;font-weight:600;color:#0f172a; }
  .tdp-thread { display:flex;flex-direction:column;gap:14px;margin-bottom:18px; }
  .tdp-cmt { display:flex;gap:12px;align-items:flex-start; }
  .tdp-cmt-body { flex:1;background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:4px 12px 12px 12px;padding:12px 14px; }
  .tdp-cmt-meta { display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap; }
  .tdp-cmt-meta strong { font-size:14px;font-weight:700; }
  .tdp-cmt-role { font-size:12px;color:#94a3b8; }
  .tdp-cmt-time { font-size:12px;color:#cbd5e1;margin-left:auto; }
  .tdp-cmt-text { font-size:14px;color:#475569;line-height:1.6; }
  .tdp-new-cmt { display:flex;gap:12px;align-items:flex-start;padding-top:14px;border-top:1px solid var(--border,#e2e8f0); }
  .tdp-av { width:28px;height:28px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #c7d2fe; }
  .tdp-self-av { background:#1e293b;color:#fff;border-color:#1e293b; }

  /* BUTTONS */
  .tdp-btn { display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-size:14px;font-weight:600;padding:9px 18px;border-radius:8px;border:none;cursor:pointer;transition:all .15s;white-space:nowrap; }
  .tdp-btn-primary { background:#6366f1;color:#fff; } .tdp-btn-primary:hover { background:#4f46e5; }
  .tdp-btn-ghost { background:#fff;color:#475569;border:1px solid var(--border,#e2e8f0); } .tdp-btn-ghost:hover { background:#f8fafc; }
  .tdp-btn-success { background:#dcfce7;color:#166534;border:1px solid #86efac; } .tdp-btn-success:hover { background:#bbf7d0; }
  .tdp-btn-sm { padding:6px 12px;font-size:12px; }
  .tdp-btn-xs { padding:4px 9px;font-size:11px; }
  .tdp-input { background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:8px;color:var(--text-primary,#0f172a);font-family:inherit;font-size:14px;padding:9px 12px;outline:none;width:100%;transition:border-color .18s,box-shadow .18s; }
  .tdp-input:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1); }
  textarea.tdp-input { resize:vertical;min-height:72px; }
  .tdp-empty { text-align:center;padding:40px 20px;color:#94a3b8; } .tdp-empty p { font-size:14px;line-height:1.7; }

  /* LINEAGE DIALOG */
  .tdp-lineage-overlay { position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(3px);z-index:9000;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease; }
  .tdp-lineage-modal { background:#fff;border-radius:14px;width:100%;max-width:560px;box-shadow:0 24px 64px rgba(15,23,42,.25);display:flex;flex-direction:column;overflow:hidden;max-height:90vh; }
  .tdp-lineage-head { display:flex;align-items:flex-start;justify-content:space-between;padding:20px 22px 16px;border-bottom:1px solid var(--border,#e2e8f0);background:#f8fafc; }
  .tdp-lineage-eyebrow { font-size:10px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px; }
  .tdp-lineage-title { font-size:14px;font-weight:800;color:#0f172a;line-height:1.4; }
  .tdp-lineage-body { display:flex;gap:20px;padding:22px;overflow-y:auto; }
  .tdp-ln-chain { display:flex;flex-direction:column;align-items:center;gap:0;flex:1; }
  .tdp-ln-node { width:100%;padding:12px 16px;border-radius:8px;border:1.5px solid var(--border,#e2e8f0);background:#fafbff;display:flex;flex-direction:column;gap:4px; }
  .tdp-ln-circ   { border-color:#c7d2fe;background:#eef2ff; }
  .tdp-ln-clause { border-color:#fcd34d;background:#fef9c3; }
  .tdp-ln-obl    { border-color:#e2e8f0;background:#fafbff; }
  .tdp-ln-assign { border-color:#6ee7b7;background:#dcfce7; }
  .tdp-ln-active { border-color:#6366f1!important;background:#eef2ff!important;box-shadow:0 0 0 3px rgba(99,102,241,.12); }
  .tdp-ln-type { font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8; }
  .tdp-ln-id   { font-family:monospace;font-size:13px;font-weight:700;color:#0f172a; }
  .tdp-ln-desc { font-size:11px;color:#475569;line-height:1.4; }
  .tdp-ln-arrow { font-size:18px;color:#e2e8f0;padding:4px 0; }
  .tdp-ln-meta { display:flex;flex-direction:column;gap:10px;min-width:130px;background:#f8fafc;border-radius:8px;padding:14px;border:1px solid var(--border,#e2e8f0);align-self:flex-start; }
  .tdp-ln-meta-row { display:flex;flex-direction:column;gap:2px; }
  .tdp-ln-meta-lbl { font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em; }
  .tdp-ln-meta-val { font-size:12px;font-weight:600;color:#0f172a; }
  .tdp-lineage-foot { display:flex;gap:8px;justify-content:flex-end;padding:14px 22px;border-top:1px solid var(--border,#e2e8f0);background:#f8fafc; }


  /* WORKFLOW STEPPER WITH PEOPLE */
.tdp-wf-stepper-people {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 8px 0 4px;
}
.tdp-wfsp-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  min-width: 100px;
}
.tdp-wfsp-connector {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  align-self: 24px;
  margin-top: 22px;
  min-width: 12px;
  transition: background .2s;
}
.tdp-wfsp-connector.done { background: #6366f1; }

.tdp-wfsp-dot {
  width: 28px; height: 28px; border-radius: 50%;
  background: #e2e8f0; color: #94a3b8;
  font-size: 11px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #e2e8f0; transition: all .2s;
}
.tdp-wfsp-col.done .tdp-wfsp-dot    { background: #6366f1; border-color: #6366f1; color: #fff; }
.tdp-wfsp-col.current .tdp-wfsp-dot { background: #6366f1; border-color: #6366f1; color: #fff; box-shadow: 0 0 0 4px #eef2ff; }

.tdp-wfsp-step-lbl {
  font-size: 9px; font-weight: 800; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .06em; white-space: nowrap;
}
.tdp-wfsp-col.done .tdp-wfsp-step-lbl,
.tdp-wfsp-col.current .tdp-wfsp-step-lbl { color: #6366f1; }

.tdp-wfsp-person-card {
  display: flex; align-items: center; gap: 8px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 8px; padding: 8px 10px;
  margin-top: 4px; width: 100%; box-sizing: border-box;
}
.tdp-wfsp-col.current .tdp-wfsp-person-card { border-color: #c7d2fe; background: #eef2ff; }

.tdp-av-sm { width: 24px; height: 24px; font-size: 8px; flex-shrink: 0; }

.tdp-wfsp-role { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
.tdp-wfsp-name { font-size: 12px; font-weight: 700; color: #0f172a; line-height: 1.3; }
.tdp-wfsp-dept { font-size: 10px; color: #94a3b8; margin-top: 1px; }


  @media (max-width:820px) {
    .tdp-lineage-body { flex-direction:column; }
  }
  `;
  document.head.appendChild(s);
}