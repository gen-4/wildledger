import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import exifr from 'exifr';

import { create } from '@/components/sightings/slices/sightingsSlice';

import Map from '@/components/sightings/Map';
import { Button } from '@/components/common';
import type { SightingMarker, Position } from '@/components/sightings/types';
import { isLoadingSelector, locationSelector } from '@/components/sightings/selectors';

import type { AppDispatch } from '@/store';

import styles from '@/components/sightings/styles/sighting_creation.module.css';
import sightingsStyles from '@/components/sightings/styles/sightings.module.css';
import formStyles from '@/components/common/styles/form.module.css';
import { addMessage } from '@/store/appSlice';
import { MessageType } from '@/store/types';


const SightingCreation = () => {
    const dispatch: AppDispatch = useDispatch();
    const isLoading = useSelector(isLoadingSelector);
    const location = useSelector(locationSelector);
    const [ lat, setLat ] = useState(0);
    const [ lng, setLng ] = useState(0);
    const [ file, setFile ] = useState<File | null>(null);
    const [ date, setDate ] = useState('');
    const [ showCoordinates, setShowCoordinates ] = useState(false);
    const [ showDate, setShowDate ] = useState(false);
    const [ markers, setMarkers ] = useState<Array<SightingMarker>>([]);
    
    const disabled = !lat || !lng || !date || !file || isLoading;

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(create({ file: file!, latitude: lat, longitude: lng, sightingDate: new Date(Date.parse(date)) })).unwrap()
        .then( () =>
            dispatch(addMessage({
                id: '',
                message: 'Sighting created',
                type: MessageType.SUCCESS,
                autoDismiss: true,
                dismissing: false
            })))
        .catch((error) =>
            dispatch(addMessage({
                id: '',
                message: error as string,
                type: MessageType.ERROR,
                autoDismiss: true,
                dismissing: false
            })));
    };

    const handleImageChange = async (e:  React.ChangeEvent<HTMLInputElement>) => {
        const f: File = e.target.files?.[0]!;
        if (!f) {
            return;
        }

        exifr.gps(f)
        .then((gps) => {
            const latitude = gps.latitude ? gps.latitude : location.lat;
            const longitude = gps.longitude ? gps.longitude : location.lng;
            setLat(latitude);
            setLng(longitude);
            setMarker({
                lat: latitude,
                lng: longitude
            });
            dispatch(addMessage({
                id: '',
                message: 'Image location autoset',
                type: MessageType.INFO,
                autoDismiss: true,
                dismissing: false
            }));
        })
        .catch(() => {
            dispatch(addMessage({
                id: '',
                message: 'Image location was not found',
                type: MessageType.INFO,
                autoDismiss: true,
                dismissing: false
            }));
            
            setLat(location.lat);
            setLng(location.lng);
            setMarker({
                lat: location.lat,
                lng: location.lng
            });
        }).finally(() => setShowCoordinates(true));

        exifr.parse(f, ['DateTimeOriginal']).then(({ DateTimeOriginal }) => {
            if (!DateTimeOriginal) {
                dispatch(addMessage({
                    id: '',
                    message: 'Image date was not found',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
                return;
            }
            const iso = (DateTimeOriginal as Date).toISOString().slice(0, 16);
            setDate(iso);
            dispatch(addMessage({
                id: '',
                message: 'Image date autoset',
                type: MessageType.INFO,
                autoDismiss: true,
                dismissing: false
            }));
        })
        .catch(() =>
            dispatch(addMessage({
                id: '',
                message: 'Image date was not found',
                type: MessageType.INFO,
                autoDismiss: true,
                dismissing: false
            }))
        ).finally(() => setShowDate(true));

        setFile(e.target.files?.[0] ?? null);
    };

    const onMarkerDrag = (latitude: number, longitude: number) => {
        setLat(latitude);
        setLng(longitude);
    };

    const setMarker = (location: Position) => setMarkers([{
            id: -1,
            name: 'New Sighting',
            location,
            draggable: true,
            onDragEnd: onMarkerDrag
        }]);

    const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>, coordinate: string) => {
        coordinate === 'lat' ? setLat(Number(e.target.value)) : setLng(Number(e.target.value));
        setMarker({
            lat: coordinate === 'lat' ? Number(e.target.value) : lat,
            lng: coordinate === 'lng' ? Number(e.target.value) : lng
        });
    };
    
    return (
        <div className={ `${sightingsStyles.mapContainer} ${styles.pageContainer}` } >
            <form onSubmit={ handleSubmit } className={ `${styles.form} ${formStyles.formCard}` } >
                <h1 className={ styles.title } >Add new Sighting</h1>
                <input 
                    type="file" 
                    className={ `${formStyles.input} ${styles.file}` } 
                    onChange={ (e) => handleImageChange(e) } 
                />
                { showCoordinates &&
                    <div className={ styles.coordinates } >
                        <div>
                            <label htmlFor="lat" >Latitude</label>
                            <input 
                                id="lat"
                                className={ `${formStyles.input} ${styles.coordinate}` }
                                type="number" 
                                step="any" 
                                min="-90" 
                                max="90"
                                value={ lat } 
                                onChange={ (e) => handleCoordinateChange(e, 'lat') } 
                            />
                        </div>

                        <div>
                            <label htmlFor="lng">Longitude</label>
                            <input 
                                id="lng"
                                className={ `${formStyles.input} ${styles.coordinate}` }
                                type="number" 
                                step="any"
                                min="-180"
                                max="180"
                                value={ lng } 
                                onChange={ (e) => handleCoordinateChange(e, 'lng') } 
                            />
                        </div>
                    </div>
                }

                { showDate &&
                    <input 
                        type="datetime-local" 
                        className={ `${formStyles.input} ${styles.date}` } 
                        value={ date } 
                        onChange={ (e) => setDate(e.target.value) } 
                    />
                }
                
                <Button type="submit" text="Submit" cover disabled={ disabled } />
            </form>

            <div className={ styles.mapWrapper } >
                <Map markers={ markers } />
            </div>
        </div>
    );
};

export default SightingCreation;