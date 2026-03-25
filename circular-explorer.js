// /**
//  * CircularExplorer v3 — Regulatory Document Hierarchy & Timeline Explorer
//  * - Fixed-height scrollable timeline (no full-page scroll)
//  * - Full branching tree in Lineage view
//  * - Titles always fully visible (no truncation)
//  * - Color legend always visible
//  * - "Standalone" sidebar explained
//  * - Active/Superseded clearly labelled
//  */

// (function (global) {
//     'use strict';

//     const TYPE_META = {
//         act: { label: 'Act', short: 'ACT', color: '#1e2a6e', light: '#eef0fb', accent: '#3b4fce', dot: '#2D3A8C', desc: 'Primary legislation enacted by Parliament. Highest authority.' },
//         md: { label: 'Master Direction', short: 'MD', color: '#0d3320', light: '#e8f5ee', accent: '#1e7a52', dot: '#1A6B4A', desc: 'Consolidated evergreen directions issued by RBI on a topic.' },
//         mc: { label: 'Master Circular', short: 'MC', color: '#3d1a00', light: '#fdf0e8', accent: '#c2560c', dot: '#8B3A0F', desc: 'Annual consolidation of circulars on a specific subject.' },
//         circular: { label: 'Circular', short: 'CIR', color: '#062340', light: '#e8f3fd', accent: '#1464a5', dot: '#1A5276', desc: 'Individual regulatory instruction or clarification.' },
//         notification: { label: 'Notification', short: 'NTF', color: '#1a1a1a', light: '#f4f4f4', accent: '#555', dot: '#4A4A4A', desc: 'Official notice from any regulatory authority.' },
//     };

//     const SAMPLE_DOCS = [
//         { id: 'rbi-act', type: 'act', title: 'Reserve Bank of India Act, 1934', refNo: 'Act No. 2 of 1934', issuingAuth: 'Parliament of India', date: '1934', year: 1934, status: 'Active', subject: 'Establishment of Reserve Bank and monetary authority framework', parentId: null, supersededBy: null },
//         { id: 'fema-act', type: 'act', title: 'Foreign Exchange Management Act, 1999', refNo: 'Act No. 42 of 1999', issuingAuth: 'Parliament of India', date: '1999', year: 1999, status: 'Active', subject: 'Regulation and management of foreign exchange in India', parentId: null, supersededBy: null },
//         { id: 'md-kyc', type: 'md', title: 'Master Direction on Know Your Customer (KYC)', refNo: 'RBI/DBR.AML.BC.81/2016', issuingAuth: 'Reserve Bank of India', date: '25 Feb 2016', year: 2016, status: 'Active', subject: 'KYC norms and AML standards for regulated entities', parentId: 'rbi-act', supersededBy: null },
//         { id: 'md-forex', type: 'md', title: 'Master Direction on Foreign Exchange Transactions', refNo: 'RBI/2015-16/3', issuingAuth: 'Reserve Bank of India', date: '01 Jan 2016', year: 2016, status: 'Active', subject: 'Comprehensive directions for all forex transactions under FEMA', parentId: 'fema-act', supersededBy: null },
//         { id: 'md-ecb', type: 'md', title: 'Master Direction on External Commercial Borrowings', refNo: 'RBI/2018-19/67', issuingAuth: 'Reserve Bank of India', date: '16 Jan 2019', year: 2019, status: 'Active', subject: 'ECB policy framework, eligible borrowers, permitted end-uses and limits', parentId: 'fema-act', supersededBy: null },
//         { id: 'mc-kyc-2021', type: 'mc', title: 'Master Circular – KYC Directions 2021', refNo: 'RBI/2021-22/10', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2021', year: 2021, status: 'Superseded', subject: 'Annual consolidation of KYC norms as on 01 July 2021', parentId: 'md-kyc', supersededBy: 'mc-kyc-2022' },
//         { id: 'c-lrs-2021', type: 'circular', title: 'Circular – Liberalised Remittance Scheme: COVID-19 Clarification', refNo: 'AP(DIR) Circ No. 3/2021', issuingAuth: 'Reserve Bank of India', date: '05 May 2021', year: 2021, status: 'Active', subject: 'LRS applicability and reporting requirements post-COVID relief measures', parentId: 'md-forex', supersededBy: null },
//         { id: 'mc-kyc-2022', type: 'mc', title: 'Master Circular – KYC Directions 2022', refNo: 'RBI/2022-23/09', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2022', year: 2022, status: 'Superseded', subject: 'Annual consolidation of KYC norms as on 01 July 2022', parentId: 'md-kyc', supersededBy: 'mc-kyc-2023' },
//         { id: 'c-ecb-2022', type: 'circular', title: 'Circular – ECB: Refinancing Norms for Select Sectors', refNo: 'AP(DIR) Circ No. 5/2022', issuingAuth: 'Reserve Bank of India', date: '10 Aug 2022', year: 2022, status: 'Active', subject: 'ECB refinancing now permitted for infrastructure and manufacturing sectors', parentId: 'md-ecb', supersededBy: null },
//         { id: 'mc-kyc-2023', type: 'mc', title: 'Master Circular – KYC Directions 2023', refNo: 'RBI/2023-24/14', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2023', year: 2023, status: 'Superseded', subject: 'Annual consolidation of KYC norms as on 01 July 2023', parentId: 'md-kyc', supersededBy: 'mc-kyc-2024' },
//         { id: 'mc-kyc-2024', type: 'mc', title: 'Master Circular – KYC Directions 2024', refNo: 'RBI/2024-25/14', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2024', year: 2024, status: 'Active', subject: 'Annual consolidation of KYC norms including Video-based Customer Identification (V-CIP)', parentId: 'md-kyc', supersededBy: null },
//         { id: 'mc-forex-2024', type: 'mc', title: 'Master Circular – Foreign Exchange Transactions 2024', refNo: 'RBI/2024-25/11', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2024', year: 2024, status: 'Active', subject: 'Annual consolidation of forex directions covering LRS, trade finance and remittances', parentId: 'md-forex', supersededBy: null },
//         { id: 'c-vcip-2024', type: 'circular', title: 'Circular – Video-based Customer Identification Process (V-CIP)', refNo: 'DOR.AML.REC.35/2024', issuingAuth: 'Reserve Bank of India', date: '14 May 2024', year: 2024, status: 'Active', subject: 'Updated norms for video-based customer identification for KYC compliance', parentId: 'mc-kyc-2024', supersededBy: null },
//         { id: 'c-lrs-oct-2024', type: 'circular', title: 'Circular – Liberalised Remittance Scheme: Revised Limits', refNo: 'AP(DIR) Circ No. 4/2024', issuingAuth: 'Reserve Bank of India', date: '18 Oct 2024', year: 2024, status: 'Active', subject: 'Revised LRS annual limit and enhanced reporting obligations for AD banks', parentId: 'mc-forex-2024', supersededBy: null },
//         { id: 'c-trade-nov-2024', type: 'circular', title: 'Circular – Trade Credit for Imports: Revised Norms', refNo: 'AP(DIR) Circ No. 7/2024', issuingAuth: 'Reserve Bank of India', date: '09 Nov 2024', year: 2024, status: 'Active', subject: 'Enhanced trade credit limits and revised maturity norms for import financing', parentId: 'mc-forex-2024', supersededBy: null },
//         { id: 'c-ecb-2024', type: 'circular', title: 'Circular – ECB Policy: Eligible End-Use Clarifications', refNo: 'AP(DIR) Circ No. 2/2024', issuingAuth: 'Reserve Bank of India', date: '22 Mar 2024', year: 2024, status: 'Active', subject: 'Clarification on permitted end-uses for ECB proceeds in infrastructure sector', parentId: 'md-ecb', supersededBy: null },
//         { id: 'n-sebi-algo', type: 'notification', title: 'SEBI – Framework for Algorithmic Trading', refNo: 'SEBI/HO/MRD2/CIR/2024/01', issuingAuth: 'Securities and Exchange Board of India', date: '02 Feb 2024', year: 2024, status: 'Active', subject: 'Regulatory framework and risk controls for algorithmic and high-frequency trading', parentId: null, supersededBy: null },
//         { id: 'n-irdai-ulip', type: 'notification', title: 'IRDAI – Unit-Linked Insurance Products (ULIPs)', refNo: 'IRDAI/Life/CIR/2024/07', issuingAuth: 'Insurance Regulatory and Development Authority', date: '15 Mar 2024', year: 2024, status: 'Active', subject: 'Revised product structure, charges and disclosure norms for ULIPs', parentId: null, supersededBy: null },
//     ];

//     let state = {
//         docs: [], byId: {}, view: 'hierarchy', lineageFocusId: null, selectedId: null,
//         yrFrom: 1934, yrTo: 2024, filterType: 'all', filterAuth: 'all', filterStatus: 'all',
//         searchQuery: '', container: null, _prevView: 'hierarchy', collapsed: {},
//     };

//     /* ─── HELPERS ─────────────────────── */
//     function getAncestors(id) {
//         const chain = []; let cur = state.byId[id];
//         while (cur && cur.parentId) { cur = state.byId[cur.parentId]; if (cur) chain.unshift(cur); }
//         return chain;
//     }
//     function getChildren(id) { return state.docs.filter(d => d.parentId === id); }
//     function getAllAuthorities() { return Array.from(new Set(state.docs.map(d => d.issuingAuth))).sort(); }
//     function matchesFilters(doc) {
//         if (state.filterType !== 'all' && doc.type !== state.filterType) return false;
//         if (state.filterAuth !== 'all' && doc.issuingAuth !== state.filterAuth) return false;
//         if (state.filterStatus !== 'all' && doc.status !== state.filterStatus) return false;
//         if (doc.year < state.yrFrom || doc.year > state.yrTo) return false;
//         if (state.searchQuery) { const q = state.searchQuery.toLowerCase(); if (![doc.title, doc.refNo, doc.issuingAuth, doc.subject, doc.date].join(' ').toLowerCase().includes(q)) return false; }
//         return true;
//     }
//     function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
//     function typePill(type) { const m = TYPE_META[type] || TYPE_META.notification; return `<span class="ce-pill" style="background:${m.light};color:${m.accent};border-color:${m.accent}44">${m.short}</span>`; }
//     function statusPill(s) { const ok = s === 'Active'; return `<span class="ce-pill ${ok ? 'ce-pill-ok' : 'ce-pill-sup'}">${ok ? '● Active' : '○ Superseded'}</span>`; }

//     /* ─── STYLES ──────────────────────── */
//     function injectStyles() {
//         if (document.getElementById('ce-v3')) return;
//         const s = document.createElement('style'); s.id = 'ce-v3';
//         s.textContent = `
// @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
// .ce-root{
//   --ink:#111827;--ink2:#4b5563;--ink3:#9ca3af;--line:#e5e7eb;--line2:#d1d5db;
//   --bg:#f9fafb;--surf:#fff;--surf2:#f3f4f6;
//   --sel:#1d4ed8;--sel-l:#eff6ff;--sel-b:#bfdbfe;
//   font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink);background:var(--bg);
//   height:100%;display:flex;flex-direction:column;
// }
// .ce-root*{box-sizing:border-box;margin:0;padding:0;}
// .ce-root button{font-family:'DM Sans',sans-serif;}

// /* shell */
// .ce-shell{display:flex;flex-direction:column;flex:1;min-height:0;}
// .ce-topzone{flex-shrink:0;}

// /* new wrapper — stacks scroll area above detail panel */
// .ce-body-split {
//     flex: 1;
//     min-height: 0;
//     display: flex;
//     flex-direction: column;
//     overflow: hidden;
// }

// /* fix timeline body — only horizontal scroll, no vertical bleed */
// .ce-tl-body {
//     flex: 1;
//     min-height: 0;
//     overflow-x: auto;
//     overflow-y: hidden;    /* columns scroll internally */
//     padding: 16px;
//     cursor: grab;
//     user-select: none;
// }

// /* each column scrolls its own content vertically */
// .ce-tl-col {
//     width: 230px;
//     flex-shrink: 0;
//     margin-right: 4px;
//     border-right: 1px solid var(--line);
//     padding-right: 14px;
//     overflow-y: auto;
//     height: 100%;
// }

// .ce-tl-inner {
//     display: flex;
//     gap: 0;
//     min-width: max-content;
//     align-items: stretch;
//     height: 100%;
// }

// /* toolbar */
// .ce-toolbar{display:flex;align-items:center;gap:10px;padding:10px 16px;background:var(--surf);border-bottom:1px solid var(--line);flex-wrap:wrap;}
// .ce-sw{position:relative;flex:1;min-width:180px;max-width:320px;}
// .ce-sw-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--ink3);pointer-events:none;font-size:13px;}
// .ce-search{width:100%;padding:7px 10px 7px 30px;border:1.5px solid var(--line2);border-radius:7px;font-size:13px;background:var(--surf);color:var(--ink);outline:none;transition:border .15s;font-family:'DM Sans',sans-serif;}
// .ce-search:focus{border-color:var(--sel);box-shadow:0 0 0 3px #1d4ed815;}
// .ce-search::placeholder{color:var(--ink3);}
// .ce-spacer{flex:1;}
// .ce-tabs{display:flex;border:1.5px solid var(--line2);border-radius:8px;overflow:hidden;}
// .ce-tab{padding:7px 16px;font-size:12px;font-weight:600;background:none;border:none;cursor:pointer;color:var(--ink2);transition:all .15s;white-space:nowrap;font-family:'DM Sans',sans-serif;}
// .ce-tab.on{background:var(--sel);color:#fff;}
// .ce-tab:not(.on):hover{background:var(--line);}

// /* filters */
// .ce-filters{display:flex;gap:10px;align-items:flex-end;padding:8px 16px;background:var(--surf2);border-bottom:1px solid var(--line);flex-wrap:wrap;}
// .ce-fg{display:flex;flex-direction:column;gap:3px;}
// .ce-flbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-family:'JetBrains Mono',monospace;}
// .ce-fsel{padding:6px 10px;border:1px solid var(--line2);border-radius:6px;font-size:12px;color:var(--ink);background:var(--surf);cursor:pointer;outline:none;font-family:'DM Sans',sans-serif;min-width:130px;}
// .ce-fsel:focus{border-color:var(--sel);}
// .ce-yr-row{display:flex;align-items:center;gap:5px;}
// .ce-yr-in{width:58px;padding:6px 8px;border:1px solid var(--line2);border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ink);background:var(--surf);text-align:center;outline:none;}
// .ce-yr-in:focus{border-color:var(--sel);}
// .ce-yr-in.err{border-color:#dc2626;background:#fef2f2;}

// /* legend */
// .ce-legend{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:7px 16px;background:var(--surf);border-bottom:1px solid var(--line);font-size:11px;}
// .ce-leg-grp{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
// .ce-leg-lbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-family:'JetBrains Mono',monospace;padding-right:4px;}
// .ce-leg-item{display:flex;align-items:center;gap:4px;cursor:default;}
// .ce-leg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
// .ce-leg-name{font-size:11px;color:var(--ink2);font-weight:500;}
// .ce-leg-sep{width:1px;height:14px;background:var(--line2);margin:0 4px;}

// /* pills */
// .ce-pill{display:inline-flex;align-items:center;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;border:1px solid transparent;font-family:'JetBrains Mono',monospace;letter-spacing:.02em;white-space:nowrap;}
// .ce-pill-ok{background:#ecfdf5;color:#065f46;border-color:#059669 !important;}
// .ce-pill-sup{background:#fef9c3;color:#713f12;border-color:#ca8a04 !important;}

// /* ── BODY LAYOUT — KEY FIX ── */
// .ce-body{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;}
// .ce-hier-body{flex:1;min-height:0;overflow-y:auto;padding:16px;}
// .ce-tl-body{flex:1;min-height:0;overflow-x:auto;overflow-y:hidden;padding:16px;cursor:grab;user-select:none;}
// .ce-lin-body{flex:1;min-height:0;overflow-y:auto;padding:20px;}

// /* ── HIERARCHY TREE ── */
// .ce-hier-layout{display:flex;gap:16px;align-items:flex-start;}
// .ce-main-tree{flex:1;min-width:0;}
// .ce-auth-hdr{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);font-family:'JetBrains Mono',monospace;padding:10px 0 6px;border-bottom:1.5px solid var(--line);margin-bottom:8px;display:flex;align-items:center;gap:6px;}
// .ce-auth-hdr:not(:first-child){margin-top:20px;}

// .ce-node-row{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:7px;cursor:pointer;border:1px solid transparent;transition:background .12s,border-color .12s;}
// .ce-node-row:hover{background:var(--sel-l);border-color:var(--sel-b);}
// .ce-node-row.sel{background:var(--sel-l);border-color:var(--sel);}
// .ce-node-row.dimmed{opacity:.22;pointer-events:none;}
// .ce-tog{width:16px;height:16px;flex-shrink:0;margin-top:2px;border:1px solid var(--line2);border-radius:3px;background:var(--surf);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;cursor:pointer;color:var(--ink3);transition:all .12s;line-height:1;}
// .ce-tog:hover{background:var(--sel);color:#fff;border-color:var(--sel);}
// .ce-tog.ghost{visibility:hidden;}
// .ce-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:3px;}
// .ce-nbody{flex:1;min-width:0;}
// /* FULL TITLE — no truncation */
// .ce-ntitle{font-size:13px;font-weight:500;color:var(--ink);line-height:1.45;margin-bottom:3px;word-break:break-word;}
// .ce-ntitle.struck{text-decoration:line-through;color:var(--ink3);}
// .ce-nmeta{font-size:11px;color:var(--ink2);display:flex;gap:5px;align-items:center;flex-wrap:wrap;margin-bottom:4px;}
// .ce-nref{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink3);}
// .ce-npills{display:flex;gap:4px;flex-wrap:wrap;}

// /* tree connectors */
// .ce-children{position:relative;margin-left:12px;padding-left:20px;}
// .ce-children::before{content:'';position:absolute;left:7px;top:0;bottom:16px;width:1.5px;background:var(--line2);}
// .ce-child-wrap{position:relative;margin-bottom:2px;}
// .ce-child-wrap::before{content:'';position:absolute;left:-13px;top:14px;width:13px;height:1.5px;background:var(--line2);}

// /* standalone sidebar */
// .ce-standalone{width:230px;flex-shrink:0;border:1.5px solid var(--line);border-radius:10px;overflow:hidden;background:var(--surf);}
// .ce-sa-hdr{padding:10px 12px;background:var(--surf2);border-bottom:1px solid var(--line);}
// .ce-sa-hdr-title{font-size:11px;font-weight:700;color:var(--ink);margin-bottom:2px;}
// .ce-sa-hdr-sub{font-size:10px;color:var(--ink3);line-height:1.5;}
// .ce-sa-item{padding:10px 12px;border-bottom:1px solid var(--line);cursor:pointer;transition:background .12s;}
// .ce-sa-item:last-child{border-bottom:none;}
// .ce-sa-item:hover{background:var(--sel-l);}
// .ce-sa-item.sel{background:var(--sel-l);}
// .ce-sa-title{font-size:12px;font-weight:500;color:var(--ink);line-height:1.4;margin-bottom:3px;}
// .ce-sa-auth{font-size:10px;color:var(--ink3);margin-bottom:4px;}

