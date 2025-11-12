"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "@/lib/api/auth";
import { setAuthToken } from "@/lib/api/axios";

export interface UserData {
  id?: number | string;
  nome?: string;
  email?: string;
  data_nascimento?: string | null;
  idade?: number | null;
  telefone?: string | null;
  genero?: string | null;
  fotoPerfil?: string | null; // Padronize com camelCase para usar no app
}

type AuthContextType = {
  token: string | null;
  user: UserData | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  updateUserData: (newData: Partial<UserData>) => void;
  getUserInitials: (name?: string) => string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para normalizar e carregar dados do usuário do backend
  const fetchUserData = async () => {
    try {
      const response = await authService.dadosUser();
      console.log("Dados recebidos do backend:", response);

      const isRecord = (val: unknown): val is Record<string, unknown> =>
        typeof val === "object" && val !== null;

      const pickString = (
        obj: Record<string, unknown>,
        key: string,
      ): string | undefined => {
        const v = obj[key];
        return typeof v === "string" ? v : undefined;
      };

      const raw = response && isRecord(response.user) ? response.user : null;

      if (!raw) {
        setUser(null);
        return;
      }

      // Normaliza o campo da foto para "fotoPerfil" no contexto
      const fotoPerfilCandidate =
        pickString(raw, "foto_perfil_url") || // Vem do backend
        pickString(raw, "fotoPerfil") ||     // Possível campo alternativo
        pickString(raw, "foto_perfil") ||
        pickString(raw, "fotoPerfilUrl") ||
        null;

      const normalized: UserData = {
        id:
          (raw["id"] as number | string | undefined) ??
          (raw["user_id"] as number | string | undefined) ??
          (raw["usuario_id"] as number | string | undefined),
        nome: pickString(raw, "nome"),
        email: pickString(raw, "email"),
        data_nascimento: pickString(raw, "data_nascimento") ?? null,
        idade: typeof raw["idade"] === "number" ? (raw["idade"] as number) : null,
        telefone: pickString(raw, "telefone") ?? null,
        genero: pickString(raw, "genero") ?? null,
        fotoPerfil: fotoPerfilCandidate, // Campo padronizado
      };

      console.log("Valor final para fotoPerfil:", fotoPerfilCandidate);

      setUser(normalized); // Atualiza o estado com o objeto padronizado
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
      setUser(null);
    }
  };

  // Atualiza parte do usuário (exemplo: troca da foto) mantendo o restante
  const updateUserData = (newData: Partial<UserData>) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : null));
  };

  // Função para obter as iniciais do nome (fallback para o avatar)
  const getUserInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase();
    const second = parts.length > 1 ? parts[1]?.charAt(0).toUpperCase() : "";
    return `${first}${second}`;
  };

  useEffect(() => {
    // Restaura o token no carregamento e busca dados do usuário
    const t = typeof window !== "undefined" ? localStorage.getItem("mt_token") : null;
    if (t) {
      setToken(t);
      setAuthToken(t);
      fetchUserData(); // Busca e normaliza dados do usuário no carregamento
    }
    setLoading(false);
  }, []);

  // Login chama fetchUserData para garantir dados padronizados atualizados
  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, senha);
      const t = res.token;
      localStorage.setItem("mt_token", t);
      setAuthToken(t);
      setToken(t);
      // IMPORTANTE: chama somente fetchUserData para normalizar dados, não setUser direto
      await fetchUserData();
    } finally {
      setLoading(false);
    }
  };

  // Logout e limpeza de estados
  const logout = () => {
    localStorage.removeItem("mt_token");
    setAuthToken(null);
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        fetchUserData,
        updateUserData,
        getUserInitials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
