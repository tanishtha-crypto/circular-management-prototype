/* ── Hierarchical view ── */


window._mlShowHierarchicalView = function () {
  window._mlActiveView = 'hierarchical';
  var area = document.getElementById('ml-view-area');
  if (!area) return;
  area.innerHTML =
    _mlBuildFilterBar() +
    '<div class="table-card ml-table-card">' +
      '<div class="ml-tbl-toolbar">' +
        '<span class="ml-tbl-count" id="ml-obl-action-count"></span>' +
        '<div style="display:flex;gap:8px;align-items:center;position:relative;">' +
          '<button id="ml-top-three-dots" style="background:none;border:1px solid #d1d5db;border-radius:6px;padding:5px 14px;cursor:pointer;font-size:18px;line-height:1;">⋮</button>' +
          '<div id="ml-top-dots-menu" style="display:none;position:absolute;top:38px;right:0;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.12);z-index:999;min-width:180px;">' +
            '<div class="ml-dots-item" onclick="_mlImportExcel()">📥 Import Excel</div>' +
            '<div class="ml-dots-item" onclick="_mlExportExcel()">📤 Export Excel</div>' +
            '<div class="ml-dots-item" onclick="_mlOpenAddActionPopup(\'\',\'\')">+ Add Action</div>' +
            '<div class="ml-dots-item" onclick="_mlOpenAddObligationPopup()">+ Add Obligation</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      
'<div class="ml-hier-list" id="ml-chapter-mount" style="padding:12px;"></div>' +
    '</div>';
  _mlRenderHierCards(_mlGetFilteredCircs());
  _mlBindFilterBar();

}
window._mlRenderHierCards = function (circs) {
  var mount = document.getElementById('ml-chapter-mount');
  if (!mount) return;

  var allItems = _mlExtractActionItems(circs);
  var countEl = document.getElementById('ml-obl-action-count');
  if (countEl) countEl.textContent = allItems.length + ' action item' + (allItems.length !== 1 ? 's' : '');

  if (!allItems.length) {
    mount.innerHTML = '<div style="text-align:center;padding:40px;color:var(--dr-t3);">No action items match filters</div>';
    return;
  }

  /* Group items by obligationId */
  var oblMap = {};
  var oblOrder = [];
  allItems.forEach(function(item) {
    var key = item.obligationId || '—';
    if (!oblMap[key]) { oblMap[key] = { id: key, name: item.obligationName || key, items: [] }; oblOrder.push(key); }
    oblMap[key].items.push(item);
  });

  var statusColors = {
    'Assigned':'#ede9fe;color:#5b5fcf',
    'Unassigned':'#f3f4f6;color:#6b7280',
    'Not Applicable':'#f3f4f6;color:#6b7280'
  };

  mount.innerHTML = oblOrder.map(function(oblId, oi) {
    var obl = oblMap[oblId];
    var items = obl.items;
    var statusCounts = { Assigned: 0, Unassigned: 0, 'Not Applicable': 0 };
    items.forEach(function(it) { if (statusCounts[it.status] !== undefined) statusCounts[it.status]++; });

    return '<div class="ml-hier-card" style="margin-bottom:8px;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">' +
      '<div style="padding:12px 16px;background:#f9fafb;display:flex;align-items:center;gap:10px;cursor:pointer;border-bottom:1px solid #e5e7eb;" onclick="var b=document.getElementById(\'ml-obl-body-' + oi + '\');var a=document.getElementById(\'ml-obl-arr-' + oi + '\');if(b){var open=b.style.display!==\'none\';b.style.display=open?\'none\':\'block\';a.textContent=open?\'▶\':\'▼\';}">' +
        '<span id="ml-obl-arr-' + oi + '" style="font-size:10px;color:#6b7280;">▶</span>' +
        '<span class="ml-obl-header-id" data-oblid="' + oblId + '" style="font-family:monospace;font-size:11px;font-weight:700;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:4px;white-space:nowrap;cursor:pointer;text-decoration:underline dotted;">' + oblId + '</span>' +
        '<span style="font-size:12px;font-weight:600;color:#1f2937;flex:1;">' + (obl.name||'').substring(0,80) + (obl.name.length > 80 ? '…' : '') + '</span>' +
        '<span style="font-size:11px;color:#6b7280;background:#e8ebf1;padding:2px 8px;border-radius:10px;white-space:nowrap;">' + items.length + ' action' + (items.length !== 1 ? 's' : '') + '</span>' +
        (statusCounts.Assigned ? '<span style="font-size:10px;font-weight:700;background:#ede9fe;color:#5b5fcf;padding:2px 8px;border-radius:10px;white-space:nowrap;">' + statusCounts.Assigned + ' Assigned</span>' : '') +
        (statusCounts.Unassigned ? '<span style="font-size:10px;font-weight:700;background:#f3f4f6;color:#6b7280;padding:2px 8px;border-radius:10px;white-space:nowrap;">' + statusCounts.Unassigned + ' Unassigned</span>' : '') +
      '</div>' +
      '<div id="ml-obl-body-' + oi + '" style="display:none;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
            '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;font-size:11px;">Action ID</th>' +
            '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;font-size:11px;">Action</th>' +
            '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;font-size:11px;">Department(s)</th>' +
            '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;font-size:11px;">Assigned To</th>' +
            '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;font-size:11px;">Status</th>' +
            '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;font-size:11px;">Due Date</th>' +
          '</tr></thead>' +
          '<tbody>' +
            items.map(function(item) {
              var globalIdx = allItems.indexOf(item);
              var sc = statusColors[item.status] || '#f3f4f6;color:#6b7280';
              return '<tr class="ml-obl-action-row" style="border-bottom:1px solid #f3f4f6;background:#fff;">' +
                '<td style="padding:10px 12px;">' +
                  '<span class="ml-obl-id ml-clickable-id" data-gidx="' + globalIdx + '" style="cursor:pointer;color:#7c3aed;font-weight:700;font-family:monospace;font-size:11px;" title="View details">' + item.actionId + '</span>' +
                '</td>' +
                '<td style="padding:10px 12px;max-width:260px;font-size:12px;color:#374151;">' + (item.action||'').substring(0,70) + ((item.action||'').length>70?'…':'') + '</td>' +
                '<td class="ml-obl-inline-dept" data-gidx="' + globalIdx + '" style="padding:10px 12px;cursor:pointer;" title="Click to assign">' +
                  (item.department ? item.department.split(',').map(function(d){ return '<span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:600;display:inline-block;margin:1px;">' + d.trim() + '</span>'; }).join('') : '<span style="color:#9ca3af;font-style:italic;font-size:11px;">Assign</span>') +
                '</td>' +
                '<td class="ml-obl-inline-assignee" data-gidx="' + globalIdx + '" style="padding:10px 12px;cursor:pointer;font-size:12px;color:#374151;" title="Click to assign">' +
                  (item.assignedTo || '<span style="color:#9ca3af;font-style:italic;">Assign</span>') +
                '</td>' +
                '<td class="ml-obl-inline-status" data-gidx="' + globalIdx + '" style="padding:10px 12px;cursor:pointer;">' +
                  '<span style="padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700;background:' + sc + ';cursor:pointer;">' + item.status + '</span>' +
                '</td>' +
                '<td style="padding:10px 12px;font-size:12px;color:#374151;">' + (item.dueDate || '—') + '</td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>';
  }).join('');

  window._mlActionItems = allItems;

  mount.querySelectorAll('.ml-clickable-id').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(el.dataset.gidx);
      _mlOpenDetailPopup(window._mlActionItems[idx], idx);
    });
  });

  mount.querySelectorAll('.ml-obl-header-id').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var oblId = el.dataset.oblid;
      _mlOpenObligationPopup(oblId, window._mlActionItems);
    });
  });

  mount.querySelectorAll('.ml-obl-inline-dept').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      _mlOpenDepartmentSelector(parseInt(cell.dataset.gidx));
    });
    cell.addEventListener('mouseenter', function() { this.style.background = '#f3f4f6'; });
    cell.addEventListener('mouseleave', function() { this.style.background = 'transparent'; });
  });

  mount.querySelectorAll('.ml-obl-inline-assignee').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      _mlOpenAssigneeSelector(parseInt(cell.dataset.gidx));
    });
    cell.addEventListener('mouseenter', function() { this.style.background = '#f3f4f6'; });
    cell.addEventListener('mouseleave', function() { this.style.background = 'transparent'; });
  });

  mount.querySelectorAll('.ml-obl-inline-status').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      _mlOpenStatusDropdown(parseInt(cell.dataset.gidx));
    });
  });
}

