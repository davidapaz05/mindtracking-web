"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
  fotoPerfil?: string | null;
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
  syncAuthState: (token: string | null, rawUser?: unknown) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isRecord = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object" && val !== null && !Array.isArray(val);

const pickString = (
  obj: Record<string, unknown>,
  key: string,
): string | undefined => {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
};

const normalizeUserRecord = (raw: Record<string, unknown>): UserData => {
  const fotoPerfilCandidate =
    pickString(raw, "foto_perfil_url") ||
    pickString(raw, "fotoPerfil") ||
    pickString(raw, "foto_perfil") ||
    pickString(raw, "fotoPerfilUrl") ||
    null;

  return {
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
    fotoPerfil: fotoPerfilCandidate,
  };
};

const mergeStoragePayload = (
  raw: Record<string, unknown>,
  normalized: UserData,
) => ({
  ...raw,
  ...normalized,
  fotoPerfil: normalized.fotoPerfil,
});

const normalizeUserFromUnknown = (
  value: unknown,
): { normalized: UserData; storagePayload: Record<string, unknown> } | null => {
  if (!value) return null;

  if (Array.isArray(value)) {
    const firstRecord = value.find(isRecord);
    if (!firstRecord) return null;
    const normalized = normalizeUserRecord(firstRecord);
    return {
      normalized,
      storagePayload: mergeStoragePayload(firstRecord, normalized),
    };
  }

  if (!isRecord(value)) return null;

  const rawUser =
    "user" in value && isRecord((value as Record<string, unknown>).user)
      ? ((value as Record<string, unknown>).user as Record<string, unknown>)
      : value;

  if (!isRecord(rawUser)) return null;

  const normalized = normalizeUserRecord(rawUser);
  return {
    normalized,
    storagePayload: mergeStoragePayload(rawUser, normalized),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await authService.dadosUser();
      const parsed = normalizeUserFromUnknown(
        isRecord(response) && "user" in response ? response.user : response,
      );

      if (!parsed) {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("mt_user");
        }
        return;
      }

      setUser(parsed.normalized);
      if (typeof window !== "undefined") {
        localStorage.setItem("mt_user", JSON.stringify(parsed.storagePayload));
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("mt_user");
      }
    }
  }, []);

  const syncAuthState = useCallback(
    (newToken: string | null, rawUser?: unknown) => {
      if (newToken) {
        setToken(newToken);
        setAuthToken(newToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("mt_token", newToken);
        }
      } else {
        setToken(null);
        setAuthToken(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("mt_token");
        }
      }

      if (rawUser === undefined) {
        return;
      }

      if (rawUser === null) {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("mt_user");
        }
        return;
      }

      const parsed = normalizeUserFromUnknown(rawUser);
      if (!parsed) {
        console.warn(
          "syncAuthState: não foi possível normalizar os dados do usuário recebidos.",
        );
        return;
      }

      setUser(parsed.normalized);
      if (typeof window !== "undefined") {
        localStorage.setItem("mt_user", JSON.stringify(parsed.storagePayload));
      }
    },
    [],
  );

  const updateUserData = (newData: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) {
        return prev;
      }

      const updated = { ...prev, ...newData };

      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("mt_user");
          if (stored) {
            const parsedStored = JSON.parse(stored);
            if (isRecord(parsedStored)) {
              const merged = { ...parsedStored, ...newData };
              localStorage.setItem("mt_user", JSON.stringify(merged));
            }
          } else {
            localStorage.setItem("mt_user", JSON.stringify(updated));
          }
        } catch (error) {
          console.error("Erro ao atualizar mt_user no localStorage:", error);
        }
      }

      return updated;
    });
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase();
    const second = parts.length > 1 ? parts[1]?.charAt(0).toUpperCase() : "";
    return `${first}${second}`;
  };

  useEffect(() => {
    let isMounted = true;

    const restoreFromStorage = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      try {
        const storedToken = localStorage.getItem("mt_token");
        const storedUser = localStorage.getItem("mt_user");

        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
        }

        if (storedUser) {
          try {
            const parsedStored = JSON.parse(storedUser);
            const normalized = normalizeUserFromUnknown(parsedStored);
            if (normalized) {
              setUser(normalized.normalized);
            }
          } catch (error) {
            console.error("Erro ao parsear mt_user do localStorage:", error);
          }
        }

        if (storedToken) {
          await fetchUserData();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void restoreFromStorage();

    return () => {
      isMounted = false;
    };
  }, [fetchUserData]);

  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, senha);
      const t = res.token ?? null;
      syncAuthState(t, res.user);
      if (t) {
        await fetchUserData();
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    syncAuthState(null, null);
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
        syncAuthState,
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
