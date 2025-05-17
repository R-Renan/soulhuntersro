import { useEffect, useRef, useState } from "react";
import { login, register, setAuthToken } from "../../services/mysql";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../Alert";
import { AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { login: authLogin } = useAuth();

  // Fecha modal com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Limpa campos e alerta ao alternar entre modos
  useEffect(() => {
    setMode(initialMode);
    setFormData({ username: "", password: "", email: "", confirmPassword: "" });
    setAlert(null);
  }, [initialMode]);

  // Controla visibilidade do modal
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setShowModal(false), 300);
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setFormData({ username: "", password: "", email: "", confirmPassword: "" });
    setAlert(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Validação mínima, confia no backend para mensagens específicas
    if (mode === "login") {
      if (!formData.username || !formData.password) {
        return "Usuário e senha são obrigatórios";
      }
    } else {
      if (
        !formData.email ||
        !formData.username ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        return "Todos os campos são obrigatórios";
      }
      if (formData.password !== formData.confirmPassword) {
        return "As senhas não coincidem";
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    // Validação mínima do frontend
    const validationError = validateForm();
    if (validationError) {
      setAlert({ type: "error", message: validationError });
      return;
    }

    try {
      if (mode === "login") {
        const response = await login({
          username: formData.username,
          password: formData.password,
        });

        console.log("Resposta do login:", response); // Para depuração

        if (response.success && response.token) {
          setAuthToken(response.token);
          localStorage.setItem("token", response.token);
          authLogin(response.token);
          setAlert({ type: "success", message: "Login bem-sucedido!" });
          // Limpa os campos e o alerta após login bem-sucedido
          setFormData({
            username: "",
            password: "",
            email: "",
            confirmPassword: "",
          });
          setTimeout(() => {
            setAlert(null);
            onClose();
          }, 1000);
        } else {
          // Exibe a mensagem de erro do backend diretamente
          setAlert({
            type: "error",
            message: response.error || "Falha ao fazer login",
          });
        }
      } else {
        const response = await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });

        if (response.success) {
          setAlert({
            type: "success",
            message: response.message || "Conta criada com sucesso!",
          });
          setTimeout(() => toggleMode(), 1000);
        } else {
          setAlert({
            type: "error",
            message: response.error || "Falha ao criar conta",
          });
        }
      }
    } catch (error: unknown) {
      console.error("Erro ao processar a requisição:", error);
      setAlert({
        type: "error",
        message: "Erro de conexão com o servidor. Tente novamente mais tarde.",
      });
    }
  };

  return (
    <>
      {(isOpen || showModal) && (
        <div
          className="fixed inset-0 z-50 mt-32 flex items-center justify-center bg-[#0b1120]/40 backdrop-blur-sm "
          onClick={handleOutsideClick}
        >
          <div
            ref={modalRef}
            className={`bg-cyan-900/40 text-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl transform transition-all duration-300 ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4 text-cyan-100">
              {mode === "login" ? "Login" : "Criar Conta"}
            </h2>

            <AnimatePresence>
              {alert && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              )}
            </AnimatePresence>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "register" && (
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                />
              )}

              <input
                type="text"
                name="username"
                placeholder="Usuário"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
              />

              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
              />

              {mode === "register" && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                />
              )}

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold uppercase rounded-md transition-all duration-200 ${
                  mode === "login"
                    ? "bg-cyan-600 hover:bg-cyan-400 text-gray-900 ring-1 ring-cyan-500/30"
                    : "border border-yellow-400/60 text-yellow-300 bg-yellow-900/20 hover:bg-yellow-400 hover:text-gray-900"
                }`}
              >
                {mode === "login" ? "Entrar" : "Registrar"}
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-300">
              {mode === "login" ? (
                <>
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-cyan-300 hover:underline"
                  >
                    Criar Conta
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-yellow-300 hover:underline"
                  >
                    Entrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
