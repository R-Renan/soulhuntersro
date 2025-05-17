import axios from "../axios";
import { SERVER_ID } from "../env";
import type { Member } from "../../types/discord";

const MEMBERS_PATH = `/members/${SERVER_ID}`;

export async function getMembers(): Promise<Member[]> {
  const { data } = await axios.get<Member[]>(MEMBERS_PATH);
  return data;
}

export async function banMember(userId: string) {
  const { data } = await axios.post(`${MEMBERS_PATH}/ban`, { userId });
  return data;
}

export async function kickMember(userId: string) {
  const { data } = await axios.post(`${MEMBERS_PATH}/kick`, { userId });
  return data;
}
