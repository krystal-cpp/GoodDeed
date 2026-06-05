export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface GoodDeed {
    id: number;
    title: string;
    description?: string;
    status: boolean;
    ownerId: number;
    createdAt: string;
    completedAt?: string;
    owner?: {
        id: number;
        username: string;
        name: string;
    };
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}