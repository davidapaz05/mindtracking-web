"use client";

import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import EditProfileModal from "@/components/common/Modals/perfil/editarPerfil";
import LogoutModal from "@/components/common/Modals/perfil/sairdaConta";
import ModalRedefinicaoSenha from "@/components/common/Modals/ModalRedefinicaoSenha";
import ButtonEsqueceuSenha from "@/components/common/Buttons/ButtonEsqueceuSenha";

export default function PerfilPage() {
  const [fotoPaisagem, setFotoPaisagem] = useState<string | null>(null);
  const { darkMode } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    setLogoutModalOpen(false);
  };

  const cardClasses = `
    rounded-2xl shadow-xl overflow-hidden 
    transition-colors duration-700
    ${darkMode ? "bg-slate-800 text-white" : "bg-slate-50 text-gray-900 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.10)]"}
  `;

  const fieldClasses = `
    p-4 rounded-lg transition-colors duration-300
    ${darkMode ? "bg-[#29374F] text-gray-300" : "bg-[#EFEFEF] text-gray-600"}
  `;

  const ProfileCard = (
    <div className={cardClasses}>
      {/* Imagem de paisagem */}
      <div className={`relative w-full h-32 md:h-40 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
        <Image
          src={fotoPaisagem || "/images/paisagem.png"}
          alt="Foto paisagem"
          fill
          className="object-cover object-bottom"
        />
        <button className="absolute top-3 right-3 bg-blue-600 p-2 rounded-full hover:bg-blue-700 flex items-center justify-center">
          <Image
            src="/images/icons/camera.svg"
            alt="camera"
            width={14}
            height={14}
          />
        </button>
      </div>

      {/* Perfil + botões */}
      <div className="flex flex-col md:flex-row items-start px-6 mt-6 relative">
        <div className="flex flex-col items-center md:items-start -mt-16 z-10">
          <div className="relative">
            <div
              className={`
                relative w-28 h-28 rounded-full overflow-hidden border-4
                ${darkMode ? "border-slate-800" : "border-slate-50"}
              `}
            >
              <Image
                src="/images/Perfil.png"
                alt="Foto perfil"
                fill
                className="object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full hover:bg-blue-700">
              <Image
                src="/images/icons/editar.svg"
                alt="editar"
                width={14}
                height={14}
              />
            </button>
          </div>
          <h2 className="mt-3 text-2xl font-semibold">João Henrique</h2>
        </div>

        {/* Botões responsivos */}
        <div className="mt-6 md:mt-0 ml-auto z-10 w-full md:w-auto flex flex-col md:flex-row gap-2 md:gap-3">
          {/* Mobile: azul em cima, vermelho embaixo. Desktop/tablet: todos na mesma linha */}
          <div className="w-full flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="flex flex-row gap-2 w-full">
              <button
                className="min-w-[120px] w-full sm:w-auto bg-blue-600 px-6 py-0.5 h-9 rounded-full font-bold hover:bg-blue-700 text-white whitespace-nowrap text-center"
                onClick={() => setModalOpen(true)}
              >
                Editar Perfil
              </button>
              <ButtonEsqueceuSenha 
                className="min-w-[120px] w-full sm:w-auto bg-blue-600 px-6 py-0.5 h-9 rounded-full font-bold hover:bg-blue-700 text-white whitespace-nowrap flex items-center justify-center"
              >
                Redefinir Senha
              </ButtonEsqueceuSenha>
            </div>
            <button
              className="min-w-[120px] w-full bg-red-600 px-6 py-0.5 h-9 rounded-full font-bold hover:bg-red-700 text-white whitespace-nowrap text-center mx-auto"
              onClick={() => setLogoutModalOpen(true)}
            >
              Sair da Conta
            </button>
          </div>
        </div>

        {/* Modais */}
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onLogout={handleLogout}
        />
        <EditProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        <ModalRedefinicaoSenha
          isOpen={resetPasswordModalOpen}
          onClose={() => setResetPasswordModalOpen(false)}
        >
          <div className="flex flex-col items-center w-full max-w-md">
            <Image
              src={darkMode ? "/images/icons/logo_branca.svg" : "/images/icons/logo_p.svg"}
              alt="Logo"
              width={64}
              height={64}
              className="mb-6"
            />
            <h2 className="text-2xl font-semibold mb-4">Redefinir Senha</h2>
            <div className="w-full space-y-4">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-900"
                }`}
              />
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar link de redefinição
              </button>
            </div>
          </div>
        </ModalRedefinicaoSenha>
      </div>

      <hr className={`my-4 mx-6 mb-0 border-t ${darkMode ? "border-gray-600" : "border-gray-300"}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-6">
        <div className={fieldClasses}>
          <p className="text-sm">Gênero</p>
          <p className="text-lg font-semibold">Masculino</p>
        </div>
        <div className={fieldClasses}>
          <p className="text-sm">Idade</p>
          <p className="text-lg font-semibold">28 Anos</p>
        </div>
        <div className={fieldClasses}>
          <p className="text-sm">Telefone</p>
          <p className="text-lg font-semibold">(11) 99999-9999</p>
        </div>
        <div className={fieldClasses}>
          <p className="text-sm">E-mail</p>
          <p className="text-lg font-semibold">joao@email.com</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-300 bg-transparent">
      {/* Sidebar fixa no topo em mobile */}
      <div className="sm:hidden fixed top-0 left-0 w-full z-50">
        <Sidebar />
      </div>

      {/* Layout desktop com sidebar lateral */}
      <div className="hidden sm:flex min-h-screen">
        <Sidebar />
  <div className="flex-1 flex items-center justify-center px-4 md:px-8 pt-10 md:pt-14 pb-10 md:justify-center ml-0 lg:ml-37.5">
          <div className="w-full max-w-5xl mx-auto">{ProfileCard}</div>
        </div>
      </div>

      {/* Layout mobile/tablet com espaçamento controlado */}
      <div className="sm:hidden px-5 pb-6 pt-[88px] md:pt-3">
        {/* ↑ pt-[88px] para mobile (distância da sidebar fixa) */}
        {/* ↑ md:pt-3 sobe o card no tablet */}
        {ProfileCard}
      </div>
    </div>
  );
}
