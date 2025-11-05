import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { register as registerApi, login as loginApi } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/api/axios";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import IconInput from "@/components/common/Inputs/InputEmail";
import PasswordInput from "@/components/common/Inputs/InputSenha";
import Button from "@/components/common/Buttons";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, Phone } from "lucide-react";
import GenderSelect from "@/components/common/Inputs/InputGenero";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateBirthdate,
  validatePhone,
  validateGender,
} from "@/lib/validation";

export default function Register() {
  const { theme } = useTheme();
  const [displayedText, setDisplayedText] = useState("");
  const [isRegisterView, setIsRegisterView] = useState(true);
  const [currentText, setCurrentText] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados do formulário 1
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Estados do formulário 2
  const [birthdate, setBirthdate] = useState("");
  const [birthdateError, setBirthdateError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState<string | null>(null);

  // Validação do formulário 1
  const isFormOneValid = () => {
    return (
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      !emailError &&
      !passwordError
    );
  };

  // Validação do formulário 2
  const isFormTwoValid = () => {
    return (
      name.trim() !== "" &&
      birthdate.trim() !== "" &&
      phone.trim() !== "" &&
      gender.trim() !== "" &&
      !nameError &&
      !birthdateError &&
      !phoneError &&
      !genderError
    );
  };

  // Validação E-mail
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  // Validação Senha
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value, confirmPassword));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordError(validatePassword(password, value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const onlyNums = rawValue.replace(/[^\d]/g, "");

    let formattedDate = onlyNums;
    if (onlyNums.length > 2) {
      formattedDate = `${onlyNums.slice(0, 2)}/${onlyNums.slice(2)}`;
    }
    if (onlyNums.length > 4) {
      formattedDate = `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}/${onlyNums.slice(4, 8)}`;
    }

    setBirthdate(formattedDate);
    setBirthdateError(validateBirthdate(formattedDate));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const onlyNums = rawValue.replace(/[^\d]/g, "");
    const limitedNums = onlyNums.slice(0, 11);

    let formattedPhone = limitedNums;
    if (limitedNums.length > 2) {
      formattedPhone = `(${limitedNums.slice(0, 2)}) ${limitedNums.slice(2)}`;
    }
    if (limitedNums.length > 6 && limitedNums.length === 11) {
      formattedPhone = `(${limitedNums.slice(0, 2)}) ${limitedNums.slice(2, 7)}-${limitedNums.slice(7)}`;
    } else if (limitedNums.length > 6) {
      formattedPhone = `(${limitedNums.slice(0, 2)}) ${limitedNums.slice(2, 6)}-${limitedNums.slice(6)}`;
    }

    setPhone(formattedPhone);
    setPhoneError(validatePhone(formattedPhone));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    setGenderError(validateGender(value));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement | HTMLFormElement>,
  ) => {
    if (e.key === "Enter") {
      if (isRegisterView && isFormOneValid()) {
        handleRegisterClick();
      } else if (!isRegisterView && isFormTwoValid()) {
        handleRegisterClick();
      }
    }
  };

  const [apiError, setApiError] = useState<string | null>(null);
  const [showVerify, setShowVerify] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const VerifyEmailModal = dynamic(() => import("@/components/features/Auth/Register/ModalCode"), { ssr: false });

  const handleRegisterClick = async () => {
    setApiError(null);
    if (isRegisterView) {
      // Validação do formulário 1
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password, confirmPassword);
      if (emailValidation) {
        setEmailError(emailValidation);
        return;
      }
      if (passwordValidation) {
        setPasswordError(passwordValidation);
        return;
      }
      toggleView();
    } else {
      // Validação completa do formulário 2
      const nameValidation = validateName(name);
      const birthdateValidation = validateBirthdate(birthdate);
      const phoneValidation = validatePhone(phone);
      const genderValidation = validateGender(gender);
      setNameError(nameValidation);
      setBirthdateError(birthdateValidation);
      setPhoneError(phoneValidation);
      setGenderError(genderValidation);
      if (
        nameValidation ||
        birthdateValidation ||
        phoneValidation ||
        genderValidation
      ) {
        return;
      }
      setLoading(true);
      try {
        // Monta o body conforme solicitado
        const payload = {
          nome: name,
          email,
          senha: password,
          confirmarSenha: confirmPassword,
          data_nascimento: birthdate.split("/").reverse().join("-"), // dd/mm/yyyy -> yyyy-mm-dd
          genero: gender,
          telefone: phone,
        };
        await registerApi(payload);
        setRegisteredEmail(email);
        setShowVerify(true);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        const apiErrorMessage = (
          error as { response?: { data?: { message?: string } } }
        )?.response?.data?.message;
        setApiError(
          apiErrorMessage ||
            errorMessage ||
            "Erro ao registrar. Tente novamente.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleView = () => {
    setIsRegisterView(!isRegisterView);
  };

  const fullTextForRegister =
    "Bem-vindo à MindTracking! Eu sou a Athena, sua assistente emocional. Estou aqui pra te ajudar a entender melhor seus sentimentos e serei sua parceira nessa jornada de autoconhecimento. Preciso te conhecer um pouco para te cadastrar nesta jornada.";
  const fullTextForRegisterTwo =
    "Pra começarmos do jeitinho certo, me conta seu nome e quando você nasceu. Assim, posso te conhecer melhor e deixar tudo mais personalizado por aqui.";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullTextForRegister.length) {
        setDisplayedText(fullTextForRegister.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [isRegisterView]);

  useEffect(() => {
    let i = 0;
    const typingText = setInterval(() => {
      if (i < fullTextForRegisterTwo.length) {
        setCurrentText(fullTextForRegisterTwo.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingText);
      }
    }, 30);

    return () => clearInterval(typingText);
  }, [isRegisterView]);

  const router = useRouter();
  if (showVerify) {
    return (
      <VerifyEmailModal
        email={registeredEmail}
        isOpen={true}
        onClose={() => setShowVerify(false)}
        onSuccess={async () => {
          // Após verificar o e-mail com sucesso, faz login para obter JWT e dados do usuário
          try {
            const res = await loginApi(email, password);
            const token = res.token;
            if (token) {
              localStorage.setItem("mt_token", token);
              sessionStorage.setItem("mt_token", token);
              setAuthToken(token);
            }
            if (res.user) {
              localStorage.setItem("mt_user", JSON.stringify(res.user));
              sessionStorage.setItem("mt_user", JSON.stringify(res.user));
            }
          } catch {
            // Se falhar o login automático, segue para questionário mesmo assim
          }
          router.push("/questionnaire");
        }}
      />
    );
  }
  return (
    <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start lg:justify-between px-5">

      {isRegisterView ? (
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`hidden lg:flex absolute left-[15em] w-[16em] max-w-[420px] p-4 ml-6 rounded-lg shadow-md ${theme === "dark" ? "bg-slate-700 text-white" : "bg-white text-slate-900"} border ${theme === "dark" ? "border-slate-600" : "border-slate-200"}`}
                style={{
                  borderRadius: "16px 16px 16px 0",
                  zIndex: 20,
                }}
              >
                <p className="text-sm font-medium">{displayedText}</p>
              </motion.div>
          <div className="hidden lg:flex flex-col items-center mt-8 relative">
            <div className="flex items-start">
              <Image
                className=""
                src="/images/athena-apontando-direito.png"
                alt="Athena apontando para a direita"
                width={190}
                height={190}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center my-auto w-full max-w-[28.125em] gap-2">
            <div className="flex flex-col items-center justify-center my-auto w-full max-w-[28.125em] gap-2">
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
                  Vamos começar!
                </h1>
                <h2 className="text-center md:mb-4 mb-0 text-base w-64 md:w-full md:text-lg leading-snug">
                  Sua jornada rumo ao equilíbrio emocional começa aqui
                </h2>
              </div>
              <form className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  error={passwordError}
                  required
                />

                <PasswordInput
                  width="w-full"
                  type="password"
                  id="forgot-confirm-password"
                  name="confirmPassword"
                  label="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  error={passwordError}
                  required
                />
              </form>

              <div className="w-full mt-2 md:mt-0 flex flex-col items-center">
                <Button
                  text="Prosseguir para próxima etapa"
                  widthClass="md:w-full"
                  type="button"
                  onClick={handleRegisterClick}
                  disabled={!isFormOneValid()}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
          <div className="hidden md:flex absolute md:top-[1em] md:left-[0.745em] ">
            <button className="cursor-pointer" onClick={toggleView}>
              <ChevronLeft
                size={48}
                className={`${theme === "dark" ? "text-white" : "text-slate-900"} `}
              />
            </button>
          </div>
          <div className="hidden lg:flex flex-col items-center mt-8 relative">

            <div className="flex items-start">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`hidden lg:flex absolute left-[12em] top-[-2em] w-[16em] max-w-[257px] p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-slate-700 text-white" : "bg-white text-slate-900"} border ${theme === "dark" ? "border-slate-600" : "border-slate-200"}`}
                style={{
                  borderRadius: "16px 16px 16px 0",
                  zIndex: 20,
                }}
              >
                <p className="text-sm font-medium">{currentText}</p>
              </motion.div>
              <Image
                className=""
                src="/images/athena-apontando-prancheta.png"
                alt="Athena apontando para a direita"
                width={200}
                height={200}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center my-auto w-full max-w-[28.125em] gap-2">
            <Image
              src={
                theme === "dark"
                  ? "../images/icons/Logo_branca.svg"
                  : "../images/icons/Logo-slate-900.svg"
              }
              alt="logo"
              width={54}
              height={54}
            />
            <div className="flex flex-col items-center justify-between w-full gap-2">
              <h1 className="text-center text-2xl md:text-2xl lg:text-3xl font-bold leading-snug">
                Estamos quase lá...
              </h1>
              <h2 className="text-center text-base w-64 md:w-full md:text-base lg:text-lg leading-snug">
                Precisamos apenas de seu nome e sua data de nascimento para
                completar seu cadastro
              </h2>
            </div>

            <div
              className="flex flex-col gap-3 mt-4"
              onKeyDown={handleKeyDown}
            >
              {" "}
              {/* Reduzi o gap para 3 */}
              <IconInput
                width="w-full"
                type="text"
                id="forgot-name"
                name="name"
                label="Nome"
                icon={
                  theme === "dark"
                    ? "../images/icons/UsuarioEmail.svg"
                    : "../images/icons/UsuarioEmail-black.svg"
                }
                iconClassName="w-6.5 h-auto"
                inputMode="text"
                autoComplete="name"
                maxLength={150}
                value={name}
                onChange={handleNameChange}
                error={nameError}
                required
              />
              <IconInput
                width="w-full"
                type="text"
                id="birthdate"
                name="birthdate"
                label="Data de nascimento"
                placeholder="DD/MM/AAAA"
                icon={
                  <Calendar
                    className={`${theme === "dark" ? "text-slate-50" : "text-gray-800"}`}
                  />
                }
                iconClassName="w-6.5 h-auto"
                inputMode="numeric"
                maxLength={10}
                required
                value={birthdate}
                onChange={handleDateChange}
                error={birthdateError}
              />
              <IconInput
                width="w-full"
                type="text"
                id="phone"
                name="phone"
                label="Telefone"
                placeholder="(XX) XXXXX-XXXX"
                icon={
                  <Phone
                    className={`${theme === "dark" ? "text-slate-50" : "text-gray-800"}`}
                  />
                }
                iconClassName="w-6.5 h-auto"
                inputMode="tel"
                maxLength={15}
                required
                value={phone}
                onChange={handlePhoneChange}
                error={phoneError}
              />
              <GenderSelect onChange={handleGenderChange} error={genderError} />
              {apiError && (
                <div className="w-full text-center text-red-500 text-sm mb-2">{apiError}</div>
              )}
            </div>


            <div className="w-full mt-3 md:mt-0 flex flex-col items-center">
              <Button
                text="Criar minha conta"
                widthClass="w-[20em] md:w-full"
                type="button"
                onClick={handleRegisterClick}
                disabled={!isFormTwoValid()}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
