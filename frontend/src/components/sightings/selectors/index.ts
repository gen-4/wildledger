import type { RootState } from "@/store";

export const isLoadingSelector = ( state: RootState ) => state.sightings.loading;

export const locationSelector = ( state: RootState ) => state.sightings.location;

export const sightingsSelector = ( state: RootState ) => state.sightings.sightings;

export const mySightingsSelector = ( state: RootState ) => state.sightings.mySightings.sightings;

export const mySightingPageSelector = ( state: RootState ) => state.sightings.mySightings.number;

export const mySightingLastPageSelector = ( state: RootState ) => state.sightings.mySightings.last;