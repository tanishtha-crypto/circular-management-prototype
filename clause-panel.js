// // ===============================================================
// //    clause-panel-v2.js  —  Clause Breakdown Panel (v2)
// //    All changes applied:
// //    - Left nav: "Chapter 1" label shown above sections
// //    - Right stack: Chapter title + Section name header, only Risk + Dept badges
// //    - Clause text: 10-line clamp, Show more/less
// //    - No Edit button on top; Page No chip simple; ⓘ icon toggles metadata table
// //    - Obligations: clean formatted accordion, proper layout
// //    - Actions: ⓘ icon per action shows 5 params inline
// //    - Relationship dialog: MUI-style FAB at bottom-right
// // ================================================================ */

// /* ──────────────────────────────────────────── BUILD */

// function buildClausePanel() {
//   injectSharedCSS();
//   injectClauseCSS();
//   _clInjectRelFAB();
//   return `
//   <div class="cl-wrap">
//     <div id="cl-empty" class="cl-empty-state" style="display:none;">
//       <div class="cl-empty-icon">📄</div>
//       <div class="cl-empty-title">No Circular Selected</div>
//       <div class="cl-empty-sub">Go to Overview and confirm a circular first.</div>
//       <button class="cl-empty-cta" onclick="document.querySelector('[data-tab=\\'overview\\']')?.click()">← Go to Overview</button>
//     </div>
//     <div id="cl-main" style="display:none;">
//       <div class="cl-topbar">
//         <div class="cl-topbar-left">
//           <span class="cl-circ-id-chip" id="cl-circ-id-chip">—</span>
//           <span class="cl-circ-name-chip" id="cl-circ-name-chip">—</span>
//         </div>
//         <div class="cl-topbar-right">
//           <select class="cl-filter-select" id="cl-filter-dept"><option value="">All Departments</option><option>Compliance</option><option>Risk</option><option>Operations</option><option>Legal</option><option>IT</option><option>HR</option></select>
//           <select class="cl-filter-select" id="cl-filter-risk"><option value="">All Risk Levels</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select>
//           <div class="cl-level-toggle">
//             <button class="cl-lvl-btn active" data-level="2">L2</button>
//             <button class="cl-lvl-btn" data-level="3">L3</button>
//           </div>
//           <button class="cl-topbar-btn cl-btn-generate" id="cl-btn-generate">◈ Generate</button>
//            <button class="sum-foot-btn sum-foot-save" id="sum-btn-save">🔖 &nbsp;Save </button>
          
//         </div>
//       </div>
//       <div class="cl-split" id="cl-split" style="display:none;">
//         <!-- LEFT NAV: Chapter → Section → Sub-section only -->
//         <div class="cl-nav" id="cl-nav">
//           <div class="cl-nav-head">
//             <span class="cl-nav-title">Structure</span>
//             <span class="cl-nav-count" id="cl-nav-count">—</span>
//           </div>
//           <div class="cl-nav-tree" id="cl-nav-tree">
//             <div class="cl-nav-placeholder">Generate to view structure</div>
//           </div>
//         </div>
//         <!-- RIGHT WORKSPACE -->
//         <div class="cl-workspace" id="cl-workspace">
//           <div class="cl-ws-placeholder" id="cl-ws-ph">
//             <div class="cl-ws-ph-icon">📋</div>
//             <div class="cl-ws-ph-title">Select a section</div>
//             <div class="cl-ws-ph-sub">Click any section in the left panel to see its clauses</div>
//           </div>
//           <div id="cl-ws-stack" style="display:none;"></div>
//           <div id="cl-ws-content" style="display:none;"></div>
//         </div>
//       </div>
//       <div class="cl-footer" id="cl-footer" style="display:none;">
//         <button class="cl-foot-save" id="cl-foot-save">🔖 &nbsp;Save Clauses</button>
//       </div>
//     </div>
//   </div>`;
// }

// /* ──────────────────────────────────────────── INIT */
// function initClauseListeners() {
//   injectSharedCSS();
//   injectClauseCSS();
//   _clInjectRelFAB();

//   const circId = AI_LIFECYCLE_STATE.selectedCircularId;
//   const circ = circId ? (CMS_DATA?.circulars || []).find(x => x.id === circId) : null;

//   if (!circ) {
//     document.getElementById('cl-empty').style.display = 'flex';
//     document.getElementById('cl-main').style.display = 'none';
//     return;
//   }
//   document.getElementById('cl-empty').style.display = 'none';
//   document.getElementById('cl-main').style.display = 'block';
//   document.getElementById('cl-circ-id-chip').textContent = circ.id;
//   document.getElementById('cl-circ-name-chip').textContent = circ.title;
//   window._CL_ACTIVE_CIRC = circ;

//   document.querySelectorAll('.cl-lvl-btn').forEach(b => {
//     b.addEventListener('click', () => {
//       document.querySelectorAll('.cl-lvl-btn').forEach(x => x.classList.remove('active'));
//       b.classList.add('active');
//       if (window._CL_ACTIVE_CLAUSE)
//         _clShowClause(window._CL_ACTIVE_CIRC_REF, window._CL_ACTIVE_CH_REF, window._CL_ACTIVE_CLAUSE);
//     });
//   });

//   ['cl-filter-dept', 'cl-filter-risk'].forEach(id => {
//     document.getElementById(id)?.addEventListener('change', () => {
//       if (window._CL_ACTIVE_SECTION_CLAUSES)
//         _clShowClauseStack(window._CL_ACTIVE_CIRC, window._CL_ACTIVE_CH_REF, window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_SECTION_LABEL);
//     });
//   });

//   document.getElementById('cl-btn-generate')?.addEventListener('click', () => _clRunGenerate(circ));
//   document.getElementById('cl-btn-regen')?.addEventListener('click', function () {
//     this.textContent = '↺ …'; this.disabled = true;
//     setTimeout(() => { _clBuildTree(circ); this.textContent = '↺ Regenerate'; this.disabled = false; showToast('Regenerated.', 'success'); }, 1400);
//   });
//   document.getElementById('cl-foot-save')?.addEventListener('click', function () {
//     this.textContent = '✓ Saved'; this.disabled = true; showToast('Saved to library.', 'success');
//   });
// }

// /* ──────────────────────────────────────────── GENERATE */
// function _clRunGenerate(circ) {
//   document.getElementById('cl-nav-tree').innerHTML = `<div class="cl-nav-loading">${loadingHTML('Building structure…')}</div>`;
//   _clResetWorkspace();
//   setTimeout(() => {
//     document.getElementById('cl-split').style.display = 'grid';
//     _clBuildTree(circ);
//     document.getElementById('cl-btn-regen').style.display = 'inline-flex';
//     const f = document.getElementById('cl-footer');
//     f.style.display = 'flex'; f.style.opacity = '0'; f.style.transition = 'opacity .3s';
//     requestAnimationFrame(() => requestAnimationFrame(() => { f.style.opacity = '1'; }));
//   }, 1600);
// }

// function _clResetWorkspace() {
//   document.getElementById('cl-ws-ph').style.display = 'flex';
//   const s = document.getElementById('cl-ws-stack'), c = document.getElementById('cl-ws-content');
//   s.style.display = 'none'; s.innerHTML = '';
//   c.style.display = 'none'; c.innerHTML = '';
//   window._CL_ACTIVE_CLAUSE = null;
// }

// /* ──────────────────────────────────────────── LEFT NAV TREE
//    Shows: Chapter 1 label → Section → Sub-section (NO clauses)
// */
// function _clBuildTree(circ) {
//   const navTree = document.getElementById('cl-nav-tree');
//   const navCount = document.getElementById('cl-nav-count');
//   let total = 0;
//   (circ.chapters || []).forEach(ch => { total += (ch.clauses || []).length; });
//   if (navCount) navCount.textContent = `${total} clauses`;

//   navTree.innerHTML = (circ.chapters || []).map((ch, ci) => {
//     const chLabel = `Chapter ${ci + 1}`;
//     const hasSec = ch.sections?.length > 0;
//     let inner = '';

//     if (hasSec) {
//       ch.sections.forEach((sec, si) => {
//         const secKey = `${ci}-${si}`;
//         const hasSub = sec.subSections?.length > 0;
//         if (hasSub) {
//           const subHtml = sec.subSections.map((sub, ssi) => {
//             const subKey = `${ci}-${si}-${ssi}`;
//             const subClauses = (sub.clauses || []).map(id => (ch.clauses || []).find(c => c.id === id)).filter(Boolean);
//             const subLabel = `${sub.id ? sub.id + ' – ' : ''}${(sub.text || 'Sub-section').substring(0, 34)}${(sub.text || '').length > 34 ? '…' : ''}`;
//             return `<button class="cl-nav-subsec-btn" data-key="${subKey}"
//               onclick="clNavSelect(event,${ci},${si},'${subKey}','${chLabel}','${subLabel.replace(/'/g, "\\'")}')">
//               <span class="cl-nav-subsec-icon">¶</span>
//               <span class="cl-nav-subsec-label">${subLabel}</span>
//               <span class="cl-nav-subsec-count">${subClauses.length}</span>
//             </button>`;
//           }).join('');
//           const secLabel = `${sec.id ? sec.id + ' – ' : ''}${(sec.text || 'Section').substring(0, 32)}${(sec.text || '').length > 32 ? '…' : ''}`;
//           inner += `<div class="cl-nav-sec-group">
//             <button class="cl-nav-sec-btn cl-nav-sec-has-sub" data-sec="${secKey}">
//               <span class="cl-nav-sec-icon">§</span>
//               <span class="cl-nav-sec-label">${secLabel}</span>
//               <span class="cl-nav-sec-arrow">▾</span>
//             </button>
//             <div class="cl-nav-sec-body" id="cl-sec-body-${secKey}">${subHtml}</div>
//           </div>`;
//         } else {
//           const secLabel = `${sec.id ? sec.id + ' – ' : ''}${(sec.text || 'Section').substring(0, 32)}${(sec.text || '').length > 32 ? '…' : ''}`;
//           const secClauses = (sec.clauses || []).map(id => (ch.clauses || []).find(c => c.id === id)).filter(Boolean);
//           const cnt = secClauses.length || (ch.clauses || []).length;
//           inner += `<div class="cl-nav-sec-group">
//             <button class="cl-nav-sec-btn" data-sec="${secKey}"
//               onclick="clNavSelect(event,${ci},${si},'${secKey}','${chLabel}','${secLabel.replace(/'/g, "\\'")}')">
//               <span class="cl-nav-sec-icon">§</span>
//               <span class="cl-nav-sec-label">${secLabel}</span>
//               <span class="cl-nav-sec-count">${cnt}</span>
//               <span class="cl-nav-sec-arrow">▸</span>
//             </button>
//           </div>`;
//         }
//       });
//     } else {
//       inner = `<button class="cl-nav-all-btn" onclick="clNavSelectChapter(event,${ci},'${chLabel}')">
//         View all ${(ch.clauses || []).length} clauses →
//       </button>`;
//     }

//     return `<div class="cl-nav-chapter">
//       <button class="cl-nav-ch-btn" data-ci="${ci}">
//         <span class="cl-nav-ch-arrow">▶</span>
//         <div class="cl-nav-ch-info">
//           <span class="cl-nav-ch-num">${chLabel}</span>
//           <span class="cl-nav-ch-label">${ch.title || ''}</span>
//         </div>
//         <span class="cl-nav-ch-count">${(ch.clauses || []).length}</span>
//       </button>
//       <div class="cl-nav-ch-body" id="cl-ch-body-${ci}">${inner}</div>
//     </div>`;
//   }).join('');

//   /* Chapter collapse */
//   navTree.querySelectorAll('.cl-nav-ch-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const body = document.getElementById(`cl-ch-body-${btn.dataset.ci}`);
//       const arr = btn.querySelector('.cl-nav-ch-arrow');
//       const open = body?.classList.contains('open');
//       body?.classList.toggle('open', !open);
//       if (arr) arr.textContent = open ? '▶' : '▼';
//     });
//   });
//   /* Section-with-sub collapse */
//   navTree.querySelectorAll('.cl-nav-sec-has-sub').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const body = document.getElementById(`cl-sec-body-${btn.dataset.sec}`);
//       const arr = btn.querySelector('.cl-nav-sec-arrow');
//       const open = body?.classList.contains('open');
//       body?.classList.toggle('open', !open);
//       if (arr) arr.textContent = open ? '▴' : '▾';
//     });
//   });
// }

// window.clNavSelect = function (e, chIdx, secIdx, key, chLabel, secLabel) {
//   e.stopPropagation();
//   const circ = window._CL_ACTIVE_CIRC;
//   const ch = circ?.chapters?.[chIdx];
//   if (!ch) return;

//   document.querySelectorAll('.cl-nav-sec-btn,.cl-nav-subsec-btn')
//     .forEach(b => b.classList.remove('cl-nav-active'));
//   e.currentTarget.classList.add('cl-nav-active');

//   // Filter clauses belonging to this specific section only
//   const sec = ch.sections?.[secIdx];
//   const sectionClauseIds = sec?.clauses || [];
//   const clauses = sectionClauseIds
//     .map(id => (ch.clauses || []).find(c => c.id === id))
//     .filter(Boolean);

//   window._CL_ACTIVE_SECTION_CLAUSES = clauses;
//   window._CL_ACTIVE_CH_REF = ch;
//   window._CL_ACTIVE_SECTION_LABEL = { chLabel, secLabel };
//   _clShowClauseStack(circ, ch, clauses, { chLabel, secLabel });
// };
// window.clNavSelectChapter = function (e, chIdx, chLabel) {
//   e.stopPropagation();
//   const circ = window._CL_ACTIVE_CIRC; const ch = circ?.chapters?.[chIdx]; if (!ch) return;
//   window._CL_ACTIVE_SECTION_CLAUSES = ch.clauses || [];
//   window._CL_ACTIVE_CH_REF = ch;
//   window._CL_ACTIVE_SECTION_LABEL = { chLabel, secLabel: 'All Clauses' };
//   _clShowClauseStack(circ, ch, ch.clauses || [], { chLabel, secLabel: 'All Clauses' });
// };

// /* ──────────────────────────────────────────── CLAUSE STACK (right panel)
//    Header: Chapter X title → Section name → list of clause cards
//    Cards: only Risk + Dept badges
// */
// function _clShowClauseStack(circ, ch, allClauses, labels) {
//   document.getElementById('cl-ws-ph').style.display = 'none';
//   const content = document.getElementById('cl-ws-content');
//   content.style.display = 'none'; content.innerHTML = '';
//   window._CL_ACTIVE_CLAUSE = null;

//   const dept = document.getElementById('cl-filter-dept')?.value || '';
//   const risk = document.getElementById('cl-filter-risk')?.value || '';
//   const filtered = allClauses.filter(cl => {
//     if (dept && cl.department !== dept) return false;
//     if (risk && cl.risk !== risk) return false;
//     return true;
//   });

//   const stack = document.getElementById('cl-ws-stack');
//   stack.style.display = 'block';
//   const chLabel = labels?.chLabel || 'Chapter';
//   const secLabel = labels?.secLabel || '';
//   const chTitle = ch.title || '';

//   stack.innerHTML = `
//   <div class="cl-stack-wrap">
//     <div class="cl-stack-header">
//       <div class="cl-stack-breadcrumb">
//         <div class="cl-stack-chapter-row">
//           <span class="cl-stack-ch-num">${chLabel}</span>
//           ${chTitle ? `<span class="cl-stack-ch-title">${chTitle}</span>` : ''}
//         </div>
//         ${secLabel ? `<div class="cl-stack-sec-row">
//           <span class="cl-stack-sec-icon">§</span>
//           <span class="cl-stack-sec-label">${secLabel}</span>
//         </div>` : ''}
//       </div>
//       <span class="cl-stack-count">${filtered.length} clause${filtered.length !== 1 ? 's' : ''}</span>
//     </div>
//     <div class="cl-stack-list">
//       ${filtered.length ? filtered.map(cl => `
//       <button class="cl-clause-card" id="cl-card-${cl.id}"
//         onclick="_clCardClick('${cl.id}',${(circ.chapters || []).indexOf(ch)})">
//         <div class="cl-card-top-row">
//           <span class="cl-card-id">${cl.id}</span>
//           <div class="cl-card-badges">
//             ${cl.risk ? `<span class="cl-card-risk cl-risk-${cl.risk.toLowerCase()}">${cl.risk}</span>` : ''}
//             ${cl.department ? `<span class="cl-card-dept">${cl.department}</span>` : ''}
//           </div>
//         </div>
//         <div class="cl-card-text">${(cl.text || '').substring(0, 100)}${(cl.text || '').length > 100 ? '…' : ''}</div>
//       </button>`).join('') : `<div class="cl-stack-empty">No clauses match the current filters.</div>`}
//     </div>
//   </div>`;

//   window._CL_STACK_CIRC = circ;
// }

// window._clCardClick = function (clauseId, chIdx) {
//   const circ = window._CL_STACK_CIRC || window._CL_ACTIVE_CIRC;
//   const ch = circ?.chapters?.[chIdx];
//   const cl = (ch?.clauses || []).find(c => c.id === clauseId);
//   if (!cl) return;
//   document.querySelectorAll('.cl-clause-card').forEach(c => c.classList.remove('cl-clause-card-active'));
//   document.getElementById(`cl-card-${clauseId}`)?.classList.add('cl-clause-card-active');
//   document.getElementById('cl-ws-stack').style.display = 'none';
//   window._CL_ACTIVE_CLAUSE = cl;
//   window._CL_ACTIVE_CIRC_REF = circ;
//   window._CL_ACTIVE_CH_REF = ch;
//   _clShowClause(circ, ch, cl);
// };

// /* ──────────────────────────────────────────── CLAUSE DETAIL VIEW */
// function _clShowClause(circ, ch, cl) {
//   document.getElementById('cl-ws-ph').style.display = 'none';
//   const content = document.getElementById('cl-ws-content');
//   content.style.display = 'block';

//   const level = parseInt(document.querySelector('.cl-lvl-btn.active')?.dataset.level || '2');
//   const meta = _clMockDetailMeta(0);
//   const textId = `cl-txt-${cl.id}`;
//   const metaId = `cl-meta-${cl.id}`;

//   content.innerHTML = `
//   <div class="cl-ws-inner">
//     <!-- BACK -->
//     <button class="cl-ws-back" onclick="_clBackToStack()">← Back to clauses</button>

//     <!-- CLAUSE HEADER — no edit button -->
//     <div class="cl-ws-clause-card">
//       <div class="cl-wc-header">
//         <div class="cl-wc-header-left">
//           <div class="cl-wc-breadcrumb">
//             <span class="cl-wc-ch">${`Chapter ${(window._CL_ACTIVE_CIRC?.chapters || []).indexOf(ch) + 1} : ${ch.title}` || 'Chapter'}</span>
//             <span class="cl-wc-sep" style="font-weight:800">›></span>
//             <span class="cl-wc-id">${cl.id}</span>
//             <span>  <span class="cl-wc-page-chip" onclick="clOpenDocPage(${cl.pageNo})">📄 ${cl.pageNo}</span></span>
//           </div>
//           <div class="cl-wc-badges">
//   ${cl.risk ? `<span class="cl-wc-badge cl-wc-risk-${cl.risk.toLowerCase()}">${cl.risk} Risk</span>` : ''}
//   ${cl.department ? `<span class="cl-wc-badge cl-wc-dept">${cl.department}</span>` : ''}
//    ${cl.pageNo ? `<span class="cl-wc-page-chip" onclick="clOpenDocPage(${cl.pageNo})">📄 Page 1 </span>` : ''}
// </div>
          
//         </div>
//         <div class="cl-wc-header-right">
//           <button class="cl-wc-info-btn" id="cl-info-btn-${cl.id}" onclick="_clToggleMeta('${metaId}','cl-info-btn-${cl.id}')" title="Show regulatory details">
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
//           </button>
//           <button class="cl-wc-regen-btn" onclick="_clOpenCtxModal('clause_${cl.id}','Clause')">✦ Add Business Context</button>
//         </div>
//       </div>

//       <!-- CLAUSE TEXT: 10-line clamp -->
//       <div class="cl-wc-text cl-txt-clamped" id="${textId}">${cl.text || ''}</div>
//       ${(cl.text || '').length > 200 ? `
//       <button class="cl-view-more-btn" id="cl-vmore-${cl.id}" onclick="_clToggleTxt('${cl.id}','${textId}')">Show more ▾</button>` : ''}

//       <!-- METADATA TABLE (hidden, toggled by ⓘ) -->
//       <div class="cl-meta-table-wrap" id="${metaId}" style="display:none;">
//         <div class="cl-meta-table-inner">
//           ${_clMetaFields(meta).map(f => `
//           <div class="cl-meta-row">
//             <span class="cl-meta-label">${f.label}</span>
//             <span class="cl-meta-value">${f.value}</span>
//           </div>`).join('')}
//         </div>
//       </div>
//     </div>

//     ${level >= 2 ? `
//     <!-- OBLIGATIONS -->
//     <div class="cl-section-block">
//       <div class="cl-section-head">
//         <span class="cl-section-label">Obligations</span>
//       </div>
//       <div class="cl-oblig-list" id="cl-oblig-list">${_clBuildObligations(cl, [], level)}</div>
//     </div>`: ''}
//   </div>`;

