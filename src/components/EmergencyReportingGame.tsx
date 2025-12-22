import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { emergencyScenarios } from '../data/emergencyScenarios';

interface EmergencyReportingGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function EmergencyReportingGame({ onComplete, onBack }: EmergencyReportingGameProps) {
  const { t, language } = useLanguage();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'999' | '901' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const currentScenario = emergencyScenarios[currentRound];

  useEffect(() => {
    if (isAnswered || isComplete) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTime(totalTime + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Time's up - mark as incorrect
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered, isComplete]);

  const handleAnswer = (answer: '999' | '901' | null) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === currentScenario.correctAnswer;
    if (isCorrect) {
      // Award points based on speed (faster = more points)
      const timeBonus = Math.floor((timeLeft / 10) * 5);
      const roundScore = 5 + timeBonus; // 5-10 points per correct answer
      setScore(score + roundScore);
      setCorrectAnswers(correctAnswers + 1);
    }

    // Show feedback for 2 seconds before moving to next
    setTimeout(() => {
      if (currentRound < emergencyScenarios.length - 1) {
        setCurrentRound(currentRound + 1);
        setTimeLeft(10);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        const finalScore = Math.min(
          Math.round((score + (isCorrect ? (5 + Math.floor((timeLeft / 10) * 5)) : 0)) / emergencyScenarios.length * 10),
          100
        );
        setIsComplete(true);
        onComplete(finalScore);
      }
    }, 2500);
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setScore(0);
    setTimeLeft(10);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsComplete(false);
    setCorrectAnswers(0);
    setTotalTime(0);
  };

  if (isComplete) {
    const finalScore = Math.min(Math.round(score / emergencyScenarios.length * 10), 100);
    const accuracy = Math.round((correctAnswers / emergencyScenarios.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="bg-[#006B3F] text-white rounded-full size-24 mx-auto mb-6 flex items-center justify-center">
                <Trophy className="size-12" />
              </div>

              <h1 className="text-4xl mb-4">{t('emergency.complete')}</h1>
              <p className="text-xl text-gray-600 mb-8">
                {t('emergency.finalScore')}: <span className="text-[#006B3F]">{finalScore} / 100</span>
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl text-[#006B3F] mb-2">{correctAnswers}/{emergencyScenarios.length}</div>
                  <div className="text-gray-600">{t('emergency.correct')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl text-[#006B3F] mb-2">{accuracy}%</div>
                  <div className="text-gray-600">{t('emergency.accuracy')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl text-[#006B3F] mb-2">{totalTime}s</div>
                  <div className="text-gray-600">{t('emergency.totalTime')}</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-xl mb-4 text-blue-900">{t('emergency.remember')}</h3>
                <div className="space-y-3 text-blue-800">
                  <div>
                    <strong className="block mb-1">{t('emergency.999')}</strong>
                    <p className="text-sm">{t('emergency.999.desc')}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">{t('emergency.901')}</strong>
                    <p className="text-sm">{t('emergency.901.desc')}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('common.playAgain')}
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
              {t('common.round')} {currentRound + 1} {t('common.of')} {emergencyScenarios.length}
            </div>
            <div className="px-4 py-2 bg-[#006B3F] text-white rounded-lg">
              {t('common.score')}: {score}
            </div>
          </div>

          {/* Timer */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Clock className="size-6 text-gray-600" />
              <span className={`text-3xl ${timeLeft <= 3 ? 'text-red-600' : 'text-gray-800'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  timeLeft <= 3 ? 'bg-red-600' : 'bg-[#006B3F]'
                }`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Scenario Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl mb-8 text-center">{currentScenario.situation[language]}</h2>

            <p className="text-center text-gray-600 mb-6">{t('emergency.callQuestion')}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => handleAnswer('999')}
                disabled={isAnswered}
                className={`p-8 rounded-xl border-4 transition-all ${
                  isAnswered && selectedAnswer === '999'
                    ? currentScenario.correctAnswer === '999'
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : isAnswered
                    ? 'border-gray-200 opacity-50 cursor-not-allowed'
                    : 'border-red-600 hover:bg-red-50 cursor-pointer'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  {isAnswered && selectedAnswer === '999' && (
                    currentScenario.correctAnswer === '999' ? (
                      <CheckCircle className="size-12 text-green-600" />
                    ) : (
                      <XCircle className="size-12 text-red-600" />
                    )
                  )}
                  <div className="text-6xl">999</div>
                  <div className="text-gray-600">{t('emergency.emergency')}</div>
                </div>
              </button>

              <button
                onClick={() => handleAnswer('901')}
                disabled={isAnswered}
                className={`p-8 rounded-xl border-4 transition-all ${
                  isAnswered && selectedAnswer === '901'
                    ? currentScenario.correctAnswer === '901'
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : isAnswered
                    ? 'border-gray-200 opacity-50 cursor-not-allowed'
                    : 'border-blue-600 hover:bg-blue-50 cursor-pointer'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  {isAnswered && selectedAnswer === '901' && (
                    currentScenario.correctAnswer === '901' ? (
                      <CheckCircle className="size-12 text-green-600" />
                    ) : (
                      <XCircle className="size-12 text-red-600" />
                    )
                  )}
                  <div className="text-6xl">901</div>
                  <div className="text-gray-600">{t('emergency.nonEmergency')}</div>
                </div>
              </button>
            </div>

            {/* Feedback */}
            {isAnswered && (
              <div className={`mt-6 p-4 rounded-lg ${
                selectedAnswer === currentScenario.correctAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={
                  selectedAnswer === currentScenario.correctAnswer
                    ? 'text-green-800'
                    : 'text-red-800'
                }>
                  {selectedAnswer === null ? (
                    <span>{t('emergency.timeUp')} <strong>{currentScenario.correctAnswer}</strong></span>
                  ) : selectedAnswer === currentScenario.correctAnswer ? (
                    <span>{t('emergency.correctAnswer')} {currentScenario.explanation[language]}</span>
                  ) : (
                    <span>{t('emergency.incorrectAnswer')} {currentScenario.explanation[language]}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
