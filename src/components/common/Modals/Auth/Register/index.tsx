"use client";
import { ReactNode } from "react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
      <div
        className={`${
          theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
        } rounded-[12px] p-4 sm:p-6 md:p-8 relative md:w-[28.125em]
         max-h-[90vh] w-[90%] max-w-[1066px] h-auto
         min-h-[min(550px,80vh)]
         sm:min-h-[min(550px,80vh)]
         md:min-h-[min(690px,92vh)]
         overflow-y-auto overscroll-contain
         flex flex-col items-center justify-start`} // Alterado para justify-start
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 z-10"
        >
          <Image
            src={theme === "dark" ? "/images/icons/BotaoFechar-branco.svg" : "/images/icons/BotaoFechar-preto.svg"}
            alt="Fechar"
            width={20}
            height={20}
            className="w-8 h-8 md:w-12.5 md:h-12.5 cursor-pointer"
          />
        </button>

        <div className="w-full h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}