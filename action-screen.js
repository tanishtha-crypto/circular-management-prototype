// /**
//  * task-management.js — Task Detail Panel
//  * REBUILT:
//  *  - Larger font sizes throughout
//  *  - Dummy action table with Act ID, Action Name, Obligation, Assigned To, Status
//  *  - Clicking Act ID → full edit screen (read-only fields + editable dropdown + assign to + evidence)
//  *  - Dropdown: Close / Ask for Clarification / Ask for Closure / Ask for Review
//  *  - Evidence tab shows Action Title, no Notes column
//  *  - Save / Submit buttons on action edit screen
//  */

// let _tdTask = null;
// let _tdTab  = 'overview';

// /* ── DUMMY TASKS (fallback) ──────────────────────────────────── */
// const TD_TASKS = (typeof CMS_DATA !== 'undefined' && CMS_DATA.tasks) ? CMS_DATA.tasks : [
//   { id:'ACT-001', title:'Appoint Board-Level CISO',          circularId:'CIRC-001', clauseRef:'C1.2', department:'HR',         assignee:'Priya Nair',     status:'Complete',    risk:'High',   priority:'Critical', dueDate:'2025-01-15' },
//   { id:'ACT-002', title:'Deploy SIEM & 24x7 SOC',            circularId:'CIRC-001', clauseRef:'C3.1', department:'IT',         assignee:'Raj Iyer',       status:'Overdue',     risk:'High',   priority:'Critical', dueDate:'2025-01-30' },
//   { id:'ACT-003', title:'Quarterly Risk Assessment Report',   circularId:'CIRC-001', clauseRef:'C3.2', department:'Risk',       assignee:'Anand Krishnan', status:'Open',        risk:'High',   priority:'High',     dueDate:'2025-04-15' },
//   { id:'ACT-004', title:'EDD Process Documentation',          circularId:'CIRC-002', clauseRef:'C2.1', department:'Compliance', assignee:'Sneha Das',      status:'In Progress', risk:'High',   priority:'High',     dueDate:'2025-03-20' },
//   { id:'ACT-005', title:'Vendor Risk Register Update',        circularId:'CIRC-005', clauseRef:'C2.1', department:'Operations', assignee:'Suresh Kumar',   status:'Open',        risk:'High',   priority:'High',     dueDate:'2025-04-05' },
// ];

// function getTasks() {
//   return (typeof CMS_DATA !== 'undefined' && CMS_DATA.tasks) ? CMS_DATA.tasks : TD_TASKS;
// }

// /* ── DUMMY ACTIONS per task ──────────────────────────────────── */
// const DUMMY_ACTIONS = {
//   'ACT-001': [
//     { id:'ACT-001-1', name:'Draft CISO Job Description',         obligation:'Appoint a full-time CISO reporting to the Board.',       assignee:'Priya Nair',     status:'Complete',    dept:'HR',         evidence:[] },
//     { id:'ACT-001-2', name:'Board Resolution for CISO Approval', obligation:'Obtain Board approval for CISO appointment.',             assignee:'Arjun Kumar',    status:'Complete',    dept:'Compliance', evidence:[{id:'EV-001', type:'Board Resolution',   file:'Board_Resolution_CISO.pdf', status:'Verified', uploadedBy:'Arjun Kumar', date:'15 Jan 2025', actionTitle:'Board Resolution for CISO Approval'}] },
//     { id:'ACT-001-3', name:'CISO Onboarding & Access Setup',     obligation:'Provide system access and onboarding within 30 days.',    assignee:'Raj Iyer',       status:'In Progress', dept:'IT',         evidence:[] },
//   ],
//   'ACT-002': [
//     { id:'ACT-002-1', name:'SIEM Vendor Evaluation',             obligation:'Deploy a SIEM system with 24×7 SOC monitoring.',          assignee:'Raj Iyer',       status:'Overdue',     dept:'IT',         evidence:[] },
//     { id:'ACT-002-2', name:'SOC Team Hiring',                    obligation:'Staff a 24×7 Security Operations Centre.',                assignee:'Priya Nair',     status:'Open',        dept:'HR',         evidence:[] },
//     { id:'ACT-002-3', name:'SIEM Configuration & Go-Live',       obligation:'Configure alerts, dashboards and run 30-day pilot.',      assignee:'Raj Iyer',       status:'Open',        dept:'IT',         evidence:[] },
//   ],
//   'ACT-003': [
//     { id:'ACT-003-1', name:'Scope Definition for Q1 Assessment', obligation:'Conduct quarterly penetration testing and risk review.',   assignee:'Anand Krishnan', status:'Open',        dept:'Risk',       evidence:[] },
//     { id:'ACT-003-2', name:'Third-Party Pentest Engagement',     obligation:'Engage certified pentesting firm for quarterly test.',    assignee:'Anand Krishnan', status:'Open',        dept:'Risk',       evidence:[] },
//   ],
//   'ACT-004': [
//     { id:'ACT-004-1', name:'Document EDD SOP for PEP Customers', obligation:'Maintain an updated EDD SOP for Politically Exposed Persons.', assignee:'Sneha Das', status:'In Progress', dept:'Compliance', evidence:[{id:'EV-004', type:'Policy Document', file:'EDD_SOP_v2.pdf', status:'Pending Review', uploadedBy:'Sneha Das', date:'20 Mar 2025', actionTitle:'Document EDD SOP for PEP Customers'}] },
//     { id:'ACT-004-2', name:'EDD Training for Compliance Staff',  obligation:'Mandatory EDD training for all compliance staff.',        assignee:'Meera Pillai',   status:'Open',        dept:'Compliance', evidence:[] },
//   ],
//   'ACT-005': [
//     { id:'ACT-005-1', name:'Classify Vendors by Risk Tier',      obligation:'Classify all vendors as Critical, Important, or Standard.', assignee:'Suresh Kumar', status:'Open',        dept:'Operations', evidence:[] },
//     { id:'ACT-005-2', name:'Conduct Vendor Due Diligence',       obligation:'Annual due diligence on all critical and important vendors.', assignee:'Neha Rao',   status:'Open',        dept:'Risk',       evidence:[] },
//     { id:'ACT-005-3', name:'Document Vendor Exit Strategies',    obligation:'Document and test exit strategies for critical vendors.', assignee:'Suresh Kumar',   status:'Open',        dept:'Operations', evidence:[] },
//   ],
// };

// function getActions(taskId) {
//   if (!DUMMY_ACTIONS[taskId]) {
//     DUMMY_ACTIONS[taskId] = [
//       { id:`ACT-${taskId}-1`, name:'Review Circular Requirements', obligation:'Review and confirm applicability of all clauses.', assignee:'Compliance Team', status:'Open', dept:'Compliance', evidence:[] },
//       { id:`ACT-${taskId}-2`, name:'Prepare Compliance Report',    obligation:'Prepare and submit compliance status report.',    assignee:'Compliance Team', status:'Open', dept:'Compliance', evidence:[] },
//     ];
//   }
//   return DUMMY_ACTIONS[taskId];
// }

// /* ── OPEN TASK DETAIL ────────────────────────────────────────── */
// window.openTaskDetail = function(taskId) {
//   const task = getTasks().find(t => t.id === taskId);
//   if (!task) { if (typeof showToast === 'function') showToast('Task not found', 'warning'); return; }

//   _tdTask = task;
//   _tdTab  = 'overview';

//   if (!task._evidence) task._evidence = [];
//   if (!task._comments) task._comments = [
//     { author:'Priya Sharma', role:'Compliance Lead', time:'2 days ago', text:'Reviewed requirements and confirmed scope. Proceeding with execution.' },
//     { author:'Rahul Verma',  role:'IT Manager',      time:'1 day ago',  text:'Resources allocated. Will update progress by end of week.' }
//   ];

//   tdInjectStyles();

//   const area = document.getElementById('content-area');
//   if (!area) return;
//   area.innerHTML = `<div class="tds-full" id="tds-full">${tdBuildPanel(task)}</div>`;
//   tdSwitchTab('overview');
// };