// /* ── TIMELINE ── */
// .ce-tl-inner{display:flex;gap:0;min-width:max-content;align-items:stretch;height:100%;}
// .ce-tl-col{width:230px;flex-shrink:0;margin-right:4px;border-right:1px solid var(--line);padding-right:14px;overflow-y:auto;height:100%;}
// .ce-tl-col:last-child{border-right:none;}
// .ce-tl-hd{margin-bottom:12px;padding-bottom:10px;border-bottom:2px solid var(--ink);}
// .ce-tl-yr{font-family:'Crimson Pro',serif;font-size:28px;font-weight:600;color:var(--ink);line-height:1;}
// .ce-tl-cnt{font-size:10px;color:var(--ink3);font-family:'JetBrains Mono',monospace;margin-top:2px;}
// .ce-tl-tier{margin-bottom:12px;}
// .ce-tl-tier-lbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;font-family:'JetBrains Mono',monospace;padding:3px 0;margin-bottom:6px;border-bottom:1px solid var(--line);}
// .ce-tl-card{padding:9px 10px;border-radius:6px;cursor:pointer;margin-bottom:5px;background:var(--surf);border:1px solid var(--line);border-left-width:3px;transition:box-shadow .12s,transform .12s;}
// .ce-tl-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.07);transform:translateY(-1px);}
// .ce-tl-card.sel{outline:2px solid var(--sel);outline-offset:1px;background:var(--sel-l);}
// .ce-tl-ctitle{font-size:12px;font-weight:500;color:var(--ink);line-height:1.4;margin-bottom:2px;word-break:break-word;}
// .ce-tl-ctitle.struck{text-decoration:line-through;color:var(--ink3);}
// .ce-tl-date{font-size:10px;color:var(--ink3);font-family:'JetBrains Mono',monospace;margin-bottom:5px;}

// /* ── LINEAGE VIEW ── */
// .ce-lin-shell{max-width:820px;margin:0 auto;}
// .ce-back{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border:1.5px solid var(--line2);border-radius:6px;background:var(--surf);color:var(--ink2);font-size:12px;font-weight:600;cursor:pointer;margin-bottom:18px;transition:all .12s;}
// .ce-back:hover{border-color:var(--sel);color:var(--sel);background:var(--sel-l);}
// .ce-lin-hdr{margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid var(--ink);display:flex;align-items:baseline;gap:10px;}
// .ce-lin-hdr-t{font-family:'Crimson Pro',serif;font-size:22px;font-weight:600;color:var(--ink);}
// .ce-lin-hdr-s{font-size:11px;color:var(--ink3);}

// /* lineage node card */
// .ce-ln-card{border:1.5px solid var(--line);border-radius:8px;padding:14px 16px;background:var(--surf);border-left-width:4px;margin-bottom:0;}
// .ce-ln-card.focus{border-color:var(--sel) !important;background:var(--sel-l);box-shadow:0 0 0 3px #1d4ed820;}
// .ce-ln-card.anc{opacity:.85;}
// .ce-ln-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;font-family:'JetBrains Mono',monospace;margin-bottom:4px;}
// .ce-ln-title{font-family:'Crimson Pro',serif;font-size:17px;font-weight:600;color:var(--ink);line-height:1.35;margin-bottom:5px;word-break:break-word;}
// .ce-ln-meta{font-size:11px;color:var(--ink2);line-height:1.7;margin-bottom:6px;}
// .ce-ln-meta b{color:var(--ink);font-weight:600;}

// /* connector */
// .ce-conn{display:flex;flex-direction:column;align-items:center;padding:6px 0;flex-shrink:0;width:28px;}
// .ce-conn-v{width:2px;height:18px;background:var(--line2);}
// .ce-conn-arr{font-size:13px;color:var(--ink3);line-height:1;}

// /* siblings / children row */
// .ce-sib-section{margin-top:8px;}
// .ce-sib-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);font-family:'JetBrains Mono',monospace;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--line);}
// .ce-sib-row{display:flex;gap:8px;flex-wrap:wrap;}
// .ce-sib-card{flex:1;min-width:150px;max-width:260px;border:1.5px solid var(--line);border-radius:8px;padding:10px 12px;cursor:pointer;transition:all .12s;background:var(--surf);border-left-width:3px;}
// .ce-sib-card:hover{border-color:var(--sel) !important;background:var(--sel-l);}
// .ce-sib-card.focus{border-color:var(--sel) !important;background:var(--sel-l);}
// .ce-sib-type{font-size:10px;font-weight:700;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:4px;}
// .ce-sib-title{font-size:12px;font-weight:500;color:var(--ink);line-height:1.4;margin-bottom:3px;word-break:break-word;}
// .ce-sib-ref{font-size:10px;color:var(--ink3);font-family:'JetBrains Mono',monospace;margin-bottom:4px;}

// /* supersession chain */
// .ce-sup-box{background:var(--surf2);border:1px solid var(--line);border-radius:8px;padding:12px 14px;margin-top:10px;}
// .ce-sup-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);font-family:'JetBrains Mono',monospace;margin-bottom:8px;}
// .ce-sup-items{display:flex;align-items:center;gap:5px;flex-wrap:wrap;}
// .ce-sup-item{padding:4px 10px;border-radius:6px;font-size:11px;font-weight:500;border:1px solid var(--line);background:var(--surf);cursor:pointer;transition:all .12s;}
// .ce-sup-item:hover{background:var(--sel-l);border-color:var(--sel-b);}
// .ce-sup-item.cur{background:var(--sel-l);border-color:var(--sel);font-weight:700;}
// .ce-sup-arrow{color:var(--ink3);font-size:13px;}

// /* ── DETAIL PANEL ── */
// .ce-dp{flex-shrink:0;border-top:1.5px solid var(--line);background:var(--surf);padding:14px 16px;display:none;max-height:240px;overflow-y:auto;}
// .ce-dp.vis{display:flex;gap:20px;flex-wrap:wrap;animation:ceIn .15s ease;}
// @keyframes ceIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
// .ce-dp-l{flex:1;min-width:200px;}
// .ce-dp-r{width:260px;flex-shrink:0;}
// .ce-dp-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;font-family:'JetBrains Mono',monospace;margin-bottom:4px;}
// .ce-dp-title{font-family:'Crimson Pro',serif;font-size:18px;font-weight:600;color:var(--ink);line-height:1.35;margin-bottom:10px;}
// .ce-dp-grid{display:grid;grid-template-columns:100px 1fr;gap:4px 12px;font-size:12px;margin-bottom:10px;}
// .ce-dp-lbl{color:var(--ink3);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;font-family:'JetBrains Mono',monospace;padding-top:2px;}
// .ce-dp-val{color:var(--ink);font-size:12px;}
// .ce-dp-acts{display:flex;gap:8px;flex-wrap:wrap;}
// .ce-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .12s;border:1.5px solid;}
// .ce-btn-blue{background:var(--sel);color:#fff;border-color:var(--sel);}
// .ce-btn-blue:hover{background:#1e40af;}
// .ce-chain-wrap{margin-top:10px;padding-top:10px;border-top:1px solid var(--line);}
// .ce-chain-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-family:'JetBrains Mono',monospace;margin-bottom:5px;}
// .ce-chain-pills{display:flex;align-items:center;gap:4px;flex-wrap:wrap;}
// .ce-cpill{padding:3px 8px;border-radius:4px;font-size:11px;font-weight:500;}
// .ce-chain-arr{color:var(--ink3);font-size:12px;}
// .ce-sup-notice{padding:8px 12px;background:#fef9c3;border:1px solid #fcd34d;border-radius:6px;font-size:11px;color:#713f12;cursor:pointer;transition:background .12s;margin-top:8px;display:flex;align-items:center;gap:6px;}
// .ce-sup-notice:hover{background:#fef08a;}

// /* ── EMPTY ── */
// .ce-empty{padding:40px;text-align:center;color:var(--ink3);font-family:'Crimson Pro',serif;font-size:17px;font-style:italic;}

// /* ── SCROLLBAR ── */
// .ce-root ::-webkit-scrollbar{width:5px;height:5px;}
// .ce-root ::-webkit-scrollbar-track{background:transparent;}
// .ce-root ::-webkit-scrollbar-thumb{background:var(--line2);border-radius:99px;}
//     `;
//         document.head.appendChild(s);
//     }

//     /* ─── LEGEND ─────────────────────── */
//     function renderLegend() {
//         const b = el('div', 'ce-legend');
//         const tg = el('div', 'ce-leg-grp');
//         tg.appendChild(el('span', 'ce-leg-lbl', 'Document type:'));
//         Object.entries(TYPE_META).forEach(([k, m]) => {
//             const item = el('div', 'ce-leg-item'); item.title = m.desc;
//             const dot = el('div', 'ce-leg-dot'); dot.style.background = m.dot;
//             item.appendChild(dot); item.appendChild(el('span', 'ce-leg-name', m.label));
//             tg.appendChild(item);
//         });
//         b.appendChild(tg);
//         b.appendChild(el('div', 'ce-leg-sep'));
//         const sg = el('div', 'ce-leg-grp');
//         sg.appendChild(el('span', 'ce-leg-lbl', 'Status:'));
//         sg.innerHTML += `<span class="ce-pill ce-pill-ok">● Active — currently in force</span> <span class="ce-pill ce-pill-sup">○ Superseded — replaced by newer version</span>`;
//         b.appendChild(sg);
//         return b;
//     }

//     /* ─── TOOLBAR ─────────────────────── */
//     function renderToolbar() {
//         const bar = el('div', 'ce-toolbar');
//         const sw = el('div', 'ce-sw'); sw.innerHTML = `<span class="ce-sw-icon">⌕</span>`;
//         const inp = el('input', 'ce-search'); inp.type = 'text'; inp.placeholder = 'Search title, ref. no., subject…'; inp.value = state.searchQuery;
//         inp.oninput = e => { state.searchQuery = e.target.value; render(); };
//         sw.appendChild(inp); bar.appendChild(sw);
//         bar.appendChild(el('div', 'ce-spacer'));
//         const tabs = el('div', 'ce-tabs');
//         [['hierarchy', '⊹ Hierarchy'], ['timeline', '◫ Timeline']].forEach(([v, l]) => {
//             const b = el('button', 'ce-tab' + (state.view === v ? ' on' : ''), l);
//             b.onclick = () => { state.view = v; state.lineageFocusId = null; render(); };
//             tabs.appendChild(b);
//         });
//         bar.appendChild(tabs);
//         return bar;
//     }

//     /* ─── FILTERS ─────────────────────── */
//     function renderFilters() {
//         const row = el('div', 'ce-filters');
//         function fg(lbl, opts, cur, cb) {
//             const g = el('div', 'ce-fg'); g.appendChild(el('div', 'ce-flbl', lbl));
//             const s = el('select', 'ce-fsel');
//             opts.forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; if (v === cur) o.selected = true; s.appendChild(o); });
//             s.onchange = e => { cb(e.target.value); render(); }; g.appendChild(s); return g;
//         }
//         row.appendChild(fg('Type', [['all', 'All types'], ['act', 'Act'], ['md', 'Master Direction'], ['mc', 'Master Circular'], ['circular', 'Circular'], ['notification', 'Notification']], state.filterType, v => state.filterType = v));
//         row.appendChild(fg('Authority', [['all', 'All authorities'], ...getAllAuthorities().map(a => [a, a])], state.filterAuth, v => state.filterAuth = v));
//         row.appendChild(fg('Status', [['all', 'All statuses'], ['Active', 'Active (In Force)'], ['Superseded', 'Superseded']], state.filterStatus, v => state.filterStatus = v));
//         const yg = el('div', 'ce-fg'); yg.appendChild(el('div', 'ce-flbl', 'Year Range'));
//         const yr = el('div', 'ce-yr-row');
//         const mki = (val, isFrom) => {
//             const i = el('input', 'ce-yr-in'); i.type = 'number'; i.value = val; i.placeholder = 'YYYY';
//             i.oninput = e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1800 && v <= 2100) { i.classList.remove('err'); isFrom ? (state.yrFrom = Math.min(v, state.yrTo)) : (state.yrTo = Math.max(v, state.yrFrom)); render(); } else i.classList.add('err'); };
//             return i;
//         };
//         yr.appendChild(mki(state.yrFrom, true)); yr.appendChild(el('span', '', `<span style="color:var(--ink3)">–</span>`)); yr.appendChild(mki(state.yrTo, false));
//         yg.appendChild(yr); row.appendChild(yg);
//         return row;
//     }

//     /* ─── TREE NODE ───────────────────── */
//     function makeTreeNode(doc) {
//         const m = TYPE_META[doc.type] || TYPE_META.notification;
//         const children = getChildren(doc.id);
//         const show = matchesFilters(doc);
//         const isOpen = !state.collapsed[doc.id];
//         const wrap = el('div');
//         const row = el('div', 'ce-node-row' + (state.selectedId === doc.id ? ' sel' : '') + (!show ? ' dimmed' : ''));
//         const tog = el('div', 'ce-tog' + (children.length ? '' : ' ghost'), children.length ? (isOpen ? '−' : '+') : '·');
//         if (children.length) tog.onclick = e => { e.stopPropagation(); state.collapsed[doc.id] = isOpen; render(); };
//         row.appendChild(tog);
//         const dot = el('div', 'ce-dot'); dot.style.background = m.dot;
//         row.appendChild(dot);
//         const body = el('div', 'ce-nbody');
//         body.appendChild(el('div', 'ce-ntitle' + (doc.status === 'Superseded' ? ' struck' : ''), doc.title));
//         const meta = el('div', 'ce-nmeta');
//         meta.innerHTML = `<span>${doc.issuingAuth}</span><span style="color:var(--line2)">·</span><span class="ce-nref">${doc.date}</span><span style="color:var(--line2)">·</span><span class="ce-nref">${doc.refNo}</span>`;
//         body.appendChild(meta);
//         const pills = el('div', 'ce-npills'); pills.innerHTML = typePill(doc.type) + ' ' + statusPill(doc.status);
//         body.appendChild(pills);
//         row.appendChild(body);
//         row.onclick = () => { state.selectedId = doc.id; render(); };
//         wrap.appendChild(row);
//         if (children.length && isOpen) {
//             const cw = el('div', 'ce-children');
//             children.forEach(c => { const cr = el('div', 'ce-child-wrap'); cr.appendChild(makeTreeNode(c)); cw.appendChild(cr); });
//             wrap.appendChild(cw);
//         }
//         return wrap;
//     }

//     /* ─── DETAIL PANEL ────────────────── */
//     function renderDetailPanel() {
//         const panel = el('div', 'ce-dp');
//         if (!state.selectedId) return panel;
//         const doc = state.byId[state.selectedId]; if (!doc) return panel;
//         panel.classList.add('vis');
//         const m = TYPE_META[doc.type] || TYPE_META.notification;
//         const ancs = getAncestors(state.selectedId);
//         const left = el('div', 'ce-dp-l');
//         const t = el('div', 'ce-dp-type'); t.style.color = m.accent; t.textContent = m.label;
//         left.appendChild(t);
//         left.appendChild(el('div', 'ce-dp-title', doc.title));
//         const grid = el('div', 'ce-dp-grid');
//         [['Authority', doc.issuingAuth], ['Date', doc.date], ['Ref No.', `<span style="font-family:'JetBrains Mono',monospace">${doc.refNo}</span>`], ['Status', statusPill(doc.status)], ['Subject', doc.subject]].forEach(([l, v]) => {
//             grid.appendChild(el('div', 'ce-dp-lbl', l));
//             const dv = el('div', 'ce-dp-val'); dv.innerHTML = v; grid.appendChild(dv);
//         });
//         left.appendChild(grid);
//         if (ancs.length) {
//             const cw = el('div', 'ce-chain-wrap');
//             cw.appendChild(el('div', 'ce-chain-lbl', 'Regulatory lineage'));
//             const cp = el('div', 'ce-chain-pills');
//             ancs.forEach((a, i) => {
//                 const am = TYPE_META[a.type] || TYPE_META.notification;
//                 if (i > 0) cp.appendChild(el('span', 'ce-chain-arr', '›'));
//                 const pill = el('span', 'ce-cpill'); pill.style.background = am.light; pill.style.color = am.accent; pill.textContent = a.title;
//                 cp.appendChild(pill);
//             });
//             cp.appendChild(el('span', 'ce-chain-arr', '›'));
//             const cur = el('span', 'ce-cpill'); cur.style.background = m.light; cur.style.color = m.accent; cur.textContent = doc.title;
//             cp.appendChild(cur);
//             cw.appendChild(cp); left.appendChild(cw);
//         }
//         const right = el('div', 'ce-dp-r');
//         const acts = el('div', 'ce-dp-acts');
//         const lb = el('button', 'ce-btn ce-btn-blue', '⊹ Full Lineage');
//         lb.onclick = () => { state._prevView = state.view; state.lineageFocusId = state.selectedId; state.view = 'lineage'; render(); };
//         acts.appendChild(lb); right.appendChild(acts);
//         if (doc.supersededBy && state.byId[doc.supersededBy]) {
//             const newer = state.byId[doc.supersededBy];
//             const sn = el('div', 'ce-sup-notice');
//             sn.innerHTML = `⚠ Superseded by: <strong>${newer.title}</strong> (${newer.date}) — click to view`;
//             sn.onclick = () => { state.selectedId = newer.id; render(); };
//             right.appendChild(sn);
//         }
//         panel.appendChild(left); panel.appendChild(right);
//         return panel;
//     }

//     /* ─── HIERARCHY VIEW ──────────────── */
//     function renderHierarchy() {
//         const body = el('div', 'ce-hier-body');
//         const layout = el('div', 'ce-hier-layout');
//         const main = el('div', 'ce-main-tree');
//         const roots = state.docs.filter(d => !d.parentId && d.type !== 'notification');
//         const byAuth = {};
//         roots.forEach(r => { if (!byAuth[r.issuingAuth]) byAuth[r.issuingAuth] = []; byAuth[r.issuingAuth].push(r); });
//         if (!roots.length) main.appendChild(el('div', 'ce-empty', 'No documents match the current filters.'));
//         else Object.entries(byAuth).forEach(([auth, docs]) => {
//             const hdr = el('div', 'ce-auth-hdr'); hdr.innerHTML = `<span>📋</span><span>${auth}</span>`;
//             main.appendChild(hdr);
//             docs.forEach(d => main.appendChild(makeTreeNode(d)));
//         });
//         layout.appendChild(main);
//         const notifs = state.docs.filter(d => d.type === 'notification');
//         if (notifs.length) {
//             const aside = el('div', 'ce-standalone');
//             const hdr = el('div', 'ce-sa-hdr');
//             hdr.innerHTML = `<div class="ce-sa-hdr-title">Standalone Notifications</div><div class="ce-sa-hdr-sub">From SEBI, IRDAI &amp; others — independent of RBI's hierarchy</div>`;
//             aside.appendChild(hdr);
//             notifs.forEach(d => {
//                 const item = el('div', 'ce-sa-item' + (state.selectedId === d.id ? ' sel' : '') + (!matchesFilters(d) ? ' dimmed' : ''));
//                 item.innerHTML = `<div class="ce-sa-title">${d.title}</div><div class="ce-sa-auth">${d.issuingAuth}</div><div style="display:flex;gap:4px;flex-wrap:wrap">${typePill(d.type)} ${statusPill(d.status)}</div>`;
//                 item.onclick = () => { state.selectedId = d.id; render(); };
//                 aside.appendChild(item);
//             });
//             layout.appendChild(aside);
//         }
//         body.appendChild(layout);
//         // body.appendChild(renderDetailPanel());
//         // return body;
//          const outer = el('div', 'ce-body-split');
//     outer.appendChild(body);
//     outer.appendChild(renderDetailPanel());
//     return outer;
//     }

