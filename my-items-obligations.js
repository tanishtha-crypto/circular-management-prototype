// /**
//  * task-management.js — CMS Circular Management System
//  * Renders task list (table & card view), add task modal, status updates.
//  */

// let taskView = 'table';  // 'table' | 'card'
// let taskFilters = { status: '', department: '', search: '' };

// /** Entry point */
// function renderMyItemsObligations() {
//   const area = document.getElementById('content-area');
//   area.innerHTML = buildTaskManagementHTML();
//   initTaskListeners();
//   renderTasks();
// }

// /* ================================================================
//    BUILD HTML
//    ================================================================ */
// function buildTaskManagementHTML() {
//   const depts = [...new Set(CMS_DATA.tasks.map(t => t.department))].sort();

//   return `
//   <div class="fade-in">
//     <!-- TOOLBAR -->
//     <div class="task-toolbar">
//       <div class="task-toolbar-left">
//         <input type="text" class="form-control" id="task-search" placeholder="🔍  Search tasks..." style="max-width:220px"/>
//         <select class="form-control" id="task-filter-status">
//           <option value="">All Statuses</option>
//           <option>Open</option>
//           <option>In Progress</option>
//           <option>Complete</option>
//           <option>Overdue</option>
//         </select>
//         <select class="form-control" id="task-filter-dept">
//           <option value="">All Departments</option>
//           ${depts.map(d => `<option>${d}</option>`).join('')}
//         </select>
//         <button class="btn btn-ghost btn-sm" id="clear-task-filters">Clear</button>
//       </div>
//       <div style="display:flex;gap:10px;align-items:center">
//         <span id="task-count" class="text-xs text-muted"></span>
//         <div class="view-toggle">
//           <button class="view-toggle-btn ${taskView === 'table' ? 'active' : ''}" data-view="table">≡ Table</button>
//           <button class="view-toggle-btn ${taskView === 'card' ? 'active' : ''}" data-view="card">⊞ Cards</button>
//         </div>
//         <button class="btn btn-primary" id="add-task-btn">+ Add Task</button>
//       </div>
//     </div>

//     <!-- TASK CONTENT -->
//     <div id="task-content"></div>
//   </div>
//   `;
// }

// /* ================================================================
//    RENDER TASKS
//    ================================================================ */
// function renderTasks() {
//   const content = document.getElementById('task-content');
//   if (!content) return;

//   let tasks = [...CMS_DATA.tasks];

//   // Apply filters
//   if (taskFilters.search) {
//     const s = taskFilters.search.toLowerCase();
//     tasks = tasks.filter(t =>
//       t.title.toLowerCase().includes(s) ||
//       t.id.toLowerCase().includes(s) ||
//       t.department.toLowerCase().includes(s) ||
//       t.clauseRef.toLowerCase().includes(s)
//     );
//   }
//   if (taskFilters.status) tasks = tasks.filter(t => t.status === taskFilters.status);
//   if (taskFilters.department) tasks = tasks.filter(t => t.department === taskFilters.department);

//   const countEl = document.getElementById('task-count');
//   if (countEl) countEl.textContent = `${tasks.length} tasks`;

//   if (tasks.length === 0) {
//     content.innerHTML = `
//       <div class="empty-state">
//         <div class="empty-state-icon">◉</div>
//         <div class="empty-state-text">No tasks match your filters</div>
//         <div class="empty-state-sub">Try clearing filters or adding a new task.</div>
//       </div>`;
//     return;
//   }

//   if (taskView === 'table') {
//     content.innerHTML = buildTaskTable(tasks);
//     bindStatusDropdowns();
//   } else {
//     content.innerHTML = buildTaskCards(tasks);
//     bindStatusDropdowns();
//   }
// }

