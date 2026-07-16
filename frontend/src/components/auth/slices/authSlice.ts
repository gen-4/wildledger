import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '@/api/api';

import type { AuthResponse } from '@/components/auth/types';
import type { AuthState } from '@/store/types';


const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const login = createAsyncThunk<
  AuthResponse,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Login failed' }));
            return rejectWithValue(error.message || 'Login failed');
        }
        const data: AuthResponse = await response.json();
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        return data;
    } catch (error) {
        return rejectWithValue((error as Error).message || 'Login failed');
    }
});

export const register = createAsyncThunk<
  AuthResponse,
  { username: string; password: string },
  { rejectValue: string }
>('auth/register', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', { username, password });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      return rejectWithValue(error.message || 'Registration failed');
    }
    const data: AuthResponse = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message || 'Registration failed');
  }
});

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logout', async () => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    await api.post('/auth/logout', { refreshToken });
  } catch {
    // Ignore errors on logout
  } finally {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
});

export const refreshToken = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
    const response = await api.post('/auth/refresh', { refreshToken: refreshTokenValue }, false);
    if (!response.ok) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return rejectWithValue('Token refresh failed');
    }
    const data: AuthResponse = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    return data;
  } catch (error) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return rejectWithValue('Token refresh failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: typeof localStorage !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
    refreshToken: typeof localStorage !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
      });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
