'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type SelectFieldProps = {
  placeholder: string;
  iconSrc: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
};

export default function SelectField({
  placeholder,
  iconSrc,
  iconContainerClassName = "w-7 h-7",
  iconClassName = "",
  options,
  value = "",
  onChange,
  error = ""
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
    setIsOpen(false);
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="w-full mb-4 font-inter relative" ref={selectRef}>
      <div className="relative">
        {/* Ícone à esquerda */}
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 ${iconContainerClassName}`}>
          <Image
            src={iconSrc}
            alt={placeholder}
            width={20}
            height={20}
            className={`w-full h-full ${iconClassName}`}
          />
        </div>

        {/* Select personalizado */}
        <div
          className={`w-full h-11 pl-12 pr-11 rounded-xl bg-transparent border ${error ? 'border-red-500' : 'border-[#2b3640]'} text-sm text-white placeholder:text-white focus:outline-none ring-2 ${error ? 'ring-red-500' : 'ring-blue-600'} font-bold font-inter cursor-pointer flex items-center`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption ? (
            <span className="text-white">{selectedOption.label}</span>
          ) : (
            <span className="text-white">{placeholder}</span>
          )}
        </div>

        {/* Ícone de seta à direita */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5">
          <svg
            className={`w-5 h-5 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown options */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a202c] border border-[#2b3640] rounded-xl shadow-lg z-50">
            {options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-3 text-sm text-white font-inter font-bold hover:bg-[#2b3640] cursor-pointer first:rounded-t-xl last:rounded-b-xl transition-colors"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}