// resumeState.js — single source of truth for the in-progress resume,
// persisted to localStorage so switching templates or pages never loses data.

const KEY = 'rma-resume-data';
const TEMPLATE_KEY = 'rma-selected-template';

export const emptyData = () => ({
  fullName: '',
  photo: '',
  contactType: 'email', // 'email' | 'mobile'
  contactValue: '',
  location: '',
  summary: '',
  skills: [],
  education: [], // { degree, school, year }
  experience: [], // { role, company, duration, description }
  projects: [], // { name, description }
  links: [],
  includeOptional: null, // null = not asked yet, true/false after agent question
});

export function loadResumeData() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyData(), ...JSON.parse(raw) } : emptyData();
  } catch {
    return emptyData();
  }
}

export function saveResumeData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadSelectedTemplate(fallbackId) {
  return localStorage.getItem(TEMPLATE_KEY) || fallbackId;
}

export function saveSelectedTemplate(id) {
  localStorage.setItem(TEMPLATE_KEY, id);
}
