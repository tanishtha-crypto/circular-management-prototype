/**
 * assign-obligation.js — CXO Obligation Assignment Screen  v3
 *
 * Changes:
 *  - Section level added between Chapter and Clause
 *  - Table columns: OB ID · Dept · Assignee · Due Date · Priority · Status
 *  - Right drawer: View more details → circular reference table
 *  - Bulk assign dept dropdown: readable dark text
 */

const AO_DEPTS = ['Compliance', 'Risk', 'Legal', 'IT', 'Operations', 'HR', 'Finance'];
const IS_SPOC = document.body.dataset.userRole === 'spoc';
const SPOC_DEPT_LIST = window.SPOC_PROFILE?.departments || [];
const AO_PEOPLE = {
  Compliance: ['Sneha Das', 'Meera Pillai', 'Arjun Kumar', 'Ravi Menon'],
  Risk: ['Anand Krishnan', 'Neha Rao', 'Vikram Singh', 'Pooja Shah'],
  Legal: ['Priya Nair', 'Suresh Iyer', 'Kavitha Reddy'],
  IT: ['Raj Iyer', 'Sanjay Mehta', 'Divya Nair', 'Arun Thomas'],
  Operations: ['Suresh Kumar', 'Lakshmi Rao', 'Rohit Gupta'],
  HR: ['Priya Sharma', 'Aditya Patel', 'Reshma Nair'],
  Finance: ['Rahul Verma', 'Shalini Menon', 'Kiran Bhat'],
};

/* ── DATA ── */
function _aoGetData(circId) {
  const base = [
    {
      chapterId: 'CH-1', chapterTitle: 'Chapter 1', chapterSub: 'Governance & Policy',
      sections: [
        {
          sectionId: 'S1.1', sectionTitle: 'Compliance Policy Framework',
          clauses: [
            {
              clauseId: 'C1.1', clauseText: 'The entity shall establish and maintain a Board-approved compliance policy framework.',
              obligations: [
                { id: 'OB-001', text: 'Establish and maintain a Board-approved compliance policy covering all aspects of this circular, reviewed at least annually.', dept: null, assignee: null, dueDate: '2025-06-15', priority: 'High', status: 'Unassigned' },
                { id: 'OB-002', text: 'Distribute the approved policy to all relevant departments and obtain signed acknowledgement from department heads within 30 days.', dept: null, assignee: null, dueDate: '2025-06-30', priority: 'Medium', status: 'Unassigned' },
              ]
            },
            {
              clauseId: 'C1.2', clauseText: 'A designated Compliance Officer shall be appointed with Board-level reporting.',
              obligations: [
                { id: 'OB-003', text: 'Appoint a designated Compliance Officer with direct reporting line to the Board Audit Committee.', dept: 'Compliance', assignee: 'Sneha Das', dueDate: '2025-04-30', priority: 'Critical', status: 'Assigned' },
                { id: 'OB-004', text: 'Define and document the Compliance Officer mandate including scope, authority and escalation rights.', dept: null, assignee: null, dueDate: '2025-05-20', priority: 'High', status: 'Unassigned' },
              ]
            },
          ]
        },
        {
          sectionId: 'S1.2', sectionTitle: 'Committee & Governance',
          clauses: [
            {
              clauseId: 'C1.3', clauseText: 'Compliance Committee shall meet quarterly and submit minutes to the regulator.',
              obligations: [
                { id: 'OB-005', text: 'Conduct Compliance Committee meetings at least quarterly with minutes submitted to the regulator within 15 days of each meeting.', dept: null, assignee: null, dueDate: '2025-07-01', priority: 'Medium', status: 'Unassigned' },
              ]
            },
          ]
        },
      ]
    },
    {
      chapterId: 'CH-2', chapterTitle: 'Chapter 2', chapterSub: 'Operational Requirements',
      sections: [
        {
          sectionId: 'S2.1', sectionTitle: 'Process & Systems',
          clauses: [
            {
              clauseId: 'C2.1', clauseText: 'All customer-facing processes must reflect updated regulatory requirements within 30 days.',
              obligations: [
                { id: 'OB-006', text: 'Update all customer-facing processes to reflect new regulatory requirements within 30 days of the effective date.', dept: 'Operations', assignee: 'Suresh Kumar', dueDate: '2025-05-15', priority: 'High', status: 'Acknowledged' },
                { id: 'OB-007', text: 'Train all frontline staff on updated processes and maintain signed acknowledgement records for audit purposes.', dept: null, assignee: null, dueDate: '2025-05-31', priority: 'Medium', status: 'Unassigned' },
              ]
            },
            {
              clauseId: 'C2.2', clauseText: 'Transaction monitoring systems shall detect and report suspicious activity in real-time.',
              obligations: [
                { id: 'OB-008', text: 'Upgrade transaction monitoring systems to detect and report suspicious activity in real-time with a maximum alert latency of 5 seconds.', dept: null, assignee: null, dueDate: '2025-08-01', priority: 'Critical', status: 'Unassigned' },
              ]
            },
          ]
        },
        {
          sectionId: 'S2.2', sectionTitle: 'Business Continuity',
          clauses: [
            {
              clauseId: 'C2.3', clauseText: 'Business Continuity Plan for critical compliance systems must be tested semi-annually.',
              obligations: [
                { id: 'OB-009', text: 'Test and update the Business Continuity Plan covering all critical compliance systems on a semi-annual basis with documented test results.', dept: 'IT', assignee: 'Raj Iyer', dueDate: '2025-06-01', priority: 'Medium', status: 'Assigned' },
              ]
            },
          ]
        },
      ]
    },
    {
      chapterId: 'CH-3', chapterTitle: 'Chapter 3', chapterSub: 'Reporting & Disclosure',
      sections: [
        {
          sectionId: 'S3.1', sectionTitle: 'Regulatory Submissions',
          clauses: [
            {
              clauseId: 'C3.1', clauseText: 'Monthly compliance status reports shall be submitted to the regulator by the 7th of each month.',
              obligations: [
                { id: 'OB-010', text: 'Submit monthly compliance status reports to the regulator in the prescribed format by the 7th of each calendar month without exception.', dept: null, assignee: null, dueDate: '2025-05-07', priority: 'High', status: 'Unassigned' },
                { id: 'OB-011', text: 'Maintain an internal compliance reporting log with maker-checker controls for all regulatory submissions.', dept: null, assignee: null, dueDate: '2025-05-20', priority: 'Medium', status: 'Unassigned' },
              ]
            },
          ]
        },
        {
          sectionId: 'S3.2', sectionTitle: 'Audit & Breach Reporting',
          clauses: [
            {
              clauseId: 'C3.2', clauseText: 'Annual third-party audit of compliance infrastructure, findings to Board within 30 days.',
              obligations: [
                { id: 'OB-012', text: 'Commission an annual third-party audit of the compliance infrastructure and present findings to the Board within 30 days of audit completion.', dept: 'Risk', assignee: 'Anand Krishnan', dueDate: '2025-07-31', priority: 'High', status: 'Assigned' },
              ]
            },
            {
              clauseId: 'C3.3', clauseText: 'Material breaches must be reported to the regulator within 24 hours.',
              obligations: [
                { id: 'OB-013', text: 'Report material breaches or near-misses to the regulator within 24 hours of identification, followed by a full incident report within 7 days.', dept: null, assignee: null, dueDate: '2025-04-25', priority: 'Critical', status: 'Unassigned' },
              ]
            },
          ]
        },
      ]
    },
    {
      chapterId: 'CH-4', chapterTitle: 'Chapter 4', chapterSub: 'Technology & Systems',
      sections: [
        {
          sectionId: 'S4.1', sectionTitle: 'Data Security & Access',
          clauses: [
            {
              clauseId: 'C4.1', clauseText: 'All data encryption must comply with AES-256 standards across all systems.',
              obligations: [
                { id: 'OB-014', text: 'Ensure all data encryption at rest and in transit complies with AES-256 standards across all customer-facing and internal compliance systems.', dept: 'IT', assignee: null, dueDate: '2025-05-30', priority: 'High', status: 'Assigned' },
              ]
            },
            {
              clauseId: 'C4.2', clauseText: 'Access control matrix for compliance-sensitive functions must be quarterly recertified by CISO.',
              obligations: [
                { id: 'OB-015', text: 'Review and recertify the access control matrix for all compliance-sensitive functions on a quarterly basis, signed off by the CISO.', dept: null, assignee: null, dueDate: '2025-06-30', priority: 'Medium', status: 'Unassigned' },
              ]
            },
          ]
        },
      ]
    },
  ];
  if (!window._aoData) window._aoData = {};
  if (!window._aoData[circId]) window._aoData[circId] = JSON.parse(JSON.stringify(base));
  return window._aoData[circId];
}

function _aoAllObligs(circId) {
  return _aoGetData(circId).flatMap(ch => ch.sections.flatMap(s => s.clauses.flatMap(cl => cl.obligations)));
}

/* ── CIRCULAR REF META ── */
function _aoCircMeta(circId) {
  return {
    circularRef: circId,
    regulator: 'RBI',
    issueDate: '01 Apr 2024',
    effectiveDate: '01 Jul 2024',
    dueDate: '31 Mar 2025',
    legalArea: 'Banking Regulation',
    subLegalArea: 'Prudential Norms',
    act: 'Banking Regulation Act 1949',
    section: 'Section 12',
    subsection: 'Clause (a)',
    frequency: 'Monthly',
    regulatoryBody: 'Reserve Bank of India',
    category: 'Mandatory Compliance',
    type: 'Master Direction',
    docUrl: '#',
    docName: 'RBI_Master_Direction_2024.pdf',
  };
}

