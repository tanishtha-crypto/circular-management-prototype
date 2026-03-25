
/**
 * clause-panel.js  —  Panel 3: Clause Generation
 * Split-pane: Left nav tree | Right clause workspace
 *
 * Changes v2:
 *  • Left nav: Chapter → Section (collapsible, optional) → Clause hierarchy
 *  • Obligation accordion: added "Details" expandable chip with metadata fields
 *  • L3 Action rows: added "Details" expandable chip with same metadata fields
 *  • Soothing slate/teal palette — easy on the eyes
 */

// /* ================================================================ BUILD */
// function buildClausePanel() {
//   injectSharedCSS();
//   injectClauseCSS();
//   return `
//   <div class="cl-wrap">

//     <!-- EMPTY STATE -->
//     <div id="cl-empty" class="cl-empty-state" style="display:none;">
//       <div class="cl-empty-icon">📄</div>
//       <div class="cl-empty-title">No Circular Selected</div>
//       <div class="cl-empty-sub">Go to Overview and confirm a circular first.</div>
//       <button class="cl-empty-cta" onclick="document.querySelector('[data-tab=\\'overview\\']')?.click()">← Go to Overview</button>
//     </div>

//     <!-- MAIN -->
//     <div id="cl-main" style="display:none;">

//       <!-- TOP BAR -->
//       <div class="cl-topbar">
//         <div class="cl-topbar-left">
//           <span class="cl-circ-id-chip" id="cl-circ-id-chip">—</span>
//           <span class="cl-circ-name-chip" id="cl-circ-name-chip">—</span>
//         </div>
//         <div class="cl-topbar-right">
//           <select class="cl-filter-select" id="cl-filter-dept" title="Filter by Department">
//             <option value="">All Departments</option>
//             <option>Compliance</option><option>Risk</option><option>Operations</option>
//             <option>Legal</option><option>IT</option><option>HR</option>
//           </select>
//           <select class="cl-filter-select" id="cl-filter-risk" title="Filter by Risk">
//             <option value="">All Risk Levels</option>
//             <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
//           </select>
//           <select class="cl-filter-select" id="cl-filter-status" title="Filter by Status">
//             <option value="">All Statuses</option>
//             <option>Pending</option><option>In Progress</option><option>Compliant</option>
//           </select>
//           <div class="cl-level-toggle" id="cl-level-toggle">
//             <button class="cl-lvl-btn active" data-level="2" title="Clauses + Obligations">L2</button>
//             <button class="cl-lvl-btn" data-level="3" title="Full (+ Actions)">L3</button>
//           </div>
//           <button class="cl-topbar-btn cl-btn-generate" id="cl-btn-generate">◈ Generate</button>
//           <button class="cl-topbar-btn cl-btn-regen" id="cl-btn-regen" style="display:none;">↺ Regenerate</button>
//         </div>
//       </div>

//       <!-- SPLIT PANE -->
//       <div class="cl-split" id="cl-split" style="display:none;">

//         <!-- LEFT: Chapter → Section → Clause tree -->
//         <div class="cl-nav" id="cl-nav">
//           <div class="cl-nav-head">
//             <span class="cl-nav-title">Structure</span>
//             <span class="cl-nav-count" id="cl-nav-count">—</span>
//           </div>
//           <div class="cl-nav-tree" id="cl-nav-tree">
//             <div class="cl-nav-placeholder">Generate clauses to view structure</div>
//           </div>
//         </div>

//         <!-- RIGHT: Clause workspace -->
//         <div class="cl-workspace" id="cl-workspace">
//           <div class="cl-workspace-placeholder" id="cl-ws-placeholder">
//             <div class="cl-ws-ph-icon">📋</div>
//             <div class="cl-ws-ph-title">Select a clause from the left panel</div>
//             <div class="cl-ws-ph-sub">Generate the clause breakdown first, then click any clause to view details</div>
//           </div>
//           <div id="cl-ws-content" style="display:none;"></div>
//         </div>

//       </div>

//       <!-- FOOTER -->
//       <div class="cl-footer" id="cl-footer" style="display:none;">
//         <button class="cl-foot-btn cl-foot-save" id="cl-foot-save">🔖 &nbsp;Save Clauses</button>
//       </div>

//     </div>
//   </div>`;
// }

// /* ================================================================ INIT */
// function initClauseListeners() {
//   injectSharedCSS();
//   injectClauseCSS();

//   const circId = AI_LIFECYCLE_STATE.selectedCircularId;
//   const circ = circId ? (CMS_DATA?.circulars || []).find(x => x.id === circId) : null;

//   if (!circ) {
//     document.getElementById('cl-empty').style.display = 'flex';
//     document.getElementById('cl-main').style.display = 'none';
//     return;
//   }

//   document.getElementById('cl-empty').style.display = 'none';
//   document.getElementById('cl-main').style.display = 'block';

//   const idChip = document.getElementById('cl-circ-id-chip');
//   const nmChip = document.getElementById('cl-circ-name-chip');
//   if (idChip) idChip.textContent = circ.id;
//   if (nmChip) nmChip.textContent = circ.title;

//   document.querySelectorAll('.cl-lvl-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//       document.querySelectorAll('.cl-lvl-btn').forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');
//       const active = document.querySelector('.cl-nav-clause.active');
//       if (active) active.click();
//     });
//   });

//   ['cl-filter-dept', 'cl-filter-risk', 'cl-filter-status'].forEach(id => {
//     document.getElementById(id)?.addEventListener('change', () => {
//       if (document.querySelector('.cl-nav-clause')) _clBuildTree(circ);
//     });
//   });

//   document.getElementById('cl-btn-generate')?.addEventListener('click', () => _clRunGenerate(circ));

//   document.getElementById('cl-btn-regen')?.addEventListener('click', function () {
//     this.textContent = '↺ …';
//     this.disabled = true;
//     setTimeout(() => {
//       _clBuildTree(circ);
//       this.textContent = '↺ Regenerate';
//       this.disabled = false;
//       showToast('Clauses regenerated.', 'success');
//     }, 1400);
//   });

//   document.getElementById('cl-foot-save')?.addEventListener('click', function () {
//     this.textContent = '✓ Saved';
//     this.disabled = true;
//     showToast('Clauses saved to library.', 'success');
//   });
// }

// /* ================================================================ GENERATE */
// function _clRunGenerate(circ) {
//   const navTree = document.getElementById('cl-nav-tree');
//   const wsHolder = document.getElementById('cl-ws-placeholder');
//   const wsContent = document.getElementById('cl-ws-content');
//   const regenBtn = document.getElementById('cl-btn-regen');
//   const footer = document.getElementById('cl-footer');

//   navTree.innerHTML = `<div class="cl-nav-loading">${loadingHTML('Building clause tree…')}</div>`;
//   if (wsHolder) wsHolder.style.display = 'flex';
//   if (wsContent) wsContent.style.display = 'none';

//   setTimeout(() => {
//     const split = document.getElementById('cl-split');
//     if (split) split.style.display = 'grid';
//     _clBuildTree(circ);
//     if (regenBtn) regenBtn.style.display = 'inline-flex';
//     if (footer) {
//       footer.style.display = 'flex';
//       footer.style.opacity = '0';
//       footer.style.transition = 'opacity 0.3s';
//       requestAnimationFrame(() => requestAnimationFrame(() => { footer.style.opacity = '1'; }));
//     }
//   }, 1600);
// }

// /* ================================================================ BUILD NAV TREE
//    Hierarchy: Chapter → Section (optional, collapsible) → Clause
// */
// function _clBuildTree(circ) {
//   const navTree = document.getElementById('cl-nav-tree');
//   const navCount = document.getElementById('cl-nav-count');
//   const dept = document.getElementById('cl-filter-dept')?.value || '';
//   const risk = document.getElementById('cl-filter-risk')?.value || '';
//   const status = document.getElementById('cl-filter-status')?.value || '';

//   const chapters = circ.chapters || [];
//   let totalClauses = 0;

//   navTree.innerHTML = chapters.map((ch, ci) => {
//     const allClauses = (ch.clauses || []).filter(cl => {
//       if (dept && cl.department !== dept) return false;
//       if (risk && cl.risk !== risk) return false;
//       if (status && cl.status !== status) return false;
//       return true;
//     });
//     totalClauses += allClauses.length;
//     if (!allClauses.length) return '';

//     /* Build section → clause groups, or flat if no sections */
//     let innerHTML = '';

//     if (ch.sections?.length) {
//       /* --- SECTIONED layout --- */
//       ch.sections.forEach((sec, si) => {
//         const secClauses = (sec.clauses || [])
//           .map(cId => allClauses.find(cl => cl.id === cId))
//           .filter(Boolean);
//         if (!secClauses.length) return;

//         innerHTML += `
//         <div class="cl-nav-section-group">
//           <!-- Section header: collapsible -->
//           <button class="cl-nav-sec-btn" data-sec="${ci}-${si}">
//             <span class="cl-nav-sec-icon">§</span>
//             <span class="cl-nav-sec-label">${sec.id ? sec.id + ' – ' : ''}${(sec.text || 'Section').substring(0, 36)}${(sec.text || '').length > 36 ? '…' : ''}</span>
//             <span class="cl-nav-sec-count">${secClauses.length}</span>
//             <span class="cl-nav-sec-arrow">▾</span>
//           </button>
//           <div class="cl-nav-sec-body" id="cl-sec-body-${ci}-${si}">
//             ${secClauses.map(cl => _clNavClauseBtn(cl, ci)).join('')}
//           </div>
//         </div>`;
//       });

//       /* clauses not belonging to any section */
//       // const sectionedIds = new Set(ch.sections.flatMap(s => s.clauses || []));
//       // const unsectioned = allClauses.filter(cl => !sectionedIds.has(cl.id));
//       // if (unsectioned.length) {
//       //   innerHTML += `<div class="cl-nav-unsectioned">
//       //     ${unsectioned.map(cl => _clNavClauseBtn(cl, ci)).join('')}
//       //   </div>`;
//       // }

//     } else {
//       /* --- FLAT layout (no sections) --- */
//       innerHTML = allClauses.map(cl => _clNavClauseBtn(cl, ci)).join('');
//     }

//     return `
//     <div class="cl-nav-chapter">
//       <button class="cl-nav-ch-btn" data-ci="${ci}">
//         <span class="cl-nav-ch-arrow">▶</span>
//         <span class="cl-nav-ch-label">${ch.title || `Chapter ${ci + 1}`}</span>
//         <span class="cl-nav-ch-count">${allClauses.length}</span>
//       </button>
//       <div class="cl-nav-ch-body" id="cl-ch-body-${ci}">
//         ${innerHTML}
//       </div>
//     </div>`;
//   }).join('');

//   if (navCount) navCount.textContent = `${totalClauses} clauses`;

//   /* ── Chapter collapse ── */
//   navTree.querySelectorAll('.cl-nav-ch-btn').forEach(btn => {
//     const ci = btn.dataset.ci;
//     const body = document.getElementById(`cl-ch-body-${ci}`);
//     const arr = btn.querySelector('.cl-nav-ch-arrow');
//     /* init arrow — closed by default, so keep ▶ */
//     btn.addEventListener('click', () => {
//       const open = body?.classList.contains('open');
//       body?.classList.toggle('open', !open);
//       if (arr) arr.textContent = open ? '▶' : '▼';
//     });
//   });

//   /* ── Section collapse ── */
//   navTree.querySelectorAll('.cl-nav-sec-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const key = btn.dataset.sec;
//       const body = document.getElementById(`cl-sec-body-${key}`);
//       const arr = btn.querySelector('.cl-nav-sec-arrow');
//       const open = body?.classList.contains('open');
//       body?.classList.toggle('open', !open);
//       if (arr) arr.textContent = open ? '▸' : '▾';
//     });
//   });

//   /* ── Clause click → workspace ── */
//   navTree.querySelectorAll('.cl-nav-clause').forEach(btn => {
//     btn.addEventListener('click', () => {
//       navTree.querySelectorAll('.cl-nav-clause').forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');
//       const clauseId = btn.dataset.clauseId;
//       const chIdx = parseInt(btn.dataset.ch);
//       const ch = circ.chapters?.[chIdx];
//       const cl = (ch?.clauses || []).find(c => c.id === clauseId);
//       if (cl) _clShowClause(circ, ch, cl);
//     });
//   });

//   /* auto-select first clause */
//   const first = navTree.querySelector('.cl-nav-clause');
//   if (first) first.click();
// }

// /* ── Helper: render one clause button in the tree ── */
// function _clNavClauseBtn(cl, ci) {
//   return `
//   <button class="cl-nav-clause" style="margin-left:30px" data-clause-id="${cl.id}" data-ch="${ci}">
//     <div class="cl-nav-clause-row">
//       <span class="cl-nav-clause-id">${cl.id}</span>
//       ${cl.risk ? `<span class="cl-nav-risk cl-nav-risk-${cl.risk.toLowerCase()}">${cl.risk}</span>` : ''}
//     </div>
//     <span class="cl-nav-clause-text">${(cl.text || '').substring(0, 52)}${(cl.text || '').length > 52 ? '…' : ''}</span>
//   </button>`;
// }

// /* ================================================================ SHOW CLAUSE IN WORKSPACE */
// function _clShowClause(circ, ch, cl) {
//   const placeholder = document.getElementById('cl-ws-placeholder');
//   const content = document.getElementById('cl-ws-content');
//   if (placeholder) placeholder.style.display = 'none';
//   if (!content) return;
//   content.style.display = 'block';

//   const level = parseInt(document.querySelector('.cl-lvl-btn.active')?.dataset.level || '2');
//   const actions = cl.actionable
//     ? cl.actionable.split(';').map(a => a.trim()).filter(Boolean)
//     : [];

//   content.innerHTML = `
//   <div class="cl-ws-inner">

//     <!-- HEADER -->
//     <div class="cl-ws-head">
//       <div class="cl-ws-head-left">
//         <div class="cl-ws-breadcrumb">
//           <span class="cl-ws-bc-ch">${ch.title || 'Chapter'}</span>
//           <span class="cl-ws-bc-sep">›</span>
//           <span class="cl-ws-bc-id">${cl.id}</span>
//         </div>
//         <div class="cl-ws-tags">
//           ${cl.department ? `<span class="cl-ws-tag cl-ws-tag-dept">${cl.department}</span>` : ''}
//           ${cl.risk ? `<span class="cl-ws-tag cl-ws-tag-risk-${cl.risk.toLowerCase()}">${cl.risk} Risk</span>` : ''}
//           ${cl.status ? `<span class="cl-ws-tag cl-ws-tag-status">${cl.status}</span>` : ''}
//         </div>
//       </div>
//       <div class="cl-ws-head-right">
//         <button class="cl-ws-btn" id="cl-ws-edit-btn">✎ Edit</button>
//         <button class="cl-ws-btn cl-ws-btn-regen" id="cl-ws-regen-btn">↺ Regenerate</button>
//       </div>
//     </div>

//     <!-- CLAUSE TEXT -->
//     <div class="cl-ws-clause-block">
//       <div class="cl-ws-clause-label">Clause Text</div>
//       <div class="cl-ws-clause-text">${cl.text}</div>
//     </div>

//     <!-- EDIT DRAWER (hidden) -->
//     <div class="cl-ws-edit-drawer" id="cl-ws-edit-drawer" style="display:none;">
//       <div class="cl-ws-edit-head">
//         <span class="cl-ws-edit-label">✎ Add context for AI regeneration</span>
//         <button class="cl-ws-edit-cancel" id="cl-ws-edit-cancel">✕</button>
//       </div>
//       <textarea class="cl-ws-edit-ta" id="cl-ws-edit-ta"
//         placeholder="e.g. 'Focus on technology obligations' or 'Add PMLA context'…"></textarea>
//       <div class="cl-ws-edit-actions">
//         <button class="cl-ws-edit-apply" id="cl-ws-edit-apply">↺ Regenerate this clause</button>
//       </div>
//     </div>

//     ${level >= 2 ? `
//     <!-- OBLIGATIONS -->
//     <div class="cl-ws-section">
//       <div class="cl-ws-section-label">Obligations</div>
//       <div class="cl-ws-oblig-list" id="cl-ws-obligs">
//         ${_clBuildObligations(cl, actions, level)}
//       </div>
//     </div>` : ''}

//   </div>`;

//   /* obligation accordion */
//   content.querySelectorAll('.cl-oblig-trigger').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const oi = btn.dataset.oi;
//       const body = document.getElementById(`cl-oblig-body-${oi}`);
//       const arr = btn.querySelector('.cl-oblig-arrow');
//       const open = body?.classList.contains('open');
//       body?.classList.toggle('open', !open);
//       if (arr) arr.textContent = open ? '▶' : '▼';
//     });
//   });

//   /* obligation detail toggles */
//   content.querySelectorAll('.cl-detail-toggle').forEach(btn => {
//     btn.addEventListener('click', e => {
//       e.stopPropagation();
//       const targetId = btn.dataset.target;
//       const panel = document.getElementById(targetId);
//       if (!panel) return;
//       const open = panel.classList.contains('open');
//       panel.classList.toggle('open', !open);
//       btn.classList.toggle('active', !open);
//       btn.textContent = open ? '≡ Details' : '✕ Close';
//     });
//   });

//   /* action detail toggles (L3) */
//   content.querySelectorAll('.cl-act-detail-toggle').forEach(btn => {
//     btn.addEventListener('click', e => {
//       e.stopPropagation();
//       const targetId = btn.dataset.target;
//       const panel = document.getElementById(targetId);
//       if (!panel) return;
//       const open = panel.classList.contains('open');
//       panel.classList.toggle('open', !open);
//       btn.classList.toggle('active', !open);
//       btn.textContent = open ? '≡ View More Details' : '✕ Close';
//     });
//   });

