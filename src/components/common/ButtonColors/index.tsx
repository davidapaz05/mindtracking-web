"use client";

interface Props {
  darkMode: boolean;
  toggleTheme: () => void;
}

export default function DarkModeToggle({ darkMode, toggleTheme }: Props) {
  return (
    <button
      onClick={toggleTheme}
      className="w-20 h-11 md:w-17 md:h-8 flex items-center rounded-full p-1 border-[2.5px] border-blue-600 
                 transition-colors duration-300 mt-4 sm:mt-0 self-center sm:self-auto cursor-pointer"
    >
      <div
        className={`w-7 h-7 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-md transform transition-all duration-300 bg-slate-300
          ${darkMode ? "translate-x-0" : "md:translate-x-8 translate-x-10"}`}
      >
        <img
          src={darkMode ? "/images/icons/Moon.svg" : "/images/icons/Sun.svg"}
          alt="modo"
          className="h-auto w-[1em] md:w-3"
        />
      </div>
    </button>
  );
}
