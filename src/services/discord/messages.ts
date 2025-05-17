import axios from "../axios";
import { SERVER_ID, CHANNEL_ID } from "../env";
import type { Message } from "../../types/discord";

const MESSAGES_PATH = `/messages/${SERVER_ID}/${CHANNEL_ID}`;

export async function getMessages(): Promise<Message[]> {
  const { data } = await axios.get<Message[]>(MESSAGES_PATH);
  return data;
}
