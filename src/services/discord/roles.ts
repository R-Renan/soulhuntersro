import axios from "../axios";
import { SERVER_ID } from "../env";
import type { Role } from "../../types/discord";

const ROLES_PATH = `roles/${SERVER_ID}`;
const MEMBERS_PATH = `members/${SERVER_ID}`;

export async function getRoles(): Promise<Role[]> {
  const { data } = await axios.get<Role[]>(ROLES_PATH);
  return data;
}

export async function addRole(userId: string, roleId: string) {
  const { data } = await axios.post(`${MEMBERS_PATH}/roles/add`, {
    userId,
    roleId,
  });
  return data;
}

export async function removeRole(userId: string, roleId: string) {
  const { data } = await axios.post(`${MEMBERS_PATH}/roles/remove`, {
    userId,
    roleId,
  });
  return data;
}
