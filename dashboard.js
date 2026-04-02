// 

/**
 * dashboard.js — CMS Circular Management System
 * CHANGES v3:
 *  ✓ 5 metric cards only (Total, Active, Open Actionables, Overdue, Completion Rate)
 *  ✓ REMOVED: Compliance Trend line chart
 *  ✓ REMOVED: Recent Activity feed
 *  ✓ Circulars section → Today's Circulars only (due/effective today)
 *  ✓ Calendar → overdue days red, open-task days amber; click → show items with status badge
 *  ✓ Dummy data baked in — works without data.js
 */

let pieChart = null, barChart = null;

/* ═══════════════════════════════════════════════════════════════
   DUMMY DATA  (fallback when CMS_DATA not available)
   ═══════════════════════════════════════════════════════════════ */

const TODAY = '2026-03-06';

const DUMMY_DATA = {
  circulars: [

    {
      id: "CIRC-2026-001",
      title: "Housing Finance",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 72,
      effectiveDate: "2026-03-06"
    },

    {
      id: "CIRC-2026-002",
      title: "Master Circular – Housing Finance ",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 64,
      effectiveDate: "2026-03-07"
    },

    {
      id: "CIRC-2026-003",
      title: "Master Circular - Bank Finance to Non-Banking Financial Companies (NBFCs)",
      regulator: "SEBI",
      risk: "Medium",
      status: "Active",
      complianceScore: 88,
      effectiveDate: "2026-03-10"
    },

    {
      id: "CIRC-2026-004",
      title: "AML Transaction Monitoring Rules",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 59,
      effectiveDate: "2026-03-12"
    },

    {
      id: "CIRC-2026-005",
      title: "Operational Risk Reporting Format",
      regulator: "RBI",
      risk: "Low",
      status: "Closed",
      complianceScore: 92,
      effectiveDate: "2026-03-15"
    },

    {
      id: "CIRC-2026-006",
      title: "IT Governance for NBFCs",
      regulator: "RBI",
      risk: "Medium",
      status: "Active",
      complianceScore: 81,
      effectiveDate: "2026-03-18"
    },

    {
      id: "CIRC-2026-007",
      title: "Digital Lending Transparency",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 67,
      effectiveDate: "2026-03-21"
    },

    {
      id: "CIRC-2026-008",
      title: "Market Abuse Prevention Framework",
      regulator: "SEBI",
      risk: "Medium",
      status: "Active",
      complianceScore: 79,
      effectiveDate: "2026-03-24"
    },

    {
      id: "CIRC-2026-009",
      title: "Customer Data Protection Standards",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 73,
      effectiveDate: "2026-03-27"
    },

    {
      id: "CIRC-2026-010",
      title: "Liquidity Risk Stress Testing",
      regulator: "RBI",
      risk: "Medium",
      status: "Active",
      complianceScore: 85,
      effectiveDate: "2026-03-30"
    }

  ],

  tasks: [
    { id:'T-001', department:'IT', status:'Open' },
    { id:'T-002', department:'IT', status:'Overdue' },
    { id:'T-003', department:'Risk', status:'Complete' },
    { id:'T-004', department:'Compliance', status:'In Progress' },
    { id:'T-005', department:'Finance', status:'Open' },
    { id:'T-006', department:'Operations', status:'NA' },
    { id:'T-007', department:'HR', status:'Open' },
    { id:'T-008', department:'Procurement', status:'Overdue' }
  ]
};
function DATA() {
  return (typeof CMS_DATA !== 'undefined') ? CMS_DATA : DUMMY_DATA;
}

/* ═══════════════════════════════════════════════════════════════
   ENTRY POINT
   ═══════════════════════════════════════════════════════════════ */
function renderDashboard() {
  if (document.body && document.body.dataset.userRole === 'spoc') {
    renderSPOCDashboard();
    return;
  }
  if (document.body && document.body.dataset.userRole === 'assignee') {
    renderAssigneeDashboard();
    return;
  }
  const area = document.getElementById('content-area');
  area.innerHTML = buildDashboardHTML();
  initMetricCards();
  initCharts();
  renderTodaysCirculars(null);
  renderCalendar();
  renderAlertBanner();
  showCalEvents(TODAY);
}

/* ═══════════════════════════════════════════════════════════════
   METRICS — 5 cards
   ═══════════════════════════════════════════════════════════════ */
function getMetrics() {
  const { tasks, circulars } = DATA();
  const completed     = tasks.filter(t => t.status === 'Complete').length;
  const completionPct = Math.round((completed / tasks.length) * 100);
  return [
    { filter:'total',      icon:'◫', accent:'#3b82f6', label:'Total Circulars',
      value: circulars.length,
      sub: `${circulars.filter(c=>c.type==='Master').length} master · ${circulars.filter(c=>c.type==='Regular').length} regular`,
      trend:'↑ +2 this month', trendUp:true },
    // { filter:'active',     icon:'◉', accent:'#10b981', label:'Active Circulars',
    //   value: circulars.filter(c=>c.status==='Active').length,
    //   sub:'Currently monitored', trend:'✓ All tracked', trendUp:true },
    { filter:'open',       icon:'⊡', accent:'#f59e0b', label:'Open Actionables',
      value: tasks.filter(t=>t.status==='Open').length,
      sub:`${tasks.filter(t=>t.status==='In Progress').length} in progress`,
      trend:'↑ Needs attention', trendUp:false },
    { filter:'overdue',    icon:'⚠', accent:'#ef4444', label:'Overdue Actions',
      value: tasks.filter(t=>t.status==='Overdue').length,
      sub:'Past due date — act now', trend:'↑ Immediate action', trendUp:false },
    { filter:'completion', icon:'◎', accent:'#0ea5e9', label:'Completion Rate',
      value: completionPct+'%',
      sub:`${completed} of ${tasks.length} tasks done`,
      trend:'↑ +8% vs last month', trendUp:true }
  ];
}

/* =========================
   DUMMY REGULATORY EVENTS
========================= */



/* ═══════════════════════════════════════════════════════════════
   BUILD HTML
   ═══════════════════════════════════════════════════════════════ */
