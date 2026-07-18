import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/components/auth/slices/authSlice';
import appReducer from '@/store/appSlice';



const store = configureStore({
    reducer: {
        auth: authReducer,
        app: appReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;