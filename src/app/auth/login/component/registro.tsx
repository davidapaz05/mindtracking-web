'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import InputField from "./input/index";
import "react-datepicker/dist/react-datepicker.css";
import SelectField from "./dropdown/index";
import AthenaMessage from "./speeach/index";

type SignupModalProps = {
  onClose?: () => void;
  onOpenModal1?: () => void;
  onBackToLogin?: () => void;
};

type FormErrors = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  birthDate: string;
  phone: string;
  gender: string;
};

// Componente customizado para input de telefone com máscara - CORRIGIDO
const PhoneInputField = ({ 
  placeholder, 
  iconSrc, 
  value, 
  onChange, 
  error 
}: {
  placeholder: string;
  iconSrc: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Formata o valor inicial
    if (value) {
      const formatted = formatPhone(value);
      setDisplayValue(formatted);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const formatPhone = (input: string): string => {
    // Remove tudo que não é número
    let numbers = input.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + número)
    if (numbers.length > 11) {
      numbers = numbers.substring(0, 11);
    }
    
    // Aplica a máscara (DD) NNNNN-NNNN
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    } else {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove todos os caracteres não numéricos para obter apenas números
    const numbersOnly = inputValue.replace(/\D/g, '');
    
    // Aplica a formatação
    const formattedValue = formatPhone(numbersOnly);
    setDisplayValue(formattedValue);
    
    // Envia o valor sem formatação para o parent (apenas números)
    onChange(numbersOnly);
  };

  return (
    <div className="w-full mb-4 font-inter">
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7`}>
          <Image src={iconSrc} alt={placeholder} width={20} height={20} className="w-full h-full" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          maxLength={15}
          className={`w-full h-11 pl-12 pr-4 rounded-xl bg-transparent border ${error ? 'border-red-500' : 'border-[#2b3640]'} text-sm text-white placeholder:text-white focus:outline-none ring-2 ${error ? 'ring-red-500' : 'ring-blue-600'} font-bold font-inter`}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Componente customizado para input de data com máscara - CORRIGIDO
const DateInputField = ({ 
  placeholder, 
  iconSrc, 
  value, 
  onChange, 
  error 
}: {
  placeholder: string;
  iconSrc: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Formata o valor inicial
    if (value) {
      const formatted = formatDate(value);
      setDisplayValue(formatted);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const formatDate = (input: string): string => {
    // Remove tudo que não é número
    let numbers = input.replace(/\D/g, '');
    
    // Limita a 8 dígitos (DDMMAAAA)
    if (numbers.length > 8) {
      numbers = numbers.substring(0, 8);
    }
    
    // Aplica a máscara DD/MM/AAAA automaticamente
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
    } else {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4, 8)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove todos os caracteres não numéricos para obter apenas números
    const numbersOnly = inputValue.replace(/\D/g, '');
    
    // Aplica a formatação
    const formattedValue = formatDate(numbersOnly);
    
    setDisplayValue(formattedValue);
    
    // Envia o valor sem formatação para o parent (apenas números)
    onChange(numbersOnly);
  };

  const handleBlur = () => {
    // Validação básica ao sair do campo
    const rawValue = displayValue.replace(/\D/g, '');
    if (rawValue.length === 8) {
      const day = parseInt(rawValue.substring(0, 2));
      const month = parseInt(rawValue.substring(2, 4));
      const year = parseInt(rawValue.substring(4, 8));
      
      // Validação básica de data
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
        setDisplayValue('');
        onChange('');
      }
    }
  };

  return (
    <div className="w-full mb-4 font-inter">
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7`}>
          <Image src={iconSrc} alt={placeholder} width={20} height={20} className="w-full h-full" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={10}
          className={`w-full h-11 pl-12 pr-4 rounded-xl bg-transparent border ${error ? 'border-red-500' : 'border-[#2b3640]'} text-sm text-white placeholder:text-white focus:outline-none ring-2 ${error ? 'ring-red-500' : 'ring-blue-600'} font-bold font-inter`}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default function SignupModal({ onClose, onOpenModal1, onBackToLogin }: SignupModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState<"form" | "done">("form");
  const [showMessage, setShowMessage] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>("");
  
  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthDate: '' // Agora como string no formato DDMMAAAA
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    phone: '',
    gender: ''
  });
  
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    name: false,
    birthDate: false,
    phone: false,
    gender: false
  });

  const fullMessageForm =
    "Eu sou a Athena, sua assistente emocional. Estou aqui pra te ajudar a entender melhor seus sentimentos e serei sua parceira nessa jornada de autoconhecimento. Preciso te conhecer um pouco para te cadastrar nesta jornada";

  // Funções de validação
  const validateEmail = (email: string) => {
<<<<<<< HEAD
    if (!email) return 'Email é obrigatório';

    // Remove espaços em branco
    const trimmed = email.trim();

    // Formato geral RFC 5322 (simplificado)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(trimmed)) return 'Email inválido';

    // Não pode conter espaços
    if (/\s/.test(trimmed)) return 'Email não pode conter espaços';

    // Não pode começar ou terminar com ponto ou arroba
    if (/^[.@]/.test(trimmed) || /[.@]$/.test(trimmed)) return 'Email inválido';

    // Não pode ter dois pontos ou arrobas seguidos
    if (/\.\.|@@/.test(trimmed)) return 'Email inválido';

    // Domínios aceitos (pode ajustar conforme sua regra)
    const domainRegex = /@(gmail|hotmail|outlook|yahoo|icloud|protonmail|live|aol|zoho|yandex|mail)\.[a-z]{2,}$/i;
    if (!domainRegex.test(trimmed)) return 'Use um email válido (Gmail, Hotmail, Outlook, etc.)';

    // Tamanho máximo recomendado (254 caracteres)
    if (trimmed.length > 254) return 'Email muito longo';

    // Nome do usuário não pode ser só números
    const user = trimmed.split('@')[0];
    if (/^\d+$/.test(user)) return 'Nome do email não pode ser apenas números';

    // Não pode conter caracteres especiais proibidos
    if (/[,;<>()[\]{}]/.test(trimmed)) return 'Email contém caracteres inválidos';

=======
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainRegex = /@(gmail|hotmail|outlook|yahoo|icloud|protonmail|live|aol|zoho|yandex|mail)\./i;
    
    if (!email) return 'Email é obrigatório';
    if (!emailRegex.test(email)) return 'Email inválido';
    if (!domainRegex.test(email)) return 'Use um email válido (Gmail, Hotmail, Outlook, etc.)';
>>>>>>> de934e0de3e0349d82bcff4586aa5ee867b6ba93
    return '';
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!password) return 'Senha é obrigatória';
    if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
    if (!hasUpperCase) return 'Senha deve conter pelo menos uma letra maiúscula';
    if (!hasLowerCase) return 'Senha deve conter pelo menos uma letra minúscula';
    if (!hasNumber) return 'Senha deve conter pelo menos um número';
    if (!hasSpecialChar) return 'Senha deve conter pelo menos um caractere especial';
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return 'Confirmação de senha é obrigatória';
    if (confirmPassword !== password) return 'Senhas não coincidem';
    return '';
  };

  const validateName = (name: string) => {
    if (!name) return 'Nome é obrigatório';
    if (name.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) return 'Nome deve conter apenas letras';
    return '';
  };

  const validateBirthDate = (dateStr: string) => {
    if (!dateStr) return 'Data de nascimento é obrigatória';
    if (dateStr.length !== 8) return 'Data de nascimento inválida';
<<<<<<< HEAD

    const day = parseInt(dateStr.substring(0, 2));
    const month = parseInt(dateStr.substring(2, 4));
    const year = parseInt(dateStr.substring(4, 8));

    // Não permitir anos acima de 2012 (menor de 12 anos)
    if (year > 2012) return 'Somente para maiores de 12 anos';

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    const maxDate = new Date(2012, 11, 31); // 31/12/2012

=======
    
    const day = parseInt(dateStr.substring(0, 2));
    const month = parseInt(dateStr.substring(2, 4));
    const year = parseInt(dateStr.substring(4, 8));
    
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    
    // Validação básica de data
>>>>>>> de934e0de3e0349d82bcff4586aa5ee867b6ba93
    if (isNaN(birthDate.getTime())) return 'Data de nascimento inválida';
    if (day < 1 || day > 31) return 'Dia inválido';
    if (month < 1 || month > 12) return 'Mês inválido';
    if (year < 1900) return 'Ano inválido';
    if (birthDate < minDate) return 'Data de nascimento inválida';
<<<<<<< HEAD
    if (birthDate > maxDate) return 'Você deve ter pelo menos 12 anos para se cadastrar';

=======
    if (birthDate > maxDate) return 'Você deve ter pelo menos 12 anos';
    
>>>>>>> de934e0de3e0349d82bcff4586aa5ee867b6ba93
    return '';
  };

  const validatePhone = (phone: string) => {
    if (!phone) return 'Telefone é obrigatório';
    
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10) return 'Telefone deve ter pelo menos 10 dígitos';
    if (cleanPhone.length > 11) return 'Telefone deve ter no máximo 11 dígitos';
    
    // Validação do DDD (deve ser entre 11 và 99)
    const ddd = parseInt(cleanPhone.substring(0, 2));
    if (ddd < 11 || ddd > 99) return 'DDD inválido';
    
    return '';
  };

  const validateGender = (gender: string) => {
    if (!gender) return 'Gênero é obrigatório';
    return '';
  };

  // Handlers para os campos - CORRIGIDO
  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