//     /* ─── TIMELINE VIEW ───────────────── */
//   function renderTimeline() {
//     const outer = el('div', 'ce-body-split');

//     const body = el('div', 'ce-tl-body');
//     body.style.overflowX = 'auto';
//     body.style.overflowY = 'hidden';
//     body.style.display = 'flex';
//     body.style.alignItems = 'flex-start';
//     body.style.padding = '16px 8px';
//     body.style.gap = '16px';
//     body.style.cursor = 'grab';

//     // Smooth drag scroll
//     let isDown = false, startX = 0, scrollLeft = 0;

//     body.addEventListener('mousedown', e => {
//         if (e.target.closest('.ce-tl-card')) return;
//         isDown = true;
//         startX = e.pageX - body.offsetLeft;
//         scrollLeft = body.scrollLeft;
//         body.style.cursor = 'grabbing';
//     });

//     body.addEventListener('mouseleave', () => {
//         isDown = false;
//         body.style.cursor = 'grab';
//     });

//     body.addEventListener('mouseup', () => {
//         isDown = false;
//         body.style.cursor = 'grab';
//     });

//     body.addEventListener('mousemove', e => {
//         if (!isDown) return;
//         e.preventDefault();
//         const x = e.pageX - body.offsetLeft;
//         body.scrollLeft = scrollLeft - (x - startX) * 1.2;
//     });

//     const inner = el('div', 'ce-tl-inner');
//     inner.style.display = 'flex';
//     inner.style.alignItems = 'flex-start';
//     inner.style.gap = '16px';

//     const years = [];
//     for (let y = state.yrFrom; y <= state.yrTo; y++) years.push(y);

//     let any = false;

//     years.forEach(yr => {
//         const docs = state.docs.filter(d => d.year === yr && matchesFilters(d));
//         if (!docs.length) return;

//         any = true;

//         const col = el('div', 'ce-tl-col');
//         col.style.minWidth = '260px';
//         col.style.display = 'flex';
//         col.style.flexDirection = 'column';
//         col.style.gap = '10px';

//         const hd = el('div', 'ce-tl-hd');
//         hd.innerHTML = `
//             <div class="ce-tl-yr">${yr}</div>
//             <div class="ce-tl-cnt">${docs.length} doc${docs.length > 1 ? 's' : ''}</div>
//         `;
//         col.appendChild(hd);

//         ['act', 'md', 'mc', 'circular', 'notification'].forEach(tier => {
//             const td = docs.filter(d => d.type === tier);
//             if (!td.length) return;

//             const m = TYPE_META[tier];

//             const sec = el('div', 'ce-tl-tier');
//             sec.style.display = 'flex';
//             sec.style.flexDirection = 'column';
//             sec.style.gap = '8px';

//             const lbl = el('div', 'ce-tl-tier-lbl');
//             lbl.style.color = m.accent;
//             lbl.textContent = m.label;
//             sec.appendChild(lbl);

//             td.forEach(doc => {
//                 const card = el('div', 'ce-tl-card' + (state.selectedId === doc.id ? ' sel' : ''));

//                 card.style.borderLeft = `3px solid ${m.dot}`;
//                 card.style.padding = '10px';
//                 card.style.borderRadius = '6px';
//                 card.style.background = 'var(--bg2)';
//                 card.style.cursor = 'pointer';
//                 card.style.transition = '0.2s ease';

//                 card.innerHTML = `
//                     <div class="ce-tl-ctitle ${doc.status === 'Superseded' ? 'struck' : ''}">
//                         ${doc.title}
//                     </div>
//                     <div class="ce-tl-date">${doc.date} · ${doc.refNo}</div>
//                     <div style="display:flex;gap:4px;flex-wrap:wrap">
//                         ${statusPill(doc.status)}
//                     </div>
//                 `;

//                 card.onclick = () => {
//                     state.selectedId = doc.id;
//                     render();
//                 };

//                 sec.appendChild(card);
//             });

//             col.appendChild(sec);
//         });

//         inner.appendChild(col);
//     });

//     if (!any) {
//         inner.appendChild(el('div', 'ce-empty', 'No documents in this range.'));
//     }

//     body.appendChild(inner);

//     outer.appendChild(body);
//     outer.appendChild(renderDetailPanel());

//     return outer;
// }

//     /* ─── SUPERSESSION CHAIN ──────────── */
//     function buildSupChain(focusId) {
//         let cur = state.byId[focusId]; if (!cur) return [];
//         const visited = new Set();
//         while (true) { const prev = state.docs.find(d => d.supersededBy === cur.id); if (!prev || visited.has(prev.id)) break; visited.add(prev.id); cur = prev; }
//         const chain = []; let node = cur;
//         while (node) { chain.push(node); if (node.supersededBy) node = state.byId[node.supersededBy]; else break; if (chain.length > 20) break; }
//         return chain.length > 1 ? chain : [];
//     }

//     /* ─── LINEAGE TREE VIEW ───────────── */
//     function renderLineageTree(focusId) {
//         const bodyEl = el('div', 'ce-lin-body');
//         const shell = el('div', 'ce-lin-shell');
//         const back = el('button', 'ce-back', '← Back to ' + (state._prevView === 'timeline' ? 'Timeline' : 'Hierarchy'));
//         back.onclick = () => { state.view = state._prevView || 'hierarchy'; state.lineageFocusId = null; render(); };
//         shell.appendChild(back);
//         const focusDoc = state.byId[focusId];
//         if (!focusDoc) { bodyEl.appendChild(shell); return bodyEl; }
//         const hdr = el('div', 'ce-lin-hdr');
//         hdr.innerHTML = `<div class="ce-lin-hdr-t">Regulatory Lineage</div><div class="ce-lin-hdr-s">Full hierarchy for the selected document</div>`;
//         shell.appendChild(hdr);
//         const ancs = getAncestors(focusId);
//         const m = TYPE_META[focusDoc.type] || TYPE_META.notification;

//         // Ancestors
//         ancs.forEach((a, i) => {
//             const am = TYPE_META[a.type] || TYPE_META.notification;
//             const card = el('div', 'ce-ln-card anc'); card.style.borderLeftColor = am.dot;
//             card.innerHTML = `<div class="ce-ln-type" style="color:${am.accent}">${am.label} · Level ${i + 1} ancestor</div><div class="ce-ln-title">${a.title}</div><div class="ce-ln-meta"><b>Authority:</b> ${a.issuingAuth} &nbsp; <b>Date:</b> ${a.date} &nbsp; <b>Ref:</b> ${a.refNo}<br><b>Subject:</b> ${a.subject}</div><div style="display:flex;gap:5px;flex-wrap:wrap">${typePill(a.type)} ${statusPill(a.status)}</div>`;
//             shell.appendChild(card);
//             const conn = el('div', 'ce-conn'); conn.innerHTML = `<div class="ce-conn-v"></div><div class="ce-conn-arr">↓</div><div class="ce-conn-v"></div>`;
//             shell.appendChild(conn);
//         });

//         // Focus
//         const fc = el('div', 'ce-ln-card focus'); fc.style.borderLeftColor = m.dot;
//         fc.innerHTML = `<div class="ce-ln-type" style="color:${m.accent}">${m.label} <span style="background:var(--sel);color:#fff;font-size:9px;padding:1px 6px;border-radius:3px;margin-left:6px;font-weight:700">VIEWING</span></div><div class="ce-ln-title">${focusDoc.title}</div><div class="ce-ln-meta"><b>Authority:</b> ${focusDoc.issuingAuth}<br><b>Date:</b> ${focusDoc.date} &nbsp; <b>Ref:</b> ${focusDoc.refNo}<br><b>Subject:</b> ${focusDoc.subject}</div><div style="display:flex;gap:5px;flex-wrap:wrap">${typePill(focusDoc.type)} ${statusPill(focusDoc.status)}</div>`;
//         shell.appendChild(fc);

//         // Siblings
//         if (focusDoc.parentId) {
//             const siblings = getChildren(focusDoc.parentId).filter(c => c.id !== focusId);
//             if (siblings.length) {
//                 const sec = el('div', 'ce-sib-section');
//                 shell.appendChild(el('div','ce-sib-lbl','── Related Documents ──'));
//                 sec.appendChild(el('div', 'ce-sib-lbl', `Siblings — other documents under the same parent (${siblings.length})`));
//                 const row = el('div', 'ce-sib-row');
//                 siblings.forEach(s => {
//                     const sm = TYPE_META[s.type] || TYPE_META.notification;
//                     const sc = el('div', 'ce-sib-card'); sc.style.borderLeftColor = sm.dot;
//                     sc.innerHTML = `<div class="ce-sib-type" style="color:${sm.accent}">${sm.label}</div><div class="ce-sib-title">${s.title}</div><div class="ce-sib-ref">${s.date} · ${s.refNo}</div><div style="display:flex;gap:4px">${statusPill(s.status)}</div>`;
//                     sc.onclick = () => { state.lineageFocusId = s.id; render(); };
//                     row.appendChild(sc);
//                 });
//                 sec.appendChild(row);
//                 shell.appendChild(sec);
//             }
//         }

//         // Children
//         const children = getChildren(focusId);
//         if (children.length) {
//             const conn = el('div', 'ce-conn'); conn.innerHTML = `<div class="ce-conn-v"></div><div class="ce-conn-arr">↓</div><div class="ce-conn-v"></div>`;
//             shell.appendChild(conn);
//             const sec = el('div', 'ce-sib-section');
//             sec.appendChild(el('div', 'ce-sib-lbl', `Derived from this document (${children.length})`));
//             const row = el('div', 'ce-sib-row');
//             children.forEach(c => {
//                 const cm = TYPE_META[c.type] || TYPE_META.notification;
//                 const cc = el('div', 'ce-sib-card'); cc.style.borderLeftColor = cm.dot;
//                 cc.innerHTML = `<div class="ce-sib-type" style="color:${cm.accent}">${cm.label}</div><div class="ce-sib-title">${c.title}</div><div class="ce-sib-ref">${c.date} · ${c.refNo}</div><div style="display:flex;gap:4px">${statusPill(c.status)}</div>`;
//                 cc.onclick = () => { state.lineageFocusId = c.id; render(); };
//                 row.appendChild(cc);
//             });
//             sec.appendChild(row);
//             shell.appendChild(sec);
//         }

//         // Supersession chain
//         const chain = buildSupChain(focusId);
//         if (chain.length) {
//             const box = el('div', 'ce-sup-box');
//             box.appendChild(el('div', 'ce-sup-lbl', 'Annual supersession chain — same circular updated each year'));
//             const items = el('div', 'ce-sup-items');
//             chain.forEach((d, i) => {
//                 const isThis = d.id === focusId;
//                 const item = el('div', 'ce-sup-item' + (isThis ? ' cur' : ''));
//                 item.innerHTML = `${d.year || d.date} ${statusPill(d.status)}`;
//                 item.title = d.title; item.onclick = () => { state.lineageFocusId = d.id; render(); };
//                 items.appendChild(item);
//                 if (i < chain.length - 1) items.appendChild(el('span', 'ce-sup-arrow', '→'));
//             });
//             box.appendChild(items);
//             shell.appendChild(box);
//         }

//         bodyEl.appendChild(shell);
//         return bodyEl;
//     }

//     /* ─── MAIN RENDER ─────────────────── */
//     function render() {
//         const c = state.container;
//         c.innerHTML = ''; c.className = 'ce-root';
//         const shell = el('div', 'ce-shell');
//         const top = el('div', 'ce-topzone');
//         top.appendChild(renderToolbar());
//         if (state.view !== 'lineage') top.appendChild(renderFilters());
//         top.appendChild(renderLegend());
//         shell.appendChild(top);
//         const body = el('div', 'ce-body');
//         if (state.view === 'lineage' && state.lineageFocusId) body.appendChild(renderLineageTree(state.lineageFocusId));
//         else if (state.view === 'hierarchy') body.appendChild(renderHierarchy());
//         else body.appendChild(renderTimeline());
//         shell.appendChild(body);
//         c.appendChild(shell);
//     }

//     /* ─── PUBLIC API ──────────────────── */
//     global.CircularExplorer = {
//         init(options = {}) {
//             const id = options.containerId || 'circular-explorer';
//             const container = document.getElementById(id);
//             if (!container) { console.error('CircularExplorer: #' + id + ' not found'); return; }
//             injectStyles();
//             state.container = container;
//             state.docs = options.documents || SAMPLE_DOCS;
//             state.byId = {}; state.docs.forEach(d => state.byId[d.id] = d);
//             const years = state.docs.map(d => d.year).filter(Boolean);
//             state.yrFrom = options.yrFrom || Math.min(...years);
//             state.yrTo = options.yrTo || Math.max(...years);
//             render();
//         },
//         loadDocuments(docs) {
//             state.docs = docs; state.byId = {}; docs.forEach(d => state.byId[d.id] = d); render();
//         }
//     };
// })(window);













/**
 * CircularExplorer v3 — Regulatory Document Hierarchy & Timeline Explorer
 * - Fixed-height scrollable timeline (no full-page scroll)
 * - Full branching tree in Lineage view
 * - Titles always fully visible (no truncation)
 * - Color legend always visible
 * - "Standalone" sidebar explained
 * - Active/Superseded clearly labelled
 */





// (function (global) {

//   'use strict';

//   const TYPE_META = {
//     act:          { label:'Act',              short:'ACT', color:'#1e2a6e', light:'#eef0fb', accent:'#3b4fce', dot:'#2D3A8C' },
//     md:           { label:'Master Direction', short:'MD',  color:'#0d3320', light:'#e8f5ee', accent:'#1e7a52', dot:'#1A6B4A' },
//     mc:           { label:'Master Circular',  short:'MC',  color:'#3d1a00', light:'#fdf0e8', accent:'#c2560c', dot:'#8B3A0F' },
//     circular:     { label:'Circular',         short:'CIR', color:'#062340', light:'#e8f3fd', accent:'#1464a5', dot:'#1A5276' },
//     notification: { label:'Notification',     short:'NTF', color:'#1a1a1a', light:'#f4f4f4', accent:'#555',   dot:'#4A4A4A' },
//   };

//   const SAMPLE_DOCS = [
//     { id:'rbi-act',          type:'act',          title:'Reserve Bank of India Act, 1934',                                   refNo:'Act No. 2 of 1934',          issuingAuth:'Parliament of India',                           date:'1934',        year:1934, status:'Active',     subject:'Establishment of Reserve Bank and monetary authority framework',                            parentId:null,            supersededBy:null },
//     { id:'fema-act',         type:'act',          title:'Foreign Exchange Management Act, 1999',                             refNo:'Act No. 42 of 1999',         issuingAuth:'Parliament of India',                           date:'1999',        year:1999, status:'Active',     subject:'Regulation and management of foreign exchange in India',                                    parentId:null,            supersededBy:null },
//     { id:'md-kyc',           type:'md',           title:'Master Direction on Know Your Customer (KYC)',                      refNo:'RBI/DBR.AML.BC.81/2016',     issuingAuth:'Reserve Bank of India',                         date:'25 Feb 2016', year:2016, status:'Active',     subject:'KYC norms and AML standards for all regulated entities',                                    parentId:'rbi-act',       supersededBy:null },
//     { id:'md-forex',         type:'md',           title:'Master Direction on Foreign Exchange Transactions',                 refNo:'RBI/2015-16/3',              issuingAuth:'Reserve Bank of India',                         date:'01 Jan 2016', year:2016, status:'Active',     subject:'Comprehensive directions for all forex transactions under FEMA',                            parentId:'fema-act',      supersededBy:null },
//     { id:'md-ecb',           type:'md',           title:'Master Direction on External Commercial Borrowings',                refNo:'RBI/2018-19/67',             issuingAuth:'Reserve Bank of India',                         date:'16 Jan 2019', year:2019, status:'Active',     subject:'ECB policy framework, eligible borrowers, permitted end-uses and limits',                   parentId:'fema-act',      supersededBy:null },
//     { id:'mc-kyc-2021',      type:'mc',           title:'Master Circular – KYC Directions 2021',                            refNo:'RBI/2021-22/10',             issuingAuth:'Reserve Bank of India',                         date:'01 Jul 2021', year:2021, status:'Superseded', subject:'Annual consolidation of KYC norms as on 01 July 2021',                                      parentId:'md-kyc',        supersededBy:'mc-kyc-2022' },
//     { id:'c-lrs-2021',       type:'circular',     title:'Circular – Liberalised Remittance Scheme: COVID-19 Clarification', refNo:'AP(DIR) Circ No. 3/2021',    issuingAuth:'Reserve Bank of India',                         date:'05 May 2021', year:2021, status:'Active',     subject:'LRS applicability and reporting requirements post-COVID relief measures',                    parentId:'md-forex',      supersededBy:null },
//     { id:'mc-kyc-2022',      type:'mc',           title:'Master Circular – KYC Directions 2022',                            refNo:'RBI/2022-23/09',             issuingAuth:'Reserve Bank of India',                         date:'01 Jul 2022', year:2022, status:'Superseded', subject:'Annual consolidation of KYC norms as on 01 July 2022',                                      parentId:'md-kyc',        supersededBy:'mc-kyc-2023' },
//     { id:'c-ecb-2022',       type:'circular',     title:'Circular – ECB: Refinancing Norms for Select Sectors',             refNo:'AP(DIR) Circ No. 5/2022',    issuingAuth:'Reserve Bank of India',                         date:'10 Aug 2022', year:2022, status:'Active',     subject:'ECB refinancing now permitted for infrastructure and manufacturing sectors',                 parentId:'md-ecb',        supersededBy:null },
//     { id:'mc-kyc-2023',      type:'mc',           title:'Master Circular – KYC Directions 2023',                            refNo:'RBI/2023-24/14',             issuingAuth:'Reserve Bank of India',                         date:'01 Jul 2023', year:2023, status:'Superseded', subject:'Annual consolidation of KYC norms as on 01 July 2023',                                      parentId:'md-kyc',        supersededBy:'mc-kyc-2024' },
//     { id:'mc-kyc-2024',      type:'mc',           title:'Master Circular – KYC Directions 2024',                            refNo:'RBI/2024-25/14',             issuingAuth:'Reserve Bank of India',                         date:'01 Jul 2024', year:2024, status:'Active',     subject:'Annual consolidation of KYC norms including Video-based Customer Identification (V-CIP)',   parentId:'md-kyc',        supersededBy:null },
//     { id:'mc-forex-2024',    type:'mc',           title:'Master Circular – Foreign Exchange Transactions 2024',             refNo:'RBI/2024-25/11',             issuingAuth:'Reserve Bank of India',                         date:'01 Jul 2024', year:2024, status:'Active',     subject:'Annual consolidation of forex directions covering LRS, trade finance and remittances',       parentId:'md-forex',      supersededBy:null },
//     { id:'c-vcip-2024',      type:'circular',     title:'Circular – Video-based Customer Identification Process (V-CIP)',   refNo:'DOR.AML.REC.35/2024',        issuingAuth:'Reserve Bank of India',                         date:'14 May 2024', year:2024, status:'Active',     subject:'Updated norms for video-based customer identification for KYC compliance',                  parentId:'mc-kyc-2024',   supersededBy:null },
//     { id:'c-lrs-oct-2024',   type:'circular',     title:'Circular – Liberalised Remittance Scheme: Revised Limits',         refNo:'AP(DIR) Circ No. 4/2024',    issuingAuth:'Reserve Bank of India',                         date:'18 Oct 2024', year:2024, status:'Active',     subject:'Revised LRS annual limit and enhanced reporting obligations for AD banks',                  parentId:'mc-forex-2024', supersededBy:null },
//     { id:'c-trade-nov-2024', type:'circular',     title:'Circular – Trade Credit for Imports: Revised Norms',               refNo:'AP(DIR) Circ No. 7/2024',    issuingAuth:'Reserve Bank of India',                         date:'09 Nov 2024', year:2024, status:'Active',     subject:'Enhanced trade credit limits and revised maturity norms for import financing',              parentId:'mc-forex-2024', supersededBy:null },
//     { id:'c-ecb-2024',       type:'circular',     title:'Circular – ECB Policy: Eligible End-Use Clarifications',           refNo:'AP(DIR) Circ No. 2/2024',    issuingAuth:'Reserve Bank of India',                         date:'22 Mar 2024', year:2024, status:'Active',     subject:'Clarification on permitted end-uses for ECB proceeds in infrastructure sector',             parentId:'md-ecb',        supersededBy:null },
//     { id:'n-sebi-algo',      type:'notification', title:'SEBI – Framework for Algorithmic Trading',                         refNo:'SEBI/HO/MRD2/CIR/2024/01',  issuingAuth:'Securities and Exchange Board of India',        date:'02 Feb 2024', year:2024, status:'Active',     subject:'Regulatory framework and risk controls for algorithmic and high-frequency trading',         parentId:null,            supersededBy:null },
//     { id:'n-irdai-ulip',     type:'notification', title:'IRDAI – Unit-Linked Insurance Products (ULIPs)',                   refNo:'IRDAI/Life/CIR/2024/07',     issuingAuth:'Insurance Regulatory and Development Authority', date:'15 Mar 2024', year:2024, status:'Active',     subject:'Revised product structure, charges and disclosure norms for ULIPs',                         parentId:null,            supersededBy:null },
//   ];

