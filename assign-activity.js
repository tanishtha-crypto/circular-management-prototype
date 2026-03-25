// /**
//  * assign-activity.js — Department Head Activity Assignment Screen  v2
//  *
//  * Hierarchy: Obligation (dark navy header) → Activity rows (light)
//  * Drawer: full overlay panel, slides from right, does NOT compress the table
//  * Obligation groups: start collapsed
//  */

// const AA_DEPTS = ['Compliance','Risk','Legal','IT','Operations','HR','Finance'];

// const AA_PEOPLE = {
//   Compliance: ['Sneha Das','Meera Pillai','Arjun Kumar','Ravi Menon'],
//   Risk:       ['Anand Krishnan','Neha Rao','Vikram Singh','Pooja Shah'],
//   Legal:      ['Priya Nair','Suresh Iyer','Kavitha Reddy'],
//   IT:         ['Raj Iyer','Sanjay Mehta','Divya Nair','Arun Thomas'],
//   Operations: ['Suresh Kumar','Lakshmi Rao','Rohit Gupta'],
//   HR:         ['Priya Sharma','Aditya Patel','Reshma Nair'],
//   Finance:    ['Rahul Verma','Shalini Menon','Kiran Bhat'],
// };

// /* ── MOCK DATA ───────────────────────────────────────────────── */
// function _aaGetActivities(circId) {
//   const base = [
//     {
//       obId:'OB-001', clauseRef:'C1.1', dept:'Compliance',
//       obText:'Establish and maintain a Board-approved compliance policy, reviewed annually.',
//       activities:[
//         { id:'AA-001', name:'Draft compliance policy document',         assignee:'Sneha Das',    status:'In Progress', dueDate:'2025-04-15', priority:'High'     },
//         { id:'AA-002', name:'Present policy to Board for approval',     assignee:null,           status:'Open',        dueDate:'2025-04-30', priority:'High'     },
//         { id:'AA-003', name:'Distribute approved policy to all depts',  assignee:'Meera Pillai', status:'Open',        dueDate:'2025-05-10', priority:'Medium'   },
//         { id:'AA-004', name:'Schedule annual review cycle',             assignee:null,           status:'Open',        dueDate:'2025-05-15', priority:'Low'      },
//       ]
//     },
//     {
//       obId:'OB-003', clauseRef:'C1.2', dept:'Compliance',
//       obText:'Appoint a designated Compliance Officer with direct Board Audit Committee reporting.',
//       activities:[
//         { id:'AA-005', name:'Identify and shortlist CO candidates',     assignee:'Arjun Kumar',  status:'Complete',    dueDate:'2025-03-31', priority:'Critical' },
//         { id:'AA-006', name:'Issue formal appointment letter',          assignee:'Arjun Kumar',  status:'Complete',    dueDate:'2025-04-05', priority:'Critical' },
//         { id:'AA-007', name:'Notify regulator of CO appointment',       assignee:null,           status:'Open',        dueDate:'2025-04-20', priority:'High'     },
//       ]
//     },
//     {
//       obId:'OB-008', clauseRef:'C2.1', dept:'IT',
//       obText:'Upgrade transaction monitoring to real-time detection with max 5s latency.',
//       activities:[
//         { id:'AA-008', name:'Assess current TMS gaps vs requirements',  assignee:'Raj Iyer',     status:'In Progress', dueDate:'2025-04-10', priority:'Critical' },
//         { id:'AA-009', name:'Evaluate and select TMS vendor',           assignee:null,           status:'Open',        dueDate:'2025-04-25', priority:'Critical' },
//         { id:'AA-010', name:'Configure real-time alert rules',          assignee:'Sanjay Mehta', status:'Open',        dueDate:'2025-05-15', priority:'High'     },
//         { id:'AA-011', name:'UAT testing and performance benchmark',    assignee:null,           status:'Open',        dueDate:'2025-05-30', priority:'High'     },
//         { id:'AA-012', name:'Go-live and post-deployment monitoring',   assignee:null,           status:'Open',        dueDate:'2025-06-15', priority:'High'     },
//       ]
//     },
//     {
//       obId:'OB-006', clauseRef:'C2.2', dept:'Operations',
//       obText:'Update all customer-facing processes within 30 days of the effective date.',
//       activities:[
//         { id:'AA-013', name:'Map all affected customer-facing processes', assignee:'Suresh Kumar', status:'In Progress', dueDate:'2025-04-08', priority:'High'   },
//         { id:'AA-014', name:'Update SOPs and process documentation',      assignee:null,           status:'Open',        dueDate:'2025-04-20', priority:'High'   },
//         { id:'AA-015', name:'Train frontline staff on updated processes', assignee:'Lakshmi Rao',  status:'Open',        dueDate:'2025-05-01', priority:'Medium' },
//       ]
//     },
//     {
//       obId:'OB-012', clauseRef:'C3.1', dept:'Risk',
//       obText:'Annual third-party audit of compliance infrastructure, findings to Board within 30 days.',
//       activities:[
//         { id:'AA-016', name:'Identify and shortlist audit firms',       assignee:'Anand Krishnan', status:'Open', dueDate:'2025-05-01', priority:'High'   },
//         { id:'AA-017', name:'Define audit scope and deliverables',      assignee:'Neha Rao',       status:'Open', dueDate:'2025-05-10', priority:'High'   },
//         { id:'AA-018', name:'Conduct audit and review findings',        assignee:null,             status:'Open', dueDate:'2025-06-30', priority:'High'   },
//         { id:'AA-019', name:'Present audit report to Board',            assignee:null,             status:'Open', dueDate:'2025-07-30', priority:'Medium' },
//       ]
//     },
//   ];

//   if (!window._aaData) window._aaData = {};
//   if (!window._aaData[circId]) window._aaData[circId] = JSON.parse(JSON.stringify(base));
//   return window._aaData[circId];
// }

// function _aaAllActs(circId) {
//   return _aaGetActivities(circId).flatMap(g => g.activities);
// }

// /* ── MAIN RENDER ─────────────────────────────────────────────── */
// window.renderAssignActivity = function(circId, deptFilter) {
//   const area = document.getElementById('content-area');
//   if (!area) return;
//   _aaInjectStyles();

//   const circs = (typeof CMS_DATA !== 'undefined' && CMS_DATA.circulars) ? CMS_DATA.circulars : [
//     { id:'CIRC-001', title:'Cybersecurity Framework for Regulated Entities',      regulator:'RBI'   },
//     { id:'CIRC-002', title:'Enhanced KYC & AML Compliance Directive',             regulator:'SEBI'  },
//     { id:'CIRC-003', title:'Operational Risk Management Guidelines',              regulator:'RBI'   },
//     { id:'CIRC-005', title:'Third-Party & Vendor Risk Management Framework',      regulator:'IRDAI' },
//   ];

//   const activeId   = circId || circs[0]?.id || 'CIRC-001';
//   const activeCirc = circs.find(c => c.id === activeId) || circs[0];

//   area.innerHTML = _aaBuildPage(circs, activeCirc, deptFilter || '');
//   _aaBindAll(activeCirc.id, deptFilter || '');
// };

// /* ── PAGE SHELL ──────────────────────────────────────────────── */
// function _aaBuildPage(circs, activeCirc, deptFilter) {
//   const groups   = _aaGetActivities(activeCirc.id);
//   const allActs  = groups.flatMap(g => g.activities);
//   const total    = allActs.length;
//   const assigned = allActs.filter(a => a.assignee).length;
//   const complete = allActs.filter(a => a.status === 'Complete').length;
//   const overdue  = allActs.filter(a => a.status === 'Overdue').length;

//   return `<div class="aa-page" id="aa-page">

//   <!-- OVERLAY DRAWER -->
//   <div class="aa-overlay" id="aa-overlay" style="display:none;" onclick="_aaOverlayClick(event)">
//     <div class="aa-drawer" id="aa-drawer">
//       <div id="aa-drawer-content"></div>
//     </div>
//   </div>

//   <div class="aa-wrap">

//     <!-- PAGE HEADER -->
//     <div class="aa-page-head">
//       <div class="aa-head-left">
//         <div class="aa-head-eyebrow">Department Assignment Console</div>
//         <div class="aa-head-title">Activity Assignment</div>
//         <div class="aa-head-sub">Assign actions to team members &nbsp;·&nbsp; Obligation → Activity</div>
//       </div>
//       <div class="aa-head-right">
//         <button class="aa-btn aa-btn-ghost" onclick="window.history.back()">← Back</button>
//         <button class="aa-btn aa-btn-pri" onclick="_aaSaveAll('${activeCirc.id}')">💾 Save All</button>
//       </div>
//     </div>

//     <!-- TOP FILTERS CARD -->
//     <div class="aa-filter-card">

//       <!-- Circular -->
//       <div class="aa-fc-field">
//         <span class="aa-fc-label">Circular</span>
//         <div class="aa-custom-sel-wrap" id="aa-csel-wrap">
//           <button class="aa-custom-sel-btn" id="aa-csel-btn">
//             <span class="aa-csel-id">${activeCirc.id}</span>
//             <span class="aa-csel-title">${activeCirc.title.substring(0,34)}…</span>
//             <span class="aa-csel-arr">▾</span>
//           </button>
//           <div class="aa-csel-drop" id="aa-csel-drop" style="display:none;">
//             <input class="aa-csel-search" id="aa-csel-search" placeholder="Search…" autocomplete="off"/>
//             <div class="aa-csel-list">
//               ${circs.map(c => `
//               <div class="aa-csel-item ${c.id === activeCirc.id ? 'active' : ''}" onclick="_aaSwitchCirc('${c.id}')">
//                 <span class="aa-csel-item-id">${c.id}</span>
//                 <span class="aa-csel-item-title">${c.title}</span>
//               </div>`).join('')}
//             </div>
//           </div>
//         </div>
//       </div>

//       <!-- Dept -->
//       <div class="aa-fc-field">
//         <span class="aa-fc-label">Department</span>
//         <select class="aa-flt-sel" id="aa-filter-dept" onchange="_aaApplyFilters('${activeCirc.id}')">
//           <option value="">All Departments</option>
//           ${AA_DEPTS.map(d => `<option ${d === deptFilter ? 'selected' : ''}>${d}</option>`).join('')}
//         </select>
//       </div>

//       <!-- Status -->
//       <div class="aa-fc-field">
//         <span class="aa-fc-label">Status</span>
//         <select class="aa-flt-sel" id="aa-filter-status" onchange="_aaApplyFilters('${activeCirc.id}')">
//           <option value="">All Statuses</option>
//           <option>Open</option><option>In Progress</option><option>Complete</option><option>Overdue</option>
//         </select>
//       </div>

//       <!-- Priority -->
//       <div class="aa-fc-field">
//         <span class="aa-fc-label">Priority</span>
//         <select class="aa-flt-sel" id="aa-filter-priority" onchange="_aaApplyFilters('${activeCirc.id}')">
//           <option value="">All Priorities</option>
//           <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
//         </select>
//       </div>

//       <!-- Search -->
//       <div class="aa-fc-field aa-fc-search">
//         <span class="aa-fc-label">Search</span>
//         <input class="aa-search-inp" id="aa-search" placeholder="Search actions, obligations…"
//                oninput="_aaApplyFilters('${activeCirc.id}')"/>
//       </div>

//       <!-- Stats pills -->
//       <div class="aa-stats-row">
//         <div class="aa-stat-pill">${total} total</div>
//         <div class="aa-stat-pill aa-sp-amber">${total - assigned} unassigned</div>
//         <div class="aa-stat-pill aa-sp-green">${complete} complete</div>
//         ${overdue ? `<div class="aa-stat-pill aa-sp-red">${overdue} overdue</div>` : ''}
//       </div>

//     </div>

//     <!-- TOOLBAR -->
//     <div class="aa-toolbar">
//       <div class="aa-tl-left">
//         <label class="aa-check-wrap">
//           <input type="checkbox" id="aa-sel-all" onchange="_aaToggleAll(this.checked)"/>
//           <span class="aa-checkmark"></span>
//         </label>
//         <span class="aa-tl-hint">Select all</span>
//         <span class="aa-sel-badge" id="aa-sel-badge" style="display:none;"></span>
//       </div>
//       <div class="aa-tl-right">
//         <span class="aa-tl-hint">Click any row to assign · Select multiple for bulk assign</span>
//       </div>
//     </div>

//     <!-- TABLE -->
//     <div class="aa-table-card" id="aa-table-card">
//       <table class="aa-table" id="aa-table">
//         <thead>
//           <tr>
//             <th class="aa-th-chk"></th>
//             <th>Act ID</th>
//             <th>Action</th>
          
//             <th>Dept</th>
//             <th>Assignee</th>
//             <th>Due Date</th>
//             <th>Priority</th>
//             <th>Status</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody id="aa-tbody">
//           ${groups.map(g => _aaRenderGroup(g, activeCirc.id)).join('')}
//         </tbody>
//       </table>
//     </div>

//   </div>

//   <!-- FLOATING BULK BAR -->
//   <div class="aa-bulk-bar" id="aa-bulk-bar" style="display:none;">
//     <div class="aa-bulk-left">
//       <span class="aa-bulk-count" id="aa-bulk-count">0 selected</span>
//       <button class="aa-bulk-clear" onclick="_aaClearSel()">✕</button>
//     </div>
//     <div class="aa-bulk-div"></div>
//     <div class="aa-bulk-fields">
//       <div class="aa-bulk-f">
//         <span class="aa-bulk-lbl">Assign to</span>
//         <div class="aa-bulk-ta-wrap">
//           <input class="aa-bulk-inp" id="aa-bulk-assignee" placeholder="Type name…"
//                  oninput="_aaBulkTypeahead(this.value)" autocomplete="off"/>
//           <div class="aa-bulk-sug-box" id="aa-bulk-sug" style="display:none;"></div>
//         </div>
//       </div>
//       <div class="aa-bulk-f">
//         <span class="aa-bulk-lbl">Due Date</span>
//         <input type="date" class="aa-bulk-inp" id="aa-bulk-due"/>
//       </div>
//       <div class="aa-bulk-f">
//         <span class="aa-bulk-lbl">Status</span>
//         <select class="aa-bulk-sel" id="aa-bulk-status">
//           <option value="">Keep existing</option>
//           <option>Open</option><option>In Progress</option><option>Complete</option>
//         </select>
//       </div>
//     </div>
//     <button class="aa-bulk-go" onclick="_aaBulkAssign('${activeCirc.id}')">✓ Assign Selected</button>
//   </div>

// </div>`;
// }

// /* ── RENDER OBLIGATION GROUP ─────────────────────────────────── */
// function _aaRenderGroup(g, circId) {
//   const assignedCnt = g.activities.filter(a => a.assignee).length;
//   const deptCls     = `aa-dept-${g.dept.toLowerCase()}`;

