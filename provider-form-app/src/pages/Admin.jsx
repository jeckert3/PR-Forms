import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Trash2, Plus, X, Save, FileText, ChevronDown, ChevronUp,
  AlertCircle, Shield,
} from 'lucide-react';
import Header from '../components/Header';
import { BUILT_IN_FORMS } from '../forms/index';
import {
  getCustomForms, saveCustomForm, deleteCustomForm, generateId,
} from '../utils/storage';

const QUESTION_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text (multi-line)' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone number' },
  { value: 'radio', label: 'Single choice' },
  { value: 'multicheck', label: 'Multiple choice (checkboxes)' },
  { value: 'yes-no-na', label: 'Yes / No / NA (scored)' },
];

function QuestionBuilder({ question, onChange, onRemove }) {
  const [open, setOpen] = useState(true);
  const needsOptions = ['radio', 'multicheck', 'yes-no-na'].includes(question.type);
  const [optionInput, setOptionInput] = useState('');

  const update = (key, val) => onChange({ ...question, [key]: val });

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (!trimmed) return;
    update('options', [...(question.options || []), trimmed]);
    setOptionInput('');
  };

  const removeOption = (idx) => {
    update('options', question.options.filter((_, i) => i !== idx));
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium text-sm text-gray-700 truncate flex-1 mr-2">
          {question.label || 'Untitled question'}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
            {QUESTION_TYPES.find((t) => t.value === question.type)?.label || question.type}
          </span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <Trash2 size={14} />
          </button>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Question label *</label>
            <input
              type="text"
              className="input-field text-sm"
              value={question.label}
              placeholder="Enter the question text…"
              onChange={(e) => update('label', e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Question type *</label>
            <select
              className="input-field text-sm"
              value={question.type}
              onChange={(e) => update('type', e.target.value)}
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {question.type === 'yes-no-na' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Point value</label>
              <input
                type="number"
                min="0"
                max="10"
                className="input-field text-sm w-24"
                value={question.pointValue || 0}
                onChange={(e) => update('pointValue', parseInt(e.target.value, 10) || 0)}
              />
            </div>
          )}

          {needsOptions && question.type !== 'yes-no-na' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Options</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input-field text-sm flex-1"
                  value={optionInput}
                  placeholder="Add an option…"
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                />
                <button type="button" onClick={addOption} className="btn-secondary px-3 py-2 text-sm shrink-0">
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {(question.options || []).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                    <span className="flex-1 text-sm">{opt}</span>
                    <button type="button" onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`req-${question.id}`}
              checked={!!question.required}
              onChange={(e) => update('required', e.target.checked)}
              className="rounded"
            />
            <label htmlFor={`req-${question.id}`} className="text-sm text-gray-600">Required</label>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionBuilder({ section, onChange, onRemove }) {
  const [open, setOpen] = useState(true);

  const addQuestion = () => {
    const newQ = { id: generateId(), label: '', type: 'text', required: false, options: [] };
    onChange({ ...section, questions: [...section.questions, newQ] });
  };

  const updateQuestion = (idx, q) => {
    const qs = [...section.questions];
    qs[idx] = q;
    onChange({ ...section, questions: qs });
  };

  const removeQuestion = (idx) => {
    onChange({ ...section, questions: section.questions.filter((_, i) => i !== idx) });
  };

  return (
    <div className="card border border-gray-200">
      <div
        className="flex items-center justify-between cursor-pointer -m-5 p-5"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 mr-3">
          <input
            type="text"
            className="font-bold text-gray-900 text-base bg-transparent border-b-2 border-transparent focus:border-cchp-blue outline-none w-full"
            value={section.title}
            placeholder="Section title…"
            onChange={(e) => onChange({ ...section, title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="text-xs text-gray-400 mt-0.5">{section.questions.length} question(s)</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-red-400 hover:text-red-500 p-1"
          >
            <Trash2 size={16} />
          </button>
          {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          {section.questions.map((q, idx) => (
            <QuestionBuilder
              key={q.id}
              question={q}
              onChange={(updated) => updateQuestion(idx, updated)}
              onRemove={() => removeQuestion(idx)}
            />
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="w-full border-2 border-dashed border-gray-200 text-gray-400 hover:border-cchp-blue hover:text-cchp-blue rounded-xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Question
          </button>
        </div>
      )}
    </div>
  );
}

function FormEditor({ form, onSave, onCancel }) {
  const [name, setName] = useState(form?.name || '');
  const [description, setDescription] = useState(form?.description || '');
  const [sections, setSections] = useState(
    form?.sections || [{ id: generateId(), title: 'Section 1', questions: [] }]
  );
  const [error, setError] = useState('');

  const addSection = () => {
    setSections((ss) => [...ss, { id: generateId(), title: `Section ${ss.length + 1}`, questions: [] }]);
  };

  const updateSection = (idx, s) => {
    setSections((ss) => { const n = [...ss]; n[idx] = s; return n; });
  };

  const removeSection = (idx) => {
    setSections((ss) => ss.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!name.trim()) { setError('Form name is required.'); return; }
    if (sections.length === 0) { setError('Add at least one section.'); return; }
    for (const s of sections) {
      for (const q of s.questions) {
        if (!q.label.trim()) { setError(`All questions must have a label. Check section "${s.title}".`); return; }
      }
    }
    setError('');
    onSave({
      id: form?.id || generateId(),
      name: name.trim(),
      description: description.trim(),
      color: 'purple',
      builtIn: false,
      sections,
    });
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">{form ? 'Edit Form' : 'New Custom Form'}</h2>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">Form Name *</label>
          <input type="text" className="input-field" value={name} placeholder="e.g., Provider Credentialing Checklist" onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">Description</label>
          <input type="text" className="input-field" value={description} placeholder="Brief description of what this form is for" onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      {sections.map((section, idx) => (
        <SectionBuilder
          key={section.id}
          section={section}
          onChange={(s) => updateSection(idx, s)}
          onRemove={() => removeSection(idx)}
        />
      ))}

      <button
        type="button"
        onClick={addSection}
        className="w-full border-2 border-dashed border-cchp-blue/40 text-cchp-blue hover:border-cchp-blue rounded-2xl py-4 font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} /> Add Section
      </button>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex gap-3 pb-6">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Save size={17} /> Save Form
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [view, setView] = useState('list'); // 'list' | 'new' | 'edit'
  const [editingForm, setEditingForm] = useState(null);
  const [customForms, setCustomForms] = useState(getCustomForms);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const refreshForms = () => setCustomForms(getCustomForms());

  const handleSave = (form) => {
    saveCustomForm(form);
    refreshForms();
    setView('list');
    setEditingForm(null);
  };

  const handleDelete = (formId) => {
    deleteCustomForm(formId);
    refreshForms();
    setDeleteConfirm(null);
  };

  if (view === 'new' || view === 'edit') {
    return (
      <div className="min-h-screen bg-cchp-gray">
        <Header title={view === 'new' ? 'Add New Form' : 'Edit Form'} showBack onBack={() => { setView('list'); setEditingForm(null); }} />
        <main className="max-w-3xl mx-auto px-4 py-5">
          <FormEditor
            form={editingForm}
            onSave={handleSave}
            onCancel={() => { setView('list'); setEditingForm(null); }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cchp-gray">
      <Header title="Admin — Form Library" showBack onBack={() => navigate('/')} />

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        {/* Admin badge */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <Shield size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 font-medium">
            Admin Panel — manage the form library available to all employees.
          </p>
        </div>

        {/* Built-in forms (read-only) */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Built-in Forms
          </h2>
          <div className="space-y-2">
            {BUILT_IN_FORMS.map((form) => (
              <div key={form.id} className="card flex items-center gap-4">
                <FileText size={20} className="text-cchp-blue shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{form.name}</p>
                  <p className="text-xs text-gray-400 truncate">{form.description}</p>
                </div>
                <span className="text-xs bg-cchp-lightblue text-cchp-blue px-2 py-0.5 rounded-full font-medium shrink-0">
                  Built-in
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom forms */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Custom Forms ({customForms.length})
          </h2>
          <div className="space-y-2">
            {customForms.map((form) => (
              <div key={form.id} className="card flex items-center gap-4">
                <FileText size={20} className="text-purple-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{form.name}</p>
                  <p className="text-xs text-gray-400 truncate">{form.description}</p>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {form.sections?.reduce((t, s) => t + (s.questions?.length || 0), 0)} questions
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setEditingForm(form); setView('edit'); }}
                    className="text-xs font-medium text-cchp-blue bg-cchp-lightblue px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  {deleteConfirm === form.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="text-xs font-medium text-white bg-red-500 px-2 py-1.5 rounded-lg"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(form.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {customForms.length === 0 && (
              <div className="card text-center py-8 text-gray-400 border-dashed border-2 border-gray-200">
                <FileText size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No custom forms yet</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => { setEditingForm(null); setView('new'); }}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
        >
          <Plus size={20} />
          Create New Form
        </button>
      </main>
    </div>
  );
}