//   let state = {
//     docs:[], byId:{}, view:'hierarchy',
//     lineageFocusId:null, selectedId:null,
//     yrFrom:1934, yrTo:2024,
//     filterType:'all', filterAuth:'all', filterStatus:'all',
//     searchQuery:'', container:null, _prevView:'hierarchy', collapsed:{},
//   };

//   function getAncestors(id) {
//     const chain = []; let cur = state.byId[id];
//     while (cur && cur.parentId) { cur = state.byId[cur.parentId]; if (cur) chain.unshift(cur); }
//     return chain;
//   }
//   function getChildren(id) { return state.docs.filter(d => d.parentId === id); }
//   function getAllAuthorities() { return Array.from(new Set(state.docs.map(d => d.issuingAuth))).sort(); }
//   function matchesFilters(doc) {
//     if (state.filterType !== 'all' && doc.type !== state.filterType) return false;
//     if (state.filterAuth !== 'all' && doc.issuingAuth !== state.filterAuth) return false;
//     if (state.filterStatus !== 'all' && doc.status !== state.filterStatus) return false;
//     if (doc.year < state.yrFrom || doc.year > state.yrTo) return false;
//     if (state.searchQuery) {
//       const q = state.searchQuery.toLowerCase();
//       if (![doc.title, doc.refNo, doc.issuingAuth, doc.subject, doc.date].join(' ').toLowerCase().includes(q)) return false;
//     }
//     return true;
//   }
//   function el(tag, cls, html) {
//     const e = document.createElement(tag);
//     if (cls) e.className = cls;
//     if (html !== undefined) e.innerHTML = html;
//     return e;
//   }
//   function typePill(type) {
//     const m = TYPE_META[type] || TYPE_META.notification;
//     return `<span class="ce-pill" style="background:${m.light};color:${m.accent};border-color:${m.accent}55">${m.short}</span>`;
//   }
//   function statusPill(s) {
//     const ok = s === 'Active';
//     return `<span class="ce-pill ${ok ? 'ce-pill-ok' : 'ce-pill-sup'}">${ok ? '● Active' : '○ Superseded'}</span>`;
//   }
//   function buildSupChain(focusId) {
//     let cur = state.byId[focusId]; if (!cur) return [];
//     const visited = new Set();
//     while (true) { const prev = state.docs.find(d => d.supersededBy === cur.id); if (!prev || visited.has(prev.id)) break; visited.add(prev.id); cur = prev; }
//     const chain = []; let node = cur;
//     while (node) { chain.push(node); if (node.supersededBy) node = state.byId[node.supersededBy]; else break; if (chain.length > 20) break; }
//     return chain.length > 1 ? chain : [];
//   }


//   function injectStyles() {
//     if (document.getElementById('ce-v4')) return;
//     const s = document.createElement('style');
//     s.id = 'ce-v4';
//     s.textContent = `
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
// .ce-root{--ink:#1c2537;--ink2:#4a5568;--ink3:#8896a8;--line:#e8edf5;--bg:#f4f7fc;--surf:#ffffff;--sel:#3b63ee;--sel-l:#eff4ff;--sel-b:#c5d5ff;--r:10px;--sh:0 2px 10px rgba(30,50,120,.07);--sh-lg:0 8px 28px rgba(30,50,120,.11);font-family:'Inter',system-ui,sans-serif;font-size:13px;color:var(--ink);background:var(--bg);min-height:100vh;}
// .ce-root *,.ce-root *::before,.ce-root *::after{box-sizing:border-box;margin:0;padding:0;}
// .ce-root button,.ce-root input,.ce-root select{font-family:inherit;}
// .ce-shell{display:flex;flex-direction:column;min-height:100vh;}

// /* topbar */
// .ce-topbar{display:flex;align-items:center;gap:10px;padding:12px 20px;background:var(--surf);border-bottom:1px solid var(--line);flex-wrap:wrap;position:sticky;top:0;z-index:10;}
// .ce-sw{position:relative;flex:1;min-width:200px;max-width:380px;}
// .ce-sw-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink3);font-size:13px;pointer-events:none;}
// .ce-search{width:100%;padding:9px 12px 9px 34px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;color:var(--ink);background:var(--bg);outline:none;transition:border .15s;}
// .ce-search:focus{border-color:var(--sel);background:#fff;}
// .ce-search::placeholder{color:var(--ink3);}
// .ce-spacer{flex:1;}
// .ce-tabs{display:flex;background:var(--bg);border:1.5px solid var(--line);border-radius:8px;overflow:hidden;}
// .ce-tab{padding:8px 16px;font-size:12px;font-weight:600;background:transparent;border:none;cursor:pointer;color:var(--ink2);transition:all .15s;white-space:nowrap;}
// .ce-tab.on{background:var(--sel);color:#fff;}
// .ce-tab:not(.on):hover{background:var(--sel-l);}

// /* legend */
// .ce-legend-bar{background:var(--surf);border-bottom:1px solid var(--line);padding:7px 20px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;}
// .ce-leg-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);}
// .ce-leg-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink2);font-weight:500;}
// .ce-leg-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}

// /* filters */
// .ce-filters{background:var(--surf);border-bottom:1px solid var(--line);padding:10px 20px;display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;}
// .ce-fg{display:flex;flex-direction:column;gap:4px;}
// .ce-flbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);}
// .ce-fsel{padding:7px 10px;border:1.5px solid var(--line);border-radius:7px;font-size:12px;color:var(--ink);background:var(--bg);outline:none;min-width:130px;cursor:pointer;transition:border .15s;}
// .ce-fsel:focus{border-color:var(--sel);background:#fff;}
// .ce-yr-row{display:flex;align-items:center;gap:6px;}
// .ce-yr-in{width:66px;padding:7px 8px;border:1.5px solid var(--line);border-radius:7px;font-size:12px;color:var(--ink);background:var(--bg);text-align:center;outline:none;transition:border .15s;}
// .ce-yr-in:focus{border-color:var(--sel);background:#fff;}
// .ce-yr-in.err{border-color:#ef4444;background:#fff5f5;}

// /* body */
// .ce-body{padding:16px 20px 32px;}

// /* pills */
// .ce-pill{display:inline-flex;align-items:center;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;border:1px solid transparent;white-space:nowrap;letter-spacing:.02em;}
// .ce-pill-ok{background:#e8fff3;color:#0d6e3a;border-color:#a3dfc0!important;}
// .ce-pill-sup{background:#fff8e1;color:#8a6200;border-color:#f0d070!important;}

// /* hierarchy */
// .ce-hier-layout{display:grid;grid-template-columns:1fr 255px;gap:16px;align-items:start;}
// .ce-tree-panel{background:var(--surf);border:1px solid var(--line);border-radius:var(--r);padding:16px;box-shadow:var(--sh);}
// .ce-sa-panel{background:var(--surf);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);}
// .ce-sa-hdr{padding:12px 14px;background:var(--bg);border-bottom:1px solid var(--line);}
// .ce-sa-hdr-title{font-size:12px;font-weight:700;color:var(--ink);margin-bottom:2px;}
// .ce-sa-hdr-sub{font-size:11px;color:var(--ink3);}
// .ce-sa-item{padding:11px 14px;border-bottom:1px solid var(--line);cursor:pointer;transition:background .12s;}
// .ce-sa-item:last-child{border-bottom:none;}
// .ce-sa-item:hover{background:var(--sel-l);}
// .ce-sa-item.sel{background:var(--sel-l);}
// .ce-sa-title{font-size:12px;font-weight:600;color:var(--ink);line-height:1.4;margin-bottom:3px;}
// .ce-sa-auth{font-size:10px;color:var(--ink3);margin-bottom:5px;}
// .ce-auth-hdr{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);padding:5px 4px 7px;border-bottom:1px solid var(--line);margin-bottom:8px;display:flex;align-items:center;gap:6px;}
// .ce-auth-hdr:not(:first-of-type){margin-top:18px;}

// /* tree node */
// .ce-node-row{display:flex;align-items:flex-start;gap:9px;padding:9px;border-radius:8px;cursor:pointer;border:1.5px solid transparent;transition:all .13s;}
// .ce-node-row:hover{background:var(--sel-l);border-color:var(--sel-b);}
// .ce-node-row.sel{background:var(--sel-l);border-color:var(--sel-b);box-shadow:0 2px 8px rgba(59,99,238,.1);}
// .ce-node-row.dimmed{opacity:.2;pointer-events:none;}
// .ce-tog{width:18px;height:18px;flex-shrink:0;margin-top:2px;border:1.5px solid var(--line);border-radius:5px;background:var(--surf);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;cursor:pointer;color:var(--ink3);transition:all .13s;line-height:1;}
// .ce-tog:hover{background:var(--sel);color:#fff;border-color:var(--sel);}
// .ce-tog.ghost{visibility:hidden;}
// .ce-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:4px;}
// .ce-nbody{flex:1;min-width:0;}
// .ce-ntitle{font-size:13px;font-weight:600;color:var(--ink);line-height:1.45;margin-bottom:3px;}
// .ce-ntitle.struck{text-decoration:line-through;color:var(--ink3);}
// .ce-nmeta{font-size:11px;color:var(--ink2);margin-bottom:5px;line-height:1.5;}
// .ce-nref{font-family:'Courier New',monospace;font-size:10px;color:var(--ink3);}
// .ce-npills{display:flex;gap:5px;flex-wrap:wrap;}
// .ce-children{margin-left:12px;padding-left:16px;border-left:2px solid #d8e5f7;padding-top:2px;margin-bottom:4px;}
// .ce-child-wrap{position:relative;margin-bottom:4px;}

// /* timeline */
// .ce-tl-wrap{display:flex;flex-direction:column;gap:8px;}
// .ce-scroll-hint{font-size:11px;color:var(--ink3);text-align:center;padding:4px 0 2px;}
// .ce-tl-scroll{overflow-x:auto;overflow-y:hidden;padding-bottom:10px;cursor:grab;user-select:none;scrollbar-width:thin;scrollbar-color:#b0c0dc var(--line);}
// .ce-tl-scroll:active{cursor:grabbing;}
// .ce-tl-scroll::-webkit-scrollbar{height:8px;}
// .ce-tl-scroll::-webkit-scrollbar-track{background:var(--line);border-radius:999px;}
// .ce-tl-scroll::-webkit-scrollbar-thumb{background:#b0c0dc;border-radius:999px;}
// .ce-tl-scroll::-webkit-scrollbar-thumb:hover{background:#8090bc;}
// .ce-tl-inner{display:flex;gap:14px;min-width:max-content;align-items:flex-start;padding:2px 2px 4px;}
// .ce-tl-col{width:260px;flex-shrink:0;background:var(--surf);border:1px solid var(--line);border-radius:var(--r);padding:14px;box-shadow:var(--sh);}
// .ce-tl-hd{margin-bottom:12px;padding-bottom:10px;border-bottom:2px solid #d4e0f5;display:flex;align-items:baseline;gap:10px;}
// .ce-tl-yr{font-size:26px;font-weight:700;color:var(--sel);line-height:1;}
// .ce-tl-cnt{font-size:11px;color:var(--ink3);}
// .ce-tl-tier{margin-bottom:10px;}
// .ce-tl-tier-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;padding-bottom:5px;margin-bottom:7px;border-bottom:1px dashed #d8e5f7;}
// .ce-tl-card{padding:9px 11px;border-radius:8px;cursor:pointer;margin-bottom:6px;background:var(--bg);border:1.5px solid var(--line);border-left-width:4px;transition:all .13s;}
// .ce-tl-card:hover{background:var(--sel-l);border-color:var(--sel-b);transform:translateY(-1px);box-shadow:var(--sh);}
// .ce-tl-card.sel{background:var(--sel-l);border-color:var(--sel-b);}
// .ce-tl-ctitle{font-size:12px;font-weight:600;color:var(--ink);line-height:1.4;margin-bottom:3px;}
// .ce-tl-ctitle.struck{text-decoration:line-through;color:var(--ink3);}
// .ce-tl-date{font-family:'Courier New',monospace;font-size:10px;color:var(--ink3);margin-bottom:5px;}

// /* drawer */
// .ce-overlay{display:none;position:fixed;inset:0;background:rgba(10,20,50,.3);z-index:200;}
// .ce-overlay.open{display:block;}
// .ce-drawer{position:fixed;top:0;right:0;bottom:0;width:460px;max-width:96vw;background:var(--surf);border-left:1px solid var(--line);z-index:201;display:flex;flex-direction:column;box-shadow:-6px 0 30px rgba(20,40,120,.12);animation:ceSlide .2s ease;}
// @keyframes ceSlide{from{transform:translateX(32px);opacity:0}to{transform:none;opacity:1}}
// .ce-dw-head{padding:20px 22px 16px;border-bottom:1px solid var(--line);flex-shrink:0;}
// .ce-dw-close-row{display:flex;justify-content:flex-end;margin-bottom:12px;}
// .ce-dw-close{border:1.5px solid var(--line);background:var(--bg);color:var(--ink2);width:30px;height:30px;border-radius:7px;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;transition:all .13s;}
// .ce-dw-close:hover{background:#fee2e2;border-color:#fca5a5;color:#b91c1c;}
// .ce-dw-kicker{display:inline-flex;padding:4px 10px;border-radius:5px;font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:10px;}
// .ce-dw-title{font-size:16px;font-weight:700;color:var(--ink);line-height:1.4;margin-bottom:6px;}
// .ce-dw-auth{font-size:12px;color:var(--ink2);}
// .ce-dw-body{flex:1;overflow-y:auto;padding:18px 22px;display:flex;flex-direction:column;gap:14px;}
// .ce-dw-body::-webkit-scrollbar{width:5px;}
// .ce-dw-body::-webkit-scrollbar-thumb{background:#c8d5ea;border-radius:999px;}

// /* drawer sections */
// .ce-dw-sec{border:1px solid var(--line);border-radius:9px;overflow:hidden;}
// .ce-dw-sec-hdr{padding:9px 13px;background:var(--bg);border-bottom:1px solid var(--line);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);}
// .ce-dw-sec-body{padding:13px 14px;}
// .ce-dw-grid{display:grid;grid-template-columns:110px 1fr;gap:8px 10px;font-size:12px;}
// .ce-dw-lbl{color:var(--ink3);font-weight:500;}
// .ce-dw-val{color:var(--ink);line-height:1.5;}
// .ce-dw-mono{font-family:'Courier New',monospace;font-size:11px;}
// .ce-dw-subject{font-size:13px;color:var(--ink);line-height:1.65;}

// /* lineage path in drawer */
// .ce-dw-path{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
// .ce-dw-path-pill{padding:6px 11px;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;border:none;transition:all .13s;line-height:1.3;}
// .ce-dw-path-pill:hover{filter:brightness(.9);}
// .ce-dw-path-pill.current{cursor:default;filter:none;box-shadow:0 0 0 2px rgba(59,99,238,.2);}
// .ce-dw-arr{color:var(--ink3);font-size:13px;flex-shrink:0;}

// /* superseded notice */
// .ce-dw-sup{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;cursor:pointer;transition:background .13s;}
// .ce-dw-sup:hover{background:#fef3c7;}
// .ce-dw-sup-title{font-size:11px;font-weight:700;color:#92400e;margin-bottom:4px;}
// .ce-dw-sup-text{font-size:12px;color:#78350f;line-height:1.5;}

// .ce-dw-footer{padding:14px 22px 18px;border-top:1px solid var(--line);flex-shrink:0;display:flex;gap:10px;justify-content:flex-end;}
// .ce-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all .13s;border:1.5px solid transparent;}
// .ce-btn-primary{background:var(--sel);color:#fff;border-color:var(--sel);}
// .ce-btn-primary:hover{background:#2a50d4;}
// .ce-btn-ghost{background:transparent;color:var(--ink2);border-color:var(--line);}
// .ce-btn-ghost:hover{background:var(--bg);}

