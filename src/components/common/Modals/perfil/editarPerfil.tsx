import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import {
  validateName,
  validateBirthdate,
  validatePhone,
  validateGender
} from '@/lib/validation';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [gender, setGender] = useState('');
  const [genderError, setGenderError] = useState<string | null>(null);

  // Resetar gênero ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setName('');
      setNameError(null);
      setBirthDate('');
      setBirthDateError(null);
      setPhone('');
      setPhoneError(null);
      setGender('');
      setGenderError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const icons = {
    logo: theme === 'dark' ? '/images/icons/logo_branca.svg' : '/images/icons/logo_p.svg',
    nome: theme === 'dark' ? '/images/icons/nome.svg' : '/images/icons/nome_p.svg',
    data: theme === 'dark' ? '/images/icons/data.svg' : '/images/icons/data_p.svg',
    telefone: theme === 'dark' ? '/images/icons/telefone.svg' : '/images/icons/telefone_p.svg',
    genero: theme === 'dark' ? '/images/icons/genero.svg' : '/images/icons/genero_p.svg',
    fechar: theme === 'dark' ? '/images/icons/fechar_b.svg' : '/images/icons/fechar.svg',
  };

  const borderColor = theme === 'dark' ? 'border-blue-600' : 'border-blue-900';
  const iconSize = 'w-6 h-6';

  const fieldBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  const cancelBtnBg = theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-xl mx-auto p-6 rounded-2xl shadow-lg ${
          theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Botão fechar no canto superior direito */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 p-1 rounded-full"
          aria-label="Fechar"
        >
          <img src={icons.fechar} alt="Fechar" className="w-10 h-10" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-6 mt-6">
          <img src={icons.logo} alt="Ícone" className="w-16 h-16 mb-1" />
          <h2 className="text-xl font-semibold">Editar Perfil</h2>
        </div>

        {/* Form */}
  <form className="flex flex-col gap-4 max-w-md mx-auto w-full">
          {/* Nome */}
          <div className={`flex flex-col gap-1`}>
            <div className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-3 ${fieldBgClass}`}>
              <img src={icons.nome} alt="Nome" className={iconSize} />
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => {
                  // Permite apenas letras, espaços e acentos agudo, circunflexo, til, grave, apóstrofo
                  const value = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'´^~`]/g, "");
                  setName(value);
                  setNameError(validateName(value));
                }}
                className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
              />
            </div>
            {nameError && <span className="text-red-500 text-xs ml-2">{nameError}</span>}
          </div>

          {/* Data de nascimento */}
          <div className={`flex flex-col gap-1`}>
            <div className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-3 ${fieldBgClass}`}>
              <img src={icons.data} alt="Data" className={iconSize} />
              <input
                type="text"
                placeholder="Data de nascimento"
                value={birthDate}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const onlyNums = rawValue.replace(/[^\d]/g, "");
                  let formattedDate = onlyNums;
                  if (onlyNums.length > 2) {
                    formattedDate = `${onlyNums.slice(0, 2)}/${onlyNums.slice(2)}`;
                  }
                  if (onlyNums.length > 4) {
                    formattedDate = `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}/${onlyNums.slice(4, 8)}`;
                  }
                  setBirthDate(formattedDate);
                  setBirthDateError(validateBirthdate(formattedDate));
                }}
                maxLength={10}
                className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
              />
            </div>
            {birthDateError && <span className="text-red-500 text-xs ml-2">{birthDateError}</span>}
          </div>

          {/* Telefone */}
          <div className={`flex flex-col gap-1`}>
            <div className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-3 ${fieldBgClass}`}>
              <img src={icons.telefone} alt="Telefone" className={iconSize} />
              <input
                type="tel"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const onlyNums = rawValue.replace(/[^\d]/g, "");
                  const limitedNums = onlyNums.slice(0, 11);
                  let formattedPhone = limitedNums;
                  if (limitedNums.length > 2) {
                    formattedPhone = `(${limitedNums.slice(0, 2)}) ${limitedNums.slice(2)}`;
                  }
                  if (limitedNums.length > 6 && limitedNums.length === 11) {
                    formattedPhone = `(${limitedNums.slice(0, 2)}) ${limitedNums.slice(2, 7)}-${limitedNums.slice(7)}`;
                  } else if (limitedNums.length > 6) {
                    formattedPhone = `(${limitedNums.slice(0, 2)}) ${limitedNums.slice(2, 6)}-${limitedNums.slice(6)}`;
                  }
                  setPhone(formattedPhone);
                  setPhoneError(validatePhone(formattedPhone));
                }}
                maxLength={15}
                className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
              />
            </div>
            {phoneError && <span className="text-red-500 text-xs ml-2">{phoneError}</span>}
          </div>

          {/* Gênero */}
          <div className={`flex flex-col gap-1`}>
            <div className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-3 ${fieldBgClass}`}>
              <img src={icons.genero} alt="Gênero" className={iconSize} />
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setGenderError(validateGender(e.target.value));
                }}
                className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
              >
                <option value="">Selecione o gênero</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
                <option value="prefiro não dizer">Prefiro não dizer</option>
              </select>
            </div>
            {genderError && <span className="text-red-500 text-xs ml-2">{genderError}</span>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 rounded-full font-inter font-semibold transition-colors duration-200 hover:brightness-90 ${cancelBtnBg}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-inter font-semibold"
              disabled={!!nameError || !!birthDateError || !!phoneError || !!genderError}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