/* ── MAIN RENDER ── */
window.renderAssignObligation = function(circId, activeTab = 'activities') {
  const area = document.getElementById('content-area');
  if (!area) return;
  _aoInjectStyles();
  const circs = (typeof CMS_DATA !== 'undefined' && CMS_DATA.circulars) ? CMS_DATA.circulars : [
    { id: 'CIRC-001', title: 'Cybersecurity Framework for Regulated Entities', regulator: 'RBI', risk: 'High' },
    { id: 'CIRC-002', title: 'Enhanced KYC & AML Compliance Directive', regulator: 'SEBI', risk: 'High' },
    { id: 'CIRC-003', title: 'Operational Risk Management Guidelines', regulator: 'RBI', risk: 'Medium' },
    { id: 'CIRC-004', title: 'Data Localisation & Privacy Compliance Requirements', regulator: 'MCA', risk: 'Medium' },
    { id: 'CIRC-005', title: 'Third-Party & Vendor Risk Management Framework', regulator: 'IRDAI', risk: 'High' },
  ];
  const activeId = circId || circs[0]?.id || 'CIRC-001';
  const activeCirc = circs.find(c => c.id === activeId) || circs[0];
  area.innerHTML = _aoBuildPage(circs, activeCirc, activeTab);
  _aoBindAll(activeCirc.id);
};

/* ── TABLE HEADER (used inside each chapter) ── */
function _aoTableHeader() {
  return `<tr class="ao-inner-thead">
    ${IS_SPOC ? '' : '<th class="ao-th-chk"></th>'}
    <th>OB ID</th>
    <th class="ao-th-text">Obligation</th>
    <th>Department</th>
    <th>Assignee</th>
    <th>Due Date</th>
    <th>Status</th>
    <th></th>
  </tr>`;
}