<<<<<<< HEAD
    const sanitizedValue = removeEmojis(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));

=======
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
>>>>>>> de934e0de3e0349d82bcff4586aa5ee867b6ba93
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenderChange = (value: string) => {
<<<<<<< HEAD
    const sanitizedValue = removeEmojis(value);
    setSelectedGender(sanitizedValue);
=======
    setSelectedGender(value);
>>>>>>> de934e0de3e0349d82bcff4586aa5ee867b6ba93
    if (errors.gender) {
      setErrors(prev => ({ ...prev, gender: '' }));
    }
  };

  const handleBirthDateChange = (value: string) => {
    setFormData(prev => ({ ...prev, birthDate: value }));
    if (errors.birthDate) {
      setErrors(prev => ({ ...prev, birthDate: '' }));
    }
  };

  const handleInputBlur = (field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error = '';
    
    switch (field) {
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        // Se mudou a senha, validar também a confirmação
        if (touched.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword, formData.password);
        break;
      case 'name':
        error = validateName(formData.name);
        break;
      case 'birthDate':
        error = validateBirthDate(formData.birthDate);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'gender':
        error = validateGender(selectedGender);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateStep1 = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    
    setErrors({
      ...errors,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });
    
    return !emailError && !passwordError && !confirmPasswordError;
  };

  const validateStep2 = () => {
    const nameError = validateName(formData.name);
    const birthDateError = validateBirthDate(formData.birthDate);
    const phoneError = validatePhone(formData.phone);
    const genderError = validateGender(selectedGender);
    
    setErrors({
      ...errors,
      name: nameError,
      birthDate: birthDateError,
      phone: phoneError,
      gender: genderError
    });
    
    return !nameError && !birthDateError && !phoneError && !genderError;
  };

  const handleProsseguir = () => {
    if (validateStep1()) {
      setStep("done");
      setShowMessage(false);
      setTypedMessage("");
      setIsTypingComplete(false);
    }
  };

  const handleCreateAccount = () => {
    if (validateStep2()) {
      console.log('Conta criada com sucesso:', {
        ...formData,
        gender: selectedGender
      });
      if (onClose) onClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleOpenModal1 = () => {
    setIsOpen(false);
    if (onClose) onClose();
    if (onOpenModal1) onOpenModal1();
  };

  const handleBackToLogin = () => {
    setIsOpen(false);
    if (onBackToLogin) onBackToLogin();
  };

  const handleVoltar = () => {
    if (step === "done") {
      setStep("form");
      setShowMessage(false);
      setTypedMessage("");
      setIsTypingComplete(false);
      setTimeout(() => setShowMessage(true), 500);
    } else {
      handleBackToLogin();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 1000);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (!showMessage || step !== "form") return;

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullMessageForm.length) {
        setTypedMessage(fullMessageForm.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 30);

    return () => {
      clearInterval(typingInterval);
      setIsTypingComplete(false);
    };
  }, [showMessage, step]);

<<<<<<< HEAD
  // Função para remover emojis
  function removeEmojis(str: string) {
    // Regex para remover a maioria dos emojis
    return str.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2011-\u26FF]|\uD83D[\uDE00-\uDE4F])/g,
      ''
    );
  }