// /* ── CLOSE ────────────────────────────────────────────────────── */
// window.closeTaskDetail = function() {
//   _tdTask = null;
//   const area = document.getElementById('content-area');
//   if (!area) return;
//   if (typeof renderMyItemsObligations === 'function') renderMyItemsObligations();
//   else area.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8">No task list renderer found.</div>';
// };

// /* ── PANEL SHELL ──────────────────────────────────────────────── */
// function tdBuildPanel(t) {
//   const sc = s => ({ Complete:'#10b981', 'In Progress':'#f59e0b', Overdue:'#ef4444', Open:'#6366f1' })[s] || '#64748b';
//   const rc = r => ({ High:'#ef4444', Medium:'#f59e0b', Low:'#10b981' })[r] || '#64748b';
//   const rb = r => ({ High:'#fee2e2', Medium:'#fef9c3', Low:'#dcfce7' })[r] || '#f9fafb';
//   const rd = r => ({ High:'#fca5a5', Medium:'#fde68a', Low:'#86efac' })[r] || '#e2e8f0';

//   return `
//   <div class="tdp-wrap">

//     <!-- STICKY HEADER -->
//     <div class="tdp-header">
//       <div class="tdp-hrow">
//         <div style="min-width:0;flex:1">
//           <div class="tdp-bc">
//             <span class="tdp-back" onclick="closeTaskDetail()">← Tasks</span>
//             <span class="tdp-bc-sep">/</span>
//             <span class="tdp-bc-id">${t.circularId}</span>
//             <span class="tdp-bc-sep">/</span>
//             <span class="tdp-bc-id">${t.id}</span>
//           </div>
//           <div class="tdp-title">${t.title}</div>
//         </div>
//         <button class="tdp-x" onclick="closeTaskDetail()">✕</button>
//       </div>

//       <div class="tdp-chips">
//         <span class="tdp-chip" style="background:${rb(t.risk)};color:${rc(t.risk)};border:1px solid ${rd(t.risk)}">
//           ${t.risk} Risk
//         </span>
//         <span class="tdp-chip tdp-ch-blue">${t.circularId}</span>
//         <span class="tdp-chip tdp-ch-grey">${t.department}</span>
//         ${t.clauseRef ? `<span class="tdp-chip tdp-ch-mono">${t.clauseRef}</span>` : ''}
//         <select class="tdp-st-sel" onchange="tdSetStatus(this,'${t.id}')"
//           style="color:${sc(t.status)};border-color:${sc(t.status)}44;background:${sc(t.status)}10">
//           ${['Open','In Progress','Complete','Overdue'].map(s =>
//             `<option ${s === t.status ? 'selected' : ''}>${s}</option>`
//           ).join('')}
//         </select>
//       </div>
//     </div>

//     <!-- BODY: vertical tabs + pane -->
//     <div class="tdp-body">

//       <!-- Vertical tabs -->
//       <nav class="tdp-vtabs">
//         ${[
//           ['overview', '◈', 'Overview'],
//           ['actions',  '⚡', 'Activities'],
//           ['evidence', '📎', 'Evidence'],
//           ['comments', '💬', 'Comments'],
//           // ['edit',     '✏',  'Edit'],
//         ].map(([id, ic, lb]) => `
//           <button class="tdp-vtab" id="tdp-vt-${id}" onclick="tdSwitchTab('${id}')">
//             <span class="tdp-vt-icon">${ic}</span>
//             <span class="tdp-vt-lbl">${lb}</span>
//           </button>`).join('')}
//       </nav>

//       <div class="tdp-pane" id="tdp-pane"></div>
//     </div>
//   </div>`;
// }

// /* ── SWITCH TAB ───────────────────────────────────────────────── */
// window.tdSwitchTab = function(tab) {
//   _tdTab = tab;
//   document.querySelectorAll('.tdp-vtab').forEach(b => b.classList.remove('active'));
//   const btn = document.getElementById(`tdp-vt-${tab}`);
//   if (btn) btn.classList.add('active');
//   const pane = document.getElementById('tdp-pane');
//   if (!pane || !_tdTask) return;
//   const map = { overview: tdPaneOverview, actions: tdPaneActions, evidence: tdPaneEvidence, comments: tdPaneComments, edit: tdPaneEdit };
//   pane.innerHTML = (map[tab] || tdPaneOverview)(_tdTask);
//   pane.style.animation = 'none';
//   void pane.offsetHeight;
//   pane.style.animation = 'tdpIn .2s ease';
// };

// /* ══════════════════════════════════════════════════════════════
//    PANE: OVERVIEW
//    ══════════════════════════════════════════════════════════════ */
// function tdPaneOverview(t) {
//   const sc = s => ({ Complete:'#10b981', 'In Progress':'#f59e0b', Overdue:'#ef4444', Open:'#6366f1' })[s] || '#64748b';
//   const rc = r => ({ High:'#ef4444', Medium:'#f59e0b', Low:'#10b981' })[r] || '#64748b';
//   const actions = getActions(t.id);

//   return `
//   <div class="tdp-inner">

//     <div class="tdp-section-label">Circular Details</div>
//    <div class="tdp-dl" style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px 20px;">
//   ${tdr('Activity ID', `<code class="tdp-code">${t.id}</code>`)}
//   ${tdr('Circular', `<span class="tdp-link" onclick="window.CMS?.navigateTo('circular-library','${t.circularId}')">${t.circularId}</span>`)}
//   ${tdr('Clause Ref', t.clauseRef ? `<code class="tdp-code">${t.clauseRef}</code>` : '—')}
//   ${tdr('Department', t.department || '—')}
//   ${tdr('Assigned To', t.assignee || '—')}
//   ${tdr('Due Date', tdFmtDate(t.dueDate))}
//   ${tdr('Priority', t.priority || '—')}
//   ${tdr('Risk', `<span style="color:${rc(t.risk)};font-weight:700">${t.risk}</span>`)}
//   ${tdr('Status', `<span style="color:${sc(t.status)};font-weight:700">${t.status}</span>`)}
// </div>
//     <!-- Progress summary -->
//     <div class="tdp-section-label" style="margin-top:24px">Progress Summary</div>
//     <div class="tdp-prog-strip">
//       ${tdProg('Actions',  actions.filter(a => a.status === 'Complete').length, actions.length)}
//       ${tdProg('Evidence', t._evidence.length, Math.max(t._evidence.length, 2))}
//       ${tdProg('Comments', t._comments.length, Math.max(t._comments.length, 2))}
//     </div>

//     <!-- Quick action buttons -->
//     <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:24px">
//       <button class="tdp-btn tdp-btn-primary" onclick="tdSwitchTab('actions')">⚡ View Actions</button>
//       <button class="tdp-btn tdp-btn-ghost"   onclick="tdSwitchTab('evidence')">📎 View Evidence</button>
//       <button class="tdp-btn tdp-btn-ghost"   onclick="tdSwitchTab('comments')">💬 Add Comment</button>
//     </div>

//   </div>`;
// }

// /* ══════════════════════════════════════════════════════════════
//    PANE: ACTIONS  — table with Act ID click → edit screen
//    ══════════════════════════════════════════════════════════════ */
// function tdPaneActions(t) {
//   const actions = getActions(t.id);
//   const sc = s => ({ Complete:'#10b981', 'In Progress':'#f59e0b', Overdue:'#ef4444', Open:'#6366f1' })[s] || '#64748b';
//   const sb = s => ({ Complete:'#dcfce7', 'In Progress':'#fef9c3', Overdue:'#fee2e2', Open:'#eef2ff' })[s] || '#f1f5f9';

//   return `
//   <div class="tdp-inner">

//     <div class="tdp-section-label">Actions
//       <span style="font-size:12px;font-weight:500;color:#64748b;text-transform:none;letter-spacing:0">
//         — ${actions.length} action${actions.length !== 1 ? 's' : ''} for ${t.id}
//       </span>
//     </div>

