import axios from "../axios";
import { SERVER_ID } from "../env";

// Tipagem para membros online do Discord
interface ServerStatusDisc {
  onlineMembers: number;
  error?: string;
}

// Tipagem para informações do servidor
interface ServerInfo {
  id: string;
  name: string;
  icon: string | null;
  owner: string;
  createdAt: string;
  features: string[];
}

// Tipagem para membros do servidor
interface MemberInfo {
  id: string;
  username: string;
  role: string;
  avatar: string | null;
}

// Buscar membros online
export async function getServerStatusDisc(): Promise<ServerStatusDisc> {
  try {
    const { data } = await axios.get<ServerStatusDisc>("/status");
    return data;
  } catch {
    console.error("Erro ao buscar membros online do Discord:", {
      message: "error.message",
      status: "error.response?.status",
      data: "error.response?.data",
    });
    return { onlineMembers: 0, error: "Erro ao verificar membros online" };
  }
}

// Buscar informações do servidor
export async function getServerInfo(): Promise<ServerInfo> {
  try {
    const { data } = await axios.get<ServerInfo>(`/server/${SERVER_ID}`);
    return data;
  } catch (error) {
    console.error("Erro ao buscar informações do servidor:", error);
    throw new Error("Servidor não encontrado");
  }
}

// Buscar lista de membros do servidor
export async function getServerMembers(): Promise<MemberInfo[]> {
  try {
    const { data } = await axios.get<MemberInfo[]>(`/members/${SERVER_ID}`);
    return data;
  } catch (error) {
    console.error("Erro ao buscar membros do servidor:", error);
    return [];
  }
}
