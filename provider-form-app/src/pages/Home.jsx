import { useNavigate } from 'react-router-dom';
import { ClipboardList, CheckSquare, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import { BUILT_IN_FORMS } from '../forms/index';
import { getCustomForms, getSavedAnswers, clearSavedAnswers } from '../utils/storage';

const FORM_ICONS = {
  'provider-visit-2026': ClipboardList,
  'site-evaluation-tool': CheckSquare,
};

const FORM_COLORS = {
  blue: { bg: 'bg-cchp-lightblue', text: 'text-cchp-blue', border: 'border-cchp-blue', badge: 'bg-cchp-blue' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-500', badge: 'bg-teal-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500', badge: 'bg-purple-600' },
};

function FormCard({ form, onStart }) {
  const navigate = useNavigate();
  const draft = getSavedAnswers(form.id);
  const hasDraft = Object.keys(draft).length > 0;
  const Icon = FORM_ICONS[form.id] || BookOpen;
  const colors = FORM_COLORS[form.color] || FORM_COLORS.blue;

  return (
    <div className={`card border-l-4 ${colors.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-4">
        <div className={`${colors.bg} ${colors.text} p-3 rounded-xl shrink-0`}>
          <Icon size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-gray-900 text-base leading-tight">{form.name}</h2>
            {form.builtIn && (
              <span className={`${colors.badge} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                Built-in
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5 leading-snug">{form.description}</p>
          {hasDraft && (
            <div className="flex items-center gap-1.5 mt-2 text-amber-600">
              <AlertCircle size={13} />
              <span className="text-xs font-medium">Draft in progress</span>
            </div>
          )}
        </div>
        <ChevronRight size={20} className="text-gray-400 shrink-0 mt-1" />
      </div>

      <div className="mt-4 flex gap-2">
        {hasDraft ? (
          <>
            <button
              onClick={() => navigate(`/form/${form.id}`)}
              className="btn-primary flex-1 py-2.5 text-sm"
            >
              Continue Draft
            </button>
            <button
              onClick={() => onStart(form.id, true)}
              className="btn-secondary flex-1 py-2.5 text-sm"
            >
              Start Fresh
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate(`/form/${form.id}`)}
            className="btn-primary w-full py-2.5 text-sm"
          >
            Start Form
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const customForms = getCustomForms();
  const allForms = [...BUILT_IN_FORMS, ...customForms];

  const handleStartFresh = (formId) => {
    clearSavedAnswers(formId);
    navigate(`/form/${formId}`);
  };

  return (
    <div className="min-h-screen bg-cchp-gray">
      <Header title="Provider Forms" />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-cchp-blue to-cchp-darkblue text-white rounded-2xl p-5 shadow">
          <h1 className="font-bold text-xl mb-1">Provider Relations Forms</h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Select a form below to begin. Your answers will be used to automatically complete the official Cook Children's Health Plan document.
          </p>
        </div>

        {/* Form library */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Form Library ({allForms.length})
          </h2>
          <div className="space-y-3">
            {allForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onStart={handleStartFresh}
              />
            ))}
          </div>
        </div>

        {allForms.length === 0 && (
          <div className="card text-center py-10 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No forms in library</p>
            <p className="text-sm mt-1">Ask your admin to add forms.</p>
          </div>
        )}
      </main>
    </div>
  );
}