//     <div class="tdp-tbl-wrap">
//       <table class="tdp-tbl">
//         <thead>
//           <tr>
//             <th>Act ID</th>
//             <th>Action Name</th>
//             <th>Obligation</th>
//             <th>Department</th>
//             <th>Assigned To</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${actions.map(act => `
//             <tr>
//               <td>
//                 <span class="tdp-act-id" onclick="tdOpenActEdit('${t.id}','${act.id}')">
//                   ${act.id}
//                 </span>
//               </td>
//               <td class="tdp-act-name">${act.name}</td>
//               <td class="tdp-act-oblig">${act.obligation}</td>
//               <td><span class="tdp-dept-tag">${act.dept}</span></td>
//               <td>
//                 <div class="tdp-assignee-cell">
//                   <span class="tdp-av">${tdInitials(act.assignee)}</span>
//                   <span>${act.assignee}</span>
//                 </div>
//               </td>
//               <td>
//                 <span class="tdp-status-pill"
//                       style="background:${sb(act.status)};color:${sc(act.status)}">
//                   ${act.status}
//                 </span>
//               </td>
//             </tr>`).join('')}
//         </tbody>
//       </table>
//     </div>

//     <!-- Action edit panel injected here -->


//   </div>`;
// }

// /* ══════════════════════════════════════════════════════════════
//    ACTION EDIT SCREEN  (opens inline below table)
//    ══════════════════════════════════════════════════════════════ */
// window.tdOpenActEdit = function(taskId, actId) {
//   const task    = getTasks().find(t => t.id === taskId); if (!task) return;
//   const actions = getActions(taskId);
//   const act     = actions.find(a => a.id === actId);    if (!act) return;

//   const sc = s => ({ Complete:'#10b981', 'In Progress':'#f59e0b', Overdue:'#ef4444', Open:'#6366f1' })[s] || '#64748b';
//   const sb = s => ({ Complete:'#dcfce7', 'In Progress':'#fef9c3', Overdue:'#fee2e2', Open:'#eef2ff' })[s] || '#f1f5f9';

//   /* highlight selected row */
//   document.querySelectorAll('.tdp-act-id').forEach(el => el.classList.remove('tdp-act-id-active'));
//   const clicked = [...document.querySelectorAll('.tdp-act-id')].find(el => el.textContent.trim() === actId);
//   if (clicked) clicked.classList.add('tdp-act-id-active');
// const container = document.querySelector('.tdp-inner');
// if (!container) return;
//   // const panel = document.getElementById('tdp-act-edit-panel');
//   // if (!panel) return;

//   container.innerHTML = `
//   <button class="tdp-btn tdp-btn-ghost"
// onclick="renderTaskDetails('${taskId}')"
// style="margin-bottom:16px">
// ← Back to Actions
// </button>
//   <div class="tdp-act-edit-card" id="tdp-act-edit-${actId}">

//     <!-- Header -->
//     <div class="tdp-act-edit-head">
//       <div>
//         <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
//           <code class="tdp-code" style="font-size:13px">${act.id}</code>
//           <span class="tdp-status-pill"
//                 style="background:${sb(act.status)};color:${sc(act.status)}">
//             ${act.status}
//           </span>
//         </div>
//         <div class="tdp-act-edit-title">${act.name}</div>
//       </div>
//       <button class="tdp-x" onclick="tdCloseActEdit()">✕</button>
//     </div>

//     <!-- Two-col body -->
//     <div class="tdp-act-edit-body">

//       <!-- LEFT: read-only details + editable fields -->
//       <div class="tdp-act-edit-left">

//         <div class="tdp-field-section-label">Action Details</div>

//         <!-- Read-only info -->
//         <div class="tdp-readonly-grid">
//           <div class="tdp-ro-item">
//             <div class="tdp-ro-label">Action ID</div>
//             <div class="tdp-ro-value"><code class="tdp-code">${act.id}</code></div>
//           </div>
//           <div class="tdp-ro-item">
//             <div class="tdp-ro-label">Task ID</div>
//             <div class="tdp-ro-value"><code class="tdp-code">${taskId}</code></div>
//           </div>
//           <div class="tdp-ro-item">
//             <div class="tdp-ro-label">Action Name</div>
//             <div class="tdp-ro-value">${act.name}</div>
//           </div>
//           <div class="tdp-ro-item">
//             <div class="tdp-ro-label">Department</div>
//             <div class="tdp-ro-value">${act.dept}</div>
//           </div>
//           <div class="tdp-ro-item tdp-ro-full">
//             <div class="tdp-ro-label">Obligation</div>
//             <div class="tdp-ro-value tdp-oblig-text">${act.obligation}</div>
//           </div>
//           <div class="tdp-ro-item">
//             <div class="tdp-ro-label">Due Date</div>
//             <div class="tdp-ro-value">${tdFmtDate(task.dueDate)}</div>
//           </div>
//           <div class="tdp-ro-item">
//             <div class="tdp-ro-label">Circular</div>
//             <div class="tdp-ro-value"><code class="tdp-code">${task.circularId}</code></div>
//           </div>
//         </div>

//         <!-- Editable fields -->
//         <div class="tdp-field-section-label" style="margin-top:20px">Update Action</div>

//         <div class="tdp-edit-fields">

//           <!-- Assigned To -->
//           <div class="tdp-fg">
//             <label class="tdp-fld-label">Assigned To</label>
//             <input class="tdp-input" id="tdp-ae-assignee-${actId}"
//                    value="${act.assignee}" placeholder="Assignee name"/>
//           </div>

//           <!-- Action Status dropdown -->
//           <div class="tdp-fg">
//             <label class="tdp-fld-label">Action Status</label>
//             <select class="tdp-input tdp-ae-status-sel" id="tdp-ae-status-${actId}"
//                     onchange="tdActStatusChange('${actId}',this)">
//               <option value="">— Select action —</option>
//               <option value="Close"                   ${act.status === 'Complete'        ? 'selected' : ''}>Close</option>
//               <option value="Ask for Clarification"   ${act.status === 'In Progress'     ? 'selected' : ''}>Ask for Clarification</option>
//               <option value="Ask for Closure"                                                              >Ask for Closure</option>
//               <option value="Ask for Review"                                                               >Ask for Review</option>
//             </select>
//           </div>

//           <!-- Notes / Remarks -->
//           <div class="tdp-fg tdp-fg-full">
//             <label class="tdp-fld-label">Remarks / Notes</label>
//             <textarea class="tdp-input" id="tdp-ae-notes-${actId}" rows="3"
//                       placeholder="Add remarks, context or instructions for this action…">${act._notes || ''}</textarea>
//           </div>

//         </div>

//         <!-- Status change note -->
//         <div id="tdp-ae-status-note-${actId}" class="tdp-status-note" style="display:none"></div>

//       </div><!-- /left -->

//       <!-- RIGHT: evidence for this action -->
//       <div class="tdp-act-edit-right">

//         <div class="tdp-field-section-label">
//           Evidence
//           <button class="tdp-btn tdp-btn-ghost tdp-btn-sm" style="font-size:12px;margin-left:auto"
//                   onclick="tdActAddEvToggle('${actId}')">＋ Add</button>
//         </div>

//         <!-- Add evidence form (hidden) -->
//         <div class="tdp-add-ev" id="tdp-ae-add-${actId}" style="display:none">
//           <div class="tdp-fg" style="margin-bottom:8px">
//             <label class="tdp-fld-label">Action Title (auto-filled)</label>
//             <input class="tdp-input" value="${act.name}" readonly
//                    style="background:#f8fafc;color:#64748b"/>
//           </div>
//           <div class="tdp-fg" style="margin-bottom:8px">
//             <label class="tdp-fld-label">Evidence Type</label>
//             <select class="tdp-input" id="tdp-ae-evtype-${actId}">
//               <option>Policy Document</option><option>API Logs</option>
//               <option>Training Records</option><option>Audit Trail</option>
//               <option>Screenshot</option><option>Other</option>
//             </select>
//           </div>
//           <div class="tdp-fg" style="margin-bottom:8px">
//             <label class="tdp-fld-label">File / Link</label>
//             <input class="tdp-input" id="tdp-ae-evfile-${actId}" placeholder="filename.pdf or https://…"/>
//           </div>
//           <div style="display:flex;gap:7px;justify-content:flex-end">
//             <button class="tdp-btn tdp-btn-ghost tdp-btn-sm" onclick="tdActAddEvToggle('${actId}')">Cancel</button>
//             <button class="tdp-btn tdp-btn-primary tdp-btn-sm" onclick="tdActSaveEv('${taskId}','${actId}')">Save</button>
//           </div>
//         </div>

