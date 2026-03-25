// // /**
// //  * EvidencePanel — Dark AI-Engine Theme
// //  * Call: EvidencePanel.init(containerId, cmsData)
// //  */

// // const EvidencePanel = (() => {

// //   let _container = null;
// //   let _data = null;
// //   let _selectedCircular = null;
// //   let _breadcrumb = [];
// //   let _view = 'search';
// //   let _selectedAction = null;
// //   let _tableFilter = '';
// //   let _tableSortCol = null;
// //   let _tableSortDir = 1;

// //   /* ─── CSS ──────────────────────────────────────── */
// //   const CSS = `
// //   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

// //   .ep-root *, .ep-root *::before, .ep-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

// //   .ep-root {
// //     font-family: 'Instrument Sans', sans-serif;
// //     background: #0f172a;
// //     color: #e2e8f0;
// //     min-height: 100vh;
// //     padding: 32px;
// //     --c-bg:      #0f172a;
// //     --c-surface: #1e293b;
// //     --c-raised:  #263348;
// //     --c-border:  #334155;
// //     --c-border2: #1e293b;
// //     --c-muted:   #475569;
// //     --c-sub:     #64748b;
// //     --c-text:    #e2e8f0;
// //     --c-text2:   #94a3b8;
// //     --c-accent:  #38bdf8;
// //     --c-accent2: #818cf8;
// //     --c-green:   #34d399;
// //     --c-amber:   #fbbf24;
// //     --c-red:     #f87171;
// //     --c-blue:    #60a5fa;
// //     --radius:    12px;
// //     --shadow:    0 4px 24px rgba(0,0,0,.4);
// //   }

// //   .ep-shell {
// //     max-width: 1200px;
// //     margin: 0 auto;
// //   }

// //   /* ── Topbar ── */
// //   .ep-topbar {
// //     display: flex;
// //     align-items: center;
// //     justify-content: space-between;
// //     margin-bottom: 36px;
// //     padding-bottom: 24px;
// //     border-bottom: 1px solid var(--c-border);
// //   }
// //   .ep-logo-row {
// //     display: flex;
// //     align-items: center;
// //     gap: 12px;
// //   }
// //   .ep-logo-icon {
// //     width: 36px; height: 36px;
// //     background: linear-gradient(135deg, #38bdf8, #818cf8);
// //     border-radius: 10px;
// //     display: flex; align-items: center; justify-content: center;
// //     font-size: 18px;
// //   }
// //   .ep-logo-text {
// //     font-family: 'Syne', sans-serif;
// //     font-size: 17px;
// //     font-weight: 700;
// //     color: var(--c-text);
// //     letter-spacing: -.01em;
// //   }
// //   .ep-logo-sub {
// //     font-size: 11px;
// //     color: var(--c-sub);
// //     font-weight: 500;
// //     letter-spacing: .06em;
// //     text-transform: uppercase;
// //   }
// //   .ep-topbar-badge {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 11px;
// //     color: var(--c-accent);
// //     background: rgba(56,189,248,.1);
// //     border: 1px solid rgba(56,189,248,.2);
// //     padding: 4px 12px;
// //     border-radius: 20px;
// //   }

// //   /* ── Breadcrumb ── */
// //   .ep-breadcrumb {
// //     display: flex;
// //     align-items: center;
// //     gap: 0;
// //     margin-bottom: 24px;
// //     flex-wrap: wrap;
// //   }
// //   .ep-crumb {
// //     font-size: 12px;
// //     font-weight: 600;
// //     color: var(--c-sub);
// //     cursor: pointer;
// //     padding: 4px 0;
// //     transition: color .15s;
// //     text-transform: uppercase;
// //     letter-spacing: .06em;
// //   }
// //   .ep-crumb:hover { color: var(--c-accent); }
// //   .ep-crumb.active { color: var(--c-text); cursor: default; }
// //   .ep-crumb-sep { font-size: 14px; color: var(--c-muted); padding: 0 10px; user-select: none; }

// //   /* ── Smart Search ── */
// //   .ep-search-card {
// //     background: var(--c-surface);
// //     border: 1px solid var(--c-border);
// //     border-radius: 18px;
// //     padding: 32px;
// //     margin-bottom: 20px;
// //     box-shadow: var(--shadow);
// //   }
// //   .ep-search-eyebrow {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 10px;
// //     color: var(--c-accent);
// //     letter-spacing: .14em;
// //     text-transform: uppercase;
// //     margin-bottom: 8px;
// //   }
// //   .ep-search-heading {
// //     font-family: 'Syne', sans-serif;
// //     font-size: 22px;
// //     font-weight: 700;
// //     color: var(--c-text);
// //     margin-bottom: 4px;
// //     letter-spacing: -.02em;
// //   }
// //   .ep-search-sub {
// //     font-size: 13px;
// //     color: var(--c-text2);
// //     margin-bottom: 24px;
// //   }
// //   .ep-search-wrap {
// //     position: relative;
// //     margin-bottom: 20px;
// //   }
// //   .ep-search-icon {
// //     position: absolute;
// //     left: 16px; top: 50%;
// //     transform: translateY(-50%);
// //     color: var(--c-sub);
// //     font-size: 18px;
// //     pointer-events: none;
// //     font-style: normal;
// //   }
// //   .ep-search-input {
// //     width: 100%;
// //     padding: 15px 16px 15px 48px;
// //     border: 1.5px solid var(--c-border);
// //     border-radius: var(--radius);
// //     font-family: 'Instrument Sans', sans-serif;
// //     font-size: 14px;
// //     color: var(--c-text);
// //     background: var(--c-bg);
// //     outline: none;
// //     transition: border-color .2s, box-shadow .2s;
// //   }
// //   .ep-search-input:focus {
// //     border-color: var(--c-accent);
// //     box-shadow: 0 0 0 3px rgba(56,189,248,.12);
// //   }
// //   .ep-search-input::placeholder { color: var(--c-muted); }

// //   /* results grid */
// //   .ep-results-grid {
// //     display: grid;
// //     grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
// //     gap: 12px;
// //     max-height: 360px;
// //     overflow-y: auto;
// //     padding-right: 4px;
// //   }
// //   .ep-results-grid::-webkit-scrollbar { width: 4px; }
// //   .ep-results-grid::-webkit-scrollbar-track { background: transparent; }
// //   .ep-results-grid::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 4px; }

// //   .ep-result-card {
// //     background: var(--c-bg);
// //     border: 1.5px solid var(--c-border);
// //     border-radius: var(--radius);
// //     padding: 16px 18px;
// //     cursor: pointer;
// //     transition: border-color .15s, background .15s, transform .15s;
// //     display: flex;
// //     flex-direction: column;
// //     gap: 8px;
// //   }
// //   .ep-result-card:hover {
// //     border-color: var(--c-accent);
// //     background: rgba(56,189,248,.04);
// //     transform: translateY(-1px);
// //   }
// //   .ep-result-card-top {
// //     display: flex;
// //     align-items: center;
// //     justify-content: space-between;
// //     gap: 8px;
// //   }
// //   .ep-result-id {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 10px;
// //     font-weight: 500;
// //     color: var(--c-accent);
// //     background: rgba(56,189,248,.12);
// //     padding: 3px 8px;
// //     border-radius: 5px;
// //   }
// //   .ep-result-title {
// //     font-size: 13px;
// //     font-weight: 600;
// //     color: var(--c-text);
// //     line-height: 1.4;
// //   }
// //   .ep-result-reg {
// //     font-size: 11px;
// //     color: var(--c-sub);
// //     display: flex;
// //     align-items: center;
// //     gap: 6px;
// //   }
// //   .ep-result-badges { display: flex; gap: 6px; flex-wrap: wrap; }

// //   .ep-search-empty {
// //     text-align: center;
// //     padding: 40px;
// //     color: var(--c-sub);
// //     font-size: 13px;
// //   }
// //   .ep-search-empty-icon { font-size: 32px; margin-bottom: 10px; }

// //   /* ── Tags / Badges ── */
// //   .ep-tag {
// //     font-size: 10px;
// //     font-weight: 600;
// //     padding: 2px 8px;
// //     border-radius: 20px;
// //     letter-spacing: .03em;
// //     white-space: nowrap;
// //   }
// //   .ep-tag-active   { background: rgba(52,211,153,.15); color: #34d399; border: 1px solid rgba(52,211,153,.25); }
// //   .ep-tag-inactive { background: rgba(251,191,36,.12); color: #fbbf24; border: 1px solid rgba(251,191,36,.2); }
// //   .ep-tag-high     { background: rgba(248,113,113,.12); color: #f87171; border: 1px solid rgba(248,113,113,.2); }
// //   .ep-tag-medium   { background: rgba(251,191,36,.12); color: #fbbf24; border: 1px solid rgba(251,191,36,.2); }
// //   .ep-tag-low      { background: rgba(52,211,153,.12); color: #34d399; border: 1px solid rgba(52,211,153,.2); }

// //   /* ── Overview ── */
// //   .ep-overview-hero {
// //     background: var(--c-surface);
// //     border: 1px solid var(--c-border);
// //     border-radius: 18px;
// //     padding: 28px 32px;
// //     margin-bottom: 20px;
// //     box-shadow: var(--shadow);
// //     position: relative;
// //     overflow: hidden;
// //   }
// //   .ep-overview-hero::before {
// //     content: '';
// //     position: absolute;
// //     top: 0; right: 0;
// //     width: 280px; height: 100%;
// //     background: linear-gradient(135deg, transparent 40%, rgba(56,189,248,.04));
// //     pointer-events: none;
// //   }
// //   .ep-ov-header {
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: flex-start;
// //     gap: 20px;
// //     margin-bottom: 24px;
// //     flex-wrap: wrap;
// //   }
// //   .ep-ov-eyebrow {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 10px;
// //     color: var(--c-accent);
// //     letter-spacing: .12em;
// //     margin-bottom: 6px;
// //   }
// //   .ep-ov-title {
// //     font-family: 'Syne', sans-serif;
// //     font-size: 24px;
// //     font-weight: 700;
// //     color: var(--c-text);
// //     letter-spacing: -.02em;
// //     line-height: 1.25;
// //     margin-bottom: 8px;
// //   }
// //   .ep-ov-meta {
// //     font-size: 12px;
// //     color: var(--c-text2);
// //     display: flex;
// //     gap: 16px;
// //     flex-wrap: wrap;
// //   }
// //   .ep-ov-meta span { display: flex; align-items: center; gap: 5px; }
// //   .ep-ov-meta strong { color: var(--c-text); font-weight: 600; }

// //   .ep-stats-row {
// //     display: flex;
// //     gap: 12px;
// //     flex-wrap: wrap;
// //     margin-bottom: 20px;
// //   }
// //   .ep-stat-chip {
// //     background: var(--c-bg);
// //     border: 1px solid var(--c-border);
// //     border-radius: 10px;
// //     padding: 14px 20px;
// //     flex: 1;
// //     min-width: 100px;
// //     text-align: center;
// //   }
// //   .ep-stat-num {
// //     font-family: 'Syne', sans-serif;
// //     font-size: 26px;
// //     font-weight: 800;
// //     color: var(--c-text);
// //     letter-spacing: -.03em;
// //     line-height: 1;
// //     margin-bottom: 4px;
// //   }
// //   .ep-stat-lbl {
// //     font-size: 10px;
// //     color: var(--c-sub);
// //     text-transform: uppercase;
// //     letter-spacing: .08em;
// //     font-weight: 600;
// //   }
// //   .ep-summary-block {
// //     font-size: 13px;
// //     color: var(--c-text2);
// //     line-height: 1.75;
// //     padding: 14px 18px;
// //     background: var(--c-bg);
// //     border-radius: 10px;
// //     border-left: 3px solid var(--c-accent);
// //   }

// //   /* ── Chapter rows ── */
// //   .ep-section-label {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 10px;
// //     color: var(--c-sub);
// //     letter-spacing: .12em;
// //     text-transform: uppercase;
// //     margin: 24px 0 12px;
// //   }
// //   .ep-chapter-row {
// //     display: flex;
// //     align-items: center;
// //     justify-content: space-between;
// //     gap: 12px;
// //     padding: 14px 18px;
// //     background: var(--c-surface);
// //     border: 1px solid var(--c-border);
// //     border-radius: var(--radius);
// //     cursor: pointer;
// //     transition: border-color .15s, background .15s;
// //     margin-bottom: 8px;
// //   }
// //   .ep-chapter-row:hover {
// //     border-color: var(--c-accent);
// //     background: rgba(56,189,248,.04);
// //   }
// //   .ep-chapter-num {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 11px;
// //     color: var(--c-accent);
// //     background: rgba(56,189,248,.1);
// //     padding: 2px 8px;
// //     border-radius: 5px;
// //     flex-shrink: 0;
// //   }
// //   .ep-chapter-name {
// //     font-size: 13.5px;
// //     font-weight: 600;
// //     color: var(--c-text);
// //     flex: 1;
// //   }
// //   .ep-chapter-stats {
// //     display: flex;
// //     gap: 12px;
// //     font-size: 11px;
// //     color: var(--c-sub);
// //     flex-shrink: 0;
// //   }
// //   .ep-arrow { color: var(--c-muted); transition: transform .2s, color .15s; }
// //   .ep-chapter-row:hover .ep-arrow { transform: translateX(4px); color: var(--c-accent); }

// //   /* ── Table view (clauses/actions) ── */
// //   .ep-table-controls {
// //     display: flex;
// //     align-items: center;
// //     gap: 12px;
// //     margin-bottom: 16px;
// //     flex-wrap: wrap;
// //   }
// //   .ep-table-search-wrap {
// //     position: relative;
// //     flex: 1;
// //     min-width: 200px;
// //   }
// //   .ep-table-search-icon {
// //     position: absolute;
// //     left: 12px; top: 50%;
// //     transform: translateY(-50%);
// //     color: var(--c-sub);
// //     font-size: 14px;
// //     pointer-events: none;
// //     font-style: normal;
// //   }
// //   .ep-table-search {
// //     width: 100%;
// //     padding: 9px 12px 9px 36px;
// //     background: var(--c-surface);
// //     border: 1px solid var(--c-border);
// //     border-radius: 8px;
// //     font-family: 'Instrument Sans', sans-serif;
// //     font-size: 13px;
// //     color: var(--c-text);
// //     outline: none;
// //     transition: border-color .2s, box-shadow .2s;
// //   }
// //   .ep-table-search:focus {
// //     border-color: var(--c-accent);
// //     box-shadow: 0 0 0 3px rgba(56,189,248,.1);
// //   }
// //   .ep-table-search::placeholder { color: var(--c-muted); }
// //   .ep-table-count {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 11px;
// //     color: var(--c-sub);
// //     white-space: nowrap;
// //   }

// //   .ep-table-wrap {
// //     background: var(--c-surface);
// //     border: 1px solid var(--c-border);
// //     border-radius: 14px;
// //     overflow: hidden;
// //     box-shadow: var(--shadow);
// //   }
// //   .ep-table {
// //     width: 100%;
// //     border-collapse: collapse;
// //   }
// //   .ep-table thead tr {
// //     background: var(--c-bg);
// //     border-bottom: 1px solid var(--c-border);
// //   }
// //   .ep-table th {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 10px;
// //     color: var(--c-sub);
// //     letter-spacing: .1em;
// //     text-transform: uppercase;
// //     padding: 12px 16px;
// //     text-align: left;
// //     font-weight: 500;
// //     cursor: pointer;
// //     white-space: nowrap;
// //     user-select: none;
// //     transition: color .15s;
// //   }
// //   .ep-table th:hover { color: var(--c-accent); }
// //   .ep-table th.sorted { color: var(--c-accent); }
// //   .ep-table th .sort-icon { margin-left: 4px; opacity: .5; }
// //   .ep-table th.sorted .sort-icon { opacity: 1; }

// //   .ep-table tbody tr {
// //     border-bottom: 1px solid var(--c-border2);
// //     transition: background .12s;
// //   }
// //   .ep-table tbody tr:last-child { border-bottom: none; }
// //   .ep-table tbody tr:hover { background: rgba(56,189,248,.03); }

// //   .ep-table td {
// //     padding: 14px 16px;
// //     font-size: 13px;
// //     color: var(--c-text2);
// //     vertical-align: top;
// //   }
// //   .ep-table td.clause-id {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 11px;
// //     color: var(--c-accent);
// //     white-space: nowrap;
// //   }
// //   .ep-table td.obligation-text {
// //     font-size: 12.5px;
// //     color: var(--c-text2);
// //     line-height: 1.55;
// //     max-width: 220px;
// //   }
// //   .ep-table td.action-text {
// //     font-size: 12.5px;
// //     color: var(--c-text);
// //     line-height: 1.55;
// //     max-width: 200px;
// //   }
// //   .ep-score-pill {
// //     display: inline-flex;
// //     align-items: center;
// //     gap: 6px;
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 12px;
// //     font-weight: 500;
// //     padding: 4px 10px;
// //     border-radius: 20px;
// //     white-space: nowrap;
// //   }
// //   .ep-score-dot {
// //     width: 6px; height: 6px;
// //     border-radius: 50%;
// //     flex-shrink: 0;
// //   }

// //   .ep-btn-evaluate {
// //     display: inline-flex;
// //     align-items: center;
// //     gap: 6px;
// //     padding: 7px 14px;
// //     background: rgba(56,189,248,.12);
// //     border: 1px solid rgba(56,189,248,.3);
// //     border-radius: 7px;
// //     font-family: 'Instrument Sans', sans-serif;
// //     font-size: 12px;
// //     font-weight: 600;
// //     color: var(--c-accent);
// //     cursor: pointer;
// //     transition: background .15s, border-color .15s, transform .1s;
// //     white-space: nowrap;
// //   }
// //   .ep-btn-evaluate:hover {
// //     background: rgba(56,189,248,.2);
// //     border-color: var(--c-accent);
// //     transform: translateY(-1px);
// //   }
// //   .ep-btn-evaluate:active { transform: scale(.97); }

// //   .ep-table-empty {
// //     text-align: center;
// //     padding: 48px;
// //     color: var(--c-sub);
// //     font-size: 13px;
// //   }

// //   /* ── Evidence Modal Overlay ── */
// //   .ep-modal-overlay {
// //     position: fixed;
// //     inset: 0;
// //     background: rgba(0,0,0,.7);
// //     backdrop-filter: blur(4px);
// //     z-index: 9000;
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     padding: 20px;
// //     animation: ep-overlay-in .2s ease;
// //   }
// //   @keyframes ep-overlay-in { from { opacity: 0; } to { opacity: 1; } }

// //   .ep-modal {
// //     background: var(--c-surface);
// //     border: 1px solid var(--c-border);
// //     border-radius: 20px;
// //     width: 100%;
// //     max-width: 880px;
// //     max-height: 90vh;
// //     overflow-y: auto;
// //     box-shadow: 0 24px 64px rgba(0,0,0,.6);
// //     animation: ep-modal-in .25s ease;
// //   }
// //   .ep-modal::-webkit-scrollbar { width: 4px; }
// //   .ep-modal::-webkit-scrollbar-track { background: transparent; }
// //   .ep-modal::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 4px; }
// //   @keyframes ep-modal-in { from { opacity: 0; transform: scale(.96) translateY(12px); } to { opacity: 1; transform: none; } }

