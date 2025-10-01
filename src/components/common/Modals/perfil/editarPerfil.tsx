import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  if (!isOpen) return null;

  const icons = {
    logo: theme === 'dark' ? '/images/icons/logo_branca.svg' : '/images/icons/logo_p.svg',
    nome: theme === 'dark' ? '/images/icons/nome.svg' : '/images/icons/nome_p.svg',
    data: theme === 'dark' ? '/images/icons/data.svg' : '/images/icons/data_p.svg',
    telefone: theme === 'dark' ? '/images/icons/telefone.svg' : '/images/icons/telefone_p.svg',
    genero: theme === 'dark' ? '/images/icons/genero.svg' : '/images/icons/genero_p.svg',
    fechar: theme === 'dark' ? '/images/icons/fechar_b.svg' : '/images/icons/fechar.svg',
  };

  const borderColor = theme === 'dark' ? 'border-blue-900' : 'border-blue-600';
  const iconSize = 'w-6 h-6';

  const fieldBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  const cancelBtnBg = theme === 'dark' ? 'bg-slate-800 hover:bg-slate-900' : 'bg-gray-400 hover:bg-gray-500';

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
          className="absolute top-5 right-4 p-1 rounded-full dark:hover:bg-gray-700"
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
        <form className="flex flex-col gap-4">
          {/* Nome */}
          <div className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-3 ${fieldBgClass}`}>
            <img src={icons.nome} alt="Nome" className={iconSize} />
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
            />
          </div>

          {/* Data de nascimento */}
          <div className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-3 ${fieldBgClass}`}>
            <img src={icons.data} alt="Data" className={iconSize} />
            <input
              type="text"
              placeholder="Data de nascimento"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
            />
          </div>

          {/* Telefone */}
          <div className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-3 ${fieldBgClass}`}>
            <img src={icons.telefone} alt="Telefone" className={iconSize} />
            <input
              type="tel"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
            />
          </div>

          {/* Gênero */}
          <div className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-3 ${fieldBgClass}`}>
            <img src={icons.genero} alt="Gênero" className={iconSize} />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
            >
              <option value="">Selecione o gênero</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className={`${cancelBtnBg} px-5 py-2.5 rounded-full text-white font-inter font-semibold`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-inter font-semibold"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
