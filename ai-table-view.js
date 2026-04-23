/* ── Table view ── */
window._mlShowTableView = function () {
  window._mlActiveView = 'table';
  var area = document.getElementById('ml-view-area');
  if (!area) return;

  area.innerHTML =
    _mlBuildFilterBar() +
    '<div class="table-card ml-table-card">' +
      '<div class="ml-tbl-toolbar">' +
        '<span class="ml-tbl-count" id="ml-action-count"></span>' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
                  '<div class="ml-row-kebab-wrap" id="ml-toolbar-kebab-wrap">' +
            '<button class="ml-row-kebab-btn" id="ml-toolbar-kebab-btn" style="width:32px;height:32px;font-size:18px;">&#x22EE;</button>' +
            '<div class="ml-row-kebab-menu" id="ml-toolbar-kebab-menu" style="display:none;right:0;top:calc(100% + 4px);">' +
              '<button class="ml-rkm-item" id="ml-toolbar-add-obl-btn">+ Add Obligation</button>' +
              '<button class="ml-rkm-item" id="ml-toolbar-add-btn">+ Add Action</button>' +
              '<button class="ml-rkm-item" id="ml-dl-template-btn">&#x1F4E5; Export / Download</button>' +
              '<label class="ml-rkm-item" style="cursor:pointer;">&#x1F4E4; Import Excel<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" id="ml-excel-upload"/></label>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="table-wrapper">' +
        '<table>' +
          '<thead><tr>' +
            '<th>Obl ID</th>' +
            '<th>Obligation</th>' +
            '<th>Action</th>' +
            '<th>Department(s)</th>' +
            '<th>Assigned To</th>' +
            '<th>Assignment Status</th>' +
            '<th>Due Date</th>' +
          '</tr></thead>' +
          '<tbody id="ml-tbody"></tbody>' +
        '</table>' +
      '</div>' +
    '</div>';

  _mlRenderTable(_mlGetFilteredCircs());
  _mlBindFilterBar();

  /* toolbar kebab toggle */
  var tkBtn  = document.getElementById('ml-toolbar-kebab-btn');
  var tkMenu = document.getElementById('ml-toolbar-kebab-menu');
  if (tkBtn && tkMenu) {
    tkBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      tkMenu.style.display = tkMenu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', function() { tkMenu.style.display = 'none'; });
  }

  var dlBtn = document.getElementById('ml-dl-template-btn');
  if (dlBtn) dlBtn.addEventListener('click', function() {
    tkMenu.style.display = 'none';
    _mlOpenExportPopup();
  });

  var addOblBtn = document.getElementById('ml-toolbar-add-obl-btn');
  if (addOblBtn) addOblBtn.addEventListener('click', function() {
    tkMenu.style.display = 'none';
    _mlOpenAddObligationPopup();
  });

  var addBtn = document.getElementById('ml-toolbar-add-btn');
  if (addBtn) addBtn.addEventListener('click', function() {
    tkMenu.style.display = 'none';
    _mlOpenAddActionPopup('', '');
  });

  var upBtn = document.getElementById('ml-excel-upload');
  if (upBtn) upBtn.addEventListener('change', function() {
    showToast('Excel uploaded. Processing action items...', 'success');
  });
}



window._mlExtractActionItems = function(circs) {
  if (!CMS_DATA || !CMS_DATA.circulars) return [];

  var items = [];

  circs.forEach(function(circ) {
    var sections = (circ.chapters || []).concat(circ.annexures || []);

    sections.forEach(function(ch) {
      (ch.clauses || []).forEach(function(cl) {
        if (!cl.id) return;

        // Normalize obligations
        var obligs = Array.isArray(cl.obligations) ? cl.obligations
          : Array.isArray(cl.obligation) ? cl.obligation
          : typeof cl.obligation === 'string' && cl.obligation ? [cl.obligation]
          : typeof cl.obligations === 'string' && cl.obligations ? [cl.obligations]
          : [];

        // Normalize actionables
        var acts = Array.isArray(cl.actionables) ? cl.actionables
          : Array.isArray(cl.actionable) ? cl.actionable
          : typeof cl.actionables === 'string' ? cl.actionables.split(';').map(function(a){ return a.trim(); }).filter(Boolean)
          : typeof cl.actionable === 'string' ? cl.actionable.split(';').map(function(a){ return a.trim(); }).filter(Boolean)
          : [];

        if (!obligs.length) return;

       obligs.forEach(function(ob, oi) {
  var oblText = typeof ob === 'string' ? ob : (ob.text || ob.name || '');
  var obId    = (typeof ob === 'object' && ob.id) ? ob.id : ('OBL-' + cl.id + '-' + (oi + 1));

  if (acts.length > 0) {
    acts.forEach(function(act, ai) {
      var actText = typeof act === 'string' ? act : (act.text || String(act));
      var computedId = circ.id + '-' + cl.id + '-OB' + (oi + 1) + '-A' + (ai + 1);

      // Match task by exact actionId first, then fall back to clauseRef
      var matchingTask = null;
      if (CMS_DATA.tasks) {
        matchingTask = CMS_DATA.tasks.find(function(t) {
          return t.id === computedId || (t.circularId === circ.id && t.clauseRef === cl.id);
        });
      }

      items.push({
        actionId:       computedId,
        action:         matchingTask && matchingTask.title ? matchingTask.title : actText,
        department:     (matchingTask ? matchingTask.department : cl.department) || '',
        status:         (matchingTask ? matchingTask.status : cl.status) || 'Assigned',
        assignedTo:     (matchingTask && matchingTask.assignee && (typeof matchingTask.assignee === 'object' ? Object.keys(matchingTask.assignee).length : matchingTask.assignee)) ? matchingTask.assignee : {},
        tags:           (matchingTask ? matchingTask.tags : []) || [],
        risk:           (matchingTask ? (matchingTask.risk || matchingTask.priority) : cl.risk) || 'Medium',
        obligationId:   obId,
        obligationName: oblText,
        clauseId:       cl.id,
        circId:         circ.id,
        circTitle:      circ.title || '',
        dueDate:        (matchingTask ? matchingTask.dueDate : cl.dueDate) || '',
        frequency:      (matchingTask ? matchingTask.frequency : '') || 'Monthly',
        chapterTitle:   ch.title || ''
      });
    });
  } else {
    var computedId = circ.id + '-' + cl.id + '-OB' + (oi + 1) + '-A1';
    var matchingTask = null;
    if (CMS_DATA.tasks) {
      matchingTask = CMS_DATA.tasks.find(function(t) {
        return t.id === computedId || (t.circularId === circ.id && t.clauseRef === cl.id);
      });
    }
    items.push({
      actionId:       computedId,
      action:         matchingTask && matchingTask.title ? matchingTask.title : '',
      department:     (matchingTask ? matchingTask.department : cl.department) || '',
      status:         (matchingTask ? matchingTask.status : cl.status) || 'Assigned',
      assignedTo:     (matchingTask && matchingTask.assignee) ? matchingTask.assignee : {},
      tags:           (matchingTask ? matchingTask.tags : []) || [],
      risk:           (matchingTask ? (matchingTask.risk || matchingTask.priority) : cl.risk) || 'Medium',
      obligationId:   obId,
      obligationName: oblText,
      clauseId:       cl.id,
      circId:         circ.id,
      circTitle:      circ.title || '',
      dueDate:        (matchingTask ? matchingTask.dueDate : cl.dueDate) || '',
      frequency:      (matchingTask ? matchingTask.frequency : '') || 'Monthly',
      chapterTitle:   ch.title || ''
    });
  }
});
      });
    });
  });

  return items;
};

  

window._mlRenderTable= function(circs) {
  var tbody   = document.getElementById('ml-tbody');
  var countEl = document.getElementById('ml-action-count');
  if (!tbody) return;

  var items = _mlExtractActionItems(circs);
  if (countEl) countEl.textContent = items.length + ' action item' + (items.length !== 1 ? 's' : '');

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px 16px;color:var(--dr-t3);font-style:italic;">No action items match your filters</td></tr>';
    return;
  }

  var statusColors = { 
  'Open':'#fef3c7;color:#b45309', 
  'In Progress':'#e0f2fe;color:#0369a1', 
  'Complete':'#dcfce7;color:#15803d', 
  'Assigned':'#ede9fe;color:#5b5fcf',
  'Pending':'#fef3c7;color:#b45309',
  'Compliant':'#dcfce7;color:#15803d',
  'Unassigned':'#f3f4f6;color:#6b7280',
  'Overdue':'#fee2e2;color:#991b1b',
  'NA':'#f3f4f6;color:#6b7280'
};

  tbody.innerHTML = items.map(function(item, idx) {
    var sc = statusColors[item.status] || '#f3f4f6;color:#6b7280';
    return '<tr class="ml-action-row" data-idx="' + idx + '" style="cursor:pointer;">' +
      '<td style="position:relative;">' +
      '<span class="ml-obl-id ml-clickable-oblid" data-oblid="' + item.obligationId + '" style="cursor:pointer;font-family:monospace;font-size:11px;font-weight:700;color:#7c3aed;background:#f5f3ff;border:1px solid #e9d5ff;padding:2px 7px;border-radius:4px;" title="View obligation details">' + item.obligationId + '</span>' +
      '</td>' +
      '<td style="max-width:220px;padding:8px;">' +
        '<div style="font-size:11px;color:#374151;line-height:1.45;" title="' + item.obligationName.replace(/"/g,'&quot;') + '">' +
          item.obligationName.substring(0, 60) + (item.obligationName.length > 60 ? '..' : '') +
        '</div>' +
      '</td>' +
      '<td style="max-width:280px;font-size:12px;color:var(--dr-t1);cursor:pointer;" class="ml-clickable-action" data-idx="' + idx + '">' + (item.action||'').substring(0,80) + ((item.action||'').length>80?'…':'') + '</td>' +
'<td class="ml-inline-dept" data-idx="' + idx + '" style="cursor:pointer;padding:6px 8px;border-radius:4px;transition:background 0.2s;" title="Click to assign departments">' +
  (item.department
  ? item.department.split(',').map(function(d){ return '<span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:600;display:inline-block;margin:1px;">' + d.trim() + '</span>'; }).join('')
  : '<span style="color:#9ca3af;font-style:italic;">Assign</span>') +
'</td>' +
'<td class="ml-inline-assignee" data-idx="' + idx + '" style="cursor:pointer;padding:6px 8px;border-radius:4px;transition:background 0.2s;" title="Click to assign">' +
  (function() {
    var a = item.assignedTo;
    var empty = !a ||
      (typeof a === 'string' && !a.trim()) ||
      (typeof a === 'object' && !Array.isArray(a) && Object.keys(a).length === 0);
    if (empty) return '<span style="color:#9ca3af;font-style:italic;font-size:12px;">Assign</span>';
    if (typeof a === 'string' && a.trim()) {
      return '<span style="background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">' + a + '</span>';
    }
    return Object.entries(a).map(function(entry) {
      return '<div style="display:flex;align-items:center;gap:4px;margin:2px 0;">' +
        '<span style="font-size:9px;color:#6b7280;background:#f3f4f6;padding:1px 5px;border-radius:3px;min-width:52px;text-align:center;">' + entry[0] + '</span>' +
        '<span style="background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">' + entry[1] + '</span>' +
      '</div>';
    }).join('');
  })() +
'</td>' +
      '<td class="ml-inline-status" data-idx="' + idx + '" style="cursor:pointer;padding:4px 0;transition:opacity 0.2s;" title="Click to change status">' +
  '<span style="padding:4px 12px;border-radius:12px;font-size:11px;font-weight:700;background:' + sc + ';cursor:pointer;">' + item.status + '</span>' +
'</td>' +
'<td style="font-size:12px;color:#374151;">' + (item.dueDate || '—') + '</td>'
    '</tr>';
  }).join('');

  window._mlActionItems = items;

  tbody.querySelectorAll('.ml-clickable-oblid').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(el.closest('tr').dataset.idx);
      _mlOpenOblDetailPopup(window._mlActionItems[idx], idx);
    });
  });

  tbody.querySelectorAll('.ml-clickable-action').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(el.dataset.idx);
      _mlOpenDetailPopup(window._mlActionItems[idx], idx);
    });
  });


 // Department column click handler
  tbody.querySelectorAll('.ml-inline-dept').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(cell.dataset.idx);
      _mlOpenDepartmentSelector(idx);
    });
    cell.addEventListener('mouseenter', function() {
      this.style.background = '#f3f4f6';
    });
    cell.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
    });
  });

  // Assigned To column click handler
  tbody.querySelectorAll('.ml-inline-assignee').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(cell.dataset.idx);
      _mlOpenAssigneeSelector(idx);
    });
    cell.addEventListener('mouseenter', function() {
      this.style.background = '#f3f4f6';
    });
    cell.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
    });
  });

  // Status column click handler
  tbody.querySelectorAll('.ml-inline-status').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(cell.dataset.idx);
      _mlOpenStatusDropdown(idx);
    });
  });


}