// //   .ep-modal-header {
// //     display: flex;
// //     align-items: flex-start;
// //     justify-content: space-between;
// //     gap: 16px;
// //     padding: 24px 28px 20px;
// //     border-bottom: 1px solid var(--c-border);
// //     position: sticky;
// //     top: 0;
// //     background: var(--c-surface);
// //     z-index: 1;
// //   }
// //   .ep-modal-eyebrow {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 10px;
// //     color: var(--c-accent);
// //     letter-spacing: .12em;
// //     margin-bottom: 4px;
// //   }
// //   .ep-modal-title {
// //     font-family: 'Syne', sans-serif;
// //     font-size: 18px;
// //     font-weight: 700;
// //     color: var(--c-text);
// //     letter-spacing: -.01em;
// //   }
// //   .ep-modal-close {
// //     width: 32px; height: 32px;
// //     background: var(--c-bg);
// //     border: 1px solid var(--c-border);
// //     border-radius: 8px;
// //     display: flex; align-items: center; justify-content: center;
// //     cursor: pointer;
// //     color: var(--c-sub);
// //     font-size: 18px;
// //     flex-shrink: 0;
// //     transition: background .15s, color .15s;
// //     line-height: 1;
// //   }
// //   .ep-modal-close:hover { background: var(--c-raised); color: var(--c-text); }

// //   .ep-modal-body {
// //     padding: 24px 28px;
// //     display: grid;
// //     grid-template-columns: 1fr 1fr;
// //     gap: 20px;
// //   }
// //   @media (max-width: 680px) { .ep-modal-body { grid-template-columns: 1fr; } }

// //   /* context strip in modal */
// //   .ep-modal-context {
// //     background: var(--c-bg);
// //     border: 1px solid var(--c-border);
// //     border-radius: 10px;
// //     padding: 14px 16px;
// //     margin-bottom: 0;
// //   }
// //   .ep-modal-context-label {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 9px;
// //     color: var(--c-sub);
// //     letter-spacing: .12em;
// //     text-transform: uppercase;
// //     margin-bottom: 6px;
// //   }
// //   .ep-modal-context-text {
// //     font-size: 13px;
// //     color: var(--c-text);
// //     font-weight: 500;
// //     line-height: 1.5;
// //   }
// //   .ep-modal-context-meta {
// //     display: flex;
// //     gap: 8px;
// //     margin-top: 8px;
// //     flex-wrap: wrap;
// //   }

// //   /* ev card */
// //   .ep-ev-col-title {
// //     font-family: 'IBM Plex Mono', monospace;
// //     font-size: 10px;
// //     color: var(--c-sub);
// //     letter-spacing: .1em;
// //     text-transform: uppercase;
// //     margin-bottom: 16px;
// //     padding-bottom: 12px;
// //     border-bottom: 1px solid var(--c-border);
// //     display: flex; align-items: center; gap: 8px;
// //   }

// //   .ep-form-label {
// //     font-size: 11px;
// //     font-weight: 600;
// //     color: var(--c-sub);
// //     margin-bottom: 6px;
// //     display: block;
// //     text-transform: uppercase;
// //     letter-spacing: .06em;
// //   }
// //   .ep-form-control {
// //     width: 100%;
// //     padding: 10px 12px;
// //     border: 1px solid var(--c-border);
// //     border-radius: 8px;
// //     font-family: 'Instrument Sans', sans-serif;
// //     font-size: 13px;
// //     color: var(--c-text);
// //     background: var(--c-bg);
// //     outline: none;
// //     transition: border-color .2s, box-shadow .2s;
// //     margin-bottom: 14px;
// //   }
// //   .ep-form-control option { background: #1e293b; }
// //   .ep-form-control:focus {
// //     border-color: var(--c-accent);
// //     box-shadow: 0 0 0 3px rgba(56,189,248,.1);
// //   }
// //   .ep-form-control::placeholder { color: var(--c-muted); }

// //   .ep-upload-zone {
// //     border: 2px dashed var(--c-border);
// //     border-radius: 10px;
// //     padding: 22px;
// //     text-align: center;
// //     cursor: pointer;
// //     transition: border-color .2s, background .2s;
// //     margin-bottom: 14px;
// //     background: var(--c-bg);
// //   }
// //   .ep-upload-zone:hover { border-color: var(--c-accent); background: rgba(56,189,248,.03); }
// //   .ep-upload-zone.ep-uploaded { border-color: var(--c-green); border-style: solid; background: rgba(52,211,153,.05); }
// //   .ep-upload-icon { font-size: 26px; margin-bottom: 6px; }
// //   .ep-upload-label { font-size: 13px; color: var(--c-text2); }
// //   .ep-upload-sub { font-size: 11px; color: var(--c-sub); margin-top: 3px; }

// //   /* eval panel */
// //   .ep-eval-panel { }
// //   .ep-score-display {
// //     display: flex;
// //     align-items: center;
// //     gap: 20px;
// //     padding: 20px;
// //     background: var(--c-bg);
// //     border-radius: 12px;
// //     margin-bottom: 16px;
// //     border: 1px solid var(--c-border);
// //   }
// //   .ep-score-ring-wrap { flex-shrink: 0; }
// //   .ep-score-ring { width: 76px; height: 76px; }
// //   .ep-score-ring circle { fill: none; stroke-width: 8; }
// //   .ep-score-ring .track { stroke: var(--c-border); }
// //   .ep-score-ring .fill { stroke-linecap: round; transition: stroke-dashoffset .8s cubic-bezier(.4,0,.2,1); }
// //   .ep-score-big {
// //     font-family: 'Syne', sans-serif;
// //     font-size: 32px;
// //     font-weight: 800;
// //     letter-spacing: -.03em;
// //     line-height: 1;
// //   }
// //   .ep-score-verdict { font-size: 12px; color: var(--c-sub); margin-top: 4px; }
// //   .ep-score-verdict strong { font-weight: 600; }

// //   .ep-reasoning {
// //     font-size: 13px;
// //     color: var(--c-text2);
// //     line-height: 1.7;
// //     padding: 14px 16px;
// //     background: var(--c-bg);
// //     border-radius: 10px;
// //     border-left: 3px solid var(--c-accent2);
// //     margin-bottom: 16px;
// //   }

// //   .ep-detail-row {
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: center;
// //     padding: 10px 0;
// //     border-bottom: 1px solid var(--c-border2);
// //     font-size: 12px;
// //   }
// //   .ep-detail-row:last-child { border-bottom: none; }
// //   .ep-detail-row .lbl { color: var(--c-sub); text-transform: uppercase; letter-spacing: .05em; font-size: 10px; font-family: 'IBM Plex Mono', monospace; }
// //   .ep-detail-row .val { color: var(--c-text); font-weight: 600; font-size: 12px; text-align: right; max-width: 55%; }

// //   /* ── Buttons ── */
// //   .ep-btn {
// //     display: inline-flex;
// //     align-items: center;
// //     gap: 6px;
// //     padding: 10px 20px;
// //     border-radius: 9px;
// //     font-family: 'Instrument Sans', sans-serif;
// //     font-size: 13px;
// //     font-weight: 600;
// //     cursor: pointer;
// //     border: none;
// //     transition: all .15s;
// //   }
// //   .ep-btn:active { transform: scale(.97); }
// //   .ep-btn-primary {
// //     background: var(--c-accent);
// //     color: #0f172a;
// //   }
// //   .ep-btn-primary:hover { background: #7dd3fc; box-shadow: 0 4px 16px rgba(56,189,248,.3); }
// //   .ep-btn-ghost {
// //     background: var(--c-bg);
// //     color: var(--c-text2);
// //     border: 1px solid var(--c-border);
// //   }
// //   .ep-btn-ghost:hover { background: var(--c-raised); color: var(--c-text); }
// //   .ep-btn-success {
// //     background: var(--c-green);
// //     color: #0f172a;
// //   }
// //   .ep-btn-sm { padding: 7px 14px; font-size: 12px; }
// //   .ep-btn-row { display: flex; gap: 10px; flex-wrap: wrap; }

// //   /* ── Toast ── */
// //   .ep-toast {
// //     position: fixed;
// //     bottom: 28px;
// //     right: 28px;
// //     z-index: 99999;
// //     padding: 12px 20px;
// //     border-radius: 10px;
// //     font-family: 'Instrument Sans', sans-serif;
// //     font-size: 13px;
// //     font-weight: 600;
// //     color: #0f172a;
// //     box-shadow: 0 8px 32px rgba(0,0,0,.4);
// //     animation: ep-slide-in .2s ease;
// //   }
// //   @keyframes ep-slide-in {
// //     from { opacity:0; transform: translateY(10px); }
// //     to   { opacity:1; transform: translateY(0); }
// //   }

// //   .ep-fade-in { animation: ep-fade .25s ease; }
// //   @keyframes ep-fade { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }

// //   .ep-divider { height: 1px; background: var(--c-border); margin: 16px 0; }
// //   `;

// //   /* ─── helpers ─────────────────────────────────── */
// //   function _injectCSS() {
// //     if (document.getElementById('ep-styles')) return;
// //     const s = document.createElement('style');
// //     s.id = 'ep-styles';
// //     s.textContent = CSS;
// //     document.head.appendChild(s);
// //   }

// //   function _toast(msg, type = 'success') {
// //     const colors = { success: '#34d399', warning: '#fbbf24', danger: '#f87171', info: '#38bdf8' };
// //     const t = document.createElement('div');
// //     t.className = 'ep-toast';
// //     t.textContent = msg;
// //     t.style.background = colors[type] || colors.success;
// //     document.body.appendChild(t);
// //     setTimeout(() => t.remove(), 2800);
// //   }

// //   function _riskTag(risk) {
// //     const r = (risk || '').toLowerCase();
// //     const cls = r === 'high' ? 'ep-tag-high' : r === 'medium' ? 'ep-tag-medium' : 'ep-tag-low';
// //     return `<span class="ep-tag ${cls}">${risk || '—'}</span>`;
// //   }
// //   function _statusTag(status) {
// //     const s = (status || '').toLowerCase();
// //     const cls = s === 'active' ? 'ep-tag-active' : 'ep-tag-inactive';
// //     return `<span class="ep-tag ${cls}">${status || '—'}</span>`;
// //   }

// //   function _getObligation(cl) { return cl.obligation || cl.obligations || '—'; }
// //   function _getActionable(cl) { return cl.actionable || cl.actionables || cl.actionabless || ''; }
// //   function _extractActions(text) {
// //     if (!text) return [];
// //     let a = text.split(';').map(x => x.trim()).filter(Boolean);
// //     if (a.length === 1 && text.includes(',')) {
// //       const c = text.split(',').map(x => x.trim()).filter(Boolean);
// //       if (c.length > 1) a = c;
// //     }
// //     if (!a.length && text) a = [text];
// //     return a;
// //   }

// //   function _mockEval() {
// //     const mocks = (_data.aiEvidenceResults || []);
// //     if (mocks.length) return mocks[Math.floor(Math.random() * mocks.length)];
// //     const scores = [82, 67, 91, 54, 76, 88, 43, 95];
// //     const statuses = ['Complete', 'Partial', 'Gap'];
// //     const reasonings = [
// //       'The uploaded document demonstrates clear alignment with the regulatory requirement. Key controls are documented and evidence of periodic reviews is present. Stakeholder sign-offs are clearly visible.',
// //       'Evidence partially satisfies the clause. Some controls are missing documentation or lack sign-off from appropriate stakeholders. A secondary review is recommended.',
// //       'Insufficient evidence provided. The gap analysis indicates missing controls that need to be addressed before compliance can be confirmed. Please upload updated documentation.',
// //     ];
// //     const i = Math.floor(Math.random() * 3);
// //     return { score: scores[Math.floor(Math.random() * scores.length)], status: statuses[i], reasoning: reasonings[i] };
// //   }

// //   function _scoreRing(score) {
// //     const r = 30, circ = 2 * Math.PI * r;
// //     const offset = circ - (score / 100) * circ;
// //     const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171';
// //     return { svg: `<svg class="ep-score-ring" viewBox="0 0 76 76">
// //       <circle class="track" cx="38" cy="38" r="${r}"/>
// //       <circle class="fill" cx="38" cy="38" r="${r}" stroke="${color}"
// //         stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
// //         transform="rotate(-90 38 38)"/>
// //     </svg>`, color };
// //   }

// //   function _allActionsFlat(circ) {
// //     const out = [];
// //     (circ.chapters || []).forEach(ch => {
// //       (ch.clauses || []).forEach(cl => {
// //         const at = _getActionable(cl);
// //         if (at) _extractActions(at).forEach(act => {
// //           out.push({
// //             clauseId: cl.id,
// //             clauseText: cl.text || cl.title || '',
// //             chapterTitle: ch.title || ch.id,
// //             department: cl.department || '—',
// //             risk: cl.risk || '—',
// //             obligation: _getObligation(cl),
// //             action: act
// //           });
// //         });
// //       });
// //     });
// //     return out;
// //   }

// //   /* ─── RENDER ──────────────────────────────────── */
// //   function _renderBreadcrumb() {
// //     if (!_breadcrumb.length) return '';
// //     const crumbs = [{ label: 'Search', key: 'search' }, ...(_breadcrumb.map((b, i) => ({ label: b.label, key: i })))];
// //     return `<div class="ep-breadcrumb">
// //       ${crumbs.map((c, i) => {
// //         const isLast = i === crumbs.length - 1;
// //         return `${i > 0 ? '<span class="ep-crumb-sep">›</span>' : ''}
// //           <span class="ep-crumb${isLast ? ' active' : ''}" data-crumb="${c.key}">${c.label}</span>`;
// //       }).join('')}
// //     </div>`;
// //   }

// //   /* ── Search ── */
// //   function _renderSearch() {
// //     const circs = _data.circulars || [];
// //     return `
// //       <div class="ep-search-card ep-fade-in">
// //         <div class="ep-search-eyebrow">Evidence Management System</div>
// //         <div class="ep-search-heading">Find a Circular</div>
// //         <div class="ep-search-sub">Search across ${circs.length} circulars by ID, title, or regulator</div>
// //         <div class="ep-search-wrap">
// //           <i class="ep-search-icon">⌕</i>
// //           <input class="ep-search-input" id="ep-search-input" placeholder="e.g. CIRC-001, KYC compliance, RBI…" autocomplete="off">
// //         </div>
// //         <div id="ep-results-container">
// //           <div class="ep-search-empty">
// //             <div class="ep-search-empty-icon">🔍</div>
// //             <div>Start typing to search circulars</div>
// //           </div>
// //         </div>
// //       </div>`;
// //   }

// //   function _updateSearchResults(q) {
// //     const container = _container.querySelector('#ep-results-container');
// //     if (!container) return;
// //     const circs = _data.circulars || [];
// //     const query = (q || '').toLowerCase().trim();

// //     if (!query) {
// //       container.innerHTML = `<div class="ep-search-empty"><div class="ep-search-empty-icon">🔍</div><div>Start typing to search circulars</div></div>`;
// //       return;
// //     }

// //     const filtered = circs.filter(c =>
// //       c.id.toLowerCase().includes(query) ||
// //       (c.title || '').toLowerCase().includes(query) ||
// //       (c.regulator || '').toLowerCase().includes(query)
// //     );

// //     if (!filtered.length) {
// //       container.innerHTML = `<div class="ep-search-empty"><div class="ep-search-empty-icon">📭</div><div>No circulars match "<strong>${query}</strong>"</div></div>`;
// //       return;
// //     }

// //     container.innerHTML = `<div class="ep-results-grid" id="ep-results">
// //       ${filtered.map(c => `
// //         <div class="ep-result-card" data-circular-id="${c.id}">
// //           <div class="ep-result-card-top">
// //             <span class="ep-result-id">${c.id}</span>
// //             <div class="ep-result-badges">${_statusTag(c.status)}${_riskTag(c.risk)}</div>
// //           </div>
// //           <div class="ep-result-title">${c.title || 'Untitled'}</div>
// //           <div class="ep-result-reg">
// //             <span>🏛</span>
// //             <span>${c.regulator || '—'}</span>
// //             ${c.effectiveDate ? `<span style="color:var(--c-border);margin:0 2px;">·</span><span>${c.effectiveDate}</span>` : ''}
// //           </div>
// //         </div>`).join('')}
// //     </div>`;

// //     container.querySelectorAll('[data-circular-id]').forEach(el => {
// //       el.addEventListener('click', () => _selectCircular(el.dataset.circularId));
// //     });
// //   }

// //   /* ── Overview ── */
// //   function _renderOverview(circ) {
// //     const chapters = circ.chapters || [];
// //     const clauseCount = chapters.reduce((s, ch) => s + (ch.clauses?.length || 0), 0);
// //     const actionCount = _allActionsFlat(circ).length;

// //     return `
// //       ${_renderBreadcrumb()}
// //       <div class="ep-overview-hero ep-fade-in">
// //         <div class="ep-ov-header">
// //           <div>
// //             <div class="ep-ov-eyebrow">${circ.id}</div>
// //             <div class="ep-ov-title">${circ.title || 'Untitled Circular'}</div>
// //             <div class="ep-ov-meta">
// //               <span>🏛 <strong>${circ.regulator || '—'}</strong></span>
// //               <span>📁 <strong>${circ.type || '—'}</strong></span>
// //               ${circ.effectiveDate ? `<span>📅 <strong>${circ.effectiveDate}</strong></span>` : ''}
// //             </div>
// //           </div>
// //           <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start;">${_statusTag(circ.status)}${_riskTag(circ.risk)}</div>
// //         </div>
// //         <div class="ep-stats-row">
// //           <div class="ep-stat-chip"><div class="ep-stat-num">${chapters.length}</div><div class="ep-stat-lbl">Chapters</div></div>
// //           <div class="ep-stat-chip"><div class="ep-stat-num">${clauseCount}</div><div class="ep-stat-lbl">Clauses</div></div>
// //           <div class="ep-stat-chip"><div class="ep-stat-num" style="color:var(--c-accent)">${actionCount}</div><div class="ep-stat-lbl">Actions</div></div>
// //         </div>
// //         ${circ.summary || circ.description ? `<div class="ep-summary-block">${circ.summary || circ.description}</div>` : ''}
// //       </div>

// //       <div class="ep-section-label">Chapters</div>
// //       ${chapters.map(ch => {
// //         const actCt = (ch.clauses || []).reduce((s, cl) => s + _extractActions(_getActionable(cl)).length, 0);
// //         return `<div class="ep-chapter-row" data-chapter-id="${ch.num}">
// //           <span class="ep-chapter-num">${ch.num || '–'}</span>
// //           <span class="ep-chapter-name">${ch.title || ch.id}</span>
// //           <div class="ep-chapter-stats">
// //             <span>${ch.clauses?.length || 0} clauses</span>
// //             <span style="color:var(--c-accent)">${actCt} actions</span>
// //           </div>
// //           <span class="ep-arrow">›</span>
// //         </div>`;
// //       }).join('')}`;
// //   }

// //   /* ── Actions Table ── */
// //   function _renderActionsTable(circ, chapter) {
// //     const source = chapter ? (chapter.clauses || []) : [];
// //     let rows = [];
// //     source.forEach(cl => {
// //       const at = _getActionable(cl);
// //       if (at) _extractActions(at).forEach(act => {
// //         rows.push({
// //           clauseId: cl.id,
// //           clauseText: cl.text || cl.title || '',
// //           department: cl.department || '—',
// //           risk: cl.risk || '—',
// //           obligation: _getObligation(cl),
// //           action: act,
// //           _mockScore: _mockEval()
// //         });
// //       });
// //     });

