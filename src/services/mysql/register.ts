import axiosInstance from "../axios";

interface RegisterResponse {
  success: boolean;
  message?: string;
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
      "mysql/register", // 🔧 Use /mysql/register, se a rota for essa
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
