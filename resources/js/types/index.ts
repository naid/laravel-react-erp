export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; errors?: any }>;
    logout: () => Promise<void>;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginErrors {
    email?: string[];
    password?: string[];
}
