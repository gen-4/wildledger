import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '@/api/api';

import type { SightingsState } from '@/store/types';

export const create = createAsyncThunk<
    void,
    { file: File, latitude: number, longitude: number, sightingDate: Date },
    { rejectValue: string }
>('sightings/create', async ({ file, latitude, longitude, sightingDate }, { rejectWithValue }) => {
    try {
        const response = await api.postFile('/sighting', file, { latitude, longitude, sightingDate });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Sighting creation failed' }));
            return rejectWithValue(error.message || 'Sighting creation failed');
        }
        return;
    } catch (error) {
        return rejectWithValue((error as Error).message || 'Sighting creation failed');
    }
});

const initialState: SightingsState = {
    loading: false,
    error: null
};

const sightings = createSlice({
    name: 'sightings',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(create.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(create.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(create.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? 'Sighting creation failed';
            })
    }
});

export default sightings.reducer;