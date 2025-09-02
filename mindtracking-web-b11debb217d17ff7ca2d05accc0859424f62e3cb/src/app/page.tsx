import Header from "./components/Header"
import Footer from './components/footer'; 

export default function Home() {
  return (
    <div>
      <Header/>
        {/* Rodapé */}
      <Footer />  {/* O Footer ficará ao final do conteúdo */}
    </div>
  );
}
