"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar onToggle={setSidebarOpen} />
        <main className={`flex-1 transition-all duration-400`}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
