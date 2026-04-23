/**
 * assign-activity.js — SPOC Activity Assignment Screen
 * Features:
 *  - Dashboard stats (top)
 *  - Table View (flat table, like screenshot)
 *  - Hierarchy View (ob header + child rows)
 *  - Dept popup with branch/division selection
 *  - Assignee + Approver search/select dropdowns
 *  - Bulk assign in table view
 *  - Apply-to-all at ob level in hierarchy view
 */

const AA_DEPTS = ['Compliance', 'Risk', 'Legal', 'IT', 'Operations', 'HR', 'Finance'];
const AA_IS_SPOC = document.body.dataset.userRole === 'spoc';
let aaViewMode = 'table';

const AA_PEOPLE = {
  Compliance: ['Sneha Das', 'Meera Pillai', 'Arjun Kumar', 'Ravi Menon'],
  Risk: ['Anand Krishnan', 'Neha Rao', 'Vikram Singh', 'Pooja Shah'],
  Legal: ['Priya Nair', 'Suresh Iyer', 'Kavitha Reddy'],
  IT: ['Raj Iyer', 'Sanjay Mehta', 'Divya Nair', 'Arun Thomas'],
  Operations: ['Suresh Kumar', 'Lakshmi Rao', 'Rohit Gupta'],
  HR: ['Priya Sharma', 'Aditya Patel', 'Reshma Nair'],
  Finance: ['Rahul Verma', 'Shalini Menon', 'Kiran Bhat'],
};

const AA_DEPT_COLOR = {
  Compliance:'#4338ca', IT:'#0369a1', Legal:'#6d28d9',
  Risk:'#c2410c', Operations:'#15803d', Finance:'#475569', HR:'#854d0e'
};
const AA_DEPT_BG = {
  Compliance:'#eef2ff', IT:'#e0f2fe', Legal:'#f5f3ff',
  Risk:'#fff7ed', Operations:'#f0fdf4', Finance:'#f8fafc', HR:'#fef9c3'
};

/* ─── DATA ─────────────────────────────────────────────────── */
function _aaGetActivities(circId) {
    const base = [
    {
      clauseId: 'C1.1', clauseText: 'All Digital Platforms of REs shall be compliant with Section 40 of RPwD Act, 2016 relating to Accessibility.',
      obligations: [
        {
          obId: 'OB-3(a)', obText: 'Ensure all digital platforms comply with accessibility standards under RPwD Act',
          dept: 'Digital',
          activities: [
            { id: 'ACT-001', name: 'Identify all digital platforms such as website, mobile app, investor portal and WhatsApp-based servicing', assignee: 'Sneha Das', status: 'Assigned', dueDate: '2025-04-15' },
            { id: 'ACT-002', name: 'Review whether distributor platforms such as Groww, PhonePe and Upstox are covered', assignee: null, status: 'Unassigned', dueDate: '2025-04-30' },
            { id: 'ACT-003', name: 'Map all digital channels against Section 40 accessibility requirements', assignee: 'Meera Pillai', status: 'Assigned', dueDate: '2025-05-10' },
          ]
        },
        {
          obId: 'OB-3(b)', obText: 'Provide accessible information and communication technology to persons with disabilities',
          dept: 'Digital',
          activities: [
            { id: 'ACT-004', name: 'Ensure content is available in accessible formats', assignee: 'Sneha Das', status: 'Assigned', dueDate: '2025-04-15' },
            { id: 'ACT-005', name: 'Provide sign language interpretation, audio description and closed captioning', assignee: null, status: 'Unassigned', dueDate: '2025-04-30' },
            { id: 'ACT-006', name: 'Review all website and mobile content for hearing and visual accessibility', assignee: 'Meera Pillai', status: 'Assigned', dueDate: '2025-05-10' },
          ]
        },
         {
          obId: 'OB-3(d)', obText: 'Ensure websites and uploaded documents comply with accessibility standards',
          dept: 'Legal',
          activities: [
            { id: 'ACT-007', name: 'Ensure website follows Government website accessibility guidelines', assignee: 'Sneha Das', status: 'Assigned', dueDate: '2025-04-15' },
            { id: 'ACT-008', name: 'Publish documents in OCR-based PDF or ePUB format', assignee: null, status: 'Unassigned', dueDate: '2025-04-30' },
            { id: 'ACT-009', name: 'Review all uploaded documents for accessibility before publishing', assignee: 'Meera Pillai', status: 'Assigned', dueDate: '2025-05-10' },
          ]
        }
        
      ]
    },
    {
      clauseId: 'C1.2', clauseText: 'Within 1 month of the issuance of circular, REs shall submit a list of digital platforms provided by them for the investors and submit a compliance/action taken report.',
      obligations: [
        {
          obId: '5(1)', obText: 'Submit digital platform inventory',
          dept: 'Compliance',
          activities: [
            { id: 'ACT-0010', name: 'Prepare list of all digital platforms provided to investors', assignee: 'Arjun Kumar', status: 'Assigned', dueDate: '2025-03-31' },
            { id: 'ACT-011', name: 'Submit compliance report for each clause of the circular', assignee: 'Arjun Kumar', status: 'Assigned', dueDate: '2025-04-05' },
            { id: 'ACT-012', name: 'Complete filing by August 31, 2025', assignee: null, status: 'Unassigned', dueDate: '2025-04-20' },
          ]
        },
         {
          obId: 'OB-5(1)', obText: 'Submit compliance report within one month',
          dept: 'Compliance',
          activities: [
            { id: 'ACT-0010', name: 'Prepare list of all digital platforms provided to investors', assignee: 'Arjun Kumar', status: 'Assigned', dueDate: '2025-03-31' },
            { id: 'ACT-011', name: 'Submit compliance report for each clause of the circular', assignee: 'Arjun Kumar', status: 'Assigned', dueDate: '2025-04-05' },
            { id: 'ACT-012', name: 'Complete filing by August 31, 2025', assignee: null, status: 'Unassigned', dueDate: '2025-04-20' },
          ]
        },
      ]
    },
    {
      clauseId: 'C2.1', clauseText: 'Within 45 days of the issuance of circular, REs shall appoint IAAP certified accessibility professionals as Auditor.',
      obligations: [
        {
          obId: 'OB-5(2)', obText: 'Appoint IAAP certified accessibility auditor',
          dept: 'Compliance',
          activities: [
            { id: 'ACT-013', name: 'Identify IAAP certified auditor', assignee: 'Suresh Kumar', status: 'Assigned', dueDate: '2025-04-08' },
            { id: 'ACT-014', name: 'Complete appointment by September 14, 2025', assignee: null, status: 'Unassigned', dueDate: '2025-09-14' },
            { id: 'ACT-015', name: 'Track readiness and compliance status for each digital platform', assignee: 'Lakshmi Rao', status: 'Assigned', dueDate: '2025-05-01' },
          ]
        },
      ]
    },
     {
      clauseId: 'C2.5(3)', clauseText: 'Within 3 month of issuance of the circular, REs shall conduct Accessibility Audit for the digital platforms.',
      obligations: [
        {
          obId: 'OB-5(3)', obText: 'Conduct accessibility audit for all digital platforms',
          dept: 'IT',
          activities: [
            { id: 'AV-008', name: 'Audit websites, mobile apps and portals', assignee: 'Raj Iyer', status: 'Assigned', dueDate: '2025-04-10' },
            { id: 'AV-009', name: 'Include usability testing by persons with disabilities', assignee: null, status: 'Unassigned', dueDate: '2025-04-25' },
            { id: 'AV-010', name: 'Complete accessibility audit by October 31, 2025', assignee: 'Sanjay Mehta', status: 'Assigned', dueDate: '2025-10-31' },

          ]
        },
      ]
    },

    {
      clauseId: 'C2.2', clauseText: 'Transaction monitoring systems shall detect and report suspicious activity in real-time.',
      obligations: [
        {
          obId: 'OB-008', obText: 'Upgrade transaction monitoring to real-time detection with max 5s latency.',
          dept: 'IT',
          activities: [
            { id: 'AV-008', name: 'Assess current TMS gaps vs requirements', assignee: 'Raj Iyer', status: 'Assigned', dueDate: '2025-04-10' },
            { id: 'AV-009', name: 'Evaluate and select TMS vendor', assignee: null, status: 'Unassigned', dueDate: '2025-04-25' },
            { id: 'AV-010', name: 'Configure real-time alert rules', assignee: 'Sanjay Mehta', status: 'Assigned', dueDate: '2025-05-15' },
            { id: 'AV-011', name: 'UAT testing and performance benchmark', assignee: null, status: 'Unassigned', dueDate: '2025-05-30' },
            { id: 'AV-012', name: 'Go-live and post-deployment monitoring', assignee: null, status: 'Unassigned', dueDate: '2025-06-15' },
          ]
        },
      ]
    },
    {
      clauseId: 'C3.2', clauseText: 'Annual third-party audit of compliance infrastructure, findings to Board within 30 days.',
      obligations: [
        {
          obId: 'OB-012', obText: 'Annual third-party audit of compliance infrastructure, findings to Board in 30 days.',
          dept: 'Risk',
          activities: [
            { id: 'AV-016', name: 'Identify and shortlist audit firms', assignee: 'Anand Krishnan', status: 'Assigned', dueDate: '2025-05-01' },
            { id: 'AV-017', name: 'Define audit scope and deliverables', assignee: 'Neha Rao', status: 'Assigned', dueDate: '2025-05-10' },
            { id: 'AV-018', name: 'Conduct audit and review findings', assignee: null, status: 'Unassigned', dueDate: '2025-06-30' },
            { id: 'AV-019', name: 'Present audit report to Board', assignee: null, status: 'Unassigned', dueDate: '2025-07-30' },
          ]
        },
      ]
    },
  ];
  if (!window._aaData) window._aaData = {};
  if (!window._aaData[circId]) window._aaData[circId] = JSON.parse(JSON.stringify(base));
  return window._aaData[circId];
}

function _aaAllActs(circId) {
  return _aaGetActivities(circId).flatMap(cl => cl.obligations.flatMap(ob => ob.activities));
}

function _aaCircMeta(circId) {
  return {
    circularRef:circId, regulator:'RBI', issueDate:'01 Apr 2024', effectiveDate:'01 Jul 2024',
    dueDate:'31 Mar 2025', legalArea:'Banking Regulation', subLegalArea:'Prudential Norms',
    frequency:'Monthly', category:'Mandatory Compliance', type:'Master Direction',
    docUrl:'#', docName:'RBI_Master_Direction_2024.pdf',
  };
}

function _aaSafeId(id) { return (id||'').replace(/\./g,'-').replace(/[^a-zA-Z0-9_-]/g,''); }

/* ─── PEOPLE POOL ───────────────────────────────────────────── */
function _aaGetPool(dept) {
  if (AA_IS_SPOC) {
    const depts = window.SPOC_PROFILE?.departments || [];
    return [...new Set(depts.flatMap(d => AA_PEOPLE[d]||[]))];
  }
  return dept && AA_PEOPLE[dept] ? AA_PEOPLE[dept] : [...new Set(Object.values(AA_PEOPLE).flat())];
}

