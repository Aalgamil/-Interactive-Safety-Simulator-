import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Shield,
  Mail,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  cyberMessages,
  type MessageType,
} from "../data/cybercrimeMessages";
import "./CybercrimeGame.css";

interface CybercrimeGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function CybercrimeGame({
  onComplete,
  onBack,
}: CybercrimeGameProps) {
  const { t, language } = useLanguage();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    boolean | null
  >(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const message = cyberMessages[currentMessage];

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "email":
        return <Mail className="size-6" />;
      case "sms":
        return <MessageSquare className="size-6" />;
      case "whatsapp":
        return <MessageSquare className="size-6" />;
    }
  };

  const handleAnswer = (answer: boolean) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === message.isScam;
    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
    }

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (currentMessage < cyberMessages.length - 1) {
        setCurrentMessage(currentMessage + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        const finalScore = Math.min(
          Math.round(
            ((score + (isCorrect ? 10 : 0)) /
              (cyberMessages.length * 10)) *
            100,
          ),
          100,
        );
        setIsComplete(true);
        onComplete(finalScore);
      }
    }, 4000);
  };

  const handleRestart = () => {
    setCurrentMessage(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setIsComplete(false);
    setCorrectAnswers(0);
  };

  if (isComplete) {
    const finalScore = Math.min(
      Math.round((score / (cyberMessages.length * 10)) * 100),
      100,
    );
    const accuracy = Math.round(
      (correctAnswers / cyberMessages.length) * 100,
    );

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="bg-[#006B3F] text-white rounded-full size-24 mx-auto mb-6 flex items-center justify-center">
                <Shield className="size-12" />
              </div>

              <h1 className="text-4xl mb-4">
                {t("cyber.complete")}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("emergency.finalScore")}:{" "}
                <span className="text-[#006B3F]">
                  {finalScore} / 100
                </span>
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl text-[#006B3F] mb-2">
                    {correctAnswers}/{cyberMessages.length}
                  </div>
                  <div className="text-gray-600">
                    {t("cyber.identified")}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl text-[#006B3F] mb-2">
                    {accuracy}%
                  </div>
                  <div className="text-gray-600">
                    {t("cyber.detectionAccuracy")}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-xl mb-4 text-yellow-900">
                  {t("cyber.redFlags")}
                </h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>{t("cyber.redFlag1")}</li>
                  <li>{t("cyber.redFlag2")}</li>
                  <li>{t("cyber.redFlag3")}</li>
                  <li>{t("cyber.redFlag4")}</li>
                  <li>{t("cyber.redFlag5")}</li>
                  <li>{t("cyber.redFlag6")}</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t("common.tryAgain")}
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 py-3 bg-[#006B3F] text-white rounded-lg hover:bg-[#005530] transition-colors"
                >
                  {t("common.backToDashboard")}
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
              {t("common.back")}
            </button>
            <div className="text-gray-600">
              {t("common.message")} {currentMessage + 1}{" "}
              {t("common.of")} {cyberMessages.length}
            </div>
            <div className="px-4 py-2 bg-[#006B3F] text-white rounded-lg">
              {t("common.score")}: {score}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="progress-fill"
                style={{
                  ['--progress-width' as string]: `${((currentMessage + 1) / cyberMessages.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Message Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            {/* Message Header */}
            <div className="bg-gray-100 p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2">
                  {getMessageIcon(message.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 uppercase">
                    {t(`cyber.${message.type}`)}
                  </div>
                  <div className="font-medium">
                    {message.from[language]}
                  </div>
                  {message.subject && (
                    <div className="text-sm text-gray-600">
                      {language === "ar"
                        ? "الموضوع"
                        : "Subject"}
                      : {message.subject[language]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="p-6">
              <p className="text-gray-800 mb-6 whitespace-pre-line">
                {message.content[language]}
              </p>

              <div className="border-t pt-6">
                <h3 className="text-xl mb-4 text-center">
                  {t("cyber.isScam")}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(true)}
                    disabled={showFeedback}
                    className={`p-6 rounded-xl border-4 transition-all ${showFeedback && selectedAnswer === true
                      ? message.isScam
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : showFeedback
                        ? "border-gray-200 opacity-50 cursor-not-allowed"
                        : "border-red-600 hover:bg-red-50 cursor-pointer"
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      {showFeedback &&
                        selectedAnswer === true &&
                        (message.isScam ? (
                          <CheckCircle className="size-10 text-green-600" />
                        ) : (
                          <XCircle className="size-10 text-red-600" />
                        ))}
                      <AlertTriangle className="size-10 text-red-600" />
                      <span className="text-lg">
                        {t("cyber.yesScam")}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAnswer(false)}
                    disabled={showFeedback}
                    className={`p-6 rounded-xl border-4 transition-all ${showFeedback && selectedAnswer === false
                      ? !message.isScam
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : showFeedback
                        ? "border-gray-200 opacity-50 cursor-not-allowed"
                        : "border-green-600 hover:bg-green-50 cursor-pointer"
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      {showFeedback &&
                        selectedAnswer === false &&
                        (!message.isScam ? (
                          <CheckCircle className="size-10 text-green-600" />
                        ) : (
                          <XCircle className="size-10 text-red-600" />
                        ))}
                      <Shield className="size-10 text-green-600" />
                      <span className="text-lg">
                        {t("cyber.noLegit")}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`bg-white rounded-xl shadow-lg p-6 ${selectedAnswer === message.isScam
                ? "border-2 border-green-500"
                : "border-2 border-red-500"
                }`}
            >
              <div className="flex items-start gap-3 mb-4">
                {selectedAnswer === message.isScam ? (
                  <CheckCircle className="size-8 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="size-8 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <h3
                    className={`text-xl mb-2 ${selectedAnswer === message.isScam
                      ? "text-green-800"
                      : "text-red-800"
                      }`}
                  >
                    {selectedAnswer === message.isScam
                      ? t("cyber.correct")
                      : t("cyber.incorrect")}
                  </h3>
                  <p className="text-gray-700">
                    {t("cyber.thisIs")}{" "}
                    {message.isScam
                      ? t("cyber.scam")
                      : t("cyber.legitimate")}
                    .
                  </p>
                </div>
              </div>

              {message.isScam &&
                message.redFlags[language].length > 0 && (
                  <div className="mb-4 p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium mb-2 text-red-900">
                      {t("cyber.redFlagsTitle")}
                    </h4>
                    <ul className="space-y-1 text-red-800">
                      {message.redFlags[language].map(
                        (flag, index) => (
                          <li key={index} className="text-sm">
                            • {flag}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-900">
                  {t("cyber.safetyTip")}
                </h4>
                <p className="text-blue-800">
                  {message.safetyTip[language]}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}