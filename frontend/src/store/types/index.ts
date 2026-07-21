import type { User } from "@/components/auth";
import type { Position } from "@/components/sightings/types";

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null | undefined;
};

export interface SightingsState {
    location: Position;
    loading: boolean;
    error: string | null | undefined;
};

export const MessageType = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

export interface Message {
    id: string;
    type: MessageType;
    message: string;
    autoDismiss: boolean;
    dismissing: boolean;
}

export interface MessagesState {
    messages: Array<Message>
};