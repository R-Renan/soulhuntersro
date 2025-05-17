import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthModal from "./modals/AuthModal";
import { useAuth } from "../contexts/AuthContext";
import { removeAuthToken } from "../services/mysql";
import { getServerStatus } from "../services/shro/status";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    players: number;
    error?: string;
  }>({ online: false, players: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { isLoggedIn, logout } = useAuth();

  // Busca status do servidor ao montar o componente
  useEffect(() => {
    const fetchServerStatus = async () => {
      const response = await getServerStatus();
      if (response.success) {
        setServerStatus({
          online: response.online,
          players: response.players,
        });
      } else {
        setServerStatus({
          online: false,
          players: 0,
          error: response.error || "Offline",
        });
      }
    };

    fetchServerStatus();

    // Opcional: atualizar a cada 30 segundos
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Inicializa AOS
  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: "ease-out" });
  }, []);

  const handleLogout = () => {
    logout();
    removeAuthToken();
    setMenuOpen(false);
  };

  const NavButton = ({
    text,
    color = "cyan",
    onClick,
  }: {
    text: string;
    color?: "cyan" | "yellow";
    onClick?: () => void;
  }) => {
    const base = `flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold uppercase rounded-md transition-all duration-200 border`;
    const colors =
      color === "cyan"
        ? "border-cyan-400/50 text-cyan-300 bg-cyan-900/20 hover:bg-cyan-400 hover:text-gray-900"
        : "border-yellow-400/60 text-yellow-300 bg-yellow-900/20 hover:bg-yellow-400 hover:text-gray-900";
    return (
      <button onClick={onClick} className={`${base} ${colors}`}>
        {text}
      </button>
    );
  };

  const MobileNavButton = ({
    text,
    color = "cyan",
    onClick,
  }: {
    text: string;
    color?: "cyan" | "yellow";
    onClick?: () => void;
  }) => {
    const base =
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold border";
    const colors =
      color === "cyan"
        ? "border-cyan-400/50 text-cyan-300 bg-cyan-900/20 hover:bg-cyan-400 hover:text-gray-900"
        : "border-yellow-400/60 text-yellow-300 bg-yellow-900/20 hover:bg-yellow-400 hover:text-gray-900";
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

      <header className="sticky top-0 z-40 w-full bg-[#0b1120]/40 backdrop-blur-md shadow-md px-2 sm:px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="flex items-center"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <a href="#home">
              <img
                src="/images/logo.png"
                alt="Soul Hunters Logo"
                className="h-10 ml-2 sm:h-28 md:h-28 w-auto drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              />
            </a>
          </div>

          <div className="md:hidden">
            <button
              className="text-cyan-400 hover:text-cyan-200 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          <div
            className="hidden md:flex items-center gap-6 lg:gap-10"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="text-xs lg:text-sm text-gray-300 space-y-1 text-right">
              <div className="flex items-center gap-2">
                <span>Status:</span>
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
              <div className="flex items-center gap-2">
                <span>Jogadores:</span>
                <span className="text-blue-400 font-medium">
                  {serverStatus.players}
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-3 lg:gap-4">
              {isLoggedIn ? (
                <>
                  <a
                    href="/panel"
                    className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold uppercase border border-cyan-400/50 text-cyan-300 rounded-md bg-cyan-900/20 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-200"
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

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 px-4 pb-4"
              data-aos="fade-down"
              data-aos-delay="100"
            >
              <div className="mt-4 text-xs text-gray-300 space-y-1">
                <p>
                  Status:{" "}
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
                <p>
                  Jogadores:{" "}
                  <span className="text-blue-400">{serverStatus.players}</span>
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                {isLoggedIn ? (
                  <>
                    <a
                      href="/panel"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-400/50 text-cyan-300 bg-cyan-900/20 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-200 text-sm font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUser />
                      Painel
                    </a>
                    <MobileNavButton
                      text="Sair"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <MobileNavButton
                      text="Login"
                      onClick={() => {
                        setAuthMode("login");
                        setShowAuthModal(true);
                        setMenuOpen(false);
                      }}
                    />
                    <MobileNavButton
                      text="Registro"
                      color="yellow"
                      onClick={() => {
                        setAuthMode("register");
                        setShowAuthModal(true);
                        setMenuOpen(false);
                      }}
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
