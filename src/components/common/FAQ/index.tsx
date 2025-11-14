"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}


const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const { darkMode } = useTheme();

  return (
    <motion.div
      className={`w-full py-5 rounded-3xl border-2 border-blue-600 cursor-pointer ${ darkMode ? "bg-[#FFFFFF1A]" : "bg-[#0F172A1A]" }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        onClick={onToggle}
        className="w-full px-4 py-3 sm:px-6 sm:py-4 flex cursor-pointer items-center justify-between text-left hover:bg-opacity-80 transition-colors duration-200"
        whileTap={{ scale: 0.98 }}
      >
        
        <span className="font-bold text-base lg:text-lg cursor-pointer pr-4">{question}</span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 36 36" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`${darkMode ? "text-slate-50" : "text-slate-900"} w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9`}
          >
            <path 
              d="M22.5 19.5L18 24M18 24L13.5 19.5M18 24V12M18 31.5C16.2272 31.5 14.4717 31.1508 12.8338 30.4724C11.1959 29.7939 9.70765 28.7995 8.45406 27.5459C7.20047 26.2923 6.20607 24.8041 5.52763 23.1662C4.84919 21.5283 4.5 19.7728 4.5 18C4.5 16.2272 4.84919 14.4717 5.52763 12.8338C6.20607 11.1959 7.20047 9.70765 8.45406 8.45406C9.70765 7.20047 11.1959 6.20606 12.8338 5.52763C14.4717 4.84919 16.2272 4.5 18 4.5C21.5804 4.5 25.0142 5.92232 27.5459 8.45406C30.0777 10.9858 31.5 14.4196 31.5 18C31.5 21.5804 30.0777 25.0142 27.5459 27.5459C25.0142 30.0777 21.5804 31.5 18 31.5Z" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 sm:px-6 sm:pb-4">
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 0.9 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="text-sm lg:text-base !leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData = [
    {
      question: "O que é a MindTracking?",
      answer: "O MindTracking é uma plataforma de saúde mental que permite aos usuários responder questionários diários sobre seu humor e bem-estar. Nossa ferramenta ajuda você a monitorar seu estado emocional, identificar padrões e receber insights personalizados para melhorar sua saúde mental."
    },
    {
      question: "A MindTracking substitui a ajuda de um profissional?",
      answer: "Não. O MindTracking é uma ferramenta de apoio para autoconhecimento e monitoramento emocional, mas não substitui o acompanhamento profissional. Recomendamos sempre consultar um especialista em saúde mental para diagnóstico e tratamento adequados."
    },
    {
      question: "Minhas respostas são privadas?",
      answer: "Sim! A privacidade dos seus dados é nossa prioridade. Todas as suas respostas são armazenadas de forma criptografada e seguimos rigorosos protocolos de segurança. Seus dados pessoais nunca são compartilhados com terceiros sem seu consentimento explícito."
    },
    {
      question: "Como funcionam os questionários?",
      answer: "Nossos questionários são projetados para serem rápidos e intuitivos. Você responde perguntas sobre seu humor, sono, níveis de estresse e outras métricas importantes. As respostas são registradas diariamente, permitindo um acompanhamento consistente do seu bem-estar."
    },
    {
      question: "Como funciona a Athena?",
      answer: "A Athena é uma assistente virtual que utiliza inteligência artificial para oferecer suporte emocional e dicas personalizadas. Ele analisa seus padrões de resposta e oferece insights relevantes para ajudar no seu desenvolvimento pessoal."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {faqData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          <FAQItem
            question={item.question}
            answer={item.answer}
            isOpen={openItems.includes(index)}
            onToggle={() => toggleItem(index)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FAQ;