// /* lineage view */
// .ce-lin-shell{max-width:800px;margin:0 auto;}
// .ce-back-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border:1.5px solid var(--line);border-radius:8px;background:var(--surf);color:var(--ink2);font-size:12px;font-weight:600;cursor:pointer;margin-bottom:20px;transition:all .13s;}
// .ce-back-btn:hover{border-color:var(--sel);color:var(--sel);background:var(--sel-l);}
// .ce-lin-chain{display:flex;flex-direction:column;}

// /* lineage node */
// .ce-ln{border:1.5px solid var(--line);border-radius:var(--r);background:var(--surf);padding:15px 17px;border-left-width:5px;box-shadow:var(--sh);transition:all .13s;}
// .ce-ln.clickable{cursor:pointer;}
// .ce-ln.clickable:hover{box-shadow:var(--sh-lg);}
// .ce-ln.focus{border-color:var(--sel);background:var(--sel-l);box-shadow:0 4px 18px rgba(59,99,238,.14);cursor:default;}
// .ce-ln-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:10px;font-weight:700;background:var(--sel);color:#fff;margin-bottom:5px;}
// .ce-ln-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;}
// .ce-ln-title{font-size:16px;font-weight:700;color:var(--ink);line-height:1.4;margin-bottom:7px;}
// .ce-ln-meta{font-size:12px;color:var(--ink2);line-height:1.65;margin-bottom:7px;}
// .ce-ln-meta b{color:var(--ink);font-weight:600;}
// .ce-ln-pills{display:flex;gap:6px;flex-wrap:wrap;}

// /* connector */
// .ce-conn{display:flex;flex-direction:column;align-items:center;padding:3px 0;width:28px;margin:0 auto;}
// .ce-conn-line{width:2px;height:16px;background:#c5d5f0;}
// .ce-conn-arrow{font-size:13px;color:#8099c0;line-height:1;}

// /* sections (children, siblings) */
// .ce-lin-sec{margin-top:20px;}
// .ce-lin-sec-hdr{font-size:11px;font-weight:700;color:var(--ink3);margin-bottom:10px;padding:0 2px;display:flex;align-items:center;gap:6px;}
// .ce-lin-sec-hdr::before{content:'';display:block;flex:1;height:1px;background:var(--line);}
// .ce-lin-cards{display:flex;gap:10px;flex-wrap:wrap;}
// .ce-scard{flex:1;min-width:170px;max-width:270px;border:1.5px solid var(--line);border-left-width:4px;border-radius:9px;padding:11px 13px;background:var(--surf);cursor:pointer;transition:all .13s;box-shadow:var(--sh);}
// .ce-scard:hover{background:var(--sel-l);border-color:var(--sel-b);transform:translateY(-1px);box-shadow:var(--sh-lg);}
// .ce-scard-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}
// .ce-scard-title{font-size:12px;font-weight:600;color:var(--ink);line-height:1.4;margin-bottom:4px;}
// .ce-scard-ref{font-size:10px;color:var(--ink3);font-family:'Courier New',monospace;margin-bottom:5px;}

// /* supersession chain */
// .ce-sup-chain{background:var(--surf);border:1px solid var(--line);border-radius:9px;padding:13px 15px;margin-top:20px;box-shadow:var(--sh);}
// .ce-sup-chain-hdr{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);margin-bottom:10px;}
// .ce-sup-chain-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
// .ce-sup-item{padding:6px 12px;border-radius:7px;font-size:12px;font-weight:600;border:1.5px solid var(--line);background:var(--bg);cursor:pointer;transition:all .13s;color:var(--ink2);}
// .ce-sup-item:hover{background:var(--sel-l);border-color:var(--sel-b);color:var(--sel);}
// .ce-sup-item.cur{background:var(--sel-l);border-color:var(--sel);color:var(--sel);}
// .ce-sup-arr{color:var(--ink3);font-size:14px;}

// .ce-empty{padding:36px 20px;text-align:center;color:var(--ink3);font-size:14px;background:var(--surf);border:1px dashed var(--line);border-radius:var(--r);}

// @media(max-width:900px){.ce-hier-layout{grid-template-columns:1fr;}}
// @media(max-width:640px){.ce-topbar,.ce-filters,.ce-body,.ce-legend-bar{padding-left:12px;padding-right:12px;}.ce-drawer{width:100%;}}
//     `;
//     document.head.appendChild(s);
//   }

//   function renderTopBar() {
//     const bar = el('div', 'ce-topbar');
//     const sw = el('div', 'ce-sw'); sw.innerHTML = `<span class="ce-sw-icon">⌕</span>`;
//     const inp = el('input', 'ce-search'); inp.type = 'text'; inp.placeholder = 'Search title, ref. no., authority, subject…'; inp.value = state.searchQuery;
//     inp.oninput = e => { state.searchQuery = e.target.value; render(); };
//     sw.appendChild(inp); bar.appendChild(sw);
//     bar.appendChild(el('div', 'ce-spacer'));
//     const tabs = el('div', 'ce-tabs');
//     [['hierarchy', 'Hierarchy'], ['timeline', 'Timeline']].forEach(([v, l]) => {
//       const b = el('button', 'ce-tab' + (state.view === v ? ' on' : ''), l);
//       b.onclick = () => { state.view = v; state.lineageFocusId = null; render(); };
//       tabs.appendChild(b);
//     });
//     bar.appendChild(tabs);
//     return bar;
//   }

//   function renderLegend() {
//     const bar = el('div', 'ce-legend-bar');
//     const lbl = el('span', 'ce-leg-lbl', 'Document types:');
//     bar.appendChild(lbl);
//     Object.entries(TYPE_META).forEach(([k, m]) => {
//       const item = el('div', 'ce-leg-item');
//       const dot = el('div', 'ce-leg-dot'); dot.style.background = m.dot;
//       item.appendChild(dot); item.appendChild(document.createTextNode(m.label));
//       bar.appendChild(item);
//     });
//     const lbl2 = el('span', 'ce-leg-lbl', 'Status:'); lbl2.style.marginLeft = '8px';
//     bar.appendChild(lbl2);
//     const ok = el('span', 'ce-pill ce-pill-ok', '● Active'); ok.style.fontSize = '10px';
//     const sup = el('span', 'ce-pill ce-pill-sup', '○ Superseded'); sup.style.fontSize = '10px';
//     bar.appendChild(ok); bar.appendChild(sup);
//     return bar;
//   }

//   function renderFilters() {
//     const row = el('div', 'ce-filters');
//     function fg(lbl, opts, cur, cb) {
//       const g = el('div', 'ce-fg'); g.appendChild(el('div', 'ce-flbl', lbl));
//       const s = el('select', 'ce-fsel');
//       opts.forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; if (v === cur) o.selected = true; s.appendChild(o); });
//       s.onchange = e => { cb(e.target.value); render(); };
//       g.appendChild(s); return g;
//     }
//     row.appendChild(fg('Document Type', [['all','All types'],['act','Act'],['md','Master Direction'],['mc','Master Circular'],['circular','Circular'],['notification','Notification']], state.filterType, v => state.filterType = v));
//     row.appendChild(fg('Issuing Authority', [['all','All authorities'], ...getAllAuthorities().map(a => [a, a])], state.filterAuth, v => state.filterAuth = v));
//     row.appendChild(fg('Status', [['all','All statuses'],['Active','Active'],['Superseded','Superseded']], state.filterStatus, v => state.filterStatus = v));
//     const yg = el('div', 'ce-fg'); yg.appendChild(el('div', 'ce-flbl', 'Year Range'));
//     const yr = el('div', 'ce-yr-row');
//     function mki(val, isFrom) {
//       const i = el('input', 'ce-yr-in'); i.type = 'number'; i.value = val; i.placeholder = 'YYYY';
//       i.oninput = e => {
//         const v = parseInt(e.target.value);
//         if (!isNaN(v) && v >= 1800 && v <= 2100) { i.classList.remove('err'); if (isFrom) state.yrFrom = v; else state.yrTo = v; render(); }
//         else i.classList.add('err');
//       };
//       return i;
//     }
//     yr.appendChild(mki(state.yrFrom, true));
//     yr.appendChild(el('span', '', '<span style="color:var(--ink3);padding:0 2px">–</span>'));
//     yr.appendChild(mki(state.yrTo, false));
//     yg.appendChild(yr); row.appendChild(yg);
//     return row;
//   }

//   function makeTreeNode(doc) {
//     const m = TYPE_META[doc.type] || TYPE_META.notification;
//     const children = getChildren(doc.id);
//     const show = matchesFilters(doc);
//     const isOpen = !state.collapsed[doc.id];
//     const wrap = el('div');
//     const row = el('div', 'ce-node-row' + (state.selectedId === doc.id ? ' sel' : '') + (!show ? ' dimmed' : ''));
//     const tog = el('div', 'ce-tog' + (children.length ? '' : ' ghost'), children.length ? (isOpen ? '−' : '+') : '·');
//     if (children.length) tog.onclick = e => { e.stopPropagation(); state.collapsed[doc.id] = isOpen; render(); };
//     row.appendChild(tog);
//     const dot = el('div', 'ce-dot'); dot.style.background = m.dot; row.appendChild(dot);
//     const body = el('div', 'ce-nbody');
//     body.appendChild(el('div', 'ce-ntitle' + (doc.status === 'Superseded' ? ' struck' : ''), doc.title));
//     const meta = el('div', 'ce-nmeta');
//     meta.innerHTML = `${doc.issuingAuth} &nbsp;·&nbsp; <span class="ce-nref">${doc.date}</span> &nbsp;·&nbsp; <span class="ce-nref">${doc.refNo}</span>`;
//     body.appendChild(meta);
//     const pills = el('div', 'ce-npills'); pills.innerHTML = typePill(doc.type) + ' ' + statusPill(doc.status);
//     body.appendChild(pills); row.appendChild(body);
//     row.onclick = () => { state.selectedId = doc.id; render(); };
//     wrap.appendChild(row);
//     if (children.length && isOpen) {
//       const cw = el('div', 'ce-children');
//       children.forEach(c => { const cr = el('div', 'ce-child-wrap'); cr.appendChild(makeTreeNode(c)); cw.appendChild(cr); });
//       wrap.appendChild(cw);
//     }
//     return wrap;
//   }

//   function renderDrawer() {
//     const doc = state.selectedId ? state.byId[state.selectedId] : null;
//     const overlay = el('div', 'ce-overlay' + (doc ? ' open' : ''));
//     if (!doc) return overlay;
//     const m = TYPE_META[doc.type] || TYPE_META.notification;
//     const ancs = getAncestors(state.selectedId);
//     overlay.onclick = e => { if (e.target === overlay) { state.selectedId = null; render(); } };
//     const drawer = el('div', 'ce-drawer');

//     // head
//     const head = el('div', 'ce-dw-head');
//     const cr = el('div', 'ce-dw-close-row');
//     const cl = el('button', 'ce-dw-close', '×'); cl.onclick = () => { state.selectedId = null; render(); };
//     cr.appendChild(cl); head.appendChild(cr);
//     const kicker = el('div', 'ce-dw-kicker', m.label);
//     kicker.style.background = m.light; kicker.style.color = m.accent;
//     head.appendChild(kicker);
//     head.appendChild(el('div', 'ce-dw-title', doc.title));
//     head.appendChild(el('div', 'ce-dw-auth', doc.issuingAuth + ' &nbsp;·&nbsp; ' + doc.date));
//     drawer.appendChild(head);

//     // body
//     const body = el('div', 'ce-dw-body');

//     // subject
//     const ss = el('div', 'ce-dw-sec');
//     ss.appendChild(el('div', 'ce-dw-sec-hdr', 'Subject Matter'));
//     const sb = el('div', 'ce-dw-sec-body'); sb.appendChild(el('div', 'ce-dw-subject', doc.subject || '—'));
//     ss.appendChild(sb); body.appendChild(ss);

//     // details
//     const ds = el('div', 'ce-dw-sec');
//     ds.appendChild(el('div', 'ce-dw-sec-hdr', 'Document Details'));
//     const db = el('div', 'ce-dw-sec-body');
//     const g = el('div', 'ce-dw-grid');
//     [['Reference No.', `<span class="ce-dw-mono">${doc.refNo}</span>`], ['Legal Status', statusPill(doc.status)], ['Year', String(doc.year || doc.date)]].forEach(([l, v]) => {
//       g.appendChild(el('div', 'ce-dw-lbl', l));
//       const vEl = el('div', 'ce-dw-val'); vEl.innerHTML = v; g.appendChild(vEl);
//     });
//     db.appendChild(g); ds.appendChild(db); body.appendChild(ds);

//     // lineage path
//     if (ancs.length) {
//       const ps = el('div', 'ce-dw-sec');
//       ps.appendChild(el('div', 'ce-dw-sec-hdr', 'Regulatory Lineage — where this document is derived from'));
//       const pb = el('div', 'ce-dw-sec-body');
//       const pr = el('div', 'ce-dw-path');
//       ancs.forEach(a => {
//         const am = TYPE_META[a.type] || TYPE_META.notification;
//         const pill = el('button', 'ce-dw-path-pill');
//         pill.style.background = am.light; pill.style.color = am.accent;
//         pill.textContent = a.title; pill.onclick = () => { state.selectedId = a.id; render(); };
//         pr.appendChild(pill); pr.appendChild(el('span', 'ce-dw-arr', '›'));
//       });
//       const cur = el('div', 'ce-dw-path-pill current');
//       cur.style.background = m.light; cur.style.color = m.accent; cur.textContent = doc.title;
//       pr.appendChild(cur); pb.appendChild(pr); ps.appendChild(pb); body.appendChild(ps);
//     }

//     // superseded
//     if (doc.supersededBy && state.byId[doc.supersededBy]) {
//       const newer = state.byId[doc.supersededBy];
//       const sup = el('div', 'ce-dw-sup');
//       sup.innerHTML = `<div class="ce-dw-sup-title">⚠ This document has been superseded</div><div class="ce-dw-sup-text">Replaced by: <strong>${newer.title}</strong> (${newer.date}) — click to open</div>`;
//       sup.onclick = () => { state.selectedId = newer.id; render(); };
//       body.appendChild(sup);
//     }

//     drawer.appendChild(body);

//     // footer
//     const footer = el('div', 'ce-dw-footer');
//     const closeF = el('button', 'ce-btn ce-btn-ghost', 'Close'); closeF.onclick = () => { state.selectedId = null; render(); };
//     const lineageBtn = el('button', 'ce-btn ce-btn-primary', 'View Document Lineage →');
//     lineageBtn.title = 'See the full hierarchy: parent Acts, sibling circulars, derived documents, and amendment history';
//     lineageBtn.onclick = () => { state._prevView = state.view; state.lineageFocusId = state.selectedId; state.view = 'lineage'; render(); };
//     footer.appendChild(closeF); footer.appendChild(lineageBtn);
//     drawer.appendChild(footer);
//     overlay.appendChild(drawer);
//     return overlay;
//   }

//   function renderHierarchy() {
//     const layout = el('div', 'ce-hier-layout');
//     const main = el('div', 'ce-tree-panel');
//     const roots = state.docs.filter(d => !d.parentId && d.type !== 'notification');
//     const byAuth = {};
//     roots.forEach(r => { if (!byAuth[r.issuingAuth]) byAuth[r.issuingAuth] = []; byAuth[r.issuingAuth].push(r); });
//     if (!roots.length) main.appendChild(el('div', 'ce-empty', 'No documents match the current filters.'));
//     else Object.entries(byAuth).forEach(([auth, docs]) => {
//       const hdr = el('div', 'ce-auth-hdr'); hdr.innerHTML = `📋 ${auth}`; main.appendChild(hdr);
//       docs.forEach(d => main.appendChild(makeTreeNode(d)));
//     });
//     layout.appendChild(main);
//     const notifs = state.docs.filter(d => d.type === 'notification');
//     if (notifs.length) {
//       const aside = el('div', 'ce-sa-panel');
//       aside.innerHTML = `<div class="ce-sa-hdr"><div class="ce-sa-hdr-title">Standalone Notifications</div><div class="ce-sa-hdr-sub">SEBI, IRDAI & others — independent</div></div>`;
//       notifs.forEach(d => {
//         const item = el('div', 'ce-sa-item' + (state.selectedId === d.id ? ' sel' : '') + (!matchesFilters(d) ? ' dimmed' : ''));
//         item.innerHTML = `<div class="ce-sa-title">${d.title}</div><div class="ce-sa-auth">${d.issuingAuth}</div><div>${statusPill(d.status)}</div>`;
//         item.onclick = () => { state.selectedId = d.id; render(); };
//         aside.appendChild(item);
//       });
//       layout.appendChild(aside);
//     }
//     return layout;
//   }

//   function renderTimeline() {
//     const wrap = el('div', 'ce-tl-wrap');
//     wrap.appendChild(el('div', 'ce-scroll-hint', '← Drag or scroll horizontally to navigate years →'));
//     const scrollBox = el('div', 'ce-tl-scroll');
//     const inner = el('div', 'ce-tl-inner');
//     let isDown = false, startX = 0, scrollLeft = 0, moved = false;
//     scrollBox.addEventListener('mousedown', e => { isDown = true; moved = false; startX = e.pageX; scrollLeft = scrollBox.scrollLeft; scrollBox.style.cursor = 'grabbing'; });
//     window.addEventListener('mouseup', () => { isDown = false; scrollBox.style.cursor = 'grab'; });
//     scrollBox.addEventListener('mousemove', e => { if (!isDown) return; const dx = e.pageX - startX; if (Math.abs(dx) > 4) moved = true; scrollBox.scrollLeft = scrollLeft - dx; });
//     scrollBox.addEventListener('wheel', e => { if (Math.abs(e.deltaY) > 0) { e.preventDefault(); scrollBox.scrollLeft += e.deltaY; } }, { passive: false });
//     const years = []; for (let y = state.yrFrom; y <= state.yrTo; y++) years.push(y);
//     let any = false;
//     years.forEach(yr => {
//       const docs = state.docs.filter(d => d.year === yr && matchesFilters(d));
//       if (!docs.length) return;
//       any = true;
//       const col = el('div', 'ce-tl-col');
//       const hd = el('div', 'ce-tl-hd');
//       hd.innerHTML = `<span class="ce-tl-yr">${yr}</span><span class="ce-tl-cnt">${docs.length} doc${docs.length > 1 ? 's' : ''}</span>`;
//       col.appendChild(hd);
//       ['act', 'md', 'mc', 'circular', 'notification'].forEach(tier => {
//         const td = docs.filter(d => d.type === tier); if (!td.length) return;
//         const mT = TYPE_META[tier];
//         const sec = el('div', 'ce-tl-tier');
//         const lbl = el('div', 'ce-tl-tier-lbl'); lbl.style.color = mT.accent; lbl.textContent = mT.label; sec.appendChild(lbl);
//         td.forEach(doc => {
//           const card = el('div', 'ce-tl-card' + (state.selectedId === doc.id ? ' sel' : ''));
//           card.style.borderLeftColor = mT.dot;
//           card.innerHTML = `<div class="ce-tl-ctitle${doc.status === 'Superseded' ? ' struck' : ''}">${doc.title}</div><div class="ce-tl-date">${doc.date} · ${doc.refNo}</div><div>${statusPill(doc.status)}</div>`;
//           card.addEventListener('click', e => { if (moved) return; state.selectedId = doc.id; render(); });
//           sec.appendChild(card);
//         });
//         col.appendChild(sec);
//       });
//       inner.appendChild(col);
//     });
//     if (!any) inner.appendChild(el('div', 'ce-empty', 'No documents found in this date range.'));
//     scrollBox.appendChild(inner); wrap.appendChild(scrollBox);
//     return wrap;
//   }