//   /* edit */
//   document.getElementById('cl-ws-edit-btn')?.addEventListener('click', () => {
//     const drawer = document.getElementById('cl-ws-edit-drawer');
//     drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
//     if (drawer.style.display === 'block') document.getElementById('cl-ws-edit-ta')?.focus();
//   });
//   document.getElementById('cl-ws-edit-cancel')?.addEventListener('click', () => {
//     document.getElementById('cl-ws-edit-drawer').style.display = 'none';
//     document.getElementById('cl-ws-edit-ta').value = '';
//   });
//   document.getElementById('cl-ws-edit-apply')?.addEventListener('click', function () {
//     const ta = document.getElementById('cl-ws-edit-ta');
//     this.textContent = 'Updating…'; this.disabled = true;
//     setTimeout(() => {
//       if (ta?.value?.trim()) showToast('Context applied. Clause updated.', 'success');
//       document.getElementById('cl-ws-edit-drawer').style.display = 'none';
//       ta.value = ''; this.textContent = '↺ Regenerate this clause'; this.disabled = false;
//     }, 800);
//   });

//   /* regen */
//   document.getElementById('cl-ws-regen-btn')?.addEventListener('click', function () {
//     this.textContent = '↺ …'; this.disabled = true;
//     setTimeout(() => { _clShowClause(circ, ch, cl); showToast('Clause regenerated.', 'success'); }, 900);
//   });

//   /* evidence buttons */
//   content.querySelectorAll('.cl-ev-btn').forEach(btn => {
//     btn.addEventListener('click', function () {
//       try {
//         const acts = JSON.parse(atob(this.dataset.actions));
//         clShowEvidenceModal(this.dataset.clauseId, acts, this.dataset.obligation);
//       } catch (e) { showToast('Error opening evidence panel.', 'error'); }
//     });
//   });
// }

// /* ================================================================ MOCK DETAIL METADATA
//    Returns a metadata object for obligations / actions
// */
// function _clMockDetailMeta(index) {
//   const BODIES = ['RBI', 'SEBI', 'IRDAI', 'PFRDA', 'MCA', 'Ministry of Finance'];
//   const LEG = ['Banking Regulation', 'Securities Law', 'Insurance Law', 'Pension Law', 'Company Law', 'Fiscal Law'];
//   const SUB_LEG = ['Prudential Norms', 'Market Conduct', 'Solvency', 'Fund Governance', 'Corporate Governance', 'Taxation'];
//   const ACTS = ['Banking Regulation Act 1949', 'SEBI Act 1992', 'Insurance Act 1938', 'PFRDA Act 2013', 'Companies Act 2013', 'Income Tax Act 1961'];
//   const SECS = ['Section 12', 'Section 21', 'Section 34A', 'Section 19', 'Section 134', 'Section 80C'];
//   const SUBSETS = ['Clause (a)', 'Clause (b)', 'Sub-section (1)', 'Sub-section (2)', 'Proviso', 'Explanation'];
//   const CATS = ['Mandatory Compliance', 'Periodic Reporting', 'System Control', 'Governance', 'Disclosure', 'Risk Management'];
//   const FREQS = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual', 'Ongoing', 'One-time'];
//   const DUES = ['15th of following month', '30 days from FY end', 'Within 7 business days', 'On occurrence', '31st March', 'Within 60 days of circular'];

//   const i = index % 6;
//   return {
//     frequency: FREQS[i],
//     dueDate: DUES[i],
//     regulatoryBody: BODIES[i],
//     legalArea: LEG[i],
//     subLegalArea: SUB_LEG[i],
//     act: ACTS[i],
//     section: SECS[i],
//     subset: SUBSETS[i],
//     category: CATS[i],
//   };
// }

// /* ── Render detail metadata panel HTML ── */
// function _clDetailPanelHTML(id, meta) {
//   const fields = [
//     { label: 'Frequency', value: meta.frequency },
//     { label: 'Due Date', value: meta.dueDate },
//     { label: 'Regulatory Body', value: meta.regulatoryBody },
//     { label: 'Legislative Area', value: meta.legalArea },
//     { label: 'Sub-Legislative Area', value: meta.subLegalArea },
//     { label: 'Act', value: meta.act },
//     { label: 'Section', value: meta.section },
//     { label: 'Subsection', value: meta.subset },
//     { label: 'Category', value: meta.category },
//   ];
//   return `
//   <div class="cl-detail-panel" id="${id}">
//     <div class="cl-detail-grid">
//       ${fields.map(f => `
//       <div class="cl-detail-field">
//         <span class="cl-detail-label">${f.label}</span>
//         <span class="cl-detail-value">${f.value}</span>
//       </div>`).join('')}
//     </div>
//   </div>`;
// }

// /* ================================================================ BUILD OBLIGATIONS */
// function _clBuildObligations(cl, actions, level) {

//   const MOCK_OBLIGATIONS = [
//     {
//       text: 'The entity shall establish and maintain a Board-approved compliance policy covering all aspects of this circular, reviewed at least annually.',
//       actions: [
//         'Draft or update the compliance policy to incorporate circular requirements',
//         'Present policy to Board for formal approval and record in minutes',
//         'Distribute updated policy to all relevant departments',
//         'Schedule annual review cycle and assign policy owner',
//       ],
//     },
//     {
//       text: 'All relevant staff must complete mandatory training on the obligations under this circular within 60 days of the effective date.',
//       actions: [
//         'Identify all staff roles impacted by circular obligations',
//         'Design training module covering key compliance requirements',
//         'Track completion records and maintain in HR system',
//         'Conduct re-training annually or upon material amendment',
//         'Report training completion status to Compliance Committee',
//       ],
//     },
//     {
//       text: 'The entity shall implement robust internal controls and conduct periodic testing to verify operational effectiveness.',
//       actions: [
//         'Map all processes affected by this circular to control owners',
//         'Design control tests and document testing methodology',
//         'Execute quarterly control testing and record outcomes',
//         'Escalate control failures to senior management within 5 business days',
//       ],
//     },
//     {
//       text: 'A designated Compliance Officer must be appointed to oversee implementation and serve as the primary liaison with the regulator.',
//       actions: [
//         'Formally appoint or confirm Compliance Officer designation',
//         "Define responsibilities in the compliance officer's mandate",
//         'Notify regulator of officer appointment with contact details',
//         'Ensure officer has adequate resources and independence',
//       ],
//     },
//     {
//       text: 'The entity shall report compliance status to the regulator in the prescribed format within the timelines specified in the circular.',
//       actions: [
//         'Identify all reporting obligations and their frequencies',
//         'Build reporting templates aligned to prescribed regulatory format',
//         'Establish data collection pipeline from source systems',
//         'Implement maker-checker controls on all regulatory submissions',
//         'Set up automated alerts for upcoming reporting deadlines',
//       ],
//     },
//     {
//       text: 'Adequate IT systems and infrastructure shall be in place to support digital compliance, data security and full audit trail requirements.',
//       actions: [
//         'Conduct gap assessment of current IT systems against circular requirements',
//         'Implement or configure required system controls and access restrictions',
//         'Enable full audit trail logging for all relevant transactions',
//         'Test system controls in UAT before go-live',
//       ],
//     },
//   ];

//   const obligs = Array.isArray(cl.obligations_list)
//     ? cl.obligations_list.map(ob => ({
//       text: typeof ob === 'string' ? ob : (ob.text || '—'),
//       actions: typeof ob === 'string' ? actions : (ob.actions || actions),
//     }))
//     : MOCK_OBLIGATIONS;

//   return obligs.map((ob, oi) => {
//     const obText = ob.text;
//     const obActions = ob.actions || [];
//     const meta = _clMockDetailMeta(oi);
//     const detailId = `cl-ob-detail-${oi}`;

//     return `
//     <div class="cl-oblig-item" id="cl-oblig-${oi}">

//       <!-- OBLIGATION TRIGGER ROW -->
//       <button class="cl-oblig-trigger" data-oi="${oi}">
//         <div class="cl-oblig-trigger-left">
//           <span class="cl-oblig-num">O${oi + 1}</span>
//           <span class="cl-oblig-text-preview">${obText}</span>
//         </div>
//         <span class="cl-oblig-arrow">▶</span>
//       </button>

//       <!-- OBLIGATION BODY -->
//       <div class="cl-oblig-body" id="cl-oblig-body-${oi}">

//         <!-- Detail toggle button -->
//         <div class="cl-oblig-meta-row">
//           <button class="cl-detail-toggle" data-target="${detailId}">≡ View More Details</button>
//           <button class="cl-ev-btn"
//             data-clause-id="${cl.id}"
//             data-actions="${btoa(JSON.stringify(obActions))}"
//             data-obligation="${obText.substring(0, 120)}">
//             🔍 AI Found Some Evidence
//           </button>
//         </div>

//         <!-- Collapsible detail panel -->
//         ${_clDetailPanelHTML(detailId, meta)}

//         ${level >= 3 && obActions.length ? `
//         <!-- ACTIONS -->
//         <div class="cl-actions-block">
//           <div class="cl-actions-head">
//             <span class="cl-actions-label">Actions</span>
//             <span class="cl-actions-count">${obActions.length}</span>
//           </div>
//           <div class="cl-actions-list">
//             ${obActions.map((a, ai) => {
//       const actMeta = _clMockDetailMeta(oi * 10 + ai);
//       const actDetId = `cl-act-detail-${oi}-${ai}`;
//       return `
//               <div class="cl-action-item">
//                 <div class="cl-action-row">
//                   <span class="cl-action-num">${ai + 1}</span>
//                   <span class="cl-action-text">${a}</span>
//                   <button class="cl-act-detail-toggle" data-target="${actDetId}">≡ Details</button>
//                 </div>
//                 ${_clDetailPanelHTML(actDetId, actMeta)}
//               </div>`;
//     }).join('')}
//           </div>
//         </div>` : level >= 3 ? `
//         <div class="cl-no-actions">No specific actions required for this obligation.</div>` : `
//         <div class="cl-oblig-full-text">${obText}</div>`}

//       </div>
//     </div>`;
//   }).join('');
// }

// /* ================================================================ EVIDENCE MODAL
//    Layout: Header → Summary pills → Table (# | Action | Evidence | Status | Save) → Footer
// */
// window.clShowEvidenceModal = function (clauseId, actions, obligation) {

//   const EVIDENCE_MAP = [
//     { icon: '📋', name: 'Compliance Policy Document', type: 'Policy', source: 'Internal Repository', needed: 'Board-approved policy covering this compliance area, reviewed annually.', status: 'Required' },
//     { icon: '🔍', name: 'Internal Audit Report', type: 'Audit Record', source: 'Internal Audit Dept', needed: 'Audit findings confirming controls are operating effectively.', status: 'Required' },
//     { icon: '🎓', name: 'Staff Training Completion Record', type: 'Training Record', source: 'HR System', needed: 'Completion records for all relevant staff trained on this obligation.', status: 'Required' },
//     { icon: '💻', name: 'System Audit Trail / Access Log', type: 'System Log', source: 'IT Department', needed: 'System-generated logs showing automated controls and access restrictions.', status: 'Recommended' },
//     { icon: '🏛️', name: 'Board Resolution / Meeting Minutes', type: 'Board Record', source: 'Company Secretary', needed: 'Board-level approval documented in formal meeting minutes.', status: 'Required' },
//     { icon: '📨', name: 'Regulatory Submission Receipt', type: 'Regulatory Filing', source: 'Compliance Team', needed: 'Regulator acknowledgement confirming timely and complete submission.', status: 'Recommended' },
//   ];

//   const actList = Array.isArray(actions) ? actions : [actions];
//   const mapped = actList.map((act, i) => ({ action: act, evidence: EVIDENCE_MAP[i % EVIDENCE_MAP.length] }));
//   const reqCount = mapped.filter(m => m.evidence.status === 'Required').length;
//   const recCount = mapped.length - reqCount;

//   const overlay = document.createElement('div');
//   overlay.className = 'cl-modal-overlay';
//   overlay.innerHTML = `
//   <div class="cl-modal cl-modal-ev">

//     <!-- HEADER -->
//     <div class="cl-modal-head">
//       <div class="cl-modal-head-left">
//         <span class="cl-modal-clause-id">${clauseId}</span>
//         ${obligation ? `<span class="cl-modal-oblig-short">${obligation.substring(0, 90)}${obligation.length > 90 ? '…' : ''}</span>` : ''}
//       </div>
//       <button class="cl-modal-close" onclick="this.closest('.cl-modal-overlay').remove()">✕</button>
//     </div>

//     <!-- SUMMARY PILLS -->
//     <div class="cl-ev-summary">
//       <span class="cl-ev-pill">${mapped.length} items</span>
//       <span class="cl-ev-pill cl-ev-pill-req">🔴 ${reqCount} Required</span>
//       <span class="cl-ev-pill cl-ev-pill-rec">🟡 ${recCount} Recommended</span>
//       <span class="cl-ev-pill cl-ev-pill-saved" id="cl-ev-saved-pill">✅ <span id="cl-ev-saved-count">0</span> Saved</span>
//     </div>

//     <!-- TABLE -->
//     <div class="cl-ev-table-wrap">
//       <table class="cl-ev-table">
//         <thead>
//           <tr>
//             <th class="cl-ev-th cl-ev-th-num">#</th>
//             <th class="cl-ev-th">Action to perform</th>
//             <th class="cl-ev-th">Evidence document needed</th>
//             <th class="cl-ev-th cl-ev-th-status">Status</th>
//             <th class="cl-ev-th cl-ev-th-save"></th>
//           </tr>
//         </thead>
//         <tbody>
//           ${mapped.map((m, i) => `
//           <tr class="cl-ev-tr" id="cl-ev-row-${i}">
//             <td class="cl-ev-td cl-ev-td-num">${i + 1}</td>
//             <td class="cl-ev-td cl-ev-td-action">${m.action}</td>
//             <td class="cl-ev-td cl-ev-td-doc">
//               <div class="cl-ev-doc-name">${m.evidence.icon} ${m.evidence.name}</div>
//               <div class="cl-ev-doc-sub">${m.evidence.type} · ${m.evidence.source}</div>
//               <div class="cl-ev-doc-needed">${m.evidence.needed}</div>
//             </td>
//             <td class="cl-ev-td cl-ev-td-status">
//               <span class="cl-ev-badge ${m.evidence.status === 'Required' ? 'cl-ev-badge-req' : 'cl-ev-badge-rec'}">${m.evidence.status}</span>
//             </td>
//             <td class="cl-ev-td cl-ev-td-save">
//               <button class="cl-ev-save-btn" onclick="
//                 const btn=this;
//                 const row=document.getElementById('cl-ev-row-${i}');
//                 btn.textContent='✓ Saved';
//                 btn.classList.add('cl-ev-save-done');
//                 btn.disabled=true;
//                 row.classList.add('cl-ev-tr-saved');
//                 const c=document.getElementById('cl-ev-saved-count');
//                 if(c) c.textContent=parseInt(c.textContent||0)+1;
//                 showToast('Saved to evidence library.','success');
//               ">Save</button>
//             </td>
//           </tr>`).join('')}
//         </tbody>
//       </table>
//     </div>

//     <!-- FOOTER -->
//     <div class="cl-modal-foot">
//       <span class="cl-modal-foot-note">💡 AI-suggested based on clause type and obligation context</span>
//       <div style="display:flex;gap:8px;">
//         <button class="cl-modal-btn cl-modal-btn-sec" onclick="showToast('Refreshing suggestions…','info')">↺ Refresh</button>
//         <button class="cl-modal-btn cl-modal-btn-pri" onclick="this.closest('.cl-modal-overlay').remove()">Done</button>
//       </div>
//     </div>

//   </div>`;

//   document.body.appendChild(overlay);
//   overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
// };

// /* ================================================================ CSS
//    Palette: Slate neutrals + Teal accent — soothing, readable, professional
//    --bg-page:   #f4f6f9   (light blue-grey page)
//    --bg-card:   #ffffff
//    --bg-nav:    #f8f9fb
//    --border:    #e2e6ed
//    --text-pri:  #1e2433   (near-black with blue tint)
//    --text-sec:  #5a6478   (medium slate)
//    --text-muted:#9aa3b5   (muted)
//    --accent:    #0d7fa5   (teal/ocean)
//    --accent-lt: #e6f4f9   (teal tint)
//    --accent-mid:#b2ddef
//    --purple:    #6b6ef0   (obligation numbers)
//    --green:     #0e9f6e   (low risk / save)
//    --amber:     #d97706
//    --red:       #dc2626
// */
// function injectClauseCSS() {
//   if (document.getElementById('cl-css')) return;
//   const s = document.createElement('style');
//   s.id = 'cl-css';
//   s.textContent = `

// /* ── ROOT VARS ── */
// :root {
//   --cl-bg-page:    #f4f6f9;
//   --cl-bg-card:    #ffffff;
//   --cl-bg-nav:     #f8f9fb;
//   --cl-bg-hover:   #eef1f6;
//   --cl-border:     #e2e6ed;
//   --cl-border-lt:  #edf0f5;
//   --cl-text-pri:   #1e2433;
//   --cl-text-sec:   #5a6478;
//   --cl-text-muted: #9aa3b5;
//   --cl-accent:     #0d7fa5;
//   --cl-accent-lt:  #e6f4f9;
//   --cl-accent-mid: #b2ddef;
//   --cl-purple:     #5b5fcf;
//   --cl-purple-lt:  #ededfc;
//   --cl-green:      #0e9f6e;
//   --cl-green-lt:   #e8faf4;
//   --cl-amber:      #b45309;
//   --cl-amber-lt:   #fef3c7;
//   --cl-red:        #c92a2a;
//   --cl-red-lt:     #fdecea;
//   --cl-radius-sm:  6px;
//   --cl-radius-md:  10px;
//   --cl-radius-lg:  14px;
//   --cl-shadow-sm:  0 1px 3px rgba(30,36,51,0.07);
//   --cl-shadow-md:  0 4px 16px rgba(30,36,51,0.10);
// }

// /* ── WRAP ── */
// .cl-wrap { display:flex;flex-direction:column;gap:12px;font-family:'DM Sans',system-ui,sans-serif;
//   color:var(--cl-text-pri); }