//   /* view more/less */
//   window._clToggleTxt = function (id, tid) {
//     const el = document.getElementById(tid), btn = document.getElementById(`cl-vmore-${id}`);
//     if (!el || !btn) return;
//     const c = el.classList.toggle('cl-txt-clamped');
//     btn.textContent = c ? 'Show more ▾' : 'Show less ▴';
//   };

//   /* meta table toggle */
//   window._clToggleMeta = function (metaId, btnId) {
//     const el = document.getElementById(metaId), btn = document.getElementById(btnId);
//     if (!el) return;
//     const visible = el.style.display !== 'none';
//     el.style.display = visible ? 'none' : 'block';
//     if (btn) btn.classList.toggle('cl-wc-info-btn-active', !visible);
//   };

//   /* obligation accordions */
//   content.querySelectorAll('.cl-oblig-item').forEach(item => {
//     const trigger = item.querySelector('.cl-oblig-header');
//     const body = item.querySelector('.cl-oblig-body');
//     const arrow = item.querySelector('.cl-oblig-arrow');
//     if (!trigger || !body) return;
//     trigger.addEventListener('click', () => {
//       const open = body.classList.contains('open');
//       /* close others */
//       content.querySelectorAll('.cl-oblig-body.open').forEach(b => b.classList.remove('open'));
//       content.querySelectorAll('.cl-oblig-arrow').forEach(a => a.classList.remove('rotated'));
//       if (!open) { body.classList.add('open'); arrow?.classList.add('rotated'); }
//     });
//   });

//   /* obligation inline edit */
//   content.querySelectorAll('.cl-oblig-edit-btn').forEach(btn => {
//     btn.addEventListener('click', e => {
//       e.stopPropagation();
//       const oi = btn.dataset.oi;
//       document.getElementById(`cl-oblig-view-${oi}`).style.display = 'none';
//       document.getElementById(`cl-oblig-edit-${oi}`).style.display = 'block';
//       document.getElementById(`cl-oblig-editbar-${oi}`).style.display = 'flex';
//       btn.style.display = 'none';
//       document.getElementById(`cl-oblig-edit-${oi}`).focus();
//     });
//   });
//   content.querySelectorAll('.cl-oblig-edit-cancel').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const oi = btn.dataset.oi;
//       document.getElementById(`cl-oblig-view-${oi}`).style.display = 'block';
//       document.getElementById(`cl-oblig-edit-${oi}`).style.display = 'none';
//       document.getElementById(`cl-oblig-editbar-${oi}`).style.display = 'none';
//       document.getElementById(`cl-oblig-editbtn-${oi}`).style.display = 'inline-flex';
//     });
//   });
//   content.querySelectorAll('.cl-oblig-edit-save').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const oi = btn.dataset.oi;
//       const ta = document.getElementById(`cl-oblig-edit-${oi}`);
//       const view = document.getElementById(`cl-oblig-view-${oi}`);
//       if (view && ta) view.textContent = ta.value;
//       view.style.display = 'block'; ta.style.display = 'none';
//       document.getElementById(`cl-oblig-editbar-${oi}`).style.display = 'none';
//       document.getElementById(`cl-oblig-editbtn-${oi}`).style.display = 'inline-flex';
//       showToast('Obligation updated.', 'success');
//     });
//   });

//   /* action ⓘ toggle */
//   content.querySelectorAll('.cl-action-info-btn').forEach(btn => {
//     btn.addEventListener('click', e => {
//       e.stopPropagation();
//       const panel = document.getElementById(btn.dataset.panel);
//       if (!panel) return;
//       const open = panel.classList.contains('open');
//       content.querySelectorAll('.cl-action-meta-panel.open').forEach(p => p.classList.remove('open'));
//       content.querySelectorAll('.cl-action-info-btn.active').forEach(b => b.classList.remove('active'));
//       if (!open) { panel.classList.add('open'); btn.classList.add('active'); }
//     });
//   });

//   /* evidence buttons */
//   content.querySelectorAll('.cl-ev-btn').forEach(btn => {
//     btn.addEventListener('click', function () {
//       try {
//         const acts = JSON.parse(atob(this.dataset.actions));
//         clShowEvidenceModal(this.dataset.clauseId, acts, this.dataset.obligation);
//       } catch (e) { showToast('Error.', 'error'); }
//     });
//   });
// }

// window._clBackToStack = function () {
//   document.getElementById('cl-ws-content').style.display = 'none';
//   document.getElementById('cl-ws-content').innerHTML = '';
//   document.getElementById('cl-ws-stack').style.display = 'block';
//   window._CL_ACTIVE_CLAUSE = null;
// };
// window.clOpenDocPage = function (p) {
//   const circ = window._CL_ACTIVE_CIRC;
//   const docUrl = circ?.docUrl || './RBI Master Circular.pdf';
//   window.open(`${docUrl}#page=${p || 1}`, '_blank');
// };
// /* ──────────────────────────────────────────── OBLIGATIONS
//    Clean formatted accordion — trigger row shows num + dept + page + text preview
//    Body: mini meta grid (5 fields) + regen + evidence + optional actions
// */
// function _clBuildObligations(cl, actions, level) {
//   const MOCK = [
//     { text: 'Litablish and maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.', dept: 'Compliance', pageNo: 4, actions: ['Draft or update the compliance policy to incorporate circular requirements', 'Present policy to Board for formal approval and record in minutes', 'Distribute updated policy to all relevant departments', 'Schedule annual review and assign policy owner'] },
//     { text: 'All relevant staff must complete mandatory training on the obligations under this circular within 60 days of the effective date.', dept: 'HR', pageNo: 6, actions: ['Identify all staff roles impacted by circular obligations', 'Design training module covering key compliance requirements', 'Track completion records and maintain in HR system', 'Conduct re-training annually or upon material amendment'] },
//     { text: 'The entity shall implement robust internal controls and conduct periodic testing to verify operational effectiveness.', dept: 'Risk', pageNo: 8, actions: ['Map all processes affected by this circular to control owners', 'Design control tests and document testing methodology', 'Execute quarterly control testing and record outcomes', 'Escalate control failures to senior management within 5 business days'] },
//     { text: 'A designated Compliance Officer must be appointed to oversee implementation and serve as the primary liaison with the regulator.', dept: 'Compliance', pageNo: 10, actions: ['Formally appoint or confirm Compliance Officer designation', 'Define responsibilities in the compliance officer mandate', 'Notify regulator of officer appointment with contact details', 'Ensure officer has adequate resources and independence'] },
//     { text: 'The entity shall report compliance status to the regulator in the prescribed format within the timelines specified in the circular.', dept: 'Compliance', pageNo: 12, actions: ['Identify all reporting obligations and their frequencies', 'Build reporting templates aligned to prescribed regulatory format', 'Establish data collection pipeline from source systems', 'Set automated alerts for upcoming reporting deadlines'] },
//     { text: 'Adequate IT systems and infrastructure shall be in place to support digital compliance, data security and full audit trail requirements.', dept: 'IT', pageNo: 15, actions: ['Conduct gap assessment of current IT systems', 'Implement required system controls and access restrictions', 'Enable full audit trail logging for all relevant transactions', 'Test system controls in UAT before go-live'] },
//   ];

//   const obligsRaw = cl.obligations || cl.obligation || null;
// const actionsRaw = cl.actionables || [];

// // obligations is now an array in JSON
// const obligsArray = Array.isArray(obligsRaw) ? obligsRaw
//   : typeof obligsRaw === 'string' ? [obligsRaw]
//   : null;

// const actionsArray = Array.isArray(actionsRaw) ? actionsRaw
//   : typeof actionsRaw === 'string' ? actionsRaw.split(';').map(a => a.trim()).filter(Boolean)
//   : [];

// const obligs = obligsArray
//   ? obligsArray.map((ob, i) => ({
//       text: typeof ob === 'string' ? ob : (ob.text || '—'),
//       dept: cl.department || 'Compliance',
//       pageNo: cl.pageNo || null,
//       actions: actionsArray
//     }))
//   : MOCK;
//   return obligs.map((ob, oi) => {
//     const m = _clObligMeta(oi);
//     const actList = ob.actions || [];
//     return `
//     <div class="cl-oblig-item" id="cl-oblig-${oi}">
//       <!-- TRIGGER ROW -->
//       <div class="cl-oblig-header">
//         <div class="cl-oblig-header-left">
//           <span class="cl-oblig-num">O${oi + 1}</span>
//           <div class="cl-oblig-header-info">
//             <div class="cl-oblig-header-chips">
//               ${ob.dept ? `<span class="cl-oblig-dept-chip">${ob.dept}</span>` : ''}
//               ${ob.pageNo ? `<button class="cl-oblig-pg-chip" onclick="event.stopPropagation();clOpenDocPage(${ob.pageNo})">📄 p.${ob.pageNo}</button>` : ''}
//             </div>
//             <p class="cl-oblig-preview" id="cl-oblig-view-${oi}">${ob.text}</p>
//           </div>
//         </div>
//         <div class="cl-oblig-header-right">
//           <button class="cl-oblig-edit-btn" id="cl-oblig-editbtn-${oi}" data-oi="${oi}" title="Edit">✎</button>
//           <span class="cl-oblig-arrow">
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
//           </span>
//         </div>
//       </div>

//       <!-- INLINE EDIT -->
//       <textarea class="cl-oblig-edit-ta" id="cl-oblig-edit-${oi}" style="display:none;">${ob.text}</textarea>
//       <div class="cl-oblig-editbar" id="cl-oblig-editbar-${oi}" style="display:none;">
//         <button class="cl-oblig-edit-cancel" data-oi="${oi}">Cancel</button>
//         <button class="cl-oblig-edit-save" data-oi="${oi}">Save</button>
//       </div>

//       <!-- BODY -->
//       <div class="cl-oblig-body" id="cl-oblig-body-${oi}">

//         <!-- MINI METADATA: 5 fields in a clean row -->
//         <div class="cl-oblig-meta-strip">
//           <div class="cl-oblig-meta-field">
//             <span class="cl-omf-label">Due Date</span>
//             <span class="cl-omf-value">${m.dueDate}</span>
//           </div>
//           <div class="cl-oblig-meta-field">
//             <span class="cl-omf-label">Section</span>
//             <span class="cl-omf-value">${m.section}</span>
//           </div>
//           <div class="cl-oblig-meta-field">
//             <span class="cl-omf-label">Sub-section</span>
//             <span class="cl-omf-value">${m.subset}</span>
//           </div>
//           <div class="cl-oblig-meta-field">
//             <span class="cl-omf-label">Category</span>
//             <span class="cl-omf-value">${m.category}</span>
//           </div>
//           <div class="cl-oblig-meta-field">
//             <span class="cl-omf-label">Frequency</span>
//             <span class="cl-omf-value">${m.frequency}</span>
//           </div>
//         </div>

//         <!-- FULL OBLIGATION TEXT -->
//         <div class="cl-oblig-full-text">${ob.text}</div>

//         <!-- ACTION ROW: regen + evidence -->
//         <div class="cl-oblig-btn-row">
//           <button class="cl-oblig-regen-btn" onclick="_clOpenCtxModal('oblig_${oi}','Obligation ${oi + 1}')">✦ Regenerate with AI Context</button>
//           <button class="cl-ev-btn"
//             data-clause-id="${cl.id}"
//             data-actions="${btoa(JSON.stringify(actList))}"
//             data-obligation="${ob.text.substring(0, 120)}">🔍 AI Evidence</button>
//         </div>

//         ${level >= 3 && actList.length ? `
//         <!-- ACTIONS: each with ⓘ icon -->
//         <div class="cl-actions-wrap">
//           <div class="cl-actions-title">
//             <span>Actions</span>
//             <span class="cl-actions-badge">${actList.length}</span>
//           </div>
//           <div class="cl-actions-list">
//             ${actList.map((a, ai) => {
//       const m2 = _clObligMeta(ai);
//       const panelId = `cl-act-meta-${oi}-${ai}`;
//       return `
//               <div class="cl-action-item">
//                 <div class="cl-action-main-row">
//                   <span class="cl-action-num">${ai + 1}</span>
//                   <span class="cl-action-text">${a}</span>
//                   <button class="cl-action-info-btn" data-panel="${panelId}" title="Show parameters">
//                     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
//                   </button>
//                 </div>
//                 <div class="cl-action-meta-panel" id="${panelId}">
//                   <div class="cl-action-meta-grid">
//                     <div class="cl-amp-field"><span class="cl-amp-label">Due Date</span><span class="cl-amp-value">${m2.dueDate}</span></div>
//                     <div class="cl-amp-field"><span class="cl-amp-label">Section</span><span class="cl-amp-value">${m2.section}</span></div>
//                     <div class="cl-amp-field"><span class="cl-amp-label">Sub-section</span><span class="cl-amp-value">${m2.subset}</span></div>
//                     <div class="cl-amp-field"><span class="cl-amp-label">Category</span><span class="cl-amp-value">${m2.category}</span></div>
//                     <div class="cl-amp-field"><span class="cl-amp-label">Frequency</span><span class="cl-amp-value">${m2.frequency}</span></div>
//                   </div>
//                 </div>
//               </div>`;
//     }).join('')}
//           </div>
//         </div>`: level >= 3 ? `<div class="cl-no-actions">No specific actions required.</div>` : ''}
//       </div>
//     </div>`;
//   }).join('');
// }

// /* ──────────────────────────────────────────── METADATA HELPERS */
// function _clMockDetailMeta(i) {
//   const d = [
//     { regulatoryBody: 'RBI', legalArea: 'Banking Regulation', subLegalArea: 'Prudential Norms', act: 'Banking Regulation Act 1949', section: 'Section 12', subset: 'Clause (a)', category: 'Mandatory Compliance', frequency: 'Monthly', dueDate: '15th of following month' },
//     { regulatoryBody: 'SEBI', legalArea: 'Securities Law', subLegalArea: 'Market Conduct', act: 'SEBI Act 1992', section: 'Section 21', subset: 'Clause (b)', category: 'Periodic Reporting', frequency: 'Quarterly', dueDate: '30 days from FY end' },
//     { regulatoryBody: 'IRDAI', legalArea: 'Insurance Law', subLegalArea: 'Solvency', act: 'Insurance Act 1938', section: 'Section 34A', subset: 'Sub-section (1)', category: 'System Control', frequency: 'Half-Yearly', dueDate: 'Within 7 business days' },
//   ]; return d[i % d.length];
// }
// function _clMetaFields(meta) {
//   return [
//     { label: 'Regulatory Body', value: meta.regulatoryBody },
//     { label: 'Legislative Area', value: meta.legalArea },
//     { label: 'Sub-Legislative Area', value: meta.subLegalArea },
//     { label: 'Act', value: meta.act },
//     { label: 'Section', value: meta.section },
//     { label: 'Sub-section', value: meta.subset },
//     { label: 'Category', value: meta.category },
//     { label: 'Frequency', value: meta.frequency },
//     { label: 'Due Date', value: meta.dueDate },
//   ];
// }
// function _clObligMeta(i) {
//   const F = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual', 'Ongoing', 'One-time'];
//   const D = ['15th of following month', '30 days from FY end', 'Within 7 business days', 'On occurrence', '31st March', 'Within 60 days'];
//   const S = ['Section 12', 'Section 21', 'Section 34A', 'Section 19', 'Section 134', 'Section 80C'];
//   const SS = ['Clause (a)', 'Clause (b)', 'Sub-section (1)', 'Sub-section (2)', 'Proviso', 'Explanation'];
//   const C = ['Mandatory Compliance', 'Periodic Reporting', 'System Control', 'Governance', 'Disclosure', 'Risk Management'];
//   return { frequency: F[i % 6], dueDate: D[i % 6], section: S[i % 6], subset: SS[i % 6], category: C[i % 6] };
// }

// /* ──────────────────────────────────────────── AI CONTEXT MODAL */
// window._clOpenCtxModal = function (target, label) {
//   window._clCtxTarget = target;
//   let modal = document.getElementById('cl-ctx-modal');
//   if (!modal) {
//     modal = document.createElement('div'); modal.id = 'cl-ctx-modal'; modal.className = 'cl-ctx-overlay';
//     modal.innerHTML = `
//     <div class="cl-ctx-box" onclick="event.stopPropagation()">
//       <div class="cl-ctx-head">
//         <div class="cl-ctx-title">✦ Regenerate with AI Context</div>
//         <button class="cl-ctx-close" onclick="_clCloseCtxModal()">✕</button>
//       </div>
//       <div class="cl-ctx-body">
//         <div class="cl-ctx-for" id="cl-ctx-for-lbl"></div>
//         <div class="cl-ctx-chips">
//           <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Risk Thresholds')">Risk Thresholds</span>
//           <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Provisioning Norms')">Provisioning Norms</span>
//           <span class="cl-ctx-chip" onclick="_clChipToggle(this,'SEBI Overlaps')">SEBI Overlaps</span>
//           <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Recent Amendments')">Recent Amendments</span>
//           <span class="cl-ctx-chip" onclick="_clChipToggle(this,'Capital Adequacy')">Capital Adequacy</span>
//           <span class="cl-ctx-chip" onclick="_clChipToggle(this,'PMLA Context')">PMLA Context</span>
//         </div>
//         <textarea class="cl-ctx-ta" id="cl-ctx-ta" placeholder="Add specific context or instructions for the AI…"></textarea>
//         <div class="cl-ctx-footer">
//           <button class="cl-ctx-cancel" onclick="_clCloseCtxModal()">Cancel</button>
//           <button class="cl-ctx-go" onclick="_clSubmitCtx()">✦ Regenerate</button>
//         </div>
//       </div>
//     </div>`;
//     modal.addEventListener('click', e => { if (e.target === modal) _clCloseCtxModal(); });
//     document.body.appendChild(modal);
//   }
//   document.getElementById('cl-ctx-for-lbl').textContent = `Regenerating: ${label}`;
//   modal.classList.add('cl-ctx-open');
//   setTimeout(() => document.getElementById('cl-ctx-ta')?.focus(), 50);
// };
// window._clCloseCtxModal = function () {
//   document.getElementById('cl-ctx-modal')?.classList.remove('cl-ctx-open');
//   document.querySelectorAll('.cl-ctx-chip').forEach(c => c.classList.remove('cl-ctx-chip-active'));
//   const ta = document.getElementById('cl-ctx-ta'); if (ta) ta.value = '';
// };
// window._clChipToggle = function (el, text) {
//   el.classList.toggle('cl-ctx-chip-active');
//   const ta = document.getElementById('cl-ctx-ta');
//   ta.value = el.classList.contains('cl-ctx-chip-active')
//     ? (ta.value ? ta.value + '\n' + text : text)
//     : ta.value.replace(text, '').replace(/\n+/g, '\n').trim();
// };
// window._clSubmitCtx = function () {
//   _clCloseCtxModal(); showToast('✓ Regenerating with context…', 'success');
// };

// /* ──────────────────────────────────────────── RELATIONSHIP DIALOG — MUI FAB */
// function _clInjectRelFAB() {
//   if (document.getElementById('cl-rel-fab')) return;

//   /* FAB button */
//   const fab = document.createElement('button');
//   fab.id = 'cl-rel-fab';
//   fab.className = 'cl-rel-fab';
//   fab.title = 'Circular Relationships';
//   fab.innerHTML = `
//     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//       <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
//       <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
//     </svg>
//     <span class="cl-fab-label">Lineage</span>`;
//   fab.addEventListener('click', clOpenRelDialog);
//   document.body.appendChild(fab);

//   /* Dialog overlay */
// const REL_DATA = {
//   type: {
//     label: 'Circular',
//     desc: 'Classification of this circular in the regulatory hierarchy.',
//     items: [
//       {
//         id: 'RBI-HF-2024-001',
//         type: 'Master Circular',
//         title: 'Master Circular on Housing Finance',
//         reg: 'RBI',
//         date: '2024-04-02',
//         status: 'Active',
//         hierarchy: 'Top-level consolidation of all housing finance instructions issued up to March 31, 2024.',
//         tags: ['Housing Finance', 'Prudential', 'Lending'],
//         docUrl: './RBI Master Circular.pdf'
//       }
//     ]
//   },

//   belongs: {
//     label: 'Belongs To which ACT',
//     desc: 'The statutory framework under which RBI issues housing finance directions.',
//     items: [
//       {
//         id: 'RBI-ACT-1934',
//         type: 'Legislation',
//         title: 'Reserve Bank of India Act, 1934',
//         reg: 'Parliament of India',
//         date: '1934',
//         status: 'Active',
//         hierarchy: 'Primary legislation empowering RBI to regulate banking system.',
//         tags: ['Primary Law', 'RBI Authority'],
//         docUrl: '#'
//       },
//       {
//         id: 'BR-ACT-1949',
//         type: 'Legislation',
//         title: 'Banking Regulation Act, 1949 – Section 21 & 35A',
//         reg: 'Parliament of India',
//         date: '1949',
//         status: 'Active',
//         hierarchy: 'Provides RBI power to issue directions on advances and lending practices.',
//         tags: ['Banking Law', 'Lending Powers'],
//         docUrl: '#'
//       }
//     ]
//   },

