import { localStorageNameRole } from "../constants/localStorageNameRole";

export function getLocalStorageToken() {
    return localStorage.getItem(localStorageNameRole);
}
