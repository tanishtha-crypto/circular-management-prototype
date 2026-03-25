// /**
//  * shared-circular.js
//  * ─────────────────────────────────────────────────────
//  * Shared across ALL 3 panels:
//  *   • Stepper (clickable, navigates tabs)
//  *   • Card 1 — Circular Source (smart search + upload)
//  *   • Card 2 — Circular Details + AI-generated tags
//  * ─────────────────────────────────────────────────────
//  */

// /* ================================================================
//    STEPPER
//    ================================================================ */
// function buildStepper(activePanel) {
//   const steps = [
//     { id:'applicability', label:'Applicability Analysis', icon:'🎯' },
//     { id:'summary',       label:'Executive Summary',      icon:'📝' },
//     { id:'clause',        label:'Clause Generation',      icon:'🔗' },
//   ];
//   const activeIdx = steps.findIndex(s => s.id === activePanel);

//   return `
//   <div class="sh-stepper">
//     ${steps.map((step, i) => {
//       const isDone   = i < activeIdx;
//       const isActive = step.id === activePanel;
//       const isLast   = i === steps.length - 1;
//       return `
//         <div class="sh-step-wrap">
//           <button
//             class="sh-step ${isActive ? 'sh-step-active' : ''} ${isDone ? 'sh-step-done' : ''}"
//             onclick="document.querySelector('[data-tab=\\'${step.id}\\']').click()">
//             <div class="sh-step-dot">${isDone ? '✓' : i + 1}</div>
//             <div class="sh-step-info">
//               <div class="sh-step-label">${step.icon} ${step.label}</div>
//               <div class="sh-step-state">${isDone ? 'Completed' : isActive ? 'In Progress' : 'Pending'}</div>
//             </div>
//           </button>
//           ${!isLast ? `<div class="sh-connector ${isDone ? 'sh-connector-done' : ''}"></div>` : ''}
//         </div>`;
//     }).join('')}
//   </div>`;
// }

// /* ================================================================
//    CARD 1 — CIRCULAR SOURCE
//    ================================================================ */
// function buildCircularSourceCard() {
//   return `
//   <div class="sh-card" id="sh-card1">
//     <div class="sh-card-head">
//       <div class="sh-dot done" id="sh-s1">✓</div>
//       <div>
//         <div class="sh-card-title">Select Circular Source</div>
//         <div class="sh-card-sub">Search existing library or upload new circular</div>
//       </div>
//     </div>
//     <div class="sh-card-body">

//       <!-- SOURCE TOGGLE -->
//       <div class="sh-src-btns">
//         <button class="sh-src-btn active" id="sh-src-ex" onclick="shSwitchSrc('existing')">
//           <div class="sh-src-icon">🗂️</div>
//           <div>
//             <div class="sh-src-label">Existing Circular</div>
//             <div class="sh-src-desc">Search from circular library</div>
//           </div>
//         </button>
//         <button class="sh-src-btn" id="sh-src-up" onclick="shSwitchSrc('upload')">
//           <div class="sh-src-icon">📤</div>
//           <div>
//             <div class="sh-src-label">Upload New Circular</div>
//             <div class="sh-src-desc">PDF / DOCX from any source</div>
//           </div>
//         </button>
//       </div>

//       <!-- SMART SEARCH -->
//       <div id="sh-sec-ex">
//         <div class="sh-search-wrap">
//           <span class="sh-search-icon-left">⌕</span>
//           <input class="sh-search-input" id="sh-si"
//             placeholder="Search by circular ID, title, regulator, keyword…"
//             autocomplete="off"/>
//           <div class="sh-search-drop" id="sh-sd" style="display:none;"></div>
//         </div>
//         <div id="sh-s-badge" style="display:none;"></div>
//       </div>

//       <!-- UPLOAD -->
//       <div id="sh-sec-up" style="display:none;">
//         <div class="sh-up-grid">
//           <div class="sh-up-opt active" onclick="shPickUp(this,'file')">
//             <div class="sh-u-icon">📁</div>
//             <div class="sh-u-label">Local File</div>
//             <div class="sh-u-sub">PDF / DOCX</div>
//           </div>
//           <div class="sh-up-opt" onclick="shPickUp(this,'drive')">
//             <div class="sh-u-icon">☁️</div>
//             <div class="sh-u-label">Google Drive</div>
//             <div class="sh-coming">Coming Soon</div>
//           </div>
//           <div class="sh-up-opt" onclick="shPickUp(this,'email')">
//             <div class="sh-u-icon">📧</div>
//             <div class="sh-u-label">From Email</div>
//             <div class="sh-coming">Coming Soon</div>
//           </div>
//         </div>
//         <div id="sh-file-sec" style="margin-top:12px;">
//           <div class="sh-drop-zone" onclick="document.getElementById('sh-fi').click()">
//             <div class="sh-dz-icon">📄</div>
//             <div class="sh-dz-text">Drop PDF / DOCX here or click to browse</div>
//             <div class="sh-dz-sub">Max 20 MB · PDF, DOC, DOCX</div>
//             <div id="sh-f-name" class="sh-dz-file" style="display:none;"></div>
//           </div>
//           <input type="file" id="sh-fi" accept=".pdf,.doc,.docx" style="display:none;"/>
//           <div style="margin-top:14px;">
//             <div class="sh-field-label">Circular Type</div>
//             <div class="sh-type-pills" id="sh-tpills">
//               <button class="sh-type-pill" data-t="master">Master Circular</button>
//               <button class="sh-type-pill" data-t="direction">Master Direction</button>
//               <button class="sh-type-pill active" data-t="standalone">Standalone</button>
//               <button class="sh-type-pill" data-t="notice">Notice</button>
//               <button class="sh-type-pill" data-t="amendment">Amendment</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <button class="sh-btn-confirm" id="sh-btn-conf">
//         Confirm &amp; Load Circular Details →
//       </button>

//     </div>
//   </div>`;
// }

// /* ================================================================
//    CARD 2 — CIRCULAR DETAILS
//    ================================================================ */
// function buildCircularDetailsCard() {
//   return `
//   <div class="sh-card sh-locked" id="sh-card2">
//     <div class="sh-card-head">
//       <div class="sh-dot" id="sh-s2">2</div>
//       <div>
//         <div class="sh-card-title">Circular Details</div>
//         <div class="sh-card-sub">Auto-populated · AI-generated tags</div>
//       </div>
//     </div>
//     <div class="sh-card-body" id="sh-c2-body">
//       <p style="font-size:13px;color:#9499aa;">Complete Step 1 to view circular details.</p>
//     </div>
//   </div>`;
// }

