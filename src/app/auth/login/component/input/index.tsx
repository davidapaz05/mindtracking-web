'use client';

import { useState, useRef } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type InputProps = {
  placeholder: string;
  type?: string;
  iconSrc: string;
  hasTogglePassword?: boolean;
  value?: string | Date | null;
  onChange?: (value: string | Date | null) => void; // TIPO CORRIGIDO
  onBlur?: () => void;
  iconClassName?: string;
  iconContainerClassName?: string;
  error?: string;
  name?: string;
};

export default function InputField({
  placeholder,
  type = "text",
  iconSrc,
  hasTogglePassword = false,
  value,
  onChange,
  onBlur,
  iconClassName = "",
  iconContainerClassName = "w-7 h-7",
  error = "",
  name = ""
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const datePickerRef = useRef<DatePicker>(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleDateChange = (date: Date | null) => {
    if (onChange) {
      onChange(date);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value); // CORRIGIDO: passa apenas o valor, não o evento
    }
  };

  const inputType =
    hasTogglePassword && type === "password"
      ? (showPassword ? "text" : "password")
      : type;

  // Se for um campo de data, renderizamos o DatePicker
  if (type === "date") {
    return (
      <div className="w-full mb-4 font-inter">
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

          {/* DatePicker */}
          <DatePicker
            ref={datePickerRef}
            selected={value instanceof Date ? value : null}
            onChange={handleDateChange}
            placeholderText={placeholder}
            className={`w-full h-11 pl-12 pr-4 rounded-xl bg-transparent border ${error ? 'border-red-500' : 'border-[#2b3640]'} text-sm text-white placeholder:text-white focus:outline-none ring-2 ${error ? 'ring-red-500' : 'ring-blue-600'} font-bold font-inter`}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            maxDate={new Date()}
            popperClassName="react-datepicker-popper"
            popperPlacement="bottom-start"
            wrapperClassName="w-full"
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Para outros tipos de input
  return (
    <div className="w-full mb-4 font-inter">
      <div className="relative">
        
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconContainerClassName}`}>
          <Image
            src={iconSrc}
            alt={placeholder}
            width={20}
            height={20}
            className={`w-full h-full ${iconClassName}`}
          />
        </div>

        {/* Input */}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value as string}
          onChange={handleInputChange}
          onBlur={onBlur}
          name={name}
          className={`w-full h-11 pl-12 pr-11 rounded-xl bg-transparent  text-sm text-white placeholder:text-white focus:outline-none border-2 border-blue-600  font-bold font-inter`}
        />

        {/* Botão de mostrar/ocultar senha */}
        {hasTogglePassword && type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
            onClick={togglePasswordVisibility}
          >
            <Image
              src={showPassword ? "/images/eye-off.svg" : "/images/eye.svg"}
              alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
              width={20}
              height={20}
              className="w-full h-full w-full h-full invert brightness-0"
            />
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Função utilitária para validação completa de email
export function validateEmailFull(email: string): string {
  if (!email) return 'Email é obrigatório';

  const trimmed = email.trim();

  // Tamanho máximo recomendado (254 caracteres)
  if (trimmed.length > 254) return 'Email muito longo';

  // Não pode conter espaços
  if (/\s/.test(trimmed)) return 'Email não pode conter espaços';

  // Não pode conter caracteres especiais proibidos
  if (/[,;<>()[\]{}]/.test(trimmed)) return 'Email contém caracteres inválidos';

  // Não pode começar ou terminar com ponto ou arroba
  if (/^[.@]/.test(trimmed) || /[.@]$/.test(trimmed)) return 'Email inválido';

  // Não pode ter dois pontos ou arrobas seguidos
  if (/\.\.|@@/.test(trimmed)) return 'Email inválido';

  // Formato geral RFC 5322 (simplificado)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(trimmed)) return 'Email inválido';

  // Nome do usuário não pode ser só números
  const user = trimmed.split('@')[0];
  if (/^\d+$/.test(user)) return 'Nome do email não pode ser apenas números';

  // Domínios aceitos (pode ajustar conforme sua regra)
  const domainRegex = /@(gmail|hotmail|outlook|yahoo|icloud|protonmail|live|aol|zoho|yandex|mail)\.[a-z]{2,}$/i;
  if (!domainRegex.test(trimmed)) return 'Use um email válido (Gmail, Hotmail, Outlook, etc.)';

  // Não pode ter mais de um @
  if ((trimmed.match(/@/g) || []).length !== 1) return 'Email inválido';

  // Não pode ter .. no domínio
  const domain = trimmed.split('@')[1];
  if (domain && domain.includes('..')) return 'Email inválido';

  // Não pode começar ou terminar com hífen no domínio
  if (domain && (/^-|-$/.test(domain))) return 'Email inválido';

  // Não pode ter subdomínios com menos de 2 caracteres
  if (domain && domain.split('.').some(part => part.length < 2)) return 'Email inválido';

  return '';
}