// /* ── EMPTY STATE ── */
// .cl-empty-state { display:flex;flex-direction:column;align-items:center;justify-content:center;
//   gap:12px;padding:60px 28px;background:var(--cl-bg-card);
//   border:2px dashed var(--cl-border);border-radius:var(--cl-radius-lg);text-align:center; }
// .cl-empty-icon  { font-size:36px;opacity:0.5; }
// .cl-empty-title { font-size:15px;font-weight:700;color:var(--cl-text-pri); }
// .cl-empty-sub   { font-size:13px;color:var(--cl-text-muted);max-width:280px;line-height:1.6; }
// .cl-empty-cta   { padding:9px 22px;background:var(--cl-text-pri);color:#fff;border:none;
//   border-radius:var(--cl-radius-sm);font-size:13px;font-weight:600;cursor:pointer; }

// /* ── TOP BAR ── */
// .cl-topbar      { display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
//   padding:10px 16px;background:var(--cl-bg-card);border:1px solid var(--cl-border);
//   border-radius:var(--cl-radius-md);box-shadow:var(--cl-shadow-sm); }
// .cl-topbar-left { display:flex;align-items:center;gap:8px;min-width:0;flex:1; }
// .cl-circ-id-chip{ font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--cl-accent);
//   background:var(--cl-accent-lt);border:1px solid var(--cl-accent-mid);
//   padding:3px 10px;border-radius:5px;white-space:nowrap;flex-shrink:0; }
// .cl-circ-name-chip{ font-size:12px;color:var(--cl-text-sec);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
// .cl-topbar-right{ display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap; }

// /* filter selects */
// .cl-filter-select{ padding:6px 10px;background:var(--cl-bg-nav);border:1px solid var(--cl-border);
//   border-radius:var(--cl-radius-sm);font-family:inherit;font-size:12px;color:var(--cl-text-sec);outline:none;cursor:pointer; }
// .cl-filter-select:focus{ border-color:var(--cl-accent); }

// /* level toggle */
// .cl-level-toggle{ display:flex;border:1px solid var(--cl-border);border-radius:var(--cl-radius-sm);overflow:hidden; }
// .cl-lvl-btn     { padding:6px 12px;background:var(--cl-bg-card);border:none;border-right:1px solid var(--cl-border);
//   font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-text-muted);cursor:pointer;transition:all 0.12s; }
// .cl-lvl-btn:last-child{ border-right:none; }
// .cl-lvl-btn:hover { background:var(--cl-bg-hover);color:var(--cl-text-pri); }
// .cl-lvl-btn.active{ background:var(--cl-text-pri);color:#fff; }

// /* topbar buttons */
// .cl-topbar-btn  { padding:7px 15px;border-radius:var(--cl-radius-sm);font-family:inherit;font-size:12px;
//   font-weight:700;cursor:pointer;transition:all 0.13s;white-space:nowrap;border:1.5px solid; }
// .cl-btn-generate{ background:var(--cl-text-pri);color:#fff;border-color:var(--cl-text-pri); }
// .cl-btn-generate:hover{ background:#2a3248; }
// .cl-btn-regen   { background:var(--cl-bg-card);color:var(--cl-text-pri);border-color:var(--cl-border);display:none; }
// .cl-btn-regen:hover{ background:var(--cl-bg-hover); }

// /* ── SPLIT PANE ── */
// .cl-split { display:grid;grid-template-columns:256px 1fr;gap:0;
//   background:var(--cl-bg-card);border:1px solid var(--cl-border);
//   border-radius:var(--cl-radius-lg);overflow:hidden;min-height:540px;
//   box-shadow:var(--cl-shadow-sm); }

// /* ── LEFT NAV ── */
// .cl-nav      { border-right:1px solid var(--cl-border-lt);display:flex;flex-direction:column;background:var(--cl-bg-nav); }
// .cl-nav-head { display:flex;align-items:center;justify-content:space-between;
//   padding:13px 15px;border-bottom:1px solid var(--cl-border-lt);background:var(--cl-bg-nav); }
// .cl-nav-title{ font-size:10px;font-weight:700;color:var(--cl-text-muted);text-transform:uppercase;letter-spacing:.08em; }
// .cl-nav-count{ font-size:10px;color:var(--cl-text-muted);background:var(--cl-border-lt);
//   border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px; }
// .cl-nav-tree { flex:1;overflow-y:auto;padding:6px 0; }
// .cl-nav-placeholder{ padding:24px 16px;font-size:12px;color:var(--cl-text-muted);text-align:center;line-height:1.6; }
// .cl-nav-loading    { padding:24px 16px;text-align:center; }

// /* ── CHAPTER ── */
// .cl-nav-chapter {}
// .cl-nav-ch-btn  { width:100%;display:flex;align-items:center;gap:7px;padding:9px 14px 9px 12px;
//   background:none;border:none;cursor:pointer;font-family:inherit;
//   font-size:11px;font-weight:700;color:var(--cl-text-pri);text-align:left;
//   transition:background 0.1s;border-left:3px solid transparent; }
// .cl-nav-ch-btn:hover{ background:var(--cl-bg-hover); }
// .cl-nav-ch-arrow{ font-size:8px;color:var(--cl-text-muted);flex-shrink:0;width:10px; }
// .cl-nav-ch-label{ flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
// .cl-nav-ch-count{ font-size:10px;color:var(--cl-text-muted);background:#e8ebf1;
//   padding:1px 7px;border-radius:10px;flex-shrink:0; }
// .cl-nav-ch-body { display:none;padding-bottom:4px; }
// .cl-nav-ch-body.open{ display:block; }

// /* ── SECTION GROUP ── */
// .cl-nav-section-group{ margin:0; }
// .cl-nav-sec-btn { width:100%;display:flex;align-items:center;gap:6px;
//   padding:7px 12px 7px 20px;background:none;border:none;cursor:pointer;
//   font-family:inherit;font-size:11px;text-align:left;
//   transition:background 0.1s;color:var(--cl-text-sec); }
// .cl-nav-sec-btn:hover{ background:var(--cl-bg-hover); }
// .cl-nav-sec-icon { font-size:10px;font-weight:700;color:var(--cl-accent);flex-shrink:0;
//   background:var(--cl-accent-lt);border:1px solid var(--cl-accent-mid);
//   padding:1px 5px;border-radius:3px;font-style:normal; }
// .cl-nav-sec-label{ flex:1;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10.5px; }
// .cl-nav-sec-count{ font-size:9px;color:var(--cl-text-muted);flex-shrink:0; }
// .cl-nav-sec-arrow{ font-size:10px;color:var(--cl-text-muted);flex-shrink:0; }
// .cl-nav-sec-body { display:none;padding:0 0 2px; }
// .cl-nav-sec-body.open{ display:block; }
// .cl-nav-unsectioned{ padding-top:4px; }

// /* ── CLAUSE BUTTON ── */
// .cl-nav-clause  { width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:3px;
//   padding:8px 14px 8px 30px;background:none;border:none;border-left:3px solid transparent;
//   cursor:pointer;font-family:inherit;text-align:left;transition:all 0.1s; }
// .cl-nav-clause:hover { background:var(--cl-bg-hover); }
// .cl-nav-clause.active{ background:var(--cl-accent-lt);border-left-color:var(--cl-accent); }
// .cl-nav-clause-row  { display:flex;align-items:center;gap:6px;width:100%; }
// .cl-nav-clause-id   { font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:var(--cl-purple); }
// .cl-nav-clause-text { font-size:11px;color:var(--cl-text-sec);line-height:1.4;
//   overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:185px; }
// .cl-nav-risk        { font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;margin-left:auto; }
// .cl-nav-risk-high   { background:var(--cl-red-lt);color:var(--cl-red); }
// .cl-nav-risk-medium { background:var(--cl-amber-lt);color:var(--cl-amber); }
// .cl-nav-risk-low    { background:var(--cl-green-lt);color:var(--cl-green); }

// /* ── RIGHT WORKSPACE ── */
// .cl-workspace { flex:1;overflow-y:auto;display:flex;flex-direction:column; }
// .cl-workspace-placeholder{ flex:1;display:flex;flex-direction:column;align-items:center;
//   justify-content:center;gap:10px;padding:40px;text-align:center; }
// .cl-ws-ph-icon { font-size:32px;opacity:0.3; }
// .cl-ws-ph-title{ font-size:14px;font-weight:700;color:var(--cl-text-muted); }
// .cl-ws-ph-sub  { font-size:12px;color:#c0c7d6;max-width:260px;line-height:1.6; }

// .cl-ws-inner   { padding:24px 28px;display:flex;flex-direction:column;gap:20px; }

// /* workspace header */
// .cl-ws-head      { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap; }
// .cl-ws-head-left { display:flex;flex-direction:column;gap:7px; }
// .cl-ws-breadcrumb{ display:flex;align-items:center;gap:6px; }
// .cl-ws-bc-ch     { font-size:11px;color:var(--cl-text-muted); }
// .cl-ws-bc-sep    { color:var(--cl-border);font-size:11px; }
// .cl-ws-bc-id     { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--cl-accent); }
// .cl-ws-tags      { display:flex;gap:6px;flex-wrap:wrap; }
// .cl-ws-tag       { padding:3px 10px;border-radius:4px;font-size:10px;font-weight:700;border:1px solid; }
// .cl-ws-tag-dept  { background:#eef1fd;border-color:#c5cff8;color:var(--cl-purple); }
// .cl-ws-tag-risk-high  { background:var(--cl-red-lt);border-color:#f5b8b8;color:var(--cl-red); }
// .cl-ws-tag-risk-medium{ background:var(--cl-amber-lt);border-color:#fcd34d;color:var(--cl-amber); }
// .cl-ws-tag-risk-low   { background:var(--cl-green-lt);border-color:#6ee7b7;color:var(--cl-green); }
// .cl-ws-tag-status{ background:var(--cl-bg-nav);border-color:var(--cl-border);color:var(--cl-text-sec); }
// .cl-ws-head-right{ display:flex;gap:7px;flex-shrink:0; }
// .cl-ws-btn       { padding:6px 13px;background:var(--cl-bg-card);border:1px solid var(--cl-border);
//   border-radius:var(--cl-radius-sm);font-family:inherit;font-size:11px;font-weight:600;
//   color:var(--cl-text-sec);cursor:pointer;transition:all 0.12s; }
// .cl-ws-btn:hover { border-color:var(--cl-text-pri);color:var(--cl-text-pri); }
// .cl-ws-btn-regen { border-color:var(--cl-purple);color:var(--cl-purple); }
// .cl-ws-btn-regen:hover{ background:var(--cl-purple-lt); }

// /* clause text block */
// .cl-ws-clause-block { background:var(--cl-accent-lt);border:1px solid var(--cl-accent-mid);
//   border-radius:var(--cl-radius-md);padding:16px 18px;border-left:4px solid var(--cl-accent); }
// .cl-ws-clause-label { font-size:10px;font-weight:700;color:var(--cl-accent);
//   text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px; }
// .cl-ws-clause-text  { font-size:13.5px;font-weight:500;color:var(--cl-text-pri);line-height:1.75; }

// /* edit drawer */
// .cl-ws-edit-drawer{ background:#f0f7ff;border:1.5px solid #b6d8f0;border-radius:var(--cl-radius-md);overflow:hidden; }
// .cl-ws-edit-head  { display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-bottom:1px solid #c8e2f5; }
// .cl-ws-edit-label { font-size:12px;font-weight:700;color:#1d6fa5; }
// .cl-ws-edit-cancel{ background:none;border:none;font-size:14px;color:var(--cl-text-muted);cursor:pointer;padding:2px 6px; }
// .cl-ws-edit-ta    { width:100%;min-height:70px;padding:10px 14px;background:#fff;border:none;border-top:1px solid #c8e2f5;
//   font-family:inherit;font-size:12px;color:var(--cl-text-pri);outline:none;resize:vertical;box-sizing:border-box; }
// .cl-ws-edit-actions{ display:flex;justify-content:flex-end;padding:8px 12px;background:#f0f7ff;border-top:1px solid #c8e2f5; }
// .cl-ws-edit-apply { padding:6px 15px;background:var(--cl-accent);border:none;border-radius:var(--cl-radius-sm);
//   font-family:inherit;font-size:12px;font-weight:600;color:#fff;cursor:pointer; }

// /* obligations section */
// .cl-ws-section       { display:flex;flex-direction:column;gap:10px; }
// .cl-ws-section-label { font-size:10px;font-weight:700;color:var(--cl-text-muted);
//   text-transform:uppercase;letter-spacing:.08em; }
// .cl-ws-oblig-list    { display:flex;flex-direction:column;gap:10px; }

// /* obligation accordion item */
// .cl-oblig-item    { border:1px solid var(--cl-border);border-radius:var(--cl-radius-md);
//   overflow:hidden;background:var(--cl-bg-card);box-shadow:var(--cl-shadow-sm); }
// .cl-oblig-trigger { width:100%;display:flex;align-items:center;justify-content:space-between;
//   padding:12px 15px;background:var(--cl-bg-nav);border:none;cursor:pointer;font-family:inherit;
//   gap:10px;text-align:left;transition:background 0.12s;border-bottom:1px solid transparent; }
// .cl-oblig-trigger:hover{ background:var(--cl-bg-hover); }
// .cl-oblig-trigger-left{ display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0; }
// .cl-oblig-num     { flex-shrink:0;min-width:26px;height:26px;background:var(--cl-purple);color:#fff;
//   border-radius:var(--cl-radius-sm);display:flex;align-items:center;justify-content:center;
//   font-size:10px;font-weight:700;margin-top:1px; }
// .cl-oblig-text-preview{ font-size:13px;font-weight:500;color:var(--cl-text-pri);line-height:1.55; }
// .cl-oblig-arrow   { font-size:11px;color:var(--cl-text-muted);flex-shrink:0;margin-top:2px; }

// .cl-oblig-body    { display:none;padding:0; }
// .cl-oblig-body.open{ display:block; }

// /* obligation meta row (detail toggle + evidence btn) */
// .cl-oblig-meta-row{ display:flex;align-items:center;gap:8px;
//   padding:10px 15px 6px;border-top:1px solid var(--cl-border-lt); }

// /* detail toggle button */
// .cl-detail-toggle, .cl-act-detail-toggle {
//   display:inline-flex;align-items:center;gap:5px;
//   padding:4px 11px;background:var(--cl-bg-nav);
//   border:1px solid var(--cl-border);border-radius:20px;
//   font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-text-sec);cursor:pointer;
//   transition:all 0.13s; }
// .cl-detail-toggle:hover,.cl-act-detail-toggle:hover{ border-color:var(--cl-accent);color:var(--cl-accent);background:var(--cl-accent-lt); }
// .cl-detail-toggle.active,.cl-act-detail-toggle.active{
//   background:var(--cl-accent-lt);border-color:var(--cl-accent-mid);color:var(--cl-accent); }

// /* detail metadata panel */
// .cl-detail-panel{ display:none;margin:0 14px 12px;border:1px solid var(--cl-border-lt);
//   border-radius:var(--cl-radius-sm);background:#fbfcfd;overflow:hidden; }
// .cl-detail-panel.open{ display:block; }
// .cl-detail-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:0; }
// .cl-detail-field{ padding:9px 12px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt); }
// .cl-detail-field:nth-child(3n){ border-right:none; }
// .cl-detail-field:nth-last-child(-n+3){ border-bottom:none; }
// .cl-detail-label{ display:block;font-size:9.5px;font-weight:700;color:var(--cl-text-muted);
//   text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px; }
// .cl-detail-value{ display:block;font-size:12px;font-weight:600;color:var(--cl-text-pri);line-height:1.4; }

// /* obligation full text (L2) */
// .cl-oblig-full-text{ font-size:12.5px;color:var(--cl-text-sec);line-height:1.7;
//   padding:10px 15px 4px;margin:0; }

// /* evidence button */
// .cl-ev-btn { display:inline-flex;align-items:center;gap:5px;padding:4px 12px;
//   background:var(--cl-bg-card);border:1.5px solid var(--cl-border);border-radius:20px;
//   font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-text-sec);cursor:pointer;
//   transition:all 0.13s;margin-left:auto; }
// .cl-ev-btn:hover{ border-color:var(--cl-purple);color:var(--cl-purple);background:var(--cl-purple-lt); }

// /* actions block (L3) */
// .cl-actions-block { padding:10px 15px 14px; }
// .cl-actions-head  { display:flex;align-items:center;gap:8px;margin-bottom:10px; }
// .cl-actions-label { font-size:10px;font-weight:700;color:var(--cl-text-muted);text-transform:uppercase;letter-spacing:.07em; }
// .cl-actions-count { display:inline-flex;align-items:center;justify-content:center;
//   min-width:18px;height:18px;padding:0 4px;background:var(--cl-border-lt);color:var(--cl-text-sec);
//   border-radius:10px;font-size:10px;font-weight:700; }
// .cl-actions-list  { display:flex;flex-direction:column;gap:8px; }

// /* individual action item */
// .cl-action-item   { border:1px solid var(--cl-border-lt);border-radius:var(--cl-radius-sm);
//   overflow:hidden;background:var(--cl-bg-nav); }
// .cl-action-row    { display:flex;align-items:flex-start;gap:9px;padding:9px 12px; }
// .cl-action-num    { flex-shrink:0;width:20px;height:20px;background:var(--cl-accent-lt);color:var(--cl-accent);
//   border:1px solid var(--cl-accent-mid);border-radius:4px;
//   display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px; }
// .cl-action-text   { flex:1;font-size:12.5px;color:var(--cl-text-pri);line-height:1.6; }
// .cl-act-detail-toggle { margin-top:1px; }
// .cl-no-actions    { font-size:12px;color:var(--cl-text-muted);font-style:italic;padding:10px 15px; }

// /* action detail panel (inside action item) */
// .cl-action-item .cl-detail-panel{
//   margin:0 10px 10px;
// }