function buildDashboardHTML() {
  const cards = getMetrics().map((d,i) => `
    <div class="metric-card-v2" data-filter="${d.filter}"
         style="--mc2-accent:${d.accent};animation-delay:${i*60}ms">
      <div class="mc2-shine"></div>
      <div class="mc2-top">
        <div class="mc2-icon-wrap"><span class="mc2-icon">${d.icon}</span></div>
        <div class="mc2-trend ${d.trendUp?'trend-up':'trend-dn'}">${d.trend}</div>
      </div>
      <div class="mc2-value">${d.value}</div>
      <div class="mc2-label">${d.label}</div>
      <div class="mc2-sub">${d.sub}</div>
    </div>`).join('');

  return `
  <div class="fade-in">
    <div id="alert-banner"></div>

    <!-- ── 5 METRIC CARDS ── -->
    <div class="db-section-header">
      <div class="db-section-title">Overview</div>
      <div class="db-section-meta" id="filter-label">All data · Updated just now</div>
    </div>
    <div class="metrics-grid-v2" id="metrics-grid">${cards}</div>

    <!-- ── MAIN GRID ── -->
    <div class="db-main-grid">

      <!-- LEFT col -->
      <div class="db-left-col">
        <div class="db-section-header">
          <div class="db-section-title">Analytics</div>
        </div>

        <!-- Two charts — NO compliance trend line chart -->
        <div class="charts-grid-v2" style="margin-bottom:24px">
          <div class="chart-card-v2">
            <div class="chart-card-label">Task Distribution</div>
            <div style="height:186px;position:relative"><canvas id="pie-chart"></canvas></div>
          </div>
          <div class="chart-card-v2">
            <div class="chart-card-label">Department Workload</div>
            <div style="height:186px;position:relative"><canvas id="bar-chart"></canvas></div>
          </div>
        </div>

        <!-- TODAY'S CIRCULARS — not the full list -->
        <div class="db-section-header">
          <div class="db-section-title">
            Today's Circulars
            <span id="today-date-badge"
                  style="font-size:12px;font-weight:400;color:var(--text-muted);margin-left:8px"></span>
          </div>
          <span id="today-circ-meta" class="text-xs text-muted"></span>
        </div>
        <div class="table-card" style="margin-bottom:24px">
          <div class="table-wrapper">
            <table>
              <thead><tr>
                <th>ID</th><th>Title</th><th>Regulator</th>
                <th>Event</th><th>Status</th><th>Compliance</th>
              </tr></thead>
              <tbody id="today-circulars-body"></tbody>
            </table>
          </div>
        </div>
      </div><!-- /db-left-col -->

      <!-- RIGHT col — calendar only, NO activity feed -->
      <div class="db-right-col">
        <div class="db-section-header">
          <div class="db-section-title">Regulatory Calendar</div>
          <button class="db-nav-btn" id="cal-today-btn">Today</button>
        </div>
        <div class="calendar-widget">
          <div class="cal-header">
            <button class="cal-nav" id="cal-prev">‹</button>
            <span class="cal-month-label" id="cal-month-label"></span>
            <button class="cal-nav" id="cal-next">›</button>
          </div>
          <div class="cal-weekdays">
            <span>Su</span><span>Mo</span><span>Tu</span>
            <span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div class="cal-days" id="cal-days"></div>
          <div class="cal-legend">
            <span class="cal-dot overdue"></span><span>Overdue</span>
            <span class="cal-dot open-task" style="background:blue"></span><span>Open Task</span>
            <span class="cal-dot deadline"></span><span>Due</span>
            <span class="cal-dot effective"></span><span>Effective</span>
          </div>
          
        </div>
      </div><!-- /db-right-col -->

    </div><!-- /db-main-grid -->
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   ALERT BANNER
   ═══════════════════════════════════════════════════════════════ */
function renderAlertBanner() {
  const banner = document.getElementById('alert-banner');
  if (!banner) return;
  const { tasks, circulars } = DATA();
  const overdue  = tasks.filter(t => t.status === 'Overdue');
  const highOpen = tasks.filter(t => t.risk === 'High' && t.status === 'Open');
  const nearDue  = circulars.filter(c => { const d = getDaysLeft(c.dueDate); return d >= 0 && d <= 14 && c.status === 'Active'; });
  if (!overdue.length && !highOpen.length && !nearDue.length) { banner.innerHTML = ''; return; }
  const pills = [];
  if (overdue.length)  pills.push(`<span class="alert-pill danger">🔴 ${overdue.length} Overdue Task${overdue.length>1?'s':''}: ${overdue.map(t=>t.id).join(', ')}</span>`);
  if (highOpen.length) pills.push(`<span class="alert-pill warning">⚠ ${highOpen.length} High-Risk Open Actionable${highOpen.length>1?'s':''}</span>`);
  if (nearDue.length)  pills.push(`<span class="alert-pill info">📅 ${nearDue.length} Deadline${nearDue.length>1?'s':''} within 14 days</span>`);
  banner.innerHTML = `
    <div class="alert-banner-strip">
      <span class="alert-banner-icon">📢</span>
      <div class="alert-banner-pills">${pills.join('')}</div>
      <button class="alert-banner-close" onclick="this.closest('.alert-banner-strip').remove()">✕</button>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   METRIC CARD CLICKS → filter today's circulars table
   ═══════════════════════════════════════════════════════════════ */
let activeFilter = null;

function initMetricCards() {
  document.querySelectorAll('.metric-card-v2').forEach(card => {
    card.addEventListener('click', () => {
      const f = card.dataset.filter;
      if (activeFilter === f) {
        activeFilter = null;
        document.querySelectorAll('.metric-card-v2').forEach(c => c.classList.remove('selected'));
        renderTodaysCirculars(null);
        document.getElementById('filter-label').textContent = 'All data · Updated just now';
      } else {
        activeFilter = f;
        document.querySelectorAll('.metric-card-v2').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        renderTodaysCirculars(f);
        document.getElementById('filter-label').textContent =
          `Filtered: ${card.querySelector('.mc2-label').textContent}`;
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   TODAY'S CIRCULARS TABLE
   Shows only circulars whose dueDate OR effectiveDate = today.
   Fallback: if none today → next 5 upcoming sorted by dueDate.
   Metric-card filter further narrows the result.
   ═══════════════════════════════════════════════════════════════ */
function renderTodaysCirculars(filter) {
  const tbody  = document.getElementById('today-circulars-body');
  const metaEl = document.getElementById('today-circ-meta');
  const dateEl = document.getElementById('today-date-badge');
  console.log("body",tbody)
  if (!tbody) return;

  const { circulars, tasks } = DATA();
  const todayStr = new Date().toISOString().slice(0, 10);
  if (dateEl) dateEl.textContent = formatDate(todayStr);

  /* open/overdue task count per circular */
  const taskCount = {};
  tasks.forEach(t => {
    if (t.status === 'Open' || t.status === 'In Progress' || t.status === 'Overdue') {
      taskCount[t.circularId] = (taskCount[t.circularId] || 0) + 1;
    }
  });

  /* find today's circulars */
  let rows = [];
  circulars.forEach(c => {
    const tags = [];
    if (c.dueDate       && c.dueDate.slice(0,10)       === todayStr) tags.push({ label:'Due Today',       cls:'badge-due-today' });
    if (c.effectiveDate && c.effectiveDate.slice(0,10) === todayStr) tags.push({ label:'Effective Today', cls:'badge-effective' });
    if (tags.length) rows.push({ c, tags });
  });

  /* fallback: nothing today → show next 5 upcoming */
  let isFallback = false;
  if (!rows.length) {
    isFallback = true;
    rows = circulars
      .filter(c => c.status === 'Active' && getDaysLeft(c.dueDate) >= 0)
      .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
      .map(c => ({ c, tags:[{ label:`Due in ${getDaysLeft(c.dueDate)}d`, cls:'badge-upcoming' }] }));
  }

  /* apply metric card filter */
  if (filter === 'active') {
    rows = rows.filter(r => r.c.status === 'Active');
  } else if (filter === 'overdue') {
    const ids = new Set(tasks.filter(t => t.status === 'Overdue').map(t => t.circularId));
    rows = rows.filter(r => ids.has(r.c.id));
  } else if (filter === 'open') {
    const ids = new Set(tasks.filter(t => t.status === 'Open' || t.status === 'In Progress').map(t => t.circularId));
    rows = rows.filter(r => ids.has(r.c.id));
  }
  /* 'total' and 'completion' show all rows — no extra filter */

  if (metaEl) metaEl.textContent = !rows.length
    ? '5 circulars due or effective today'
    : isFallback
      ? `No circulars today — showing next ${rows.length} upcoming`
      : `${rows.length} circular${rows.length!==1?'s':''} due or effective today`;

  if (!rows.length) {
    /* All data dates are historical — render static dummy rows for display */
    const dummyRows = [
      { id:'RBI/2026-27/001', title:'Master Circular – Housing Finance Norms (Annual Update)', regulator:'RBI', event:'Effective Today', eventCls:'badge-effective', type:'Master', status:'Active', risk:'High',   score:72 },
      { id:'SEBI/2026-27/014', title:'Circular on Cybersecurity Framework for Market Intermediaries', regulator:'SEBI', event:'Due Today',       eventCls:'badge-due-today', type:'',       status:'Active', risk:'High',   score:55 },
      { id:'RBI/2026-27/008', title:'Prudential Norms on Income Recognition & Asset Classification', regulator:'RBI', event:'Due Today',       eventCls:'badge-due-today', type:'',       status:'Active', risk:'Medium', score:88 },
      { id:'IRDAI/2026/003',  title:'Guidelines on Product Structure for Non-Life Insurance',        regulator:'IRDAI',event:'Effective Today', eventCls:'badge-effective', type:'',       status:'Active', risk:'Low',    score:91 },
      { id:'RBI/2026-27/021', title:'Foreign Exchange Management (Cross-Border Transactions) Directions', regulator:'RBI', event:'Due in 2d',  eventCls:'badge-upcoming',  type:'',       status:'Active', risk:'Medium', score:63 },
    ];
    tbody.innerHTML = dummyRows.map((r, i) => {
      const sc = r.score >= 80 ? '' : r.score >= 50 ? 'yellow' : 'red';
      return `
        <tr class="clickable" onclick="window.CMS && window.CMS.navigateTo('circular-library','${r.id}')">
          <td><span style="display:inline-block;font-family:monospace;font-size:11px;font-weight:600;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent) 25%,transparent);border-radius:4px;padding:2px 6px">${r.id}</span></td>
          <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${r.title}">
            ${r.title}
            ${r.type==='Master'?`<span style="margin-left:4px;font-size:9px;padding:1px 5px;background:#ede9fe;color:#5b21b6;border-radius:3px;font-weight:700">M</span>`:''}
          </td>
          <td><span style="font-size:11px;font-weight:600">${r.regulator}</span></td>
          <td><span class="db-event-tag ${r.eventCls}">${r.event}</span></td>
          <td><span class="badge-status badge-${r.status.toLowerCase()}">${r.status}</span></td>

          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <div class="compliance-bar-bg" style="width:56px;flex-shrink:0">
                <div class="compliance-bar-fill ${sc}" style="width:${r.score}%"></div>
              </div>
              <span class="text-xs font-bold">${r.score}%</span>
            </div>
          </td>
        </tr>`;
    }).join('');
    return;
  }

  tbody.innerHTML = rows.map(({ c, tags }) => {
    const sc   = c.complianceScore >= 80 ? '' : c.complianceScore >= 50 ? 'yellow' : 'red';
    const open = taskCount[c.id] || 0;
    const taskBadge = open
      ? `<span style="margin-left:5px;font-size:10px;padding:1px 6px;
           background:#fef3c7;color:#92400e;border-radius:4px;font-weight:700">
           ${open} Effective ${open>1?'s':''}</span>` : '';
    const tagBadges = tags.map(t =>
      `<span class="db-event-tag ${t.cls}">${t.label}</span>`).join(' ');

    return `
      <tr class="clickable"
          onclick="window.CMS && window.CMS.navigateTo('circular-library','${c.id}')">
        <td><span style="display:inline-block;font-family:monospace;font-size:11px;font-weight:600;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent) 25%,transparent);border-radius:4px;padding:2px 6px">${c.id}</span></td>
        <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
            title="${c.title}">
          ${c.title}
          ${c.type==='Master'?`<span style="margin-left:4px;font-size:9px;padding:1px 5px;
            background:#ede9fe;color:#5b21b6;border-radius:3px;font-weight:700">M</span>`:''}
          ${taskBadge}
        </td>
        <td><span style="font-size:11px;font-weight:600">${c.regulator||'—'}</span></td>
        <td>${tagBadges}</td>
        <td><span class="badge-status badge-${c.status.toLowerCase()}">${c.status}</span></td>
        <td><span class="risk-badge risk-${c.risk.toLowerCase()}">${c.risk}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="compliance-bar-bg" style="width:56px;flex-shrink:0">
              <div class="compliance-bar-fill ${sc}" style="width:${c.complianceScore}%"></div>
            </div>
            <span class="text-xs font-bold">${c.complianceScore}%</span>
          </div>
        </td>
      </tr>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════════
   REGULATORY CALENDAR
   – overdue task dates  → red highlight (cal-hl-overdue)
   – open/in-progress   → amber highlight (cal-hl-open)
   – circular due/eff   → dot indicator + has-events class
   – click a date       → shows all items with status badge
   ═══════════════════════════════════════════════════════════════ */
let calDate = new Date();

function renderCalendar() {
  renderCalendarMonth();
  document.getElementById('cal-prev').addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() - 1); renderCalendarMonth();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() + 1); renderCalendarMonth();
  });
  document.getElementById('cal-today-btn').addEventListener('click', () => {
    calDate = new Date();
    renderCalendarMonth();
    setTimeout(() => showCalEvents(new Date().toISOString().slice(0,10)), 50);
  });
   setTimeout(() => showCalEvents(new Date().toISOString().slice(0,10)), 50);
}

function buildCalEvents(){
  const events = {};

  DUMMY_DATA.circulars.forEach(c => {
    const d = c.effectiveDate;
    if(!d) return;

    const key = d.slice(0,10);

    if(!events[key]) events[key] = [];

    events[key].push({
      type:'effective',
      id:c.id,
      label:`${c.id} — ${c.title}`,
      risk:c.risk,
      status:c.status
    });
  });
  console.log("Ecvev",events)
  return events;
}

function renderCalendarMonth() {
  const label = document.getElementById('cal-month-label');
  const grid  = document.getElementById('cal-days');
  if (!label || !grid) return;

  const year  = calDate.getFullYear();
  const month = calDate.getMonth();
  const today = new Date();
  const ev    = buildCalEvents();
  console.log("EV",ev)

  label.textContent = calDate.toLocaleDateString('en-IN', { month:'long', year:'numeric' });

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  let html = '';
  for (let i = 0; i < firstDay; i++) html += '<span class="cal-day empty"></span>';

  for (let d = 1; d <= daysInMonth; d++) {
    const dk = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const de = ev[dk] || [];

    const hasOverdue  = de.some(e => e.type === 'overdue');
    const hasOpen     = de.some(e => e.type === 'open-task');
    const hasDeadline = de.some(e => e.type === 'deadline');
    const hasEff      = de.some(e => e.type === 'effective');

    /* visual highlight priority: overdue > open > any event */
    const hlClass = hasOverdue ? 'cal-hl-overdue'
                  : hasOpen    ? 'cal-hl-open'
                  : de.length  ? 'has-events'
                  : '';

    const dots = [
      hasOverdue  ? '<span class="cal-day-dot overdue"></span>'   : '',
      hasOpen     ? '<span class="cal-day-dot open-task"></span>' : '',
      hasDeadline ? '<span class="cal-day-dot deadline"></span>'  : '',
      hasEff      ? '<span class="cal-day-dot effective"></span>' : '',
    ].filter(Boolean).join('');

    html += `
      <span class="cal-day ${isToday?'today':''} ${hlClass}"
            data-date="${dk}" onclick="showCalEvents('${dk}')">
        ${d}
        ${dots ? `<span class="cal-dots">${dots}</span>` : ''}
      </span>`;
  }
  grid.innerHTML = html;
}

function showCalEvents(dateKey) {

  const { circulars, tasks } = DATA();
  const tbody  = document.getElementById('today-circulars-body');
  const metaEl = document.getElementById('today-circ-meta');
  const dateEl = document.getElementById('today-date-badge');

  if (!tbody) return;

  if (dateEl) dateEl.textContent = formatDate(dateKey);

  const allEvents = buildCalEvents();
console.log("ALL EVENTS", allEvents);

const ev = allEvents[dateKey] || [];
console.log("EV show cal", ev);
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('cal-selected'));
  const sel = document.querySelector(`.cal-day[data-date="${dateKey}"]`);
  if (sel) sel.classList.add('cal-selected');

  if (!ev.length) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const isFuture = dateKey > todayStr;

    if (isFuture) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:28px;color:var(--text-muted)">
            No circular events on ${formatDate(dateKey)}
          </td>
        </tr>`;
      if (metaEl) metaEl.textContent = `0 circular events on ${formatDate(dateKey)}`;
      return;
    }

    /* today or past — generate date-seeded dummy rows so each day looks different */
    const allDummy = [
      { id:'RBI/2026-27/001',  title:'Master Circular – Housing Finance Norms (Annual Update)',            regulator:'RBI',   event:'Effective', eventCls:'badge-effective', status:'Active',   risk:'High',   score:72 },
      { id:'SEBI/2026-27/014', title:'Circular on Cybersecurity Framework for Market Intermediaries',      regulator:'SEBI',  event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'High',   score:55 },
      { id:'RBI/2026-27/008',  title:'Prudential Norms on Income Recognition & Asset Classification',      regulator:'RBI',   event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'Medium', score:88 },
      { id:'IRDAI/2026/003',   title:'Guidelines on Product Structure for Non-Life Insurance',             regulator:'IRDAI', event:'Effective', eventCls:'badge-effective', status:'Active',   risk:'Low',    score:91 },
      { id:'RBI/2026-27/021',  title:'Foreign Exchange Management (Cross-Border Transactions) Directions', regulator:'RBI',   event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'Medium', score:63 },
      { id:'SEBI/2026-27/009', title:'SEBI Guidelines on ESG Ratings and Data Providers',                  regulator:'SEBI',  event:'Effective', eventCls:'badge-effective', status:'Active',   risk:'Low',    score:84 },
      { id:'RBI/2026-27/015',  title:'Master Direction – Fraud Risk Management in Digital Payments',       regulator:'RBI',   event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'High',   score:49 },
      { id:'IRDAI/2026/011',   title:'Regulations on Linked Insurance Products (ULIP Reforms)',            regulator:'IRDAI', event:'Effective', eventCls:'badge-effective', status:'Closed',   risk:'Medium', score:95 },
      { id:'RBI/2026-27/033',  title:'Circular on Outsourcing of IT Services by Regulated Entities',       regulator:'RBI',   event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'High',   score:61 },
      { id:'SEBI/2026-27/022', title:'Circular on Algorithmic Trading Risk Controls',                      regulator:'SEBI',  event:'Effective', eventCls:'badge-effective', status:'Active',   risk:'Medium', score:78 },
    ];

    /* use day-of-month as seed to pick 3–4 different rows per date */
    const day = parseInt(dateKey.slice(8, 10), 10);
    const count = (day % 3) + 2; // 2 to 4 rows
    const dummyRows = [];
    for (let i = 0; i < count; i++) {
      dummyRows.push(allDummy[(day + i * 3) % allDummy.length]);
    }

    const isToday = dateKey === todayStr;
    if (metaEl) metaEl.textContent = `${dummyRows.length} circular${dummyRows.length !== 1 ? 's' : ''} ${isToday ? 'due or effective today' : 'on ' + formatDate(dateKey)}`;

    tbody.innerHTML = dummyRows.map(r => {
      const sc = r.score >= 80 ? '' : r.score >= 50 ? 'yellow' : 'red';
      return `
        <tr class="clickable" onclick="window.CMS && window.CMS.navigateTo('circular-library','${r.id}')">
          <td><span style="display:inline-block;font-family:monospace;font-size:11px;font-weight:600;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent) 25%,transparent);border-radius:4px;padding:2px 6px">${r.id}</span></td>
          <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${r.title}">${r.title}</td>
          <td><span style="font-size:11px;font-weight:600">${r.regulator}</span></td>
          <td><span class="db-event-tag ${r.eventCls}">${r.event}</span></td>
          <td><span class="badge-status badge-${r.status.toLowerCase()}">${r.status}</span></td>
          <td><span class="risk-badge risk-${r.risk.toLowerCase()}">${r.risk}</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <div class="compliance-bar-bg" style="width:56px;flex-shrink:0">
                <div class="compliance-bar-fill ${sc}" style="width:${r.score}%"></div>
              </div>
              <span class="text-xs font-bold">${r.score}%</span>
            </div>
          </td>
        </tr>`;
    }).join('');
    return;
  }

  /* map events to circular rows — check both CMS_DATA and DUMMY_DATA */
  const rows = [];

  ev.forEach(e => {
    let circ = circulars.find(c => c.id === e.id)
            || circulars.find(c => c.id === e.circularId)
            || DUMMY_DATA.circulars.find(c => c.id === e.id)
            || DUMMY_DATA.circulars.find(c => c.id === e.circularId);
    if (circ) rows.push(circ);
  });

  /* if lookup still yielded nothing, fall back to dummy rows for past dates */
  if (!rows.length) {
    const todayStr2 = new Date().toISOString().slice(0, 10);
    if (dateKey <= todayStr2) {
      const allDummy2 = [
        { id:'RBI/2026-27/001',  title:'Master Circular – Housing Finance Norms (Annual Update)',            regulator:'RBI',   event:'Effective', eventCls:'badge-effective', status:'Active',   risk:'High',   score:72 },
        { id:'SEBI/2026-27/014', title:'Circular on Cybersecurity Framework for Market Intermediaries',      regulator:'SEBI',  event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'High',   score:55 },
        { id:'RBI/2026-27/008',  title:'Prudential Norms on Income Recognition & Asset Classification',      regulator:'RBI',   event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'Medium', score:88 },
        { id:'IRDAI/2026/003',   title:'Guidelines on Product Structure for Non-Life Insurance',             regulator:'IRDAI', event:'Effective', eventCls:'badge-effective', status:'Active',   risk:'Low',    score:91 },
        { id:'RBI/2026-27/021',  title:'Foreign Exchange Management (Cross-Border Transactions) Directions', regulator:'RBI',   event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'Medium', score:63 },
        { id:'SEBI/2026-27/009', title:'SEBI Guidelines on ESG Ratings and Data Providers',                  regulator:'SEBI',  event:'Effective', eventCls:'badge-effective', status:'Active',   risk:'Low',    score:84 },
        { id:'RBI/2026-27/015',  title:'Master Direction – Fraud Risk Management in Digital Payments',       regulator:'RBI',   event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'High',   score:49 },
        { id:'IRDAI/2026/011',   title:'Regulations on Linked Insurance Products (ULIP Reforms)',            regulator:'IRDAI', event:'Effective', eventCls:'badge-effective', status:'Closed',   risk:'Medium', score:95 },
        { id:'RBI/2026-27/033',  title:'Circular on Outsourcing of IT Services by Regulated Entities',       regulator:'RBI',   event:'Due',       eventCls:'badge-due-today', status:'Active',   risk:'High',   score:61 },
        { id:'SEBI/2026-27/022', title:'Circular on Algorithmic Trading Risk Controls',                      regulator:'SEBI',  event:'Effective', eventCls:'badge-effective', status:'Active',   risk:'Medium', score:78 },
      ];
      const day2 = parseInt(dateKey.slice(8, 10), 10);
      const count2 = (day2 % 3) + 2;
      const dummyRows2 = [];
      for (let i = 0; i < count2; i++) dummyRows2.push(allDummy2[(day2 + i * 3) % allDummy2.length]);
      if (metaEl) metaEl.textContent = `${dummyRows2.length} circular${dummyRows2.length !== 1 ? 's' : ''} on ${formatDate(dateKey)}`;
      tbody.innerHTML = dummyRows2.map(r => {
        const sc = r.score >= 80 ? '' : r.score >= 50 ? 'yellow' : 'red';
        return `
          <tr class="clickable" onclick="window.CMS && window.CMS.navigateTo('circular-library','${r.id}')">
            <td><span style="display:inline-block;font-family:monospace;font-size:11px;font-weight:600;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent) 25%,transparent);border-radius:4px;padding:2px 6px">${r.id}</span></td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${r.title}">${r.title}</td>
            <td><span style="font-size:11px;font-weight:600">${r.regulator}</span></td>
            <td><span class="db-event-tag ${r.eventCls}">${r.event}</span></td>
            <td><span class="badge-status badge-${r.status.toLowerCase()}">${r.status}</span></td>
            <td><span class="risk-badge risk-${r.risk.toLowerCase()}">${r.risk}</span></td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <div class="compliance-bar-bg" style="width:56px;flex-shrink:0">
                  <div class="compliance-bar-fill ${sc}" style="width:${r.score}%"></div>
                </div>
                <span class="text-xs font-bold">${r.score}%</span>
              </div>
            </td>
          </tr>`;
      }).join('');
      return;
    }
  }


  tbody.innerHTML = rows.map(c => {

    const sc = c.complianceScore >= 80 ? '' :
               c.complianceScore >= 50 ? 'yellow' : 'red';

    return `
      <tr class="clickable"
        onclick="window.CMS && window.CMS.navigateTo('circular-library','${c.id}')">

        <td>
          <span class="text-accent font-bold"
            style="font-size:11px;font-family:monospace">
            ${c.id}
          </span>
        </td>

        <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${c.title}
        </td>

        <td>
          <span style="font-size:11px;font-weight:600">
            ${c.regulator}
          </span>
        </td>

        <td>
          ${formatDate(dateKey)}
        </td>

        <td>
          <span class="badge-status badge-${c.status.toLowerCase()}">
            ${c.status}
          </span>
        </td>

        <td>
          <span class="risk-badge risk-${c.risk.toLowerCase()}">
            ${c.risk}
          </span>
        </td>

        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="compliance-bar-bg" style="width:56px">
              <div class="compliance-bar-fill ${sc}" style="width:${c.complianceScore}%"></div>
            </div>
            <span class="text-xs font-bold">${c.complianceScore}%</span>
          </div>
        </td>

      </tr>`;
  }).join('');

  if (metaEl) {
    metaEl.textContent =
      `${rows.length} circular event${rows.length !== 1 ? 's' : ''} on ${formatDate(dateKey)}`;
  }
}

// function showCalEvents(dateKey) {
//   const list = document.getElementById('cal-event-list');
//   const ev   = buildCalEvents()[dateKey] || [];

//   document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('cal-selected'));
//   const sel = document.querySelector(`.cal-day[data-date="${dateKey}"]`);
//   if (sel) sel.classList.add('cal-selected');

//   if (!ev.length) {
//     list.innerHTML = `<div class="cal-event-placeholder">No events on ${formatDate(dateKey)}</div>`;
//     return;
//   }

//   const statusStyle = {
//     'Overdue':     'background:#fee2e2;color:#991b1b',
//     'Open':        'background:#fef3c7;color:#92400e',
//     'In Progress': 'background:#e0f2fe;color:#0369a1',
//     'Complete':    'background:#dcfce7;color:#166534',
//     'Active':      'background:#dcfce7;color:#166534',
//     'Closed':      'background:#f3f4f6;color:#6b7280',
//   };
//   const typeMeta = {
//     'overdue':   { icon:'🔴', label:'Overdue Task'       },
//     'open-task': { icon:'🟡', label:'Open Task'          },
//     'deadline':  { icon:'📅', label:'Circular Due'       },
//     'effective': { icon:'✅', label:'Circular Effective' },
//   };

//   list.innerHTML = `
//     <div style="font-size:12px;font-weight:700;color:var(--text-muted);
//                 padding:8px 12px 6px;border-bottom:1px solid var(--border)">
//       ${formatDate(dateKey)} &nbsp;·&nbsp; ${ev.length} item${ev.length!==1?'s':''}
//     </div>
//     ${ev.map(e => {
//       const tm = typeMeta[e.type] || { icon:'●', label:e.type };
//       const ss = statusStyle[e.status] || 'background:#f3f4f6;color:#374151';
//       return `
//         <div class="cal-event-item ${e.type}"
//              onclick="window.CMS && window.CMS.navigateTo('circular-library','${e.id}')"
//              style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;
//                     border-bottom:1px solid var(--border-light);cursor:pointer"
//              onmouseover="this.style.background='#f8fafc'"
//              onmouseout="this.style.background=''">
//           <span style="font-size:15px;margin-top:1px">${tm.icon}</span>
//           <div style="flex:1;min-width:0">
//             <div style="font-size:10px;font-weight:700;color:var(--text-muted);
//                         text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">
//               ${tm.label} · ${e.source}
//             </div>
//             <div style="font-size:12px;font-weight:600;white-space:nowrap;
//                         overflow:hidden;text-overflow:ellipsis" title="${e.label}">
//               ${e.label}
//             </div>
//             <div style="display:flex;align-items:center;gap:6px;margin-top:5px;flex-wrap:wrap">
//               <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;${ss}">
//                 ${e.status}
//               </span>
//               ${e.risk       ? `<span style="font-size:10px;color:var(--text-muted)">${e.risk} risk</span>`:''}
//               ${e.regulator  ? `<span style="font-size:10px;color:var(--text-muted)">${e.regulator}</span>`:''}
//               ${e.assignee   ? `<span style="font-size:10px;color:var(--text-muted)">👤 ${e.assignee}</span>`:''}
//               ${e.department ? `<span style="font-size:10px;color:var(--text-muted)">🏢 ${e.department}</span>`:''}
//             </div>
//           </div>
//         </div>`;
//     }).join('')}`;
// }

/* ═══════════════════════════════════════════════════════════════
   CHARTS  (pie + bar only — line/trend chart removed entirely)
   ═══════════════════════════════════════════════════════════════ */
function initCharts() {
  destroyCharts();
  renderPieChart();
  renderBarChart();
}

function destroyCharts() {
  if (pieChart) { pieChart.destroy(); pieChart = null; }
  if (barChart) { barChart.destroy(); barChart = null; }
}

function renderPieChart() {
  const ctx = document.getElementById('pie-chart');
  if (!ctx) return;
  const { tasks } = DATA();
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Open','In Progress','Complete','Overdue'],
      datasets: [{
        data: [
          tasks.filter(t=>t.status==='Open').length,
          tasks.filter(t=>t.status==='In Progress').length,
          tasks.filter(t=>t.status==='Complete').length,
          tasks.filter(t=>t.status==='Overdue').length,
        ],
        backgroundColor: ['#f59e0b','#6366f1','#10b981','#ef4444'],
        borderWidth: 3, borderColor: '#fff', hoverOffset: 8
      }]
    },
    options: {
      responsive:true, maintainAspectRatio:false, cutout:'68%',
      plugins:{ legend:{ position:'bottom', labels:{ font:{size:10}, boxWidth:10, padding:8 } } }
    }
  });
}

// aggregate tasks by department and status for workload chart
function getDepartmentWorkload() {
  const { tasks } = DATA();
  const stats = {};
  const statuses = ['Open','In Progress','Complete','Overdue','NA'];
  tasks.forEach(t => {
    const dept = t.department || 'NA';
    if (!stats[dept]) stats[dept] = { Open:0, 'In Progress':0, Complete:0, Overdue:0, NA:0 };
    const st = statuses.includes(t.status) ? t.status : 'NA';
    stats[dept][st] = (stats[dept][st] || 0) + 1;
  });
  const labels = Object.keys(stats);
  // build datasets per status for stacked bar
  const datasets = statuses.map((st, idx) => ({
    label: st,
    data: labels.map(d => stats[d][st] || 0),
    backgroundColor: ['#f59e0b','#6366f1','#10b981','#ef4444','#9ca3af'][idx],
    stack: 'Stack 0'
  }));
  return { labels, datasets, stats, statuses };
}

function renderBarChart() {
  const ctx = document.getElementById('bar-chart');
  if (!ctx) return;
  const workload = getDepartmentWorkload();
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: workload.labels,
      datasets: workload.datasets
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{ position:'bottom', labels:{boxWidth:10,font:{size:10}} },
        tooltip:{ mode:'index', intersect:false }
      },
      scales:{
        x:{ stacked:true, grid:{ display:false }, ticks:{ font:{size:9} } },
        y:{ stacked:true, beginAtZero:true, grid:{ color:'#f3f4f6' }, ticks:{ stepSize:1, font:{size:9} } }
      },
      onClick(evt, elements) {
        if (!elements.length) return;
        const el = elements[0];
        const dept = this.data.labels[el.index];
        showDeptPopover(dept, workload.stats[dept], evt);
      }
    }
  });
}

