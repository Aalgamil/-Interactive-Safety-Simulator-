import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { accidentScenarios } from '../data/accidentScenarios';

interface AccidentSimulationProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function AccidentSimulation({ onComplete, onBack }: AccidentSimulationProps) {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${((currentStep + 1) / accidentScenarios.length) * 100}%`;
    }
  }, [currentStep]);

  const handleOptionSelect = (index: number) => {
    if (showFeedback) return;

    setSelectedOption(index);
    setShowFeedback(true);
  };

  const handleNext = () => {
    const isCorrect = accidentScenarios[currentStep].options[selectedOption!].correct;
    const newScore = score + (isCorrect ? 20 : 0);
    setScore(newScore);

    if (currentStep < accidentScenarios.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
      onComplete(newScore);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setIsComplete(false);
  };

  const currentScenario = accidentScenarios[currentStep];

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className={`size-24 rounded-full mx-auto mb-6 flex items-center justify-center ${score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                {score >= 80 ? (
                  <CheckCircle className={`size-12 text-green-600`} />
                ) : (
                  <AlertTriangle className={`size-12 ${score >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
                )}
              </div>

              <h1 className="text-4xl mb-4">{t('accident.complete')}</h1>
              <p className="text-xl text-gray-600 mb-8">
                {t('accident.yourScore')}: <span className="text-[#006B3F]">{score} / 100</span>
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-xl mb-4">{t('accident.takeaways')}</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>{t('accident.takeaway1')}</li>
                  <li>{t('accident.takeaway2')}</li>
                  <li>{t('accident.takeaway3')}</li>
                  <li>{t('accident.takeaway4')}</li>
                  <li>{t('accident.takeaway5')}</li>
                  <li>{t('accident.takeaway6')}</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('common.tryAgain')}
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 py-3 bg-[#006B3F] text-white rounded-lg hover:bg-[#005530] transition-colors"
                >
                  {t('common.backToDashboard')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="size-4" />
              {t('common.back')}
            </button>
            <div className="text-gray-600">
              {t('common.step')} {currentStep + 1} {t('common.of')} {accidentScenarios.length}
            </div>
            <div className="px-4 py-2 bg-[#006B3F] text-white rounded-lg">
              {t('common.score')}: {score}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                ref={progressRef}
                className="bg-[#006B3F] h-3 rounded-full transition-all"
              />
            </div>
          </div>

          {/* Scenario Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-3 mb-6">
              <AlertTriangle className="size-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl mb-2 text-gray-600">{t('accident.scenario')}</h2>
                <p className="text-gray-800">{currentScenario.scenario[language]}</p>
              </div>
            </div>

            <h3 className="text-2xl mb-6">{currentScenario.question[language]}</h3>

            <div className="space-y-3">
              {currentScenario.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedOption === index
                    ? option.correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-[#006B3F] hover:bg-gray-50'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text[language]}</span>
                    {showFeedback && selectedOption === index && (
                      option.correct ? (
                        <CheckCircle className="size-6 text-green-600" />
                      ) : (
                        <XCircle className="size-6 text-red-600" />
                      )
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && selectedOption !== null && (
              <div className={`mt-6 p-4 rounded-lg ${currentScenario.options[selectedOption].correct
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
                }`}>
                <p className={
                  currentScenario.options[selectedOption].correct
                    ? 'text-green-800'
                    : 'text-red-800'
                }>
                  {currentScenario.options[selectedOption].feedback[language]}
                </p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {showFeedback && (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-[#006B3F] text-white rounded-lg hover:bg-[#005530] transition-colors"
            >
              {currentStep < accidentScenarios.length - 1 ? t('common.next') : t('common.complete')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
