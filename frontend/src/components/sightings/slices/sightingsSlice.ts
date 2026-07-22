import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import api from '@/api/api';

import type { SightingsState } from '@/store/types';
import type { Position, SightingProxyReponse, SightingResponse } from '@/components/sightings/types';

import { 
    CREATE_SIGHTING_DEFAULT_ERROR_MSG, 
    DEFAULT_LOCATION, 
    GET_SIGHTINGS_DEFAULT_ERROR_MSG 
} from '@/components/sightings/constants';

export const create = createAsyncThunk<
    SightingResponse,
    { file: File, latitude: number, longitude: number, sightingDate: Date },
    { rejectValue: string }
>('sightings/create', async ({ file, latitude, longitude, sightingDate }, { rejectWithValue }) => {
    try {
        const response = await api.postFile('/sighting', file, { latitude, longitude, sightingDate });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: CREATE_SIGHTING_DEFAULT_ERROR_MSG }));
            return rejectWithValue(error.message || CREATE_SIGHTING_DEFAULT_ERROR_MSG);
        }
        const data: SightingResponse = await response.json();
        return data;
    } catch (error) {
        return rejectWithValue((error as Error).message || CREATE_SIGHTING_DEFAULT_ERROR_MSG);
    }
});

export const getSightings = createAsyncThunk<
    Array<SightingProxyReponse>,
    void,
    { rejectValue: string }
>('sightings/get', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/sightings');
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: GET_SIGHTINGS_DEFAULT_ERROR_MSG }));
            return rejectWithValue(error.message || GET_SIGHTINGS_DEFAULT_ERROR_MSG);
        }
        const data: Array<SightingProxyReponse> = await response.json();
        return data;
    } catch (error) {
        return rejectWithValue((error as Error).message || GET_SIGHTINGS_DEFAULT_ERROR_MSG);
    }
});

const initialState: SightingsState = {
    location: { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng },
    sightings: [],
    loading: false,
    error: null
};

const sightings = createSlice({
    name: 'sightings',
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<Position>) => {
            state.location = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(create.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(create.fulfilled, (state, action) => {
                state.loading = false;
                state.sightings = [...state.sightings, {
                    id: action.payload.id,
                    individualId: action.payload.individualId,
                    name: action.payload.name,
                    imagePath: action.payload.imagePath,
                    location: { lat: action.payload.latitude, lng: action.payload.longitude },
                    sightingDate: action.payload.sightingDate,
                    createdAt: action.payload.createdAt,
                    updatedAt: action.payload.updatedAt,
                    status: action.payload.status,
                    identificationConfidence: action.payload.identificationConfidence,
                    reporter: action.payload.reporter,
                    hasIndividual: action.payload.hasIndividual,
                    individualReporter: action.payload.individualReporter,
                    species: action.payload.species,
                    individualCreatedAt: action.payload.individualCreatedAt,
                    individualUpdatedAt: action.payload.individualUpdatedAt
                }]
            })
            .addCase(create.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? CREATE_SIGHTING_DEFAULT_ERROR_MSG;
            })

            .addCase(getSightings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSightings.fulfilled, (state, action) => {
                state.loading = false;
                state.sightings = action.payload.map((proxy) => ({
                    id: proxy.id,
                    individualId: proxy.individualId,
                    name: proxy.name,
                    imagePath: proxy.imagePath,
                    location: { lat: proxy.latitude, lng: proxy.longitude }
                }))
            })
            .addCase(getSightings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? GET_SIGHTINGS_DEFAULT_ERROR_MSG;
            })
    }
});

export const { setLocation } = sightings.actions;
export default sightings.reducer;