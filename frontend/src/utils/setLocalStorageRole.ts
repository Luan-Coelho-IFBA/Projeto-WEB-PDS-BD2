import { localStorageNameRole } from "../constants/localStorageNameRole";

export function setLocalStorageRole(role: string) {
    localStorage.setItem(localStorageNameRole, role);
}
