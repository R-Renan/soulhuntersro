import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthModal from "./modals/AuthModal";
import { useAuth } from "../contexts/AuthContext";
import { removeAuthToken } from "../services/mysql";
import { getServerStatus } from "../services/shro/status";
import { getServerStatusDisc } from "../services/discord";
import { Loader2 } from "lucide-react";

// Tipagem para o status do servidor (Minecraft)
interface ServerStatus {
  online: boolean;
  players: number;
  error: string;
}

// Tipagem para membros online do Discord
interface ServerStatusDisc {
  onlineMembers: number;
  error?: string;
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    online: false,
    players: 0,
    error: "",
  });
  const [serverStatusDisc, setServerStatusDisc] = useState<ServerStatusDisc>({
    onlineMembers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { isLoggedIn, logout } = useAuth();

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Buscar status do servidor (Minecraft e Discord)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Buscar status do servidor (Minecraft)
        const serverResponse = await getServerStatus();
        setServerStatus({
          online: serverResponse.success ? serverResponse.online : false,
          players: serverResponse.success ? serverResponse.players : 0,
          error: serverResponse.success
            ? ""
            : serverResponse.error || "Offline",
        });

        // Buscar membros online (Discord)
        const discStatus = await getServerStatusDisc();
        setServerStatusDisc(discStatus);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setServerStatus({
          online: false,
          players: 0,
          error: "Erro na conexão",
        });
        setServerStatusDisc({
          onlineMembers: 0,
          error: "Erro ao verificar membros online",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Inicializa AOS
  useEffect(() => {
    AOS.init({ once: true, duration: 600, easing: "ease-out" });
  }, []);

  const handleLogout = () => {
    logout();
    removeAuthToken();
    setMenuOpen(false);
  };

  // Componente de botão reutilizável
  const NavButton = ({
    text,
    onClick,
    color = "cyan",
    isMobile = false,
  }: {
    text: string;
    onClick?: () => void;
    color?: "cyan" | "yellow";
    isMobile?: boolean;
  }) => {
    const base = `${
      isMobile ? "w-full" : "px-4"
    } py-2 text-sm font-semibold uppercase rounded-lg border transition-all duration-300 text-center`;
    const colors =
      color === "cyan"
        ? "border-cyan-400/50 text-cyan-300 bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 hover:from-cyan-700/30 hover:to-cyan-600/30 hover:text-cyan-100"
        : "border-yellow-400/60 text-yellow-300 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 hover:from-yellow-700/30 hover:to-yellow-600/30 hover:text-yellow-100";

    return (
      <button onClick={onClick} className={`${base} ${colors}`}>
        {text}
      </button>
    );
  };

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      <header className="sticky top-0 z-40 w-full bg-[#0b1120]/80 backdrop-blur-lg px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div data-aos="fade-right">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group"
              aria-label="Voltar ao topo"
            >
              <img
                src="/images/logo.png"
                alt="Soul Hunters Logo"
                className="h-12 sm:h-16 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
              />
            </button>
          </div>

          <div className="md:hidden">
            <button
              ref={buttonRef}
              className="text-cyan-400 hover:text-cyan-200 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          <div
            className="hidden md:flex items-center gap-6"
            data-aos="fade-left"
          >
            {/* Status do Servidor (Minecraft) */}
            <div className="text-xs bg-cyan-900/10 rounded-lg px-3 py-2 text-gray-200">
              {isLoading ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Carregando...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Servidor:</span>
                    <span
                      className={`font-semibold ${
                        serverStatus.online
                          ? "text-green-400 animate-pulse"
                          : "text-red-400"
                      }`}
                    >
                      {serverStatus.online
                        ? "Online"
                        : serverStatus.error || "Offline"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium">Jogadores:</span>
                    <span className="text-cyan-400 font-semibold">
                      {serverStatus.players}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Membros Online (Discord) */}
            <div className="text-xs bg-cyan-900/10 rounded-lg px-3 py-2 text-gray-200">
              {isLoading ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Carregando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Membros Online:</span>
                  <span className="text-cyan-400 font-semibold">
                    {serverStatusDisc.onlineMembers}
                  </span>
                </div>
              )}
            </div>

            {/* Navegação */}
            <nav className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <a
                    href="/panel"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase rounded-lg border border-cyan-400/50 text-cyan-300 bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 hover:from-cyan-700/30 hover:to-cyan-600/30 hover:text-cyan-100 transition-all duration-300"
                  >
                    <FaUser />
                    Painel
                  </a>
                  <NavButton text="Sair" onClick={handleLogout} />
                </>
              ) : (
                <>
                  <NavButton
                    text="Login"
                    color="cyan"
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthModal(true);
                    }}
                  />
                  <NavButton
                    text="Registro"
                    color="yellow"
                    onClick={() => {
                      setAuthMode("register");
                      setShowAuthModal(true);
                    }}
                  />
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 px-4 pb-4 bg-[#0b1120]/90 rounded-lg"
            >
              <div className="text-xs bg-cyan-900/20 border border-cyan-400/50 rounded-lg px-3 py-2 text-gray-200 mb-4">
                {isLoading ? (
                  <div className="flex items-center gap-2 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                ) : (
                  <>
                    <p>
                      Servidor:{" "}
                      <span
                        className={`font-semibold ${
                          serverStatus.online
                            ? "text-green-400 animate-pulse"
                            : "text-red-400"
                        }`}
                      >
                        {serverStatus.online
                          ? "Online"
                          : serverStatus.error || "Offline"}
                      </span>
                    </p>
                    <p className="mt-1">
                      Jogadores:{" "}
                      <span className="text-cyan-400 font-semibold">
                        {serverStatus.players}
                      </span>
                    </p>
                    <p className="mt-1">
                      Membros Online:{" "}
                      <span className="text-cyan-400 font-semibold">
                        {serverStatusDisc.onlineMembers}
                      </span>
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <a
                      href="/panel"
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold uppercase rounded-lg border border-cyan-400/50 text-cyan-300 bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 hover:from-cyan-700/30 hover:to-cyan-600/30 hover:text-cyan-100 transition-all duration-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUser />
                      Painel
                    </a>
                    <NavButton text="Sair" onClick={handleLogout} isMobile />
                  </>
                ) : (
                  <>
                    <NavButton
                      text="Login"
                      onClick={() => {
                        setAuthMode("login");
                        setShowAuthModal(true);
                        setMenuOpen(false);
                      }}
                      isMobile
                    />
                    <NavButton
                      text="Registro"
                      onClick={() => {
                        setAuthMode("register");
                        setShowAuthModal(true);
                        setMenuOpen(false);
                      }}
                      isMobile
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