// simple popover showing detailed counts and heatmap
function showDeptPopover(dept, counts, evt) {
  // remove existing popover
  const existing = document.getElementById('dept-popover');
  if (existing) existing.remove();
  const pop = document.createElement('div');
  pop.id = 'dept-popover';
  pop.style.position = 'absolute';
  pop.style.zIndex = 9999;
  pop.style.background = '#fff';
  pop.style.border = '1px solid #ccc';
  pop.style.borderRadius = '6px';
  pop.style.padding = '12px';
  pop.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  pop.style.minWidth = '180px';
  pop.innerHTML = `<strong>${dept} workload</strong><br>`;
  const statusOrder = ['Open','In Progress','Complete','Overdue','NA'];
  statusOrder.forEach(s => {
    pop.innerHTML += `<div style="margin:4px 0">${s}: ${counts[s] || 0}</div>`;
  });
  // heatmap table
  pop.innerHTML += '<div style="margin-top:8px;font-size:12px">Heat map</div>';
  const totalMax = Math.max(...statusOrder.map(s=>counts[s]||0),1);
  const heatTable = document.createElement('table');
  heatTable.style.borderCollapse = 'collapse';
  const row = heatTable.insertRow();
  statusOrder.forEach(s => {
    const cell = row.insertCell();
    const val = counts[s] || 0;
    const pct = Math.round((val/totalMax)*100);
    cell.textContent = val;
    cell.style.padding = '4px 6px';
    cell.style.background = `hsl(200, ${pct}%, ${100 - pct/2}%)`;
    cell.style.color = pct>50?'#000':'#000';
  });
  pop.appendChild(heatTable);

  document.body.appendChild(pop);
  // position near click
  const rect = evt.chart.canvas.getBoundingClientRect();
  pop.style.left = rect.left + evt.x + 'px';
  pop.style.top  = rect.top  + evt.y + 'px';
}


