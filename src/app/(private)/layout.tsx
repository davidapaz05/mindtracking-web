"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const hasRedirectedRef = useRef(false);

  const hasStoredToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("mt_token");
  }, [token]);

  useEffect(() => {
    if (loading) return;

    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("mt_token") : null;

    if (!token && !storedToken) {
      setIsAuthorized(false);
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace("/login");
      }
      return;
    }

    setIsAuthorized(true);
  }, [token, loading, router]);

  if (loading || isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Carregando...
        </span>
      </div>
    );
  }

  if (!isAuthorized && !hasStoredToken) {
    return null;
  }

  const isQuestionnairePage = pathname === "/questionnaire";

  return (
    <div className="min-h-screen">
      {!isQuestionnairePage && <Sidebar />}
      <main
        className={
          isQuestionnairePage
            ? "w-full min-h-screen h-full"
            : "min-h-screen h-full transition-all duration-300"
        }
      >
        {children}
      </main>
    </div>
  );
}