//   based: {
//     label: 'Based On which Circular',
//     desc: 'Earlier RBI circulars consolidated into this Master Circular.',
//     items: [
//       {
//         id: 'RBI/2015-16/LTV',
//         type: 'Circular',
//         title: 'Housing Loans – LTV Ratio Guidelines',
//         reg: 'RBI',
//         date: '2015',
//         status: 'Superseded',
//         hierarchy: 'Foundation for Loan-to-Value ratio norms.',
//         tags: ['LTV', 'Risk'],
//         docUrl: '#'
//       },
//       {
//         id: 'RBI/2017-18/RISK',
//         type: 'Circular',
//         title: 'Risk Weights for Housing Loans',
//         reg: 'RBI',
//         date: '2017',
//         status: 'Superseded',
//         hierarchy: 'Defines capital adequacy treatment for housing loans.',
//         tags: ['Risk Weight', 'Capital'],
//         docUrl: '#'
//       },
//       {
//         id: 'RBI/2018-19/DISB',
//         type: 'Circular',
//         title: 'Disbursement of Housing Loans Linked to Construction Stages',
//         reg: 'RBI',
//         date: '2018',
//         status: 'Superseded',
//         hierarchy: 'Introduced stage-wise disbursement norms.',
//         tags: ['Disbursement', 'Construction'],
//         docUrl: '#'
//       }
//     ]
//   },

//   refers: {
//     label: 'Refers To which Circular',
//     desc: 'Other RBI directions and frameworks referenced in this circular.',
//     items: [
//       {
//         id: 'RBI-IRD-2023',
//         type: 'Master Direction',
//         title: 'Interest Rate on Advances Directions',
//         reg: 'RBI',
//         date: '2023',
//         status: 'Active',
//         hierarchy: 'Defines interest rate framework applicable to housing loans.',
//         tags: ['Interest Rate', 'Lending'],
//         docUrl: '#'
//       },
//       {
//         id: 'RBI-FLP-2023',
//         type: 'Guidelines',
//         title: 'Fair Lending Practice Guidelines – Penal Charges & Transparency',
//         reg: 'RBI',
//         date: '2023',
//         status: 'Active',
//         hierarchy: 'Referenced for borrower protection and transparency norms.',
//         tags: ['Fair Lending', 'Customer Protection'],
//         docUrl: '#'
//       },
//       {
//         id: 'NBC-NDMA',
//         type: 'Guidelines',
//         title: 'National Building Code & NDMA Guidelines',
//         reg: 'Government of India',
//         date: '—',
//         status: 'Active',
//         hierarchy: 'Safety and construction compliance standards referenced in housing finance.',
//         tags: ['Safety', 'Construction'],
//         docUrl: '#'
//       }
//     ]
//   },

//   version: {
//     label: 'Version Chain',
//     desc: 'Annual consolidation history of Housing Finance Master Circular.',
//     items: [
//       {
//         id: 'RBI-HF-2021',
//         type: 'Master Circular',
//         title: 'Master Circular – Housing Finance 2021',
//         reg: 'RBI',
//         date: '2021-07-01',
//         status: 'Superseded',
//         hierarchy: 'Earlier consolidated version.',
//         tags: ['v1', 'Historical'],
//         docUrl: '#'
//       },
//       {
//         id: 'RBI-HF-2022',
//         type: 'Master Circular',
//         title: 'Master Circular – Housing Finance 2022',
//         reg: 'RBI',
//         date: '2022-07-01',
//         status: 'Superseded',
//         hierarchy: 'Updated consolidation with revised norms.',
//         tags: ['v2', 'Update'],
//         docUrl: '#'
//       },
//       {
//         id: 'RBI-HF-2023',
//         type: 'Master Circular',
//         title: 'Master Circular – Housing Finance 2023',
//         reg: 'RBI',
//         date: '2023-07-01',
//         status: 'Superseded',
//         hierarchy: 'Immediate previous version.',
//         tags: ['v3', 'Previous'],
//         docUrl: '#'
//       },
//       {
//         id: 'RBI-HF-2024',
//         type: 'Master Circular',
//         title: 'Master Circular – Housing Finance 2024',
//         reg: 'RBI',
//         date: '2024-04-02',
//         status: 'Active',
//         hierarchy: 'Current version consolidating all instructions up to March 31, 2024.',
//         tags: ['v4', 'Current'],
//         docUrl: './RBI Master Circular.pdf'
//       }
//     ]
//   }
// };

//   const overlay = document.createElement('div');
//   overlay.id = 'cl-rel-overlay'; overlay.className = 'cl-rel-overlay';
//   overlay.innerHTML = `
//   <div class="cl-rel-dialog" onclick="event.stopPropagation()">
//     <div class="cl-rel-dhead">
//       <div class="cl-rel-dhead-left">
//         <div class="cl-rel-dhead-icon">
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
//         </div>
//         <div>
//           <div class="cl-rel-dhead-title">Circular Relationships</div>
//           <div class="cl-rel-dhead-sub" id="cl-rel-dsub">—</div>
//         </div>
//       </div>
//       <button class="cl-rel-dclose" onclick="clCloseRelDialog()">
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
//       </button>
//     </div>
//     <div class="cl-rel-tabs" id="cl-rel-tabs">
//       ${Object.entries(REL_DATA).map(([k, v], i) => `
//       <button class="cl-rel-tab${i === 0 ? ' active' : ''}" data-rel="${k}" onclick="clRelTab('${k}')">${v.label}</button>`).join('')}
//     </div>
//     <div class="cl-rel-body" id="cl-rel-body"></div>
//   </div>`;
//   overlay.addEventListener('click', e => { if (e.target === overlay) clCloseRelDialog(); });
//   document.body.appendChild(overlay);
//   window._CL_REL_DATA = REL_DATA;
//   setTimeout(() => clRelTab('type'), 0);
// }

// window.clOpenRelDialog = function () {
//   const overlay = document.getElementById('cl-rel-overlay');
//   if (!overlay) { _clInjectRelFAB(); setTimeout(clOpenRelDialog, 50); return; }
//   const sub = document.getElementById('cl-rel-dsub'), circ = window._CL_ACTIVE_CIRC;
//   if (sub && circ) sub.textContent = `${circ.id} · ${circ.title}`;
//   overlay.classList.add('cl-rel-open');
//   document.getElementById('cl-rel-fab')?.classList.add('cl-fab-active');
// };
// window.clCloseRelDialog = function () {
//   document.getElementById('cl-rel-overlay')?.classList.remove('cl-rel-open');
//   document.getElementById('cl-rel-fab')?.classList.remove('cl-fab-active');
// };
// window.clRelTab = function (key) {
//   document.querySelectorAll('.cl-rel-tab').forEach(t => t.classList.toggle('active', t.dataset.rel === key));
//   const data = window._CL_REL_DATA?.[key], body = document.getElementById('cl-rel-body');
//   if (!body || !data) return;
//   body.innerHTML = `
//   <div class="cl-rel-tab-desc">${data.desc}</div>
//   <div class="cl-rel-items">${data.items.map((item, idx) => _clRelItemHTML(item, idx, key)).join('')}</div>`;
// };

// function _clRelItemHTML(item, idx, key) {
//   const sc = item.status === 'Active' ? 'cl-rs-active' : item.status === 'Superseded' ? 'cl-rs-super' : 'cl-rs-other';
//   const dId = `cl-rd-${key}-${idx}`;
//   return `
//   <div class="cl-rel-item" id="cl-ri-${key}-${idx}">
//     <div class="cl-rel-item-main" onclick="clRelToggle('${key}',${idx})">
//       <div class="cl-rel-item-left">
//         <div class="cl-rel-item-top-row">
//           <span class="cl-ri-id">${item.id}</span>
//           <span class="cl-ri-type">${item.type}</span>
//           <span class="cl-ri-status ${sc}">${item.status}</span>
//         </div>
//         <div class="cl-ri-title">${item.title}</div>
//         <div class="cl-ri-meta">
//           <span class="cl-ri-reg">🏛 ${item.reg}</span>
//           ${item.date !== '—' ? `<span class="cl-ri-date">📅 ${item.date}</span>` : ''}
//           ${item.tags.map(t => `<span class="cl-ri-tag">${t}</span>`).join('')}
//         </div>
//       </div>
//       <span class="cl-ri-arrow">
//         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
//       </span>
//     </div>
//     <div class="cl-rel-detail" id="${dId}">
//       <div class="cl-rel-detail-inner">
//         <div class="cl-rd-section">
//           <div class="cl-rd-sec-label">Hierarchy &amp; Context</div>
//           <div class="cl-rd-hierarchy">${item.hierarchy}</div>
//         </div>
//         <div class="cl-rd-section">
//           <div class="cl-rd-sec-label">Details</div>
//           <div class="cl-rd-grid">
//             <div class="cl-rd-field"><span class="cl-rd-label">Circular ID</span><span class="cl-rd-value">${item.id}</span></div>
//             <div class="cl-rd-field"><span class="cl-rd-label">Type</span><span class="cl-rd-value">${item.type}</span></div>
//             <div class="cl-rd-field"><span class="cl-rd-label">Regulator</span><span class="cl-rd-value">${item.reg}</span></div>
//             <div class="cl-rd-field"><span class="cl-rd-label">Issue Date</span><span class="cl-rd-value">${item.date}</span></div>
//             <div class="cl-rd-field"><span class="cl-rd-label">Status</span><span class="cl-rd-value">${item.status}</span></div>
//             <div class="cl-rd-field"><span class="cl-rd-label">Tags</span><span class="cl-rd-value">${item.tags.join(', ')}</span></div>
//           </div>
//         </div>
//         <div class="cl-rd-section">
//           <div class="cl-rd-sec-label">Links &amp; Documents</div>
//           <div class="cl-rd-links">
//             <a class="cl-rd-link cl-rd-link-pri" href="${item.docUrl}" target="_blank" onclick="event.stopPropagation()">📄 View Full Circular</a>
//             <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Opening in doc viewer…','info')">🔍 Open in Doc Viewer</a>
//             <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Downloading PDF…','info')">⬇ Download PDF</a>
//             <a class="cl-rd-link" href="#" onclick="event.stopPropagation();showToast('Link copied!','success')">🔗 Copy Reference</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>`;
// }
// window.clRelToggle = function (key, idx) {
//   const det = document.getElementById(`cl-rd-${key}-${idx}`), item = document.getElementById(`cl-ri-${key}-${idx}`);
//   if (!det) return;
//   const open = det.classList.contains('open');
//   document.querySelectorAll('.cl-rel-detail').forEach(d => d.classList.remove('open'));
//   document.querySelectorAll('.cl-rel-item').forEach(i => i.classList.remove('cl-ri-exp'));
//   if (!open) { det.classList.add('open'); item?.classList.add('cl-ri-exp'); }
// };

// /* ──────────────────────────────────────────── EVIDENCE MODAL */
// window.clShowEvidenceModal = function (clauseId, actions, obligation) {
//   const EV = [
//     { icon: '📋', name: 'Compliance Policy Document', type: 'Policy', source: 'Internal Repository', needed: 'Board-approved policy covering this compliance area.', status: 'Required' },
//     { icon: '🔍', name: 'Internal Audit Report', type: 'Audit Record', source: 'Internal Audit Dept', needed: 'Audit findings confirming controls are operating effectively.', status: 'Required' },
//     { icon: '🎓', name: 'Staff Training Completion Record', type: 'Training Record', source: 'HR System', needed: 'Completion records for all relevant staff.', status: 'Required' },
//     { icon: '💻', name: 'System Audit Trail / Access Log', type: 'System Log', source: 'IT Department', needed: 'System-generated logs showing automated controls.', status: 'Recommended' },
//     { icon: '🏛️', name: 'Board Resolution / Meeting Minutes', type: 'Board Record', source: 'Company Secretary', needed: 'Board-level approval in formal meeting minutes.', status: 'Required' },
//     { icon: '📨', name: 'Regulatory Submission Receipt', type: 'Regulatory Filing', source: 'Compliance Team', needed: 'Regulator acknowledgement of timely submission.', status: 'Recommended' },
//   ];
//   const mapped = (Array.isArray(actions) ? actions : [actions]).map((a, i) => ({ action: a, ev: EV[i % EV.length] }));
//   const req = mapped.filter(m => m.ev.status === 'Required').length, rec = mapped.length - req;
//   const ov = document.createElement('div'); ov.className = 'cl-modal-overlay';
//   ov.innerHTML = `
//   <div class="cl-modal cl-modal-ev">
//     <div class="cl-modal-head">
//       <div class="cl-modal-head-left">
//         <span class="cl-modal-clause-id">${clauseId}</span>
//         ${obligation ? `<span class="cl-modal-oblig-short">${obligation.substring(0, 90)}${obligation.length > 90 ? '…' : ''}</span>` : ''}
//       </div>
//       <button class="cl-modal-close" onclick="this.closest('.cl-modal-overlay').remove()">✕</button>
//     </div>
//     <div class="cl-ev-summary">
//       <span class="cl-ev-pill">${mapped.length} items</span>
//       <span class="cl-ev-pill cl-ev-pill-req">🔴 ${req} Required</span>
//       <span class="cl-ev-pill cl-ev-pill-rec">🟡 ${rec} Recommended</span>
//       <span class="cl-ev-pill cl-ev-pill-saved">✅ <span id="cl-ev-sc">0</span> Saved</span>
//     </div>
//     <div class="cl-ev-table-wrap">
//       <table class="cl-ev-table">
//         <thead><tr>
//           <th class="cl-ev-th cl-ev-th-num">#</th>
//           <th class="cl-ev-th">Action</th>
//           <th class="cl-ev-th">Evidence Needed</th>
//           <th class="cl-ev-th cl-ev-th-st">Status</th>
//           <th class="cl-ev-th cl-ev-th-sv"></th>
//         </tr></thead>
//         <tbody>
//           ${mapped.map((m, i) => `
//           <tr class="cl-ev-tr" id="cl-ev-row-${i}">
//             <td class="cl-ev-td cl-ev-td-num">${i + 1}</td>
//             <td class="cl-ev-td">${m.action}</td>
//             <td class="cl-ev-td">
//               <div class="cl-ev-doc-name">${m.ev.icon} ${m.ev.name}</div>
//               <div class="cl-ev-doc-sub">${m.ev.type} · ${m.ev.source}</div>
//               <div class="cl-ev-doc-needed">${m.ev.needed}</div>
//             </td>
//             <td class="cl-ev-td cl-ev-td-st"><span class="cl-ev-badge ${m.ev.status === 'Required' ? 'cl-ev-badge-req' : 'cl-ev-badge-rec'}">${m.ev.status}</span></td>
//             <td class="cl-ev-td cl-ev-td-sv">
//               <button class="cl-ev-save-btn" onclick="this.textContent='✓';this.classList.add('cl-ev-saved');this.disabled=true;document.getElementById('cl-ev-row-${i}').classList.add('cl-ev-tr-saved');const c=document.getElementById('cl-ev-sc');if(c)c.textContent=parseInt(c.textContent||0)+1;showToast('Saved.','success');">Save</button>
//             </td>
//           </tr>`).join('')}
//         </tbody>
//       </table>
//     </div>
//     <div class="cl-modal-foot">
//       <span class="cl-modal-foot-note">💡 AI-suggested based on clause and obligation context</span>
//       <div style="display:flex;gap:8px;">
//         <button class="cl-modal-btn cl-modal-btn-sec" onclick="showToast('Refreshing…','info')">↺ Refresh</button>
//         <button class="cl-modal-btn cl-modal-btn-pri" onclick="this.closest('.cl-modal-overlay').remove()">Done</button>
//       </div>
//     </div>
//   </div>`;
//   document.body.appendChild(ov);
//   ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
// };

// /* ──────────────────────────────────────────── CSS */
// function injectClauseCSS() {
//   if (document.getElementById('cl-css')) return;
//   const s = document.createElement('style'); s.id = 'cl-css';
//   s.textContent = `
// :root{
//   --cl-bg:#f4f6f9;--cl-card:#fff;--cl-nav-bg:#f8f9fb;--cl-hover:#eef1f6;
//   --cl-border:#e2e6ed;--cl-border-lt:#edf0f5;
//   --cl-t1:#1e2433;--cl-t2:#5a6478;--cl-t3:#9aa3b5;
//   --cl-blue:#0d7fa5;--cl-blue-lt:#e6f4f9;--cl-blue-mid:#b2ddef;
//   --cl-purple:#5b5fcf;--cl-purple-lt:#ededfc;
//   --cl-green:#0e9f6e;--cl-green-lt:#e8faf4;
//   --cl-amber:#b45309;--cl-amber-lt:#fef3c7;
//   --cl-red:#c92a2a;--cl-red-lt:#fdecea;
//   --cl-r-sm:6px;--cl-r-md:10px;--cl-r-lg:14px;
//   --cl-sh:0 1px 3px rgba(30,36,51,.07);--cl-sh-md:0 4px 16px rgba(30,36,51,.10);
//   --cl-font:'DM Sans',system-ui,sans-serif;
//   --cl-mono:'DM Mono',monospace;
// }
// *{box-sizing:border-box;}
// .cl-wrap{display:flex;flex-direction:column;gap:12px;font-family:var(--cl-font);color:var(--cl-t1);}

// /* ── EMPTY */
// .cl-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px 28px;background:var(--cl-card);border:2px dashed var(--cl-border);border-radius:var(--cl-r-lg);text-align:center;}
// .cl-empty-icon{font-size:36px;opacity:.5;}.cl-empty-title{font-size:15px;font-weight:700;}
// .cl-empty-sub{font-size:13px;color:var(--cl-t3);max-width:280px;line-height:1.6;}
// .cl-empty-cta{padding:9px 22px;background:var(--cl-t1);color:#fff;border:none;border-radius:var(--cl-r-sm);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}

// /* ── TOP BAR */
// .cl-topbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 16px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-md);box-shadow:var(--cl-sh);}
// .cl-topbar-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1;flex-wrap:wrap;}
// .cl-topbar-right{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap;}
// .cl-circ-id-chip{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:3px 10px;border-radius:5px;white-space:nowrap;}
// .cl-circ-name-chip{font-size:12px;color:var(--cl-t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:280px;}
// .cl-filter-select{padding:6px 10px;background:var(--cl-nav-bg);border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;color:var(--cl-t2);outline:none;cursor:pointer;}
// .cl-filter-select:focus{border-color:var(--cl-blue);}
// .cl-level-toggle{display:flex;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);overflow:hidden;}
// .cl-lvl-btn{padding:6px 12px;background:var(--cl-card);border:none;border-right:1px solid var(--cl-border);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t3);cursor:pointer;transition:all .12s;}
// .cl-lvl-btn:last-child{border-right:none;}.cl-lvl-btn.active{background:var(--cl-t1);color:#fff;}
// .cl-topbar-btn{padding:7px 15px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .13s;white-space:nowrap;border:1.5px solid;}
// .cl-btn-generate{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}.cl-btn-generate:hover{background:#2a3248;}
// .cl-btn-regen{background:var(--cl-card);color:var(--cl-t1);border-color:var(--cl-border);}.cl-btn-regen:hover{background:var(--cl-hover);}

// /* ── SPLIT */
// .cl-split{display:grid;grid-template-columns:256px 1fr;gap:0;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-lg);overflow:hidden;min-height:560px;box-shadow:var(--cl-sh);}

// /* ── LEFT NAV */
// .cl-nav{border-right:1px solid var(--cl-border-lt);display:flex;flex-direction:column;background:var(--cl-nav-bg);}
// .cl-nav-head{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;border-bottom:1px solid var(--cl-border-lt);}
// .cl-nav-title{font-size:10px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
// .cl-nav-count{font-size:10px;color:var(--cl-t3);background:var(--cl-border-lt);border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px;}
// .cl-nav-tree{flex:1;overflow-y:auto;padding:4px 0;}
// .cl-nav-placeholder,.cl-nav-loading{padding:24px 16px;font-size:12px;color:var(--cl-t3);text-align:center;line-height:1.6;}

// /* chapter btn — shows "Chapter 1" + title */
// .cl-nav-ch-btn{width:100%;display:flex;align-items:center;gap:7px;padding:9px 14px 9px 10px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background .1s;}
// .cl-nav-ch-btn:hover{background:var(--cl-hover);}
// .cl-nav-ch-arrow{font-size:8px;color:var(--cl-t3);flex-shrink:0;width:10px;line-height:1;}
// .cl-nav-ch-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}
// .cl-nav-ch-num{font-size:9px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;line-height:1.2;}
// .cl-nav-ch-label{font-size:11px;font-weight:600;color:var(--cl-t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3;}
// .cl-nav-ch-count{font-size:10px;color:var(--cl-t3);background:#e8ebf1;padding:1px 7px;border-radius:10px;flex-shrink:0;}
// .cl-nav-ch-body{display:none;padding-bottom:4px;}.cl-nav-ch-body.open{display:block;}

// /* section btn */
// .cl-nav-sec-btn{width:100%;display:flex;align-items:center;gap:6px;padding:7px 12px 7px 20px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;text-align:left;transition:background .1s;color:var(--cl-t2);border-left:3px solid transparent;}
// .cl-nav-sec-btn:hover{background:var(--cl-hover);}
// .cl-nav-active{background:var(--cl-blue-lt)!important;border-left-color:var(--cl-blue)!important;color:var(--cl-blue)!important;}
// .cl-nav-sec-icon{font-size:10px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:1px 5px;border-radius:3px;flex-shrink:0;}
// .cl-nav-sec-label{flex:1;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
// .cl-nav-sec-count,.cl-nav-subsec-count{font-size:9px;color:var(--cl-t3);flex-shrink:0;}
// .cl-nav-sec-arrow{font-size:10px;color:var(--cl-t3);flex-shrink:0;}
// .cl-nav-sec-body{display:none;}.cl-nav-sec-body.open{display:block;}

