export type RoleTypes = "ADMIN" | "JORNALISTA" | "LEITOR";

export type User = {
    name: string;
    email: string;
    token: string;
    role: RoleTypes;
};