//   return `
// <!-- Obligation header row — dark navy -->
// <tr class="aa-ob-head-row" id="aa-ob-head-${g.obId}" onclick="_aaToggleGroup('${g.obId}')">
//   <td colspan="10" class="aa-ob-head-td">
//     <div class="aa-ob-head-inner">
//       <span class="aa-ob-arr" id="aa-ob-arr-${g.obId}">▶</span>
//       <div class="aa-ob-head-titles">
//         <div class="aa-ob-head-top">
//           <span class="aa-ob-clause-id">${g.clauseRef}</span>
//           <span class="aa-ob-id-tag">${g.obId}</span>
//           <span class="aa-dept-chip ${deptCls}">${g.dept}</span>
//         </div>
//         <div class="aa-ob-head-text">${g.obText}</div>
//       </div>
//       <div class="aa-ob-head-right">
//         <span class="aa-ob-act-count">${g.activities.length} actions</span>
//         <span class="aa-ob-prog-pill">${assignedCnt}/${g.activities.length} assigned</span>
//       </div>
//     </div>
//   </td>
// </tr>
// <!-- Column sub-header — shows inside the obligation group when open -->
// <tr class="aa-col-sub-head" id="aa-col-sub-${g.obId}" style="display:none;">
//   <th class="aa-col-sub-th"></th>
//   <th class="aa-col-sub-th">Act ID</th>
//   <th class="aa-col-sub-th">Action</th>
 
//   <th class="aa-col-sub-th">Dept</th>
//   <th class="aa-col-sub-th">Assignee</th>
//   <th class="aa-col-sub-th">Due Date</th>
//   <th class="aa-col-sub-th">Priority</th>
//   <th class="aa-col-sub-th">Status</th>
//   <th class="aa-col-sub-th"></th>
// </tr>
// ${g.activities.map(act => _aaRenderActRow(act, g, circId)).join('')}`;
// }

// /* ── RENDER ACTIVITY ROW ─────────────────────────────────────── */
// function _aaRenderActRow(act, g, circId) {
//   const sc = s => ({ Complete:'#0e9f6e','In Progress':'#b45309',Overdue:'#c92a2a',Open:'#5b5fcf' })[s] || '#64748b';
//   const sb = s => ({ Complete:'#e8faf4','In Progress':'#fef3c7',Overdue:'#fdecea',Open:'#ededfc' })[s] || '#f1f5f9';
//   const priCls = { Critical:'aa-p-crit', High:'aa-p-high', Medium:'aa-p-med', Low:'aa-p-low' }[act.priority] || '';

//   return `
// <tr class="aa-act-row ${!act.assignee ? 'aa-act-unassigned' : ''}"
//     id="aa-row-${act.id}"
//     data-actid="${act.id}" data-circid="${circId}" data-obid="${g.obId}"
//     data-dept="${g.dept}" data-status="${act.status}" data-priority="${act.priority}"
//     data-assignee="${act.assignee || ''}"
//     data-search="${act.name.toLowerCase()} ${g.obText.toLowerCase()} ${g.dept.toLowerCase()}"
//     style="display:none;">

//   <!-- Checkbox -->
//   <td class="aa-td-chk" onclick="event.stopPropagation()">
//     <label class="aa-check-wrap">
//       <input type="checkbox" class="aa-row-chk" data-id="${act.id}" onchange="_aaRowCheck(this)"/>
//       <span class="aa-checkmark"></span>
//     </label>
//   </td>

//   <!-- Act ID -->
//   <td onclick="_aaOpenDrawer('${act.id}','${g.obId}','${circId}')">
//     <span class="aa-act-id">${act.id}</span>
//   </td>

//   <!-- Action name -->
//   <td onclick="_aaOpenDrawer('${act.id}','${g.obId}','${circId}')" class="aa-td-name">
//     <span class="aa-act-name">${act.name}</span>
//   </td>

 
//   <!-- Dept -->
//   <td><span class="aa-dept-chip aa-dept-${g.dept.toLowerCase()}">${g.dept}</span></td>

//   <!-- Assignee inline -->
//   <td onclick="event.stopPropagation()" class="aa-td-assignee">
//     <div class="aa-ita-wrap" id="aa-ita-wrap-${act.id}">
//       ${act.assignee
//         ? `<div class="aa-assignee-filled" onclick="_aaOpenDrawer('${act.id}','${g.obId}','${circId}')">
//              <span class="aa-av">${act.assignee.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</span>
//              <span class="aa-assignee-name">${act.assignee}</span>
//            </div>`
//         : `<div class="aa-assignee-empty">
//              <input class="aa-inline-assignee" placeholder="Assign…" autocomplete="off"
//                     data-actid="${act.id}" data-obid="${g.obId}" data-dept="${g.dept}"
//                     oninput="_aaInlineTypeahead('${act.id}','${g.dept}',this.value,'${circId}')"
//                     onfocus="_aaInlineTypeahead('${act.id}','${g.dept}',this.value,'${circId}')"/>
//              <div class="aa-sug-box" id="aa-ita-sug-${act.id}" style="display:none;"></div>
//            </div>`
//       }
//     </div>
//   </td>

//   <!-- Due date -->
//   <td onclick="event.stopPropagation()">
//     <input type="date" class="aa-inline-date ${act.dueDate ? 'filled' : ''}"
//            value="${act.dueDate || ''}"
//            onchange="_aaInlineDueChange('${act.id}','${g.obId}','${circId}',this)"/>
//   </td>

//   <!-- Priority -->
//   <td><span class="aa-pri-badge ${priCls}">${act.priority}</span></td>

//   <!-- Status -->
//   <td><span class="aa-st-pill" style="background:${sb(act.status)};color:${sc(act.status)}">${act.status}</span></td>

//   <!-- Open -->
//   <td>
//     <button class="aa-open-btn" onclick="_aaOpenDrawer('${act.id}','${g.obId}','${circId}')" title="Open detail">›</button>
//   </td>

// </tr>`;
// }

// /* ── GROUP TOGGLE ────────────────────────────────────────────── */
// window._aaToggleGroup = function(obId) {
//   const rows   = document.querySelectorAll(`.aa-act-row[data-obid="${obId}"]`);
//   const subHdr = document.getElementById(`aa-col-sub-${obId}`);
//   const arr    = document.getElementById(`aa-ob-arr-${obId}`);
//   const open   = arr && arr.textContent === '▼';
//   rows.forEach(r => r.style.display = open ? 'none' : '');
//   if (subHdr) subHdr.style.display = open ? 'none' : '';
//   if (arr) arr.textContent = open ? '▶' : '▼';
// };

// /* ── OVERLAY DRAWER ──────────────────────────────────────────── */
// window._aaOverlayClick = function(e) {
//   if (e.target.id === 'aa-overlay') _aaCloseDrawerDirect();
// };

// window._aaOpenDrawer = function(actId, obId, circId) {
//   const groups = _aaGetActivities(circId);
//   const group  = groups.find(g => g.obId === obId);
//   const act    = group && group.activities.find(a => a.id === actId);
//   if (!act || !group) return;

//   document.querySelectorAll('.aa-act-row').forEach(r => r.classList.remove('aa-row-active'));
//   document.getElementById(`aa-row-${actId}`)?.classList.add('aa-row-active');

//   const overlay = document.getElementById('aa-overlay');
//   const drawer  = document.getElementById('aa-drawer');
//   const dc      = document.getElementById('aa-drawer-content');
//   if (!overlay || !drawer || !dc) return;

//   overlay.style.display = 'flex';
//   requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('open')));

//   const sc     = s => ({ Complete:'#0e9f6e','In Progress':'#b45309',Overdue:'#c92a2a',Open:'#5b5fcf' })[s] || '#64748b';
//   const sb     = s => ({ Complete:'#e8faf4','In Progress':'#fef3c7',Overdue:'#fdecea',Open:'#ededfc' })[s] || '#f1f5f9';
//   const priCls = { Critical:'aa-p-crit', High:'aa-p-high', Medium:'aa-p-med', Low:'aa-p-low' }[act.priority] || '';
//   const deptCls = `aa-dept-${group.dept.toLowerCase()}`;

//   dc.innerHTML = `
// <div class="aa-dr-inner">

//   <!-- Header -->
//   <div class="aa-dr-head">
//     <div class="aa-dr-head-left">
//       <span class="aa-act-id" style="font-size:11px">${act.id}</span>
//       <span class="aa-pri-badge ${priCls}">${act.priority}</span>
//     </div>
//     <button class="aa-dr-close" onclick="_aaCloseDrawerDirect()">✕</button>
//   </div>

//   <!-- Action name -->
//   <div class="aa-dr-act-name">${act.name}</div>

//   <!-- Obligation context — dark block like the group header -->
//   <div class="aa-dr-ob-ctx">
//     <div class="aa-dr-ob-ctx-top">
//       <span class="aa-ob-clause-id">${group.clauseRef}</span>
//       <span class="aa-ob-id-tag">${group.obId}</span>
//       <span class="aa-dept-chip ${deptCls}">${group.dept}</span>
//     </div>
//     <div class="aa-dr-ob-ctx-text">${group.obText}</div>
//   </div>

//   <!-- Meta row -->
//   <div class="aa-dr-meta-row">
//     <div class="aa-dr-meta-item">
//       <span class="aa-dr-meta-label">Current Status</span>
//       <span class="aa-st-pill" style="background:${sb(act.status)};color:${sc(act.status)}">${act.status}</span>
//     </div>
//     ${act.dueDate ? `<div class="aa-dr-meta-item">
//       <span class="aa-dr-meta-label">Current Due Date</span>
//       <span class="aa-dr-meta-val">${act.dueDate}</span>
//     </div>` : ''}
//   </div>

//   <div class="aa-dr-section-label">Assignment Details</div>

//   <!-- Fields -->
//   <div class="aa-dr-fields">

//     <div class="aa-dr-field">
//       <label class="aa-dr-label">Assign to Person</label>
//       <div class="aa-ta-wrap" id="aa-dta-wrap-${actId}">
//         <input class="aa-dr-input" id="aa-dr-assignee-${actId}"
//                value="${act.assignee || ''}" placeholder="Type name to search…" autocomplete="off"
//                oninput="_aaDrawerTypeahead('${actId}','${group.dept}',this.value)"
//                onfocus="_aaDrawerTypeahead('${actId}','${group.dept}',this.value)"/>
//         <div class="aa-sug-box" id="aa-dta-sug-${actId}" style="display:none;"></div>
//       </div>
//     </div>

//     <div class="aa-dr-field-row">
//       <div class="aa-dr-field">
//         <label class="aa-dr-label">Due Date</label>
//         <input type="date" class="aa-dr-input" id="aa-dr-due-${actId}" value="${act.dueDate || ''}"/>
//       </div>
//       <div class="aa-dr-field">
//         <label class="aa-dr-label">Status</label>
//         <select class="aa-dr-input" id="aa-dr-status-${actId}">
//           ${['Open','In Progress','Complete','Overdue'].map(s =>
//             `<option ${s === act.status ? 'selected' : ''}>${s}</option>`).join('')}
//         </select>
//       </div>
//     </div>

//     <div class="aa-dr-field">
//       <label class="aa-dr-label">Priority</label>
//       <select class="aa-dr-input" id="aa-dr-pri-${actId}">
//         ${['Critical','High','Medium','Low'].map(p =>
//           `<option ${p === act.priority ? 'selected' : ''}>${p}</option>`).join('')}
//       </select>
//     </div>

//     <div class="aa-dr-field">
//       <label class="aa-dr-label">Notes / Instructions</label>
//       <textarea class="aa-dr-input aa-dr-ta" id="aa-dr-notes-${actId}"
//                 placeholder="Add context or instructions for the assignee…">${act._notes || ''}</textarea>
//     </div>

//   </div>

//   <!-- Evidence hint -->
//   <div class="aa-ev-hint">
//     📎 Evidence for this action can be uploaded once assigned in <strong>Task Management</strong>.
//   </div>

//   <!-- Footer -->
//   <div class="aa-dr-foot">
//     <button class="aa-btn aa-btn-ghost aa-btn-sm" onclick="_aaCloseDrawerDirect()">Cancel</button>
//     <button class="aa-btn aa-btn-sec aa-btn-sm" onclick="_aaDrawerSaveDraft('${actId}','${obId}','${circId}')">💾 Draft</button>
//     <button class="aa-btn aa-btn-pri aa-btn-sm" onclick="_aaDrawerSave('${actId}','${obId}','${circId}')">✓ Assign</button>
//   </div>

// </div>`;
// };

// window._aaCloseDrawerDirect = function() {
//   const overlay = document.getElementById('aa-overlay');
//   const drawer  = document.getElementById('aa-drawer');
//   if (!drawer || !overlay) return;
//   drawer.classList.remove('open');
//   setTimeout(() => { overlay.style.display = 'none'; }, 300);
//   document.querySelectorAll('.aa-act-row').forEach(r => r.classList.remove('aa-row-active'));
// };

// /* ── TYPEAHEAD ───────────────────────────────────────────────── */
// window._aaDrawerTypeahead = function(actId, dept, query) {
//   const sug = document.getElementById(`aa-dta-sug-${actId}`);
//   if (!sug) return;
//   _aaShowSug(sug, dept, query, name => {
//     const inp = document.getElementById(`aa-dr-assignee-${actId}`);
//     if (inp) inp.value = name;
//     sug.style.display = 'none';
//   });
// };

// window._aaInlineTypeahead = function(actId, dept, query, circId) {
//   const sug = document.getElementById(`aa-ita-sug-${actId}`);
//   if (!sug) return;
//   _aaShowSug(sug, dept, query, name => {
//     const groups = _aaGetActivities(circId || _aaCurrentCircId());
//     let act = null, group = null;
//     for (const g of groups) { const f = g.activities.find(a => a.id === actId); if (f) { act = f; group = g; break; } }
//     if (!act || !group) return;
//     act.assignee = name;
//     sug.style.display = 'none';
//     const cell = document.getElementById(`aa-ita-wrap-${actId}`);
//     if (cell) cell.innerHTML = `<div class="aa-assignee-filled"><span class="aa-av">${name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span><span class="aa-assignee-name">${name}</span></div>`;
//     if (typeof showToast === 'function') showToast(`Assigned to ${name}`, 'success');
//     _aaUpdateStats(circId || _aaCurrentCircId());
//   });
// };

// function _aaShowSug(sugBox, dept, query, onPick) {
//   let pool = dept && AA_PEOPLE[dept] ? AA_PEOPLE[dept] : Object.values(AA_PEOPLE).flat();
//   pool = [...new Set(pool)];
//   const q   = (query || '').trim().toLowerCase();
//   const res = q ? pool.filter(p => p.toLowerCase().includes(q)) : pool.slice(0, 6);
//   if (!res.length) { sugBox.style.display = 'none'; return; }
//   sugBox.style.display = 'block';
//   sugBox.innerHTML = res.map(p => `
//   <div class="aa-sug-item" onclick="(${onPick.toString()})('${p.replace(/'/g, "\\'")}')">
//     <span class="aa-sug-av">${p.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</span>
//     <span class="aa-sug-name">${p}</span>
//     ${dept && AA_PEOPLE[dept]?.includes(p) ? `<span class="aa-sug-dept-tag">${dept}</span>` : ''}
//   </div>`).join('');
//   setTimeout(() => {
//     document.addEventListener('click', function h(e) {
//       if (!sugBox.contains(e.target)) { sugBox.style.display = 'none'; document.removeEventListener('click', h); }
//     });
//   }, 0);
// }