/* ── PAGE SHELL ── */
function _aoBuildPage(circs, activeCirc, activeTab = 'obligation')  {
  const chapters = _aoGetData(activeCirc.id);
  const allObligs = _aoAllObligs(activeCirc.id);
  const total = allObligs.length;
  const assigned = allObligs.filter(o => o.status !== 'Unassigned').length;
  const unassigned = total - assigned;
  const critical = allObligs.filter(o => o.priority === 'Critical' && o.status === 'Unassigned').length;
  const pct = total ? Math.round(assigned / total * 100) : 0;

  return `<div class="ao-page" id="ao-page">
  <div class="ao-overlay" id="ao-overlay" style="display:none;" onclick="_aoOverlayClick(event)">
    <div class="ao-drawer" id="ao-drawer"><div id="ao-drawer-content"></div></div>
  </div>
  <div class="ao-wrap">
    <div class="ao-page-head">
      <div class="ao-head-left">
        <div class="ao-head-eyebrow">CXO Assignment Console</div>
        <div class="ao-head-title">Obligation Assignment</div>
        <div class="ao-head-sub">Chapter → Section → Clause → Obligation</div>
      </div>
      <div class="ao-head-right">
        <button class="ao-btn ao-btn-ghost" onclick="window.history.back()">← Back</button>
        <button class="ao-btn ao-btn-pri" onclick="_aoSaveAll('${activeCirc.id}')">💾 this is  Save All</button>
      
      </div>
    </div>

    <div class="ao-circ-card">
      <div class="ao-circ-left">
        <div class="ao-circ-label">Circular</div>
        <div class="ao-custom-sel-wrap" id="ao-csel-wrap">
          <button class="ao-custom-sel-btn" id="ao-csel-btn">
            <div class="ao-csel-inner">
              <span class="ao-csel-id" onclick="_aoGoToAISuggestion('${activeCirc.id}'); event.stopPropagation();" title="View AI Suggestions">${activeCirc.id}</span>
              <span class="ao-csel-title">${activeCirc.title}</span>
              <span class="ao-csel-reg">${activeCirc.regulator || ''}</span>
            </div>
            <span class="ao-csel-arr">▾</span>
          </button>
          <div class="ao-csel-drop" id="ao-csel-drop" style="display:none;">
            <input class="ao-csel-search" id="ao-csel-search" placeholder="Search circulars…" autocomplete="off"/>
            <div class="ao-csel-list">
              ${circs.map(c => `<div class="ao-csel-item ${c.id === activeCirc.id ? 'active' : ''}" onclick="_aoSwitchCirc('${c.id}')">
                <div class="ao-csel-row1"><span class="ao-csel-item-id">${c.id}</span><span class="ao-csel-item-reg">${c.regulator || ''}</span><span class="ao-risk-pip ao-risk-${(c.risk || '').toLowerCase()}"></span></div>
                <div class="ao-csel-item-title">${c.title}</div>
              </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="ao-stats-block">
        <div class="ao-stat"><span class="ao-stat-num">${total}</span><span class="ao-stat-lbl">Total</span></div>
        <div class="ao-stat-sep"></div>
        <div class="ao-stat"><span class="ao-stat-num ao-n-green">${assigned}</span><span class="ao-stat-lbl">Assigned</span></div>
        <div class="ao-stat-sep"></div>
        <div class="ao-stat"><span class="ao-stat-num ao-n-amber">${unassigned}</span><span class="ao-stat-lbl">Unassigned</span></div>
        <div class="ao-stat-sep"></div>
        <div class="ao-stat"><span class="ao-stat-num ao-n-red">${critical}</span><span class="ao-stat-lbl">Critical Unassigned</span></div>
        <div class="ao-stat-sep"></div>
        <div class="ao-stat ao-stat-prog">
          <div class="ao-prog-track"><div class="ao-prog-fill" id="ao-prog-fill" style="width:${pct}%"></div></div>
          <span class="ao-stat-lbl" id="ao-prog-lbl">${pct}% assigned</span>
        </div>
      </div>
    </div>

    <div class="ao-toolbar">
      ${IS_SPOC ? '' : `
      <div class="ao-tl-left">
        <label class="ao-check-wrap">
          <input type="checkbox" id="ao-sel-all" onchange="_aoToggleAll(this.checked)"/>
          <span class="ao-checkmark"></span>
        </label>
        <span class="ao-tl-hint">Select to bulk assign</span>
        <span class="ao-sel-badge" id="ao-sel-badge" style="display:none;"></span>
      </div>`}
      <div class="ao-tl-right" style="${IS_SPOC?'margin-left:0;':''}">
        <select class="ao-flt-sel" id="ao-filter-status" onchange="_aoApplyFilters()">
          <option value="">All Statuses</option>
          <option>Unassigned</option><option>Assigned</option><option>Acknowledged</option>
        </select>
        ${IS_SPOC
          ? `
          <!-- SPOC: Branch filter (only their branches) -->
          <select class="ao-flt-sel" id="ao-filter-branch" onchange="_aoApplyFilters()">
            <option value="">All Branches</option>
            ${(window.SPOC_PROFILE?.branches || [window.SPOC_PROFILE?.branch]).filter(Boolean).map(b =>
              `<option value="${b}">${b}</option>`
            ).join('')}
          </select>
          <!-- SPOC: Dept filter (only their depts) -->
          <select class="ao-flt-sel" id="ao-filter-dept" onchange="_aoApplyFilters()">
            <option value="">All Departments</option>
            ${(window.SPOC_PROFILE?.departments || []).map(d =>
              `<option value="${d}">${d}</option>`
            ).join('')}
          </select>`
          : `
          <select class="ao-flt-sel" id="ao-filter-dept" onchange="_aoApplyFilters()">
            <option value="">All Departments</option>
            ${AO_DEPTS.map(d=>`<option>${d}</option>`).join('')}
          </select>`
        }
      </div>
    </div>

    <div class="ao-chapters-list" id="ao-chapters-list">
      ${chapters.map((ch, ci) => _aoRenderChapter(ch, ci, activeCirc.id)).join('')}
    </div>
  </div>

  <div class="ao-bulk-bar" id="ao-bulk-bar" style="display:${IS_SPOC?'none!important':'none'};">
    <div class="ao-bulk-left">
      <span class="ao-bulk-count" id="ao-bulk-count">0 selected</span>
      <button class="ao-bulk-clear" onclick="_aoClearSel()">✕</button>
    </div>
    <div class="ao-bulk-div"></div>
    <div class="ao-bulk-fields">
      <div class="ao-bulk-f">
        <span class="ao-bulk-lbl">Department</span>
        <select class="ao-bulk-sel" id="ao-bulk-dept">
          <option value="">Select dept…</option>
          ${AO_DEPTS.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>
      </div>
      <div class="ao-bulk-f">
        <span class="ao-bulk-lbl">Assign to</span>
        <div class="ao-bulk-ta-wrap">
          <input class="ao-bulk-inp" id="ao-bulk-assignee" placeholder="Type name…"
                 oninput="_aoBulkTypeahead(this.value)" autocomplete="off"/>
          <div class="ao-bulk-sug-box" id="ao-bulk-sug" style="display:none;"></div>
        </div>
      </div>
      <div class="ao-bulk-f">
        <span class="ao-bulk-lbl">Due Date</span>
        <input type="date" class="ao-bulk-inp" id="ao-bulk-due"/>
      </div>
    </div>
    <button class="ao-bulk-go" onclick="_aoBulkAssign('${activeCirc.id}')">✓ Assign Selected</button>
  </div>
</div>`;
}

/* ── CHAPTER CARD ── */
function _aoRenderChapter(ch, ci, circId) {
  const obligs = ch.sections.flatMap(s => s.clauses.flatMap(cl => cl.obligations));
  const assignedCnt = obligs.filter(o => o.status !== 'Unassigned').length;
  const safeChId = _aoSafeId(ch.chapterId);
  const sectionsHtml = ch.sections.map((s, si) => _aoRenderSection(s, si, safeChId, circId)).join('');

  return `
<div class="ao-ch-card" id="ao-ch-card-${safeChId}">
  <div class="ao-ch-header" onclick="_aoToggleChapter('${safeChId}')">
    <div class="ao-ch-inner">
      <span class="ao-ch-arr" id="ao-ch-arr-${safeChId}">▶</span>
      <div class="ao-ch-titles">
        <span class="ao-ch-num">${ch.chapterTitle}</span>
        <span class="ao-ch-sub">${ch.chapterSub}</span>
      </div>
      <div class="ao-ch-right">
        <span class="ao-ch-meta">${ch.sections.length} sections · ${obligs.length} obligations</span>
        <span class="ao-ch-prog-pill">${assignedCnt}/${obligs.length} assigned</span>
      </div>
    </div>
  </div>
  <div class="ao-ch-body" id="ao-ch-body-${safeChId}" style="display:none;">
    ${sectionsHtml}
    <div class="ao-ch-table-wrap">
      <table class="ao-table">
        <thead>${_aoTableHeader()}</thead>
        <tbody id="ao-tbody-${safeChId}">
        ${ch.sections.flatMap(s => s.clauses.flatMap(cl => {
    const safeClId = _aoSafeId(cl.clauseId);
    return cl.obligations.map(ob => _aoRenderObRow(ob, safeClId, circId));
  })).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>`;
}

/* ── SECTION HEADER (display only, no table rows) ── */
function _aoSafeId(id) { return (id || '').replace(/\./g, '-').replace(/[^a-zA-Z0-9_-]/g, ''); }

function _aoRenderSection(sec, si, safeChId, circId) {
  return ''; /* sections shown inline via clause group headers */
}

/* ── CLAUSE GROUP HEADER (inside table) ── */
function _aoRenderClauseGroupHeader(cl, safeClId, circId) {
  const assignedCnt = cl.obligations.filter(o => o.status !== 'Unassigned').length;
  const done = assignedCnt === cl.obligations.length;
  return `<tr class="ao-cl-group-row" id="ao-clg-${safeClId}">
    <td class="ao-td-chk" onclick="event.stopPropagation()">
      <label class="ao-check-wrap" title="Select all in clause">
        <input type="checkbox" class="ao-clause-chk" data-clause="${safeClId}" onchange="_aoClauseCheckAll(this,'${safeClId}')"/>
        <span class="ao-checkmark"></span>
      </label>
    </td>
    <td colspan="7" class="ao-cl-group-td">
      <div class="ao-cl-inner">
        <span class="ao-cl-id">${cl.clauseId}</span>
        <span class="ao-cl-text">${cl.clauseText}</span>
        <div class="ao-cl-right">
          <span class="ao-cl-ob-cnt">${cl.obligations.length} obligation${cl.obligations.length !== 1 ? 's' : ''}</span>
          <span class="ao-cl-prog ${done ? 'done' : ''}">${assignedCnt}/${cl.obligations.length}</span>
        </div>
      </div>
    </td>
  </tr>`;
}

/* ── OBLIGATION ROW ── */
function _aoRenderObRow(ob, safeClauseId, circId) {
  const stCls = { Unassigned: 'ao-s-none', Assigned: 'ao-s-asgn', Acknowledged: 'ao-s-ack' }[ob.status] || '';
  return `
<tr class="ao-ob-row ${ob.status === 'Unassigned' ? 'ao-ob-unassigned' : ''}"
    id="ao-row-${ob.id}"
    data-obid="${ob.id}" data-circid="${circId}" data-clauseid="${safeClauseId}"
    data-status="${ob.status}" data-priority="${ob.priority}" data-dept="${ob.dept || ''}" data-branch="${ob.branch || ''}">
  <td class="ao-td-chk" onclick="event.stopPropagation()">
    ${IS_SPOC ? '' : `<label class="ao-check-wrap">
      <input type="checkbox" class="ao-row-chk" data-id="${ob.id}" data-clause="${safeClauseId}" onchange="_aoRowCheck(this)"/>
      <span class="ao-checkmark"></span>
    </label>`}
  </td>
  <td><span class="ao-ob-id-badge">${ob.id}</span></td>
  <td class="ao-td-text" onclick="_aoOpenDrawer('${ob.id}','${circId}')">
    <span class="ao-ob-text">${ob.text}</span>
  </td>
  <td onclick="event.stopPropagation()">
    ${IS_SPOC
      ? `<span style="font-size:12px;font-weight:600;color:#475569;background:#f1f5f9;padding:3px 10px;border-radius:6px;">${ob.dept || '—'}</span>`
      : `<select class="ao-inline-sel ${ob.dept ? 'filled' : ''}" onchange="_aoInlineDeptChange('${ob.id}','${circId}',this)">
          <option value="">Dept…</option>
          ${AO_DEPTS.map(d => `<option ${d === ob.dept ? 'selected' : ''}>${d}</option>`).join('')}
        </select>`
    }
  </td>
  <td onclick="event.stopPropagation()">
    ${IS_SPOC
      ? `<div class="ao-ta-wrap" id="ao-ta-wrap-${ob.id}">
          <input class="ao-inline-sel filled" id="ao-inline-assignee-${ob.id}"
            value="${ob.assignee || ''}" placeholder="Search assignee…" autocomplete="off"
            oninput="_aoSpocTypeahead('${ob.id}','${ob.dept||''}',this.value)"
            onfocus="_aoSpocTypeahead('${ob.id}','${ob.dept||''}',this.value)"
            style="min-width:140px;"/>
          <div class="ao-sug-box" id="ao-sug-${ob.id}" style="display:none;"></div>
        </div>`
      : ob.assignee
        ? `<div class="ao-assignee-filled"><span class="ao-av">${ob.assignee.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span><span class="ao-assignee-name">${ob.assignee}</span></div>`
        : `<span class="ao-assignee-empty-lbl">—</span>`
    }
  </td>
  <td onclick="event.stopPropagation()">
    ${IS_SPOC
      ? `<span style="font-size:12px;font-weight:600;color:#475569;">${ob.dueDate || '—'}</span>`
      : `<input type="date" class="ao-inline-date ${ob.dueDate ? 'filled' : ''}"
               value="${ob.dueDate || ''}"
               onchange="_aoInlineDueChange('${ob.id}','${circId}',this)"/>`
    }
  </td>
  <td>
    ${ob.approver
      ? `<div style="display:flex;align-items:center;gap:6px;">
           <div style="width:22px;height:22px;border-radius:50%;background:#f5f3ff;color:#6d28d9;font-size:8px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #c4b5fd;">
             ${(ob.approver).split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
           </div>
           <span style="font-size:12px;font-weight:500;color:#1e293b;">${ob.approver}</span>
         </div>`
      : `<span style="color:#94a3b8;font-size:12px;">—</span>`
    }
  </td>
  <td><span class="ao-st-badge ${stCls}">${ob.status}</span></td>
  <td><button class="ao-ob-open-btn" onclick="_aoOpenDrawer('${ob.id}','${circId}')" title="Open detail">›</button></td>
</tr>`;
}


window._aoSpocTypeahead = function(obId, dept, query) {
  const sugBox = document.getElementById(`ao-sug-${obId}`);
  if (!sugBox) return;

  /* SPOC can only assign within their branch departments */
  const spocDepts = window.SPOC_PROFILE?.departments || [];
  let pool = [];
  spocDepts.forEach(d => {
    if (AO_PEOPLE[d]) pool.push(...AO_PEOPLE[d]);
  });
  pool = [...new Set(pool)];

  const q = (query||'').trim().toLowerCase();
  const res = q ? pool.filter(p => p.toLowerCase().includes(q)) : pool.slice(0, 8);

  if (!res.length) { sugBox.style.display = 'none'; return; }
  sugBox.style.display = 'block';
  sugBox.innerHTML = res.map(p => `
  <div class="ao-sug-item" onclick="_aoSpocPickPerson('${obId}','${p.replace(/'/g,"\\'")}','${dept}')">
    <span class="ao-sug-av">${p.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span>
    <span class="ao-sug-name">${p}</span>
  </div>`).join('');

  setTimeout(() => {
    document.addEventListener('click', function h(e) {
      if (!document.getElementById(`ao-ta-wrap-${obId}`)?.contains(e.target)) {
        sugBox.style.display = 'none';
        document.removeEventListener('click', h);
      }
    });
  }, 0);
};

window._aoSpocPickPerson = function(obId, name, dept) {
  /* update input */
  const inp = document.getElementById(`ao-inline-assignee-${obId}`);
  if (inp) inp.value = name;
  const sug = document.getElementById(`ao-sug-${obId}`);
  if (sug) sug.style.display = 'none';

  /* save to data */
  const circId = document.querySelector(`#ao-row-${obId}`)?.dataset.circid;
  if (!circId) return;
  const chapters = _aoGetData(circId);
  for (const ch of chapters) {
    for (const s of ch.sections) {
      for (const cl of s.clauses) {
        const ob = cl.obligations.find(o => o.id === obId);
        if (ob) {
          ob.assignee = name;
          ob.status = 'Assigned';
          /* update status badge inline */
          const st = document.querySelector(`#ao-row-${obId} .ao-st-badge`);
          if (st) { st.textContent = 'Assigned'; st.className = 'ao-st-badge ao-s-asgn'; }
          if (typeof showToast === 'function') showToast(`${obId} assigned to ${name} ✓`, 'success');
          return;
        }
      }
    }
  }
};


/* ── DRAWER ── */
window._aoOverlayClick = function (e) { if (e.target.id === 'ao-overlay') _aoCloseDrawerDirect(); };

window._aoOpenDrawer = function (obId, circId) {
  const chapters = _aoGetData(circId);
  let ob = null, clauseRef = '', clauseText = '', sectionTitle = '', chapterTitle = '';
  for (const ch of chapters) {
    for (const s of ch.sections) {
      for (const cl of s.clauses) {
        const f = cl.obligations.find(o => o.id === obId);
        if (f) { ob = f; clauseRef = cl.clauseId; clauseText = cl.clauseText; sectionTitle = s.sectionTitle; chapterTitle = ch.chapterTitle + ' — ' + ch.chapterSub; break; }
      }
      if (ob) break;
    }
    if (ob) break;
  }
  if (!ob) return;

  document.querySelectorAll('.ao-ob-row').forEach(r => r.classList.remove('ao-row-active'));
  document.getElementById(`ao-row-${obId}`)?.classList.add('ao-row-active');

  const overlay = document.getElementById('ao-overlay');
  const drawer = document.getElementById('ao-drawer');
  const dc = document.getElementById('ao-drawer-content');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('open')));

  const meta = _aoCircMeta(circId);
  const priCls = { Critical: 'ao-p-crit', High: 'ao-p-high', Medium: 'ao-p-med', Low: 'ao-p-low' }[ob.priority] || '';

  dc.innerHTML = `
<div class="ao-dr-inner">
  <div class="ao-dr-head">
    <div class="ao-dr-head-left">
      <span class="ao-ob-id-badge">${ob.id}</span>
      <span class="ao-pri-badge ${priCls}">${ob.priority}</span>
    </div>
    <button class="ao-dr-close" onclick="_aoCloseDrawerDirect()">✕</button>
  </div>

  <!-- Obligation text at top -->
  <div class="ao-dr-ob-block">
    <div class="ao-dr-ob-label">Obligation</div>
    <div class="ao-dr-ob-text">${ob.text}</div>
  </div>

  <div class="ao-dr-section-label">Assignment Details</div>

  <div class="ao-dr-fields">
    <!-- Dept + Assignee + Due Date in one row -->
    <div class="ao-dr-field-row3">
      <div class="ao-dr-field">
        <label class="ao-dr-label">Department</label>
        ${IS_SPOC
          ? `<div class="ao-dr-input" style="background:#f8fafc;color:#475569;pointer-events:none;opacity:0.8;">${ob.dept||'—'}</div>`
          : `<select class="ao-dr-input" id="ao-dr-dept-${obId}">
              <option value="">Select department…</option>
              ${AO_DEPTS.map(d=>`<option ${d===ob.dept?'selected':''}>${d}</option>`).join('')}
            </select>`
        }
      </div>
      <div class="ao-dr-field">
        <label class="ao-dr-label">Assign to Person</label>
        <div class="ao-ta-wrap" id="ao-ta-wrap-${obId}">
          <input class="ao-dr-input" id="ao-dr-assignee-${obId}"
                 value="${ob.assignee || ''}" placeholder="Type name…" autocomplete="off"
                 oninput="${IS_SPOC?`_aoSpocTypeahead('${obId}','${ob.dept||''}',this.value)`:`_aoTypeahead('${obId}',this.value)`}"
                 onfocus="${IS_SPOC?`_aoSpocTypeahead('${obId}','${ob.dept||''}',this.value)`:`_aoTypeahead('${obId}',this.value)`}"/>
          <div class="ao-sug-box" id="ao-sug-${obId}" style="display:none;"></div>
        </div>
      </div>
      <div class="ao-dr-field">
        <label class="ao-dr-label">Due Date</label>
        ${IS_SPOC
          ? `<div class="ao-dr-input" style="background:#f8fafc;color:#475569;pointer-events:none;opacity:0.8;">${ob.dueDate||'—'}</div>`
          : `<input type="date" class="ao-dr-input" id="ao-dr-due-${obId}" value="${ob.dueDate||''}"/>`
        }
      </div>
    </div>

    <div class="ao-dr-field">
      <label class="ao-dr-label">Approver</label>
      ${IS_SPOC
        ? `<div class="ao-dr-input" style="background:#f8fafc;color:#475569;pointer-events:none;opacity:0.8;">${ob.approver||'—'}</div>`
        : `<input class="ao-dr-input" id="ao-dr-approver-${obId}"
               value="${ob.approver||''}" placeholder="Type approver name…"
               autocomplete="off"/>`
      }
    </div>

    ${IS_SPOC ? '' : `
    <div class="ao-dr-field">
      <label class="ao-dr-label">Notes / Instructions</label>
      <textarea class="ao-dr-input ao-dr-ta" id="ao-dr-notes-${obId}"
                placeholder="Add context or instructions…">${ob._notes||''}</textarea>
    </div>`}
  </div>

  <div class="ao-circ-ref-table" id="ao-circ-ref-${obId}" style="display:none;">
    <div class="ao-crt-head">Circular Reference Details</div>
    <div class="ao-crt-grid">
      <!-- Row 1: Circular Ref + Type -->
      <div class="ao-crt-row">
        <span class="ao-crt-label">Circular Ref</span>
        <span class="ao-crt-val ao-crt-link" onclick="_aoGoToAISuggestion('${circId}')" title="View AI Suggestions">${meta.circularRef} ↗</span>
      </div>
      <div class="ao-crt-row">
        <span class="ao-crt-label">Type</span>
        <span class="ao-crt-val">${meta.type}</span>
      </div>
      <!-- Row 2: Chapter -->
      <div class="ao-crt-row ao-crt-row-full">
        <span class="ao-crt-label">Chapter</span>
        <span class="ao-crt-val">${chapterTitle}</span>
      </div>
      <!-- Row 3: Section -->
      <div class="ao-crt-row ao-crt-row-full">
        <span class="ao-crt-label">Section</span>
        <span class="ao-crt-val">${sectionTitle}</span>
      </div>
      <!-- Row 4: Clause ID + Clause text -->
   <!-- //   <div class="ao-crt-row">
    //     <span class="ao-crt-label">Clause</span>
    //     <span class="ao-crt-val"><span class="ao-crt-clause-id">${clauseRef}</span></span>
    //   </div> -->
      <div class="ao-crt-row ao-crt-row-full">
        <span class="ao-crt-label "><span class="ao-crt-clause-id">${clauseRef}</span> Clause </span>
        <span class="ao-crt-val ao-crt-text-sm"> <span class="ao-crt-val"></span> ${clauseText}</span>
      </div>
      <!-- Row 5: Issue Date + Effective Date -->
      <div class="ao-crt-row">
        <span class="ao-crt-label">Issue Date</span>
        <span class="ao-crt-val">${meta.issueDate}</span>
      </div>
      <div class="ao-crt-row">
        <span class="ao-crt-label">Effective Date</span>
        <span class="ao-crt-val">${meta.effectiveDate}</span>
      </div>
      <!-- Row 6: Due Date + Frequency -->
      <div class="ao-crt-row">
        <span class="ao-crt-label">Compliance Due</span>
        <span class="ao-crt-val ao-crt-highlight">${meta.dueDate}</span>
      </div>
      <div class="ao-crt-row">
        <span class="ao-crt-label">Frequency</span>
        <span class="ao-crt-val">${meta.frequency}</span>
      </div>
      <!-- Row 7: Category + Legislative Area -->
      <div class="ao-crt-row">
        <span class="ao-crt-label">Category</span>
        <span class="ao-crt-val">${meta.category}</span>
      </div>
      <div class="ao-crt-row">
        <span class="ao-crt-label">Legislative Area</span>
        <span class="ao-crt-val">${meta.legalArea}</span>
      </div>
      <!-- Row 8: Sub-Legislative Area (full width) -->
      <div class="ao-crt-row">
        <span class="ao-crt-label">Sub-Legislative Area</span>
        <span class="ao-crt-val">${meta.subLegalArea}</span>
      </div>
       <div class="ao-crt-row ">
        <span class="ao-crt-label">Reference Document</span>
        <span class="ao-crt-val">
          <a class="ao-doc-link" href="${meta.docUrl}" target="_blank" title="Open PDF">
            <span class="ao-doc-icon">📄</span>
            <span class="ao-doc-name">${meta.docName}</span>
            <span class="ao-doc-badge">PDF</span>
          </a>
        </span>
      </div>
      <!-- Row 9: Ref Doc (full width) -->
     
    </div>
  </div>

  <!-- Footer: View Circ Details · Cancel · Save in one row -->
  <div class="ao-dr-foot">
    <button class="ao-dr-more-btn ao-dr-more-btn-inline" id="ao-dr-more-btn-${obId}" onclick="_aoToggleCircRef('${obId}')">
      📋 View Circular Details
    </button>
    <div class="ao-dr-foot-actions">
      <button class="ao-btn ao-btn-ghost ao-btn-sm" onclick="_aoCloseDrawerDirect()">Cancel</button>
      <button class="ao-btn ao-btn-pri ao-btn-sm" onclick="_aoDrawerSave('${obId}','${circId}')">✓ Save Assignment</button>
    </div>
  </div>
</div>`;

  document.getElementById(`ao-dr-dept-${obId}`)?.addEventListener('change', function () {
    _aoTypeahead(obId, document.getElementById(`ao-dr-assignee-${obId}`)?.value || '');
  });
};