/* ─── MAIN RENDER ───────────────────────────────────────────── */
window.renderAssignActivity = function(circId, deptFilter, activeTab='activities') {
  const area = document.getElementById('content-area');
  if (!area) return;
  _aaInjectStyles();

  const circs = (typeof CMS_DATA!=='undefined' && CMS_DATA.circulars) ? CMS_DATA.circulars : [
    {id:'CIRC-001',title:'Cybersecurity Framework for Regulated Entities',regulator:'RBI'},
    {id:'CIRC-002',title:'Enhanced KYC & AML Compliance Directive',regulator:'SEBI'},
    {id:'CIRC-003',title:'Operational Risk Management Guidelines',regulator:'RBI'},
    {id:'CIRC-005',title:'Third-Party & Vendor Risk Management Framework',regulator:'IRDAI'},
  ];

  const activeId   = circId || circs[0]?.id || 'CIRC-001';
  const activeCirc = circs.find(c=>c.id===activeId) || circs[0];

  area.innerHTML = _aaBuildPage(circs, activeCirc, deptFilter||'', activeTab);

  if (activeTab==='obligation') {
    if (typeof window.renderAssignObligation==='function') window.renderAssignObligation(activeCirc.id, deptFilter||'');
  } else {
    _aaRenderContent(activeCirc.id);
  }

  window._aaCurrentCircId = activeCirc.id;
  _aaBindAll(activeCirc.id, deptFilter||'');
};

/* ─── VIEW TOGGLE ───────────────────────────────────────────── */
window.aaSetView = function(mode) {
  aaViewMode = mode;
  ['table','hierarchy'].forEach(m => {
    const btn = document.getElementById(`aa-vt-${m}`);
    if (!btn) return;
    btn.style.background = m===mode ? '#4f46e5' : 'transparent';
    btn.style.color      = m===mode ? '#fff'    : '#64748b';
  });
  const circId = window._aaCurrentCircId;
  if (circId) _aaRenderContent(circId);
};

function _aaRenderContent(circId) {
  if (aaViewMode==='hierarchy') _aaRenderHierarchy(circId);
  else _aaRenderTable(circId);
}

