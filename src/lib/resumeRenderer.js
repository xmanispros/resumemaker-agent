// resumeRenderer.js — Advanced resume HTML builder
// Single source of truth for all resume rendering (preview, PDF, print)

export function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

function contactLine(d) {
  const b = [];
  if (d.contactValue) b.push(esc(d.contactValue));
  if (d.location) b.push(esc(d.location));
  return b.join('  &bull;  ');
}

function sec(title, html) {
  if (!html) return '';
  return `<div class="rsm-section"><h3 class="rsm-section-title">${esc(title)}</h3>${html}</div>`;
}

function list(items, fn) {
  const v = (items || []).filter(i => i && Object.values(i).some(Boolean));
  if (!v.length) return '';
  return v.map(fn).join('');
}

/* ── Section builders ── */

function buildSummary(data) {
  return data.summary ? `<p class="rsm-body">${esc(data.summary)}</p>` : '';
}

function buildSkills(data, accent) {
  if (!data.skills?.length) return '';
  return `<div class="rsm-skills">${data.skills.filter(Boolean).map(s =>
    `<span class="rsm-pill" style="border-color:${accent};color:${accent}">${esc(s)}</span>`
  ).join('')}</div>`;
}

function buildEducation(data) {
  return list(data.education, e =>
    `<div class="rsm-item">
      <div class="rsm-item-head">
        <span class="rsm-item-title">${esc(e.degree)}</span>
        <span class="rsm-item-meta">${esc(e.year)}</span>
      </div>
      <div class="rsm-item-sub">${esc(e.school)}</div>
    </div>`
  );
}

function buildExperience(data) {
  return list(data.experience, e =>
    `<div class="rsm-item">
      <div class="rsm-item-head">
        <span class="rsm-item-title">${esc(e.role)}</span>
        <span class="rsm-item-meta">${esc(e.duration)}</span>
      </div>
      <div class="rsm-item-sub">${esc(e.company)}</div>
      ${e.description ? `<p class="rsm-body" style="margin-top:4px">${esc(e.description)}</p>` : ''}
    </div>`
  );
}

function buildProjects(data) {
  return list(data.projects, p =>
    `<div class="rsm-item">
      <div class="rsm-item-head">
        <span class="rsm-item-title">${esc(p.name)}</span>
      </div>
      ${p.description ? `<p class="rsm-body" style="margin-top:4px">${esc(p.description)}</p>` : ''}
    </div>`
  );
}

function buildLinks(data) {
  if (!data.links?.length) return '';
  return `<div class="rsm-links">${data.links.filter(Boolean).map(l =>
    `<span class="rsm-link">${esc(l)}</span>`
  ).join('')}</div>`;
}

function buildPhoto(data, accent) {
  return data.photo
    ? `<img src="${data.photo}" alt="${esc(data.fullName)}" class="rsm-photo"/>`
    : `<div class="rsm-photo rsm-photo-fallback" style="background:${accent}">${initials(data.fullName)}</div>`;
}

function buildHeader(data, accent, fontClass) {
  const name = esc(data.fullName) || 'Your Name';
  const photo = buildPhoto(data, accent);
  return `<div class="rsm-header">
    ${photo}
    <div>
      <h1 class="rsm-name ${fontClass}">${name}</h1>
      <p class="rsm-contact">${contactLine(data)}</p>
    </div>
  </div>`;
}

/* ── Layout renderers ── */

function renderSingleColumn(data, t) {
  const ac = t.accent;
  const fc = t.font === 'display' ? 'font-display' : 'font-sans';
  const hdr = buildHeader(data, ac, fc);
  const summary = buildSummary(data);
  const exp = buildExperience(data);
  const proj = buildProjects(data);
  const skills = buildSkills(data, ac);
  const edu = buildEducation(data);
  const links = buildLinks(data);

  return `<div class="rsm-doc rsm-single ${fc}">
    ${hdr}
    <hr class="rsm-rule" style="border-color:${ac}33"/>
    ${sec('Summary', summary)}
    ${sec('Experience', exp)}
    ${sec('Projects', proj)}
    ${sec('Skills', skills)}
    ${sec('Education', edu)}
    ${sec('Links', links)}
  </div>`;
}

function renderHeaderBand(data, t) {
  const ac = t.accent;
  const sf = t.surface;
  const fc = t.font === 'display' ? 'font-display' : 'font-sans';
  const hdr = buildHeader(data, ac, fc);
  const summary = buildSummary(data);
  const exp = buildExperience(data);
  const proj = buildProjects(data);
  const skills = buildSkills(data, ac);
  const edu = buildEducation(data);
  const links = buildLinks(data);

  const main = sec('Summary', summary) + sec('Experience', exp) + sec('Projects', proj);
  const side = sec('Skills', skills) + sec('Education', edu) + sec('Links', links);

  return `<div class="rsm-doc rsm-band ${fc}">
    <div class="rsm-band-top" style="background:${sf}1A">${hdr}</div>
    <div class="rsm-band-grid">
      <div>${main}</div>
      <div>${side}</div>
    </div>
  </div>`;
}

function renderSidebar(data, t, sidebarLeft) {
  const ac = t.accent;
  const sf = t.surface;
  const fc = t.font === 'display' ? 'font-display' : 'font-sans';
  const name = esc(data.fullName) || 'Your Name';
  const photo = buildPhoto(data, ac);

  const summary = buildSummary(data);
  const exp = buildExperience(data);
  const proj = buildProjects(data);
  const skills = buildSkills(data, ac);
  const edu = buildEducation(data);
  const links = buildLinks(data);

  const sideSections = sec('Skills', skills) + sec('Education', edu) + sec('Links', links);
  const mainContent = sec('Summary', summary) + sec('Experience', exp) + sec('Projects', proj);

  const sidebar = `<div class="rsm-sidebar" style="background:${sf}">
    ${photo}
    <h1 class="rsm-name rsm-name-sidebar ${fc}">${name}</h1>
    <p class="rsm-contact rsm-contact-sidebar">${contactLine(data)}</p>
    <div class="rsm-sidebar-sections">${sideSections}</div>
  </div>`;

  const main = `<div class="rsm-main">${mainContent}</div>`;

  return `<div class="rsm-doc rsm-sidebar-layout ${fc}" style="flex-direction:${sidebarLeft ? 'row' : 'row-reverse'}">
    ${sidebar}
    ${main}
  </div>`;
}

/* ── Main export ── */

export function buildResumeHTML(data, template) {
  switch (template.layout) {
    case 'single-column': return renderSingleColumn(data, template);
    case 'header-band':   return renderHeaderBand(data, template);
    case 'sidebar-left':  return renderSidebar(data, template, true);
    case 'sidebar-right': return renderSidebar(data, template, false);
    default:              return renderSingleColumn(data, template);
  }
}

export function renderContact(data) {
  return contactLine(data);
}
