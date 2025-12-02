// src/lib/api/axios.ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper para setar/remover Authorization header
export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ao carregar no client, tenta reaplicar token salvo
if (typeof window !== "undefined") {
  const token = localStorage.getItem("mt_token");
  if (token) setAuthToken(token);
}

// interceptor para tratar 401 (ex.: token expirado)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (typeof window !== "undefined" && status === 401) {
      // limpeza local simples; você pode personalizar (ex.: refresh token)
      localStorage.removeItem("mt_token");
      setAuthToken(null);
      // redireciona para home (que tem o modal de login)
      // só redireciona se não estiver já na home
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
