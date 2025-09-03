import { useState } from "react";
import Image from "next/image";
import InputField from "./input/index"; // <- importa seu componente

type LoginModalProps = {
  onClose?: () => void;
  onOpenModal2?: () => void;
};

export default function LoginModal({ onClose, onOpenModal2 }: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleOpenModal2 = () => {
    setIsOpen(false);
    if (onClose) onClose();
    if (onOpenModal2) onOpenModal2();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 font-inter">
      <div className="h-170 relative flex w-[min(980px,92%)] max-w-[980px] rounded-[12px] bg-slate-800 border border-[#1f2937] shadow-[0_20px_60px_rgba(2,6,23,0.6)] p-8 md:p-12 overflow-visible font-inter">
        <div className="flex flex-col items-center w-full max-w-[412px] mx-auto px-4 md:px-0 font-inter">
          <div className="w-16 md:w-18 mb-6 font-inter">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={62}
              height={60}
              className="h-auto w-full mx-auto"
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight text-center mb-2 font-inter">
            Bem-vindo de volta
          </h2>
          <p className="text-[1.3125rem] text-white mt-3 text-center mb-8 font-inter">
            Seu bem-estar importa todos os dias
          </p>

          {/* Campo Email */}
          <InputField
            placeholder="Email"
            type="email"
            iconSrc="/images/email.svg"
          />

          {/* Campo Senha */}
          <InputField
            placeholder="Senha"
            type="password"
            iconSrc="/images/password.svg"
            hasTogglePassword
          />

          {/* Esqueceu senha */}
          <div className="w-full text-right my-3 mb-5 font-inter">
            <button className="text-sm text-white cursor-pointer font-bold font-inter">
              Esqueceu sua senha?
            </button>
          </div>

          {/* Botão de Entrar */}
{/* Botão Entrar */}
{/* Botão Entrar */}
<button
  type="submit"
  className="w-full h-11 rounded-[1.5rem] 
             bg-blue-600 text-white font-bold font-inter
             transition-all  ease-in-out
             hover:bg-blue-500
             active:bg-blue-500 active:ring-3 active:ring-inset active:ring-blue-700"
>
  Entrar
</button>

{/* Divisor */}
<div className="flex items-center justify-center w-full my-3 font-inter">
  <div className="flex-grow h-[0.5px] bg-white/20"></div>
  <span className="px-4 text-[16px] md:text-base text-white font-inter">Ou</span>
  <div className="flex-grow h-[0.5px] bg-white/20"></div>
</div>

{/* Botão para abrir modal2 */}
<button
  onClick={handleOpenModal2}
  className="w-full h-11 rounded-[1.5rem] font-bold border border-[#2b3640] text-white 
                           transition-all duration-300 ease-in-out
                           hover:bg-gray-800/30 hover:ring-blue-500 hover:border-blue-400
                           hover:shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]
                           active:scale-[0.98] ring-2 ring-blue-600"
>
  Ainda não tem uma conta?
</button>



        </div>

        {/* Ilustração */}
        <div className="hidden md:block absolute right-4 bottom-0 translate-y-[5%] translate-x-[-10%] pointer-events-none select-none font-inter">
          <Image
            src="/images/athena1.png"
            alt="Doctor illustration"
            width={255}
            height={280}
            className="h-auto w-[180px] md:w-[200px]"
          />
        </div>

        {/* Botão fechar */}
        <button
          className="absolute top-4 right-4 w-13 h-13 rounded-full text-white  flex items-center justify-center z-50 font-inter cursor-pointer"
          aria-label="Fechar"
          onClick={handleClose}
        >
          <Image src="/images/fechar.svg" alt="Fechar" width={80} height={32} />
        </button>
      </div>
    </div>
  );
}