// window._aaBulkTypeahead = function(query) {
//   const sug = document.getElementById('aa-bulk-sug');
//   if (!sug) return;
//   let pool = [...new Set(Object.values(AA_PEOPLE).flat())];
//   const q   = query.trim().toLowerCase();
//   const res = q ? pool.filter(p => p.toLowerCase().includes(q)) : pool.slice(0, 6);
//   if (!res.length) { sug.style.display = 'none'; return; }
//   sug.style.display = 'block';
//   sug.innerHTML = res.map(p => `
//   <div class="aa-sug-item aa-sug-dark" onclick="_aaPickBulkPerson('${p.replace(/'/g, "\\'")}')">
//     <span class="aa-sug-av">${p.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</span>
//     <span class="aa-sug-name">${p}</span>
//   </div>`).join('');
// };
// window._aaPickBulkPerson = function(name) {
//   const inp = document.getElementById('aa-bulk-assignee');
//   if (inp) inp.value = name;
//   const sug = document.getElementById('aa-bulk-sug');
//   if (sug) sug.style.display = 'none';
// };

// /* ── SAVE ────────────────────────────────────────────────────── */
// window._aaDrawerSave = function(actId, obId, circId) {
//   const groups = _aaGetActivities(circId);
//   const group  = groups.find(g => g.obId === obId);
//   const act    = group && group.activities.find(a => a.id === actId);
//   if (!act) return;
//   act.assignee = document.getElementById(`aa-dr-assignee-${actId}`)?.value || act.assignee;
//   act.dueDate  = document.getElementById(`aa-dr-due-${actId}`)?.value      || act.dueDate;
//   act.status   = document.getElementById(`aa-dr-status-${actId}`)?.value   || act.status;
//   act.priority = document.getElementById(`aa-dr-pri-${actId}`)?.value      || act.priority;
//   act._notes   = document.getElementById(`aa-dr-notes-${actId}`)?.value    || '';
//   const row = document.getElementById(`aa-row-${actId}`);
//   if (row) row.outerHTML = _aaRenderActRow(act, group, circId);
//   _aaUpdateStats(circId);
//   _aaCloseDrawerDirect();
//   if (typeof showToast === 'function') showToast(`${actId} assigned to ${act.assignee || '—'} ✓`, 'success');
// };

// window._aaDrawerSaveDraft = function(actId, obId, circId) {
//   const groups = _aaGetActivities(circId);
//   const group  = groups.find(g => g.obId === obId);
//   const act    = group && group.activities.find(a => a.id === actId);
//   if (act) act._notes = document.getElementById(`aa-dr-notes-${actId}`)?.value || '';
//   if (typeof showToast === 'function') showToast(`Draft saved for ${actId}`, 'success');
// };

// /* ── INLINE ──────────────────────────────────────────────────── */
// window._aaInlineDueChange = function(actId, obId, circId, inp) {
//   const groups = _aaGetActivities(circId);
//   const group  = groups.find(g => g.obId === obId);
//   const act    = group && group.activities.find(a => a.id === actId);
//   if (act) { act.dueDate = inp.value; inp.classList.toggle('filled', !!inp.value); }
// };

// /* ── CHECKBOX + BULK ─────────────────────────────────────────── */
// window._aaRowCheck = function() {
//   const sel   = document.querySelectorAll('.aa-row-chk:checked');
//   const all   = document.querySelectorAll('.aa-row-chk');
//   const selA  = document.getElementById('aa-sel-all');
//   const badge = document.getElementById('aa-sel-badge');
//   const bar   = document.getElementById('aa-bulk-bar');
//   const cnt   = document.getElementById('aa-bulk-count');
//   if (selA) selA.indeterminate = sel.length > 0 && sel.length < all.length;
//   if (badge) { badge.textContent = `${sel.length} selected`; badge.style.display = sel.length ? 'inline-flex' : 'none'; }
//   if (bar)   bar.style.display   = sel.length ? 'flex' : 'none';
//   if (cnt)   cnt.textContent     = `${sel.length} action${sel.length !== 1 ? 's' : ''} selected`;
// };
// window._aaToggleAll = function(checked) {
//   document.querySelectorAll('.aa-row-chk').forEach(c => c.checked = checked);
//   _aaRowCheck();
// };
// window._aaClearSel = function() {
//   document.querySelectorAll('.aa-row-chk').forEach(c => c.checked = false);
//   const sa = document.getElementById('aa-sel-all');
//   if (sa) { sa.checked = false; sa.indeterminate = false; }
//   _aaRowCheck();
// };
// window._aaBulkAssign = function(circId) {
//   const sel      = [...document.querySelectorAll('.aa-row-chk:checked')].map(c => c.dataset.id);
//   const assignee = document.getElementById('aa-bulk-assignee')?.value.trim();
//   const dueDate  = document.getElementById('aa-bulk-due')?.value;
//   const status   = document.getElementById('aa-bulk-status')?.value;
//   if (!sel.length)  { if (typeof showToast === 'function') showToast('No actions selected', 'warning'); return; }
//   if (!assignee)    { if (typeof showToast === 'function') showToast('Please enter an assignee', 'warning'); return; }
//   const groups  = _aaGetActivities(circId);
//   const allPairs = groups.flatMap(g => g.activities.map(a => ({ act: a, group: g })));
//   sel.forEach(actId => {
//     const found = allPairs.find(x => x.act.id === actId);
//     if (!found) return;
//     const { act, group } = found;
//     act.assignee = assignee;
//     if (dueDate) act.dueDate = dueDate;
//     if (status)  act.status  = status;
//     const row = document.getElementById(`aa-row-${actId}`);
//     if (row) row.outerHTML = _aaRenderActRow(act, group, circId);
//   });
//   _aaUpdateStats(circId);
//   _aaClearSel();
//   if (typeof showToast === 'function') showToast(`${sel.length} action${sel.length !== 1 ? 's' : ''} assigned to ${assignee} ✓`, 'success');
// };

// /* ── FILTERS ─────────────────────────────────────────────────── */
// window._aaApplyFilters = function(circId) {
//   const fD = document.getElementById('aa-filter-dept')?.value     || '';
//   const fS = document.getElementById('aa-filter-status')?.value   || '';
//   const fP = document.getElementById('aa-filter-priority')?.value || '';
//   const fQ = (document.getElementById('aa-search')?.value || '').toLowerCase();
//   document.querySelectorAll('.aa-act-row').forEach(row => {
//     const ok = (!fD || row.dataset.dept === fD) &&
//                (!fS || row.dataset.status === fS) &&
//                (!fP || row.dataset.priority === fP) &&
//                (!fQ || row.dataset.search?.includes(fQ));
//     row.style.display = ok ? '' : 'none';
//   });
// };

// /* ── STATS UPDATE ────────────────────────────────────────────── */
// function _aaUpdateStats(circId) {
//   const all      = circId ? _aaAllActs(circId) : [];
//   const assigned = all.filter(a => a.assignee).length;
//   const pills    = document.querySelectorAll('.aa-stat-pill');
//   if (pills[0]) pills[0].textContent = `${all.length} total`;
//   if (pills[1]) pills[1].textContent = `${all.length - assigned} unassigned`;
// }

// function _aaCurrentCircId() {
//   return document.getElementById('aa-csel-btn')?.querySelector('.aa-csel-id')?.textContent?.trim() || 'CIRC-001';
// }

// window._aaSwitchCirc = function(circId) {
//   document.getElementById('aa-csel-drop').style.display = 'none';
//   renderAssignActivity(circId);
// };
// window._aaSaveAll = function() {
//   if (typeof showToast === 'function') showToast('All assignments saved ✓', 'success');
// };

// /* ── BIND ────────────────────────────────────────────────────── */
// function _aaBindAll(circId, deptFilter) {
//   const btn  = document.getElementById('aa-csel-btn');
//   const drop = document.getElementById('aa-csel-drop');
//   const srch = document.getElementById('aa-csel-search');
//   if (btn) btn.addEventListener('click', e => {
//     e.stopPropagation();
//     drop.style.display = drop.style.display === 'none' ? 'block' : 'none';
//     if (drop.style.display !== 'none' && srch) srch.focus();
//   });
//   if (srch) srch.addEventListener('input', function() {
//     const q = this.value.toLowerCase();
//     document.querySelectorAll('.aa-csel-item').forEach(i => i.style.display = i.textContent.toLowerCase().includes(q) ? '' : 'none');
//   });
//   document.addEventListener('click', e => {
//     const wrap = document.getElementById('aa-csel-wrap');
//     if (wrap && !wrap.contains(e.target) && drop) drop.style.display = 'none';
//   });
//   if (deptFilter) {
//     const sel = document.getElementById('aa-filter-dept');
//     if (sel) { sel.value = deptFilter; _aaApplyFilters(circId); }
//   }
// }

// /* ── STYLES ──────────────────────────────────────────────────── */
// function _aaInjectStyles() {
//   if (document.getElementById('aa-styles')) return;
//   const s = document.createElement('style');
//   s.id = 'aa-styles';
//   s.textContent = `
// @keyframes aaIn     { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
// @keyframes aaFadeIn { from{opacity:0} to{opacity:1} }

// :root{
//   --aa-bg:       #f0f3f7;
//   --aa-card:     #ffffff;
//   --aa-border:   #dde2ea;
//   --aa-border-lt:#edf0f5;
//   /* Obligation header — dark navy (matches chapter in obligation screen) */
//   --aa-ob-bg:    #1a2235;
//   --aa-ob-text:  #ffffff;
//   --aa-ob-sub:   rgba(255,255,255,.5);
//   --aa-ob-bdr:   #252f45;
//   --aa-ob-id:    #7ec8e3;
//   /* Row */
//   --aa-row-bg:   #ffffff;
//   --aa-row-hover:#f5f8fc;
//   --aa-text:     #1e2433;
//   --aa-text-sec: #5a6478;
//   --aa-text-mut: #9aa3b5;
//   --aa-accent:   #0d7fa5;
//   --aa-accent-lt:#e6f4f9;
//   --aa-accent-md:#b2ddef;
//   --aa-purple:   #5b5fcf;
//   --aa-purple-lt:#ededfc;
//   --aa-green:    #0e9f6e;
//   --aa-green-lt: #e8faf4;
//   --aa-amber:    #b45309;
//   --aa-amber-lt: #fef3c7;
//   --aa-red:      #c92a2a;
//   --aa-red-lt:   #fdecea;
//   --aa-r:        8px;
//   --aa-rl:       12px;
//   --aa-sh:       0 1px 4px rgba(30,36,51,.07);
//   --aa-shm:      0 4px 16px rgba(30,36,51,.12);
//   --aa-shl:      0 8px 32px rgba(30,36,51,.18);
// }

// .aa-page{font-family:'DM Sans',system-ui,sans-serif;color:var(--aa-text);background:var(--aa-bg);min-height:100vh;position:relative;}
// .aa-wrap{max-width:1200px;margin:0 auto;padding:28px 24px 100px;}

// /* BUTTONS */
// .aa-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:var(--aa-r);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;}
// .aa-btn-pri{background:var(--aa-text);color:#fff;} .aa-btn-pri:hover{background:#2d3548;box-shadow:0 4px 12px rgba(30,36,51,.2);}
// .aa-btn-sec{background:var(--aa-card);color:var(--aa-text-sec);border:1.5px solid var(--aa-border);} .aa-btn-sec:hover{background:var(--aa-bg);}
// .aa-btn-ghost{background:var(--aa-card);color:var(--aa-text-sec);border:1.5px solid var(--aa-border);} .aa-btn-ghost:hover{background:var(--aa-bg);}
// .aa-btn-sm{padding:7px 14px;font-size:12px;}

// /* PAGE HEAD */
// .aa-page-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap;}
// .aa-head-eyebrow{font-size:10px;font-weight:700;color:var(--aa-accent);text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;}
// .aa-head-title{font-size:24px;font-weight:800;color:var(--aa-text);margin-bottom:4px;}
// .aa-head-sub{font-size:12px;color:var(--aa-text-mut);}
// .aa-head-right{display:flex;gap:8px;}

// /* FILTER CARD */
// .aa-filter-card{display:flex;align-items:flex-end;gap:12px;padding:16px 20px;background:var(--aa-card);border:1px solid var(--aa-border);border-radius:var(--aa-rl);margin-bottom:12px;box-shadow:var(--aa-sh);flex-wrap:wrap;}
// .aa-fc-field{display:flex;flex-direction:column;gap:4px;}
// .aa-fc-label{font-size:9px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.08em;}
// .aa-flt-sel{padding:7px 10px;background:#f5f7fa;border:1px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:12px;color:var(--aa-text-sec);outline:none;cursor:pointer;min-width:130px;}
// .aa-flt-sel:focus{border-color:var(--aa-accent);}
// .aa-fc-search{flex:1;min-width:180px;}
// .aa-search-inp{width:100%;padding:7px 11px;background:#f5f7fa;border:1px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:12px;color:var(--aa-text);outline:none;box-sizing:border-box;}
// .aa-search-inp:focus{border-color:var(--aa-accent);background:#fff;}

// /* Circular selector */
// .aa-custom-sel-wrap{position:relative;}
// .aa-custom-sel-btn{display:flex;align-items:center;gap:8px;padding:7px 11px;background:#f5f7fa;border:1.5px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;cursor:pointer;min-width:230px;transition:all .14s;}
// .aa-custom-sel-btn:hover{border-color:var(--aa-accent);}
// .aa-csel-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--aa-accent);flex-shrink:0;}
// .aa-csel-title{font-size:11px;color:var(--aa-text-sec);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
// .aa-csel-arr{color:var(--aa-text-mut);flex-shrink:0;}
// .aa-csel-drop{position:absolute;top:calc(100%+4px);left:0;min-width:290px;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-rl);z-index:300;box-shadow:var(--aa-shl);overflow:hidden;}
// .aa-csel-search{width:100%;padding:9px 12px;background:#f5f7fa;border:none;border-bottom:1px solid var(--aa-border);font-family:inherit;font-size:12px;color:var(--aa-text);outline:none;box-sizing:border-box;}
// .aa-csel-list{max-height:200px;overflow-y:auto;}
// .aa-csel-item{display:flex;align-items:center;gap:8px;padding:9px 14px;cursor:pointer;border-bottom:1px solid var(--aa-border-lt);transition:background .1s;}
// .aa-csel-item:hover,.aa-csel-item.active{background:var(--aa-accent-lt);}
// .aa-csel-item-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--aa-text);flex-shrink:0;}
// .aa-csel-item-title{font-size:11px;color:var(--aa-text-sec);}

// /* Stats pills */
// .aa-stats-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-left:auto;}
// .aa-stat-pill{font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;background:#e8ebf1;color:var(--aa-text-sec);border:1px solid var(--aa-border);}
// .aa-sp-amber{background:var(--aa-amber-lt);color:var(--aa-amber);border-color:#fcd34d;}
// .aa-sp-green{background:var(--aa-green-lt);color:var(--aa-green);border-color:#6ee7b7;}
// .aa-sp-red  {background:var(--aa-red-lt);color:var(--aa-red);border-color:#f5b8b8;}