// /* sub-section btn */
// .cl-nav-subsec-btn{width:100%;display:flex;align-items:center;gap:6px;padding:6px 12px 6px 32px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:10.5px;text-align:left;transition:background .1s;color:var(--cl-t2);border-left:3px solid transparent;}
// .cl-nav-subsec-btn:hover{background:var(--cl-hover);}
// .cl-nav-subsec-icon{font-size:9px;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:1px 4px;border-radius:3px;font-weight:700;}
// .cl-nav-subsec-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
// .cl-nav-all-btn{display:block;width:100%;padding:7px 14px 7px 20px;background:none;border:none;font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-blue);text-align:left;cursor:pointer;}
// .cl-nav-all-btn:hover{background:var(--cl-hover);}

// /* ── RIGHT WORKSPACE */
// .cl-workspace{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-width:0;}
// .cl-ws-placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:40px;text-align:center;}
// .cl-ws-ph-icon{font-size:32px;opacity:.3;}.cl-ws-ph-title{font-size:14px;font-weight:700;color:var(--cl-t3);}
// .cl-ws-ph-sub{font-size:12px;color:#c0c7d6;max-width:260px;line-height:1.6;}


// .sum-foot-btn  { padding:10px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;
//   font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid;display:inline-flex;
//   align-items:center;gap:7px;transition:all 0.14s; }
// .sum-foot-save { background:#fff;border-color:#86efac;color:#16a34a; }


// /* ── CLAUSE STACK */
// .cl-stack-wrap{padding:20px 24px;}
// .cl-stack-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--cl-border-lt);}
// .cl-stack-breadcrumb{display:flex;flex-direction:column;gap:4px;}
// .cl-stack-chapter-row{display:flex;align-items:center;gap:8px;}
// .cl-stack-ch-num{font-size:10px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.08em;background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 8px;border-radius:4px;}
// .cl-stack-ch-title{font-size:13px;font-weight:700;color:var(--cl-t1);}
// .cl-stack-sec-row{display:flex;align-items:center;gap:5px;}
// .cl-stack-sec-icon{font-size:11px;color:var(--cl-t3);}
// .cl-stack-sec-label{font-size:12px;color:var(--cl-t2);font-weight:500;}
// .cl-stack-count{font-size:11px;color:var(--cl-t3);background:var(--cl-border-lt);border:1px solid var(--cl-border);padding:3px 10px;border-radius:10px;flex-shrink:0;white-space:nowrap;}
// .cl-stack-list{display:flex;flex-direction:column;gap:8px;}
// .cl-stack-empty{padding:24px;text-align:center;font-size:13px;color:var(--cl-t3);background:var(--cl-nav-bg);border-radius:var(--cl-r-md);border:1px dashed var(--cl-border);}

// /* clause card */
// .cl-clause-card{width:100%;text-align:left;background:var(--cl-card);border:1.5px solid var(--cl-border);border-radius:var(--cl-r-md);padding:13px 15px;cursor:pointer;font-family:inherit;transition:all .14s;display:flex;flex-direction:column;gap:7px;box-shadow:var(--cl-sh);}
// .cl-clause-card:hover{border-color:var(--cl-blue);background:var(--cl-blue-lt);box-shadow:0 2px 8px rgba(13,127,165,.12);}
// .cl-clause-card-active{border-color:var(--cl-blue)!important;background:var(--cl-blue-lt)!important;}
// .cl-card-top-row{display:flex;align-items:center;justify-content:space-between;gap:8px;}
// .cl-card-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:2px 8px;border-radius:4px;}
// .cl-card-badges{display:flex;align-items:center;gap:5px;}
// .cl-card-risk{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;}
// .cl-risk-high{background:var(--cl-red-lt);color:var(--cl-red);}
// .cl-risk-medium{background:var(--cl-amber-lt);color:var(--cl-amber);}
// .cl-risk-low{background:var(--cl-green-lt);color:var(--cl-green);}
// .cl-card-dept{font-size:10px;font-weight:600;color:var(--cl-t2);background:#f0f1f4;border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px;}
// .cl-card-text{font-size:12.5px;color:var(--cl-t2);line-height:1.55;text-align:left;}

// /* ── CLAUSE DETAIL */
// .cl-ws-inner{padding:24px 28px;display:flex;flex-direction:column;gap:18px;}
// .cl-ws-back{align-self:flex-start;padding:5px 12px;background:var(--cl-nav-bg);border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;transition:all .12s;}
// .cl-ws-back:hover{background:var(--cl-hover);color:var(--cl-t1);}

// /* clause card block */
// .cl-ws-clause-card{background:var(--cl-card);border:1.5px solid var(--cl-border);border-radius:var(--cl-r-lg);overflow:hidden;box-shadow:var(--cl-sh);}
// .cl-wc-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 18px 10px;background:var(--cl-nav-bg);border-bottom:1px solid var(--cl-border-lt);}
// .cl-wc-header-left{display:flex;flex-direction:column;gap:7px;}
// .cl-wc-header-right{display:flex;align-items:center;gap:7px;flex-shrink:0;}
// .cl-wc-breadcrumb{display:flex;align-items:center;gap:6px;}
// .cl-wc-ch{font-size:11px;color:var(--cl-t3);}.cl-wc-sep{color:var(--cl-border-lt);}
// .cl-wc-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);}
// .cl-wc-badges{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
// .cl-wc-badge{padding:3px 10px;border-radius:4px;font-size:10px;font-weight:700;border:1px solid;}
// .cl-wc-risk-high{background:var(--cl-red-lt);border-color:#f5b8b8;color:var(--cl-red);}
// .cl-wc-risk-medium{background:var(--cl-amber-lt);border-color:#fcd34d;color:var(--cl-amber);}
// .cl-wc-risk-low{background:var(--cl-green-lt);border-color:#6ee7b7;color:var(--cl-green);}
// .cl-wc-dept{background:#eef1fd;border-color:#c5cff8;color:var(--cl-purple);}
// .cl-wc-page-chip{padding:3px 9px;background:#fff;border:1.5px solid var(--cl-border);border-radius:10px;font-family:inherit;font-size:10px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .12s;display:inline-block;}
// .cl-wc-page-chip:hover{border-color:var(--cl-blue);color:var(--cl-blue);background:var(--cl-blue-lt);}
// .cl-wc-info-btn{width:28px;height:28px;border-radius:50%;background:var(--cl-nav-bg);border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;flex-shrink:0;}
// .cl-wc-info-btn:hover,.cl-wc-info-btn-active{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}
// .cl-wc-regen-btn{padding:5px 12px;background:#fff;border:1.5px solid var(--cl-purple);border-radius:20px;font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-purple);cursor:pointer;transition:all .13s;white-space:nowrap;}
// .cl-wc-regen-btn:hover{background:var(--cl-purple-lt);}

// /* clause text — 10-line clamp */
// .cl-wc-text{font-size:13.5px;font-weight:500;color:var(--cl-t1);line-height:1.75;padding:14px 18px 4px;}
// .cl-txt-clamped{display:-webkit-box;-webkit-line-clamp:10;-webkit-box-orient:vertical;overflow:hidden;}
// .cl-view-more-btn{margin:0 18px 10px;background:none;border:none;padding:0;font-family:inherit;font-size:12px;font-weight:700;color:var(--cl-blue);cursor:pointer;display:block;}
// .cl-view-more-btn:hover{text-decoration:underline;}

// /* metadata table (toggled by ⓘ) */
// .cl-meta-table-wrap{margin:0 18px 14px;border:1px solid var(--cl-border-lt);border-radius:var(--cl-r-sm);overflow:hidden;animation:fadeIn .15s ease;}
// @keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
// .cl-meta-table-inner{display:grid;grid-template-columns:1fr 1fr 1fr;}
// .cl-meta-row{padding:8px 12px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt);display:flex;flex-direction:column;gap:2px;background:#fbfcfd;}
// .cl-meta-row:nth-child(3n){border-right:none;}
// .cl-meta-row:nth-last-child(-n+3){border-bottom:none;}
// .cl-meta-label{font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;}
// .cl-meta-value{font-size:11.5px;font-weight:600;color:var(--cl-t1);}

// /* ── OBLIGATIONS SECTION */
// .cl-section-block{display:flex;flex-direction:column;gap:8px;}
// .cl-section-head{display:flex;align-items:center;gap:8px;}
// .cl-section-label{font-size:10px;font-weight:800;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.1em;}
// .cl-oblig-list{display:flex;flex-direction:column;gap:0;border:1px solid var(--cl-border);border-radius:var(--cl-r-lg);overflow:hidden;box-shadow:var(--cl-sh);}

// /* obligation item */
// .cl-oblig-item{border-bottom:1px solid var(--cl-border-lt);background:var(--cl-card);}
// .cl-oblig-item:last-child{border-bottom:none;}

// /* obligation header / trigger */
// .cl-oblig-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:13px 16px;cursor:pointer;background:var(--cl-card);transition:background .12s;user-select:none;}
// .cl-oblig-header:hover{background:var(--cl-hover);}
// .cl-oblig-header-left{display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;}
// .cl-oblig-header-right{display:flex;align-items:center;gap:8px;flex-shrink:0;margin-top:2px;}
// .cl-oblig-num{flex-shrink:0;width:24px;height:24px;background:var(--cl-purple);color:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
// .cl-oblig-header-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;}
// .cl-oblig-header-chips{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
// .cl-oblig-dept-chip{font-size:10px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:1px 8px;border-radius:10px;}
// .cl-oblig-pg-chip{font-size:10px;font-weight:600;color:var(--cl-t3);background:#fff;border:1px solid var(--cl-border);padding:1px 8px;border-radius:10px;cursor:pointer;font-family:inherit;transition:all .12s;}
// .cl-oblig-pg-chip:hover{border-color:var(--cl-blue);color:var(--cl-blue);}
// .cl-oblig-preview{font-size:13px;font-weight:500;color:var(--cl-t1);line-height:1.55;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
// .cl-oblig-arrow{color:var(--cl-t3);display:flex;align-items:center;transition:transform .2s;}
// .cl-oblig-arrow.rotated{transform:rotate(180deg);}
// .cl-oblig-edit-btn{width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-border);font-size:11px;color:var(--cl-t3);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .12s;}
// .cl-oblig-edit-btn:hover{background:var(--cl-blue-lt);color:var(--cl-blue);border-color:var(--cl-blue);}

// /* inline edit */
// .cl-oblig-edit-ta{width:100%;min-height:80px;padding:10px 16px;background:#fffbeb;border:none;border-top:1px solid #fcd34d;font-family:inherit;font-size:13px;color:var(--cl-t1);outline:none;resize:vertical;display:block;}
// .cl-oblig-editbar{display:flex;justify-content:flex-end;gap:8px;padding:8px 14px;background:#fefce8;border-top:1px solid #fcd34d;}
// .cl-oblig-edit-cancel{padding:5px 12px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;}
// .cl-oblig-edit-save{padding:5px 12px;background:var(--cl-t1);border:none;border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:#fff;cursor:pointer;}

// /* obligation body */
// .cl-oblig-body{display:none;border-top:1px solid var(--cl-border-lt);background:#fafbfd;}
// .cl-oblig-body.open{display:block;}

// /* obligation mini metadata strip */
// .cl-oblig-meta-strip{display:flex;gap:0;border-bottom:1px solid var(--cl-border-lt);}
// .cl-oblig-meta-field{flex:1;padding:9px 12px;border-right:1px solid var(--cl-border-lt);display:flex;flex-direction:column;gap:2px;}
// .cl-oblig-meta-field:last-child{border-right:none;}
// .cl-omf-label{font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;}
// .cl-omf-value{font-size:11.5px;font-weight:600;color:var(--cl-t1);}

// /* obligation full text */
// .cl-oblig-full-text{font-size:13px;color:var(--cl-t2);line-height:1.7;padding:12px 16px;border-bottom:1px solid var(--cl-border-lt);}

// /* obligation button row */
// .cl-oblig-btn-row{display:flex;align-items:center;gap:8px;padding:10px 16px;flex-wrap:wrap;}
// .cl-oblig-regen-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#fff;border:1.5px solid var(--cl-purple);border-radius:20px;font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-purple);cursor:pointer;transition:all .13s;}
// .cl-oblig-regen-btn:hover{background:var(--cl-purple-lt);}
// .cl-ev-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#fff;border:1.5px solid var(--cl-border);border-radius:20px;font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;transition:all .13s;margin-left:auto;}
// .cl-ev-btn:hover{border-color:var(--cl-purple);color:var(--cl-purple);background:var(--cl-purple-lt);}

// /* ── ACTIONS */
// .cl-actions-wrap{padding:10px 16px 14px;}
// .cl-actions-title{display:flex;align-items:center;gap:7px;margin-bottom:10px;font-size:10px;font-weight:800;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
// .cl-actions-badge{min-width:18px;height:18px;padding:0 5px;background:var(--cl-border-lt);color:var(--cl-t2);border-radius:10px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;}
// .cl-actions-list{display:flex;flex-direction:column;gap:6px;}
// .cl-action-item{border:1px solid var(--cl-border-lt);border-radius:var(--cl-r-sm);overflow:hidden;background:#fff;}
// .cl-action-main-row{display:flex;align-items:flex-start;gap:9px;padding:9px 12px;}
// .cl-action-num{flex-shrink:0;width:20px;height:20px;background:var(--cl-blue-lt);color:var(--cl-blue);border:1px solid var(--cl-blue-mid);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
// .cl-action-text{flex:1;font-size:12.5px;color:var(--cl-t1);line-height:1.55;}
// .cl-action-info-btn{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;margin-top:1px;}
// .cl-action-info-btn:hover,.cl-action-info-btn.active{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}
// .cl-action-meta-panel{display:none;background:var(--cl-blue-lt);border-top:1px solid var(--cl-blue-mid);padding:10px 12px;}
// .cl-action-meta-panel.open{display:block;animation:fadeIn .15s ease;}
// .cl-action-meta-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;}
// .cl-amp-field{padding:6px 10px;border-right:1px solid var(--cl-blue-mid);}
// .cl-amp-field:last-child{border-right:none;}
// .cl-amp-label{display:block;font-size:9px;font-weight:700;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;opacity:.7;}
// .cl-amp-value{display:block;font-size:11px;font-weight:600;color:var(--cl-t1);}
// .cl-no-actions{font-size:12px;color:var(--cl-t3);font-style:italic;padding:10px 16px;}

// /* ── FOOTER */
// .cl-footer{display:flex;gap:10px;align-items:center;}
// .cl-foot-save{padding:10px 20px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #6ee7b7;background:var(--cl-card);color:var(--cl-green);display:inline-flex;align-items:center;gap:7px;transition:all .14s;}
// .cl-foot-save:hover{background:var(--cl-green-lt);}

// /* ── AI CONTEXT MODAL */
// .cl-ctx-overlay{position:fixed;inset:0;background:rgba(20,25,40,.5);z-index:3000;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
// .cl-ctx-overlay.cl-ctx-open{display:flex;}
// .cl-ctx-box{background:#fff;border-radius:14px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);animation:popIn .22s ease;}
// @keyframes popIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
// .cl-ctx-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #edf0f5;background:#f8f9fb;}
// .cl-ctx-title{font-size:14px;font-weight:700;color:var(--cl-t1);}
// .cl-ctx-close{width:28px;height:28px;border-radius:50%;background:#e2e5eb;border:none;font-size:13px;color:var(--cl-t2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;}
// .cl-ctx-close:hover{background:var(--cl-t1);color:#fff;}
// .cl-ctx-body{padding:18px 20px;display:flex;flex-direction:column;gap:12px;}
// .cl-ctx-for{font-size:11px;font-weight:700;color:var(--cl-t3);padding:4px 10px;background:#f0f1f4;border-radius:4px;display:inline-block;align-self:flex-start;}
// .cl-ctx-chips{display:flex;flex-wrap:wrap;gap:6px;}
// .cl-ctx-chip{padding:5px 12px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:20px;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;transition:all .13s;user-select:none;}
// .cl-ctx-chip:hover{border-color:#a5b4fc;color:#4f46e5;background:#eef2ff;}
// .cl-ctx-chip-active{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}
// .cl-ctx-ta{width:100%;min-height:90px;padding:10px 12px;background:#f0f1f4;border:1.5px solid #dde0e6;border-radius:8px;font-family:inherit;font-size:13px;color:var(--cl-t1);line-height:1.6;resize:vertical;outline:none;}
// .cl-ctx-ta:focus{border-color:var(--cl-t1);background:#fff;}
// .cl-ctx-footer{display:flex;justify-content:flex-end;gap:10px;padding-top:8px;border-top:1px solid #f0f1f4;}
// .cl-ctx-cancel{padding:9px 18px;background:#fff;border:1.5px solid #dde0e6;border-radius:8px;font-size:13px;font-weight:600;color:var(--cl-t2);cursor:pointer;font-family:inherit;}
// .cl-ctx-go{padding:9px 18px;background:var(--cl-t1);border:none;border-radius:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;}
// .cl-ctx-go:hover{background:#2a3248;}

// /* ── MUI-STYLE FAB */
// .cl-rel-fab{position:fixed;bottom:28px;right:28px;z-index:3500;display:inline-flex;align-items:center;gap:8px;padding:13px 20px;background:var(--cl-t1);color:#fff;border:none;border-radius:40px;font-family:var(--cl-font);font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(30,36,51,.30);transition:all .2s cubic-bezier(.34,1.56,.64,1);user-select:none;}
// .cl-rel-fab:hover{background:#2a3248;box-shadow:0 8px 28px rgba(30,36,51,.40);transform:translateY(-2px);}
// .cl-fab-label{letter-spacing:.01em;}
// .cl-rel-fab.cl-fab-active{background:var(--cl-purple);box-shadow:0 6px 20px rgba(91,95,207,.40);}

// /* ── RELATIONSHIP DIALOG */
// .cl-rel-overlay{position:fixed;inset:0;background:rgba(15,20,35,.5);z-index:4000;display:none;align-items:flex-end;justify-content:flex-end;padding:28px;backdrop-filter:blur(3px);}
// .cl-rel-overlay.cl-rel-open{display:flex;}
// .cl-rel-dialog{background:#fff;border-radius:16px;width:100%;max-width:640px;max-height:78vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.25);animation:slideUp .25s cubic-bezier(.34,1.56,.64,1);}
// @keyframes slideUp{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
// .cl-rel-dhead{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #edf0f5;background:#f8f9fb;flex-shrink:0;}
// .cl-rel-dhead-left{display:flex;align-items:center;gap:11px;}
// .cl-rel-dhead-icon{width:36px;height:36px;background:var(--cl-purple-lt);border:1px solid #c5c8f5;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--cl-purple);}
// .cl-rel-dhead-title{font-size:14px;font-weight:700;color:var(--cl-t1);}
// .cl-rel-dhead-sub{font-size:11px;color:var(--cl-t3);margin-top:1px;}
// .cl-rel-dclose{width:28px;height:28px;border-radius:50%;background:#e2e5eb;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t2);transition:all .12s;}
// .cl-rel-dclose:hover{background:var(--cl-t1);color:#fff;}
// .cl-rel-tabs{display:flex;border-bottom:1px solid #edf0f5;padding:0 20px;flex-shrink:0;overflow-x:auto;}
// .cl-rel-tab{padding:10px 13px;background:none;border:none;border-bottom:2px solid transparent;font-family:inherit;font-size:12px;font-weight:600;color:var(--cl-t3);cursor:pointer;white-space:nowrap;transition:all .13s;margin-bottom:-1px;}
// .cl-rel-tab:hover{color:var(--cl-t1);}
// .cl-rel-tab.active{color:var(--cl-purple);border-bottom-color:var(--cl-purple);}
// .cl-rel-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px;}
// .cl-rel-tab-desc{font-size:12px;color:var(--cl-t3);padding:8px 12px;background:#f8f9fb;border-radius:6px;border:1px solid #edf0f5;line-height:1.6;}
// .cl-rel-items{display:flex;flex-direction:column;gap:8px;}
// .cl-rel-item{border:1px solid var(--cl-border);border-radius:var(--cl-r-md);overflow:hidden;transition:border-color .13s;}
// .cl-rel-item:hover{border-color:#a5b4fc;}
// .cl-ri-exp{border-color:var(--cl-purple);box-shadow:0 2px 10px rgba(91,95,207,.12);}
// .cl-rel-item-main{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 15px;cursor:pointer;background:#fafbfc;transition:background .12s;gap:10px;}
// .cl-rel-item-main:hover{background:var(--cl-hover);}
// .cl-rel-item-left{display:flex;flex-direction:column;gap:5px;flex:1;min-width:0;}
// .cl-rel-item-top-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
// .cl-ri-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 8px;border-radius:4px;}
// .cl-ri-type{font-size:10px;font-weight:700;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:2px 8px;border-radius:10px;}
// .cl-ri-status{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;}
// .cl-rs-active{background:#dcfce7;color:#15803d;}.cl-rs-super{background:#fef3c7;color:#b45309;}.cl-rs-other{background:#f1f5f9;color:#64748b;}
// .cl-ri-title{font-size:13px;font-weight:600;color:var(--cl-t1);line-height:1.4;}
// .cl-ri-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
// .cl-ri-reg,.cl-ri-date{font-size:11px;color:var(--cl-t2);}
// .cl-ri-tag{font-size:9px;font-weight:700;padding:2px 7px;background:#f0f1f4;border:1px solid var(--cl-border);border-radius:10px;color:var(--cl-t2);}
// .cl-ri-arrow{color:var(--cl-t3);display:flex;align-items:center;flex-shrink:0;margin-top:2px;transition:transform .2s;}
// .cl-ri-exp .cl-ri-arrow{transform:rotate(180deg);}
// .cl-rel-detail{display:none;border-top:1px solid #edf0f5;}
// .cl-rel-detail.open{display:block;animation:fadeIn .18s ease;}
// .cl-rel-detail-inner{padding:14px 16px;display:flex;flex-direction:column;gap:12px;}
// .cl-rd-section{}
// .cl-rd-sec-label{font-size:9.5px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
// .cl-rd-hierarchy{font-size:12.5px;color:var(--cl-t2);line-height:1.65;background:#f8f9fb;padding:9px 12px;border-radius:6px;border-left:3px solid var(--cl-purple);}
// .cl-rd-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--cl-border-lt);border-radius:6px;overflow:hidden;}
// .cl-rd-field{padding:8px 10px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt);background:#fbfcfd;}
// .cl-rd-field:nth-child(3n){border-right:none;}.cl-rd-field:nth-last-child(-n+3){border-bottom:none;}
// .cl-rd-label{display:block;font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
// .cl-rd-value{display:block;font-size:11.5px;font-weight:600;color:var(--cl-t1);}
// .cl-rd-links{display:flex;flex-wrap:wrap;gap:7px;}
// .cl-rd-link{padding:6px 13px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11.5px;font-weight:600;color:var(--cl-t2);cursor:pointer;text-decoration:none;transition:all .13s;display:inline-flex;align-items:center;gap:5px;}
// .cl-rd-link:hover{border-color:var(--cl-blue);color:var(--cl-blue);background:var(--cl-blue-lt);}
// .cl-rd-link-pri{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}.cl-rd-link-pri:hover{background:#2a3248;color:#fff;}

