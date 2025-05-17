import React from "react";
import { FaTrophy, FaCalendarAlt, FaPaperclip } from "react-icons/fa";

const Sidebar: React.FC = () => {
  return (
    <aside className="lg:w-full xl:w-72 border border-cyan-400/30 bg-cyan-950/20 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] sticky top-40">
      {" "}
      {/* Reduz largura */}
      <section className="mb-4 px-3 sm:px-4 pt-3 sm:pt-4">
        {" "}
        {/* Reduz padding e margem */}
        <h3 className="text-base font-semibold text-cyan-400 mb-2 border-b border-cyan-400/20 pb-0.5">
          {" "}
          {/* Reduz fonte e margem */}
          <div className="flex items-center justify-left gap-3">
            <FaCalendarAlt /> Eventos
          </div>
        </h3>
        <ul className="text-gray-300 text-xs space-y-0.5">
          {" "}
          {/* Reduz fonte e espaçamento */}
          <li>
            • HvsH — <span className="font-medium">Sáb, 20h</span>
          </li>
          <li>
            • UFC — <span className="font-medium">Dom, 18h</span>
          </li>
        </ul>
      </section>
      <section className="mb-4 px-3 sm:px-4">
        {" "}
        {/* Reduz margem e padding */}
        <h3 className="text-base font-semibold text-cyan-400 mb-2 border-b border-cyan-400/20 pb-0.5">
          {" "}
          {/* Reduz fonte e margem */}
          <div className="flex items-center justify-left gap-3">
            <FaTrophy /> Top Jogadores
          </div>
        </h3>
        <ol className="text-gray-300 text-xs list-decimal list-inside space-y-0.5">
          {" "}
          {/* Reduz fonte e espaçamento */}
          <li>Guntehr</li>
          <li>Hookah</li>
          <li>Alesia</li>
        </ol>
      </section>
      <section className="px-3 sm:px-4 pb-3 sm:pb-4">
        {" "}
        {/* Reduz padding */}
        <h3 className="text-base font-semibold text-cyan-400 mb-2 border-b border-cyan-400/20 pb-0.5">
          {" "}
          {/* Reduz fonte e margem */}
          <div className="flex items-center justify-left gap-3">
            <FaPaperclip /> Guias & Comunidade
          </div>
        </h3>
        <ul className="text-xs text-gray-300 space-y-1.5">
          {" "}
          {/* Reduz fonte e espaçamento */}
          {[
            "Guia do Iniciante",
            "Guia do Cavaleiro Runico",
            "Guia do Arcano",
            "Guia do Sentinela",
            "Guia do Sinx",
            "Guia do Guardião Real",
            "Guia do Mercador",
            "Guia do Shura",
          ].map((link, idx) => (
            <li key={idx}>
              <a
                href="#"
                className="text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
              >
                {link}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://discord.gg/WwQku9Zk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
            >
              Comunidade no Discord
            </a>
          </li>
        </ul>
      </section>
    </aside>
  );
};

export default Sidebar;
