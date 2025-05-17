import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500/20" : "bg-red-500/20";
  const textColor = type === "success" ? "text-green-300" : "text-red-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 p-3 rounded-md ${bgColor} ${textColor} flex items-center justify-between text-sm shadow-md`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-gray-300 hover:text-white transition-colors"
        aria-label="Fechar alerta"
      >
        <FaTimes size={14} />
      </button>
    </motion.div>
  );
};

export default Alert;