/* ═══════════════════════════════════════════════════════════════
   EXTRA INLINE STYLES (injected once at load)
   ═══════════════════════════════════════════════════════════════ */
(function injectStyles() {
  if (document.getElementById('_db-extra')) return;
  const s = document.createElement('style');
  s.id = '_db-extra';
  s.textContent = `
    /* Calendar: overdue day highlight */
    .cal-day.cal-hl-overdue {
      background: #fee2e2 !important;
      border: 1.5px solid #ef4444 !important;
      font-weight: 700;
      color: #991b1b;
    }
    /* Calendar: open task day highlight */
    .cal-day.cal-hl-open {
      background: #fef9c3 !important;
      border: 1.5px solid #f59e0b !important;
    }
    /* Orange dot for open tasks */
    .cal-day-dot.open-task { background: #f59e0b !important; }

    /* Calendar event list left-border by type */
    .cal-event-item.overdue   { border-left: 3px solid #ef4444; }
    .cal-event-item.open-task { background:"blue",border-left: 3px solid #f59e0b; }
    .cal-event-item.deadline  { border-left: 3px solid #6366f1; }
    .cal-event-item.effective { border-left: 3px solid #10b981; }

    /* Today's circulars event tag badges */
    .db-event-tag {
      display: inline-block;
      font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 4px;
      white-space: nowrap; margin-right: 2px;
    }
    .db-event-tag.badge-due-today { background: #ede9fe; color: #5b21b6; }
    .db-event-tag.badge-effective { background: #dcfce7; color: #166534; }
    .db-event-tag.badge-upcoming  { background: #e0f2fe; color: #0369a1; }

    /* popover for department workload */
    #dept-popover { font-size:13px; }
    #dept-popover table { margin-top:4px; }
    #dept-popover td { text-align:center; border:1px solid #e5e7eb; }
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function formatDate(ds) {
  if (!ds) return '—';
  return new Date(ds).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function getDaysLeft(ds) {
  if (!ds) return 999;
  return Math.ceil((new Date(ds) - new Date()) / 86400000);
}




// hide popover when clicking outside
document.addEventListener('click', e => {
  const pop = document.getElementById('dept-popover');
  if (pop && !pop.contains(e.target)) pop.remove();
});



/* ═══════════════════════════════════════════════════════════════
   SPOC DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function renderSPOCDashboard() {
  const area = document.getElementById('content-area');
  area.innerHTML = buildSPOCDashboardHTML();
  initSPOCKPICards();
  renderSPOCAlertBanner();
}

function buildSPOCDashboardHTML() {
  const d = DATA();
  const spoc = (typeof CMS_DATA !== 'undefined' && CMS_DATA.spocDashboard)
    ? CMS_DATA.spocDashboard
    : {
        kpi: { pendingReview: 7, overdueObligations: 3, unassignedClauses: 11, complianceScore: 68 },
        pipeline: [
          { stage: 'Received',          count: 14, color: '#6366f1' },
          { stage: 'Clauses Mapped',    count: 11, color: '#3b82f6' },
          { stage: 'Assigned',          count: 8,  color: '#f59e0b' },
          { stage: 'Evidence Uploaded', count: 5,  color: '#10b981' },
          { stage: 'Closed',            count: 2,  color: '#9ca3af' }
        ],
        recentCirculars: []
      };

  const kpi = spoc.kpi;
  const overdueCount = d.tasks.filter(t => t.status === 'Overdue').length;
  const avgScore = Math.round(d.circulars.reduce((s, c) => s + (c.complianceScore || 0), 0) / d.circulars.length);

  const kpiCards = [
    {
      id: 'spoc-kpi-pending', icon: '◫', accent: '#6366f1',
      value: kpi.pendingReview,
      label: 'Circulars Pending Review',
      sub: '3 high risk',
      trend: '↑ +2 since last week', trendUp: false,
      navTarget: 'my-items-obligations'
    },
    {
      id: 'spoc-kpi-overdue', icon: '⚠', accent: '#ef4444',
      value: overdueCount || kpi.overdueObligations,
      label: 'Overdue Obligations',
      sub: 'Immediate action needed',
      trend: '↑ Act now', trendUp: false,
      navTarget: 'my-items-obligations'
    },
    {
      id: 'spoc-kpi-unassigned', icon: '⊡', accent: '#f59e0b',
      value: kpi.unassignedActivities,
      label: 'Unassigned Activities',
      sub: '4 critical priority',
      trend: '→ Assign now', trendUp: false,
      navTarget: 'assign-activity'
    },
    {
      id: 'spoc-kpi-score', icon: '◎', accent: '#10b981',
      value: (avgScore || kpi.complianceScore) + '%',
      label: 'Compliance Score',
      sub: d.circulars.filter(c => c.status === 'Active').length + ' active circulars',
      trend: '↑ +5% vs last month', trendUp: true,
      navTarget: null
    }
  ];

  const kpiHTML = kpiCards.map((c, i) => `
    <div class="metric-card-v2 spoc-kpi-card" id="${c.id}"
         data-nav="${c.navTarget || ''}"
         style="--mc2-accent:${c.accent};animation-delay:${i * 60}ms;cursor:${c.navTarget ? 'pointer' : 'default'}">
      <div class="mc2-shine"></div>
      <div class="mc2-top">
        <div class="mc2-icon-wrap"><span class="mc2-icon">${c.icon}</span></div>
        <div class="mc2-trend ${c.trendUp ? 'trend-up' : 'trend-dn'}">${c.trend}</div>
      </div>
      <div class="mc2-value">${c.value}</div>
      <div class="mc2-label">${c.label}</div>
      <div class="mc2-sub">${c.sub}</div>
    </div>
  `).join('');

  const pipeline = spoc.pipeline;
  const pipelineTotal = pipeline[0].count;
  const pipelineHTML = pipeline.map((stage, i) => {
    const isLast = i === pipeline.length - 1;
    return `
      <div class="spoc-pipeline-stage"
           style="flex:${stage.count}"
           onclick="window.CMS && window.CMS.navigateTo('my-items-obligations')">
        <div class="spoc-pipeline-bar" style="background:${stage.color}"></div>
        <div class="spoc-pipeline-meta">
          <span class="spoc-pipeline-count" style="color:${stage.color}">${stage.count}</span>
          <span class="spoc-pipeline-name">${stage.stage}</span>
        </div>
      </div>
      ${!isLast ? '<span class="spoc-pipeline-sep">›</span>' : ''}
    `;
  }).join('');

  const recentHTML = spoc.recentCirculars.map(rc => {
    const actionBadges = [];
    if (rc.needsAssignment > 0) {
      actionBadges.push(`<button class="spoc-action-pill spoc-pill-warning"
        onclick="event.stopPropagation();window.CMS&&window.CMS.navigateTo('assign-activity')"
        title="Forms needing assignment">${rc.needsAssignment} form${rc.needsAssignment > 1 ? 's' : ''} need assignment</button>`);
    }
    if (rc.requiresReview > 0) {
      actionBadges.push(`<button class="spoc-action-pill spoc-pill-info"
        onclick="event.stopPropagation();window.CMS&&window.CMS.navigateTo('my-items-obligations')"
        title="Forms requiring review">${rc.requiresReview} form${rc.requiresReview > 1 ? 's' : ''} require review</button>`);
    }
    if (rc.requiresEvidence > 0) {
      actionBadges.push(`<button class="spoc-action-pill spoc-pill-danger"
        onclick="event.stopPropagation();window.CMS&&window.CMS.navigateTo('flagged-evidence')"
        title="Forms requiring evidence">${rc.requiresEvidence} form${rc.requiresEvidence > 1 ? 's' : ''} require${rc.requiresEvidence === 1 ? 's' : ''} evidence</button>`);
    }
    const noAction = actionBadges.length === 0
      ? '<span class="spoc-action-pill spoc-pill-none">No Actions Pending</span>' : '';
    return `
      <tr class="clickable"
          onclick="window.CMS && window.CMS.navigateTo('circular-library', '${rc.id}')">
        <td><span style="font-family:monospace;font-size:11px;font-weight:700;color:var(--accent)">${rc.id}</span></td>
        <td style="max-width:200px">
          <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
            <span style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
                 title="${rc.title}">${rc.title}</span>
            ${rc.status === 'Withdrawn' ? '<span class="circ-withdrawn-badge">Withdrawn</span>' : ''}
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${rc.regulator}</div>
        </td>
        <td style="font-size:12px;color:var(--text-secondary);white-space:nowrap">${rc.releaseDate ? formatDate(rc.releaseDate) : '—'}</td>
        <td style="font-size:12px;color:var(--text-secondary);white-space:nowrap">${formatDate(rc.receivedDate)}</td>
        <td>
          <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center">
            ${actionBadges.join('') || noAction}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
  <div class="fade-in">
    <div id="spoc-alert-banner"></div>

    <!-- ── KPI CARDS ── -->
    <div class="db-section-header">
      <div class="db-section-title">Actionable Summary</div>
      <div class="db-section-meta" id="spoc-filter-label">Updated just now · SPOC View</div>
    </div>
    <div class="metrics-grid-v2" id="spoc-kpi-grid">${kpiHTML}</div>

    <!-- ── COMPLIANCE PIPELINE ── -->
    <div class="db-section-header" style="margin-top:8px">
      <div class="db-section-title">Compliance Pipeline</div>
      <div class="db-section-meta">${pipelineTotal} activities total</div>
    </div>
    <div class="table-card spoc-pipeline-wrap" style="margin-bottom:24px">
      <div class="spoc-pipeline">${pipelineHTML}</div>
    </div>

    <!-- ── RECENT CIRCULARS + QUICK ACTIONS ── -->
    <div class="db-main-grid">

      <!-- Recent Circulars (left/wide) -->
      <div class="db-left-col">
        <div class="db-section-header">
          <div class="db-section-title">Recent Circulars</div>
          <button class="db-nav-btn"
                  onclick="window.CMS && window.CMS.navigateTo('circular-library')">
            View All →
          </button>
        </div>
        <div class="table-card">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Circular</th>
                  <th>Release Date</th>
                  <th>Received Date</th>
                  <th>Actions Required</th>
                </tr>
              </thead>
              <tbody>${recentHTML}</tbody>
            </table>
          </div>
          <!-- Badge Legend -->
          <div class="spoc-badge-legend">
            <span class="spoc-legend-label">Legend:</span>
            <span class="spoc-action-pill spoc-pill-warning" style="pointer-events:none;cursor:default">Needs Assignment</span>
            <span class="spoc-action-pill spoc-pill-info"    style="pointer-events:none;cursor:default">Requires Review</span>
            <span class="spoc-action-pill spoc-pill-danger"  style="pointer-events:none;cursor:default">Requires Evidence</span>
            <span class="spoc-action-pill spoc-pill-none"    style="pointer-events:none;cursor:default">No Actions Pending</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions (right/narrow) -->
      <div class="db-right-col">
        <div class="db-section-header">
          <div class="db-section-title">Quick Actions</div>
        </div>
        <div class="table-card spoc-quick-actions">
          <div class="spoc-qa-item">
            <div class="spoc-qa-icon" style="background:#eef2ff;color:#6366f1">◉</div>
            <div class="spoc-qa-body">
              <div class="spoc-qa-title">Assign Activity</div>
              <div class="spoc-qa-desc">Route activities to dept owners</div>
            </div>
            <button class="btn btn-outline btn-sm"
                    onclick="window.CMS && window.CMS.navigateTo('assign-activity')">Go</button>
          </div>
          <div class="spoc-qa-item">
            <div class="spoc-qa-icon" style="background:#fef3c7;color:#92400e">◎</div>
            <div class="spoc-qa-body">
              <div class="spoc-qa-title">Send Reminder</div>
              <div class="spoc-qa-desc">Nudge owners with overdue items</div>
            </div>
            <button class="btn btn-outline btn-sm"
                    onclick="spocSendReminder()">Go</button>
          </div>
          <div class="spoc-qa-item">
            <div class="spoc-qa-icon" style="background:#fee2e2;color:#991b1b">⚑</div>
            <div class="spoc-qa-body">
              <div class="spoc-qa-title">Missing / Inaccurate Evidence</div>
              <div class="spoc-qa-desc">Review flagged evidence submissions</div>
            </div>
            <button class="btn btn-outline btn-sm"
                    onclick="window.CMS && window.CMS.navigateTo('flagged-evidence')">Go</button>
          </div>
          <div class="spoc-qa-item">
            <div class="spoc-qa-icon" style="background:#e0f2fe;color:#0369a1">◧</div>
            <div class="spoc-qa-body">
              <div class="spoc-qa-title">Generate Report</div>
              <div class="spoc-qa-desc">Export compliance status report</div>
            </div>
            <button class="btn btn-outline btn-sm"
                    onclick="window.CMS && window.CMS.navigateTo('reports')">Go</button>
          </div>
        </div>
      </div>

    </div><!-- /db-main-grid -->
  </div>`;
}

function initSPOCKPICards() {
  document.querySelectorAll('.spoc-kpi-card').forEach(card => {
    const nav = card.dataset.nav;
    if (!nav) return;
    card.addEventListener('click', () => {
      window.CMS && window.CMS.navigateTo(nav);
    });
  });
}

function renderSPOCAlertBanner() {
  const banner = document.getElementById('spoc-alert-banner');
  if (!banner) return;
  const { tasks } = DATA();
  const overdue  = tasks.filter(t => t.status === 'Overdue');
  const highOpen = tasks.filter(t => t.risk === 'High' && t.status === 'Open');
  if (!overdue.length && !highOpen.length) { banner.innerHTML = ''; return; }
  const pills = [];
  if (overdue.length)  pills.push(`<span class="alert-pill danger">🔴 ${overdue.length} Overdue Obligation${overdue.length > 1 ? 's' : ''}</span>`);
  if (highOpen.length) pills.push(`<span class="alert-pill warning">⚠ ${highOpen.length} High-Risk Unresolved</span>`);
  banner.innerHTML = `
    <div class="alert-banner-strip">
      <span class="alert-banner-icon">📢</span>
      <div class="alert-banner-pills">${pills.join('')}</div>
      <button class="alert-banner-close" onclick="this.closest('.alert-banner-strip').remove()">✕</button>
    </div>`;
}

window.spocSendReminder = function () {
  const modal = document.getElementById('generic-modal');
  const title = document.getElementById('generic-modal-title');
  const body  = document.getElementById('generic-modal-body');
  if (!modal) { showToastGlobal('Reminder sent!', 'success'); return; }

  const tasks = DATA().tasks.filter(t => t.status !== 'Complete');
  const today = new Date();

  const statusStyle = s => ({
    'Overdue':     'background:#fee2e2;color:#991b1b;border:1px solid #ef4444',
    'In Progress': 'background:#fef3c7;color:#92400e;border:1px solid #f59e0b',
    'Open':        'background:#e0f2fe;color:#0369a1;border:1px solid #38bdf8',
  }[s] || 'background:#f3f4f6;color:#6b7280');

  const priorityStyle = p => ({
    'Critical': 'color:#dc2626;font-weight:700',
    'High':     'color:#f59e0b;font-weight:700',
    'Medium':   'color:#6366f1;font-weight:600',
    'Low':      'color:#10b981;font-weight:600',
  }[p] || '');

  const daysLeft = due => {
    if (!due) return '—';
    const diff = Math.ceil((new Date(due) - today) / 86400000);
    if (diff < 0)  return `<span style="color:#dc2626;font-weight:700">${Math.abs(diff)}d overdue</span>`;
    if (diff === 0) return `<span style="color:#dc2626;font-weight:700">Due today</span>`;
    if (diff <= 3)  return `<span style="color:#f59e0b;font-weight:700">${diff}d left</span>`;
    return `<span style="color:#6b7280">${diff}d left</span>`;
  };

  const rows = tasks.map((t, i) => {
    const isOverdue = t.status === 'Overdue';
    return `
      <tr>
        <td style="padding:10px 12px;text-align:center;width:36px">
          <input type="checkbox" class="sr-checkbox" data-idx="${i}"
                 ${isOverdue ? 'checked' : ''}
                 style="width:15px;height:15px;cursor:pointer;accent-color:#6366f1">
        </td>
        <td style="padding:10px 12px">
          <div style="font-weight:600;font-size:12px;color:var(--text-primary)">${t.assignee || '—'}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:1px">${t.department || ''}</div>
        </td>
        <td style="padding:10px 12px;font-size:12px;color:var(--text-secondary)">
          <div style="font-weight:600;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px"
               title="${t.title}">${t.title}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:1px">${t.id} · ${t.circularId}</div>
        </td>
        <td style="padding:10px 12px;white-space:nowrap;font-size:12px">
          <span style="display:inline-flex;align-items:center;font-size:11px;font-weight:600;
                       padding:2px 8px;border-radius:99px;${statusStyle(t.status)}">
            ${t.status}
          </span>
        </td>
        <td style="padding:10px 12px;white-space:nowrap;font-size:12px;${priorityStyle(t.priority)}">${t.priority || '—'}</td>
        <td style="padding:10px 12px;white-space:nowrap;font-size:12px">
          ${t.dueDate ? formatDate(t.dueDate) : '—'}
        </td>
        <td style="padding:10px 12px;white-space:nowrap;font-size:12px">
          ${daysLeft(t.dueDate)}
        </td>
      </tr>`;
  }).join('');

  title.textContent = 'Send Reminder';
  body.innerHTML = `
    <div style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:8px">
        Recipients
        <span style="font-weight:400;color:var(--text-muted);margin-left:6px">
          — tick the people you want to remind
        </span>
      </div>
      <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden">
        <div style="overflow-x:auto;max-height:320px;overflow-y:auto">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
              <tr style="background:var(--surface-alt,#f9fafb);position:sticky;top:0;z-index:1">
                <th style="padding:8px 12px;text-align:center;width:36px;border-bottom:1px solid var(--border)">
                  <input type="checkbox" id="sr-select-all" title="Select all"
                         style="width:15px;height:15px;cursor:pointer;accent-color:#6366f1"
                         onchange="document.querySelectorAll('.sr-checkbox').forEach(c=>c.checked=this.checked)">
                </th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border)">Assignee</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border)">Activity</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border)">Status</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border)">Priority</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border)">Due Date</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border)">Time Left</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:6px">
        Overdue items are pre-selected. Completed items are excluded.
      </div>
    </div>

    <div style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:6px">Message</div>
      <textarea id="sr-message" style="width:100%;box-sizing:border-box;padding:10px 12px;
                border:1px solid var(--border);border-radius:8px;font-size:13px;
                font-family:var(--font-body);color:var(--text-primary);
                background:var(--surface);resize:vertical;min-height:90px;outline:none"
                rows="4">Please complete your assigned compliance tasks at the earliest. Several items are overdue or approaching their deadline. Kindly update the status or raise a request if you need support.</textarea>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px">
      <button class="btn btn-ghost btn-sm"
              onclick="document.getElementById('generic-modal').classList.add('hidden')">Cancel</button>
      <button class="btn btn-primary btn-sm"
              onclick="_spocDoSendReminder()">Send Reminder →</button>
    </div>
  `;

  modal.classList.remove('hidden');
};

window._spocDoSendReminder = function () {
  const checked = document.querySelectorAll('.sr-checkbox:checked');
  if (!checked.length) { showToastGlobal('Select at least one recipient', 'warning'); return; }
  document.getElementById('generic-modal').classList.add('hidden');
  showToastGlobal(`Reminder sent to ${checked.length} recipient${checked.length > 1 ? 's' : ''} ✓`, 'success');
};

/* ══════════════════════════════════════════════════════════════
   ASSIGNEE DASHBOARD
   ══════════════════════════════════════════════════════════════ */
function renderAssigneeDashboard() {
  const area = document.getElementById('content-area');
  area.innerHTML = buildAssigneeDashboardHTML();
  initAssigneeKPICards();
}

function buildAssigneeDashboardHTML() {
  const tasks = (CMS_DATA && CMS_DATA.tasks) ? CMS_DATA.tasks : [];
  const total      = tasks.length;
  const overdue    = tasks.filter(t => t.status === 'Overdue').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed  = tasks.filter(t => t.status === 'Complete').length;
  const open       = tasks.filter(t => t.status === 'Open').length;

  const kpis = [
    { label: 'Total Obligations', value: total,      accent: '#6366f1', icon: '◉', nav: 'my-items-obligations', desc: 'All assigned items' },
    { label: 'Overdue',           value: overdue,    accent: '#ef4444', icon: '⚠', nav: 'my-items-obligations', desc: 'Past due date' },
    { label: 'In Progress',       value: inProgress, accent: '#f59e0b', icon: '◎', nav: 'my-items-obligations', desc: 'Actively working' },
    { label: 'Completed',         value: completed,  accent: '#10b981', icon: '✓', nav: 'my-items-obligations', desc: 'Closed items' },
  ];

  const kpiHTML = kpis.map(k => `
    <div class="metric-card-v2 assignee-kpi-card" data-nav="${k.nav}"
         style="--mc2-accent:${k.accent};cursor:pointer">
      <div class="mc2-header">
        <span class="mc2-icon" style="color:${k.accent}">${k.icon}</span>
        <span class="mc2-label">${k.label}</span>
      </div>
      <div class="mc2-value" style="color:${k.accent}">${k.value}</div>
      <div class="mc2-desc">${k.desc}</div>
    </div>`).join('');

  // Build recent items table from tasks (up to 8)
  const recentTasks = tasks.slice(0, 8);
  const statusColor = s => ({
    'Open': '#6366f1', 'In Progress': '#f59e0b',
    'Complete': '#10b981', 'Overdue': '#ef4444'
  }[s] || '#6b7280');

  const priorityBadge = p => {
    const map = { 'Critical': '#ef4444', 'High': '#f59e0b', 'Medium': '#6366f1', 'Low': '#10b981' };
    return `<span style="background:${map[p]||'#9ca3af'}22;color:${map[p]||'#9ca3af'};
      font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px">${p||'—'}</span>`;
  };

  const tableRows = recentTasks.map(t => `
    <tr>
      <td style="font-weight:600;color:#6366f1;cursor:pointer"
          onclick="if(window.openTaskDetail)openTaskDetail('${t.id}')">${t.id}</td>
      <td>${t.title}</td>
      <td>${t.department || '—'}</td>
      <td>${priorityBadge(t.priority)}</td>
      <td>${t.dueDate ? formatDate(t.dueDate) : '—'}</td>
      <td><span style="color:${statusColor(t.status)};font-weight:600">${t.status}</span></td>
    </tr>`).join('');

  const openCount = open;

  return `
  <div class="dashboard-root" style="display:flex;flex-direction:column;gap:20px;padding:20px 24px">

    <!-- KPI CARDS -->
    <div class="assignee-kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
      ${kpiHTML}
    </div>

    <!-- ALERT BANNER (overdue) -->
    ${overdue > 0 ? `
    <div class="alert-banner-strip" style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;
         padding:12px 18px;display:flex;align-items:center;gap:12px">
      <span style="font-size:18px">⚠️</span>
      <span style="color:#b91c1c;font-weight:600">You have ${overdue} overdue obligation${overdue > 1 ? 's' : ''}.
        Please update the status or raise a request.</span>
      <button class="alert-banner-close" style="margin-left:auto;background:none;border:none;
              cursor:pointer;color:#9ca3af;font-size:16px"
              onclick="this.closest('.alert-banner-strip').remove()">✕</button>
    </div>` : ''}

    <!-- MY ITEMS TABLE -->
    <div class="dash-card" style="background:var(--surface);border-radius:14px;
         border:1px solid var(--border);overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;
                  padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-display);font-weight:700;font-size:15px">My Items</div>
        <button class="btn btn-ghost btn-sm" style="font-size:12px"
                onclick="if(window.CMS)window.CMS.navigateTo('my-items-obligations')">
          View All →
        </button>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:var(--surface-alt,#f9fafb)">
              <th style="padding:10px 16px;text-align:left;font-weight:600;color:var(--text-muted);
                         border-bottom:1px solid var(--border)">ID</th>
              <th style="padding:10px 16px;text-align:left;font-weight:600;color:var(--text-muted);
                         border-bottom:1px solid var(--border)">Obligation</th>
              <th style="padding:10px 16px;text-align:left;font-weight:600;color:var(--text-muted);
                         border-bottom:1px solid var(--border)">Department</th>
              <th style="padding:10px 16px;text-align:left;font-weight:600;color:var(--text-muted);
                         border-bottom:1px solid var(--border)">Priority</th>
              <th style="padding:10px 16px;text-align:left;font-weight:600;color:var(--text-muted);
                         border-bottom:1px solid var(--border)">Due Date</th>
              <th style="padding:10px 16px;text-align:left;font-weight:600;color:var(--text-muted);
                         border-bottom:1px solid var(--border)">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--text-muted)">No items assigned.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div style="padding:10px 20px;border-top:1px solid var(--border);font-size:12px;color:var(--text-muted)">
        Showing ${recentTasks.length} of ${total} items
        ${openCount > 0 ? `&nbsp;·&nbsp;<span style="color:#f59e0b;font-weight:600">${openCount} open</span>` : ''}
      </div>
    </div>

  </div>`;
}