// /* ── FOOTER ── */
// .cl-footer   { display:flex;gap:10px;align-items:center; }
// .cl-foot-btn { padding:10px 20px;border-radius:var(--cl-radius-sm);font-family:inherit;
//   font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid;
//   display:inline-flex;align-items:center;gap:7px;transition:all 0.14s; }
// .cl-foot-save{ background:var(--cl-bg-card);border-color:#6ee7b7;color:var(--cl-green); }
// .cl-foot-save:hover{ background:var(--cl-green-lt); }

// /* ── EVIDENCE MODAL ── */
// .cl-modal-overlay { position:fixed;inset:0;background:rgba(20,25,40,0.45);z-index:9999;
//   display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;backdrop-filter:blur(2px); }
// .cl-modal-ev { background:var(--cl-bg-card);border-radius:var(--cl-radius-lg);width:100%;max-width:820px;
//   max-height:86vh;display:flex;flex-direction:column;overflow:hidden;
//   box-shadow:var(--cl-shadow-md),0 0 0 1px var(--cl-border);font-family:inherit; }

// /* header */
// .cl-modal-head      { padding:14px 20px;border-bottom:1px solid var(--cl-border-lt);
//   display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0; }
// .cl-modal-head-left { flex:1;min-width:0;display:flex;align-items:center;gap:10px; }
// .cl-modal-clause-id { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;
//   color:var(--cl-accent);background:var(--cl-accent-lt);border:1px solid var(--cl-accent-mid);
//   padding:2px 9px;border-radius:4px;flex-shrink:0; }
// .cl-modal-oblig-short { font-size:12px;color:var(--cl-text-sec);
//   overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
// .cl-modal-close { background:none;border:none;cursor:pointer;font-size:18px;
//   color:var(--cl-text-muted);padding:2px 6px;flex-shrink:0; }
// .cl-modal-close:hover { color:var(--cl-text-pri); }

// /* summary pills */
// .cl-ev-summary  { display:flex;align-items:center;gap:8px;padding:10px 20px;
//   background:var(--cl-bg-nav);border-bottom:1px solid var(--cl-border-lt);flex-shrink:0;flex-wrap:wrap; }
// .cl-ev-pill     { font-size:11px;font-weight:600;color:var(--cl-text-sec);
//   background:var(--cl-bg-card);border:1px solid var(--cl-border);
//   padding:4px 12px;border-radius:20px; }
// .cl-ev-pill-req  { color:var(--cl-red);background:var(--cl-red-lt);border-color:#f5b8b8; }
// .cl-ev-pill-rec  { color:var(--cl-amber);background:var(--cl-amber-lt);border-color:#fcd34d; }
// .cl-ev-pill-saved{ color:var(--cl-green);background:var(--cl-green-lt);border-color:#6ee7b7; }

// /* table wrapper — scrolls */
// .cl-ev-table-wrap { flex:1;overflow-y:auto;padding:0; }
// .cl-ev-table { width:100%;border-collapse:collapse;table-layout:fixed; }

// /* column widths */
// .cl-ev-th-num    { width:36px; }
// .cl-ev-th-status { width:110px; }
// .cl-ev-th-save   { width:80px; }

// /* thead */
// .cl-ev-th { padding:10px 14px;background:#f0f4f8;border-bottom:2px solid var(--cl-border);
//   font-size:10px;font-weight:700;color:var(--cl-text-muted);text-transform:uppercase;
//   letter-spacing:.07em;text-align:left;position:sticky;top:0;z-index:1; }
// .cl-ev-th-num  { text-align:center; }
// .cl-ev-th-save { text-align:center; }

// /* tbody rows */
// .cl-ev-tr { border-bottom:1px solid var(--cl-border-lt);transition:background 0.13s; }
// .cl-ev-tr:hover { background:#f8fafc; }
// .cl-ev-tr-saved { background:var(--cl-green-lt) !important; }
// .cl-ev-tr-saved td { border-color:#a7f3d0 !important; }

// .cl-ev-td { padding:13px 14px;vertical-align:top;font-size:12.5px;color:var(--cl-text-pri);line-height:1.55; }
// .cl-ev-td-num    { text-align:center;font-family:'DM Mono',monospace;font-size:11px;
//   font-weight:700;color:var(--cl-text-muted);vertical-align:middle; }
// .cl-ev-td-action { color:var(--cl-text-pri);font-weight:500; }
// .cl-ev-td-doc    { }
// .cl-ev-td-status { vertical-align:middle;text-align:center; }
// .cl-ev-td-save   { vertical-align:middle;text-align:center; }

// /* doc cell content */
// .cl-ev-doc-name   { font-size:12.5px;font-weight:700;color:var(--cl-text-pri);margin-bottom:3px; }
// .cl-ev-doc-sub    { font-size:10.5px;color:var(--cl-text-muted);margin-bottom:5px; }
// .cl-ev-doc-needed { font-size:11.5px;color:var(--cl-text-sec);line-height:1.55; }

// /* badges */
// .cl-ev-badge     { display:inline-block;font-size:9px;font-weight:700;
//   padding:3px 9px;border-radius:4px;white-space:nowrap; }
// .cl-ev-badge-req { background:var(--cl-red-lt);color:var(--cl-red); }
// .cl-ev-badge-rec { background:var(--cl-amber-lt);color:var(--cl-amber); }

// /* save button */
// .cl-ev-save-btn  { padding:5px 12px;background:var(--cl-bg-nav);border:1.5px solid var(--cl-border);
//   border-radius:6px;font-family:inherit;font-size:11px;font-weight:700;
//   color:var(--cl-text-sec);cursor:pointer;transition:all 0.13s;white-space:nowrap; }
// .cl-ev-save-btn:hover { border-color:var(--cl-green);color:var(--cl-green);background:var(--cl-green-lt); }
// .cl-ev-save-done { background:var(--cl-green-lt) !important;border-color:#6ee7b7 !important;
//   color:var(--cl-green) !important;cursor:default !important; }

// /* footer */
// .cl-modal-foot      { padding:11px 20px;border-top:1px solid var(--cl-border-lt);background:var(--cl-bg-nav);
//   display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0; }
// .cl-modal-foot-note { font-size:11px;color:var(--cl-text-muted);flex:1;line-height:1.5; }
// .cl-modal-btn       { padding:7px 16px;border-radius:var(--cl-radius-sm);font-family:inherit;
//   font-size:12px;font-weight:600;cursor:pointer;transition:all 0.13s; }
// .cl-modal-btn-sec   { background:var(--cl-bg-card);border:1.5px solid var(--cl-border);color:var(--cl-text-pri); }
// .cl-modal-btn-sec:hover { background:var(--cl-bg-hover); }
// .cl-modal-btn-pri   { background:var(--cl-text-pri);border:none;color:#fff; }
// .cl-modal-btn-pri:hover { background:#2a3248; }
// `;
//   document.head.appendChild(s);
// }
/* ================================================================
   clause-panel-v2.js  —  Clause Breakdown Panel (v2)
   All changes applied:
   - Left nav: "Chapter 1" label shown above sections
   - Right stack: Chapter title + Section name header, only Risk + Dept badges
   - Clause text: 10-line clamp, Show more/less
   - No Edit button on top; Page No chip simple; ⓘ icon toggles metadata table
   - Obligations: clean formatted accordion, proper layout
   - Actions: ⓘ icon per action shows 5 params inline
   - Relationship dialog: MUI-style FAB at bottom-right
================================================================ */

/* ──────────────────────────────────────────── BUILD */
function buildClausePanel() {
  injectSharedCSS();
  injectClauseCSS();
  _clInjectRelFAB();
  return `
  <div class="cl-wrap">
    <div id="cl-empty" class="cl-empty-state" style="display:none;">
      <div class="cl-empty-icon">📄</div>
      <div class="cl-empty-title">No Circular Selected</div>
      <div class="cl-empty-sub">Go to Overview and confirm a circular first.</div>
      <button class="cl-empty-cta" onclick="document.querySelector('[data-tab=\\'overview\\']')?.click()">← Go to Overview</button>
    </div>
    <div id="cl-main" style="display:none;">
      <div class="cl-topbar">
        <div class="cl-topbar-left">
          <span class="cl-circ-id-chip" id="cl-circ-id-chip">—</span>
          <span class="cl-circ-name-chip" id="cl-circ-name-chip">—</span>
        </div>
        <div class="cl-topbar-right">
          <select class="cl-filter-select" id="cl-filter-dept"><option value="">All Departments</option><option>Compliance</option><option>Risk</option><option>Operations</option><option>Legal</option><option>IT</option><option>HR</option></select>
          <select class="cl-filter-select" id="cl-filter-risk"><option value="">All Risk Levels</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select>
          <div class="cl-level-toggle">
            <button class="cl-lvl-btn active" data-level="2">L2</button>
            <button class="cl-lvl-btn" data-level="3">L3</button>
          </div>
          <button class="cl-topbar-btn cl-btn-generate" id="cl-btn-generate">◈ Generate</button>
          
        </div>
      </div>
      <div class="cl-split" id="cl-split" style="display:none;">
        <!-- LEFT NAV: Chapter → Section → Sub-section only -->
        <div class="cl-nav" id="cl-nav">
          <div class="cl-nav-head">
            <span class="cl-nav-title">Structure</span>
            <span class="cl-nav-count" id="cl-nav-count">—</span>
          </div>
          <div class="cl-nav-tree" id="cl-nav-tree">
            <div class="cl-nav-placeholder">Generate to view structure</div>
          </div>
        </div>
        <!-- RIGHT WORKSPACE -->
        <div class="cl-workspace" id="cl-workspace">
          <div class="cl-ws-placeholder" id="cl-ws-ph">
            <div class="cl-ws-ph-icon">📋</div>
            <div class="cl-ws-ph-title">Select a section</div>
            <div class="cl-ws-ph-sub">Click any section in the left panel to see its clauses</div>
          </div>
          <div id="cl-ws-stack" style="display:none;"></div>
          <div id="cl-ws-content" style="display:none;"></div>
        </div>
      </div>
      <div class="cl-footer" id="cl-footer" style="display:none;">
        <button class="cl-foot-save" id="cl-foot-save">🔖 &nbsp;Save Clauses</button>
      </div>
    </div>
  </div>`;
}

/* ──────────────────────────────────────────── INIT */
function initClauseListeners() {
  injectSharedCSS();
  injectClauseCSS();
  _clInjectRelFAB();

  const circId = AI_LIFECYCLE_STATE.selectedCircularId;
  const circ   = circId ? (CMS_DATA?.circulars||[]).find(x=>x.id===circId) : null;

  if (!circ) {
    document.getElementById('cl-empty').style.display = 'flex';
    document.getElementById('cl-main').style.display  = 'none';
    return;
  }
  document.getElementById('cl-empty').style.display = 'none';
  document.getElementById('cl-main').style.display  = 'block';
  document.getElementById('cl-circ-id-chip').textContent  = circ.id;
  document.getElementById('cl-circ-name-chip').textContent = circ.title;
  window._CL_ACTIVE_CIRC = circ;

  document.querySelectorAll('.cl-lvl-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.cl-lvl-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      if (window._CL_ACTIVE_CLAUSE)
        _clShowClause(window._CL_ACTIVE_CIRC_REF, window._CL_ACTIVE_CH_REF, window._CL_ACTIVE_CLAUSE);
    });
  });

  ['cl-filter-dept','cl-filter-risk'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
      if (window._CL_ACTIVE_SECTION_CLAUSES)
        _clShowClauseStack(window._CL_ACTIVE_CIRC, window._CL_ACTIVE_CH_REF, window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_SECTION_LABEL);
    });
  });

  document.getElementById('cl-btn-generate')?.addEventListener('click', ()=>_clRunGenerate(circ));
  document.getElementById('cl-btn-regen')?.addEventListener('click', function(){
    this.textContent='↺ …'; this.disabled=true;
    setTimeout(()=>{ _clBuildTree(circ); this.textContent='↺ Regenerate'; this.disabled=false; showToast('Regenerated.','success'); },1400);
  });
  document.getElementById('cl-foot-save')?.addEventListener('click', function(){
    this.textContent='✓ Saved'; this.disabled=true; showToast('Saved to library.','success');
  });
}

/* ──────────────────────────────────────────── GENERATE */
function _clRunGenerate(circ) {
  document.getElementById('cl-nav-tree').innerHTML = `<div class="cl-nav-loading">${loadingHTML('Building structure…')}</div>`;
  _clResetWorkspace();
  setTimeout(()=>{
    document.getElementById('cl-split').style.display = 'grid';
    _clBuildTree(circ);
    document.getElementById('cl-btn-regen').style.display = 'inline-flex';
    const f = document.getElementById('cl-footer');
    f.style.display='flex'; f.style.opacity='0'; f.style.transition='opacity .3s';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ f.style.opacity='1'; }));
  },1600);
}

function _clResetWorkspace() {
  document.getElementById('cl-ws-ph').style.display = 'flex';
  const s=document.getElementById('cl-ws-stack'), c=document.getElementById('cl-ws-content');
  s.style.display='none'; s.innerHTML='';
  c.style.display='none'; c.innerHTML='';
  window._CL_ACTIVE_CLAUSE = null;
}

/* ──────────────────────────────────────────── LEFT NAV TREE
   Shows: Chapter 1 label → Section → Sub-section (NO clauses)
*/
function _clBuildTree(circ) {
  const navTree = document.getElementById('cl-nav-tree');
  const navCount = document.getElementById('cl-nav-count');
  let total = 0;
  (circ.chapters||[]).forEach(ch=>{ total+=(ch.clauses||[]).length; });
  if (navCount) navCount.textContent = `${total} clauses`;

  navTree.innerHTML = (circ.chapters||[]).map((ch,ci)=>{
    const chLabel = `Chapter ${ci+1}`;
    const hasSec  = ch.sections?.length > 0;
    let inner = '';

    if (hasSec) {
      ch.sections.forEach((sec,si)=>{
        const secKey = `${ci}-${si}`;
        const hasSub = sec.subSections?.length > 0;
        if (hasSub) {
          const subHtml = sec.subSections.map((sub,ssi)=>{
            const subKey = `${ci}-${si}-${ssi}`;
            const subClauses = (sub.clauses||[]).map(id=>(ch.clauses||[]).find(c=>c.id===id)).filter(Boolean);
            const subLabel   = `${sub.id?sub.id+' – ':''}${(sub.text||'Sub-section').substring(0,34)}${(sub.text||'').length>34?'…':''}`;
            return `<button class="cl-nav-subsec-btn" data-key="${subKey}"
              onclick="clNavSelect(event,${ci},'${subKey}','${chLabel}','${subLabel.replace(/'/g,"\\'")}')">
              <span class="cl-nav-subsec-icon">¶</span>
              <span class="cl-nav-subsec-label">${subLabel}</span>
              <span class="cl-nav-subsec-count">${subClauses.length}</span>
            </button>`;
          }).join('');
          const secLabel = `${sec.id?sec.id+' – ':''}${(sec.text||'Section').substring(0,32)}${(sec.text||'').length>32?'…':''}`;
          inner += `<div class="cl-nav-sec-group">
            <button class="cl-nav-sec-btn cl-nav-sec-has-sub" data-sec="${secKey}">
              <span class="cl-nav-sec-icon">§</span>
              <span class="cl-nav-sec-label">${secLabel}</span>
              <span class="cl-nav-sec-arrow">▾</span>
            </button>
            <div class="cl-nav-sec-body" id="cl-sec-body-${secKey}">${subHtml}</div>
          </div>`;
        } else {
          const secLabel = `${sec.id?sec.id+' – ':''}${(sec.text||'Section').substring(0,32)}${(sec.text||'').length>32?'…':''}`;
          const secClauses = (sec.clauses||[]).map(id=>(ch.clauses||[]).find(c=>c.id===id)).filter(Boolean);
          const cnt = secClauses.length || (ch.clauses||[]).length;
          inner += `<div class="cl-nav-sec-group">
            <button class="cl-nav-sec-btn" data-sec="${secKey}"
              onclick="clNavSelect(event,${ci},'${secKey}','${chLabel}','${secLabel.replace(/'/g,"\\'")}')">
              <span class="cl-nav-sec-icon">§</span>
              <span class="cl-nav-sec-label">${secLabel}</span>
              <span class="cl-nav-sec-count">${cnt}</span>
              <span class="cl-nav-sec-arrow">▸</span>
            </button>
          </div>`;
        }
      });
    } else {
      inner = `<button class="cl-nav-all-btn" onclick="clNavSelectChapter(event,${ci},'${chLabel}')">
        View all ${(ch.clauses||[]).length} clauses →
      </button>`;
    }

    return `<div class="cl-nav-chapter">
      <button class="cl-nav-ch-btn" data-ci="${ci}">
        <span class="cl-nav-ch-arrow">▶</span>
        <div class="cl-nav-ch-info">
          <span class="cl-nav-ch-num">${chLabel}</span>
          <span class="cl-nav-ch-label">${ch.title||''}</span>
        </div>
        <span class="cl-nav-ch-count">${(ch.clauses||[]).length}</span>
      </button>
      <div class="cl-nav-ch-body" id="cl-ch-body-${ci}">${inner}</div>
    </div>`;
  }).join('');

  /* Chapter collapse */
  navTree.querySelectorAll('.cl-nav-ch-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const body=document.getElementById(`cl-ch-body-${btn.dataset.ci}`);
      const arr=btn.querySelector('.cl-nav-ch-arrow');
      const open=body?.classList.contains('open');
      body?.classList.toggle('open',!open);
      if(arr) arr.textContent = open?'▶':'▼';
    });
  });
  /* Section-with-sub collapse */
  navTree.querySelectorAll('.cl-nav-sec-has-sub').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const body=document.getElementById(`cl-sec-body-${btn.dataset.sec}`);
      const arr=btn.querySelector('.cl-nav-sec-arrow');
      const open=body?.classList.contains('open');
      body?.classList.toggle('open',!open);
      if(arr) arr.textContent = open?'▴':'▾';
    });
  });
}

