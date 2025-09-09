import { localStorageNameToken } from "../constants/localStorageNameToken";

export function getLocalStorageToken() {
	return localStorage.getItem(localStorageNameToken);
}
