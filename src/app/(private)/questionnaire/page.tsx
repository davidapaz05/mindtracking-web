"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';

interface QuestionnaireProps {
  theme: "light" | "dark";
}

const questions = [
  {
    id: 1,
    text: 'Com que frequência você se envolve em atividades que aumentam sua auto-imagem positiva?',
    options: [
      'Melhorar a qualidade do sono',
      'Aumentar a atividade física',
      'Gerenciar o estresse',
      'Comer mais saudável',
    ],
  },
  {
    id: 2,
    text: 'Com que frequência você sente que está emocionalmente equilibrado?',
    options: ['Sempre', 'Frequentemente', 'Raramente', 'Nunca'],
  },
];


const Questionnaire = ({ theme }: QuestionnaireProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const question = questions[currentQuestion];

  const handleNext = () => {
    if (!selected || isLoadingNext) return;

    setIsLoadingNext(true);

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = selected;
    setAnswers(updatedAnswers);

    setIsLoadingNext(false);
    setSelected('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      alert('Questionário finalizado!');
    }
  };

  const handleBack = () => {
    setCurrentQuestion((prev) => prev - 1);
    setSelected(answers[currentQuestion - 1] || '');
  };

  const handleSelect = (option: string) => {
    setSelected(option);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const bgPrimary = theme === "dark" ? "bg-gray-900" : "bg-gray-100";

  return (
    <div className={`flex-1 flex justify-center items-center min-h-screen max-h-screen overflow-hidden ${bgPrimary} transition-colors duration-200`}>
      <div className="w-full max-w-[90rem] px-4 md:px-12 pt-20 lg:pb-6 lg:px-[80px] md:pb-80 mx-auto space-y-8">

        {/* Barra de Progresso */}
        <section className="mb-6 md:mb-4">
          <div className={`font-medium flex justify-between text-sm ${textSecondary} mb-2`}>
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Título */}
        <h1 className={`text-xl sm:text-2xl font-bold mt-10 lg:mt-20 ${textPrimary} transition-colors duration-200`}>
          Questionário
        </h1>

        {/* Pergunta */}
        <p className={`text-base sm:text-lg font-bold mt-4 mb-6 lg:mb-10 ${textPrimary} transition-colors duration-200`}>
          {question.text}
        </p>

        {/* Opções de resposta */}
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 w-full font-regular">
          {question.options.map((option, idx) => {
            const isSelected = selected === option;

            const borderColor =
              theme === "light"
                ? "border-blue-600"
                : isSelected
                ? "border-blue-600"
                : "border-gray-600";

            const optionTextColor = theme === "dark" ? "text-gray-100" : "text-gray-900";

            return (
              <div
                key={idx}
                onClick={() => handleSelect(option)}
                className="flex items-center gap-3 cursor-pointer select-none w-full justify-start transition-colors duration-200"
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${borderColor}`}
                  style={{ borderWidth: "2.5px" }}
                >
                  {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                </div>
                <span className={`text-sm sm:text-base ${optionTextColor}`}>{option}</span>
              </div>
            );
          })}
        </div>

        {/* Botões */}
        <div className="flex sm:gap-3 md:gap-8 justify-between items-center w-full pt-4">
          {currentQuestion > 0 && (
            <button
              onClick={handleBack}
              className="px-3 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-sm sm:text-xs md:text-base rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all w-full sm:w-auto max-w-[12rem]"
            >
              Voltar
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!selected || isLoadingNext}
            className={`px-3 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-sm sm:text-xs md:text-base rounded-full font-bold transition-all w-full sm:w-auto max-w-[12rem] whitespace-nowrap ml-auto
            ${selected && !isLoadingNext
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Próxima pergunta
          </button>
        </div>

      </div>
    </div>
  );
};

export default Questionnaire;
