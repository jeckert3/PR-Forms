import { CheckSquare, Square } from 'lucide-react';

function isVisible(question, answers) {
  if (!question.conditional) return true;
  const { field, includes, equals } = question.conditional;
  const val = answers[field];
  if (includes) {
    return Array.isArray(val) ? val.includes(includes) : val === includes;
  }
  if (equals !== undefined) {
    return val === equals;
  }
  return true;
}

// ── Text / email / tel / date ──────────────────────────────────────────────
function TextQuestion({ question, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block font-semibold text-gray-800 text-base leading-snug">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={question.type === 'email' ? 'email' : question.type === 'tel' ? 'tel' : question.type === 'date' ? 'date' : 'text'}
        className="input-field"
        value={value || ''}
        placeholder={question.placeholder || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────
function TextareaQuestion({ question, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block font-semibold text-gray-800 text-base leading-snug">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        rows={5}
        className="input-field resize-none"
        value={value || ''}
        placeholder={question.placeholder || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ── Multicheck (checkbox group) ───────────────────────────────────────────
function MulticheckQuestion({ question, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <label className="block font-semibold text-gray-800 text-base leading-snug">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {question.hint && (
          <p className="text-sm text-gray-400 mt-0.5">{question.hint}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {question.options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all active:scale-98 ${
                checked
                  ? 'border-cchp-blue bg-cchp-lightblue text-cchp-darkblue'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="shrink-0 text-cchp-blue">
                {checked ? <CheckSquare size={20} /> : <Square size={20} className="text-gray-300" />}
              </span>
              <span className="text-sm font-medium leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Radio ─────────────────────────────────────────────────────────────────
function RadioQuestion({ question, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block font-semibold text-gray-800 text-base leading-snug">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex flex-wrap gap-3">
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 ${
              value === opt
                ? 'border-cchp-blue bg-cchp-blue text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-cchp-blue'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Select (dropdown) ─────────────────────────────────────────────────────
function SelectQuestion({ question, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block font-semibold text-gray-800 text-base leading-snug">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className="input-field"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select an option…</option>
        {question.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// ── Yes / No / NA table section ───────────────────────────────────────────
export function YesNoNASection({ section, answers, onChange }) {
  const scoreData = section.questions.reduce(
    (acc, q) => {
      const ans = answers[q.id];
      const pv = q.pointValue || 0;
      if (ans === 'Yes') { acc.earned += pv; acc.possible += pv; }
      else if (ans === 'No') { acc.possible += pv; }
      return acc;
    },
    { earned: 0, possible: 0 }
  );

  const answered = section.questions.filter((q) => answers[q.id]).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800 text-base">{section.title}</h2>
          {section.description && (
            <p className="text-sm text-gray-500 mt-0.5">{section.description}</p>
          )}
        </div>
        <div className="text-right shrink-0 ml-3">
          <div className="text-xs text-gray-400">{answered}/{section.questions.length} answered</div>
          {scoreData.possible > 0 && (
            <div className="text-sm font-bold text-cchp-blue">
              {scoreData.earned}/{scoreData.possible} pts
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="grid bg-cchp-blue text-white text-xs font-bold" style={{ gridTemplateColumns: '1fr 44px 44px 44px 44px' }}>
          <div className="px-3 py-2">Item</div>
          <div className="px-1 py-2 text-center">Yes</div>
          <div className="px-1 py-2 text-center">No</div>
          <div className="px-1 py-2 text-center">N/A</div>
          <div className="px-1 py-2 text-center">Pts</div>
        </div>

        {section.questions.map((q, idx) => {
          const ans = answers[q.id] || '';
          const pv = q.pointValue || 0;
          const score = ans === 'Yes' ? pv : ans === 'No' ? 0 : null;

          return (
            <div
              key={q.id}
              className={`grid items-center border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
              style={{ gridTemplateColumns: '1fr 44px 44px 44px 44px' }}
            >
              <div className="px-3 py-2.5">
                <p className="text-sm text-gray-800 leading-snug">{q.label}</p>
                {pv > 0 && (
                  <span className="inline-block mt-0.5 text-xs text-cchp-blue font-medium">
                    {pv} {pv === 1 ? 'pt' : 'pts'}
                  </span>
                )}
              </div>

              {['Yes', 'No', 'NA'].map((opt) => (
                <div key={opt} className="flex items-center justify-center py-2">
                  <button
                    type="button"
                    onClick={() => onChange(q.id, ans === opt ? '' : opt)}
                    className={`w-9 h-9 rounded-full border-2 font-bold text-xs transition-all active:scale-90 ${
                      ans === opt
                        ? opt === 'Yes'
                          ? 'border-green-500 bg-green-500 text-white'
                          : opt === 'No'
                          ? 'border-red-400 bg-red-400 text-white'
                          : 'border-gray-400 bg-gray-400 text-white'
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {opt}
                  </button>
                </div>
              ))}

              <div className="text-center text-sm font-semibold">
                {score !== null ? (
                  <span className={score > 0 ? 'text-green-600' : 'text-gray-400'}>
                    {score}
                  </span>
                ) : ans === 'NA' ? (
                  <span className="text-gray-300 text-xs">—</span>
                ) : (
                  <span className="text-gray-200">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main dispatcher ───────────────────────────────────────────────────────
export default function QuestionRenderer({ question, value, onChange, answers }) {
  if (!isVisible(question, answers)) return null;

  switch (question.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'date':
      return <TextQuestion question={question} value={value} onChange={onChange} />;
    case 'textarea':
      return <TextareaQuestion question={question} value={value} onChange={onChange} />;
    case 'multicheck':
      return <MulticheckQuestion question={question} value={value} onChange={onChange} />;
    case 'radio':
      return <RadioQuestion question={question} value={value} onChange={onChange} />;
    case 'select':
      return <SelectQuestion question={question} value={value} onChange={onChange} />;
    default:
      return null;
  }
}
