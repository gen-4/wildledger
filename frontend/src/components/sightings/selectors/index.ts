import type { RootState } from "@/store";

export const isLoadingSelector = ( state: RootState ) => state.sightings.loading;

export const locationSelector = ( state: RootState ) => state.sightings.location;

export const sightingsSelector = ( state:RootState ) => state.sightings.sightings;