/**
 * my-items-activity.js — Activity List View
 * Same UI as obligations. All functions prefixed 'act' to avoid collisions.
 */

let actTaskView = 'table';
let actFilters  = { status:'', department:'', search:'', from:'', to:'' };

/* ── ACTIVITY DATA — self contained ─────────────────────────── */
const ACTD_DUMMY = {
  'ACT-001-1': {
    id:'ACT-001-1', name:'Draft CISO Job Description',
    obligationId:'OB-001', obligationTitle:'Appoint Board-Level CISO',
    circularId:'CIRC-001', clauseRef:'C1.2',
    clauseTitle:'A designated Compliance Officer shall be appointed with direct reporting to the Board Audit Committee.',
    dept:'HR', assignee:'Priya Nair', owner:'Rahul Sharma', reviewer:'Anita Verma',
    status:'Complete', priority:'Critical', risk:'High',
    dueDate:'2025-01-15', issueDate:'01 Apr 2024',
    workflowStage:'Closed', workflowLevel:4,
    description:'Prepare a comprehensive job description for the CISO role including reporting structure, responsibilities, and qualifications required by the Board.',
    evidence:[{ id:'AEV-001-1', type:'Policy Document', file:'CISO_JD_v1.pdf', status:'Verified', uploadedBy:'Priya Nair', date:'10 Jan 2025' }],
    _comments:[
      { author:'Priya Nair',   role:'HR Head', time:'3 days ago', text:'Draft JD prepared and sent for Board review.' },
      { author:'Rahul Sharma', role:'Owner',   time:'2 days ago', text:'Reviewed and approved. Proceed to next step.' },
    ]
  },
  'ACT-001-2': {
    id:'ACT-001-2', name:'Board Resolution for CISO Approval',
    obligationId:'OB-001', obligationTitle:'Appoint Board-Level CISO',
    circularId:'CIRC-001', clauseRef:'C1.2',
    clauseTitle:'A designated Compliance Officer shall be appointed with direct reporting to the Board Audit Committee.',
    dept:'Compliance', assignee:'Arjun Kumar', owner:'Rahul Sharma', reviewer:'Anita Verma',
    status:'Complete', priority:'Critical', risk:'High',
    dueDate:'2025-01-15', issueDate:'01 Apr 2024',
    workflowStage:'Closed', workflowLevel:4,
    description:'Obtain formal Board resolution approving the appointment of the CISO as per RBI regulatory requirement.',
    evidence:[{ id:'AEV-001-2', type:'Board Resolution', file:'Board_Resolution_CISO.pdf', status:'Verified', uploadedBy:'Arjun Kumar', date:'15 Jan 2025' }],
    _comments:[
      { author:'Arjun Kumar', role:'Compliance Officer', time:'5 days ago', text:'Board resolution passed in the January meeting.' },
    ]
  },
  'ACT-001-3': {
    id:'ACT-001-3', name:'CISO Onboarding & Access Setup',
    obligationId:'OB-001', obligationTitle:'Appoint Board-Level CISO',
    circularId:'CIRC-001', clauseRef:'C1.2',
    clauseTitle:'A designated Compliance Officer shall be appointed with direct reporting to the Board Audit Committee.',
    dept:'IT', assignee:'Raj Iyer', owner:'Rahul Sharma', reviewer:'Anita Verma',
    status:'In Progress', priority:'High', risk:'High',
    dueDate:'2025-02-15', issueDate:'01 Apr 2024',
    workflowStage:'Execution', workflowLevel:3,
    description:'Set up system access, security clearances, and complete onboarding for the newly appointed CISO within 30 days of appointment.',
    evidence:[],
    _comments:[
      { author:'Raj Iyer', role:'IT Manager', time:'1 day ago', text:'Access provisioning in progress. Expected completion by end of week.' },
    ]
  },
  'ACT-002-1': {
    id:'ACT-002-1', name:'SIEM Vendor Evaluation',
    obligationId:'OB-002', obligationTitle:'Deploy SIEM & 24x7 SOC',
    circularId:'CIRC-001', clauseRef:'C3.1',
    clauseTitle:'All systems shall implement real-time monitoring and incident response capabilities.',
    dept:'IT', assignee:'Raj Iyer', owner:'Rahul Sharma', reviewer:'Vikram Singh',
    status:'Overdue', priority:'Critical', risk:'High',
    dueDate:'2025-01-30', issueDate:'01 Apr 2024',
    workflowStage:'Draft', workflowLevel:2,
    description:'Evaluate and shortlist SIEM vendors based on RFP responses, compliance requirements, and integration capabilities with existing infrastructure.',
    evidence:[],
    _comments:[
      { author:'Raj Iyer',     role:'IT Manager', time:'2 days ago', text:'RFP sent to 4 vendors. Awaiting responses by Friday.' },
      { author:'Vikram Singh', role:'Reviewer',   time:'1 day ago',  text:'Please escalate if no response by EOD Friday.' },
    ]
  },
  'ACT-002-2': {
    id:'ACT-002-2', name:'SOC Team Hiring',
    obligationId:'OB-002', obligationTitle:'Deploy SIEM & 24x7 SOC',
    circularId:'CIRC-001', clauseRef:'C3.1',
    clauseTitle:'All systems shall implement real-time monitoring and incident response capabilities.',
    dept:'HR', assignee:'Priya Nair', owner:'Rahul Sharma', reviewer:'Vikram Singh',
    status:'Open', priority:'Critical', risk:'High',
    dueDate:'2025-03-01', issueDate:'01 Apr 2024',
    workflowStage:'Assign', workflowLevel:1,
    description:'Hire and staff a 24x7 Security Operations Centre team including SOC analysts, incident responders, and team leads across three shifts.',
    evidence:[],
    _comments:[
      { author:'Priya Nair', role:'HR Head', time:'3 days ago', text:'JD published on job boards. Initial screening scheduled for next week.' },
    ]
  },
  'ACT-002-3': {
    id:'ACT-002-3', name:'SIEM Configuration & Go-Live',
    obligationId:'OB-002', obligationTitle:'Deploy SIEM & 24x7 SOC',
    circularId:'CIRC-001', clauseRef:'C3.1',
    clauseTitle:'All systems shall implement real-time monitoring and incident response capabilities.',
    dept:'IT', assignee:'Raj Iyer', owner:'Rahul Sharma', reviewer:'Vikram Singh',
    status:'Open', priority:'Critical', risk:'High',
    dueDate:'2025-04-30', issueDate:'01 Apr 2024',
    workflowStage:'Assign', workflowLevel:1,
    description:'Configure SIEM dashboards, alert rules, and run a 30-day pilot before full go-live with the 24x7 SOC team.',
    evidence:[],
    _comments:[]
  },
  'ACT-003-1': {
    id:'ACT-003-1', name:'Scope Definition for Q1 Assessment',
    obligationId:'OB-003', obligationTitle:'Quarterly Risk Assessment Report',
    circularId:'CIRC-001', clauseRef:'C3.2',
    clauseTitle:'Annual third-party audit of the compliance infrastructure must be completed and findings submitted to the Board.',
    dept:'Risk', assignee:'Anand Krishnan', owner:'Anita Verma', reviewer:'Neha Patel',
    status:'Open', priority:'High', risk:'High',
    dueDate:'2025-04-15', issueDate:'01 Apr 2024',
    workflowStage:'Assign', workflowLevel:1,
    description:'Define the scope and boundaries for the Q1 quarterly risk assessment including systems, processes, and third-party integrations.',
    evidence:[],
    _comments:[
      { author:'Anand Krishnan', role:'Risk Analyst', time:'4 days ago', text:'Scope draft under preparation. Will circulate for sign-off by Monday.' },
    ]
  },
  'ACT-003-2': {
    id:'ACT-003-2', name:'Third-Party Pentest Engagement',
    obligationId:'OB-003', obligationTitle:'Quarterly Risk Assessment Report',
    circularId:'CIRC-001', clauseRef:'C3.2',
    clauseTitle:'Annual third-party audit of the compliance infrastructure must be completed and findings submitted to the Board.',
    dept:'Risk', assignee:'Anand Krishnan', owner:'Anita Verma', reviewer:'Neha Patel',
    status:'Open', priority:'High', risk:'High',
    dueDate:'2025-04-30', issueDate:'01 Apr 2024',
    workflowStage:'Assign', workflowLevel:1,
    description:'Engage a certified third-party penetration testing firm to conduct the quarterly security assessment and submit findings report.',
    evidence:[],
    _comments:[]
  },
  'ACT-004-1': {
    id:'ACT-004-1', name:'Document EDD SOP for PEP Customers',
    obligationId:'OB-004', obligationTitle:'EDD Process Documentation',
    circularId:'CIRC-002', clauseRef:'C2.1',
    clauseTitle:'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days.',
    dept:'Compliance', assignee:'Sneha Das', owner:'Rahul Sharma', reviewer:'Anita Verma',
    status:'In Progress', priority:'High', risk:'High',
    dueDate:'2025-03-20', issueDate:'15 Feb 2024',
    workflowStage:'Execution', workflowLevel:3,
    description:'Maintain and update the Enhanced Due Diligence SOP for Politically Exposed Persons as per AML/KYC guidelines.',
    evidence:[{ id:'AEV-004-1', type:'Policy Document', file:'EDD_SOP_v2.pdf', status:'Pending Review', uploadedBy:'Sneha Das', date:'20 Mar 2025' }],
    _comments:[
      { author:'Sneha Das',   role:'Compliance Analyst', time:'1 day ago',   text:'SOP v2 drafted and uploaded for review.' },
      { author:'Anita Verma', role:'Reviewer',           time:'4 hours ago', text:'Will review by end of day today.' },
    ]
  },
  'ACT-004-2': {
    id:'ACT-004-2', name:'EDD Training for Compliance Staff',
    obligationId:'OB-004', obligationTitle:'EDD Process Documentation',
    circularId:'CIRC-002', clauseRef:'C2.1',
    clauseTitle:'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days.',
    dept:'Compliance', assignee:'Meera Pillai', owner:'Rahul Sharma', reviewer:'Anita Verma',
    status:'Open', priority:'High', risk:'High',
    dueDate:'2025-04-10', issueDate:'15 Feb 2024',
    workflowStage:'Draft', workflowLevel:2,
    description:'Conduct mandatory EDD training for all compliance staff covering updated PEP procedures, red flag indicators, and escalation protocols.',
    evidence:[],
    _comments:[
      { author:'Meera Pillai', role:'Training Lead', time:'2 days ago', text:'Training deck under preparation. Will share draft by end of week.' },
    ]
  },
  'ACT-005-1': {
    id:'ACT-005-1', name:'Classify Vendors by Risk Tier',
    obligationId:'OB-005', obligationTitle:'Vendor Risk Register Update',
    circularId:'CIRC-005', clauseRef:'C2.1',
    clauseTitle:'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days.',
    dept:'Operations', assignee:'Suresh Kumar', owner:'Vikram Singh', reviewer:'Neha Patel',
    status:'Open', priority:'High', risk:'High',
    dueDate:'2025-04-05', issueDate:'01 Jan 2024',
    workflowStage:'Assign', workflowLevel:1,
    description:'Classify all active vendors into Critical, Important, or Standard risk tiers based on dependency, data access, and operational impact criteria.',
    evidence:[],
    _comments:[
      { author:'Suresh Kumar', role:'Operations Lead', time:'3 days ago', text:'Vendor list compiled. Classification framework being applied.' },
    ]
  },
  'ACT-005-2': {
    id:'ACT-005-2', name:'Conduct Vendor Due Diligence',
    obligationId:'OB-005', obligationTitle:'Vendor Risk Register Update',
    circularId:'CIRC-005', clauseRef:'C2.1',
    clauseTitle:'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days.',
    dept:'Risk', assignee:'Neha Rao', owner:'Vikram Singh', reviewer:'Neha Patel',
    status:'Open', priority:'High', risk:'High',
    dueDate:'2025-05-01', issueDate:'01 Jan 2024',
    workflowStage:'Assign', workflowLevel:1,
    description:'Conduct annual due diligence on all Critical and Important vendors including financial health checks and compliance certifications.',
    evidence:[],
    _comments:[]
  },
  'ACT-005-3': {
    id:'ACT-005-3', name:'Document Vendor Exit Strategies',
    obligationId:'OB-005', obligationTitle:'Vendor Risk Register Update',
    circularId:'CIRC-005', clauseRef:'C2.1',
    clauseTitle:'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days.',
    dept:'Operations', assignee:'Suresh Kumar', owner:'Vikram Singh', reviewer:'Neha Patel',
    status:'Open', priority:'High', risk:'High',
    dueDate:'2025-05-15', issueDate:'01 Jan 2024',
    workflowStage:'Draft', workflowLevel:2,
    description:'Document and test exit strategies for all Critical vendors covering data migration, service continuity, and contractual wind-down procedures.',
    evidence:[],
    _comments:[]
  },
};

