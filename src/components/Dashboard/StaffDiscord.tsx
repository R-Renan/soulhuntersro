import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { getMembers } from "../../services/discord";
import type { Member, Role } from "../../types/discord";
import { Headphones, Monitor, Gamepad } from "lucide-react";
import { FaDiscord, FaSync } from "react-icons/fa";

interface MemberCardProps {
  member: Member;
  roles: Role[];
  serverId: string;
  onUpdate: () => void;
}

const filterByRole = (members: Member[], roleId: string) => {
  return members.filter((member) => member.roles.includes(roleId));
};

export const MemberCard = ({ member }: MemberCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getActivityIcon = (activity: string | null) => {
    if (!activity) return null;
    if (activity.includes("Spotify")) return <Headphones size={16} />;
    if (activity.includes("Jogando")) return <Gamepad size={16} />;
    if (activity.includes("Assistindo") || activity.includes("Transmitindo"))
      return <Monitor size={16} />;
    return null;
  };

  return (
    <div className="border border-cyan-400/50 bg-cyan-950/20 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center shadow hover:shadow-cyan-500/20 transition-transform hover:scale-105 w-[150px] sm:w-[170px] md:w-[190px] lg:w-[200px] mx-2 sm:mx-3 flex-shrink-0 animate-fade-in-up">
      <img
        src={member.avatar}
        alt={member.username}
        className="w-16 sm:w-20 h-16 sm:h-20 rounded-full object-cover mb-2 sm:mb-3 border-2 border-cyan-500/30"
        loading="lazy"
      />
      <p className="text-xs sm:text-sm text-gray-300 font-semibold">
        {member.nickname}
      </p>
      <span
        className={`mt-2 inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(
          member.status
        )}`}
      >
        {member.status === "online"
          ? "Online"
          : member.status === "idle"
          ? "Ausente"
          : member.status === "dnd"
          ? "Ocupado"
          : "Offline"}
      </span>
      {member.activity && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          {getActivityIcon(member.activity)}
          <span>{member.activity}</span>
        </div>
      )}
    </div>
  );
};

const StaffDiscord: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState<number>(0);

  const getRandomMembers = (members: Member[], maxItems: number) => {
    const shuffled = [...members].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, maxItems);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      const filtered = filterByRole(data, "1125525545074045008");
      const randomMembers = getRandomMembers(filtered, 6);
      setMembers([]);
      setTimeout(() => {
        setMembers(randomMembers);
        setAnimationKey((prev) => prev + 1);
      }, 50);
      setCurrentIndex(0);
    } catch (err) {
      setError("Erro ao carregar membros. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < members.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    },
    onTap: ({ event }) => {
      event.stopPropagation(); // Impede propagação de eventos
      event.preventDefault(); // Evita comportamento padrão do toque
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
    delta: 15, // Sensibilidade para distinguir swipe de tap
  });

  return (
    <div className="mt-25 mb-8 sm:mb-12">
      <div className="max-w-full flex flex-col lg:flex-row gap-6 sm:gap-8">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-cyan-400 drop-shadow">
              <div className="flex items-center justify-center gap-4">
                <FaDiscord /> Membros Søul
              </div>
            </h2>
            <button
              onClick={fetchMembers}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
              disabled={loading}
              aria-label="Recarregar membros"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {loading && !members.length && (
            <p className="text-center text-gray-400 text-sm">
              Carregando membros...
            </p>
          )}

          {error && <p className="text-center text-red-400 text-sm">{error}</p>}

          {!loading && !error && members.length > 0 && (
            <>
              {/* Mobile */}
              <div className="block md:hidden overflow-hidden">
                <div
                  {...handlers}
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  key={animationKey}
                >
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="w-full flex-shrink-0 flex justify-center"
                    >
                      <MemberCard
                        member={member}
                        roles={[]}
                        serverId="defaultServerId"
                        onUpdate={() => {}}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                  {members.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i === currentIndex
                          ? "bg-cyan-400 scale-110 shadow-md"
                          : "bg-gray-500 opacity-50"
                      }`}
                      aria-label={`Ir para membro ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop */}
              <div
                className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center w-full"
                key={animationKey}
              >
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    roles={[]}
                    serverId="defaultServerId"
                    onUpdate={() => {}}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDiscord;
