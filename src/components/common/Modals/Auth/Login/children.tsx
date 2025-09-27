import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi } from "@/lib/api/auth";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import IconInput from "@/components/common/Inputs/InputEmail";
import PasswordInput from "@/components/common/Inputs/InputSenha";
import Button from "@/components/common/Buttons";
import { validateEmail } from "@/lib/validation";

export default function Login() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const error = validateEmail(value);
    setEmailError(error);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value.length === 0 ? "Senha obrigatória" : null);
  };

  // Função para validar se o formulário está completo e válido
  const isFormValid = () => {
    return (
      email.trim() !== "" &&
      password.trim() !== "" &&
      !emailError &&
      !passwordError
    );
  };

  const handleLoginClick = async () => {
    setApiError(null);
    // Validações finais antes de enviar
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }
    if (!password) {
      setPasswordError("Senha obrigatória");
      return;
    }
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      // Armazena token e user
      localStorage.setItem("mt_token", res.token);
      sessionStorage.setItem("mt_token", res.token);
      if (res.user) {
        localStorage.setItem("mt_user", JSON.stringify(res.user));
        sessionStorage.setItem("mt_user", JSON.stringify(res.user));
      }
      // Redireciona conforme questionario_inicial
      if (res.user && typeof res.user === "object" && "questionario_inicial" in res.user) {
        if ((res.user as any).questionario_inicial === false) {
          router.push("/Questionnaire");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-between w-full md:w-[28.125em] gap-4">
        {apiError && (
          <div className="w-full text-center text-red-500 text-sm mb-2">{apiError}</div>
        )}
        <Image
          src={
            theme === "dark"
              ? "../images/icons/Logo_branca.svg"
              : "../images/icons/Logo-slate-900.svg"
          }
          alt="logo"
          width={64}
          height={64}
        />
        <div className="flex flex-col items-center justify-between w-full gap-2">
          <h1 className="text-center text-2xl md:text-3xl font-bold leading-snug">
            Bem-vindo de volta
          </h1>
          <h2 className="text-center text-base md:text-lg leading-snug">
            Seu bem-estar importa todos os dias
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          <IconInput
            width="w-full"
            type="email"
            id="forgot-email"
            name="email"
            label="Email"
            icon={
              theme === "dark"
                ? "../images/icons/UsuarioEmail.svg"
                : "../images/icons/UsuarioEmail-black.svg"
            }
            iconClassName="w-6.5 h-auto"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            required
          />

          <PasswordInput
            width="w-full"
            type="password"
            id="forgot-password"
            name="password"
            label="Senha"
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            required
          />
        </div>
        <div className="flex w-full max-w-72 md:max-w-full justify-end">
          <Link
            className={`text-right text-sm md:text-base font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
            href={"/auth/forgot-password"} // Corrigi o link para a página de recuperação de senha
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <div className="w-full flex flex-col items-center">
          <Button
            text="Entrar"
            widthClass="w-full"
            type="button"
            onClick={handleLoginClick}
            disabled={!isFormValid()} // Botão desabilitado se o formulário não for válido
            loading={loading} // Mostra estado de carregamento
          />
        </div>
      </div>
    </div>
  );
}