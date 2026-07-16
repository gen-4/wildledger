import type { RootState } from "@/store";
import { RoleOptions } from "@/components/auth/types";

export const refreshTokenSelector = ( state: RootState ) => state.auth.refreshToken; 

export const isAuthenticatedSelector = ( state: RootState ) => !!state.auth.user;

export const userSelector = ( state: RootState ) => state.auth.user;

export const isUserSelector = ( state: RootState ) => {
    return state.auth.user && state.auth.user.roles.some( (role) => role.role === RoleOptions.USER);
}

export const isAdminSelector = ( state: RootState ) => 
    state.auth.user && state.auth.user.roles.some( (role) => role.role === RoleOptions.ADMIN);
