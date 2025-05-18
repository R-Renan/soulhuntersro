import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { GiTargetArrows } from "react-icons/gi";

interface ItemDia {
  item: string;
  imagem: string;
  rate: number;
  url: string;
}

const itensSemana: ItemDia[] = [
  {
    item: "Aura do Amor",
    imagem: "/images/items/31538.webp",
    rate: 0,
    url: "https://example.com/aura-do-amor",
  },
  {
    item: "Auréola dos Aesir",
    imagem: "/images/items/20218.webp",
    rate: 0,
    url: "https://example.com/aureola-dos-aesir",
  },
  {
    item: "Cartola do Willie Wootan",
    imagem: "/images/items/20243.webp",
    rate: 0,
    url: "https://example.com/cartola-willie-wootan",
  },
  {
    item: "Orelhas de Fada Animada",
    imagem: "/images/items/19776.webp",
    rate: 0,
    url: "https://example.com/orelhas-fada-animada",
  },
  {
    item: "Deviling Companheiro",
    imagem: "/images/items/5912.webp",
    rate: 0,
    url: "https://example.com/deviling-companheiro",
  },
  {
    item: "Laçarote da Retaguarda",
    imagem: "/images/items/480052.webp",
    rate: 0,
    url: "https://example.com/lacarote-retaguarda",
  },
];

const DailyItem: React.FC<ItemDia> = ({ item, imagem, rate, url }) => {
  const handleTap = () => {
    window.open(url, "_blank"); // Abre a URL em uma nova aba
  };

  return (
    <div
      className="border border-cyan-400/50 bg-cyan-950/20 rounded-lg p-3 sm:p-4 flex flex-col justify-between items-center text-center shadow hover:shadow-cyan-500/20 transition-transform hover:scale-105 w-[150px] sm:w-[170px] md:w-[190px] lg:w-[200px] h-[230px] sm:h-[260px] mx-2 sm:mx-3 flex-shrink-0 cursor-pointer"
      onClick={handleTap} // Compatibilidade com desktop
    >
      <div className="flex flex-col items-center justify-center flex-grow">
        <img
          src={imagem}
          alt={`Imagem de ${item}`}
          className="w-16 sm:w-20 h-16 sm:h-28 object-contain mb-2 sm:mb-3"
          loading="lazy"
        />
        <p className="text-xs sm:text-sm text-gray-300 px-2 break-words">
          {item}
        </p>
      </div>

      <span className="mt-3 inline-block px-2 py-1 text-xs font-semibold text-white bg-cyan-700/40 rounded-full">
        {rate}% Drop
      </span>
    </div>
  );
};

const DailyItens: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % itensSemana.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev === 0 ? itensSemana.length - 1 : prev - 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextItem,
    onSwipedRight: prevItem,
    onTap: ({ event }) => {
      event.stopPropagation(); // Impede propagação para evitar cliques indesejados
      // O tap será tratado pelo onClick do DailyItem
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
    delta: 15, // Ajustado para maior distinção entre swipe e tap
  });

  return (
    <div className="mb-20 sm:mb-20">
      <div className="max-w-full flex flex-col gap-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-cyan-400 mb-6 sm:mb-10 drop-shadow">
          <div className="flex items-center justify-center gap-4">
            <GiTargetArrows /> Itens da Semana
          </div>
        </h2>

        {/* Mobile Carousel */}
        {itensSemana.length > 0 && (
          <div className="block md:hidden overflow-hidden">
            <div
              {...handlers}
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {itensSemana.map((item, i) => (
                <div
                  key={`${item.item}-${i}`}
                  className="w-full flex-shrink-0 flex justify-center"
                >
                  <DailyItem {...item} />
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {itensSemana.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Ir para o item ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center w-full">
          {itensSemana.map((item, i) => (
            <DailyItem key={`${item.item}-${i}`} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyItens;