// /* TOOLBAR */
// .aa-toolbar{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;background:var(--aa-card);border:1px solid var(--aa-border);border-radius:var(--aa-r);margin-bottom:10px;box-shadow:var(--aa-sh);}
// .aa-tl-left{display:flex;align-items:center;gap:10px;}
// .aa-tl-right{font-size:11px;color:var(--aa-text-mut);}
// .aa-tl-hint{font-size:11px;color:var(--aa-text-mut);}
// .aa-sel-badge{font-size:11px;font-weight:700;color:var(--aa-accent);background:var(--aa-accent-lt);border:1px solid var(--aa-accent-md);padding:3px 10px;border-radius:20px;}

// /* CHECKBOX */
// .aa-check-wrap{display:inline-flex;align-items:center;cursor:pointer;position:relative;}
// .aa-check-wrap input{position:absolute;opacity:0;width:0;height:0;}
// .aa-checkmark{width:15px;height:15px;border:2px solid var(--aa-border);border-radius:4px;background:var(--aa-card);transition:all .13s;flex-shrink:0;}
// .aa-check-wrap input:checked ~ .aa-checkmark{background:var(--aa-accent);border-color:var(--aa-accent);}
// .aa-check-wrap input:checked ~ .aa-checkmark::after{content:'';display:block;width:3px;height:6px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg);margin:1px 0 0 3px;}
// .aa-check-wrap input:indeterminate ~ .aa-checkmark{background:var(--aa-accent);border-color:var(--aa-accent);}
// .aa-check-wrap input:indeterminate ~ .aa-checkmark::after{content:'';display:block;width:7px;height:2px;background:#fff;margin:4px 0 0 2px;}

// /* TABLE CARD */
// .aa-table-card{background:var(--aa-card);border:1px solid var(--aa-border);border-radius:var(--aa-rl);overflow:hidden;box-shadow:var(--aa-sh);}
// .aa-table{width:100%;border-collapse:collapse;font-size:13px;}
// .aa-table thead tr{background:#f5f7fa;}
// .aa-table thead th{padding:10px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--aa-text-mut);border-bottom:1px solid var(--aa-border);white-space:nowrap;}
// .aa-th-chk{width:40px;}
// .aa-table td{padding:10px 12px;border-bottom:1px solid var(--aa-border-lt);vertical-align:middle;}

// /* ── OBLIGATION HEADER ROW — dark navy ── */
// .aa-ob-head-row{cursor:pointer;background:#2c3e5e;transition:background .15s;}
// .aa-ob-head-row:hover{background:#2c3e5ec7;}
// .aa-ob-head-td{padding:13px 16px !important;border-bottom:none !important;}
// .aa-ob-head-inner{display:flex;align-items:center;gap:14px;}
// .aa-ob-arr{font-size:9px;color:rgba(255,255,255,.35);flex-shrink:0;width:12px;transition:color .13s;}
// .aa-ob-head-row:hover .aa-ob-arr{color:rgba(255,255,255,.75);}
// .aa-ob-head-titles{display:flex;flex-direction:column;gap:5px;flex:1;min-width:0;}
// .aa-ob-head-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
// .aa-ob-clause-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--aa-ob-id);background:rgba(126,200,227,.15);border:1px solid rgba(126,200,227,.25);padding:2px 8px;border-radius:4px;flex-shrink:0;}
// .aa-ob-id-tag{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:rgba(255,255,255,.5);flex-shrink:0;}
// .aa-ob-head-text{font-size:12.5px;color:var(--aa-ob-text);line-height:1.4;font-weight:500;}
// .aa-ob-head-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
// .aa-ob-act-count{font-size:11px;color:rgba(255,255,255,.4);}
// .aa-ob-prog-pill{font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.15);}

// /* Column sub-header row */
// .aa-col-sub-head{}
// .aa-col-sub-th{padding:6px 12px;background:#edf1f6;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--aa-text-mut);border-bottom:1px solid var(--aa-border-lt);white-space:nowrap;}

// /* ACTIVITY ROWS */
// .aa-act-row{transition:background .12s;cursor:pointer;}
// .aa-act-row:hover{background:var(--aa-row-hover);}
// .aa-act-row.aa-act-unassigned{border-left:3px solid var(--aa-amber);}
// .aa-act-row.aa-row-active{background:var(--aa-accent-lt);}
// .aa-td-chk{width:40px;}
// .aa-td-name{max-width:200px;}
// .aa-td-ob{max-width:180px;}
// .aa-td-assignee{min-width:140px;}

// .aa-act-id{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:var(--aa-purple);background:var(--aa-purple-lt);border:1px solid #d4d6f8;padding:2px 7px;border-radius:4px;white-space:nowrap;}
// .aa-act-name{font-size:12.5px;font-weight:600;color:var(--aa-text);}
// .aa-ob-ref{font-size:11px;color:var(--aa-text-sec);}

// /* Dept chips */
// .aa-dept-chip{font-size:10px;font-weight:700;padding:3px 9px;border-radius:4px;}
// .aa-dept-compliance{background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;}
// .aa-dept-risk{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}
// .aa-dept-legal{background:#fdf4ff;color:#7e22ce;border:1px solid #e9d5ff;}
// .aa-dept-it{background:var(--aa-accent-lt);color:var(--aa-accent);border:1px solid var(--aa-accent-md);}
// .aa-dept-operations{background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;}
// .aa-dept-hr{background:#fef9c3;color:#854d0e;border:1px solid #fde68a;}
// .aa-dept-finance{background:#f8fafc;color:#475569;border:1px solid #e2e8f0;}

// /* Assignee cell */
// .aa-assignee-filled{display:flex;align-items:center;gap:7px;cursor:pointer;}
// .aa-av{width:24px;height:24px;border-radius:50%;background:var(--aa-accent-lt);color:var(--aa-accent);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--aa-accent-md);}
// .aa-assignee-name{font-size:12px;font-weight:500;color:var(--aa-text);}
// .aa-assignee-empty{position:relative;}
// .aa-inline-assignee{width:100%;padding:5px 8px;background:#f5f7fa;border:1.5px dashed var(--aa-border);border-radius:6px;font-family:inherit;font-size:11px;color:var(--aa-text-mut);outline:none;transition:all .13s;}
// .aa-inline-assignee:focus{border-color:var(--aa-accent);border-style:solid;background:#fff;color:var(--aa-text);}
// .aa-inline-date{padding:5px 6px;background:#f5f7fa;border:1.5px dashed var(--aa-border);border-radius:6px;font-family:inherit;font-size:11px;color:var(--aa-text-mut);outline:none;transition:all .13s;width:118px;}
// .aa-inline-date:focus,.aa-inline-date.filled{border-style:solid;border-color:var(--aa-accent-md);background:var(--aa-accent-lt);color:var(--aa-text);}

// /* Badges */
// .aa-pri-badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:4px;white-space:nowrap;}
// .aa-p-crit{background:#fce7f3;color:#9d174d;}
// .aa-p-high{background:var(--aa-red-lt);color:var(--aa-red);}
// .aa-p-med{background:var(--aa-amber-lt);color:var(--aa-amber);}
// .aa-p-low{background:var(--aa-green-lt);color:var(--aa-green);}
// .aa-st-pill{font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;display:inline-block;white-space:nowrap;}

// .aa-open-btn{background:none;border:none;cursor:pointer;font-size:18px;color:var(--aa-text-mut);padding:0 2px;transition:color .12s;}
// .aa-open-btn:hover{color:var(--aa-accent);}

// /* ════════════════════════════
//    OVERLAY DRAWER
// ════════════════════════════ */
// .aa-overlay{
//   position:fixed;inset:0;
//   background:rgba(10,15,28,.5);
//   backdrop-filter:blur(3px);
//   z-index:500;
//   display:flex;
//   align-items:stretch;
//   justify-content:flex-end;
//   animation:aaFadeIn .2s ease;
// }
// .aa-drawer{
//   width:460px;max-width:96vw;
//   background:var(--aa-card);
//   box-shadow:-4px 0 40px rgba(10,15,28,.2);
//   display:flex;flex-direction:column;
//   overflow-y:auto;
//   transform:translateX(100%);
//   transition:transform .3s cubic-bezier(.32,.72,0,1);
// }
// .aa-drawer.open{transform:translateX(0);}
// .aa-dr-inner{padding:26px 24px;display:flex;flex-direction:column;gap:16px;min-height:100%;}

// /* Drawer head */
// .aa-dr-head{display:flex;align-items:center;justify-content:space-between;}
// .aa-dr-head-left{display:flex;align-items:center;gap:8px;}
// .aa-dr-close{background:none;border:1px solid var(--aa-border);border-radius:7px;width:30px;height:30px;cursor:pointer;font-size:13px;color:var(--aa-text-mut);display:flex;align-items:center;justify-content:center;transition:all .13s;}
// .aa-dr-close:hover{background:var(--aa-red-lt);color:var(--aa-red);border-color:#f5b8b8;}

// /* Action name */
// .aa-dr-act-name{font-size:16px;font-weight:700;color:var(--aa-text);line-height:1.35;}

// /* Obligation context block — dark like the group header */
// .aa-dr-ob-ctx{background:var(--aa-ob-bg);border-radius:var(--aa-r);padding:14px 16px;display:flex;flex-direction:column;gap:8px;}
// .aa-dr-ob-ctx-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
// .aa-dr-ob-ctx-text{font-size:12.5px;color:var(--aa-ob-text);line-height:1.55;opacity:.85;}

// /* Meta row */
// .aa-dr-meta-row{display:flex;gap:16px;flex-wrap:wrap;}
// .aa-dr-meta-item{display:flex;flex-direction:column;gap:4px;}
// .aa-dr-meta-label{font-size:9px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.07em;}
// .aa-dr-meta-val{font-size:12px;font-weight:500;color:var(--aa-text);}

// /* Section label */
// .aa-dr-section-label{font-size:10px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.08em;padding-top:2px;border-top:1px solid var(--aa-border-lt);}

// /* Fields */
// .aa-dr-fields{display:flex;flex-direction:column;gap:13px;}
// .aa-dr-field{display:flex;flex-direction:column;gap:5px;}
// .aa-dr-field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
// .aa-dr-label{font-size:10px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.06em;}
// .aa-dr-input{padding:9px 12px;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:13px;color:var(--aa-text);outline:none;width:100%;box-sizing:border-box;transition:border-color .15s,box-shadow .15s;}
// .aa-dr-input:focus{border-color:var(--aa-accent);box-shadow:0 0 0 3px rgba(13,127,165,.08);}
// .aa-dr-ta{min-height:75px;resize:vertical;}

// /* Typeahead */
// .aa-ta-wrap{position:relative;}
// .aa-ita-wrap{position:relative;}
// .aa-sug-box{position:absolute;top:calc(100%+4px);left:0;right:0;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-r);z-index:999;box-shadow:var(--aa-shm);max-height:170px;overflow-y:auto;}
// .aa-sug-item{display:flex;align-items:center;gap:9px;padding:9px 12px;cursor:pointer;transition:background .1s;}
// .aa-sug-item:hover{background:var(--aa-accent-lt);}
// .aa-sug-av{width:26px;height:26px;border-radius:50%;background:var(--aa-accent-lt);color:var(--aa-accent);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--aa-accent-md);}
// .aa-sug-name{flex:1;font-size:13px;color:var(--aa-text);font-weight:500;}
// .aa-sug-dept-tag{font-size:10px;font-weight:600;color:var(--aa-accent);background:var(--aa-accent-lt);border:1px solid var(--aa-accent-md);padding:1px 7px;border-radius:4px;}

// /* Evidence hint */
// .aa-ev-hint{background:var(--aa-amber-lt);border:1px solid #fcd34d;border-radius:var(--aa-r);padding:10px 12px;font-size:12px;color:var(--aa-amber);line-height:1.5;}

// /* Drawer footer */
// .aa-dr-foot{display:flex;gap:8px;justify-content:flex-end;padding-top:14px;border-top:1px solid var(--aa-border-lt);margin-top:auto;}

// /* ════════════════════════════
//    FLOATING BULK BAR
// ════════════════════════════ */
// .aa-bulk-bar{
//   position:fixed;bottom:28px;left:50%;transform:translateX(-50%);
//   display:flex;align-items:center;gap:0;
//   background:var(--aa-ob-bg);
//   border-radius:14px;
//   box-shadow:0 8px 40px rgba(10,15,28,.35);
//   z-index:200;overflow:hidden;
//   animation:aaIn .22s ease;
//   white-space:nowrap;
// }
// .aa-bulk-left{display:flex;align-items:center;gap:10px;padding:14px 18px;}
// .aa-bulk-count{font-size:13px;font-weight:700;color:#fff;}
// .aa-bulk-clear{background:none;border:1px solid rgba(255,255,255,.18);border-radius:6px;color:rgba(255,255,255,.55);font-family:inherit;font-size:11px;padding:3px 10px;cursor:pointer;transition:all .13s;}
// .aa-bulk-clear:hover{background:rgba(255,255,255,.1);color:#fff;}
// .aa-bulk-div{width:1px;background:rgba(255,255,255,.1);align-self:stretch;}
// .aa-bulk-fields{display:flex;align-items:flex-end;gap:12px;padding:12px 18px;}
// .aa-bulk-f{display:flex;flex-direction:column;gap:4px;}
// .aa-bulk-lbl{font-size:9px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.07em;}
// .aa-bulk-sel{padding:7px 10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:6px;font-family:inherit;font-size:12px;color:#fff;outline:none;cursor:pointer;}
// .aa-bulk-inp{padding:7px 10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:6px;font-family:inherit;font-size:12px;color:#fff;outline:none;min-width:140px;color-scheme:dark;}
// .aa-bulk-ta-wrap{position:relative;}
// .aa-bulk-sug-box{position:absolute;bottom:calc(100%+5px);left:0;min-width:200px;background:#2d3548;border:1px solid rgba(255,255,255,.1);border-radius:var(--aa-r);z-index:999;box-shadow:var(--aa-shm);max-height:150px;overflow-y:auto;}
// .aa-sug-dark.aa-sug-item:hover{background:rgba(255,255,255,.1);}
// .aa-sug-dark .aa-sug-name{color:#fff;}
// .aa-sug-dark .aa-sug-av{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border-color:rgba(255,255,255,.15);}
// .aa-bulk-go{padding:0 24px;background:var(--aa-accent);color:#fff;border:none;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:all .14s;align-self:stretch;}
// .aa-bulk-go:hover{background:#0b6a8a;}
// `;
//   document.head.appendChild(s);
// }

/**
 * assign-activity.js — Department Head Activity Assignment Screen  v3
 *
 * Changes:
 *  - "Action/Act" renamed to "Activity" everywhere
 *  - Hierarchy: Clause → Obligation → Activity (no Clause ID in header)
 *  - Dept column in right drawer
 *  - View more details → circular reference table
 *  - Bulk assign: Assignee field added
 *  - UI mirrors assign-obligation.js
 */

