"use client";

import DarkModeToggle from "../../common/ButtonColors";
import { useTheme } from "../../../contexts/ThemeContext";
import Image from "next/image";

export default function Header() {
  const { darkMode, toggleTheme } = useTheme(); // agora usa toggleTheme corretamente

  return (
    <header id="header" className="w-full h-[100px] flex items-center transition-colors duration-500 bg-transparent">
      <div className="flex w-full max-w-7xl mx-auto items-center justify-center sm:justify-between px-6 sm:px-[150px]">
        
        {/* Logo + Texto */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/icons/Logo.svg"
            alt="Logo MindTracking"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span
            className={`font-bold font-Inter text-[22px] sm:text-[26px] lg:text-[28px] ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            MindTracking
          </span>
        </div>

        {/* Botão só aparece em tablet/desktop */}
        <div className="hidden sm:flex">
          <DarkModeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
}