// /* ================================================================
//    SHARED LISTENERS
//    onConfirmCallback — called after details loaded, to unlock Card 3
//    ================================================================ */
// function initSharedCircularListeners(onConfirmCallback) {
//   window._shSrc = 'existing';

//   /* source toggle */
//   window.shSwitchSrc = function(src) {
//     document.getElementById('sh-sec-ex').style.display = src === 'existing' ? 'block' : 'none';
//     document.getElementById('sh-sec-up').style.display = src === 'upload'   ? 'block' : 'none';
//     document.getElementById('sh-src-ex').classList.toggle('active', src === 'existing');
//     document.getElementById('sh-src-up').classList.toggle('active', src === 'upload');
//     window._shSrc = src;
//   };

//   /* upload source tiles */
//   window.shPickUp = function(el, src) {
//     document.querySelectorAll('.sh-up-opt').forEach(x => x.classList.remove('active'));
//     el.classList.add('active');
//     document.getElementById('sh-file-sec').style.display = src === 'file' ? 'block' : 'none';
//     if (src !== 'file') showToast(`${src === 'drive' ? 'Google Drive' : 'Email'} integration coming soon!`, 'info');
//   };

//   /* type pills */
//   document.querySelectorAll('#sh-tpills .sh-type-pill').forEach(b => {
//     b.addEventListener('click', () => {
//       document.querySelectorAll('#sh-tpills .sh-type-pill').forEach(x => x.classList.remove('active'));
//       b.classList.add('active');
//     });
//   });

//   /* file input */
//   const fi = document.getElementById('sh-fi');
//   if (fi) fi.addEventListener('change', function() {
//     if (this.files.length) {
//       const el = document.getElementById('sh-f-name');
//       el.textContent = '✓ ' + this.files[0].name;
//       el.style.display = 'block';
//     }
//   });

//   /* smart search */
//   const si = document.getElementById('sh-si');
//   const sd = document.getElementById('sh-sd');
//   if (si) {
//     si.addEventListener('input', () => {
//       const q = si.value.trim().toLowerCase();
//       if (!q) { sd.style.display = 'none'; return; }
//       const res = CMS_DATA.circulars.filter(c =>
//         c.id.toLowerCase().includes(q) ||
//         c.title.toLowerCase().includes(q) ||
//         (c.regulator||'').toLowerCase().includes(q)
//       );
//       sd.innerHTML = res.length
//         ? res.map(c => `
//             <div class="sh-drop-item" onclick="shPickCirc('${c.id}')">
//               <span class="sh-drop-id">${c.id}</span>
//               <div>
//                 <div class="sh-drop-name">${c.title}</div>
//                 <div class="sh-drop-meta">${shClassifyType(c)} · ${c.regulator||''} · ${c.date||''}</div>
//               </div>
//             </div>`).join('')
//         : `<div class="sh-drop-empty">No results for "${q}"</div>`;
//       sd.style.display = 'block';
//     });
//     document.addEventListener('click', e => {
//       if (!e.target.closest('.sh-search-wrap')) sd.style.display = 'none';
//     }, { once: false });
//   }

//   /* pick circular from dropdown */
//   window.shPickCirc = function(id) {
//     AI_LIFECYCLE_STATE.selectedCircularId = id;
//     const c = CMS_DATA.circulars.find(x => x.id === id);
//     if (!c) return;
//     document.getElementById('sh-sd').style.display = 'none';
//     document.getElementById('sh-si').value = `${c.id} – ${c.title}`;
//     const b = document.getElementById('sh-s-badge');
//     b.style.display = 'block';
//     b.innerHTML = `
//       <div class="sh-sel-badge">
//         <span class="sh-sel-tick">✓</span>
//         <span class="sh-sel-id">${c.id}</span>
//         <span class="sh-sel-name">${c.title}</span>
//       </div>`;
//   };

//   /* confirm → populate card 2 */
//   const btnConf = document.getElementById('sh-btn-conf');
//   if (!btnConf) return;

//   btnConf.addEventListener('click', () => {
//     if (window._shSrc === 'existing') {
//       if (!AI_LIFECYCLE_STATE.selectedCircularId) {
//         showToast('Search and select a circular first.', 'warning'); return;
//       }
//       const c = CMS_DATA.circulars.find(x => x.id === AI_LIFECYCLE_STATE.selectedCircularId);
//       shRenderDetails(c);
//       AI_LIFECYCLE_STATE.circularType = 'existing';
//     } else {
//       const fi2 = document.getElementById('sh-fi');
//       const tp  = document.querySelector('#sh-tpills .sh-type-pill.active');
//       if (!fi2 || !fi2.files.length) { showToast('Please upload a file.', 'warning'); return; }
//       shRenderUploadDetails(fi2.files[0], tp?.dataset.t || 'standalone');
//       AI_LIFECYCLE_STATE.uploadedCircular  = fi2.files[0];
//       AI_LIFECYCLE_STATE.circularType      = tp?.dataset.t;
//       AI_LIFECYCLE_STATE.selectedCircularId = null;
//     }
//     shUnlock('sh-card2', 'sh-s2');
//     if (typeof onConfirmCallback === 'function') onConfirmCallback();
//     setTimeout(() => {
//       document.getElementById('sh-card2').scrollIntoView({ behavior:'smooth', block:'nearest' });
//     }, 100);
//   });
// }

// /* ── render existing circular details ── */
// function shRenderDetails(c) {
//   const tp = shClassifyType(c);
//   document.getElementById('sh-c2-body').innerHTML = `
//     <div class="sh-circ-grid">
//       <div class="sh-circ-cell">
//         <div class="sh-circ-label">Circular ID</div>
//         <div class="sh-circ-val mono">${c.id}</div>
//       </div>
//       <div class="sh-circ-cell">
//         <div class="sh-circ-label">Date Issued</div>
//         <div class="sh-circ-val">${c.date || 'N/A'}</div>
//       </div>
//       <div class="sh-circ-cell sh-full">
//         <div class="sh-circ-label">Title</div>
//         <div class="sh-circ-val">${c.title}</div>
//       </div>
//       <div class="sh-circ-cell">
//         <div class="sh-circ-label">Type</div>
//         <div class="sh-circ-val">${shTypeTag(tp)}</div>
//       </div>
//       <div class="sh-circ-cell">
//         <div class="sh-circ-label">Regulator</div>
//         <div class="sh-circ-val">${c.regulator || '—'}</div>
//       </div>
//       <div class="sh-circ-cell">
//         <div class="sh-circ-label">Risk Level</div>
//         <div class="sh-circ-val">${shRiskHtml(c.risk)}</div>
//       </div>
//       <div class="sh-circ-cell">
//         <div class="sh-circ-label">Status</div>
//         <div class="sh-circ-val">${c.status || 'Active'}</div>
//       </div>
//     </div>
//     ${shRenderAITags(c)}`;
// }