/* ─── PAGE SHELL ────────────────────────────────────────────── */
function _aaBuildPage(circs, activeCirc, deptFilter, activeTab) {
  const allActs  = _aaAllActs(activeCirc.id);
  const total    = allActs.length;
  const assigned = allActs.filter(a=>a.status==='Assigned').length;
  const unassigned = total - assigned;
  const pct      = total ? Math.round(assigned/total*100) : 0;

  return `<div class="aa-page" id="aa-page">

  <!-- DRAWER OVERLAY -->
  <div class="aa-overlay" id="aa-overlay" style="display:none;" onclick="_aaOverlayClick(event)">
    <div class="aa-drawer" id="aa-drawer"><div id="aa-drawer-content"></div></div>
  </div>

  <div class="aa-wrap">

    <!-- PAGE HEAD -->
    <div class="aa-page-head">
      <div>
        <div class="aa-head-eyebrow">Department Assignment Console</div>
        <div class="aa-head-title">Activity Assignment</div>
        <div class="aa-head-sub">Clause → Obligation → Activity</div>
      </div>
      <div class="aa-head-right">
       
        <!-- VIEW TOGGLE -->
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <div style="display:flex;background:#f1f5f9;border-radius:8px;padding:3px;gap:2px;">
        <button id="aa-vt-table" onclick="aaSetView('table')"
          style="padding:6px 16px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;background:#4f46e5;color:#fff;font-family:inherit;transition:all .15s;">
          ≡ Table
        </button>
        <button id="aa-vt-hierarchy" onclick="aaSetView('hierarchy')"
          style="padding:6px 16px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;background:transparent;color:#64748b;font-family:inherit;transition:all .15s;">
          ⊕ Hierarchy
        </button>
      </div>
    </div>
        </div>
     
    </div>

    <!-- DASHBOARD CARDS -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
      <div style="background:#dcfce7;border:1px solid #86efac;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:22px;">✅</span>
        <div><div id="aa-dash-assigned" style="font-size:22px;font-weight:800;color:#15803d;">${assigned}</div>
        <div style="font-size:11px;font-weight:600;color:#15803d;margin-top:1px;">Assignment Completed</div></div>
      </div>
      <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:22px;">⏳</span>
        <div><div id="aa-dash-pending" style="font-size:22px;font-weight:800;color:#b45309;">${unassigned}</div>
        <div style="font-size:11px;font-weight:600;color:#b45309;margin-top:1px;">Pending Assignment</div></div>
      </div>
      <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:22px;">📋</span>
        <div><div style="font-size:22px;font-weight:800;color:#4338ca;">${total}</div>
        <div style="font-size:11px;font-weight:600;color:#4338ca;margin-top:1px;">Total Activities</div></div>
      </div>
      <div style="background:#dbeafe;border:1px solid #93c5fd;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:22px;">📊</span>
        <div><div id="aa-dash-pct" style="font-size:22px;font-weight:800;color:#0369a1;">${pct}%</div>
        <div style="font-size:11px;font-weight:600;color:#0369a1;margin-top:1px;">Completion Rate</div></div>
      </div>
    </div>

    <!-- FILTER CARD -->
    <div class="aa-filter-card">
      <div class="aa-fc-field">
        <span class="aa-fc-label">Circular</span>
        <div class="aa-custom-sel-wrap" id="aa-csel-wrap">
          <button class="aa-custom-sel-btn" id="aa-csel-btn">
            <span class="aa-csel-id">${activeCirc.id}</span>
            <span class="aa-csel-title">${activeCirc.title.substring(0,34)}…</span>
            <span class="aa-csel-arr">▾</span>
          </button>
          <div class="aa-csel-drop" id="aa-csel-drop" style="display:none;">
            <input class="aa-csel-search" id="aa-csel-search" placeholder="Search…" autocomplete="off"/>
            <div class="aa-csel-list">
              ${circs.map(c=>`<div class="aa-csel-item ${c.id===activeCirc.id?'active':''}" onclick="_aaSwitchCirc('${c.id}')">
                <span class="aa-csel-item-id">${c.id}</span>
                <span class="aa-csel-item-title">${c.title}</span>
              </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      ${AA_IS_SPOC ? `
      <div class="aa-fc-field">
        <span class="aa-fc-label">Branch</span>
        <select class="aa-flt-sel" id="aa-filter-branch" onchange="_aaApplyFilters('${activeCirc.id}')">
          <option value="">All Branches</option>
          ${(window.SPOC_PROFILE?.branches||[window.SPOC_PROFILE?.branch]).filter(Boolean).map(b=>`<option>${b}</option>`).join('')}
        </select>
      </div>
      <div class="aa-fc-field">
        <span class="aa-fc-label">Department</span>
        <select class="aa-flt-sel" id="aa-filter-dept" onchange="_aaApplyFilters('${activeCirc.id}')">
          <option value="">All Departments</option>
          ${(window.SPOC_PROFILE?.departments||[]).map(d=>`<option ${d===deptFilter?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>` : `
      <div class="aa-fc-field">
        <span class="aa-fc-label">Department</span>
        <select class="aa-flt-sel" id="aa-filter-dept" onchange="_aaApplyFilters('${activeCirc.id}')">
          <option value="">All Departments</option>
          ${AA_DEPTS.map(d=>`<option ${d===deptFilter?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>`}

      <div class="aa-fc-field">
        <span class="aa-fc-label">Status</span>
        <select class="aa-flt-sel" id="aa-filter-status" onchange="_aaApplyFilters('${activeCirc.id}')">
          <option value="">All Statuses</option>
          <option>Assigned</option><option>Unassigned</option>
        </select>
      </div>
      <div class="aa-fc-field">
        <span class="aa-fc-label">From Date</span>
        <input type="date" class="aa-flt-date" id="aa-filter-from" onchange="_aaApplyFilters('${activeCirc.id}')"/>
      </div>
      <div class="aa-fc-field">
        <span class="aa-fc-label">To Date</span>
        <input type="date" class="aa-flt-date" id="aa-filter-to" onchange="_aaApplyFilters('${activeCirc.id}')"/>
      </div>
      <div class="aa-fc-field aa-fc-search">
        <span class="aa-fc-label">Search</span>
        <input class="aa-search-inp" id="aa-search" placeholder="Search activities, obligations…" oninput="_aaApplyFilters('${activeCirc.id}')"/>
      </div>
      <div class="aa-stats-row">
        <div class="aa-stat-pill" id="aa-sp-total">${total} total</div>
        <div class="aa-stat-pill aa-sp-amber" id="aa-sp-unassigned">${unassigned} unassigned</div>
        <div class="aa-stat-pill aa-sp-green" id="aa-sp-assigned">${assigned} assigned</div>
      </div>
    </div>

   

    <div id="aa-tab-content"></div>

  </div>
</div>`;
}

/* ─── TABLE VIEW ────────────────────────────────────────────── */
function _aaRenderTable(circId) {
  const mount = document.getElementById('aa-tab-content');
  if (!mount) return;

  const rows = _aaGetActivities(circId).flatMap(cl =>
    cl.obligations.flatMap(ob => ob.activities.map(act=>({act,ob,cl})))
  );

  mount.innerHTML = `
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(30,36,51,.07);">

    <!-- TABLE TOOLBAR -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid #e2e8f0;flex-wrap:wrap;gap:10px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <label style="display:inline-flex;align-items:center;gap:7px;cursor:pointer;font-size:13px;font-weight:600;color:#475569;">
          <input type="checkbox" id="aa-flat-sel-all" onchange="_aaFlatToggleAll(this.checked,'${circId}')"
            style="width:15px;height:15px;accent-color:#6366f1;cursor:pointer;"/>
          Select All
        </label>
        <span style="font-size:14px;font-weight:700;color:#1e293b;">${rows.length} action items</span>
      </div>
      <div id="aa-flat-bulk-bar" style="display:none;align-items:center;gap:8px;flex-wrap:wrap;">
        <span id="aa-flat-sel-count" style="font-size:12px;font-weight:700;color:#6366f1;background:#eef2ff;padding:3px 10px;border-radius:20px;"></span>
        <button onclick="_aaFlatBulkAssignPopup('${circId}')"
          style="padding:6px 14px;background:#6366f1;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">
          Bulk Assign →
        </button>
        <button onclick="_aaFlatClearSel()"
          style="padding:6px 10px;background:#fff;color:#64748b;border:1.5px solid #e2e8f0;border-radius:7px;font-size:12px;cursor:pointer;font-family:inherit;">
          ✕ Clear
        </button>
      </div>
    </div>

    <!-- TABLE -->
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="${TH}">OBL ID</th>
            <th style="${TH}">Obligation</th>
            <th style="${TH}">Action</th>
            <th style="${TH}">Department(s)</th>
            <th style="${TH}">Assigned To</th>
            <th style="${TH}">Approver</th>
            <th style="${TH}">Assignment Status</th>
            <th style="${TH}">Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(({act,ob,cl})=>_aaFlatRow(act,ob,cl,circId)).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

const TH = 'padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid #e2e8f0;white-space:nowrap;';

function _aaFlatRow(act, ob, cl, circId) {
  const dc  = AA_DEPT_COLOR[ob.dept]||'#475569';
  const db  = AA_DEPT_BG[ob.dept]||'#f1f5f9';
  const stBg    = act.status==='Assigned'?'#eef2ff':'#f1f5f9';
  const stColor = act.status==='Assigned'?'#4338ca':'#64748b';

  return `
<tr id="aa-flat-row-${act.id}"
  data-actid="${act.id}" data-circid="${circId}" data-obid="${_aaSafeId(ob.obId)}"
  data-dept="${ob.dept||''}" data-branch="${ob.branch||''}" data-status="${act.status}"
  data-duedate="${act.dueDate||''}"
  data-search="${act.name.toLowerCase()} ${ob.obText.toLowerCase()} ${(ob.dept||'').toLowerCase()}"
  class="aa-act-row ${act.status==='Unassigned'?'aa-act-unassigned':''}"
  style="border-bottom:1px solid #f1f5f9;" onmouseover="this.style.background='#fafbff'" onmouseout="this.style.background=''">

  <!-- OBL ID + checkbox -->
  <td style="padding:12px 14px;white-space:nowrap;">
    <label style="display:inline-flex;align-items:center;gap:7px;cursor:pointer;">
      <input type="checkbox" class="aa-flat-row-chk" data-actid="${act.id}"
        onchange="_aaFlatRowCheck('${circId}')"
        style="width:14px;height:14px;accent-color:#6366f1;cursor:pointer;"/>
      <span onclick="_aaOpenDrawer('${act.id}','${ob.obId}','${cl.clauseId}','${circId}')"
        style="font-family:monospace;font-size:11px;font-weight:700;color:#6366f1;background:#eef2ff;padding:3px 8px;border-radius:5px;cursor:pointer;white-space:nowrap;">
        ${ob.obId}
      </span>
    </label>
  </td>

  <!-- OBLIGATION -->
  <td style="padding:12px 14px;max-width:170px;">
    <span style="font-size:12px;color:#64748b;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.4;">${ob.obText}</span>
  </td>

  <!-- ACTION -->
  <td style="padding:12px 14px;max-width:220px;">
    <span onclick="_aaOpenDrawer('${act.id}','${ob.obId}','${cl.clauseId}','${circId}')"
      style="font-size:13px;font-weight:500;color:#1e293b;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.4;cursor:pointer;">
      ${act.name}
    </span>
  </td>

  <!-- DEPARTMENT — clickable chip opens popup -->
  <td style="padding:12px 14px;" onclick="event.stopPropagation()">
    <div style="position:relative;" id="aa-dept-wrap-${act.id}">
      <span onclick="_aaShowDeptPopup('${act.id}','${ob.obId}','${cl.clauseId}','${circId}')"
        style="display:inline-flex;align-items:center;gap:4px;background:${db};color:${dc};border:1px solid ${dc}33;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
        ${ob.dept||'—'} <span style="font-size:9px;opacity:.6;">▾</span>
      </span>
    </div>
  </td>

  <!-- ASSIGNED TO — search input -->
  <td style="padding:12px 14px;" onclick="event.stopPropagation()">
    <div style="position:relative;">
      <input id="aa-assignee-inp-${act.id}" value="${act.assignee||''}" placeholder="Search…" autocomplete="off"
        style="width:130px;padding:5px 9px;background:${act.assignee?'#e6f4f9':'#f8fafc'};border:1.5px solid ${act.assignee?'#b2ddef':'#e2e8f0'};border-radius:6px;font-size:12px;font-family:inherit;outline:none;color:#1e293b;"
        oninput="_aaPersonSearch(event,'${act.id}','assignee','${ob.dept}','${circId}','${ob.obId}','${cl.clauseId}')"
        onfocus="_aaPersonSearch(event,'${act.id}','assignee','${ob.dept}','${circId}','${ob.obId}','${cl.clauseId}')"/>
      <div id="aa-sug-assignee-${act.id}" class="aa-sug-box" style="display:none;min-width:160px;"></div>
    </div>
  </td>

  <!-- APPROVER — search input -->
  <td style="padding:12px 14px;" onclick="event.stopPropagation()">
    <div style="position:relative;">
      <input id="aa-approver-inp-${act.id}" value="${act.approver||ob.approver||''}" placeholder="Search…" autocomplete="off"
        style="width:130px;padding:5px 9px;background:${(act.approver||ob.approver)?'#faf5ff':'#f8fafc'};border:1.5px solid ${(act.approver||ob.approver)?'#c4b5fd':'#e2e8f0'};border-radius:6px;font-size:12px;font-family:inherit;outline:none;color:#1e293b;"
        oninput="_aaPersonSearch(event,'${act.id}','approver','${ob.dept}','${circId}','${ob.obId}','${cl.clauseId}')"
        onfocus="_aaPersonSearch(event,'${act.id}','approver','${ob.dept}','${circId}','${ob.obId}','${cl.clauseId}')"/>
      <div id="aa-sug-approver-${act.id}" class="aa-sug-box" style="display:none;min-width:160px;"></div>
    </div>
  </td>

  <!-- STATUS -->
  <td style="padding:12px 14px;white-space:nowrap;">
    <span id="aa-flat-status-${act.id}" style="background:${stBg};color:${stColor};padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;">${act.status}</span>
  </td>

  <!-- DUE DATE -->
  <td style="padding:12px 14px;white-space:nowrap;font-size:12px;color:#64748b;">${act.dueDate||'—'}</td>

</tr>`;
}

/* ─── HIERARCHY VIEW ────────────────────────────────────────── */
function _aaRenderHierarchy(circId) {
  const mount = document.getElementById('aa-tab-content');
  if (!mount) return;

  mount.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;">
    ${_aaGetActivities(circId).flatMap(cl =>
      cl.obligations.map(ob => _aaHierOb(ob, cl, circId))
    ).join('')}
  </div>`;
}

function _aaHierOb(ob, cl, circId) {
  const safeObId     = _aaSafeId(ob.obId);
  const assignedCnt  = ob.activities.filter(a=>a.status==='Assigned').length;
  const dc  = AA_DEPT_COLOR[ob.dept]||'#475569';
  const db  = AA_DEPT_BG[ob.dept]||'#f1f5f9';

  return `
<div id="aa-ob-card-${safeObId}" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">

  <!-- LIGHT HEADER -->
  <div style="background:linear-gradient(135deg,#cbccce,#e8edf5);border-bottom:2px solid #cbd5e1;padding:14px 18px;">

    <!-- OB TITLE -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <span style="font-family:monospace;font-size:11px;font-weight:700;color:#4338ca;background:#eef2ff;padding:2px 8px;border-radius:4px;flex-shrink:0;">${ob.obId}</span>
      <span style="font-size:12px;color:#1e293b;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${ob.obText}">${ob.obText}</span>
      <span style="font-size:10px;font-weight:700;padding:2px 10px;border-radius:20px;background:#dcfce7;color:#15803d;border:1px solid #86efac;flex-shrink:0;">${assignedCnt}/${ob.activities.length} assigned</span>
      <button onclick="_aaToggleOb('${safeObId}')"
        style="background:#fff;border:1px solid #cbd5e1;color:#64748b;border-radius:6px;padding:4px 12px;font-size:11px;cursor:pointer;font-family:inherit;flex-shrink:0;">▼</button>
    </div>

    <!-- BULK ASSIGN ROW -->
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;">
      <span style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;flex-shrink:0;">Assign all:</span>

      <!-- Dept chip -->
      <span id="aa-ob-dept-chip-${safeObId}"
        onclick="_aaShowObPopup('${safeObId}','${cl.clauseId}','${circId}')"
        style="display:inline-flex;align-items:center;gap:4px;background:${db};color:${dc};border:1px solid ${dc}33;padding:5px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;">
        ${ob.dept||'Select Dept'} <span style="font-size:9px;opacity:.7;">▾</span>
      </span>

      <!-- Assignee -->
      <div style="position:relative;flex:1;min-width:140px;">
        <input id="aa-ob-assignee-${safeObId}" placeholder="Assignee for all…" autocomplete="off"
          style="width:100%;padding:6px 10px;background:rgba(255,255,255,.9);border:1px solid gray;border-radius:6px;font-size:12px;font-family:inherit;outline:none;color:#1e293b;box-sizing:border-box;"
          oninput="_aaObSearch('${safeObId}','assignee',this.value,'${circId}')"
          onfocus="_aaObSearch('${safeObId}','assignee',this.value,'${circId}')"/>
        <div id="aa-ob-sug-assignee-${safeObId}" style="position:absolute;top:calc(100%+3px);left:0;right:0;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.14);max-height:180px;overflow-y:auto;display:none;"></div>
      </div>

      <!-- Approver -->
      <div style="position:relative;flex:1;min-width:140px;">
        <input id="aa-ob-approver-${safeObId}" placeholder="Approver for all…" autocomplete="off"
          style="width:100%;padding:6px 10px;background:rgba(255,255,255,.9);border:1px solid gray;border-radius:6px;font-size:12px;font-family:inherit;outline:none;color:#1e293b;box-sizing:border-box;"
          oninput="_aaObSearch('${safeObId}','approver',this.value,'${circId}')"
          onfocus="_aaObSearch('${safeObId}','approver',this.value,'${circId}')"/>
        <div id="aa-ob-sug-approver-${safeObId}" style="position:absolute;top:calc(100%+3px);left:0;right:0;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.14);max-height:180px;overflow-y:auto;display:none;"></div>
      </div>

      <button onclick="_aaObApplyAll('${safeObId}','${cl.clauseId}','${circId}')"
        style="padding:6px 16px;background:#6366f1;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0;">
        Apply to All ✓
      </button>
    </div>
  </div>

  <!-- ACTIVITY TABLE -->
  <div id="aa-ob-body-${safeObId}" style="background:#fff;overflow-x:auto;">
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="${TH}"><label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" onchange="_aaObCheckAllHier(this,'${safeObId}')" style="width:14px;height:14px;accent-color:#6366f1;cursor:pointer;"/> Act ID
          </label></th>
          <th style="${TH}">Action</th>
          <th style="${TH}">Assigned To</th>
          <th style="${TH}">Approver</th>
          <th style="${TH}">Status</th>
          <th style="${TH}">Due Date</th>
        </tr>
      </thead>
      <tbody>
        ${ob.activities.map(act=>`
        <tr id="aa-hier-row-${act.id}" data-actid="${act.id}" data-obid="${safeObId}"
          style="border-bottom:1px solid #f9fafb;" onmouseover="this.style.background='#fafbff'" onmouseout="this.style.background=''">

          <td style="padding:10px 14px;white-space:nowrap;">
            <label style="display:inline-flex;align-items:center;gap:7px;cursor:pointer;">
              <input type="checkbox" class="aa-hier-row-chk" data-actid="${act.id}" data-obid="${safeObId}"
                style="width:14px;height:14px;accent-color:#6366f1;cursor:pointer;"/>
              <span style="font-family:monospace;font-size:10px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 7px;border-radius:4px;">${act.id}</span>
            </label>
          </td>

          <td style="padding:10px 14px;max-width:260px;">
            <span style="font-size:12px;font-weight:500;color:#1e293b;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.4;">${act.name}</span>
          </td>

         <td style="padding:10px 14px;" onclick="event.stopPropagation()">
            <div style="position:relative;">
              <input id="aa-act-assignee-${act.id}" value="${act.assignee||''}" placeholder="Search…" autocomplete="off"
                style="width:130px;padding:5px 9px;background:${act.assignee?'#e6f4f9':'#f8fafc'};border:1.5px solid ${act.assignee?'#b2ddef':'#e2e8f0'};border-radius:6px;font-size:12px;font-family:inherit;outline:none;color:#1e293b;"
                oninput="_aaHierInput(this,'${act.id}','assignee','${ob.dept}','${circId}','${ob.obId}','${cl.clauseId}')"
                onfocus="_aaHierInput(this,'${act.id}','assignee','${ob.dept}','${circId}','${ob.obId}','${cl.clauseId}')"/>
              <div id="aa-hier-sug-assignee-${act.id}" class="aa-sug-box" style="display:none;min-width:160px;position:absolute;top:calc(100% + 4px);left:0;z-index:999;"></div>
            </div>
          </td>

          <td style="padding:10px 14px;" onclick="event.stopPropagation()">
            <div style="position:relative;">
              <input id="aa-act-approver-${act.id}" value="${act.approver||ob.approver||''}" placeholder="Search…" autocomplete="off"
                style="width:130px;padding:5px 9px;background:${(act.approver||ob.approver)?'#faf5ff':'#f8fafc'};border:1.5px solid ${(act.approver||ob.approver)?'#c4b5fd':'#e2e8f0'};border-radius:6px;font-size:12px;font-family:inherit;outline:none;color:#1e293b;"
                oninput="_aaHierInput(this,'${act.id}','approver','${ob.dept}','${circId}','${ob.obId}','${cl.clauseId}')"
                onfocus="_aaHierInput(this,'${act.id}','approver','${ob.dept}','${circId}','${ob.obId}','${cl.clauseId}')"/>
              <div id="aa-hier-sug-approver-${act.id}" class="aa-sug-box" style="display:none;min-width:160px;position:absolute;top:calc(100% + 4px);left:0;z-index:999;"></div>
            </div>
          </td>

          <td style="padding:10px 14px;white-space:nowrap;">
            <span id="aa-hier-status-${act.id}"
              style="background:${act.status==='Assigned'?'#eef2ff':'#f1f5f9'};color:${act.status==='Assigned'?'#4338ca':'#64748b'};padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;">
              ${act.status}
            </span>
          </td>

          <td style="padding:10px 14px;white-space:nowrap;font-size:12px;color:#64748b;">${act.dueDate||'—'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`;
}

/* ─── HIERARCHY ROW SEARCH + PICK ──────────────────────────── */
window._aaHierInput = function(inp, actId, field, dept, circId, obId, clauseId) {
  const sugId = `aa-hier-sug-${field}-${actId}`;
  const sug = document.getElementById(sugId);
  if (!sug) return;

  const pool = _aaGetPool(dept);
  const q = (inp.value || '').trim().toLowerCase();
  const results = q ? pool.filter(p => p.toLowerCase().includes(q)) : pool.slice(0, 8);

  if (!results.length) { sug.style.display = 'none'; return; }

  sug.style.display = 'block';
  sug.innerHTML = results.map(p => `
    <div class="aa-sug-item"
      onmousedown="_aaHierPick('${actId}','${field}','${p.replace(/'/g,"\\'")}','${circId}','${obId}','${clauseId}')">
      <span class="aa-sug-av">${p.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}</span>
      <span class="aa-sug-name">${p}</span>
    </div>`).join('');

  /* close on outside click */
  const closeHandler = function(e) {
    if (!sug.contains(e.target) && e.target !== inp) {
      sug.style.display = 'none';
      document.removeEventListener('mousedown', closeHandler);
    }
  };
  document.removeEventListener('mousedown', closeHandler);
  setTimeout(() => document.addEventListener('mousedown', closeHandler), 0);
};

window._aaHierPick = function(actId, field, name, circId, obId, clauseId) {
  /* update input field */
  const inpId = field === 'assignee' ? `aa-act-assignee-${actId}` : `aa-act-approver-${actId}`;
  const inp = document.getElementById(inpId);
  if (inp) {
    inp.value = name;
    inp.style.borderColor = field === 'assignee' ? '#b2ddef' : '#c4b5fd';
    inp.style.background  = field === 'assignee' ? '#e6f4f9' : '#faf5ff';
  }

  /* hide dropdown */
  const sug = document.getElementById(`aa-hier-sug-${field}-${actId}`);
  if (sug) sug.style.display = 'none';

  /* save to data model */
  const clauses = _aaGetActivities(circId);
  for (const c of clauses) {
    for (const o of c.obligations) {
      const act = o.activities.find(a => a.id === actId);
      if (act) {
        if (field === 'assignee') { act.assignee = name; act.status = 'Assigned'; }
        if (field === 'approver') act.approver = name;

        /* update status badge */
        const stEl = document.getElementById(`aa-hier-status-${actId}`);
        if (stEl && field === 'assignee') {
          stEl.textContent = 'Assigned';
          stEl.style.background = '#eef2ff';
          stEl.style.color = '#4338ca';
        }

        _aaUpdateStats(circId);
        if (typeof showToast === 'function')
          showToast(`${field === 'assignee' ? 'Assigned' : 'Approver set'}: ${name}`, 'success');
        return;
      }
    }
  }
};

window._aaHierSearch = function(inp, actId, field, dept, circId, obId, clauseId) {
  const query = inp.value;
  const sugId = `aa-hier-sug-${field}-${actId}`;
  const sug = document.getElementById(sugId);
  if (!sug) return;

  const pool = _aaGetPool(dept);
  const q = query.trim().toLowerCase();
  const res = q ? pool.filter(p => p.toLowerCase().includes(q)) : pool.slice(0, 8);

  if (!res.length) { sug.style.display = 'none'; return; }
  sug.style.display = 'block';
  sug.innerHTML = res.map(p => `
  <div class="aa-sug-item" onclick="_aaHierPickPerson('${actId}','${field}','${p.replace(/'/g,"\\'")}','${circId}','${obId}','${clauseId}')">
    <span class="aa-sug-av">${p.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span>
    <span class="aa-sug-name">${p}</span>
  </div>`).join('');

  setTimeout(() => {
    document.addEventListener('click', function h(e) {
      if (!sug.contains(e.target)) { sug.style.display = 'none'; document.removeEventListener('click', h); }
    });
  }, 0);
};

window._aaHierPickPerson = function(actId, field, name, circId, obId, clauseId) {
  // update the correct hierarchy input
  const inpId = field === 'assignee' ? `aa-act-assignee-${actId}` : `aa-act-approver-${actId}`;
  const inp = document.getElementById(inpId);
  if (inp) {
    inp.value = name;
    inp.style.borderColor = field === 'assignee' ? '#b2ddef' : '#c4b5fd';
    inp.style.background  = field === 'assignee' ? '#e6f4f9' : '#faf5ff';
  }

  // hide suggestion box
  const sug = document.getElementById(`aa-hier-sug-${field}-${actId}`);
  if (sug) sug.style.display = 'none';

  // save to data + update status badge
  const clauses = _aaGetActivities(circId);
  for (const c of clauses) {
    for (const o of c.obligations) {
      const act = o.activities.find(a => a.id === actId);
      if (act) {
        if (field === 'assignee') { act.assignee = name; act.status = 'Assigned'; }
        if (field === 'approver') act.approver = name;

        const stEl = document.getElementById(`aa-hier-status-${actId}`);
        if (stEl && field === 'assignee') {
          stEl.textContent = 'Assigned';
          stEl.style.background = '#eef2ff';
          stEl.style.color = '#4338ca';
        }
        if (typeof showToast === 'function') showToast(`${field === 'assignee' ? 'Assigned' : 'Approver set'}: ${name}`, 'success');
        _aaUpdateStats(circId);
        return;
      }
    }
  }
};

window._aaToggleOb = function(safeObId) {
  const body = document.getElementById(`aa-ob-body-${safeObId}`);
  if (!body) return;
  body.style.display = body.style.display==='none' ? '' : 'none';
};

window._aaObCheckAllHier = function(masterChk, safeObId) {
  document.querySelectorAll(`.aa-hier-row-chk[data-obid="${safeObId}"]`).forEach(c=>c.checked=masterChk.checked);
};

/* ─── PERSON SEARCH (shared for both views) ─────────────────── */
window._aaPersonSearch = function(evt, actId, field, dept, circId, obId, clauseId) {
  const inp = evt.target;
  const query = inp.value;

  // works for both table (aa-sug-) and hierarchy (aa-hier-sug-)
  const sugId = document.getElementById(`aa-hier-sug-${field}-${actId}`)
    ? `aa-hier-sug-${field}-${actId}`
    : `aa-sug-${field}-${actId}`;
  const sug = document.getElementById(sugId);
  if (!sug) return;

  const pool = _aaGetPool(dept);
  const q = query.trim().toLowerCase();
  const res = q ? pool.filter(p=>p.toLowerCase().includes(q)) : pool.slice(0,8);

  if (!res.length) { sug.style.display='none'; return; }
  sug.style.display='block';
  sug.innerHTML = res.map(p=>`
  <div class="aa-sug-item" onclick="_aaPickPerson('${actId}','${field}','${p.replace(/'/g,"\\'")}','${circId}','${obId}','${clauseId}')">
    <span class="aa-sug-av">${p.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span>
    <span class="aa-sug-name">${p}</span>
  </div>`).join('');

  setTimeout(()=>{
    document.addEventListener('click',function h(e){
      if(!sug.contains(e.target)){sug.style.display='none';document.removeEventListener('click',h);}
    });
  },0);
};

window._aaPickPerson = function(actId, field, name, circId, obId, clauseId) {
  /* update input */
  const inpIds = [`aa-assignee-inp-${actId}`,`aa-approver-inp-${actId}`,`aa-act-assignee-${actId}`,`aa-act-approver-${actId}`];
  const targetId = field==='assignee' ? [`aa-assignee-inp-${actId}`,`aa-act-assignee-${actId}`] : [`aa-approver-inp-${actId}`,`aa-act-approver-${actId}`];
  targetId.forEach(id=>{
    const el = document.getElementById(id);
    if (!el) return;
    el.value=name;
    el.style.borderColor = field==='assignee'?'#b2ddef':'#c4b5fd';
    el.style.background  = field==='assignee'?'#e6f4f9':'#faf5ff';
  });

  /* hide sug */
  document.getElementById(`aa-sug-${field}-${actId}`)?.style && (document.getElementById(`aa-sug-${field}-${actId}`).style.display='none');

  /* save to data */
  const clauses = _aaGetActivities(circId);
  for (const c of clauses) {
    for (const o of c.obligations) {
      const act = o.activities.find(a=>a.id===actId);
      if (act) {
        if (field==='assignee'){ act.assignee=name; act.status='Assigned'; }
        if (field==='approver') act.approver=name;

        /* update status badges */
        ['aa-flat-status-','aa-hier-status-'].forEach(prefix=>{
          const el=document.getElementById(prefix+actId);
          if (el && field==='assignee'){ el.textContent='Assigned'; el.style.background='#eef2ff'; el.style.color='#4338ca'; }
        });
        const row=document.getElementById(`aa-flat-row-${actId}`);
        if (row && field==='assignee') row.dataset.status='Assigned';

        if (typeof showToast==='function') showToast(`${field==='assignee'?'Assigned':'Approver set'}: ${name}`,'success');
        _aaUpdateStats(circId);
        return;
      }
    }
  }
};

/* ─── OB-LEVEL SEARCH (hierarchy bulk row) ───────────────────── */
window._aaObSearch = function(safeObId, field, query, circId) {
  const sugId = `aa-ob-sug-${field}-${safeObId}`;
  const sug = document.getElementById(sugId);
  if (!sug) return;
  const pool = _aaGetPool(null);
  const q = (query||'').trim().toLowerCase();
  const res = q ? pool.filter(p=>p.toLowerCase().includes(q)) : pool.slice(0,8);
  if (!res.length){ sug.style.display='none'; return; }
  sug.style.display='block';
  sug.innerHTML = res.map(p=>`
  <div style="display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;font-size:13px;"
    onmouseover="this.style.background='#eef2ff'" onmouseout="this.style.background=''"
    onclick="document.getElementById('aa-ob-${field}-${safeObId}').value='${p}';document.getElementById('${sugId}').style.display='none';">
    <div style="width:24px;height:24px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      ${p.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
    </div>${p}
  </div>`).join('');
  setTimeout(()=>{
    document.addEventListener('click',function h(e){if(!sug.contains(e.target)){sug.style.display='none';document.removeEventListener('click',h);}});
  },0);
};

window._aaObApplyAll = function(safeObId, clauseId, circId) {
  const assignee = document.getElementById(`aa-ob-assignee-${safeObId}`)?.value?.trim();
  const approver = document.getElementById(`aa-ob-approver-${safeObId}`)?.value?.trim();
  if (!assignee && !approver){ if(typeof showToast==='function') showToast('Enter assignee or approver first','warning'); return; }

  const clauses = _aaGetActivities(circId);
  for (const c of clauses) {
    for (const o of c.obligations) {
      if (_aaSafeId(o.obId)===safeObId) {
        o.activities.forEach(act=>{
          if (assignee){ act.assignee=assignee; act.status='Assigned'; }
          if (approver) act.approver=approver;
          const aInp=document.getElementById(`aa-act-assignee-${act.id}`);
          const apInp=document.getElementById(`aa-act-approver-${act.id}`);
          const stEl=document.getElementById(`aa-hier-status-${act.id}`);
          if(aInp&&assignee){aInp.value=assignee;aInp.style.borderColor='#b2ddef';aInp.style.background='#e6f4f9';}
          if(apInp&&approver){apInp.value=approver;apInp.style.borderColor='#c4b5fd';apInp.style.background='#faf5ff';}
          if(stEl&&assignee){stEl.textContent='Assigned';stEl.style.background='#eef2ff';stEl.style.color='#4338ca';}
        });
        break;
      }
    }
  }
  _aaUpdateStats(circId);
  if(typeof showToast==='function') showToast(`Applied to all actions ✓`,'success');
};

/* ─── DEPT POPUP (table view row dept chip) ─────────────────── */
window._aaShowDeptPopup = function(actId, obId, clauseId, circId) {
  _aaRemovePopup();
  const clauses = _aaGetActivities(circId);
  let currentOb=null;
  for(const c of clauses){ for(const o of c.obligations){ if(o.obId===obId){currentOb=o;break;} } if(currentOb) break; }

  _aaCreatePopup(actId, currentOb, circId, obId, clauseId, false);
};

/* ─── OB POPUP (hierarchy ob header dept chip) ──────────────── */
window._aaShowObPopup = function(safeObId, clauseId, circId) {
  _aaRemovePopup();
  const clauses = _aaGetActivities(circId);
  let currentOb=null;
  for(const c of clauses){ for(const o of c.obligations){ if(_aaSafeId(o.obId)===safeObId){currentOb=o;break;} } if(currentOb) break; }

  _aaCreatePopup(safeObId, currentOb, circId, currentOb?.obId, clauseId, true);
};

function _aaRemovePopup() {
  document.getElementById('aa-assign-popup')?.remove();
}

window.SPOC_PROFILE = {
  branch: 'Bangalore',
  branches: ['Bangalore', 'Mumbai', 'Delhi'] // 👈 add this
}

function _aaCreatePopup(id, ob, circId, obId, clauseId, isObLevel) {
  const branches = window.SPOC_PROFILE?.branches || [window.SPOC_PROFILE?.branch].filter(Boolean);
  const hasMultiBranch = branches.length > 1;
  const safeObId = _aaSafeId(obId||'');

  const overlay = document.createElement('div');
  overlay.id = 'aa-assign-popup';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(3px);';
  overlay.onclick = e => { if(e.target===overlay) overlay.remove(); };

  const headerBg = isObLevel
    ? 'background:linear-gradient(135deg,#cbccce,#4f46e5);'
    : 'background:#f8fafc;border-bottom:1px solid #e2e8f0;';
  const headerText = isObLevel ? 'color:#fff;' : 'color:#1e293b;';
  const headerSubText = isObLevel ? 'color:rgba(255,255,255,.65);' : 'color:#94a3b8;';
  const closeBtnStyle = isObLevel
    ? 'background:rgba(255,255,255,.2);border:none;color:#fff;'
    : 'background:#e2e8f0;border:none;color:#64748b;';

  overlay.innerHTML = `
  <div style="background:#fff;border-radius:14px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);" onclick="event.stopPropagation()">

    <!-- HEADER -->
    <div style="padding:16px 20px;${headerBg}display:flex;align-items:flex-start;justify-content:space-between;">
      <div>
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;${headerSubText}">${isObLevel?'Assign All Actions':'Assign Department'}</div>
        <div style="font-size:13px;font-weight:700;margin-top:3px;max-width:380px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;${headerText}">${ob?.obId||''} — ${(ob?.obText||'').substring(0,60)}…</div>
      </div>
      <button onclick="document.getElementById('aa-assign-popup').remove()" style="width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:13px;flex-shrink:0;${closeBtnStyle}">✕</button>
    </div>

    <div style="padding:18px 20px;display:flex;flex-direction:column;gap:14px;">

      <!-- DEPT CHIPS -->
      <div>
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Department</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${AA_DEPTS.map(d=>{
            const dc=AA_DEPT_COLOR[d]||'#475569';
            const sel=ob?.dept===d;
            return `<button id="aa-popup-dchip-${d.replace(/\s/g,'_')}"
              onclick="_aaPopupSelectDept('${d}')"
              style="padding:5px 12px;background:${sel?dc:'#f1f5f9'};color:${sel?'#fff':dc};border:1.5px solid ${sel?dc:dc+'44'};border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;">${d}</button>`;
          }).join('')}
        </div>
      </div>

      <!-- BRANCH CHIPS (only if multi-branch) -->
      ${hasMultiBranch ? `
      <div>
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Branch / Division</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${branches.map(b=>`<button id="aa-popup-bchip-${b.replace(/\s/g,'_')}"
            onclick="_aaPopupSelectBranch('${b}')"
            style="padding:5px 12px;background:#f1f5f9;color:#475569;border:1.5px solid #e2e8f0;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">${b}</button>`).join('')}
          <button id="aa-popup-bchip-ALL" onclick="_aaPopupSelectBranch('ALL')"
            style="padding:5px 12px;background:#f5f3ff;color:#6d28d9;border:1.5px solid #c4b5fd;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">
            All Branches
          </button>
        </div>
      </div>` : ''}

      <!-- ASSIGNEE SEARCH -->
      <div>
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">Assign To</div>
        <div style="position:relative;">
          <input id="aa-popup-assignee-inp" placeholder="Search assignee…" autocomplete="off"
            style="width:100%;padding:9px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'"
            oninput="_aaPopupSearch('assignee',this.value)"/>
          <div id="aa-popup-sug-assignee" style="position:absolute;top:calc(100%+3px);left:0;right:0;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.12);max-height:160px;overflow-y:auto;display:none;"></div>
        </div>
      </div>

      <!-- APPROVER SEARCH -->
      <div>
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">Approver</div>
        <div style="position:relative;">
          <input id="aa-popup-approver-inp" placeholder="Search approver…" autocomplete="off"
            style="width:100%;padding:9px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'"
            oninput="_aaPopupSearch('approver',this.value)"/>
          <div id="aa-popup-sug-approver" style="position:absolute;top:calc(100%+3px);left:0;right:0;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.12);max-height:160px;overflow-y:auto;display:none;"></div>
        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <div style="padding:14px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:flex-end;gap:8px;">
      <button onclick="document.getElementById('aa-assign-popup').remove()"
        style="padding:8px 18px;background:#fff;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-weight:600;color:#475569;cursor:pointer;">Cancel</button>
      <button onclick="_aaPopupSave('${id}','${obId||''}','${clauseId}','${circId}',${isObLevel})"
        style="padding:8px 20px;background:#6366f1;border:none;border-radius:7px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;">
        ${isObLevel?'Apply to All ✓':'Save ✓'}
      </button>
    </div>
  </div>`;

  /* store metadata on popup */
  overlay.dataset.selectedDept   = ob?.dept||'';
 overlay.dataset.selectedBranches = ob?.branch ? ob.branch : '';
  overlay.dataset.isObLevel      = isObLevel ? '1' : '0';

  document.body.appendChild(overlay);

  /* pre-fill if ob level */
  if (isObLevel) {
    const safeId = _aaSafeId(obId||'');
    const existA = document.getElementById(`aa-ob-assignee-${safeId}`)?.value||'';
    const existP = document.getElementById(`aa-ob-approver-${safeId}`)?.value||'';
    if (existA) document.getElementById('aa-popup-assignee-inp').value=existA;
    if (existP) document.getElementById('aa-popup-approver-inp').value=existP;
  }
}



window._aaPopupSelectDept = function(dept) {
  AA_DEPTS.forEach(d=>{
    const c=document.getElementById(`aa-popup-dchip-${d.replace(/\s/g,'_')}`);
    if(!c) return;
    const dc=AA_DEPT_COLOR[d]||'#475569';
    c.style.background=d===dept?dc:'#f1f5f9';
    c.style.color=d===dept?'#fff':dc;
    c.style.borderColor=d===dept?dc:dc+'44';
  });
  document.getElementById('aa-assign-popup').dataset.selectedDept=dept;
};

window._aaPopupSelectBranch = function(b) {
 const popup = document.getElementById('aa-assign-popup');
  let arr = (popup.dataset.selectedBranches || '').split(',').filter(Boolean);

  if(b === 'ALL'){
    // If ALL selected → override everything
    arr = ['ALL'];
  } else {
    // Remove ALL if selecting individual
    arr = arr.filter(x => x !== 'ALL');

    if(arr.includes(b)){
      arr = arr.filter(x => x !== b); // unselect
    } else {
      arr.push(b); // select
    }
  }

  popup.dataset.selectedBranches = arr.join(',');

  _aaRefreshBranchUI();
};

function _aaRefreshBranchUI(){
  const popup = document.getElementById('aa-assign-popup');
  const selected = (popup.dataset.selectedBranches || '').split(',');

  // Normal branches
  document.querySelectorAll('[id^="aa-popup-bchip-"]').forEach(btn=>{
    const val = btn.id.replace('aa-popup-bchip-','').replace(/_/g,' ');

    if(selected.includes(val)){
      btn.style.background = '#6366f1';
      btn.style.color = '#fff';
      btn.style.borderColor = '#6366f1';
    } else {
      btn.style.background = '#f1f5f9';
      btn.style.color = '#475569';
      btn.style.borderColor = '#e2e8f0';
    }
  });
}

window._aaPopupSearch = function(field, query) {
  const sugId=`aa-popup-sug-${field}`;
  const sug=document.getElementById(sugId);
  if(!sug) return;
  const dept=document.getElementById('aa-assign-popup')?.dataset.selectedDept;
  const pool=_aaGetPool(dept);
  const q=(query||'').trim().toLowerCase();
  const res=q?pool.filter(p=>p.toLowerCase().includes(q)):pool.slice(0,8);
  if(!res.length){sug.style.display='none';return;}
  sug.style.display='block';
  sug.innerHTML=res.map(p=>`
  <div style="display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;font-size:13px;"
    onmouseover="this.style.background='#eef2ff'" onmouseout="this.style.background=''"
    onclick="document.getElementById('aa-popup-${field}-inp').value='${p}';document.getElementById('${sugId}').style.display='none';">
    <div style="width:24px;height:24px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      ${p.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
    </div>${p}
  </div>`).join('');
  setTimeout(()=>{document.addEventListener('click',function h(e){if(!sug.contains(e.target)){sug.style.display='none';document.removeEventListener('click',h);}});},0);
};

window._aaPopupSave = function(id, obId, clauseId, circId, isObLevel) {
  const popup    = document.getElementById('aa-assign-popup');
  const dept     = popup?.dataset.selectedDept;
  const branch   = popup?.dataset.selectedBranch;
  const assignee = document.getElementById('aa-popup-assignee-inp')?.value?.trim();
  const approver = document.getElementById('aa-popup-approver-inp')?.value?.trim();

  if (!dept && !assignee && !approver) {
    if(typeof showToast==='function') showToast('Set at least one field','warning');
    return;
  }

  const clauses = _aaGetActivities(circId);

  if (isObLevel) {
    /* apply to all activities under this ob */
    const safeObId = _aaSafeId(obId);
    for (const c of clauses) {
      for (const o of c.obligations) {
        if (_aaSafeId(o.obId)===safeObId) {
          if(dept)   o.dept=dept;
          if(branch) o.branch=branch;
          o.activities.forEach(act=>{
            if(assignee){act.assignee=assignee;act.status='Assigned';}
            if(approver) act.approver=approver;
            const aInp=document.getElementById(`aa-act-assignee-${act.id}`);
            const apInp=document.getElementById(`aa-act-approver-${act.id}`);
            const stEl=document.getElementById(`aa-hier-status-${act.id}`);
            if(aInp&&assignee){aInp.value=assignee;aInp.style.borderColor='#b2ddef';aInp.style.background='#e6f4f9';}
            if(apInp&&approver){apInp.value=approver;apInp.style.borderColor='#c4b5fd';apInp.style.background='#faf5ff';}
            if(stEl&&assignee){stEl.textContent='Assigned';stEl.style.background='#eef2ff';stEl.style.color='#4338ca';}
          });
          /* update dept chip */
          if (dept) {
            const dc=AA_DEPT_COLOR[dept]||'#475569';
            const chip=document.getElementById(`aa-ob-dept-chip-${safeObId}`);
            if(chip){chip.style.color=dc;chip.childNodes[0].textContent=dept+' ';}
          }
          /* sync ob row inputs */
          const obA=document.getElementById(`aa-ob-assignee-${safeObId}`);
          const obAp=document.getElementById(`aa-ob-approver-${safeObId}`);
          if(obA&&assignee) obA.value=assignee;
          if(obAp&&approver) obAp.value=approver;
          break;
        }
      }
    }
    if(typeof showToast==='function') showToast(`Applied to all actions in ${obId} ✓`,'success');
  } else {
    /* apply to single activity */
    const actId = id;
    for(const c of clauses){
      for(const o of c.obligations){
        if(o.obId===obId){
          if(dept)   o.dept=dept;
          if(branch) o.branch=branch;
          const act=o.activities.find(a=>a.id===actId);
          if(act){
            if(assignee){act.assignee=assignee;act.status='Assigned';}
            if(approver) act.approver=approver;
          }
          /* update dept chip in table */
          if(dept){
            const dc=AA_DEPT_COLOR[dept]||'#475569';
            const db=AA_DEPT_BG[dept]||'#f1f5f9';
            const wrap=document.getElementById(`aa-dept-wrap-${actId}`);
            if(wrap) wrap.innerHTML=`<span onclick="_aaShowDeptPopup('${actId}','${obId}','${clauseId}','${circId}')"
              style="display:inline-flex;align-items:center;gap:4px;background:${db};color:${dc};border:1px solid ${dc}33;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
              ${dept} <span style="font-size:9px;opacity:.6;">▾</span></span>`;
          }
          if(assignee){
            const aInp=document.getElementById(`aa-assignee-inp-${actId}`);
            if(aInp){aInp.value=assignee;aInp.style.borderColor='#b2ddef';aInp.style.background='#e6f4f9';}
            const stEl=document.getElementById(`aa-flat-status-${actId}`);
            if(stEl){stEl.textContent='Assigned';stEl.style.background='#eef2ff';stEl.style.color='#4338ca';}
            const row=document.getElementById(`aa-flat-row-${actId}`);
            if(row) row.dataset.status='Assigned';
          }
          if(approver){
            const apInp=document.getElementById(`aa-approver-inp-${actId}`);
            if(apInp){apInp.value=approver;apInp.style.borderColor='#c4b5fd';apInp.style.background='#faf5ff';}
          }
          break;
        }
      }
    }
    if(typeof showToast==='function') showToast('Assignment saved ✓','success');
  }

  _aaUpdateStats(circId);
  popup?.remove();
};

/* ─── BULK SELECT (table view) ───────────────────────────────── */
window._aaFlatToggleAll = function(checked, circId) {
  document.querySelectorAll('.aa-flat-row-chk').forEach(c=>c.checked=checked);
  _aaFlatUpdateBulkBar(circId);
};
window._aaFlatRowCheck = function(circId) { _aaFlatUpdateBulkBar(circId); };
window._aaFlatClearSel = function() {
  document.querySelectorAll('.aa-flat-row-chk').forEach(c=>c.checked=false);
  const sa=document.getElementById('aa-flat-sel-all'); if(sa) sa.checked=false;
  const bar=document.getElementById('aa-flat-bulk-bar'); if(bar) bar.style.display='none';
};
window._aaFlatUpdateBulkBar = function(circId) {
  const sel=document.querySelectorAll('.aa-flat-row-chk:checked');
  const bar=document.getElementById('aa-flat-bulk-bar');
  const cnt=document.getElementById('aa-flat-sel-count');
  if(bar) bar.style.display=sel.length?'flex':'none';
  if(cnt) cnt.textContent=`${sel.length} selected`;
};

window._aaFlatBulkAssignPopup = function(circId) {
  const sel=[...document.querySelectorAll('.aa-flat-row-chk:checked')].map(c=>c.dataset.actid);
  if(!sel.length) return;
  _aaRemovePopup();

  const branches=window.SPOC_PROFILE?.branches||[window.SPOC_PROFILE?.branch].filter(Boolean);
  const hasMultiBranch=branches.length>1;

  const overlay=document.createElement('div');
  overlay.id='aa-assign-popup';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(3px);';
  overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};

  overlay.innerHTML=`
  <div style="background:#fff;border-radius:14px;width:100%;max-width:480px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);" onclick="event.stopPropagation()">
    <div style="padding:16px 20px;border-bottom:1px solid #e2e8f0;background:#f8fafc;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Bulk Assignment</div>
        <div style="font-size:14px;font-weight:700;color:#1e293b;margin-top:2px;">${sel.length} action item${sel.length!==1?'s':''} selected</div>
      </div>
      <button onclick="document.getElementById('aa-assign-popup').remove()" style="width:28px;height:28px;border-radius:50%;background:#e2e8f0;border:none;cursor:pointer;font-size:13px;color:#64748b;">✕</button>
    </div>
    <div style="padding:18px 20px;display:flex;flex-direction:column;gap:14px;">
      <div>
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Department</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${AA_DEPTS.map(d=>{
            const dc=AA_DEPT_COLOR[d]||'#475569';
            return `<button id="aa-popup-dchip-${d.replace(/\s/g,'_')}"
              onclick="_aaPopupSelectDept('${d}')"
              style="padding:5px 12px;background:#f1f5f9;color:${dc};border:1.5px solid ${dc}44;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">${d}</button>`;
          }).join('')}
        </div>
      </div>
      ${hasMultiBranch?`
      <div>
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Branch / Division</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${branches.map(b=>`<button id="aa-popup-bchip-${b.replace(/\s/g,'_')}" onclick="_aaPopupSelectBranch('${b}')"
            style="padding:5px 12px;background:#f1f5f9;color:#475569;border:1.5px solid #e2e8f0;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">${b}</button>`).join('')}
          <button id="aa-popup-bchip-ALL" onclick="_aaPopupSelectBranch('ALL')"
            style="padding:5px 12px;background:#f5f3ff;color:#6d28d9;border:1.5px solid #c4b5fd;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">All Branches</button>
        </div>
      </div>`:''}
      <div>
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">Assign To</div>
        <div style="position:relative;">
          <input id="aa-popup-assignee-inp" placeholder="Search assignee…" autocomplete="off"
            style="width:100%;padding:9px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'"
            oninput="_aaPopupSearch('assignee',this.value)"/>
          <div id="aa-popup-sug-assignee" style="position:absolute;top:calc(100%+3px);left:0;right:0;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.12);max-height:160px;overflow-y:auto;display:none;"></div>
        </div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">Approver</div>
        <div style="position:relative;">
          <input id="aa-popup-approver-inp" placeholder="Search approver…" autocomplete="off"
            style="width:100%;padding:9px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'"
            oninput="_aaPopupSearch('approver',this.value)"/>
          <div id="aa-popup-sug-approver" style="position:absolute;top:calc(100%+3px);left:0;right:0;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.12);max-height:160px;overflow-y:auto;display:none;"></div>
        </div>
      </div>
    </div>
    <div style="padding:14px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:flex-end;gap:8px;">
      <button onclick="document.getElementById('aa-assign-popup').remove()" style="padding:8px 18px;background:#fff;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;font-weight:600;color:#475569;cursor:pointer;">Cancel</button>
      <button onclick="_aaFlatBulkSave('${circId}')" style="padding:8px 20px;background:#6366f1;border:none;border-radius:7px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;">Apply to Selected ✓</button>
    </div>
  </div>`;

  overlay.dataset.selectedDept='';
  overlay.dataset.selectedBranch='';
  document.body.appendChild(overlay);
};

window._aaFlatBulkSave = function(circId) {
  const popup    = document.getElementById('aa-assign-popup');
  const dept     = popup?.dataset.selectedDept;
  const branch   = popup?.dataset.selectedBranch;
  const assignee = document.getElementById('aa-popup-assignee-inp')?.value?.trim();
  const approver = document.getElementById('aa-popup-approver-inp')?.value?.trim();
  const selIds   = [...document.querySelectorAll('.aa-flat-row-chk:checked')].map(c=>c.dataset.actid);

  if(!selIds.length) return;
  if(!dept && !assignee && !approver){ if(typeof showToast==='function') showToast('Set at least one field','warning'); return; }

  const clauses=_aaGetActivities(circId);
  selIds.forEach(actId=>{
    for(const c of clauses){ for(const o of c.obligations){
      const act=o.activities.find(a=>a.id===actId);
      if(act){
        if(dept)   o.dept=dept;
        if(branch) o.branch=branch;
        if(assignee){act.assignee=assignee;act.status='Assigned';}
        if(approver) act.approver=approver;
        const aInp=document.getElementById(`aa-assignee-inp-${actId}`);
        const apInp=document.getElementById(`aa-approver-inp-${actId}`);
        const stEl=document.getElementById(`aa-flat-status-${actId}`);
        const row=document.getElementById(`aa-flat-row-${actId}`);
        if(aInp&&assignee){aInp.value=assignee;aInp.style.borderColor='#b2ddef';aInp.style.background='#e6f4f9';}
        if(apInp&&approver){apInp.value=approver;apInp.style.borderColor='#c4b5fd';apInp.style.background='#faf5ff';}
        if(stEl&&assignee){stEl.textContent='Assigned';stEl.style.background='#eef2ff';stEl.style.color='#4338ca';}
        if(row&&assignee) row.dataset.status='Assigned';
        if(dept){
          const dc=AA_DEPT_COLOR[dept]||'#475569';
          const db=AA_DEPT_BG[dept]||'#f1f5f9';
          const wrap=document.getElementById(`aa-dept-wrap-${actId}`);
          if(wrap) wrap.querySelector('span').style.background=db;
        }
        break;
      }
    }}
  });

  _aaUpdateStats(circId);
  _aaFlatClearSel();
  popup?.remove();
  if(typeof showToast==='function') showToast(`${selIds.length} action${selIds.length!==1?'s':''} assigned ✓`,'success');
};

/* ─── FILTERS ────────────────────────────────────────────────── */
window._aaApplyFilters = function(circId) {
  const fD  = document.getElementById('aa-filter-dept')?.value  ||'';
  const fS  = document.getElementById('aa-filter-status')?.value||'';
  const fB  = document.getElementById('aa-filter-branch')?.value||'';
  const fFrom=document.getElementById('aa-filter-from')?.value  ||'';
  const fTo  =document.getElementById('aa-filter-to')?.value    ||'';
  const fQ   =(document.getElementById('aa-search')?.value||'').toLowerCase();
  document.querySelectorAll('.aa-act-row').forEach(row=>{
    const due=row.dataset.duedate||'';
    const dateOk=(!fFrom||due>=fFrom)&&(!fTo||due<=fTo);
    const ok=(!fD||row.dataset.dept===fD)&&(!fB||row.dataset.branch===fB)&&(!fS||row.dataset.status===fS)&&dateOk&&(!fQ||row.dataset.search?.includes(fQ));
    row.style.display=ok?'':'none';
  });
};

/* ─── STATS ──────────────────────────────────────────────────── */
function _aaUpdateStats(circId) {
  const all=circId?_aaAllActs(circId):[];
  const assigned=all.filter(a=>a.status==='Assigned').length;
  const unassigned=all.length-assigned;
  const pct=all.length?Math.round(assigned/all.length*100):0;
  const t=document.getElementById('aa-sp-total');
  const u=document.getElementById('aa-sp-unassigned');
  const g=document.getElementById('aa-sp-assigned');
  if(t) t.textContent=`${all.length} total`;
  if(u) u.textContent=`${unassigned} unassigned`;
  if(g) g.textContent=`${assigned} assigned`;
  const da=document.getElementById('aa-dash-assigned');
  const dp=document.getElementById('aa-dash-pending');
  const dpc=document.getElementById('aa-dash-pct');
  if(da) da.textContent=assigned;
  if(dp) dp.textContent=unassigned;
  if(dpc) dpc.textContent=pct+'%';
}

/* ─── DRAWER ─────────────────────────────────────────────────── */
window._aaOverlayClick=function(e){if(e.target.id==='aa-overlay')_aaCloseDrawer();};
window._aaCloseDrawer=function(){
  const overlay=document.getElementById('aa-overlay'),drawer=document.getElementById('aa-drawer');
  if(!drawer||!overlay) return;
  drawer.classList.remove('open');
  setTimeout(()=>{overlay.style.display='none';},300);
};

window._aaOpenDrawer=function(actId,obId,clauseId,circId){
  const clauses=_aaGetActivities(circId);
  let act=null,ob=null,cl=null;
  for(const c of clauses){for(const o of c.obligations){const f=o.activities.find(a=>a.id===actId);if(f){act=f;ob=o;cl=c;break;}}if(act) break;}
  if(!act||!ob||!cl) return;

  const overlay=document.getElementById('aa-overlay');
  const drawer=document.getElementById('aa-drawer');
  const dc=document.getElementById('aa-drawer-content');
  overlay.style.display='flex';
  requestAnimationFrame(()=>requestAnimationFrame(()=>drawer.classList.add('open')));

  const meta=_aaCircMeta(circId);
  dc.innerHTML=`
<div class="aa-dr-inner">
  <div class="aa-dr-head">
    <span style="font-family:monospace;font-size:11px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 8px;border-radius:5px;">${act.id}</span>
    <button class="aa-dr-close" onclick="_aaCloseDrawer()">✕</button>
  </div>
  <div class="aa-dr-act-block">
    <div class="aa-dr-act-label">Activity</div>
    <div class="aa-dr-act-name">${act.name}</div>
  </div>
  <div class="aa-dr-section-label">Assignment Details</div>
  <div class="aa-dr-fields">
    <div class="aa-dr-field-row3">
      <div class="aa-dr-field">
        <label class="aa-dr-label">Department</label>
        <select class="aa-dr-input" id="aa-dr-dept-${actId}">
          ${AA_DEPTS.map(d=>`<option ${d===ob.dept?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>
      <div class="aa-dr-field">
        <label class="aa-dr-label">Assign to Person</label>
        <div style="position:relative;">
          <input class="aa-dr-input" id="aa-dr-assignee-${actId}" value="${act.assignee||''}" placeholder="Type name…" autocomplete="off"
            oninput="_aaDrawerSearch('${actId}','${ob.dept}',this.value)"
            onfocus="_aaDrawerSearch('${actId}','${ob.dept}',this.value)"/>
          <div id="aa-dr-sug-${actId}" class="aa-sug-box" style="display:none;"></div>
        </div>
      </div>
      <div class="aa-dr-field">
        <label class="aa-dr-label">Due Date</label>
        <input type="date" class="aa-dr-input" id="aa-dr-due-${actId}" value="${act.dueDate||''}"/>
      </div>
    </div>
    <div class="aa-dr-field">
      <label class="aa-dr-label">Approver</label>
      <div style="display:flex;align-items:center;gap:8px;padding:9px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:8px;">
        ${ob.approver
          ?`<div style="width:24px;height:24px;border-radius:50%;background:#f5f3ff;color:#6d28d9;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #c4b5fd;">${ob.approver.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</div><span style="font-size:13px;font-weight:600;color:#1e293b;">${ob.approver}</span>`
          :`<span style="font-size:13px;color:#94a3b8;">No approver assigned</span>`}
      </div>
    </div>
    <div class="aa-dr-field">
      <label class="aa-dr-label">Notes</label>
      <textarea class="aa-dr-input aa-dr-ta" id="aa-dr-notes-${actId}" placeholder="Add instructions…">${act._notes||''}</textarea>
    </div>
  </div>
  <div class="aa-dr-foot">
    <button class="aa-btn aa-btn-ghost aa-btn-sm" onclick="_aaCloseDrawer()">Cancel</button>
    <button class="aa-btn aa-btn-pri aa-btn-sm" onclick="_aaDrawerSave('${actId}','${ob.obId}','${cl.clauseId}','${circId}')">✓ Assign</button>
  </div>
</div>`;
};

window._aaDrawerSearch=function(actId,dept,query){
  const sug=document.getElementById(`aa-dr-sug-${actId}`);if(!sug) return;
  const pool=_aaGetPool(dept);
  const q=(query||'').trim().toLowerCase();
  const res=q?pool.filter(p=>p.toLowerCase().includes(q)):pool.slice(0,6);
  if(!res.length){sug.style.display='none';return;}
  sug.style.display='block';
  sug.innerHTML=res.map(p=>`
  <div class="aa-sug-item" onclick="document.getElementById('aa-dr-assignee-${actId}').value='${p}';document.getElementById('aa-dr-sug-${actId}').style.display='none';">
    <span class="aa-sug-av">${p.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span>
    <span class="aa-sug-name">${p}</span>
  </div>`).join('');
  setTimeout(()=>{document.addEventListener('click',function h(e){if(!sug.contains(e.target)){sug.style.display='none';document.removeEventListener('click',h);}});},0);
};

window._aaDrawerSave=function(actId,obId,clauseId,circId){
  const clauses=_aaGetActivities(circId);
  let act=null,ob=null,cl=null;
  for(const c of clauses){for(const o of c.obligations){const f=o.activities.find(a=>a.id===actId);if(f){act=f;ob=o;cl=c;break;}}if(act) break;}
  if(!act) return;
  act.assignee=document.getElementById(`aa-dr-assignee-${actId}`)?.value||act.assignee;
  act.dueDate=document.getElementById(`aa-dr-due-${actId}`)?.value||act.dueDate;
  act._notes=document.getElementById(`aa-dr-notes-${actId}`)?.value||'';
  if(act.assignee) act.status='Assigned';
  /* refresh row in table view */
  if(aaViewMode==='table') {
    const row=document.getElementById(`aa-flat-row-${actId}`);
    if(row){
      const aInp=document.getElementById(`aa-assignee-inp-${actId}`);
      if(aInp&&act.assignee){aInp.value=act.assignee;aInp.style.borderColor='#b2ddef';aInp.style.background='#e6f4f9';}
      const stEl=document.getElementById(`aa-flat-status-${actId}`);
      if(stEl&&act.assignee){stEl.textContent='Assigned';stEl.style.background='#eef2ff';stEl.style.color='#4338ca';}
    }
  }
  _aaUpdateStats(circId);
  _aaCloseDrawer();
  if(typeof showToast==='function') showToast(`${actId} assigned to ${act.assignee||'—'} ✓`,'success');
};

/* ─── CIRCULAR SWITCH ────────────────────────────────────────── */
window._aaSwitchCirc=function(circId){
  document.getElementById('aa-csel-drop').style.display='none';
  renderAssignActivity(circId,'','activities');
};
window._aaSaveAll=function(){if(typeof showToast==='function') showToast('All assignments saved ✓','success');};

/* ─── BIND ───────────────────────────────────────────────────── */
function _aaBindAll(circId, deptFilter) {
  if(AA_IS_SPOC){
    const spocDepts=window.SPOC_PROFILE?.departments||[];
    document.querySelectorAll('.aa-act-row').forEach(row=>{
      if(spocDepts.length && row.dataset.dept && !spocDepts.includes(row.dataset.dept)) row.style.display='none';
    });
  }
  const btn=document.getElementById('aa-csel-btn'),drop=document.getElementById('aa-csel-drop'),srch=document.getElementById('aa-csel-search');
  if(btn) btn.addEventListener('click',e=>{e.stopPropagation();drop.style.display=drop.style.display==='none'?'block':'none';if(drop.style.display!=='none'&&srch) srch.focus();});
  if(srch) srch.addEventListener('input',function(){const q=this.value.toLowerCase();document.querySelectorAll('.aa-csel-item').forEach(i=>i.style.display=i.textContent.toLowerCase().includes(q)?'':'none');});
  document.addEventListener('click',e=>{const wrap=document.getElementById('aa-csel-wrap');if(wrap&&!wrap.contains(e.target)&&drop) drop.style.display='none';});
  if(deptFilter){const sel=document.getElementById('aa-filter-dept');if(sel){sel.value=deptFilter;_aaApplyFilters(circId);}}
}

/* ─── STYLES ─────────────────────────────────────────────────── */
function _aaInjectStyles(){
  if(document.getElementById('aa-styles')) return;
  const s=document.createElement('style');
  s.id='aa-styles';
  s.textContent=`
@keyframes aaIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes aaFadeIn{from{opacity:0}to{opacity:1}}
:root{
  --aa-bg:#f0f3f7;--aa-card:#fff;--aa-border:#dde2ea;--aa-border-lt:#edf0f5;
  --aa-text:#1e2433;--aa-text-sec:#5a6478;--aa-text-mut:#9aa3b5;
  --aa-accent:#0d7fa5;--aa-accent-lt:#e6f4f9;--aa-accent-md:#b2ddef;
  --aa-purple:#5b5fcf;--aa-purple-lt:#ededfc;
  --aa-green:#0e9f6e;--aa-green-lt:#e8faf4;
  --aa-amber:#b45309;--aa-amber-lt:#fef3c7;
  --aa-red:#c92a2a;--aa-red-lt:#fdecea;
  --aa-r:8px;--aa-rl:12px;
  --aa-sh:0 1px 4px rgba(30,36,51,.07);--aa-shm:0 4px 16px rgba(30,36,51,.12);--aa-shl:0 8px 32px rgba(30,36,51,.18);
}
*{box-sizing:border-box;}
.aa-page{font-family:'DM Sans',system-ui,sans-serif;color:var(--aa-text);background:var(--aa-bg);min-height:100vh;}
.aa-wrap{max-width:1200px;margin:0 auto;padding:28px 24px 100px;}
.aa-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:var(--aa-r);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;}
.aa-btn-pri{background:#1e293b;color:#fff;}.aa-btn-pri:hover{background:#2d3548;}
.aa-btn-ghost{background:var(--aa-card);color:var(--aa-text-sec);border:1.5px solid var(--aa-border);}.aa-btn-ghost:hover{background:var(--aa-bg);}
.aa-btn-sm{padding:7px 14px;font-size:12px;}
.aa-page-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap;}
.aa-head-eyebrow{font-size:10px;font-weight:700;color:var(--aa-accent);text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;}
.aa-head-title{font-size:24px;font-weight:800;margin-bottom:4px;}
.aa-head-sub{font-size:12px;color:var(--aa-text-mut);}
.aa-head-right{display:flex;gap:8px;}
.aa-filter-card{display:flex;align-items:flex-end;gap:12px;padding:16px 20px;background:var(--aa-card);border:1px solid var(--aa-border);border-radius:var(--aa-rl);margin-bottom:12px;box-shadow:var(--aa-sh);flex-wrap:wrap;}
.aa-fc-field{display:flex;flex-direction:column;gap:4px;}
.aa-fc-label{font-size:9px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.08em;}
.aa-flt-sel,.aa-flt-date{padding:7px 10px;background:#f5f7fa;border:1px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:12px;color:var(--aa-text-sec);outline:none;cursor:pointer;min-width:130px;}
.aa-flt-sel:focus,.aa-flt-date:focus{border-color:var(--aa-accent);}
.aa-fc-search{flex:1;min-width:180px;}
.aa-search-inp{width:100%;padding:7px 11px;background:#f5f7fa;border:1px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:12px;outline:none;box-sizing:border-box;}
.aa-search-inp:focus{border-color:var(--aa-accent);background:#fff;}
.aa-custom-sel-wrap{position:relative;}
.aa-custom-sel-btn{display:flex;align-items:center;gap:8px;padding:7px 11px;background:#f5f7fa;border:1.5px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;cursor:pointer;min-width:230px;transition:all .14s;}
.aa-custom-sel-btn:hover{border-color:var(--aa-accent);}
.aa-csel-id{font-family:monospace;font-size:11px;font-weight:700;color:var(--aa-accent);flex-shrink:0;}
.aa-csel-title{font-size:11px;color:var(--aa-text-sec);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
.aa-csel-arr{color:var(--aa-text-mut);}
.aa-csel-drop{position:absolute;top:calc(100%+4px);left:0;min-width:290px;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-rl);z-index:300;box-shadow:var(--aa-shl);overflow:hidden;}
.aa-csel-search{width:100%;padding:9px 12px;background:#f5f7fa;border:none;border-bottom:1px solid var(--aa-border);font-family:inherit;font-size:12px;outline:none;box-sizing:border-box;}
.aa-csel-list{max-height:200px;overflow-y:auto;}
.aa-csel-item{display:flex;align-items:center;gap:8px;padding:9px 14px;cursor:pointer;border-bottom:1px solid var(--aa-border-lt);transition:background .1s;}
.aa-csel-item:hover,.aa-csel-item.active{background:var(--aa-accent-lt);}
.aa-csel-item-id{font-family:monospace;font-size:11px;font-weight:700;flex-shrink:0;}
.aa-csel-item-title{font-size:11px;color:var(--aa-text-sec);}
.aa-stats-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-left:auto;}
.aa-stat-pill{font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;background:#e8ebf1;color:var(--aa-text-sec);border:1px solid var(--aa-border);}
.aa-sp-amber{background:var(--aa-amber-lt);color:var(--aa-amber);border-color:#fcd34d;}
.aa-sp-green{background:var(--aa-green-lt);color:var(--aa-green);border-color:#6ee7b7;}
.aa-act-row{transition:background .12s;cursor:pointer;}
.aa-act-row.aa-act-unassigned{border-left:3px solid var(--aa-amber);}
.aa-sug-box{position:absolute;top:calc(100%+4px);left:0;right:0;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-r);z-index:999;box-shadow:var(--aa-shm);max-height:170px;overflow-y:auto;}
.aa-sug-item{display:flex;align-items:center;gap:9px;padding:9px 12px;cursor:pointer;transition:background .1s;}
.aa-sug-item:hover{background:var(--aa-accent-lt);}
.aa-sug-av{width:26px;height:26px;border-radius:50%;background:var(--aa-accent-lt);color:var(--aa-accent);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--aa-accent-md);}
.aa-sug-name{flex:1;font-size:13px;font-weight:500;}
.aa-overlay{position:fixed;inset:0;background:rgba(10,15,28,.5);backdrop-filter:blur(3px);z-index:500;display:flex;align-items:stretch;justify-content:flex-end;animation:aaFadeIn .2s ease;}
.aa-drawer{width:520px;max-width:96vw;background:var(--aa-card);box-shadow:-4px 0 40px rgba(10,15,28,.2);display:flex;flex-direction:column;overflow-y:auto;transform:translateX(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);}
.aa-drawer.open{transform:translateX(0);}
.aa-dr-inner{padding:26px 24px;display:flex;flex-direction:column;gap:16px;min-height:100%;}
.aa-dr-head{display:flex;align-items:center;justify-content:space-between;}
.aa-dr-close{background:none;border:1px solid var(--aa-border);border-radius:7px;width:30px;height:30px;cursor:pointer;font-size:13px;color:var(--aa-text-mut);display:flex;align-items:center;justify-content:center;transition:all .13s;}
.aa-dr-close:hover{background:var(--aa-red-lt);color:var(--aa-red);}
.aa-dr-act-block{background:var(--aa-accent-lt);border:1px solid var(--aa-accent-md);border-left:4px solid var(--aa-accent);border-radius:var(--aa-r);padding:13px 16px;}
.aa-dr-act-label{font-size:9px;font-weight:700;color:var(--aa-accent);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
.aa-dr-act-name{font-size:13.5px;font-weight:600;line-height:1.5;}
.aa-dr-section-label{font-size:10px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.08em;border-top:1px solid var(--aa-border-lt);padding-top:4px;}
.aa-dr-fields{display:flex;flex-direction:column;gap:14px;}
.aa-dr-field{display:flex;flex-direction:column;gap:5px;}
.aa-dr-field-row3{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:12px;}
.aa-dr-label{font-size:10px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.06em;}
.aa-dr-input{padding:9px 12px;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:13px;color:var(--aa-text);outline:none;width:100%;box-sizing:border-box;transition:border-color .15s;}
.aa-dr-input:focus{border-color:var(--aa-accent);}
.aa-dr-ta{min-height:75px;resize:vertical;}
.aa-dr-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:12px 0 0;border-top:1px solid var(--aa-border-lt);margin-top:auto;position:sticky;bottom:0;background:var(--aa-card);}
  `;
  document.head.appendChild(s);
}