window.clNavSelect = function(e,chIdx,key,chLabel,secLabel){
  e.stopPropagation();
  const circ=window._CL_ACTIVE_CIRC; const ch=circ?.chapters?.[chIdx]; if(!ch) return;
  document.querySelectorAll('.cl-nav-sec-btn,.cl-nav-subsec-btn').forEach(b=>b.classList.remove('cl-nav-active'));
  e.currentTarget.classList.add('cl-nav-active');
  const clauses = ch.clauses||[];
  window._CL_ACTIVE_SECTION_CLAUSES = clauses;
  window._CL_ACTIVE_CH_REF = ch;
  window._CL_ACTIVE_SECTION_LABEL = {chLabel, secLabel};
  _clShowClauseStack(circ, ch, clauses, {chLabel, secLabel});
};
window.clNavSelectChapter = function(e,chIdx,chLabel){
  e.stopPropagation();
  const circ=window._CL_ACTIVE_CIRC; const ch=circ?.chapters?.[chIdx]; if(!ch) return;
  window._CL_ACTIVE_SECTION_CLAUSES=ch.clauses||[];
  window._CL_ACTIVE_CH_REF=ch;
  window._CL_ACTIVE_SECTION_LABEL={chLabel,secLabel:'All Clauses'};
  _clShowClauseStack(circ,ch,ch.clauses||[],{chLabel,secLabel:'All Clauses'});
};

/* ──────────────────────────────────────────── CLAUSE STACK (right panel)
   Header: Chapter X title → Section name → list of clause cards
   Cards: only Risk + Dept badges
*/
function _clShowClauseStack(circ, ch, allClauses, labels) {
  document.getElementById('cl-ws-ph').style.display='none';
  const content=document.getElementById('cl-ws-content');
  content.style.display='none'; content.innerHTML='';
  window._CL_ACTIVE_CLAUSE=null;

  const dept=document.getElementById('cl-filter-dept')?.value||'';
  const risk=document.getElementById('cl-filter-risk')?.value||'';
  const filtered=allClauses.filter(cl=>{
    if(dept && cl.department!==dept) return false;
    if(risk && cl.risk!==risk) return false;
    return true;
  });

  const stack=document.getElementById('cl-ws-stack');
  stack.style.display='block';
  const chLabel  = labels?.chLabel  || 'Chapter';
  const secLabel = labels?.secLabel || '';
  const chTitle  = ch.title || '';

  stack.innerHTML = `
  <div class="cl-stack-wrap">
    <div class="cl-stack-header">
      <div class="cl-stack-breadcrumb">
        <div class="cl-stack-chapter-row">
          <span class="cl-stack-ch-num">${chLabel}</span>
          ${chTitle ? `<span class="cl-stack-ch-title">${chTitle}</span>` : ''}
        </div>
        ${secLabel ? `<div class="cl-stack-sec-row">
          <span class="cl-stack-sec-icon">§</span>
          <span class="cl-stack-sec-label">${secLabel}</span>
        </div>` : ''}
      </div>
      <span class="cl-stack-count">${filtered.length} clause${filtered.length!==1?'s':''}</span>
    </div>
    <div class="cl-stack-list">
      ${filtered.length ? filtered.map(cl=>`
      <button class="cl-clause-card" id="cl-card-${cl.id}"
        onclick="_clCardClick('${cl.id}',${(circ.chapters||[]).indexOf(ch)})">
        <div class="cl-card-top-row">
          <span class="cl-card-id">${cl.id}</span>
          <div class="cl-card-badges">
            ${cl.risk?`<span class="cl-card-risk cl-risk-${cl.risk.toLowerCase()}">${cl.risk}</span>`:''}
            ${cl.department?`<span class="cl-card-dept">${cl.department}</span>`:''}
          </div>
        </div>
        <div class="cl-card-text">${(cl.text||'').substring(0,100)}${(cl.text||'').length>100?'…':''}</div>
      </button>`).join('') : `<div class="cl-stack-empty">No clauses match the current filters.</div>`}
    </div>
  </div>`;

  window._CL_STACK_CIRC=circ;
}

window._clCardClick = function(clauseId,chIdx){
  const circ=window._CL_STACK_CIRC||window._CL_ACTIVE_CIRC;
  const ch=circ?.chapters?.[chIdx];
  const cl=(ch?.clauses||[]).find(c=>c.id===clauseId);
  if(!cl) return;
  document.querySelectorAll('.cl-clause-card').forEach(c=>c.classList.remove('cl-clause-card-active'));
  document.getElementById(`cl-card-${clauseId}`)?.classList.add('cl-clause-card-active');
  document.getElementById('cl-ws-stack').style.display='none';
  window._CL_ACTIVE_CLAUSE=cl;
  window._CL_ACTIVE_CIRC_REF=circ;
  window._CL_ACTIVE_CH_REF=ch;
  _clShowClause(circ,ch,cl);
};

/* ──────────────────────────────────────────── CLAUSE DETAIL VIEW */
function _clShowClause(circ, ch, cl) {
  document.getElementById('cl-ws-ph').style.display='none';
  const content=document.getElementById('cl-ws-content');
  content.style.display='block';

  const level=parseInt(document.querySelector('.cl-lvl-btn.active')?.dataset.level||'2');
  const meta=_clMockDetailMeta(0);
  const textId=`cl-txt-${cl.id}`;
  const metaId=`cl-meta-${cl.id}`;

  content.innerHTML=`
  <div class="cl-ws-inner">
    <!-- BACK -->
    <button class="cl-ws-back" onclick="_clBackToStack()">← Back to clauses</button>

    <!-- CLAUSE HEADER — no edit button -->
    <div class="cl-ws-clause-card">
      <div class="cl-wc-header">
        <div class="cl-wc-header-left">
          <div class="cl-wc-breadcrumb">
            <span class="cl-wc-ch">${`Chapter 1 : ${ch.title}`||'Chapter'}</span>
            <span class="cl-wc-sep" style="font-weight:800">›></span>
            <span class="cl-wc-id">${cl.id }</span>
            <span>  <span class="cl-wc-page-chip" onclick="clOpenDocPage(${cl.pageNo})">📄 Page 1</span></span>
          </div>
          <div class="cl-wc-badges">
            ${cl.risk?`<span class="cl-wc-badge cl-wc-risk-${cl.risk.toLowerCase()}">${cl.risk} Risk</span>`:''}
            ${cl.department?`<span class="cl-wc-badge cl-wc-dept">${cl.department}</span>`:''}
            ${cl.pageNo?`<span class="cl-wc-page-chip" onclick="clOpenDocPage(${cl.pageNo})">📄 Page 1 </span>`:''}
          </div>
        </div>
        <div class="cl-wc-header-right">
          <button class="cl-wc-info-btn" id="cl-info-btn-${cl.id}" onclick="_clToggleMeta('${metaId}','cl-info-btn-${cl.id}')" title="Show regulatory details">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </button>
          <button class="cl-wc-regen-btn" onclick="_clOpenCtxModal('clause_${cl.id}','Clause')">✦ Add Business Context</button>
        </div>
      </div>

      <!-- CLAUSE TEXT: 10-line clamp -->
      <div class="cl-wc-text cl-txt-clamped" id="${textId}">${cl.text||''}</div>
      ${(cl.text||'').length>200?`
      <button class="cl-view-more-btn" id="cl-vmore-${cl.id}" onclick="_clToggleTxt('${cl.id}','${textId}')">Show more ▾</button>`:''}

      <!-- METADATA TABLE (hidden, toggled by ⓘ) -->
      <div class="cl-meta-table-wrap" id="${metaId}" style="display:none;">
        <div class="cl-meta-table-inner">
          ${_clMetaFields(meta).map(f=>`
          <div class="cl-meta-row">
            <span class="cl-meta-label">${f.label}</span>
            <span class="cl-meta-value">${f.value}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

    ${level>=2?`
    <!-- OBLIGATIONS -->
    <div class="cl-section-block">
      <div class="cl-section-head">
        <span class="cl-section-label">Obligations</span>
      </div>
      <div class="cl-oblig-list" id="cl-oblig-list">${_clBuildObligations(cl,[],level)}</div>
    </div>`:''}
  </div>`;

  /* view more/less */
  window._clToggleTxt = function(id,tid){
    const el=document.getElementById(tid), btn=document.getElementById(`cl-vmore-${id}`);
    if(!el||!btn) return;
    const c=el.classList.toggle('cl-txt-clamped');
    btn.textContent = c?'Show more ▾':'Show less ▴';
  };

  /* meta table toggle */
  window._clToggleMeta = function(metaId, btnId){
    const el=document.getElementById(metaId), btn=document.getElementById(btnId);
    if(!el) return;
    const visible = el.style.display!=='none';
    el.style.display = visible?'none':'block';
    if(btn) btn.classList.toggle('cl-wc-info-btn-active',!visible);
  };

  /* obligation accordions */
  content.querySelectorAll('.cl-oblig-item').forEach(item=>{
    const trigger=item.querySelector('.cl-oblig-header');
    const body=item.querySelector('.cl-oblig-body');
    const arrow=item.querySelector('.cl-oblig-arrow');
    if(!trigger||!body) return;
    trigger.addEventListener('click',()=>{
      const open=body.classList.contains('open');
      /* close others */
      content.querySelectorAll('.cl-oblig-body.open').forEach(b=>b.classList.remove('open'));
      content.querySelectorAll('.cl-oblig-arrow').forEach(a=>a.classList.remove('rotated'));
      if(!open){ body.classList.add('open'); arrow?.classList.add('rotated'); }
    });
  });

  /* obligation inline edit */
  content.querySelectorAll('.cl-oblig-edit-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const oi=btn.dataset.oi;
      document.getElementById(`cl-oblig-view-${oi}`).style.display='none';
      document.getElementById(`cl-oblig-edit-${oi}`).style.display='block';
      document.getElementById(`cl-oblig-editbar-${oi}`).style.display='flex';
      btn.style.display='none';
      document.getElementById(`cl-oblig-edit-${oi}`).focus();
    });
  });
  content.querySelectorAll('.cl-oblig-edit-cancel').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const oi=btn.dataset.oi;
      document.getElementById(`cl-oblig-view-${oi}`).style.display='block';
      document.getElementById(`cl-oblig-edit-${oi}`).style.display='none';
      document.getElementById(`cl-oblig-editbar-${oi}`).style.display='none';
      document.getElementById(`cl-oblig-editbtn-${oi}`).style.display='inline-flex';
    });
  });
  content.querySelectorAll('.cl-oblig-edit-save').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const oi=btn.dataset.oi;
      const ta=document.getElementById(`cl-oblig-edit-${oi}`);
      const view=document.getElementById(`cl-oblig-view-${oi}`);
      if(view&&ta) view.textContent=ta.value;
      view.style.display='block'; ta.style.display='none';
      document.getElementById(`cl-oblig-editbar-${oi}`).style.display='none';
      document.getElementById(`cl-oblig-editbtn-${oi}`).style.display='inline-flex';
      showToast('Obligation updated.','success');
    });
  });

  /* action ⓘ toggle */
  content.querySelectorAll('.cl-action-info-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const panel=document.getElementById(btn.dataset.panel);
      if(!panel) return;
      const open=panel.classList.contains('open');
      content.querySelectorAll('.cl-action-meta-panel.open').forEach(p=>p.classList.remove('open'));
      content.querySelectorAll('.cl-action-info-btn.active').forEach(b=>b.classList.remove('active'));
      if(!open){ panel.classList.add('open'); btn.classList.add('active'); }
    });
  });

  /* evidence buttons */
  content.querySelectorAll('.cl-ev-btn').forEach(btn=>{
    btn.addEventListener('click',function(){
      try{
        const acts=JSON.parse(atob(this.dataset.actions));
        clShowEvidenceModal(this.dataset.clauseId,acts,this.dataset.obligation);
      }catch(e){ showToast('Error.','error'); }
    });
  });
}

window._clBackToStack = function(){
  document.getElementById('cl-ws-content').style.display='none';
  document.getElementById('cl-ws-content').innerHTML='';
  document.getElementById('cl-ws-stack').style.display='block';
  window._CL_ACTIVE_CLAUSE=null;
};
window.clOpenDocPage = function(p){ showToast(`Opening document at page ${p}…`,'info'); };

/* ──────────────────────────────────────────── OBLIGATIONS
   Clean formatted accordion — trigger row shows num + dept + page + text preview
   Body: mini meta grid (5 fields) + regen + evidence + optional actions
*/
function _clBuildObligations(cl, actions, level){
  const MOCK=[
    {text:'The entity shall establish and maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.',dept:'Compliance',pageNo:4,actions:['Draft or update the compliance policy to incorporate circular requirements','Present policy to Board for formal approval and record in minutes','Distribute updated policy to all relevant departments','Schedule annual review and assign policy owner']},
    {text:'All relevant staff must complete mandatory training on the obligations under this circular within 60 days of the effective date.',dept:'HR',pageNo:6,actions:['Identify all staff roles impacted by circular obligations','Design training module covering key compliance requirements','Track completion records and maintain in HR system','Conduct re-training annually or upon material amendment']},
    {text:'The entity shall implement robust internal controls and conduct periodic testing to verify operational effectiveness.',dept:'Risk',pageNo:8,actions:['Map all processes affected by this circular to control owners','Design control tests and document testing methodology','Execute quarterly control testing and record outcomes','Escalate control failures to senior management within 5 business days']},
    {text:'A designated Compliance Officer must be appointed to oversee implementation and serve as the primary liaison with the regulator.',dept:'Compliance',pageNo:10,actions:['Formally appoint or confirm Compliance Officer designation','Define responsibilities in the compliance officer mandate','Notify regulator of officer appointment with contact details','Ensure officer has adequate resources and independence']},
    {text:'The entity shall report compliance status to the regulator in the prescribed format within the timelines specified in the circular.',dept:'Compliance',pageNo:12,actions:['Identify all reporting obligations and their frequencies','Build reporting templates aligned to prescribed regulatory format','Establish data collection pipeline from source systems','Set automated alerts for upcoming reporting deadlines']},
    {text:'Adequate IT systems and infrastructure shall be in place to support digital compliance, data security and full audit trail requirements.',dept:'IT',pageNo:15,actions:['Conduct gap assessment of current IT systems','Implement required system controls and access restrictions','Enable full audit trail logging for all relevant transactions','Test system controls in UAT before go-live']},
  ];

  const obligs=Array.isArray(cl.obligations_list)
    ? cl.obligations_list.map(ob=>({text:typeof ob==='string'?ob:(ob.text||'—'),dept:ob.department||'Compliance',pageNo:ob.pageNo||null,actions:typeof ob==='string'?actions:(ob.actions||actions)}))
    : MOCK;

  return obligs.map((ob,oi)=>{
    const m=_clObligMeta(oi);
    const actList=ob.actions||[];
    return `
    <div class="cl-oblig-item" id="cl-oblig-${oi}">
      <!-- TRIGGER ROW -->
      <div class="cl-oblig-header">
        <div class="cl-oblig-header-left">
          <span class="cl-oblig-num">O${oi+1}</span>
          <div class="cl-oblig-header-info">
            <div class="cl-oblig-header-chips">
              ${ob.dept?`<span class="cl-oblig-dept-chip">${ob.dept}</span>`:''}
              ${ob.pageNo?`<button class="cl-oblig-pg-chip" onclick="event.stopPropagation();clOpenDocPage(${ob.pageNo})">📄 p.${ob.pageNo}</button>`:''}
            </div>
            <p class="cl-oblig-preview" id="cl-oblig-view-${oi}">${ob.text}</p>
          </div>
        </div>
        <div class="cl-oblig-header-right">
          <button class="cl-oblig-edit-btn" id="cl-oblig-editbtn-${oi}" data-oi="${oi}" title="Edit">✎</button>
          <span class="cl-oblig-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
      </div>

      <!-- INLINE EDIT -->
      <textarea class="cl-oblig-edit-ta" id="cl-oblig-edit-${oi}" style="display:none;">${ob.text}</textarea>
      <div class="cl-oblig-editbar" id="cl-oblig-editbar-${oi}" style="display:none;">
        <button class="cl-oblig-edit-cancel" data-oi="${oi}">Cancel</button>
        <button class="cl-oblig-edit-save" data-oi="${oi}">Save</button>
      </div>

      <!-- BODY -->
      <div class="cl-oblig-body" id="cl-oblig-body-${oi}">

        <!-- MINI METADATA: 5 fields in a clean row -->
        <div class="cl-oblig-meta-strip">
          <div class="cl-oblig-meta-field">
            <span class="cl-omf-label">Due Date</span>
            <span class="cl-omf-value">${m.dueDate}</span>
          </div>
          <div class="cl-oblig-meta-field">
            <span class="cl-omf-label">Section</span>
            <span class="cl-omf-value">${m.section}</span>
          </div>
          <div class="cl-oblig-meta-field">
            <span class="cl-omf-label">Sub-section</span>
            <span class="cl-omf-value">${m.subset}</span>
          </div>
          <div class="cl-oblig-meta-field">
            <span class="cl-omf-label">Category</span>
            <span class="cl-omf-value">${m.category}</span>
          </div>
          <div class="cl-oblig-meta-field">
            <span class="cl-omf-label">Frequency</span>
            <span class="cl-omf-value">${m.frequency}</span>
          </div>
        </div>

        <!-- FULL OBLIGATION TEXT -->
        <div class="cl-oblig-full-text">${ob.text}</div>

        <!-- ACTION ROW: regen + evidence -->
        <div class="cl-oblig-btn-row">
          <button class="cl-oblig-regen-btn" onclick="_clOpenCtxModal('oblig_${oi}','Obligation ${oi+1}')">✦ Regenerate with AI Context</button>
          <button class="cl-ev-btn"
            data-clause-id="${cl.id}"
            data-actions="${btoa(JSON.stringify(actList))}"
            data-obligation="${ob.text.substring(0,120)}">🔍 AI Evidence</button>
        </div>

        ${level>=3&&actList.length?`
        <!-- ACTIONS: each with ⓘ icon -->
        <div class="cl-actions-wrap">
          <div class="cl-actions-title">
            <span>Actions</span>
            <span class="cl-actions-badge">${actList.length}</span>
          </div>
          <div class="cl-actions-list">
            ${actList.map((a,ai)=>{
              const m2=_clObligMeta(ai);
              const panelId=`cl-act-meta-${oi}-${ai}`;
              return `
              <div class="cl-action-item">
                <div class="cl-action-main-row">
                  <span class="cl-action-num">${ai+1}</span>
                  <span class="cl-action-text">${a}</span>
                  <button class="cl-action-info-btn" data-panel="${panelId}" title="Show parameters">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  </button>
                </div>
                <div class="cl-action-meta-panel" id="${panelId}">
                  <div class="cl-action-meta-grid">
                    <div class="cl-amp-field"><span class="cl-amp-label">Due Date</span><span class="cl-amp-value">${m2.dueDate}</span></div>
                    <div class="cl-amp-field"><span class="cl-amp-label">Section</span><span class="cl-amp-value">${m2.section}</span></div>
                    <div class="cl-amp-field"><span class="cl-amp-label">Sub-section</span><span class="cl-amp-value">${m2.subset}</span></div>
                    <div class="cl-amp-field"><span class="cl-amp-label">Category</span><span class="cl-amp-value">${m2.category}</span></div>
                    <div class="cl-amp-field"><span class="cl-amp-label">Frequency</span><span class="cl-amp-value">${m2.frequency}</span></div>
                  </div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`:level>=3?`<div class="cl-no-actions">No specific actions required.</div>`:''}
      </div>
    </div>`;
  }).join('');
}

