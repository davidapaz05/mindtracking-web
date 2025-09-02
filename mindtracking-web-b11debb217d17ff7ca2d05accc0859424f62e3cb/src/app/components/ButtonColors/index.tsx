"use client";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function DarkModeToggle({ darkMode, setDarkMode }: Props) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="w-17 h-8 flex items-center rounded-full p-1 border-[2.5px] border-blue-600 
                 transition-colors duration-300 mt-4 sm:mt-0 self-center sm:self-auto"
    >
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-full shadow-md transform transition-all duration-300 bg-slate-300
          ${darkMode ? "translate-x-0" : "translate-x-8"}`}
      >
        <img
          src={darkMode ? "/images/icons/Moon.svg" : "/images/icons/Sun.svg"}
          alt="modo"
          className="h-auto w-3"
        />
      </div>
    </button>
  );
}