// //     return `
// //       ${_renderBreadcrumb()}
// //       <div class="ep-table-controls ep-fade-in">
// //         <div class="ep-table-search-wrap">
// //           <i class="ep-table-search-icon">⌕</i>
// //           <input class="ep-table-search" id="ep-table-search" placeholder="Filter by clause, action, obligation, department…">
// //         </div>
// //         <span class="ep-table-count" id="ep-table-count">${rows.length} actions</span>
// //       </div>
// //       <div class="ep-table-wrap ep-fade-in">
// //         <table class="ep-table" id="ep-main-table">
// //           <thead>
// //             <tr>
// //               <th data-col="clauseId">Clause ID <span class="sort-icon">↕</span></th>
// //               <th data-col="obligation">Obligation <span class="sort-icon">↕</span></th>
// //               <th data-col="action">Action <span class="sort-icon">↕</span></th>
// //               <th data-col="department">Dept <span class="sort-icon">↕</span></th>
// //               <th data-col="risk">Risk <span class="sort-icon">↕</span></th>
// //               <th>Score</th>
// //               <th></th>
// //             </tr>
// //           </thead>
// //           <tbody id="ep-table-body">
// //             ${_renderTableRows(rows, '')}
// //           </tbody>
// //         </table>
// //       </div>`;
// //   }

// //   function _renderTableRows(rows, filter) {
// //     const q = (filter || '').toLowerCase().trim();
// //     const filtered = q ? rows.filter(r =>
// //       r.clauseId.toLowerCase().includes(q) ||
// //       r.action.toLowerCase().includes(q) ||
// //       r.obligation.toLowerCase().includes(q) ||
// //       r.department.toLowerCase().includes(q)
// //     ) : rows;

// //     if (!filtered.length) return `<tr><td colspan="7" class="ep-table-empty">No actions match your filter</td></tr>`;

// //     return filtered.map((r, i) => {
// //       const sc = r._mockScore;
// //       const scoreColor = sc.score >= 80 ? 'var(--c-green)' : sc.score >= 60 ? 'var(--c-amber)' : 'var(--c-red)';
// //       const dotBg = sc.score >= 80 ? '#34d399' : sc.score >= 60 ? '#fbbf24' : '#f87171';
// //       const oblig = (r.obligation || '').length > 80 ? r.obligation.substring(0, 80) + '…' : r.obligation;
// //       const act = (r.action || '').length > 80 ? r.action.substring(0, 80) + '…' : r.action;
// //       return `<tr>
// //         <td class="clause-id">${r.clauseId}</td>
// //         <td class="obligation-text">${oblig || '—'}</td>
// //         <td class="action-text" style="color:var(--c-text);">${act}</td>
// //         <td><span class="ep-tag" style="background:rgba(129,140,248,.12);color:#818cf8;border:1px solid rgba(129,140,248,.2);">${r.department}</span></td>
// //         <td>${_riskTag(r.risk)}</td>
// //         <td>
// //           <span class="ep-score-pill" style="background:${scoreColor}18;color:${scoreColor};border:1px solid ${scoreColor}30;">
// //             <span class="ep-score-dot" style="background:${dotBg};"></span>
// //             ${sc.score}%
// //           </span>
// //         </td>
// //         <td>
// //           <button class="ep-btn-evaluate" data-row-idx="${i}" data-row-data='${encodeURIComponent(JSON.stringify(r))}'>
// //             ⚡ Evaluate
// //           </button>
// //         </td>
// //       </tr>`;
// //     }).join('');
// //   }

// //   /* ── Evidence Modal ── */
// //   function _openEvidenceModal(rowData) {
// //     const ev = _mockEval();
// //     const { svg: ringSvg, color: ringColor } = _scoreRing(ev.score);
// //     const statusColor = ev.status === 'Complete' ? 'var(--c-green)' : ev.status === 'Partial' ? 'var(--c-amber)' : 'var(--c-red)';

// //     const modal = document.createElement('div');
// //     modal.className = 'ep-modal-overlay';
// //     modal.id = 'ep-modal-overlay';
// //     modal.innerHTML = `
// //       <div class="ep-modal" id="ep-modal-inner">
// //         <div class="ep-modal-header">
// //           <div>
// //             <div class="ep-modal-eyebrow">Evidence Evaluation</div>
// //             <div class="ep-modal-title">Clause ${rowData.clauseId}</div>
// //           </div>
// //           <div class="ep-modal-close" id="ep-modal-close">✕</div>
// //         </div>

// //         <div style="padding:16px 28px 0;">
// //           <div class="ep-modal-context">
// //             <div class="ep-modal-context-label">Action to Evaluate</div>
// //             <div class="ep-modal-context-text">${rowData.action}</div>
// //             <div class="ep-modal-context-meta">
// //               <span class="ep-tag" style="background:rgba(129,140,248,.12);color:#818cf8;border:1px solid rgba(129,140,248,.2);">${rowData.department}</span>
// //               ${_riskTag(rowData.risk)}
// //             </div>
// //           </div>
// //         </div>

// //         <div class="ep-modal-body">
// //           <!-- Upload col -->
// //           <div>
// //             <div class="ep-ev-col-title">
// //               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
// //               Upload Evidence
// //             </div>

// //             <label class="ep-form-label">Obligation</label>
// //             <div style="font-size:12.5px;color:var(--c-text2);padding:10px 12px;background:var(--c-bg);border-radius:8px;line-height:1.6;margin-bottom:14px;border:1px solid var(--c-border);">${rowData.obligation}</div>

// //             <label class="ep-form-label">Document URL or Path</label>
// //             <input class="ep-form-control" id="ep-ev-doc" placeholder="https:// or /path/to/document…">

// //             <label class="ep-form-label">Upload File</label>
// //             <div class="ep-upload-zone" id="ep-upload-zone">
// //               <div class="ep-upload-icon">📄</div>
// //               <div class="ep-upload-label">Click to upload or drag & drop</div>
// //               <div class="ep-upload-sub">PDF · DOCX · XLSX · Max 10 MB</div>
// //               <input type="file" id="ep-file-input" style="display:none" accept=".pdf,.docx,.xlsx">
// //             </div>

// //             <label class="ep-form-label">Compliance Status</label>
// //             <select class="ep-form-control" id="ep-ev-status">
// //               <option value="">Select status…</option>
// //               <option value="complete">✅  Complete</option>
// //               <option value="partial">🟡  Partial</option>
// //               <option value="pending">🔴  Pending</option>
// //               <option value="na">⚪  Not Applicable</option>
// //             </select>

// //             <label class="ep-form-label">Notes</label>
// //             <textarea class="ep-form-control" id="ep-ev-notes" rows="3" placeholder="Add compliance notes, references, or caveats…" style="resize:vertical;"></textarea>

// //             <div class="ep-btn-row">
// //               <button class="ep-btn ep-btn-primary" id="ep-btn-submit-ev">
// //                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
// //                 Submit Evidence
// //               </button>
// //               <button class="ep-btn ep-btn-ghost ep-btn-sm" id="ep-btn-download-ev">⬇ Download</button>
// //             </div>
// //           </div>

// //           <!-- Evaluation col -->
// //           <div class="ep-eval-panel">
// //             <div class="ep-ev-col-title">
// //               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
// //               AI Evaluation
// //             </div>

// //             <div class="ep-score-display">
// //               <div class="ep-score-ring-wrap">${ringSvg}</div>
// //               <div>
// //                 <div class="ep-score-big" style="color:${ringColor}">${ev.score}%</div>
// //                 <div class="ep-score-verdict">Compliance Score · <strong style="color:${statusColor}">${ev.status}</strong></div>
// //               </div>
// //             </div>

// //             <div class="ep-reasoning">${ev.reasoning}</div>

// //             <div class="ep-divider"></div>
// //             <div class="ep-section-label" style="margin-bottom:8px;">Clause Details</div>

// //             <div class="ep-detail-row">
// //               <span class="lbl">Clause ID</span>
// //               <span class="val" style="font-family:'IBM Plex Mono',monospace;color:var(--c-accent);font-size:11px;">${rowData.clauseId}</span>
// //             </div>
// //             <div class="ep-detail-row">
// //               <span class="lbl">Department</span>
// //               <span class="val">${rowData.department}</span>
// //             </div>
// //             <div class="ep-detail-row">
// //               <span class="lbl">Risk Level</span>
// //               <span class="val">${_riskTag(rowData.risk)}</span>
// //             </div>
// //             <div class="ep-detail-row">
// //               <span class="lbl">Obligation</span>
// //               <span class="val">${(rowData.obligation || '').substring(0, 55)}${(rowData.obligation || '').length > 55 ? '…' : ''}</span>
// //             </div>

// //             <div class="ep-divider"></div>
// //             <div class="ep-btn-row">
// //               <button class="ep-btn ep-btn-ghost ep-btn-sm" id="ep-btn-re-analyze">↻ Re-analyze</button>
// //               <button class="ep-btn ep-btn-primary ep-btn-sm" id="ep-btn-download-report">📥 Download Report</button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>`;

// //     document.body.appendChild(modal);
// //     _bindModalEvents(modal, rowData);
// //   }

// //   function _bindModalEvents(modal, rowData) {
// //     modal.querySelector('#ep-modal-close').addEventListener('click', () => modal.remove());
// //     modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

// //     const zone = modal.querySelector('#ep-upload-zone');
// //     const fileInput = modal.querySelector('#ep-file-input');
// //     if (zone && fileInput) {
// //       zone.addEventListener('click', () => fileInput.click());
// //       zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--c-accent)'; });
// //       zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
// //       zone.addEventListener('drop', e => {
// //         e.preventDefault(); zone.style.borderColor = '';
// //         const f = e.dataTransfer.files[0];
// //         if (f) _handleFile(f, zone);
// //       });
// //       fileInput.addEventListener('change', () => { if (fileInput.files.length) _handleFile(fileInput.files[0], zone); });
// //     }

// //     modal.querySelector('#ep-btn-submit-ev').addEventListener('click', () => {
// //       const doc = modal.querySelector('#ep-ev-doc')?.value;
// //       const status = modal.querySelector('#ep-ev-status')?.value;
// //       const hasFile = modal.querySelector('#ep-file-input')?.files?.length;
// //       if (!doc && !hasFile) { _toast('Please provide evidence document or upload a file', 'warning'); return; }
// //       if (!status) { _toast('Please select compliance status', 'warning'); return; }
// //       _toast('✓ Evidence submitted successfully', 'success');
// //       modal.remove();
// //     });

// //     modal.querySelector('#ep-btn-download-ev')?.addEventListener('click', () => {
// //       _toast('📥 Preparing download…', 'info');
// //       setTimeout(() => _toast('✓ Download complete', 'success'), 1100);
// //     });

// //     modal.querySelector('#ep-btn-download-report')?.addEventListener('click', () => {
// //       _toast('📥 Generating evaluation report…', 'info');
// //       setTimeout(() => _toast('✓ Report ready', 'success'), 1400);
// //     });

// //     modal.querySelector('#ep-btn-re-analyze')?.addEventListener('click', () => {
// //       _toast('↻ Re-running AI analysis…', 'info');
// //       setTimeout(() => {
// //         modal.remove();
// //         _openEvidenceModal(rowData);
// //         _toast('✓ Analysis refreshed', 'success');
// //       }, 1600);
// //     });
// //   }

// //   function _handleFile(file, zone) {
// //     zone.classList.add('ep-uploaded');
// //     zone.querySelector('.ep-upload-icon').textContent = '✅';
// //     zone.querySelector('.ep-upload-label').textContent = `✓ ${file.name}`;
// //     zone.querySelector('.ep-upload-sub').textContent = `${(file.size / 1024).toFixed(1)} KB`;
// //   }

// //   /* ─── select + render ──────────────────────────── */
// //   function _selectCircular(id) {
// //     _selectedCircular = (_data.circulars || []).find(c => c.id === id);
// //     if (!_selectedCircular) return;
// //     _breadcrumb = [{ label: id, key: 'circular' }];
// //     _view = 'overview';
// //     _render();
// //   }

// //   function _render() {
// //     const root = _container.querySelector('#ep-view');
// //     if (!root) return;

// //     if (_view === 'search') {
// //       root.innerHTML = _renderSearch();
// //     } else if (_view === 'overview') {
// //       root.innerHTML = _renderOverview(_selectedCircular);
// //     } else if (_view === 'actions') {
// //       const ch = _breadcrumb[1]?.ref;
// //       root.innerHTML = _renderActionsTable(_selectedCircular, ch);
// //     }

// //     _bindEvents();
// //   }

// //   function _bindEvents() {
// //     const root = _container.querySelector('#ep-view');

// //     const searchInput = root.querySelector('#ep-search-input');
// //     if (searchInput) {
// //       let d;
// //       searchInput.addEventListener('input', () => {
// //         clearTimeout(d);
// //         d = setTimeout(() => _updateSearchResults(searchInput.value), 160);
// //       });
// //       searchInput.focus();
// //     }

// //     /* table filter */
// //     const tableSearch = root.querySelector('#ep-table-search');
// //     if (tableSearch) {
// //       let _rows = [];
// //       const ch = _breadcrumb[1]?.ref;
// //       (ch?.clauses || []).forEach(cl => {
// //         const at = _getActionable(cl);
// //         if (at) _extractActions(at).forEach(act => {
// //           _rows.push({
// //             clauseId: cl.id, clauseText: cl.text || '', department: cl.department || '—',
// //             risk: cl.risk || '—', obligation: _getObligation(cl), action: act,
// //             _mockScore: _mockEval()
// //           });
// //         });
// //       });

// //       tableSearch.addEventListener('input', () => {
// //         const tbody = root.querySelector('#ep-table-body');
// //         const count = root.querySelector('#ep-table-count');
// //         if (tbody) tbody.innerHTML = _renderTableRows(_rows, tableSearch.value);
// //         const vis = _rows.filter(r => {
// //           const q = tableSearch.value.toLowerCase();
// //           return !q || r.clauseId.toLowerCase().includes(q) || r.action.toLowerCase().includes(q) || r.obligation.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
// //         }).length;
// //         if (count) count.textContent = `${vis} of ${_rows.length} actions`;
// //         _bindEvaluateButtons(root);
// //       });

// //       /* table header sort */
// //       root.querySelectorAll('.ep-table th[data-col]').forEach(th => {
// //         th.addEventListener('click', () => {
// //           const col = th.dataset.col;
// //           if (_tableSortCol === col) _tableSortDir *= -1;
// //           else { _tableSortCol = col; _tableSortDir = 1; }
// //           root.querySelectorAll('.ep-table th').forEach(t => t.classList.remove('sorted'));
// //           th.classList.add('sorted');
// //           const sorted = [..._rows].sort((a, b) => {
// //             const av = (a[col] || '').toLowerCase(), bv = (b[col] || '').toLowerCase();
// //             return av < bv ? -_tableSortDir : av > bv ? _tableSortDir : 0;
// //           });
// //           const tbody = root.querySelector('#ep-table-body');
// //           if (tbody) tbody.innerHTML = _renderTableRows(sorted, tableSearch.value);
// //           _bindEvaluateButtons(root);
// //         });
// //       });

// //       _bindEvaluateButtons(root);
// //     }
// //   }

// //   function _bindEvaluateButtons(root) {
// //     root.querySelectorAll('[data-row-idx]').forEach(btn => {
// //       btn.addEventListener('click', () => {
// //         try {
// //           const data = JSON.parse(decodeURIComponent(btn.dataset.rowData));
// //           _openEvidenceModal(data);
// //         } catch (e) { console.error(e); }
// //       });
// //     });
// //   }

// //   /* ─── delegated listener (init-time, survives re-renders) ── */
// //   function _attachDelegation() {
// //     _container.addEventListener('click', e => {
// //       const crumbEl = e.target.closest('[data-crumb]');
// //       if (crumbEl) {
// //         const k = crumbEl.dataset.crumb;
// //         if (k === 'search') { _view = 'search'; _breadcrumb = []; _selectedCircular = null; _render(); }
// //         else if (k === '0') { _view = 'overview'; _breadcrumb = [_breadcrumb[0]]; _render(); }
// //         else if (k === '1') { _view = 'actions'; _breadcrumb = [_breadcrumb[0], _breadcrumb[1]]; _render(); }
// //         return;
// //       }

// //       const circEl = e.target.closest('[data-circular-id]');
// //       if (circEl) { _selectCircular(circEl.dataset.circularId); return; }

// //       const chapterEl = e.target.closest('[data-chapter-id]');
// //       if (chapterEl) {
// //         const chId = chapterEl.dataset.chapterId;
// //         const ch = (_selectedCircular?.chapters || []).find(c => String(c.num) === String(chId));
// //         if (!ch) return;
// //         _breadcrumb = [_breadcrumb[0], { label: ch.title || chId, key: 'chapter', ref: ch }];
// //         _view = 'actions';
// //         _render();
// //       }
// //     });
// //   }

// //   /* ─── PUBLIC ── */
// //   function init(containerId, cmsData) {
// //     _injectCSS();
// //     _data = cmsData;
// //     _container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
// //     if (!_container) { console.error('EvidencePanel: container not found'); return; }

// //     _container.innerHTML = `
// //       <div class="ep-root">
// //         <div class="ep-shell">
// //           <div class="ep-topbar">
// //             <div class="ep-logo-row">
// //               <div class="ep-logo-icon">⚖</div>
// //               <div>
// //                 <div class="ep-logo-text">ComplianceOS</div>
// //                 <div class="ep-logo-sub">Evidence Panel</div>
// //               </div>
// //             </div>
// //             <span class="ep-topbar-badge">AI-Engine v2</span>
// //           </div>
// //           <div id="ep-view"></div>
// //         </div>
// //       </div>`;

// //     _view = 'search';
// //     _attachDelegation();
// //     _render();
// //   }

// //   function navigateTo(circularId) {
// //     const circ = (_data?.circulars || []).find(c => c.id === circularId);
// //     if (!circ) return;
// //     _selectedCircular = circ;
// //     _breadcrumb = [{ label: circularId, key: 'circular' }];
// //     _view = 'overview';
// //     _render();
// //   }

// //   return { init, navigateTo };
// // })();
// /**
//  * EvidencePanel — Clean White Theme
//  * EvidencePanel.init(containerId, cmsData)
//  */

// /**
//  * EvidencePanel — Dark sidebar + light body + full analysis screen
//  * EvidencePanel.init(containerId, cmsData)
//  */
// /**
//  * EvidencePanel — Dark sidebar + light body + full analysis screen
//  * EvidencePanel.init(containerId, cmsData)
//  */

// /**
//  * EvidencePanel — Dark sidebar + light body + full analysis screen
//  * EvidencePanel.init(containerId, cmsData)
//  */

// const EvidencePanel = (() => {

//   let _container = null;
//   let _data = null;
//   let _selectedCircular = null;
//   let _sortCol = null;
//   let _sortDir = 1;
//   let _allRows = [];
//   let _view = 'table';
//   let _analysisRow = null;

