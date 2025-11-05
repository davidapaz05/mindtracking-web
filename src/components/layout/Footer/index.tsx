"use client";

import { useTheme } from "../../../contexts/ThemeContext";
import Image from "next/image";

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer
      className={`w-full border-t-2 border-blue-600 transition-colors duration-500
        ${darkMode ? "text-white" : "text-gray-900"}`}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col px-6 sm:px-12 md:px-[150px] py-[50px]">

        {/* Logo + título */}
        <div className="flex items-center gap-3 mb-10 md:mb-5">
          <Image
            src="/images/icons/Logo.svg"
            alt="Logo MindTracking"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <h1 className="font-bold text-[28px]">MindTracking</h1>
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-col h-full md:grid md:grid-cols-3 lg:flex lg:flex-row w-full gap-6 mb-6 md:mb-0">

          {/* Explore */}
          <div className="flex flex-col space-y-4 w-full sm:w-full md:w-full lg:w-1/4">
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
                Whatsapp:{" "}
                <a
                  href="https://wa.me/5511949963686?text=Olá!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  (11) 9 4996-3686
                </a>
              </li>
              <li className="text-sm whitespace-nowrap">
                Email:{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=suporte.mindtracking@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  suporte.mindtracking@gmail.com
                </a>
              </li>
            </ul>

            {/* Redes sociais */}
            <div className="flex flex-col space-y-5 mt-2">
              <h2 className="font-semibold text-lg whitespace-nowrap  lg:font-semibold md:font-semibold">
                Nossas Redes & Comunidades
              </h2>
              <div className="flex space-x-10 md:space-x-[32px] lg:space-x-[72px]">
                <a
                  href="https://www.facebook.com/share/p/1BLJcL6khd/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
                >
                  <Image
                    src={darkMode ? "/images/icons/facebook.svg" : "/images/icons/facebook_p.svg"}
                    alt="Facebook"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </a>

                <a
                  href="https://www.instagram.com/mindtracking_?igsh=ajQydWNpdzl4eWp2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
                >
                  <Image
                    src={darkMode ? "/images/icons/instagram.svg" : "/images/icons/instagram_p.svg"}
                    alt="Instagram"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </a>

                <a
                  href="https://x.com/MindTracking_?t=e4Tj2-xCCBQb36S2i-IbQw&s=08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
                >
                  <Image
                    src={darkMode ? "/images/icons/x.svg" : "/images/icons/x_p.svg"}
                    alt="X / Twitter"
                    width={36}
                    height={36}
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
            <div
              className="
                hidden sm:hidden md:flex
                justify-start
                md:ml-0 lg:ml-0
              "
            >
            <Image
              src="/images/athena4.png"
              alt="Athena"
              width={416}
              height={416}
              className=" 
                object-contain
                md:w-[16rem] md:-mt-16 md:-ml-10
                lg:w-[26rem] lg:-mt-14 lg:ml-0 lg:mr-8
                h-auto
              "
              priority
            />

            </div>

            <div
              className="
                flex flex-col items-start space-y-4 max-w-[400px] text-left
                md:ml-auto md:pr-0 md:items-start md:-mt-20 
                lg:-ml-12 lg:-mt-16
              "
            >
              <h2 className="text-2xl leading-snug font-semibold md:text-[18px] md:w-[280px] lg:w-auto md:ml-2 lg:text-[22px] md:mt-6">
                Pronto para conhecer seu<br className="md:hidden"/> espaço emocional?
              </h2>
              <a
                href="#"
                className="bg-blue-600 text-white px-12 py-2.5 rounded-full font-semibold text-base hover:bg-blue-500 sm:w-full md:w-auto text-center md:ml-2"
              >
                Comece Agora
              </a>
            </div>
          </div>
        </div>

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
  );
}