window._aoToggleCircRef = function (obId) {
  const panel = document.getElementById(`ao-circ-ref-${obId}`);
  const btn = document.getElementById(`ao-dr-more-btn-${obId}`);
  if (!panel) return;
  const open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
  if (btn) btn.textContent = open ? '📋 View Circular Details' : '📋 Hide Circular Details';
  if (btn) btn.classList.toggle('ao-more-btn-active', !open);
};

window._aoCloseDrawerDirect = function () {
  const overlay = document.getElementById('ao-overlay');
  const drawer = document.getElementById('ao-drawer');
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
  document.querySelectorAll('.ao-ob-row').forEach(r => r.classList.remove('ao-row-active'));
};

/* ── AI SUGGESTION NAVIGATION ── */
window._aoGoToAISuggestion = function (circId) {
  if (typeof renderAISuggestionPage === 'function') {
    renderAISuggestionPage(circId);
  } else if (typeof window.navigate === 'function') {
    window.navigate('ai-suggestion', { circId });
  } else {
    const area = document.getElementById('content-area');
    if (area) {
      area.innerHTML = `<div style="padding:40px;font-family:system-ui;color:#1e2433;">
        <h2 style="margin-bottom:8px;">AI Suggestions</h2>
        <p style="color:#5a6478;">Loading AI suggestions for <strong>${circId}</strong>…</p>
        <button onclick="renderAssignObligation('${circId}')" style="margin-top:16px;padding:8px 18px;background:#0d7fa5;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;">← Back to Obligations</button>
      </div>`;
    }
  }
};