//   function renderLineage(focusId) {
//     const focusDoc = state.byId[focusId]; if (!focusDoc) return el('div');
//     const m = TYPE_META[focusDoc.type] || TYPE_META.notification;
//     const ancs = getAncestors(focusId);
//     const children = getChildren(focusId);
//     const supChain = buildSupChain(focusId);
//     const shell = el('div', 'ce-lin-shell');

//     const back = el('button', 'ce-back-btn', '← Back to ' + (state._prevView === 'timeline' ? 'Timeline' : 'Hierarchy'));
//     back.onclick = () => { state.view = state._prevView || 'hierarchy'; state.lineageFocusId = null; render(); };
//     shell.appendChild(back);

//     const chain = el('div', 'ce-lin-chain');

//     // ancestors
//     ancs.forEach((a, i) => {
//       const am = TYPE_META[a.type] || TYPE_META.notification;
//       const node = el('div', 'ce-ln clickable');
//       node.style.borderLeftColor = am.dot;
//       node.innerHTML = `<div class="ce-ln-type" style="color:${am.accent}">Level ${i + 1} — ${am.label}</div><div class="ce-ln-title">${a.title}</div><div class="ce-ln-meta"><b>Authority:</b> ${a.issuingAuth} &nbsp;·&nbsp; <b>Date:</b> ${a.date} &nbsp;·&nbsp; <b>Ref:</b> ${a.refNo}</div><div class="ce-ln-pills">${typePill(a.type)} ${statusPill(a.status)}</div>`;
//       node.onclick = () => { state.lineageFocusId = a.id; render(); };
//       chain.appendChild(node);
//       const conn = el('div', 'ce-conn'); conn.innerHTML = `<div class="ce-conn-line"></div><div class="ce-conn-arrow">↓</div><div class="ce-conn-line"></div>`; chain.appendChild(conn);
//     });

//     // focus
//     const focusNode = el('div', 'ce-ln focus');
//     focusNode.style.borderLeftColor = m.dot;
//     focusNode.innerHTML = `<div class="ce-ln-badge">Currently Viewing</div><div class="ce-ln-type" style="color:${m.accent}">${m.label}</div><div class="ce-ln-title">${focusDoc.title}</div><div class="ce-ln-meta"><b>Authority:</b> ${focusDoc.issuingAuth} &nbsp;·&nbsp; <b>Date:</b> ${focusDoc.date} &nbsp;·&nbsp; <b>Ref:</b> ${focusDoc.refNo}<br><b>Subject:</b> ${focusDoc.subject}</div><div class="ce-ln-pills">${typePill(focusDoc.type)} ${statusPill(focusDoc.status)}</div>`;
//     chain.appendChild(focusNode);

//     // children
//     if (children.length) {
//       const conn = el('div', 'ce-conn'); conn.innerHTML = `<div class="ce-conn-line"></div><div class="ce-conn-arrow">↓</div><div class="ce-conn-line"></div>`; chain.appendChild(conn);
//       const sec = el('div', 'ce-lin-sec');
//       sec.appendChild(el('div', 'ce-lin-sec-hdr', `Derived Documents (${children.length}) — issued under this document`));
//       const row = el('div', 'ce-lin-cards');
//       children.forEach(c => {
//         const cm = TYPE_META[c.type] || TYPE_META.notification;
//         const card = el('div', 'ce-scard'); card.style.borderLeftColor = cm.dot;
//         card.innerHTML = `<div class="ce-scard-type" style="color:${cm.accent}">${cm.label}</div><div class="ce-scard-title">${c.title}</div><div class="ce-scard-ref">${c.date} · ${c.refNo}</div><div>${statusPill(c.status)}</div>`;
//         card.onclick = () => { state.lineageFocusId = c.id; render(); };
//         row.appendChild(card);
//       });
//       sec.appendChild(row); chain.appendChild(sec);
//     }

//     // siblings
//     if (focusDoc.parentId) {
//       const sibs = getChildren(focusDoc.parentId).filter(c => c.id !== focusId);
//       if (sibs.length) {
//         const sec = el('div', 'ce-lin-sec');
//         sec.appendChild(el('div', 'ce-lin-sec-hdr', `Sibling Documents (${sibs.length}) — issued under the same parent`));
//         const row = el('div', 'ce-lin-cards');
//         sibs.forEach(s => {
//           const sm = TYPE_META[s.type] || TYPE_META.notification;
//           const card = el('div', 'ce-scard'); card.style.borderLeftColor = sm.dot;
//           card.innerHTML = `<div class="ce-scard-type" style="color:${sm.accent}">${sm.label}</div><div class="ce-scard-title">${s.title}</div><div class="ce-scard-ref">${s.date} · ${s.refNo}</div><div>${statusPill(s.status)}</div>`;
//           card.onclick = () => { state.lineageFocusId = s.id; render(); };
//           row.appendChild(card);
//         });
//         sec.appendChild(row); chain.appendChild(sec);
//       }
//     }

//     // supersession chain
//     if (supChain.length) {
//       const box = el('div', 'ce-sup-chain');
//       box.appendChild(el('div', 'ce-sup-chain-hdr', 'Amendment History — annual editions of this document (oldest → newest)'));
//       const row = el('div', 'ce-sup-chain-row');
//       supChain.forEach((d, i) => {
//         const item = el('div', 'ce-sup-item' + (d.id === focusId ? ' cur' : ''));
//         item.textContent = d.year || d.date; item.title = d.title;
//         item.onclick = () => { state.lineageFocusId = d.id; render(); };
//         row.appendChild(item);
//         if (i < supChain.length - 1) row.appendChild(el('span', 'ce-sup-arr', '→'));
//       });
//       box.appendChild(row); chain.appendChild(box);
//     }

//     shell.appendChild(chain);
//     return shell;
//   }

//   function render() {
//     const c = state.container; c.innerHTML = ''; c.className = 'ce-root';
//     const shell = el('div', 'ce-shell');
//     shell.appendChild(renderTopBar());
//     shell.appendChild(renderLegend());
//     if (state.view !== 'lineage') shell.appendChild(renderFilters());
//     const body = el('div', 'ce-body');
//     if (state.view === 'lineage' && state.lineageFocusId) body.appendChild(renderLineage(state.lineageFocusId));
//     else if (state.view === 'hierarchy') body.appendChild(renderHierarchy());
//     else body.appendChild(renderTimeline());
//     shell.appendChild(body);
//     shell.appendChild(renderDrawer());
//     c.appendChild(shell);
//   }

//   global.CircularExplorer = {
//     init(options = {}) {
//       const id = options.containerId || 'circular-explorer';
//       const container = document.getElementById(id);
//       if (!container) { console.error('CircularExplorer: #' + id + ' not found'); return; }
//       injectStyles();
//       state.container = container;
//       state.docs = options.documents && options.documents.length ? options.documents : SAMPLE_DOCS;
//       state.byId = {}; state.docs.forEach(d => state.byId[d.id] = d);
//       const years = state.docs.map(d => d.year).filter(Boolean);
//       state.yrFrom = options.yrFrom || Math.min(...years);
//       state.yrTo = options.yrTo || Math.max(...years);
//       render();
//     },
//     loadDocuments(docs) { state.docs = docs; state.byId = {}; docs.forEach(d => state.byId[d.id] = d); render(); }
//   };
// })(window);