//   const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
//   .ep-root*,.ep-root*::before,.ep-root*::after{box-sizing:border-box;margin:0;padding:0}
//   .ep-root{
//     font-family:'Plus Jakarta Sans',sans-serif;
//     background:#f0f2f5;color:#1a1f2e;min-height:100vh;
//     --ink:#1a1f2e;--ink2:#2d3347;--body:#f0f2f5;--card:#fff;--card2:#f7f8fa;
//     --border:#e3e7ef;--border2:#edf0f5;--muted:#6b7280;--faint:#9ca3af;
//     --hdr:#1a1f2e;--hdr2:#252d3d;--hdr-text:#f1f5f9;--hdr-sub:#8892a4;--hdr-b:#2d3347;
//     --blue:#3b6ef5;--blue-s:#eef2fe;--blue-m:#c7d4fc;
//     --green:#16a34a;--green-s:#f0fdf4;--amber:#d97706;--amber-s:#fffbeb;--red:#dc2626;--red-s:#fef2f2;
//     --r:10px;--sh-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
//     --sh-md:0 4px 16px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04);
//   }
//   .ep-layout{display:flex;min-height:100vh}

//   /* SIDEBAR */
//   .ep-sidebar{width:256px;flex-shrink:0;background:var(--hdr);display:flex;flex-direction:column;height:100vh;position:sticky;top:0}
//   .ep-sb-top{padding:22px 20px 18px;border-bottom:1px solid var(--hdr-b)}
//   .ep-sb-logo{display:flex;align-items:center;gap:10px}
//   .ep-sb-icon{width:34px;height:34px;background:var(--blue);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
//   .ep-sb-brand{font-size:15px;font-weight:800;color:var(--hdr-text);letter-spacing:-.02em}
//   .ep-sb-tag{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--hdr-sub);letter-spacing:.1em;text-transform:uppercase;margin-top:2px}
//   .ep-sb-lbl{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--hdr-sub);letter-spacing:.12em;text-transform:uppercase;padding:16px 20px 6px}
//   .ep-sb-search{padding:0 12px 12px}
//   .ep-sb-sw{position:relative}
//   .ep-sb-si{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--hdr-sub);font-size:13px;pointer-events:none;font-style:normal}
//   .ep-sb-inp{width:100%;height:34px;padding:0 10px 0 30px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:7px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;color:var(--hdr-text);outline:none;transition:border-color .18s}
//   .ep-sb-inp::placeholder{color:var(--hdr-sub)}
//   .ep-sb-inp:focus{border-color:var(--blue);background:rgba(59,110,245,.12)}
//   .ep-sb-list{flex:1;overflow-y:auto;padding:0 8px 12px}
//   .ep-sb-list::-webkit-scrollbar{width:3px}
//   .ep-sb-list::-webkit-scrollbar-thumb{background:var(--hdr-b);border-radius:3px}
//   .ep-sb-item{display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:8px;cursor:pointer;margin-bottom:1px;transition:background .12s}
//   .ep-sb-item:hover{background:rgba(255,255,255,.07)}
//   .ep-sb-item.active{background:var(--blue)}
//   .ep-sb-cid{font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(255,255,255,.45);flex-shrink:0}
//   .ep-sb-item.active .ep-sb-cid{color:rgba(255,255,255,.8)}
//   .ep-sb-cname{font-size:12px;font-weight:500;color:var(--hdr-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
//   .ep-sb-item.active .ep-sb-cname{color:var(--hdr-text)}
//   .ep-sb-empty{font-size:12px;color:var(--hdr-sub);padding:12px;text-align:center}
//   .ep-sb-foot{padding:12px 20px;border-top:1px solid var(--hdr-b)}
//   .ep-sb-foot-t{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--hdr-sub);letter-spacing:.06em}

//   /* MAIN */
//   .ep-main{flex:1;min-width:0;display:flex;flex-direction:column}
//   .ep-topbar{background:var(--hdr);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--hdr-b)}
//   .ep-tb-crumb{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--hdr-sub);letter-spacing:.07em;margin-bottom:3px;display:flex;align-items:center;gap:5px}
//   .ep-tb-crumb span{cursor:pointer;transition:color .15s}
//   .ep-tb-crumb span:hover{color:var(--hdr-text)}
//   .ep-tb-crumb .sep{cursor:default;opacity:.4}
//   .ep-tb-title{font-size:15px;font-weight:700;color:var(--hdr-text);letter-spacing:-.02em}
//   .ep-ai-badge{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--blue);background:rgba(59,110,245,.15);border:1px solid rgba(59,110,245,.3);padding:4px 12px;border-radius:20px}
//   .ep-content{flex:1;padding:24px 28px;overflow-y:auto}

//   /* EMPTY STATE */
//   .ep-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;text-align:center}
//   .ep-ei-box{width:70px;height:70px;background:var(--card);border:2px solid var(--border);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:30px;margin-bottom:18px;box-shadow:var(--sh-sm)}
//   .ep-et{font-size:18px;font-weight:700;color:var(--ink);margin-bottom:6px}
//   .ep-es{font-size:13px;color:var(--muted);max-width:280px;line-height:1.6}

//   /* TAGS */
//   .ep-tag{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;white-space:nowrap;letter-spacing:.02em}
//   .ep-tag-active{background:#dcfce7;color:#15803d}
//   .ep-tag-inactive{background:#fef9c3;color:#a16207}
//   .ep-tag-high{background:#fee2e2;color:#b91c1c}
//   .ep-tag-medium{background:#ffedd5;color:#c2410c}
//   .ep-tag-low{background:#dcfce7;color:#15803d}

//   /* CIRC BANNER */
//   .ep-banner{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px 20px;margin-bottom:18px;display:flex;align-items:center;gap:14px;box-shadow:var(--sh-sm);flex-wrap:wrap}
//   .ep-ban-id{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:var(--blue);background:var(--blue-s);border:1px solid var(--blue-m);padding:4px 10px;border-radius:6px;flex-shrink:0}
//   .ep-ban-title{font-size:15px;font-weight:700;color:var(--ink);flex:1}
//   .ep-ban-reg{font-size:12px;color:var(--muted);flex-shrink:0}
//   .ep-ban-tags{display:flex;gap:7px;flex-shrink:0}

//   /* STATS */
//   .ep-stats{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
//   .ep-stat{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:13px 18px;display:flex;align-items:center;gap:11px;box-shadow:var(--sh-sm);flex:1;min-width:110px}
//   .ep-stat-ico{font-size:18px;width:36px;height:36px;background:var(--card2);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
//   .ep-stat-n{font-size:22px;font-weight:800;color:var(--ink);letter-spacing:-.03em;line-height:1}
//   .ep-stat-l{font-size:11px;color:var(--muted);font-weight:500;margin-top:2px}

//   /* TABLE */
//   .ep-tbl-bar{display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap}
//   .ep-tfw{position:relative;flex:1;min-width:180px}
//   .ep-tfi{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--faint);font-size:13px;pointer-events:none;font-style:normal}
//   .ep-tf{width:100%;height:38px;padding:0 12px 0 34px;background:var(--card);border:1.5px solid var(--border);border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:var(--ink);outline:none;transition:border-color .18s,box-shadow .18s;box-shadow:var(--sh-sm)}
//   .ep-tf:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(59,110,245,.1)}
//   .ep-tf::placeholder{color:var(--faint)}
//   .ep-tc{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--faint);white-space:nowrap}
//   .ep-tbl-wrap{background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--sh-md)}
//   .ep-table{width:100%;border-collapse:collapse}
//   .ep-table thead tr{background:var(--ink)}
//   .ep-table th{font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.12em;text-transform:uppercase;padding:13px 16px;text-align:left;font-weight:500;cursor:pointer;user-select:none;white-space:nowrap;transition:color .15s}
//   .ep-table th:hover{color:rgba(255,255,255,.9)}
//   .ep-table th.ep-s{color:#fff}
//   .ep-si{margin-left:3px;opacity:.35}
//   .ep-table th.ep-s .ep-si{opacity:1}
//   .ep-table th:last-child{cursor:default}
//   .ep-table tbody tr{border-bottom:1px solid var(--border2);transition:background .1s}
//   .ep-table tbody tr:last-child{border-bottom:none}
//   .ep-table tbody tr:hover{background:#f8f9fc}
//   .ep-table td{padding:13px 16px;font-size:13px;color:var(--muted);vertical-align:middle}
//   .ep-td-cid{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--blue);font-weight:500;white-space:nowrap}
//   .ep-td-ch{font-size:11px;color:var(--faint);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
//   .ep-td-obl{font-size:12px;line-height:1.5;max-width:180px}
//   .ep-td-act{font-size:13px;font-weight:600;color:var(--ink);max-width:200px;line-height:1.45}
//   .ep-sp{display:inline-flex;align-items:center;gap:5px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap}
//   .ep-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
//   .ep-btn-eval{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;background:var(--ink);border:none;border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;color:#fff;cursor:pointer;transition:all .15s;white-space:nowrap}
//   .ep-btn-eval:hover{background:var(--blue);transform:translateY(-1px);box-shadow:0 4px 12px rgba(59,110,245,.3)}
//   .ep-btn-eval:active{transform:scale(.97)}
//   .ep-tbl-empty{text-align:center;padding:48px;color:var(--faint)}

//   /* ANALYSIS SCREEN */
//   .ep-analysis{animation:ep-fade .22s ease}
//   .ep-back{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;padding:0;margin-bottom:18px;background:none;border:none;transition:color .15s}
//   .ep-back:hover{color:var(--ink)}

//   /* Score hero — dark card */
//   .ep-hero{background:var(--ink);border-radius:14px;padding:28px;margin-bottom:18px;display:flex;align-items:center;gap:28px;flex-wrap:wrap;position:relative;overflow:hidden}
//   .ep-hero-glow{position:absolute;inset:0;background:radial-gradient(ellipse at 75% 50%,rgba(59,110,245,.18) 0%,transparent 60%);pointer-events:none}
//   .ep-hero-left{display:flex;align-items:center;gap:22px;flex-shrink:0;position:relative;z-index:1}
//   .ep-ring-wrap{position:relative;flex-shrink:0}
//   .ep-ring{width:96px;height:96px}
//   .ep-ring circle{fill:none;stroke-width:8}
//   .ep-ring .ep-tr{stroke:rgba(255,255,255,.08)}
//   .ep-ring .ep-fr{stroke-linecap:round;transition:stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)}
//   .ep-score-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
//   .ep-score-n{font-size:24px;font-weight:800;color:#fff;letter-spacing:-.03em;line-height:1}
//   .ep-score-sub{font-size:10px;color:rgba(255,255,255,.4);margin-top:1px}
//   .ep-hero-info{position:relative;z-index:1}
//   .ep-verdict{font-size:20px;font-weight:800;color:#fff;letter-spacing:-.025em;margin-bottom:5px}
//   .ep-verdict-sub{font-size:13px;color:rgba(255,255,255,.5);line-height:1.6;max-width:260px}
//   .ep-hero-right{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:10px;min-width:180px;position:relative;z-index:1}
//   .ep-hs{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:13px 15px}
//   .ep-hs-n{font-size:20px;font-weight:800;color:#fff;letter-spacing:-.02em;line-height:1}
//   .ep-hs-l{font-size:9px;color:rgba(255,255,255,.4);margin-top:3px;text-transform:uppercase;letter-spacing:.07em;font-family:'JetBrains Mono',monospace}

//   /* Analysis 2-col grid */
//   .ep-agrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
//   @media(max-width:780px){.ep-agrid{grid-template-columns:1fr}}
//   .ep-acard{background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--sh-sm)}
//   .ep-acard-head{padding:13px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border2)}
//   .ep-ach-ico{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
//   .ep-ach-title{font-size:13px;font-weight:700;color:var(--ink)}
//   .ep-ach-sub{font-size:11px;color:var(--muted);margin-top:1px}
//   .ep-acard-body{padding:14px 16px}
//   .ep-finding{display:flex;gap:11px;margin-bottom:11px;align-items:flex-start}
//   .ep-finding:last-child{margin-bottom:0}
//   .ep-fbullet{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:6px}
//   .ep-ftext{font-size:13px;color:var(--ink2);line-height:1.6}
//   .ep-ftext strong{font-weight:700;color:var(--ink)}
//   .ep-gitem{margin-bottom:13px}
//   .ep-gitem:last-child{margin-bottom:0}
//   .ep-grow{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
//   .ep-gname{font-size:12.5px;font-weight:600;color:var(--ink)}
//   .ep-gpct{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600}
//   .ep-gtrack{height:6px;background:var(--border2);border-radius:3px;overflow:hidden}
//   .ep-gfill{height:100%;border-radius:3px;transition:width .8s cubic-bezier(.4,0,.2,1)}
//   .ep-gnote{font-size:11px;color:var(--muted);margin-top:3px;line-height:1.5}

//   /* Path to 100% */
//   .ep-path{background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:14px;box-shadow:var(--sh-sm)}
//   .ep-path-head{background:var(--ink2);padding:14px 20px;display:flex;align-items:center;gap:12px}
//   .ep-path-head-ico{font-size:18px}
//   .ep-ph-title{font-size:14px;font-weight:700;color:#fff}
//   .ep-ph-sub{font-size:11px;color:rgba(255,255,255,.45);margin-top:1px}
//   .ep-steps{padding:4px 0}
//   .ep-step{display:flex;gap:0;padding:14px 20px;border-bottom:1px solid var(--border2);align-items:flex-start}
//   .ep-step:last-child{border-bottom:none}
//   .ep-step-num{width:26px;height:26px;background:var(--ink);color:#fff;font-size:11px;font-weight:800;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-right:14px;margin-top:1px}
//   .ep-step-body{flex:1}
//   .ep-step-title{font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:3px}
//   .ep-step-desc{font-size:12.5px;color:var(--muted);line-height:1.6}
//   .ep-step-imp{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;margin-left:12px;flex-shrink:0;align-self:flex-start;margin-top:2px;white-space:nowrap}

//   /* Upload panel */
//   .ep-upanel{background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--sh-sm);margin-bottom:14px}
//   .ep-up-head{padding:14px 20px;border-bottom:1px solid var(--border2);display:flex;align-items:center;gap:10px;background:var(--card2)}
//   .ep-up-title{font-size:14px;font-weight:700;color:var(--ink)}
//   .ep-up-sub{font-size:12px;color:var(--muted);margin-top:1px}
//   .ep-up-body{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
//   @media(max-width:600px){.ep-up-body{grid-template-columns:1fr}}
//   .ep-flbl{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;display:block}
//   .ep-fc{width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:var(--ink);background:var(--card2);outline:none;transition:border-color .18s,box-shadow .18s;margin-bottom:13px}
//   .ep-fc:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(59,110,245,.1);background:#fff}
//   .ep-fc::placeholder{color:var(--faint)}
//   .ep-fc option{background:#fff}
//   .ep-obl{font-size:12.5px;color:var(--muted);line-height:1.65;padding:10px 12px;background:var(--card2);border:1.5px solid var(--border);border-radius:8px;margin-bottom:13px}
//   .ep-uz{border:2px dashed var(--border);border-radius:10px;padding:20px 16px;text-align:center;cursor:pointer;transition:all .18s;margin-bottom:13px;background:var(--card2)}
//   .ep-uz:hover{border-color:var(--blue);background:var(--blue-s)}
//   .ep-uz.up{border-color:var(--green);border-style:solid;background:var(--green-s)}
//   .ep-uz-ico{font-size:22px;margin-bottom:5px}
//   .ep-uz-lbl{font-size:13px;color:var(--muted);font-weight:600}
//   .ep-uz-sub{font-size:11px;color:var(--faint);margin-top:3px}
//   .ep-obl-box{font-size:12.5px;color:var(--muted);line-height:1.65;padding:10px 12px;background:var(--card2);border:1.5px solid var(--border);border-radius:8px;margin-bottom:13px;border-left:3px solid var(--blue)}

//   /* Buttons */
//   .ep-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:9px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .15s}
//   .ep-btn:active{transform:scale(.97)}
//   .ep-btn-dark{background:var(--ink);color:#fff}
//   .ep-btn-dark:hover{background:var(--ink2);box-shadow:0 4px 14px rgba(0,0,0,.2)}
//   .ep-btn-blue{background:var(--blue);color:#fff}
//   .ep-btn-blue:hover{background:#2c5ce9;box-shadow:0 4px 14px rgba(59,110,245,.3)}
//   .ep-btn-ghost{background:var(--card2);color:var(--muted);border:1.5px solid var(--border)}
//   .ep-btn-ghost:hover{background:var(--border);color:var(--ink2)}
//   .ep-btn-sm{padding:7px 14px;font-size:12px}
//   .ep-btnrow{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}
//   .ep-div{height:1px;background:var(--border2);margin:12px 0}

//   .ep-toast{position:fixed;bottom:24px;right:24px;z-index:99999;padding:12px 18px;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,.16);animation:ep-ti .2s ease}
//   @keyframes ep-ti{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
//   .ep-fade{animation:ep-fade-a .22s ease}
//   @keyframes ep-fade-a{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
//   `;

//   function _injectCSS() {
//     if (document.getElementById('ep-css')) return;
//     const s = document.createElement('style'); s.id = 'ep-css'; s.textContent = CSS;
//     document.head.appendChild(s);
//   }

//   function _toast(msg, type = 'success') {
//     const c = { success:'#16a34a', warning:'#d97706', danger:'#dc2626', info:'#3b6ef5' };
//     const t = document.createElement('div'); t.className = 'ep-toast'; t.textContent = msg;
//     t.style.background = c[type]||c.success; document.body.appendChild(t);
//     setTimeout(() => t.remove(), 2600);
//   }

//   function _rtag(r) {
//     const v = (r||'').toLowerCase();
//     return `<span class="ep-tag ${v==='high'?'ep-tag-high':v==='medium'?'ep-tag-medium':'ep-tag-low'}">${r||'—'}</span>`;
//   }
//   function _stag(s) {
//     return `<span class="ep-tag ${(s||'').toLowerCase()==='active'?'ep-tag-active':'ep-tag-inactive'}">${s||'—'}</span>`;
//   }

//   function _getObl(cl) { return cl.obligation || cl.obligations || '—'; }
//   function _getAct(cl) { return cl.actionable || cl.actionables || cl.actionabless || ''; }
//   function _splitActs(t) {
//     if (!t) return [];
//     let a = t.split(';').map(x=>x.trim()).filter(Boolean);
//     if (a.length===1 && t.includes(',')) { const c=t.split(',').map(x=>x.trim()).filter(Boolean); if(c.length>1) a=c; }
//     return a.length ? a : [t];
//   }

