import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import 'leaflet/dist/leaflet.css';

import type { AppDispatch } from "@/store";
import { addMessage } from "@/store/appSlice";
import { MessageType } from "@/store/types";
import AnimalMarker from "@/components/sightings/AnimalMarker";

import type { SightingMarker } from "@/components/sightings/types";

import mapStyles from '@/components/sightings/styles/map.module.css';

const SetView = () => {
    const map = useMap();
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => map.setView([position.coords.latitude, position.coords.longitude], 13),
            () => {
                dispatch(addMessage({
                    id: '',
                    type: MessageType.INFO,
                    message: "Using default location",
                    autoDismiss: true,
                    dismissing: false
                }));
                map.setView([42.88075187924244, -8.544497134456442], 13);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    }, [map, dispatch]);
    
    return null;
};

const Map = ({ markers }: { markers: Array<SightingMarker> }) => {
    return (
        <MapContainer 
            center={ [42.88075187924244, -8.544497134456442] } 
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
            {
                markers.map((marker) =>
                    <AnimalMarker 
                        id={ marker.id } 
                        name={ marker.name }
                        location={ marker.location } 
                        draggable={ marker.draggable } 
                    />
                )
            }
        </MapContainer>
    );
};

export default Map;