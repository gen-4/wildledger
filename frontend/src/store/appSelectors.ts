import type { RootState } from "@/store";

export const messagesSelector = ( state: RootState ) => state.app.messages; 