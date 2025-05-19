import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Banner: React.FC = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: "ease-out" });
  }, []);

  return (
    <div
      className="max-w-7xl mx-auto px-3 sm:px-4 py-4 flex flex-col items-center text-center bg-cyan-950/20 border border-cyan-400/50 rounded-lg shadow hover:shadow-cyan-500/20 transition-transform hover:scale-105 mt-8 animate-fade-in-up"
      data-aos="fade-up"
      data-aos-delay="400"
    >
      <h3 className="text-lg sm:text-xl font-bold text-cyan-100 mb-2">
        Soul Hunters Recrutamento 🌎
      </h3>
      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[90%] mx-auto mb-4">
        Junte-se à melhor guilda do Latam! Buscamos jogadores de todos os níveis
        dispostos a aprender e crescer em WoE, MVPs e eventos. <br />
        <span className="text-cyan-400 font-semibold">
          Iniciantes ou veteranos, aqui você encontra tudo o que precisa para se
          divertir e aprender!
        </span>
      </p>
      <a
        href="https://discord.com/channels/1125412537308024904/1358981389755748455"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-cyan-600/50 to-cyan-500/50 border border-cyan-400/30 text-cyan-100 rounded-lg text-xs sm:text-sm hover:from-cyan-500/60 hover:to-cyan-400/60 transition-all duration-300 shadow-md hover:shadow-cyan-500/40 hover:scale-105"
      >
        Entrar no Discord
      </a>
    </div>
  );
};

export default Banner;