window._mlOpenDetailPopup = function (item, idx) {
  var existing = document.getElementById('ml-detail-modal');
  if (existing) existing.remove();
var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-detail-modal';
  var circular = CMS_DATA.circulars.find(function(c) { return c.id === item.circId; }) || {};
  var obligation = (CMS_DATA.obligations || []).find(function(o){ return o.id === item.obligationId; }) || {};
  var task = CMS_DATA.tasks.find(function(t){ return t.id === item.actionId; }) || {};
  var clauseText = obligation.clauseText || task.clauseText || 'The entity shall ensure compliance with all reporting requirements as specified under the relevant circular, including timely submission of returns and maintenance of records as directed by the regulatory authority.';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:680px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
'<div class="dr-modal-subject">' + item.actionId + '</div>' +
'<div style="font-size:12px;color:#6b7280;margin-top:3px;font-weight:500;">' + (item.action||'') + '</div>' +        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div class="ml-row-kebab-wrap">' +
            '<button class="ml-row-kebab-btn" id="ml-detail-kebab">&#x22EE;</button>' +
            '<div class="ml-row-kebab-menu" id="ml-rkm-' + idx + '" style="display:none;">' +

      '<button class="ml-rkm-item" data-action="edit" data-idx="' + idx + '">&#x270E; Edit</button>' +
      '<button class="ml-rkm-item" data-action="mapped" data-idx="' + idx + '">&#x21C4; Mapped Actions</button>' +
      '<button class="ml-rkm-item" data-action="add" data-idx="' + idx + '">+ Add Action</button>' +
    '</div>' +
          '</div>' +
          '<button class="dr-modal-close" onclick="document.getElementById(\'ml-detail-modal\').remove()">&#x2715;</button>' +
        '</div>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:0;">' +

        '<div style="padding:12px 20px;border-bottom:1px solid #e5e7eb;background:#fff;">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            _mlDetailField('Internal Due Date', circular.issuedDate || circular.issueDate || '—') +
            _mlDetailField('External Due Date', item.dueDate || '—') +
            // _mlDetailField('Effective Date', circular.effectiveDate || '—') +
            _mlDetailField('Frequency', task.frequency || item.frequency || 'Monthly') +
            _mlDetailField('Status', '<span style="font-weight:600;font-size:11px;cursor:pointer;" onclick="_mlOpenStatusDropdown(' + idx + '); return false;">' + (item.status || 'Assigned') + '</span>') +
            _mlDetailField('Department', item.department || '—') +
            _mlDetailField('Assigned To', (function() {
  var a = item.assignedTo;
  if (!a || (typeof a === 'object' && !Object.keys(a).length)) return '—';
  if (typeof a === 'string') return a;
  return Object.entries(a).map(function(e) {
    return '<span style="display:inline-flex;align-items:center;gap:4px;margin:1px 2px;">' +
      '<span style="font-size:9px;color:#6b7280;background:#f3f4f6;padding:1px 5px;border-radius:3px;">' + e[0] + '</span>' +
      '<span style="background:#ede9fe;color:#5b21b6;padding:2px 7px;border-radius:12px;font-size:11px;font-weight:600;">' + e[1] + '</span>' +
    '</span>';
  }).join('');
})()) +
          '</div>' +
        '</div>' +

        '<div style="padding:0;border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border-bottom:1px solid #e5e7eb;" onclick="var el=document.getElementById(\'ml-evidence-details\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Evidence</span>' +
          '</div>' +
          '<div id="ml-evidence-details" style="padding:16px 20px;display:none;">' +
            '<ul style="margin:0;padding:0 0 0 16px;">' +
              (item.evidence && item.evidence.length ? item.evidence : ['1. Submit signed compliance certificate', '2. Upload board resolution copy', '3. Attach latest audit report']).map(function(e){ return '<li style="font-size:12px;color:#374151;margin-bottom:6px;">' + e + '</li>'; }).join('') +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div style="padding:0;border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border-bottom:1px solid #e5e7eb;" onclick="var el=document.getElementById(\'ml-basic-details\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Obligation Details</span>' +
          '</div>' +
          '<div id="ml-basic-details" style="padding:20px;display:none;">' +
            '<div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:12px;">' +
              _mlDetailField('Obligation', '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;"><div style="flex:1;">' + (obligation.name || obligation.title || 'Ensure timely submission of it') + '</div><button class="dr-btn dr-btn-sec" style="font-size:11px;padding:4px 10px;white-space:nowrap;" onclick="renderAISuggestionPage(\'' + item.circId + '\')">📄 View Page</button></div>', true) +
              _mlDetailField('Tags', (item.tags && item.tags.length ? item.tags.join(', ') : 'Compliance, Reporting')) +
              _mlDetailField('Effective Date', circular.effectiveDate || '—') +
              _mlDetailField('Due Date', item.dueDate || '—') +
              _mlDetailField('Frequency', task.frequency || item.frequency || 'Monthly') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="padding:0;border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border-bottom:1px solid #e5e7eb;" onclick="var el=document.getElementById(\'ml-clause-details\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Extracted Clause Description</span>' +
          '</div>' +
          '<div id="ml-clause-details" style="padding:16px 20px;display:none;">' +
            '<div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:14px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Clause Text</div>' +
              '<div style="font-size:13px;color:#1f2937;line-height:1.7;">' + clauseText + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="padding:0;border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border-bottom:1px solid #e5e7eb;" onclick="var el=document.getElementById(\'ml-reg-details\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▼</span> Regulatory Details</span>' +
          '</div>' +
          '<div id="ml-reg-details" style="padding:16px 20px;display:block;">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
              _mlDetailField('Act Name', circular.actName || 'Banking Regulation Act, 1949') +
              _mlDetailField('Legislative Area', circular.legislativeArea || 'Financial Services') +
              _mlDetailField('Sub-Section', circular.subSection || 'Section 35A') +
              _mlDetailField('Regulatory Body', circular.regulator || 'Reserve Bank of India') +
            '</div>' +
            '<button class="dr-btn" style="font-size:11px;padding:6px 12px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;margin-top:8px;" onclick="alert(\'Viewing circular: ' + item.circId + '\');">&#x1F4C4; View Complete Circular</button>' +
          '</div>' +
        '</div>' +
        
      '</div>' +
      '<div class="dr-modal-foot">' +
        '<span class="dr-modal-foot-note">Circular: ' + ((circular.title||'').substring(0,50)) + '</span>' +
        '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-detail-modal\').remove()">Close</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  window._mlDetailItem = item;
  window._mlDetailIdx = idx;
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
  var kbtn = document.getElementById('ml-detail-kebab');
  var kmenu = document.getElementById('ml-rkm-' + idx);
  if (kbtn && kmenu) {
    kbtn.addEventListener('click', function(e){
      e.stopPropagation();
      kmenu.style.display = kmenu.style.display === 'none' ? 'block' : 'none';
    });
    // Wire up the menu item buttons
    kmenu.querySelectorAll('.ml-rkm-item').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        kmenu.style.display = 'none';
        if (btn.dataset.action === 'edit') _mlOpenEditablePopup(window._mlDetailItem, window._mlDetailIdx);
        else if (btn.dataset.action === 'mapped') _mlOpenMappedActionsPopup(window._mlDetailItem);
        else if (btn.dataset.action === 'add') _mlOpenAddActionPopup(window._mlDetailItem.obligationId, window._mlDetailItem.actionId);
      });
    });
  }
}

