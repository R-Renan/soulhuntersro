import React, { useState, useEffect } from "react";
import { getMembers } from "../../services/discord";
import type { Member } from "../../types/discord";
import { FaAward } from "react-icons/fa";
import { MemberCard } from "./StaffDiscord";

interface PodiumRankProps {
  redTeamRoleId: string;
  blueTeamRoleId: string;
  serverId: string;
}

// Filtra membros ucstom
const filterByRole = (members: Member[], roleId: string) => {
  return members.filter((member) => member.roles.includes(roleId));
};

const PodiumRank: React.FC<PodiumRankProps> = ({
  redTeamRoleId,
  blueTeamRoleId,
  serverId,
}) => {
  const [topMembers, setTopMembers] = useState<{
    red: Member | null;
    blue: Member | null;
  }>({ red: null, blue: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getMembers();
        const redMember = filterByRole(data, redTeamRoleId)[0] || null;
        const blueMember = filterByRole(data, blueTeamRoleId)[0] || null;
        setTopMembers({
          red: redMember,
          blue: blueMember,
        });
      } catch (err) {
        setError("Erro ao carregar o ranking. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [redTeamRoleId, blueTeamRoleId]);

  return (
    <div className="mb-8 sm:mb-12 px-4 sm:px-0">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-cyan-400 mb-12 drop-shadow">
        <div className="flex items-center justify-center gap-4">
          <FaAward /> Melhores do HvsH
        </div>
      </h2>

      {loading && (
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
          <div className="w-40 h-[230px] bg-cyan-700/30 rounded-lg animate-pulse"></div>
          <div className="w-40 h-[230px] bg-cyan-700/30 rounded-lg animate-pulse"></div>
        </div>
      )}

      {error && <p className="text-center text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
          {/* Melhor do Time Azul */}
          {topMembers.blue ? (
            <div className="flex flex-col items-center w-40">
              <div className="text-blue-400 font-bold text-sm mb-2">
                Team Valkyre
              </div>
              <MemberCard
                member={topMembers.blue}
                roles={[]}
                serverId={serverId}
                onUpdate={() => {}}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center w-40">
              <div className="text-blue-400 font-bold text-sm mb-2">
                Team Valkyre
              </div>
              <div className="w-40 h-[230px] bg-cyan-900/20 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Nenhum membro
              </div>
            </div>
          )}

          {/* Ícone VS */}
          <div className="text-cyan-400 text-2xl md:text-4xl font-bold animate-pulse drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
            VS
          </div>

          {/* Melhor do Time Azul */}
          {topMembers.red ? (
            <div className="flex flex-col items-center w-40">
              <div className="text-red-400 font-bold text-sm mb-2">
                Team Baphome
              </div>
              <MemberCard
                member={topMembers.red}
                roles={[]}
                serverId={serverId}
                onUpdate={() => {}}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center w-40">
              <div className="text-red-400 font-bold text-sm mb-2">
                Team Baphome
              </div>
              <div className="w-40 h-[230px] bg-cyan-900/20 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Nenhum membro
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PodiumRank;