//         <!-- Evidence list for this action -->
//         <div id="tdp-ae-evlist-${actId}">
//           ${tdRenderActEvidence(act)}
//         </div>

//       </div><!-- /right -->
//     </div><!-- /body -->

//     <!-- Footer: Save + Submit -->
//     <div class="tdp-act-edit-footer">
//       <button class="tdp-btn tdp-btn-ghost" onclick="tdCloseActEdit()">Cancel</button>
//       <button class="tdp-btn tdp-btn-ghost" onclick="tdActSave('${taskId}','${actId}')">
//         💾 Save Draft
//       </button>
//       <button class="tdp-btn tdp-btn-primary" onclick="tdActSubmit('${taskId}','${actId}')">
//         ✓ Submit Action
//       </button>
//     </div>

//   </div>`;

//   panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
// };

// function tdRenderActEvidence(act) {
//   if (!act.evidence || !act.evidence.length) {
//     return `<div class="tdp-ev-empty">
//       <div style="font-size:28px;margin-bottom:8px">📎</div>
//       <div>No evidence uploaded yet</div>
//     </div>`;
//   }
//   const sc = s => s === 'Verified' ? '#10b981' : '#f59e0b';
//   const sb = s => s === 'Verified' ? '#dcfce7' : '#fef9c3';
//   return `<div style="display:flex;flex-direction:column;gap:8px">
//     ${act.evidence.map(ev => `
//       <div class="tdp-ev-card">
//         <div class="tdp-ev-card-head">
//           <span class="tdp-ev-type-chip">${ev.type}</span>
//           <span class="tdp-ev-chip"
//                 style="background:${sb(ev.status)};color:${sc(ev.status)}">
//             ${ev.status === 'Verified' ? '✓ ' : ''}${ev.status}
//           </span>
//         </div>
//         <div class="tdp-ev-action-title">${ev.actionTitle}</div>
//         <div class="tdp-ev-file">${tdFIcon(ev.file)} ${ev.file}</div>
//         <div class="tdp-ev-meta">By ${ev.uploadedBy} · ${ev.date}</div>
//       </div>`).join('')}
//   </div>`;
// }

// window.tdCloseActEdit = function() {
//   const panel = document.getElementById('tdp-act-edit-panel');
//   if (panel) panel.innerHTML = '';
//   document.querySelectorAll('.tdp-act-id').forEach(el => el.classList.remove('tdp-act-id-active'));
// };

// window.tdActStatusChange = function(actId, sel) {
//   const noteEl = document.getElementById(`tdp-ae-status-note-${actId}`);
//   if (!noteEl) return;
//   const notes = {
//     'Close':                  { bg:'#dcfce7', color:'#166534', icon:'✓', text:'This action will be marked as <strong>Closed</strong> and locked for further editing upon submit.' },
//     'Ask for Clarification':  { bg:'#fef9c3', color:'#854d0e', icon:'?', text:'A clarification request will be sent to the assignee. Action stays open until resolved.' },
//     'Ask for Closure':        { bg:'#e0f2fe', color:'#0369a1', icon:'📬', text:'A closure request will be sent to your reviewer for approval before the action is closed.' },
//     'Ask for Review':         { bg:'#ede9fe', color:'#5b21b6', icon:'👁', text:'The action will be escalated to your reviewer. They will be notified to review and respond.' },
//   };
//   const n = notes[sel.value];
//   if (n && sel.value) {
//     noteEl.style.display = 'block';
//     noteEl.style.background = n.bg;
//     noteEl.style.color = n.color;
//     noteEl.innerHTML = `<span style="font-weight:700;font-size:15px">${n.icon}</span> ${n.text}`;
//   } else {
//     noteEl.style.display = 'none';
//   }
// };

// window.tdActAddEvToggle = function(actId) {
//   const f = document.getElementById(`tdp-ae-add-${actId}`);
//   if (f) f.style.display = f.style.display === 'none' ? 'block' : 'none';
// };

// window.tdActSaveEv = function(taskId, actId) {
//   const actions = getActions(taskId);
//   const act     = actions.find(a => a.id === actId); if (!act) return;
//   const file    = document.getElementById(`tdp-ae-evfile-${actId}`)?.value.trim();
//   if (!file) { if (typeof showToast === 'function') showToast('Enter a file or link', 'warning'); return; }
//   if (!act.evidence) act.evidence = [];
//   act.evidence.push({
//     id: `EV-${Date.now().toString().slice(-5)}`,
//     type: document.getElementById(`tdp-ae-evtype-${actId}`)?.value || 'Document',
//     file,
//     actionTitle: act.name,
//     status: 'Pending Review',
//     uploadedBy: 'You',
//     date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
//   });
//   const listEl = document.getElementById(`tdp-ae-evlist-${actId}`);
//   if (listEl) listEl.innerHTML = tdRenderActEvidence(act);
//   tdActAddEvToggle(actId);
//   if (typeof showToast === 'function') showToast('Evidence added ✓', 'success');
// };

// window.tdActSave = function(taskId, actId) {
//   const actions = getActions(taskId);
//   const act     = actions.find(a => a.id === actId); if (!act) return;
//   act.assignee = document.getElementById(`tdp-ae-assignee-${actId}`)?.value || act.assignee;
//   act._notes   = document.getElementById(`tdp-ae-notes-${actId}`)?.value || '';
//   if (typeof showToast === 'function') showToast(`Draft saved for ${actId}`, 'success');
// };

// window.tdActSubmit = function(taskId, actId) {
//   const actions = getActions(taskId);
//   const act     = actions.find(a => a.id === actId); if (!act) return;
//   const selVal  = document.getElementById(`tdp-ae-status-${actId}`)?.value;
//   act.assignee  = document.getElementById(`tdp-ae-assignee-${actId}`)?.value || act.assignee;
//   act._notes    = document.getElementById(`tdp-ae-notes-${actId}`)?.value   || '';
//   if (selVal === 'Close') act.status = 'Complete';
//   else if (selVal === 'Ask for Clarification') act.status = 'In Progress';
//   else if (selVal) act.status = 'In Progress';
//   if (typeof showToast === 'function') showToast(`Action ${actId} submitted`, 'success');
//   tdCloseActEdit();
//   tdSwitchTab('actions');
// };

// /* ══════════════════════════════════════════════════════════════
//    PANE: EVIDENCE  (shows all evidence across all actions for this task)
//    — Action Title column shown, Notes column removed
//    ══════════════════════════════════════════════════════════════ */
// function tdPaneEvidence(t) {
//   const actions  = getActions(t.id);
//   const allEvs   = actions.flatMap(a => (a.evidence || []).map(ev => ({ ...ev, _actName: a.name })));
//   const sc = s  => s === 'Verified' ? '#10b981' : '#f59e0b';
//   const sb = s  => s === 'Verified' ? '#dcfce7' : '#fef9c3';

//   return `
//   <div class="tdp-inner">
//     <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
//       <div class="tdp-section-label" style="margin-bottom:0">
//         Evidence Documents
//         <span style="font-size:13px;font-weight:500;color:#64748b;text-transform:none;letter-spacing:0">
//           — ${allEvs.length} document${allEvs.length !== 1 ? 's' : ''} across ${actions.length} actions
//         </span>
//       </div>
//     </div>

//     <div class="tdp-ev-hint">
//       💡 To upload evidence for a specific action, open the action from the <strong>Actions tab</strong>.
//     </div>