/* ── TYPEAHEAD ── */
window._aoTypeahead = function (obId, query) {
  const dept = document.getElementById(`ao-dr-dept-${obId}`)?.value || '';
  const sugBox = document.getElementById(`ao-sug-${obId}`);
  if (!sugBox) return;
  // Only use people from selected dept if one is chosen, else all
  let pool = dept && AO_PEOPLE[dept] ? AO_PEOPLE[dept] : Object.values(AO_PEOPLE).flat();
  pool = [...new Set(pool)];
  const q = (query || '').trim().toLowerCase();
  const res = q ? pool.filter(p => p.toLowerCase().includes(q)) : pool.slice(0, 6);
  if (!res.length) { sugBox.style.display = 'none'; return; }
  sugBox.style.display = 'block';
  sugBox.innerHTML = res.map(p => `
  <div class="ao-sug-item" onclick="_aoPickPerson('${obId}','${p.replace(/'/g, "\\'")}')">
    <span class="ao-sug-av">${p.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</span>
    <span class="ao-sug-name">${p}</span>
    ${dept && AO_PEOPLE[dept]?.includes(p) ? `<span class="ao-sug-dept-tag">${dept}</span>` : ''}
  </div>`).join('');
  setTimeout(() => {
    document.addEventListener('click', function h(e) {
      if (!document.getElementById(`ao-ta-wrap-${obId}`)?.contains(e.target)) { sugBox.style.display = 'none'; document.removeEventListener('click', h); }
    });
  }, 0);
};
window._aoPickPerson = function (obId, name) {
  const inp = document.getElementById(`ao-dr-assignee-${obId}`); if (inp) inp.value = name;
  const sug = document.getElementById(`ao-sug-${obId}`); if (sug) sug.style.display = 'none';
};

/* ── BULK TYPEAHEAD ── */
window._aoBulkTypeahead = function (query) {
  const sug = document.getElementById('ao-bulk-sug'); if (!sug) return;
  let pool = [...new Set(Object.values(AO_PEOPLE).flat())];
  const q = query.trim().toLowerCase();
  const res = q ? pool.filter(p => p.toLowerCase().includes(q)) : pool.slice(0, 6);
  if (!res.length) { sug.style.display = 'none'; return; }
  sug.style.display = 'block';
  sug.innerHTML = res.map(p => `
  <div class="ao-sug-item ao-sug-dark" onclick="_aoPickBulkPerson('${p.replace(/'/g, "\\'")}')">
    <span class="ao-sug-av">${p.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</span>
    <span class="ao-sug-name">${p}</span>
  </div>`).join('');
};
window._aoPickBulkPerson = function (name) {
  const inp = document.getElementById('ao-bulk-assignee'); if (inp) inp.value = name;
  const sug = document.getElementById('ao-bulk-sug'); if (sug) sug.style.display = 'none';
};

/* ── DRAWER SAVE ── */
window._aoDrawerSave = function (obId, circId) {
  const chapters = _aoGetData(circId);
  let ob = null, safeClId = '';
  for (const ch of chapters) { for (const s of ch.sections) { for (const cl of s.clauses) { const f = cl.obligations.find(o => o.id === obId); if (f) { ob = f; safeClId = _aoSafeId(cl.clauseId); break; } } if (ob) break; } if (ob) break; }
  if (!ob) return;
  ob.dept     = document.getElementById(`ao-dr-dept-${obId}`)?.value     || ob.dept;
  ob.assignee = document.getElementById(`ao-dr-assignee-${obId}`)?.value || ob.assignee;
  ob.approver = document.getElementById(`ao-dr-approver-${obId}`)?.value || ob.approver;
  ob.dueDate  = document.getElementById(`ao-dr-due-${obId}`)?.value      || ob.dueDate;
  ob._notes   = document.getElementById(`ao-dr-notes-${obId}`)?.value    || '';
  if (ob.dept) ob.status = 'Assigned';
  // Find which chapter body to update
  let chSafeId = '';
  for (const ch of chapters) {
    for (const s of ch.sections) {
      for (const cl of s.clauses) {
        if (cl.obligations.find(o => o.id === obId)) { chSafeId = _aoSafeId(ch.chapterId); break; }
      }
      if (chSafeId) break;
    }
    if (chSafeId) break;
  }
  const row = document.getElementById(`ao-row-${obId}`);
  if (row) row.outerHTML = _aoRenderObRow(ob, safeClId, circId);
  _aoUpdateStats(circId);
  _aoCloseDrawerDirect();
  if (typeof showToast === 'function') showToast(`${obId} assigned ✓`, 'success');
};

/* ── INLINE ── */
window._aoInlineDeptChange = function (obId, circId, sel) {
  const chapters = _aoGetData(circId);
  let ob = null;
  for (const ch of chapters) { for (const s of ch.sections) { for (const cl of s.clauses) { const f = cl.obligations.find(o => o.id === obId); if (f) { ob = f; break; } } if (ob) break; } if (ob) break; }
  if (!ob) return;
  ob.dept = sel.value || null; ob.status = sel.value ? 'Assigned' : 'Unassigned';
  sel.classList.toggle('filled', !!sel.value);
  const st = document.querySelector(`#ao-row-${obId} .ao-st-badge`);
  if (st) { st.textContent = ob.status; st.className = `ao-st-badge ${{ Unassigned: 'ao-s-none', Assigned: 'ao-s-asgn', Acknowledged: 'ao-s-ack' }[ob.status] || ''}`; }
  _aoUpdateStats(circId);
};
window._aoInlineDueChange = function (obId, circId, inp) {
  const chapters = _aoGetData(circId);
  for (const ch of chapters) { for (const s of ch.sections) { for (const cl of s.clauses) { const f = cl.obligations.find(o => o.id === obId); if (f) { f.dueDate = inp.value; inp.classList.toggle('filled', !!inp.value); return; } } } }
};

/* ── CHECKBOX + BULK ── */
window._aoRowCheck = function () {
  const sel = document.querySelectorAll('.ao-row-chk:checked');
  const all = document.querySelectorAll('.ao-row-chk');
  const selA = document.getElementById('ao-sel-all');
  const badge = document.getElementById('ao-sel-badge');
  const bar = document.getElementById('ao-bulk-bar');
  const cnt = document.getElementById('ao-bulk-count');
  if (selA) selA.indeterminate = sel.length > 0 && sel.length < all.length;
  if (badge) { badge.textContent = `${sel.length} selected`; badge.style.display = sel.length ? 'inline-flex' : 'none'; }
  if (bar) bar.style.display = sel.length ? 'flex' : 'none';
  if (cnt) cnt.textContent = `${sel.length} obligation${sel.length !== 1 ? 's' : ''} selected`;
  // Update clause-level checkboxes
  document.querySelectorAll('.ao-clause-chk').forEach(cc => {
    const clauseId = cc.dataset.clause;
    const clauseChks = [...document.querySelectorAll(`.ao-row-chk[data-clause="${clauseId}"]`)];
    const checkedCount = clauseChks.filter(c => c.checked).length;
    cc.checked = checkedCount === clauseChks.length && clauseChks.length > 0;
    cc.indeterminate = checkedCount > 0 && checkedCount < clauseChks.length;
  });
};
window._aoClauseCheckAll = function (masterChk, clauseId) {
  document.querySelectorAll(`.ao-row-chk[data-clause="${clauseId}"]`).forEach(c => c.checked = masterChk.checked);
  _aoRowCheck();
};
window._aoToggleAll = function (checked) {
  document.querySelectorAll('.ao-row-chk').forEach(c => c.checked = checked);
  document.querySelectorAll('.ao-clause-chk').forEach(c => { c.checked = checked; c.indeterminate = false; });
  _aoRowCheck();
};
window._aoClearSel = function () {
  document.querySelectorAll('.ao-row-chk,.ao-clause-chk').forEach(c => { c.checked = false; c.indeterminate = false; });
  const sa = document.getElementById('ao-sel-all'); if (sa) { sa.checked = false; sa.indeterminate = false; }
  _aoRowCheck();
};
window._aoBulkAssign = function (circId) {
  const sel = ([...document.querySelectorAll('.ao-row-chk:checked')]).map(c => c.dataset.id);
  const dept = document.getElementById('ao-bulk-dept')?.value;
  const assignee = document.getElementById('ao-bulk-assignee')?.value?.trim();
  const due = document.getElementById('ao-bulk-due')?.value;
  if (!sel.length) { if (typeof showToast === 'function') showToast('No obligations selected', 'warning'); return; }
  if (!dept) { if (typeof showToast === 'function') showToast('Select a department', 'warning'); return; }
  const chapters = _aoGetData(circId);
  sel.forEach(obId => {
    let ob = null, safeClId = '';
    for (const ch of chapters) { for (const s of ch.sections) { for (const cl of s.clauses) { const f = cl.obligations.find(o => o.id === obId); if (f) { ob = f; safeClId = _aoSafeId(cl.clauseId); break; } } if (ob) break; } if (ob) break; }
    if (!ob) return;
    ob.dept = dept; ob.status = 'Assigned';
    if (assignee) ob.assignee = assignee;
    if (due) ob.dueDate = due;
    const row = document.getElementById(`ao-row-${obId}`);
    if (row) row.outerHTML = _aoRenderObRow(ob, safeClId, circId);
  });
  _aoUpdateStats(circId); _aoClearSel();
  if (typeof showToast === 'function') showToast(`${sel.length} obligation${sel.length !== 1 ? 's' : ''} assigned to ${dept} ✓`, 'success');
};