/* ──────────────────────────────────────────── METADATA HELPERS */
function _clMockDetailMeta(i){
  const d=[
    {regulatoryBody:'RBI',legalArea:'Banking Regulation',subLegalArea:'Prudential Norms',act:'Banking Regulation Act 1949',section:'Section 12',subset:'Clause (a)',category:'Mandatory Compliance',frequency:'Monthly',dueDate:'15th of following month'},
    {regulatoryBody:'SEBI',legalArea:'Securities Law',subLegalArea:'Market Conduct',act:'SEBI Act 1992',section:'Section 21',subset:'Clause (b)',category:'Periodic Reporting',frequency:'Quarterly',dueDate:'30 days from FY end'},
    {regulatoryBody:'IRDAI',legalArea:'Insurance Law',subLegalArea:'Solvency',act:'Insurance Act 1938',section:'Section 34A',subset:'Sub-section (1)',category:'System Control',frequency:'Half-Yearly',dueDate:'Within 7 business days'},
  ]; return d[i%d.length];
}
function _clMetaFields(meta){
  return [
    {label:'Regulatory Body',value:meta.regulatoryBody},
    {label:'Legislative Area',value:meta.legalArea},
    {label:'Sub-Legislative Area',value:meta.subLegalArea},
    {label:'Act',value:meta.act},
    {label:'Section',value:meta.section},
    {label:'Sub-section',value:meta.subset},
    {label:'Category',value:meta.category},
    {label:'Frequency',value:meta.frequency},
    {label:'Due Date',value:meta.dueDate},
  ];
}
function _clObligMeta(i){
  const F=['Monthly','Quarterly','Half-Yearly','Annual','Ongoing','One-time'];
  const D=['15th of following month','30 days from FY end','Within 7 business days','On occurrence','31st March','Within 60 days'];
  const S=['Section 12','Section 21','Section 34A','Section 19','Section 134','Section 80C'];
  const SS=['Clause (a)','Clause (b)','Sub-section (1)','Sub-section (2)','Proviso','Explanation'];
  const C=['Mandatory Compliance','Periodic Reporting','System Control','Governance','Disclosure','Risk Management'];
  return {frequency:F[i%6],dueDate:D[i%6],section:S[i%6],subset:SS[i%6],category:C[i%6]};
}

/* ──────────────────────────────────────────── AI CONTEXT MODAL */
window._clOpenCtxModal = function(target,label){
  window._clCtxTarget=target;
  let modal=document.getElementById('cl-ctx-modal');
  if(!modal){
    modal=document.createElement('div'); modal.id='cl-ctx-modal'; modal.className='cl-ctx-overlay';
    modal.innerHTML=`
    <div class="cl-ctx-box" onclick="event.stopPropagation()">
      <div class="cl-ctx-head">
        <div class="cl-ctx-title">✦ Regenerate with AI Context</div>
        <button class="cl-ctx-close" onclick="_clCloseCtxModal()">✕</button>
      </div>
      <div class="cl-ctx-body">
        <div class="cl-ctx-for" id="cl-ctx-for-lbl"></div>
        <div class="cl-ctx-chips">
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Risk Thresholds')">Risk Thresholds</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Provisioning Norms')">Provisioning Norms</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'SEBI Overlaps')">SEBI Overlaps</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Recent Amendments')">Recent Amendments</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Capital Adequacy')">Capital Adequacy</span>
          <span class="cl-ctx-chip" onclick="_clChipToggle(this,'PMLA Context')">PMLA Context</span>
        </div>
        <textarea class="cl-ctx-ta" id="cl-ctx-ta" placeholder="Add specific context or instructions for the AI…"></textarea>
        <div class="cl-ctx-footer">
          <button class="cl-ctx-cancel" onclick="_clCloseCtxModal()">Cancel</button>
          <button class="cl-ctx-go" onclick="_clSubmitCtx()">✦ Regenerate</button>
        </div>
      </div>
    </div>`;
    modal.addEventListener('click',e=>{ if(e.target===modal) _clCloseCtxModal(); });
    document.body.appendChild(modal);
  }
  document.getElementById('cl-ctx-for-lbl').textContent=`Regenerating: ${label}`;
  modal.classList.add('cl-ctx-open');
  setTimeout(()=>document.getElementById('cl-ctx-ta')?.focus(),50);
};
window._clCloseCtxModal=function(){
  document.getElementById('cl-ctx-modal')?.classList.remove('cl-ctx-open');
  document.querySelectorAll('.cl-ctx-chip').forEach(c=>c.classList.remove('cl-ctx-chip-active'));
  const ta=document.getElementById('cl-ctx-ta'); if(ta) ta.value='';
};
window._clChipToggle=function(el,text){
  el.classList.toggle('cl-ctx-chip-active');
  const ta=document.getElementById('cl-ctx-ta');
  ta.value=el.classList.contains('cl-ctx-chip-active')
    ?(ta.value?ta.value+'\n'+text:text)
    :ta.value.replace(text,'').replace(/\n+/g,'\n').trim();
};
window._clSubmitCtx=function(){
  _clCloseCtxModal(); showToast('✓ Regenerating with context…','success');
};

/* ──────────────────────────────────────────── RELATIONSHIP DIALOG — MUI FAB */
function _clInjectRelFAB(){
  if(document.getElementById('cl-rel-fab')) return;

  /* FAB button */
  const fab=document.createElement('button');
  fab.id='cl-rel-fab';
  fab.className='cl-rel-fab';
  fab.title='Circular Relationships';
  fab.innerHTML=`
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
    <span class="cl-fab-label">Lineage</span>`;
  fab.addEventListener('click', clOpenRelDialog);
  document.body.appendChild(fab);

  /* Dialog overlay */
  const REL_DATA={
    type:{label:'Type of Circular',desc:'Classification of this circular in the regulatory hierarchy.',items:[
      {id:'MD-001',type:'Master Direction',title:'Master Direction – Non-Banking Financial Companies',reg:'RBI',date:'01 Sep 2016',status:'Active',hierarchy:'Top-level directive — supersedes all prior circulars on this subject.',tags:['Prudential','NBFC','Governance'],docUrl:'#'},
      // {id:'MC-2024-04',type:'Master Circular',title:'Master Circular on Prudential Norms for NBFCs',reg:'RBI',date:'01 Apr 2024',status:'Active',hierarchy:'Annual consolidation of instructions on NBFC prudential norms.',tags:['Prudential','Annual'],docUrl:'#'},
    ]},
    belongs:{label:'Belongs To',desc:'The parent directive or master circular this circular falls under.',items:[
      {id:'MD-001',type:'Master Direction',title:'Master Direction – Non-Banking Financial Companies',reg:'RBI',date:'01 Sep 2016',status:'Active',hierarchy:'Parent — this circular derives authority from this Master Direction.',tags:['Parent','Master'],docUrl:'#'},
    ]},
    based:{label:'Based On',desc:'Earlier circulars or legislation this circular is founded upon.',items:[
      {id:'RBI/2019-20/88',type:'Circular',title:'Liquidity Risk Management Framework for NBFCs',reg:'RBI',date:'04 Nov 2019',status:'Superseded',hierarchy:'Foundation circular — current circular extends and updates these provisions.',tags:['Liquidity','Risk'],docUrl:'#'},
      {id:'BR-ACT-1949',type:'Legislation',title:'Banking Regulation Act, 1949 – Section 21',reg:'Parliament of India',date:'—',status:'Active',hierarchy:'Primary legislation empowering RBI to issue these directions.',tags:['Primary Law','Statutory'],docUrl:'#'},
    ]},
    refers:{label:'Refers To',desc:'Other circulars or guidelines cross-referenced in this circular.',items:[
      {id:'RBI/2022-23/101',type:'Circular',title:'Scale-Based Regulation (SBR): Revised Regulatory Framework for NBFCs',reg:'RBI',date:'22 Oct 2021',status:'Active',hierarchy:'Cross-reference — applicability criteria defined in this SBR circular.',tags:['SBR','Framework'],docUrl:'#'},
      {id:'SEBI/LAD-NRO/2023/45',type:'Circular',title:'SEBI Listing Obligations and Disclosure Requirements',reg:'SEBI',date:'10 Jun 2023',status:'Active',hierarchy:'Cross-regulator reference — SEBI norms applicable to listed NBFCs.',tags:['SEBI','Listed'],docUrl:'#'},
    ]},
    version:{label:'Version Chain',desc:'Full amendment and revision history of this circular.',items:[
      {id:'RBI/2016-17/26',type:'Original Issue',title:'Original Circular – Housing Finance Guidelines',reg:'RBI',date:'01 Jul 2016',status:'Superseded',hierarchy:'v1.0 — Original issue, fully superseded.',tags:['v1.0','Original'],docUrl:'#'},
      {id:'RBI/2019-20/156',type:'Amendment',title:'Amendment – LTV Ratio and Risk Weight Revision',reg:'RBI',date:'03 Mar 2020',status:'Superseded',hierarchy:'v2.0 — Revised LTV caps and risk weights.',tags:['v2.0','Amendment'],docUrl:'#'},
      {id:'RBI/2023-24/53',type:'Current Version',title:'Consolidated Circular – Housing Finance Norms (Current)',reg:'RBI',date:'15 Sep 2023',status:'Active',hierarchy:'v4.0 — Current version, consolidates all prior amendments.',tags:['v4.0','Current'],docUrl:'#'},
    ]},
  };

  const overlay=document.createElement('div');
  overlay.id='cl-rel-overlay'; overlay.className='cl-rel-overlay';
  overlay.innerHTML=`
  <div class="cl-rel-dialog" onclick="event.stopPropagation()">
    <div class="cl-rel-dhead">
      <div class="cl-rel-dhead-left">
        <div class="cl-rel-dhead-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </div>
        <div>
          <div class="cl-rel-dhead-title">Circular Relationships</div>
          <div class="cl-rel-dhead-sub" id="cl-rel-dsub">—</div>
        </div>
      </div>
      <button class="cl-rel-dclose" onclick="clCloseRelDialog()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="cl-rel-tabs" id="cl-rel-tabs">
      ${Object.entries(REL_DATA).map(([k,v],i)=>`
      <button class="cl-rel-tab${i===0?' active':''}" data-rel="${k}" onclick="clRelTab('${k}')">${v.label}</button>`).join('')}
    </div>
    <div class="cl-rel-body" id="cl-rel-body"></div>
  </div>`;
  overlay.addEventListener('click',e=>{ if(e.target===overlay) clCloseRelDialog(); });
  document.body.appendChild(overlay);
  window._CL_REL_DATA=REL_DATA;
  setTimeout(()=>clRelTab('type'),0);
}

window.clOpenRelDialog=function(){
  const overlay=document.getElementById('cl-rel-overlay');
  if(!overlay){ _clInjectRelFAB(); setTimeout(clOpenRelDialog,50); return; }
  const sub=document.getElementById('cl-rel-dsub'), circ=window._CL_ACTIVE_CIRC;
  if(sub&&circ) sub.textContent=`${circ.id} · ${circ.title}`;
  overlay.classList.add('cl-rel-open');
  document.getElementById('cl-rel-fab')?.classList.add('cl-fab-active');
};
window.clCloseRelDialog=function(){
  document.getElementById('cl-rel-overlay')?.classList.remove('cl-rel-open');
  document.getElementById('cl-rel-fab')?.classList.remove('cl-fab-active');
};
window.clRelTab=function(key){
  document.querySelectorAll('.cl-rel-tab').forEach(t=>t.classList.toggle('active',t.dataset.rel===key));
  const data=window._CL_REL_DATA?.[key], body=document.getElementById('cl-rel-body');
  if(!body||!data) return;
  body.innerHTML=`
  <div class="cl-rel-tab-desc">${data.desc}</div>
  <div class="cl-rel-items">${data.items.map((item,idx)=>_clRelItemHTML(item,idx,key)).join('')}</div>`;
};

