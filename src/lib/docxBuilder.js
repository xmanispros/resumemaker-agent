// docxBuilder.js — Advanced DOCX resume builder
// Uses the `docx` library (loaded via script tag) for Word document generation

function hexNoHash(h) { return (h || '').replace('#', ''); }

function lightenHex(h, factor) {
  var r = parseInt(h.substring(0, 2), 16);
  var g = parseInt(h.substring(2, 4), 16);
  var b = parseInt(h.substring(4, 6), 16);
  var lr = Math.round(r + (255 - r) * factor);
  var lg = Math.round(g + (255 - g) * factor);
  var lb = Math.round(b + (255 - b) * factor);
  return ((1 << 24) + (lr << 16) + (lg << 8) + lb).toString(16).slice(1);
}

function getD() {
  var D = window.docx;
  if (!D) throw new Error('DOCX library not loaded. Please refresh and try again.');
  return D;
}

function accentBorder(accent) {
  var D = getD();
  return { style: D.BorderStyle.SINGLE, size: 6, color: hexNoHash(accent), space: 1 };
}

function noBorder() {
  var D = getD();
  var b = { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF', space: 0 };
  return { top: b, left: b, bottom: b, right: b };
}

function noCellBorders() {
  var D = getD();
  var n = { style: D.BorderStyle.NONE, size: 0, color: 'auto', space: 0 };
  return { top: n, left: n, bottom: n, right: n };
}

function sectionTitle(text, color) {
  var D = getD();
  return new D.Paragraph({
    children: [new D.TextRun({ text: text.toUpperCase(), bold: true, font: 'Arial', size: 26, color: hexNoHash(color) })],
    spacing: { before: 160, after: 80, line: 276 },
    border: { bottom: accentBorder(color) },
  });
}

function bodyPara(text, opts) {
  var D = getD();
  opts = opts || {};
  var runs = opts.runs || [new D.TextRun({
    text: text || '',
    font: 'Arial',
    size: opts.sz || 28,
    color: opts.color || '1B2440',
    bold: !!opts.bold,
    italics: !!opts.italics,
  })];
  return new D.Paragraph({
    children: runs,
    spacing: { before: opts.sb || 0, after: opts.sa || 60, line: opts.line || 276 },
    alignment: opts.align || D.AlignmentType.LEFT,
    indent: opts.indent ? { left: opts.indent } : undefined,
  });
}

function emptyPara() {
  var D = getD();
  return new D.Paragraph({ children: [], spacing: { after: 0 } });
}

function contactPara(contactStr, opts) {
  var D = getD();
  opts = opts || {};
  return new D.Paragraph({
    children: [new D.TextRun({
      text: contactStr,
      font: 'Arial',
      size: opts.sz || 24,
      color: opts.color || '5B6B8C',
    })],
    spacing: { after: opts.sa || 120 },
    alignment: opts.align || D.AlignmentType.LEFT,
  });
}

/* ── Skills rendering ── */
function skillsParas(d, ac, opts) {
  var D = getD();
  opts = opts || {};
  var p = [];
  if (!d.skills?.length) return p;
  p.push(sectionTitle('Skills', ac));
  var textColor = opts.textColor || '1B2440';
  d.skills.filter(Boolean).forEach(function(s) {
    p.push(bodyPara(s, { sz: opts.sz || 26, color: textColor, line: 300, sa: 10, indent: opts.indent }));
  });
  return p;
}

function skillsInlineParas(d, ac, opts) {
  var D = getD();
  opts = opts || {};
  var p = [];
  if (!d.skills?.length) return p;
  p.push(sectionTitle('Skills', ac));
  var skillText = d.skills.filter(Boolean).join('  \u2022  ');
  p.push(bodyPara(skillText, { sz: opts.sz || 26, line: 300, sa: 100 }));
  return p;
}

/* ── Education rendering ── */
function educationParas(d, ac, opts) {
  var D = getD();
  opts = opts || {};
  var p = [];
  if (!d.education?.length) return p;
  p.push(sectionTitle('Education', ac));
  var textColor = opts.textColor || '1B2440';
  var subColor = opts.subColor || '5B6B8C';
  d.education.forEach(function(e) {
    if (!e.degree && !e.school) return;
    p.push(bodyPara(e.degree, { bold: true, sz: opts.itemSz || 30, color: textColor, sa: 20 }));
    if (e.school) p.push(bodyPara(e.school, { sz: (opts.itemSz || 30) - 4, color: subColor, sa: 10 }));
    if (e.year) p.push(bodyPara(e.year, { sz: (opts.itemSz || 30) - 6, color: subColor, sa: 60 }));
  });
  return p;
}

/* ── Experience rendering ── */
function experienceParas(d, ac, opts) {
  var D = getD();
  opts = opts || {};
  var p = [];
  if (!d.experience?.length) return p;
  p.push(sectionTitle('Experience', ac));
  var textColor = opts.textColor || '1B2440';
  var subColor = opts.subColor || '5B6B8C';
  d.experience.forEach(function(e) {
    if (!e.role && !e.company) return;
    var title = e.role + (e.company ? ' \u2014 ' + e.company : '');
    p.push(bodyPara(title, { bold: true, sz: opts.itemSz || 30, color: textColor, sa: 20 }));
    if (e.duration) p.push(bodyPara(e.duration, { sz: (opts.itemSz || 30) - 4, color: subColor, sa: 40 }));
    if (e.description) p.push(bodyPara(e.description, { sz: (opts.itemSz || 30) - 2, line: 300, color: textColor, sa: 80 }));
  });
  return p;
}

/* ── Projects rendering ── */
function projectsParas(d, ac, opts) {
  var D = getD();
  opts = opts || {};
  var p = [];
  if (!d.projects?.length) return p;
  p.push(sectionTitle('Projects', ac));
  var textColor = opts.textColor || '1B2440';
  d.projects.forEach(function(proj) {
    if (!proj.name) return;
    p.push(bodyPara(proj.name, { bold: true, sz: opts.itemSz || 30, color: textColor, sa: 20 }));
    if (proj.description) p.push(bodyPara(proj.description, { sz: (opts.itemSz || 30) - 2, line: 300, color: textColor, sa: 80 }));
  });
  return p;
}

/* ── Links rendering ── */
function linksParas(d, ac, opts) {
  var D = getD();
  opts = opts || {};
  var p = [];
  if (!d.links?.length) return p;
  p.push(sectionTitle('Links', ac));
  var textColor = opts.textColor || '1B2440';
  p.push(bodyPara(d.links.filter(Boolean).join('  |  '), { sz: opts.sz || 26, line: 300, color: textColor, sa: 80 }));
  return p;
}

/* ── Summary rendering ── */
function summaryParas(d, ac, opts) {
  var D = getD();
  opts = opts || {};
  var p = [];
  if (!d.summary) return p;
  p.push(sectionTitle('Summary', ac));
  var textColor = opts.textColor || '1B2440';
  p.push(bodyPara(d.summary, { sz: opts.sz || 28, line: 300, color: textColor, sa: 100 }));
  return p;
}

/* ══════════════════════════════════════════════════════
   SINGLE COLUMN LAYOUT
   ══════════════════════════════════════════════════════ */
function buildSingleColumn(d, t) {
  var D = getD();
  var ac = t.accent;
  var name = d.fullName || 'Resume';
  var contactParts = [];
  if (d.contactValue) contactParts.push(d.contactValue);
  if (d.location) contactParts.push(d.location);
  var contactStr = contactParts.join('  \u2022  ');

  var children = [];
  children.push(new D.Paragraph({
    children: [new D.TextRun({ text: name, bold: true, font: 'Arial', size: 56, color: '1B2440' })],
    alignment: D.AlignmentType.CENTER,
    spacing: { after: 40 },
  }));
  children.push(contactPara(contactStr, { align: D.AlignmentType.CENTER, sa: 80 }));
  children.push(new D.Paragraph({
    children: [],
    border: { bottom: accentBorder(ac) },
    spacing: { after: 120 },
  }));
  children = children.concat(summaryParas(d, ac));
  children = children.concat(experienceParas(d, ac));
  children = children.concat(projectsParas(d, ac));
  children = children.concat(skillsInlineParas(d, ac));
  children = children.concat(educationParas(d, ac));
  children = children.concat(linksParas(d, ac));
  return children;
}

/* ══════════════════════════════════════════════════════
   HEADER BAND LAYOUT
   ══════════════════════════════════════════════════════ */
function buildHeaderBand(d, t) {
  var D = getD();
  var ac = t.accent;
  var name = d.fullName || 'Resume';
  var contactParts = [];
  if (d.contactValue) contactParts.push(d.contactValue);
  if (d.location) contactParts.push(d.location);
  var contactStr = contactParts.join('  \u2022  ');

  var children = [];
  children.push(new D.Paragraph({
    children: [new D.TextRun({ text: name, bold: true, font: 'Arial', size: 44, color: '1B2440' })],
    spacing: { after: 40 },
  }));
  children.push(contactPara(contactStr, { sz: 24, sa: 120 }));
  children.push(new D.Paragraph({
    children: [],
    border: { bottom: accentBorder(ac) },
    spacing: { after: 80 },
  }));

  var mainCol = summaryParas(d, ac).concat(experienceParas(d, ac)).concat(projectsParas(d, ac));
  var sideCol = skillsParas(d, ac, { textColor: '1B2440' })
    .concat(educationParas(d, ac, { textColor: '1B2440', subColor: '5B6B8C' }))
    .concat(linksParas(d, ac, { textColor: '1B2440' }));

  var noTblBorders = noCellBorders();
  var tblNoBorders = noBorder();

  var tblRow = new D.TableRow({
    children: [
      new D.TableCell({
        children: mainCol.length ? mainCol : [emptyPara()],
        width: { size: 5200, type: D.WidthType.DXA },
        borders: noTblBorders,
        verticalAlign: D.VerticalAlign.TOP,
        margins: { top: 0, bottom: 0, left: 120, right: 120 },
      }),
      new D.TableCell({
        children: sideCol.length ? sideCol : [emptyPara()],
        width: { size: 3826, type: D.WidthType.DXA },
        borders: noTblBorders,
        verticalAlign: D.VerticalAlign.TOP,
        margins: { top: 0, bottom: 0, left: 120, right: 120 },
      }),
    ],
  });
  children.push(new D.Table({
    rows: [tblRow],
    width: { size: 9026, type: D.WidthType.DXA },
    layout: D.FixedLayoutType,
    borders: tblNoBorders,
  }));
  return children;
}

/* ══════════════════════════════════════════════════════
   SIDEBAR LAYOUT
   ══════════════════════════════════════════════════════ */
function buildSidebar(d, t, sidebarLeft) {
  var D = getD();
  var ac = t.accent;
  var sbBg = hexNoHash(ac);
  var sbBgLight = lightenHex(sbBg, 0.85);
  var name = d.fullName || 'Resume';
  var contactParts = [];
  if (d.contactValue) contactParts.push(d.contactValue);
  if (d.location) contactParts.push(d.location);
  var contactStr = contactParts.join('  \u2022  ');

  // Sidebar content (white text)
  var sideParas = [];
  sideParas.push(new D.Paragraph({
    children: [new D.TextRun({ text: name, bold: true, font: 'Arial', size: 44, color: 'FFFFFF' })],
    spacing: { after: 120 },
  }));
  sideParas.push(contactPara(contactStr, { sz: 24, color: 'FFFFFF', sa: 160 }));
  sideParas = sideParas.concat(skillsParas(d, ac, { textColor: 'FFFFFF', sz: 24, indent: undefined }));
  sideParas = sideParas.concat(educationParas(d, ac, { textColor: 'FFFFFF', subColor: 'FFFFFF', itemSz: 24 }));
  sideParas = sideParas.concat(linksParas(d, ac, { textColor: 'FFFFFF', sz: 24 }));

  // Main content
  var mainParas = [];
  mainParas = mainParas.concat(summaryParas(d, ac, { textColor: '1B2440' }));
  mainParas = mainParas.concat(experienceParas(d, ac, { textColor: '1B2440', subColor: '5B6B8C' }));
  mainParas = mainParas.concat(projectsParas(d, ac, { textColor: '1B2440' }));

  var noTblBorders = noCellBorders();
  var tblNoBorders = noBorder();
  var sidebarWidth = 3070;
  var rightWidth = 5956;

  var leftCol = sidebarLeft ? sideParas : mainParas;
  var rightCol = sidebarLeft ? mainParas : sideParas;
  var leftW = sidebarLeft ? sidebarWidth : rightWidth;
  var rightW = sidebarLeft ? rightWidth : sidebarWidth;

  var children = [];
  var tblRow = new D.TableRow({
    children: [
      new D.TableCell({
        children: leftCol.length ? leftCol : [emptyPara()],
        width: { size: leftW, type: D.WidthType.DXA },
        borders: noTblBorders,
        shading: sidebarLeft
          ? { fill: sbBgLight, type: D.ShadingType.CLEAR, color: 'auto' }
          : undefined,
        verticalAlign: D.VerticalAlign.TOP,
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
      }),
      new D.TableCell({
        children: rightCol.length ? rightCol : [emptyPara()],
        width: { size: rightW, type: D.WidthType.DXA },
        borders: noTblBorders,
        shading: sidebarLeft
          ? undefined
          : { fill: sbBgLight, type: D.ShadingType.CLEAR, color: 'auto' },
        verticalAlign: D.VerticalAlign.TOP,
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
      }),
    ],
  });
  children.push(new D.Table({
    rows: [tblRow],
    width: { size: 9026, type: D.WidthType.DXA },
    layout: D.FixedLayoutType,
    borders: tblNoBorders,
  }));
  return children;
}

/* ══════════════════════════════════════════════════════
   MAIN BUILD FUNCTION
   ══════════════════════════════════════════════════════ */
export function buildDocx(data, template) {
  var D = getD();
  var bodyChildren;

  switch (template.layout) {
    case 'single-column':
      bodyChildren = buildSingleColumn(data, template);
      break;
    case 'header-band':
      bodyChildren = buildHeaderBand(data, template);
      break;
    case 'sidebar-left':
      bodyChildren = buildSidebar(data, template, true);
      break;
    case 'sidebar-right':
      bodyChildren = buildSidebar(data, template, false);
      break;
    default:
      bodyChildren = buildSingleColumn(data, template);
  }

  return new D.Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 720, footer: 720 },
        },
      },
      children: bodyChildren,
    }],
  });
}

