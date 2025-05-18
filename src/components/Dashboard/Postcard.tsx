import React from "react";
// import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
// import { setRoleReaction } from "../../services/discord";

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

const PostCard: React.FC<Message & { messageId: string }> = ({
  author,
  content,
  attachments,
  // messageId,
  timestamp,
}) => {
  // const [likes, setLikes] = useState(0);
  // const [dislikes, setDislikes] = useState(0);

  // Apenas incrementa contadores locais
  // const handleLikeDislike = (type: "like" | "dislike") => {
  //   if (type === "like") setLikes((prev) => prev + 1);
  //   if (type === "dislike") setDislikes((prev) => prev + 1);
  // };

  // Apenas usado pelo botão Participar
  // const handleReact = useCallback(async () => {
  //   try {
  //     await setRoleReaction(
  //       "CHANNEL_ID_AQUI",
  //       messageId,
  //       "ROLE_ID_AQUI",
  //       "🔥",
  //       "123456789012345678"
  //     );
  //     alert("Reação registrada e cargo atribuído!");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Erro ao atribuir cargo.");
  //   }
  // }, [messageId]);

  return (
    <>
      <div className="relative border border-cyan-400/30 bg-cyan-950/20 rounded-lg p-4 flex flex-col gap-4 shadow-md hover:shadow-lg transition-all duration-300 w-full mx-auto">
        {/* Autor */}
        <div className="flex items-center gap-3">
          <img
            src={author.avatar}
            alt={author.username}
            className="w-10 h-10 rounded-full border-2 border-cyan-500/50"
          />
          <div>
            <p className="text-base font-semibold text-gray-200">
              {author.nickname || author.username}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(timestamp).toLocaleDateString("pt-BR")} às{" "}
              {new Date(timestamp).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Imagens anexadas */}
        {attachments.length > 0 && (
          <div className="flex flex-col gap-3">
            {attachments.map((att) => (
              <img
                key={att.url}
                src={att.url}
                alt={att.name}
                className="rounded-md w-full max-h-[400px] object-contain border border-gray-700/50 hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        )}

        {/* Conteúdo da mensagem */}
        {content && (
          <p className="text-base text-gray-200 leading-relaxed">
            {content.split(" ").map((word, idx) =>
              word.startsWith("@") ? (
                <span key={idx} className="text-cyan-400 font-medium">
                  {word}{" "}
                </span>
              ) : (
                word + " "
              )
            )}
          </p>
        )}

        {/* Botões de reação */}
        {/* <div className="flex items-center justify-between border-t border-gray-700/50 pt-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLikeDislike("like")}
              className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition"
              title="Curtir"
            >
              <FaThumbsUp className="text-lg" />
              <span className="text-sm">{likes}</span>
            </button>
            <button
              onClick={() => handleLikeDislike("dislike")}
              className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition"
              title="Descurtir"
            >
              <FaThumbsDown className="text-lg" />
              <span className="text-sm">{dislikes}</span>
            </button>
          </div>

          <button
            onClick={handleReact}
            className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition"
            title="Participar"
          >
            <span className="text-lg">🔥</span>
            <span className="text-sm">Participar</span>
          </button>
        </div> */}
      </div>
    </>
  );
};

export default PostCard;