// /* ── render uploaded circular details ── */
// function shRenderUploadDetails(file, typeKey) {
//   const typeLabels = { master:'Master Circular', direction:'Master Direction', standalone:'Standalone Circular', notice:'Notice', amendment:'Amendment' };
//   const tl = typeLabels[typeKey] || 'Standalone Circular';
//   document.getElementById('sh-c2-body').innerHTML = `
//     <div class="sh-circ-grid">
//       <div class="sh-circ-cell sh-full">
//         <div class="sh-circ-label">Uploaded File</div>
//         <div class="sh-circ-val mono" style="color:#16a34a;">${file.name}</div>
//       </div>
//       <div class="sh-circ-cell">
//         <div class="sh-circ-label">Type (Specified)</div>
//         <div class="sh-circ-val">${shTypeTag(tl)}</div>
//       </div>
//       <div class="sh-circ-cell">
//         <div class="sh-circ-label">File Size</div>
//         <div class="sh-circ-val">${(file.size / 1024).toFixed(1)} KB</div>
//       </div>
//       <div class="sh-circ-cell sh-full" style="font-size:11px;color:#9499aa;">
//         AI will auto-extract Circular ID, Date, Regulator and "To" section during analysis.
//       </div>
//     </div>
//     ${shRenderAITagsUpload(tl)}`;
// }

// /* ── AI tags ── */
// const SH_TAG_MAP = {
//   'SEBI/HO/CFD/PoD2/CIR/P/0155': ['Listed Entity','LODR','Disclosure','Equity','Corporate Governance','Compliance Reporting'],
//   'RBI/2024-25/86':               ['KYC','AML','Customer Due Diligence','NBFC','Banking','Identity Verification'],
//   'IRDAI/HLT/CIR/MISC/2024/100': ['Insurance','Health Cover','Standardisation','Policy Terms','Premium'],
//   'RBI/2024-25/42':               ['Stressed Assets','NPA','Resolution Framework','Prudential Norms','Banking'],
//   'SEBI/CIR/IMD/DF/21/2023':     ['Mutual Fund','NAV','Operational Framework','AMC','Investor Protection'],
//   'MeitY/2024/Cyber/005':         ['Cybersecurity','Data Protection','IT Framework','Financial Intermediaries','Digital Risk'],
// };

// function shRenderAITags(c) {
//   const tags = SH_TAG_MAP[c.id] || ['Regulatory Compliance','Financial Entity','Circular'];
//   return shTagsHTML(tags, 'AI-generated from circular content');
// }

// function shRenderAITagsUpload(type) {
//   const tags = ['Uploaded Circular', type, 'Pending AI Extraction', 'Compliance Review'];
//   return shTagsHTML(tags, 'Tags will refine after AI analysis');
// }

// function shTagsHTML(tags, subtitle) {
//   return `
//   <div class="sh-tags-wrap">
//     <div class="sh-tags-head">
//       <span class="sh-tags-title">✦ AI Extracted Tags</span>
//       <span class="sh-tags-sub">${subtitle}</span>
//     </div>
//     <div class="sh-tags-list">
//       ${tags.map(t => `<span class="sh-tag">#${t}</span>`).join('')}
//     </div>
//   </div>`;
// }

// /* ── helpers ── */
// function shClassifyType(c) {
//   const t = (c.title||'').toLowerCase(), id = (c.id||'').toLowerCase();
//   if (t.includes('master direction') || id.includes('dir')) return 'Master Direction';
//   if (t.includes('master'))   return 'Master Circular';
//   if (t.includes('notice'))   return 'Notice';
//   if (t.includes('amendment')) return 'Amendment';
//   return 'Standalone Circular';
// }
// function shTypeTag(type) {
//   const m = { 'Master Circular':'sh-t-master','Master Direction':'sh-t-dir','Standalone Circular':'sh-t-standalone','Notice':'sh-t-notice','Amendment':'sh-t-amend' };
//   return `<span class="sh-type-tag ${m[type]||'sh-t-standalone'}">${type}</span>`;
// }
// function shRiskHtml(r) {
//   const cls = r==='High'?'sh-r-high':r==='Medium'?'sh-r-med':'sh-r-low';
//   return `<span class="${cls}">● ${r} Risk</span>`;
// }
// function shUnlock(cardId, dotId) {
//   document.getElementById(cardId)?.classList.remove('sh-locked');
//   const d = document.getElementById(dotId);
//   if (d) { d.classList.add('done'); d.textContent = '✓'; }
// }

// /* ================================================================
//    SHARED CSS (injected once)
//    ================================================================ */
// function injectSharedCSS() {
//   if (document.getElementById('sh-css')) return;
//   const s = document.createElement('style');
//   s.id = 'sh-css';
//   s.textContent = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');

//   /* ── stepper ── */
//   .sh-stepper { display:flex; align-items:center; background:#fff; border:1px solid #dde0e6; border-radius:12px; padding:14px 22px; margin-bottom:12px; box-shadow:0 1px 4px rgba(0,0,0,0.04); font-family:'DM Sans',sans-serif; flex-wrap:wrap; gap:4px; }
//   .sh-step-wrap  { display:flex; align-items:center; flex:1; min-width:0; }
//   .sh-step       { display:flex; align-items:center; gap:10px; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; padding:6px 10px; border-radius:8px; transition:background 0.15s; text-align:left; min-width:0; }
//   .sh-step:hover { background:#f5f6f8; }
//   .sh-step-dot   { width:28px; height:28px; border-radius:50%; border:2px solid #dde0e6; background:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#9499aa; flex-shrink:0; transition:all 0.15s; }
//   .sh-step-active .sh-step-dot { border-color:#1a1a2e; background:#1a1a2e; color:#fff; }
//   .sh-step-done   .sh-step-dot { border-color:#16a34a; background:#16a34a; color:#fff; }
//   .sh-step-info  { min-width:0; }
//   .sh-step-label { font-size:13px; font-weight:600; color:#9499aa; white-space:nowrap; }
//   .sh-step-state { font-size:10px; color:#c4c8d0; margin-top:1px; }
//   .sh-step-active .sh-step-label { color:#1a1a2e; }
//   .sh-step-active .sh-step-state { color:#9499aa; }
//   .sh-step-done   .sh-step-label { color:#16a34a; }
//   .sh-step-done   .sh-step-state { color:#86efac; }
//   .sh-connector      { flex:1; height:2px; background:#eef0f3; margin:0 6px; border-radius:2px; min-width:16px; }
//   .sh-connector-done { background:#16a34a; }

