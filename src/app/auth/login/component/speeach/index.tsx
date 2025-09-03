'use client';

import { useState, useEffect, useRef } from "react";

type AthenaMessageProps = {
  message: string;
  title: string;
  position?: {
    top: string;
    right: string;
  };
  className?: string;
  onTypingComplete?: () => void;
};

export default function AthenaMessage({ 
  message, 
  title, 
  position = { top: "-140px", right: "-240px" },
  className = "",
  onTypingComplete
}: AthenaMessageProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [containerHeight, setContainerHeight] = useState(90);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showMessage) return;

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < message.length) {
        setTypedMessage(message.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        if (onTypingComplete) onTypingComplete();
      }
    }, 30);

    return () => {
      clearInterval(typingInterval);
      setIsTypingComplete(false);
    };
  }, [showMessage, message, onTypingComplete]);

  useEffect(() => {
    if (messageRef.current) {
      const contentHeight = messageRef.current.scrollHeight + 60;
      const minHeight = 90;
      const maxHeight = 200;
      
      if (contentHeight > minHeight) {
        setContainerHeight(Math.min(contentHeight, maxHeight));
      } else {
        setContainerHeight(minHeight);
      }
    }
  }, [typedMessage]);

  if (!showMessage) return null;

  return (
    <div
      className={`absolute bg-white text-slate-800 p-4 rounded-lg shadow-xl z-20 border border-gray-200 overflow-visible ${className}`}
      style={{
        top: position.top,
        right: position.right,
        width: "288px",
        height: `${containerHeight}px`,
        transition: "height 0.2s ease-out"
      }}
    >
      {/* Pontinha do balão ajustada para o lado esquerdo */}
      <div className="absolute w-5 h-5 bg-white transform rotate-45 border-t border-l border-gray-200 -left-2 bottom-4"></div>
      
      <h3 className="text-[17px] md:text-[18px] font-bold mb-2 text-black leading-tight">
        {title}
      </h3>
      <div className="h-auto max-h-[150px] overflow-y-auto">
        <p 
          ref={messageRef}
          className="text-[14px] text-black md:text-[15px] font-medium leading-snug"
        >
          {typedMessage}
        </p>
      </div>
    </div>
  );
}