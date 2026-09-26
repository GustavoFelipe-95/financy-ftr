export type UserType = {
    id: string;
    name: string;
    email: string;
}

export type AuthContextType = {
    user: UserType | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: UserType) => void;
    logout: () => void;
    updateUser: (user: Pick<UserType, 'name'>) => void;
}

export type UpdateProfileInput = {
    name: string;
}