//   /* ── card shell ── */
//   .sh-card       { background:#fff; border:1px solid #dde0e6; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.05); font-family:'DM Sans',sans-serif; transition:opacity 0.2s; }
//   .sh-locked     { opacity:0.35; pointer-events:none; }
//   .sh-card-head  { background:#f5f6f8; border-bottom:1px solid #dde0e6; padding:13px 20px; display:flex; align-items:center; gap:12px; }
//   .sh-dot        { width:24px; height:24px; border-radius:50%; border:1.5px solid #c4c8d0; background:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#9499aa; flex-shrink:0; transition:all 0.15s; }
//   .sh-dot.done   { background:#16a34a; border-color:#16a34a; color:#fff; }
//   .sh-card-title { font-size:13px; font-weight:700; color:#1a1a2e; line-height:1.3; }
//   .sh-card-sub   { font-size:11px; color:#9499aa; margin-top:1px; }
//   .sh-card-body  { padding:20px; }

//   /* ── source buttons ── */
//   .sh-src-btns { display:flex; gap:10px; margin-bottom:20px; }
//   .sh-src-btn  { flex:1; display:flex; align-items:center; gap:12px; padding:13px 16px; background:#f5f6f8; border:1.5px solid #dde0e6; border-radius:10px; cursor:pointer; text-align:left; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
//   .sh-src-btn:hover  { border-color:#c4c8d0; background:#eef0f3; }
//   .sh-src-btn.active { border-color:#1a1a2e; background:#fff; box-shadow:0 0 0 3px rgba(26,26,46,0.07); }
//   .sh-src-icon { width:36px; height:36px; border-radius:8px; background:#eef0f3; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
//   .sh-src-label{ font-size:13px; font-weight:700; color:#1a1a2e; }
//   .sh-src-desc { font-size:11px; color:#9499aa; margin-top:2px; }

//   /* ── smart search ── */
//   .sh-search-wrap { position:relative; margin-bottom:10px; }
//   .sh-search-icon-left { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9499aa; font-size:16px; pointer-events:none; z-index:1; }
//   .sh-search-input { width:100%; background:#f0f1f4; border:1.5px solid #dde0e6; border-radius:8px; padding:10px 14px 10px 36px; font-family:'DM Sans',sans-serif; font-size:13px; color:#1a1a2e; outline:none; transition:border-color 0.14s; box-sizing:border-box; }
//   .sh-search-input:focus { border-color:#1a1a2e; background:#fff; }
//   .sh-search-input::placeholder { color:#9499aa; }
//   .sh-search-drop { position:absolute; top:calc(100% + 4px); left:0; right:0; background:#fff; border:1px solid #dde0e6; border-radius:10px; z-index:9999; max-height:240px; overflow-y:auto; box-shadow:0 8px 24px rgba(0,0,0,0.1); }
//   .sh-drop-item  { padding:10px 14px; display:flex; align-items:flex-start; gap:10px; border-bottom:1px solid #f0f1f4; cursor:pointer; transition:background 0.1s; }
//   .sh-drop-item:last-child { border-bottom:none; }
//   .sh-drop-item:hover { background:#f5f6f8; }
//   .sh-drop-id    { font-family:'DM Mono',monospace; font-size:10px; color:#9499aa; background:#eef0f3; border:1px solid #dde0e6; padding:2px 7px; border-radius:4px; white-space:nowrap; flex-shrink:0; margin-top:2px; }
//   .sh-drop-name  { font-size:12px; font-weight:600; color:#1a1a2e; }
//   .sh-drop-meta  { font-size:11px; color:#9499aa; margin-top:2px; }
//   .sh-drop-empty { padding:16px; text-align:center; font-size:12px; color:#9499aa; }
//   .sh-sel-badge  { display:inline-flex; align-items:center; gap:8px; padding:6px 12px; margin-top:8px; background:#f0fdf4; border:1px solid #86efac; border-radius:6px; font-size:12px; }
//   .sh-sel-tick   { color:#16a34a; font-weight:700; }
//   .sh-sel-id     { font-family:'DM Mono',monospace; color:#9499aa; font-size:11px; }
//   .sh-sel-name   { color:#1a1a2e; font-weight:500; }

//   /* ── upload ── */
//   .sh-up-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:12px; }
//   .sh-up-opt    { padding:12px 8px; text-align:center; border:1.5px solid #dde0e6; border-radius:8px; background:#f5f6f8; cursor:pointer; transition:all 0.14s; }
//   .sh-up-opt:hover   { border-color:#c4c8d0; }
//   .sh-up-opt.active  { border-color:#1a1a2e; background:#fff; }
//   .sh-u-icon    { font-size:20px; margin-bottom:4px; }
//   .sh-u-label   { font-size:11px; font-weight:700; color:#1a1a2e; }
//   .sh-u-sub     { font-size:10px; color:#9499aa; margin-top:2px; }
//   .sh-coming    { display:inline-block; margin-top:4px; font-size:9px; padding:2px 6px; background:#eef0f3; border:1px solid #dde0e6; border-radius:4px; color:#9499aa; }
//   .sh-drop-zone { border:1.5px dashed #c4c8d0; border-radius:8px; padding:28px 20px; text-align:center; background:#f5f6f8; cursor:pointer; transition:all 0.15s; }
//   .sh-drop-zone:hover { border-color:#4a5068; background:#f0f1f4; }
//   .sh-dz-icon   { font-size:28px; margin-bottom:8px; }
//   .sh-dz-text   { font-size:13px; font-weight:600; color:#1a1a2e; }
//   .sh-dz-sub    { font-size:11px; color:#9499aa; margin-top:4px; }
//   .sh-dz-file   { font-size:12px; color:#16a34a; font-family:'DM Mono',monospace; margin-top:8px; }
//   .sh-type-pills { display:flex; flex-wrap:wrap; gap:7px; }
//   .sh-type-pill  { padding:5px 13px; border-radius:20px; border:1.5px solid #dde0e6; background:#f5f6f8; font-size:11px; font-weight:600; color:#4a5068; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.13s; }
//   .sh-type-pill:hover  { border-color:#c4c8d0; color:#1a1a2e; }
//   .sh-type-pill.active { border-color:#1a1a2e; background:#1a1a2e; color:#fff; }
//   .sh-field-label { display:block; font-size:10px; font-weight:700; color:#9499aa; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:8px; }
//   .sh-btn-confirm { display:inline-flex; align-items:center; gap:7px; margin-top:18px; padding:10px 20px; background:#fff; border:1.5px solid #dde0e6; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#1a1a2e; cursor:pointer; transition:all 0.15s; }
//   .sh-btn-confirm:hover { background:#f5f6f8; border-color:#c4c8d0; }

