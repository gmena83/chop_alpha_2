'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizQuestionEditorProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
  language: 'en' | 'es';
}

export function QuizQuestionEditor({ questions, onChange, language }: QuizQuestionEditorProps) {
  const labels = {
    en: {
      addQuestion: 'Add Question',
      questionPlaceholder: 'Enter your question...',
      optionPlaceholder: 'Option',
      addOption: 'Add Option',
      correctAnswer: 'Correct Answer',
      question: 'Question',
      deleteQuestion: 'Delete Question',
      noQuestions: 'No quiz questions yet. Add questions to test learner comprehension.',
    },
    es: {
      addQuestion: 'Agregar Pregunta',
      questionPlaceholder: 'Ingrese su pregunta...',
      optionPlaceholder: 'Opción',
      addOption: 'Agregar Opción',
      correctAnswer: 'Respuesta Correcta',
      question: 'Pregunta',
      deleteQuestion: 'Eliminar Pregunta',
      noQuestions: 'No hay preguntas de quiz todavía. Agregue preguntas para evaluar la comprensión del estudiante.',
    },
  };

  const t = labels[language];

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
    };
    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const newOptions = [...updated[questionIndex].options];
    newOptions[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options: newOptions };
    onChange(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: [...updated[questionIndex].options, ''],
    };
    onChange(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    const newOptions = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
    let newCorrectIndex = updated[questionIndex].correctIndex;
    if (optionIndex < newCorrectIndex) {
      newCorrectIndex--;
    } else if (optionIndex === newCorrectIndex) {
      newCorrectIndex = 0;
    }
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: newOptions,
      correctIndex: newCorrectIndex,
    };
    onChange(updated);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
        <p className="text-gray-500 mb-4">{t.noQuestions}</p>
        <Button type="button" onClick={addQuestion} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          {t.addQuestion}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, qIndex) => (
        <Card key={question.id} className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-700">
                  {t.question} {qIndex + 1}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  placeholder={t.questionPlaceholder}
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">{t.correctAnswer}</Label>
                <RadioGroup
                  value={question.correctIndex.toString()}
                  onValueChange={(value: string) => updateQuestion(qIndex, 'correctIndex', parseInt(value))}
                >
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <RadioGroupItem value={oIndex.toString()} id={`${question.id}-${oIndex}`} />
                      <Input
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`${t.optionPlaceholder} ${oIndex + 1}`}
                        className="flex-1"
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </RadioGroup>
                {question.options.length < 6 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addOption(qIndex)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t.addOption}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" onClick={addQuestion} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        {t.addQuestion}
      </Button>
    </div>
  );
}
