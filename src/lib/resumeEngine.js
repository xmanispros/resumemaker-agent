// resumeEngine.js — server-side HTML builder (used by templates page previews)

export function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function sec(title, html) {
  if (!html) return '';
  return `<div class="rsm-section"><h3 class="rsm-section-title">${esc(title)}</h3>${html}</div>`;
}

function list(items, fn) {
  const v = (items||[]).filter(i => i && Object.values(i).some(Boolean));
  if (!v.length) return '';
  return v.map(fn).join('');
}

export function renderContact(data) {
  const b = [];
  if (data.contactValue) b.push(esc(data.contactValue));
  if (data.location) b.push(esc(data.location));
  return b.join('  •  ');
}

export function buildResumeHTML(data, template) {
  const ac = template.accent;
  const sf = template.surface;
  const fc = template.font === 'display' ? 'font-display' : 'font-sans';
  const name = esc(data.fullName) || 'Your Name';

  const photo = data.photo
    ? `<img src="${data.photo}" alt="${esc(data.fullName)}" class="rsm-photo"/>`
    : `<div class="rsm-photo rsm-photo-fallback" style="background:${ac}">${initials(data.fullName)}</div>`;

  const summ = data.summary ? `<p class="rsm-body">${esc(data.summary)}</p>` : '';

  let skills = '';
  if (data.skills?.length) {
    skills = `<div class="rsm-skills">${data.skills.filter(Boolean).map(s =>
      `<span class="rsm-pill" style="border-color:${ac};color:${ac}">${esc(s)}</span>`
    ).join('')}</div>`;
  }

  const edu = list(data.education, e =>
    `<div class="rsm-item"><div class="rsm-item-head"><span class="rsm-item-title">${esc(e.degree)}</span><span class="rsm-item-meta">${esc(e.year)}</span></div><div class="rsm-item-sub">${esc(e.school)}</div></div>`
  );

  const exp = list(data.experience, e =>
    `<div class="rsm-item"><div class="rsm-item-head"><span class="rsm-item-title">${esc(e.role)}</span><span class="rsm-item-meta">${esc(e.duration)}</span></div><div class="rsm-item-sub">${esc(e.company)}</div>${e.description?`<p class="rsm-body" style="margin-top:4px">${esc(e.description)}</p>`:''}</div>`
  );

  const proj = list(data.projects, p =>
    `<div class="rsm-item"><div class="rsm-item-head"><span class="rsm-item-title">${esc(p.name)}</span></div>${p.description?`<p class="rsm-body" style="margin-top:4px">${esc(p.description)}</p>`:''}</div>`
  );

  let links = '';
  if (data.links?.length) {
    links = `<div class="rsm-links">${data.links.filter(Boolean).map(l =>
      `<span class="rsm-link">${esc(l)}</span>`
    ).join('')}</div>`;
  }

  const hdr = `<div class="rsm-header">${photo}<div><h1 class="rsm-name ${fc}">${name}</h1><p class="rsm-contact">${renderContact(data)}</p></div></div>`;
  const side = sec('Skills',skills) + sec('Education',edu) + sec('Links',links);
  const main = sec('Summary',summ) + sec('Experience',exp) + sec('Projects',proj);

  if (template.layout === 'single-column')
    return `<div class="rsm-doc rsm-single ${fc}">${hdr}<hr class="rsm-rule" style="border-color:${ac}33"/>${main}${sec('Skills',skills)}${sec('Education',edu)}${sec('Links',links)}</div>`;

  if (template.layout === 'header-band')
    return `<div class="rsm-doc rsm-band ${fc}"><div class="rsm-band-top" style="background:${sf}1A">${hdr}</div><div class="rsm-band-grid"><div>${main}</div><div>${side}</div></div></div>`;

  const sidebarFirst = template.layout === 'sidebar-left';
  const sp = `<div class="rsm-sidebar" style="background:${sf}">${photo}<h1 class="rsm-name rsm-name-sidebar ${fc}">${name}</h1><p class="rsm-contact rsm-contact-sidebar">${renderContact(data)}</p><div class="rsm-sidebar-sections">${sec('Skills',skills)}${sec('Education',edu)}${sec('Links',links)}</div></div>`;
  const mp = `<div class="rsm-main">${main}</div>`;
  return `<div class="rsm-doc rsm-sidebar-layout ${fc}" style="flex-direction:${sidebarFirst?'row':'row-reverse'}">${sp}${mp}</div>`;
}