function _clRelItemHTML(item,idx,key){
  const sc=item.status==='Active'?'cl-rs-active':item.status==='Superseded'?'cl-rs-super':'cl-rs-other';
  const dId=`cl-rd-${key}-${idx}`;
  return `
  <div class="cl-rel-item" id="cl-ri-${key}-${idx}">
    <div class="cl-rel-item-main" onclick="clRelToggle('${key}',${idx})">
      <div class="cl-rel-item-left">
        <div class="cl-rel-item-top-row">
          <span class="cl-ri-id">${item.id}</span>
          <span class="cl-ri-type">${item.type}</span>
          <span class="cl-ri-status ${sc}">${item.status}</span>
        </div>
        <div class="cl-ri-title">${item.title}</div>
        <div class="cl-ri-meta">
          <span class="cl-ri-reg">🏛 ${item.reg}</span>
          ${item.date!=='—'?`<span class="cl-ri-date">📅 ${item.date}</span>`:''}
          ${item.tags.map(t=>`<span class="cl-ri-tag">${t}</span>`).join('')}
        </div>
      </div>
      <span class="cl-ri-arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </span>
    </div>
    <div class="cl-rel-detail" id="${dId}">
      <div class="cl-rel-detail-inner">
        <div class="cl-rd-section">
          <div class="cl-rd-sec-label">Hierarchy &amp; Context</div>
          <div class="cl-rd-hierarchy">${item.hierarchy}</div>
        </div>
        <div class="cl-rd-section">
          <div class="cl-rd-sec-label">Details</div>
          <div class="cl-rd-grid">
            <div class="cl-rd-field"><span class="cl-rd-label">Circular ID</span><span class="cl-rd-value">${item.id}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Type</span><span class="cl-rd-value">${item.type}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Regulator</span><span class="cl-rd-value">${item.reg}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Issue Date</span><span class="cl-rd-value">${item.date}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Status</span><span class="cl-rd-value">${item.status}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Tags</span><span class="cl-rd-value">${item.tags.join(', ')}</span></div>
          </div>
        </div>
        <div class="cl-rd-section">
          <div class="cl-rd-sec-label">Links &amp; Documents</div>
          <div class="cl-rd-links">
            <a class="cl-rd-link cl-rd-link-pri" href="${item.docUrl}" target="_blank" onclick="event.stopPropagation()">📄 View Full Circular</a>
            <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Opening in doc viewer…','info')">🔍 Open in Doc Viewer</a>
            <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Downloading PDF…','info')">⬇ Download PDF</a>
            <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Link copied!','success')">🔗 Copy Reference</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
window.clRelToggle=function(key,idx){
  const det=document.getElementById(`cl-rd-${key}-${idx}`), item=document.getElementById(`cl-ri-${key}-${idx}`);
  if(!det) return;
  const open=det.classList.contains('open');
  document.querySelectorAll('.cl-rel-detail').forEach(d=>d.classList.remove('open'));
  document.querySelectorAll('.cl-rel-item').forEach(i=>i.classList.remove('cl-ri-exp'));
  if(!open){ det.classList.add('open'); item?.classList.add('cl-ri-exp'); }
};

/* ──────────────────────────────────────────── EVIDENCE MODAL */
window.clShowEvidenceModal=function(clauseId,actions,obligation){
  const EV=[
    {icon:'📋',name:'Compliance Policy Document',type:'Policy',source:'Internal Repository',needed:'Board-approved policy covering this compliance area.',status:'Required'},
    {icon:'🔍',name:'Internal Audit Report',type:'Audit Record',source:'Internal Audit Dept',needed:'Audit findings confirming controls are operating effectively.',status:'Required'},
    {icon:'🎓',name:'Staff Training Completion Record',type:'Training Record',source:'HR System',needed:'Completion records for all relevant staff.',status:'Required'},
    {icon:'💻',name:'System Audit Trail / Access Log',type:'System Log',source:'IT Department',needed:'System-generated logs showing automated controls.',status:'Recommended'},
    {icon:'🏛️',name:'Board Resolution / Meeting Minutes',type:'Board Record',source:'Company Secretary',needed:'Board-level approval in formal meeting minutes.',status:'Required'},
    {icon:'📨',name:'Regulatory Submission Receipt',type:'Regulatory Filing',source:'Compliance Team',needed:'Regulator acknowledgement of timely submission.',status:'Recommended'},
  ];
  const mapped=(Array.isArray(actions)?actions:[actions]).map((a,i)=>({action:a,ev:EV[i%EV.length]}));
  const req=mapped.filter(m=>m.ev.status==='Required').length, rec=mapped.length-req;
  const ov=document.createElement('div'); ov.className='cl-modal-overlay';
  ov.innerHTML=`
  <div class="cl-modal cl-modal-ev">
    <div class="cl-modal-head">
      <div class="cl-modal-head-left">
        <span class="cl-modal-clause-id">${clauseId}</span>
        ${obligation?`<span class="cl-modal-oblig-short">${obligation.substring(0,90)}${obligation.length>90?'…':''}</span>`:''}
      </div>
      <button class="cl-modal-close" onclick="this.closest('.cl-modal-overlay').remove()">✕</button>
    </div>
    <div class="cl-ev-summary">
      <span class="cl-ev-pill">${mapped.length} items</span>
      <span class="cl-ev-pill cl-ev-pill-req">🔴 ${req} Required</span>
      <span class="cl-ev-pill cl-ev-pill-rec">🟡 ${rec} Recommended</span>
      <span class="cl-ev-pill cl-ev-pill-saved">✅ <span id="cl-ev-sc">0</span> Saved</span>
    </div>
    <div class="cl-ev-table-wrap">
      <table class="cl-ev-table">
        <thead><tr>
          <th class="cl-ev-th cl-ev-th-num">#</th>
          <th class="cl-ev-th">Action</th>
          <th class="cl-ev-th">Evidence Needed</th>
          <th class="cl-ev-th cl-ev-th-st">Status</th>
          <th class="cl-ev-th cl-ev-th-sv"></th>
        </tr></thead>
        <tbody>
          ${mapped.map((m,i)=>`
          <tr class="cl-ev-tr" id="cl-ev-row-${i}">
            <td class="cl-ev-td cl-ev-td-num">${i+1}</td>
            <td class="cl-ev-td">${m.action}</td>
            <td class="cl-ev-td">
              <div class="cl-ev-doc-name">${m.ev.icon} ${m.ev.name}</div>
              <div class="cl-ev-doc-sub">${m.ev.type} · ${m.ev.source}</div>
              <div class="cl-ev-doc-needed">${m.ev.needed}</div>
            </td>
            <td class="cl-ev-td cl-ev-td-st"><span class="cl-ev-badge ${m.ev.status==='Required'?'cl-ev-badge-req':'cl-ev-badge-rec'}">${m.ev.status}</span></td>
            <td class="cl-ev-td cl-ev-td-sv">
              <button class="cl-ev-save-btn" onclick="this.textContent='✓';this.classList.add('cl-ev-saved');this.disabled=true;document.getElementById('cl-ev-row-${i}').classList.add('cl-ev-tr-saved');const c=document.getElementById('cl-ev-sc');if(c)c.textContent=parseInt(c.textContent||0)+1;showToast('Saved.','success');">Save</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="cl-modal-foot">
      <span class="cl-modal-foot-note">💡 AI-suggested based on clause and obligation context</span>
      <div style="display:flex;gap:8px;">
        <button class="cl-modal-btn cl-modal-btn-sec" onclick="showToast('Refreshing…','info')">↺ Refresh</button>
        <button class="cl-modal-btn cl-modal-btn-pri" onclick="this.closest('.cl-modal-overlay').remove()">Done</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click',e=>{ if(e.target===ov) ov.remove(); });
};

/* ──────────────────────────────────────────── CSS */
function injectClauseCSS(){
  if(document.getElementById('cl-css')) return;
  const s=document.createElement('style'); s.id='cl-css';
  s.textContent=`
:root{
  --cl-bg:#f4f6f9;--cl-card:#fff;--cl-nav-bg:#f8f9fb;--cl-hover:#eef1f6;
  --cl-border:#e2e6ed;--cl-border-lt:#edf0f5;
  --cl-t1:#1e2433;--cl-t2:#5a6478;--cl-t3:#9aa3b5;
  --cl-blue:#0d7fa5;--cl-blue-lt:#e6f4f9;--cl-blue-mid:#b2ddef;
  --cl-purple:#5b5fcf;--cl-purple-lt:#ededfc;
  --cl-green:#0e9f6e;--cl-green-lt:#e8faf4;
  --cl-amber:#b45309;--cl-amber-lt:#fef3c7;
  --cl-red:#c92a2a;--cl-red-lt:#fdecea;
  --cl-r-sm:6px;--cl-r-md:10px;--cl-r-lg:14px;
  --cl-sh:0 1px 3px rgba(30,36,51,.07);--cl-sh-md:0 4px 16px rgba(30,36,51,.10);
  --cl-font:'DM Sans',system-ui,sans-serif;
  --cl-mono:'DM Mono',monospace;
}
*{box-sizing:border-box;}
.cl-wrap{display:flex;flex-direction:column;gap:12px;font-family:var(--cl-font);color:var(--cl-t1);}

/* ── EMPTY */
.cl-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px 28px;background:var(--cl-card);border:2px dashed var(--cl-border);border-radius:var(--cl-r-lg);text-align:center;}
.cl-empty-icon{font-size:36px;opacity:.5;}.cl-empty-title{font-size:15px;font-weight:700;}
.cl-empty-sub{font-size:13px;color:var(--cl-t3);max-width:280px;line-height:1.6;}
.cl-empty-cta{padding:9px 22px;background:var(--cl-t1);color:#fff;border:none;border-radius:var(--cl-r-sm);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}

/* ── TOP BAR */
.cl-topbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 16px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-md);box-shadow:var(--cl-sh);}
.cl-topbar-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1;flex-wrap:wrap;}
.cl-topbar-right{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap;}
.cl-circ-id-chip{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:3px 10px;border-radius:5px;white-space:nowrap;}
.cl-circ-name-chip{font-size:12px;color:var(--cl-t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:280px;}
.cl-filter-select{padding:6px 10px;background:var(--cl-nav-bg);border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;color:var(--cl-t2);outline:none;cursor:pointer;}
.cl-filter-select:focus{border-color:var(--cl-blue);}
.cl-level-toggle{display:flex;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);overflow:hidden;}
.cl-lvl-btn{padding:6px 12px;background:var(--cl-card);border:none;border-right:1px solid var(--cl-border);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t3);cursor:pointer;transition:all .12s;}
.cl-lvl-btn:last-child{border-right:none;}.cl-lvl-btn.active{background:var(--cl-t1);color:#fff;}
.cl-topbar-btn{padding:7px 15px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .13s;white-space:nowrap;border:1.5px solid;}
.cl-btn-generate{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}.cl-btn-generate:hover{background:#2a3248;}
.cl-btn-regen{background:var(--cl-card);color:var(--cl-t1);border-color:var(--cl-border);}.cl-btn-regen:hover{background:var(--cl-hover);}

/* ── SPLIT */
.cl-split{display:grid;grid-template-columns:256px 1fr;gap:0;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-lg);overflow:hidden;min-height:560px;box-shadow:var(--cl-sh);}

/* ── LEFT NAV */
.cl-nav{border-right:1px solid var(--cl-border-lt);display:flex;flex-direction:column;background:var(--cl-nav-bg);}
.cl-nav-head{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;border-bottom:1px solid var(--cl-border-lt);}
.cl-nav-title{font-size:10px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
.cl-nav-count{font-size:10px;color:var(--cl-t3);background:var(--cl-border-lt);border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px;}
.cl-nav-tree{flex:1;overflow-y:auto;padding:4px 0;}
.cl-nav-placeholder,.cl-nav-loading{padding:24px 16px;font-size:12px;color:var(--cl-t3);text-align:center;line-height:1.6;}

/* chapter btn — shows "Chapter 1" + title */
.cl-nav-ch-btn{width:100%;display:flex;align-items:center;gap:7px;padding:9px 14px 9px 10px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background .1s;}
.cl-nav-ch-btn:hover{background:var(--cl-hover);}
.cl-nav-ch-arrow{font-size:8px;color:var(--cl-t3);flex-shrink:0;width:10px;line-height:1;}
.cl-nav-ch-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}
.cl-nav-ch-num{font-size:9px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;line-height:1.2;}
.cl-nav-ch-label{font-size:11px;font-weight:600;color:var(--cl-t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3;}
.cl-nav-ch-count{font-size:10px;color:var(--cl-t3);background:#e8ebf1;padding:1px 7px;border-radius:10px;flex-shrink:0;}
.cl-nav-ch-body{display:none;padding-bottom:4px;}.cl-nav-ch-body.open{display:block;}

/* section btn */
.cl-nav-sec-btn{width:100%;display:flex;align-items:center;gap:6px;padding:7px 12px 7px 20px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;text-align:left;transition:background .1s;color:var(--cl-t2);border-left:3px solid transparent;}
.cl-nav-sec-btn:hover{background:var(--cl-hover);}
.cl-nav-active{background:var(--cl-blue-lt)!important;border-left-color:var(--cl-blue)!important;color:var(--cl-blue)!important;}
.cl-nav-sec-icon{font-size:10px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:1px 5px;border-radius:3px;flex-shrink:0;}
.cl-nav-sec-label{flex:1;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-nav-sec-count,.cl-nav-subsec-count{font-size:9px;color:var(--cl-t3);flex-shrink:0;}
.cl-nav-sec-arrow{font-size:10px;color:var(--cl-t3);flex-shrink:0;}
.cl-nav-sec-body{display:none;}.cl-nav-sec-body.open{display:block;}

/* sub-section btn */
.cl-nav-subsec-btn{width:100%;display:flex;align-items:center;gap:6px;padding:6px 12px 6px 32px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:10.5px;text-align:left;transition:background .1s;color:var(--cl-t2);border-left:3px solid transparent;}
.cl-nav-subsec-btn:hover{background:var(--cl-hover);}
.cl-nav-subsec-icon{font-size:9px;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:1px 4px;border-radius:3px;font-weight:700;}
.cl-nav-subsec-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-nav-all-btn{display:block;width:100%;padding:7px 14px 7px 20px;background:none;border:none;font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-blue);text-align:left;cursor:pointer;}
.cl-nav-all-btn:hover{background:var(--cl-hover);}

/* ── RIGHT WORKSPACE */
.cl-workspace{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-width:0;}
.cl-ws-placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:40px;text-align:center;}
.cl-ws-ph-icon{font-size:32px;opacity:.3;}.cl-ws-ph-title{font-size:14px;font-weight:700;color:var(--cl-t3);}
.cl-ws-ph-sub{font-size:12px;color:#c0c7d6;max-width:260px;line-height:1.6;}

/* ── CLAUSE STACK */
.cl-stack-wrap{padding:20px 24px;}
.cl-stack-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--cl-border-lt);}
.cl-stack-breadcrumb{display:flex;flex-direction:column;gap:4px;}
.cl-stack-chapter-row{display:flex;align-items:center;gap:8px;}
.cl-stack-ch-num{font-size:10px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.08em;background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 8px;border-radius:4px;}
.cl-stack-ch-title{font-size:13px;font-weight:700;color:var(--cl-t1);}
.cl-stack-sec-row{display:flex;align-items:center;gap:5px;}
.cl-stack-sec-icon{font-size:11px;color:var(--cl-t3);}
.cl-stack-sec-label{font-size:12px;color:var(--cl-t2);font-weight:500;}
.cl-stack-count{font-size:11px;color:var(--cl-t3);background:var(--cl-border-lt);border:1px solid var(--cl-border);padding:3px 10px;border-radius:10px;flex-shrink:0;white-space:nowrap;}
.cl-stack-list{display:flex;flex-direction:column;gap:8px;}
.cl-stack-empty{padding:24px;text-align:center;font-size:13px;color:var(--cl-t3);background:var(--cl-nav-bg);border-radius:var(--cl-r-md);border:1px dashed var(--cl-border);}

/* clause card */
.cl-clause-card{width:100%;text-align:left;background:var(--cl-card);border:1.5px solid var(--cl-border);border-radius:var(--cl-r-md);padding:13px 15px;cursor:pointer;font-family:inherit;transition:all .14s;display:flex;flex-direction:column;gap:7px;box-shadow:var(--cl-sh);}
.cl-clause-card:hover{border-color:var(--cl-blue);background:var(--cl-blue-lt);box-shadow:0 2px 8px rgba(13,127,165,.12);}
.cl-clause-card-active{border-color:var(--cl-blue)!important;background:var(--cl-blue-lt)!important;}
.cl-card-top-row{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.cl-card-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:2px 8px;border-radius:4px;}
.cl-card-badges{display:flex;align-items:center;gap:5px;}
.cl-card-risk{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;}
.cl-risk-high{background:var(--cl-red-lt);color:var(--cl-red);}
.cl-risk-medium{background:var(--cl-amber-lt);color:var(--cl-amber);}
.cl-risk-low{background:var(--cl-green-lt);color:var(--cl-green);}
.cl-card-dept{font-size:10px;font-weight:600;color:var(--cl-t2);background:#f0f1f4;border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px;}
.cl-card-text{font-size:12.5px;color:var(--cl-t2);line-height:1.55;text-align:left;}

/* ── CLAUSE DETAIL */
.cl-ws-inner{padding:24px 28px;display:flex;flex-direction:column;gap:18px;}
.cl-ws-back{align-self:flex-start;padding:5px 12px;background:var(--cl-nav-bg);border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;transition:all .12s;}
.cl-ws-back:hover{background:var(--cl-hover);color:var(--cl-t1);}

/* clause card block */
.cl-ws-clause-card{background:var(--cl-card);border:1.5px solid var(--cl-border);border-radius:var(--cl-r-lg);overflow:hidden;box-shadow:var(--cl-sh);}
.cl-wc-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 18px 10px;background:var(--cl-nav-bg);border-bottom:1px solid var(--cl-border-lt);}
.cl-wc-header-left{display:flex;flex-direction:column;gap:7px;}
.cl-wc-header-right{display:flex;align-items:center;gap:7px;flex-shrink:0;}
.cl-wc-breadcrumb{display:flex;align-items:center;gap:6px;}
.cl-wc-ch{font-size:11px;color:var(--cl-t3);}.cl-wc-sep{color:var(--cl-border-lt);}
.cl-wc-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);}
.cl-wc-badges{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.cl-wc-badge{padding:3px 10px;border-radius:4px;font-size:10px;font-weight:700;border:1px solid;}
.cl-wc-risk-high{background:var(--cl-red-lt);border-color:#f5b8b8;color:var(--cl-red);}
.cl-wc-risk-medium{background:var(--cl-amber-lt);border-color:#fcd34d;color:var(--cl-amber);}
.cl-wc-risk-low{background:var(--cl-green-lt);border-color:#6ee7b7;color:var(--cl-green);}
.cl-wc-dept{background:#eef1fd;border-color:#c5cff8;color:var(--cl-purple);}
.cl-wc-page-chip{padding:3px 9px;background:#fff;border:1.5px solid var(--cl-border);border-radius:10px;font-family:inherit;font-size:10px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .12s;display:inline-block;}
.cl-wc-page-chip:hover{border-color:var(--cl-blue);color:var(--cl-blue);background:var(--cl-blue-lt);}
.cl-wc-info-btn{width:28px;height:28px;border-radius:50%;background:var(--cl-nav-bg);border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;flex-shrink:0;}
.cl-wc-info-btn:hover,.cl-wc-info-btn-active{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}
.cl-wc-regen-btn{padding:5px 12px;background:#fff;border:1.5px solid var(--cl-purple);border-radius:20px;font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-purple);cursor:pointer;transition:all .13s;white-space:nowrap;}
.cl-wc-regen-btn:hover{background:var(--cl-purple-lt);}

/* clause text — 10-line clamp */
.cl-wc-text{font-size:13.5px;font-weight:500;color:var(--cl-t1);line-height:1.75;padding:14px 18px 4px;}
.cl-txt-clamped{display:-webkit-box;-webkit-line-clamp:10;-webkit-box-orient:vertical;overflow:hidden;}
.cl-view-more-btn{margin:0 18px 10px;background:none;border:none;padding:0;font-family:inherit;font-size:12px;font-weight:700;color:var(--cl-blue);cursor:pointer;display:block;}
.cl-view-more-btn:hover{text-decoration:underline;}

/* metadata table (toggled by ⓘ) */
.cl-meta-table-wrap{margin:0 18px 14px;border:1px solid var(--cl-border-lt);border-radius:var(--cl-r-sm);overflow:hidden;animation:fadeIn .15s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.cl-meta-table-inner{display:grid;grid-template-columns:1fr 1fr 1fr;}
.cl-meta-row{padding:8px 12px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt);display:flex;flex-direction:column;gap:2px;background:#fbfcfd;}
.cl-meta-row:nth-child(3n){border-right:none;}
.cl-meta-row:nth-last-child(-n+3){border-bottom:none;}
.cl-meta-label{font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;}
.cl-meta-value{font-size:11.5px;font-weight:600;color:var(--cl-t1);}

/* ── OBLIGATIONS SECTION */
.cl-section-block{display:flex;flex-direction:column;gap:8px;}
.cl-section-head{display:flex;align-items:center;gap:8px;}
.cl-section-label{font-size:10px;font-weight:800;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.1em;}
.cl-oblig-list{display:flex;flex-direction:column;gap:0;border:1px solid var(--cl-border);border-radius:var(--cl-r-lg);overflow:hidden;box-shadow:var(--cl-sh);}

/* obligation item */
.cl-oblig-item{border-bottom:1px solid var(--cl-border-lt);background:var(--cl-card);}
.cl-oblig-item:last-child{border-bottom:none;}

/* obligation header / trigger */
.cl-oblig-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:13px 16px;cursor:pointer;background:var(--cl-card);transition:background .12s;user-select:none;}
.cl-oblig-header:hover{background:var(--cl-hover);}
.cl-oblig-header-left{display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;}
.cl-oblig-header-right{display:flex;align-items:center;gap:8px;flex-shrink:0;margin-top:2px;}
.cl-oblig-num{flex-shrink:0;width:24px;height:24px;background:var(--cl-purple);color:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
.cl-oblig-header-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;}
.cl-oblig-header-chips{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.cl-oblig-dept-chip{font-size:10px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:1px 8px;border-radius:10px;}
.cl-oblig-pg-chip{font-size:10px;font-weight:600;color:var(--cl-t3);background:#fff;border:1px solid var(--cl-border);padding:1px 8px;border-radius:10px;cursor:pointer;font-family:inherit;transition:all .12s;}
.cl-oblig-pg-chip:hover{border-color:var(--cl-blue);color:var(--cl-blue);}
.cl-oblig-preview{font-size:13px;font-weight:500;color:var(--cl-t1);line-height:1.55;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cl-oblig-arrow{color:var(--cl-t3);display:flex;align-items:center;transition:transform .2s;}
.cl-oblig-arrow.rotated{transform:rotate(180deg);}
.cl-oblig-edit-btn{width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-border);font-size:11px;color:var(--cl-t3);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .12s;}
.cl-oblig-edit-btn:hover{background:var(--cl-blue-lt);color:var(--cl-blue);border-color:var(--cl-blue);}

/* inline edit */
.cl-oblig-edit-ta{width:100%;min-height:80px;padding:10px 16px;background:#fffbeb;border:none;border-top:1px solid #fcd34d;font-family:inherit;font-size:13px;color:var(--cl-t1);outline:none;resize:vertical;display:block;}
.cl-oblig-editbar{display:flex;justify-content:flex-end;gap:8px;padding:8px 14px;background:#fefce8;border-top:1px solid #fcd34d;}
.cl-oblig-edit-cancel{padding:5px 12px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;}
.cl-oblig-edit-save{padding:5px 12px;background:var(--cl-t1);border:none;border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:#fff;cursor:pointer;}

/* obligation body */
.cl-oblig-body{display:none;border-top:1px solid var(--cl-border-lt);background:#fafbfd;}
.cl-oblig-body.open{display:block;}

/* obligation mini metadata strip */
.cl-oblig-meta-strip{display:flex;gap:0;border-bottom:1px solid var(--cl-border-lt);}
.cl-oblig-meta-field{flex:1;padding:9px 12px;border-right:1px solid var(--cl-border-lt);display:flex;flex-direction:column;gap:2px;}
.cl-oblig-meta-field:last-child{border-right:none;}
.cl-omf-label{font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;}
.cl-omf-value{font-size:11.5px;font-weight:600;color:var(--cl-t1);}

/* obligation full text */
.cl-oblig-full-text{font-size:13px;color:var(--cl-t2);line-height:1.7;padding:12px 16px;border-bottom:1px solid var(--cl-border-lt);}

/* obligation button row */
.cl-oblig-btn-row{display:flex;align-items:center;gap:8px;padding:10px 16px;flex-wrap:wrap;}
.cl-oblig-regen-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#fff;border:1.5px solid var(--cl-purple);border-radius:20px;font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-purple);cursor:pointer;transition:all .13s;}
.cl-oblig-regen-btn:hover{background:var(--cl-purple-lt);}
.cl-ev-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#fff;border:1.5px solid var(--cl-border);border-radius:20px;font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;transition:all .13s;margin-left:auto;}
.cl-ev-btn:hover{border-color:var(--cl-purple);color:var(--cl-purple);background:var(--cl-purple-lt);}

/* ── ACTIONS */
.cl-actions-wrap{padding:10px 16px 14px;}
.cl-actions-title{display:flex;align-items:center;gap:7px;margin-bottom:10px;font-size:10px;font-weight:800;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
.cl-actions-badge{min-width:18px;height:18px;padding:0 5px;background:var(--cl-border-lt);color:var(--cl-t2);border-radius:10px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;}
.cl-actions-list{display:flex;flex-direction:column;gap:6px;}
.cl-action-item{border:1px solid var(--cl-border-lt);border-radius:var(--cl-r-sm);overflow:hidden;background:#fff;}
.cl-action-main-row{display:flex;align-items:flex-start;gap:9px;padding:9px 12px;}
.cl-action-num{flex-shrink:0;width:20px;height:20px;background:var(--cl-blue-lt);color:var(--cl-blue);border:1px solid var(--cl-blue-mid);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
.cl-action-text{flex:1;font-size:12.5px;color:var(--cl-t1);line-height:1.55;}
.cl-action-info-btn{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;margin-top:1px;}
.cl-action-info-btn:hover,.cl-action-info-btn.active{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}
.cl-action-meta-panel{display:none;background:var(--cl-blue-lt);border-top:1px solid var(--cl-blue-mid);padding:10px 12px;}
.cl-action-meta-panel.open{display:block;animation:fadeIn .15s ease;}
.cl-action-meta-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;}
.cl-amp-field{padding:6px 10px;border-right:1px solid var(--cl-blue-mid);}
.cl-amp-field:last-child{border-right:none;}
.cl-amp-label{display:block;font-size:9px;font-weight:700;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;opacity:.7;}
.cl-amp-value{display:block;font-size:11px;font-weight:600;color:var(--cl-t1);}
.cl-no-actions{font-size:12px;color:var(--cl-t3);font-style:italic;padding:10px 16px;}

/* ── FOOTER */
.cl-footer{display:flex;gap:10px;align-items:center;}
.cl-foot-save{padding:10px 20px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #6ee7b7;background:var(--cl-card);color:var(--cl-green);display:inline-flex;align-items:center;gap:7px;transition:all .14s;}
.cl-foot-save:hover{background:var(--cl-green-lt);}

/* ── AI CONTEXT MODAL */
.cl-ctx-overlay{position:fixed;inset:0;background:rgba(20,25,40,.5);z-index:3000;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
.cl-ctx-overlay.cl-ctx-open{display:flex;}
.cl-ctx-box{background:#fff;border-radius:14px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);animation:popIn .22s ease;}
@keyframes popIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
.cl-ctx-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #edf0f5;background:#f8f9fb;}
.cl-ctx-title{font-size:14px;font-weight:700;color:var(--cl-t1);}
.cl-ctx-close{width:28px;height:28px;border-radius:50%;background:#e2e5eb;border:none;font-size:13px;color:var(--cl-t2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;}
.cl-ctx-close:hover{background:var(--cl-t1);color:#fff;}
.cl-ctx-body{padding:18px 20px;display:flex;flex-direction:column;gap:12px;}
.cl-ctx-for{font-size:11px;font-weight:700;color:var(--cl-t3);padding:4px 10px;background:#f0f1f4;border-radius:4px;display:inline-block;align-self:flex-start;}
.cl-ctx-chips{display:flex;flex-wrap:wrap;gap:6px;}
.cl-ctx-chip{padding:5px 12px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:20px;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;transition:all .13s;user-select:none;}
.cl-ctx-chip:hover{border-color:#a5b4fc;color:#4f46e5;background:#eef2ff;}
.cl-ctx-chip-active{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}
.cl-ctx-ta{width:100%;min-height:90px;padding:10px 12px;background:#f0f1f4;border:1.5px solid #dde0e6;border-radius:8px;font-family:inherit;font-size:13px;color:var(--cl-t1);line-height:1.6;resize:vertical;outline:none;}
.cl-ctx-ta:focus{border-color:var(--cl-t1);background:#fff;}
.cl-ctx-footer{display:flex;justify-content:flex-end;gap:10px;padding-top:8px;border-top:1px solid #f0f1f4;}
.cl-ctx-cancel{padding:9px 18px;background:#fff;border:1.5px solid #dde0e6;border-radius:8px;font-size:13px;font-weight:600;color:var(--cl-t2);cursor:pointer;font-family:inherit;}
.cl-ctx-go{padding:9px 18px;background:var(--cl-t1);border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;}
.cl-ctx-go:hover{background:#2a3248;}

/* ── MUI-STYLE FAB */
.cl-rel-fab{position:fixed;bottom:28px;right:28px;z-index:3500;display:inline-flex;align-items:center;gap:8px;padding:13px 20px;background:var(--cl-t1);color:#fff;border:none;border-radius:40px;font-family:var(--cl-font);font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(30,36,51,.30);transition:all .2s cubic-bezier(.34,1.56,.64,1);user-select:none;}
.cl-rel-fab:hover{background:#2a3248;box-shadow:0 8px 28px rgba(30,36,51,.40);transform:translateY(-2px);}
.cl-fab-label{letter-spacing:.01em;}
.cl-rel-fab.cl-fab-active{background:var(--cl-purple);box-shadow:0 6px 20px rgba(91,95,207,.40);}

/* ── RELATIONSHIP DIALOG */
.cl-rel-overlay{position:fixed;inset:0;background:rgba(15,20,35,.5);z-index:4000;display:none;align-items:flex-end;justify-content:flex-end;padding:28px;backdrop-filter:blur(3px);}
.cl-rel-overlay.cl-rel-open{display:flex;}
.cl-rel-dialog{background:#fff;border-radius:16px;width:100%;max-width:640px;max-height:78vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.25);animation:slideUp .25s cubic-bezier(.34,1.56,.64,1);}
@keyframes slideUp{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
.cl-rel-dhead{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #edf0f5;background:#f8f9fb;flex-shrink:0;}
.cl-rel-dhead-left{display:flex;align-items:center;gap:11px;}
.cl-rel-dhead-icon{width:36px;height:36px;background:var(--cl-purple-lt);border:1px solid #c5c8f5;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--cl-purple);}
.cl-rel-dhead-title{font-size:14px;font-weight:700;color:var(--cl-t1);}
.cl-rel-dhead-sub{font-size:11px;color:var(--cl-t3);margin-top:1px;}
.cl-rel-dclose{width:28px;height:28px;border-radius:50%;background:#e2e5eb;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t2);transition:all .12s;}
.cl-rel-dclose:hover{background:var(--cl-t1);color:#fff;}
.cl-rel-tabs{display:flex;border-bottom:1px solid #edf0f5;padding:0 20px;flex-shrink:0;overflow-x:auto;}
.cl-rel-tab{padding:10px 13px;background:none;border:none;border-bottom:2px solid transparent;font-family:inherit;font-size:12px;font-weight:600;color:var(--cl-t3);cursor:pointer;white-space:nowrap;transition:all .13s;margin-bottom:-1px;}
.cl-rel-tab:hover{color:var(--cl-t1);}
.cl-rel-tab.active{color:var(--cl-purple);border-bottom-color:var(--cl-purple);}
.cl-rel-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px;}
.cl-rel-tab-desc{font-size:12px;color:var(--cl-t3);padding:8px 12px;background:#f8f9fb;border-radius:6px;border:1px solid #edf0f5;line-height:1.6;}
.cl-rel-items{display:flex;flex-direction:column;gap:8px;}
.cl-rel-item{border:1px solid var(--cl-border);border-radius:var(--cl-r-md);overflow:hidden;transition:border-color .13s;}
.cl-rel-item:hover{border-color:#a5b4fc;}
.cl-ri-exp{border-color:var(--cl-purple);box-shadow:0 2px 10px rgba(91,95,207,.12);}
.cl-rel-item-main{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 15px;cursor:pointer;background:#fafbfc;transition:background .12s;gap:10px;}
.cl-rel-item-main:hover{background:var(--cl-hover);}
.cl-rel-item-left{display:flex;flex-direction:column;gap:5px;flex:1;min-width:0;}
.cl-rel-item-top-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.cl-ri-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 8px;border-radius:4px;}
.cl-ri-type{font-size:10px;font-weight:700;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:2px 8px;border-radius:10px;}
.cl-ri-status{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;}
.cl-rs-active{background:#dcfce7;color:#15803d;}.cl-rs-super{background:#fef3c7;color:#b45309;}.cl-rs-other{background:#f1f5f9;color:#64748b;}
.cl-ri-title{font-size:13px;font-weight:600;color:var(--cl-t1);line-height:1.4;}
.cl-ri-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.cl-ri-reg,.cl-ri-date{font-size:11px;color:var(--cl-t2);}
.cl-ri-tag{font-size:9px;font-weight:700;padding:2px 7px;background:#f0f1f4;border:1px solid var(--cl-border);border-radius:10px;color:var(--cl-t2);}
.cl-ri-arrow{color:var(--cl-t3);display:flex;align-items:center;flex-shrink:0;margin-top:2px;transition:transform .2s;}
.cl-ri-exp .cl-ri-arrow{transform:rotate(180deg);}
.cl-rel-detail{display:none;border-top:1px solid #edf0f5;}
.cl-rel-detail.open{display:block;animation:fadeIn .18s ease;}
.cl-rel-detail-inner{padding:14px 16px;display:flex;flex-direction:column;gap:12px;}
.cl-rd-section{}
.cl-rd-sec-label{font-size:9.5px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
.cl-rd-hierarchy{font-size:12.5px;color:var(--cl-t2);line-height:1.65;background:#f8f9fb;padding:9px 12px;border-radius:6px;border-left:3px solid var(--cl-purple);}
.cl-rd-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--cl-border-lt);border-radius:6px;overflow:hidden;}
.cl-rd-field{padding:8px 10px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt);background:#fbfcfd;}
.cl-rd-field:nth-child(3n){border-right:none;}.cl-rd-field:nth-last-child(-n+3){border-bottom:none;}
.cl-rd-label{display:block;font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
.cl-rd-value{display:block;font-size:11.5px;font-weight:600;color:var(--cl-t1);}
.cl-rd-links{display:flex;flex-wrap:wrap;gap:7px;}
.cl-rd-link{padding:6px 13px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11.5px;font-weight:600;color:var(--cl-t2);cursor:pointer;text-decoration:none;transition:all .13s;display:inline-flex;align-items:center;gap:5px;}
.cl-rd-link:hover{border-color:var(--cl-blue);color:var(--cl-blue);background:var(--cl-blue-lt);}
.cl-rd-link-pri{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}.cl-rd-link-pri:hover{background:#2a3248;color:#fff;}

/* ── EVIDENCE MODAL */
.cl-modal-overlay{position:fixed;inset:0;background:rgba(20,25,40,.45);z-index:5000;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;backdrop-filter:blur(2px);}
.cl-modal-ev{background:var(--cl-card);border-radius:var(--cl-r-lg);width:100%;max-width:820px;max-height:86vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:var(--cl-sh-md),0 0 0 1px var(--cl-border);font-family:inherit;}
.cl-modal-head{padding:14px 20px;border-bottom:1px solid var(--cl-border-lt);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
.cl-modal-head-left{flex:1;min-width:0;display:flex;align-items:center;gap:10px;}
.cl-modal-clause-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 9px;border-radius:4px;flex-shrink:0;}
.cl-modal-oblig-short{font-size:12px;color:var(--cl-t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-modal-close{background:none;border:none;cursor:pointer;font-size:18px;color:var(--cl-t3);padding:2px 6px;flex-shrink:0;}
.cl-modal-close:hover{color:var(--cl-t1);}
.cl-ev-summary{display:flex;align-items:center;gap:8px;padding:10px 20px;background:var(--cl-nav-bg);border-bottom:1px solid var(--cl-border-lt);flex-shrink:0;flex-wrap:wrap;}
.cl-ev-pill{font-size:11px;font-weight:600;color:var(--cl-t2);background:var(--cl-card);border:1px solid var(--cl-border);padding:3px 11px;border-radius:20px;}
.cl-ev-pill-req{color:var(--cl-red);background:var(--cl-red-lt);border-color:#f5b8b8;}
.cl-ev-pill-rec{color:var(--cl-amber);background:var(--cl-amber-lt);border-color:#fcd34d;}
.cl-ev-pill-saved{color:var(--cl-green);background:var(--cl-green-lt);border-color:#6ee7b7;}
.cl-ev-table-wrap{flex:1;overflow-y:auto;}
.cl-ev-table{width:100%;border-collapse:collapse;table-layout:fixed;}
.cl-ev-th-num{width:36px;}.cl-ev-th-st{width:110px;}.cl-ev-th-sv{width:70px;}
.cl-ev-th{padding:10px 14px;background:#f0f4f8;border-bottom:2px solid var(--cl-border);font-size:10px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.07em;text-align:left;position:sticky;top:0;z-index:1;}
.cl-ev-tr{border-bottom:1px solid var(--cl-border-lt);transition:background .13s;}
.cl-ev-tr:hover{background:#f8fafc;}
.cl-ev-tr-saved{background:var(--cl-green-lt)!important;}
.cl-ev-td{padding:12px 14px;vertical-align:top;font-size:12.5px;color:var(--cl-t1);line-height:1.55;}
.cl-ev-td-num{text-align:center;font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-t3);vertical-align:middle;}
.cl-ev-td-st,.cl-ev-td-sv{vertical-align:middle;text-align:center;}
.cl-ev-doc-name{font-size:12.5px;font-weight:700;margin-bottom:2px;}
.cl-ev-doc-sub{font-size:10.5px;color:var(--cl-t3);margin-bottom:4px;}
.cl-ev-doc-needed{font-size:11.5px;color:var(--cl-t2);line-height:1.55;}
.cl-ev-badge{display:inline-block;font-size:9px;font-weight:700;padding:3px 9px;border-radius:4px;white-space:nowrap;}
.cl-ev-badge-req{background:var(--cl-red-lt);color:var(--cl-red);}
.cl-ev-badge-rec{background:var(--cl-amber-lt);color:var(--cl-amber);}
.cl-ev-save-btn{padding:5px 11px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:6px;font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .13s;white-space:nowrap;}
.cl-ev-save-btn:hover{border-color:var(--cl-green);color:var(--cl-green);background:var(--cl-green-lt);}
.cl-ev-saved{background:var(--cl-green-lt)!important;border-color:#6ee7b7!important;color:var(--cl-green)!important;cursor:default!important;}
.cl-modal-foot{padding:11px 20px;border-top:1px solid var(--cl-border-lt);background:var(--cl-nav-bg);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
.cl-modal-foot-note{font-size:11px;color:var(--cl-t3);flex:1;line-height:1.5;}
.cl-modal-btn{padding:7px 16px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .13s;}
.cl-modal-btn-sec{background:var(--cl-card);border:1.5px solid var(--cl-border);color:var(--cl-t1);}.cl-modal-btn-sec:hover{background:var(--cl-hover);}
.cl-modal-btn-pri{background:var(--cl-t1);border:none;color:#fff;}.cl-modal-btn-pri:hover{background:#2a3248;}

/* loading */
.ai-loading{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 20px;}
.ai-loading-text{font-size:13px;color:#9499aa;font-family:var(--cl-font);}
.spinner{width:28px;height:28px;border:3px solid #eef0f3;border-top-color:#1a1a2e;border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
  `;
  document.head.appendChild(s);
}