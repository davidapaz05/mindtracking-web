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

  // Cancel button color based on theme
  const cancelBtnBg = isDark ? 'bg-slate-700 text-white' : 'bg-gray-300 text-gray-700';

  // Cores dinâmicas apenas para texto e botões, sem bg explícito
  const titleColor = isDark ? 'text-white' : 'text-gray-900';
  const descriptionColor = isDark ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Modal sem cor de fundo explícita, acompanha o background da tela */}
      <div
        className={
          `relative w-full max-w-lg px-4 sm:px-6 py-6 mx-auto rounded-lg sm:rounded-2xl text-center shadow-lg ` +
          (isDark ? 'bg-slate-800' : 'bg-slate-50')
        }
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full"
          aria-label="Fechar"
        >
          <img src={icons.fechar} alt="Fechar" className="w-10 h-10" />
        </button>

        {/* Ícone sair */}
        <div className="flex justify-center mb-2 mt-6">
          <div className="w-14 h-14 flex items-center justify-center">
            <img src={icons.sair} alt="Sair" className="w-14 h-14" />
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
            className={`px-6 py-2 rounded-full font-inter font-semibold transition-colors duration-200 hover:brightness-90 ${cancelBtnBg}`}
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
