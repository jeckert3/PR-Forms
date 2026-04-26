import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Edit2, CheckCircle, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import { BUILT_IN_FORMS } from '../forms/index';
import { getCustomForms, getSavedAnswers, clearSavedAnswers } from '../utils/storage';
import { generatePDF } from '../utils/pdfGenerator';

function getAllForms() {
  return [...BUILT_IN_FORMS, ...getCustomForms()];
}

function isConditionMet(question, answers) {
  if (!question.conditional) return true;
  const { field, includes, equals } = question.conditional;
  const val = answers[field];
  if (includes) return Array.isArray(val) ? val.includes(includes) : val === includes;
  if (equals !== undefined) return val === equals;
  return true;
}

function formatValue(value) {
  if (!value && value !== 0) return <span className="text-gray-300 italic">Not answered</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-300 italic">None selected</span>;
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((v) => (
          <span key={v} className="bg-cchp-lightblue text-cchp-darkblue text-xs font-medium px-2 py-0.5 rounded-full">
            {v}
          </span>
        ))}
      </div>
    );
  }
  return <span className="text-gray-900">{String(value)}</span>;
}

function SectionReview({ section, answers, onEdit }) {
  const [open, setOpen] = useState(true);

  const visibleQuestions = section.scoring
    ? section.questions
    : section.questions.filter((q) => isConditionMet(q, answers));

  const answeredCount = visibleQuestions.filter((q) => {
    const v = answers[q.id];
    return v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
  }).length;

  const scoreData = section.scoring
    ? visibleQuestions.reduce(
        (acc, q) => {
          const ans = answers[q.id];
          const pv = q.pointValue || 0;
          if (ans === 'Yes') { acc.earned += pv; acc.possible += pv; }
          else if (ans === 'No') { acc.possible += pv; }
          return acc;
        },
        { earned: 0, possible: 0 }
      )
    : null;

  return (
    <div className="card">
      <div
        className="flex items-center justify-between cursor-pointer -m-5 p-5 rounded-2xl"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-gray-900">{section.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {answeredCount}/{visibleQuestions.length} answered
              {scoreData && ` · ${scoreData.earned}/${scoreData.possible} pts`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(section.id); }}
            className="flex items-center gap-1 text-xs text-cchp-blue font-medium px-2 py-1 rounded-lg hover:bg-cchp-lightblue transition-colors"
          >
            <Edit2 size={12} /> Edit
          </button>
          {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          {visibleQuestions.map((q) => (
            <div key={q.id} className="flex gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 leading-snug">{q.label}</p>
                <div className="mt-1 text-sm">{formatValue(answers[q.id])}</div>
              </div>
              {q.pointValue != null && section.scoring && (
                <div className="shrink-0 text-right">
                  <span className={`text-xs font-bold ${answers[q.id] === 'Yes' ? 'text-green-600' : 'text-gray-300'}`}>
                    {answers[q.id] === 'Yes' ? `+${q.pointValue}` : answers[q.id] === 'NA' ? 'N/A' : '0'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Review() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const form = getAllForms().find((f) => f.id === formId);
  const answers = getSavedAnswers(formId);

  if (!form) {
    return (
      <div className="min-h-screen bg-cchp-gray flex items-center justify-center">
        <div className="card text-center p-10">
          <p className="text-gray-500">Form not found.</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">Go Home</button>
        </div>
      </div>
    );
  }

  const handleEdit = (sectionId) => {
    const idx = form.sections.findIndex((s) => s.id === sectionId);
    navigate(`/form/${formId}`, { state: { sectionIdx: idx } });
  };

  const handleDownload = async () => {
    setGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 50));
      generatePDF(form, answers);
      setDone(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleStartNew = () => {
    clearSavedAnswers(formId);
    navigate(`/form/${formId}`);
  };

  // Compute total score for Site Eval
  const totalScore = form.sections
    .filter((s) => s.scoring)
    .reduce((acc, s) => {
      for (const q of s.questions) {
        if (answers[q.id] === 'Yes') acc.earned += q.pointValue || 0;
        if (answers[q.id] === 'Yes' || answers[q.id] === 'No') acc.possible += q.pointValue || 0;
      }
      return acc;
    }, { earned: 0, possible: 0 });

  const hasScoredSections = form.sections.some((s) => s.scoring);

  return (
    <div className="min-h-screen bg-cchp-gray pb-32">
      <Header title="Review Answers" showBack onBack={() => navigate(`/form/${formId}`)} />

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* Summary card */}
        <div className="bg-gradient-to-r from-cchp-blue to-cchp-darkblue text-white rounded-2xl p-5 shadow">
          <h1 className="font-bold text-lg">{form.name}</h1>
          <p className="text-blue-100 text-sm mt-1">
            Review your answers below before generating the completed PDF.
          </p>
          {hasScoredSections && totalScore.possible > 0 && (
            <div className="mt-3 bg-white/15 rounded-xl px-4 py-2 inline-block">
              <span className="text-sm font-medium">Total Score: </span>
              <span className="text-xl font-bold">{totalScore.earned}</span>
              <span className="text-sm text-blue-200"> / {totalScore.possible}</span>
              <span className="text-sm text-blue-200 ml-2">
                ({Math.round((totalScore.earned / totalScore.possible) * 100)}%)
              </span>
            </div>
          )}
        </div>

        {/* Section reviews */}
        {form.sections.map((section) => (
          <SectionReview
            key={section.id}
            section={section}
            answers={answers}
            onEdit={handleEdit}
          />
        ))}
      </main>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto space-y-2">
          {done ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 bg-green-50 text-green-700 rounded-xl px-4 py-3 font-semibold text-sm">
                <CheckCircle size={18} />
                PDF downloaded successfully!
              </div>
              <button onClick={handleStartNew} className="btn-ghost flex items-center gap-1.5 text-sm">
                <RotateCcw size={15} />
                New Form
              </button>
            </div>
          ) : (
            <button
              onClick={handleDownload}
              disabled={generating}
              className={`btn-primary w-full flex items-center justify-center gap-2 py-3.5 ${generating ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Download size={20} />
              {generating ? 'Generating PDF…' : 'Download Completed PDF'}
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full text-sm text-gray-400 py-1 hover:text-gray-600 transition-colors"
          >
            Back to Form Library
          </button>
        </div>
      </div>
    </div>
  );
}
