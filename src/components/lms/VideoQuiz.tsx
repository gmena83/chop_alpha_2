'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface VideoQuizProps {
  questions: QuizQuestion[];
  passingThreshold: number;
  onComplete: (passed: boolean, score: number) => void;
  locale: 'en' | 'es';
}

export function VideoQuiz({ questions, passingThreshold, onComplete, locale }: VideoQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(false);

  const labels = {
    en: {
      question: 'Question',
      of: 'of',
      next: 'Next',
      submit: 'Submit Quiz',
      correct: 'Correct!',
      incorrect: 'Incorrect',
      yourScore: 'Your Score',
      passed: 'Congratulations! You passed!',
      failed: 'You need to score at least',
      toPass: 'to continue.',
      tryAgain: 'Try Again',
      continue: 'Continue',
    },
    es: {
      question: 'Pregunta',
      of: 'de',
      next: 'Siguiente',
      submit: 'Enviar Cuestionario',
      correct: '¡Correcto!',
      incorrect: 'Incorrecto',
      yourScore: 'Tu Puntuación',
      passed: '¡Felicidades! ¡Aprobaste!',
      failed: 'Necesitas obtener al menos',
      toPass: 'para continuar.',
      tryAgain: 'Intentar de Nuevo',
      continue: 'Continuar',
    },
  };

  const t = labels[locale];
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleSelectAnswer = (optionIndex: number) => {
    if (answered) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
    setAnswered(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
    }
  };

  const calculateScore = () => {
    const correctCount = questions.reduce((count, q, index) => {
      return count + (selectedAnswers[index] === q.correctIndex ? 1 : 0);
    }, 0);
    return Math.round((correctCount / questions.length) * 100);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setAnswered(false);
  };

  const handleContinue = () => {
    const score = calculateScore();
    const passed = score >= passingThreshold;
    onComplete(passed, score);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= passingThreshold;

    return (
      <Card className={`border-2 ${passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <CardContent className="pt-6 text-center">
          <div className="mb-4">
            {passed ? (
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold mb-2">
            {t.yourScore}: {score}%
          </h3>
          
          <p className={`text-lg mb-6 ${passed ? 'text-green-700' : 'text-red-700'}`}>
            {passed ? t.passed : `${t.failed} ${passingThreshold}% ${t.toPass}`}
          </p>

          <div className="flex gap-4 justify-center">
            {!passed && (
              <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                {t.tryAgain}
              </Button>
            )}
            {passed && (
              <Button onClick={handleContinue} className="bg-green-600 hover:bg-green-700">
                {t.continue}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {t.question} {currentQuestion + 1} {t.of} {questions.length}
          </span>
          <div className="flex gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index < currentQuestion
                    ? 'bg-green-500'
                    : index === currentQuestion
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>

        <div className="space-y-2 mb-6">
          {question.options.map((option, index) => {
            let buttonStyle = 'border-gray-200 hover:border-blue-400 hover:bg-blue-50';
            
            if (answered) {
              if (index === question.correctIndex) {
                buttonStyle = 'border-green-500 bg-green-100 text-green-800';
              } else if (index === selectedAnswer && !isCorrect) {
                buttonStyle = 'border-red-500 bg-red-100 text-red-800';
              } else {
                buttonStyle = 'border-gray-200 opacity-50';
              }
            } else if (selectedAnswer === index) {
              buttonStyle = 'border-blue-500 bg-blue-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={answered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${buttonStyle}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`p-3 rounded-lg mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? t.correct : t.incorrect}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!answered}
            className="bg-[#1a5276] hover:bg-[#154360]"
          >
            {isLastQuestion ? t.submit : t.next}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
