import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  validateName,
  validateBirthdate,
  validatePhone,
  validateGender,
} from "@/lib/validation";
import { updateDadosUser } from "@/lib/api/auth";
import { dadosUser } from "@/lib/api/auth";
import { toast } from "react-toastify";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState<string | null>(null);

  // Resetar campos ao abrir o modal
  useEffect(() => {
    // não limpar ao abrir (assim preenche com os dados do servidor)
    // limpar apenas quando o modal for fechado
    if (!isOpen) {
      setName("");
      setNameError(null);
      setBirthDate("");
      setBirthDateError(null);
      setPhone("");
      setPhoneError(null);
      setGender("");
      setGenderError(null);
    }
  }, [isOpen]);

  // Ao abrir, buscar dados do usuário (usando token do JWT) e preencher os campos sem enviar
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const formatDateToDisplay = (isoDate?: string) => {
      if (!isoDate) return "";
      // espera yyyy-mm-dd ou yyyy-mm-ddT...
      const d = isoDate.split("T")[0];
      const [y, m, day] = d.split("-");
      if (!y || !m || !day) return "";
      return `${day}/${m}/${y}`;
    };

    const formatPhoneDisplay = (raw?: string) => {
      if (!raw) return "";
      const onlyNums = raw.replace(/\D/g, "");
      const limited = onlyNums.slice(0, 11);
      if (limited.length <= 2) return limited;
      if (limited.length <= 6)
        return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
      if (limited.length === 11)
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    };

    const fetchProfile = async () => {
      const data = await dadosUser();
      const profile = data?.data || data?.user || data || null;
      if (!profile || !mounted) return;

      const nome = profile.nome ?? profile.name ?? "";
      const telefone = profile.telefone ?? profile.phone ?? "";
      const dataNascimento =
        profile.data_nascimento ??
        profile.dataNascimento ??
        profile.birthdate ??
        "";
      const genero = profile.genero ?? profile.gender ?? "";

      const formattedDate = formatDateToDisplay(dataNascimento);
      const formattedPhone = formatPhoneDisplay(telefone);

      setName(nome);
      setNameError(validateName(nome));
      setBirthDate(formattedDate);
      setBirthDateError(validateBirthdate(formattedDate));
      setPhone(formattedPhone);
      setPhoneError(validatePhone(formattedPhone));
      setGender(genero);
      setGenderError(validateGender(genero));
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const icons = {
    logo:
      theme === "dark"
        ? "/images/icons/logo_branca.svg"
        : "/images/icons/logo_p.svg",
    nome:
      theme === "dark" ? "/images/icons/nome.svg" : "/images/icons/nome_p.svg",
    data:
      theme === "dark" ? "/images/icons/data.svg" : "/images/icons/data_p.svg",
    telefone:
      theme === "dark"
        ? "/images/icons/telefone.svg"
        : "/images/icons/telefone_p.svg",
    genero:
      theme === "dark"
        ? "/images/icons/genero.svg"
        : "/images/icons/genero_p.svg",
    fechar:
      theme === "dark"
        ? "/images/icons/fechar_b.svg"
        : "/images/icons/fechar.svg",
  };

  const borderColor = theme === "dark" ? "border-blue-600" : "border-blue-900";
  const iconSize = "w-6 h-6 shrink-0"; // padroniza tamanho dos ícones dos campos
  const fieldBgClass = theme === "dark" ? "bg-gray-800" : "bg-gray-200";
  const cancelBtnBg = theme === "dark" ? "bg-slate-700" : "bg-gray-300";

  // Função de submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nameError || birthDateError || phoneError || genderError) return;

    try {
      // Converter dd/mm/yyyy → yyyy-mm-dd
      const [dia, mes, ano] = birthDate.split("/");
      const data_nascimento = `${ano}-${mes}-${dia}`;

      const payload = {
        nome: name,
        telefone: phone.replace(/\D/g, ""),
        data_nascimento,
        genero: gender,
      };

      const response = await updateDadosUser(payload);

      if (response.success) {
        toast.success("Perfil atualizado com sucesso!");
        onSuccess?.();
        onClose();
      } else {
        toast.error("Erro ao atualizar perfil. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar perfil.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-xl mx-auto p-6 rounded-2xl shadow-lg ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-4 p-1 rounded-full"
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

        <div className="flex flex-col items-center mb-6 mt-6">
          <Image
            src={icons.logo}
            alt="Ícone"
            width={64}
            height={64}
            className="w-16 h-16 mb-1"
          />
          <h2 className="text-2xl font-semibold">Editar Perfil</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-md mx-auto w-full"
        >
          {/* Nome */}
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-2 ${fieldBgClass}`}
            >
              <Image
                src={icons.nome}
                alt="Nome"
                width={24}
                height={24}
                className={iconSize}
              />
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => {
                  const value = e.target.value.replace(
                    /[^A-Za-zÀ-ÖØ-öø-ÿ\s'´^~`]/g,
                    "",
                  );
                  setName(value);
                  setNameError(validateName(value));
                }}
                className={`${fieldBgClass} w-full outline-none text-sm font-inter font-semibold`}
              />
            </div>
            {nameError && (
              <span className="text-red-500 text-xs ml-2">{nameError}</span>
            )}
          </div>

          {/* Data de nascimento */}
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-2 ${fieldBgClass}`}
            >
              <Image
                src={icons.data}
                alt="Data"
                width={24}
                height={24}
                className={iconSize}
              />
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
            {birthDateError && (
              <span className="text-red-500 text-xs ml-2">
                {birthDateError}
              </span>
            )}
          </div>

          {/* Telefone */}
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-2 ${fieldBgClass}`}
            >
              <Image
                src={icons.telefone}
                alt="Telefone"
                width={24}
                height={24}
                className={iconSize}
              />
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
            {phoneError && (
              <span className="text-red-500 text-xs ml-2">{phoneError}</span>
            )}
          </div>

          {/* Gênero */}
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center ${borderColor} border-2 rounded-xl px-3 py-2.5 gap-2 ${fieldBgClass}`}
            >
              <Image
                src={icons.genero}
                alt="Gênero"
                width={24}
                height={24}
                className={iconSize}
              />
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
            {genderError && (
              <span className="text-red-500 text-xs ml-2">{genderError}</span>
            )}
          </div>

          {/* Botões */}
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
              disabled={
                !!nameError || !!birthDateError || !!phoneError || !!genderError
              }
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
