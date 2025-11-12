"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./SidebarItem";
import {
  LayoutDashboard,
  NotebookPen,
  MessageSquareHeart,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import LogoutModal from "../../common/Modals/perfil/sairdaConta";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

const menuItems = [
  { title: "Dashboard", icon: <LayoutDashboard size={24} />, href: "/dashboard" },
  { title: "Seu diário emocional", icon: <NotebookPen size={24} />, href: "/diario" },
  { title: "Athena", icon: <MessageSquareHeart size={24} />, href: "/athena" },
];

const bottomItems = [
  {
    title: "Sair da conta",
    icon: <LogOut size={24} />,
    href: null,
    isLogout: true,
  },
];

export default function Sidebar({ onToggle }: { onToggle?: (open: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout, user, getUserInitials } = useAuth();


  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Header mobile/tablet fixo no topo */}
      {!mobileOpen && (
        <div
          className={`lg:hidden fixed top-9 left-0 right-0 z-50 flex items-center justify-between px-7 md:px-[74px] h-[64px] ${theme === "dark" ? "bg-gray-900" : "bg-white"
            } ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          <div className="flex items-center gap-3">
            <Image
              src="/images/icons/Logo-blue-600-w2.svg"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full"
            />
            <h1 className="text-[17px] md:text-[22px] font-bold">Mindtracking</h1>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Alternar menu" className="cursor-pointer">
            <Image
              src="/images/icons/menu.svg"
              alt="Menu"
              width={30}
              height={30}
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </button>
        </div>
      )}

      <aside
        onMouseEnter={() => {
          setIsOpen(true);
          onToggle?.(true);
        }}
        onMouseLeave={() => {
          setIsOpen(false);
          onToggle?.(false);
        }}
        className={`fixed left-0 top-0 h-screen shadow-lg border-r transition-all py-[34px] ease-in-out duration-300 z-40
          ${isOpen ? "w-[400px] pl-9" : "w-[150px]"}
          hidden lg:flex flex-col justify-between
          ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}
      >
        <div>
          <div className={`flex items-center gap-2 p-4 ${isOpen ? "justify-start" : "justify-center"}`}>
            <Image
              src={
                theme === "dark"
                  ? "/images/icons/Logo-blue-600-w2.svg"
                  : "/images/icons/Logo-blue-600-w2.svg"
              }
              alt="Logo"
              width={49}
              height={45}
              className="rounded-full"
            />
            {isOpen && (
              <span className={`font-semibold text-[22px] whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                MindTracking
              </span>
            )}
          </div>

          <nav className="flex flex-col gap-1 mt-4">
            {menuItems.map((item, idx) => (
              <SidebarItem
                key={idx}
                href={item.href}
                icon={item.icon}
                label={item.title}
                isOpen={isOpen}
                theme={theme}
                className="whitespace-nowrap"
              />
            ))}
          </nav>
        </div>

        <div className="mb-4 flex flex-col">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer
              ${isOpen ? "justify-start" : "justify-center"}
              ${theme === "dark" ? "text-gray-100 hover:bg-gray-700" : "text-[#0F172A] hover:bg-gray-100"}`}
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            {isOpen && (
              <span className={`font-semibold text-[22px] whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </span>
            )}
          </button>

          {bottomItems.map((item, idx) =>
            item.isLogout ? (
              <button
                key={idx}
                onClick={handleLogoutClick}
                className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer
                ${isOpen ? "justify-start" : "justify-center"}
                ${theme === "dark" ? "text-gray-100 hover:bg-gray-700" : "text-[#0F172A] hover:bg-gray-100"}`}
              >
                <span className="shrink-0 w-6 h-6 flex items-center justify-center">{item.icon}</span>
                {isOpen && (
                  <span className={`font-semibold text-[17px] md:text-[22px] whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {item.title}
                  </span>
                )}
              </button>
            ) : (
              <SidebarItem
                key={idx}
                href={item.href!}
                icon={item.icon}
                label={item.title}
                isOpen={isOpen}
                theme={theme}
                className="whitespace-nowrap"
              />
            )
          )}

          <div className={`flex px-3 mt-4 ${isOpen ? "justify-start" : "justify-center"}`}>
            <Link href="/perfil" aria-label="Ir para o perfil">
              <Avatar
                className={`${isOpen ? "w-[60px] h-[60px]" : "w-[60px] h-[60px]"} cursor-pointer border-none ${theme === "dark" ? "border-gray-600" : "border-gray-200"
                  }`}
              >
                <AvatarImage
                  src={user?.fotoPerfil ? user.fotoPerfil : undefined}
                  alt={user?.nome || "Usuário"}
                  className="object-cover"
                />
                <AvatarFallback
                  className={`text-sm font-semibold ${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
                    }`}
                >
                  {getUserInitials(user?.nome)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </aside>

      {/* Sidebar mobile (overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 pt-14 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            className={`fixed top-0 h-full left-0 w-[300px] flex flex-col ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#0F172A]"
              } pt-7 z-50`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 px-5">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/icons/Logo-blue-600-w2.svg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h2 className="text-[20px] md:text-[24px] font-bold">Mindtracking</h2>
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu" className="cursor-pointer mt-1">
                <Image
                  src="/images/icons/plus-circle.svg"
                  alt="Menu"
                  width={32}
                  height={32}
                  className="w-8 h-8 md:w-10 md:h-10"
                />
              </button>
            </div>

            <nav className="flex flex-col gap-1 mt-4 text-[17px] md:text-[22px]">
              {menuItems.map((item, idx) => (
                <SidebarItem
                  key={idx}
                  href={item.href}
                  icon={item.icon}
                  label={item.title}
                  isOpen={true}
                  theme={theme}
                  className="whitespace-nowrap"
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-auto mb-10 flex flex-col">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${theme === "dark" ? "text-gray-100 hover:bg-gray-700" : "text-[#0F172A] hover:bg-gray-100"
                  }`}
              >
                {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                <span
                  className={`font-semibold text-[17px] md:text-[22px] whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                >
                  {theme === "dark" ? "Modo claro" : "Modo escuro"}
                </span>
              </button>

              <div className="mt-0">
                {bottomItems.map((item, idx) =>
                  item.isLogout ? (
                    <button
                      key={idx}
                      onClick={() => {
                        handleLogoutClick();
                        setMobileOpen(false);
                      }}
                      className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer
                        ${theme === "dark" ? "text-gray-100 hover:bg-gray-700" : "text-[#0F172A] hover:bg-gray-100"}`}
                    >
                      <span className="shrink-0 w-[80px] h-[80px] flex items-center justify-center">{item.icon}</span>
                      <span
                        className={`font-semibold text-[17px] md:text-[22px] whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  ) : (
                    <SidebarItem
                      key={idx}
                      label={item.title}
                      href={item.href!}
                      icon={item.icon}
                      isOpen={true}
                      theme={theme}
                      className="whitespace-nowrap"
                      onClick={() => setMobileOpen(false)}
                    />
                  )
                )}
              </div>

              <div className="flex px-5 mt-4 justify-start">
                <Link href="/perfil" aria-label="Ir para o perfil">
                  <Avatar
                    className={`w-14 h-14 md:w-16 md:h-16 cursor-pointer border-2 ${theme === "dark" ? "border-gray-600" : "border-gray-200"
                      }`}
                  >
                    <AvatarImage src={user?.fotoPerfil || undefined} alt={user?.nome || "Usuário"} />
                    <AvatarFallback
                      className={`text-sm md:text-base font-semibold ${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
                        }`}
                    >
                      {getUserInitials(user?.nome)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onLogout={handleLogoutConfirm}
      />
    </>
  );
}