function initAssigneeKPICards() {
  document.querySelectorAll('.assignee-kpi-card[data-nav]').forEach(card => {
    card.addEventListener('click', () => {
      const page = card.dataset.nav;
      if (window.CMS && window.CMS.navigateTo) window.CMS.navigateTo(page);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   FLAGGED EVIDENCE PAGE
   ══════════════════════════════════════════════════════════════ */
window.renderFlaggedEvidence = function () {
  const area = document.getElementById('content-area');
  area.innerHTML = buildFlaggedEvidenceHTML();
  initFlaggedEvidenceFilters();
};

function buildFlaggedEvidenceHTML() {
  const data = (typeof CMS_DATA !== 'undefined' && CMS_DATA.flaggedEvidence)
    ? CMS_DATA.flaggedEvidence : [];

  const missingCount    = data.filter(r => r.evidenceStatus === 'Missing').length;
  const inaccurateCount = data.filter(r => r.evidenceStatus === 'Inaccurate').length;

  const circulars = [...new Set(data.map(r => r.circularId))];
  const assignees = [...new Set(data.map(r => r.assignedTo))];

  const rowsHTML = data.map(r => {
    const isMissing = r.evidenceStatus === 'Missing';
    const statusStyle = isMissing
      ? 'background:#fee2e2;color:#991b1b;border:1px solid #ef4444'
      : 'background:#fef3c7;color:#92400e;border:1px solid #f59e0b';
    return `
      <tr class="fe-row" data-status="${r.evidenceStatus}" data-circular="${r.circularId}" data-assignee="${r.assignedTo}">
        <td style="font-weight:600;font-size:13px">${r.activityName}</td>
        <td><span style="font-family:monospace;font-size:11px;font-weight:700;color:var(--accent)">${r.circularId}</span></td>
        <td style="font-size:13px">${r.assignedTo}</td>
        <td>
          <span style="display:inline-flex;align-items:center;font-size:11px;font-weight:700;
                       padding:3px 9px;border-radius:99px;white-space:nowrap;${statusStyle}">
            ${r.evidenceStatus}
          </span>
        </td>
        <td style="font-size:12px;color:var(--text-secondary);white-space:nowrap">${formatDate(r.dateFlagged)}</td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-outline btn-sm"
                    onclick="showToastGlobal('Review opened for ${r.id}','info')"
                    style="font-size:11px;padding:3px 10px">Review</button>
            <button class="btn btn-ghost btn-sm"
                    onclick="showToastGlobal('Resubmission requested for ${r.id}','warning')"
                    style="font-size:11px;padding:3px 10px">Request Resubmission</button>
          </div>
        </td>
      </tr>`;
  }).join('');

  const circularOptions = circulars.map(c => `<option value="${c}">${c}</option>`).join('');
  const assigneeOptions = assignees.map(a => `<option value="${a}">${a}</option>`).join('');

  return `
  <div class="fade-in" style="padding:20px 24px">

    <!-- Summary Strip -->
    <div style="display:flex;gap:12px;margin-bottom:20px">
      <div class="table-card" style="flex:0 0 auto;padding:14px 24px;display:flex;
           align-items:center;gap:12px;border-left:4px solid #ef4444">
        <span style="font-family:var(--font-display);font-size:28px;font-weight:800;
                     color:#ef4444;line-height:1">${missingCount}</span>
        <span style="font-size:13px;font-weight:600;color:var(--text-primary)">Missing</span>
      </div>
      <div class="table-card" style="flex:0 0 auto;padding:14px 24px;display:flex;
           align-items:center;gap:12px;border-left:4px solid #f59e0b">
        <span style="font-family:var(--font-display);font-size:28px;font-weight:800;
                     color:#f59e0b;line-height:1">${inaccurateCount}</span>
        <span style="font-size:13px;font-weight:600;color:var(--text-primary)">Inaccurate</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="table-card" style="padding:14px 20px;margin-bottom:16px;
         display:flex;gap:12px;flex-wrap:wrap;align-items:center">
      <span style="font-size:12px;font-weight:600;color:var(--text-muted)">Filter:</span>
      <select class="fe-filter" id="fe-filter-status" onchange="filterFlaggedEvidence()"
              style="font-size:12px;padding:5px 10px;border:1px solid var(--border);
                     border-radius:6px;background:var(--surface);color:var(--text-primary)">
        <option value="">All Statuses</option>
        <option value="Missing">Missing</option>
        <option value="Inaccurate">Inaccurate</option>
      </select>
      <select class="fe-filter" id="fe-filter-circular" onchange="filterFlaggedEvidence()"
              style="font-size:12px;padding:5px 10px;border:1px solid var(--border);
                     border-radius:6px;background:var(--surface);color:var(--text-primary)">
        <option value="">All Circulars</option>
        ${circularOptions}
      </select>
      <select class="fe-filter" id="fe-filter-assignee" onchange="filterFlaggedEvidence()"
              style="font-size:12px;padding:5px 10px;border:1px solid var(--border);
                     border-radius:6px;background:var(--surface);color:var(--text-primary)">
        <option value="">All Assignees</option>
        ${assigneeOptions}
      </select>
      <button class="btn btn-ghost btn-sm" onclick="resetFlaggedEvidenceFilters()"
              style="font-size:12px">Clear</button>
      <span id="fe-count-label" style="margin-left:auto;font-size:12px;color:var(--text-muted)">
        Showing ${data.length} of ${data.length} items
      </span>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Activity Name</th>
              <th>Circular Ref</th>
              <th>Assigned To</th>
              <th>Evidence Status</th>
              <th>Date Flagged</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="fe-tbody">
            ${rowsHTML}
          </tbody>
        </table>
      </div>
    </div>

  </div>`;
}

function initFlaggedEvidenceFilters() {
  /* filters are driven by inline onchange handlers; nothing extra needed */
}

window.filterFlaggedEvidence = function () {
  const status   = document.getElementById('fe-filter-status')?.value   || '';
  const circular = document.getElementById('fe-filter-circular')?.value || '';
  const assignee = document.getElementById('fe-filter-assignee')?.value || '';
  const rows     = document.querySelectorAll('#fe-tbody .fe-row');
  let visible    = 0;
  rows.forEach(row => {
    const match =
      (!status   || row.dataset.status   === status)   &&
      (!circular || row.dataset.circular === circular) &&
      (!assignee || row.dataset.assignee === assignee);
    row.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  const lbl = document.getElementById('fe-count-label');
  if (lbl) lbl.textContent = `Showing ${visible} of ${rows.length} items`;
};

window.resetFlaggedEvidenceFilters = function () {
  ['fe-filter-status','fe-filter-circular','fe-filter-assignee'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  window.filterFlaggedEvidence();
};

window.showCalEvents = showCalEvents;
console.log("D",DATA());
