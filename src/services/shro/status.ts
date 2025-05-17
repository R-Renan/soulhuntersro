import axiosInstance from "../axios";

interface ServerStatus {
  success: boolean;
  online: boolean;
  players: number;
  error?: string;
}

export const getServerStatus = async (): Promise<ServerStatus> => {
  try {
    const response = await axiosInstance.get<ServerStatus>("/shro/status", {
      validateStatus: (status) => status >= 200 && status < 600,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro na requisição de status do servidor:", error);
    return {
      success: false,
      online: false,
      players: 0,
      error: "Erro ao conectar com o servidor",
    };
  }
};
