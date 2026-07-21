import { useEffect } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import 'leaflet/dist/leaflet.css';

import AnimalMarker from "@/components/sightings/AnimalMarker";
import { locationSelector } from "@/components/sightings/selectors";

import type { SightingMarker } from "@/components/sightings/types";

import mapStyles from '@/components/sightings/styles/map.module.css';

import { DEFAULT_LOCATION } from "@/components/sightings/constants";

const SetView = () => {
    const map = useMap();
    const location = useSelector(locationSelector)

    useEffect(() => {
        map.setView([location.lat, location.lng], 13)
    }, [map, location]);
    
    return null;
};

const Map = ({ markers }: { markers?: Array<SightingMarker> }) => {
    return (
        <MapContainer 
            center={ [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng] } 
            minZoom={ 3 } 
            maxZoom={ 18 } // With this Tile it has to be 18. Any other would be 19
            className={ mapStyles.map } 
        >
            <TileLayer 
                attribution={'&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver ' +
                    '(Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">' + 
                    'Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">' +
                    'OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">' +
                    'OpenStreetMap</a> contributors'}
                url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg" 
            />
            <SetView />
            { markers &&
                markers.map((marker) =>
                    <AnimalMarker 
                        key={ marker.id }
                        id={ marker.id } 
                        name={ marker.name }
                        location={ marker.location } 
                        draggable={ marker.draggable } 
                        onDragEnd={ marker.onDragEnd }
                    />
                )
            }
        </MapContainer>
    );
};

export default Map;