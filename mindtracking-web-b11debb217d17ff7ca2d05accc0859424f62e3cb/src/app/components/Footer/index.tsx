"use client";

import { useTheme } from "../ThemeProvider";

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <>
      {/* Wrapper só adiciona padding no desktop, quando o footer é fixo */}
      <div className="pb-0 lg:pb-[250px]">
        {/* aqui fica o conteúdo da página inteira */}
      </div>

      <footer
        className={`bottom-0 left-0 w-full border-t-2 border-blue-600 transition-colors duration-500 z-50
        relative lg:fixed  /* ✅ só fixa no desktop */
        ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        <div className="max-w-screen-xl mx-auto flex flex-col px-6 sm:px-12 md:px-[150px] py-[50px]">

          {/* Logo + título */}
          <div className="flex items-center gap-3 mb-10 md:mb-5">
            <img
              src={darkMode ? "/images/icons/Logo.svg" : "/images/icons/Logo.svg"}
              alt="Logo MindTracking"
              className="h-10 w-10 object-contain dark:invert"
            />
            <h1 className="font-bold text-[28px]">MindTracking</h1>
          </div>

          {/* Conteúdo principal */}
          <div className="flex flex-col h-full md:grid md:grid-cols-2 lg:flex lg:flex-row w-full gap-6 mb-6 md:mb-0">

            {/* Explore */}
            <div className="flex flex-col space-y-4 w-full sm:w-full lg:w-[20%] md:w-full">
              <h2 className="font-semibold text-xl">Explore</h2>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-blue-600">Home</a></li>
                <li><a href="#" className="text-sm hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="text-sm hover:text-blue-600">Questões</a></li>
              </ul>
            </div>

            {/* Contato */}
            <div className="flex flex-col space-y-4 w-full sm:w-full md:w-full lg:w-1/4">
              <h2 className="font-semibold text-xl">Entre em Contato</h2>
              <ul className="space-y-2">
                <li className="text-sm whitespace-nowrap">
                  whatsapp: <span>[11] 9 4996-3686</span>
                </li>
                <li className="text-sm whitespace-nowrap">
                  email: <span>suporte.mindtracking@gmail.com</span>
                </li>
              </ul>
              <div className="flex flex-col space-y-5 mt-2">
                <h2 className="font-semibold text-lg whitespace-nowrap md:font-normal">
                  Nossas Redes & Comunidades
                </h2>
                <div className="flex space-x-18 md:pl-0 md:space-x-22 lg:space-x-18">
                  <a href="#" className="w-9 h-9 md:w-6 md:h-6 lg:w-9 lg:h-9">
                    <img
                      src={darkMode ? "/images/icons/facebook.svg" : "/images/icons/facebook_p.svg"}
                      alt="Facebook"
                      className="w-full h-full object-contain"
                    />
                  </a>
                  <a href="#" className="w-9 h-9 md:w-6 md:h-6 lg:w-9 lg:h-9">
                    <img
                      src={darkMode ? "/images/icons/instagram.svg" : "/images/icons/instagram_p.svg"}
                      alt="Instagram"
                      className="w-full h-full object-contain"
                    />
                  </a>
                  <a href="#" className="w-9 h-9 md:w-6 md:h-6 lg:w-9 lg:h-9">
                    <img
                      src={darkMode ? "/images/icons/x.svg" : "/images/icons/x_p.svg"}
                      alt="X"
                      className="w-full h-full object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Athena + Texto + Botão */}
            <div
              className="
                flex flex-col 
                sm:flex-col    
                md:grid md:grid-cols-2 md:col-span-2
                items-start    
                md:items-center
                justify-center 
                w-full sm:w-full md:w-full lg:w-1/2
                sm:gap-8 sm:pt-8 md:gap-2 md:pt-0 lg:gap-6
              "
            >
              {/* Athena */}
              <div
                className="
                  hidden sm:hidden md:flex
                  justify-start
                  md:ml-0 lg:ml-0
                "
              >
                <img
                  src="/images/athena4.png"
                  alt="Athena"
                  className="
                    object-contain
                    md:w-[12rem] md:-mt-14 md:-ml-12
                    lg:w-[26rem] lg:-mt-15 lg:ml-0 lg:mr-8
                  "
                />
              </div>

              {/* Texto + botão */}
              <div
                className="
                  flex flex-col items-start space-y-4 max-w-[400px] text-left
                  md:ml-auto md:pr-0 md:items-start md:-mt-20
                  lg:-ml-12 lg:-mt-18
                "
              >
                <h2 className="text-2xl leading-snug font-semibold md:text-[18px] md:w-[280px] lg:text-2xl lg:w-auto">
                  Pronto para conhecer seu espaço emocional?
                </h2>
                <a
                  href="#"
                  className="bg-blue-600 text-white px-12 py-2.5 rounded-full font-semibold text-base hover:bg-blue-500 sm:w-full md:w-auto text-center"
                >
                  Comece Agora
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            className="
              text-xs text-gray-500 dark:text-gray-400 w-full
              text-left md:text-right lg:text-left
              mt-0 md:-mt-1 lg:mt-0
              md:pr-0 lg:pr-0
            "
          >
            <p>© 2025. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
