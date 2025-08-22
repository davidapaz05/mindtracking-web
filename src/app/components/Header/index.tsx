"use client";

import { useEffect, useState } from "react";
import DarkModeToggle from "../ButtonColors/index";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <header
      className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 py-5 transition-colors duration-500
        ${darkMode ? "bg-[#0C1324]" : "bg-gray-100"}`}
    >

      <div className="flex items-center gap-3 self-center sm:self-auto">
            <img
        src="/images/Logo.svg"
        alt="Logo"
        className={`h-10 ${darkMode ? "hidden" : "block"}`}
        />
        <img
        src="/images/Logo.svg"
        alt="Logo"
        className={`h-10 ${darkMode ? "block" : "hidden"}`}
        />

        <span
          className={`font-bold font-Inter text-xl ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          MindTracking
        </span>
      </div>

      {/* Botão toggle dark mode */}
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
    </header>
  );
}