const AA_DEPTS = ['Compliance','Risk','Legal','IT','Operations','HR','Finance'];
const AA_PEOPLE = {
  Compliance: ['Sneha Das','Meera Pillai','Arjun Kumar','Ravi Menon'],
  Risk:       ['Anand Krishnan','Neha Rao','Vikram Singh','Pooja Shah'],
  Legal:      ['Priya Nair','Suresh Iyer','Kavitha Reddy'],
  IT:         ['Raj Iyer','Sanjay Mehta','Divya Nair','Arun Thomas'],
  Operations: ['Suresh Kumar','Lakshmi Rao','Rohit Gupta'],
  HR:         ['Priya Sharma','Aditya Patel','Reshma Nair'],
  Finance:    ['Rahul Verma','Shalini Menon','Kiran Bhat'],
};

/* ── DATA ── */
function _aaGetActivities(circId) {
  const base = [
    {
      clauseId:'C1.1', clauseText:'The entity shall establish and maintain a Board-approved compliance policy framework.',
      obligations:[
        {
          obId:'OB-001', obText:'Establish and maintain a Board-approved compliance policy, reviewed annually.',
          dept:'Compliance',
          activities:[
            { id:'AV-001', name:'Draft compliance policy document',        assignee:'Sneha Das',    status:'Assigned', dueDate:'2025-04-15' },
            { id:'AV-002', name:'Present policy to Board for approval',    assignee:null,           status:'Unassigned', dueDate:'2025-04-30' },
            { id:'AV-003', name:'Distribute approved policy to all depts', assignee:'Meera Pillai', status:'Assigned', dueDate:'2025-05-10' },
            { id:'AV-004', name:'Schedule annual review cycle',            assignee:null,           status:'Unassigned', dueDate:'2025-05-15' },
          ]
        },
      ]
    },
    {
      clauseId:'C1.2', clauseText:'A designated Compliance Officer shall be appointed with Board-level reporting.',
      obligations:[
        {
          obId:'OB-003', obText:'Appoint a designated Compliance Officer with direct Board Audit Committee reporting.',
          dept:'Compliance',
          activities:[
            { id:'AV-005', name:'Identify and shortlist CO candidates',  assignee:'Arjun Kumar', status:'Assigned', dueDate:'2025-03-31' },
            { id:'AV-006', name:'Issue formal appointment letter',        assignee:'Arjun Kumar', status:'Assigned', dueDate:'2025-04-05' },
            { id:'AV-007', name:'Notify regulator of CO appointment',    assignee:null,          status:'Unassigned', dueDate:'2025-04-20' },
          ]
        },
      ]
    },
    {
      clauseId:'C2.1', clauseText:'All customer-facing processes must reflect updated regulatory requirements within 30 days.',
      obligations:[
        {
          obId:'OB-006', obText:'Update all customer-facing processes within 30 days of the effective date.',
          dept:'Operations',
          activities:[
            { id:'AV-013', name:'Map all affected customer-facing processes', assignee:'Suresh Kumar', status:'Assigned',   dueDate:'2025-04-08' },
            { id:'AV-014', name:'Update SOPs and process documentation',      assignee:null,           status:'Unassigned', dueDate:'2025-04-20' },
            { id:'AV-015', name:'Train frontline staff on updated processes',  assignee:'Lakshmi Rao',  status:'Assigned',   dueDate:'2025-05-01' },
          ]
        },
      ]
    },
    {
      clauseId:'C2.2', clauseText:'Transaction monitoring systems shall detect and report suspicious activity in real-time.',
      obligations:[
        {
          obId:'OB-008', obText:'Upgrade transaction monitoring to real-time detection with max 5s latency.',
          dept:'IT',
          activities:[
            { id:'AV-008', name:'Assess current TMS gaps vs requirements', assignee:'Raj Iyer',     status:'Assigned',   dueDate:'2025-04-10' },
            { id:'AV-009', name:'Evaluate and select TMS vendor',          assignee:null,           status:'Unassigned', dueDate:'2025-04-25' },
            { id:'AV-010', name:'Configure real-time alert rules',         assignee:'Sanjay Mehta', status:'Assigned',   dueDate:'2025-05-15' },
            { id:'AV-011', name:'UAT testing and performance benchmark',   assignee:null,           status:'Unassigned', dueDate:'2025-05-30' },
            { id:'AV-012', name:'Go-live and post-deployment monitoring',  assignee:null,           status:'Unassigned', dueDate:'2025-06-15' },
          ]
        },
      ]
    },
    {
      clauseId:'C3.2', clauseText:'Annual third-party audit of compliance infrastructure, findings to Board within 30 days.',
      obligations:[
        {
          obId:'OB-012', obText:'Annual third-party audit of compliance infrastructure, findings to Board in 30 days.',
          dept:'Risk',
          activities:[
            { id:'AV-016', name:'Identify and shortlist audit firms',  assignee:'Anand Krishnan', status:'Assigned',   dueDate:'2025-05-01' },
            { id:'AV-017', name:'Define audit scope and deliverables', assignee:'Neha Rao',       status:'Assigned',   dueDate:'2025-05-10' },
            { id:'AV-018', name:'Conduct audit and review findings',   assignee:null,             status:'Unassigned', dueDate:'2025-06-30' },
            { id:'AV-019', name:'Present audit report to Board',       assignee:null,             status:'Unassigned', dueDate:'2025-07-30' },
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

/* ── CIRCULAR REF META ── */
function _aaCircMeta(circId) {
  return {
    circularRef: circId, regulator:'RBI', issueDate:'01 Apr 2024', effectiveDate:'01 Jul 2024',
    dueDate:'31 Mar 2025', legalArea:'Banking Regulation', subLegalArea:'Prudential Norms',
    act:'Banking Regulation Act 1949', section:'Section 12', subsection:'Clause (a)',
    frequency:'Monthly', regulatoryBody:'Reserve Bank of India',
    category:'Mandatory Compliance', type:'Master Direction',
    docUrl:'#', docName:'RBI_Master_Direction_2024.pdf',
  };
}

function _aaSafeId(id){ return (id||'').replace(/\./g,'-').replace(/[^a-zA-Z0-9_-]/g,''); }

/* ── MAIN RENDER ── */
window.renderAssignActivity = function(circId, deptFilter) {
  const area = document.getElementById('content-area');
  if (!area) return;
  _aaInjectStyles();
  const circs = (typeof CMS_DATA !== 'undefined' && CMS_DATA.circulars) ? CMS_DATA.circulars : [
    { id:'CIRC-001', title:'Cybersecurity Framework for Regulated Entities',      regulator:'RBI'   },
    { id:'CIRC-002', title:'Enhanced KYC & AML Compliance Directive',             regulator:'SEBI'  },
    { id:'CIRC-003', title:'Operational Risk Management Guidelines',              regulator:'RBI'   },
    { id:'CIRC-005', title:'Third-Party & Vendor Risk Management Framework',      regulator:'IRDAI' },
  ];
  const activeId   = circId || circs[0]?.id || 'CIRC-001';
  const activeCirc = circs.find(c => c.id === activeId) || circs[0];
  area.innerHTML = _aaBuildPage(circs, activeCirc, deptFilter || '');
  _aaBindAll(activeCirc.id, deptFilter || '');
};

/* ── PAGE SHELL ── */
function _aaBuildPage(circs, activeCirc, deptFilter) {
  const allActs  = _aaAllActs(activeCirc.id);
  const total    = allActs.length;
  const assigned = allActs.filter(a => a.status === 'Assigned').length;
  const unassigned = total - assigned;

  return `<div class="aa-page" id="aa-page">
  <div class="aa-overlay" id="aa-overlay" style="display:none;" onclick="_aaOverlayClick(event)">
    <div class="aa-drawer" id="aa-drawer"><div id="aa-drawer-content"></div></div>
  </div>
  <div class="aa-wrap">
    <div class="aa-page-head">
      <div class="aa-head-left">
        <div class="aa-head-eyebrow">Department Assignment Console</div>
        <div class="aa-head-title">Activity Assignment</div>
        <div class="aa-head-sub">Clause → Obligation → Activity</div>
      </div>
      <div class="aa-head-right">
        <button class="aa-btn aa-btn-ghost" onclick="window.history.back()">← Back</button>
        <button class="aa-btn aa-btn-pri" onclick="_aaSaveAll('${activeCirc.id}')">💾 Save All</button>
      </div>
    </div>

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
      <div class="aa-fc-field">
        <span class="aa-fc-label">Department</span>
        <select class="aa-flt-sel" id="aa-filter-dept" onchange="_aaApplyFilters('${activeCirc.id}')">
          <option value="">All Departments</option>
          ${AA_DEPTS.map(d=>`<option ${d===deptFilter?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>
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
        <input class="aa-search-inp" id="aa-search" placeholder="Search activities, obligations…"
               oninput="_aaApplyFilters('${activeCirc.id}')"/>
      </div>
      <div class="aa-stats-row">
        <div class="aa-stat-pill" id="aa-sp-total">${total} total</div>
        <div class="aa-stat-pill aa-sp-amber" id="aa-sp-unassigned">${unassigned} unassigned</div>
        <div class="aa-stat-pill aa-sp-green" id="aa-sp-assigned">${assigned} assigned</div>
      </div>
    </div>

    <div class="aa-toolbar">
      <div class="aa-tl-left">
        <label class="aa-check-wrap">
          <input type="checkbox" id="aa-sel-all" onchange="_aaToggleAll(this.checked)"/>
          <span class="aa-checkmark"></span>
        </label>
        <span class="aa-tl-hint">Select to bulk assign</span>
        <span class="aa-sel-badge" id="aa-sel-badge" style="display:none;"></span>
      </div>
      <div class="aa-tl-right">
        <span class="aa-tl-hint">Click any row to assign · Select multiple for bulk assign</span>
      </div>
    </div>

    <div class="aa-clauses-list" id="aa-clauses-list">
      ${_aaGetActivities(activeCirc.id).map((cl,ci) => _aaRenderClauseCard(cl, ci, activeCirc.id)).join('')}
    </div>
  </div>

  <!-- BULK BAR -->
  <div class="aa-bulk-bar" id="aa-bulk-bar" style="display:none;">
    <div class="aa-bulk-left">
      <span class="aa-bulk-count" id="aa-bulk-count">0 selected</span>
      <button class="aa-bulk-clear" onclick="_aaClearSel()">✕</button>
    </div>
    <div class="aa-bulk-div"></div>
    <div class="aa-bulk-fields">
      <div class="aa-bulk-f">
        <span class="aa-bulk-lbl">Department</span>
        <select class="aa-bulk-sel" id="aa-bulk-dept">
          <option value="">Select dept…</option>
          ${AA_DEPTS.map(d=>`<option value="${d}">${d}</option>`).join('')}
        </select>
      </div>
      <div class="aa-bulk-f">
        <span class="aa-bulk-lbl">Assign to</span>
        <div class="aa-bulk-ta-wrap">
          <input class="aa-bulk-inp" id="aa-bulk-assignee" placeholder="Type name…"
                 oninput="_aaBulkTypeahead(this.value)" autocomplete="off"/>
          <div class="aa-bulk-sug-box" id="aa-bulk-sug" style="display:none;"></div>
        </div>
      </div>
      <div class="aa-bulk-f">
        <span class="aa-bulk-lbl">Due Date</span>
        <input type="date" class="aa-bulk-inp" id="aa-bulk-due"/>
      </div>
    </div>
    <button class="aa-bulk-go" onclick="_aaBulkAssign('${activeCirc.id}')">✓ Assign Selected</button>
  </div>
</div>`;
}

/* ── CLAUSE CARD (accordion) ── */
function _aaRenderClauseCard(cl, ci, circId) {
  const allActs = cl.obligations.flatMap(ob => ob.activities);
  const assignedCnt = allActs.filter(a => a.status === 'Assigned').length;
  const safeClId = _aaSafeId(cl.clauseId);

  const obligationsHtml = cl.obligations.map((ob,oi) => _aaRenderObGroup(ob, cl, oi, safeClId, circId)).join('');

  return `
<div class="aa-cl-card" id="aa-cl-card-${safeClId}">
  <div class="aa-cl-header" onclick="_aaToggleClause('${safeClId}')">
    <div class="aa-cl-inner">
      <span class="aa-cl-arr" id="aa-cl-arr-${safeClId}">▶</span>
      <span class="aa-cl-id-badge">${cl.clauseId}</span>
      <span class="aa-cl-text">${cl.clauseText}</span>
      <div class="aa-cl-right">
        <span class="aa-cl-meta">${cl.obligations.length} obligation${cl.obligations.length!==1?'s':''} · ${allActs.length} activities</span>
        <span class="aa-cl-prog-pill">${assignedCnt}/${allActs.length} assigned</span>
      </div>
    </div>
  </div>
  <div class="aa-cl-body" id="aa-cl-body-${safeClId}" style="display:none;">
    ${cl.obligations.map((ob,oi) => _aaRenderObGroup(ob, cl, oi, safeClId, circId)).join('')}
  </div>
</div>`;
}

/* ── OBLIGATION GROUP (accordion inside clause) ── */
function _aaRenderObGroup(ob, cl, oi, safeClId, circId) {
  const assignedCnt = ob.activities.filter(a => a.status === 'Assigned').length;
  const safeObId = _aaSafeId(ob.obId);

  return `
<div class="aa-ob-card" id="aa-ob-card-${safeObId}">
  <div class="aa-ob-header" onclick="_aaToggleOb('${safeObId}')">
    <div class="aa-ob-inner">
      <span class="aa-ob-arr" id="aa-ob-arr-${safeObId}">▶</span>
      <div class="aa-ob-titles">
        <div class="aa-ob-title-row">
          <span class="aa-ob-id-badge">${ob.obId}</span>
          <span class="aa-ob-text-inline">${ob.obText}</span>
          <span class="aa-ob-act-total">${ob.activities.length} activit${ob.activities.length!==1?'ies':'y'}</span>
          <span class="aa-ob-prog-pill">${assignedCnt}/${ob.activities.length} assigned</span>
        </div>
      </div>
      <label class="aa-check-wrap aa-ob-bulk-chk" title="Select all in obligation" onclick="event.stopPropagation()">
        <input type="checkbox" class="aa-ob-chk" data-obid="${safeObId}" onchange="_aaObCheckAll(this,'${safeObId}')"/>
        <span class="aa-checkmark"></span>
      </label>
    </div>
  </div>
  <div class="aa-ob-body" id="aa-ob-body-${safeObId}" style="display:none;">
    <table class="aa-table">
      <thead>
        <tr class="aa-inner-thead">
          <th class="aa-th-chk"></th>
          <th>Activity ID</th>
          <th>Activity</th>
          <th>Department</th>
          <th>Assignee</th>
          <th>Due Date</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${ob.activities.map(act => _aaRenderActRow(act, ob, cl, circId)).join('')}
      </tbody>
    </table>
  </div>
</div>`;
}

/* ── ACTIVITY ROW ── */
function _aaRenderActRow(act, ob, cl, circId) {
  const stCls = act.status === 'Assigned' ? 'aa-s-asgn' : 'aa-s-none';
  const safeObId = _aaSafeId(ob.obId);

  return `
<tr class="aa-act-row ${act.status==='Unassigned'?'aa-act-unassigned':''}"
    id="aa-row-${act.id}"
    data-actid="${act.id}" data-circid="${circId}" data-obid="${safeObId}"
    data-dept="${ob.dept||''}" data-status="${act.status}"
    data-duedate="${act.dueDate||''}"
    data-search="${act.name.toLowerCase()} ${ob.obText.toLowerCase()} ${ob.dept.toLowerCase()}">
  <td class="aa-td-chk" onclick="event.stopPropagation()">
    <label class="aa-check-wrap">
      <input type="checkbox" class="aa-row-chk" data-id="${act.id}" data-obid="${safeObId}" onchange="_aaRowCheck(this)"/>
      <span class="aa-checkmark"></span>
    </label>
  </td>
  <td onclick="_aaOpenDrawer('${act.id}','${ob.obId}','${cl.clauseId}','${circId}')">
    <span class="aa-act-id-badge">${act.id}</span>
  </td>
  <td onclick="_aaOpenDrawer('${act.id}','${ob.obId}','${cl.clauseId}','${circId}')" class="aa-td-name">
    <span class="aa-act-name">${act.name}</span>
  </td>
  <td><span class="aa-dept-chip aa-dept-${(ob.dept||'').toLowerCase()}">${ob.dept||'—'}</span></td>
  <td onclick="event.stopPropagation()" class="aa-td-assignee">
    <div class="aa-ita-wrap" id="aa-ita-wrap-${act.id}">
      ${act.assignee
        ? `<div class="aa-assignee-filled" onclick="_aaOpenDrawer('${act.id}','${ob.obId}','${cl.clauseId}','${circId}')">
             <span class="aa-av">${act.assignee.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span>
             <span class="aa-assignee-name">${act.assignee}</span>
           </div>`
        : `<div class="aa-assignee-empty">
             <input class="aa-inline-assignee" placeholder="Assign…" autocomplete="off"
                    oninput="_aaInlineTypeahead('${act.id}','${ob.dept}',this.value,'${circId}','${ob.obId}','${cl.clauseId}')"
                    onfocus="_aaInlineTypeahead('${act.id}','${ob.dept}',this.value,'${circId}','${ob.obId}','${cl.clauseId}')"/>
             <div class="aa-sug-box" id="aa-ita-sug-${act.id}" style="display:none;"></div>
           </div>`}
    </div>
  </td>
  <td onclick="event.stopPropagation()">
    <input type="date" class="aa-inline-date ${act.dueDate?'filled':''}"
           value="${act.dueDate||''}"
           onchange="_aaInlineDueChange('${act.id}','${ob.obId}','${circId}',this)"/>
  </td>
  <td><span class="aa-st-badge ${stCls}">${act.status}</span></td>
  <td><button class="aa-open-btn" onclick="_aaOpenDrawer('${act.id}','${ob.obId}','${cl.clauseId}','${circId}')" title="Open detail">›</button></td>
</tr>`;
}

/* ── ACCORDION TOGGLES ── */
window._aaToggleClause = function(safeClId) {
  const body = document.getElementById(`aa-cl-body-${safeClId}`);
  const arr  = document.getElementById(`aa-cl-arr-${safeClId}`);
  const card = document.getElementById(`aa-cl-card-${safeClId}`);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arr) arr.textContent = open ? '▶' : '▼';
  if (card) card.classList.toggle('aa-cl-card-open', !open);
};

window._aaToggleOb = function(safeObId) {
  const body = document.getElementById(`aa-ob-body-${safeObId}`);
  const arr  = document.getElementById(`aa-ob-arr-${safeObId}`);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arr) arr.textContent = open ? '▶' : '▼';
};

/* ── DRAWER ── */
window._aaOverlayClick = function(e) { if(e.target.id==='aa-overlay')_aaCloseDrawerDirect(); };

window._aaOpenDrawer = function(actId, obId, clauseId, circId) {
  const clauses = _aaGetActivities(circId);
  let act=null, ob=null, cl=null;
  for (const c of clauses) {
    for (const o of c.obligations) {
      const f = o.activities.find(a=>a.id===actId);
      if (f) { act=f; ob=o; cl=c; break; }
    }
    if (act) break;
  }
  if (!act||!ob||!cl) return;

  document.querySelectorAll('.aa-act-row').forEach(r=>r.classList.remove('aa-row-active'));
  document.getElementById(`aa-row-${actId}`)?.classList.add('aa-row-active');

  const overlay = document.getElementById('aa-overlay');
  const drawer  = document.getElementById('aa-drawer');
  const dc      = document.getElementById('aa-drawer-content');
  overlay.style.display='flex';
  requestAnimationFrame(()=>requestAnimationFrame(()=>drawer.classList.add('open')));

  const meta = _aaCircMeta(circId);

  dc.innerHTML = `
<div class="aa-dr-inner">
  <div class="aa-dr-head">
    <div class="aa-dr-head-left">
      <span class="aa-act-id-badge">${act.id}</span>
    </div>
    <button class="aa-dr-close" onclick="_aaCloseDrawerDirect()">✕</button>
  </div>

  <!-- Activity name in blue block (like obligation) -->
  <div class="aa-dr-act-block">
    <div class="aa-dr-act-label">Activity</div>
    <div class="aa-dr-act-name">${act.name}</div>
  </div>

  <div class="aa-dr-section-label">Assignment Details</div>

  <div class="aa-dr-fields">
    <!-- Dept + Person + Due Date in one row -->
    <div class="aa-dr-field-row3">
      <div class="aa-dr-field">
        <label class="aa-dr-label">Department</label>
        <select class="aa-dr-input" id="aa-dr-dept-${actId}">
          <option value="">Select dept…</option>
          ${AA_DEPTS.map(d=>`<option ${d===ob.dept?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>
      <div class="aa-dr-field">
        <label class="aa-dr-label">Assign to Person</label>
        <div class="aa-ta-wrap" id="aa-dta-wrap-${actId}">
          <input class="aa-dr-input" id="aa-dr-assignee-${actId}"
                 value="${act.assignee||''}" placeholder="Type name…" autocomplete="off"
                 oninput="_aaDrawerTypeahead('${actId}','${ob.dept}',this.value)"
                 onfocus="_aaDrawerTypeahead('${actId}','${ob.dept}',this.value)"/>
          <div class="aa-sug-box" id="aa-dta-sug-${actId}" style="display:none;"></div>
        </div>
      </div>
      <div class="aa-dr-field">
        <label class="aa-dr-label">Due Date</label>
        <input type="date" class="aa-dr-input" id="aa-dr-due-${actId}" value="${act.dueDate||''}"/>
      </div>
    </div>
    <div class="aa-dr-field">
      <label class="aa-dr-label">Notes / Instructions</label>
      <textarea class="aa-dr-input aa-dr-ta" id="aa-dr-notes-${actId}"
                placeholder="Add context or instructions for the assignee…">${act._notes||''}</textarea>
    </div>
  </div>

  <!-- Circular ref table (collapsed by default) -->
  <div class="aa-circ-ref-table" id="aa-circ-ref-${actId}" style="display:none;">
    <div class="aa-crt-head">Circular Reference Details</div>
    <div class="aa-crt-grid">
      <div class="aa-crt-row">
        <span class="aa-crt-label">Circular Ref</span>
        <span class="aa-crt-val aa-crt-link" onclick="_aaGoToAISuggestion('${circId}')" title="View AI Suggestions">${meta.circularRef} ↗</span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Type</span>
        <span class="aa-crt-val">${meta.type}</span>
      </div>
      <div class="aa-crt-row aa-crt-row-full">
        <span class="aa-crt-label">Clause</span>
        <span class="aa-crt-val"><span class="aa-crt-clause-id">${cl.clauseId}</span> &nbsp;<span class="aa-crt-text-sm">${cl.clauseText}</span></span>
      </div>
      <div class="aa-crt-row aa-crt-row-full">
        <span class="aa-crt-label">Obligation</span>
        <span class="aa-crt-val"><span class="aa-crt-ob-id">${ob.obId}</span> &nbsp;<span class="aa-crt-text-sm">${ob.obText}</span></span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Issue Date</span>
        <span class="aa-crt-val">${meta.issueDate}</span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Effective Date</span>
        <span class="aa-crt-val">${meta.effectiveDate}</span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Compliance Due</span>
        <span class="aa-crt-val aa-crt-highlight">${meta.dueDate}</span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Frequency</span>
        <span class="aa-crt-val">${meta.frequency}</span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Category</span>
        <span class="aa-crt-val">${meta.category}</span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Legislative Area</span>
        <span class="aa-crt-val">${meta.legalArea}</span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Sub-Legislative Area</span>
        <span class="aa-crt-val">${meta.subLegalArea}</span>
      </div>
      <div class="aa-crt-row">
        <span class="aa-crt-label">Reference Document</span>
        <span class="aa-crt-val">
          <a class="aa-doc-link" href="${meta.docUrl}" target="_blank" title="Open PDF">
            <span class="aa-doc-icon">📄</span>
            <span class="aa-doc-name">${meta.docName}</span>
            <span class="aa-doc-badge">PDF</span>
          </a>
        </span>
      </div>
    </div>
  </div>

  <!-- Footer: View Circ Details · Cancel · Assign in one row -->
  <div class="aa-dr-foot">
    <button class="aa-dr-more-btn-inline" id="aa-dr-more-btn-${actId}" onclick="_aaToggleCircRef('${actId}')">
      📋 View Circular Details
    </button>
    <div class="aa-dr-foot-actions">
      <button class="aa-btn aa-btn-ghost aa-btn-sm" onclick="_aaCloseDrawerDirect()">Cancel</button>
      <button class="aa-btn aa-btn-pri aa-btn-sm" onclick="_aaDrawerSave('${actId}','${ob.obId}','${cl.clauseId}','${circId}')">✓ Assign</button>
    </div>
  </div>
</div>`;

  document.getElementById(`aa-dr-dept-${actId}`)?.addEventListener('change', function() {
    _aaDrawerTypeahead(actId, this.value, document.getElementById(`aa-dr-assignee-${actId}`)?.value||'');
  });
};

window._aaToggleCircRef = function(actId) {
  const panel = document.getElementById(`aa-circ-ref-${actId}`);
  const btn   = document.getElementById(`aa-dr-more-btn-${actId}`);
  if (!panel) return;
  const open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
  if (btn) btn.textContent = open ? '📋 View Circular Details' : '📋 Hide Circular Details';
  if (btn) btn.classList.toggle('aa-more-btn-active', !open);
};

window._aaCloseDrawerDirect = function() {
  const overlay=document.getElementById('aa-overlay'), drawer=document.getElementById('aa-drawer');
  if(!drawer||!overlay)return;
  drawer.classList.remove('open');
  setTimeout(()=>{overlay.style.display='none';},300);
  document.querySelectorAll('.aa-act-row').forEach(r=>r.classList.remove('aa-row-active'));
};

window._aaHandleUpload = function(actId, input) {
  const file = input.files?.[0];
  if (!file) return;
  const label = document.getElementById(`aa-upload-fname-${actId}`);
  if (label) label.textContent = file.name;
};

window._aaGoToAISuggestion = function(circId) {
  if (typeof renderAISuggestionPage === 'function') renderAISuggestionPage(circId);
  else if (typeof window.navigate === 'function') window.navigate('ai-suggestion', { circId });
  else {
    const area = document.getElementById('content-area');
    if (area) area.innerHTML = `<div style="padding:40px;font-family:system-ui;color:#1e2433;">
      <h2>AI Suggestions — ${circId}</h2>
      <button onclick="renderAssignActivity('${circId}')" style="margin-top:16px;padding:8px 18px;background:#0d7fa5;color:#fff;border:none;border-radius:8px;cursor:pointer;">← Back</button>
    </div>`;
  }
};

/* ── TYPEAHEAD ── */
window._aaDrawerTypeahead = function(actId, dept, query) {
  const sug = document.getElementById(`aa-dta-sug-${actId}`); if(!sug)return;
  _aaShowSug(sug, dept, query, name=>{
    const inp=document.getElementById(`aa-dr-assignee-${actId}`); if(inp)inp.value=name;
    sug.style.display='none';
  });
};

window._aaInlineTypeahead = function(actId, dept, query, circId, obId, clauseId) {
  const sug=document.getElementById(`aa-ita-sug-${actId}`); if(!sug)return;
  _aaShowSug(sug, dept, query, name=>{
    const clauses=_aaGetActivities(circId);
    let act=null, ob=null, cl=null;
    for(const c of clauses){ for(const o of c.obligations){ const f=o.activities.find(a=>a.id===actId); if(f){act=f;ob=o;cl=c;break;} } if(act)break; }
    if(!act)return;
    act.assignee=name; act.status='Assigned';
    sug.style.display='none';
    const safeObId=_aaSafeId(ob.obId);
    const cell=document.getElementById(`aa-ita-wrap-${actId}`);
    if(cell)cell.innerHTML=`<div class="aa-assignee-filled"><span class="aa-av">${name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span><span class="aa-assignee-name">${name}</span></div>`;
    const row=document.getElementById(`aa-row-${actId}`);
    if(row){row.dataset.status='Assigned';const st=row.querySelector('.aa-st-badge');if(st){st.textContent='Assigned';st.className='aa-st-badge aa-s-asgn';}}
    if(typeof showToast==='function')showToast(`Assigned to ${name}`,'success');
    _aaUpdateStats(circId);
  });
};

function _aaShowSug(sugBox, dept, query, onPick) {
  let pool=dept&&AA_PEOPLE[dept]?AA_PEOPLE[dept]:Object.values(AA_PEOPLE).flat();
  pool=[...new Set(pool)];
  const q=(query||'').trim().toLowerCase();
  const res=q?pool.filter(p=>p.toLowerCase().includes(q)):pool.slice(0,6);
  if(!res.length){sugBox.style.display='none';return;}
  sugBox.style.display='block';
  sugBox.innerHTML=res.map(p=>`
  <div class="aa-sug-item" onclick="(${onPick.toString()})('${p.replace(/'/g,"\\'")}')">
    <span class="aa-sug-av">${p.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span>
    <span class="aa-sug-name">${p}</span>
    ${dept&&AA_PEOPLE[dept]?.includes(p)?`<span class="aa-sug-dept-tag">${dept}</span>`:''}
  </div>`).join('');
  setTimeout(()=>{
    document.addEventListener('click',function h(e){if(!sugBox.contains(e.target)){sugBox.style.display='none';document.removeEventListener('click',h);}});
  },0);
}

window._aaBulkTypeahead = function(query) {
  const sug=document.getElementById('aa-bulk-sug'); if(!sug)return;
  let pool=[...new Set(Object.values(AA_PEOPLE).flat())];
  const q=query.trim().toLowerCase();
  const res=q?pool.filter(p=>p.toLowerCase().includes(q)):pool.slice(0,6);
  if(!res.length){sug.style.display='none';return;}
  sug.style.display='block';
  sug.innerHTML=res.map(p=>`
  <div class="aa-sug-item aa-sug-dark" onclick="_aaPickBulkPerson('${p.replace(/'/g,"\\'")}')">
    <span class="aa-sug-av">${p.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</span>
    <span class="aa-sug-name">${p}</span>
  </div>`).join('');
};
window._aaPickBulkPerson = function(name) {
  const inp=document.getElementById('aa-bulk-assignee'); if(inp)inp.value=name;
  const sug=document.getElementById('aa-bulk-sug'); if(sug)sug.style.display='none';
};

/* ── SAVE ── */
window._aaDrawerSave = function(actId, obId, clauseId, circId) {
  const clauses=_aaGetActivities(circId);
  let act=null, ob=null, cl=null;
  for(const c of clauses){ for(const o of c.obligations){ const f=o.activities.find(a=>a.id===actId); if(f){act=f;ob=o;cl=c;break;} } if(act)break; }
  if(!act)return;
  act.assignee = document.getElementById(`aa-dr-assignee-${actId}`)?.value || act.assignee;
  act.dueDate  = document.getElementById(`aa-dr-due-${actId}`)?.value      || act.dueDate;
  act._notes   = document.getElementById(`aa-dr-notes-${actId}`)?.value    || '';
  if(act.assignee) act.status='Assigned';
  const safeObId=_aaSafeId(ob.obId);
  const row=document.getElementById(`aa-row-${actId}`);
  if(row) row.outerHTML=_aaRenderActRow(act, ob, cl, circId);
  _aaUpdateStats(circId); _aaCloseDrawerDirect();
  if(typeof showToast==='function')showToast(`${actId} assigned to ${act.assignee||'—'} ✓`,'success');
};

window._aaInlineDueChange = function(actId, obId, circId, inp) {
  const clauses=_aaGetActivities(circId);
  for(const c of clauses){ for(const o of c.obligations){ const f=o.activities.find(a=>a.id===actId); if(f){f.dueDate=inp.value;inp.classList.toggle('filled',!!inp.value);return;} } }
};

/* ── CHECKBOX + BULK ── */
window._aaRowCheck = function() {
  const sel=document.querySelectorAll('.aa-row-chk:checked');
  const all=document.querySelectorAll('.aa-row-chk');
  const selA=document.getElementById('aa-sel-all');
  const badge=document.getElementById('aa-sel-badge');
  const bar=document.getElementById('aa-bulk-bar');
  const cnt=document.getElementById('aa-bulk-count');
  if(selA)selA.indeterminate=sel.length>0&&sel.length<all.length;
  if(badge){badge.textContent=`${sel.length} selected`;badge.style.display=sel.length?'inline-flex':'none';}
  if(bar)bar.style.display=sel.length?'flex':'none';
  if(cnt)cnt.textContent=`${sel.length} activit${sel.length!==1?'ies':'y'} selected`;
  // Sync ob-level checkboxes
  document.querySelectorAll('.aa-ob-chk').forEach(cc=>{
    const obId=cc.dataset.obid;
    const obChks=[...document.querySelectorAll(`.aa-row-chk[data-obid="${obId}"]`)];
    const checkedCount=obChks.filter(c=>c.checked).length;
    cc.checked=checkedCount===obChks.length&&obChks.length>0;
    cc.indeterminate=checkedCount>0&&checkedCount<obChks.length;
  });
};
window._aaObCheckAll = function(masterChk, obId) {
  document.querySelectorAll(`.aa-row-chk[data-obid="${obId}"]`).forEach(c=>c.checked=masterChk.checked);
  _aaRowCheck();
};
window._aaToggleAll = function(checked) {
  document.querySelectorAll('.aa-row-chk').forEach(c=>c.checked=checked);
  document.querySelectorAll('.aa-ob-chk').forEach(c=>{c.checked=checked;c.indeterminate=false;});
  _aaRowCheck();
};
window._aaClearSel = function() {
  document.querySelectorAll('.aa-row-chk,.aa-ob-chk').forEach(c=>{c.checked=false;c.indeterminate=false;});
  const sa=document.getElementById('aa-sel-all'); if(sa){sa.checked=false;sa.indeterminate=false;}
  _aaRowCheck();
};
window._aaBulkAssign = function(circId) {
  const sel=([...document.querySelectorAll('.aa-row-chk:checked')]).map(c=>c.dataset.id);
  const assignee=document.getElementById('aa-bulk-assignee')?.value?.trim();
  const dueDate=document.getElementById('aa-bulk-due')?.value;
  if(!sel.length){if(typeof showToast==='function')showToast('No activities selected','warning');return;}
  if(!assignee){if(typeof showToast==='function')showToast('Please enter an assignee','warning');return;}
  const clauses=_aaGetActivities(circId);
  sel.forEach(actId=>{
    let act=null,ob=null,cl=null;
    for(const c of clauses){ for(const o of c.obligations){ const f=o.activities.find(a=>a.id===actId); if(f){act=f;ob=o;cl=c;break;} } if(act)break; }
    if(!act)return;
    act.assignee=assignee; act.status='Assigned';
    if(dueDate)act.dueDate=dueDate;
    const row=document.getElementById(`aa-row-${actId}`);
    if(row)row.outerHTML=_aaRenderActRow(act,ob,cl,circId);
  });
  _aaUpdateStats(circId); _aaClearSel();
  if(typeof showToast==='function')showToast(`${sel.length} activit${sel.length!==1?'ies':'y'} assigned to ${assignee} ✓`,'success');
};

/* ── FILTERS ── */
window._aaApplyFilters = function(circId) {
  const fD=(document.getElementById('aa-filter-dept')?.value||'');
  const fS=(document.getElementById('aa-filter-status')?.value||'');
  const fFrom=(document.getElementById('aa-filter-from')?.value||'');
  const fTo=(document.getElementById('aa-filter-to')?.value||'');
  const fQ=(document.getElementById('aa-search')?.value||'').toLowerCase();
  document.querySelectorAll('.aa-act-row').forEach(row=>{
    const due=row.dataset.duedate||'';
    const dateOk=(!fFrom||due>=fFrom)&&(!fTo||due<=fTo);
    const ok=(!fD||row.dataset.dept===fD)&&(!fS||row.dataset.status===fS)&&dateOk&&(!fQ||row.dataset.search?.includes(fQ));
    row.style.display=ok?'':'none';
  });
};

function _aaUpdateStats(circId) {
  const all=circId?_aaAllActs(circId):[];
  const assigned=all.filter(a=>a.status==='Assigned').length;
  const unassigned=all.length-assigned;
  const t=document.getElementById('aa-sp-total');
  const u=document.getElementById('aa-sp-unassigned');
  const g=document.getElementById('aa-sp-assigned');
  if(t)t.textContent=`${all.length} total`;
  if(u)u.textContent=`${unassigned} unassigned`;
  if(g)g.textContent=`${assigned} assigned`;
}

window._aaSwitchCirc = function(circId) { document.getElementById('aa-csel-drop').style.display='none'; renderAssignActivity(circId); };
window._aaSaveAll    = function()       { if(typeof showToast==='function')showToast('All assignments saved ✓','success'); };

/* ── BIND ── */
function _aaBindAll(circId, deptFilter) {
  const btn=document.getElementById('aa-csel-btn'), drop=document.getElementById('aa-csel-drop'), srch=document.getElementById('aa-csel-search');
  if(btn)btn.addEventListener('click',e=>{e.stopPropagation();drop.style.display=drop.style.display==='none'?'block':'none';if(drop.style.display!=='none'&&srch)srch.focus();});
  if(srch)srch.addEventListener('input',function(){const q=this.value.toLowerCase();document.querySelectorAll('.aa-csel-item').forEach(i=>i.style.display=i.textContent.toLowerCase().includes(q)?'':'none');});
  document.addEventListener('click',e=>{const wrap=document.getElementById('aa-csel-wrap');if(wrap&&!wrap.contains(e.target)&&drop)drop.style.display='none';});
  if(deptFilter){const sel=document.getElementById('aa-filter-dept');if(sel){sel.value=deptFilter;_aaApplyFilters(circId);}}
}

/* ── STYLES ── */
function _aaInjectStyles() {
  if (document.getElementById('aa-styles')) return;
  const s = document.createElement('style');
  s.id = 'aa-styles';
  s.textContent = `
@keyframes aaIn     { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
@keyframes aaFadeIn { from{opacity:0} to{opacity:1} }
:root {
  --aa-bg:#f0f3f7; --aa-card:#fff; --aa-border:#dde2ea; --aa-border-lt:#edf0f5;
  --aa-cl-bg:#1a2235; --aa-ob-bg:#2c3e5e;
  --aa-text:#1e2433; --aa-text-sec:#5a6478; --aa-text-mut:#9aa3b5;
  --aa-accent:#0d7fa5; --aa-accent-lt:#e6f4f9; --aa-accent-md:#b2ddef;
  --aa-purple:#5b5fcf; --aa-purple-lt:#ededfc;
  --aa-green:#0e9f6e; --aa-green-lt:#e8faf4;
  --aa-amber:#b45309; --aa-amber-lt:#fef3c7;
  --aa-red:#c92a2a; --aa-red-lt:#fdecea;
  --aa-r:8px; --aa-rl:12px;
  --aa-sh:0 1px 4px rgba(30,36,51,.07); --aa-shm:0 4px 16px rgba(30,36,51,.12); --aa-shl:0 8px 32px rgba(30,36,51,.18);
}
*{box-sizing:border-box;}
.aa-page{font-family:'DM Sans',system-ui,sans-serif;color:var(--aa-text);background:var(--aa-bg);min-height:100vh;position:relative;}
.aa-wrap{max-width:1200px;margin:0 auto;padding:28px 24px 100px;}
.aa-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:var(--aa-r);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;}
.aa-btn-pri{background:var(--aa-text);color:#fff;}.aa-btn-pri:hover{background:#2d3548;}
.aa-btn-ghost{background:var(--aa-card);color:var(--aa-text-sec);border:1.5px solid var(--aa-border);}.aa-btn-ghost:hover{background:var(--aa-bg);}
.aa-btn-sm{padding:7px 14px;font-size:12px;}
.aa-page-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap;}
.aa-head-eyebrow{font-size:10px;font-weight:700;color:var(--aa-accent);text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;}
.aa-head-title{font-size:24px;font-weight:800;margin-bottom:4px;}
.aa-head-sub{font-size:12px;color:var(--aa-text-mut);}
.aa-head-right{display:flex;gap:8px;}

/* Filter card */
.aa-filter-card{display:flex;align-items:flex-end;gap:12px;padding:16px 20px;background:var(--aa-card);border:1px solid var(--aa-border);border-radius:var(--aa-rl);margin-bottom:12px;box-shadow:var(--aa-sh);flex-wrap:wrap;}
.aa-fc-field{display:flex;flex-direction:column;gap:4px;}
.aa-fc-label{font-size:9px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.08em;}
.aa-flt-sel{padding:7px 10px;background:#f5f7fa;border:1px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:12px;color:var(--aa-text-sec);outline:none;cursor:pointer;min-width:130px;}
.aa-flt-sel:focus{border-color:var(--aa-accent);}
.aa-flt-date{padding:7px 10px;background:#f5f7fa;border:1px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:12px;color:var(--aa-text-sec);outline:none;min-width:130px;}
.aa-flt-date:focus{border-color:var(--aa-accent);}
.aa-fc-search{flex:1;min-width:180px;}
.aa-search-inp{width:100%;padding:7px 11px;background:#f5f7fa;border:1px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:12px;outline:none;box-sizing:border-box;}
.aa-search-inp:focus{border-color:var(--aa-accent);background:#fff;}
.aa-custom-sel-wrap{position:relative;}
.aa-custom-sel-btn{display:flex;align-items:center;gap:8px;padding:7px 11px;background:#f5f7fa;border:1.5px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;cursor:pointer;min-width:230px;transition:all .14s;}
.aa-custom-sel-btn:hover{border-color:var(--aa-accent);}
.aa-csel-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--aa-accent);flex-shrink:0;}
.aa-csel-title{font-size:11px;color:var(--aa-text-sec);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
.aa-csel-arr{color:var(--aa-text-mut);}
.aa-csel-drop{position:absolute;top:calc(100%+4px);left:0;min-width:290px;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-rl);z-index:300;box-shadow:var(--aa-shl);overflow:hidden;}
.aa-csel-search{width:100%;padding:9px 12px;background:#f5f7fa;border:none;border-bottom:1px solid var(--aa-border);font-family:inherit;font-size:12px;outline:none;box-sizing:border-box;}
.aa-csel-list{max-height:200px;overflow-y:auto;}
.aa-csel-item{display:flex;align-items:center;gap:8px;padding:9px 14px;cursor:pointer;border-bottom:1px solid var(--aa-border-lt);transition:background .1s;}
.aa-csel-item:hover,.aa-csel-item.active{background:var(--aa-accent-lt);}
.aa-csel-item-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;flex-shrink:0;}
.aa-csel-item-title{font-size:11px;color:var(--aa-text-sec);}
.aa-stats-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-left:auto;}
.aa-stat-pill{font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;background:#e8ebf1;color:var(--aa-text-sec);border:1px solid var(--aa-border);}
.aa-sp-amber{background:var(--aa-amber-lt);color:var(--aa-amber);border-color:#fcd34d;}
.aa-sp-green{background:var(--aa-green-lt);color:var(--aa-green);border-color:#6ee7b7;}

/* Toolbar */
.aa-toolbar{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;background:var(--aa-card);border:1px solid var(--aa-border);border-radius:var(--aa-r);margin-bottom:16px;box-shadow:var(--aa-sh);}
.aa-tl-left{display:flex;align-items:center;gap:10px;}
.aa-tl-right{font-size:11px;color:var(--aa-text-mut);}
.aa-tl-hint{font-size:11px;color:var(--aa-text-mut);}
.aa-sel-badge{font-size:11px;font-weight:700;color:var(--aa-accent);background:var(--aa-accent-lt);border:1px solid var(--aa-accent-md);padding:3px 10px;border-radius:20px;}

/* Checkbox */
.aa-check-wrap{display:inline-flex;align-items:center;cursor:pointer;position:relative;}
.aa-check-wrap input{position:absolute;opacity:0;width:0;height:0;}
.aa-checkmark{width:15px;height:15px;border:2px solid var(--aa-border);border-radius:4px;background:var(--aa-card);transition:all .13s;flex-shrink:0;}
.aa-check-wrap input:checked~.aa-checkmark{background:var(--aa-accent);border-color:var(--aa-accent);}
.aa-check-wrap input:checked~.aa-checkmark::after{content:'';display:block;width:3px;height:6px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg);margin:1px 0 0 3px;}
.aa-check-wrap input:indeterminate~.aa-checkmark{background:var(--aa-accent);border-color:var(--aa-accent);}
.aa-check-wrap input:indeterminate~.aa-checkmark::after{content:'';display:block;width:7px;height:2px;background:#fff;margin:4px 0 0 2px;}

/* ── CLAUSE CARDS ── */
.aa-clauses-list{display:flex;flex-direction:column;gap:16px;}
.aa-cl-card{background:var(--aa-card);border:1px solid var(--aa-border);border-radius:var(--aa-rl);overflow:hidden;box-shadow:var(--aa-sh);transition:box-shadow .2s;}
.aa-cl-card.aa-cl-card-open{box-shadow:var(--aa-shm);}
.aa-cl-header{background:var(--aa-cl-bg);cursor:pointer;padding:14px 20px;transition:background .15s;}
.aa-cl-header:hover{background:#202840;}
.aa-cl-inner{display:flex;align-items:center;gap:12px;}
.aa-cl-arr{font-size:9px;color:rgba(255,255,255,.35);flex-shrink:0;width:12px;transition:color .15s;}
.aa-cl-header:hover .aa-cl-arr{color:rgba(255,255,255,.75);}
.aa-cl-id-badge{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:#7ec8e3;background:rgba(126,200,227,.15);border:1px solid rgba(126,200,227,.25);padding:2px 8px;border-radius:4px;flex-shrink:0;}
.aa-cl-text{font-size:12.5px;font-weight:600;color:rgba(220,230,245,.85);flex:1;line-height:1.4;}
.aa-cl-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.aa-cl-meta{font-size:11px;color:rgba(255,255,255,.35);}
.aa-cl-prog-pill{font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.15);}
.aa-cl-body{animation:aaIn .18s ease;}

/* ── OBLIGATION GROUPS ── */
.aa-ob-card{border-top:1px solid var(--aa-border-lt);}
.aa-ob-header{background:var(--aa-ob-bg);cursor:pointer;padding:11px 20px 11px 30px;transition:background .15s;}
.aa-ob-header:hover{background:#364972;}
.aa-ob-inner{display:flex;align-items:center;gap:12px;}
.aa-ob-arr{font-size:9px;color:rgba(255,255,255,.3);flex-shrink:0;width:10px;}
.aa-ob-header:hover .aa-ob-arr{color:rgba(255,255,255,.75);}
.aa-ob-titles{flex:1;min-width:0;}
.aa-ob-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.aa-ob-id-badge{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:rgba(255,255,255,.6);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);padding:2px 8px;border-radius:4px;flex-shrink:0;}
.aa-ob-text-inline{font-size:12px;color:rgba(220,230,245,.8);font-weight:500;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.aa-ob-act-total{font-size:10px;color:rgba(255,255,255,.35);flex-shrink:0;}
.aa-ob-prog-pill{font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.12);flex-shrink:0;}
.aa-ob-bulk-chk{margin-left:auto;flex-shrink:0;}
.aa-ob-body{animation:aaIn .15s ease;overflow-x:auto;}

/* TABLE inside obligation */
.aa-table{width:100%;border-collapse:collapse;font-size:13px;}
.aa-table thead tr.aa-inner-thead{background:#f5f7fa;}
.aa-table thead th{padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--aa-text-mut);border-bottom:2px solid var(--aa-border);white-space:nowrap;}
.aa-th-chk{width:40px;}
.aa-td-name{max-width:240px;}
.aa-td-assignee{min-width:140px;}
.aa-table td{padding:10px 12px;border-bottom:1px solid var(--aa-border-lt);vertical-align:middle;}
.aa-act-row{transition:background .12s;cursor:pointer;}
.aa-act-row:hover{background:#f5f8fc;}
.aa-act-row.aa-act-unassigned{border-left:3px solid var(--aa-amber);}
.aa-act-row.aa-row-active{background:var(--aa-accent-lt);}
.aa-td-chk{width:40px;text-align:center;}
.aa-act-id-badge{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:var(--aa-purple);background:var(--aa-purple-lt);border:1px solid #d4d6f8;padding:2px 7px;border-radius:4px;white-space:nowrap;}
.aa-act-name{font-size:12.5px;font-weight:500;color:var(--aa-text);}
.aa-assignee-filled{display:flex;align-items:center;gap:7px;cursor:pointer;}
.aa-av{width:24px;height:24px;border-radius:50%;background:var(--aa-accent-lt);color:var(--aa-accent);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--aa-accent-md);}
.aa-assignee-name{font-size:12px;font-weight:500;}
.aa-assignee-empty{position:relative;}
.aa-inline-assignee{width:100%;padding:5px 8px;background:#f5f7fa;border:1.5px dashed var(--aa-border);border-radius:6px;font-family:inherit;font-size:11px;color:var(--aa-text-mut);outline:none;transition:all .13s;}
.aa-inline-assignee:focus{border-color:var(--aa-accent);border-style:solid;background:#fff;}
.aa-inline-date{padding:5px 6px;background:#f5f7fa;border:1.5px dashed var(--aa-border);border-radius:6px;font-family:inherit;font-size:11px;color:var(--aa-text-mut);outline:none;transition:all .13s;width:118px;}
.aa-inline-date:focus,.aa-inline-date.filled{border-style:solid;border-color:var(--aa-accent-md);background:var(--aa-accent-lt);color:var(--aa-text);}
.aa-st-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;white-space:nowrap;}
.aa-s-none{background:#f1f5f9;color:#64748b;}
.aa-s-asgn{background:var(--aa-accent-lt);color:var(--aa-accent);}
.aa-open-btn{background:none;border:none;cursor:pointer;font-size:18px;color:var(--aa-text-mut);padding:0 2px;transition:color .12s;}
.aa-open-btn:hover{color:var(--aa-accent);}
.aa-sug-box{position:absolute;top:calc(100%+4px);left:0;right:0;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-r);z-index:999;box-shadow:var(--aa-shm);max-height:170px;overflow-y:auto;}
.aa-sug-item{display:flex;align-items:center;gap:9px;padding:9px 12px;cursor:pointer;transition:background .1s;}
.aa-sug-item:hover{background:var(--aa-accent-lt);}
.aa-sug-av{width:26px;height:26px;border-radius:50%;background:var(--aa-accent-lt);color:var(--aa-accent);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--aa-accent-md);}
.aa-sug-name{flex:1;font-size:13px;font-weight:500;}
.aa-sug-dept-tag{font-size:10px;font-weight:600;color:var(--aa-accent);background:var(--aa-accent-lt);border:1px solid var(--aa-accent-md);padding:1px 7px;border-radius:4px;}

/* OVERLAY DRAWER */
.aa-overlay{position:fixed;inset:0;background:rgba(10,15,28,.5);backdrop-filter:blur(3px);z-index:500;display:flex;align-items:stretch;justify-content:flex-end;animation:aaFadeIn .2s ease;}
.aa-drawer{width:520px;max-width:96vw;background:var(--aa-card);box-shadow:-4px 0 40px rgba(10,15,28,.2);display:flex;flex-direction:column;overflow-y:auto;transform:translateX(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);}
.aa-drawer.open{transform:translateX(0);}
.aa-dr-inner{padding:26px 24px;display:flex;flex-direction:column;gap:16px;min-height:100%;}
.aa-dr-head{display:flex;align-items:center;justify-content:space-between;}
.aa-dr-head-left{display:flex;align-items:center;gap:8px;}
.aa-dr-close{background:none;border:1px solid var(--aa-border);border-radius:7px;width:30px;height:30px;cursor:pointer;font-size:13px;color:var(--aa-text-mut);display:flex;align-items:center;justify-content:center;transition:all .13s;}
.aa-dr-close:hover{background:var(--aa-red-lt);color:var(--aa-red);border-color:#f5b8b8;}
.aa-dr-act-block{background:var(--aa-accent-lt);border:1px solid var(--aa-accent-md);border-left:4px solid var(--aa-accent);border-radius:var(--aa-r);padding:13px 16px;}
.aa-dr-act-label{font-size:9px;font-weight:700;color:var(--aa-accent);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
.aa-dr-act-name{font-size:13.5px;font-weight:600;line-height:1.5;color:var(--aa-text);}
.aa-dept-chip{font-size:10px;font-weight:700;padding:3px 9px;border-radius:4px;white-space:nowrap;}
.aa-dept-compliance{background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;}
.aa-dept-risk{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}
.aa-dept-legal{background:#fdf4ff;color:#7e22ce;border:1px solid #e9d5ff;}
.aa-dept-it{background:var(--aa-accent-lt);color:var(--aa-accent);border:1px solid var(--aa-accent-md);}
.aa-dept-operations{background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;}
.aa-dept-hr{background:#fef9c3;color:#854d0e;border:1px solid #fde68a;}
.aa-dept-finance{background:#f8fafc;color:#475569;border:1px solid #e2e8f0;}
.aa-dr-section-label{font-size:10px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.08em;border-top:1px solid var(--aa-border-lt);padding-top:4px;}
.aa-dr-fields{display:flex;flex-direction:column;gap:14px;}
.aa-dr-field{display:flex;flex-direction:column;gap:5px;}
.aa-dr-field-row3{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:12px;}
.aa-dr-label{font-size:10px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.06em;}
.aa-dr-input{padding:9px 12px;background:var(--aa-card);border:1.5px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:13px;color:var(--aa-text);outline:none;width:100%;box-sizing:border-box;transition:border-color .15s,box-shadow .15s;}
.aa-dr-input:focus{border-color:var(--aa-accent);box-shadow:0 0 0 3px rgba(13,127,165,.08);}
.aa-dr-ta{min-height:75px;resize:vertical;}
.aa-ta-wrap,.aa-ita-wrap{position:relative;}

/* Circ ref table */
.aa-circ-ref-table{border:1px solid var(--aa-border);border-radius:var(--aa-r);overflow:hidden;animation:aaIn .18s ease;margin-bottom:2px;}
.aa-crt-head{font-size:10px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.07em;padding:9px 14px;background:#f5f7fa;border-bottom:1px solid var(--aa-border);}
.aa-crt-grid{display:grid;grid-template-columns:1fr 1fr;}
.aa-crt-row{display:flex;flex-direction:column;gap:3px;padding:9px 13px;border-right:1px solid var(--aa-border-lt);border-bottom:1px solid var(--aa-border-lt);background:#fbfcfd;}
.aa-crt-row:nth-child(2n){border-right:none;}
.aa-crt-row-full{grid-column:1/-1;border-right:none!important;border-bottom:none!important;}
.aa-crt-label{font-size:9px;font-weight:700;color:var(--aa-text-mut);text-transform:uppercase;letter-spacing:.06em;}
.aa-crt-val{font-size:12px;font-weight:600;color:var(--aa-text);}
.aa-crt-text-sm{font-size:11px;font-weight:400;color:var(--aa-text-sec);line-height:1.4;}
.aa-crt-clause-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--aa-accent);background:var(--aa-accent-lt);border:1px solid var(--aa-accent-md);padding:1px 7px;border-radius:4px;}
.aa-crt-ob-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--aa-purple);background:var(--aa-purple-lt);border:1px solid #d4d6f8;padding:1px 7px;border-radius:4px;}
.aa-crt-highlight{color:var(--aa-amber);font-weight:700;}
.aa-crt-link{color:var(--aa-accent);cursor:pointer;text-decoration:underline dotted;}
.aa-crt-link:hover{color:#0b6a8a;}

/* Doc link */
.aa-doc-link{display:inline-flex;align-items:center;gap:7px;padding:5px 10px;background:var(--aa-accent-lt);border:1px solid var(--aa-accent-md);border-radius:6px;text-decoration:none;color:var(--aa-accent);transition:all .13s;font-size:12px;font-weight:600;}
.aa-doc-link:hover{background:var(--aa-accent-md);color:#0b6a8a;}
.aa-doc-icon{font-size:14px;}
.aa-doc-name{font-size:11px;color:var(--aa-text-sec);font-weight:500;}
.aa-doc-badge{font-size:9px;font-weight:800;background:var(--aa-red-lt);color:var(--aa-red);border:1px solid #f5b8b8;padding:1px 5px;border-radius:3px;letter-spacing:.04em;}

/* Upload */
.aa-upload-label{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;background:#f5f7fa;border:1.5px dashed var(--aa-border);border-radius:6px;cursor:pointer;font-size:12px;color:var(--aa-text-sec);transition:all .13s;}
.aa-upload-label:hover{border-color:var(--aa-accent);background:var(--aa-accent-lt);color:var(--aa-accent);}
.aa-upload-icon{font-size:14px;}
.aa-upload-inp{position:absolute;opacity:0;width:0;height:0;}

/* Drawer footer — one row */
.aa-dr-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 0 0 0;border-top:1px solid var(--aa-border-lt);margin-top:auto;position:sticky;bottom:0;background:var(--aa-card);z-index:2;}
.aa-dr-foot-actions{display:flex;gap:8px;align-items:center;flex-shrink:0;}
.aa-dr-more-btn-inline{padding:8px 13px;background:#f8f9fb;border:1.5px solid var(--aa-border);border-radius:var(--aa-r);font-family:inherit;font-size:11px;font-weight:600;color:var(--aa-text-sec);cursor:pointer;white-space:nowrap;transition:all .13s;}
.aa-dr-more-btn-inline:hover,.aa-more-btn-active{border-color:var(--aa-accent);color:var(--aa-accent);background:var(--aa-accent-lt);}

/* BULK BAR */
.aa-bulk-bar{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:0;background:var(--aa-cl-bg);border-radius:14px;box-shadow:0 8px 40px rgba(10,15,28,.35);z-index:200;overflow:hidden;animation:aaIn .22s ease;white-space:nowrap;}
.aa-bulk-left{display:flex;align-items:center;gap:10px;padding:14px 18px;}
.aa-bulk-count{font-size:13px;font-weight:700;color:#fff;}
.aa-bulk-clear{background:none;border:1px solid rgba(255,255,255,.18);border-radius:6px;color:rgba(255,255,255,.55);font-family:inherit;font-size:11px;padding:3px 10px;cursor:pointer;}
.aa-bulk-clear:hover{background:rgba(255,255,255,.1);color:#fff;}
.aa-bulk-div{width:1px;background:rgba(255,255,255,.1);align-self:stretch;}
.aa-bulk-fields{display:flex;align-items:flex-end;gap:12px;padding:12px 18px;}
.aa-bulk-f{display:flex;flex-direction:column;gap:4px;}
.aa-bulk-lbl{font-size:9px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.07em;}
.aa-bulk-sel{padding:7px 10px;background:#fff;border:1px solid rgba(255,255,255,.3);border-radius:6px;font-family:inherit;font-size:12px;color:var(--aa-text);outline:none;cursor:pointer;min-width:120px;}
.aa-bulk-inp{padding:7px 10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:6px;font-family:inherit;font-size:12px;color:#fff;outline:none;min-width:130px;color-scheme:dark;}
.aa-bulk-inp::placeholder{color:rgba(255,255,255,.4);}
.aa-bulk-ta-wrap{position:relative;}
.aa-bulk-sug-box{position:absolute;bottom:calc(100%+5px);left:0;min-width:200px;background:#2d3548;border:1px solid rgba(255,255,255,.1);border-radius:var(--aa-r);z-index:999;box-shadow:var(--aa-shm);max-height:150px;overflow-y:auto;}
.aa-sug-dark.aa-sug-item:hover{background:rgba(255,255,255,.1);}
.aa-sug-dark .aa-sug-name{color:#fff;}
.aa-sug-dark .aa-sug-av{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border-color:rgba(255,255,255,.15);}
.aa-bulk-go{padding:0 24px;background:var(--aa-accent);color:#fff;border:none;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:all .14s;align-self:stretch;}
.aa-bulk-go:hover{background:#0b6a8a;}
  `;
  document.head.appendChild(s);
}