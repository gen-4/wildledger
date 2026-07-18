import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import 'leaflet/dist/leaflet.css';

import type { AppDispatch } from "@/store";
import { addMessage } from "@/store/appSlice";
import { MessageType } from "@/store/types";

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

const Sightings = () => {
    'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}'
    return (
        <MapContainer 
            center={ [42.88075187924244, -8.544497134456442] } 
            minZoom={ 3 } 
            maxZoom={ 19 } 
            className={ mapStyles.map } 
        >
            <TileLayer 
                attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" 
            />
            <SetView />
        </MapContainer>
    )
};

export default Sightings;