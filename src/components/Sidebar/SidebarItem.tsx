"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface SidebarItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  theme: "dark" | "light";
  className?: string;
  onClick?: () => void;
}

export function SidebarItem({ href, icon, label, isOpen, theme, className, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors
        ${isOpen ? "justify-start" : "justify-center"}
        ${theme === "dark" ? "text-gray-100 hover:bg-gray-700" : "text-[#0F172A] hover:bg-gray-100"}`}
    >
      <span className="shrink-0 w-6 h-6 flex items-center justify-center">
        {icon}
      </span>
      {isOpen && (
        <span className={`font-semibold text-[17px] lg:text-[22px] ${className ?? ""} ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {label}
        </span>
      )}
    </Link>
  );
}
