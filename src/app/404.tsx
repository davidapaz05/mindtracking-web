// app/not-found.tsx

import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center text-white px-4 py-8"
      style={{ backgroundImage: "url('/images/fundo-404.jpg')" }} 
    >
      <div className="mb-12">
        <Image
          src="/images/icons/404.svg"
          alt="404 Not Found"
          width={300}
          height={300}
        />
      </div>
      <div className="text-center max-w-lg">
        <h2 className="text-4xl font-bold mb-4">Você se perdeu na jornada!</h2>
        <p className="text-xl mb-6">
          A conexão com esta página foi perdida, mas nossa jornada juntos continua. Vamos nos reconectar ao seu espaço.
        </p>
        <Link href="/dashboard" passHref>
          <a className="inline-block px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded-full hover:bg-blue-600 transition duration-300">
            Acessar meu Dashboard
          </a>
        </Link>
      </div>
    </div>
  );
}
