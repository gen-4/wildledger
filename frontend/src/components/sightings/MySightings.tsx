import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Map from '@/components/sightings/Map';
import type { SightingMarker } from '@/components/sightings/types';
import { getMySightings } from '@/components/sightings/slices/sightingsSlice';
import { addMessage } from '@/store/appSlice';
import { mySightingsSelector } from '@/components/sightings/selectors';
import { userSelector } from '@/components/auth/selectors';

import sightingsStyles from '@/components/sightings/styles/sightings.module.css';
import styles from '@/components/sightings/styles/my_resources.module.css';

import type { AppDispatch } from '@/store';
import { MessageType } from '@/store/types';

const MySightings = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const sightings = useSelector(mySightingsSelector);
    const user = useSelector(userSelector)
    const markers: Array<SightingMarker> = sightings.map((sighting) => { console.log(sighting.id); return({
        ...sighting,
        draggable: false
    })});

    useEffect(() => {
        if (!user) {
            return;
        }
        dispatch(getMySightings({ userId: user.id, page: 0, size: 5 })).unwrap()
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
    }, [dispatch]);
    
    return (
        <div className={ `${sightingsStyles.mapContainer} ${styles.mapContainer}` }>
            <div className={ styles.table }>
                {
                    sightings.map(sighting => 
                        <div>
                            <p>{ sighting.id }</p>
                            <img src={ sighting.imagePath } />
                        </div>
                    )
                }
            </div>
            <div className={ styles.mapWrapper }>
                <Map markers={ markers } displayIdOfSighting />
                <button className={ sightingsStyles.addButton } onClick={ () => navigate('/sighting/create') } >
                    <span className="material-icons-outlined">add</span>
                </button>
            </div>
        </div>
    );
};

export default MySightings;