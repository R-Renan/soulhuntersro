import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { GiTargetArrows } from "react-icons/gi";

interface ItemDia {
  item: string;
  imagem: string;
  rate: number;
}

const itensSemana: ItemDia[] = [
  { item: "Terror Violeta", imagem: "/images/items/1185.png", rate: 12 },
  { item: "Terror Violeta", imagem: "/images/items/1185.png", rate: 9 },
  { item: "Terror Violeta", imagem: "/images/items/1185.png", rate: 15 },
  { item: "Terror Violeta", imagem: "/images/items/1185.png", rate: 8 },
  { item: "Terror Violeta", imagem: "/images/items/1185.png", rate: 11 },
  { item: "Terror Violeta", imagem: "/images/items/1185.png", rate: 6 },
];

const DailyItem: React.FC<ItemDia> = ({ item, imagem, rate }) => (
  <div className="border border-cyan-400/50 bg-cyan-950/20 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center shadow hover:shadow-cyan-500/20 transition-transform hover:scale-105 w-[150px] sm:w-[170px] md:w-[190px] lg:w-[200px] mx-2 sm:mx-3 flex-shrink-0">
    <img
      src={imagem}
      alt={`Imagem de ${item}`}
      className="w-16 sm:w-20 h-16 sm:h-28 object-contain mb-2 sm:mb-3"
      loading="lazy"
    />
    <p className="text-xs sm:text-sm text-gray-300">{item}</p>
    <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold text-white bg-cyan-700/40 rounded-full">
      {rate}% Drop
    </span>
  </div>
);

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
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div className="mb-8 sm:mb-12">
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
