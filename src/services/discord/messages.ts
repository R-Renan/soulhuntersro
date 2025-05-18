import axios from "../axios";
import { SERVER_ID, CHANNEL_ID } from "../env";
import type { Message } from "../../types/discord";

export const getMessages = async (
  serverId: string = SERVER_ID,
  channelId: string = CHANNEL_ID
): Promise<Message[]> => {
  const messagesPath = `messages/${serverId}/${channelId}`;
  try {
    const response = await axios.get<Message[]>(messagesPath);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    throw new Error("Erro ao buscar mensagens");
  }
};

// Para compatibilidade com DiscordFeed (sem channelId)
export const getDefaultMessages = async (): Promise<Message[]> => {
  // Substitua pelo serverId e channelId padrão do DiscordFeed
  const defaultServerId = "1125412537308024904";
  const defaultChannelId = "1373605126820073612";
  return getMessages(defaultServerId, defaultChannelId);
};
