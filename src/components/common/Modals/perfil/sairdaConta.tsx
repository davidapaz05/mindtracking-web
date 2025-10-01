import { useTheme } from '@/contexts/ThemeContext';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function LogoutModal({ isOpen, onClose, onLogout }: LogoutModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const icons = {
    sair: '/images/icons/sair.svg',
    fechar: theme === 'dark' ? '/images/icons/fechar_b.svg' : '/images/icons/fechar.svg',
  };

  const isDark = theme === 'dark';

  // Cores dinâmicas
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const titleColor = isDark ? 'text-white' : 'text-gray-900';
  const descriptionColor = isDark ? 'text-gray-300' : 'text-gray-500';
  const cancelBtnBg = isDark ? 'bg-slate-800 hover:bg-slate-900' : 'bg-gray-200 hover:bg-gray-300';
  const cancelBtnText = isDark ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Modal com fundo dinâmico e responsivo */}
      <div
        className={`relative w-full max-w-lg px-4 sm:px-6 py-6 mx-auto rounded-lg sm:rounded-2xl text-center shadow-lg ${bgColor}`}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full dark:hover:bg-gray-700"
          aria-label="Fechar"
        >
          <img src={icons.fechar} alt="Fechar" className="w-10 h-10" />
        </button>

        {/* Ícone sair */}
        <div className="flex justify-center mb-4 mt-6">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={icons.sair} alt="Sair" className="w-20 h-20" />
          </div>
        </div>

        {/* Título */}
        <h2 className={`text-lg font-inter font-semibold mb-2 ${titleColor}`}>
          Deseja sair da sua conta?
        </h2>

        {/* Descrição */}
        <p className={`text-sm font-inter font-medium mb-6 ${descriptionColor}`}>
          Você precisará fazer login novamente para continuar usando a Athena.
        </p>

        {/* Botões */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2 rounded-full font-inter font-semibold transition-colors ${cancelBtnBg} ${cancelBtnText}`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-10 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-inter font-semibold transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
