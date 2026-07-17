import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import authReducer from '@/components/auth/slices/authSlice';
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
        clearMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter((message) => message.id !== action.payload);
        },
    }
});

const store = configureStore({
    reducer: {
        auth: authReducer,
        app: appSlice.reducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { addMessage, clearMessage, clearMessages } = appSlice.actions;

export default store;