//   function _mockEval(row) {
//     const hash = (row.clauseId||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0);
//     const score = [44,52,61,67,74,78,82,88,91][hash%9];
//     const goods = [
//       { text: '<strong>Policy documentation</strong> is present and references the correct regulatory clause.' },
//       { text: '<strong>Internal review cycle</strong> is documented with quarterly frequency.' },
//       { text: '<strong>Responsible owner</strong> is clearly assigned with sign-off trail visible.' },
//       { text: '<strong>Control framework</strong> mapping aligns with the stated obligation.' },
//       { text: '<strong>Date stamps</strong> on all evidence files fall within the valid compliance window.' },
//     ];
//     const bads = [
//       { text: '<strong>Risk assessment</strong> is outdated — last reviewed over 18 months ago.' },
//       { text: '<strong>Staff training records</strong> are missing for 3 of 7 identified personnel.' },
//       { text: '<strong>Exception handling procedure</strong> is referenced but no document is attached.' },
//       { text: '<strong>Board sign-off</strong> is absent on the control attestation form.' },
//       { text: '<strong>Evidence version</strong> does not match the currently effective policy version.' },
//     ];
//     const gaps = [
//       { name:'Documentation completeness', pct: Math.min(score+15,95), note:'Key annexures and supporting docs are missing.' },
//       { name:'Stakeholder sign-off trail',  pct: Math.min(score+8,90),  note:'Some approvals are undated or from expired roles.' },
//       { name:'Training & awareness',        pct: Math.max(score-10,30), note:'Personnel coverage logs are incomplete.' },
//       { name:'Process controls evidence',   pct: Math.max(score-5,40),  note:'Control testing evidence is partially provided.' },
//     ];
//     const steps = [
//       { title:'Upload complete policy document with all annexures', desc:'The current upload is missing Annexure B and the risk register. Attach full policy bundle v2.1+.', impact:'+8%', col:'#dc2626' },
//       { title:'Obtain dated board / senior management sign-off', desc:'Add a signed attestation from an authorised approver within the last 12 months. Undated signatures will not satisfy this control.', impact:'+6%', col:'#d97706' },
//       { title:'Upload training completion records for all in-scope staff', desc:'Provide a training register covering 100% of listed department personnel with completion dates in the current compliance year.', impact:'+5%', col:'#d97706' },
//       { title:'Attach last control-effectiveness test report', desc:'Include the most recent control testing report dated within 6 months (audit confirmation, process walkthrough, or pen test).', impact:'+4%', col:'#16a34a' },
//     ];
//     const sh = arr => arr.sort(()=>Math.random()-.5);
//     return {
//       score, status: score>=80?'Compliant':score>=60?'Partially Compliant':'Non-Compliant',
//       verdict: score>=80?'Strong compliance coverage':score>=60?'Gaps identified — action required':'Critical gaps — immediate attention needed',
//       goods: sh(goods).slice(0, score>=70?3:2),
//       bads:  sh(bads).slice(0, score>=70?2:3),
//       gaps, steps,
//       passed: score>=80?5:score>=60?3:2,
//       critical: score<60?3:score<80?2:1,
//     };
//   }

//   function _buildRows(circ) {
//     const rows = [];
//     (circ.chapters||[]).forEach(ch=>{
//       (ch.clauses||[]).forEach(cl=>{
//         const at = _getAct(cl); if (!at) return;
//         _splitActs(at).forEach(act=>{
//           rows.push({ clauseId:cl.id, chapterTitle:ch.title||ch.id||'', department:cl.department||'—', risk:cl.risk||'—', obligation:_getObl(cl), action:act });
//         });
//       });
//     });
//     return rows;
//   }

//   function _ring(score) {
//     const r=42,c=2*Math.PI*r,off=c-(score/100)*c;
//     const col=score>=80?'#34d399':score>=60?'#fbbf24':'#f87171';
//     return { svg:`<svg class="ep-ring" viewBox="0 0 100 100"><circle class="ep-tr" cx="50" cy="50" r="${r}"/><circle class="ep-fr" cx="50" cy="50" r="${r}" stroke="${col}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 50 50)"/></svg>`, col };
//   }

//   function _trows(rows, q) {
//     const fq=(q||'').toLowerCase().trim();
//     const f = fq?rows.filter(r=>r.clauseId.toLowerCase().includes(fq)||r.action.toLowerCase().includes(fq)||r.obligation.toLowerCase().includes(fq)||r.department.toLowerCase().includes(fq)||r.chapterTitle.toLowerCase().includes(fq)):rows;
//     if (!f.length) return `<tr><td colspan="8"><div class="ep-tbl-empty"><div style="font-size:28px;margin-bottom:8px">📭</div><div>No actions match your filter</div></div></td></tr>`;
//     return f.map(r=>{
//       const h=r.clauseId.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
//       const sc=[44,61,74,82,88,91][h%6];
//       const sc_=sc>=80?'#16a34a':sc>=60?'#d97706':'#dc2626';
//       const bg_=sc>=80?'#dcfce7':sc>=60?'#fef9c3':'#fee2e2';
//       const obl=(r.obligation||'').length>70?r.obligation.slice(0,70)+'…':r.obligation;
//       const act=(r.action||'').length>75?r.action.slice(0,75)+'…':r.action;
//       return `<tr>
//         <td class="ep-td-cid">${r.clauseId}</td>
//         <td class="ep-td-ch">${r.chapterTitle}</td>
//         <td class="ep-td-obl">${obl||'—'}</td>
//         <td class="ep-td-act">${act}</td>
//         <td><span class="ep-tag" style="background:#eff6ff;color:#2563eb;">${r.department}</span></td>
//         <td>${_rtag(r.risk)}</td>
//         <td><span class="ep-sp" style="background:${bg_};color:${sc_}"><span class="ep-dot" style="background:${sc_}"></span>${sc}%</span></td>
//         <td><button class="ep-btn-eval" data-row='${encodeURIComponent(JSON.stringify(r))}'>Evaluate ›</button></td>
//       </tr>`;
//     }).join('');
//   }

//   function _renderAnalysisHTML(row) {
//     const ev=_mockEval(row);
//     const {svg:ringSvg,col:ringCol}=_ring(ev.score);
//     const vc=ev.score>=80?'#34d399':ev.score>=60?'#fbbf24':'#f87171';
//     return `<div class="ep-analysis">
//       <button class="ep-back" id="ep-back">← Back to table</button>

//       <div class="ep-hero">
//         <div class="ep-hero-glow"></div>
//         <div class="ep-hero-left">
//           <div class="ep-ring-wrap">
//             ${ringSvg}
//             <div class="ep-score-center">
//               <div class="ep-score-n">${ev.score}</div>
//               <div class="ep-score-sub">/ 100</div>
//             </div>
//           </div>
//           <div class="ep-hero-info">
//             <div class="ep-verdict">${ev.verdict}</div>
//             <div class="ep-verdict-sub">${ev.status} · Clause ${row.clauseId}</div>
//             <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
//               ${_rtag(row.risk)}
//               <span class="ep-tag" style="background:rgba(255,255,255,.1);color:rgba(255,255,255,.65);">${row.department}</span>
//             </div>
//           </div>
//         </div>
//         <div class="ep-hero-right">
//           <div class="ep-hs"><div class="ep-hs-n" style="color:${vc}">${ev.passed}</div><div class="ep-hs-l">Checks Passed</div></div>
//           <div class="ep-hs"><div class="ep-hs-n" style="color:#f87171">${ev.critical}</div><div class="ep-hs-l">Critical Gaps</div></div>
//           <div class="ep-hs"><div class="ep-hs-n" style="color:#fbbf24">${100-ev.score}%</div><div class="ep-hs-l">Score Gap</div></div>
//           <div class="ep-hs"><div class="ep-hs-n">${ev.steps.length}</div><div class="ep-hs-l">Action Items</div></div>
//         </div>
//       </div>

//       <div class="ep-agrid">
//         <div class="ep-acard">
//           <div class="ep-acard-head">
//             <div class="ep-ach-ico" style="background:#f0fdf4">✅</div>
//             <div><div class="ep-ach-title">What's Working</div><div class="ep-ach-sub">${ev.goods.length} positive findings</div></div>
//           </div>
//           <div class="ep-acard-body">
//             ${ev.goods.map(g=>`<div class="ep-finding"><div class="ep-fbullet" style="background:#16a34a"></div><div class="ep-ftext">${g.text}</div></div>`).join('')}
//           </div>
//         </div>
//         <div class="ep-acard">
//           <div class="ep-acard-head">
//             <div class="ep-ach-ico" style="background:#fef2f2">⚠️</div>
//             <div><div class="ep-ach-title">Issues Identified</div><div class="ep-ach-sub">${ev.bads.length} issues need attention</div></div>
//           </div>
//           <div class="ep-acard-body">
//             ${ev.bads.map(b=>`<div class="ep-finding"><div class="ep-fbullet" style="background:#dc2626"></div><div class="ep-ftext">${b.text}</div></div>`).join('')}
//           </div>
//         </div>
//         <div class="ep-acard">
//           <div class="ep-acard-head">
//             <div class="ep-ach-ico" style="background:#eff6ff">📊</div>
//             <div><div class="ep-ach-title">Coverage Breakdown</div><div class="ep-ach-sub">Score by compliance area</div></div>
//           </div>
//           <div class="ep-acard-body">
//             ${ev.gaps.map(g=>`<div class="ep-gitem">
//               <div class="ep-grow"><span class="ep-gname">${g.name}</span><span class="ep-gpct" style="color:${g.pct>=80?'#16a34a':g.pct>=60?'#d97706':'#dc2626'}">${g.pct}%</span></div>
//               <div class="ep-gtrack"><div class="ep-gfill" style="width:${g.pct}%;background:${g.pct>=80?'#16a34a':g.pct>=60?'#fbbf24':'#f87171'}"></div></div>
//               <div class="ep-gnote">${g.note}</div>
//             </div>`).join('')}
//           </div>
//         </div>
//         <div class="ep-acard">
//           <div class="ep-acard-head">
//             <div class="ep-ach-ico" style="background:#f5f3ff">📋</div>
//             <div><div class="ep-ach-title">Clause & Obligation</div><div class="ep-ach-sub">What this clause requires</div></div>
//           </div>
//           <div class="ep-acard-body">
//             <div style="margin-bottom:11px"><div style="font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--faint);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">Clause ID</div><div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--blue);font-weight:600">${row.clauseId}</div></div>
//             <div style="margin-bottom:11px"><div style="font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--faint);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">Action Required</div><div style="font-size:13px;color:var(--ink2);font-weight:600;line-height:1.5">${row.action}</div></div>
//             <div><div style="font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--faint);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">Full Obligation</div><div class="ep-obl-box">${row.obligation}</div></div>
//           </div>
//         </div>
//       </div>

//       <div class="ep-path">
//         <div class="ep-path-head">
//           <div class="ep-path-head-ico">🎯</div>
//           <div><div class="ep-ph-title">Path to 100% — How to close the gaps</div><div class="ep-ph-sub">Complete these actions in order to achieve full compliance for this clause</div></div>
//         </div>
//         <div class="ep-steps">
//           ${ev.steps.map((s,i)=>`<div class="ep-step">
//             <div class="ep-step-num">${i+1}</div>
//             <div class="ep-step-body"><div class="ep-step-title">${s.title}</div><div class="ep-step-desc">${s.desc}</div></div>
//             <div class="ep-step-imp" style="background:${s.col}18;color:${s.col};border:1px solid ${s.col}30">${s.impact}</div>
//           </div>`).join('')}
//         </div>
//       </div>

//       <div class="ep-upanel">
//         <div class="ep-up-head">
//           <span style="font-size:18px">📤</span>
//           <div><div class="ep-up-title">Submit Evidence</div><div class="ep-up-sub">Upload documents to update the compliance score for this clause</div></div>
//         </div>
//         <div class="ep-up-body">
//           <div>
//             <label class="ep-flbl">Document URL or Path</label>
//             <input class="ep-fc" id="ep-url" placeholder="https:// or /path/to/file…">
//             <label class="ep-flbl">Upload File</label>
//             <div class="ep-uz" id="ep-uz"><div class="ep-uz-ico">📄</div><div class="ep-uz-lbl">Click to upload or drag & drop</div><div class="ep-uz-sub">PDF · DOCX · XLSX · Max 10 MB</div><input type="file" id="ep-fi" style="display:none" accept=".pdf,.docx,.xlsx"></div>
//             <label class="ep-flbl">Notes</label>
//             <textarea class="ep-fc" id="ep-notes" rows="3" placeholder="Add context, references, or caveats…" style="resize:vertical"></textarea>
//           </div>
//           <div>
//             <label class="ep-flbl">Compliance Status</label>
//             <select class="ep-fc" id="ep-st">
//               <option value="">Select status…</option>
//               <option value="complete">✅  Complete</option>
//               <option value="partial">🟡  Partially Complete</option>
//               <option value="pending">🔴  Pending</option>
//               <option value="na">⚪  Not Applicable</option>
//             </select>
//             <label class="ep-flbl">Assigned To</label>
//             <input class="ep-fc" id="ep-assign" placeholder="Name or team…">
//             <label class="ep-flbl">Target Completion</label>
//             <input class="ep-fc" type="date" id="ep-date">
//             <div class="ep-btnrow" style="margin-top:14px">
//               <button class="ep-btn ep-btn-blue" id="ep-submit">
//                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
//                 Submit Evidence
//               </button>
//               <button class="ep-btn ep-btn-ghost ep-btn-sm" id="ep-dl">⬇ Download Report</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>`;
//   }

//   function _renderContent() {
//     const content = _container.querySelector('#ep-content');
//     if (!content) return;

//     if (_view === 'analysis' && _analysisRow) {
//       content.innerHTML = _renderAnalysisHTML(_analysisRow);
//       _bindAnalysis(content);
//       return;
//     }

//     if (!_selectedCircular) {
//       content.innerHTML = `<div class="ep-empty ep-fade"><div class="ep-ei-box">📋</div><div class="ep-et">Select a Circular</div><div class="ep-es">Search and pick a circular from the left sidebar to view its clauses, obligations, and actions.</div></div>`;
//       return;
//     }

//     const circ=_selectedCircular, chs=circ.chapters||[];
//     const clCount=chs.reduce((s,ch)=>s+(ch.clauses?.length||0),0);
//     content.innerHTML = `<div class="ep-fade">
//       <div class="ep-banner">
//         <span class="ep-ban-id">${circ.id}</span>
//         <span class="ep-ban-title">${circ.title||'Untitled Circular'}</span>
//         ${circ.regulator?`<span class="ep-ban-reg">🏛 ${circ.regulator}</span>`:''}
//         <div class="ep-ban-tags">${_stag(circ.status)}${_rtag(circ.risk)}</div>
//       </div>
//       <div class="ep-stats">
//         <div class="ep-stat"><div class="ep-stat-ico">📂</div><div><div class="ep-stat-n">${chs.length}</div><div class="ep-stat-l">Chapters</div></div></div>
//         <div class="ep-stat"><div class="ep-stat-ico">📄</div><div><div class="ep-stat-n">${clCount}</div><div class="ep-stat-l">Clauses</div></div></div>
//         <div class="ep-stat"><div class="ep-stat-ico">⚡</div><div><div class="ep-stat-n" style="color:var(--blue)">${_allRows.length}</div><div class="ep-stat-l">Actions</div></div></div>
//         ${circ.effectiveDate?`<div class="ep-stat"><div class="ep-stat-ico">📅</div><div><div class="ep-stat-n" style="font-size:14px">${circ.effectiveDate}</div><div class="ep-stat-l">Effective Date</div></div></div>`:''}
//       </div>
//       <div class="ep-tbl-bar">
//         <div class="ep-tfw"><i class="ep-tfi">⌕</i><input class="ep-tf" id="ep-tf" placeholder="Filter by clause, action, department, obligation…"></div>
//         <span class="ep-tc" id="ep-tc">${_allRows.length} actions</span>
//       </div>
//       <div class="ep-tbl-wrap">
//         <table class="ep-table" id="ep-tbl">
//           <thead><tr>
//             <th data-c="clauseId">Clause <span class="ep-si">↕</span></th>
//             <th data-c="chapterTitle">Chapter <span class="ep-si">↕</span></th>
//             <th data-c="obligation">Obligation <span class="ep-si">↕</span></th>
//             <th data-c="action">Action <span class="ep-si">↕</span></th>
//             <th data-c="department">Dept <span class="ep-si">↕</span></th>
//             <th data-c="risk">Risk <span class="ep-si">↕</span></th>
//             <th>Score</th>
//             <th></th>
//           </tr></thead>
//           <tbody id="ep-tb">${_trows(_allRows,'')}</tbody>
//         </table>
//       </div>
//     </div>`;

//     const tf=content.querySelector('#ep-tf'),tc=content.querySelector('#ep-tc'),tb=content.querySelector('#ep-tb');
//     if(tf&&tb){
//       let d;
//       tf.addEventListener('input',()=>{
//         clearTimeout(d);d=setTimeout(()=>{
//           tb.innerHTML=_trows(_allRows,tf.value);
//           const vis=_allRows.filter(r=>{const q=tf.value.toLowerCase();return !q||r.clauseId.toLowerCase().includes(q)||r.action.toLowerCase().includes(q)||r.obligation.toLowerCase().includes(q)||r.department.toLowerCase().includes(q)||r.chapterTitle.toLowerCase().includes(q);}).length;
//           if(tc)tc.textContent=`${vis} of ${_allRows.length} actions`;
//           _bindEval(tb);
//         },150);
//       });
//     }
//     content.querySelectorAll('#ep-tbl th[data-c]').forEach(th=>{
//       th.addEventListener('click',()=>{
//         const col=th.dataset.c;
//         if(_sortCol===col)_sortDir*=-1;else{_sortCol=col;_sortDir=1;}
//         content.querySelectorAll('#ep-tbl th').forEach(t=>t.classList.remove('ep-s'));
//         th.classList.add('ep-s');th.querySelector('.ep-si').textContent=_sortDir===1?'↑':'↓';
//         const sorted=[..._allRows].sort((a,b)=>{const av=(a[col]||'').toLowerCase(),bv=(b[col]||'').toLowerCase();return av<bv?-_sortDir:av>bv?_sortDir:0;});
//         if(tb){tb.innerHTML=_trows(sorted,tf?.value||'');_bindEval(tb);}
//       });
//     });
//     if(tb)_bindEval(tb);
//   }

//   function _bindEval(container) {
//     (container||_container).querySelectorAll('[data-row]').forEach(btn=>{
//       btn.addEventListener('click',()=>{
//         try {
//           _analysisRow=JSON.parse(decodeURIComponent(btn.dataset.row));
//           _view='analysis';
//           _updateTopbar();
//           _renderContent();
//           _container.querySelector('#ep-content').scrollTop=0;
//         } catch(e){console.error(e);}
//       });
//     });
//   }

//   function _bindAnalysis(content) {
//     content.querySelector('#ep-back')?.addEventListener('click',()=>{
//       _view='table';_analysisRow=null;_updateTopbar();_renderContent();
//     });
//     const uz=content.querySelector('#ep-uz'),fi=content.querySelector('#ep-fi');
//     if(uz&&fi){
//       uz.addEventListener('click',()=>fi.click());
//       uz.addEventListener('dragover',e=>{e.preventDefault();uz.style.borderColor='var(--blue)';});
//       uz.addEventListener('dragleave',()=>{uz.style.borderColor='';});
//       uz.addEventListener('drop',e=>{e.preventDefault();uz.style.borderColor='';const f=e.dataTransfer.files[0];if(f)_uf(f,uz);});
//       fi.addEventListener('change',()=>{if(fi.files.length)_uf(fi.files[0],uz);});
//     }
//     content.querySelector('#ep-submit')?.addEventListener('click',()=>{
//       const url=content.querySelector('#ep-url')?.value,st=content.querySelector('#ep-st')?.value,hf=content.querySelector('#ep-fi')?.files?.length;
//       if(!url&&!hf){_toast('Please provide a document or upload a file','warning');return;}
//       if(!st){_toast('Please select a compliance status','warning');return;}
//       _toast('✓ Evidence submitted successfully','success');
//       setTimeout(()=>{_view='table';_analysisRow=null;_updateTopbar();_renderContent();},600);
//     });
//     content.querySelector('#ep-dl')?.addEventListener('click',()=>{
//       _toast('📥 Generating report…','info');setTimeout(()=>_toast('✓ Report ready','success'),1400);
//     });
//   }

