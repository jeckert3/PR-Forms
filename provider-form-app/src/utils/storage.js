const KEYS = {
  CUSTOM_FORMS: 'cchp_custom_forms',
  SAVED_ANSWERS: 'cchp_saved_answers',
};

export function getCustomForms() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.CUSTOM_FORMS) || '[]');
  } catch {
    return [];
  }
}

export function saveCustomForm(form) {
  const forms = getCustomForms();
  const idx = forms.findIndex((f) => f.id === form.id);
  if (idx >= 0) {
    forms[idx] = form;
  } else {
    forms.push(form);
  }
  localStorage.setItem(KEYS.CUSTOM_FORMS, JSON.stringify(forms));
}

export function deleteCustomForm(formId) {
  const forms = getCustomForms().filter((f) => f.id !== formId);
  localStorage.setItem(KEYS.CUSTOM_FORMS, JSON.stringify(forms));
  clearSavedAnswers(formId);
}

export function getSavedAnswers(formId) {
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.SAVED_ANSWERS) || '{}');
    return all[formId] || {};
  } catch {
    return {};
  }
}

export function saveDraftAnswers(formId, answers) {
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.SAVED_ANSWERS) || '{}');
    all[formId] = answers;
    localStorage.setItem(KEYS.SAVED_ANSWERS, JSON.stringify(all));
  } catch {
    // ignore storage errors
  }
}

export function clearSavedAnswers(formId) {
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.SAVED_ANSWERS) || '{}');
    delete all[formId];
    localStorage.setItem(KEYS.SAVED_ANSWERS, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function generateId() {
  return 'form_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}
