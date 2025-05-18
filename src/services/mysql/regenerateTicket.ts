import axiosInstance from "../axios";

interface RegenerateTicketResponse {
  success: boolean;
  message?: string;
  ticketCode?: string;
  error?: string;
}

interface RegenerateTicketData {
  username: string;
  password: string;
}

export const regenerateTicket = async (
  data: RegenerateTicketData
): Promise<RegenerateTicketResponse> => {
  try {
    const response = await axiosInstance.post<RegenerateTicketResponse>(
      "mysql/regenerate-ticket",
      data
    );
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao gerar novo código";
    return {
      success: false,
      error: errorMessage,
    };
  }
};
