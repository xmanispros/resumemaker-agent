// Resume template definitions.
// Each template = a category + a color scheme + a layout variant + sample
// demo data used to render a realistic thumbnail (not just color blocks).
// Templates are generated programmatically from a palette x layout matrix so
// the library can scale (currently ~75) while staying visually coherent.

export type Category = 'Modern' | 'Professional' | 'Creative' | 'Simple' | 'ATS-Friendly';
export type LayoutKind = 'sidebar-left' | 'sidebar-right' | 'single-column' | 'header-band';

export interface SampleData {
  name: string;
  role: string;
  contact: string;
  skills: string[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: Category;
  layout: LayoutKind;
  accent: string; // hex
  ink: string; // hex, main text color
  surface: string; // hex, sidebar/band background
  font: 'display' | 'sans';
  description: string;
  sample: SampleData;
}

const SAMPLES: SampleData[] = [
  { name: 'Alex Carter', role: 'Product Designer', contact: 'alex@email.com  •  Bengaluru', skills: ['Figma', 'UX Research', 'Prototyping'] },
  { name: 'Priya Sharma', role: 'Marketing Manager', contact: 'priya@email.com  •  Mumbai', skills: ['SEO', 'Content', 'Analytics'] },
  { name: 'Rohan Verma', role: 'Software Engineer', contact: 'rohan@email.com  •  Pune', skills: ['React', 'Node.js', 'AWS'] },
  { name: 'Sara Khan', role: 'Business Analyst', contact: 'sara@email.com  •  Delhi', skills: ['Excel', 'SQL', 'Power BI'] },
  { name: 'Manish Kumar', role: 'MBA Candidate', contact: 'manish@email.com  •  Hyderabad', skills: ['Strategy', 'Finance', 'Product'] },
];

interface Palette {
  key: string;
  label: string;
  accent: string;
  surface: string;
}

// 15 named palettes shared across categories — gives genuine visual variety
// without hand-authoring every single template object.
const PALETTES: Palette[] = [
  { key: 'teal', label: 'Teal', accent: '#0F6E5D', surface: '#0F6E5D' },
  { key: 'azure', label: 'Azure', accent: '#0A84FF', surface: '#0A84FF' },
  { key: 'violet', label: 'Violet', accent: '#6D4FC2', surface: '#6D4FC2' },
  { key: 'coral', label: 'Coral', accent: '#E0613B', surface: '#E0613B' },
  { key: 'slate', label: 'Slate', accent: '#3B5169', surface: '#3B5169' },
  { key: 'amber', label: 'Amber', accent: '#D4A017', surface: '#D4A017' },
  { key: 'rose', label: 'Rose', accent: '#C1487A', surface: '#C1487A' },
  { key: 'forest', label: 'Forest', accent: '#234D35', surface: '#234D35' },
  { key: 'burgundy', label: 'Burgundy', accent: '#7A2A3A', surface: '#7A2A3A' },
  { key: 'graphite', label: 'Graphite', accent: '#44494F', surface: '#44494F' },
  { key: 'lagoon', label: 'Lagoon', accent: '#1FA2A6', surface: '#1FA2A6' },
  { key: 'plum', label: 'Plum', accent: '#7D3C8A', surface: '#7D3C8A' },
  { key: 'citrus', label: 'Citrus', accent: '#C7A317', surface: '#E8D45A' },
  { key: 'indigo', label: 'Indigo', accent: '#2E2A6E', surface: '#2E2A6E' },
  { key: 'mint', label: 'Mint', accent: '#1F9D7C', surface: '#1F9D7C' },
];

function buildVariants(
  category: Category,
  layouts: LayoutKind[],
  palettes: Palette[],
  font: 'display' | 'sans',
  namePrefix: string,
  descSuffix: string,
  surfaceOverride?: (p: Palette) => string
): ResumeTemplate[] {
  const out: ResumeTemplate[] = [];
  let i = 0;
  for (const layout of layouts) {
    for (const p of palettes) {
      const id = `${category.toLowerCase().replace(/[^a-z]/g, '')}-${p.key}-${layout}`;
      out.push({
        id,
        name: `${namePrefix} ${p.label}`,
        category,
        layout,
        accent: p.accent,
        ink: '#1B2440',
        surface: surfaceOverride ? surfaceOverride(p) : p.surface,
        font,
        description: `${p.label} palette, ${layout.replace('-', ' ')} layout — ${descSuffix}`,
        sample: SAMPLES[i++ % SAMPLES.length],
      });
    }
  }
  return out;
}

// ---- Modern: bold color, sans type, sidebars + header bands ----
const modern: ResumeTemplate[] = [
  ...buildVariants('Modern', ['sidebar-left', 'sidebar-right'], PALETTES.slice(0, 6), 'sans', 'Modern', 'confident color blocking for any industry'),
  ...buildVariants('Modern', ['header-band'], PALETTES.slice(0, 5), 'sans', 'Modern Band', 'a bold header band leading into a clean two-column body'),
];

// ---- New "Modern Edge": minimal-bold hybrid, single column with a strong
//      accent rule instead of a color block — fresh, app-like feel ----
const modernEdge: ResumeTemplate[] = buildVariants(
  'Modern',
  ['single-column'],
  PALETTES.slice(0, 8),
  'sans',
  'Modern Edge',
  'a fresh minimal-bold hybrid with a single strong accent rule',
  () => '#FFFFFF'
);

// ---- Professional: serif headings, conservative palettes ----
const professional: ResumeTemplate[] = [
  ...buildVariants('Professional', ['sidebar-left'], PALETTES.slice(5, 11), 'display', 'Professional', 'an executive, boardroom-ready layout'),
  ...buildVariants('Professional', ['single-column', 'header-band'], PALETTES.slice(5, 10), 'display', 'Professional Classic', 'a traditional structure with serif headings'),
];

// ---- Creative: header bands and sidebars, expressive palettes ----
const creative: ResumeTemplate[] = [
  ...buildVariants('Creative', ['header-band', 'sidebar-right'], PALETTES.slice(9, 15), 'display', 'Creative', 'an expressive layout for design and portfolio roles'),
  ...buildVariants('Creative', ['sidebar-left'], PALETTES.slice(0, 4), 'display', 'Creative Bold', 'a bold sidebar treatment for standout applications'),
];

// ---- Simple: light surfaces, generous whitespace ----
const simple: ResumeTemplate[] = buildVariants(
  'Simple',
  ['single-column', 'header-band', 'sidebar-left'],
  PALETTES.slice(0, 7),
  'sans',
  'Simple',
  'minimal ornamentation, generous whitespace',
  () => '#F2F2F7'
);

// ---- ATS-Friendly: single column only, no graphics, parses cleanly ----
const ats: ResumeTemplate[] = buildVariants(
  'ATS-Friendly',
  ['single-column'],
  PALETTES.slice(0, 12),
  'sans',
  'ATS',
  'pure text hierarchy designed to parse cleanly in applicant tracking systems',
  () => '#FFFFFF'
);

export const templates: ResumeTemplate[] = [
  ...modern,
  ...modernEdge,
  ...professional,
  ...creative,
  ...simple,
  ...ats,
];

export const categories: Category[] = ['Modern', 'Professional', 'Creative', 'Simple', 'ATS-Friendly'];

export function getTemplate(id: string): ResumeTemplate {
  return templates.find((t) => t.id === id) ?? templates[0];
}