//     ${!allEvs.length
//       ? `<div class="tdp-empty">
//            <div style="font-size:36px;margin-bottom:12px">📎</div>
//            <p>No evidence uploaded yet.<br>Upload evidence via the Actions tab.</p>
//          </div>`
//       : `<div class="tdp-tbl-wrap" style="margin-top:16px">
//            <table class="tdp-tbl">
//              <thead>
//                <tr>
//                  <th>Action Title</th>
//                  <th>Type</th>
//                  <th>File</th>
//                  <th>Uploaded By</th>
//                  <th>Date</th>
//                  <th>Status</th>
//                  <th></th>
//                </tr>
//              </thead>
//              <tbody>
//                ${allEvs.map(ev => `
//                  <tr>
//                    <td style="max-width:160px">
//                      <span class="tdp-act-name" style="font-size:13px">${ev.actionTitle || ev._actName || '—'}</span>
//                    </td>
//                    <td><span class="tdp-ev-type-chip">${ev.type}</span></td>
//                    <td style="font-size:13px">${tdFIcon(ev.file)} ${ev.file}</td>
//                    <td style="font-size:13px">${ev.uploadedBy}</td>
//                    <td style="font-size:13px;color:#64748b">${ev.date}</td>
//                    <td>
//                      <span class="tdp-ev-chip"
//                            style="background:${sb(ev.status)};color:${sc(ev.status)}">
//                        ${ev.status === 'Verified' ? '✓ ' : ''}${ev.status}
//                      </span>
//                    </td>
//                    <td>
//                      ${ev.status !== 'Verified'
//                        ? `<button class="tdp-btn tdp-btn-success tdp-btn-xs"
//                                   onclick="tdVerifyEv('${ev.id}','${t.id}')">Verify</button>`
//                        : `<span style="color:#10b981;font-size:12px;font-weight:700">✓</span>`}
//                    </td>
//                  </tr>`).join('')}
//              </tbody>
//            </table>
//          </div>`
//     }
//   </div>`;
// }

// /* ══════════════════════════════════════════════════════════════
//    PANE: COMMENTS
//    ══════════════════════════════════════════════════════════════ */
// function tdPaneComments(t) {
//   return `
//   <div class="tdp-inner">
//     <div class="tdp-section-label">Comments & Updates</div>
//     <div class="tdp-thread" id="tdp-thread-${t.id}">
//       ${t._comments.map(c => tdCmtHTML(c)).join('')}
//     </div>
//     <div class="tdp-new-cmt">
//       <span class="tdp-av tdp-self-av">YO</span>
//       <div style="flex:1">
//         <textarea class="tdp-input" id="tdp-cmt-${t.id}" rows="3"
//                   placeholder="Add a comment, update, or question…"></textarea>
//         <div style="display:flex;justify-content:flex-end;margin-top:8px">
//           <button class="tdp-btn tdp-btn-primary" onclick="tdPostCmt('${t.id}')">Post Comment</button>
//         </div>
//       </div>
//     </div>
//   </div>`;
// }

// function tdCmtHTML(c) {
//   return `
//   <div class="tdp-cmt">
//     <span class="tdp-av">${tdInitials(c.author)}</span>
//     <div class="tdp-cmt-body">
//       <div class="tdp-cmt-meta">
//         <strong>${c.author}</strong>
//         <span class="tdp-cmt-role">${c.role}</span>
//         <span class="tdp-cmt-time">${c.time}</span>
//       </div>
//       <div class="tdp-cmt-text">${c.text}</div>
//     </div>
//   </div>`;
// }

// /* ══════════════════════════════════════════════════════════════
//    PANE: EDIT TASK
//    ══════════════════════════════════════════════════════════════ */
// function tdPaneEdit(t) {
//   const op = (arr, v) => arr.map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('');
//   return `
//   <div class="tdp-inner">
//     <div class="tdp-section-label">Edit Task</div>
//     <div class="tdp-fg-grid">
//       <div class="tdp-fg tdp-fg-full">
//         <label class="tdp-fld-label">Task Title</label>
//         <input class="tdp-input" id="tde-title" value="${t.title}">
//       </div>
//       <div class="tdp-fg">
//         <label class="tdp-fld-label">Department</label>
//         <select class="tdp-input" id="tde-dept">
//           ${op(['IT','Risk','Compliance','Legal','Finance','Operations','HR','Procurement'], t.department)}
//         </select>
//       </div>
//       <div class="tdp-fg">
//         <label class="tdp-fld-label">Assigned To</label>
//         <input class="tdp-input" id="tde-assignee" value="${t.assignee || ''}">
//       </div>
//       <div class="tdp-fg">
//         <label class="tdp-fld-label">Due Date</label>
//         <input class="tdp-input" type="date" id="tde-due" value="${t.dueDate || ''}">
//       </div>
//       <div class="tdp-fg">
//         <label class="tdp-fld-label">Priority</label>
//         <select class="tdp-input" id="tde-priority">
//           ${op(['Critical','High','Medium','Low'], t.priority)}
//         </select>
//       </div>
//       <div class="tdp-fg">
//         <label class="tdp-fld-label">Risk Level</label>
//         <select class="tdp-input" id="tde-risk">
//           ${op(['High','Medium','Low'], t.risk)}
//         </select>
//       </div>
//       <div class="tdp-fg">
//         <label class="tdp-fld-label">Status</label>
//         <select class="tdp-input" id="tde-status">
//           ${op(['Open','In Progress','Complete','Overdue'], t.status)}
//         </select>
//       </div>
//       <div class="tdp-fg">
//         <label class="tdp-fld-label">Clause Reference</label>
//         <input class="tdp-input" id="tde-clause" value="${t.clauseRef || ''}">
//       </div>
//     </div>
//     <div class="tdp-edit-foot">
//       <button class="tdp-btn tdp-btn-ghost" onclick="tdSwitchTab('overview')">Cancel</button>
//       <button class="tdp-btn tdp-btn-primary" onclick="tdSaveEdit('${t.id}')">Save Changes</button>
//     </div>
//   </div>`;
// }

// /* ── ACTION HANDLERS ──────────────────────────────────────────── */
// window.tdSetStatus = function(sel, taskId) {
//   const tasks = getTasks();
//   const t = tasks.find(t => t.id === taskId); if (!t) return;
//   t.status = sel.value;
//   const c = ({ Complete:'#10b981', 'In Progress':'#f59e0b', Overdue:'#ef4444', Open:'#6366f1' })[sel.value] || '#64748b';
//   sel.style.color = c; sel.style.borderColor = c + '44'; sel.style.background = c + '10';
//   if (typeof showToast === 'function') showToast(`Status → "${sel.value}"`, 'success');
// };

// window.tdSaveEdit = function(taskId) {
//   const tasks = getTasks();
//   const t = tasks.find(t => t.id === taskId); if (!t) return;
//   t.title      = document.getElementById('tde-title')?.value    || t.title;
//   t.department = document.getElementById('tde-dept')?.value     || t.department;
//   t.assignee   = document.getElementById('tde-assignee')?.value || t.assignee;
//   t.dueDate    = document.getElementById('tde-due')?.value      || t.dueDate;
//   t.priority   = document.getElementById('tde-priority')?.value || t.priority;
//   t.risk       = document.getElementById('tde-risk')?.value     || t.risk;
//   t.status     = document.getElementById('tde-status')?.value   || t.status;
//   t.clauseRef  = document.getElementById('tde-clause')?.value   || t.clauseRef;
//   if (typeof showToast === 'function') showToast(`Task ${taskId} saved`, 'success');
//   tdSwitchTab('overview');
// };

// window.tdVerifyEv = function(evId, taskId) {
//   const actions = getActions(taskId);
//   actions.forEach(act => {
//     const ev = (act.evidence || []).find(e => e.id === evId);
//     if (ev) { ev.status = 'Verified'; if (typeof showToast === 'function') showToast('Marked Verified ✓', 'success'); }
//   });
//   tdSwitchTab('evidence');
// };

// window.tdPostCmt = function(taskId) {
//   const tasks = getTasks();
//   const t = tasks.find(t => t.id === taskId);
//   const el = document.getElementById(`tdp-cmt-${taskId}`);
//   const text = el?.value.trim();
//   if (!text) { if (typeof showToast === 'function') showToast('Type something first', 'warning'); return; }
//   const c = { author:'You', role:'Current User', time:'just now', text };
//   t._comments.push(c);
//   const thread = document.getElementById(`tdp-thread-${taskId}`);
//   if (thread) {
//     const d = document.createElement('div');
//     d.innerHTML = tdCmtHTML(c);
//     const node = d.firstChild;
//     node.style.animation = 'tdpCmt .22s ease';
//     thread.appendChild(node);
//     el.value = '';
//     node.scrollIntoView({ behavior:'smooth', block:'nearest' });
//   }
//   if (typeof showToast === 'function') showToast('Comment posted', 'success');
// };

