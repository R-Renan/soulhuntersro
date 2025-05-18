import React, { useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, posterUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startVideo = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play().catch((err) => {
        setError("Erro ao reproduzir o vídeo. Verifique o formato ou a URL.");
        console.error(err);
      });
      setIsPlaying(true);
    }
  };

  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleError = () => {
    setError(
      "Não foi possível carregar o vídeo. Verifique a URL ou o arquivo."
    );
  };

  return (
    <div className="mb-8 sm:mb-12 relative">
      {/* Fundo escurecido, abaixo do header */}
      {isPlaying && (
        <div
          className="fixed inset-0 bg-black/80 z-30"
          onClick={stopVideo}
        ></div>
      )}

      <div className="flex justify-center relative z-35">
        <div className="border border-cyan-400/50 bg-cyan-950/20 rounded-lg p-2 sm:p-3 md:p-4 shadow w-full max-w-[90vw] sm:max-w-[800px] mx-1 sm:mx-2">
          {error ? (
            <p className="text-center text-red-400 text-sm">{error}</p>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                className="w-full rounded-lg object-cover"
                onError={handleError}
                onEnded={stopVideo}
                controls={isPlaying}
                playsInline
              />
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-80 cursor-pointer"
                  onClick={startVideo}
                >
                  <div className="text-cyan-400 text-4xl sm:text-5xl">
                    <FaPlay />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
