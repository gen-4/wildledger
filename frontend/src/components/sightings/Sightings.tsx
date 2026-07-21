import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Map from '@/components/sightings/Map';
import type { SightingMarker } from '@/components/sightings/types';
import { setLocation } from '@/components/sightings/slices/sightingsSlice';
import { addMessage } from '@/store/appSlice';

import styles from '@/components/sightings/styles/sightings.module.css';

import type { AppDispatch } from '@/store';
import { MessageType } from '@/store/types';

const markers: Array<SightingMarker> = [
    {
        id: 1,
        name: "Eli's whale",
        location: { lat: 42.88075187924244, lng: -8.544497134456442  },
        draggable: true
    }
]

const Sightings = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => dispatch(setLocation({ lat: position.coords.latitude, lng: position.coords.longitude})),
            () =>
                dispatch(addMessage({
                    id: '',
                    type: MessageType.INFO,
                    message: "Using default location",
                    autoDismiss: true,
                    dismissing: false
                })),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    }, [dispatch]);
    
    return (
        <div className={ styles.mapContainer }>
            <Map markers={ markers } />
            <button className={ styles.addButton } onClick={ () => navigate('/sighting/create') } >
                <span className="material-icons-outlined">add</span>
            </button>
        </div>
    );
};

export default Sightings;