/* ── EXPORT POPUP ── */
window._mlOpenExportPopup = function() {
  var ex = document.getElementById('ml-export-modal'); if (ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-export-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:420px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Export / Import</div><div class="dr-modal-subject">Action Items Data</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-export-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:20px;display:flex;flex-direction:column;gap:12px;">' +
        '<button class="dr-btn dr-btn-sec" style="width:100%;justify-content:flex-start;gap:10px;padding:12px 16px;" onclick="_mlDownloadTemplate()">&#x1F4E5; Download Template CSV</button>' +
        '<button class="dr-btn dr-btn-sec" style="width:100%;justify-content:flex-start;gap:10px;padding:12px 16px;" onclick="_mlExportCurrentData()">&#x1F4CA; Export Current Data</button>' +
        '<label class="dr-btn dr-btn-sec" style="width:100%;justify-content:flex-start;gap:10px;padding:12px 16px;cursor:pointer;">&#x1F4E4; Upload Excel<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast(\'Excel uploaded. Processing...\',\'success\');document.getElementById(\'ml-export-modal\').remove();"/></label>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};
window._mlDownloadTemplate = function() {
  var csv = 'Obl ID,Obligation Name,Action ID,Action,Department,Assigned To,Status,Due Date\n';
  csv += 'OBL-001,Sample obligation,ACT-001,Sample action,Compliance,John Doe,Assigned,2025-03-31\n';
  var blob = new Blob([csv],{type:'text/csv'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'action-items-template.csv'; a.click();
  document.getElementById('ml-export-modal').remove();
};
window._mlExportCurrentData = function() {
  var items = window._mlActionItems || [];
  var csv = 'Obl ID,Obligation Name,Action ID,Action,Department,Assigned To,Status,Due Date\n';
  items.forEach(function(i){ csv += [i.obligationId,'"'+i.obligationName+'"',i.actionId,'"'+i.action+'"',i.department,i.assignedTo,i.status,i.dueDate].join(',') + '\n'; });
  var blob = new Blob([csv],{type:'text/csv'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'action-items-export.csv'; a.click();
  document.getElementById('ml-export-modal').remove();
};

/* ── ADD OBLIGATION POPUP ── */
window._mlOpenAddObligationPopup = function() {
  var ex = document.getElementById('ml-add-obl-modal'); if (ex) ex.remove();
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit'];
  var freqOptions = ['Monthly','Quarterly','Annually','Ad-hoc','As per Regulation'];
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-add-obl-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:560px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Add Obligation</div><div class="dr-modal-subject">New Obligation Entry</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-add-obl-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:20px;display:flex;flex-direction:column;gap:14px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Obligation ID</label><input type="text" id="ml-new-obl-id" placeholder="OBL-XXX" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Circular</label><select id="ml-new-obl-circ" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;background:white;">' + (CMS_DATA.circulars||[]).map(function(c){ return '<option value="'+c.id+'">'+c.id+'</option>'; }).join('') + '</select></div>' +
        '</div>' +
        '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Obligation Name <span style="color:#ef4444;">*</span></label><textarea id="ml-new-obl-name" placeholder="Describe the obligation…" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;min-height:70px;font-family:inherit;resize:vertical;"></textarea></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Clause ID</label><input type="text" id="ml-new-obl-clauseid" placeholder="e.g. 1.1" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Department</label><select id="ml-new-obl-dept" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;background:white;"><option value="">Select</option>' + allDepts.map(function(d){ return '<option>'+d+'</option>'; }).join('') + '</select></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Frequency</label><select id="ml-new-obl-freq" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;background:white;">' + freqOptions.map(function(f){ return '<option>'+f+'</option>'; }).join('') + '</select></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Due Date</label><input type="date" id="ml-new-obl-due" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Section</label><input type="text" id="ml-new-obl-section" placeholder="e.g. Section 12" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Sub-Section</label><input type="text" id="ml-new-obl-subsec" placeholder="e.g. Clause (a)" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
        '</div>' +
      '</div>' +
      '<div class="dr-modal-foot"><button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-add-obl-modal\').remove()">Cancel</button><button class="dr-btn dr-btn-pri" onclick="_mlSaveNewObligation()">Save Obligation</button></div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};
window._mlSaveNewObligation = function() {
  var name = document.getElementById('ml-new-obl-name').value.trim();
  if (!name) { showToast('Obligation name is required.','error'); return; }
  var id = document.getElementById('ml-new-obl-id').value.trim() || ('OBL-' + (Date.now()+'').slice(-4));
  showToast('Obligation ' + id + ' added.','success');
  document.getElementById('ml-add-obl-modal').remove();
};

/* ── OBLIGATION DETAIL POPUP ── */
window._mlOpenOblDetailPopup = function(item, idx) {
  var ex = document.getElementById('ml-obl-detail-modal'); if (ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-obl-detail-modal';
  var circular = (CMS_DATA.circulars||[]).find(function(c){ return c.id === item.circId; }) || {};

  /* actions belonging to this obligation */
  var relatedActions = (window._mlActionItems||[]).filter(function(a){ return a.obligationId === item.obligationId; });

  var statusColors = {'Open':'#fef3c7;color:#b45309','In Progress':'#e0f2fe;color:#0369a1','Complete':'#dcfce7;color:#15803d','Assigned':'#ede9fe;color:#5b5fcf','Pending':'#fef3c7;color:#b45309','Compliant':'#dcfce7;color:#15803d','Unassigned':'#f3f4f6;color:#6b7280','Overdue':'#fee2e2;color:#991b1b','NA':'#f3f4f6;color:#6b7280'};

  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:700px;">' +
      /* ── HEADER ── */
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
            '<span style="font-family:monospace;font-size:12px;font-weight:800;color:#7c3aed;background:#f5f3ff;border:1px solid #e9d5ff;padding:3px 9px;border-radius:5px;">' + item.obligationId + '</span>' +
          '</div>' +
          '<div style="font-size:13px;font-weight:600;color:#1f2937;max-width:450px;line-height:1.4;">' + item.obligationName + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div class="ml-row-kebab-wrap">' +
            '<button class="ml-row-kebab-btn" id="ml-obl-kebab-btn">&#x22EE;</button>' +
            '<div class="ml-row-kebab-menu" id="ml-obl-kebab-menu" style="display:none;">' +
              '<button class="ml-rkm-item" onclick="document.getElementById(\'ml-obl-kebab-menu\').style.display=\'none\';_mlEnableOblEdit()">&#x270E; Edit</button>' +
              '<button class="ml-rkm-item" onclick="document.getElementById(\'ml-obl-kebab-menu\').style.display=\'none\';_mlOpenMappedClausesPopup(\'' + item.obligationId + '\')">&#x21C4; Mapped Obligations</button>' +
              '<button class="ml-rkm-item" onclick="document.getElementById(\'ml-obl-kebab-menu\').style.display=\'none\';document.getElementById(\'ml-obl-detail-modal\').remove();_mlOpenAddActionPopup(\'' + item.obligationId + '\',\'\')">+ Add Action</button>' +
            '</div>' +
          '</div>' +
          '<button class="dr-modal-close" onclick="document.getElementById(\'ml-obl-detail-modal\').remove()">&#x2715;</button>' +
        '</div>' +
      '</div>' +

      /* ── BODY ── */
      '<div class="dr-modal-body" style="padding:0;max-height:72vh;overflow-y:auto;">' +

        /* meta grid */
        '<div style="padding:14px 20px;border-bottom:1px solid #e5e7eb;background:#fff;">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;" id="ml-obl-meta-grid">' +
            _mlOblField('Due Date',        item.dueDate || '—',                    'ml-obl-f-due') +
            _mlOblField('Effective Date',  circular.effectiveDate || '—',          'ml-obl-f-eff') +
            _mlOblField('Frequency',       item.frequency || 'Monthly',             'ml-obl-f-freq') +
            _mlOblField('Section',         circular.section || 'Section 12',        'ml-obl-f-sec') +
            _mlOblField('Sub-Section',     circular.subSection || 'Clause (a)',     'ml-obl-f-subsec') +
            _mlOblField('Department',      item.department || '—',                  'ml-obl-f-dept') +
            _mlOblField('Status',          item.status || '—',                      'ml-obl-f-status') +
            _mlOblField('Assigned To',     item.assignedTo || '—',                  'ml-obl-f-assignee') +
          '</div>' +
        '</div>' +

        /* ACTION ITEMS accordion */
        '<div style="border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;" onclick="var el=document.getElementById(\'ml-obl-actions-body\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▼</span> Action Items <span style="background:#e0f2fe;color:#0369a1;padding:1px 8px;border-radius:10px;font-size:10px;font-weight:700;">' + relatedActions.length + '</span></span>' +
          '</div>' +
          '<div id="ml-obl-actions-body" style="display:block;">' +
            (relatedActions.length ? (
              '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
                '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
                  '<th style="padding:9px 12px;text-align:left;font-weight:700;color:#374151;">Action ID</th>' +
                  '<th style="padding:9px 12px;text-align:left;font-weight:700;color:#374151;">Action</th>' +
                  '<th style="padding:9px 12px;text-align:left;font-weight:700;color:#374151;">Dept</th>' +
                  '<th style="padding:9px 12px;text-align:left;font-weight:700;color:#374151;">Status</th>' +
                '</tr></thead>' +
                '<tbody>' +
                relatedActions.map(function(a, ai) {
                  var sc = statusColors[a.status] || '#f3f4f6;color:#6b7280';
                  return '<tr style="border-bottom:1px solid #f3f4f6;">' +
                    '<td style="padding:9px 12px;"><span class="ml-obl-action-link" data-idx="' + window._mlActionItems.indexOf(a) + '" style="font-family:monospace;font-size:11px;font-weight:700;color:#3b82f6;cursor:pointer;text-decoration:underline;">' + a.actionId + '</span></td>' +
                    '<td style="padding:9px 12px;font-size:11px;color:#374151;max-width:220px;">' + (a.action||'').substring(0,60) + (a.action.length>60?'…':'') + '</td>' +
                    '<td style="padding:9px 12px;font-size:11px;color:#6b7280;">' + (a.department||'—') + '</td>' +
                    '<td style="padding:9px 12px;"><span style="padding:3px 9px;border-radius:10px;font-size:10px;font-weight:700;background:' + sc + ';">' + a.status + '</span></td>' +
                  '</tr>';
                }).join('') +
                '</tbody></table>'
            ) : '<div style="padding:16px 20px;font-size:12px;color:#9ca3af;font-style:italic;">No action items linked to this obligation.</div>') +
          '</div>' +
        '</div>' +

        /* EXTRACTED CLAUSE DESCRIPTION accordion */
        '<div style="border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;" onclick="var el=document.getElementById(\'ml-obl-clause-body\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Extracted Clause Description</span>' +
          '</div>' +
          '<div id="ml-obl-clause-body" style="display:none;padding:16px 20px;">' +
            '<div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:14px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Clause Text</div>' +
              '<div style="font-size:13px;color:#1f2937;line-height:1.7;">The entity shall ensure compliance with all reporting requirements as specified under the relevant circular, including timely submission of returns and maintenance of records as directed by the regulatory authority.</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* REGULATORY DETAILS accordion */
        '<div>' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;" onclick="var el=document.getElementById(\'ml-obl-reg-body\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▼</span> Regulatory Details</span>' +
          '</div>' +
          '<div id="ml-obl-reg-body" style="display:block;padding:16px 20px;">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
              _mlOblField('Act Name',        circular.actName || 'Banking Regulation Act, 1949', '') +
              _mlOblField('Legislative Area', circular.legislativeArea || 'Financial Services', '') +
              _mlOblField('Sub-Section',     circular.subSection || 'Section 35A', '') +
              _mlOblField('Regulatory Body', circular.regulator || 'Reserve Bank of India', '') +
            '</div>' +
          '</div>' +
        '</div>' +

      '</div>' +
      '<div class="dr-modal-foot"><span class="dr-modal-foot-note">Circular: ' + ((circular.title||'').substring(0,50)) + '</span><button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-obl-detail-modal\').remove()">Close</button></div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

  /* kebab toggle */
  var kb = document.getElementById('ml-obl-kebab-btn');
  var km = document.getElementById('ml-obl-kebab-menu');
  if (kb && km) {
    kb.addEventListener('click', function(e){ e.stopPropagation(); km.style.display = km.style.display==='none'?'block':'none'; });
    document.addEventListener('click', function(){ km.style.display='none'; });
  }

  /* action ID links inside table → open action detail popup */
  overlay.querySelectorAll('.ml-obl-action-link').forEach(function(el){
    el.addEventListener('click', function(e){
      e.stopPropagation();
      var ai = parseInt(el.dataset.idx);
      if (!isNaN(ai)) _mlOpenDetailPopup(window._mlActionItems[ai], ai);
    });
  });
};

/* helper field for obl popup */
window._mlOblField = function(label, value, id) {
  return '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;"' + (id ? ' id="'+id+'"' : '') + '>' +
    '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">' + label + '</div>' +
    '<div class="ml-obl-field-val" style="font-size:12px;font-weight:600;color:#1f2937;">' + value + '</div>' +
  '</div>';
};

/* enable edit mode for obl popup */
window._mlEnableOblEdit = function() {
  var grid = document.getElementById('ml-obl-meta-grid');
  if (!grid) return;
  grid.querySelectorAll('.ml-obl-field-val').forEach(function(el){
    el.contentEditable = 'true';
    el.style.outline = '1.5px dashed #bfdbfe';
    el.style.borderRadius = '3px';
    el.style.padding = '2px 4px';
    el.style.background = '#fff';
  });
  showToast('Fields are now editable. Click outside a field when done.','info');
};

/* mapped clauses popup (for obl detail kebab) */
window._mlOpenMappedClausesPopup = function(oblId) {
  var ex = document.getElementById('ml-mapped-clauses-modal'); if(ex) ex.remove();
  var mockClauses = [
    { clauseId:'1.1', clauseText:'The entity shall maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.', dept:'Compliance', status:'Assigned' },
    { clauseId:'2.3', clauseText:'All LTV calculations must exclude stamp duty and registration charges from the property valuation.', dept:'Risk', status:'Pending' },
  ];
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-mapped-clauses-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:680px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Mapped Obligations</div><div class="dr-modal-subject">Obligation: ' + oblId + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-mapped-clauses-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:0;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;"><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Clause ID</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Clause Text</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Dept</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Status</th><th style="padding:10px 14px;"></th></tr></thead>' +
          '<tbody>' +
            mockClauses.map(function(c){
              return '<tr style="border-bottom:1px solid #f3f4f6;">' +
                '<td style="padding:10px 14px;font-family:monospace;font-size:11px;font-weight:700;color:#7c3aed;">' + c.clauseId + '</td>' +
                '<td style="padding:10px 14px;font-size:11px;color:#374151;max-width:260px;line-height:1.45;">' + c.clauseText.substring(0,80) + (c.clauseText.length>80?'…':'') + '</td>' +
                '<td style="padding:10px 14px;"><span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;">' + c.dept + '</span></td>' +
                '<td style="padding:10px 14px;font-size:11px;color:#6b7280;">' + c.status + '</td>' +
                '<td style="padding:10px 14px;"><button onclick="this.closest(\'tr\').style.opacity=\'0.4\';showToast(\'Unmapped.\',\'success\')" style="padding:3px 9px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer;">Unmap</button></td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="dr-modal-foot"><button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-mapped-clauses-modal\').remove()">Close</button></div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};

window._mlDetailField = function(label, value) {
  return '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;min-height:60px;">' +
    '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">' + label + '</div>' +
    '<div style="font-size:12px;font-weight:600;color:#1f2937;word-break:break-word;">' + value + '</div>' +
  '</div>';
};

// DEPRECATED - Edit functionality moved to inline editing in detail modal
// Keeping for reference only - DO NOT USE
/*
window._mlOpenEditPopup = function (item, idx) { }
window._mlSaveEdit = function(idx) { }
*/

// DEPRECATED - Replaced by _mlOpenAddActionPopup
// This function is no longer used

window._mlOpenDepartmentSelector = function(idx) {
  var item = window._mlActionItems[idx];
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement','Finance'];
  var existing = document.getElementById('ml-dept-selector-modal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-dept-selector-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:420px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Select Department</div><div class="dr-modal-subject">Action: ' + item.actionId + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-dept-selector-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:20px;">' +
        '<input type="text" id="ml-dept-search" placeholder="Search departments…" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:16px;font-size:13px;"/>' +
        '<div id="ml-dept-list" style="max-height:300px;overflow-y:auto;">' +
          allDepts.map(function(d, i) {
            return '<label style="display:flex;align-items:center;padding:10px 12px;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:8px;cursor:pointer;background:#f9fafb;transition:all 0.2s;">' +
              '<input type="checkbox" value="' + d + '" id="ml-dept-' + i + '" ' + 
  (item.department && item.department.split(',').map(function(x){return x.trim();}).indexOf(d) > -1 ? 'checked' : '') + 
  ' style="width:18px;height:18px;cursor:pointer;accent-color:#3b82f6;"/>' +
              '<span style="margin-left:10px;font-weight:500;color:#374151;flex:1;">' + d + '</span>' +
            '</label>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-dept-selector-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveDepartment(' + idx + ')">Save</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}

window._mlOpenAssigneeSelector = function(idx) {
  var item = window._mlActionItems[idx];
  var allAssignees = _mlGetUniqueAssignees();

  // Parse current depts
  var depts = item.department
    ? item.department.split(',').map(function(d){ return d.trim(); }).filter(Boolean)
    : ['General'];

  // Parse current assignees (store as object: { dept: assignee })
  var currentMap = {};
  if (typeof item.assignedTo === 'object' && !Array.isArray(item.assignedTo)) {
    currentMap = item.assignedTo;
  } else if (typeof item.assignedTo === 'string' && item.assignedTo.trim()) {
    // migrate legacy single string → assign to first dept
    currentMap[depts[0]] = item.assignedTo;
  }

  var existing = document.getElementById('ml-assignee-selector-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay';
  overlay.id = 'ml-assignee-selector-modal';

  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:460px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Assign To</div>' +
          '<div class="dr-modal-subject">Action: ' + item.actionId + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-assignee-selector-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:20px;display:flex;flex-direction:column;gap:14px;">' +
        depts.map(function(dept) {
          var currentVal = currentMap[dept] || '';
          return '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;">' +
            '<div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">' +
              '<span style="background:#e0f2fe;padding:2px 8px;border-radius:4px;">' + dept + '</span>' +
            '</div>' +
            '<select class="ml-dept-assignee-select" data-dept="' + dept + '" ' +
              'style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' +
              '<option value="">— Select assignee —</option>' +
              allAssignees.map(function(name) {
                return '<option value="' + name + '"' + (currentVal === name ? ' selected' : '') + '>' + name + '</option>';
              }).join('') +
            '</select>' +
            '<input type="text" class="ml-dept-assignee-input" data-dept="' + dept + '" placeholder="Or type a name…" value="' + currentVal + '" style="width:100%;margin-top:6px;padding:8px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-assignee-selector-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveAssignee(' + idx + ')">Save</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};

window._mlSaveAssignee = function(idx) {
  var selects = document.querySelectorAll('#ml-assignee-selector-modal .ml-dept-assignee-select');
  var assigneeMap = {};
  selects.forEach(function(sel) {
    var dept = sel.dataset.dept;
    var val = sel.value;
    if (!val) {
      // fall back to free-text input for this dept
      var inp = document.querySelector('#ml-assignee-selector-modal .ml-dept-assignee-input[data-dept="' + dept + '"]');
      if (inp && inp.value.trim()) val = inp.value.trim();
    }
    if (val) assigneeMap[dept] = val;
  });

  // Capture actionId before any re-render
  var actionId = window._mlActionItems[idx].actionId;

  window._mlActionItems[idx].assignedTo = assigneeMap;

  var task = CMS_DATA.tasks.find(function(t){ return t.id === actionId; });
  if (task) task.assignee = assigneeMap;

  document.getElementById('ml-assignee-selector-modal').remove();

  // Patch only the affected cell — no full re-render so object isn't lost
  var rows = document.querySelectorAll('#ml-tbody .ml-action-row');
  rows.forEach(function(row) {
    if (parseInt(row.dataset.idx) === idx) {
      var cell = row.querySelector('.ml-inline-assignee');
      if (!cell) return;
      var isEmpty = !assigneeMap || !Object.keys(assigneeMap).length;
      if (isEmpty) {
        cell.innerHTML = '<span style="color:#9ca3af;font-style:italic;font-size:12px;">Assign</span>';
      } else {
        cell.innerHTML = Object.entries(assigneeMap).map(function(entry) {
          return '<div style="display:flex;align-items:center;gap:4px;margin:2px 0;">' +
            '<span style="font-size:9px;color:#6b7280;background:#f3f4f6;padding:1px 5px;border-radius:3px;min-width:52px;text-align:center;">' + entry[0] + '</span>' +
            '<span style="background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">' + entry[1] + '</span>' +
          '</div>';
        }).join('');
      }
    }
  });

  // Also sync department cell in case it changed
  var rows2 = document.querySelectorAll('#ml-tbody .ml-action-row');
  rows2.forEach(function(row) {
    if (parseInt(row.dataset.idx) === idx) {
      var deptCell = row.querySelector('.ml-inline-dept');
      var item = window._mlActionItems[idx];
      if (deptCell && item.department) {
        deptCell.innerHTML = item.department.split(',').map(function(d) {
          return '<span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:600;display:inline-block;margin:1px;">' + d.trim() + '</span>';
        }).join('');
      }
    }
  });
  if (window._mlActiveView === 'chapter') _mlRenderChapterView(_mlGetFilteredCircs());
  showToast('Assignees updated.', 'success');
};

window._mlOpenStatusDropdown = function(idx) {
  var item = window._mlActionItems[idx];
  var statusOptions = ['Assigned', 'Unassigned', 'Not Applicable'];
  var existing = document.getElementById('ml-status-dropdown-modal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-status-dropdown-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:380px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Change Status</div><div class="dr-modal-subject">Action: ' + item.actionId + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-status-dropdown-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:20px;">' +
        '<div style="display:flex;flex-direction:column;gap:8px;">' +
          statusOptions.map(function(status) {
            var isSelected = item.status === status;
            return '<button style="padding:12px 16px;text-align:left;border:2px solid ' + (isSelected ? '#3b82f6' : '#e5e7eb') + ';background:' + (isSelected ? '#eff6ff' : '#fff') + ';border-radius:6px;cursor:pointer;font-weight:' + (isSelected ? '600' : '500') + ';color:#1f2937;transition:all 0.2s;" onclick="_mlUpdateStatus(' + idx + ', \'' + status + '\'); document.getElementById(\'ml-status-dropdown-modal\').remove();">' +
              status +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}

window._mlUpdateStatus = function(idx, newStatus) {
  window._mlActionItems[idx].status = newStatus;
  if (window._mlActiveView === 'chapter') _mlRenderChapterView(_mlGetFilteredCircs());
  else _mlRenderTable(CMS_DATA.circulars);
  showToast('Status updated to ' + newStatus + '.', 'success');
}

window._mlOpenMappedActionsPopup = function(item) {
  var existing = document.getElementById('ml-mapped-modal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-mapped-modal';
  var dummyMapped = [
    { actionId: 'ACT-002', obligationId: 'OBL-2024-02', obligationName: 'Quarterly Regulatory Reporting — submission of financial and compliance returns to the designated regulatory authority on a periodic basis.', dept: 'Compliance', status: 'Assigned' },
    { actionId: 'ACT-007', obligationId: 'OBL-2024-05', obligationName: 'KYC Maintenance — periodic update and verification of Know Your Customer records across all active customer accounts as mandated.', dept: 'Operations', status: 'Assigned' },
    { actionId: 'ACT-011', obligationId: 'OBL-2024-03', obligationName: 'Risk Assessment Review — conduct structured internal risk assessment covering operational, credit and compliance risks on a scheduled frequency.', dept: 'Risk', status: 'Assigned' },
    { actionId: 'ACT-015', obligationId: 'OBL-2024-07', obligationName: 'Annual Compliance Certificate — preparation and filing of the annual compliance certificate with the relevant statutory and regulatory bodies.', dept: 'Legal', status: 'Unassigned' },
  ];
  var statusColors = {'Open':'#fef3c7;color:#b45309','In Progress':'#e0f2fe;color:#0369a1','Assigned':'#dcfce7;color:#15803d','Unassigned':'#fef3c7;color:#b45309'};
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:780px;">' +
      '<div class="dr-modal-head">' +
  '<div class="dr-modal-head-left">' +
    '<div class="dr-modal-eyebrow">Mapped Obligations</div>' +
    '<div class="dr-modal-subject">Action: ' + item.actionId + ' — ' + (item.action||'').substring(0,50) + '</div>' +
  '</div>' +
  '<div style="display:flex;align-items:center;gap:8px;">' +
    '<button class="dr-btn dr-btn-sec" style="font-size:11px;" onclick="_mlOpenBulkMapModal(\'' + item.actionId + '\')">+ Map More Obligations</button>' +
    '<button class="dr-modal-close" onclick="document.getElementById(\'ml-mapped-modal\').remove()">&#x2715;</button>' +
  '</div>' +
'</div>' +
      '<div class="dr-modal-body" style="padding:0;">' +
        '<div style="padding:12px 20px;background:#fffbeb;border-bottom:1px solid #fde68a;font-size:12px;color:#92400e;">&#x26A0; This action is mapped across multiple obligations. Completing it here may fulfil requirements in the following:</div>' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
            '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
            '<th style="padding:12px;width:32px;"><input type="checkbox" id="ml-mapped-select-all" onchange="_mlToggleAllMappedRows(this)" style="accent-color:#3b82f6;width:15px;height:15px;"/></th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Obligation ID</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;">Obligation Name</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Department</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Status</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Action</th>' +
            '</tr></thead>' +
          '<tbody>' +
          dummyMapped.map(function(m) {
            var sc = statusColors[m.status] || '#f3f4f6;color:#6b7280';
           return '<tr style="border-bottom:1px solid #e5e7eb;background:#fafafa;" id="ml-mapped-row-' + m.obligationId + '">' +
  '<td style="padding:12px;"><input type="checkbox" class="ml-mapped-row-cb" data-oblid="' + m.obligationId + '" style="accent-color:#3b82f6;width:15px;height:15px;"/></td>' +
  '<td style="padding:12px;font-size:11px;font-weight:600;color:#374151;white-space:nowrap;">' + m.obligationId + '</td>' +
  '<td style="padding:12px;font-size:11px;color:#4b5563;line-height:1.5;">' + m.obligationName + '</td>' +
  '<td style="padding:12px;"><span style="background:#e0f2fe;color:#0369a1;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600;white-space:nowrap;">' + m.dept + '</span></td>' +
  '<td style="padding:12px;white-space:nowrap;"><span style="background:' + sc + ';padding:3px 10px;border-radius:4px;font-size:10px;font-weight:700;">' + m.status + '</span></td>' +
  '<td style="padding:12px;"><button onclick="_mlUnmapObligation(\'' + m.obligationId + '\')" style="padding:3px 10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer;">Unmap</button></td>' +
'</tr>';
          }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="dr-modal-foot" style="justify-content:space-between;">' +
  '<div style="display:flex;gap:8px;align-items:center;">' +
    '<span class="dr-modal-foot-note" id="ml-mapped-sel-count">0 selected</span>' +
    '<button class="dr-btn dr-btn-ghost" style="font-size:11px;color:#dc2626;border-color:#fca5a5;" onclick="_mlUnmapSelected()">Unmap Selected</button>' +
  '</div>' +
  '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-mapped-modal\').remove()">Close</button>' +
'</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}


window._mlToggleAllMappedRows = function(masterCb) {
  document.querySelectorAll('.ml-mapped-row-cb').forEach(function(cb) {
    cb.checked = masterCb.checked;
  });
  _mlUpdateMappedSelCount();
};

window._mlUpdateMappedSelCount = function() {
  var count = document.querySelectorAll('.ml-mapped-row-cb:checked').length;
  var el = document.getElementById('ml-mapped-sel-count');
  if (el) el.textContent = count + ' selected';
};

window._mlUnmapObligation = function(oblId) {
  var row = document.getElementById('ml-mapped-row-' + oblId);
  if (row) { row.style.opacity = '0.4'; row.style.pointerEvents = 'none'; }
  showToast('Obligation ' + oblId + ' unmapped.', 'success');
};

window._mlUnmapSelected = function() {
  var checked = document.querySelectorAll('.ml-mapped-row-cb:checked');
  if (!checked.length) { showToast('No obligations selected.', 'error'); return; }
  checked.forEach(function(cb) { _mlUnmapObligation(cb.dataset.oblid); });
  showToast(checked.length + ' obligation(s) unmapped.', 'success');
};

window._mlOpenBulkMapModal = function(actionId) {
  /* 
    Show a searchable list of ALL obligations from CMS_DATA
    Each row has a checkbox + obligation ID + name + circular
    "Map Selected" button calls _mlSaveBulkMap(actionId, selectedOblIds)
    Already-mapped ones shown pre-checked
  */
  var existing = document.getElementById('ml-bulk-map-modal');
  if (existing) existing.remove();
  var allObligs = [];
  (CMS_DATA.circulars || []).forEach(function(c) {
    (c.chapters || []).forEach(function(ch) {
      (ch.clauses || []).forEach(function(cl) {
        (cl.obligations || (cl.obligation ? [cl.obligation] : [])).forEach(function(ob, oi) {
          allObligs.push({
            id: c.id + ':' + cl.id + ':OB' + (oi+1),
            name: typeof ob === 'string' ? ob : (ob.text || ob),
            circTitle: c.title || c.id,
            dept: cl.department || '—'
          });
        });
      });
    });
  });
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-bulk-map-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:700px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Map Obligations</div><div class="dr-modal-subject">Action: ' + actionId + '</div></div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-bulk-map-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">' +
        '<input type="text" placeholder="Search obligations…" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;" oninput="var q=this.value.toLowerCase();document.querySelectorAll(\'.ml-bulk-ob-row\').forEach(function(r){r.style.display=r.dataset.search.includes(q)?\'table-row\':\'none\';})" />' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:0;max-height:50vh;overflow-y:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
            '<th style="padding:10px;width:32px;"><input type="checkbox" onchange="this.closest(\'table\').querySelectorAll(\'.ml-bulk-ob-cb\').forEach(function(c){c.checked=this.checked;}.bind(this))" style="accent-color:#3b82f6;"/></th>' +
            '<th style="padding:10px;text-align:left;">Obligation ID</th>' +
            '<th style="padding:10px;text-align:left;">Obligation</th>' +
            '<th style="padding:10px;text-align:left;">Circular</th>' +
            '<th style="padding:10px;text-align:left;">Dept</th>' +
          '</tr></thead>' +
          '<tbody>' +
            allObligs.map(function(ob) {
              return '<tr class="ml-bulk-ob-row" data-search="' + (ob.id + ' ' + ob.name + ' ' + ob.circTitle).toLowerCase() + '" style="border-bottom:1px solid #f3f4f6;">' +
                '<td style="padding:10px;"><input type="checkbox" class="ml-bulk-ob-cb" value="' + ob.id + '" style="accent-color:#3b82f6;"/></td>' +
                '<td style="padding:10px;font-family:monospace;font-size:10px;font-weight:700;color:#7c3aed;white-space:nowrap;">' + ob.id + '</td>' +
                '<td style="padding:10px;font-size:11px;color:#374151;max-width:240px;">' + (ob.name||'').substring(0,80) + (ob.name.length>80?'…':'') + '</td>' +
                '<td style="padding:10px;font-size:11px;color:#6b7280;">' + ob.circTitle.substring(0,30) + '</td>' +
                '<td style="padding:10px;"><span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:3px;font-size:10px;font-weight:600;">' + ob.dept + '</span></td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-bulk-map-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveBulkMap(\'' + actionId + '\')">Map Selected Obligations to Action</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};

window._mlSaveBulkMap = function(actionId) {
  var checked = document.querySelectorAll('#ml-bulk-map-modal .ml-bulk-ob-cb:checked');
  if (!checked.length) { showToast('Select at least one obligation.', 'error'); return; }
  showToast(checked.length + ' obligation(s) mapped to ' + actionId + '.', 'success');
  document.getElementById('ml-bulk-map-modal').remove();
};

window._mlOpenAddActionPopup = function(obligationId, parentActionId) {
  var existing = document.getElementById('ml-add-action-modal');
  if (existing) existing.remove();
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement'];
  var allAssignees = _mlGetUniqueAssignees();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-add-action-modal';
  var lastId = CMS_DATA.tasks.length ? CMS_DATA.tasks[CMS_DATA.tasks.length-1].id : 'ACT-000';
  var nextNum = parseInt((lastId.split('-')[1] || '0')) + 1;
  var nextId = 'ACT-' + nextNum.toString().padStart(3, '0');
  var dummyDescs = [
    'Ensure all customer-facing compliance documents are reviewed, updated and filed with the appropriate regulatory authority within the stipulated timeframe as per circular.',
    'Conduct a comprehensive internal audit of operational processes to verify alignment with the latest regulatory guidelines and identify any gaps requiring immediate remediation.',
    'Prepare and submit the mandatory periodic return to the regulatory body, ensuring accuracy of data, completeness of disclosures and adherence to prescribed format and schedule.',
    'Review and update the internal policy framework to incorporate requirements from the latest circular, including staff communication and acknowledgement sign-off procedures.'
  ];
  var placeholderDesc = dummyDescs[Math.floor(Math.random() * dummyDescs.length)];
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:560px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Add New Action</div>' +
          '<div class="dr-modal-subject">Under Obligation: ' + (obligationId || 'General') + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-add-action-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:20px;">' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">' +
          '<div>' +
            '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Action ID</label>' +
            '<input type="text" value="' + nextId + '" disabled style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;background:#f3f4f6;color:#6b7280;font-size:13px;font-weight:600;"/>' +
          '</div>' +
          '<div>' +
            '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Due Date</label>' +
            '<input type="date" id="ml-new-action-duedate" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/>' +
          '</div>' +
        '</div>' +

'<div style="margin-bottom:14px;">' +
  '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Obligation</label>' +
  '<div style="position:relative;">' +
    '<input type="text" id="ml-new-action-obl-search" placeholder="Search obligation by ID or name…" autocomplete="off" ' +
      'style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;box-sizing:border-box;' + (obligationId ? 'background:#f3f4f6;color:#6b7280;' : '') + '" ' +
      (obligationId ? 'disabled ' : '') +
      'oninput="_mlFilterOblSearch()" onfocus="_mlShowOblDropdown()" />' +
    '<div id="ml-new-action-obl-drop" style="display:none;position:absolute;top:calc(100% + 3px);left:0;right:0;background:#fff;border:1.5px solid #e5e7eb;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.1);z-index:9999;max-height:200px;overflow-y:auto;">' +
      (function() {
        var mockObligs = [
          { id:'OBL-001', name:'Establish and maintain a Board-approved cybersecurity governance framework with designated oversight committee' },
          { id:'OBL-002', name:'Conduct annual independent cybersecurity risk assessment covering all IT assets, vendors and data flows' },
          { id:'OBL-003', name:'Update and enforce transaction monitoring thresholds as per revised AML/KYC regulatory requirements' },
          { id:'OBL-004', name:'Ensure all sensitive personal data of Indian citizens is stored on servers located within Indian territory' },
          { id:'OBL-005', name:'Measure and disclose Scope 1, 2, and 3 carbon emissions annually in the prescribed ESG reporting format' },
          { id:'OBL-006', name:'Conduct enhanced due diligence on all critical vendors prior to onboarding and on a periodic basis thereafter' },
          { id:'OBL-007', name:'Ensure all housing finance operations comply with consolidated RBI guidelines and maintain board-approved policy' },
          { id:'OBL-008', name:'Segregate and correctly classify land-only loans separate from housing loan portfolio in MIS and regulatory reporting' },
          { id:'OBL-009', name:'Enforce Loan-to-Value ratio limits at origination and monitor compliance at portfolio level on an ongoing basis' },
          { id:'OBL-010', name:'Classify eligible housing loans under Priority Sector Lending and report under PSL returns within stipulated timelines' },
          { id:'OBL-011', name:'Ensure all floating-rate housing loans are linked to Repo Rate or other approved external benchmark with quarterly reset' },
          { id:'OBL-012', name:'Cap repayment tenor at 30 years and ensure EMI does not exceed 50% of borrower net monthly income at sanction' },
          { id:'OBL-013', name:'Issue Key Fact Statement to every housing loan applicant prior to sanction disclosing all-in cost and charges' },
          { id:'OBL-014', name:'Submit NHB refinance utilisation certificates quarterly and annual compliance reports within 30 days of period end' },
          { id:'OBL-015', name:'Remove foreclosure charges and prepayment penalties for all floating-rate individual housing loan accounts' },
          { id:'OBL-016', name:'File half-yearly housing loan portfolio return with RBI within 21 days of close of each half-year period' },
        ];
        window._mlAllObligOptions = mockObligs;
        return mockObligs.map(function(ob) {
          return '<div class="ml-obl-drop-item" data-id="' + ob.id + '" data-name="' + ob.name.replace(/"/g,'&quot;') + '" ' +
            'onclick="_mlSelectObligation(this)" ' +
            'style="padding:9px 12px;cursor:pointer;border-bottom:1px solid #f3f4f6;transition:background .1s;">' +
            '<div style="font-family:monospace;font-size:9px;font-weight:700;color:#7c3aed;margin-bottom:2px;">' + ob.id + '</div>' +
            '<div style="font-size:11px;color:#374151;line-height:1.4;">' + ob.name.substring(0,80) + (ob.name.length>80?'…':'') + '</div>' +
          '</div>';
        }).join('');
      })() +
    '</div>' +
  '</div>' +
  '<input type="hidden" id="ml-new-action-obl-id" value="' + (obligationId||'') + '"/>' +
  /* show pre-selected if opened from a parent action */
  (obligationId
    ? '<div id="ml-obl-selected-pill" style="margin-top:6px;display:inline-flex;align-items:center;gap:6px;background:#f5f3ff;border:1px solid #e9d5ff;border-radius:6px;padding:5px 10px;">' +
        '<span style="font-family:monospace;font-size:10px;font-weight:700;color:#7c3aed;">' + obligationId + '</span>' +
        '<button type="button" onclick="_mlClearOblSelection()" style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:13px;line-height:1;">×</button>' +
      '</div>'
    : '<div id="ml-obl-selected-pill" style="display:none;margin-top:6px;"></div>'
  ) +
'</div>' +

'<div style="margin-bottom:14px;">' +
  '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Action Description <span style="color:#ef4444;">*</span></label>' +
          '<textarea id="ml-new-action-desc" placeholder="' + placeholderDesc + '" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;min-height:90px;font-family:inherit;resize:vertical;line-height:1.5;"></textarea>' +
          '<div style="font-size:10px;color:#9ca3af;margin-top:4px;">Aim for 30–40 words describing what needs to be done and why.</div>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">' +
          '<div>' +
            '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Department</label>' +
            '<select id="ml-new-action-dept" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;background:white;">' +
              '<option value="">Select Department</option>' +
              allDepts.map(function(d){ return '<option value="'+d+'">'+d+'</option>'; }).join('') +
            '</select>' +
          '</div>' +
          '<div>' +
            '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Assigned To</label>' +
            '<input type="text" id="ml-new-action-assignee" placeholder="Enter name…" list="ml-new-assignee-list" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/>' +
            '<datalist id="ml-new-assignee-list">' + allAssignees.map(function(a){ return '<option value="'+a+'">'; }).join('') + '</datalist>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Status</label>' +
          '<div style="display:flex;gap:8px;">' +
            ['Assigned','Unassigned','Not Applicable'].map(function(s){
              var isDefault = s === 'Assigned';
              return '<button type="button" class="ml-status-pill-btn" data-status="'+s+'" onclick="_mlSelectNewStatus(this)" style="padding:7px 14px;border:2px solid '+(isDefault?'#3b82f6':'#e5e7eb')+';background:'+(isDefault?'#eff6ff':'#fff')+';border-radius:20px;font-size:12px;font-weight:'+(isDefault?'700':'500')+';color:'+(isDefault?'#1d4ed8':'#374151')+';cursor:pointer;transition:all 0.15s;">'+s+'</button>';
            }).join('') +
          '</div>' +
          '<input type="hidden" id="ml-new-action-status" value="Assigned"/>' +
        '</div>' +

      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-add-action-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveNewAction(\'' + nextId + '\', \'' + obligationId + '\')">Save Action</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  setTimeout(function() {
  document.querySelectorAll('.ml-mapped-row-cb').forEach(function(cb) {
    cb.addEventListener('change', _mlUpdateMappedSelCount);
  });
}, 0);
}

window._mlFilterOblSearch = function() {
  var q = (document.getElementById('ml-new-action-obl-search').value || '').toLowerCase();
  var drop = document.getElementById('ml-new-action-obl-drop');
  if (!drop) return;
  drop.style.display = 'block';
  drop.querySelectorAll('.ml-obl-drop-item').forEach(function(item) {
    var match = (item.dataset.id + ' ' + item.dataset.name).toLowerCase().includes(q);
    item.style.display = match ? 'block' : 'none';
  });
};

window._mlShowOblDropdown = function() {
  var drop = document.getElementById('ml-new-action-obl-drop');
  if (drop) drop.style.display = 'block';
  /* close on outside click */
  setTimeout(function() {
    document.addEventListener('click', function _oblOutside(e) {
      var wrap = document.getElementById('ml-new-action-obl-search');
      var drop = document.getElementById('ml-new-action-obl-drop');
      if (drop && wrap && !wrap.contains(e.target) && !drop.contains(e.target)) {
        drop.style.display = 'none';
        document.removeEventListener('click', _oblOutside);
      }
    });
  }, 0);
};

window._mlSelectObligation = function(el) {
  var id   = el.dataset.id;
  var name = el.dataset.name;
  document.getElementById('ml-new-action-obl-id').value = id;
  document.getElementById('ml-new-action-obl-search').value = id + ' — ' + name.substring(0, 50) + (name.length > 50 ? '…' : '');
  document.getElementById('ml-new-action-obl-drop').style.display = 'none';
  var pill = document.getElementById('ml-obl-selected-pill');
  if (pill) {
    pill.style.display = 'inline-flex';
    pill.innerHTML =
      '<span style="font-family:monospace;font-size:10px;font-weight:700;color:#7c3aed;">' + id + '</span>' +
      '<span style="font-size:11px;color:#374151;margin-left:6px;">' + name.substring(0,50) + (name.length>50?'…':'') + '</span>' +
      '<button type="button" onclick="_mlClearOblSelection()" style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:13px;line-height:1;margin-left:4px;">×</button>';
  }
};

window._mlClearOblSelection = function() {
  document.getElementById('ml-new-action-obl-id').value = '';
  document.getElementById('ml-new-action-obl-search').value = '';
  var pill = document.getElementById('ml-obl-selected-pill');
  if (pill) { pill.style.display = 'none'; pill.innerHTML = ''; }
};

window._mlSelectNewStatus = function(btn) {
  document.querySelectorAll('.ml-status-pill-btn').forEach(function(b){
    b.style.border = '2px solid #e5e7eb';
    b.style.background = '#fff';
    b.style.fontWeight = '500';
    b.style.color = '#374151';
  });
  btn.style.border = '2px solid #3b82f6';
  btn.style.background = '#eff6ff';
  btn.style.fontWeight = '700';
  btn.style.color = '#1d4ed8';
  document.getElementById('ml-new-action-status').value = btn.dataset.status;
}

window._mlSaveNewAction = function(actionId, obligationId) {
  var desc = document.getElementById('ml-new-action-desc').value;
  var dept = document.getElementById('ml-new-action-dept').value;
  var assignee = document.getElementById('ml-new-action-assignee').value;
  var status = document.getElementById('ml-new-action-status').value;
  
  if (!desc.trim()) {
    showToast('Action description is required.', 'error');
    return;
  }
  
  var dueDate = document.getElementById('ml-new-action-duedate').value;
  var selectedOblId = document.getElementById('ml-new-action-obl-id')
  ? document.getElementById('ml-new-action-obl-id').value || obligationId
  : obligationId;
  
var assigneeVal = {};
if (dept && assignee) {
  assigneeVal[dept] = assignee;
} else if (assignee) {
  assigneeVal['General'] = assignee;
}

var newTask = {
    id: actionId,
    title: desc,
    obligationId: selectedOblId,
    department: dept || 'Unassigned',
    assignee: assigneeVal,
    priority: 'Medium',
    status: status,
    risk: 'Medium',
    tags: [],
    circularId: (CMS_DATA.circulars[0] && CMS_DATA.circulars[0].id) || '',
    dueDate: dueDate
  };
  
  CMS_DATA.tasks.push(newTask);
  document.getElementById('ml-add-action-modal').remove();
  _mlRenderTable(CMS_DATA.circulars);
  showToast('Action ' + actionId + ' added successfully.', 'success');
}

// ── DEMO SEED: give first task two depts + two assignees for visual demo ──
if (CMS_DATA && CMS_DATA.tasks && CMS_DATA.tasks.length > 0 && !CMS_DATA._demoSeeded) {
  CMS_DATA._demoSeeded = true;
  CMS_DATA.tasks[0].department = 'Compliance, Risk, Digital';
CMS_DATA.tasks[0].assignee = 'Ananya Sharma';
  if (CMS_DATA.tasks[1]) {
    CMS_DATA.tasks[1].department = 'Legal, IT';
    CMS_DATA.tasks[1].assignee = { 'Legal': 'Priya Nair', 'IT': 'Vikram Das' };
  }
}

window._mlGetUniqueAssignees = function() {
  var assignees = [];
  CMS_DATA.tasks.forEach(function(t) {
    var a = t.assignee;
    if (!a) return;
    if (typeof a === 'string' && a.trim()) {
      assignees.push(a.trim());
    } else if (typeof a === 'object') {
      Object.values(a).forEach(function(name) {
        if (name && name.trim()) assignees.push(name.trim());
      });
    }
  });
  var demo = ['Ananya Sharma', 'Rohan Mehta', 'Priya Nair', 'Vikram Das', 'Sneha Iyer'];
demo.forEach(function(n){ assignees.push(n); });
  return [...new Set(assignees)].sort();
};

window._mlDetailField = function(label, value, fullWidth) {
  return '<div style="' +
    'background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;' +
    (fullWidth ? 'grid-column:span 2;' : '') +
  '">' +
    '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">' + label + '</div>' +
    '<div style="font-size:12px;font-weight:600;color:#1f2937;word-break:break-word;">' + value + '</div>' +
  '</div>';
};

window._mlOpenEditablePopup = function(item, idx) {
  var existing = document.getElementById('ml-detail-modal');
  if (existing) existing.remove();
  var circular = CMS_DATA.circulars.find(function(c){ return c.id === item.circId; }) || {};
  var obligation = (CMS_DATA.obligations || []).find(function(o){ return o.id === item.obligationId; }) || {};
  var task = CMS_DATA.tasks.find(function(t){ return t.id === item.actionId; }) || {};
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement'];
  var allAssignees = _mlGetUniqueAssignees();
  var statusOptions = ['Not Applicable','Unassigned','Assigned'];
  var freqOptions = ['Monthly','Quarterly','Annually','Ad-hoc','As per Regulation'];
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-detail-modal';
  var curFreq = task.frequency || item.frequency || 'Monthly';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:700px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Edit Action</div>' +
          '<div class="dr-modal-subject">' + item.actionId + ' — ' + (item.action||'').substring(0,50) + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-detail-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:0;max-height:70vh;overflow-y:auto;">' +

        '<div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">' +
          '<div style="margin-bottom:12px;">' +
            '<label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Details of Action Item</label>' +
            '<textarea id="ml-edit-action" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;min-height:70px;font-family:inherit;resize:vertical;">' + (item.action||'').replace(/</g,'&lt;') + '</textarea>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Internal Due Date</label><input type="date" id="ml-edit-issuedate" value="' + (circular.issuedDate || circular.issueDate || '') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">External Due Date</label><input type="date" id="ml-edit-duedate" value="' + (item.dueDate||'') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Frequency</label><select id="ml-edit-freq" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' + freqOptions.map(function(f){ return '<option value="'+f+'"'+(curFreq===f?' selected':'')+'>'+f+'</option>'; }).join('') + '</select></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Assignment Status</label><select id="ml-edit-status" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' + statusOptions.map(function(s){ return '<option value="'+s+'"'+(item.status===s?' selected':'')+'>'+s+'</option>'; }).join('') + '</select></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Department</label><select id="ml-edit-dept" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' + allDepts.map(function(d){ return '<option value="'+d+'"'+(item.department===d?' selected':'')+'>'+d+'</option>'; }).join('') + '</select></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Assigned To</label><input type="text" id="ml-edit-assignee" value="' + (item.assignedTo||'') + '" list="ml-edit-assignee-list" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/><datalist id="ml-edit-assignee-list">' + allAssignees.map(function(a){ return '<option value="'+a+'">'; }).join('') + '</datalist></div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">' +
          '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Evidence Required</div>' +
          '<div id="ml-edit-evidence-list" style="margin-bottom:10px;">' +
            (item.evidence && item.evidence.length ? item.evidence.map(function(e){ return '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:6px;font-size:12px;color:#374151;">' + e + '<button type="button" onclick="_mlRemoveEvidenceItem(this)" style="margin-left:auto;background:none;border:none;color:#9ca3af;cursor:pointer;font-size:14px;line-height:1;">×</button></div>'; }).join('') : '') +
          '</div>' +
          '<div style="display:flex;gap:8px;">' +
            '<input type="text" id="ml-edit-evidence-input" placeholder="Describe evidence required…" style="flex:1;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/>' +
            '<button type="button" onclick="_mlAddEvidenceItem()" style="padding:8px 14px;background:#3b82f6;color:white;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">+ Add</button>' +
          '</div>' +
        '</div>' +

        '<div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">' +
          '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px;">Obligation Details</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Obligation ID</label><input type="text" id="ml-edit-oblid" value="' + (item.obligationId||'') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:#f9fafb;" readonly/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Obligation Name</label><input type="text" id="ml-edit-oblname" value="' + (obligation.name || obligation.title || 'Ensure timely submission of regulatory returns and maintain accurate records as per applicable guidelines.').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Effective Date</label><input type="date" id="ml-edit-effdate" value="' + (circular.effectiveDate || '') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Tags</label><input type="text" id="ml-edit-tags" value="' + (item.tags && item.tags.length ? item.tags.join(', ') : 'Compliance, Reporting') + '" placeholder="Compliance, Reporting…" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;"> Due Date</label><input type="date" id="ml-edit-duedate" value="' + (item.dueDate||'') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
                       '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Frequency</label><select id="ml-edit-freq" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' + freqOptions.map(function(f){ return '<option value="'+f+'"'+(curFreq===f?' selected':'')+'>'+f+'</option>'; }).join('') + '</select></div>' +
            '<div style="grid-column:span 2;">' +
              '<label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Upload Obligation Page</label>' +
              '<div style="display:flex;align-items:center;gap:10px;">' +
                '<label style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#f9fafb;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:12px;color:#374151;font-weight:500;">&#x1F4CE; Choose File<input type="file" id="ml-edit-obl-file" accept=".pdf,.doc,.docx,.png,.jpg" style="display:none;" onchange="document.getElementById(\'ml-edit-obl-filename\').textContent=this.files[0]?this.files[0].name:\'No file chosen\'"/></label>' +
                '<span id="ml-edit-obl-filename" style="font-size:12px;color:#6b7280;font-style:italic;">No file chosen</span>' +
              '</div>' +
            '</div>' +
            '</div>' +
        '</div>' +

        '<div style="padding:16px 20px;">' +
          '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px;">Regulatory Details</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Act Name</label><input type="text" id="ml-edit-actname" value="' + (circular.actName || 'Banking Regulation Act, 1949').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Legislative Area</label><input type="text" id="ml-edit-legarea" value="' + (circular.legislativeArea || 'Financial Services').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Sub-Section</label><input type="text" id="ml-edit-subsec" value="' + (circular.subSection || 'Section 35A').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Regulatory Body</label><input type="text" id="ml-edit-regbody" value="' + (circular.regulator || 'Reserve Bank of India').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
          '</div>' +
        '</div>' +

      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-detail-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveInlineEdit(' + idx + ')">Save Changes</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}

window._mlRemoveEvidenceItem = function(btn) {
  btn.parentNode.remove();
};

window._mlAddEvidenceItem = function() {
  var inp = document.getElementById('ml-edit-evidence-input');
  if (!inp || !inp.value.trim()) return;
  var list = document.getElementById('ml-edit-evidence-list');
  if (!list) return;
  var d = document.createElement('div');
  d.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:6px;font-size:12px;color:#374151;';
  var text = document.createTextNode(inp.value.trim());
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '×';
  btn.style.cssText = 'margin-left:auto;background:none;border:none;color:#9ca3af;cursor:pointer;font-size:14px;line-height:1;';
  btn.onclick = function() { d.remove(); };
  d.appendChild(text);
  d.appendChild(btn);
  list.appendChild(d);
  inp.value = '';
};

window._mlSaveInlineEdit = function(idx) {
  var item = window._mlActionItems[idx];
  item.action     = document.getElementById('ml-edit-action').value;
  item.dueDate    = document.getElementById('ml-edit-duedate').value;
  item.department = document.getElementById('ml-edit-dept').value;
  item.assignedTo = document.getElementById('ml-edit-assignee').value;
  item.status     = document.getElementById('ml-edit-status').value;
  var tagsRaw     = document.getElementById('ml-edit-tags').value;
  item.tags       = tagsRaw.split(',').map(function(t){ return t.trim(); }).filter(Boolean);
  var task = CMS_DATA.tasks.find(function(t){ return t.id === item.actionId; });
  if (task) {
    task.title      = item.action;
    task.dueDate    = item.dueDate;
    task.department = item.department;
    task.assignee   = item.assignedTo;
    task.status     = item.status;
    task.tags       = item.tags;
    task.frequency  = document.getElementById('ml-edit-freq') ? document.getElementById('ml-edit-freq').value : task.frequency;
  }
  var circular = CMS_DATA.circulars.find(function(c){ return c.id === item.circId; });
  if (circular) {
    if (document.getElementById('ml-edit-actname'))  circular.actName        = document.getElementById('ml-edit-actname').value;
    if (document.getElementById('ml-edit-legarea'))  circular.legislativeArea = document.getElementById('ml-edit-legarea').value;
    if (document.getElementById('ml-edit-subsec'))   circular.subSection     = document.getElementById('ml-edit-subsec').value;
    if (document.getElementById('ml-edit-regbody'))  circular.regulator      = document.getElementById('ml-edit-regbody').value;
  }
  document.getElementById('ml-detail-modal').remove();
  _mlRenderTable(CMS_DATA.circulars);
  showToast('Action updated successfully.', 'success');
}

window._mlSaveDepartment = function(idx) {
  var checked = document.querySelectorAll('#ml-dept-selector-modal input[type="checkbox"]:checked');
  var depts = Array.from(checked).map(function(cb){ return cb.value; });

  document.getElementById('ml-dept-selector-modal').remove();

  if (!depts.length) {
    showToast('Please select at least one department.', 'error');
    return;
  }

  // Capture the actionId BEFORE re-render (which rebuilds _mlActionItems)
  var actionId = window._mlActionItems[idx].actionId;

  window._mlActionItems[idx].department = depts.join(', ');
  // Reset assignee map so stale per-dept assignments are cleared
  window._mlActionItems[idx].assignedTo = {};

  var task = CMS_DATA.tasks.find(function(t){ return t.id === actionId; });
  if (task) {
    task.department = depts.join(', ');
    task.assignee = {};
  }

  _mlRenderTable(_mlGetFilteredCircs ? _mlGetFilteredCircs() : CMS_DATA.circulars);
  if (window._mlActiveView === 'chapter') _mlRenderChapterView(_mlGetFilteredCircs());

  showToast('Department updated. Now assign people.', 'success');

  // Find new idx after re-render by matching actionId
  var newIdx = (window._mlActionItems || []).findIndex(function(a){ return a.actionId === actionId; });
  if (newIdx > -1) _mlOpenAssigneeSelector(newIdx);
};

window._mlUpdateStatusBadges = function() {
  var filtered   = _mlGetFilteredCircs();
  var total      = filtered.length;
  var assigned   = filtered.filter(function(c) { return (c.libraryStatus||'Reviewed & Applicable') === 'Assigned'; }).length;
  var spTotal = document.getElementById('ml-sp-total');
  var spUn    = document.getElementById('ml-sp-unassigned');
  var spAss   = document.getElementById('ml-sp-assigned');
  if (spTotal) spTotal.textContent = total + ' total';
  if (spUn)    spUn.textContent    = (total - assigned) + ' unassigned';
  if (spAss)   spAss.textContent   = assigned + ' assigned';
}

/* TABLE HELPERS */
window._drTableEditMode = false;
window._drToggleTableEdit = function() {
  window._drTableEditMode = !window._drTableEditMode;
  var on = window._drTableEditMode;
  document.querySelectorAll('.dr-table-edit-cell').forEach(function(el) { el.style.display = on ? 'table-cell' : 'none'; });
  var addEnt = document.getElementById('dr-add-ent-btn'); if (addEnt) addEnt.style.display = on ? 'inline-flex' : 'none';
  var addReq = document.getElementById('dr-add-req-btn'); if (addReq) addReq.style.display = on ? 'inline-flex' : 'none';
  document.querySelectorAll('[id^="dr-ent-name-"],[id^="dr-ent-type-"],[id^="dr-req-name-"],[id^="dr-req-thresh-"]').forEach(function(el) {
    el.contentEditable = on ? 'true' : 'false';
    el.style.outline = on ? '1.5px dashed #bfdbfe' : 'none';
    el.style.borderRadius = on ? '3px' : '0';
    el.style.padding = on ? '1px 4px' : '0';
  });
  document.querySelectorAll('[id^="dr-ent-app-"],[id^="dr-req-app-"]').forEach(function(pill) {
    if (on) { pill.style.cursor='pointer'; pill.title='Click to toggle'; pill.onclick=function(){var isYes=pill.classList.contains('dr-app-yes');pill.classList.toggle('dr-app-yes',!isYes);pill.classList.toggle('dr-app-no',isYes);pill.innerHTML=isYes?'&#x2717; No':'&#x2713; Yes';};
    } else { pill.style.cursor='default'; pill.title=''; pill.onclick=null; }
  });
  var btn = document.getElementById('dr-app-tbl-edit-btn');
  if (btn) { btn.textContent = on ? '✓ Done Editing' : '✎ Edit Tables'; btn.style.background = on ? '#1a1a2e' : ''; btn.style.color = on ? '#fff' : ''; btn.style.borderColor = on ? '#1a1a2e' : ''; }
  if (!on) showToast('Table changes saved.', 'success');
};
window._drDelEntityRow = function(ei) { var row = document.getElementById('dr-ent-row-' + ei); if (row) row.remove(); };
window._drDelReqRow    = function(ri) { var row = document.getElementById('dr-req-row-' + ri); if (row) row.remove(); };
window._drReqStatusChange = function(ri, val) { showToast('Status updated to '+val+'.','success'); };
window._drAddEntityRow = function() { var tbody=document.getElementById('dr-ent-tbody'); if(!tbody)return; var ei=tbody.querySelectorAll('tr').length; var tr=document.createElement('tr'); tr.id='dr-ent-row-'+ei; tr.innerHTML='<td><span id="dr-ent-name-'+ei+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;display:inline-block;min-width:80px;font-weight:600;color:#1a1a2e;">New Entity</span></td><td><span class="dr-app-pill dr-app-yes" id="dr-ent-app-'+ei+'" style="cursor:pointer;" title="Click to toggle" onclick="var isYes=this.classList.contains(\'dr-app-yes\');this.classList.toggle(\'dr-app-yes\',!isYes);this.classList.toggle(\'dr-app-no\',isYes);this.innerHTML=isYes?\'&#x2717; No\':\'&#x2713; Yes\';">&#x2713; Yes</span></td><td class="dr-table-edit-cell"><button class="dr-tbl-del-btn" onclick="_drDelEntityRow('+ei+')">&#x2715;</button></td>'; tbody.appendChild(tr); var ed=tr.querySelector('[contenteditable]'); if(ed)ed.focus(); };
window._drAddReqRow    = function() { var tbody=document.getElementById('dr-req-tbody'); if(!tbody)return; var ri=tbody.querySelectorAll('tr').length; var tr=document.createElement('tr'); tr.id='dr-req-row-'+ri; tr.innerHTML='<td><span id="dr-req-name-'+ri+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;display:inline-block;min-width:120px;font-weight:600;color:#1a1a2e;">New Requirement</span></td><td><span class="dr-app-pill dr-app-yes" id="dr-req-app-'+ri+'" style="cursor:pointer;" title="Click to toggle" onclick="var isYes=this.classList.contains(\'dr-app-yes\');this.classList.toggle(\'dr-app-yes\',!isYes);this.classList.toggle(\'dr-app-no\',isYes);this.innerHTML=isYes?\'&#x2717; No\':\'&#x2713; Yes\';">&#x2713; Yes</span></td><td><span id="dr-req-thresh-'+ri+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;font-size:11px;color:#4a5068;display:inline-block;min-width:80px;">All entities</span></td><td class="dr-table-edit-cell"><select class="dr-tbl-select" onchange="_drReqStatusChange('+ri+',this.value)">'+['Compliant','In Progress','Pending','Exempt'].map(function(s){return '<option>'+s+'</option>';}).join('')+'</select><button class="dr-tbl-del-btn" onclick="_drDelReqRow('+ri+')">&#x2715;</button></td>'; tbody.appendChild(tr); var ed=tr.querySelector('[contenteditable]'); if(ed)ed.focus(); };
