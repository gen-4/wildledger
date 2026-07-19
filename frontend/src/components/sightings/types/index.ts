export interface Position {
    lat: number;
    lng: number;
};

export interface Sighting {
    id: number;
    name?: string;
    location: Position;
};

export interface SightingMarker extends Sighting {
    draggable?: boolean;
}