// Toggle three dots menu
document.addEventListener('click', function(e) {
  var menu = document.getElementById('ml-top-dots-menu');
  var btn = document.getElementById('ml-top-three-dots');
  if (!menu) return;
  if (btn && btn.contains(e.target)) {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  } else {
    menu.style.display = 'none';
  }
});

window._mlImportExcel = function() {
  var existing = document.getElementById('ml-import-modal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'ml-import-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML =
    '<div style="background:#fff;border-radius:12px;width:480px;padding:28px;max-width:95vw;">' +
      '<div style="font-size:16px;font-weight:700;color:#1f2937;margin-bottom:6px;">Import Excel</div>' +
      '<div style="font-size:13px;color:#6b7280;margin-bottom:20px;">Download the sample template, fill it in, then upload.</div>' +
      '<button onclick="_mlDownloadSampleTemplate()" style="width:100%;padding:10px;border-radius:8px;border:1px solid #3b82f6;background:#eff6ff;color:#3b82f6;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:12px;">⬇️ Download Sample Template</button>' +
      '<label style="display:block;width:100%;padding:10px;border-radius:8px;border:2px dashed #d1d5db;text-align:center;cursor:pointer;font-size:13px;color:#6b7280;">📤 Click to upload Excel<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast(\'File uploaded. Processing...\',\'success\');document.getElementById(\'ml-import-modal\').remove();"/></label>' +
      '<button onclick="document.getElementById(\'ml-import-modal\').remove()" style="margin-top:14px;width:100%;padding:8px;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;font-size:13px;cursor:pointer;">Cancel</button>' +
    '</div>';
  modal.addEventListener('click', function(e){ if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}

window._mlDownloadSampleTemplate = function() {
  var csv = 'Action ID,Obligation ID,Action,Department,Assigned To,Status,Due Date\nACT-001,OBL-001,Sample action,Compliance,John Doe,Assigned,2025-12-31\n';
  var a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'obligation-action-template.csv';
  a.click();
}

window._mlExportExcel = function() {
  var items = window._mlActionItems || [];
  var csv = 'Action ID,Obligation ID,Action,Department,Assigned To,Status,Due Date\n';
  items.forEach(function(it) {
    csv += [it.actionId,it.obligationId,'"'+(it.action||'')+'"',it.department,it.assignedTo,it.status,it.dueDate].join(',') + '\n';
  });
  var a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'action-items-export.csv';
  a.click();
}

window._mlOpenObligationPopup = function(oblId, allItems) {
  var oblItems = allItems.filter(function(i){ return i.obligationId === oblId; });
  var item = oblItems[0] || {};
  var existing = document.getElementById('ml-obl-detail-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'ml-obl-detail-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;';
function buildView() {
    return '<div style="background:#fff;border-radius:12px;width:620px;max-width:95vw;max-height:88vh;overflow-y:auto;">' +
      // Header
      '<div style="padding:18px 24px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<span style="font-family:monospace;font-size:13px;font-weight:700;color:#7c3aed;background:#f5f3ff;padding:3px 10px;border-radius:5px;">' + oblId + '</span>' +
          '<span style="font-size:14px;font-weight:700;color:#1f2937;">' + (item.obligationName || 'Obligation Details') + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;position:relative;">' +
          '<button id="ml-obl-kebab-btn" style="padding:4px 10px;border-radius:6px;border:1px solid #d1d5db;background:#f9fafb;font-size:18px;cursor:pointer;line-height:1;">⋮</button>' +
          '<div id="ml-obl-kebab-menu" style="display:none;position:absolute;top:34px;right:0;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.12);z-index:9999;min-width:170px;">' +
            '<div class="ml-dots-item" id="ml-obl-edit-btn" style="padding:10px 16px;font-size:13px;color:#374151;cursor:pointer;border-bottom:1px solid #f3f4f6;">✏️ Edit</div>' +
            '<div class="ml-dots-item" style="padding:10px 16px;font-size:13px;color:#374151;cursor:pointer;border-bottom:1px solid #f3f4f6;" onclick="_mlOpenMapObligationPopup(\'' + oblId + '\')">🔗 Mapped Obligation</div>' +
            '<div class="ml-dots-item" style="padding:10px 16px;font-size:13px;color:#374151;cursor:pointer;" onclick="document.getElementById(\'ml-obl-detail-modal\').remove();setTimeout(function(){_mlOpenAddActionPopup(\'' + oblId + '\',\'\');},50);">+ Add Action</div>' +
          '</div>' +
          '<button onclick="document.getElementById(\'ml-obl-detail-modal\').remove()" style="padding:5px 14px;border-radius:6px;border:1px solid #d1d5db;background:#f9fafb;font-size:12px;cursor:pointer;">✕</button>' +
        '</div>' +
      '</div>' +
      // Details grid
      '<div style="padding:18px 24px;border-bottom:1px solid #e5e7eb;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">' +
          _oblField('Frequency', item.frequency || 'Monthly') +
          _oblField('Due Date', item.dueDate || '31-Dec-2025') +
          _oblField('Department', item.department || 'Compliance') +
          _oblField('Effective Date', item.effectiveDate || '01-Jan-2025') +
          _oblField('Section', item.section || '4.2.1') +
          _oblField('Sub-Section', item.subSection || '4.2.1(a)') +
          _oblField('Page Number', item.pageNumber || '42') +
          _oblField('Tags', item.tags || 'Reporting, KYC') +
          _oblField('View Document', '<a href="#" style="color:#3b82f6;font-size:13px;font-weight:600;text-decoration:none;" onclick="showToast(\'Opening document...\',\'info\');return false;">📄 Open PDF</a>') +
        '</div>' +
      '</div>' +
      // Accordion 1 — Extracted Clause Text
      '<div style="border-bottom:1px solid #e5e7eb;">' +
        '<div onclick="var b=document.getElementById(\'ml-obl-acc1\');var a=document.getElementById(\'ml-obl-acc1-arr\');var open=b.style.display!==\'none\';b.style.display=open?\'none\':\'block\';a.textContent=open?\'▶\':\'▼\';" style="padding:13px 24px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:#f9fafb;">' +
          '<span style="font-size:13px;font-weight:700;color:#1f2937;">Extracted Clause Text</span>' +
          '<span id="ml-obl-acc1-arr" style="font-size:11px;color:#6b7280;">▶</span>' +
        '</div>' +
        '<div id="ml-obl-acc1" style="display:none;padding:16px 24px;">' +
          '<div style="font-size:13px;color:#374151;line-height:1.7;background:#f9fafb;padding:12px 14px;border-radius:8px;border:1px solid #e5e7eb;">' + (item.clauseText || item.obligation || item.text || 'Every regulated entity shall establish and maintain a comprehensive compliance framework that ensures adherence to applicable statutory and regulatory provisions. The framework shall include periodic review mechanisms, designated compliance officers, and documented escalation procedures for identified breaches or gaps in compliance posture.') + '</div>' +
        '</div>' +
      '</div>' +
      // Accordion R — Regulatory Details
      '<div style="border-bottom:1px solid #e5e7eb;">' +
        '<div onclick="var b=document.getElementById(\'ml-obl-accR\');var a=document.getElementById(\'ml-obl-accR-arr\');var open=b.style.display!==\'none\';b.style.display=open?\'none\':\'block\';a.textContent=open?\'▶\':\'▼\';" style="padding:13px 24px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:#f9fafb;">' +
          '<span style="font-size:13px;font-weight:700;color:#1f2937;">Regulatory Details</span>' +
          '<span id="ml-obl-accR-arr" style="font-size:11px;color:#6b7280;">▶</span>' +
        '</div>' +
        '<div id="ml-obl-accR" style="display:none;padding:16px 24px;">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">' +
            _oblField('Regulatory Body', item.regulatoryBody || 'RBI') +
            _oblField('Account Name', item.accountName || 'Master Circular 2024') +
            _oblField('Complete Circular', item.completeCircular || 'RBI/2024-25/001') +
            _oblField('Legislative Area', item.legislativeArea || 'Banking Regulation') +
            _oblField('Sub-Legislative Area', item.subLegislativeArea || 'KYC & AML') +
          '</div>' +
        '</div>' +
      '</div>' +
      // Accordion 2 — Action Items
      '<div style="border-bottom:1px solid #e5e7eb;">' +
        '<div onclick="var b=document.getElementById(\'ml-obl-acc2\');var a=document.getElementById(\'ml-obl-acc2-arr\');var open=b.style.display!==\'none\';b.style.display=open?\'none\':\'block\';a.textContent=open?\'▶\':\'▼\';" style="padding:13px 24px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:#f9fafb;">' +
          '<span style="font-size:13px;font-weight:700;color:#1f2937;">Action Items <span style="font-size:11px;font-weight:400;color:#6b7280;background:#e8ebf1;padding:1px 8px;border-radius:9px;margin-left:6px;">' + oblItems.length + '</span></span>' +
          '<span id="ml-obl-acc2-arr" style="font-size:11px;color:#6b7280;">▶</span>' +
        '</div>' +
        '<div id="ml-obl-acc2" style="display:none;padding:0 24px 16px;">' +
          '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:10px;">' +
            '<thead><tr style="background:#f3f4f6;">' +
              '<th style="padding:8px 10px;text-align:left;font-size:11px;color:#374151;">Action ID</th>' +
              '<th style="padding:8px 10px;text-align:left;font-size:11px;color:#374151;">Action</th>' +
              '<th style="padding:8px 10px;text-align:left;font-size:11px;color:#374151;">Assigned To</th>' +
              '<th style="padding:8px 10px;text-align:left;font-size:11px;color:#374151;">Status</th>' +
            '</tr></thead>' +
            '<tbody>' +
              oblItems.map(function(it) {
                var globalIdx = allItems.indexOf(it);
                return '<tr style="border-bottom:1px solid #f3f4f6;cursor:pointer;" onclick="document.getElementById(\'ml-obl-detail-modal\').remove();_mlOpenDetailPopup(window._mlActionItems[' + globalIdx + '],' + globalIdx + ')">' +
                  '<td style="padding:8px 10px;font-family:monospace;color:#7c3aed;font-weight:700;">' + it.actionId + '</td>' +
                  '<td style="padding:8px 10px;color:#374151;">' + (it.action||'').substring(0,55) + ((it.action||'').length>55?'…':'') + '</td>' +
                  '<td style="padding:8px 10px;color:#374151;">' + (it.assignedTo||'—') + '</td>' +
                  '<td style="padding:8px 10px;"><span style="padding:3px 8px;border-radius:10px;font-size:11px;font-weight:700;background:#ede9fe;color:#5b5fcf;">' + (it.status||'—') + '</span></td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  function buildEditView() {
    return '<div style="background:#fff;border-radius:12px;width:620px;max-width:95vw;max-height:88vh;overflow-y:auto;">' +
      '<div style="padding:18px 24px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<span style="font-family:monospace;font-size:13px;font-weight:700;color:#7c3aed;background:#f5f3ff;padding:3px 10px;border-radius:5px;">' + oblId + '</span>' +
          '<span style="font-size:14px;font-weight:700;color:#1f2937;">Edit Obligation</span>' +
        '</div>' +
        '<button onclick="document.getElementById(\'ml-obl-detail-modal\').remove()" style="padding:5px 14px;border-radius:6px;border:1px solid #d1d5db;background:#f9fafb;font-size:12px;cursor:pointer;">✕</button>' +
      '</div>' +
      '<div style="padding:24px;">' +
        '<div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:12px;">Obligation Details</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px;">' +
          _oblEditField('frequency', 'Frequency', item.frequency || 'Monthly') +
          _oblEditField('dueDate', 'Due Date', item.dueDate || '31-Dec-2025') +
          _oblEditField('department', 'Department', item.department || 'Compliance') +
          _oblEditField('effectiveDate', 'Effective Date', item.effectiveDate || '01-Jan-2025') +
          _oblEditField('section', 'Section', item.section || '4.2.1') +
          _oblEditField('subSection', 'Sub-Section', item.subSection || '4.2.1(a)') +
          _oblEditField('pageNumber', 'Page Number', item.pageNumber || '42') +
          _oblEditField('tags', 'Tags', item.tags || 'Reporting, KYC') +
        '</div>' +
        '<div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:12px;">Regulatory Details</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;">' +
          _oblEditField('regulatoryBody', 'Regulatory Body', item.regulatoryBody || 'RBI') +
          _oblEditField('accountName', 'Account Name', item.accountName || 'Master Circular 2024') +
          _oblEditField('completeCircular', 'Complete Circular', item.completeCircular || 'RBI/2024-25/001') +
          _oblEditField('legislativeArea', 'Legislative Area', item.legislativeArea || 'Banking Regulation') +
          _oblEditField('subLegislativeArea', 'Sub-Legislative Area', item.subLegislativeArea || 'KYC & AML') +
        '</div>' +
        '<div style="display:flex;gap:10px;margin-top:20px;">' +
          '<button id="ml-obl-save-btn" style="flex:1;padding:10px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-size:13px;font-weight:700;cursor:pointer;">Save Changes</button>' +
          '<button id="ml-obl-cancel-btn" style="padding:10px 20px;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;font-size:13px;cursor:pointer;">Cancel</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  modal.innerHTML = buildView();
  modal.addEventListener('click', function(e){ if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);

  function bindViewEvents() {
    // kebab toggle
    document.getElementById('ml-obl-kebab-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      var menu = document.getElementById('ml-obl-kebab-menu');
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', function _closeKebab(e) {
      var menu = document.getElementById('ml-obl-kebab-menu');
      if (!menu) { document.removeEventListener('click', _closeKebab); return; }
      if (!menu.contains(e.target)) menu.style.display = 'none';
    });

    // Edit → switch to edit view
    document.getElementById('ml-obl-edit-btn').addEventListener('click', function() {
      document.getElementById('ml-obl-kebab-menu').style.display = 'none';
      modal.innerHTML = buildEditView();

      document.getElementById('ml-obl-cancel-btn').addEventListener('click', function() {
        modal.innerHTML = buildView();
        bindViewEvents();
      });

      document.getElementById('ml-obl-save-btn').addEventListener('click', function() {
        ['obligationName','status','department','assignedTo','dueDate','regulator','circularId','effectiveDate'].forEach(function(f) {
          var el = document.getElementById('ml-edit-' + f);
          if (el) item[f] = el.value;
        });
        var ct = document.getElementById('ml-edit-clauseText');
        if (ct) item.clauseText = ct.value;
        allItems.forEach(function(i) {
          if (i.obligationId === oblId) {
            ['obligationName','status','department','assignedTo','dueDate','regulator','circularId','effectiveDate'].forEach(function(f){ i[f] = item[f]; });
          }
        });
        modal.innerHTML = buildView();
        bindViewEvents();
        showToast('Obligation updated.', 'success');
      });
    });
  }

  bindViewEvents();
}

function _oblField(label, val) {
  return '<div><span style="font-size:11px;color:#9ca3af;display:block;margin-bottom:3px;">' + label + '</span><div style="font-size:13px;font-weight:600;color:#1f2937;">' + (val||'—') + '</div></div>';
}

function _oblEditField(id, label, val) {
  return '<div><label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">' + label + '</label><input id="ml-edit-' + id + '" value="' + (val||'') + '" style="width:100%;padding:7px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;color:#374151;box-sizing:border-box;"/></div>';
}
window._mlOpenActionDetailPopup = function(actionId) {
  var items = window._mlActionItems || [];
  var idx = items.findIndex(function(i){ return i.actionId === actionId; });
  if (idx > -1) _mlOpenDetailPopup(items[idx], idx);
}

window._mlUpdateStatus = function(idx, newStatus) {
  window._mlActionItems[idx].status = newStatus;
  if (window._mlActiveView === 'hierarchical') _mlRenderHierCards(_mlGetFilteredCircs());
  else _mlRenderTable(CMS_DATA.circulars);
  showToast('Status updated to ' + newStatus + '.', 'success');
}

window._mlOpenMappedClausesPopup = function(oblId) {
  var existing = document.getElementById('ml-mapped-clauses-modal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay';
  overlay.id = 'ml-mapped-clauses-modal';

  var dummyClauses = [
    { clauseId: 'CL-2024-01', clauseName: 'Quarterly Regulatory Reporting — submission of financial and compliance returns to the designated regulatory authority on a periodic basis.', tags: 'Reporting, KYC', status: 'Assigned' },
    { clauseId: 'CL-2024-02', clauseName: 'KYC Maintenance — periodic update and verification of Know Your Customer records across all active customer accounts as mandated.', tags: 'KYC, AML', status: 'Assigned' },
    { clauseId: 'CL-2024-03', clauseName: 'Risk Assessment Review — conduct structured internal risk assessment covering operational, credit and compliance risks on a scheduled frequency.', tags: 'Risk, Audit', status: 'Assigned' },
    { clauseId: 'CL-2024-04', clauseName: 'Annual Compliance Certificate — preparation and filing of the annual compliance certificate with the relevant statutory and regulatory bodies.', tags: 'Legal, Filing', status: 'Unassigned' },
  ];

  var statusColors = { 'Assigned':'#dcfce7;color:#15803d', 'Unassigned':'#fef3c7;color:#b45309' };

  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:780px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Mapped Clauses</div>' +
          '<div class="dr-modal-subject">' + oblId + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<button class="dr-btn dr-btn-sec" style="font-size:11px;" onclick="_mlOpenBulkMapClausesModal(\'' + oblId + '\')">+ Map More Clauses</button>' +
          '<button class="dr-modal-close" onclick="document.getElementById(\'ml-mapped-clauses-modal\').remove()">&#x2715;</button>' +
        '</div>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:0;">' +
        '<div style="padding:12px 20px;background:#fffbeb;border-bottom:1px solid #fde68a;font-size:12px;color:#92400e;">&#x26A0; This obligation is mapped to the following clauses.</div>' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
  '<th style="padding:12px;width:32px;"><input type="checkbox" id="ml-mapped-select-all" onchange="_mlToggleAllMappedRows(this)" style="accent-color:#3b82f6;width:15px;height:15px;"/></th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Clause ID</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;">Clause Name</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Tags</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Status</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Action</th>' +
'</tr></thead>' +
          '<tbody>' +
            dummyClauses.map(function(m) {
              var sc = statusColors[m.status] || '#f3f4f6;color:#6b7280';
              return '<tr style="border-bottom:1px solid #e5e7eb;background:#fafafa;">' +
                '<td style="padding:12px;"><input type="checkbox" class="ml-clause-cb" style="accent-color:#3b82f6;width:15px;height:15px;"/></td>' +
                '<td style="padding:12px;font-family:monospace;font-size:11px;font-weight:700;color:#7c3aed;white-space:nowrap;">' + m.clauseId + '</td>' +
                '<td style="padding:12px;font-size:11px;color:#4b5563;line-height:1.5;">' + m.clauseName + '</td>' +
                '<td style="padding:12px;">' + m.tags.split(',').map(function(t){ return '<span style="background:#e0f2fe;color:#0369a1;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;margin-right:3px;white-space:nowrap;">' + t.trim() + '</span>'; }).join('') + '</td>' +
                '<td style="padding:12px;white-space:nowrap;"><span style="background:' + sc + ';padding:3px 10px;border-radius:4px;font-size:10px;font-weight:700;">' + m.status + '</span></td>' +
                '<td style="padding:12px;"><button onclick="document.getElementById(\'ml-mapped-clauses-modal\').remove();showToast(\'Clause ' + m.clauseId + ' unmapped.\',\'success\')" style="padding:3px 10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer;">Unmap</button></td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="dr-modal-foot" style="justify-content:space-between;">' +
        '<button class="dr-btn dr-btn-ghost" style="font-size:11px;color:#dc2626;border-color:#fca5a5;" onclick="showToast(\'Selected clauses unmapped.\',\'success\')">Unmap Selected</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-mapped-clauses-modal\').remove()">Close</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}
window._mlOpenMapObligationPopup = function(oblId) {
  _mlOpenMappedClausesPopup(oblId);
}

window._mlBuildHierBodyHtml = function(c) {
  var depts = c.departments || [];
  var rows = [
    ['Regulator',      c.regulator    || '\u2014'],
    ['Type',           c.type         || '\u2014'],
    ['Risk Level',     c.risk
      ? '<span class="ml-risk-badge ml-risk-' + c.risk.toLowerCase() + '">' + c.risk + '</span>'
      : '\u2014'],
    ['Issued Date',    c.issuedDate   || '\u2014'],
    ['Effective Date', c.effectiveDate|| '\u2014'],
    ['Due Date',       c.dueDate      || '\u2014'],
  ];

  return (
    '<div class="ml-hier-body-inner">' +
      '<div class="ml-detail-grid">' +
        rows.map(function(r) {
          return (
            '<div class="ml-detail-row">' +
              '<span class="ml-detail-label">' + r[0] + '</span>' +
              '<span class="ml-detail-value">'  + r[1] + '</span>' +
            '</div>'
          );
        }).join('') +
        '<div class="ml-detail-row ml-detail-row-full ml-dept-row">' +
          '<span class="ml-detail-label">Departments</span>' +
          '<div class="ml-dept-row-inner">' +
            '<span class="ml-dept-tags">' +
              (depts.length
                ? depts.map(function(d) { return '<span class="ml-dept-tag">' + d + '</span>'; }).join('')
                : '\u2014') +
            '</span>' +
            '<button class="dr-btn dr-btn-sec ml-view-details-btn" onclick="renderAISuggestionPage(\'' + c.id + '\')">&#x2197;&nbsp; View Details</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

window._mlUpdateStatus = function(idx, newStatus) {
  window._mlActionItems[idx].status = newStatus;
  if (window._mlActiveView === 'hierarchical') _mlRenderHierCards(_mlGetFilteredCircs());
  else _mlRenderTable(CMS_DATA.circulars);
  showToast('Status updated to ' + newStatus + '.', 'success');
}

window._mlSaveAssignee = function(idx) {
  var checked = document.querySelector('#ml-assignee-selector-modal input[type="radio"]:checked');
  if (checked) {
    window._mlActionItems[idx].assignedTo = checked.value;
    if (window._mlActiveView === 'hierarchical') _mlRenderHierCards(_mlGetFilteredCircs());
    else _mlRenderTable(CMS_DATA.circulars);
  }
  document.getElementById('ml-assignee-selector-modal').remove();
  showToast('Assignee updated.', 'success');
}

window._mlSaveDepartment = function(idx) {
  var checked = document.querySelectorAll('#ml-dept-selector-modal input[type="checkbox"]:checked');
  var depts = Array.from(checked).map(function(cb){ return cb.value; });
  if (depts.length) {
    window._mlActionItems[idx].department = depts.join(', ');
    var task = CMS_DATA.tasks.find(function(t){ return t.id === window._mlActionItems[idx].actionId; });
    if (task) task.department = depts.join(', ');
    if (window._mlActiveView === 'hierarchical') _mlRenderHierCards(_mlGetFilteredCircs());
    else _mlRenderTable(CMS_DATA.circulars);
  }
  document.getElementById('ml-dept-selector-modal').remove();
  showToast('Department updated.', 'success');
}