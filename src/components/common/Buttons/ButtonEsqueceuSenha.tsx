"use client";

import { useState } from "react";
import RedefinicaoSenhaFlow from "../../features/Auth/RedefinicaoSenha";

interface Props {
  className?: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export default function ForgotPasswordButton({
  className = "",
  children = "Esqueci minha senha",
  onSuccess,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`bg-blue-600 hover:bg-blue-500 text-white font-bold text-[16px] py-1 rounded-full border-4 border-transparent transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] active:brightness-95 active:border-blue-700 active:drop-shadow-[0_0_15px_#0C4A6E] ${className}`}
      >
        {children}
      </button>

      <RedefinicaoSenhaFlow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