=======
>>>>>>> de934e0de3e0349d82bcff4586aa5ee867b6ba93
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 font-inter">
      <div className="relative flex w-[min(980px,92%)] max-w-[980px] rounded-[12px] bg-slate-800 border border-[#1f2937] shadow-[0_20px_60px_rgba(2,6,23,0.6)] p-8 md:p-12 overflow-visible">

        {/* Cabeçalho com botão de fechar à esquerda e logo à direita */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
<<<<<<< HEAD
          {/* Botão Fechar - Esquerda (sempre visível) */}
          <button
            className="w-10 h-10 right-12 absolute top-5 rounded-full text-white cursor-pointer flex items-center justify-center"
            aria-label="Fechar"
            onClick={handleClose}
          >
            <Image src="/images/fechar.svg" alt="Fechar" width={65} height={65} />
          </button>

          {/* Botão Voltar - Esquerda (apenas na segunda parte) */}
          {step === "done" && (
            <button
              className="w-10 h-10 absolute top-5 left-0 rounded-full text-white cursor-pointer flex items-center justify-center z-50"
              aria-label="Voltar"
              onClick={handleVoltar}
              style={{ left: 0 }}
            >
              <Image src="/images/voltar.svg" alt="Voltar" width={30} height={30} />
            </button>
          )}

=======
          {/* Botão Voltar - Esquerda */}
          <button
            className="w-10 h-10 absolute top-5 rounded-full text-white cursor-pointer flex items-center justify-center"
            aria-label="Voltar"
            onClick={handleVoltar}
          >
            <Image src="/images/voltar.svg" alt="Voltar" width={30} height={32} />
          </button>
          <button
            className="absolute top-4 right-4 w-13 h-13 rounded-full text-white  flex items-center justify-center z-50 font-inter cursor-pointer"
            aria-label="Fechar"
            onClick={handleClose}
          >
            <Image src="/images/fechar.svg" alt="Fechar" width={50} height={32} />
          </button>
          
>>>>>>> de934e0de3e0349d82bcff4586aa5ee867b6ba93
          {/* Logo - Direita (visível apenas em mobile) */}
          <div className="md:hidden w-12">
            <Image src="/images/logo.svg" alt="Logo" width={48} height={48} className="h-auto w-full" />
          </div>
        </div>

        {/* Atena + mensagem */}
        <div className="hidden md:block  absolute left-5 bottom-0 translate-y-[5%] translate-x-[10%] pointer-events-none select-none">
          {step === "form" && showMessage && (
            <AthenaMessage 
              message={typedMessage}
              title="Bem-vindo à MindTracking!"
              position={{ top: "-110px", right: "-235px" }}
            />
          )}

          {step === "done" && (
            <AthenaMessage 
              message="Pra começarmos do jeitinho certo, me conta seu nome e quando você nasceu. Assim, posso te conhecer melhor e deixar tudo mais personalizado por aqui"
              title="Tudo pronto!"
              position={{ top: "-25px", right: "-260px" }}
            />
          )}

          <Image
            src={step === "form" ? "/images/athena2.png" : "/images/athena3.png"}
            alt="Doctor illustration"
            width={255}
            height={280}
            className="h-auto w-[190px] md:w-[230px]"
          />
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-col w-full max-w-[412px] ml-auto px-4 md:pl-12 items-center text-center">

          {/* Logo (apenas desktop) */}
          <div className="hidden md:block w-16 md:w-18 mb-6">
            <Image src="/images/logo.svg" alt="Logo" width={62} height={60} className="h-auto w-full" />
          </div>

          {step === "form" ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Vamos começar!</h2>
              <p className="text-[1.3125rem] text-white mt-3 mb-8">
                Sua jornada rumo ao equilíbrio emocional começa aqui.
              </p>

              {/* INPUTS CORRIGIDOS - AGORA PASSAM APENAS O VALOR */}
              <InputField 
                placeholder="Email" 
                type="email" 
                iconSrc="/images/email.svg" 
                value={formData.email}
                onChange={(value) => handleInputChange('email')(value)}
                onBlur={handleInputBlur('email')}
                error={errors.email}
                name="email"
              />
              <InputField 
                placeholder="Senha" 
                type="password" 
                iconSrc="/images/password.svg" 
                hasTogglePassword 
                value={formData.password}
                onChange={(value) => handleInputChange('password')(value)}
                onBlur={handleInputBlur('password')}
                error={errors.password}
                name="password"
              />
              <InputField a
                placeholder="Confirme sua senha" 
                type="password" 
                iconSrc="/images/password.svg" 
                hasTogglePassword 
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword')(value)}
                onBlur={handleInputBlur('confirmPassword')}
                error={errors.confirmPassword}
                name="confirmPassword"
              />

              <button
                type="button"
                onClick={handleProsseguir}
                className="w-full h-11 rounded-[1.5rem] 
             bg-blue-600 text-white font-bold font-inter
             transition-all duration-300 ease-in-out
             hover:bg-blue-500
             active:bg-blue-500 active:ring-6 active:ring-inset active:ring-blue-700"
              >
                Prosseguir para próxima etapa
              </button>

              <div className="flex items-center justify-center w-full my-3">
                <div className="flex-grow h-[0.5px] bg-white/20"></div>
                <span className="px-4 text-[16px] text-white">Ou</span>
                <div className="flex-grow h-[0.5px] bg-white/20"></div>
              </div>

              <button
                onClick={handleOpenModal1}
                className="w-full h-11 rounded-[1.5rem] font-bold border border-[#2b3640] text-white 
                           transition-all duration-300 ease-in-out
                           hover:bg-gray-800/30 hover:ring-blue-500 hover:border-blue-400
                           hover:shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]
                           active:scale-[0.98] ring-2 ring-blue-600"
              >
                Já tem uma conta?
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Cadastro Concluído!</h2>
              <p className="text-[1.3125rem] text-white mt-3 mb-8">
                Seu cadastro foi realizado com sucesso. Bem-vindo à plataforma!
              </p>

              {/* INPUT CORRIGIDO - AGORA PASSA APENAS O VALOR */}
              <InputField 
                placeholder="Nome" 
                type="text" 
                iconSrc="/images/user.svg" 
                value={formData.name}
                onChange={(value) => handleInputChange('name')(value)}
                onBlur={handleInputBlur('name')}
                error={errors.name}
                name="name"
              />
              
              <DateInputField
                placeholder="Data de nascimento"
                iconSrc="/images/calendar.svg"
                value={formData.birthDate}
                onChange={handleBirthDateChange}
                error={errors.birthDate}
              />
              
              <PhoneInputField
                placeholder="Telefone"
                iconSrc="/images/Telefone.svg"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={errors.phone}
              />
              <SelectField
                placeholder="Gênero "
                iconSrc="/images/genero.svg"
                iconContainerClassName="w-5 h-5"
                iconClassName="scale-110"
                options={[
                  { value: "male", label: "Masculino" },
                  { value: "female", label: "Feminino" },
                  { value: "other", label: "Prefiro não dizer" }
                ]}
                value={selectedGender}
                onChange={handleGenderChange}
                error={errors.gender}
              />

              <button
                onClick={handleCreateAccount}
                className="w-full h-11 rounded-[1.5rem] 
             bg-blue-600 text-white font-bold font-inter
             transition-all duration-300 ease-in-out
             hover:bg-blue-500
             active:bg-blue-500 active:ring-6 active:ring-inset active:ring-blue-700"
              >
                Criar minha conta
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}