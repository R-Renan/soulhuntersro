import axiosInstance from "../axios";

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: { userid: string; email: string; level: number };
  ticketCode?: string;
  error?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "mysql/login",
      credentials,
      {
        validateStatus: (status) => status >= 200 && status < 600,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro na requisição de login:", error);
    return {
      success: false,
      error: "Erro ao conectar com o servidor",
    };
  }
};

export const setAuthToken = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};
