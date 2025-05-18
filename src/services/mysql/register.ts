import axiosInstance from "../axios";

interface RegisterResponse {
  success: boolean;
  message?: string;
  ticketCode?: string;
  error?: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export const register = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(
      "mysql/register",
      data
    );
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao registrar";
    return {
      success: false,
      error: errorMessage,
    };
  }
};
