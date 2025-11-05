"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {

  // Exemplo estático para simular o estado de autenticação do usuário
  // Em uma aplicação real, você pode obter isso de um contexto de autenticação ou similar
  const userLogado = true; 

  // A imagem de fundo e a camada escura são comuns a ambos os casos
  const backgroundStyle = {
    backgroundImage: "url('/images/fundo-not-found.png')",
  };

  return (
    <div
      className="relative flex flex-col lg:flex-row items-center justify-center gap-10 h-screen bg-cover bg-center text-white px-6 md:px-12 lg:px-16 py-8"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-black opacity-55"></div>

      {userLogado ? (
        // Conteúdo para usuário AUTENTICADO
        <>
          <div className="relative z-10 mb-4 sm:mb-6 md:mb-6 lg:mb-12">
            <Image
              src="/images/M9_33.svg" // Imagem para autenticado
              alt="Athena com prancheta"
              width={300}
              height={300}
              className="sm:w-[280px] sm:h-[280px] md:w-[360px] md:h-[360px] lg:w-[300px] lg:h-[300px]"
            />
          </div>
          <div className="relative z-10 text-center md:w-[650px] lg:w-[720px] lg:text-left max-w-full">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-4xl font-bold mb-5">
              Você se perdeu na jornada!
            </h2>
            <p className="text-sm sm:text-[16px] md:text-[28px] lg:text-[22px] mb-8 !leading-relaxed max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-2xl mx-auto lg:mx-0">
              A conexão com esta página foi perdida, mas nossa jornada juntos
              continua. Vamos nos reconectar ao seu espaço.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 sm:px-8 md:px-12 py-3 md:py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 text-sm sm:text-base md:text-xl lg:text-base lg:px-6 lg:py-2"
            >
              Acessar meu DashBoard
            </Link>
          </div>
        </>
      ) : (
        // Conteúdo para usuário NÃO AUTENTICADO
        <>
          <div className="relative z-10 mb-4 sm:mb-6 md:mb-6 lg:mb-12">
            <Image
              src="/images/M9_33.svg" // Imagem para não autenticado
              alt="Athena apontando para o lado"
              width={300}
              height={300}
              className="sm:w-[280px] sm:h-[280px] md:w-[360px] md:h-[360px] lg:w-[300px] lg:h-[300px]"
            />
          </div>
          <div className="relative z-10 text-center md:w-[650px] lg:w-[720px] lg:text-left max-w-full">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-4xl font-bold mb-5">
              Você se perdeu na jornada!
            </h2>
            <p className="text-sm sm:text-[16px] md:text-[28px] lg:text-[22px] mb-8 !leading-relaxed max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-2xl mx-auto lg:mx-0">
              Oops! Parece que esta página se perdeu nos pensamentos. Não se
              preocupe, estou aqui para te guiar de volta.
            </p>
            <Link
              href="/"
              className="inline-block px-6 sm:px-8 md:px-12 py-3 md:py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 text-sm sm:text-base md:text-xl lg:text-base lg:px-6 lg:py-2"
            >
              Voltar para o Início
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