//   function _uf(f,uz){uz.classList.add('up');uz.querySelector('.ep-uz-ico').textContent='✅';uz.querySelector('.ep-uz-lbl').textContent=`✓ ${f.name}`;uz.querySelector('.ep-uz-sub').textContent=`${(f.size/1024).toFixed(1)} KB`;}

//   function _updateTopbar() {
//     const ttl=_container.querySelector('#ep-tb-title'),cr=_container.querySelector('#ep-tb-crumb');
//     if(_view==='analysis'&&_analysisRow){
//       if(ttl)ttl.textContent=`Clause ${_analysisRow.clauseId} — Evidence Analysis`;
//       if(cr)cr.innerHTML=`<span data-nav="table" style="cursor:pointer">Evidence Table</span><span class="sep"> › </span><span>${_analysisRow.clauseId}</span>`;
//     } else {
//       if(ttl)ttl.textContent=_selectedCircular?(_selectedCircular.title||_selectedCircular.id):'Select a Circular';
//       if(cr)cr.innerHTML=_selectedCircular?`<span>Circulars</span><span class="sep"> › </span><span>${_selectedCircular.id}</span>`:'<span>Circulars</span>';
//     }
//     cr?.querySelectorAll('[data-nav="table"]').forEach(el=>el.addEventListener('click',()=>{_view='table';_analysisRow=null;_updateTopbar();_renderContent();}));
//   }

//   function init(containerId, cmsData) {
//     _injectCSS();
//     _data=cmsData;
//     _container=typeof containerId==='string'?document.getElementById(containerId):containerId;
//     if(!_container){console.error('EvidencePanel: container not found');return;}

//     _container.innerHTML=`<div class="ep-root"><div class="ep-layout">
//       <div class="ep-sidebar" id="ep-sb"></div>
//       <div class="ep-main">
//         <div class="ep-topbar">
//           <div><div class="ep-tb-crumb" id="ep-tb-crumb"><span>Circulars</span></div><div class="ep-tb-title" id="ep-tb-title">Select a Circular</div></div>
//           <div><span class="ep-ai-badge">AI-Engine</span></div>
//         </div>
//         <div class="ep-content" id="ep-content"></div>
//       </div>
//     </div></div>`;

//     const sb=_container.querySelector('#ep-sb');
//     const circs=_data.circulars||[];
//     sb.innerHTML=`
//       <div class="ep-sb-top"><div class="ep-sb-logo"><div class="ep-sb-icon">⚖️</div><div><div class="ep-sb-brand">ComplianceOS</div><div class="ep-sb-tag">Evidence Engine</div></div></div></div>
//       <div class="ep-sb-lbl">Circulars</div>
//       <div class="ep-sb-search"><div class="ep-sb-sw"><i class="ep-sb-si">⌕</i><input class="ep-sb-inp" id="ep-sb-s" placeholder="Search circulars…" autocomplete="off"></div></div>
//       <div class="ep-sb-list" id="ep-sb-list">
//         ${circs.map(c=>`<div class="ep-sb-item" data-cid="${c.id}"><span class="ep-sb-cid">${c.id}</span><span class="ep-sb-cname">${c.title||'Untitled'}</span></div>`).join('')}
//       </div>
//       <div class="ep-sb-foot"><div class="ep-sb-foot-t">AI-Engine v2 · ${circs.length} circulars</div></div>`;

//     function bindItems(list){
//       list.querySelectorAll('[data-cid]').forEach(el=>{
//         el.addEventListener('click',()=>{
//           _selectedCircular=(_data.circulars||[]).find(c=>c.id===el.dataset.cid);
//           _allRows=_selectedCircular?_buildRows(_selectedCircular):[];
//           _sortCol=null;_view='table';_analysisRow=null;
//           sb.querySelectorAll('[data-cid]').forEach(e=>e.classList.toggle('active',e.dataset.cid===el.dataset.cid));
//           _updateTopbar();_renderContent();
//         });
//       });
//     }
//     bindItems(sb.querySelector('#ep-sb-list'));

//     const sbS=sb.querySelector('#ep-sb-s'),sbL=sb.querySelector('#ep-sb-list');
//     if(sbS&&sbL){
//       let d;
//       sbS.addEventListener('input',()=>{
//         clearTimeout(d);d=setTimeout(()=>{
//           const q=sbS.value.toLowerCase().trim();
//           const f=q?circs.filter(c=>c.id.toLowerCase().includes(q)||(c.title||'').toLowerCase().includes(q)):circs;
//           sbL.innerHTML=f.length?f.map(c=>`<div class="ep-sb-item${_selectedCircular?.id===c.id?' active':''}" data-cid="${c.id}"><span class="ep-sb-cid">${c.id}</span><span class="ep-sb-cname">${c.title||'Untitled'}</span></div>`).join(''):`<div class="ep-sb-empty">No results</div>`;
//           bindItems(sbL);
//         },150);
//       });
//     }

//     _renderContent();
//   }

//   function navigateTo(circularId) {
//     _selectedCircular=(_data?.circulars||[]).find(c=>c.id===circularId);
//     if(!_selectedCircular)return;
//     _allRows=_buildRows(_selectedCircular);_sortCol=null;_view='table';_analysisRow=null;
//     _container.querySelector('#ep-sb')?.querySelectorAll('[data-cid]').forEach(e=>e.classList.toggle('active',e.dataset.cid===circularId));
//     _updateTopbar();_renderContent();
//   }

//   return { init, navigateTo };
// })();

/**
 * EvidencePanel — White & Grey Theme
 * Usage: EvidencePanel.init('container-id', CMS_DATA)
 * Or:    EvidencePanel.init('container-id')  — uses built-in demo data
 *
 * CMS_DATA shape:
 * {
 *   circulars: [{
 *     id, title, regulator, status, risk, effectiveDate,
 *     chapters: [{ num, title, clauses: [{ id, text, department, risk, obligation, actionable }] }]
 *   }]
 * }
 */

const EvidencePanel = (() => {

  /* ── state ── */
  let _container = null;
  let _data = null;
  let _selectedCircular = null;
  let _allRows = [];
  let _uploadedFiles = {};
  let _scoreCache = {};

  /* ── built-in demo data ── */
  const DEMO_DATA = {
    circulars: [
      {
        id: 'CIRC-001', title: 'KYC & AML Compliance Framework',
        regulator: 'RBI', status: 'Active', risk: 'High', effectiveDate: '2024-04-01',
        chapters: [
          { num: 1, title: 'Customer Identification', clauses: [
            { id: '1.1', text: 'CDD requirements', department: 'Compliance', risk: 'High',
              obligation: 'Maintain updated KYC records for all customers with periodic refresh cycles',
              actionable: 'Establish CDD policy; Train frontline staff; Implement refresh workflow' },
            { id: '1.2', text: 'Beneficial ownership', department: 'Legal', risk: 'High',
              obligation: 'Identify and verify beneficial owners for all legal entities',
              actionable: 'Map ownership structures; Document BO records; File with registry' },
          ]},
          { num: 2, title: 'Transaction Monitoring', clauses: [
            { id: '2.1', text: 'Suspicious activity', department: 'Risk', risk: 'High',
              obligation: 'Monitor and report suspicious transactions within 7 days',
              actionable: 'Configure TMS rules; Assign SAR officer; File STR reports' },
            { id: '2.2', text: 'Threshold limits', department: 'Operations', risk: 'Medium',
              obligation: 'Apply enhanced scrutiny to transactions exceeding prescribed limits',
              actionable: 'Set threshold alerts; Review transaction logs; Escalate breaches' },
          ]},
        ],
      },
      {
        id: 'CIRC-002', title: 'Data Privacy & Protection Policy',
        regulator: 'SEBI', status: 'Active', risk: 'Medium', effectiveDate: '2024-01-15',
        chapters: [
          { num: 1, title: 'Data Classification', clauses: [
            { id: '1.1', text: 'Personal data', department: 'IT', risk: 'Medium',
              obligation: 'Classify all personal data and apply appropriate protection controls',
              actionable: 'Create data inventory; Apply classification labels; Restrict access' },
            { id: '1.2', text: 'Sensitive categories', department: 'HR', risk: 'High',
              obligation: 'Apply enhanced controls to sensitive personal data categories',
              actionable: 'Identify sensitive data; Implement encryption; Limit processing' },
          ]},
          { num: 2, title: 'Data Retention', clauses: [
            { id: '2.1', text: 'Retention periods', department: 'Legal', risk: 'Low',
              obligation: 'Retain data only for the period necessary for its stated purpose',
              actionable: 'Define retention schedules; Automate deletion; Document exceptions' },
          ]},
        ],
      },
      {
        id: 'CIRC-003', title: 'Capital Adequacy Requirements',
        regulator: 'RBI', status: 'Inactive', risk: 'High', effectiveDate: '2023-10-01',
        chapters: [
          { num: 1, title: 'Minimum Capital Ratios', clauses: [
            { id: '1.1', text: 'CET1 ratio', department: 'Finance', risk: 'High',
              obligation: 'Maintain CET1 capital ratio above minimum regulatory threshold at all times',
              actionable: 'Monitor CET1 daily; Report breaches immediately; Prepare capital plan' },
            { id: '1.2', text: 'Leverage ratio', department: 'Finance', risk: 'Medium',
              obligation: 'Maintain leverage ratio in accordance with Basel III requirements',
              actionable: 'Calculate leverage ratio monthly; Disclose quarterly; File with regulator' },
          ]},
        ],
      },
      {
        id: 'CIRC-004', title: 'Cybersecurity Framework',
        regulator: 'CERT-In', status: 'Active', risk: 'High', effectiveDate: '2024-06-01',
        chapters: [
          { num: 1, title: 'Access Controls', clauses: [
            { id: '1.1', text: 'Privileged access', department: 'IT', risk: 'High',
              obligation: 'Implement controls for privileged access management',
              actionable: 'Deploy PAM solution; Audit access quarterly; Remove stale accounts' },
          ]},
          { num: 2, title: 'Incident Response', clauses: [
            { id: '2.1', text: 'Reporting obligations', department: 'IT', risk: 'High',
              obligation: 'Report cyber incidents to CERT-In within 6 hours of detection',
              actionable: 'Establish IR team; Create reporting templates; Conduct drills' },
          ]},
        ],
      },
    ],
  };

  /* ── CSS ── */
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.ep * { box-sizing: border-box; margin: 0; padding: 0; }
.ep {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f1f3f6;
  color: #111827;
  min-height: 100vh;
  padding: 28px 24px;

  --ink:       #111827;
  --ink2:      #374151;
  --bg:        #f1f3f6;
  --card:      #ffffff;
  --card2:     #f7f8fa;
  --border:    #e5e7eb;
  --border2:   #edf0f5;
  --muted:     #6b7280;
  --faint:     #9ca3af;
  --blue:      #2563eb;
  --blue-s:    #eff6ff;
  --blue-m:    #bfdbfe;
  --green:     #16a34a;
  --green-s:   #f0fdf4;
  --amber:     #d97706;
  --amber-s:   #fffbeb;
  --red:       #dc2626;
  --red-s:     #fef2f2;
  --r:         10px;
  --sh:        0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --sh2:       0 4px 16px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04);
}

.ai-tab-bar{ display:none !important; }

.ep-shell { max-width: 1100px; margin: 0 auto; }

.ep-page-title   { font-size: 20px; font-weight: 700; color: var(--ink); letter-spacing: -.02em; margin-bottom: 3px; }
.ep-page-sub     { font-size: 13px; color: var(--muted); margin-bottom: 22px; }

/* ── search card ── */
.ep-search-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: var(--sh);
}
.ep-sw { position: relative; }
.ep-si { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--faint); font-size: 15px; pointer-events: none; font-style: normal; }
.ep-sinput {
  width: 100%; height: 40px;
  padding: 0 14px 0 38px;
  border: 1.5px solid var(--border);
  border-radius: var(--r);
  background: var(--card2);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; color: var(--ink);
  outline: none; transition: border-color .18s, box-shadow .18s;
}
.ep-sinput:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,.08); background: #fff; }
.ep-sinput::placeholder { color: var(--faint); }

.ep-clist { margin-top: 12px; display: flex; flex-direction: column; gap: 4px; }
.ep-crow {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px;
  border: 1.5px solid var(--border2);
  border-radius: var(--r);
  cursor: pointer; background: var(--card2);
  transition: border-color .15s, background .15s;
}
.ep-crow:hover  { border-color: var(--border); background: var(--card); }
.ep-crow.active { border-color: var(--blue-m); background: var(--blue-s); }
.ep-cid  { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; color: var(--blue); background: var(--blue-s); border: 1px solid var(--blue-m); padding: 2px 7px; border-radius: 5px; flex-shrink: 0; }
.ep-cname { font-size: 13px; font-weight: 500; color: var(--ink2); flex: 1; }
.ep-creg  { font-size: 11px; color: var(--faint); flex-shrink: 0; }
.ep-no-results { font-size: 13px; color: var(--muted); text-align: center; padding: 14px 0; }
.ep-search-hint { font-size: 12px; color: var(--faint); text-align: center; padding: 10px 0; }

