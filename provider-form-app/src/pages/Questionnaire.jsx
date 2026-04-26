import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import QuestionRenderer, { YesNoNASection } from '../components/QuestionRenderer';
import { BUILT_IN_FORMS } from '../forms/index';
import { getCustomForms, getSavedAnswers, saveDraftAnswers } from '../utils/storage';

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

function sectionHasVisibleQuestions(section, answers) {
  if (section.scoring) return true;
  return section.questions.some((q) => isConditionMet(q, answers));
}

export default function Questionnaire() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const form = getAllForms().find((f) => f.id === formId);

  const [answers, setAnswers] = useState(() => getSavedAnswers(formId));
  const [sectionIdx, setSectionIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  // Auto-save draft every time answers change
  useEffect(() => {
    saveDraftAnswers(formId, answers);
  }, [answers, formId]);

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

  const visibleSections = form.sections.filter((s) => sectionHasVisibleQuestions(s, answers));
  const totalSections = visibleSections.length;
  const currentSection = visibleSections[sectionIdx];

  const setAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const setYesNoNA = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleSave = () => {
    saveDraftAnswers(formId, answers);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNext = () => {
    if (sectionIdx < totalSections - 1) {
      setSectionIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/review/${formId}`);
    }
  };

  const handleBack = () => {
    if (sectionIdx > 0) {
      setSectionIdx((i) => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const isLastSection = sectionIdx === totalSections - 1;

  return (
    <div className="min-h-screen bg-cchp-gray flex flex-col">
      <Header
        title={form.name}
        showBack
        onBack={handleBack}
      />
      <ProgressBar
        current={sectionIdx}
        total={totalSections}
        sectionTitle={currentSection.title}
      />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 pb-32">
        {/* Scoring sections use the special YesNoNA table */}
        {currentSection.scoring ? (
          <div className="card">
            <YesNoNASection
              section={currentSection}
              answers={answers}
              onChange={setYesNoNA}
            />
          </div>
        ) : (
          <div className="card space-y-6">
            <div>
              <h2 className="font-bold text-lg text-gray-900">{currentSection.title}</h2>
              {currentSection.description && (
                <p className="text-sm text-gray-500 mt-1">{currentSection.description}</p>
              )}
            </div>
            {currentSection.questions.map((question) => {
              if (!isConditionMet(question, answers)) return null;
              return (
                <div key={question.id}>
                  <QuestionRenderer
                    question={question}
                    value={answers[question.id]}
                    onChange={(val) => setAnswer(question.id, val)}
                    answers={answers}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center gap-2 shrink-0"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition-all shrink-0 ${
              saved
                ? 'border-green-400 text-green-600 bg-green-50'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Save size={15} />
            {saved ? 'Saved!' : 'Save'}
          </button>

          <button
            onClick={handleNext}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isLastSection ? (
              'Review & Download'
            ) : (
              <>
                Next
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