/* ── ENTRY POINT ─────────────────────────────────────────────── */
function renderMyItemsActivity() {
  const area = document.getElementById('content-area');
  if (!area) return;
  area.innerHTML = actBuildHTML();
  actInitListeners();
  actRenderTasks();
}

/* ── BUILD HTML ──────────────────────────────────────────────── */
function actBuildHTML() {
  // get depts from ACTD_DUMMY if available, else CMS_DATA
  let depts = [];
  if (typeof ACTD_DUMMY !== 'undefined') {
    depts = [...new Set(Object.values(ACTD_DUMMY).map(a => a.dept).filter(Boolean))].sort();
  } else if (typeof CMS_DATA !== 'undefined' && CMS_DATA.tasks) {
    depts = [...new Set(CMS_DATA.tasks.map(t => t.department))].sort();
  }

  return `
  <div class="fade-in">
 
    <div class="aa-page-head" style="margin-bottom:16px;">
      <div class="aa-head-left">


        <div class="aa-tab-switch" style="margin-top:10px; display:flex; flex-direction:row-reverse; gap:8px;">
          <button
           style="padding:6px 12px; border:1px solid #d1d5db; background:#fff; color:#111827; border-radius:6px; cursor:pointer;"
            onclick="actSwitchMainTab('activities')">
            Activities
          </button>
          <button
           style="padding:6px 12px; border:1px solid #111827; background:#111827; color:#fff; border-radius:6px; cursor:pointer;"
            onclick="actSwitchMainTab('obligations')">
            Obligations
          </button>
        </div>
      </div>
    </div>

    <div class="task-toolbar-wrap">
    <div class="task-toolbar-wrap">
      <div class="tb-row tb-row-filters">
        <input type="text" class="form-control tb-search" id="act-search"
               placeholder="🔍  Search activities…"/>
        <select class="form-control tb-select" id="act-filter-status">
          <option value="">All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Complete</option>
          <option>Overdue</option>
        </select>
        <select class="form-control tb-select" id="act-filter-dept">
          <option value="">All Departments</option>
          ${depts.map(d => `<option>${d}</option>`).join('')}
        </select>
        <button class="btn btn-ghost btn-sm" id="act-clear-filters">✕ Clear</button>
        <span id="act-count" class="tb-count"></span>
      </div>
      <div class="tb-row tb-row-date">
        <div class="tb-date-group">
          <span class="tb-date-label">Due Date</span>
          <span class="tb-date-field">
            <label class="tb-field-label">From</label>
            <input type="date" class="form-control tb-date-inp" id="act-filter-from"/>
          </span>
          <span class="tb-arrow">→</span>
          <span class="tb-date-field">
            <label class="tb-field-label">To</label>
            <input type="date" class="form-control tb-date-inp" id="act-filter-to"/>
          </span>
          <span class="tb-date-hint" id="act-date-hint"></span>
        </div>
        <div class="view-toggle">
          <button class="view-toggle-btn ${actTaskView==='table'?'active':''}" data-view="table">≡ Table</button>
          <button class="view-toggle-btn ${actTaskView==='card' ?'active':''}" data-view="card">⊞ Cards</button>
        </div>
      </div>
    </div>
    <div id="act-content"></div>
    <style>
      .task-toolbar-wrap{background:var(--surface,#fff);border:1px solid var(--border,#e2e8f0);border-radius:10px;overflow:hidden;margin-bottom:16px;}
      .tb-row{display:flex;align-items:center;gap:10px;padding:10px 16px;width:100%;box-sizing:border-box;}
      .tb-row-filters{border-bottom:1px solid var(--border,#e2e8f0);flex-wrap:nowrap;}
      .tb-search{flex:1 1 0;min-width:0;}
      .tb-select{flex:0 0 140px;width:140px;}
      .tb-count{flex-shrink:0;font-size:11px;font-weight:600;color:var(--text-muted,#94a3b8);white-space:nowrap;margin-left:auto;}
      .tb-row-date{background:#f8fafc;justify-content:space-between;flex-wrap:wrap;gap:8px;}
      .tb-date-group{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
      .tb-date-label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;white-space:nowrap;}
      .tb-date-field{display:flex;align-items:center;gap:6px;}
      .tb-field-label{font-size:11px;font-weight:600;color:#64748b;white-space:nowrap;}
      .tb-date-inp{width:138px!important;padding:5px 8px!important;font-size:12px!important;}
      .tb-arrow{font-size:13px;color:#cbd5e1;font-weight:700;}
      .tb-date-hint{display:none;font-size:11px;font-weight:600;color:#6366f1;background:#eef2ff;border:1px solid #c7d2fe;padding:3px 10px;border-radius:20px;white-space:nowrap;}
      .tb-date-hint.visible{display:inline;}
    </style>
  </div>`;
}

