import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Importa o hook para redirecionamento
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import { deleteAccount } from "@/lib/api/auth";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onDelete,
}: DeleteAccountModalProps) {
  const { theme } = useTheme();
  const router = useRouter(); // ✅ Inicializa o hook do Next.js
  const [inputEmail, setInputEmail] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (!isOpen) return null;

  const icons = {
    deletar: "/images/icons/deletar.svg",
    fechar:
      theme === "dark"
        ? "/images/icons/fechar_b.svg"
        : "/images/icons/fechar.svg",
  };

  const isDark = theme === "dark";

  const cancelBtnBg = isDark
    ? "bg-slate-700 text-white"
    : "bg-gray-300 text-gray-700";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const descriptionColor = isDark ? "text-gray-300" : "text-gray-500";

  // ✅ Corrigido: pega o e-mail real do localStorage
  const registeredEmail =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("mt_user") || "{}")?.email || ""
      : "";

  const isEmailMatch =
    inputEmail.trim().toLowerCase() === registeredEmail.toLowerCase();

  const handleDeleteAccount = async () => {
    if (!isEmailMatch) return;
    setDeleteLoading(true);
    try {
      await deleteAccount();

      // ✅ Remove dados locais e redireciona
      localStorage.clear();
      setDeleteLoading(false);
      onDelete();
      router.push("/"); // ✅ Redireciona para a Home
    } catch (error) {
      setDeleteLoading(false);
      console.error("Falha ao deletar a conta:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/60">
      <div
        className={`relative w-full max-w-lg px-4 sm:px-6 py-6 mx-auto rounded-lg sm:rounded-2xl text-center shadow-lg ${
          isDark ? "bg-slate-800" : "bg-slate-50"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 cursor-pointer rounded-full"
          aria-label="Fechar"
        >
          <Image
            src={icons.fechar}
            alt="Fechar"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </button>

        <div className="flex justify-center mb-2 mt-6">
          <div className="flex items-center justify-center">
            <Image
              src={theme === "dark" ? "/images/icons/Lixeira_white.svg" : "/images/icons/Lixeira_black.svg"}
              alt="Deletar"
              width={56}
              height={56}
              className="w-12 h-12 mb-2"
            />
          </div>
        </div>

        <h2 className={`text-lg font-inter font-semibold mb-2 ${titleColor}`}>
          Deseja deletar sua conta?
        </h2>

        <p className={`text-sm font-inter font-medium mb-6 ${descriptionColor}`}>
          Para confirmar, por favor insira seu e-mail registrado.
        </p>

        <input
          type="email"
          placeholder="Seu e-mail"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          className={`mb-6 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-600"
          }`}
        />

        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={onClose}
            className={`px-8 py-2 rounded-full font-inter font-semibold transition-colors duration-200 hover:brightness-90 ${cancelBtnBg}`}
            disabled={deleteLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={!isEmailMatch || deleteLoading}
            className={`px-10 py-2 rounded-full text-white font-inter font-semibold transition-colors ${
              isEmailMatch
                ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                : "bg-red-400 cursor-not-allowed"
            }`}
          >
            {deleteLoading ? "Deletando..." : "Deletar"}
          </button>
        </div>
      </div>
    </div>
  );
}