// /* ── HELPERS ──────────────────────────────────────────────────── */
// function tdr(lbl, val) {
//   return `<div class="tdp-drow">
//     <span class="tdp-dlbl">${lbl}</span>
//     <span class="tdp-dval">${val}</span>
//   </div>`;
// }

// function tdProg(lbl, done, total) {
//   const pct   = total ? Math.round(done / total * 100) : 100;
//   const color = pct === 100 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
//   return `
//   <div class="tdp-pi">
//     <div class="tdp-pi-top">
//       <span class="tdp-pi-lbl">${lbl}</span>
//       <span style="font-size:13px;font-weight:700;color:${color}">${done}/${total}</span>
//     </div>
//     <div class="tdp-pi-track">
//       <div style="height:100%;border-radius:99px;background:${color};width:${pct}%;transition:width .4s"></div>
//     </div>
//   </div>`;
// }

// function tdInitials(n) { return (n || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
// function tdFIcon(f='') {
//   const e = (f.split('.').pop() || '').toLowerCase();
//   return ({ pdf:'📄', zip:'🗜', xlsx:'📊', xls:'📊', docx:'📝', doc:'📝', png:'🖼', jpg:'🖼' })[e] || '📄';
// }
// function tdFmtDate(d) {
//   if (!d) return '—';
//   return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
// }

// /* ── STYLES ───────────────────────────────────────────────────── */
// function tdInjectStyles() {
//   if (document.getElementById('tdp-styles')) return;
//   const s = document.createElement('style');
//   s.id = 'tdp-styles';
//   s.textContent = `
//   @keyframes tdpIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
//   @keyframes tdpCmt { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }

//   /* ── SHELL ────────────────────────────────────────────────── */
//   .tds-full { width:100%; min-height:100%; }

//   .tdp-wrap {
//     display: flex; flex-direction: column; min-height: 100vh;
//     font-family: 'DM Sans', sans-serif;
//   }

//   /* ── HEADER ───────────────────────────────────────────────── */
//   .tdp-header {
//     padding: 20px 22px 16px;
//     border-bottom: 1px solid var(--border, #e2e8f0);
//     background: #fff;
//     position: sticky; top: 0; z-index: 20;
//     box-shadow: 0 1px 6px rgba(0,0,0,.06);
//   }
//   .tdp-hrow {
//     display: flex; align-items: flex-start; justify-content: space-between;
//     gap: 12px; margin-bottom: 12px;
//   }
//   .tdp-bc {
//     display: flex; align-items: center; gap: 6px;
//     font-size: 13px; margin-bottom: 6px;
//   }
//   .tdp-back {
//     color: #6366f1; font-weight: 700; cursor: pointer; font-size: 14px;
//   }
//   .tdp-back:hover { text-decoration: underline; }
//   .tdp-bc-sep { color: #cbd5e1; }
//   .tdp-bc-id  { font-family: monospace; font-size: 12px; color: #94a3b8; }
//   .tdp-title  {
//     font-size: 20px; font-weight: 800;
//     color: var(--text-primary, #0f172a); line-height: 1.3;
//   }
//   .tdp-x {
//     flex-shrink: 0; background: transparent;
//     border: 1px solid var(--border, #e2e8f0); color: #94a3b8;
//     border-radius: 7px; width: 32px; height: 32px; cursor: pointer;
//     font-size: 13px; display: flex; align-items: center; justify-content: center;
//     transition: all .15s;
//   }
//   .tdp-x:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; }

//   .tdp-chips {
//     display: flex; gap: 7px; flex-wrap: wrap; align-items: center;
//   }
//   .tdp-chip {
//     font-size: 12px; font-weight: 700; padding: 4px 11px;
//     border-radius: 99px; border: 1px solid transparent;
//   }
//   .tdp-ch-blue { background: #eef2ff; color: #4338ca; border-color: #c7d2fe; }
//   .tdp-ch-grey { background: #f1f5f9; color: #64748b; border-color: #e2e8f0; }
//   .tdp-ch-mono { background: #f1f5f9; color: #64748b; border-color: #e2e8f0; font-family: monospace; font-size: 11px; }
//   .tdp-st-sel  {
//     font-size: 13px; font-weight: 700; padding: 4px 10px;
//     border-radius: 7px; border: 1.5px solid; cursor: pointer; outline: none;
//     font-family: inherit; transition: all .15s;
//   }

//   /* ── BODY: vtabs + pane ───────────────────────────────────── */
//   .tdp-body { display: flex; flex: 1; min-height: 0; }

//   .tdp-vtabs {
//     width: 84px; flex-shrink: 0; display: flex; flex-direction: column;
//     gap: 2px; padding: 14px 6px;
//     border-right: 1px solid var(--border, #e2e8f0);
//     background: #f8fafc;
//   }
//   .tdp-vtab {
//     display: flex; flex-direction: column; align-items: center; gap: 4px;
//     padding: 11px 4px; border-radius: 8px; border: none; background: transparent;
//     cursor: pointer; color: #94a3b8; font-family: inherit;
//     font-size: 10px; font-weight: 700; text-transform: uppercase;
//     letter-spacing: .3px; transition: all .15s; text-align: center;
//   }
//   .tdp-vtab:hover { background: #fff; color: #475569; }
//   .tdp-vtab.active { background: #eef2ff; color: #4338ca; }
//   .tdp-vt-icon { font-size: 18px; line-height: 1; }
//   .tdp-vt-lbl  { line-height: 1.2; font-size: 10px; }

//   .tdp-pane {
//     flex: 1; overflow-y: auto; animation: tdpIn .2s ease;
//     background: #fafbff;
//   }
//   .tdp-pane::-webkit-scrollbar { width: 4px; }
//   .tdp-pane::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

//   .tdp-inner { padding: 22px 24px 48px; }

//   /* ── TYPOGRAPHY ───────────────────────────────────────────── */
//   .tdp-section-label {
//     font-size: 11px; font-weight: 800; text-transform: uppercase;
//     letter-spacing: .08em; color: #94a3b8;
//     margin-bottom: 14px;
//     display: flex; align-items: center; gap: 10px;
//   }
//   .tdp-section-label::after {
//     content: ''; flex: 1; height: 1px; background: var(--border, #e2e8f0);
//   }

//   /* ── DETAIL LIST ──────────────────────────────────────────── */
//   .tdp-dl { display: flex; flex-direction: column; gap: 2px; }
//   .tdp-drow {
//     display: flex; align-items: baseline; gap: 12px;
//     padding: 8px 10px; border-radius: 7px; transition: background .1s;
//   }
//   .tdp-drow:hover { background: #f1f5f9; }
//   .tdp-dlbl { font-size: 12px; font-weight: 700; color: #94a3b8; min-width: 90px; flex-shrink: 0; }
//   .tdp-dval { font-size: 14px; font-weight: 500; color: var(--text-primary, #0f172a); }
//   .tdp-link { color: #6366f1; cursor: pointer; font-weight: 600; }
//   .tdp-link:hover { text-decoration: underline; }
//   .tdp-code {
//     font-family: monospace; font-size: 12px;
//     background: #eef2ff; color: #4338ca;
//     border: 1px solid #c7d2fe; padding: 2px 8px; border-radius: 5px;
//   }

//   /* ── PROGRESS STRIP ───────────────────────────────────────── */
//   .tdp-prog-strip {
//     display: grid; grid-template-columns: repeat(3,1fr); gap: 12px;
//     background: #fff; border: 1px solid var(--border, #e2e8f0);
//     border-radius: 10px; padding: 16px;
//   }
//   .tdp-pi-top {
//     display: flex; justify-content: space-between; margin-bottom: 6px;
//   }
//   .tdp-pi-lbl {
//     font-size: 12px; font-weight: 700; text-transform: uppercase;
//     letter-spacing: .04em; color: #94a3b8;
//   }
//   .tdp-pi-track {
//     height: 5px; background: #e2e8f0; border-radius: 99px; overflow: hidden;
//   }

