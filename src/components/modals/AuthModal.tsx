import { useEffect, useRef, useState } from "react";
import {
  login,
  register,
  regenerateTicket,
  setAuthToken,
} from "../../services/mysql";
import { useAuth } from "../../contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaSignInAlt,
  FaUserPlus,
  FaCopy,
  FaRedo,
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

interface FormData {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
}

// Componente reutilizável para campos de input
interface InputFieldProps {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
  hint?: string; // Mensagem informativa (ex.: "Utilize o mesmo nome do Discord!")
  validate?: (value: string, formData?: FormData) => string | null; // Função de validação
  formData?: FormData; // Para validações que dependem de outros campos (ex.: confirmPassword)
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  label,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  hint,
  validate,
  formData,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (validate) {
      setError(validate(e.target.value, formData));
    }
  };

  return (
    <div className="relative w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-cyan-200 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/60">
          {icon}
        </div>
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          aria-describedby={`${name}-hint ${name}-error`}
          className={`w-full pl-10 pr-4 py-2 bg-[#0b1120]/80 border ${
            error ? "border-red-500/50" : "border-cyan-500/30"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-200 placeholder-gray-500 transition-all duration-200 hover:border-cyan-400/50 ${
            error ? "shadow-[0_0_8px_rgba(239,68,68,0.3)]" : ""
          }`}
        />
      </div>
      {(isFocused || !value) && !error && hint && (
        <p
          id={`${name}-hint`}
          className="mt-0 p-1  text-xs text-gray-400 transition-opacity duration-200"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-xs text-red-400 transition-opacity duration-200"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "ticket">(
    initialMode
  );
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "ticket";
    message: string;
    ticketCode?: string;
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

  // Limpa campos e alerta ao alternar modos
  useEffect(() => {
    setMode(initialMode);
    setFormData({ username: "", password: "", email: "", confirmPassword: "" });
    setAlert(null);
  }, [initialMode]);

  // Controla visibilidade do modal
  useEffect(() => {
    setShowModal(isOpen);
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

  // Funções de validação para cada campo
  const validateEmail = (value: string) => {
    if (!value) return "O email é obrigatório.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Por favor, insira um email válido.";
    }
    return null;
  };

  const validateUsername = (value: string) => {
    if (!value) return "O nome de usuário é obrigatório.";
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(value)) {
      return "O nome deve ter 3-32 caracteres e conter apenas letras, números ou _.";
    }
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return "A senha é obrigatória.";
    if (value.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    return null;
  };

  const validateConfirmPassword = (value: string, formData?: FormData) => {
    if (!value) return "A confirmação da senha é obrigatória.";
    if (formData && value !== formData.password) {
      return "As senhas não coincidem.";
    }
    return null;
  };

  const validateForm = () => {
    if (mode === "login") {
      if (validateUsername(formData.username)) {
        return validateUsername(formData.username);
      }
      if (validatePassword(formData.password)) {
        return validatePassword(formData.password);
      }
    } else if (mode === "register") {
      if (validateEmail(formData.email)) {
        return validateEmail(formData.email);
      }
      if (validateUsername(formData.username)) {
        return validateUsername(formData.username);
      }
      if (validatePassword(formData.password)) {
        return validatePassword(formData.password);
      }
      if (validateConfirmPassword(formData.confirmPassword, formData)) {
        return validateConfirmPassword(formData.confirmPassword, formData);
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

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

        if (response.success && response.token) {
          setAuthToken(response.token);
          localStorage.setItem("token", response.token);
          authLogin(response.token);
          setAlert({ type: "success", message: "Login bem-sucedido!" });
          setTimeout(() => {
            setAlert(null);
            onClose();
          }, 800);
        } else if (response.ticketCode) {
          setAlert({
            type: "ticket",
            message:
              "Conta pendente. Envie este código no canal #ticket do Discord:",
            ticketCode: response.ticketCode,
          });
        } else {
          setAlert({
            type: "error",
            message: response.error || "Falha ao fazer login",
          });
        }
      } else if (mode === "register") {
        const response = await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });

        if (response.success && response.ticketCode) {
          setAlert({
            type: "ticket",
            message:
              "Conta criada! Envie este código no canal #ticket do Discord:",
            ticketCode: response.ticketCode,
          });
          setMode("ticket");
        } else {
          setAlert({
            type: "error",
            message: response.error || "Falha ao criar conta",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      setAlert({
        type: "error",
        message: "Erro de conexão com o servidor. Tente novamente mais tarde.",
      });
    }
  };

  const handleRegenerateTicket = async () => {
    try {
      const response = await regenerateTicket({
        username: formData.username,
        password: formData.password,
      });

      if (response.success && response.ticketCode) {
        setAlert({
          type: "ticket",
          message:
            "Novo código gerado! Envie este código no canal #ticket do Discord:",
          ticketCode: response.ticketCode,
        });
      } else {
        setAlert({
          type: "error",
          message: response.error || "Falha ao gerar novo código",
        });
      }
    } catch (error) {
      console.error("Erro ao regenerar ticket:", error);
      setAlert({
        type: "error",
        message: "Erro de conexão com o servidor. Tente novamente mais tarde.",
      });
    }
  };

  const handleCopyCode = () => {
    if (alert?.ticketCode) {
      navigator.clipboard.writeText(alert.ticketCode);
      setAlert({
        ...alert,
        message: "Código copiado! Envie no canal #ticket do Discord:",
      });
      setTimeout(() => {
        if (alert.ticketCode) {
          setAlert({
            type: "ticket",
            message:
              mode === "login"
                ? "Conta pendente. Envie este código no canal #ticket do Discord:"
                : "Conta criada! Envie este código no canal #ticket do Discord:",
            ticketCode: alert.ticketCode,
          });
        }
      }, 1000);
    }
  };

  const handleGoToLogin = () => {
    setMode("login");
    setAlert(null);
  };

  return (
    <>
      {(isOpen || showModal) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]/80 backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-gradient-to-b from-cyan-900/50 to-cyan-800/50 border border-cyan-400/30 text-white rounded-xl p-6 w-full max-w-md mx-4 shadow-[0_0_20px_rgba(0,255,255,0.4)]"
          >
            <h2 className="text-2xl font-bold mb-4 text-cyan-100">
              {mode === "login"
                ? "Entrar"
                : mode === "register"
                ? "Criar Conta"
                : "Código de Ativação"}
            </h2>

            <AnimatePresence>
              {alert && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-lg mb-4 ${
                    alert.type === "success"
                      ? "bg-green-500/20 text-green-200"
                      : alert.type === "error"
                      ? "bg-red-500/20 text-red-200"
                      : "bg-cyan-500/20 text-cyan-100"
                  }`}
                >
                  <p>{alert.message}</p>
                  {alert.ticketCode && (
                    <>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-mono text-lg bg-[#0b1120]/50 px-3 py-1 rounded">
                          {alert.ticketCode}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="p-2 bg-cyan-600/50 hover:bg-cyan-500/50 rounded transition-colors"
                          title="Copiar código"
                        >
                          <FaCopy />
                        </button>
                        {(mode === "login" || mode === "ticket") && (
                          <button
                            onClick={handleRegenerateTicket}
                            className="p-2 bg-cyan-600/50 hover:bg-cyan-500/50 rounded transition-colors"
                            title="Gerar novo código"
                          >
                            <FaRedo />
                          </button>
                        )}
                      </div>
                      <div className="mt-3 p-3 bg-[#0b1120]/70 rounded-lg border border-cyan-600/30">
                        <h3 className="text-md font-bold text-cyan-400 mb-2">
                          🎮 Como ingressar na Soul Hunters
                        </h3>
                        <ul className="text-gray-200 text-sm space-y-1">
                          <li>
                            📑 Leia as{" "}
                            <a
                              href="discord://discord.com/channels/1125412537308024904/1369401749823295658"
                              className="text-cyan-400 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📑 | As-Regras
                            </a>{" "}
                            no Discord.
                          </li>
                          <li>
                            ✅ Verifique-se em{" "}
                            <a
                              href="discord://discord.com/channels/1125412537308024904/1369401749823295658"
                              className="text-cyan-400 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ✅ | Verifique-se
                            </a>
                            .
                          </li>
                          <li>
                            🎫 Envie o ticket no{" "}
                            <a
                              href="discord://discord.com/channels/1125412537308024904/1369401749823295658"
                              className="text-cyan-400 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              🎫 | Ticket
                            </a>{" "}
                            após os passos.
                          </li>
                        </ul>
                        <p className="text-gray-400 mt-2 text-xs">
                          ⚠️ Siga os passos antes de usar o ticket!
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {mode !== "ticket" ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === "register" && (
                  <InputField
                    type="email"
                    name="email"
                    label=""
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    icon={<FaEnvelope size={16} />}
                    required
                    validate={validateEmail}
                  />
                )}

                {mode === "register" && (
                  <InputField
                    type="text"
                    name="username"
                    label=""
                    placeholder="Usuário"
                    value={formData.username}
                    onChange={handleInputChange}
                    icon={<FaUser size={16} />}
                    required
                    hint="Utilize o mesmo nome do Discord!"
                    validate={validateUsername}
                  />
                )}

                {mode === "login" && (
                  <InputField
                    type="text"
                    name="username"
                    label=""
                    placeholder="Usuário"
                    value={formData.username}
                    onChange={handleInputChange}
                    icon={<FaUser size={16} />}
                    required
                    validate={validateUsername}
                  />
                )}

                <InputField
                  type="password"
                  name="password"
                  label=""
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleInputChange}
                  icon={<FaLock size={16} />}
                  required
                  validate={validatePassword}
                />

                {mode === "register" && (
                  <InputField
                    type="password"
                    name="confirmPassword"
                    label=""
                    placeholder="Confirmar Senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    icon={<FaLock size={16} />}
                    required
                    validate={validateConfirmPassword}
                    formData={formData}
                  />
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold uppercase rounded-lg bg-gradient-to-r from-cyan-600/50 to-cyan-500/50 border border-cyan-400/30 text-cyan-100 hover:from-cyan-500/60 hover:to-cyan-400/60 transition-all duration-200"
                >
                  {mode === "login" ? (
                    <>
                      <FaSignInAlt /> Entrar
                    </>
                  ) : (
                    <>
                      <FaUserPlus /> Registrar
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <a
                  href="https://discord.com/channels/1125412537308024904/1369401749823295658"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold uppercase rounded-lg bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-400/30 text-yellow-300 hover:from-yellow-500/60 hover:to-yellow-400/60 transition-all duration-200"
                >
                  # Envie seu Ticket
                </a>
                <button
                  onClick={handleGoToLogin}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold uppercase rounded-lg bg-gradient-to-r from-cyan-600/50 to-cyan-500/50 border border-cyan-400/30 text-cyan-100 hover:from-cyan-500/60 hover:to-cyan-400/60 transition-all duration-200"
                >
                  <FaArrowRight /> Ir para Login
                </button>
              </div>
            )}

            {mode !== "ticket" && (
              <div className="mt-4 text-sm text-center text-gray-400">
                {mode === "login" ? (
                  <>
                    Não tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-cyan-200 hover:text-cyan-100 hover:underline transition-colors duration-200"
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
                      className="text-cyan-200 hover:text-cyan-100 hover:underline transition-colors duration-200"
                    >
                      Entrar
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
