import { useState } from "react";
import { FaRegCopy, FaRegStickyNote } from "react-icons/fa";
import { showToast } from "../../utils/toast";

type Noticia = {
  titulo: string;
  data: string;
  descricao: {
    tipo: "npc" | "texto";
    texto: string;
    valor?: string;
    tooltip?: string;
  }[];
};

const noticias: Noticia[] = [
  {
    titulo: "Atualização",
    data: "12 de Maio de 2025",
    descricao: [
      { tipo: "texto", texto: "Correção de Bugs" },
      { tipo: "texto", texto: "Correção de Quest" },
      { tipo: "texto", texto: "Correção de Habilidades" },
      { tipo: "texto", texto: "Correção de Portais" },
      { tipo: "texto", texto: "Correção de Itens" },
    ],
  },
  {
    titulo: "Atualização",
    data: "11 de Maio de 2025",
    descricao: [
      { tipo: "texto", texto: "Correção de Bugs" },
      { tipo: "texto", texto: "Correção de Quest" },
      { tipo: "texto", texto: "Correção de Habilidades" },
      { tipo: "texto", texto: "Correção de Portais" },
      { tipo: "texto", texto: "Correção de Itens" },
    ],
  },
  {
    titulo: "Atualização",
    data: "10 de Maio de 2025",
    descricao: [
      {
        tipo: "npc",
        texto: "NPC Velha Sábia (Removedor de Cartas)",
        valor: "/navi payon 125/111",
        tooltip: "Clique para copiar localização",
      },
      { tipo: "texto", texto: "Login Diário ~ Em breve" },
    ],
  },
  {
    titulo: "Atualização",
    data: "08 de Maio de 2025",
    descricao: [
      { tipo: "texto", texto: "Correção Soul Coin e Moedas Mora" },
      { tipo: "texto", texto: "NPC Mestre dos Homunculos" },
    ],
  },
  {
    titulo: "Atualização",
    data: "07 de Maio de 2025",
    descricao: [
      { tipo: "texto", texto: "Correções de Bugs" },
      { tipo: "texto", texto: "Nova Sprite da Soul Coin" },
      { tipo: "texto", texto: "NPCs na loja de Vendedores" },
      { tipo: "texto", texto: "Habilidades de Platina" },
      { tipo: "texto", texto: "Hat 3rd" },
      { tipo: "texto", texto: "Ovo Soul Sombrios" },
      {
        tipo: "texto",
        texto:
          "Starter Pack para todos os Personagens - 5kk de Zeny para o primeiro, fale com o NPC.",
      },
      { tipo: "texto", texto: "Habilidades Básicas FIX" },
      { tipo: "texto", texto: "Portais da loja FIX" },
    ],
  },
];

const ITEMS_PER_PAGE = 4;

const copiar = (texto: string) => {
  navigator.clipboard.writeText(texto);
  showToast("Localização copiada para área de transferência!");
};

const Notices: React.FC = () => {
  const [pagina, setPagina] = useState(1);

  const totalPages = Math.ceil(noticias.length / ITEMS_PER_PAGE);
  const noticiasPaginadas = noticias.slice(
    (pagina - 1) * ITEMS_PER_PAGE,
    pagina * ITEMS_PER_PAGE
  );

  return (
    <div className="py-5 mb-6 sm:mb-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-cyan-400 drop-shadow">
          <div className="flex justify-center items-center gap-3 border-b border-cyan-400/20 pb-2">
            <FaRegStickyNote />
            Últimas Atualizações
          </div>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {noticiasPaginadas.map((noticia, i) => (
            <div
              key={i}
              className="rounded-xl border border-cyan-400/30 p-4 shadow-md hover:shadow-cyan-400/10 transition"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <header className="mb-3">
                <h3 className="text-lg font-semibold text-cyan-300">
                  {noticia.titulo}
                </h3>
                <p className="text-xs text-gray-400">{noticia.data}</p>
              </header>

              <ul className="list-disc pl-4 space-y-1 text-sm text-gray-300">
                {noticia.descricao.map((desc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {desc.tipo === "npc" ? (
                      <>
                        {desc.texto}
                        {desc.valor && (
                          <button
                            title={desc.tooltip ?? "Copiar localização"}
                            className="text-cyan-400 hover:text-cyan-200"
                            onClick={() => copiar(desc.valor!)}
                          >
                            <FaRegCopy className="text-sm" />
                          </button>
                        )}
                      </>
                    ) : (
                      desc.texto
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPagina(i + 1)}
                className={`px-3 py-1.5 rounded border text-sm transition ${
                  pagina === i + 1
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-800 text-cyan-300 hover:bg-cyan-700 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