//   /* ── circular details grid ── */
//   .sh-circ-grid  { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:#dde0e6; border:1px solid #dde0e6; border-radius:8px; overflow:hidden; margin-bottom:0; }
//   .sh-circ-cell  { background:#fff; padding:12px 16px; }
//   .sh-full       { grid-column:span 2; }
//   .sh-circ-label { font-size:10px; font-weight:700; color:#9499aa; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:4px; }
//   .sh-circ-val   { font-size:13px; font-weight:500; color:#1a1a2e; }
//   .mono          { font-family:'DM Mono',monospace; font-size:11px; }

//   /* ── type tags ── */
//   .sh-type-tag   { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; border:1px solid; }
//   .sh-t-master   { background:#dbeafe; color:#1d4ed8; border-color:#93c5fd; }
//   .sh-t-dir      { background:#ede9fe; color:#6d28d9; border-color:#c4b5fd; }
//   .sh-t-standalone{ background:#dcfce7; color:#15803d; border-color:#86efac; }
//   .sh-t-notice   { background:#fef3c7; color:#b45309; border-color:#fcd34d; }
//   .sh-t-amend    { background:#f4f4f5; color:#52525b; border-color:#d1d5db; }
//   .sh-r-high     { color:#dc2626; font-weight:600; }
//   .sh-r-med      { color:#d97706; font-weight:600; }
//   .sh-r-low      { color:#16a34a; font-weight:600; }

//   /* ── AI tags ── */
//   .sh-tags-wrap  { margin-top:12px; padding:14px 16px; background:#f5f6f8; border:1px solid #dde0e6; border-radius:0 0 8px 8px; border-top:none; }
//   .sh-tags-head  { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
//   .sh-tags-title { font-size:10px; font-weight:700; color:#1a1a2e; text-transform:uppercase; letter-spacing:0.07em; }
//   .sh-tags-sub   { font-size:10px; color:#9499aa; }
//   .sh-tags-list  { display:flex; flex-wrap:wrap; gap:6px; }
//   .sh-tag        { display:inline-flex; align-items:center; padding:4px 11px; background:#fff; border:1px solid #dde0e6; border-radius:20px; font-size:11px; font-weight:600; color:#4a5068; cursor:default; transition:all 0.13s; }
//   .sh-tag:hover  { border-color:#1a1a2e; color:#1a1a2e; }
//   `;
//   document.head.appendChild(s);
// }


/**
 * shared-circular.js
 * ─────────────────────────────────────────────────────
 * Shared across applicability / summary / clause panels:
 *   • Card 1 — Circular Source (smart search + upload)
 *   • Card 2 — Circular Details
 * The top stepper is replaced by the global tab bar in ai-engine.js
 * ─────────────────────────────────────────────────────
 */

/* buildStepper kept as no-op so existing panel calls don't break */
function buildStepper(activePanel) { return ''; }

/* ================================================================
   CARD 1 — CIRCULAR SOURCE
   ================================================================ */
function buildCircularSourceCard() {
  return `
  <div class="sh-card" id="sh-card1">
    <div class="sh-card-head">
      <div class="sh-dot done" id="sh-s1">1</div>
      <div>
        <div class="sh-card-title">Select Circular Source</div>
        <div class="sh-card-sub">Search existing library or upload a new circular</div>
      </div>
    </div>
    <div class="sh-card-body">

      <!-- SOURCE TOGGLE -->
      <div class="sh-src-btns">
        <button class="sh-src-btn active" id="sh-src-ex" onclick="shSwitchSrc('existing')">
          <div class="sh-src-icon">🗂️</div>
          <div>
            <div class="sh-src-label">Existing Circular</div>
            <div class="sh-src-desc">Search from circular library</div>
          </div>
        </button>
        <button class="sh-src-btn" id="sh-src-up" onclick="shSwitchSrc('upload')">
          <div class="sh-src-icon">📤</div>
          <div>
            <div class="sh-src-label">Upload New Circular</div>
            <div class="sh-src-desc">PDF / DOCX from any source</div>
          </div>
        </button>
      </div>

      <!-- SMART SEARCH -->
      <div id="sh-sec-ex">
        <div class="sh-search-wrap">
          <span class="sh-search-icon-left">⌕</span>
          <input class="sh-search-input" id="sh-si"
            placeholder="Search by circular ID, title, regulator, keyword…"
            autocomplete="off"/>
          <div class="sh-search-drop" id="sh-sd" style="display:none;"></div>
        </div>
        <div id="sh-s-badge" style="display:none;"></div>
      </div>

      <!-- UPLOAD -->
      <div id="sh-sec-up" style="display:none;">
        <div class="sh-up-grid">
          <div class="sh-up-opt active" onclick="shPickUp(this,'file')">
            <div class="sh-u-icon">📁</div>
            <div class="sh-u-label">Local File</div>
            <div class="sh-u-sub">PDF / DOCX</div>
          </div>
          <div class="sh-up-opt" onclick="shPickUp(this,'drive')">
            <div class="sh-u-icon">☁️</div>
            <div class="sh-u-label">Google Drive</div>
            <div class="sh-coming">Coming Soon</div>
          </div>
          <div class="sh-up-opt" onclick="shPickUp(this,'email')">
            <div class="sh-u-icon">📧</div>
            <div class="sh-u-label">From Email</div>
            <div class="sh-coming">Coming Soon</div>
          </div>
        </div>
        <div id="sh-file-sec" style="margin-top:12px;">
          <div class="sh-drop-zone" onclick="document.getElementById('sh-fi').click()">
            <div class="sh-dz-icon">📄</div>
            <div class="sh-dz-text">Drop PDF / DOCX here or click to browse</div>
            <div class="sh-dz-sub">Max 20 MB · PDF, DOC, DOCX</div>
            <div id="sh-f-name" class="sh-dz-file" style="display:none;"></div>
          </div>
          <input type="file" id="sh-fi" accept=".pdf,.doc,.docx" style="display:none;"/>
          <div style="margin-top:14px;">
            <div class="sh-field-label">Circular Type</div>
            <div class="sh-type-pills" id="sh-tpills">
              <button class="sh-type-pill" data-t="master">Master Circular</button>
              <button class="sh-type-pill" data-t="direction">Master Direction</button>
              <button class="sh-type-pill active" data-t="standalone">Standalone</button>
              <button class="sh-type-pill" data-t="notice">Notice</button>
              <button class="sh-type-pill" data-t="amendment">Amendment</button>
            </div>
          </div>
        </div>
      </div>

      <button class="sh-btn-confirm" id="sh-btn-conf">
        Confirm &amp; Load Circular Details →
      </button>

    </div>
  </div>`;
}

