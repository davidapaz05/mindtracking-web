"use client";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function DarkModeToggle({ darkMode, setDarkMode }: Props) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`w-16 h-8 flex items-center rounded-full p-1 border transition-colors duration-300 mt-4 sm:mt-0 self-center sm:self-auto
        ${darkMode ? "bg-slate-800 border-blue-600" : "bg-slate-200 border-blue-600"}`}
    >
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full shadow-md transform transition-transform duration-300 bg-white
          ${darkMode ? "translate-x-8" : "translate-x-0"}`}
      >
        <img
          src={darkMode ? "/images/icons/Moon.svg" : "/images/icons/Sun.svg"}
          alt="modo"
          className="h-auto w-3.5"
        />
      </div>
    </button>
  );
}
