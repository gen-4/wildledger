export interface Role {
    id: number;
    role: string;
}

export interface User {
    id: number;
	username: string;
	registerDate: Date;
	lastLogin: Date;
    updatedAt: Date;
    roles: Array<Role>;
};

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}