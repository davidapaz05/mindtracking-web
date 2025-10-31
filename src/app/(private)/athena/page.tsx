"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Send } from "lucide-react";
import { sendChat } from "@/lib/api/chat";
import { setAuthToken } from "@/lib/api/axios";

// Formatação segura para texto do Athena
const FormattedText = ({ text }: { text: string }) => {
  const { theme } = useTheme();

  const formatText = (txt: string) => {
    let formatted = txt.replace(/\n\n/g, "</p><p>");
    formatted = formatted.replace(/\n/g, "<br>");
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
    formatted = formatted.replace(/`(.*?)`/g, "<code>$1</code>");
    if (!formatted.includes("<ul>") && !formatted.includes("<ol>")) {
      formatted = `<p>${formatted}</p>`;
    }
    return formatted;
  };

  return (
    <div
      className={`prose prose-sm max-w-none ${theme === "dark" ? "prose-invert text-white" : "text-gray-900"}`}
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
};

interface Message {
  id: string;
  content: string;
  sender: "user" | "athena";
  timestamp: Date;
}

interface ChatApiResponse {
  success?: boolean;
  reply?: string;
  message?: string;
  text?: string;
  response?: string;
  answer?: string;
  content?: string;
  choices?: { message?: { content?: string } }[];
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export default function Athena() {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatCarouselRef = useRef<HTMLDivElement>(null);

  // Mensagens sugeridas
  const suggestedMessages = [
    "O que posso fazer para me sentir melhor hoje?",
    "Estou me sentindo muito sobrecarregado hoje...",
    "Estou precisando de algo para me animar",
    "Como posso melhorar minha rotina de sono?",
    "Quais exercícios posso fazer para relaxar?",
    "Como lidar com a ansiedade no trabalho?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll horizontal arrastar
  useEffect(() => {
    if (messages.length > 0 && chatCarouselRef.current) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      const handleMouseDown = (e: MouseEvent) => {
        isDown = true;
        chatCarouselRef.current!.style.cursor = "grabbing";
        startX = e.pageX - chatCarouselRef.current!.offsetLeft;
        scrollLeft = chatCarouselRef.current!.scrollLeft;
      };
      const handleMouseLeave = () => {
        isDown = false;
        chatCarouselRef.current!.style.cursor = "grab";
      };
      const handleMouseUp = () => {
        isDown = false;
        chatCarouselRef.current!.style.cursor = "grab";
      };
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - chatCarouselRef.current!.offsetLeft;
        const walk = (x - startX) * 2;
        chatCarouselRef.current!.scrollLeft = scrollLeft - walk;
      };

      const elem = chatCarouselRef.current;
      elem.addEventListener("mousedown", handleMouseDown);
      elem.addEventListener("mouseleave", handleMouseLeave);
      elem.addEventListener("mouseup", handleMouseUp);
      elem.addEventListener("mousemove", handleMouseMove);
      elem.style.cursor = "grab";

      return () => {
        elem.removeEventListener("mousedown", handleMouseDown);
        elem.removeEventListener("mouseleave", handleMouseLeave);
        elem.removeEventListener("mouseup", handleMouseUp);
        elem.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedMessageClick = (message: string) => {
    setInputValue(message);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmed,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("mt_token");
        if (token) {
          setAuthToken(token);
        } else {
          throw {
            response: {
              data: { message: "Sessão expirada. Faça login novamente." },
            },
          };
        }
      }
      const data: ChatApiResponse = await sendChat({ message: trimmed });
      if (data && data.success === false && data.message) {
        throw { response: { data: { message: data.message } } };
      }

      let reply: string | undefined;
      if (data) {
        if (data.reply) reply = data.reply;
        else if (data.message) reply = data.message;
        else if (data.text) reply = data.text;
        else if (data.response) reply = data.response;
        else if (data.answer) reply = data.answer;
        else if (data.content) reply = data.content;
        else if (
          Array.isArray(data.choices) &&
          data.choices[0]?.message?.content
        ) {
          reply = data.choices[0].message.content;
        } else if (typeof data === "string") {
          reply = data;
        } else {
          reply = `Resposta recebida: ${JSON.stringify(data)}`;
        }
      }

      if (!reply) reply = "Desculpe, não consegui entender. Pode reformular?";

      const athenaId = Date.now().toString() + "_athena";
      const startedAt = new Date();
      // adiciona a mensagem vazia do Athena
      setMessages((prev) => [
        ...prev,
        { id: athenaId, content: "", sender: "athena", timestamp: startedAt },
      ]);

      // a partir daqui, já estamos exibindo a bolha da Athena, então removemos o indicador
      setIsTyping(false);

      // efeito de "máquina de escrever" preservando quebras de linha e espaços
      // divide em tokens: sequências de não-whitespace (palavras) ou whitespace (inclui \n)
      const tokens = String(reply).match(/(\S+|\s+)/g) ?? [];
      let i = 0;
      const intervalId = window.setInterval(() => {
        if (i >= tokens.length) {
          window.clearInterval(intervalId);
          setIsTyping(false);
          return;
        }

        const nextToken = tokens[i];
        setMessages((prev) =>
          prev.map((m) =>
            m.id === athenaId
              ? {
                  ...m,
                  // simplesmente concatenamos o próximo token para manter espaços e \n intocados
                  content: m.content + nextToken,
                }
              : m
          )
        );

        i += 1;
        scrollToBottom();
      }, 80);
    } catch (e) {
      let errorMessage =
        "Tive um problema para responder agora. Tente novamente em instantes.";
      if (typeof e === "object" && e !== null) {
        const error = e as ApiError;
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.status === 401) {
          errorMessage = "Sessão expirada. Faça login novamente.";
        } else if (error?.response?.status === 403) {
          errorMessage = "Acesso negado. Verifique suas permissões.";
        } else if (error?.response?.status === 404) {
          errorMessage = "Serviço não encontrado. Tente novamente mais tarde.";
        } else if (error?.response?.status === 500) {
          errorMessage =
            "Erro interno do servidor. Tente novamente mais tarde.";
        }
      }
      const athenaMessage: Message = {
        id: Date.now().toString() + "_athena_error",
        content: errorMessage,
        sender: "athena",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, athenaMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`w-full  h-screen flex flex-col justify-center align-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      {/* Área das Mensagens - Scroll Independente */}
      <div className="flex-1 w-full pl-0 lg:pl-37.5 mt-10 overflow-hidden pt-20 lg:pt-4">
        <div
          className="flex h-full w-full overflow-y-auto p-2 sm:p-4 justify-center items-center"
          ref={chatContainerRef}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col lg:flex-row justify-center items-center h-full mx-auto gap-4 lg:gap-8 px-4">
              <div className="flex flex-shrink-0 order-1 lg:order-none items-center justify-center">
                <Image
                  src="/images/AthenaAcenando.png"
                  alt="Athena"
                  width={200}
                  height={150}
                  className="hidden md:flex md:w-36"
                />
              </div>
              <div className="flex-1 max-w-2xl order-2 lg:order-none text-center lg:text-left">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                  Bem-vindo(a) ao Chat com Athena!
                </h2>
                <p className="text-sm sm:text-base mb-2 sm:mb-3">
                  Eu sou a Athena, uma IA criada para ajudar você a refletir
                  sobre seu bem-estar emocional e hábitos de vida.
                </p>
                <p className="text-sm sm:text-base mb-4 sm:mb-6">
                  Podemos conversar sobre seus sentimentos, desafios, metas e
                  juntos podemos dar os primeiros passos para uma vida mais
                  leve.
                </p>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
                    Sugestões para começar:
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start">
                    {suggestedMessages.map((message, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedMessageClick(message)}
                        className={`
                                                    px-2 py-1.5 sm:px-3 sm:py-2 rounded-full border-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105
                                                    ${
                                                      theme === "dark"
                                                        ? "border-blue-500 text-slate-50 hover:bg-blue-500 hover:text-white"
                                                        : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                                    }
                                                `}
                      >
                        {message}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                                            max-w-[85%] sm:max-w-xs lg:max-w-md px-2.5 py-2 sm:px-3 sm:py-2 rounded-2xl
                                            ${
                                              message.sender === "user"
                                                ? "bg-blue-600 text-white"
                                                : theme === "dark"
                                                  ? "bg-gray-700 text-white"
                                                  : "bg-gray-100 text-gray-900"
                                            }
                                        `}
                  >
                    {message.sender === "athena" && (
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="text-[14px] font-semibold">Athena</span>
                      </div>
                    )}
                    {message.sender === "athena" ? (
                      <FormattedText text={message.content} />
                    ) : (
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {message.content}
                      </p>
                    )}
                    <p
                      className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {/* Indicador de digitação */}
              {isTyping && (
                <div className="flex justify-start px-2 sm:px-0">
                  <div
                    className={`px-2.5 py-2 sm:px-3 sm:py-2 rounded-2xl ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <span className="text-xs font-semibold">Athena</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input de Mensagem - Fixo na parte inferior */}
      <div className={`flex-shrink-0 ml-0 lg:ml-37.5 pb-4 lg:pb-4 `}>
        <div className="max-w-4xl mx-auto">
          {/* Carrossel de mensagens sugeridas durante o chat */}
          {messages.length > 0 && (
            <div className="mb-2 sm:mb-3">
              <div
                ref={chatCarouselRef}
                className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-2 select-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {suggestedMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedMessageClick(message)}
                    className={`
                                            flex-shrink-0 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border text-xs font-medium transition-all duration-200 hover:scale-105 pointer-events-auto
                                            ${
                                              theme === "dark"
                                                ? "border-blue-500 text-slate-50 hover:bg-blue-500 hover:text-white"
                                                : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                            }
                                        `}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="relative">
            <input
              className={`
                                w-full font-semibold px-3 py-2.5 pr-12 sm:px-5 sm:py-3 sm:pr-14 rounded-4xl border-2 border-blue-600
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base
                                ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
                            `}
              type="text"
              placeholder="Compartilhe o que está acontecendo agora..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 sm:p-2.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={18} />
            </button>
          </div>
          <p
            className={`text-center text-xs mt-1.5 sm:mt-2 px-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            A Athena está aqui para conversar e orientar, mas nada substitui o
            cuidado de um psicólogo ou psiquiatra.
          </p>
        </div>
      </div>
    </div>
  );
}
