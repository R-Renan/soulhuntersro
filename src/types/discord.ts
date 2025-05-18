export interface Role {
  id: string;
  name: string;
  color: string;
  position: number;
}

export interface Member {
  id: string;
  username: string;
  nickname: string | null;
  roles: string[];
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  activity?: string;
}

export interface Message {
  id: string;
  author: {
    id: string;
    username: string;
    nickname: string | null;
    avatar: string;
  };
  content: string;
  timestamp: string; // ISO string
  attachments: {
    url: string;
    name: string;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ServerInfo {
  id: string;
  name: string;
  icon: string | null;
  owner: string;
  createdAt: string;
  features: string[];
}