function actdGetActivity(actId) {
  return (typeof ACTD_DUMMY !== 'undefined' && ACTD_DUMMY[actId]) ? ACTD_DUMMY[actId] : null;
}

/* ── RENDER ──────────────────────────────────────────────────── */
function actRenderTasks() {
  const content = document.getElementById('act-content');
  if (!content) return;

  let activities = [];

  // PRIMARY SOURCE — ACTD_DUMMY from action-screen-activity.js
  if (typeof ACTD_DUMMY !== 'undefined') {
    Object.values(ACTD_DUMMY).forEach(a => {
      activities.push({
        activityId:      a.id,
        activityName:    a.name,
        department:      a.dept       || '—',
        assignee:        a.assignee   || '—',
        status:          a.status     || 'Open',
        dueDate:         a.dueDate    || '',
        risk:            a.risk       || 'Medium',
        priority:        a.priority   || '—',
        obligationId:    a.obligationId    || '—',
        obligationTitle: a.obligationTitle || '—',
      });
    });
  }
  // FALLBACK — DUMMY_ACTIONS from action-screen.js if ACTD_DUMMY not available
  else if (typeof DUMMY_ACTIONS !== 'undefined' && typeof CMS_DATA !== 'undefined') {
    const tasks = CMS_DATA.tasks || [];
    tasks.forEach(task => {
      (DUMMY_ACTIONS[task.id] || []).forEach(a => {
        activities.push({
          activityId:      a.id,
          activityName:    a.name,
          department:      a.dept      || task.department || '—',
          assignee:        a.assignee  || task.assignee   || '—',
          status:          a.status    || 'Open',
          dueDate:         a.dueDate   || task.dueDate    || '',
          risk:            task.risk   || 'Medium',
          priority:        task.priority || '—',
          obligationId:    task.id,
          obligationTitle: task.title  || '—',
        });
      });
    });
  }

  console.log('actRenderTasks — total activities:', activities.length,
              '| ACTD_DUMMY:', typeof ACTD_DUMMY,
              '| DUMMY_ACTIONS:', typeof DUMMY_ACTIONS);

  // filters
  if (actFilters.search) {
    const s = actFilters.search.toLowerCase();
    activities = activities.filter(a =>
      a.activityName.toLowerCase().includes(s)    ||
      a.activityId.toLowerCase().includes(s)      ||
      a.department.toLowerCase().includes(s)      ||
      a.assignee.toLowerCase().includes(s)        ||
      a.obligationTitle.toLowerCase().includes(s) ||
      a.obligationId.toLowerCase().includes(s)
    );
  }
  if (actFilters.status)     activities = activities.filter(a => a.status     === actFilters.status);
  if (actFilters.department) activities = activities.filter(a => a.department === actFilters.department);
  if (actFilters.from)       activities = activities.filter(a => a.dueDate && a.dueDate >= actFilters.from);
  if (actFilters.to)         activities = activities.filter(a => a.dueDate && a.dueDate <= actFilters.to);

  const countEl = document.getElementById('act-count');
  if (countEl) countEl.textContent = `${activities.length} activit${activities.length===1?'y':'ies'}`;

  if (activities.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">◉</div>
        <div class="empty-state-text">No activities found</div>
        <div class="empty-state-sub">Try clearing filters.</div>
      </div>`;
    return;
  }

  content.innerHTML = actTaskView === 'table'
    ? actBuildTable(activities)
    : actBuildCards(activities);
}

/* ── TABLE ───────────────────────────────────────────────────── */
function actBuildTable(activities) {
  return `
  <div class="table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Activity ID</th>
            <th>Activity Name</th>
            <th>Obligation</th>
            <th>Department</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${activities.map(a => `
          <tr>
            <td>
              <span style="font-family:monospace;font-size:12px;font-weight:800;color:#6366f1;
                           background:#eef2ff;border:1px solid #c7d2fe;padding:3px 8px;
                           border-radius:6px;cursor:pointer;white-space:nowrap"
                    onclick="openActivityDetail('${a.activityId}')">
                ${a.activityId}
              </span>
            </td>
            <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
                title="${a.activityName}">${a.activityName}</td>
            <td>
              <span style="font-size:11px;color:#64748b;font-family:monospace;background:#f1f5f9;
                           padding:2px 7px;border-radius:4px;border:1px solid #e2e8f0;cursor:pointer"
                    onclick="openTaskDetail('${a.obligationId}')"
                    title="${a.obligationTitle}">
                ${a.obligationId}
              </span>
            </td>
            <td><span class="task-dept-chip">${a.department}</span></td>
            <td style="font-size:12px">${a.assignee}</td>
            <td style="font-size:12px">${actFmtDate(a.dueDate)}</td>
            <td>
              <select class="status-select ${actStatusClass(a.status)}"
                      data-activity-id="${a.activityId}"
                      data-obligation-id="${a.obligationId}"
                      onchange="actHandleStatusChange(this)">
                <option value="Open"        ${a.status==='Open'        ?'selected':''}>Open</option>
                <option value="In Progress" ${a.status==='In Progress' ?'selected':''}>In Progress</option>
                <option value="Complete"    ${a.status==='Complete'    ?'selected':''}>Complete</option>
                <option value="Overdue"     ${a.status==='Overdue'     ?'selected':''}>Overdue</option>
              </select>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ── CARDS ───────────────────────────────────────────────────── */
function actBuildCards(activities) {
  return `
  <div class="task-cards-grid">
    ${activities.map(a => `
    <div class="task-card risk-${(a.risk||'medium').toLowerCase()}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <span style="font-family:monospace;font-size:11px;font-weight:800;color:#6366f1;
                     background:#eef2ff;border:1px solid #c7d2fe;padding:2px 8px;border-radius:5px;
                     cursor:pointer"
              onclick="openActivityDetail('${a.activityId}')">${a.activityId}</span>
        <span class="risk-badge risk-${(a.risk||'medium').toLowerCase()}">${a.risk||'Medium'}</span>
      </div>
      <div class="task-card-title">${a.activityName}</div>
      <div class="task-card-meta" style="margin-bottom:6px">
        <span class="task-dept-chip">${a.department}</span>
        <span style="font-size:10px;color:var(--text-muted)">📅 ${actFmtDate(a.dueDate)}</span>
      </div>
      <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">
        👤 ${a.assignee}
      </div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:10px">
        Obligation:
        <span style="color:#6366f1;font-family:monospace;cursor:pointer;font-weight:600"
              onclick="openTaskDetail('${a.obligationId}')">${a.obligationId}</span>
      </div>
      <div class="task-card-footer">
        <span class="risk-badge ${actPriorityClass(a.priority)}">${a.priority}</span>
        <select class="status-select ${actStatusClass(a.status)}"
                data-activity-id="${a.activityId}"
                data-obligation-id="${a.obligationId}"
                onchange="actHandleStatusChange(this)" style="font-size:11px">
          <option value="Open"        ${a.status==='Open'        ?'selected':''}>Open</option>
          <option value="In Progress" ${a.status==='In Progress' ?'selected':''}>In Progress</option>
          <option value="Complete"    ${a.status==='Complete'    ?'selected':''}>Complete</option>
          <option value="Overdue"     ${a.status==='Overdue'     ?'selected':''}>Overdue</option>
        </select>
      </div>
    </div>`).join('')}
  </div>`;
}

/* ── STATUS CHANGE ───────────────────────────────────────────── */
function actHandleStatusChange(selectEl) {
  const activityId   = selectEl.dataset.activityId;
  const obligationId = selectEl.dataset.obligationId;
  const newStatus    = selectEl.value;
  if (typeof DUMMY_ACTIONS !== 'undefined' && DUMMY_ACTIONS[obligationId]) {
    const act = DUMMY_ACTIONS[obligationId].find(a => a.id === activityId);
    if (act) act.status = newStatus;
  }
  selectEl.className = `status-select ${actStatusClass(newStatus)}`;
  if (typeof showToast === 'function') showToast(`Activity ${activityId} → "${newStatus}"`, 'success');
}

/* ── LISTENERS ───────────────────────────────────────────────── */
function actInitListeners() {
  document.getElementById('act-search')?.addEventListener('input', e => {
    actFilters.search = e.target.value.trim(); actRenderTasks();
  });
  document.getElementById('act-filter-status')?.addEventListener('change', e => {
    actFilters.status = e.target.value; actRenderTasks();
  });
  document.getElementById('act-filter-dept')?.addEventListener('change', e => {
    actFilters.department = e.target.value; actRenderTasks();
  });
  document.getElementById('act-filter-from')?.addEventListener('change', e => {
    actFilters.from = e.target.value; actUpdateDateHint(); actRenderTasks();
  });
  document.getElementById('act-filter-to')?.addEventListener('change', e => {
    actFilters.to = e.target.value; actUpdateDateHint(); actRenderTasks();
  });
  document.getElementById('act-clear-filters')?.addEventListener('click', () => {
    actFilters = { status:'', department:'', search:'', from:'', to:'' };
    ['act-search','act-filter-status','act-filter-dept','act-filter-from','act-filter-to']
      .forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
    actUpdateDateHint();
    actRenderTasks();
  });
  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      actTaskView = btn.dataset.view;
      document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      actRenderTasks();
    });
  });
}

/* ── HELPERS ─────────────────────────────────────────────────── */
function actUpdateDateHint() {
  const hint = document.getElementById('act-date-hint');
  if (!hint) return;
  const f = actFilters.from, t = actFilters.to;
  if (f && t)  { hint.textContent=`${actFmtShort(f)} → ${actFmtShort(t)}`; hint.classList.add('visible'); }
  else if (f)  { hint.textContent=`From ${actFmtShort(f)}`;                 hint.classList.add('visible'); }
  else if (t)  { hint.textContent=`Until ${actFmtShort(t)}`;                hint.classList.add('visible'); }
  else         { hint.textContent='';                                        hint.classList.remove('visible'); }
}
function actFmtShort(d) {
  return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short'});
}
function actFmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
}
function actStatusClass(s) {
  return ({Open:'open','In Progress':'inprogress',Complete:'complete',Overdue:'overdue'})[s]||'open';
}
function actPriorityClass(p) {
  return ({Critical:'risk-high',High:'risk-high',Medium:'risk-medium',Low:'risk-low'})[p]||'';
}

function actSwitchMainTab(tab) {
  if (tab === 'obligations') {
    if (typeof renderMyItemsObligations === 'function') {
      renderMyItemsObligations();
    } else {
      console.error('renderMyItemsObligations is not loaded');
    }
  } else {
    renderMyItemsActivity();
  }
}