//   /* ── TABLE ────────────────────────────────────────────────── */
//   .tdp-tbl-wrap {
//     overflow-x: auto; border: 1px solid var(--border, #e2e8f0);
//     border-radius: 10px;
//     background: #fff;
//   }
//   .tdp-tbl { width: 100%; border-collapse: collapse; font-size: 14px; }
//   .tdp-tbl thead tr { background: #f8fafc; }
//   .tdp-tbl th {
//     padding: 11px 14px; text-align: left;
//     font-size: 11px; font-weight: 800; text-transform: uppercase;
//     letter-spacing: .06em; color: #94a3b8;
//     border-bottom: 1px solid var(--border, #e2e8f0); white-space: nowrap;
//   }
//   .tdp-tbl td {
//     padding: 12px 14px; border-bottom: 1px solid #f1f5f9;
//     color: var(--text-primary, #0f172a); vertical-align: middle;
//   }
//   .tdp-tbl tbody tr:last-child td { border-bottom: none; }
//   .tdp-tbl tbody tr:hover td { background: #f8fafc; }

//   /* Act ID clickable link */
//   .tdp-act-id {
//     font-family: monospace; font-size: 12px; font-weight: 800; color: #6366f1;
//     cursor: pointer; background: #eef2ff; border: 1px solid #c7d2fe;
//     padding: 4px 9px; border-radius: 6px; display: inline-block;
//     transition: all .15s; white-space: nowrap;
//   }
//   .tdp-act-id:hover, .tdp-act-id-active {
//     background: #6366f1; color: #fff; border-color: #6366f1;
//   }
//   .tdp-act-name  { font-weight: 600; font-size: 14px; }
//   .tdp-act-oblig { font-size: 13px; color: #64748b; max-width: 200px; line-height: 1.4; }

//   .tdp-assignee-cell { display: flex; align-items: center; gap: 7px; font-size: 13px; }
//   .tdp-av {
//     width: 28px; height: 28px; border-radius: 50%;
//     background: #eef2ff; color: #4338ca;
//     font-size: 10px; font-weight: 800;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0; border: 1px solid #c7d2fe;
//   }
//   .tdp-self-av { background: #1e293b; color: #fff; border-color: #1e293b; }

//   .tdp-dept-tag {
//     font-size: 11px; font-weight: 600; padding: 3px 9px;
//     background: #f1f5f9; color: #475569; border-radius: 5px;
//   }
//   .tdp-status-pill {
//     font-size: 12px; font-weight: 700; padding: 4px 11px; border-radius: 99px;
//     display: inline-block;
//   }

//   /* ── ACTION EDIT CARD ─────────────────────────────────────── */
//   .tdp-act-edit-card {
//     margin-top: 20px;
//     background: #fff; border: 1.5px solid #c7d2fe;
//     border-radius: 14px; overflow: hidden;
//     box-shadow: 0 4px 20px rgba(99,102,241,.12);
//     animation: tdpIn .22s ease;
//   }
//   .tdp-act-edit-head {
//     display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
//     padding: 20px 22px 16px;
//     border-bottom: 1px solid #e8eaf6;
//     background: #fafbff;
//   }
//   .tdp-act-edit-title {
//     font-size: 17px; font-weight: 800; color: var(--text-primary, #0f172a);
//     line-height: 1.35;
//   }
//   .tdp-act-edit-body {
//     display: grid; grid-template-columns: 1fr 1fr; gap: 0;
//     min-height: 360px;
//   }
//   .tdp-act-edit-left {
//     padding: 22px; border-right: 1px solid var(--border, #e2e8f0);
//   }
//   .tdp-act-edit-right {
//     padding: 22px;
//     background: #fafbff;
//   }
//   .tdp-act-edit-footer {
//     display: flex; gap: 10px; justify-content: flex-end;
//     padding: 16px 22px; border-top: 1px solid var(--border, #e2e8f0);
//     background: #f8fafc;
//   }

//   /* Read-only grid */
//   .tdp-readonly-grid {
//     display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
//   }
//   .tdp-ro-item { background: #f8fafc; border-radius: 8px; padding: 10px 12px; }
//   .tdp-ro-full { grid-column: 1 / -1; }
//   .tdp-ro-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
//   .tdp-ro-value { font-size: 13px; font-weight: 500; color: var(--text-primary, #0f172a); }
//   .tdp-oblig-text { font-size: 13px; line-height: 1.55; }

//   /* Editable fields */
//   .tdp-field-section-label {
//     font-size: 11px; font-weight: 800; text-transform: uppercase;
//     letter-spacing: .07em; color: #94a3b8; margin-bottom: 12px;
//     display: flex; align-items: center; gap: 8px;
//   }
//   .tdp-edit-fields { display: flex; flex-direction: column; gap: 12px; }
//   .tdp-fg { display: flex; flex-direction: column; gap: 5px; }
//   .tdp-fg-full { grid-column: 1 / -1; }
//   .tdp-fg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//   .tdp-fld-label {
//     font-size: 12px; font-weight: 700; color: #64748b;
//     text-transform: uppercase; letter-spacing: .05em;
//   }
//   .tdp-input {
//     background: #fff; border: 1px solid var(--border, #e2e8f0);
//     border-radius: 8px; color: var(--text-primary, #0f172a);
//     font-family: inherit; font-size: 14px; padding: 9px 12px; outline: none;
//     width: 100%; transition: border-color .18s, box-shadow .18s;
//   }
//   .tdp-input:focus {
//     border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.1);
//   }
//   textarea.tdp-input { resize: vertical; min-height: 72px; }
//   .tdp-input[readonly] { cursor: default; }

//   /* Status action note */
//   .tdp-status-note {
//     margin-top: 10px; padding: 11px 14px; border-radius: 8px;
//     font-size: 13px; line-height: 1.55; display: flex; gap: 10px; align-items: flex-start;
//   }

//   /* ── EVIDENCE ─────────────────────────────────────────────── */
//   .tdp-add-ev {
//     background: #fafbff; border: 1px solid #c7d2fe;
//     border-radius: 9px; padding: 14px; margin-bottom: 12px;
//   }
//   .tdp-ev-empty {
//     text-align: center; padding: 32px 16px;
//     color: #94a3b8; font-size: 14px; line-height: 1.6;
//   }
//   .tdp-ev-card {
//     background: #fff; border: 1px solid var(--border, #e2e8f0);
//     border-radius: 8px; padding: 12px 14px;
//     display: flex; flex-direction: column; gap: 5px;
//   }
//   .tdp-ev-card-head { display: flex; justify-content: space-between; align-items: center; }
//   .tdp-ev-action-title { font-size: 13px; font-weight: 700; color: var(--text-primary, #0f172a); }
//   .tdp-ev-file { font-size: 13px; color: #475569; }
//   .tdp-ev-meta { font-size: 12px; color: #94a3b8; }
//   .tdp-ev-type-chip {
//     font-size: 11px; font-weight: 600;
//     background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;
//     padding: 2px 8px; border-radius: 5px;
//   }
//   .tdp-ev-chip {
//     font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 99px;
//   }
//   .tdp-ev-hint {
//     background: #fef9c3; border: 1px solid #fde68a; border-radius: 8px;
//     padding: 10px 14px; font-size: 13px; color: #854d0e; line-height: 1.5;
//   }

//   /* ── COMMENTS ─────────────────────────────────────────────── */
//   .tdp-thread { display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px; }
//   .tdp-cmt { display: flex; gap: 12px; align-items: flex-start; }
//   .tdp-cmt-body {
//     flex: 1; background: #fff; border: 1px solid var(--border, #e2e8f0);
//     border-radius: 4px 12px 12px 12px; padding: 12px 14px;
//   }
//   .tdp-cmt-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; flex-wrap: wrap; }
//   .tdp-cmt-meta strong { font-size: 14px; font-weight: 700; }
//   .tdp-cmt-role { font-size: 12px; color: #94a3b8; }
//   .tdp-cmt-time { font-size: 12px; color: #cbd5e1; margin-left: auto; }
//   .tdp-cmt-text { font-size: 14px; color: #475569; line-height: 1.6; }
//   .tdp-new-cmt { display: flex; gap: 12px; align-items: flex-start; padding-top: 14px; border-top: 1px solid var(--border, #e2e8f0); }