/* ── CHAPTER TOGGLE ── */
window._aoToggleChapter = function (safeChId) {
  const body = document.getElementById(`ao-ch-body-${safeChId}`);
  const arr = document.getElementById(`ao-ch-arr-${safeChId}`);
  const card = document.getElementById(`ao-ch-card-${safeChId}`);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arr) arr.textContent = open ? '▶' : '▼';
  if (card) card.classList.toggle('ao-ch-card-open', !open);
};

/* ── FILTERS ── */
window._aoApplyFilters = function () {
  const fS = document.getElementById('ao-filter-status')?.value || '';
  const fD = document.getElementById('ao-filter-dept')?.value   || '';
  const fB = document.getElementById('ao-filter-branch')?.value || '';
  document.querySelectorAll('.ao-ob-row').forEach(row => {
    const ok = (!fS || row.dataset.status === fS)
            && (!fD || row.dataset.dept   === fD)
            && (!fB || row.dataset.branch === fB);
    row.style.display = ok ? '' : 'none';
  });
};

/* ── STATS ── */
function _aoUpdateStats(circId) {
  const all = _aoAllObligs(circId);
  const asgn = all.filter(o => o.status !== 'Unassigned').length;
  const pct = all.length ? Math.round(asgn / all.length * 100) : 0;
  const nums = document.querySelectorAll('.ao-stat-num');
  if (nums[1]) nums[1].textContent = asgn;
  if (nums[2]) nums[2].textContent = all.length - asgn;
  if (nums[3]) nums[3].textContent = all.filter(o => o.priority === 'Critical' && o.status === 'Unassigned').length;
  const fill = document.getElementById('ao-prog-fill'); if (fill) fill.style.width = pct + '%';
  const lbl = document.getElementById('ao-prog-lbl'); if (lbl) lbl.textContent = pct + '% assigned';
}

window._aoSwitchCirc = function (circId) { document.getElementById('ao-csel-drop').style.display = 'none'; renderAssignObligation(circId); };
window._aoSaveAll = function () { if (typeof showToast === 'function') showToast('All assignments saved ✓', 'success'); };


/* ── BIND ── */
function _aoBindAll(circId) {
  /* SPOC: auto-hide rows not in their departments */
  if (IS_SPOC) {
    const spocDepts = window.SPOC_PROFILE?.departments || [];
    document.querySelectorAll('.ao-ob-row').forEach(row => {
      if (spocDepts.length && row.dataset.dept && !spocDepts.includes(row.dataset.dept)) {
        row.style.display = 'none';
      }
    });
  }

  const btn = document.getElementById('ao-csel-btn');
  const drop = document.getElementById('ao-csel-drop');
  const srch = document.getElementById('ao-csel-search');
  if (btn) btn.addEventListener('click', e => { e.stopPropagation(); drop.style.display = drop.style.display === 'none' ? 'block' : 'none'; if (drop.style.display !== 'none' && srch) srch.focus(); });
  if (srch) srch.addEventListener('input', function () { const q = this.value.toLowerCase(); document.querySelectorAll('.ao-csel-item').forEach(i => i.style.display = i.textContent.toLowerCase().includes(q) ? '' : 'none'); });
  document.addEventListener('click', e => { const wrap = document.getElementById('ao-csel-wrap'); if (wrap && !wrap.contains(e.target) && drop) drop.style.display = 'none'; });
}

