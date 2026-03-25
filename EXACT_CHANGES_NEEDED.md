# 🎯 EXACT CHANGES FOR YOUR CODE

Your code has these functions already. Here's what to **REPLACE/ADD**:

---

## 1️⃣ REPLACE `buildClausePanel()` function

**FIND THIS:**
```javascript
function buildClausePanel() {
  const circularOptions = CMS_DATA.circulars.map(c => ...
  return `<div class="table-card">...`
}
```

**REPLACE WITH THIS:**
```javascript
function buildClausePanel() {

  const circularOptions = CMS_DATA.circulars.map(c =>
    `<option value="${c.id}">${c.id} – ${c.title}</option>`
  ).join('');

  return `
  <div class="table-card">

    <div class="table-card-header">
      <div>
        <h3>Clause → Obligation → Actionable</h3>
        <p class="subtext">Structured compliance mapping engine</p>
      </div>

      <div class="view-toggle">
        <button class="btn btn-light active" id="view-card">📋 Card View</button>
        <button class="btn btn-light" id="view-table">📊 Table View</button>
      </div>
    </div>

    <div class="panel-body">

      <div class="filter-bar">

        <select class="form-control" id="clause-circular-select">
          <option value="">Select Circular...</option>
          ${circularOptions}
        </select>

        <select class="form-control" id="clause-dept-filter">
          <option value="">All Departments</option>
          <option>IT</option>
          <option>Risk</option>
          <option>Compliance</option>
          <option>Legal</option>
          <option>Finance</option>
          <option>Operations</option>
          <option>HR</option>
          <option>Procurement</option>
        </select>

        <input type="text" class="form-control"
          id="clause-search"
          placeholder="Search clause text..." />

        <button class="btn btn-primary" id="btn-gen-clause">
          🔍 Generate
        </button>

      </div>

      <div id="stats-container"></div>
      <div id="clause-output" class="clause-output"></div>

    </div>
  </div>
  `;
}
```

**What changed:**
- ✅ Added emojis to buttons (📋 📊 🔍)
- ✅ Added `<div id="stats-container"></div>` for statistics
- ✅ Better styling classes

---

## 2️⃣ REPLACE `initClauseListeners()` function

**FIND THIS:**
```javascript
function initClauseListeners() {
  if (AI_LIFECYCLE_STATE.selectedCircularId) { ...
  let currentView = 'card'; ...
}
```

**REPLACE WITH THIS:**
```javascript
function initClauseListeners() {

  if (AI_LIFECYCLE_STATE.selectedCircularId) {
    const select = document.getElementById('clause-circular-select');
    if (select) select.value = AI_LIFECYCLE_STATE.selectedCircularId;
  }

  const btn = document.getElementById('btn-gen-clause');
  const output = document.getElementById('clause-output');

  let currentView = 'card';

  document.getElementById('view-card').onclick = () => {
    document.getElementById('view-card').classList.add('active');
    document.getElementById('view-table').classList.remove('active');
    currentView = 'card';
    renderClauses(currentView);
  };

  document.getElementById('view-table').onclick = () => {
    document.getElementById('view-table').classList.add('active');
    document.getElementById('view-card').classList.remove('active');
    currentView = 'table';
    renderClauses(currentView);
  };

  btn.addEventListener('click', () => {
    renderClauses(currentView);
  });

  // ADD THIS: Auto-render on filter change
  document.getElementById('clause-dept-filter').addEventListener('change', () => {
    renderClauses(currentView);
  });

  document.getElementById('clause-search').addEventListener('input', () => {
    renderClauses(currentView);
  });

  function renderClauses(viewType) {

    const circId = document.getElementById('clause-circular-select').value;
    const deptFilter = document.getElementById('clause-dept-filter').value;
    const search = document.getElementById('clause-search').value.toLowerCase();

    if (!circId) {
      showToast('Select circular first.', 'warning');
      return;
    }

    const circ = CMS_DATA.circulars.find(c => c.id === circId);
    if (!circ) return;

    let allClauses = [];

    circ.chapters.forEach(ch => {
      ch.clauses.forEach(cl => {
        allClauses.push({
          chapter: ch.num,
          chapterTitle: ch.title,
          ...cl
        });
      });
    });

    if (deptFilter)
      allClauses = allClauses.filter(cl => cl.department === deptFilter);

    if (search)
      allClauses = allClauses.filter(cl =>
        cl.text.toLowerCase().includes(search)
      );

    if (viewType === 'card') {
      output.innerHTML = renderCardView(allClauses, circ);
    } else {
      output.innerHTML = renderTableView(allClauses);
    }

    // ADD THIS: Render statistics
    renderStats(circ, allClauses);
  }

  // ADD THIS NEW FUNCTION
  function renderStats(circ, clauses) {
    const totalClauses = clauses.length;
    const highRisk = clauses.filter(c => c.risk === 'High').length;
    const avgScore = Math.round(
      clauses.reduce((sum, c) => sum + (c.score || 70), 0) / (clauses.length || 1)
    );
    const totalObs = clauses.reduce(
      (sum, c) => sum + (c.obligations?.length || 0),
      0
    );

    const statsHtml = `
      <div class="stats-bar">
        <div class="stat-box">
          <div class="stat-value">${totalClauses}</div>
          <div class="stat-label">Total Clauses</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color: var(--danger);">${highRisk}</div>
          <div class="stat-label">High Risk</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color: var(--success);">${avgScore}%</div>
          <div class="stat-label">Avg Compliance Score</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color: var(--primary);">${totalObs}</div>
          <div class="stat-label">Obligations Mapped</div>
        </div>
      </div>
    `;

    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
      statsContainer.innerHTML = statsHtml;
    }
  }
}
```