//   /* ── EDIT TASK ────────────────────────────────────────────── */
//   .tdp-edit-foot {
//     display: flex; gap: 10px; justify-content: flex-end;
//     margin-top: 20px; padding-top: 16px;
//     border-top: 1px solid var(--border, #e2e8f0);
//   }

//   /* ── BUTTONS ──────────────────────────────────────────────── */
//   .tdp-btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     font-family: inherit; font-size: 14px; font-weight: 600;
//     padding: 9px 18px; border-radius: 8px; border: none; cursor: pointer;
//     transition: all .15s; white-space: nowrap;
//   }
//   .tdp-btn-primary { background: #6366f1; color: #fff; }
//   .tdp-btn-primary:hover { background: #4f46e5; box-shadow: 0 4px 12px rgba(99,102,241,.3); }
//   .tdp-btn-ghost {
//     background: #fff; color: #475569;
//     border: 1px solid var(--border, #e2e8f0);
//   }
//   .tdp-btn-ghost:hover { background: #f8fafc; border-color: #94a3b8; }
//   .tdp-btn-success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
//   .tdp-btn-success:hover { background: #bbf7d0; }
//   .tdp-btn-sm  { padding: 6px 12px; font-size: 12px; }
//   .tdp-btn-xs  { padding: 4px 9px;  font-size: 11px; }

//   /* ── EMPTY STATE ──────────────────────────────────────────── */
//   .tdp-empty { text-align: center; padding: 40px 20px; color: #94a3b8; }
//   .tdp-empty p { font-size: 14px; line-height: 1.7; }

//   /* ── RESPONSIVE ───────────────────────────────────────────── */
//   @media (max-width: 820px) {
//     .tdp-act-edit-body { grid-template-columns: 1fr; }
//     .tdp-act-edit-left { border-right: none; border-bottom: 1px solid var(--border, #e2e8f0); }
//     .tdp-readonly-grid  { grid-template-columns: 1fr; }
//   }
//   `;
//   document.head.appendChild(s);
// }

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
            <span class="tdp-bc-id">${t.obligationId}</span>
            <span style="float:right;"><button class="tdp-hdr-btn" onclick="_tdShowInfoModal('${t.id}')">ⓘ Refer to more</button></span>
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

  return `
  <div class="tdp-inner">

    <div class="tdp-section-label">Obligation Details</div>
    <div class="tdp-dl" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px 20px;">
      ${tdr('Circular',    `<span class="tdp-link tdp-circ-clickable" onclick="_tdGoToAI('${t.circularId}')">${t.circularId}</span>`)}
      ${tdr('Assigned To', t.assignee || '—')}
      ${tdr('Due Date',    tdFmtDate(t.dueDate))}
      ${tdr('Issue Date',  t.issueDate || '—')}
      ${tdr('Priority',    t.priority  || '—')}
      ${tdr('Status',      `<span style="color:${sc(t.status)};font-weight:700">${t.status}</span>`)}
    </div>

    <!-- RAISE A REQUEST -->
    <div class="tdp-section-label" style="margin-top:28px">Raise a Request</div>
    <div class="tdp-action-row-card">
      <div class="tdp-action-row-inner">
        <div class="tdp-ar-field">
          <label class="tdp-ar-label">Request Type</label>
          <select class="tdp-input tdp-ar-sel" id="tdp-ar-type-${t.id}" onchange="_tdArChange('${t.id}',this)">
            <option value="">— Select type —</option>
            <option value="Ask for Clarification">Ask for Clarification</option>
            ${document.body?.dataset?.userRole === 'assignee' ? '' : '<option value="Update">Update</option>'}
            <option value="Ask for Closure">Ask for Closure</option>
            ${document.body?.dataset?.userRole === 'assignee' ? '' : '<option value="Ask for Open">Ask for Open</option>'}
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
        <div class="tdp-ar-field tdp-ar-field-grow">
          <label class="tdp-ar-label">Note (optional)</label>
          <input class="tdp-input" id="tdp-ar-note-${t.id}" placeholder="Add a brief note…"/>
        </div>
        <button class="tdp-btn tdp-btn-primary" style="align-self:flex-end"
                onclick="_tdArSubmit('${t.id}')">Send →</button>
      </div>
      <div class="tdp-ar-status-note" id="tdp-ar-note-disp-${t.id}" style="display:none"></div>
    </div>

    <!-- WORKFLOW -->
    <div class="tdp-section-label" style="margin-top:28px">Workflow</div>
    <div class="tdp-wf-details-card">

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

  </div>`;
}
/* ══════════════════════════════════════════════════════════════
   PANE: EVIDENCE
   Shows obligation title (not action title), no Notes column
   ══════════════════════════════════════════════════════════════ */
function tdPaneEvidence(t) {
  // Collect all evidence from all actions, using obligation title
  const actions = getActions(t.id);
  const allEvs = actions.flatMap(a => (a.evidence || []).map(ev => ({
    ...ev,
    obligationTitle: t.title   // use obligation title, not action title
  })));
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
    </div>

    ${!allEvs.length
      ? `<div class="tdp-empty">
           <div style="font-size:36px;margin-bottom:12px">📎</div>
           <p>No evidence uploaded yet.</p>
         </div>`
      : `<div class="tdp-tbl-wrap" style="margin-top:4px">
           <table class="tdp-tbl">
             <thead>
               <tr>
                 <th>Obligation</th>
                 <th>Type</th>
                 <th>File</th>
                 <th>Uploaded By</th>
                 <th>Date</th>
                 <th>Status</th>
                 <th></th>
               </tr>
             </thead>
             <tbody>
               ${allEvs.map(ev => `
                 <tr>
                   <td style="max-width:180px">
                     <span style="font-size:13px;font-weight:600;color:#1e293b;line-height:1.4;display:block">
                       ${ev.obligationTitle}
                     </span>
                   </td>
                   <td><span class="tdp-ev-type-chip">${ev.type}</span></td>
                   <td style="font-size:13px">${tdFIcon(ev.file)} ${ev.file}</td>
                   <td style="font-size:13px">${ev.uploadedBy}</td>
                   <td style="font-size:13px;color:#64748b">${ev.date}</td>
                   <td>
                     <span class="tdp-ev-chip"
                           style="background:${sb(ev.status)};color:${sc(ev.status)}">
                       ${ev.status === 'Verified' ? '✓ ' : ''}${ev.status}
                     </span>
                   </td>
                   <td>
                     ${ev.status !== 'Verified'
          ? `<button class="tdp-btn tdp-btn-success tdp-btn-xs"
                                  onclick="tdVerifyEv('${ev.id}','${t.id}')">Verify</button>`
          : `<span style="color:#10b981;font-size:12px;font-weight:700">✓</span>`}
                   </td>
                 </tr>`).join('')}
             </tbody>
           </table>
         </div>`
    }
  </div>`;
}

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

window._tdArSubmit = function (taskId) {
  const type = document.getElementById(`tdp-ar-type-${taskId}`)?.value;
  const person = document.getElementById(`tdp-ar-person-${taskId}`)?.value;
  if (!type) { if (typeof showToast === 'function') showToast('Select a request type', 'warning'); return; }
  if (!person) { if (typeof showToast === 'function') showToast('Select a person to send to', 'warning'); return; }
  if (typeof showToast === 'function') showToast(`"${type}" sent to ${person} ✓`, 'success');
  document.getElementById(`tdp-ar-type-${taskId}`).value = '';
  document.getElementById(`tdp-ar-person-${taskId}`).value = '';
  const note = document.getElementById(`tdp-ar-note-${taskId}`); if (note) note.value = '';
  const disp = document.getElementById(`tdp-ar-note-disp-${taskId}`); if (disp) disp.style.display = 'none';
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
  .tdp-vtab { display:flex;flex-direction:column;align-items:center;gap:4px;padding:11px 4px;border-radius:8px;border:none;background:transparent;cursor:pointer;color:#94a3b8;font-family:inherit;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;transition:all .15s;text-align:center; }
  .tdp-vtab:hover { background:#fff;color:#475569; }
  .tdp-vtab.active { background:#eef2ff;color:#4338ca; }
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