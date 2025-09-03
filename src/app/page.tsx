"use client";

import React, { useState } from 'react';

import Modal1 from './auth/login/component/login';
import Modal2 from './auth/login/component/registro';

export default function Page() {
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        onClick={() => setShowModal1(true)}
      >
        Abrir Modal 1 (Login)
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        onClick={() => setShowModal2(true)}
      >
        Abrir Modal 2 (Cadastro)
      </button>

      {showModal1 && (
        <Modal1
          onClose={() => setShowModal1(false)}
          onOpenModal2={() => {
            setShowModal1(false);
            setShowModal2(true);
          }}
          // Removido onOpenModal3 pois Modal1 (login) não precisa abrir Modal3 diretamente
        />
      )}

      {showModal2 && (
        <Modal2
          onClose={() => setShowModal2(false)}
          onOpenModal1={() => {
            setShowModal2(false);
            setShowModal1(true);
          }}
        />
      )}
    </div>
  );
}