import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMessages } from "../services/discord";
import PostCard from "./Dashboard/Postcard";
import { FaBook, FaArrowLeft } from "react-icons/fa";

interface Message {
  id: string;
  author: {
    id: string;
    username: string;
    nickname: string | null;
    avatar: string;
  };
  content: string;
  timestamp: string;
  attachments: { url: string; name: string }[];
}

const ITEMS_PER_PAGE = 6;
const SERVER_ID = "1125412537308024904"; // Mesmo serverId do getDefaultMessages

const guides = [
  { title: "Guia MVP - Torre", channelID: "1137366142873243769" },
  { title: "Guia de Instâncias", channelID: "1365325330234998794" },
  { title: "Guia de Consumíveis", channelID: "1365109607655149628" },
  { title: "Tutorias", channelID: "1365109948639350895" },
];

const GuidePage: React.FC = () => {
  const { channelID } = useParams<{ channelID: string }>();
  const guide = guides.find((g) => g.channelID === channelID);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelID) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessages(SERVER_ID, channelID);
        setMessages(data);
      } catch (err) {
        console.error(err);
        setError(
          "Erro ao carregar mensagens do guia. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [channelID]);

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
  const paginatedMessages = messages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!guide) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b1120]">
        <p className="text-cyan-400 text-lg">Guia não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Link Voltar */}
        <div className="mb-4">
          <a
            href="/"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-200 text-sm sm:text-base transition-colors duration-200"
          >
            <FaArrowLeft /> Voltar
          </a>
        </div>
        <h1 className="flex justify-center text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 mb-6 sm:mb-8 items-center gap-3 border-b border-cyan-400/20 pb-2">
          <FaBook /> {guide.title}
        </h1>
        <div className="border border-cyan-400/30 bg-cyan-950/20 rounded-lg shadow-[0_0_10px_rgba(0,255,255,0.2)] p-4 sm:p-6">
          {loading && (
            <p className="text-gray-400 text-base text-center">
              Carregando mensagens...
            </p>
          )}

          {error && (
            <p className="text-red-400 text-base text-center">{error}</p>
          )}

          {!loading && !error && messages.length === 0 && (
            <p className="text-gray-400 text-base text-center">
              Nenhuma mensagem encontrada para este guia.
            </p>
          )}

          {!loading && !error && paginatedMessages.length > 0 && (
            <div className="flex flex-col gap-6">
              {paginatedMessages.map((message, i) => (
                <div
                  key={message.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <PostCard {...message} messageId={message.id} />
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isActive = currentPage === page;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded border text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-800 text-cyan-300 hover:bg-cyan-700 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