**What changed:**
- ✅ Added active class toggling for buttons
- ✅ Added auto-render on filter/search change
- ✅ Added statistics rendering function
- ✅ Better UX with real-time updates

---

## 3️⃣ REPLACE `renderCardView()` function

**FIND THIS:**
```javascript
function renderCardView(clauses, circ) {
  if (!clauses.length) {
    return `<div class="empty-state">No clauses found.</div>`;
  }
  return `<div class="clause-container">...`
}
```

**REPLACE WITH THIS:**
```javascript
function renderCardView(clauses, circ) {

  if (!clauses.length) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h3>No Clauses Found</h3>
        <p>Try adjusting your filters or search criteria</p>
      </div>
    `;
  }

  return `
  <div class="clause-container">

    ${clauses.map((cl, i) => `

      <div class="clause-card">

        <div class="clause-card-header"
          onclick="toggleClause(${i})">

          <div>
            <div class="breadcrumb">
              ${circ.id} > Chapter ${cl.chapter}
            </div>

            <div class="clause-title">
              ${cl.id}
            </div>

            <div class="clause-text">
              ${cl.text}
            </div>
          </div>

          <span class="risk-badge risk-${cl.risk.toLowerCase()}">
            ${cl.risk}
          </span>

        </div>

        <div class="clause-card-body"
          id="clause-body-${i}">

          <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
            <span class="score-badge" style="border-color: ${getScoreColor(cl.score)}; color: ${getScoreColor(cl.score)};">
              ✓ Score: ${cl.score || 70}%
            </span>
            <span style="font-size: 12px; color: var(--text-secondary);">${cl.department || 'N/A'}</span>
          </div>

          ${renderObligations(cl)}

        </div>

      </div>

    `).join('')}

  </div>
  `;
}
```

**What changed:**
- ✅ Better empty state with icon
- ✅ Added score display in card
- ✅ Added department label
- ✅ Better styling

---

## 4️⃣ REPLACE `renderObligations()` function

**FIND THIS:**
```javascript
function renderObligations(cl) {
  if (!cl.obligations || cl.obligations.length === 0) {
    return `<div class="empty-mini">No obligations mapped.</div>`;
  }
  return cl.obligations.map(...).join('');
}
```

**REPLACE WITH THIS:**
```javascript
function renderObligations(cl) {

  if (!cl.obligations || cl.obligations.length === 0) {
    return `<div class="empty-mini">✓ No obligations mapped yet</div>`;
  }

  return cl.obligations.map((ob, idx) => `

    <div class="obligation-card">

      <div class="ob-header">
        <strong>Obligation ${idx + 1}</strong>
        <button onclick="regenerateObligation('${cl.id}', ${idx})"
          class="regen-btn">🔄 Regenerate</button>
      </div>

      <div class="ob-text">${ob.text}</div>

      ${renderActions(cl, idx)}

    </div>

  `).join('');
}
```

**What changed:**
- ✅ Added emojis
- ✅ Better styling with separate classes

---

## 5️⃣ UPDATE `renderActions()` function

**FIND THIS:**
```javascript
function renderActions(cl, obIndex) {
  const actions = cl.obligations[obIndex].actions;
  if (!actions || actions.length === 0) {
    return `<div class="empty-mini">No actionables defined.</div>`;
  }
  return `<div class="action-container">...`
}
```

**REPLACE WITH THIS:**
```javascript
function renderActions(cl, obIndex) {

  const actions = cl.obligations[obIndex].actions;

  if (!actions || actions.length === 0) {
    return `<div class="empty-mini">→ No actionables defined</div>`;
  }

  return `
    <div class="action-container">

      ${actions.map((act, i) => `

        <div class="action-item">
          <span>→ ${act}</span>

          <button onclick="regenerateActionable('${cl.id}', ${obIndex}, ${i})"
            class="regen-btn-small">
            🔄
          </button>
        </div>

      `).join('')}

    </div>
  `;
}
```

**What changed:**
- ✅ Added arrow prefix
- ✅ Better styling classes
- ✅ Pass correct parameters to regenerate

---

## 6️⃣ REPLACE `renderTableView()` function

**FIND THIS:**
```javascript
function renderTableView(clauses) {
  if (!clauses.length)
    return `<div class="empty-state">No data found.</div>`;
  return `<div class="table-wrapper">...`
}
```

**REPLACE WITH THIS:**
```javascript
function renderTableView(clauses) {

  if (!clauses.length)
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h3>No Data Found</h3>
        <p>Try adjusting your filters or search criteria</p>
      </div>
    `;

  const rows = [];
  clauses.forEach(cl => {
    if (!cl.obligations || cl.obligations.length === 0) {
      rows.push(`
        <tr>
          <td><strong>${cl.id}</strong></td>
          <td colspan="3" style="color: var(--text-secondary); font-style: italic;">No obligations mapped</td>
        </tr>
      `);
    } else {
      cl.obligations.forEach((ob, obIdx) => {
        if (!ob.actions || ob.actions.length === 0) {
          rows.push(`
            <tr>
              <td><strong>${cl.id}</strong></td>
              <td>${ob.text}</td>
              <td colspan="2" style="color: var(--text-secondary); font-style: italic;">No actionables defined</td>
            </tr>
          `);
        } else {
          ob.actions.forEach((act, actIdx) => {
            rows.push(`
              <tr>
                <td><strong>${cl.id}</strong></td>
                <td>${ob.text}</td>
                <td>${act}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" 
                    onclick="regenerateActionable('${cl.id}', ${obIdx}, ${actIdx})">
                    🔄 Regenerate
                  </button>
                </td>
              </tr>
            `);
          });
        }
      });
    }
  });

  return `
  <div class="table-wrapper">

    <table class="clean-table">

      <thead>
        <tr>
          <th>Clause ID</th>
          <th>Obligation</th>
          <th>Actionable</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        ${rows.join('')}
      </tbody>

    </table>
  </div>
  `;
}
```

**What changed:**
- ✅ Better empty state
- ✅ Cleaner row generation
- ✅ Better styling
- ✅ Proper button styling

---

## 7️⃣ UPDATE `regenerateObligation()` function

**FIND THIS:**
```javascript
function regenerateObligation(clauseId) {
  showToast(`Regenerating obligation for ${clauseId}...`, 'info');
  setTimeout(() => {
    showToast('Obligation regenerated successfully.', 'success');
  }, 1200);
}
```

**REPLACE WITH THIS:**
```javascript
function regenerateObligation(clauseId, obIdx) {
  showToast(`🔄 Regenerating obligation for ${clauseId}...`, 'info');

  setTimeout(() => {
    showToast(`✓ Obligation regenerated successfully`, 'success');
  }, 1200);
}
```

**What changed:**
- ✅ Accept `obIdx` parameter
- ✅ Added emojis

---

## 8️⃣ UPDATE `regenerateActionable()` function

**FIND THIS:**
```javascript
function regenerateActionable(clauseId) {
  showToast(`Regenerating actionables for ${clauseId}...`, 'info');
  setTimeout(() => {
    showToast('Actionables regenerated successfully.', 'success');
  }, 1200);
}
```

**REPLACE WITH THIS:**
```javascript
function regenerateActionable(clauseId, obIdx, actIdx) {
  showToast(`🔄 Regenerating actionable...`, 'info');

  setTimeout(() => {
    showToast(`✓ Actionable regenerated successfully`, 'success');
  }, 1200);
}
```

**What changed:**
- ✅ Accept all 3 parameters
- ✅ Added emojis

---

## 9️⃣ ADD NEW FUNCTION: `getScoreColor()`

**ADD THIS NEW FUNCTION** (add at end of file):

```javascript
function getScoreColor(score) {
  if (score >= 80) return '#10b981';  // Green
  if (score >= 60) return '#f59e0b';  // Yellow
  return '#ef4444';                    // Red
}
```

---

## 🔟 ADD NEW CSS VARIABLES (in your CSS file)

**ADD THIS TO YOUR CSS FILE:**

```css
:root {
  --primary: #2563eb;
  --primary-dark: #1e40af;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Stats */
.stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-box {
  flex: 1;
  min-width: 200px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border);
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Obligations */
.obligation-card {
  margin-bottom: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--primary);
}

.ob-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
}

.ob-header strong {
  font-size: 13px;
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
}

.ob-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 12px;
  padding: 10px;
  background: var(--bg-primary);
  border-radius: 6px;
}

/* Actions */
.action-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--bg-primary);
  border-radius: 6px;
  border: 1px solid var(--border);
  gap: 8px;
  font-size: 13px;
}

.regen-btn,
.regen-btn-small {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.regen-btn {
  padding: 8px 12px;
  font-size: 12px;
}

.regen-btn:hover,
.regen-btn-small:hover {
  background: var(--primary-dark);
  transform: scale(1.05);
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.clean-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
}

.clean-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.clean-table th {
  padding: 16px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
}

.clean-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.clean-table tbody tr:hover {
  background: var(--bg-secondary);
}

/* Score badge */
.score-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background: var(--bg-secondary);
  border: 2px solid;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-state-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-mini {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  text-align: center;
}

/* Card view */
.clause-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 20px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.clause-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.clause-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.clause-card-header {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.clause-card-header:hover {
  background: linear-gradient(135deg, #e8ecf1 0%, #b8d4e0 100%);
}

.breadcrumb {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.clause-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.clause-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
}

.risk-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
  min-width: 80px;
  text-align: center;
}

.risk-high {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.risk-medium {
  background: rgba(245, 158, 11, 0.15);
  color: var(--warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.risk-low {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.clause-card-body {
  padding: 20px;
  background: var(--bg-primary);
  display: none;
  border-top: 1px solid var(--border);
}

.clause-card-body[style*="display: block"] {
  display: block;
}

/* Filter bar updates */
.filter-bar {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--border);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.table-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

---

## ✅ SUMMARY OF CHANGES

| Item | Change |
|------|--------|
| buildClausePanel() | Add stats container, emojis, better styling |
| initClauseListeners() | Add active class toggling, auto-render, stats function |
| renderCardView() | Add score, department, better empty state |
| renderObligations() | Add emojis, better styling |
| renderActions() | Add arrow prefix, better buttons |
| renderTableView() | Better empty state, cleaner rows |
| regenerateObligation() | Add obIdx parameter, emojis |
| regenerateActionable() | Add all 3 parameters, emojis |
| getScoreColor() | NEW FUNCTION |
| CSS | ADD all CSS variables and styles |

---

## 🚀 QUICK STEPS:

1. Copy-paste each function from above into your file
2. Add the CSS to your stylesheet
3. Add the new `getScoreColor()` function
4. Test in browser

**DONE!** Your enhanced clause panel is integrated! ✨