// /* ================================================================
//    TABLE VIEW
//    ================================================================ */
// function buildTaskTable(tasks) {
//   return `
//   <div class="table-card">
//     <div class="table-wrapper">
//       <table>
//         <thead>
//           <tr>
//             <th>Action ID</th>
//             <th>Obligation</th>
//             <th>Circular</th>
//             <th>Clause</th>
//             <th>Department</th>
//             <th>Assign To</th>
//             <th>Due Date</th>
          
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${tasks.map(t => `
//           <tr>
           
  
//             <td> <span class="text-accent font-bold task-id-link"
//        onclick="openTaskDetail('${t.id}')" style="cursor:pointer;text-decoration:underline dotted;">
//        ${t.id}
//      </span></td>
//             <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${t.title}">${t.title}</td>
//             <td>
//               <a onclick="window.CMS.navigateTo('circular-library','${t.circularId}')" 
//                  style="color:var(--accent);font-size:12px;cursor:pointer;font-weight:600">
//                 ${t.circularId}
//               </a>
//             </td>
//             <td><code style="font-size:11px;background:var(--bg);padding:2px 6px;border-radius:4px">${t.clauseRef}</code></td>
//             <td><span class="task-dept-chip">${t.department}</span></td>
//             <td style="font-size:12px">${t.assignee}</td>
//             <td style="font-size:12px">${formatDate(t.dueDate)}</td>
           
//             <td>
//               <select class="status-select ${statusSelectClass(t.status)}" 
//                       data-task-id="${t.id}" onchange="handleStatusChange(this)">
//                 <option value="Open"        ${t.status === 'Open' ? 'selected' : ''}>Open</option>
//                 <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
//                 <option value="Complete"    ${t.status === 'Complete' ? 'selected' : ''}>Complete</option>
//                 <option value="Overdue"     ${t.status === 'Overdue' ? 'selected' : ''}>Overdue</option>
//               </select>
//             </td>
//           </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </div>
//   </div>`;
// }

// /* ================================================================
//    CARD VIEW
//    ================================================================ */
// function buildTaskCards(tasks) {
//   return `
//   <div class="task-cards-grid">
//     ${tasks.map(t => `
//     <div class="task-card risk-${t.risk.toLowerCase()}">
//       <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
//         <span class="text-xs text-muted font-bold">${t.id}</span>
//         <span class="risk-badge risk-${t.risk.toLowerCase()}">${t.risk}</span>
//       </div>
//       <div class="task-card-title">${t.title}</div>
//       <div class="task-card-meta">
//         <span class="task-dept-chip">${t.department}</span>
//         <code style="font-size:10px;background:var(--bg);padding:2px 6px;border-radius:4px;border:1px solid var(--border)">${t.clauseRef}</code>
//         <span style="font-size:10px;color:var(--text-muted)">📅 ${formatDate(t.dueDate)}</span>
//       </div>
//       <div style="font-size:11px;color:var(--text-secondary);margin-bottom:10px">
//         👤 ${t.assignee} &nbsp;·&nbsp;
//         <a onclick="window.CMS.navigateTo('circular-library','${t.circularId}')" 
//            style="color:var(--accent);cursor:pointer">${t.circularId}</a>
//       </div>
//       <div class="task-card-footer">
//         <span class="risk-badge ${priorityClass(t.priority)}">${t.priority}</span>
//         <select class="status-select ${statusSelectClass(t.status)}"
//                 data-task-id="${t.id}" onchange="handleStatusChange(this)" style="font-size:11px">
//           <option value="Open"        ${t.status === 'Open' ? 'selected' : ''}>Open</option>
//           <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
//           <option value="Complete"    ${t.status === 'Complete' ? 'selected' : ''}>Complete</option>
//           <option value="Overdue"     ${t.status === 'Overdue' ? 'selected' : ''}>Overdue</option>
//         </select>
//       </div>
//     </div>
//     `).join('')}
//   </div>`;
// }

// /* ================================================================
//    STATUS CHANGE HANDLER — Updates data & refreshes dashboard
//    ================================================================ */
// function handleStatusChange(selectEl) {
//   const taskId = selectEl.dataset.taskId;
//   const newStatus = selectEl.value;

//   // Update in-memory data
//   CMS_DATA.updateTaskStatus(taskId, newStatus);

//   // Style the select
//   selectEl.className = `status-select ${statusSelectClass(newStatus)}`;

//   // Refresh dashboard metrics if dashboard is visible
//   const dashboardArea = document.querySelector('.metrics-grid');
//   if (dashboardArea) refreshDashboardMetrics();

//   // Show toast
//   showToast(`Task ${taskId} updated to "${newStatus}"`, 'success');
// }

// function bindStatusDropdowns() {
//   // Already bound via inline onchange handlers
// }

// /* ================================================================
//    ADD TASK MODAL
//    ================================================================ */
// function openAddTaskModal() {
//   const modal = document.getElementById('generic-modal');
//   const box = document.getElementById('generic-modal-box');
//   const title = document.getElementById('generic-modal-title');
//   const body = document.getElementById('generic-modal-body');

//   box.style.maxWidth = '600px';
//   title.textContent = '+ Add New Task';

//   const circularOptions = CMS_DATA.circulars.map(c =>
//     `<option value="${c.id}">${c.id} – ${c.title}</option>`
//   ).join('');

//   body.innerHTML = `
//   <div class="form-grid-2">
//     <div class="form-group" style="grid-column:span 2">
//       <label class="form-label">Task Title *</label>
//       <input type="text" class="form-control" id="new-task-title" placeholder="Enter task title..."/>
//     </div>
//     <div class="form-group">
//       <label class="form-label">Circular Reference *</label>
//       <select class="form-control" id="new-task-circular">
//         <option value="">Select circular...</option>
//         ${circularOptions}
//       </select>
//     </div>
//     <div class="form-group">
//       <label class="form-label">Clause Reference</label>
//       <input type="text" class="form-control" id="new-task-clause" placeholder="e.g. C1.1"/>
//     </div>
//     <div class="form-group">
//       <label class="form-label">Department *</label>
//       <select class="form-control" id="new-task-dept">
//         <option value="">Select department...</option>
//         <option>IT</option><option>Risk</option><option>Compliance</option>
//         <option>Legal</option><option>Finance</option><option>Operations</option>
//         <option>HR</option><option>Procurement</option>
//       </select>
//     </div>
//     <div class="form-group">
//   <label class="form-label">Department Head</label>
//   <select class="form-control" id="new-task-assignee">
//     <option value="">Select Assignee</option>
//     <option value="Rahul Sharma">Rahul Sharma</option>
//     <option value="Anita Verma">Anita Verma</option>
//     <option value="Vikram Singh">Vikram Singh</option>
//     <option value="Neha Patel">Neha Patel</option>
//   </select>
// </div>
//     <div class="form-group">
//       <label class="form-label">Due Date *</label>
//       <input type="date" class="form-control" id="new-task-due"/>
//     </div>
//     <div class="form-group">
//       <label class="form-label">Priority</label>
//       <select class="form-control" id="new-task-priority">
//         <option>High</option><option>Medium</option><option>Low</option><option>Critical</option>
//       </select>
//     </div>
//     <div class="form-group">
//       <label class="form-label">Risk Level</label>
//       <select class="form-control" id="new-task-risk">
//         <option>High</option><option>Medium</option><option>Low</option>
//       </select>
//     </div>
//     <div class="form-group">
//       <label class="form-label">Status</label>
//       <select class="form-control" id="new-task-status">
//         <option>Open</option><option>In Progress</option><option>Complete</option>
//       </select>
//     </div>
//   </div>
//   <div class="form-actions">
//     <button class="btn btn-ghost" onclick="document.getElementById('generic-modal').classList.add('hidden')">Cancel</button>
//     <button class="btn btn-primary" id="save-task-btn">Save Task</button>
//   </div>
//   `;

//   modal.classList.remove('hidden');

//   document.getElementById('save-task-btn').addEventListener('click', saveNewTask);
// }

// function saveNewTask() {
//   const title = document.getElementById('new-task-title').value.trim();
//   const circId = document.getElementById('new-task-circular').value;
//   const dept = document.getElementById('new-task-dept').value;
//   const due = document.getElementById('new-task-due').value;

//   if (!title || !circId || !dept || !due) {
//     showToast('Please fill in all required fields (*).', 'warning');
//     return;
//   }

//   const newTask = {
//     id: `TSK-${String(CMS_DATA.tasks.length + 1).padStart(3, '0')}`,
//     title,
//     circularId: circId,
//     clauseRef: document.getElementById('new-task-clause').value || 'TBD',
//     department: dept,
//     dueDate: due,
//     priority: document.getElementById('new-task-priority').value,
//     risk: document.getElementById('new-task-risk').value,
//     status: document.getElementById('new-task-status').value,
//     assignee: document.getElementById('new-task-assignee').value || 'Unassigned'
//   };

//   CMS_DATA.tasks.push(newTask);
//   document.getElementById('generic-modal').classList.add('hidden');
//   renderTasks();
//   showToast(`Task "${newTask.id}" created successfully!`, 'success');
// }

// /* ================================================================
//    LISTENERS
//    ================================================================ */
// function initTaskListeners() {
//   // Search
//   const searchInput = document.getElementById('task-search');
//   if (searchInput) {
//     searchInput.addEventListener('input', () => {
//       taskFilters.search = searchInput.value.trim();
//       renderTasks();
//     });
//   }

//   // Status filter
//   const statusFilter = document.getElementById('task-filter-status');
//   if (statusFilter) {
//     statusFilter.addEventListener('change', () => {
//       taskFilters.status = statusFilter.value;
//       renderTasks();
//     });
//   }

//   // Dept filter
//   const deptFilter = document.getElementById('task-filter-dept');
//   if (deptFilter) {
//     deptFilter.addEventListener('change', () => {
//       taskFilters.department = deptFilter.value;
//       renderTasks();
//     });
//   }

//   // Clear
//   const clearBtn = document.getElementById('clear-task-filters');
//   if (clearBtn) {
//     clearBtn.addEventListener('click', () => {
//       taskFilters = { status: '', department: '', search: '' };
//       document.getElementById('task-search').value = '';
//       document.getElementById('task-filter-status').value = '';
//       document.getElementById('task-filter-dept').value = '';
//       renderTasks();
//     });
//   }

//   // View toggle
//   document.querySelectorAll('.view-toggle-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//       taskView = btn.dataset.view;
//       document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');
//       renderTasks();
//     });
//   });

//   // Add Task
//   const addBtn = document.getElementById('add-task-btn');
//   if (addBtn) addBtn.addEventListener('click', openAddTaskModal);
// }

// /* ================================================================
//    HELPERS
//    ================================================================ */
// function statusSelectClass(status) {
//   const map = {
//     'Open': 'open', 'In Progress': 'inprogress',
//     'Complete': 'complete', 'Overdue': 'overdue'
//   };
//   return map[status] || 'open';
// }

// function priorityClass(p) {
//   const map = { 'Critical': 'risk-high', 'High': 'risk-high', 'Medium': 'risk-medium', 'Low': 'risk-low' };
//   return map[p] || '';
// }

// function formatDate(dateStr) {
//   if (!dateStr) return '—';
//   const d = new Date(dateStr);
//   return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
// }

// function showToast(msg, type) {
//   const colors = { success: '#10b981', warning: '#f59e0b', info: '#4f7cff' };
//   const t = document.createElement('div');
//   t.textContent = msg;
//   t.style.cssText = `
//     position:fixed;bottom:24px;right:24px;z-index:9999;
//     background:${colors[type] || '#4f7cff'};color:#fff;
//     padding:10px 18px;border-radius:8px;
//     font-size:13px;font-weight:600;
//     box-shadow:0 4px 16px rgba(0,0,0,.2);
//     animation:fadeIn 0.3s ease;max-width:380px;
//   `;
//   document.body.appendChild(t);
//   setTimeout(() => t.remove(), 2500);
// }
/**
 * task-management.js — CMS Circular Management System
 * Renders obligation list (table & card view), add task modal, status updates.
 * CHANGES: From/To date filters added; table shows Obligation ID + Obligation Name;
 *          Circular and Clause columns removed.
 */

/**
 * task-management.js — CMS Circular Management System
 * Renders obligation list (table & card view), add task modal, status updates.
 * CHANGES: From/To date filters added; table shows Obligation ID + Obligation Name;
 *          Circular and Clause columns removed.
 */

let taskView = 'table';  // 'table' | 'card'
let taskFilters = { status: '', department: '', search: '', from: '', to: '' };

/** Entry point */
function renderMyItemsObligations() {
  const area = document.getElementById('content-area');
  area.innerHTML = buildTaskManagementHTML();
  initTaskListeners();
  renderTasks();
}

/* ================================================================
   BUILD HTML
   ================================================================ */
function buildTaskManagementHTML() {
  const depts = [...new Set(CMS_DATA.tasks.map(t => t.department))].sort();

  return `
  <div class="fade-in">
    <div class="task-toolbar-wrap">

      <!-- ROW 1: Search · Status · Department · Clear · Count — full width single row -->
      <div class="tb-row tb-row-filters">
        <input  type="text"   class="form-control tb-search" id="task-search"
                placeholder="🔍  Search obligations…"/>
        <select class="form-control tb-select" id="task-filter-status">
          <option value="">All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Complete</option>
          <option>Overdue</option>
        </select>
        <select class="form-control tb-select" id="task-filter-dept">
          <option value="">All Departments</option>
          ${depts.map(d => `<option>${d}</option>`).join('')}
        </select>
        <button class="btn btn-ghost btn-sm tb-clear" id="clear-task-filters">✕ Clear</button>
        <span   id="task-count" class="tb-count"></span>
      </div>

      <!-- ROW 2: Date Range (left) · View Toggle (right) -->
      <div class="tb-row tb-row-date">
        <div class="tb-date-group">
          <span class="tb-date-label">Due Date</span>
          <span class="tb-date-field">
            <label class="tb-field-label">From</label>
            <input type="date" class="form-control tb-date-inp" id="task-filter-from"/>
          </span>
          <span class="tb-arrow">→</span>
          <span class="tb-date-field">
            <label class="tb-field-label">To</label>
            <input type="date" class="form-control tb-date-inp" id="task-filter-to"/>
          </span>
          <span class="tb-date-hint" id="task-date-hint"></span>
        </div>

        <div class="view-toggle">
          <button class="view-toggle-btn ${taskView === 'table' ? 'active' : ''}" data-view="table">≡ Table</button>
          <button class="view-toggle-btn ${taskView === 'card'  ? 'active' : ''}" data-view="card">⊞ Cards</button>
        </div>
      </div>

    </div>

    <div id="task-content"></div>

    <style>
      .task-toolbar-wrap {
        background: var(--surface, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 16px;
      }
      .tb-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        width: 100%;
        box-sizing: border-box;
      }
      /* ROW 1 — no wrap, everything on one line */
      .tb-row-filters {
        border-bottom: 1px solid var(--border, #e2e8f0);
        flex-wrap: nowrap;
      }
      .tb-search {
        flex: 1 1 0;
        min-width: 0;
      }
      .tb-select {
        flex: 0 0 140px;
        width: 140px;
      }
      .tb-clear {
        flex-shrink: 0;
        white-space: nowrap;
      }
      .tb-count {
        flex-shrink: 0;
        font-size: 11px;
        font-weight: 600;
        color: var(--text-muted, #94a3b8);
        white-space: nowrap;
      }
      /* ROW 2 */
      .tb-row-date {
        background: #f8fafc;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tb-date-group {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .tb-date-label {
        font-size: 10px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: .07em;
        white-space: nowrap;
      }
      .tb-date-field {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .tb-field-label {
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        white-space: nowrap;
      }
      .tb-date-inp {
        width: 138px !important;
        padding: 5px 8px !important;
        font-size: 12px !important;
      }
      .tb-arrow {
        font-size: 13px;
        color: #cbd5e1;
        font-weight: 700;
      }
      .tb-date-hint {
        display: none;
        font-size: 11px;
        font-weight: 600;
        color: #6366f1;
        background: #eef2ff;
        border: 1px solid #c7d2fe;
        padding: 3px 10px;
        border-radius: 20px;
        white-space: nowrap;
      }
      .tb-date-hint.visible { display: inline; }
    </style>
  </div>
  `;
}

/* ================================================================
   RENDER TASKS
   ================================================================ */
function renderTasks() {
  const content = document.getElementById('task-content');
  if (!content) return;

  let tasks = [...CMS_DATA.tasks];

  // Apply filters
  if (taskFilters.search) {
    const s = taskFilters.search.toLowerCase();
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(s) ||
      t.id.toLowerCase().includes(s) ||
      t.department.toLowerCase().includes(s) ||
      t.clauseRef.toLowerCase().includes(s)
    );
  }
  if (taskFilters.status)     tasks = tasks.filter(t => t.status === taskFilters.status);
  if (taskFilters.department) tasks = tasks.filter(t => t.department === taskFilters.department);
  if (taskFilters.from)       tasks = tasks.filter(t => t.dueDate && t.dueDate >= taskFilters.from);
  if (taskFilters.to)         tasks = tasks.filter(t => t.dueDate && t.dueDate <= taskFilters.to);

  const countEl = document.getElementById('task-count');
  if (countEl) countEl.textContent = `${tasks.length} tasks`;

  if (tasks.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">◉</div>
        <div class="empty-state-text">No tasks match your filters</div>
        <div class="empty-state-sub">Try clearing filters or adding a new task.</div>
      </div>`;
    return;
  }

  if (taskView === 'table') {
    content.innerHTML = buildTaskTable(tasks);
    bindStatusDropdowns();
  } else {
    content.innerHTML = buildTaskCards(tasks);
    bindStatusDropdowns();
  }
}

/* ================================================================
   TABLE VIEW
   ================================================================ */
function buildTaskTable(tasks) {
  return `
  <div class="table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Obligation ID</th>
            <th>Obligation Name</th>
            <th>Department</th>
            <th>Assign To</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.map(t => `
          <tr>
            <td>
              <span class="text-accent font-bold task-id-link"
                    onclick="openTaskDetail('${t.id}')"
                    style="cursor:pointer;text-decoration:underline dotted;">
                ${t.obligationId}
              </span>
            </td>
            <td style="max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${t.title}">
              ${t.title}
            </td>
            <td><span class="task-dept-chip">${t.department}</span></td>
            <td style="font-size:12px">${t.assignee}</td>
            <td style="font-size:12px">${formatDate(t.dueDate)}</td>
            <td>
              <select class="status-select ${statusSelectClass(t.status)}"
                      data-task-id="${t.id}" onchange="handleStatusChange(this)">
                <option value="Open"        ${t.status === 'Open'        ? 'selected' : ''}>Open</option>
                <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Complete"    ${t.status === 'Complete'    ? 'selected' : ''}>Complete</option>
                <option value="Overdue"     ${t.status === 'Overdue'     ? 'selected' : ''}>Overdue</option>
              </select>
            </td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ================================================================
   CARD VIEW
   ================================================================ */
function buildTaskCards(tasks) {
  return `
  <div class="task-cards-grid">
    ${tasks.map(t => `
    <div class="task-card risk-${t.risk.toLowerCase()}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <span class="text-xs text-muted font-bold">${t.id}</span>
        <span class="risk-badge risk-${t.risk.toLowerCase()}">${t.risk}</span>
      </div>
      <div class="task-card-title">${t.title}</div>
      <div class="task-card-meta">
        <span class="task-dept-chip">${t.department}</span>
        <span style="font-size:10px;color:var(--text-muted)">📅 ${formatDate(t.dueDate)}</span>
      </div>
      <div style="font-size:11px;color:var(--text-secondary);margin-bottom:10px">
        👤 ${t.assignee}
      </div>
      <div class="task-card-footer">
        <span class="risk-badge ${priorityClass(t.priority)}">${t.priority}</span>
        <select class="status-select ${statusSelectClass(t.status)}"
                data-task-id="${t.id}" onchange="handleStatusChange(this)" style="font-size:11px">
          <option value="Open"        ${t.status === 'Open'        ? 'selected' : ''}>Open</option>
          <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Complete"    ${t.status === 'Complete'    ? 'selected' : ''}>Complete</option>
          <option value="Overdue"     ${t.status === 'Overdue'     ? 'selected' : ''}>Overdue</option>
        </select>
      </div>
    </div>
    `).join('')}
  </div>`;
}

/* ================================================================
   STATUS CHANGE HANDLER
   ================================================================ */
function handleStatusChange(selectEl) {
  const taskId   = selectEl.dataset.taskId;
  const newStatus = selectEl.value;
  CMS_DATA.updateTaskStatus(taskId, newStatus);
  selectEl.className = `status-select ${statusSelectClass(newStatus)}`;
  const dashboardArea = document.querySelector('.metrics-grid');
  if (dashboardArea) refreshDashboardMetrics();
  showToast(`Task ${taskId} updated to "${newStatus}"`, 'success');
}

function bindStatusDropdowns() {}

/* ================================================================
   ADD TASK MODAL
   ================================================================ */
function openAddTaskModal() {
  const modal = document.getElementById('generic-modal');
  const box   = document.getElementById('generic-modal-box');
  const title = document.getElementById('generic-modal-title');
  const body  = document.getElementById('generic-modal-body');

  box.style.maxWidth = '600px';
  title.textContent  = '+ Add New Task';

  const circularOptions = CMS_DATA.circulars.map(c =>
    `<option value="${c.id}">${c.id} – ${c.title}</option>`
  ).join('');

  body.innerHTML = `
  <div class="form-grid-2">
    <div class="form-group" style="grid-column:span 2">
      <label class="form-label">Task Title *</label>
      <input type="text" class="form-control" id="new-task-title" placeholder="Enter task title..."/>
    </div>
    <div class="form-group">
      <label class="form-label">Circular Reference *</label>
      <select class="form-control" id="new-task-circular">
        <option value="">Select circular...</option>
        ${circularOptions}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Clause Reference</label>
      <input type="text" class="form-control" id="new-task-clause" placeholder="e.g. C1.1"/>
    </div>
    <div class="form-group">
      <label class="form-label">Department *</label>
      <select class="form-control" id="new-task-dept">
        <option value="">Select department...</option>
        <option>IT</option><option>Risk</option><option>Compliance</option>
        <option>Legal</option><option>Finance</option><option>Operations</option>
        <option>HR</option><option>Procurement</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Department Head</label>
      <select class="form-control" id="new-task-assignee">
        <option value="">Select Assignee</option>
        <option value="Rahul Sharma">Rahul Sharma</option>
        <option value="Anita Verma">Anita Verma</option>
        <option value="Vikram Singh">Vikram Singh</option>
        <option value="Neha Patel">Neha Patel</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Due Date *</label>
      <input type="date" class="form-control" id="new-task-due"/>
    </div>
    <div class="form-group">
      <label class="form-label">Priority</label>
      <select class="form-control" id="new-task-priority">
        <option>High</option><option>Medium</option><option>Low</option><option>Critical</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Risk Level</label>
      <select class="form-control" id="new-task-risk">
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <select class="form-control" id="new-task-status">
        <option>Open</option><option>In Progress</option><option>Complete</option>
      </select>
    </div>
  </div>
  <div class="form-actions">
    <button class="btn btn-ghost" onclick="document.getElementById('generic-modal').classList.add('hidden')">Cancel</button>
    <button class="btn btn-primary" id="save-task-btn">Save Task</button>
  </div>
  `;

  modal.classList.remove('hidden');
  document.getElementById('save-task-btn').addEventListener('click', saveNewTask);
}

function saveNewTask() {
  const title  = document.getElementById('new-task-title').value.trim();
  const circId = document.getElementById('new-task-circular').value;
  const dept   = document.getElementById('new-task-dept').value;
  const due    = document.getElementById('new-task-due').value;

  if (!title || !circId || !dept || !due) {
    showToast('Please fill in all required fields (*).', 'warning');
    return;
  }

  const newTask = {
    id:         `OB-${String(CMS_DATA.tasks.length + 1).padStart(3, '0')}`,
    title,
    circularId: circId,
    clauseRef:  document.getElementById('new-task-clause').value || 'TBD',
    department: dept,
    dueDate:    due,
    priority:   document.getElementById('new-task-priority').value,
    risk:       document.getElementById('new-task-risk').value,
    status:     document.getElementById('new-task-status').value,
    assignee:   document.getElementById('new-task-assignee').value || 'Unassigned'
  };

  CMS_DATA.tasks.push(newTask);
  document.getElementById('generic-modal').classList.add('hidden');
  renderTasks();
  showToast(`Task "${newTask.id}" created successfully!`, 'success');
}

/* ================================================================
   LISTENERS
   ================================================================ */
function initTaskListeners() {
  const searchInput = document.getElementById('task-search');
  if (searchInput) searchInput.addEventListener('input', () => {
    taskFilters.search = searchInput.value.trim();
    renderTasks();
  });

  const statusFilter = document.getElementById('task-filter-status');
  if (statusFilter) statusFilter.addEventListener('change', () => {
    taskFilters.status = statusFilter.value;
    renderTasks();
  });

  const deptFilter = document.getElementById('task-filter-dept');
  if (deptFilter) deptFilter.addEventListener('change', () => {
    taskFilters.department = deptFilter.value;
    renderTasks();
  });

  const fromFilter = document.getElementById('task-filter-from');
  if (fromFilter) fromFilter.addEventListener('change', () => {
    taskFilters.from = fromFilter.value;
    _updateDateHint();
    renderTasks();
  });

  const toFilter = document.getElementById('task-filter-to');
  if (toFilter) toFilter.addEventListener('change', () => {
    taskFilters.to = toFilter.value;
    _updateDateHint();
    renderTasks();
  });

  const clearBtn = document.getElementById('clear-task-filters');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    taskFilters = { status: '', department: '', search: '', from: '', to: '' };
    document.getElementById('task-search').value        = '';
    document.getElementById('task-filter-status').value = '';
    document.getElementById('task-filter-dept').value   = '';
    document.getElementById('task-filter-from').value   = '';
    document.getElementById('task-filter-to').value     = '';
    _updateDateHint();
    renderTasks();
  });

  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      taskView = btn.dataset.view;
      document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks();
    });
  });

  // const addBtn = document.getElementById('add-task-btn');
  // if (addBtn) addBtn.addEventListener('click', openAddTaskModal);
}

/* ================================================================
   HELPERS
   ================================================================ */
function _updateDateHint() {
  const hint = document.getElementById('task-date-hint');
  if (!hint) return;
  const f = taskFilters.from, t = taskFilters.to;
  if (f && t)      { hint.textContent = `${_fmtShort(f)} → ${_fmtShort(t)}`; hint.classList.add('visible'); }
  else if (f)      { hint.textContent = `From ${_fmtShort(f)}`;               hint.classList.add('visible'); }
  else if (t)      { hint.textContent = `Until ${_fmtShort(t)}`;              hint.classList.add('visible'); }
  else             { hint.textContent = '';                                    hint.classList.remove('visible'); }
}
function _fmtShort(d) {
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
}
function statusSelectClass(status) {
  const map = {
    'Open': 'open', 'In Progress': 'inprogress',
    'Complete': 'complete', 'Overdue': 'overdue'
  };
  return map[status] || 'open';
}

function priorityClass(p) {
  const map = { 'Critical': 'risk-high', 'High': 'risk-high', 'Medium': 'risk-medium', 'Low': 'risk-low' };
  return map[p] || '';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function showToast(msg, type) {
  const colors = { success: '#10b981', warning: '#f59e0b', info: '#4f7cff' };
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${colors[type] || '#4f7cff'};color:#fff;
    padding:10px 18px;border-radius:8px;
    font-size:13px;font-weight:600;
    box-shadow:0 4px 16px rgba(0,0,0,.2);
    animation:fadeIn 0.3s ease;max-width:380px;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}