/* ── STYLES ── */
function _aoInjectStyles() {
  if (document.getElementById('ao-styles')) return;
  const s = document.createElement('style');
  s.id = 'ao-styles';
  s.textContent = `
@keyframes aoIn     { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
@keyframes aoFadeIn { from{opacity:0} to{opacity:1} }
:root {
  --ao-bg:#f0f3f7; --ao-card:#fff; --ao-border:#dde2ea; --ao-border-lt:#edf0f5;
  --ao-ch-bg:#1a2235; --ao-sec-bg:#2c3e5e; --ao-cl-bg:#5a6578;
  --ao-text:#1e2433; --ao-text-sec:#5a6478; --ao-text-mut:#9aa3b5;
  --ao-accent:#0d7fa5; --ao-accent-lt:#e6f4f9; --ao-accent-md:#b2ddef;
  --ao-purple:#5b5fcf; --ao-purple-lt:#ededfc;
  --ao-green:#0e9f6e; --ao-green-lt:#e8faf4;
  --ao-amber:#b45309; --ao-amber-lt:#fef3c7;
  --ao-red:#c92a2a; --ao-red-lt:#fdecea;
  --ao-r:8px; --ao-rl:12px;
  --ao-sh:0 1px 4px rgba(30,36,51,.07); --ao-shm:0 4px 16px rgba(30,36,51,.12); --ao-shl:0 8px 32px rgba(30,36,51,.18);
}


.ao-tab-btn {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: #eee;
  cursor: pointer;
}
.ao-tab-btn.active {
  background: #333;
  color: white;
}

*{box-sizing:border-box;}
.ao-page{font-family:'DM Sans',system-ui,sans-serif;color:var(--ao-text);background:var(--ao-bg);min-height:100vh;position:relative;}
.ao-wrap{max-width:1160px;margin:0 auto;padding:28px 24px 100px;}
.ao-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:var(--ao-r);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;}
.ao-btn-pri{background:var(--ao-text);color:#fff;}.ao-btn-pri:hover{background:#2d3548;}
.ao-btn-ghost{background:var(--ao-card);color:var(--ao-text-sec);border:1.5px solid var(--ao-border);}.ao-btn-ghost:hover{background:var(--ao-bg);}
.ao-btn-sm{padding:7px 14px;font-size:12px;}
.ao-page-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap;}
.ao-head-eyebrow{font-size:10px;font-weight:700;color:var(--ao-accent);text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;}
.ao-head-title{font-size:24px;font-weight:800;margin-bottom:4px;}
.ao-head-sub{font-size:12px;color:var(--ao-text-mut);}
.ao-head-right{display:flex;gap:8px;}

/* circ card */
.ao-circ-card{display:flex;align-items:center;gap:20px;background:var(--ao-card);border:1px solid var(--ao-border);border-radius:var(--ao-rl);padding:18px 22px;margin-bottom:14px;box-shadow:var(--ao-sh);flex-wrap:wrap;}
.ao-circ-left{flex:1;min-width:280px;}
.ao-circ-label{font-size:9px;font-weight:700;color:var(--ao-text-mut);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
.ao-custom-sel-wrap{position:relative;}
.ao-custom-sel-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;background:var(--ao-bg);border:1.5px solid var(--ao-border);border-radius:var(--ao-r);font-family:inherit;cursor:pointer;transition:all .14s;}
.ao-custom-sel-btn:hover{border-color:var(--ao-accent);background:#fff;}
.ao-csel-inner{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
.ao-csel-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--ao-accent);background:var(--ao-accent-lt);border:1px solid var(--ao-accent-md);padding:2px 8px;border-radius:4px;flex-shrink:0;cursor:pointer;text-decoration:underline dotted;transition:background .13s;}
.ao-csel-id:hover{background:var(--ao-accent-md);}
.ao-csel-title{font-size:13px;font-weight:600;color:var(--ao-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
.ao-csel-reg{font-size:11px;color:var(--ao-text-mut);flex-shrink:0;}
.ao-csel-arr{color:var(--ao-text-mut);flex-shrink:0;}
.ao-csel-drop{position:absolute;top:calc(100%+5px);left:0;right:0;background:var(--ao-card);border:1.5px solid var(--ao-border);border-radius:var(--ao-rl);z-index:300;box-shadow:var(--ao-shl);overflow:hidden;}
.ao-csel-search{width:100%;padding:10px 14px;background:var(--ao-bg);border:none;border-bottom:1px solid var(--ao-border);font-family:inherit;font-size:12px;outline:none;box-sizing:border-box;}
.ao-csel-list{max-height:220px;overflow-y:auto;}
.ao-csel-item{padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--ao-border-lt);transition:background .1s;}
.ao-csel-item:hover,.ao-csel-item.active{background:var(--ao-accent-lt);}
.ao-csel-row1{display:flex;align-items:center;gap:7px;margin-bottom:3px;}
.ao-csel-item-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;}
.ao-csel-item-reg{font-size:10px;color:var(--ao-text-mut);}
.ao-csel-item-title{font-size:12px;color:var(--ao-text-sec);}
.ao-risk-pip{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-left:auto;}
.ao-risk-high{background:var(--ao-red);}.ao-risk-medium{background:var(--ao-amber);}.ao-risk-low{background:var(--ao-green);}

/* stats */
.ao-stats-block{display:flex;align-items:center;flex-wrap:wrap;}
.ao-stat{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 16px;}
.ao-stat-num{font-size:26px;font-weight:800;line-height:1;}
.ao-stat-lbl{font-size:10px;color:var(--ao-text-mut);font-weight:600;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}
.ao-n-green{color:var(--ao-green);}.ao-n-amber{color:var(--ao-amber);}.ao-n-red{color:var(--ao-red);}
.ao-stat-sep{width:1px;background:var(--ao-border);align-self:stretch;margin:6px 0;}
.ao-stat-prog{min-width:110px;}
.ao-prog-track{width:100%;height:6px;background:#e8ebf1;border-radius:99px;overflow:hidden;margin-bottom:4px;}
.ao-prog-fill{height:100%;background:linear-gradient(90deg,var(--ao-accent),var(--ao-green));border-radius:99px;transition:width .5s;}

/* toolbar */
.ao-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;background:var(--ao-card);border:1px solid var(--ao-border);border-radius:var(--ao-r);margin-bottom:18px;box-shadow:var(--ao-sh);}
.ao-tl-left{display:flex;align-items:center;gap:10px;}
.ao-tl-right{display:flex;align-items:center;gap:8px;}
.ao-tl-hint{font-size:11px;color:var(--ao-text-mut);}
.ao-sel-badge{font-size:11px;font-weight:700;color:var(--ao-accent);background:var(--ao-accent-lt);border:1px solid var(--ao-accent-md);padding:3px 10px;border-radius:20px;}
.ao-flt-sel{padding:6px 10px;background:var(--ao-bg);border:1px solid var(--ao-border);border-radius:6px;font-family:inherit;font-size:12px;color:var(--ao-text-sec);outline:none;cursor:pointer;}
.ao-flt-sel:focus{border-color:var(--ao-accent);}

/* checkbox */
.ao-check-wrap{display:inline-flex;align-items:center;cursor:pointer;position:relative;}
.ao-check-wrap input{position:absolute;opacity:0;width:0;height:0;}
.ao-checkmark{width:16px;height:16px;border:2px solid var(--ao-border);border-radius:4px;background:var(--ao-card);transition:all .13s;flex-shrink:0;}
.ao-check-wrap input:checked~.ao-checkmark{background:var(--ao-accent);border-color:var(--ao-accent);}
.ao-check-wrap input:checked~.ao-checkmark::after{content:'';display:block;width:4px;height:7px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg);margin:1px 0 0 4px;}
.ao-check-wrap input:indeterminate~.ao-checkmark{background:var(--ao-accent);border-color:var(--ao-accent);}
.ao-check-wrap input:indeterminate~.ao-checkmark::after{content:'';display:block;width:8px;height:2px;background:#fff;margin:5px 0 0 2px;}

/* ── CHAPTER CARDS ── */
.ao-chapters-list{display:flex;flex-direction:column;gap:16px;}
.ao-ch-card{background:var(--ao-card);border:1px solid var(--ao-border);border-radius:var(--ao-rl);overflow:hidden;box-shadow:var(--ao-sh);transition:box-shadow .2s;}
.ao-ch-card.ao-ch-card-open{box-shadow:var(--ao-shm);}
.ao-ch-header{background:var(--ao-ch-bg);cursor:pointer;transition:background .15s;padding:15px 20px;}
.ao-ch-header:hover{background:#202840;}
.ao-ch-inner{display:flex;align-items:center;gap:14px;}
.ao-ch-arr{font-size:9px;color:rgba(255,255,255,.35);flex-shrink:0;width:12px;transition:color .15s;}
.ao-ch-header:hover .ao-ch-arr{color:rgba(255,255,255,.75);}
.ao-ch-titles{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;}
.ao-ch-num{font-size:13px;font-weight:800;color:#fff;}
.ao-ch-sub{font-size:11px;color:rgba(255,255,255,.45);}
.ao-ch-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.ao-ch-meta{font-size:11px;color:rgba(255,255,255,.35);}
.ao-ch-prog-pill{font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.15);}
.ao-ch-body{animation:aoIn .18s ease;}
.ao-ch-table-wrap{overflow-x:auto;}

/* TABLE */
.ao-table{width:100%;border-collapse:collapse;font-size:13px;}
.ao-table thead tr.ao-inner-thead{background:#f5f7fa;}
.ao-table thead th{padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ao-text-mut);border-bottom:2px solid var(--ao-border);white-space:nowrap;}
.ao-th-chk{width:40px;}
.ao-th-text{width:auto;}
.ao-table td{padding:11px 14px;border-bottom:1px solid var(--ao-border-lt);vertical-align:middle;}

/* Clause group header row */
.ao-cl-group-row{background:#f0f4f8;}
.ao-cl-group-td{padding:10px 14px 10px 14px!important;border-bottom:1px solid var(--ao-border)!important;border-top:2px solid var(--ao-border-lt)!important;}
.ao-cl-inner{display:flex;align-items:center;gap:10px;}
.ao-cl-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--ao-accent);background:var(--ao-accent-lt);border:1px solid var(--ao-accent-md);padding:2px 8px;border-radius:4px;flex-shrink:0;}
.ao-cl-text{flex:1;font-size:12px;color:var(--ao-text-sec);line-height:1.4;}
.ao-cl-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.ao-cl-ob-cnt{font-size:10px;color:var(--ao-text-mut);}
.ao-cl-prog{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:#e8ebf1;color:var(--ao-text-sec);}
.ao-cl-prog.done{background:var(--ao-green-lt);color:var(--ao-green);}

/* Obligation rows */
.ao-ob-row{transition:background .12s;}
.ao-ob-row:hover{background:#f5f8fc;}
.ao-ob-row.ao-ob-unassigned{border-left:3px solid var(--ao-amber);}
.ao-ob-row.ao-row-active{background:var(--ao-accent-lt);}
.ao-td-chk{width:40px;text-align:center;}
.ao-td-text{cursor:pointer;max-width:260px;}
.ao-ob-id-badge{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:var(--ao-purple);background:var(--ao-purple-lt);border:1px solid #d4d6f8;padding:2px 7px;border-radius:4px;white-space:nowrap;}
.ao-ob-text{font-size:12.5px;color:var(--ao-text);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.ao-td-text:hover .ao-ob-text{color:var(--ao-accent);}
.ao-assignee-filled{display:flex;align-items:center;gap:6px;}
.ao-av{width:24px;height:24px;border-radius:50%;background:var(--ao-accent-lt);color:var(--ao-accent);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--ao-accent-md);}
.ao-assignee-name{font-size:12px;font-weight:500;color:var(--ao-text);}
.ao-assignee-empty-lbl{font-size:12px;color:var(--ao-text-mut);}
.ao-inline-sel{width:100%;padding:5px 8px;background:#f5f7fa;border:1.5px dashed var(--ao-border);border-radius:6px;font-family:inherit;font-size:11px;color:var(--ao-text-mut);outline:none;cursor:pointer;transition:all .13s;}
.ao-inline-sel:focus,.ao-inline-sel.filled{border-style:solid;border-color:var(--ao-accent-md);background:var(--ao-accent-lt);color:var(--ao-text);}
.ao-inline-date{width:100%;padding:5px 6px;background:#f5f7fa;border:1.5px dashed var(--ao-border);border-radius:6px;font-family:inherit;font-size:11px;color:var(--ao-text-mut);outline:none;transition:all .13s;}
.ao-inline-date:focus,.ao-inline-date.filled{border-style:solid;border-color:var(--ao-accent-md);background:var(--ao-accent-lt);color:var(--ao-text);}
.ao-pri-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:4px;white-space:nowrap;text-align:center;}
.ao-p-crit{background:#fce7f3;color:#9d174d;}
.ao-p-high{background:var(--ao-red-lt);color:var(--ao-red);}
.ao-p-med{background:var(--ao-amber-lt);color:var(--ao-amber);}
.ao-p-low{background:var(--ao-green-lt);color:var(--ao-green);}
.ao-st-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;white-space:nowrap;}
.ao-s-none{background:#f1f5f9;color:#64748b;}
.ao-s-asgn{background:var(--ao-accent-lt);color:var(--ao-accent);}
.ao-s-ack{background:var(--ao-green-lt);color:var(--ao-green);}
.ao-ob-open-btn{background:none;border:none;cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:all .13s;font-size:18px;color:var(--ao-text-mut);}
.ao-ob-open-btn:hover{background:var(--ao-accent-lt);color:var(--ao-accent);}

/* OVERLAY DRAWER */
.ao-overlay{position:fixed;inset:0;background:rgba(10,15,28,.5);backdrop-filter:blur(3px);z-index:500;display:flex;align-items:stretch;justify-content:flex-end;animation:aoFadeIn .2s ease;}
.ao-drawer{width:520px;max-width:96vw;background:var(--ao-card);box-shadow:-4px 0 40px rgba(10,15,28,.2);display:flex;flex-direction:column;overflow-y:auto;transform:translateX(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);}
.ao-drawer.open{transform:translateX(0);}
.ao-dr-inner{padding:26px 24px;display:flex;flex-direction:column;gap:16px;min-height:100%;}
.ao-dr-head{display:flex;align-items:center;justify-content:space-between;}
.ao-dr-head-left{display:flex;align-items:center;gap:8px;}
.ao-dr-close{background:none;border:1px solid var(--ao-border);border-radius:7px;width:30px;height:30px;cursor:pointer;font-size:13px;color:var(--ao-text-mut);display:flex;align-items:center;justify-content:center;transition:all .13s;}
.ao-dr-close:hover{background:var(--ao-red-lt);color:var(--ao-red);border-color:#f5b8b8;}

/* Obligation block at top of drawer */
.ao-dr-ob-block{background:var(--ao-accent-lt);border:1px solid var(--ao-accent-md);border-left:4px solid var(--ao-accent);border-radius:var(--ao-r);padding:14px 16px;}
.ao-dr-ob-label{font-size:9px;font-weight:700;color:var(--ao-accent);text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px;}
.ao-dr-ob-text{font-size:13.5px;color:var(--ao-text);line-height:1.65;font-weight:500;}

.ao-dr-section-label{font-size:10px;font-weight:700;color:var(--ao-text-mut);text-transform:uppercase;letter-spacing:.08em;border-top:1px solid var(--ao-border-lt);padding-top:4px;}
.ao-dr-fields{display:flex;flex-direction:column;gap:14px;}
.ao-dr-field{display:flex;flex-direction:column;gap:5px;}

/* 3-column row for dept, assignee, due date */
.ao-dr-field-row3{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:12px;}

.ao-dr-label{font-size:10px;font-weight:700;color:var(--ao-text-mut);text-transform:uppercase;letter-spacing:.06em;}
.ao-dr-input{padding:9px 12px;background:var(--ao-card);border:1.5px solid var(--ao-border);border-radius:var(--ao-r);font-family:inherit;font-size:13px;color:var(--ao-text);outline:none;width:100%;box-sizing:border-box;transition:border-color .15s,box-shadow .15s;}
.ao-dr-input:focus{border-color:var(--ao-accent);box-shadow:0 0 0 3px rgba(13,127,165,.08);}
.ao-dr-ta{min-height:80px;resize:vertical;}
.ao-ta-wrap{position:relative;}
.ao-sug-box{position:absolute;top:calc(100%+4px);left:0;right:0;background:var(--ao-card);border:1.5px solid var(--ao-border);border-radius:var(--ao-r);z-index:999;box-shadow:var(--ao-shm);max-height:180px;overflow-y:auto;}
.ao-sug-item{display:flex;align-items:center;gap:9px;padding:9px 12px;cursor:pointer;transition:background .1s;}
.ao-sug-item:hover{background:var(--ao-accent-lt);}
.ao-sug-av{width:26px;height:26px;border-radius:50%;background:var(--ao-accent-lt);color:var(--ao-accent);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--ao-accent-md);}
.ao-sug-name{flex:1;font-size:13px;font-weight:500;}
.ao-sug-dept-tag{font-size:10px;font-weight:600;color:var(--ao-accent);background:var(--ao-accent-lt);border:1px solid var(--ao-accent-md);padding:1px 7px;border-radius:4px;}

/* Circular ref table */
.ao-circ-ref-table{border:1px solid var(--ao-border);border-radius:var(--ao-r);overflow:hidden;animation:aoIn .18s ease;margin-bottom:2px;}
.ao-crt-head{font-size:10px;font-weight:700;color:var(--ao-text-mut);text-transform:uppercase;letter-spacing:.07em;padding:9px 14px;background:#f5f7fa;border-bottom:1px solid var(--ao-border);}
.ao-crt-grid{display:grid;grid-template-columns:1fr 1fr;}
.ao-crt-row{display:flex;flex-direction:column;gap:3px;padding:9px 13px;border-right:1px solid var(--ao-border-lt);border-bottom:1px solid var(--ao-border-lt);background:#fbfcfd;}
.ao-crt-row:nth-child(2n){border-right:1px solid var(--ao-border-lt);}
.ao-crt-row-full{grid-column:1/-1;border-right:1px solid var(--ao-border-lt);border-bottom:1px solid var(--ao-border-lt);border-top:1px solid var(--ao-border-lt)}
.ao-crt-label{font-size:9px;font-weight:700;color:var(--ao-text-mut);text-transform:uppercase;letter-spacing:.06em;}
.ao-crt-val{font-size:12px;font-weight:600;color:var(--ao-text);}
.ao-crt-text-sm{font-size:11px;font-weight:400;color:var(--ao-text-sec);line-height:1.4;}
.ao-crt-clause-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--ao-accent);background:var(--ao-accent-lt);border:1px solid var(--ao-accent-md);padding:1px 7px;border-radius:4px;}
.ao-crt-highlight{color:var(--ao-amber);font-weight:700;}
.ao-crt-link{color:var(--ao-accent);cursor:pointer;text-decoration:underline dotted;}
.ao-crt-link:hover{color:#0b6a8a;}

/* Document link */
.ao-doc-link{display:inline-flex;align-items:center;gap:7px;padding:5px 10px;background:var(--ao-accent-lt);border:1px solid var(--ao-accent-md);border-radius:6px;text-decoration:none;color:var(--ao-accent);transition:all .13s;font-size:12px;font-weight:600;}
.ao-doc-link:hover{background:var(--ao-accent-md);color:#0b6a8a;}
.ao-doc-icon{font-size:14px;}
.ao-doc-name{font-size:11px;color:var(--ao-text-sec);font-weight:500;}
.ao-doc-badge{font-size:9px;font-weight:800;background:var(--ao-red-lt);color:var(--ao-red);border:1px solid #f5b8b8;padding:1px 5px;border-radius:3px;letter-spacing:.04em;}

/* Footer — single row: [View Circ Details] ... [Cancel] [Save] */
.ao-dr-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 0 0 0;border-top:1px solid var(--ao-border-lt);margin-top:auto;position:sticky;bottom:0;background:var(--ao-card);z-index:2;}
.ao-dr-foot-actions{display:flex;gap:8px;align-items:center;flex-shrink:0;}
.ao-dr-more-btn-inline{padding:8px 13px;background:#f8f9fb;border:1.5px solid var(--ao-border);border-radius:var(--ao-r);font-family:inherit;font-size:11px;font-weight:600;color:var(--ao-text-sec);cursor:pointer;white-space:nowrap;transition:all .13s;}
.ao-dr-more-btn-inline:hover,.ao-more-btn-active{border-color:var(--ao-accent);color:var(--ao-accent);background:var(--ao-accent-lt);}

/* BULK BAR — no priority */
.ao-bulk-bar{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:0;background:var(--ao-ch-bg);border-radius:14px;box-shadow:0 8px 40px rgba(10,15,28,.35);z-index:200;overflow:hidden;animation:aoIn .22s ease;white-space:nowrap;}
.ao-bulk-left{display:flex;align-items:center;gap:10px;padding:14px 18px;}
.ao-bulk-count{font-size:13px;font-weight:700;color:#fff;}
.ao-bulk-clear{background:none;border:1px solid rgba(255,255,255,.18);border-radius:6px;color:rgba(255,255,255,.55);font-family:inherit;font-size:11px;padding:3px 10px;cursor:pointer;}
.ao-bulk-clear:hover{background:rgba(255,255,255,.1);color:#fff;}
.ao-bulk-div{width:1px;background:rgba(255,255,255,.1);align-self:stretch;}
.ao-bulk-fields{display:flex;align-items:flex-end;gap:12px;padding:12px 18px;}
.ao-bulk-f{display:flex;flex-direction:column;gap:4px;}
.ao-bulk-lbl{font-size:9px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.07em;}
.ao-bulk-sel{padding:7px 10px;background:#fff;border:1px solid rgba(255,255,255,.3);border-radius:6px;font-family:inherit;font-size:12px;color:var(--ao-text);outline:none;cursor:pointer;min-width:120px;}
.ao-bulk-inp{padding:7px 10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:6px;font-family:inherit;font-size:12px;color:#fff;outline:none;min-width:130px;color-scheme:dark;}
.ao-bulk-inp::placeholder{color:rgba(255,255,255,.4);}
.ao-bulk-ta-wrap{position:relative;}
.ao-bulk-sug-box{position:absolute;bottom:calc(100%+5px);left:0;min-width:200px;background:#2d3548;border:1px solid rgba(255,255,255,.1);border-radius:var(--ao-r);z-index:999;box-shadow:var(--ao-shm);max-height:150px;overflow-y:auto;}
.ao-sug-dark.ao-sug-item:hover{background:rgba(255,255,255,.1);}
.ao-sug-dark .ao-sug-name{color:#fff;}
.ao-sug-dark .ao-sug-av{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border-color:rgba(255,255,255,.15);}
.ao-bulk-go{padding:0 24px;background:var(--ao-accent);color:#fff;border:none;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:all .14s;align-self:stretch;}
.ao-bulk-go:hover{background:#0b6a8a;}
  `;
  document.head.appendChild(s);
}