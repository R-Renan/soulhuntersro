import axios from "../axios";
import { SERVER_ID } from "../env";

export async function setRoleReaction(
  channelId: string,
  messageId: string,
  roleId: string,
  emoji: string,
  userId?: string // opcional por enquanto
) {
  const { data } = await axios.post(`/role-reaction/${SERVER_ID}`, {
    channelId,
    messageId,
    roleId,
    emoji,
    userId,
  });
  return data;
}
