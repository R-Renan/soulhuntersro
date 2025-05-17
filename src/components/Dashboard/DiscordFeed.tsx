import React, { useState, useEffect } from "react";
import { GrAnnounce } from "react-icons/gr";
import { getMessages } from "../../services/discord";
import PostCard from "./Postcard";

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

const ITEMS_PER_PAGE = 2;

const DiscordFeed: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar mensagens. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
  const paginatedMessages = messages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="text-white px-4 sm:px-0">
      <div className="max-w-4xl mx-auto flex flex-col">
        {/* Título */}
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-cyan-400 drop-shadow">
          <div className="flex justify-center items-center gap-3 border-b border-cyan-400/20 pb-2">
            <GrAnnounce />
            Feed do Discord
          </div>
        </h2>

        {/* Estados de carregamento / erro / vazio */}
        {loading && (
          <p className="text-gray-400 text-base text-center">
            Carregando mensagens...
          </p>
        )}

        {error && <p className="text-red-400 text-base text-center">{error}</p>}

        {!loading && !error && messages.length === 0 && (
          <p className="text-gray-400 text-base text-center">
            Nenhuma mensagem encontrada.
          </p>
        )}

        {/* Mensagens renderizadas */}
        {!loading && !error && paginatedMessages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {paginatedMessages.map((message, i) => (
              <div
                key={message.id}
                className="flex justify-center"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <PostCard {...message} messageId={message.id} />
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
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
    </section>
  );
};

export default DiscordFeed;
