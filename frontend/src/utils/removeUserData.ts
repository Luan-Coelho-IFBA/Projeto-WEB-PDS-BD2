import { localStorageNameRole } from "../constants/localStorageNameRole";
import { localStorageNameToken } from "../constants/localStorageNameToken";

export function removeUserDataLocalStorage() {
    localStorage.removeItem(localStorageNameRole);
    localStorage.removeItem(localStorageNameToken);
}
