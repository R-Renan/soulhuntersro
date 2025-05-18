import React from "react";
import { useParams } from "react-router-dom";
import Feed from "../components/Feed";
import { FaBook } from "react-icons/fa";

const guides = [
  { title: "Guia do Iniciante", channelID: "channel_id_1" },
  { title: "Guia do Cavaleiro Runico", channelID: "channel_id_2" },
  { title: "Guia do Arcano", channelID: "channel_id_3" },
  { title: "Guia do Sentinela", channelID: "channel_id_4" },
  { title: "Guia do Sinx", channelID: "channel_id_5" },
  { title: "Guia do Guardião Real", channelID: "channel_id_6" },
  { title: "Guia do Mercador", channelID: "channel_id_7" },
  { title: "Guia do Shura", channelID: "channel_id_8" },
];

const GuidePage: React.FC = () => {
  const { channelID } = useParams<{ channelID: string }>();
  const guide = guides.find((g) => g.channelID === channelID);

  if (!guide) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b1120]">
        <p className="text-cyan-400 text-lg">Guia não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 mb-6 sm:mb-8 bg-gradient-to-r from-cyan-400/20 to-cyan-400/10 rounded-lg py-2 px-4 flex items-center gap-3">
          <FaBook /> {guide.title}
        </h1>
        <div className="border border-cyan-400/30 bg-cyan-950/20 rounded-lg shadow-[0_0_10px_rgba(0,255,255,0.2)] p-4 sm:p-6">
          <Feed channelID={guide.channelID} />
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