/* ================================================================
   CARD 2 — CIRCULAR DETAILS
   ================================================================ */
function buildCircularDetailsCard() {
  return `
  <div class="sh-card sh-locked" id="sh-card2">
    <div class="sh-card-head">
      <div class="sh-dot" id="sh-s2">2</div>
      <div>
        <div class="sh-card-title">Circular Details</div>
        <div class="sh-card-sub">Key information about the selected circular</div>
      </div>
    </div>
    <div class="sh-card-body" id="sh-c2-body">
      <p style="font-size:13px;color:#9499aa;">Complete Step 1 to view circular details.</p>
    </div>
  </div>`;
}

/* ================================================================
   SHARED LISTENERS
   onConfirmCallback — called after details loaded, to unlock Card 3
   ================================================================ */
function initSharedCircularListeners(onConfirmCallback) {
  window._shSrc = 'existing';

  window.shSwitchSrc = function(src) {
    document.getElementById('sh-sec-ex').style.display = src === 'existing' ? 'block' : 'none';
    document.getElementById('sh-sec-up').style.display = src === 'upload'   ? 'block' : 'none';
    document.getElementById('sh-src-ex').classList.toggle('active', src === 'existing');
    document.getElementById('sh-src-up').classList.toggle('active', src === 'upload');
    window._shSrc = src;
  };

  window.shPickUp = function(el, src) {
    document.querySelectorAll('.sh-up-opt').forEach(x => x.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('sh-file-sec').style.display = src === 'file' ? 'block' : 'none';
    if (src !== 'file') showToast(`${src === 'drive' ? 'Google Drive' : 'Email'} integration coming soon!`, 'info');
  };

  document.querySelectorAll('#sh-tpills .sh-type-pill').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#sh-tpills .sh-type-pill').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  const fi = document.getElementById('sh-fi');
  if (fi) fi.addEventListener('change', function() {
    if (this.files.length) {
      const el = document.getElementById('sh-f-name');
      el.textContent = '✓ ' + this.files[0].name;
      el.style.display = 'block';
    }
  });

  const si = document.getElementById('sh-si');
  const sd = document.getElementById('sh-sd');
  if (si) {
    si.addEventListener('input', () => {
      const q = si.value.trim().toLowerCase();
      if (!q) { sd.style.display = 'none'; return; }
      const res = CMS_DATA.circulars.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.regulator || '').toLowerCase().includes(q)
      );
      sd.innerHTML = res.length
        ? res.map(c => `
            <div class="sh-drop-item" onclick="shPickCirc('${c.id}')">
              <span class="sh-drop-id">${c.id}</span>
              <div>
                <div class="sh-drop-name">${c.title}</div>
                <div class="sh-drop-meta">${shClassifyType(c)} · ${c.regulator || ''} · ${c.date || ''}</div>
              </div>
            </div>`).join('')
        : `<div class="sh-drop-empty">No results for "${q}"</div>`;
      sd.style.display = 'block';
    });
    document.addEventListener('click', e => {
      if (!e.target.closest?.('.sh-search-wrap')) sd.style.display = 'none';
    });
  }

  window.shPickCirc = function(id) {
    AI_LIFECYCLE_STATE.selectedCircularId = id;
    const c = CMS_DATA.circulars.find(x => x.id === id);
    if (!c) return;
    document.getElementById('sh-sd').style.display = 'none';
    document.getElementById('sh-si').value = `${c.id} – ${c.title}`;
    const b = document.getElementById('sh-s-badge');
    b.style.display = 'block';
    b.innerHTML = `
      <div class="sh-sel-badge">
        <span class="sh-sel-tick">✓</span>
        <span class="sh-sel-id">${c.id}</span>
        <span class="sh-sel-name">${c.title}</span>
      </div>`;
  };

  const btnConf = document.getElementById('sh-btn-conf');
  if (!btnConf) return;

  btnConf.addEventListener('click', () => {
    if (window._shSrc === 'existing') {
      if (!AI_LIFECYCLE_STATE.selectedCircularId) {
        showToast('Search and select a circular first.', 'warning'); return;
      }
      const c = CMS_DATA.circulars.find(x => x.id === AI_LIFECYCLE_STATE.selectedCircularId);
      shRenderDetails(c);
      AI_LIFECYCLE_STATE.circularType = 'existing';
    } else {
      const fi2 = document.getElementById('sh-fi');
      const tp  = document.querySelector('#sh-tpills .sh-type-pill.active');
      if (!fi2 || !fi2.files.length) { showToast('Please upload a file.', 'warning'); return; }
      shRenderUploadDetails(fi2.files[0], tp?.dataset.t || 'standalone');
      AI_LIFECYCLE_STATE.uploadedCircular   = fi2.files[0];
      AI_LIFECYCLE_STATE.circularType       = tp?.dataset.t;
      AI_LIFECYCLE_STATE.selectedCircularId = null;
    }
    shUnlock('sh-card2', 'sh-s2');
    if (typeof onConfirmCallback === 'function') onConfirmCallback();
    setTimeout(() => {
      document.getElementById('sh-card2')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  });
}

/* ── render existing circular details ── */
function shRenderDetails(c) {
  const tp = shClassifyType(c);
  document.getElementById('sh-c2-body').innerHTML = `
    <div class="sh-circ-grid">
      <div class="sh-circ-cell">
        <div class="sh-circ-label">Circular ID</div>
        <div class="sh-circ-val mono">${c.id}</div>
      </div>
      <div class="sh-circ-cell">
        <div class="sh-circ-label">Date Issued</div>
        <div class="sh-circ-val">${c.date || 'N/A'}</div>
      </div>
      <div class="sh-circ-cell sh-full">
        <div class="sh-circ-label">Title</div>
        <div class="sh-circ-val">${c.title}</div>
      </div>
      <div class="sh-circ-cell">
        <div class="sh-circ-label">Type</div>
        <div class="sh-circ-val">${shTypeTag(tp)}</div>
      </div>
      <div class="sh-circ-cell">
        <div class="sh-circ-label">Regulator</div>
        <div class="sh-circ-val">${c.regulator || '—'}</div>
      </div>
      <div class="sh-circ-cell">
        <div class="sh-circ-label">Risk Level</div>
        <div class="sh-circ-val">${shRiskHtml(c.risk)}</div>
      </div>
      <div class="sh-circ-cell">
        <div class="sh-circ-label">Status</div>
        <div class="sh-circ-val">${c.status || 'Active'}</div>
      </div>
    </div>`;
}

/* ── render uploaded circular details ── */
function shRenderUploadDetails(file, typeKey) {
  const typeLabels = { master: 'Master Circular', direction: 'Master Direction', standalone: 'Standalone Circular', notice: 'Notice', amendment: 'Amendment' };
  const tl = typeLabels[typeKey] || 'Standalone Circular';
  document.getElementById('sh-c2-body').innerHTML = `
    <div class="sh-circ-grid">
      <div class="sh-circ-cell sh-full">
        <div class="sh-circ-label">Uploaded File</div>
        <div class="sh-circ-val mono" style="color:#16a34a;">${file.name}</div>
      </div>
      <div class="sh-circ-cell">
        <div class="sh-circ-label">Type (Specified)</div>
        <div class="sh-circ-val">${shTypeTag(tl)}</div>
      </div>
      <div class="sh-circ-cell">
        <div class="sh-circ-label">File Size</div>
        <div class="sh-circ-val">${(file.size / 1024).toFixed(1)} KB</div>
      </div>
      <div class="sh-circ-cell sh-full" style="font-size:11px;color:#9499aa;">
        AI will auto-extract Circular ID, date, regulator and applicable entities during analysis.
      </div>
    </div>`;
}

/* ── helpers ── */
function shClassifyType(c) {
  const t = (c.title || '').toLowerCase(), id = (c.id || '').toLowerCase();
  if (t.includes('master direction') || id.includes('dir')) return 'Master Direction';
  if (t.includes('master'))    return 'Master Circular';
  if (t.includes('notice'))    return 'Notice';
  if (t.includes('amendment')) return 'Amendment';
  return 'Standalone Circular';
}
function shTypeTag(type) {
  const m = { 'Master Circular': 'sh-t-master', 'Master Direction': 'sh-t-dir', 'Standalone Circular': 'sh-t-standalone', 'Notice': 'sh-t-notice', 'Amendment': 'sh-t-amend' };
  return `<span class="sh-type-tag ${m[type] || 'sh-t-standalone'}">${type}</span>`;
}
function shRiskHtml(r) {
  const cls = r === 'High' ? 'sh-r-high' : r === 'Medium' ? 'sh-r-med' : 'sh-r-low';
  return `<span class="${cls}">● ${r} Risk</span>`;
}
function shUnlock(cardId, dotId) {
  document.getElementById(cardId)?.classList.remove('sh-locked');
  const d = document.getElementById(dotId);
  if (d) { d.classList.add('done'); d.textContent = '✓'; }
}

/* ================================================================
   SHARED CSS
   ================================================================ */
function injectSharedCSS() {
  if (document.getElementById('sh-css')) return;
  const s = document.createElement('style');
  s.id = 'sh-css';
  s.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');

  /* ── card shell ── */
  .sh-card       { background:#fff; border:1px solid #dde0e6; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.05); font-family:'DM Sans',sans-serif; transition:opacity 0.2s; }
  .sh-locked     { opacity:0.35; pointer-events:none; }
  .sh-card-head  { background:#f5f6f8; border-bottom:1px solid #dde0e6; padding:13px 20px; display:flex; align-items:center; gap:12px; }
  .sh-dot        { width:24px; height:24px; border-radius:50%; border:1.5px solid #c4c8d0; background:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#9499aa; flex-shrink:0; transition:all 0.15s; }
  .sh-dot.done   { background:#16a34a; border-color:#16a34a; color:#fff; }
  .sh-card-title { font-size:13px; font-weight:700; color:#1a1a2e; line-height:1.3; }
  .sh-card-sub   { font-size:11px; color:#9499aa; margin-top:1px; }
  .sh-card-body  { padding:20px; }

  /* ── source buttons ── */
  .sh-src-btns { display:flex; gap:10px; margin-bottom:20px; }
  .sh-src-btn  { flex:1; display:flex; align-items:center; gap:12px; padding:13px 16px; background:#f5f6f8; border:1.5px solid #dde0e6; border-radius:10px; cursor:pointer; text-align:left; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .sh-src-btn:hover  { border-color:#c4c8d0; background:#eef0f3; }
  .sh-src-btn.active { border-color:#1a1a2e; background:#fff; box-shadow:0 0 0 3px rgba(26,26,46,0.07); }
  .sh-src-icon { width:36px; height:36px; border-radius:8px; background:#eef0f3; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .sh-src-label{ font-size:13px; font-weight:700; color:#1a1a2e; }
  .sh-src-desc { font-size:11px; color:#9499aa; margin-top:2px; }

  /* ── smart search ── */
  .sh-search-wrap { position:relative; margin-bottom:10px; }
  .sh-search-icon-left { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9499aa; font-size:16px; pointer-events:none; z-index:1; }
  .sh-search-input { width:100%; background:#f0f1f4; border:1.5px solid #dde0e6; border-radius:8px; padding:10px 14px 10px 36px; font-family:'DM Sans',sans-serif; font-size:13px; color:#1a1a2e; outline:none; transition:border-color 0.14s; box-sizing:border-box; }
  .sh-search-input:focus { border-color:#1a1a2e; background:#fff; }
  .sh-search-input::placeholder { color:#9499aa; }
  .sh-search-drop { position:absolute; top:calc(100% + 4px); left:0; right:0; background:#fff; border:1px solid #dde0e6; border-radius:10px; z-index:9999; max-height:240px; overflow-y:auto; box-shadow:0 8px 24px rgba(0,0,0,0.1); }
  .sh-drop-item  { padding:10px 14px; display:flex; align-items:flex-start; gap:10px; border-bottom:1px solid #f0f1f4; cursor:pointer; transition:background 0.1s; }
  .sh-drop-item:last-child { border-bottom:none; }
  .sh-drop-item:hover { background:#f5f6f8; }
  .sh-drop-id    { font-family:'DM Mono',monospace; font-size:10px; color:#9499aa; background:#eef0f3; border:1px solid #dde0e6; padding:2px 7px; border-radius:4px; white-space:nowrap; flex-shrink:0; margin-top:2px; }
  .sh-drop-name  { font-size:12px; font-weight:600; color:#1a1a2e; }
  .sh-drop-meta  { font-size:11px; color:#9499aa; margin-top:2px; }
  .sh-drop-empty { padding:16px; text-align:center; font-size:12px; color:#9499aa; }
  .sh-sel-badge  { display:inline-flex; align-items:center; gap:8px; padding:6px 12px; margin-top:8px; background:#f0fdf4; border:1px solid #86efac; border-radius:6px; font-size:12px; }
  .sh-sel-tick   { color:#16a34a; font-weight:700; }
  .sh-sel-id     { font-family:'DM Mono',monospace; color:#9499aa; font-size:11px; }
  .sh-sel-name   { color:#1a1a2e; font-weight:500; }

  /* ── upload ── */
  .sh-up-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:12px; }
  .sh-up-opt    { padding:12px 8px; text-align:center; border:1.5px solid #dde0e6; border-radius:8px; background:#f5f6f8; cursor:pointer; transition:all 0.14s; }
  .sh-up-opt:hover   { border-color:#c4c8d0; }
  .sh-up-opt.active  { border-color:#1a1a2e; background:#fff; }
  .sh-u-icon    { font-size:20px; margin-bottom:4px; }
  .sh-u-label   { font-size:11px; font-weight:700; color:#1a1a2e; }
  .sh-u-sub     { font-size:10px; color:#9499aa; margin-top:2px; }
  .sh-coming    { display:inline-block; margin-top:4px; font-size:9px; padding:2px 6px; background:#eef0f3; border:1px solid #dde0e6; border-radius:4px; color:#9499aa; }
  .sh-drop-zone { border:1.5px dashed #c4c8d0; border-radius:8px; padding:28px 20px; text-align:center; background:#f5f6f8; cursor:pointer; transition:all 0.15s; }
  .sh-drop-zone:hover { border-color:#4a5068; background:#f0f1f4; }
  .sh-dz-icon   { font-size:28px; margin-bottom:8px; }
  .sh-dz-text   { font-size:13px; font-weight:600; color:#1a1a2e; }
  .sh-dz-sub    { font-size:11px; color:#9499aa; margin-top:4px; }
  .sh-dz-file   { font-size:12px; color:#16a34a; font-family:'DM Mono',monospace; margin-top:8px; }
  .sh-type-pills { display:flex; flex-wrap:wrap; gap:7px; }
  .sh-type-pill  { padding:5px 13px; border-radius:20px; border:1.5px solid #dde0e6; background:#f5f6f8; font-size:11px; font-weight:600; color:#4a5068; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.13s; }
  .sh-type-pill:hover  { border-color:#c4c8d0; color:#1a1a2e; }
  .sh-type-pill.active { border-color:#1a1a2e; background:#1a1a2e; color:#fff; }
  .sh-field-label { display:block; font-size:10px; font-weight:700; color:#9499aa; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:8px; }
  .sh-btn-confirm { display:inline-flex; align-items:center; gap:7px; margin-top:18px; padding:10px 20px; background:#fff; border:1.5px solid #dde0e6; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#1a1a2e; cursor:pointer; transition:all 0.15s; }
  .sh-btn-confirm:hover { background:#f5f6f8; border-color:#c4c8d0; }

  /* ── circular details grid ── */
  .sh-circ-grid  { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:#dde0e6; border:1px solid #dde0e6; border-radius:8px; overflow:hidden; }
  .sh-circ-cell  { background:#fff; padding:12px 16px; }
  .sh-full       { grid-column:span 2; }
  .sh-circ-label { font-size:10px; font-weight:700; color:#9499aa; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:4px; }
  .sh-circ-val   { font-size:13px; font-weight:500; color:#1a1a2e; }
  .mono          { font-family:'DM Mono',monospace; font-size:11px; }

  /* ── type tags ── */
  .sh-type-tag    { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; border:1px solid; }
  .sh-t-master    { background:#dbeafe; color:#1d4ed8; border-color:#93c5fd; }
  .sh-t-dir       { background:#ede9fe; color:#6d28d9; border-color:#c4b5fd; }
  .sh-t-standalone{ background:#dcfce7; color:#15803d; border-color:#86efac; }
  .sh-t-notice    { background:#fef3c7; color:#b45309; border-color:#fcd34d; }
  .sh-t-amend     { background:#f4f4f5; color:#52525b; border-color:#d1d5db; }
  .sh-r-high      { color:#dc2626; font-weight:600; }
  .sh-r-med       { color:#d97706; font-weight:600; }
  .sh-r-low       { color:#16a34a; font-weight:600; }

  /* ── loading ── */
  .ai-loading      { display:flex; flex-direction:column; align-items:center; gap:14px; padding:40px 20px; }
  .ai-loading-text { font-size:13px; color:#9499aa; font-family:'DM Sans',sans-serif; }
  .spinner         { width:28px; height:28px; border:3px solid #eef0f3; border-top-color:#1a1a2e; border-radius:50%; animation:spin 0.7s linear infinite; }
  @keyframes spin  { to { transform:rotate(360deg); } }
  `;
  document.head.appendChild(s);
}