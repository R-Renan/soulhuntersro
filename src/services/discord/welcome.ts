import axios from "../axios";
import { SERVER_ID } from "../env";

const WELCOME_PATH = `/welcome-config/${SERVER_ID}`;

export async function getWelcomeConfig() {
  const { data } = await axios.get(WELCOME_PATH);
  if (!data || Object.keys(data).length === 0) {
    throw new Error("Nenhuma configuração encontrada para este servidor.");
  }
  return data;
}

export async function setWelcomeConfig(config: {
  channelId: string;
  message: string;
}) {
  const { data } = await axios.post(WELCOME_PATH, config);
  return data;
}
