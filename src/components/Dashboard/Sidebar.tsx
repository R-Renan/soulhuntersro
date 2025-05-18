import React, { useState, useEffect } from "react";
import {
  FaTrophy,
  FaCalendarAlt,
  FaPaperclip,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { getMembers } from "../../services/discord";
import type { Member } from "../../types/discord";

const filterByRole = (members: Member[], roleId: string) => {
  return members.filter((member) => member.roles.includes(roleId));
};

// Lista de classes (apenas id e name)
const classes = [
  { id: "1125479160970752081", name: "Cavaleiro Rúnico" },
  { id: "1125482934917415004", name: "Guardião Real" },
  { id: "1125483226379583528", name: "Arcano" },
  { id: "1125483286286827551", name: "Feiticeiro" },
  { id: "1125483337138577529", name: "Sentinela" },
  { id: "1125483477362548776", name: "Trovadores" },
  { id: "1125483506642989136", name: "Musas" },
  { id: "1125483570270584942", name: "Mecânico" },
  { id: "1125483626579116163", name: "Bioquímico" },
  { id: "1125483666659872848", name: "Sicário" },
  { id: "1125483700801523742", name: "Renegado" },
  { id: "1125483742513864744", name: "Arcebispo" },
  { id: "1125483773794984036", name: "Shura" },
  { id: "1125485119847809064", name: "Invocadores" },
  { id: "1125485232112533576", name: "Kagerou" },
  { id: "1125485253700632618", name: "Oboro" },
  { id: "1125485293512957962", name: "Insurgente" },
];

const Sidebar: React.FC = () => {
  const [onlineClasses, setOnlineClasses] = useState<
    { name: string; count: number; members: Member[] }[]
  >([]);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getMembers();
        // Filtra membros com status online, idle ou dnd
        const activeMembers = data.filter((member) =>
          ["online", "idle", "dnd"].includes(member.status)
        );
        // Conta membros ativos por classe e armazena membros
        const classesWithActive = classes
          .map((cls) => {
            const classMembers = filterByRole(activeMembers, cls.id);
            return {
              name: cls.name,
              count: classMembers.length,
              members: classMembers,
            };
          })
          .filter((cls) => cls.count > 0); // Apenas classes com membros ativos
        setOnlineClasses(classesWithActive);
      } catch (err) {
        setError("Erro ao carregar as classes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const toggleClass = (className: string) => {
    setExpandedClass(expandedClass === className ? null : className);
  };

  return (
    <aside className="sticky top-40 w-full max-w-sm sm:max-w-xs md:max-w-sm lg:max-w-[280px] mx-auto border border-cyan-400/30 bg-cyan-950/20 rounded-lg shadow-[0_0_10px_rgba(0,255,255,0.2)] overflow-y-auto max-h-[calc(100vh-2rem)] z-10">
      {/* Eventos */}
      <Section title="Eventos" icon={<FaCalendarAlt />}>
        <ul className="text-gray-300 text-xs sm:text-sm space-y-1">
          <li>
            • HvsH — <span className="font-medium">Dia sim/Dia não, 20h</span>
          </li>
          <li>
            • UFC — <span className="font-medium">Indefinido</span>
          </li>
        </ul>
      </Section>

      {/* Classes */}
      <Section title="Classes" icon={<FaTrophy />}>
        {loading ? (
          <div className="space-y-2 px-2">
            <div className="h-6 w-full bg-cyan-700/30 rounded animate-pulse"></div>
            <div className="h-6 w-full bg-cyan-700/30 rounded animate-pulse"></div>
            <div className="h-6 w-full bg-cyan-700/30 rounded animate-pulse"></div>
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm px-2">{error}</p>
        ) : onlineClasses.length > 0 ? (
          <ul className="text-gray-300 text-xs sm:text-sm space-y-1">
            {onlineClasses.map((cls) => (
              <ClassItem
                key={cls.name}
                name={cls.name}
                count={cls.count}
                members={cls.members}
                isExpanded={expandedClass === cls.name}
                onToggle={() => toggleClass(cls.name)}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm px-2">Nenhuma classe ativa</p>
        )}
      </Section>

      {/* Guias */}
      <Section title="Guias & Comunidade" icon={<FaPaperclip />}>
        <ul className="text-xs sm:text-sm text-gray-300 space-y-1.5">
          {[
            { title: "Guia MVP - Torre", channelID: "1137366142873243769" },
            { title: "Guia de Instâncias", channelID: "1365325330234998794" },
            { title: "Guia de Consumíveis", channelID: "1365109607655149628" },
            { title: "Tutorias", channelID: "1365109948639350895" },
          ].map((link) => (
            <li key={link.channelID}>
              <a
                href={`/guides/${link.channelID}`}
                className="text-cyan-400 hover:text-cyan-200 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded transition-colors duration-200"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </aside>
  );
};

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="mb-4 px-3 sm:px-4 pt-3 sm:pt-4">
    <h3 className="text-sm sm:text-base font-semibold text-cyan-400 mb-2 pb-1 bg-gradient-to-r from-cyan-400/20 to-cyan-400/10 rounded-md">
      <div className="flex items-center gap-2 pl-2">
        {icon} {title}
      </div>
    </h3>
    {children}
  </section>
);

const ClassItem: React.FC<{
  name: string;
  count: number;
  members: Member[];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ name, count, members, isExpanded, onToggle }) => (
  <li className="px-2 py-1 rounded-md hover:bg-cyan-700/30 transition-all duration-200">
    <button
      className="flex items-center justify-between w-full text-gray-300 bg-cyan-900/20 rounded-md px-2 py-1"
      onClick={onToggle}
    >
      <span>{name}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{count}</span>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
    </button>
    {isExpanded && (
      <ul className="mt-2 ml-4 space-y-1 bg-cyan-900/10 rounded-md p-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="text-gray-300 text-xs hover:text-cyan-200 transition-colors cursor-default"
          >
            • {member.nickname}
          </li>
        ))}
      </ul>
    )}
  </li>
);

export default Sidebar;
