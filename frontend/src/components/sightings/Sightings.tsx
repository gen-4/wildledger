import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Map from '@/components/sightings/Map';
import type { SightingMarker } from '@/components/sightings/types';
import { getSightings, setLocation } from '@/components/sightings/slices/sightingsSlice';
import { addMessage } from '@/store/appSlice';
import { sightingsSelector } from '@/components/sightings/selectors';

import styles from '@/components/sightings/styles/sightings.module.css';

import type { AppDispatch } from '@/store';
import { MessageType } from '@/store/types';

const Sightings = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const sightings = useSelector(sightingsSelector);
    const markers: Array<SightingMarker> = sightings.map((sighting) => ({
        ...sighting,
        draggable: false
    }))

    useEffect(() => {
        dispatch(getSightings()).unwrap()
        .then(() => dispatch(addMessage({
            id: '',
            message: 'Sightings retrieved',
            type: MessageType.INFO,
            autoDismiss: true,
            dismissing: false
        })))
        .catch((error) => dispatch(addMessage({
            id: '',
            message: error as string,
            type: MessageType.ERROR,
            autoDismiss: true,
            dismissing: false
        })));
        
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