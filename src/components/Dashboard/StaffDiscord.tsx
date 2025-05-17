import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { getMembers } from "../../services/discord";
import type { Member, Role } from "../../types/discord";
import { Headphones, Monitor, Gamepad } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

interface MemberCardProps {
  member: Member;
  roles: Role[];
  serverId: string;
  onUpdate: () => void;
}

// filtro de membros
const filterByRole = (members: Member[], roleId: string) => {
  return members.filter((member) => member.roles.includes(roleId));
};

const MemberCard = ({ member }: MemberCardProps) => {
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
    <div className="border border-cyan-400/50 bg-cyan-950/20 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center shadow hover:shadow-cyan-500/20 transition-transform hover:scale-105 w-[150px] sm:w-[170px] md:w-[190px] lg:w-[200px] mx-2 sm:mx-3 flex-shrink-0">
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

  // Busca os membros da API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getMembers();
        const filtered = filterByRole(data, "1214305425667661855");
        setMembers(filtered.slice(0, 6));
      } catch (err) {
        setError("Erro ao carregar membros. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

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
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div className="mb-8 sm:mb-12">
      <div className="max-w-full flex flex-col lg:flex-row gap-6 sm:gap-8">
        <div className="w-full">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-cyan-400 mb-6 sm:mb-10 drop-shadow">
            <div className="flex items-center justify-center gap-4">
              <FaDiscord /> Membros do Discord
            </div>
          </h2>

          {loading && (
            <p className="text-center text-gray-400 text-sm">
              Carregando membros...
            </p>
          )}

          {error && <p className="text-center text-red-400 text-sm">{error}</p>}

          {!loading && !error && members.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              Nenhum membro encontrado.
            </p>
          )}

          {/* Mobile Carousel */}
          {!loading && !error && members.length > 0 && (
            <div className="block md:hidden overflow-hidden">
              <div
                {...handlers}
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
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
                    className={`w-2 h-2 rounded-full ${
                      i === currentIndex ? "bg-cyan-400" : "bg-gray-600"
                    }`}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to member ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Desktop Grid */}
          {!loading && !error && members.length > 0 && (
            <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center w-full">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDiscord;
