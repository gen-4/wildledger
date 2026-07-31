export const SightingStatus = {
    PENDING: 'PENDING',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
    UNRECOGNIZED: 'UNRECOGNIZED',
    UNKNOWN_SPECIES: 'UNKNOWN_SPECIES',
    FAILED: 'FAILED',
    FAILED_IMAGE: 'FAILED_IMAGE',
    PROCESSING: 'PROCESSING',
    PROCESSED: 'PROCESSED',
    CONFIRMED: 'CONFIRMED'
} as const;

export type SightingStatus = typeof SightingStatus[keyof typeof SightingStatus];

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
    status?: SightingStatus;
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
    displayIdOfSighting?: boolean;
};

export interface SightingProxyResponse  {
    id: number;
    individualId?: number
    name?: string;
    imagePath: string;
    latitude: number;
    longitude: number;
};

export interface MySightingProxy extends SightingProxyResponse  {
    createdAt: Date;
    status: SightingStatus;
}

export interface MySightingsResponse {
    content: Array<MySightingProxy>;
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface MySightingsPage {
    sightings: Array<Sighting>;
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
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
    status?: SightingStatus;
    identificationConfidence?: number;
    reporter?: string;
    hasIndividual?: boolean;
    individualReporter?: string;
    species?: string;
    individualCreatedAt?: Date;
    individualUpdatedAt?: Date;
};