// /* ── EVIDENCE MODAL */
// .cl-modal-overlay{position:fixed;inset:0;background:rgba(20,25,40,.45);z-index:5000;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;backdrop-filter:blur(2px);}
// .cl-modal-ev{background:var(--cl-card);border-radius:var(--cl-r-lg);width:100%;max-width:820px;max-height:86vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:var(--cl-sh-md),0 0 0 1px var(--cl-border);font-family:inherit;}
// .cl-modal-head{padding:14px 20px;border-bottom:1px solid var(--cl-border-lt);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
// .cl-modal-head-left{flex:1;min-width:0;display:flex;align-items:center;gap:10px;}
// .cl-modal-clause-id{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 9px;border-radius:4px;flex-shrink:0;}
// .cl-modal-oblig-short{font-size:12px;color:var(--cl-t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
// .cl-modal-close{background:none;border:none;cursor:pointer;font-size:18px;color:var(--cl-t3);padding:2px 6px;flex-shrink:0;}
// .cl-modal-close:hover{color:var(--cl-t1);}
// .cl-ev-summary{display:flex;align-items:center;gap:8px;padding:10px 20px;background:var(--cl-nav-bg);border-bottom:1px solid var(--cl-border-lt);flex-shrink:0;flex-wrap:wrap;}
// .cl-ev-pill{font-size:11px;font-weight:600;color:var(--cl-t2);background:var(--cl-card);border:1px solid var(--cl-border);padding:3px 11px;border-radius:20px;}
// .cl-ev-pill-req{color:var(--cl-red);background:var(--cl-red-lt);border-color:#f5b8b8;}
// .cl-ev-pill-rec{color:var(--cl-amber);background:var(--cl-amber-lt);border-color:#fcd34d;}
// .cl-ev-pill-saved{color:var(--cl-green);background:var(--cl-green-lt);border-color:#6ee7b7;}
// .cl-ev-table-wrap{flex:1;overflow-y:auto;}
// .cl-ev-table{width:100%;border-collapse:collapse;table-layout:fixed;}
// .cl-ev-th-num{width:36px;}.cl-ev-th-st{width:110px;}.cl-ev-th-sv{width:70px;}
// .cl-ev-th{padding:10px 14px;background:#f0f4f8;border-bottom:2px solid var(--cl-border);font-size:10px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.07em;text-align:left;position:sticky;top:0;z-index:1;}
// .cl-ev-tr{border-bottom:1px solid var(--cl-border-lt);transition:background .13s;}
// .cl-ev-tr:hover{background:#f8fafc;}
// .cl-ev-tr-saved{background:var(--cl-green-lt)!important;}
// .cl-ev-td{padding:12px 14px;vertical-align:top;font-size:12.5px;color:var(--cl-t1);line-height:1.55;}
// .cl-ev-td-num{text-align:center;font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-t3);vertical-align:middle;}
// .cl-ev-td-st,.cl-ev-td-sv{vertical-align:middle;text-align:center;}
// .cl-ev-doc-name{font-size:12.5px;font-weight:700;margin-bottom:2px;}
// .cl-ev-doc-sub{font-size:10.5px;color:var(--cl-t3);margin-bottom:4px;}
// .cl-ev-doc-needed{font-size:11.5px;color:var(--cl-t2);line-height:1.55;}
// .cl-ev-badge{display:inline-block;font-size:9px;font-weight:700;padding:3px 9px;border-radius:4px;white-space:nowrap;}
// .cl-ev-badge-req{background:var(--cl-red-lt);color:var(--cl-red);}
// .cl-ev-badge-rec{background:var(--cl-amber-lt);color:var(--cl-amber);}
// .cl-ev-save-btn{padding:5px 11px;background:var(--cl-nav-bg);border:1.5px solid var(--cl-border);border-radius:6px;font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .13s;white-space:nowrap;}
// .cl-ev-save-btn:hover{border-color:var(--cl-green);color:var(--cl-green);background:var(--cl-green-lt);}
// .cl-ev-saved{background:var(--cl-green-lt)!important;border-color:#6ee7b7!important;color:var(--cl-green)!important;cursor:default!important;}
// .cl-modal-foot{padding:11px 20px;border-top:1px solid var(--cl-border-lt);background:var(--cl-nav-bg);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
// .cl-modal-foot-note{font-size:11px;color:var(--cl-t3);flex:1;line-height:1.5;}
// .cl-modal-btn{padding:7px 16px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .13s;}
// .cl-modal-btn-sec{background:var(--cl-card);border:1.5px solid var(--cl-border);color:var(--cl-t1);}.cl-modal-btn-sec:hover{background:var(--cl-hover);}
// .cl-modal-btn-pri{background:var(--cl-t1);border:none;color:#fff;}.cl-modal-btn-pri:hover{background:#2a3248;}

// /* loading */
// .ai-loading{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 20px;}
// .ai-loading-text{font-size:13px;color:#9499aa;font-family:var(--cl-font);}
// .spinner{width:28px;height:28px;border:3px solid #eef0f3;border-top-color:#1a1a2e;border-radius:50%;animation:spin .7s linear infinite;}
// @keyframes spin{to{transform:rotate(360deg)}}
//   `;
//   document.head.appendChild(s);
// }
/* ================================================================
   clause-panel-v4.js  —  Clause Breakdown Panel (v4)
   CHANGES vs v3:
   - LEFT NAV: Collapses when user clicks right panel (workspace)
   - LEFT NAV: Collapsible toggle button on nav head
   - RIGHT header: "Chapter 2" badge + title + total clauses COUNT in ONE aligned row
   - RIGHT header: Filter chips REMOVED (commented out)
   - CLAUSE ROW: White background, clause ID + title text (no badges inline),
                 right side shows obligation/action counts only
   - EXPAND: When expanded → row shows dept badge, risk badge, ⓘ icon, blue ✦ icon in same tab row
   - EXPAND: Only 2 tabs now: "Text & Info" | "Obligations" (Actions tab removed)
   - EXPAND: Footer "Regen with AI Context" removed from Text panel
   - OBLIGATIONS: Header row = number + title text + pen + search + ✦ + expand icon ONLY (one row)
   - OBLIGATIONS: Dept/page chip badges removed from obligation header
   - OBLIGATIONS: When expanded, meta strip shows, but does NOT repeat obl text below meta
   - OBLIGATIONS: "Regen with AI Context" button REMOVED from obl body (was in btn-row)
   - OBLIGATIONS: Actions still shown inside obligation body (unchanged)
   All modals (AI Context, Evidence, Relationship FAB) unchanged from v3
   ================================================================ */

