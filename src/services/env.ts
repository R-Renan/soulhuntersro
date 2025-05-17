const API_URL = import.meta.env.VITE_API_URL;
const SERVER_ID = import.meta.env.VITE_DISCORD_SERVER_ID;
const CHANNEL_ID = import.meta.env.VITE_DISCORD_CHANNEL_ID;

if (!API_URL || !SERVER_ID || !CHANNEL_ID) {
  throw new Error("Variáveis de ambiente obrigatórias não foram definidas.");
}

export { API_URL, SERVER_ID, CHANNEL_ID };