/* ── tags ── */
.ep-tag { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
.ep-tag-active   { background: #dcfce7; color: #15803d; }
.ep-tag-inactive { background: #fef9c3; color: #92400e; }
.ep-tag-high     { background: #fee2e2; color: #991b1b; }
.ep-tag-medium   { background: #ffedd5; color: #92400e; }
.ep-tag-low      { background: #dcfce7; color: #15803d; }

/* ── banner ── */
.ep-banner {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  box-shadow: var(--sh);
}
.ep-ban-id    { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--blue); background: var(--blue-s); border: 1px solid var(--blue-m); padding: 3px 9px; border-radius: 5px; flex-shrink: 0; }
.ep-ban-title { font-size: 14px; font-weight: 700; color: var(--ink); flex: 1; }
.ep-ban-reg   { font-size: 12px; color: var(--muted); flex-shrink: 0; }
.ep-ban-tags  { display: flex; gap: 7px; flex-shrink: 0; }
.ep-ban-change { font-size: 12px; color: var(--blue); cursor: pointer; border: 1.5px solid var(--blue-m); border-radius: 7px; padding: 4px 11px; background: var(--blue-s); transition: background .15s; flex-shrink: 0; }
.ep-ban-change:hover { background: var(--blue-m); }

/* ── stats ── */
.ep-stats { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.ep-stat  { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 12px 16px; flex: 1; min-width: 90px; box-shadow: var(--sh); }
.ep-stat-n { font-size: 20px; font-weight: 700; color: var(--ink); line-height: 1; margin-bottom: 2px; letter-spacing: -.02em; }
.ep-stat-l { font-size: 11px; color: var(--muted); font-weight: 500; }

/* ── table ── */
.ep-tbar { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.ep-tfw  { position: relative; flex: 1; min-width: 180px; }
.ep-tfi  { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--faint); font-size: 13px; pointer-events: none; font-style: normal; }
.ep-tf   { width: 100%; height: 36px; padding: 0 12px 0 32px; border: 1.5px solid var(--border); border-radius: 8px; background: var(--card); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; color: var(--ink); outline: none; box-shadow: var(--sh); transition: border-color .18s; }
.ep-tf:focus { border-color: var(--blue); }
.ep-tf::placeholder { color: var(--faint); }
.ep-tc { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--faint); white-space: nowrap; }

.ep-tcard { background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: var(--sh2); }
.ep-tscroll { overflow-x: auto; }

.ep-table { width: 100%; border-collapse: collapse; }
.ep-table thead tr { background: #1a1f2e; }
.ep-table th {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; color: rgba(255,255,255,.5);
  letter-spacing: .12em; text-transform: uppercase;
  padding: 12px 14px; text-align: left; font-weight: 400;
  cursor: pointer; user-select: none; white-space: nowrap;
  transition: color .15s;
}
.ep-table th:hover  { color: rgba(255,255,255,.85); }
.ep-table th.ep-s   { color: #fff; }
.ep-table th:last-child { cursor: default; }
.ep-sort-i { margin-left: 3px; opacity: .3; }
.ep-table th.ep-s .ep-sort-i { opacity: 1; }

.ep-table tbody tr { border-bottom: 1px solid var(--border2); transition: background .1s; }
.ep-table tbody tr:last-child { border-bottom: none; }
.ep-table tbody tr:hover { background: #f8f9fc; }
.ep-table td { padding: 12px 14px; font-size: 13px; color: var(--muted); vertical-align: middle; }

.ep-td-clause { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--blue); font-weight: 500; white-space: nowrap; }
.ep-td-ch     { font-size: 11px; color: var(--faint); max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ep-td-obl    { font-size: 12px; line-height: 1.5; max-width: 170px; color: var(--muted); }
.ep-td-act    { font-size: 13px; font-weight: 600; color: var(--ink); max-width: 190px; line-height: 1.45; }

.ep-sp  { display: inline-flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
.ep-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

/* upload cell */
.ep-ucell { display: flex; align-items: center; gap: 6px; }
.ep-ulabel {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 500;
  color: var(--muted); border: 1.5px solid var(--border);
  border-radius: 7px; padding: 4px 9px;
  cursor: pointer; white-space: nowrap; background: var(--card2);
  transition: border-color .15s, background .15s;
}
.ep-ulabel:hover  { background: var(--card); }
.ep-ulabel.has    { border-color: #86efac; background: var(--green-s); color: var(--green); }

.ep-btn-eval {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700;
  color: #fff; background: #1a1f2e;
  border: none; border-radius: 8px;
  padding: 7px 13px; cursor: pointer;
  white-space: nowrap; transition: all .15s;
}
.ep-btn-eval:hover   { background: var(--blue); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,.25); }
.ep-btn-eval:active  { transform: scale(.97); }
.ep-btn-eval.ready   { background: var(--blue); }

.ep-tbl-empty { text-align: center; padding: 40px; font-size: 13px; color: var(--faint); }

/* ═══════════════════════════════════════════════
   ANALYSIS SCREEN — full redesign
   ═══════════════════════════════════════════════ */
#ep-analysis { display: none; }

.ep-back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 600; color: var(--muted);
  cursor: pointer; background: none; border: none;
  padding: 0; margin-bottom: 18px; transition: color .15s;
}
.ep-back:hover { color: var(--ink); }

/* ── compact clause header bar ── */
.ep-an-header {
  background: #1a1f2e;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
}
.ep-an-hid    { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,.45); background: rgba(255,255,255,.08); padding: 3px 10px; border-radius: 5px; flex-shrink: 0; }
.ep-an-htitle { font-size: 14px; font-weight: 700; color: #fff; flex: 1; letter-spacing: -.01em; }
.ep-an-hdept  { font-size: 11px; color: rgba(255,255,255,.4); flex-shrink: 0; }
.ep-an-htags  { display: flex; gap: 6px; flex-shrink: 0; }

/* ── two-column layout ── */
.ep-an-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: start;
}
@media (max-width: 780px) {
  .ep-an-cols { grid-template-columns: 1fr; }
}

/* shared panel style */
.ep-an-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--sh2);
}
.ep-an-ph {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border2);
  background: var(--card2);
  display: flex; align-items: center; gap: 10px;
}
.ep-an-pico {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
}
.ep-an-ptitle { font-size: 13px; font-weight: 700; color: var(--ink); }
.ep-an-psub   { font-size: 11px; color: var(--muted); margin-top: 1px; }
.ep-an-pbody  { padding: 18px; }

/* ── LEFT: evidence upload ── */
.ep-ev-obl {
  background: var(--blue-s);
  border: 1px solid var(--blue-m);
  border-radius: 8px;
  padding: 11px 14px;
  margin-bottom: 16px;
}
.ep-ev-obl-lbl { font-size: 10px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; }
.ep-ev-obl-txt { font-size: 12px; color: var(--ink2); line-height: 1.6; }

.ep-ev-action {
  background: var(--card2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 11px 14px;
  margin-bottom: 16px;
}
.ep-ev-act-lbl { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; }
.ep-ev-act-txt { font-size: 13px; font-weight: 600; color: var(--ink); line-height: 1.5; }

.ep-flbl { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 5px; display: block; }
.ep-fc {
  width: 100%; padding: 9px 12px; border: 1.5px solid var(--border);
  border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; color: var(--ink); background: var(--card2);
  outline: none; transition: border-color .18s, box-shadow .18s; margin-bottom: 12px;
}
.ep-fc:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,.08); background: #fff; }
.ep-fc::placeholder { color: var(--faint); }
.ep-fc option { background: #fff; }

/* drop zone */
.ep-dropzone {
  border: 2px dashed var(--border);
  border-radius: 10px;
  padding: 22px 16px;
  text-align: center;
  cursor: pointer;
  transition: all .18s;
  margin-bottom: 12px;
  background: var(--card2);
  position: relative;
}
.ep-dropzone:hover { border-color: var(--blue); background: var(--blue-s); }
.ep-dropzone.dz-over { border-color: var(--blue); background: var(--blue-s); transform: scale(1.01); }
.ep-dropzone.dz-done { border-color: #86efac; border-style: solid; background: var(--green-s); }
.ep-dz-ico  { font-size: 26px; margin-bottom: 7px; display: block; }
.ep-dz-lbl  { font-size: 13px; font-weight: 600; color: var(--muted); }
.ep-dz-sub  { font-size: 11px; color: var(--faint); margin-top: 3px; }
.ep-dz-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: #dcfce7; color: #15803d;
  font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 20px;
  margin-top: 6px;
}

/* uploaded files list */
.ep-flist { margin-bottom: 12px; display: flex; flex-direction: column; gap: 5px; }
.ep-fitem {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  background: var(--green-s);
  border: 1px solid #86efac;
  border-radius: 8px;
}
.ep-fitem-ico { font-size: 14px; flex-shrink: 0; }
.ep-fitem-name { font-size: 12px; font-weight: 600; color: var(--green); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ep-fitem-size { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); flex-shrink: 0; }
.ep-fitem-rm   { font-size: 14px; color: var(--faint); cursor: pointer; flex-shrink: 0; line-height: 1; background: none; border: none; padding: 0; }
.ep-fitem-rm:hover { color: var(--red); }

.ep-url-row { display: flex; gap: 7px; margin-bottom: 12px; }
.ep-url-row .ep-fc { margin-bottom: 0; flex: 1; }
.ep-url-add {
  height: 38px; padding: 0 14px;
  background: var(--card2); border: 1.5px solid var(--border);
  border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 600; color: var(--muted);
  cursor: pointer; white-space: nowrap; transition: all .15s; flex-shrink: 0;
}
.ep-url-add:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-s); }

.ep-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.ep-btnrow { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
.ep-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 9px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700;
  cursor: pointer; border: none; transition: all .15s;
}
.ep-btn:active { transform: scale(.97); }
.ep-btn-blue  { background: var(--blue); color: #fff; }
.ep-btn-blue:hover { background: #1d4ed8; box-shadow: 0 4px 14px rgba(37,99,235,.28); }
.ep-btn-ghost { background: var(--card2); color: var(--muted); border: 1.5px solid var(--border); }
.ep-btn-ghost:hover { background: var(--border); color: var(--ink2); }
.ep-btn-sm { padding: 7px 14px; font-size: 12px; }

/* ── RIGHT: score & analysis ── */

/* score hero */
.ep-score-hero {
  background: #1a1f2e;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 20px;
  position: relative; overflow: hidden;
}
.ep-score-hero::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 80% 50%, rgba(37,99,235,.18) 0%, transparent 60%);
  pointer-events: none;
}
.ep-rw { position: relative; flex-shrink: 0; z-index: 1; }
.ep-ring { width: 80px; height: 80px; }
.ep-ring circle { fill: none; stroke-width: 8; }
.ep-rtrack { stroke: rgba(255,255,255,.1); }
.ep-rfill  { stroke-linecap: round; transition: stroke-dashoffset .85s cubic-bezier(.4,0,.2,1); }
.ep-rcenter { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ep-rscore { font-size: 21px; font-weight: 700; color: #fff; line-height: 1; }
.ep-rof    { font-size: 9px; color: rgba(255,255,255,.4); }
.ep-sh-info { flex: 1; position: relative; z-index: 1; }
.ep-sh-verdict { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.ep-sh-status  { font-size: 12px; margin-bottom: 12px; }
.ep-sh-nums { display: flex; gap: 14px; }
.ep-sh-num-item .ep-sh-n { font-size: 16px; font-weight: 700; color: #fff; line-height: 1; }
.ep-sh-num-item .ep-sh-l { font-size: 10px; color: rgba(255,255,255,.4); margin-top: 2px; }

/* score reasons */
.ep-reasons { margin-bottom: 14px; }
.ep-reason-item {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border2);
}
.ep-reason-item:last-child { border-bottom: none; }
.ep-ri-badge {
  width: 20px; height: 20px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 1px;
}
.ep-ri-body { flex: 1; }
.ep-ri-title { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
.ep-ri-desc  { font-size: 11px; color: var(--muted); line-height: 1.55; }
.ep-ri-delta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
  flex-shrink: 0; align-self: flex-start;
  margin-top: 2px;
}

/* coverage bars */
.ep-cov-item { padding: 10px 14px; border-bottom: 1px solid var(--border2); }
.ep-cov-item:last-child { border-bottom: none; }
.ep-cov-row  { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.ep-cov-name { font-size: 12px; font-weight: 600; color: var(--ink); }
.ep-cov-pct  { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; }
.ep-cov-trk  { height: 5px; background: var(--border2); border-radius: 3px; overflow: hidden; margin-bottom: 3px; }
.ep-cov-fill { height: 100%; border-radius: 3px; transition: width .8s cubic-bezier(.4,0,.2,1); }
.ep-cov-note { font-size: 10px; color: var(--faint); }

/* improvements */
.ep-impr-item {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 12px 14px; border-bottom: 1px solid var(--border2);
}
.ep-impr-item:last-child { border-bottom: none; }
.ep-impr-num {
  width: 22px; height: 22px; border-radius: 50%;
  background: #1a1f2e; color: #fff;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.ep-impr-body { flex: 1; }
.ep-impr-title { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
.ep-impr-desc  { font-size: 11px; color: var(--muted); line-height: 1.55; }
.ep-impr-gain {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; font-weight: 700;
  padding: 2px 8px; border-radius: 20px;
  flex-shrink: 0; align-self: flex-start; margin-top: 2px;
  white-space: nowrap;
}

/* misc */
.ep-fade { animation: ep-fi .22s ease; }
@keyframes ep-fi { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:none; } }

.ep-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 99999;
  padding: 12px 18px; border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; color: #fff;
  box-shadow: 0 8px 28px rgba(0,0,0,.16); animation: ep-ti .2s ease;
}
@keyframes ep-ti { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
`;

  /* ── helpers ── */
  function _injectCSS() {
    if (document.getElementById('ep-css-v4')) return;
    const s = document.createElement('style');
    s.id = 'ep-css-v4';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function _toast(msg, type = 'success') {
    const cols = { success: '#16a34a', warning: '#d97706', danger: '#dc2626', info: '#2563eb' };
    const t = document.createElement('div');
    t.className = 'ep-toast';
    t.textContent = msg;
    t.style.background = cols[type] || cols.success;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  function _rtag(r) {
    const v = (r || '').toLowerCase();
    const cls = v === 'high' ? 'ep-tag-high' : v === 'medium' ? 'ep-tag-medium' : 'ep-tag-low';
    return `<span class="ep-tag ${cls}">${r || '—'}</span>`;
  }
  function _stag(s) {
    return `<span class="ep-tag ${(s || '').toLowerCase() === 'active' ? 'ep-tag-active' : 'ep-tag-inactive'}">${s || '—'}</span>`;
  }

  function _getScore(clauseId) {
    if (!_scoreCache[clauseId]) {
      const h = (clauseId || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      _scoreCache[clauseId] = [44, 61, 74, 82, 88, 91][h % 6];
    }
    return _scoreCache[clauseId];
  }

  function _buildRows(circ) {
    const rows = [];
    (circ.chapters || []).forEach(ch => {
      (ch.clauses || []).forEach(cl => {
        const raw = cl.actionable || cl.actionables || '';
        let acts = raw.split(';').map(x => x.trim()).filter(Boolean);
        if (!acts.length) acts = raw ? [raw] : ['—'];
        acts.forEach(act => {
          rows.push({
            clauseId: cl.id,
            chapterTitle: ch.title || '',
            department: cl.department || '—',
            risk: cl.risk || '—',
            obligation: cl.obligation || cl.obligations || '—',
            action: act,
          });
        });
      });
    });
    return rows;
  }

  function _fileKey(row) {
    return row.clauseId + '_' + row.action.slice(0, 12).replace(/\s+/g, '_');
  }

  /* ── ring SVG ── */
  function _ring(score) {
    const r = 33, circ = 2 * Math.PI * r, off = circ - (score / 100) * circ;
    const col = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171';
    return { col, svg: `<svg class="ep-ring" viewBox="0 0 80 80">
      <circle class="ep-rtrack" cx="40" cy="40" r="${r}"/>
      <circle class="ep-rfill" cx="40" cy="40" r="${r}" stroke="${col}"
        stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
        transform="rotate(-90 40 40)"/>
    </svg>` };
  }

  /* ── table rows HTML ── */
  function _trows(rows, q) {
    const fq = (q || '').toLowerCase().trim();
    const filtered = fq
      ? rows.filter(r =>
          r.clauseId.toLowerCase().includes(fq) ||
          r.action.toLowerCase().includes(fq) ||
          r.obligation.toLowerCase().includes(fq) ||
          r.department.toLowerCase().includes(fq) ||
          r.chapterTitle.toLowerCase().includes(fq))
      : rows;

    if (!filtered.length) {
      return `<tr><td colspan="9" class="ep-tbl-empty">No actions match your filter</td></tr>`;
    }

    return filtered.map(r => {
      const sc = _getScore(r.clauseId);
      const sc_ = sc >= 80 ? '#16a34a' : sc >= 60 ? '#d97706' : '#dc2626';
      const bg_ = sc >= 80 ? '#dcfce7' : sc >= 60 ? '#fef9c3' : '#fee2e2';
      const fk = _fileKey(r);
      const fname = _uploadedFiles[fk] || '';
      const obl = r.obligation.length > 65 ? r.obligation.slice(0, 65) + '…' : r.obligation;
      const act = r.action.length > 70 ? r.action.slice(0, 70) + '…' : r.action;

      return `<tr>
        <td class="ep-td-clause">${r.clauseId}</td>
        <td class="ep-td-ch">${r.chapterTitle}</td>
        <td class="ep-td-obl">${obl}</td>
        <td class="ep-td-act">${act}</td>
        <td><span class="ep-tag" style="background:#eff6ff;color:#1d4ed8;">${r.department}</span></td>
        <td>${_rtag(r.risk)}</td>
        <td><span class="ep-sp" style="background:${bg_};color:${sc_}"><span class="ep-dot" style="background:${sc_}"></span>${sc}%</span></td>
        <td>
          <div class="ep-ucell">
            <label class="ep-ulabel${fname ? ' has' : ''}" for="ep-uf-${fk}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              ${fname ? '✓ Uploaded' : 'Upload'}
            </label>
            <input type="file" id="ep-uf-${fk}" data-fk="${fk}" style="display:none" accept=".pdf,.docx,.xlsx,.png,.jpg">
          </div>
        </td>
        <td>
          <button class="ep-btn-eval${fname ? ' ready' : ''}" data-row='${encodeURIComponent(JSON.stringify(r))}'>
            Evaluate →
          </button>
        </td>
      </tr>`;
    }).join('');
  }

  /* ── bind table interactions ── */
  function _bindTable() {
    const root = _container;

    root.querySelectorAll('input[type=file][data-fk]').forEach(inp => {
      inp.addEventListener('change', () => {
        if (inp.files.length) {
          _uploadedFiles[inp.dataset.fk] = inp.files[0].name;
          const tf = root.querySelector('#ep-tf');
          _refreshTbody(tf ? tf.value : '');
        }
      });
    });

    root.querySelectorAll('[data-row]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const row = JSON.parse(decodeURIComponent(btn.dataset.row));
          _showAnalysis(row);
        } catch (e) { console.error(e); }
      });
    });
  }

  function _refreshTbody(q) {
    const tb = _container.querySelector('#ep-tbody');
    if (tb) {
      tb.innerHTML = _trows(_allRows, q);
      _bindTable();
    }
    const tc = _container.querySelector('#ep-tc');
    if (tc) {
      const fq = (q || '').toLowerCase().trim();
      const vis = fq ? _allRows.filter(r =>
        r.clauseId.toLowerCase().includes(fq) ||
        r.action.toLowerCase().includes(fq) ||
        r.obligation.toLowerCase().includes(fq) ||
        r.department.toLowerCase().includes(fq)).length : _allRows.length;
      tc.textContent = fq ? `${vis} of ${_allRows.length} actions` : `${_allRows.length} actions`;
    }
  }

  /* ── main render ── */
  function _renderMain() {
    const tableView = _container.querySelector('#ep-table-view');
    const analysisView = _container.querySelector('#ep-analysis');
    if (!tableView) return;

    tableView.style.display = 'block';
    if (analysisView) analysisView.style.display = 'none';

    const circ = _selectedCircular;
    const circSection = _container.querySelector('#ep-circ-section');
    const bannerEl = _container.querySelector('#ep-banner');
    const statsEl = _container.querySelector('#ep-stats');

    if (!circ) {
      if (circSection) circSection.style.display = 'none';
      return;
    }

    if (circSection) circSection.style.display = 'block';

    const chs = circ.chapters || [];
    const clCount = chs.reduce((s, ch) => s + (ch.clauses?.length || 0), 0);

    if (bannerEl) {
      bannerEl.innerHTML = `
        <span class="ep-ban-id">${circ.id}</span>
        <span class="ep-ban-title">${circ.title}</span>
        <span class="ep-ban-reg">${circ.regulator || ''}</span>
        <div class="ep-ban-tags">${_stag(circ.status)}${_rtag(circ.risk)}</div>
        <span class="ep-ban-change" id="ep-ban-change">↺ Change</span>`;
      bannerEl.querySelector('#ep-ban-change').addEventListener('click', () => {
        _selectedCircular = null;
        if (circSection) circSection.style.display = 'none';
        setTimeout(() => _container.querySelector('#ep-sinput')?.focus(), 40);
      });
    }

    if (statsEl) {
      statsEl.innerHTML = `
        <div class="ep-stat"><div class="ep-stat-n">${chs.length}</div><div class="ep-stat-l">Chapters</div></div>
        <div class="ep-stat"><div class="ep-stat-n">${clCount}</div><div class="ep-stat-l">Clauses</div></div>
        <div class="ep-stat"><div class="ep-stat-n" style="color:var(--blue)">${_allRows.length}</div><div class="ep-stat-l">Actions</div></div>
        ${circ.effectiveDate ? `<div class="ep-stat"><div class="ep-stat-n" style="font-size:14px">${circ.effectiveDate}</div><div class="ep-stat-l">Effective date</div></div>` : ''}`;
    }

    const tbody = _container.querySelector('#ep-tbody');
    const tc = _container.querySelector('#ep-tc');
    if (tbody) { tbody.innerHTML = _trows(_allRows, ''); _bindTable(); }
    if (tc) tc.textContent = `${_allRows.length} actions`;
  }

  /* ══════════════════════════════════════════════════
     ANALYSIS SCREEN — two-column redesign
     ══════════════════════════════════════════════════ */
  function _showAnalysis(row) {
    const tableView = _container.querySelector('#ep-table-view');
    const analysisEl = _container.querySelector('#ep-analysis');
    if (tableView) tableView.style.display = 'none';
    if (analysisEl) { analysisEl.style.display = 'block'; }

    const sc = _getScore(row.clauseId);
    const fk = _fileKey(row);
    const hasFile = !!_uploadedFiles[fk];
    const { col: ringCol, svg: ringSvg } = _ring(sc);

    const verdict  = sc >= 80 ? 'Strong compliance coverage' : sc >= 60 ? 'Partial compliance — gaps found' : 'Critical gaps — immediate action required';
    const statusTxt = sc >= 80 ? 'Compliant' : sc >= 60 ? 'Partially Compliant' : 'Non-Compliant';
    const vc = sc >= 80 ? '#34d399' : sc >= 60 ? '#fbbf24' : '#f87171';

    /* score reason items */
    const positives = [
      { t: 'Policy documentation', d: 'Present and references the correct regulatory clause with version control.', delta: '+15' },
      { t: 'Internal review cycle', d: 'Quarterly frequency documented with an audit trail.', delta: '+12' },
      { t: 'Responsible owner assigned', d: 'Clear sign-off trail visible in the control register.', delta: '+10' },
      { t: 'Control framework mapping', d: 'Obligation aligns with the stated internal control framework.', delta: '+8' },
    ];
    const negatives = [
      { t: 'Risk assessment outdated', d: 'Last reviewed over 18 months ago — requires refresh.', delta: '−10' },
      { t: 'Staff training records missing', d: '3 of 7 in-scope personnel have no completion record.', delta: '−8' },
      { t: 'Exception handling undocumented', d: 'Referenced in policy but no supporting document attached.', delta: '−7' },
      { t: 'Board sign-off absent', d: 'Control attestation form lacks required board signature.', delta: '−6' },
    ];

    const showPos = positives.slice(0, sc >= 70 ? 3 : 2);
    const showNeg = negatives.slice(0, sc < 60 ? 3 : 2);

    /* coverage areas */
    const coverage = [
      { name: 'Documentation completeness', pct: Math.min(sc + 18, 95), note: 'Key annexures missing.' },
      { name: 'Stakeholder sign-off trail',  pct: Math.min(sc + 8, 90),  note: 'Some approvals undated.' },
      { name: 'Training & awareness',        pct: Math.max(sc - 12, 28), note: 'Personnel coverage incomplete.' },
      { name: 'Process controls evidence',   pct: Math.max(sc - 6, 38),  note: 'Control testing partial.' },
    ];

    /* improvement steps */
    const improvements = [
      { n: 1, t: 'Upload full policy bundle with all annexures', d: 'Missing Annexure B and the risk register. Attach complete policy bundle v2.1+.', gain: '+8 pts', col: '#dc2626', bg: '#fef2f2' },
      { n: 2, t: 'Obtain dated senior management sign-off', d: 'Add signed attestation from an authorised approver within the last 12 months.', gain: '+6 pts', col: '#d97706', bg: '#fffbeb' },
      { n: 3, t: 'Upload training completion records', d: 'Provide a register covering 100% of listed personnel with completion dates.', gain: '+5 pts', col: '#d97706', bg: '#fffbeb' },
      { n: 4, t: 'Attach latest control-effectiveness test', d: 'Most recent control testing report dated within 6 months.', gain: '+4 pts', col: '#16a34a', bg: '#f0fdf4' },
    ];

    /* uploaded files state for this row */
    let _localFiles = hasFile ? [{ name: _uploadedFiles[fk], size: '' }] : [];

    const analysisContent = _container.querySelector('#ep-analysis-content');
    if (!analysisContent) return;

    function _render() {
      analysisContent.innerHTML = `
        <button class="ep-back" id="ep-back-btn">← Back to table</button>

        <!-- compact header -->
        <div class="ep-an-header ep-fade">
          <span class="ep-an-hid">${row.clauseId}</span>
          <span class="ep-an-htitle">${row.chapterTitle || 'Clause analysis'}</span>
          <span class="ep-an-hdept">${row.department}</span>
          <div class="ep-an-htags">${_rtag(row.risk)}</div>
        </div>

        <!-- two columns -->
        <div class="ep-an-cols ep-fade">

          <!-- ══ LEFT: evidence upload ══ -->
          <div>
            <div class="ep-an-panel">
              <div class="ep-an-ph">
                <div class="ep-an-pico" style="background:#eff6ff;color:#2563eb">📤</div>
                <div>
                  <div class="ep-an-ptitle">Evidence Submission</div>
                  <div class="ep-an-psub">Upload documents to support this clause</div>
                </div>
              </div>
              <div class="ep-an-pbody">

                <!-- obligation -->
                <div class="ep-ev-obl">
                  <div class="ep-ev-obl-lbl">Regulatory obligation</div>
                  <div class="ep-ev-obl-txt">${row.obligation}</div>
                </div>

                <!-- action -->
                <div class="ep-ev-action">
                  <div class="ep-ev-act-lbl">Required action</div>
                  <div class="ep-ev-act-txt">${row.action}</div>
                </div>

                <!-- drop zone -->
                <label class="ep-flbl">Upload Evidence Files</label>
                <div class="ep-dropzone${_localFiles.length ? ' dz-done' : ''}" id="ep-dz">
                  <span class="ep-dz-ico">${_localFiles.length ? '✅' : '📄'}</span>
                  <div class="ep-dz-lbl">${_localFiles.length ? 'Files attached' : 'Click or drag & drop'}</div>
                  <div class="ep-dz-sub">PDF · DOCX · XLSX · PNG · Max 10 MB each</div>
                  ${_localFiles.length ? `<div class="ep-dz-badge">✓ ${_localFiles.length} file${_localFiles.length > 1 ? 's' : ''} ready</div>` : ''}
                  <input type="file" id="ep-evfile" style="display:none" accept=".pdf,.docx,.xlsx,.png,.jpg" multiple>
                </div>

                <!-- file list -->
                ${_localFiles.length ? `<div class="ep-flist" id="ep-flist">
                  ${_localFiles.map((f, i) => `<div class="ep-fitem">
                    <span class="ep-fitem-ico">📎</span>
                    <span class="ep-fitem-name">${f.name}</span>
                    ${f.size ? `<span class="ep-fitem-size">${f.size}</span>` : ''}
                    <button class="ep-fitem-rm" data-fi="${i}" title="Remove">×</button>
                  </div>`).join('')}
                </div>` : ''}

                <!-- URL row -->
                <label class="ep-flbl">Or paste document URL</label>
                <div class="ep-url-row">
                  <input class="ep-fc" id="ep-ev-url" placeholder="https://…">
                  <button class="ep-url-add" id="ep-url-add-btn">+ Add</button>
                </div>

                <!-- notes -->
                <label class="ep-flbl">Notes / context</label>
                <textarea class="ep-fc" id="ep-ev-notes" rows="3" placeholder="Add context, version info, caveats…" style="resize:vertical"></textarea>

                <!-- fields row -->
                <div class="ep-field-row">
                  <div>
                    <label class="ep-flbl">Compliance status</label>
                    <select class="ep-fc" id="ep-ev-status">
                      <option value="">Select…</option>
                      <option value="complete">✅  Complete</option>
                      <option value="partial">🟡  Partial</option>
                      <option value="pending">🔴  Pending</option>
                      <option value="na">⚪  N/A</option>
                    </select>
                  </div>
                  <div>
                    <label class="ep-flbl">Assigned to</label>
                    <input class="ep-fc" id="ep-ev-assign" placeholder="Name or team…">
                  </div>
                </div>

                <label class="ep-flbl">Target completion date</label>
                <input class="ep-fc" type="date" id="ep-ev-date">

                <div class="ep-btnrow">
                  <button class="ep-btn ep-btn-blue" id="ep-ev-submit">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Submit Evidence
                  </button>
                  <button class="ep-btn ep-btn-ghost ep-btn-sm" id="ep-ev-dl">⬇ Download Report</button>
                </div>
              </div>
            </div>
          </div>

          <!-- ══ RIGHT: analysis ══ -->
          <div style="display:flex;flex-direction:column;gap:14px;">

            <!-- score hero -->
            <div class="ep-an-panel">
              <div class="ep-an-ph">
                <div class="ep-an-pico" style="background:#f0f4ff;color:#2563eb">◎</div>
                <div>
                  <div class="ep-an-ptitle">Compliance Score</div>
                  <div class="ep-an-psub">Based on evidence provided</div>
                </div>
              </div>
              <div class="ep-an-pbody" style="padding:16px 18px;">
                <div class="ep-score-hero">
                  <div class="ep-rw">
                    ${ringSvg}
                    <div class="ep-rcenter">
                      <div class="ep-rscore">${sc}</div>
                      <div class="ep-rof">/ 100</div>
                    </div>
                  </div>
                  <div class="ep-sh-info">
                    <div class="ep-sh-verdict">${verdict}</div>
                    <div class="ep-sh-status" style="color:${vc}">${statusTxt}</div>
                    <div class="ep-sh-nums">
                      <div class="ep-sh-num-item">
                        <div class="ep-sh-n" style="color:#34d399">${showPos.length}</div>
                        <div class="ep-sh-l">Passed</div>
                      </div>
                      <div style="width:1px;background:rgba(255,255,255,.1);align-self:stretch;flex-shrink:0;margin:0 4px"></div>
                      <div class="ep-sh-num-item">
                        <div class="ep-sh-n" style="color:#f87171">${showNeg.length}</div>
                        <div class="ep-sh-l">Issues</div>
                      </div>
                      <div style="width:1px;background:rgba(255,255,255,.1);align-self:stretch;flex-shrink:0;margin:0 4px"></div>
                      <div class="ep-sh-num-item">
                        <div class="ep-sh-n" style="color:#fbbf24">${100 - sc}%</div>
                        <div class="ep-sh-l">Gap</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- score reasons -->
            <div class="ep-an-panel">
              <div class="ep-an-ph">
                <div class="ep-an-pico" style="background:#f0fdf4;color:#16a34a">≡</div>
                <div>
                  <div class="ep-an-ptitle">Score Breakdown</div>
                  <div class="ep-an-psub">Why you scored ${sc} / 100</div>
                </div>
              </div>
              <div style="padding:4px 0;">
                ${showPos.map(p => `<div class="ep-reason-item">
                  <div class="ep-ri-badge" style="background:#dcfce7;color:#15803d">✓</div>
                  <div class="ep-ri-body">
                    <div class="ep-ri-title">${p.t}</div>
                    <div class="ep-ri-desc">${p.d}</div>
                  </div>
                  <div class="ep-ri-delta" style="background:#dcfce7;color:#15803d">${p.delta}</div>
                </div>`).join('')}
                ${showNeg.map(n => `<div class="ep-reason-item">
                  <div class="ep-ri-badge" style="background:#fee2e2;color:#dc2626">✗</div>
                  <div class="ep-ri-body">
                    <div class="ep-ri-title">${n.t}</div>
                    <div class="ep-ri-desc">${n.d}</div>
                  </div>
                  <div class="ep-ri-delta" style="background:#fee2e2;color:#dc2626">${n.delta}</div>
                </div>`).join('')}
              </div>
            </div>

            <!-- coverage bars -->
            <div class="ep-an-panel">
              <div class="ep-an-ph">
                <div class="ep-an-pico" style="background:#f5f3ff;color:#7c3aed">▦</div>
                <div>
                  <div class="ep-an-ptitle">Coverage by Area</div>
                  <div class="ep-an-psub">Detailed compliance breakdown</div>
                </div>
              </div>
              <div style="padding:4px 0;">
                ${coverage.map(c => `<div class="ep-cov-item">
                  <div class="ep-cov-row">
                    <span class="ep-cov-name">${c.name}</span>
                    <span class="ep-cov-pct" style="color:${c.pct >= 80 ? '#16a34a' : c.pct >= 60 ? '#d97706' : '#dc2626'}">${c.pct}%</span>
                  </div>
                  <div class="ep-cov-trk">
                    <div class="ep-cov-fill" style="width:${c.pct}%;background:${c.pct >= 80 ? '#16a34a' : c.pct >= 60 ? '#fbbf24' : '#f87171'}"></div>
                  </div>
                  <div class="ep-cov-note">${c.note}</div>
                </div>`).join('')}
              </div>
            </div>

            <!-- ways to improve -->
            <div class="ep-an-panel">
              <div class="ep-an-ph">
                <div class="ep-an-pico" style="background:#fffbeb;color:#d97706">↑</div>
                <div>
                  <div class="ep-an-ptitle">How to Improve</div>
                  <div class="ep-an-psub">Steps to reach 100% compliance</div>
                </div>
              </div>
              <div style="padding:4px 0;">
                ${improvements.map(i => `<div class="ep-impr-item">
                  <div class="ep-impr-num">${i.n}</div>
                  <div class="ep-impr-body">
                    <div class="ep-impr-title">${i.t}</div>
                    <div class="ep-impr-desc">${i.d}</div>
                  </div>
                  <div class="ep-impr-gain" style="background:${i.bg};color:${i.col}">${i.gain}</div>
                </div>`).join('')}
              </div>
            </div>

          </div><!-- /right col -->
        </div><!-- /cols -->
      `;

      /* bind back */
      analysisContent.querySelector('#ep-back-btn').addEventListener('click', () => {
        if (analysisEl) analysisEl.style.display = 'none';
        if (tableView) tableView.style.display = 'block';
        _refreshTbody(_container.querySelector('#ep-tf')?.value || '');
      });

      /* drop zone */
      const dz = analysisContent.querySelector('#ep-dz');
      const fi = analysisContent.querySelector('#ep-evfile');
      if (dz && fi) {
        dz.addEventListener('click', () => fi.click());
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dz-over'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('dz-over'));
        dz.addEventListener('drop', e => {
          e.preventDefault(); dz.classList.remove('dz-over');
          [...e.dataTransfer.files].forEach(f => _addFile(f));
          _render();
        });
        fi.addEventListener('change', () => {
          [...fi.files].forEach(f => _addFile(f));
          _render();
        });
      }

      /* remove file buttons */
      analysisContent.querySelectorAll('[data-fi]').forEach(btn => {
        btn.addEventListener('click', () => {
          _localFiles.splice(parseInt(btn.dataset.fi), 1);
          _render();
        });
      });

      /* url add */
      const urlAdd = analysisContent.querySelector('#ep-url-add-btn');
      if (urlAdd) {
        urlAdd.addEventListener('click', () => {
          const v = analysisContent.querySelector('#ep-ev-url')?.value?.trim();
          if (!v) { _toast('Enter a URL first', 'warning'); return; }
          _localFiles.push({ name: v, size: 'URL' });
          _render();
        });
      }

      /* submit */
      analysisContent.querySelector('#ep-ev-submit').addEventListener('click', () => {
        const st = analysisContent.querySelector('#ep-ev-status')?.value;
        const url = analysisContent.querySelector('#ep-ev-url')?.value?.trim();
        if (!_localFiles.length && !url) { _toast('Upload a file or add a document URL', 'warning'); return; }
        if (!st) { _toast('Please select a compliance status', 'warning'); return; }
        if (_localFiles.length) {
          _uploadedFiles[fk] = _localFiles[0].name;
        }
        _toast('✓ Evidence submitted successfully', 'success');
        setTimeout(() => {
          if (analysisEl) analysisEl.style.display = 'none';
          if (tableView) tableView.style.display = 'block';
          _refreshTbody('');
        }, 500);
      });

      /* download */
      analysisContent.querySelector('#ep-ev-dl').addEventListener('click', () => {
        _toast('📥 Generating report…', 'info');
        setTimeout(() => _toast('✓ Report ready', 'success'), 1400);
      });
    }

    function _addFile(f) {
      _localFiles.push({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` });
    }

    _render();
  }

  /* ── search / dropdown ── */
  function _renderDropdown(q) {
    const wrap = _container.querySelector('#ep-clist');
    if (!wrap) return;
    const circs = _data.circulars || [];
    const fq = (q || '').toLowerCase().trim();

    if (!fq) {
      wrap.innerHTML = `<div class="ep-search-hint">Type to search ${circs.length} circulars</div>`;
      return;
    }

    const f = circs.filter(c =>
      c.id.toLowerCase().includes(fq) ||
      (c.title || '').toLowerCase().includes(fq) ||
      (c.regulator || '').toLowerCase().includes(fq));

    if (!f.length) {
      wrap.innerHTML = `<div class="ep-no-results">No circulars match "<strong>${q}</strong>"</div>`;
      return;
    }

    wrap.innerHTML = f.map(c => `
      <div class="ep-crow${_selectedCircular?.id === c.id ? ' active' : ''}" data-cid="${c.id}">
        <span class="ep-cid">${c.id}</span>
        <span class="ep-cname">${c.title}</span>
        <span class="ep-creg">${c.regulator || ''}</span>
        ${_stag(c.status)}${_rtag(c.risk)}
      </div>`).join('');

    wrap.querySelectorAll('[data-cid]').forEach(el => {
      el.addEventListener('click', () => {
        _selectedCircular = circs.find(c => c.id === el.dataset.cid);
        _allRows = _selectedCircular ? _buildRows(_selectedCircular) : [];
        _container.querySelector('#ep-sinput').value = '';
        wrap.innerHTML = '';
        _renderMain();
      });
    });
  }

  /* ── public init ── */
  function init(containerId, cmsData) {
    _injectCSS();
    _data = cmsData || DEMO_DATA;
    _container = typeof containerId === 'string'
      ? document.getElementById(containerId)
      : containerId;

    if (!_container) { console.error('EvidencePanel: container not found'); return; }

    _container.innerHTML = `
      <div class="ep">
        <div class="ep-shell">
          <div class="ep-page-title">Evidence Evaluation</div>
          <div class="ep-page-sub">Select a circular, review actions, upload evidence and evaluate compliance</div>

          <div id="ep-table-view">
            <div class="ep-search-card">
              <div class="ep-sw">
                <i class="ep-si">⌕</i>
                <input class="ep-sinput" id="ep-sinput" placeholder="Search by circular ID, title or regulator…" autocomplete="off">
              </div>
              <div id="ep-clist" class="ep-clist">
                <div class="ep-search-hint">Type to search ${(_data.circulars || []).length} circulars</div>
              </div>
            </div>

            <div id="ep-circ-section" style="display:none">
              <div id="ep-banner" class="ep-banner"></div>
              <div id="ep-stats" class="ep-stats"></div>

              <div class="ep-tbar">
                <div class="ep-tfw">
                  <i class="ep-tfi">⌕</i>
                  <input class="ep-tf" id="ep-tf" placeholder="Filter by clause, action, obligation, department…">
                </div>
                <span class="ep-tc" id="ep-tc"></span>
              </div>

              <div class="ep-tcard">
                <div class="ep-tscroll">
                  <table class="ep-table" id="ep-tbl">
                    <thead>
                      <tr>
                        <th data-c="clauseId">Clause <span class="ep-sort-i">↕</span></th>
                        <th data-c="chapterTitle">Chapter <span class="ep-sort-i">↕</span></th>
                        <th data-c="obligation">Obligation <span class="ep-sort-i">↕</span></th>
                        <th data-c="action">Action <span class="ep-sort-i">↕</span></th>
                        <th data-c="department">Dept <span class="ep-sort-i">↕</span></th>
                        <th data-c="risk">Risk <span class="ep-sort-i">↕</span></th>
                        <th>Score</th>
                        <th>Evidence</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody id="ep-tbody"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div id="ep-analysis">
            <div id="ep-analysis-content"></div>
          </div>
        </div>
      </div>`;

    const sinput = _container.querySelector('#ep-sinput');
    sinput.addEventListener('input', function () {
      clearTimeout(this._d);
      this._d = setTimeout(() => _renderDropdown(this.value), 160);
    });

    const tf = _container.querySelector('#ep-tf');
    if (tf) {
      tf.addEventListener('input', function () {
        clearTimeout(this._d);
        this._d = setTimeout(() => _refreshTbody(this.value), 150);
      });
    }

    let sortCol = null, sortDir = 1;
    _container.querySelectorAll('#ep-tbl th[data-c]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.c;
        if (sortCol === col) sortDir *= -1; else { sortCol = col; sortDir = 1; }
        _container.querySelectorAll('#ep-tbl th').forEach(t => t.classList.remove('ep-s'));
        th.classList.add('ep-s');
        th.querySelector('.ep-sort-i').textContent = sortDir === 1 ? '↑' : '↓';
        const sorted = [..._allRows].sort((a, b) => {
          const av = (a[col] || '').toLowerCase(), bv = (b[col] || '').toLowerCase();
          return av < bv ? -sortDir : av > bv ? sortDir : 0;
        });
        const tbody = _container.querySelector('#ep-tbody');
        if (tbody) { tbody.innerHTML = _trows(sorted, tf?.value || ''); _bindTable(); }
      });
    });
  }

  function navigateTo(circularId) {
    if (!_data) return;
    _selectedCircular = (_data.circulars || []).find(c => c.id === circularId);
    if (!_selectedCircular) return;
    _allRows = _buildRows(_selectedCircular);
    _renderMain();
  }

  return { init, navigateTo };

})();

/*
 * ── HOW TO USE ──────────────────────────────────────────────────────────────
 *
 * 1. Include this file in your HTML:
 *    <script src="evidence-panel.js"></script>
 *
 * 2. Add a container element:
 *    <div id="my-panel"></div>
 *
 * 3. Initialise with your CMS data (or no data for demo mode):
 *    EvidencePanel.init('my-panel', CMS_DATA);
 *    EvidencePanel.init('my-panel');           // uses built-in demo data
 *
 * 4. Optionally deep-link to a circular:
 *    EvidencePanel.navigateTo('CIRC-001');
 *
 * ────────────────────────────────────────────────────────────────────────────
 */