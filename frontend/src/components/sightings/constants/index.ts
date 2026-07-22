import type { Position } from "@/components/sightings/types";

export const DEFAULT_LOCATION: Position = {
    lat: 42.88075187924244, 
    lng: -8.544497134456442
};

export const GET_SIGHTINGS_DEFAULT_ERROR_MSG = 'Unable to get sightings';

export const CREATE_SIGHTING_DEFAULT_ERROR_MSG = 'Sighting creation failed';