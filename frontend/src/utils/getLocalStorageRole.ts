import { localStorageNameRole } from "../constants/localStorageNameRole";

export function getLocalStorageRole() {
    return localStorage.getItem(localStorageNameRole);
}
