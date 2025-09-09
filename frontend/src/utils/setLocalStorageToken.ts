import { localStorageNameToken } from "../constants/localStorageNameToken";

export function setLocalStorageToken(token: string) {
	const modelStringJWTToken = `Bearer ${token}`;
	localStorage.setItem(localStorageNameToken, modelStringJWTToken);
}