(function (global) {

    'use strict';

    const TYPE_META = {
        act: { label: 'Act', short: 'ACT', dot: '#3b5bdb', bg: '#eef2ff', fg: '#3b5bdb' },
        md: { label: 'Master Direction', short: 'MD', dot: '#0ca678', bg: '#e6fcf5', fg: '#0ca678' },
        mc: { label: 'Master Circular', short: 'MC', dot: '#e8590c', bg: '#fff4e6', fg: '#e8590c' },
        circular: { label: 'Circular', short: 'CIR', dot: '#1971c2', bg: '#e7f5ff', fg: '#1971c2' },
        notification: { label: 'Notification', short: 'NTF', dot: '#6741d9', bg: '#f3f0ff', fg: '#6741d9' },
    };

    const DOCS = [
        { id: 'rbi-act', type: 'act', title: 'Reserve Bank of India Act, 1934', refNo: 'Act No. 2 of 1934', issuingAuth: 'Parliament of India', date: '1934', year: 1934, status: 'Active', subject: 'Establishes the Reserve Bank of India and defines its monetary authority framework, governance structure, and regulatory powers.', parentId: null, supersededBy: null },
        { id: 'fema-act', type: 'act', title: 'Foreign Exchange Management Act, 1999', refNo: 'Act No. 42 of 1999', issuingAuth: 'Parliament of India', date: '1999', year: 1999, status: 'Active', subject: 'Governs regulation and management of foreign exchange, cross-border transactions, and related offences.', parentId: null, supersededBy: null },
        { id: 'md-kyc', type: 'md', title: 'Master Direction on Know Your Customer (KYC)', refNo: 'RBI/DBR.AML.BC.81/2016', issuingAuth: 'Reserve Bank of India', date: '25 Feb 2016', year: 2016, status: 'Active', subject: 'Consolidated evergreen direction setting KYC norms and AML standards for all RBI-regulated entities.', parentId: 'rbi-act', supersededBy: null },
        { id: 'md-forex', type: 'md', title: 'Master Direction on Foreign Exchange Transactions', refNo: 'RBI/2015-16/3', issuingAuth: 'Reserve Bank of India', date: '01 Jan 2016', year: 2016, status: 'Active', subject: 'Comprehensive directions covering all permissible forex transactions, LRS, trade finance, and reporting requirements under FEMA.', parentId: 'fema-act', supersededBy: null },
        { id: 'md-ecb', type: 'md', title: 'Master Direction on External Commercial Borrowings', refNo: 'RBI/2018-19/67', issuingAuth: 'Reserve Bank of India', date: '16 Jan 2019', year: 2019, status: 'Active', subject: 'ECB policy framework covering eligible borrowers, permitted end-uses, all-in-cost ceiling, and reporting obligations.', parentId: 'fema-act', supersededBy: null },
        { id: 'mc-kyc-2021', type: 'mc', title: 'Master Circular – KYC Directions 2021', refNo: 'RBI/2021-22/10', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2021', year: 2021, status: 'Superseded', subject: 'Annual consolidation of all KYC instructions in force as on 01 July 2021, including V-CIP and Digital KYC provisions.', parentId: 'md-kyc', supersededBy: 'mc-kyc-2022' },
        { id: 'c-lrs-2021', type: 'circular', title: 'Circular – LRS: COVID-19 Clarification', refNo: 'AP(DIR) Circ No. 3/2021', issuingAuth: 'Reserve Bank of India', date: '05 May 2021', year: 2021, status: 'Active', subject: 'Clarifies LRS applicability during COVID-19 pandemic and updates reporting requirements for authorised dealer banks.', parentId: 'md-forex', supersededBy: null },
        { id: 'mc-kyc-2022', type: 'mc', title: 'Master Circular – KYC Directions 2022', refNo: 'RBI/2022-23/09', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2022', year: 2022, status: 'Superseded', subject: 'Annual consolidation of KYC instructions including updated provisions for CKYCR and beneficial ownership norms.', parentId: 'md-kyc', supersededBy: 'mc-kyc-2023' },
        { id: 'c-ecb-2022', type: 'circular', title: 'Circular – ECB: Refinancing Norms', refNo: 'AP(DIR) Circ No. 5/2022', issuingAuth: 'Reserve Bank of India', date: '10 Aug 2022', year: 2022, status: 'Active', subject: 'Permits ECB refinancing for infrastructure and manufacturing sectors; relaxes end-use restrictions for select categories.', parentId: 'md-ecb', supersededBy: null },
        { id: 'mc-kyc-2023', type: 'mc', title: 'Master Circular – KYC Directions 2023', refNo: 'RBI/2023-24/14', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2023', year: 2023, status: 'Superseded', subject: 'Annual consolidation including updated V-CIP process, Video KYC norms, and enhanced due diligence for high-risk customers.', parentId: 'md-kyc', supersededBy: 'mc-kyc-2024' },
        { id: 'mc-kyc-2024', type: 'mc', title: 'Master Circular – KYC Directions 2024', refNo: 'RBI/2024-25/14', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2024', year: 2024, status: 'Active', subject: 'Latest annual consolidation of KYC instructions including Video-based Customer Identification Process (V-CIP) and digital onboarding norms.', parentId: 'md-kyc', supersededBy: null },
        { id: 'mc-forex-2024', type: 'mc', title: 'Master Circular – Forex Transactions 2024', refNo: 'RBI/2024-25/11', issuingAuth: 'Reserve Bank of India', date: '01 Jul 2024', year: 2024, status: 'Active', subject: 'Annual consolidation of forex directions covering LRS remittances, trade finance, and authorised dealer obligations.', parentId: 'md-forex', supersededBy: null },
        { id: 'c-vcip-2024', type: 'circular', title: 'Circular – V-CIP Updated Norms', refNo: 'DOR.AML.REC.35/2024', issuingAuth: 'Reserve Bank of India', date: '14 May 2024', year: 2024, status: 'Active', subject: 'Updated norms for video-based customer identification, live photograph requirements, and OTP-based verification for KYC compliance.', parentId: 'mc-kyc-2024', supersededBy: null },
        { id: 'c-lrs-oct-2024', type: 'circular', title: 'Circular – LRS: Revised Limits 2024', refNo: 'AP(DIR) Circ No. 4/2024', issuingAuth: 'Reserve Bank of India', date: '18 Oct 2024', year: 2024, status: 'Active', subject: 'Revises LRS annual limit to USD 250,000 and strengthens AD bank reporting to prevent round-tripping.', parentId: 'mc-forex-2024', supersededBy: null },
        { id: 'c-trade-nov-2024', type: 'circular', title: 'Circular – Trade Credit: Revised Norms', refNo: 'AP(DIR) Circ No. 7/2024', issuingAuth: 'Reserve Bank of India', date: '09 Nov 2024', year: 2024, status: 'Active', subject: 'Enhances trade credit limits for capital goods imports and revises maturity period norms.', parentId: 'mc-forex-2024', supersededBy: null },
        { id: 'c-ecb-2024', type: 'circular', title: 'Circular – ECB End-Use Clarifications', refNo: 'AP(DIR) Circ No. 2/2024', issuingAuth: 'Reserve Bank of India', date: '22 Mar 2024', year: 2024, status: 'Active', subject: 'Clarifies permitted end-uses of ECB proceeds for infrastructure projects and resolves ambiguity in prior directions.', parentId: 'md-ecb', supersededBy: null },
        { id: 'n-sebi-algo', type: 'notification', title: 'SEBI – Algorithmic Trading Framework', refNo: 'SEBI/HO/MRD2/CIR/2024/01', issuingAuth: 'Securities and Exchange Board of India', date: '02 Feb 2024', year: 2024, status: 'Active', subject: 'Comprehensive framework for algorithmic and high-frequency trading including risk controls, kill switches, and audit trail requirements.', parentId: null, supersededBy: null },
        { id: 'n-irdai-ulip', type: 'notification', title: 'IRDAI – ULIP Product Framework', refNo: 'IRDAI/Life/CIR/2024/07', issuingAuth: 'Insurance Regulatory and Development Authority', date: '15 Mar 2024', year: 2024, status: 'Active', subject: 'Revised product structure, charge limits, and disclosure norms for Unit-Linked Insurance Products.', parentId: null, supersededBy: null },
    ];

    let S = {
        docs: [], byId: {},
        selectedId: 'mc-kyc-2024',
        activeTab: 'overview',
        searchQuery: '',
        filterType: 'all', filterStatus: 'all',
        yrFrom: 1934, yrTo: 2024,
        container: null,
        collapsedGroups: {
            act: true,
            md: true,
            mc: true,
            circular: true,
            notification: true
        },
        fullTabView:false,
    };

    const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
    const getAncestors = id => { const ch = []; let c = S.byId[id]; while (c && c.parentId) { c = S.byId[c.parentId]; if (c) ch.unshift(c); } return ch; };
    const getChildren = id => S.docs.filter(d => d.parentId === id);
    const buildSupChain = id => {
        let cur = S.byId[id]; if (!cur) return [];
        const seen = new Set();
        while (true) { const p = S.docs.find(d => d.supersededBy === cur.id); if (!p || seen.has(p.id)) break; seen.add(p.id); cur = p; }
        const ch = []; let node = cur;
        while (node) { ch.push(node); node = node.supersededBy ? S.byId[node.supersededBy] : null; if (ch.length > 20) break; }
        return ch.length > 1 ? ch : [];
    };
    const matches = doc => {
        if (S.filterType !== 'all' && doc.type !== S.filterType) return false;
        if (S.filterStatus !== 'all' && doc.status !== S.filterStatus) return false;
        if (doc.year < S.yrFrom || doc.year > S.yrTo) return false;
        if (S.searchQuery) { const q = S.searchQuery.toLowerCase(); if (![doc.title, doc.refNo, doc.issuingAuth, doc.subject].join(' ').toLowerCase().includes(q)) return false; }
        return true;
    };
    const typeBadge = type => { const m = TYPE_META[type] || TYPE_META.notification; return `<span class="re-badge" style="background:${m.bg};color:${m.fg};border-color:${m.fg}35">${m.short}</span>`; };
    const statusBadge = s => s === 'Active' ? `<span class="re-badge re-ok">● Active</span>` : `<span class="re-badge re-sup">↩ Superseded</span>`;

    function injectStyles() {
        if (document.getElementById('re-v5')) return;
        const s = document.createElement('style'); s.id = 're-v5';
        s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
.re-root{
  --bg:#f7f8fa;--surf:#fff;--surf2:#f1f3f7;
  --bdr:#e4e8f0;--bdr2:#cdd3e0;
  --ink:#111827;--ink2:#374151;--ink3:#6b7280;--ink4:#9ca3af;
  --blue:#2563eb;--blue-l:#eff4ff;--blue-b:#c7d9fc;
  --r:8px;--r2:12px;
  --sh:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --sh2:0 4px 16px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.04);
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;
  font-size:13px;color:var(--ink);background:var(--bg);
  height:100%;display:flex;flex-direction:column;overflow:hidden;
}


.re-tab-tools{
  display:flex;
  justify-content:flex-end;
  padding:10px 20px 0;
  background:var(--bg);
}

.re-tab-expand{
  height:30px;
  padding:0 12px;
  border:1px solid var(--bdr);
  border-radius:7px;
  background:var(--surf);
  color:var(--ink2);
  cursor:pointer;
  font-size:12px;
  font-weight:600;
}

.re-tab-expand:hover{
  background:var(--blue-l);
  border-color:var(--blue-b);
  color:var(--blue);
}

.re-full-overlay{
  position:fixed;
  inset:0;
  background:rgba(17,24,39,.28);
  z-index:999;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
}

.re-full-panel{
  width:min(1200px, 96vw);
  height:min(90vh, 900px);
  background:var(--surf);
  border:1px solid var(--bdr);
  border-radius:14px;
  box-shadow:0 20px 50px rgba(0,0,0,.18);
  display:flex;
  flex-direction:column;
  overflow:hidden;
}

.re-full-head{
  flex-shrink:0;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
  padding:18px 20px;
  border-bottom:1px solid var(--bdr);
  background:var(--surf);
}

.re-full-head-left{
  min-width:0;
}

.re-full-title{
  font-size:18px;
  font-weight:700;
  color:var(--ink);
  line-height:1.35;
  margin-bottom:4px;
}

.re-full-sub{
  font-size:12px;
  color:var(--ink4);
}

.re-full-close{
  width:34px;
  height:34px;
  border:none;
  border-radius:8px;
  background:var(--surf2);
  color:var(--ink2);
  cursor:pointer;
  font-size:22px;
  line-height:1;
  flex-shrink:0;
}

.re-full-close:hover{
  background:var(--blue-l);
  color:var(--blue);
}

.re-tbody-full{
  flex:1;
  overflow-y:auto;
  padding:24px;
  background:var(--bg);
}


.re-top{
  display:flex;
  align-items:center;
  gap:12px;
  padding:8px 16px;
}

.re-top-left{
  flex:1;
}

.re-top-search{
  width:100%;
  height:34px;
  border:1px solid var(--bdr);
  border-radius:8px;
  padding:0 10px;
  background:#fff;
}

.re-top-filters{
  display:flex;
  align-items:center;
  gap:6px;
}

.re-top-sel{
  height:32px;
  border:1px solid var(--bdr);
  border-radius:6px;
  padding:0 6px;
  background:#fff;
}

.re-top-yr{
  width:60px;
  height:32px;
  border:1px solid var(--bdr);
  border-radius:6px;
  text-align:center;
}



.re-root*{box-sizing:border-box;margin:0;padding:0;}
.re-root button,.re-root input,.re-root select{font-family:inherit;font-size:13px;}
.re-root ::-webkit-scrollbar{width:5px;height:5px;}
.re-root ::-webkit-scrollbar-track{background:transparent;}
.re-root ::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:99px;}

/* TOPBAR */
.re-top{
  flex-shrink:0;height:50px;background:var(--surf);border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;padding:0 20px;gap:16px;
}
.re-logo{display:flex;align-items:center;gap:9px;}
.re-logo-mark{width:26px;height:26px;background:var(--blue);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;}
.re-logo-name{font-size:14px;font-weight:700;color:var(--ink);letter-spacing:-.3px;}
.re-logo-name em{color:var(--blue);font-style:normal;}
.re-logo-sep{width:1px;height:18px;background:var(--bdr);margin:0 4px;}
.re-logo-sub{font-size:11px;color:var(--ink4);}
.re-top-right{margin-left:auto;display:flex;align-items:center;gap:8px;}
.re-top-cnt{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink4);background:var(--surf2);border:1px solid var(--bdr);padding:3px 9px;border-radius:20px;}
.re-demo-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;background:#fefce8;color:#854d0e;border:1px solid #fde68a;padding:3px 9px;border-radius:20px;}

/* LAYOUT */
.re-layout{flex:1;min-height:0;display:flex;overflow:hidden;}

/* LEFT */
.re-left{width:320px;flex-shrink:0;border-right:1px solid var(--bdr);display:flex;flex-direction:column;background:var(--surf);overflow:hidden;}
.re-left-hd{flex-shrink:0;padding:12px 12px 10px;border-bottom:1px solid var(--bdr);}
.re-left-lbl{font-size:10px;font-weight:700;color:var(--ink4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;}
.re-sw{position:relative;margin-bottom:8px;}
.re-sw-ico{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--ink4);pointer-events:none;font-size:12px;}
.re-search{width:100%;height:32px;padding:0 10px 0 28px;border:1px solid var(--bdr);border-radius:var(--r);background:var(--surf2);color:var(--ink);outline:none;transition:all .15s;}
.re-search:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 3px rgba(37,99,235,.1);}
.re-search::placeholder{color:var(--ink4);}
.re-frow{display:flex;gap:6px;}
.re-fsel{height:26px;padding:0 8px;border:1px solid var(--bdr);border-radius:6px;background:var(--surf2);color:var(--ink3);font-size:11px;cursor:pointer;outline:none;flex:1;}
.re-fsel:focus{border-color:var(--blue);}
.re-fsel option{background:#fff;}
.re-yrin{width:50px;height:26px;padding:0 5px;border:1px solid var(--bdr);border-radius:6px;background:var(--surf2);color:var(--ink);font-family:'JetBrains Mono',monospace;font-size:11px;text-align:center;outline:none;}
.re-yrin:focus{border-color:var(--blue);}

/* LIST */
.re-list{flex:1;overflow-y:auto;padding:6px 8px 12px;}
.re-grp-hdr{
  padding:10px 6px 4px;font-size:10px;font-weight:700;color:var(--ink4);
  text-transform:uppercase;letter-spacing:.08em;
  display:flex;align-items:center;gap:6px;
  border-bottom:1px solid var(--bdr);margin-bottom:2px;margin-top:10px;
}


.re-grp-click{
  cursor:pointer;
  user-select:none;
}

.re-grp-click:hover{
  color:var(--ink3);
}

.re-grp-arrow{
  width:12px;
  display:inline-flex;
  justify-content:center;
  align-items:center;
  font-size:10px;
  color:var(--ink4);
}



.re-grp-hdr:first-child{margin-top:2px;}
.re-grp-cnt{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--ink4);background:var(--surf2);border:1px solid var(--bdr);padding:1px 6px;border-radius:99px;}
.re-item{display:flex;align-items:flex-start;gap:8px;padding:8px 7px;border-radius:var(--r);cursor:pointer;border:1.5px solid transparent;transition:all .12s;margin-bottom:1px;}
.re-item:hover{background:var(--surf2);}
.re-item.sel{background:var(--blue-l);border-color:var(--blue-b);}
.re-item-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.re-item-body{flex:1;min-width:0;}
.re-item-title{font-size:12px;font-weight:600;color:var(--ink);line-height:1.4;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.re-item-title.struck{text-decoration:line-through;color:var(--ink4);}
.re-item-sub{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink4);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.re-item-pills{display:flex;gap:4px;}

/* BADGE */
.re-badge{display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:4px;border:1px solid transparent;font-size:10px;font-weight:700;white-space:nowrap;font-family:'JetBrains Mono',monospace;flex-shrink:0;}
.re-ok{background:#f0fdf4;color:#166534;border-color:#bbf7d0!important;}
.re-sup{background:#fff7ed;color:#9a3412;border-color:#fdba74!important;}

/* RIGHT */
.re-right{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);}
.re-no-sel{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--ink4);}
.re-no-sel-ico{font-size:36px;opacity:.35;}
.re-no-sel-t{font-size:14px;font-weight:600;color:var(--ink3);}

/* DOC HEADER */
.re-dh{flex-shrink:0;background:var(--surf);border-bottom:1px solid var(--bdr);padding:16px 20px 0;}
.re-dh-kicker{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;}
.re-dh-type{display:inline-flex;align-items:center;height:22px;padding:0 10px;border-radius:5px;border:1px solid transparent;font-size:11px;font-weight:700;letter-spacing:.04em;}
.re-dh-auth{font-size:12px;color:var(--ink4);}
.re-dh-title{font-size:18px;font-weight:700;color:var(--ink);line-height:1.3;margin-bottom:10px;letter-spacing:-.3px;}
.re-dh-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px;}
.re-dh-meta-i{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink4);}
.re-dh-meta-i strong{color:var(--ink3);font-weight:600;}
.re-dh-sep{width:3px;height:3px;border-radius:50%;background:var(--bdr2);}
.re-sup-warn{background:#fff7ed;border:1px solid #fdba74;border-radius:6px;padding:6px 12px;font-size:11px;color:#9a3412;cursor:pointer;transition:background .12s;margin-bottom:4px;display:inline-flex;align-items:center;gap:6px;}
.re-sup-warn:hover{background:#ffedd5;}

/* TABS */
.re-tabs{display:flex;border-top:1px solid var(--bdr);}
.re-tab{padding:10px 18px;font-size:12px;font-weight:600;color:var(--ink4);background:none;border:none;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .12s;display:flex;align-items:center;gap:5px;}
.re-tab:hover{color:var(--ink2);}
.re-tab.on{color:var(--blue);border-bottom-color:var(--blue);}
.re-tcnt{font-size:10px;font-weight:700;background:var(--surf2);color:var(--ink4);border:1px solid var(--bdr);padding:1px 5px;border-radius:99px;}
.re-tab.on .re-tcnt{background:var(--blue-l);color:var(--blue);border-color:var(--blue-b);}

/* TAB BODY */
.re-tbody{flex:1;overflow-y:auto;padding:20px;}

/* CARDS */
.re-card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r2);padding:16px;box-shadow:var(--sh);}
.re-card+.re-card{margin-top:12px;}
.re-ch{font-size:11px;font-weight:700;color:var(--ink4);text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px;display:flex;align-items:center;gap:6px;}
.re-ch::before{content:'';width:3px;height:11px;border-radius:2px;background:var(--blue);}

/* OVERVIEW */
.re-ov{display:grid;grid-template-columns:1fr 260px;gap:14px;align-items:start;}
.re-dr{display:flex;padding:8px 0;border-bottom:1px solid var(--bdr);}
.re-dr:last-child{border-bottom:none;}
.re-dl{width:110px;flex-shrink:0;font-size:11px;font-weight:600;color:var(--ink4);padding-top:1px;}
.re-dv{flex:1;font-size:12px;color:var(--ink);line-height:1.55;}
.re-mono{font-family:'JetBrains Mono',monospace;font-size:11px;}
.re-subject{font-size:13px;color:var(--ink2);line-height:1.7;}
.re-qf{display:flex;justify-content:space-between;align-items:center;padding:9px 11px;background:var(--surf2);border:1px solid var(--bdr);border-radius:var(--r);}
.re-qf+.re-qf{margin-top:6px;}
.re-qfl{font-size:11px;color:var(--ink4);}
.re-qfv{font-size:12px;font-weight:700;color:var(--ink);}
.re-bc-item{display:flex;align-items:center;gap:7px;padding:6px 10px;border-radius:var(--r);border:1px solid var(--bdr);background:var(--surf2);margin-bottom:5px;transition:all .12s;}
.re-bc-item.cur{background:var(--blue-l);border-color:var(--blue-b);}
.re-bc-item.clickable{cursor:pointer;}
.re-bc-item.clickable:hover{background:var(--surf2);border-color:var(--bdr2);}
.re-bc-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.re-bc-lbl{font-size:11px;font-weight:500;color:var(--ink2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.re-bc-item.cur .re-bc-lbl{font-weight:700;}
.re-bc-arr{color:var(--ink4);font-size:10px;padding:2px 4px;}

/* LINEAGE */
.re-lin{max-width:620px;margin:0 auto;}
.re-lin-slbl{display:flex;align-items:center;gap:8px;margin:0 0 8px;}
.re-lin-slbl span{font-size:10px;font-weight:700;color:var(--ink4);text-transform:uppercase;letter-spacing:.09em;white-space:nowrap;}
.re-lin-slbl::before,.re-lin-slbl::after{content:'';flex:1;height:1px;background:var(--bdr);}
.re-lconn{display:flex;flex-direction:column;align-items:center;padding:3px 0;}
.re-lconn-v{width:1px;height:12px;background:var(--bdr2);}
.re-lconn-a{color:var(--ink4);font-size:11px;line-height:1;}
.re-lcard{background:var(--surf);border:1px solid var(--bdr);border-left-width:3px;border-radius:var(--r2);padding:13px 15px;box-shadow:var(--sh);transition:box-shadow .15s,border-color .15s;}
.re-lcard.focus{border-color:var(--blue)!important;background:var(--blue-l);box-shadow:0 0 0 3px rgba(37,99,235,.1),var(--sh2);}
.re-lcard.anc{cursor:pointer;}
.re-lcard.anc:hover{box-shadow:var(--sh2);border-color:var(--bdr2)!important;}
.re-lcard-top{display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;}
.re-lcard-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-family:'JetBrains Mono',monospace;}
.re-lcard-flag{font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;background:var(--blue);color:#fff;text-transform:uppercase;letter-spacing:.05em;}
.re-lcard-title{font-size:14px;font-weight:700;color:var(--ink);line-height:1.35;margin-bottom:7px;}
.re-lcard-meta{display:grid;grid-template-columns:70px 1fr;gap:3px 8px;margin-bottom:7px;}
.re-lcard-lbl{font-size:10px;font-weight:600;color:var(--ink4);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.04em;padding-top:2px;}
.re-lcard-val{font-size:11px;color:var(--ink3);}

/* CHILDREN/SIBLING GRID */
.re-mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;margin-bottom:14px;}
.re-mc{background:var(--surf);border:1px solid var(--bdr);border-left-width:3px;border-radius:var(--r);padding:10px 11px;cursor:pointer;box-shadow:var(--sh);transition:all .12s;}
.re-mc:hover{border-color:var(--blue-b)!important;background:var(--blue-l);transform:translateY(-1px);box-shadow:var(--sh2);}
.re-mc-type{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;font-family:'JetBrains Mono',monospace;margin-bottom:4px;}
.re-mc-title{font-size:11px;font-weight:600;color:var(--ink);line-height:1.4;margin-bottom:3px;}
.re-mc-ref{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--ink4);margin-bottom:4px;}

/* SUPERSESSION CHAIN */
.re-chain{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r2);padding:14px 16px;box-shadow:var(--sh);}
.re-chain-lbl{font-size:10px;font-weight:700;color:var(--ink4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;display:flex;align-items:center;gap:5px;}
.re-chain-lbl::before{content:'↺';font-size:12px;color:var(--blue);}
.re-chain-tl{display:flex;align-items:flex-end;gap:0;flex-wrap:wrap;}
.re-chain-node{display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0;}
.re-chain-pill{padding:5px 12px;border-radius:6px;border:1.5px solid var(--bdr);background:var(--surf2);font-size:12px;font-weight:600;color:var(--ink3);cursor:pointer;transition:all .12s;white-space:nowrap;}
.re-chain-pill:hover{background:var(--blue-l);border-color:var(--blue-b);color:var(--blue);}
.re-chain-pill.cur{background:var(--blue);border-color:var(--blue);color:#fff;box-shadow:0 2px 6px rgba(37,99,235,.3);}
.re-chain-pill.old{opacity:.6;}
.re-chain-dot{width:6px;height:6px;border-radius:50%;background:var(--bdr2);}
.re-chain-dot.cur{background:var(--blue);}
.re-chain-arr{color:var(--bdr2);font-size:16px;margin:0 3px;padding-bottom:14px;flex-shrink:0;}

/* RELATIONSHIPS */
.re-rel{display:flex;flex-direction:column;gap:16px;}
.re-rel-sh{font-size:12px;font-weight:700;color:var(--ink);margin-bottom:10px;display:flex;align-items:center;gap:7px;}
.re-rel-sh::after{content:'';flex:1;height:1px;background:var(--bdr);}
.re-rel-scnt{font-size:10px;font-weight:600;color:var(--ink4);background:var(--surf2);border:1px solid var(--bdr);padding:1px 7px;border-radius:20px;}
.re-rel-empty{font-size:12px;color:var(--ink4);padding:14px;background:var(--surf);border:1px dashed var(--bdr);border-radius:var(--r);text-align:center;}
.re-divider{height:1px;background:var(--bdr);margin:14px 0;}
    `;
        document.head.appendChild(s);
    }

    /* TOPBAR */
    function mkTop() {
        const b = el('div', 're-top');

        b.innerHTML = `
    <div class="re-top-left">
      <input class="re-top-search" placeholder="Search documents..." value="${S.searchQuery}" />
    </div>

    <div class="re-top-filters">
      <select class="re-top-sel" id="f-type">
        <option value="all">All Types</option>
        <option value="act">Act</option>
        <option value="md">Master Direction</option>
        <option value="mc">Master Circular</option>
        <option value="circular">Circular</option>
        <option value="notification">Notification</option>
      </select>

      <select class="re-top-sel" id="f-status">
        <option value="all">All Status</option>
        <option value="Active">Active</option>
        <option value="Superseded">Superseded</option>
      </select>

      <input class="re-top-yr" id="yr-from" type="number" value="${S.yrFrom}" />
      <span>-</span>
      <input class="re-top-yr" id="yr-to" type="number" value="${S.yrTo}" />
    </div>

    <div class="re-top-right">
      <span class="re-top-cnt">${S.docs.filter(matches).length}/${S.docs.length}</span>
    </div>
  `;

        // events
        b.querySelector('.re-top-search').oninput = e => {
            S.searchQuery = e.target.value;
            render();
        };

        b.querySelector('#f-type').value = S.filterType;
        b.querySelector('#f-status').value = S.filterStatus;

        b.querySelector('#f-type').onchange = e => {
            S.filterType = e.target.value;
            render();
        };

        b.querySelector('#f-status').onchange = e => {
            S.filterStatus = e.target.value;
            render();
        };

        b.querySelector('#yr-from').oninput = e => {
            const v = +e.target.value;
            if (!isNaN(v)) S.yrFrom = v;
            render();
        };

        b.querySelector('#yr-to').oninput = e => {
            const v = +e.target.value;
            if (!isNaN(v)) S.yrTo = v;
            render();
        };

        return b;
    }
    /* LEFT PANEL */
    function mkLeft() {
        const p = el('div', 're-left');
        // Head
        // const hd = el('div', 're-left-hd');
        // hd.appendChild(el('div','re-left-lbl','All Documents'));
        // const sw=el('div','re-sw'); sw.innerHTML=`<span class="re-sw-ico">⌕</span>`;
        // const inp=el('input','re-search'); inp.type='text'; inp.placeholder='Search title, ref. no., subject…'; inp.value=S.searchQuery;
        // inp.oninput=e=>{S.searchQuery=e.target.value;render();};
        // sw.appendChild(inp); hd.appendChild(sw);
        // const fr=el('div','re-frow');
        // const fsel=(opts,cur,cb)=>{ const s=el('select','re-fsel'); opts.forEach(([v,t])=>{ const o=document.createElement('option'); o.value=v; o.textContent=t; if(v===cur) o.selected=true; s.appendChild(o); }); s.onchange=e=>{cb(e.target.value);render();}; return s; };
        // fr.appendChild(fsel([['all','All Types'],['act','Act'],['md','Master Direction'],['mc','Master Circular'],['circular','Circular'],['notification','Notification']],S.filterType,v=>S.filterType=v));
        // fr.appendChild(fsel([['all','All Statuses'],['Active','Active'],['Superseded','Superseded']],S.filterStatus,v=>S.filterStatus=v));
        // const yp=el('div','re-frow'); yp.style.gap='4px';
        // const mki=(val,isFrom)=>{ const i=el('input','re-yrin'); i.type='number'; i.value=val; i.oninput=e=>{ const v=parseInt(e.target.value); if(!isNaN(v)&&v>=1800&&v<=2100){ isFrom?(S.yrFrom=Math.min(v,S.yrTo)):(S.yrTo=Math.max(v,S.yrFrom)); render(); } }; return i; };
        // yp.appendChild(mki(S.yrFrom,true)); yp.appendChild(el('span','','<span style="color:var(--ink4);font-size:11px">–</span>')); yp.appendChild(mki(S.yrTo,false));
        // fr.appendChild(yp); hd.appendChild(fr); p.appendChild(hd);


        // const hd = el('div', 're-left-hd');
        // hd.innerHTML = `<div class="re-left-lbl">Document Structure</div>`;
        // p.appendChild(hd);


        // List grouped by type
        const list = el('div', 're-list');
        const visible = S.docs.filter(matches);
        const order = ['act', 'md', 'mc', 'circular', 'notification'];
        const grouped = {}; order.forEach(t => grouped[t] = []);
        visible.forEach(d => { if (grouped[d.type]) grouped[d.type].push(d); });
        let any = false;
        order.forEach(type => {
            const docs = grouped[type];
            if (!docs.length) return;
            any = true;

            const m = TYPE_META[type];
            const isCollapsed = S.collapsedGroups[type];

            const gh = el('div', 're-grp-hdr re-grp-click');
            gh.innerHTML = `
    <span class="re-grp-arrow">${isCollapsed ? '▶' : '▼'}</span>
    <span style="width:7px;height:7px;border-radius:50%;background:${m.dot};display:inline-block"></span>
    ${m.label}
    <span class="re-grp-cnt">${docs.length}</span>
  `;
            gh.onclick = () => {
                S.collapsedGroups[type] = !S.collapsedGroups[type];
                render();
            };

            list.appendChild(gh);

            if (!isCollapsed) {
                docs.forEach(doc => {
                    const item = el('div', 're-item' + (S.selectedId === doc.id ? ' sel' : ''));
                    const dot = el('div', 're-item-dot');
                    dot.style.background = m.dot;
                    item.appendChild(dot);

                    const body = el('div', 're-item-body');
                    body.appendChild(el('div', 're-item-title' + (doc.status === 'Superseded' ? ' struck' : ''), doc.title));
                    body.appendChild(el('div', 're-item-sub', `${doc.refNo} · ${doc.date}`));

                    const pills = el('div', 're-item-pills');
                    pills.innerHTML = statusBadge(doc.status);
                    body.appendChild(pills);

                    item.appendChild(body);
                    item.onclick = () => {
                        S.selectedId = doc.id;
                        S.activeTab = 'overview';
                        render();
                    };

                    list.appendChild(item);
                });
            }
        });
        if (!any) list.innerHTML = `<div style="text-align:center;padding:30px 0;color:var(--ink4);font-size:12px">No documents match</div>`;
        p.appendChild(list); return p;
    }

    function buildActiveTabContent(doc, m, ancs, children, siblings, chain) {
  const tbody = el('div', 're-tbody' + (S.fullTabView ? ' re-tbody-full' : ''));

  if (S.activeTab === 'overview') tbody.appendChild(mkOverview(doc, m, ancs, children, chain));
  if (S.activeTab === 'lineage') tbody.appendChild(mkLineage(doc, m, ancs, children, chain));
  if (S.activeTab === 'relationships') tbody.appendChild(mkRel(doc, m, ancs, children, siblings, chain));

  return tbody;
}

    /* RIGHT PANEL */
    function mkRight() {
        const p = el('div', 're-right');
        if (!S.selectedId) {
            p.innerHTML = `<div class="re-no-sel"><div class="re-no-sel-ico">📋</div><div class="re-no-sel-t">Select a document</div><div style="font-size:11px;color:var(--ink4)">Click any item on the left</div></div>`;
            return p;
        }
        const doc = S.byId[S.selectedId]; if (!doc) return p;
        const m = TYPE_META[doc.type] || TYPE_META.notification;
        const ancs = getAncestors(S.selectedId);
        const children = getChildren(S.selectedId);
        const siblings = doc.parentId ? getChildren(doc.parentId).filter(c => c.id !== doc.id) : [];
        const chain = buildSupChain(S.selectedId);

        // Doc header
        const dh = el('div', 're-dh');
        const kicker = el('div', 're-dh-kicker');
        const tb = el('span', 're-dh-type', m.label); tb.style.background = m.bg; tb.style.color = m.fg; tb.style.borderColor = m.fg + '40'; kicker.appendChild(tb);
        kicker.appendChild(el('span', 're-dh-auth', doc.issuingAuth));
        dh.appendChild(kicker);
        dh.appendChild(el('div', 're-dh-title', doc.title));
        const mr = el('div', 're-dh-meta');
        mr.innerHTML = `<span class="re-dh-meta-i"><strong>Ref.</strong> <span class="re-mono" style="font-size:10px">${doc.refNo}</span></span><span class="re-dh-sep"></span><span class="re-dh-meta-i"><strong>Date</strong> ${doc.date}</span><span class="re-dh-sep"></span><span class="re-dh-meta-i">${statusBadge(doc.status)}</span>`;
        dh.appendChild(mr);
        if (doc.supersededBy && S.byId[doc.supersededBy]) {
            const n = S.byId[doc.supersededBy];
            const sw = el('div', 're-sup-warn');
            sw.innerHTML = `⚠ Superseded by: <strong>${n.title}</strong> (${n.date}) — click to view`;
            sw.onclick = () => { S.selectedId = n.id; S.activeTab = 'overview'; render(); };
            dh.appendChild(sw);
        }
        // Tabs
        const tabs = el('div', 're-tabs');
        [['overview', 'Overview', null], ['lineage', 'Lineage', ancs.length + children.length + (chain.length ? 1 : 0) || null], ['relationships', 'Relationships', siblings.length + children.length || null]].forEach(([id, lbl, cnt]) => {
            const b = el('button', 're-tab' + (S.activeTab === id ? ' on' : ''));
            b.innerHTML = lbl + (cnt ? `<span class="re-tcnt">${cnt}</span>` : '');
            b.onclick = () => { S.activeTab = id; render(); }; tabs.appendChild(b);
        });
        dh.appendChild(tabs); p.appendChild(dh);

       const tabTools = el('div','re-tab-tools');
const expandBtn = el(
  'button',
  're-tab-expand',
  S.fullTabView ? 'Exit Reading View' : 'Expand View'
);
expandBtn.onclick = () => {
  S.fullTabView = !S.fullTabView;
  render();
};
tabTools.appendChild(expandBtn);
p.appendChild(tabTools);

p.appendChild(buildActiveTabContent(doc, m, ancs, children, siblings, chain));
return p;
    }

    /* OVERVIEW */
    function mkOverview(doc, m, ancs, children, chain) {
        const w = el('div');
        const grid = el('div', 're-ov');
        // Left
        const left = el('div');
        const sc = el('div', 're-card'); sc.appendChild(el('div', 're-ch', 'Subject Matter')); sc.appendChild(el('div', 're-subject', doc.subject)); left.appendChild(sc);
        const dc = el('div', 're-card'); dc.appendChild(el('div', 're-ch', 'Document Details'));
        const rows = [['Reference No.', `<span class="re-mono">${doc.refNo}</span>`], ['Type', m.label], ['Issued By', doc.issuingAuth], ['Date', doc.date], ['Status', statusBadge(doc.status)]];
        if (doc.supersededBy && S.byId[doc.supersededBy]) { const n = S.byId[doc.supersededBy]; rows.push(['Superseded By', `<span style="color:#9a3412;font-weight:600;cursor:pointer" data-goto="${n.id}">${n.title}</span>`]); }
        rows.forEach(([l, v]) => { const r = el('div', 're-dr'); r.appendChild(el('div', 're-dl', l)); const dv = el('div', 're-dv'); dv.innerHTML = v; const g = dv.querySelector('[data-goto]'); if (g) g.onclick = () => { S.selectedId = g.dataset.goto; render(); }; r.appendChild(dv); dc.appendChild(r); });
        left.appendChild(dc); grid.appendChild(left);
        // Right
        const right = el('div');
        const qc = el('div', 're-card'); qc.appendChild(el('div', 're-ch', 'Quick Facts'));
        const qfacts = [['Parent docs', ancs.length || 'Root document'], ['Child docs', children.length || 'None']];
        if (chain.length) { const idx = chain.findIndex(d => d.id === doc.id); qfacts.push(['Edition', `${idx + 1} of ${chain.length}`]); }
        qfacts.forEach(([l, v]) => { const q = el('div', 're-qf'); q.appendChild(el('span', 're-qfl', l)); const vEl = el('span', 're-qfv'); vEl.innerHTML = String(v); q.appendChild(vEl); qc.appendChild(q); });
        right.appendChild(qc);
        if (ancs.length) {
            const bc = el('div', 're-card'); bc.appendChild(el('div', 're-ch', 'Regulatory Chain'));
            const chain2 = [...ancs, doc];
            chain2.forEach((a, i) => {
                if (i > 0) { const arr = el('div', 're-bc-arr', '↓'); bc.appendChild(arr); }
                const am = TYPE_META[a.type] || TYPE_META.notification;
                const row = el('div', 're-bc-item' + (a.id === doc.id ? ' cur' : ' clickable'));
                row.innerHTML = `<span class="re-bc-dot" style="background:${am.dot}"></span><span class="re-bc-lbl" style="color:${a.id === doc.id ? am.fg : 'var(--ink3)'}">${a.title}</span>`;
                if (a.id !== doc.id) row.onclick = () => { S.selectedId = a.id; render(); };
                bc.appendChild(row);
            });
            right.appendChild(bc);
        }
        grid.appendChild(right); w.appendChild(grid); return w;
    }

    /* LINEAGE */
    function mkLineage(doc, m, ancs, children, chain) {
        const w = el('div', 're-lin');
        const conn = () => { const c = el('div', 're-lconn'); c.innerHTML = `<div class="re-lconn-v"></div><div class="re-lconn-a">↓</div><div class="re-lconn-v"></div>`; return c; };
        const lcard = (d, isFocus) => {
            const dm = TYPE_META[d.type] || TYPE_META.notification;
            const c = el('div', 're-lcard' + (isFocus ? ' focus' : ' anc')); c.style.borderLeftColor = dm.dot;
            const top = el('div', 're-lcard-top');
            top.innerHTML = `<span class="re-lcard-type" style="color:${dm.dot}">${dm.label}</span>`;
            if (isFocus) top.innerHTML += `<span class="re-lcard-flag">Viewing</span>`;
            top.innerHTML += `<span style="margin-left:auto;display:flex;gap:5px;align-items:center">${typeBadge(d.type)} ${statusBadge(d.status)}</span>`;
            c.appendChild(top);
            c.appendChild(el('div', 're-lcard-title', d.title));
            const meta = el('div', 're-lcard-meta');
            const rows = [['Authority', d.issuingAuth], ['Date', d.date], ['Ref No.', `<span class="re-mono" style="font-size:10px">${d.refNo}</span>`]];
            if (isFocus) rows.push(['Subject', d.subject]);
            rows.forEach(([l, v]) => { meta.appendChild(el('div', 're-lcard-lbl', l)); const dv = el('div', 're-lcard-val'); dv.innerHTML = v; meta.appendChild(dv); });
            c.appendChild(meta);
            if (!isFocus) c.onclick = () => { S.selectedId = d.id; S.activeTab = 'lineage'; render(); };
            return c;
        };

        if (ancs.length) { const sl = el('div', 're-lin-slbl'); sl.innerHTML = `<span>Parent hierarchy</span>`; w.appendChild(sl); ancs.forEach((a, i) => { w.appendChild(lcard(a, false)); w.appendChild(conn()); }); }
        const sl2 = el('div', 're-lin-slbl'); sl2.innerHTML = `<span>Selected document</span>`; w.appendChild(sl2);
        w.appendChild(lcard(doc, true));
        if (children.length) {
            w.appendChild(conn());
            const sl3 = el('div', 're-lin-slbl'); sl3.innerHTML = `<span>Derived documents (${children.length})</span>`; w.appendChild(sl3);
            const g = el('div', 're-mgrid');
            children.forEach(c => { const cm = TYPE_META[c.type] || TYPE_META.notification; const mc = el('div', 're-mc'); mc.style.borderLeftColor = cm.dot; mc.innerHTML = `<div class="re-mc-type" style="color:${cm.dot}">${cm.label}</div><div class="re-mc-title">${c.title}</div><div class="re-mc-ref">${c.date} · ${c.refNo}</div><div>${statusBadge(c.status)}</div>`; mc.onclick = () => { S.selectedId = c.id; S.activeTab = 'lineage'; render(); }; g.appendChild(mc); });
            w.appendChild(g);
        }
        if (chain.length) {
            w.appendChild(el('div', 're-divider'));
            const ch = el('div', 're-chain');
            ch.appendChild(el('div', 're-chain-lbl', 'Annual Amendment History'));
            const tl = el('div', 're-chain-tl');
            chain.forEach((d, i) => {
                const isCur = d.id === doc.id;
                const node = el('div', 're-chain-node');
                const pill = el('div', 're-chain-pill' + (isCur ? ' cur' : d.status === 'Superseded' ? ' old' : ''));
                pill.textContent = d.year || d.date; pill.title = d.title;
                pill.onclick = () => { S.selectedId = d.id; S.activeTab = 'lineage'; render(); };
                const dot = el('div', 're-chain-dot' + (isCur ? ' cur' : ''));
                node.appendChild(dot); node.appendChild(pill); tl.appendChild(node);
                if (i < chain.length - 1) tl.appendChild(el('div', 're-chain-arr', '→'));
            });
            ch.appendChild(tl); w.appendChild(ch);
        }
        return w;
    }

    /* RELATIONSHIPS */
    function mkRel(doc, m, ancs, children, siblings, chain) {
        const w = el('div', 're-rel');
        const sec = (title, cnt, content) => { const s = el('div'); const hdr = el('div', 're-rel-sh'); hdr.innerHTML = `${title} <span class="re-rel-scnt">${cnt}</span>`; s.appendChild(hdr); s.appendChild(content); return s; };
        const miniGrid = (docs, onClk) => { const g = el('div', 're-mgrid'); docs.forEach(d => { const dm = TYPE_META[d.type] || TYPE_META.notification; const mc = el('div', 're-mc'); mc.style.borderLeftColor = dm.dot; mc.innerHTML = `<div class="re-mc-type" style="color:${dm.dot}">${dm.label}</div><div class="re-mc-title">${d.title}</div><div class="re-mc-ref">${d.date} · ${d.refNo}</div><div style="display:flex;gap:4px">${typeBadge(d.type)} ${statusBadge(d.status)}</div>`; mc.onclick = () => onClk(d.id); g.appendChild(mc); }); return g; };
        const empty = t => el('div', 're-rel-empty', t);

        w.appendChild(sec('Parent Documents', ancs.length, ancs.length ? miniGrid(ancs, id => { S.selectedId = id; render(); }) : empty('Root-level document — no parents.')));
        w.appendChild(sec('Child Documents', children.length, children.length ? miniGrid(children, id => { S.selectedId = id; render(); }) : empty('No documents derived from this.')));
        w.appendChild(sec('Sibling Documents', siblings.length, siblings.length ? miniGrid(siblings, id => { S.selectedId = id; render(); }) : empty('No siblings under the same parent.')));

        if (chain.length) {
            const ch = el('div', 're-chain');
            ch.appendChild(el('div', 're-chain-lbl', 'Annual Update Chain'));
            const tl = el('div', 're-chain-tl');
            chain.forEach((d, i) => { const isCur = d.id === doc.id; const node = el('div', 're-chain-node'); const pill = el('div', 're-chain-pill' + (isCur ? ' cur' : d.status === 'Superseded' ? ' old' : '')); pill.textContent = d.year || d.date; pill.title = d.title; pill.onclick = () => { S.selectedId = d.id; render(); }; const dot = el('div', 're-chain-dot' + (isCur ? ' cur' : '')); node.appendChild(dot); node.appendChild(pill); tl.appendChild(node); if (i < chain.length - 1) tl.appendChild(el('div', 're-chain-arr', '→')); });
            ch.appendChild(tl);
            w.appendChild(sec('Amendment History', chain.length, ch));
        }
        return w;
    }

    /* RENDER */
    function render() {
  const c = S.container;
  c.innerHTML = '';
  c.className = 're-root';

  c.appendChild(mkTop());

  const layout = el('div', 're-layout');
  layout.appendChild(mkLeft());
  layout.appendChild(mkRight());
  c.appendChild(layout);

  if (S.fullTabView && S.selectedId && S.byId[S.selectedId]) {
    const doc = S.byId[S.selectedId];
    const m = TYPE_META[doc.type] || TYPE_META.notification;
    const ancs = getAncestors(S.selectedId);
    const children = getChildren(S.selectedId);
    const siblings = doc.parentId ? getChildren(doc.parentId).filter(c => c.id !== doc.id) : [];
    const chain = buildSupChain(S.selectedId);

    const overlay = el('div', 're-full-overlay');
    const panel = el('div', 're-full-panel');

    const head = el('div', 're-full-head');
    head.innerHTML = `
      <div class="re-full-head-left">
        <div class="re-full-title">${doc.title}</div>
        <div class="re-full-sub">${S.activeTab.charAt(0).toUpperCase() + S.activeTab.slice(1)} View</div>
      </div>
    `;

    const closeBtn = el('button', 're-full-close', '×');
    closeBtn.onclick = () => {
      S.fullTabView = false;
      render();
    };

    head.appendChild(closeBtn);
    panel.appendChild(head);
    panel.appendChild(buildActiveTabContent(doc, m, ancs, children, siblings, chain));
    overlay.appendChild(panel);

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        S.fullTabView = false;
        render();
      }
    };

    c.appendChild(overlay);
  }
}

    /* API */
    global.CircularExplorer = {
        init(options = {}) {
            const id = options.containerId || 'circular-explorer';
            const container = document.getElementById(id);
            if (!container) { console.error('CircularExplorer: #' + id + ' not found'); return; }
            injectStyles(); S.container = container;
            S.docs = (options.documents && options.documents.length) ? options.documents : DOCS;
            S.byId = {}; S.docs.forEach(d => S.byId[d.id] = d);
            const years = S.docs.map(d => d.year).filter(Boolean);
            S.yrFrom = options.yrFrom || Math.min(...years);
            S.yrTo = options.yrTo || Math.max(...years);
            if (options.defaultId) S.selectedId = options.defaultId;
            render();
        },
        loadDocuments(docs) { S.docs = docs; S.byId = {}; docs.forEach(d => S.byId[d.id] = d); render(); }
    };
})(window);