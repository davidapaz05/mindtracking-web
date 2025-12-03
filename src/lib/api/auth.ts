// src/lib/api/auth.ts
import api from "./axios";

type User = {
  email_verificado?: boolean;
  emailVerified?: boolean;
  questionario_inicial?: boolean;
  questionarioInicial?: boolean;
};

export type LoginResponse = {
  token: string;
  user?: User | string | User[];
  email_verificado?: boolean;
  emailVerified?: boolean;
  questionario_inicial?: boolean;
  questionarioInicial?: boolean;
};

export const login = async (email: string, senha: string) => {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    senha,
  });
  return data;
};

export const register = async (payload: {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  data_nascimento: string;
  genero: string;
  telefone: string;
}) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const verifyEmail = async (payload: {
  email: string;
  codigo: string;
}) => {
  const { data } = await api.post("/auth/verify-email", payload);
  return data;
};

export const recuperarSenha = async (payload: { email: string }) => {
  const { data } = await api.post("/auth/recuperar-senha", payload);
  return data;
};

export const verificarCodigo = async (payload: {
  email: string;
  codigo: string;
}) => {
  const { data } = await api.post("/auth/verificar-codigo", payload);
  return data;
};

export const redefinirSenha = async (payload: {
  email: string;
  senha: string;
  confirmarSenha: string;
}) => {
  const { data } = await api.post("/auth/redefinir-senha", payload);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete("/auth/delete-account");
  return data;
};

export const dadosUser = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

export const updateDadosUser = async (payload: {
  nome: string;
  telefone: string;
  data_nascimento: string;
  genero: string;
}) => {
  const { data } = await api.put("/auth/profile", payload);
  return data;
};

// Exporta PDF do perfil do usuário via GET em `export/pdf/:id`
export const exportPerfilPdf = async (id: string | number) => {
  const response = await api.get(`/export/pdf/${id}` as const, {
    responseType: "blob",
  });
  return response.data as Blob;
};