/* ══════════════════════════════════════════════════════
   HTML FALLBACK (if docx library fails)
   ══════════════════════════════════════════════════════ */
export function buildDocxHtmlFallback(data, template) {
  var ac = template.accent;
  var name = esc(data.fullName) || 'Resume';
  var contact = [];
  if (data.contactValue) contact.push(esc(data.contactValue));
  if (data.location) contact.push(esc(data.location));
  var contactStr = contact.join(' &bull; ');

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + name + ' - Resume</title>'
    + '<style>'
    + 'body{font-family:Arial,Helvetica,sans-serif;color:#1B2440;margin:40px;line-height:1.5;}'
    + 'h1{font-size:24px;margin-bottom:4px;}'
    + '.contact{color:#5B6B8C;font-size:13px;margin-bottom:20px;}'
    + 'h2{font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:' + ac + ';border-bottom:2px solid ' + ac + ';padding-bottom:4px;margin-top:20px;margin-bottom:10px;}'
    + '.skill{display:inline-block;border:1px solid ' + ac + ';color:' + ac + ';padding:2px 10px;border-radius:12px;font-size:12px;margin:2px;}'
    + '.item{margin-bottom:12px;}'
    + '.item-head{font-weight:600;font-size:14px;}'
    + '.item-meta{color:#5B6B8C;font-size:12px;}'
    + '.item-sub{color:#5B6B8C;font-size:13px;}'
    + '.body-text{font-size:13px;color:#2A3654;}'
    + '</style></head><body>';

  html += '<h1>' + name + '</h1><div class="contact">' + contactStr + '</div>';

  if (data.summary) {
    html += '<h2>Summary</h2><p class="body-text">' + esc(data.summary) + '</p>';
  }
  if (data.experience?.length) {
    html += '<h2>Experience</h2>';
    data.experience.forEach(function(e) {
      if (!e.role && !e.company) return;
      html += '<div class="item"><div class="item-head">' + esc(e.role) + (e.company ? ' &mdash; ' + esc(e.company) : '') + '</div>';
      if (e.duration) html += '<div class="item-meta">' + esc(e.duration) + '</div>';
      if (e.description) html += '<p class="body-text">' + esc(e.description) + '</p>';
      html += '</div>';
    });
  }
  if (data.projects?.length) {
    html += '<h2>Projects</h2>';
    data.projects.forEach(function(p) {
      if (!p.name) return;
      html += '<div class="item"><div class="item-head">' + esc(p.name) + '</div>';
      if (p.description) html += '<p class="body-text">' + esc(p.description) + '</p>';
      html += '</div>';
    });
  }
  if (data.skills?.length) {
    html += '<h2>Skills</h2><p>';
    data.skills.filter(Boolean).forEach(function(s) {
      html += '<span class="skill">' + esc(s) + '</span> ';
    });
    html += '</p>';
  }
  if (data.education?.length) {
    html += '<h2>Education</h2>';
    data.education.forEach(function(e) {
      if (!e.degree && !e.school) return;
      html += '<div class="item"><div class="item-head">' + esc(e.degree) + '</div>';
      if (e.school) html += '<div class="item-sub">' + esc(e.school) + '</div>';
      if (e.year) html += '<div class="item-meta">' + esc(e.year) + '</div>';
      html += '</div>';
    });
  }
  if (data.links?.length) {
    html += '<h2>Links</h2><p class="body-text">' + data.links.filter(Boolean).map(function(l) { return esc(l); }).join(' &bull; ') + '</p>';
  }

  html += '</body></html>';
  return html;
}
