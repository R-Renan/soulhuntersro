import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Arrow from "./Dashboard/Arrow";
import Banner from "./Dashboard/Banner";

import { useAuth } from "../contexts/AuthContext";

const Body: React.FC = () => {
  const { isLoggedIn } = useAuth(); // retorna true ou false

  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: "ease-out" });
  }, []);

  return (
    <main className="relative flex-1 flex flex-col items-center text-center px-4 pt-2 sm:pt-4 min-h-screen overflow-visible">
      {/* Main Content */}
      {/* <div className="relative z-10 w-full flex flex-col items-center mt-10 sm:mt-16"> */}
      <div className="relative z-10 w-full flex flex-col items-center mt-0">
        {/* Logo */}
        <img
          id="main-logo"
          src="/images/text.png"
          alt="Soul Hunters Logo"
          className="w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px] drop-shadow-[0_0_20px_rgba(0,255,255,0.9)] mb-3 sm:mb-4"
          data-aos="zoom-in"
          data-aos-delay="100"
        />

        {/* Description */}
        <p
          className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl mb-3 sm:mb-4 px-2 sm:px-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Ergam-se, lendas
        </p>

        {/* Botões */}
        <div
          className="flex flex-col sm:flex-row justify-center items-center w-full sm:gap-10 gap-6 mb-10"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {/* Grupo 1 - SHRO & Patch */}
          <div className="flex flex-row gap-3 w-full sm:w-auto">
            <a
              href={
                isLoggedIn
                  ? "https://drive.google.com/file/d/1sipL3a2MOJq6o6w_ku1Yie_ZwvsxkfzZ/view?usp=sharing"
                  : "#"
              }
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  alert("Você precisa estar autenticado para acessar o SHRO.");
                }
              }}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold uppercase tracking-wide rounded-xl transition-all duration-300 shadow-md ring-1 ${
                isLoggedIn
                  ? "border-cyan-400/40 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-400 hover:text-gray-900 hover:shadow-cyan-500/40 hover:scale-105 ring-cyan-500/20"
                  : "border-red-400/40 bg-red-950/20 text-red-200 cursor-not-allowed ring-red-500/20"
              }`}
            >
              SHRO
            </a>

            <a
              href={
                isLoggedIn
                  ? "https://drive.google.com/file/d/1sipL3a2MOJq6o6w_ku1Yie_ZwvsxkfzZ/view?usp=sharing"
                  : "#"
              }
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  alert("Você precisa estar autenticado para acessar o Patch.");
                }
              }}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold uppercase tracking-wide rounded-xl transition-all duration-300 shadow-md ring-1 ${
                isLoggedIn
                  ? "border-cyan-400/40 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-400 hover:text-gray-900 hover:shadow-cyan-500/40 hover:scale-105 ring-cyan-500/20"
                  : "border-red-400/40 bg-red-950/20 text-red-200 cursor-not-allowed ring-red-500/20"
              }`}
            >
              Patch
            </a>
          </div>

          {/* Grupo 2 - Instagram & Discord */}
          <div className="flex flex-row gap-3 w-full sm:w-auto">
            <a
              href="https://www.instagram.com/soulhunters_rag"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold uppercase tracking-wide rounded-xl border border-cyan-400/40 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-cyan-500/40 ring-1 ring-cyan-500/20 hover:scale-105"
            >
              Instagram
            </a>
            <a
              href="https://discord.gg/Y3NRZsXvwc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold uppercase tracking-wide rounded-xl border border-cyan-400/40 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-cyan-500/40 ring-1 ring-cyan-500/20 hover:scale-105"
            >
              Discord
            </a>
          </div>
        </div>
      </div>

      {/* Efeito de fundo */}

      {/* Arrow abaixo do conteúdo principal */}
      <div className="bottom-0 left-0 right-0 flex justify-center z-10">
        <Arrow />
      </div>
      <Banner />
    </main>
  );
};

export default Body;