/* ─────────────────────────────────────── BUILD */
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
          <button class="cl-back-btn" id="cl-back-btn">← Overview</button>
          <span class="cl-circ-id-chip" id="cl-circ-id-chip">—</span>
          <span class="cl-circ-name-chip" id="cl-circ-name-chip">—</span>
        </div>
        <div class="cl-topbar-right">
          <!-- Dept/risk dropdowns kept for programmatic filtering, hidden from topbar -->
          <select class="cl-filter-select" id="cl-filter-dept">
            <option value="">All Departments</option>
            <option>Compliance</option><option>Risk</option>
            <option>Operations</option><option>Legal</option>
            <option>Finance</option><option>IT</option><option>HR</option>
          </select>
          <select class="cl-filter-select" id="cl-filter-risk">
            <option value="">All Risk Levels</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div class="cl-level-toggle">
            <button class="cl-lvl-btn active" data-level="2">L2</button>
            <button class="cl-lvl-btn" data-level="3">L3</button>
          </div>
          <button class="cl-topbar-btn cl-btn-generate" id="cl-btn-generate">◈ Generate</button>

        </div>
      </div>

      <div class="cl-split" id="cl-split" style="display:none;">
        <!-- LEFT NAV -->
        <div class="cl-nav" id="cl-nav">
          <div class="cl-nav-head">
            <span class="cl-nav-title">Structure</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="cl-nav-count" id="cl-nav-count">—</span>
              <button class="cl-nav-collapse-btn" id="cl-nav-collapse-btn" onclick="clNavCollapse()" title="Collapse panel">‹</button>
            </div>
          </div>
          <div class="cl-nav-tree" id="cl-nav-tree">
            <div class="cl-nav-placeholder">Generate to view structure</div>
          </div>
        </div>

        <!-- RIGHT WORKSPACE -->
        <div class="cl-workspace" id="cl-workspace">
          <!-- Collapsed nav restore button -->
          <button class="cl-nav-expand-btn" id="cl-nav-expand-btn" onclick="clNavExpand()" title="Show structure" style="display:none;">››</button>
          <div class="cl-ws-placeholder" id="cl-ws-ph">
            <div class="cl-ws-ph-icon">📋</div>
            <div class="cl-ws-ph-title">Select a section</div>
            <div class="cl-ws-ph-sub">Click any section in the left panel to see its clauses</div>
          </div>
          <div id="cl-ws-main" style="display:none; padding:10px 24px;"></div>
        </div>
      </div>

      <div class="cl-footer" id="cl-footer" style="display:none;">
        <button class="cl-foot-save" id="cl-foot-save">🔖 &nbsp;Save Clauses</button>
      </div>
    </div>
  </div>`;
}

/* ─────────────────────────────────────── INIT */
function initClauseListeners() {
  injectSharedCSS();
  injectClauseCSS();
  _clInjectRelFAB();

  const circId = AI_LIFECYCLE_STATE.selectedCircularId;
  const circ = circId ? (CMS_DATA?.circulars || []).find(x => x.id === circId) : null;

  if (!circ) {
    document.getElementById('cl-empty').style.display = 'flex';
    document.getElementById('cl-main').style.display = 'none';
    return;
  }
  document.getElementById('cl-empty').style.display = 'none';
  document.getElementById('cl-main').style.display = 'block';
  document.getElementById('cl-circ-id-chip').textContent = circ.id;
  document.getElementById('cl-circ-name-chip').textContent = circ.title;
  window._CL_ACTIVE_CIRC = circ;
  window._CL_ACTIVE_SECTION_CLAUSES = [];
  window._CL_ACTIVE_LABELS = {};

  document.querySelectorAll('.cl-lvl-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.cl-lvl-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      /* Close any open expand so it re-renders fresh on next click */
      window._CL_ACTIVE_EXPANDED_CLAUSE = null;
      if (window._CL_ACTIVE_SECTION_CLAUSES?.length)
        _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
    });
  });

  /* Clicking the workspace collapses the nav */
  const ws = document.getElementById('cl-workspace');
  if (ws) {
    ws.addEventListener('click', function (e) {
      /* Only collapse if nav is open and the click is NOT on the expand button */
      const nav = document.getElementById('cl-nav');
      if (nav && !nav.classList.contains('cl-nav-collapsed') && !e.target.closest('#cl-nav-expand-btn')) {
        clNavCollapse();
      }
    }, { capture: false });
  }

document.getElementById('cl-btn-generate')?.addEventListener('click', () => _clRunGenerate(circ));
  document.getElementById('cl-back-btn')?.addEventListener('click', () => {
    document.querySelector('[data-tab="overview"]')?.click();
  });

  document.getElementById('cl-filter-dept')?.addEventListener('change', () => {
    if (window._CL_ACTIVE_SECTION_CLAUSES?.length)
      _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
  });
  document.getElementById('cl-filter-risk')?.addEventListener('change', () => {
    if (window._CL_ACTIVE_SECTION_CLAUSES?.length)
      _clRenderStack(window._CL_ACTIVE_SECTION_CLAUSES, window._CL_ACTIVE_LABELS);
  });
  document.getElementById('cl-foot-save')?.addEventListener('click', function () {
    this.textContent = '✓ Saved'; this.disabled = true; showToast('Saved to library.', 'success');
  });
}

/* ─────────────────────────────────────── NAV COLLAPSE / EXPAND */
window.clNavCollapse = function () {
  const nav = document.getElementById('cl-nav');
  const expandBtn = document.getElementById('cl-nav-expand-btn');
  const split = document.getElementById('cl-split');
  if (!nav) return;
  nav.classList.add('cl-nav-collapsed');
  if (expandBtn) expandBtn.style.display = 'flex';
  if (split) split.style.gridTemplateColumns = '0px 1fr';
};

window.clNavExpand = function () {
  const nav = document.getElementById('cl-nav');
  const expandBtn = document.getElementById('cl-nav-expand-btn');
  const split = document.getElementById('cl-split');
  if (!nav) return;
  nav.classList.remove('cl-nav-collapsed');
  if (expandBtn) expandBtn.style.display = 'none';
  if (split) split.style.gridTemplateColumns = '248px 1fr';
};

/* ─────────────────────────────────────── GENERATE */
function _clRunGenerate(circ) {
  document.getElementById('cl-nav-tree').innerHTML =
    `<div class="cl-nav-loading">${loadingHTML('Building structure…')}</div>`;
  _clResetWorkspace();
  setTimeout(() => {
    document.getElementById('cl-split').style.display = 'grid';
    _clBuildTree(circ);
    const f = document.getElementById('cl-footer');
    f.style.display = 'flex'; f.style.opacity = '0'; f.style.transition = 'opacity .3s';
    requestAnimationFrame(() => requestAnimationFrame(() => { f.style.opacity = '1'; }));
  }, 1200);
}

function _clResetWorkspace() {
  document.getElementById('cl-ws-ph').style.display = 'flex';
  const m = document.getElementById('cl-ws-main');
  m.style.display = 'none'; m.innerHTML = '';
  window._CL_ACTIVE_SECTION_CLAUSES = [];
  window._CL_ACTIVE_EXPANDED_CLAUSE = null;
}

/* ─────────────────────────────────────── LEFT NAV TREE */
function _clBuildTree(circ) {
  const navTree = document.getElementById('cl-nav-tree');
  const navCount = document.getElementById('cl-nav-count');

  let total = 0;
  (circ.chapters || []).forEach(ch => { total += (ch.clauses || []).length; });
  (circ.annexures || []).forEach(an => { total += (an.clauses || []).length; });
  if (!circ.chapters?.length && !circ.annexures?.length)
    total = (circ.clauses || []).length;
  if (navCount) navCount.textContent = `${total} clauses`;

  let html = '';

  /* — Chapters — */
  if (circ.chapters?.length) {
    circ.chapters.forEach((ch, ci) => {
      const chLabel = `Chapter ${ci + 1}`;
      let inner = '';
      if (ch.sections?.length) {
        ch.sections.forEach((sec, si) => {
          const secClauses = (sec.clauses || [])
            .map(id => (ch.clauses || []).find(c => c.id === id))
            .filter(Boolean);
          const secId = sec.id || '';
          const secTitle = sec.text || 'Section';
          const secLabel = `${secId ? secId + ' – ' : ''}${secTitle.substring(0, 34)}${secTitle.length > 34 ? '…' : ''}`;
          inner += `
          <div class="cl-nav-sec-group">
            <button class="cl-nav-sec-btn cl-nav-sec-btn-titled" data-key="${ci}-${si}"
              onclick="clNavSelect(event,${ci},${si},'${chLabel}','${secLabel.replace(/'/g, "\\'")}','${(ch.title || '').replace(/'/g, "\\'")}')">
              <div class="cl-nav-sec-info">
                <div class="cl-nav-sec-top-row">
                  <span class="cl-nav-sec-num">${secId || '§'}</span>
                  <span class="cl-nav-sec-count">${secClauses.length}</span>
                </div>
                <span class="cl-nav-sec-title-label">${secTitle.substring(0, 48)}${secTitle.length > 48 ? '…' : ''}</span>
              </div>
            </button>
          </div>`;
        });
      } else {
        inner = `<button class="cl-nav-all-btn"
          onclick="clNavSelectChapter(event,${ci},'${chLabel}','${(ch.title || '').replace(/'/g, "\\'")}')">
          View all ${(ch.clauses || []).length} clauses →
        </button>`;
      }
      html += `
      <div class="cl-nav-chapter">
        <button class="cl-nav-ch-btn" onclick="clNavToggleCh(this,'cl-ch-body-${ci}','cl-ch-arr-${ci}')">
          <span class="cl-nav-ch-arrow" id="cl-ch-arr-${ci}">▶</span>
          <div class="cl-nav-ch-info">
            <span class="cl-nav-ch-num">${chLabel}</span>
            <span class="cl-nav-ch-label">${ch.title || ''}</span>
          </div>
          <span class="cl-nav-ch-count">${(ch.clauses || []).length}</span>
        </button>
        <div class="cl-nav-ch-body" id="cl-ch-body-${ci}">${inner}</div>
      </div>`;
    });
  }

  /* — Annexures — */
  if (circ.annexures?.length) {
    html += `<div class="cl-nav-group-head">Annexures</div>`;
    circ.annexures.forEach((an, ai) => {
      const lbl = `${an.id || ''} – ${(an.title || 'Annexure').substring(0, 28)}`;
      html += `
      <div class="cl-nav-sec-group">
        <button class="cl-nav-sec-btn" data-ann="${ai}"
          onclick="clNavSelectAnn(event,${ai},'${lbl.replace(/'/g, "\\'")}')">
          <span class="cl-nav-sec-icon cl-nav-ann-icon">A</span>
          <span class="cl-nav-sec-label">${lbl}</span>
          <span class="cl-nav-sec-count">${(an.clauses || []).length}</span>
          <span class="cl-nav-sec-arrow">›</span>
        </button>
      </div>`;
    });
  }

  /* — Flat clauses (no chapters/annexures) — */
  if (!circ.chapters?.length && !circ.annexures?.length && circ.clauses?.length) {
    html += `<div class="cl-nav-group-head">Clauses</div>`;
    circ.clauses.forEach((cl) => {
      html += `
      <button class="cl-nav-sec-btn cl-nav-flat-btn"
        onclick="clNavSelectFlat(event,'${cl.id}')">
        <span class="cl-nav-sec-icon" style="font-family:monospace;">${cl.id}</span>
        <span class="cl-nav-sec-label">${(cl.text || '').substring(0, 32)}${(cl.text || '').length > 32 ? '…' : ''}</span>
      </button>`;
    });
  }

  navTree.innerHTML = html || '<div class="cl-nav-placeholder">No structure found.</div>';
}

/* Nav collapse/expand — immediate */
window.clNavToggleCh = function (btn, bodyId, arrId) {
  const body = document.getElementById(bodyId);
  const arr = document.getElementById(arrId);
  if (!body) return;
  const open = body.classList.toggle('open');
  if (arr) arr.textContent = open ? '▼' : '▶';
};

window.clNavSelect = function (e, chIdx, secIdx, chLabel, secLabel, chTitle) {
  e.stopPropagation();
  _clSetNavActive(e.currentTarget);
  const circ = window._CL_ACTIVE_CIRC;
  const ch = circ?.chapters?.[chIdx];
  if (!ch) return;
  const sec = ch.sections?.[secIdx];
  const clauses = (sec?.clauses || [])
    .map(id => (ch.clauses || []).find(c => c.id === id))
    .filter(Boolean);
  window._CL_ACTIVE_SECTION_CLAUSES = clauses;
  window._CL_ACTIVE_LABELS = { chLabel, secLabel, chTitle };
  _clRenderStack(clauses, { chLabel, secLabel, chTitle });
};

window.clNavSelectChapter = function (e, chIdx, chLabel, chTitle) {
  e.stopPropagation();
  _clSetNavActive(e.currentTarget);
  const circ = window._CL_ACTIVE_CIRC;
  const ch = circ?.chapters?.[chIdx];
  if (!ch) return;
  window._CL_ACTIVE_SECTION_CLAUSES = ch.clauses || [];
  window._CL_ACTIVE_LABELS = { chLabel, secLabel: 'All Clauses', chTitle };
  _clRenderStack(ch.clauses || [], { chLabel, secLabel: 'All Clauses', chTitle });
};

window.clNavSelectAnn = function (e, annIdx, lbl) {
  e.stopPropagation();
  _clSetNavActive(e.currentTarget);
  const circ = window._CL_ACTIVE_CIRC;
  const an = circ?.annexures?.[annIdx];
  if (!an) return;
  const clauses = an.clauses || [];
  window._CL_ACTIVE_SECTION_CLAUSES = clauses;
  window._CL_ACTIVE_LABELS = { chLabel: 'Annexure', secLabel: an.title || lbl, chTitle: an.title || '' };
  _clRenderStack(clauses, { chLabel: 'Annexure', secLabel: an.title || lbl, chTitle: an.title || '' });
};

window.clNavSelectFlat = function (e, clauseId) {
  e.stopPropagation();
  _clSetNavActive(e.currentTarget);
  const circ = window._CL_ACTIVE_CIRC;
  const clauses = circ?.clauses || [];
  window._CL_ACTIVE_SECTION_CLAUSES = clauses;
  window._CL_ACTIVE_LABELS = { chLabel: 'Clauses', secLabel: '', chTitle: '' };
  _clRenderStack(clauses, { chLabel: 'Clauses', secLabel: '', chTitle: '' });
};

function _clSetNavActive(btn) {
  document.querySelectorAll('.cl-nav-sec-btn, .cl-nav-flat-btn')
    .forEach(b => b.classList.remove('cl-nav-active'));
  btn.classList.add('cl-nav-active');
}

/* ─────────────────────────────────────── RIGHT PANEL: CLAUSE STACK (L1)
   Header: [Chapter 2 badge] [Chapter title] ———————— [N clauses]  in one row
   Filter chips: REMOVED (commented out)
   Clause row: white bg, ID + title text (no inline badges), counts on right
*/
function _clRenderStack(allClauses, labels) {
  /* dropdowns still apply silently if set programmatically */
  const dept = document.getElementById('cl-filter-dept')?.value || '';
  const risk = document.getElementById('cl-filter-risk')?.value || '';

  const filtered = allClauses.filter(cl => {
    if (dept && cl.department !== dept) return false;
    if (risk && cl.risk !== risk) return false;
    return true;
  });

  const ws = document.getElementById('cl-ws-main');
  const ph = document.getElementById('cl-ws-ph');
  ph.style.display = 'none';
  ws.style.display = 'block';
  window._CL_ACTIVE_EXPANDED_CLAUSE = null;

  ws.innerHTML = `
  <div class="cl-stack-wrap">
    <!-- HEADER: chapter badge + title + count all in ONE aligned row -->
    <div class="cl-stack-header">
      <div class="cl-stack-header-left">
        ${labels.chLabel ? `<span class="cl-stack-ch-num">${labels.chLabel}</span>` : ''}
        ${labels.chTitle ? `<span class="cl-stack-ch-title">${labels.chTitle}</span>` : ''}
        ${labels.secLabel ? `<span class="cl-stack-sec-sep">·</span><span class="cl-stack-sec-label">${labels.secLabel}</span>` : ''}
      </div>
      <span class="cl-stack-count">${filtered.length} clause${filtered.length !== 1 ? 's' : ''}</span>
    </div>

    <!-- FILTER CHIPS — commented out as requested
    <div class="cl-filter-chips" id="cl-filter-chips">
      <span class="cl-chip-label">Filter:</span>
      <button class="cl-fchip active" data-fs="">All</button>
      <button class="cl-fchip" data-fs="High">High Risk</button>
      <button class="cl-fchip" data-fs="Open">Open Items</button>
      <button class="cl-fchip" data-fs="In Progress">In Progress</button>
    </div>
    -->

    <!-- CLAUSE LIST -->
    <div class="cl-stack-list" id="cl-stack-list">
      ${filtered.length
        ? filtered.map(cl => _clClauseRowHTML(cl)).join('')
        : `<div class="cl-stack-empty">No clauses found.</div>`
      }
    </div>
  </div>`;

  /* Row click → toggle inline expand */
  ws.querySelectorAll('.cl-clause-row').forEach(row => {
    row.addEventListener('click', function () {
      const cid = this.dataset.cid;
      _clToggleInlineExpand(cid, allClauses);
    });
  });
}

/* Clause row: white bg, ID chip + title text left, counts right
   No risk/dept badges inline — those appear inside the expand tabs row */
function _clClauseRowHTML(cl) {
  const oblCount = cl.obligations
    ? (Array.isArray(cl.obligations) ? cl.obligations.length : 1)
    : (cl.obligation ? (Array.isArray(cl.obligation) ? cl.obligation.length : 1) : 0);
  const actCount = Array.isArray(cl.actionables) ? cl.actionables.length : 0;
  return `
  <div class="cl-clause-row" id="cl-row-${cl.id}" data-cid="${cl.id}">
    <span class="cl-row-id">${cl.id}</span>
    <span class="cl-row-title-text">${cl.text || ''}</span>
    <div class="cl-row-right">
      ${oblCount ? `<span class="cl-row-pill">${oblCount} Obligations</span>` : ''}
      ${actCount ? `<span class="cl-row-pill">${actCount} Actions</span>` : ''}
      <span class="cl-row-arrow" id="cl-rowarr-${cl.id}">▾</span>
    </div>
  </div>
  <div class="cl-inline-expand" id="cl-expand-${cl.id}" style="display:none;"></div>`;
}

/* Toggle inline clause expansion */
function _clToggleInlineExpand(clauseId, allClauses) {
  const row = document.getElementById(`cl-row-${clauseId}`);
  const expand = document.getElementById(`cl-expand-${clauseId}`);
  const arr = document.getElementById(`cl-rowarr-${clauseId}`);
  if (!row || !expand) return;

  const isOpen = row.classList.contains('cl-row-expanded');

  /* Close all */
  document.querySelectorAll('.cl-clause-row').forEach(r => r.classList.remove('cl-row-expanded'));
  document.querySelectorAll('.cl-inline-expand').forEach(e => { e.style.display = 'none'; });
  document.querySelectorAll('.cl-row-arrow').forEach(a => a.classList.remove('open'));

  if (!isOpen) {
    row.classList.add('cl-row-expanded');
    expand.style.display = 'block';
    if (arr) arr.classList.add('open');
    window._CL_ACTIVE_EXPANDED_CLAUSE = clauseId;
    const cl = allClauses.find(c => c.id === clauseId);
    if (cl) _clBuildExpand(expand, cl, window._CL_ACTIVE_CIRC);
  }
}

/* ─────────────────────────────────────── INLINE EXPAND (L2)
   Tab row shows: [Text & Info] [Obligations]
   SAME tab row ALSO shows on the right: dept badge, risk badge, ⓘ, ✦ star icon
   Actions tab REMOVED — actions live inside the Obligations accordion body
*/
function _clBuildExpand(el, cl, circ) {
  const riskCls = cl.risk === 'High' ? 'cl-wc-risk-high' : cl.risk === 'Medium' ? 'cl-wc-risk-medium' : 'cl-wc-risk-low';
  const metaId = `cl-meta-expand-${cl.id}`;

  el.innerHTML = `
  <div class="cl-expand-wrap">
    <!-- TAB ROW: tabs left, badges + icons right — ALL IN ONE ROW -->
    <div class="cl-expand-tabrow" id="cl-etabs-${cl.id}">
      <div class="cl-expand-tabs-left">
        <button class="cl-etab active" data-ti="0">Text &amp; Info</button>
        <button class="cl-etab" data-ti="1">Obligations</button>
      </div>
      <div class="cl-expand-tabs-right">
        ${cl.risk ? `<span class="cl-wc-badge ${riskCls}">${cl.risk}</span>` : ''}
        ${cl.department ? `<span class="cl-wc-badge cl-wc-dept">${cl.department}</span>` : ''}
        ${cl.pageNo ? `<button class="cl-wc-page-chip" onclick="clOpenDocPage(${cl.pageNo})">📄 Page ${cl.pageNo}</button>` : ''}
        <button class="cl-wc-info-btn" data-meta="${metaId}" title="Regulatory details">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </button>
        <button class="cl-wc-regen-btn cl-wc-star-btn" onclick="_clOpenCtxModal('clause_${cl.id}','Clause ${cl.id}')" title="Add Business Context">✦</button>
      </div>
    </div>

    <!-- METADATA TABLE (hidden until ⓘ clicked) — sits just below tab row, spans full width -->
    <div class="cl-meta-table-wrap" id="${metaId}" style="display:none;">
      <div class="cl-meta-table-inner">
        ${_clMetaFields(_clMockDetailMeta(0)).map(f => `
        <div class="cl-meta-row">
          <span class="cl-meta-label">${f.label}</span>
          <span class="cl-meta-value">${f.value}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="cl-expand-body" id="cl-ebody-${cl.id}">
      <div class="cl-expand-panel" data-panel="0">${_clBuildTextPanel(cl, circ)}</div>
      <div class="cl-expand-panel" data-panel="1" style="display:none;">${_clBuildOblPanel(cl)}</div>
    </div>
  </div>`;

  /* Tab switching */
  el.querySelectorAll('.cl-etab').forEach(tab => {
    tab.addEventListener('click', function () {
      el.querySelectorAll('.cl-etab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      el.querySelectorAll('.cl-expand-panel').forEach((p, i) => {
        p.style.display = parseInt(this.dataset.ti) === i ? '' : 'none';
      });
    });
  });

  /* ⓘ metadata toggle */
  el.querySelectorAll('.cl-wc-info-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const metaEl = document.getElementById(this.dataset.meta);
      if (!metaEl) return;
      const vis = metaEl.style.display !== 'none';
      metaEl.style.display = vis ? 'none' : 'block';
      this.classList.toggle('cl-wc-info-btn-active', !vis);
    });
  });

  /* Obligation accordions — L3: full row click opens body; L2: ⓘ button only opens meta strip */
  const activeLevel = document.querySelector('.cl-lvl-btn.active')?.dataset.level || '2';
  el.querySelectorAll('.cl-oblig-item').forEach(item => {
    const trigger = item.querySelector('.cl-oblig-header');
    const body = item.querySelector('.cl-oblig-body');
    const arrow = item.querySelector('.cl-oblig-arr');
    const metaToggleBtn = item.querySelector('.cl-oblig-meta-toggle-btn');
    if (!trigger || !body) return;

    if (activeLevel === '3') {
      trigger.addEventListener('click', () => {
        const uid = item.id.replace('cl-oblig-', '');
        const metaEl = document.getElementById(`cl-oblig-meta-${uid}`);
        const open = body.classList.contains('open');
        el.querySelectorAll('.cl-oblig-body.open').forEach(b => b.classList.remove('open'));
        el.querySelectorAll('.cl-oblig-arr.rotated').forEach(a => a.classList.remove('rotated'));
        el.querySelectorAll('.cl-oblig-meta-strip.cl-meta-strip-open').forEach(s => s.classList.remove('cl-meta-strip-open'));
        if (!open) {
          body.classList.add('open');
          arrow?.classList.add('rotated');
          metaEl?.classList.add('cl-meta-strip-open');
        }
      });
    }

    if (activeLevel === '2' && metaToggleBtn) {
      metaToggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        const uid = metaToggleBtn.dataset.uid;
        const metaEl = document.getElementById(`cl-oblig-meta-${uid}`);
        if (!metaEl) return;
        const open = metaEl.classList.contains('cl-meta-strip-open');
        el.querySelectorAll('.cl-oblig-meta-strip.cl-meta-strip-open').forEach(s => s.classList.remove('cl-meta-strip-open'));
        el.querySelectorAll('.cl-oblig-meta-toggle-btn.active').forEach(b => b.classList.remove('active'));
        if (!open) { metaEl.classList.add('cl-meta-strip-open'); metaToggleBtn.classList.add('active'); }
      });
    }
  });

  /* Obligation inline edit — pen button */
  el.querySelectorAll('.cl-oblig-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const uid = btn.dataset.uid;
      document.getElementById(`cl-oblig-view-${uid}`).style.display = 'none';
      document.getElementById(`cl-oblig-edit-${uid}`).style.display = 'block';
      document.getElementById(`cl-oblig-editbar-${uid}`).style.display = 'flex';
      btn.style.display = 'none';
      document.getElementById(`cl-oblig-edit-${uid}`).focus();
    });
  });
  el.querySelectorAll('.cl-oblig-edit-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      document.getElementById(`cl-oblig-view-${uid}`).style.display = 'block';
      document.getElementById(`cl-oblig-edit-${uid}`).style.display = 'none';
      document.getElementById(`cl-oblig-editbar-${uid}`).style.display = 'none';
      document.getElementById(`cl-oblig-editbtn-${uid}`).style.display = 'inline-flex';
    });
  });
  el.querySelectorAll('.cl-oblig-edit-save').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      const ta = document.getElementById(`cl-oblig-edit-${uid}`);
      const view = document.getElementById(`cl-oblig-view-${uid}`);
      if (view && ta) view.textContent = ta.value;
      view.style.display = 'block'; ta.style.display = 'none';
      document.getElementById(`cl-oblig-editbar-${uid}`).style.display = 'none';
      document.getElementById(`cl-oblig-editbtn-${uid}`).style.display = 'inline-flex';
      showToast('Obligation updated.', 'success');
    });
  });

  /* Action ⓘ toggle */
  el.querySelectorAll('.cl-action-info-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const panel = document.getElementById(btn.dataset.panel);
      if (!panel) return;
      const open = panel.classList.contains('open');
      el.querySelectorAll('.cl-action-meta-panel.open').forEach(p => p.classList.remove('open'));
      el.querySelectorAll('.cl-action-info-btn.active').forEach(b => b.classList.remove('active'));
      if (!open) { panel.classList.add('open'); btn.classList.add('active'); }
    });
  });

  /* Evidence buttons */
  el.querySelectorAll('.cl-ev-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      try {
        const acts = JSON.parse(atob(this.dataset.actions));
        clShowEvidenceModal(this.dataset.clauseId, acts, this.dataset.obligation);
      } catch (e) { showToast('Error.', 'error'); }
    });
  });
}

/* ─────────────────────────────────────── TAB 1: TEXT & INFO
   No footer "Regen with AI Context" button
   Full clause text only
*/
function _clBuildTextPanel(cl, circ) {
  return `
  <div class="cl-text-panel">
    <div class="cl-tp-text">${cl.text || ''}</div>
  </div>`;
}

