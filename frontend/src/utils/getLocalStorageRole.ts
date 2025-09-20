import { localStorageNameRole } from "../constants/localStorageNameRole";

type RoleTypes = "ADMIN" | "JORNALISTA" | "LEITOR";
export function getLocalStorageRole() {
    const role = localStorage.getItem(localStorageNameRole);

    if (role) return role as RoleTypes;
    else return null;
}
