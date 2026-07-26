import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch();
    const isLoading = useSelector(isLoadingSelector);
    const location = useSelector(locationSelector);
    const [ lat, setLat ] = useState(0);
    const [ lng, setLng ] = useState(0);
    const [ center, setCenter ] = useState({ lat: location.lat, lng: location.lng })
    const [ file, setFile ] = useState<File | null>(null);
    const [ date, setDate ] = useState('');
    const [ showCoordinates, setShowCoordinates ] = useState(false);
    const [ showDate, setShowDate ] = useState(false);
    const [ markers, setMarkers ] = useState<Array<SightingMarker>>([]);
    
    const disabled = !lat || !lng || !date || !file || isLoading;

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(create({ file: file!, latitude: lat, longitude: lng, sightingDate: new Date(Date.parse(date)) })).unwrap()
        .then( () => {
            dispatch(addMessage({
                id: '',
                message: 'Sighting created',
                type: MessageType.SUCCESS,
                autoDismiss: true,
                dismissing: false
            }));
            navigate(-1);
        })
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

        try {
            const metadata = await exifr.parse(f, true);
            if (Number.isFinite(metadata?.latitude) && Number.isFinite(metadata?.longitude)) {
                setLat(metadata.latitude);
                setLng(metadata.longitude);
                setCenter({ lat: metadata.latitude, lng: metadata.longitude })
                setMarker({ lat: metadata.latitude, lng: metadata.longitude });
                dispatch(addMessage({ 
                    id: '',
                    message: 'Image location autoset',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
            } else {
                setLat(location.lat);
                setLng(location.lng);
                setMarker({ lat: location.lat, lng: location.lng });
                dispatch(addMessage({
                    id: '',
                    message: 'Image location was not found',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
            }

            const dateValue = metadata?.DateTimeOriginal
                ?? metadata?.DateTimeDigitized
                ?? metadata?.DateTime;

            if (dateValue) {
                const iso = new Date(dateValue).toISOString().slice(0, 16);
                setDate(iso);
                dispatch(addMessage({
                    id: '',
                    message: 'Image date autoset',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
            } else {
                dispatch(addMessage({
                    id: '',
                    message: 'Image date was not found',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
            }
        } catch {
            setLat(location.lat);
            setLng(location.lng);
            dispatch(addMessage({
                id: '',
                message: 'Could not read image metadata',
                type: MessageType.INFO,
                autoDismiss: true,
                dismissing: false
            }));
        } finally {
            setShowCoordinates(true);
            setShowDate(true);
        }
        
        setFile(f);
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
                <Map center={ center } markers={ markers } />
            </div>
        </div>
    );
};

export default SightingCreation;