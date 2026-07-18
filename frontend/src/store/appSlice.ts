import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { MessagesState, Message } from '@/store/types';

const appSlice = createSlice({
    name: 'global',
    initialState: {
        messages: []
    } as MessagesState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages = [...state.messages, {...action.payload, id: crypto.randomUUID()}];
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        dismissMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.map((message) => message.id === action.payload ? {...message, dismissing: true} : message);
        },
        clearMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter((message) => message.id !== action.payload);
        },
    }
});

export const { addMessage, dismissMessage, clearMessage, clearMessages } = appSlice.actions;

export default appSlice.reducer;