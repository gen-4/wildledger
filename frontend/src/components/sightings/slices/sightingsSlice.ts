import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import api from '@/api/api';

import type { SightingsState } from '@/store/types';
import type { MySightingsResponse, Position, SightingProxyResponse , SightingResponse } from '@/components/sightings/types';

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
    Array<SightingProxyResponse >,
    void,
    { rejectValue: string }
>('sightings/get', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/sightings');
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: GET_SIGHTINGS_DEFAULT_ERROR_MSG }));
            return rejectWithValue(error.message || GET_SIGHTINGS_DEFAULT_ERROR_MSG);
        }
        const data: Array<SightingProxyResponse > = await response.json();
        return data;
    } catch (error) {
        return rejectWithValue((error as Error).message || GET_SIGHTINGS_DEFAULT_ERROR_MSG);
    }
});

export const getMySightings = createAsyncThunk<
    MySightingsResponse,
    { userId: number, page?: number, size?: number },
    { rejectValue: string }
>('mysightings/get', async ({ userId, page, size }, { rejectWithValue }) => {
    try {
        const response = await api.get(`/user/${userId}/sightings?page=${page}&size=${size}`);
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: GET_SIGHTINGS_DEFAULT_ERROR_MSG }));
            return rejectWithValue(error.message || GET_SIGHTINGS_DEFAULT_ERROR_MSG);
        }
        const data: MySightingsResponse = await response.json();
        return data;
    } catch (error) {
        return rejectWithValue((error as Error).message || GET_SIGHTINGS_DEFAULT_ERROR_MSG);
    }
});

const initialState: SightingsState = {
    location: { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng },
    sightings: [],
    mySightings: {
        sightings: [],
        empty: true,
        first: false,
        last: false,
        number: 0,
        numberOfElements: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0
    },
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
                state.mySightings.sightings = [{
                    id: action.payload.id,
                    individualId: action.payload.individualId,
                    name: action.payload.name,
                    imagePath: action.payload.imagePath,
                    location: { lat: action.payload.latitude, lng: action.payload.longitude },
                    sightingDate: action.payload.sightingDate ? new Date(action.payload.sightingDate) : undefined,
                    createdAt: action.payload.createdAt ? new Date(action.payload.createdAt) : undefined,
                    updatedAt: action.payload.updatedAt ? new Date(action.payload.updatedAt) : undefined,
                    status: action.payload.status,
                    identificationConfidence: action.payload.identificationConfidence,
                    reporter: action.payload.reporter,
                    hasIndividual: action.payload.hasIndividual,
                    individualReporter: action.payload.individualReporter,
                    species: action.payload.species,
                    individualCreatedAt: action.payload.individualCreatedAt ? new Date(action.payload.individualCreatedAt) : undefined,
                    individualUpdatedAt: action.payload.individualUpdatedAt ? new Date(action.payload.individualUpdatedAt) : undefined
                }, ...state.mySightings.sightings]
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

            .addCase(getMySightings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMySightings.fulfilled, (state, action) => {
                state.loading = false;
                const insertedSightingIds = new Set(state.mySightings.sightings.map(sighting => sighting.id));
                const sightingsToAdd = action.payload.content.filter(proxy => !insertedSightingIds.has(proxy.id));
                state.mySightings = {
                    sightings: [
                        ...state.mySightings.sightings,
                        ...sightingsToAdd.map((proxy) => ({
                            id: proxy.id,
                            individualId: proxy.individualId,
                            name: proxy.name,
                            imagePath: proxy.imagePath,
                            location: { lat: proxy.latitude, lng: proxy.longitude },
                            status: proxy.status,
                            createdAt: new Date(proxy.createdAt)
                        }))
                    ],
                    empty: action.payload.empty,
                    first: action.payload.first,
                    last: action.payload.last,
                    number: action.payload.number,
                    numberOfElements: action.payload.numberOfElements,
                    size: action.payload.size,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages
                }
            })
            .addCase(getMySightings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? GET_SIGHTINGS_DEFAULT_ERROR_MSG;
            })
    }
});

export const { setLocation } = sightings.actions;
export default sightings.reducer;