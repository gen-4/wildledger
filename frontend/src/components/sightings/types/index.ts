export interface Position {
    lat: number;
    lng: number;
};

export interface Sighting {
    id: number;
    individualId?: number
    name?: string;
    imagePath?: string;
    location: Position;
    sightingDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    status?: string;
    identificationConfidence?: number;
    reporter?: string;
    hasIndividual?: boolean;
    individualReporter?: string;
    species?: string;
    individualCreatedAt?: Date;
    individualUpdatedAt?: Date;
};

export interface SightingMarker extends Sighting {
    draggable?: boolean;
    onDragEnd?: (latitude: number, longitude: number) => void;
};

export interface SightingProxyReponse {
    id: number;
    individualId?: number
    name?: string;
    imagePath: string;
    latitude: number;
    longitude: number;
};

export interface SightingResponse {
    id: number;
    individualId?: number
    name?: string;
    imagePath: string;
    latitude: number;
    longitude: number;
    sightingDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    status?: string;
    identificationConfidence?: number;
    reporter?: string;
    hasIndividual?: boolean;
    individualReporter?: string;
    species?: string;
    individualCreatedAt?: Date;
    individualUpdatedAt?: Date;
};