import { FaDiscord, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0b1120]/40 backdrop-blur-md shadow-md text-white mt-8 py-6 ">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
        <p className="text-sm text-gray-400">© 2025 [DEV] Soul Hunters RO ©.</p>

        <div className="flex gap-4 items-center text-xl">
          <a
            href="https://discord.gg/Y3NRZsXvwc"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition animate-bounce"
            title="Discord"
          >
            <FaDiscord />
          </a>
          <a
            href="https://github.com/R-Renan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition animate-bounce"
            title="GitHub"
          >
            <FaGithub />
          </a>
          <img
            src="/images/icon.ico"
            alt="Icone Personalizado"
            className="w-6 h-6 animate-bounce"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