/* ─────────────────────────────────────── TAB 2: OBLIGATIONS
   Each obligation header row (one line):
     [O1 num] [obligation text preview — truncated]  [✎ pen] [🔍 search/evidence] [✦ star] [▾ expand]
   NO dept/page chips in header.
   When expanded: meta strip → then actions (NO repeated obl text, NO regen-with-AI btn)
*/
function _clBuildOblPanel(cl) {
  const obligsRaw = cl.obligations || cl.obligation || null;
  const actionsRaw = cl.actionables || [];
  const obligsArray = Array.isArray(obligsRaw) ? obligsRaw
    : typeof obligsRaw === 'string' ? [obligsRaw] : null;
  const actionsArray = Array.isArray(actionsRaw) ? actionsRaw
    : typeof actionsRaw === 'string' ? actionsRaw.split(';').map(a => a.trim()).filter(Boolean) : [];

  const MOCK_OBL = [
    { text: 'Establish and maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.', actions: ['Draft or update the compliance policy', 'Present policy to Board for formal approval', 'Distribute updated policy to all departments', 'Schedule annual review and assign policy owner'] },
    { text: 'All relevant staff must complete mandatory training on obligations under this circular within 60 days of the effective date.', actions: ['Identify all staff roles impacted', 'Design training module covering key requirements', 'Track completion records in HR system', 'Conduct re-training annually or upon material amendment'] },
    { text: 'The entity shall implement robust internal controls and conduct periodic testing to verify operational effectiveness.', actions: ['Map all processes to control owners', 'Design control tests and document methodology', 'Execute quarterly control testing', 'Escalate control failures to senior management within 5 business days'] },
  ];

  const obligs = obligsArray
    ? obligsArray.map((ob) => ({
        text: typeof ob === 'string' ? ob : (ob.text || '—'),
        actions: actionsArray
      }))
    : MOCK_OBL;

  if (!obligs.length)
    return '<div class="cl-oblig-empty">No obligations found.</div>';

  return `<div class="cl-oblig-list">
    ${obligs.map((ob, oi) => {
      const m = _clObligMeta(oi);
      const uid = `${cl.id}-${oi}`;
      const actList = ob.actions || actionsArray;
      const previewText = ob.text.substring(0, 80) + (ob.text.length > 80 ? '…' : '');
      return `
      <div class="cl-oblig-item" id="cl-oblig-${uid}">

        <!-- HEADER: one single row — num | text preview | pen | search | star | expand -->
        <div class="cl-oblig-header">
          <span class="cl-oblig-num">O${oi + 1}</span>
          <span class="cl-oblig-preview" id="cl-oblig-view-${uid}">${previewText}</span>
          <div class="cl-oblig-hdr-icons">
            <button class="cl-oblig-icon-btn cl-oblig-edit-btn" id="cl-oblig-editbtn-${uid}" data-uid="${uid}" title="Edit obligation">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="cl-oblig-icon-btn cl-ev-btn" data-clause-id="${cl.id}" data-actions="${btoa(JSON.stringify(actList))}" data-obligation="${ob.text.substring(0, 120)}" title="AI Evidence">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            ${document.querySelector('.cl-lvl-btn.active')?.dataset.level === '2'
              ? `<button class="cl-oblig-icon-btn cl-oblig-meta-toggle-btn" data-uid="${uid}" title="Show meta details">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </button>`
              : `<span class="cl-oblig-arr" title="Expand">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </span>`
            }
          </div>
        </div>

        <!-- Inline edit area (hidden by default) -->
        <textarea class="cl-oblig-edit-ta" id="cl-oblig-edit-${uid}" style="display:none;">${ob.text}</textarea>
        <div class="cl-oblig-editbar" id="cl-oblig-editbar-${uid}" style="display:none;">
          <button class="cl-oblig-edit-cancel" data-uid="${uid}">Cancel</button>
          <button class="cl-oblig-edit-save" data-uid="${uid}">Save</button>
        </div>

        <!-- Meta strip: outside body so L2 ⓘ can show it independently -->
        <div class="cl-oblig-meta-strip" id="cl-oblig-meta-${uid}">
          <div class="cl-oblig-meta-field"><span class="cl-omf-label">Due Date</span><span class="cl-omf-value">${m.dueDate}</span></div>
          <div class="cl-oblig-meta-field"><span class="cl-omf-label">Section</span><span class="cl-omf-value">${m.section}</span></div>
          <div class="cl-oblig-meta-field"><span class="cl-omf-label">Sub-section</span><span class="cl-omf-value">${m.subset}</span></div>
          <div class="cl-oblig-meta-field"><span class="cl-omf-label">Category</span><span class="cl-omf-value">${m.category}</span></div>
          <div class="cl-oblig-meta-field"><span class="cl-omf-label">Frequency</span><span class="cl-omf-value">${m.frequency}</span></div>
        </div>

        <!-- Accordion body: actions only -->
        <div class="cl-oblig-body" id="cl-oblig-body-${uid}">

          ${actList.length && document.querySelector('.cl-lvl-btn.active')?.dataset.level === '3' ? `
          <div class="cl-actions-wrap">
            <div class="cl-actions-title">
              <span>Actions</span>
              <span class="cl-actions-badge">${actList.length}</span>
            </div>
            <div class="cl-actions-list">
              ${actList.map((a, ai) => {
                const m2 = _clObligMeta(ai);
                const panelId = `cl-act-meta-${uid}-${ai}`;
                return `
                <div class="cl-action-item">
                  <div class="cl-action-main-row">
                    <span class="cl-action-num">${ai + 1}</span>
                    <span class="cl-action-text">${a}</span>
                    <button class="cl-action-info-btn" data-panel="${panelId}" title="Show parameters">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
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
          </div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

/* ─────────────────────────────────────── METADATA HELPERS (unchanged) */
function _clMockDetailMeta(i) {
  const d = [
    { regulatoryBody: 'RBI', legalArea: 'Banking Regulation', subLegalArea: 'Prudential Norms', act: 'Banking Regulation Act 1949', section: 'Section 12', subset: 'Clause (a)', category: 'Mandatory Compliance', frequency: 'Monthly', dueDate: '15th of following month' },
    { regulatoryBody: 'SEBI', legalArea: 'Securities Law', subLegalArea: 'Market Conduct', act: 'SEBI Act 1992', section: 'Section 21', subset: 'Clause (b)', category: 'Periodic Reporting', frequency: 'Quarterly', dueDate: '30 days from FY end' },
    { regulatoryBody: 'IRDAI', legalArea: 'Insurance Law', subLegalArea: 'Solvency', act: 'Insurance Act 1938', section: 'Section 34A', subset: 'Sub-section (1)', category: 'System Control', frequency: 'Half-Yearly', dueDate: 'Within 7 business days' },
  ]; return d[i % d.length];
}
function _clMetaFields(meta) {
  return [
    { label: 'Regulatory Body', value: meta.regulatoryBody },
    { label: 'Legislative Area', value: meta.legalArea },
    { label: 'Sub-Legislative Area', value: meta.subLegalArea },
    { label: 'Act', value: meta.act },
    { label: 'Section', value: meta.section },
    { label: 'Sub-section', value: meta.subset },
    { label: 'Category', value: meta.category },
    { label: 'Frequency', value: meta.frequency },
    { label: 'Due Date', value: meta.dueDate },
  ];
}
function _clObligMeta(i) {
  const F = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual', 'Ongoing', 'One-time'];
  const D = ['15th of following month', '30 days from FY end', 'Within 7 business days', 'On occurrence', '31st March', 'Within 60 days'];
  const S = ['Section 12', 'Section 21', 'Section 34A', 'Section 19', 'Section 134', 'Section 80C'];
  const SS = ['Clause (a)', 'Clause (b)', 'Sub-section (1)', 'Sub-section (2)', 'Proviso', 'Explanation'];
  const C = ['Mandatory Compliance', 'Periodic Reporting', 'System Control', 'Governance', 'Disclosure', 'Risk Management'];
  return { frequency: F[i % 6], dueDate: D[i % 6], section: S[i % 6], subset: SS[i % 6], category: C[i % 6] };
}

window.clOpenDocPage = function (p) {
  const circ = window._CL_ACTIVE_CIRC;
  const docUrl = circ?.docUrl || './RBI Master Circular.pdf';
  window.open(`${docUrl}#page=${p || 1}`, '_blank');
};

/* ─────────────────────────────────────── AI CONTEXT MODAL (unchanged) */
window._clOpenCtxModal = function (target, label) {
  window._clCtxTarget = target;
  let modal = document.getElementById('cl-ctx-modal');
  if (!modal) {
    modal = document.createElement('div'); modal.id = 'cl-ctx-modal'; modal.className = 'cl-ctx-overlay';
    modal.innerHTML = `
    <div class="cl-ctx-box" onclick="event.stopPropagation()">
      <div class="cl-ctx-head">
        <div class="cl-ctx-title">✦ Regenerate with AI Context</div>
        <button class="cl-ctx-close" onclick="_clCloseCtxModal()">✕</button>
      </div>
      <div class="cl-ctx-body">
        <div class="cl-ctx-for" id="cl-ctx-for-lbl"></div>
        <div class="cl-ctx-scope-row">
          <span class="cl-ctx-scope-label">Scope:</span>
          <div class="cl-ctx-scope-toggle">
            <button class="cl-ctx-scope-btn active" data-scope="clause">Clause</button>
            <button class="cl-ctx-scope-btn" data-scope="obligation">Obligation</button>
            <button class="cl-ctx-scope-btn" data-scope="action">Action</button>
          </div>
        </div>
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
    modal.addEventListener('click', e => { if (e.target === modal) _clCloseCtxModal(); });
    modal.addEventListener('click', e => {
      if (e.target.classList.contains('cl-ctx-scope-btn')) {
        modal.querySelectorAll('.cl-ctx-scope-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
    document.body.appendChild(modal);
  }
  document.getElementById('cl-ctx-for-lbl').textContent = `Regenerating: ${label}`;
  modal.classList.add('cl-ctx-open');
  setTimeout(() => document.getElementById('cl-ctx-ta')?.focus(), 50);
};
window._clCloseCtxModal = function () {
  document.getElementById('cl-ctx-modal')?.classList.remove('cl-ctx-open');
  document.querySelectorAll('.cl-ctx-chip').forEach(c => c.classList.remove('cl-ctx-chip-active'));
  const ta = document.getElementById('cl-ctx-ta'); if (ta) ta.value = '';
};
window._clChipToggle = function (el, text) {
  el.classList.toggle('cl-ctx-chip-active');
  const ta = document.getElementById('cl-ctx-ta');
  ta.value = el.classList.contains('cl-ctx-chip-active')
    ? (ta.value ? ta.value + '\n' + text : text)
    : ta.value.replace(text, '').replace(/\n+/g, '\n').trim();
};
window._clSubmitCtx = function () {
  const scope = document.querySelector('.cl-ctx-scope-btn.active')?.dataset.scope || 'clause';
  _clCloseCtxModal();
  showToast(`✓ Regenerating ${scope} with context…`, 'success');
};

/* ─────────────────────────────────────── RELATIONSHIP FAB (unchanged from v3) */
function _clInjectRelFAB() {
  if (document.getElementById('cl-rel-fab')) return;

  const fab = document.createElement('button');
  fab.id = 'cl-rel-fab'; fab.className = 'cl-rel-fab'; fab.title = 'Circular Relationships';
  fab.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
    <span class="cl-fab-label">Lineage</span>`;
  fab.addEventListener('click', clOpenRelDialog);
  document.body.appendChild(fab);

  const REL_DATA = {
    type: { label: 'Circular', desc: 'Classification of this circular in the regulatory hierarchy.', items: [{ id: 'RBI-HF-2024-001', type: 'Master Circular', title: 'Master Circular on Housing Finance', reg: 'RBI', date: '2024-04-02', status: 'Active', hierarchy: 'Top-level consolidation of all housing finance instructions issued up to March 31, 2024.', tags: ['Housing Finance', 'Prudential', 'Lending'], docUrl: './RBI Master Circular.pdf' }] },
    belongs: { label: 'Belongs To which ACT', desc: 'The statutory framework under which RBI issues housing finance directions.', items: [{ id: 'RBI-ACT-1934', type: 'Legislation', title: 'Reserve Bank of India Act, 1934', reg: 'Parliament of India', date: '1934', status: 'Active', hierarchy: 'Primary legislation empowering RBI to regulate banking system.', tags: ['Primary Law', 'RBI Authority'], docUrl: '#' }, { id: 'BR-ACT-1949', type: 'Legislation', title: 'Banking Regulation Act, 1949 – Section 21 & 35A', reg: 'Parliament of India', date: '1949', status: 'Active', hierarchy: 'Provides RBI power to issue directions on advances and lending practices.', tags: ['Banking Law', 'Lending Powers'], docUrl: '#' }] },
    based: { label: 'Based On which Circular', desc: 'Earlier RBI circulars consolidated into this Master Circular.', items: [{ id: 'RBI/2015-16/LTV', type: 'Circular', title: 'Housing Loans – LTV Ratio Guidelines', reg: 'RBI', date: '2015', status: 'Superseded', hierarchy: 'Foundation for Loan-to-Value ratio norms.', tags: ['LTV', 'Risk'], docUrl: '#' }, { id: 'RBI/2017-18/RISK', type: 'Circular', title: 'Risk Weights for Housing Loans', reg: 'RBI', date: '2017', status: 'Superseded', hierarchy: 'Defines capital adequacy treatment for housing loans.', tags: ['Risk Weight', 'Capital'], docUrl: '#' }, { id: 'RBI/2018-19/DISB', type: 'Circular', title: 'Disbursement of Housing Loans Linked to Construction Stages', reg: 'RBI', date: '2018', status: 'Superseded', hierarchy: 'Introduced stage-wise disbursement norms.', tags: ['Disbursement', 'Construction'], docUrl: '#' }] },
    refers: { label: 'Refers To which Circular', desc: 'Other RBI directions and frameworks referenced in this circular.', items: [{ id: 'RBI-IRD-2023', type: 'Master Direction', title: 'Interest Rate on Advances Directions', reg: 'RBI', date: '2023', status: 'Active', hierarchy: 'Defines interest rate framework applicable to housing loans.', tags: ['Interest Rate', 'Lending'], docUrl: '#' }, { id: 'RBI-FLP-2023', type: 'Guidelines', title: 'Fair Lending Practice Guidelines – Penal Charges & Transparency', reg: 'RBI', date: '2023', status: 'Active', hierarchy: 'Referenced for borrower protection and transparency norms.', tags: ['Fair Lending', 'Customer Protection'], docUrl: '#' }, { id: 'NBC-NDMA', type: 'Guidelines', title: 'National Building Code & NDMA Guidelines', reg: 'Government of India', date: '—', status: 'Active', hierarchy: 'Safety and construction compliance standards referenced in housing finance.', tags: ['Safety', 'Construction'], docUrl: '#' }] },
    version: { label: 'Version Chain', desc: 'Annual consolidation history of Housing Finance Master Circular.', items: [{ id: 'RBI-HF-2021', type: 'Master Circular', title: 'Master Circular – Housing Finance 2021', reg: 'RBI', date: '2021-07-01', status: 'Superseded', hierarchy: 'Earlier consolidated version.', tags: ['v1', 'Historical'], docUrl: '#' }, { id: 'RBI-HF-2022', type: 'Master Circular', title: 'Master Circular – Housing Finance 2022', reg: 'RBI', date: '2022-07-01', status: 'Superseded', hierarchy: 'Updated consolidation with revised norms.', tags: ['v2', 'Update'], docUrl: '#' }, { id: 'RBI-HF-2023', type: 'Master Circular', title: 'Master Circular – Housing Finance 2023', reg: 'RBI', date: '2023-07-01', status: 'Superseded', hierarchy: 'Immediate previous version.', tags: ['v3', 'Previous'], docUrl: '#' }, { id: 'RBI-HF-2024', type: 'Master Circular', title: 'Master Circular – Housing Finance 2024', reg: 'RBI', date: '2024-04-02', status: 'Active', hierarchy: 'Current version consolidating all instructions up to March 31, 2024.', tags: ['v4', 'Current'], docUrl: './RBI Master Circular.pdf' }] }
  };

  const overlay = document.createElement('div');
  overlay.id = 'cl-rel-overlay'; overlay.className = 'cl-rel-overlay';
  overlay.innerHTML = `
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
      ${Object.entries(REL_DATA).map(([k, v], i) =>
        `<button class="cl-rel-tab${i === 0 ? ' active' : ''}" data-rel="${k}" onclick="clRelTab('${k}')">${v.label}</button>`
      ).join('')}
    </div>
    <div class="cl-rel-body" id="cl-rel-body"></div>
  </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) clCloseRelDialog(); });
  document.body.appendChild(overlay);
  window._CL_REL_DATA = REL_DATA;
  setTimeout(() => clRelTab('type'), 0);
}

window.clOpenRelDialog = function () {
  const overlay = document.getElementById('cl-rel-overlay');
  if (!overlay) { _clInjectRelFAB(); setTimeout(clOpenRelDialog, 50); return; }
  const sub = document.getElementById('cl-rel-dsub'), circ = window._CL_ACTIVE_CIRC;
  if (sub && circ) sub.textContent = `${circ.id} · ${circ.title}`;
  overlay.classList.add('cl-rel-open');
  document.getElementById('cl-rel-fab')?.classList.add('cl-fab-active');
};
window.clCloseRelDialog = function () {
  document.getElementById('cl-rel-overlay')?.classList.remove('cl-rel-open');
  document.getElementById('cl-rel-fab')?.classList.remove('cl-fab-active');
};
window.clRelTab = function (key) {
  document.querySelectorAll('.cl-rel-tab').forEach(t => t.classList.toggle('active', t.dataset.rel === key));
  const data = window._CL_REL_DATA?.[key], body = document.getElementById('cl-rel-body');
  if (!body || !data) return;
  body.innerHTML = `
  <div class="cl-rel-tab-desc">${data.desc}</div>
  <div class="cl-rel-items">${data.items.map((item, idx) => _clRelItemHTML(item, idx, key)).join('')}</div>`;
};
function _clRelItemHTML(item, idx, key) {
  const sc = item.status === 'Active' ? 'cl-rs-active' : item.status === 'Superseded' ? 'cl-rs-super' : 'cl-rs-other';
  const dId = `cl-rd-${key}-${idx}`;
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
          ${item.date !== '—' ? `<span class="cl-ri-date">📅 ${item.date}</span>` : ''}
          ${item.tags.map(t => `<span class="cl-ri-tag">${t}</span>`).join('')}
        </div>
      </div>
      <span class="cl-ri-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="cl-rel-detail" id="${dId}">
      <div class="cl-rel-detail-inner">
        <div class="cl-rd-section"><div class="cl-rd-sec-label">Hierarchy &amp; Context</div><div class="cl-rd-hierarchy">${item.hierarchy}</div></div>
        <div class="cl-rd-section"><div class="cl-rd-sec-label">Details</div>
          <div class="cl-rd-grid">
            <div class="cl-rd-field"><span class="cl-rd-label">Circular ID</span><span class="cl-rd-value">${item.id}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Type</span><span class="cl-rd-value">${item.type}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Regulator</span><span class="cl-rd-value">${item.reg}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Issue Date</span><span class="cl-rd-value">${item.date}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Status</span><span class="cl-rd-value">${item.status}</span></div>
            <div class="cl-rd-field"><span class="cl-rd-label">Tags</span><span class="cl-rd-value">${item.tags.join(', ')}</span></div>
          </div>
        </div>
        <div class="cl-rd-section"><div class="cl-rd-sec-label">Links &amp; Documents</div>
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
window.clRelToggle = function (key, idx) {
  const det = document.getElementById(`cl-rd-${key}-${idx}`), item = document.getElementById(`cl-ri-${key}-${idx}`);
  if (!det) return;
  const open = det.classList.contains('open');
  document.querySelectorAll('.cl-rel-detail').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.cl-rel-item').forEach(i => i.classList.remove('cl-ri-exp'));
  if (!open) { det.classList.add('open'); item?.classList.add('cl-ri-exp'); }
};

/* ─────────────────────────────────────── EVIDENCE MODAL (unchanged) */
window.clShowEvidenceModal = function (clauseId, actions, obligation) {
  const EV = [
    { icon: '📋', name: 'Compliance Policy Document', type: 'Policy', source: 'Internal Repository', needed: 'Board-approved policy covering this compliance area.', status: 'Required' },
    { icon: '🔍', name: 'Internal Audit Report', type: 'Audit Record', source: 'Internal Audit Dept', needed: 'Audit findings confirming controls are operating effectively.', status: 'Required' },
    { icon: '🎓', name: 'Staff Training Completion Record', type: 'Training Record', source: 'HR System', needed: 'Completion records for all relevant staff.', status: 'Required' },
    { icon: '💻', name: 'System Audit Trail / Access Log', type: 'System Log', source: 'IT Department', needed: 'System-generated logs showing automated controls.', status: 'Recommended' },
    { icon: '🏛️', name: 'Board Resolution / Meeting Minutes', type: 'Board Record', source: 'Company Secretary', needed: 'Board-level approval in formal meeting minutes.', status: 'Required' },
    { icon: '📨', name: 'Regulatory Submission Receipt', type: 'Regulatory Filing', source: 'Compliance Team', needed: 'Regulator acknowledgement of timely submission.', status: 'Recommended' },
  ];
  const mapped = (Array.isArray(actions) ? actions : [actions]).map((a, i) => ({ action: a, ev: EV[i % EV.length] }));
  const req = mapped.filter(m => m.ev.status === 'Required').length, rec = mapped.length - req;
  const ov = document.createElement('div'); ov.className = 'cl-modal-overlay';
  ov.innerHTML = `
  <div class="cl-modal cl-modal-ev">
    <div class="cl-modal-head">
      <div class="cl-modal-head-left">
        <span class="cl-modal-clause-id">${clauseId}</span>
        ${obligation ? `<span class="cl-modal-oblig-short">${obligation.substring(0, 90)}${obligation.length > 90 ? '…' : ''}</span>` : ''}
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
          ${mapped.map((m, i) => `
          <tr class="cl-ev-tr" id="cl-ev-row-${i}">
            <td class="cl-ev-td cl-ev-td-num">${i + 1}</td>
            <td class="cl-ev-td">${m.action}</td>
            <td class="cl-ev-td">
              <div class="cl-ev-doc-name">${m.ev.icon} ${m.ev.name}</div>
              <div class="cl-ev-doc-sub">${m.ev.type} · ${m.ev.source}</div>
              <div class="cl-ev-doc-needed">${m.ev.needed}</div>
            </td>
            <td class="cl-ev-td cl-ev-td-st"><span class="cl-ev-badge ${m.ev.status === 'Required' ? 'cl-ev-badge-req' : 'cl-ev-badge-rec'}">${m.ev.status}</span></td>
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
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
};

/* ─────────────────────────────────────── CSS */
function injectClauseCSS() {
  if (document.getElementById('cl-css')) return;
  const s = document.createElement('style'); s.id = 'cl-css';
  s.textContent = `
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
  --cl-font:'DM Sans',system-ui,sans-serif;--cl-mono:'DM Mono',monospace;
}
*{box-sizing:border-box;}
.cl-wrap{display:flex;flex-direction:column;gap:12px;font-family:var(--cl-font);color:var(--cl-t1);}

/* ── EMPTY */
.cl-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px 28px;background:var(--cl-card);border:2px dashed var(--cl-border);border-radius:var(--cl-r-lg);text-align:center;}
.cl-empty-icon{font-size:36px;opacity:.5;}
.cl-empty-title{font-size:15px;font-weight:700;}
.cl-empty-sub{font-size:13px;color:var(--cl-t3);max-width:280px;line-height:1.6;}
.cl-empty-cta{padding:9px 22px;background:var(--cl-t1);color:#fff;border:none;border-radius:var(--cl-r-sm);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}

/* ── TOP BAR */
.cl-topbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 16px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-md);box-shadow:var(--cl-sh);}
.cl-topbar-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1;flex-wrap:wrap;}
.cl-topbar-right{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap;}
.cl-circ-id-chip{font-family:var(--cl-mono);font-size:11px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:3px 10px;border-radius:5px;white-space:nowrap;}
.cl-circ-name-chip{font-size:12px;color:var(--cl-t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:280px;}
.cl-filter-select{padding:6px 10px;background:var(--cl-nav-bg);border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;color:var(--cl-t2);outline:none;cursor:pointer;}
.cl-level-toggle{display:flex;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);overflow:hidden;}
.cl-lvl-btn{padding:6px 12px;background:var(--cl-card);border:none;border-right:1px solid var(--cl-border);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t3);cursor:pointer;transition:all .12s;}
.cl-lvl-btn:last-child{border-right:none;}
.cl-lvl-btn.active{background:var(--cl-t1);color:#fff;}
.cl-topbar-btn{padding:7px 15px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .13s;white-space:nowrap;border:1.5px solid;}
.cl-btn-generate{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}
.cl-btn-generate:hover{background:#2a3248;}
.sum-foot-btn{padding:10px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid;display:inline-flex;align-items:center;gap:7px;transition:all 0.14s;}
.sum-foot-save{background:#fff;border-color:#86efac;color:#16a34a;}

/* ── SPLIT */
.cl-split{display:grid;grid-template-columns:248px 1fr;gap:0;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-lg);overflow:hidden;min-height:560px;box-shadow:var(--cl-sh);transition:grid-template-columns .2s ease;}

/* ── LEFT NAV */
.cl-nav{border-right:1px solid var(--cl-border-lt);display:flex;flex-direction:column;background:var(--cl-nav-bg);overflow:hidden;transition:width .2s ease, opacity .2s ease;}
.cl-nav.cl-nav-collapsed{width:0;opacity:0;pointer-events:none;border-right:none;}
.cl-nav-head{display:flex;align-items:center;justify-content:space-between;padding:11px 13px;border-bottom:1px solid var(--cl-border-lt);flex-shrink:0;}
.cl-nav-title{font-size:10px; margin-bottom:5px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
.cl-nav-count{font-size:10px;color:var(--cl-t3);background:var(--cl-border-lt);border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px;}
.cl-nav-collapse-btn{width:20px;height:20px;border-radius:4px;background:none;border:1px solid var(--cl-border);font-size:13px;font-weight:700;color:var(--cl-t3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;flex-shrink:0;}
.cl-nav-collapse-btn:hover{background:var(--cl-hover);color:var(--cl-t1);}
.cl-nav-tree{flex:1;overflow-y:auto;padding:4px 0;}
.cl-nav-placeholder,.cl-nav-loading{padding:24px 16px;font-size:12px;color:var(--cl-t3);text-align:center;line-height:1.6;}

/* ── NAV EXPAND BUTTON (shown in workspace when nav is collapsed) */
.cl-nav-expand-btn{position:absolute;top:12px;left:12px;z-index:10;padding:5px 11px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-blue);cursor:pointer;display:none;align-items:center;gap:4px;transition:all .12s;box-shadow:var(--cl-sh);}
.cl-nav-expand-btn:hover{border-color:var(--cl-blue-mid);background:var(--cl-blue-lt);}
.cl-workspace{position:relative;}

/* chapter button */
.cl-nav-ch-btn{width:100%;display:flex;align-items:center;gap:7px;padding:9px 12px 9px 10px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background .1s;}
.cl-nav-ch-btn:hover{background:var(--cl-hover);}
.cl-nav-ch-arrow{font-size:9px;color:var(--cl-t3);flex-shrink:0;width:12px;text-align:center;}
.cl-nav-ch-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.cl-nav-ch-num{font-size:9px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;line-height:1.2;}
.cl-nav-ch-label{font-size:11.5px;font-weight:600;color:var(--cl-t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.35;}
.cl-nav-ch-count{font-size:10px;color:var(--cl-t3);background:#e8ebf1;padding:1px 7px;border-radius:10px;flex-shrink:0;}
.cl-nav-ch-body{display:none;padding-bottom:4px;border-left:2px solid var(--cl-border-lt);margin-left:14px;}
.cl-nav-ch-body.open{display:block;}

/* section btn */
.cl-nav-sec-group{margin-bottom:1px;}
.cl-nav-sec-btn{width:100%;display:flex;align-items:center;gap:6px;padding:7px 10px 7px 28px;background:none;border:none;border-left:2.5px solid transparent;cursor:pointer;font-family:inherit;font-size:11px;text-align:left;color:var(--cl-t2);transition:all .1s;}
.cl-nav-sec-btn:hover{background:var(--cl-hover);}
.cl-nav-active{background:var(--cl-blue-lt)!important;border-left-color:var(--cl-blue)!important;color:var(--cl-blue)!important;}
.cl-nav-sec-icon{font-size:9px;font-weight:700;color:var(--cl-blue);background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:1px 5px;border-radius:3px;flex-shrink:0;}
.cl-nav-ann-icon{color:var(--cl-purple);background:var(--cl-purple-lt);border-color:#c5c8f5;}
.cl-nav-sec-label{flex:1;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-nav-sec-count{font-size:9px;color:var(--cl-t3);flex-shrink:0;}
.cl-nav-sec-arrow{font-size:10px;color:var(--cl-t3);flex-shrink:0;}
.cl-nav-group-head{padding:8px 10px 4px 12px;font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;border-top:1px solid var(--cl-border-lt);margin-top:4px;}
.cl-nav-all-btn{display:block;width:100%;padding:7px 12px 7px 22px;background:none;border:none;font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-blue);text-align:left;cursor:pointer;}
.cl-nav-all-btn:hover{background:var(--cl-hover);}
.cl-nav-flat-btn{padding-left:12px;}

/* ── WORKSPACE */
.cl-workspace{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-width:0;background:var(--cl-card);}
.cl-ws-placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:40px;text-align:center;}
.cl-ws-ph-icon{font-size:32px;opacity:.3;}
.cl-ws-ph-title{font-size:14px;font-weight:700;color:var(--cl-t3);}
.cl-ws-ph-sub{font-size:12px;color:#c0c7d6;max-width:260px;line-height:1.6;}

/* ── CLAUSE STACK WRAPPER */
.cl-stack-wrap{padding:18px 20px;}

/* Header: all in ONE row — badge + title + count aligned */
.cl-stack-header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--cl-border-lt);}
.cl-stack-header-left{display:flex;align-items:center;gap:8px;flex:1;min-width:0;flex-wrap:wrap;}
.cl-stack-ch-num{font-size:10px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.08em;background:var(--cl-blue-lt);border:1px solid var(--cl-blue-mid);padding:2px 8px;border-radius:4px;flex-shrink:0;}
.cl-stack-ch-title{font-size:13px;font-weight:700;color:var(--cl-t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-stack-sec-sep{font-size:12px;color:var(--cl-t3);flex-shrink:0;}
.cl-stack-sec-label{font-size:12px;color:var(--cl-t2);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cl-stack-count{font-size:11px;color:var(--cl-t3);background:var(--cl-hover);border:1px solid var(--cl-border);padding:3px 10px;border-radius:10px;flex-shrink:0;white-space:nowrap;}


.cl-ctx-scope-row{display:flex;align-items:center;gap:10px;}
.cl-ctx-scope-label{font-size:11px;font-weight:700;color:var(--cl-t3);white-space:nowrap;}
.cl-ctx-scope-toggle{display:flex;border:1px solid var(--cl-border);border-radius:var(--cl-r-sm);overflow:hidden;}
.cl-ctx-scope-btn{padding:6px 14px;background:var(--cl-card);border:none;border-right:1px solid var(--cl-border);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t3);cursor:pointer;transition:all .12s;}
.cl-ctx-scope-btn:last-child{border-right:none;}
.cl-ctx-scope-btn.active{background:var(--cl-t1);color:#fff;}

.cl-nav-sec-btn-titled{flex-direction:column;align-items:flex-start;padding:8px 10px 8px 28px;gap:2px;}
.cl-nav-sec-info{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;width:100%;}
.cl-nav-sec-top-row{display:flex;align-items:center;justify-content:space-between;width:100%;}
.cl-nav-sec-num{font-size:9px;font-weight:800;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;line-height:1.2;}
.cl-nav-sec-title-label{font-size:11.5px;font-weight:600;color:var(--cl-t1);line-height:1.35;white-space:normal;word-break:break-word;}

/* ── CLAUSE ROW — white bg, no badges inline */
.cl-stack-list{display:flex;flex-direction:column;gap:4px;}
.cl-clause-row{display:flex;align-items:center;gap:8px;background:var(--cl-card);border:1px solid var(--cl-border);border-radius:var(--cl-r-md);padding:10px 14px;cursor:pointer;transition:all .14s;}
.cl-clause-row:hover{border-color:var(--cl-blue-mid);box-shadow:0 1px 6px rgba(13,127,165,.08);}
.cl-clause-row.cl-row-expanded{border-color:var(--cl-blue);border-bottom-left-radius:0;border-bottom-right-radius:0;margin-bottom:0;background:var(--cl-blue-lt);}
.cl-row-id{font-family:var(--cl-mono);font-size:10px;font-weight:700;color:var(--cl-purple);background:var(--cl-purple-lt);border:1px solid #c5c8f5;padding:2px 7px;border-radius:4px;flex-shrink:0;white-space:nowrap;}
.cl-row-title-text{flex:1;font-size:12.5px;color:var(--cl-t2);line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}
.cl-row-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.cl-row-left{display:none;}
.cl-row-top{display:none;}
.cl-row-pill{font-size:9px;font-weight:600;color:var(--cl-t3);background:var(--cl-hover);border:1px solid var(--cl-border);padding:2px 8px;border-radius:10px;white-space:nowrap;}
.cl-row-arrow{font-size:11px;color:var(--cl-t3);transition:transform .2s;flex-shrink:0;}
.cl-row-arrow.open{transform:rotate(180deg);}
.cl-stack-empty{padding:24px;text-align:center;font-size:13px;color:var(--cl-t3);background:var(--cl-nav-bg);border-radius:var(--cl-r-md);border:1px dashed var(--cl-border);}

/* ── INLINE EXPAND */
.cl-inline-expand{background:var(--cl-card);border:1px solid var(--cl-blue);border-top:none;border-radius:0 0 var(--cl-r-md) var(--cl-r-md);margin-bottom:6px;overflow:hidden;}
.cl-expand-wrap{display:flex;flex-direction:column;}

/* TAB ROW: tabs left, badges + icons right — one full-width flex row */
.cl-expand-tabrow{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--cl-border-lt);background:var(--cl-nav-bg);padding:0 14px;gap:8px;}
.cl-expand-tabs-left{display:flex;align-items:center;}
.cl-etab{padding:9px 12px;background:none;border:none;border-bottom:2px solid transparent;font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t3);cursor:pointer;transition:all .12s;margin-bottom:-1px;white-space:nowrap;}
.cl-etab:hover{color:var(--cl-t1);}
.cl-etab.active{color:var(--cl-blue);border-bottom-color:var(--cl-blue);}
.cl-expand-tabs-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}

/* Badges in tab row */
.cl-wc-badge{padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;border:1px solid;}
.cl-wc-risk-high{background:var(--cl-red-lt);border-color:#f5b8b8;color:var(--cl-red);}
.cl-wc-risk-medium{background:var(--cl-amber-lt);border-color:#fcd34d;color:var(--cl-amber);}
.cl-wc-risk-low{background:var(--cl-green-lt);border-color:#6ee7b7;color:var(--cl-green);}
.cl-wc-dept{background:#eef1fd;border-color:#c5cff8;color:var(--cl-purple);}

/* ⓘ and ✦ icon buttons in tab row */
.cl-wc-info-btn{width:24px;height:24px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;flex-shrink:0;}
.cl-wc-info-btn:hover,.cl-wc-info-btn-active{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}
.cl-wc-star-btn{width:21px;height:21px;border-radius:50%;background:none;border:1px solid gray;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-purple);font-size:11px;transition:all .12s;flex-shrink:0;}
.cl-wc-star-btn:hover{background:var(--cl-purple-lt);}

/* Metadata table (toggled by ⓘ) — full width below tab row */
.cl-meta-table-wrap{border-bottom:1px solid var(--cl-border-lt);animation:cl-fadeIn .15s ease;}
@keyframes cl-fadeIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
.cl-meta-table-inner{display:grid;grid-template-columns:repeat(3,1fr);}
.cl-meta-row{padding:7px 12px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt);display:flex;flex-direction:column;gap:2px;background:#f9fbfc;}
.cl-meta-row:nth-child(3n){border-right:none;}
.cl-meta-row:nth-last-child(-n+3){border-bottom:none;}
.cl-meta-label{font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;}
.cl-meta-value{font-size:11px;font-weight:600;color:var(--cl-t1);}


.cl-back-btn{padding:5px 12px;background:none;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .12s;white-space:nowrap;flex-shrink:0;}
.cl-back-btn:hover{background:var(--cl-hover);border-color:var(--cl-t2);color:var(--cl-t1);}


/* Panel content */
.cl-expand-body{padding:0;}
.cl-expand-panel{padding:16px 18px;}

/* ── TEXT PANEL */
.cl-text-panel{display:flex;flex-direction:column;gap:10px;}
.cl-tp-text{font-size:13.5px;font-weight:400;color:var(--cl-t1);line-height:1.8;}
.cl-tp-page-row{display:flex;gap:6px;}
.cl-wc-page-chip{padding:3px 9px;background:#fff;border:1.5px solid var(--cl-border);border-radius:10px;font-family:inherit;font-size:10px;font-weight:700;color:var(--cl-t2);cursor:pointer;transition:all .12s;display:inline-block;}
.cl-wc-page-chip:hover{border-color:var(--cl-blue);color:var(--cl-blue);background:var(--cl-blue-lt);}

/* ── OBLIGATIONS */
.cl-oblig-list{display:flex;flex-direction:column;gap:0;}
.cl-oblig-empty{padding:20px;font-size:12px;color:var(--cl-t3);text-align:center;}
.cl-oblig-item{border-bottom:1px solid var(--cl-border-lt);background:var(--cl-card);}
.cl-oblig-item:last-child{border-bottom:none;}

/* ONE-ROW header: num | preview text | icons */
.cl-oblig-header{display:flex;align-items:center;gap:9px;padding:10px 14px;cursor:pointer;transition:background .1s;user-select:none;}
.cl-oblig-header:hover{background:var(--cl-hover);}
.cl-oblig-num{flex-shrink:0;width:22px;height:22px;background:var(--cl-purple);color:#fff;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
.cl-oblig-preview{flex:1;font-size:12px;font-weight:500;color:var(--cl-t1);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}
.cl-oblig-hdr-icons{display:flex;align-items:center;gap:5px;flex-shrink:0;}
.cl-oblig-icon-btn{width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;flex-shrink:0;}
.cl-oblig-icon-btn:hover{background:var(--cl-blue-lt);border-color:var(--cl-blue-mid);color:var(--cl-blue);}
.cl-oblig-star-btn{width:22px;height:22px;border-radius:50%;background:none;border:1px solid var(--cl-purple);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-purple);font-size:10px;transition:all .12s;flex-shrink:0;}
.cl-oblig-star-btn:hover{background:var(--cl-purple-lt);}
.cl-oblig-arr{color:var(--cl-t3);display:flex;align-items:center;transition:transform .2s;cursor:pointer;}
.cl-oblig-arr.rotated{transform:rotate(180deg);}

/* Inline edit */
.cl-oblig-edit-ta{width:100%;min-height:70px;padding:10px 14px;background:#fffbeb;border:none;border-top:1px solid #fcd34d;font-family:inherit;font-size:13px;color:var(--cl-t1);outline:none;resize:vertical;display:block;}
.cl-oblig-editbar{display:flex;justify-content:flex-end;gap:8px;padding:8px 14px;background:#fefce8;border-top:1px solid #fcd34d;}
.cl-oblig-edit-cancel{padding:5px 12px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:600;color:var(--cl-t2);cursor:pointer;}
.cl-oblig-edit-save{padding:5px 12px;background:var(--cl-t1);border:none;border-radius:var(--cl-r-sm);font-family:inherit;font-size:11px;font-weight:700;color:#fff;cursor:pointer;}

/* Accordion body: meta strip → actions (no repeated text) */
.cl-oblig-body{display:none;border-top:1px solid var(--cl-border-lt);background:#fafbfd;}
.cl-oblig-body.open{display:block;}
.cl-oblig-meta-strip{display:none;gap:0;border-bottom:1px solid var(--cl-blue-mid);background:var(--cl-blue-lt);}
.cl-oblig-meta-strip.cl-meta-strip-open{display:flex;}
.cl-oblig-body.open + .cl-oblig-meta-strip, .cl-oblig-meta-strip.cl-meta-strip-open{display:flex;}
.cl-oblig-meta-field{flex:1;padding:7px 10px;border-right:1px solid var(--cl-blue-mid);display:flex;flex-direction:column;gap:2px;}
.cl-oblig-meta-field:last-child{border-right:none;}
.cl-omf-label{font-size:9px;font-weight:700;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;opacity:.8;}
.cl-omf-value{font-size:11px;font-weight:600;color:var(--cl-t1);}

/* ── ACTIONS (inside obligation body) */
.cl-actions-wrap{padding:10px 14px 14px;}
.cl-actions-title{display:flex;align-items:center;gap:7px;margin-bottom:10px;font-size:10px;font-weight:800;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;}
.cl-actions-badge{min-width:18px;height:18px;padding:0 5px;background:var(--cl-border-lt);color:var(--cl-t2);border-radius:10px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;}
.cl-actions-list{display:flex;flex-direction:column;gap:5px;}
.cl-action-item{border:1px solid var(--cl-border-lt);border-radius:var(--cl-r-sm);overflow:hidden;background:#fff;}
.cl-action-main-row{display:flex;align-items:flex-start;gap:8px;padding:8px 11px;}
.cl-action-num{flex-shrink:0;width:18px;height:18px;background:var(--cl-blue-lt);color:var(--cl-blue);border:1px solid var(--cl-blue-mid);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;margin-top:1px;}
.cl-action-text{flex:1;font-size:12px;color:var(--cl-t1);line-height:1.5;}
.cl-action-info-btn{flex-shrink:0;width:20px;height:20px;border-radius:50%;background:none;border:1px solid var(--cl-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-t3);transition:all .12s;margin-top:1px;}
.cl-action-info-btn:hover,.cl-action-info-btn.active{background:var(--cl-blue-lt);border-color:var(--cl-blue);color:var(--cl-blue);}
.cl-action-meta-panel{display:none;background:var(--cl-blue-lt);border-top:1px solid var(--cl-blue-mid);padding:9px 11px;animation:cl-fadeIn .15s ease;}
.cl-action-meta-panel.open{display:block;}
.cl-action-meta-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;}
.cl-amp-field{padding:4px 8px;border-right:1px solid var(--cl-blue-mid);}
.cl-amp-field:last-child{border-right:none;}
.cl-amp-label{display:block;font-size:8px;font-weight:700;color:var(--cl-blue);text-transform:uppercase;letter-spacing:.06em;opacity:.75;margin-bottom:2px;}
.cl-amp-value{display:block;font-size:10px;font-weight:600;color:var(--cl-t1);}
.cl-no-actions{font-size:12px;color:var(--cl-t3);font-style:italic;padding:10px 14px;}

/* ── FOOTER */
.cl-footer{display:flex;gap:10px;align-items:center;}
.cl-foot-save{padding:10px 20px;border-radius:var(--cl-r-sm);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #6ee7b7;background:var(--cl-card);color:var(--cl-green);display:inline-flex;align-items:center;gap:7px;transition:all .14s;}
.cl-foot-save:hover{background:var(--cl-green-lt);}

/* ── AI CONTEXT MODAL */
.cl-ctx-overlay{position:fixed;inset:0;background:rgba(20,25,40,.5);z-index:3000;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
.cl-ctx-overlay.cl-ctx-open{display:flex;}
.cl-ctx-box{background:#fff;border-radius:14px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);animation:cl-popIn .22s ease;}
@keyframes cl-popIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
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

/* ── RELATIONSHIP FAB */
.cl-rel-fab{position:fixed;bottom:28px;right:28px;z-index:3500;display:inline-flex;align-items:center;gap:8px;padding:13px 20px;background:var(--cl-t1);color:#fff;border:none;border-radius:40px;font-family:var(--cl-font);font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(30,36,51,.30);transition:all .2s cubic-bezier(.34,1.56,.64,1);}
.cl-rel-fab:hover{background:#2a3248;box-shadow:0 8px 28px rgba(30,36,51,.40);transform:translateY(-2px);}
.cl-fab-label{letter-spacing:.01em;}
.cl-rel-fab.cl-fab-active{background:var(--cl-purple);box-shadow:0 6px 20px rgba(91,95,207,.40);}

/* ── RELATIONSHIP DIALOG */
.cl-rel-overlay{position:fixed;inset:0;background:rgba(15,20,35,.5);z-index:4000;display:none;align-items:flex-end;justify-content:flex-end;padding:28px;backdrop-filter:blur(3px);}
.cl-rel-overlay.cl-rel-open{display:flex;}
.cl-rel-dialog{background:#fff;border-radius:16px;width:100%;max-width:640px;max-height:78vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.25);animation:cl-slideUp .25s cubic-bezier(.34,1.56,.64,1);}
@keyframes cl-slideUp{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
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
.cl-rs-active{background:#dcfce7;color:#15803d;}
.cl-rs-super{background:#fef3c7;color:#b45309;}
.cl-rs-other{background:#f1f5f9;color:#64748b;}
.cl-ri-title{font-size:13px;font-weight:600;color:var(--cl-t1);line-height:1.4;}
.cl-ri-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.cl-ri-reg,.cl-ri-date{font-size:11px;color:var(--cl-t2);}
.cl-ri-tag{font-size:9px;font-weight:700;padding:2px 7px;background:#f0f1f4;border:1px solid var(--cl-border);border-radius:10px;color:var(--cl-t2);}
.cl-ri-arrow{color:var(--cl-t3);display:flex;align-items:center;flex-shrink:0;margin-top:2px;transition:transform .2s;}
.cl-ri-exp .cl-ri-arrow{transform:rotate(180deg);}
.cl-rel-detail{display:none;border-top:1px solid #edf0f5;}
.cl-rel-detail.open{display:block;animation:cl-fadeIn .18s ease;}
.cl-rel-detail-inner{padding:14px 16px;display:flex;flex-direction:column;gap:12px;}
.cl-rd-sec-label{font-size:9.5px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
.cl-rd-hierarchy{font-size:12.5px;color:var(--cl-t2);line-height:1.65;background:#f8f9fb;padding:9px 12px;border-radius:6px;border-left:3px solid var(--cl-purple);}
.cl-rd-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--cl-border-lt);border-radius:6px;overflow:hidden;}
.cl-rd-field{padding:8px 10px;border-right:1px solid var(--cl-border-lt);border-bottom:1px solid var(--cl-border-lt);background:#fbfcfd;}
.cl-rd-field:nth-child(3n){border-right:none;}
.cl-rd-field:nth-last-child(-n+3){border-bottom:none;}
.cl-rd-label{display:block;font-size:9px;font-weight:700;color:var(--cl-t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
.cl-rd-value{display:block;font-size:11.5px;font-weight:600;color:var(--cl-t1);}
.cl-rd-links{display:flex;flex-wrap:wrap;gap:7px;}
.cl-rd-link{padding:6px 13px;background:#fff;border:1.5px solid var(--cl-border);border-radius:var(--cl-r-sm);font-family:inherit;font-size:11.5px;font-weight:600;color:var(--cl-t2);cursor:pointer;text-decoration:none;transition:all .13s;display:inline-flex;align-items:center;gap:5px;}
.cl-rd-link:hover{border-color:var(--cl-blue);color:var(--cl-blue);background:var(--cl-blue-lt);}
.cl-rd-link-pri{background:var(--cl-t1);color:#fff;border-color:var(--cl-t1);}
.cl-rd-link-pri:hover{background:#2a3248;color:#fff;}

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
.cl-modal-btn-sec{background:var(--cl-card);border:1.5px solid var(--cl-border);color:var(--cl-t1);}
.cl-modal-btn-sec:hover{background:var(--cl-hover);}
.cl-modal-btn-pri{background:var(--cl-t1);border:none;color:#fff;}
.cl-modal-btn-pri:hover{background:#2a3248;}

/* loading spinner */
.ai-loading{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 20px;}
.ai-loading-text{font-size:13px;color:#9499aa;font-family:var(--cl-font);}
.spinner{width:28px;height:28px;border:3px solid #eef0f3;border-top-color:#1a1a2e;border-radius:50%;animation:cl-spin .7s linear infinite;}
@keyframes cl-spin{to{transform:rotate(360deg)}}
  `;
  document.head.appendChild(s);
}