import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { create } from '@/components/sightings/slices/sightingsSlice';

import Map from '@/components/sightings/Map';
import { Button } from '@/components/common';

import type { AppDispatch } from '@/store';

import styles from '@/components/sightings/styles/sighting_creation.module.css';
import sightingsStyles from '@/components/sightings/styles/sightings.module.css';
import formStyles from '@/components/common/styles/form.module.css';


const SightingCreation = () => {
    const dispatch: AppDispatch = useDispatch();
    const [ lat, setLat ] = useState(0);
    const [ lng, setLng ] = useState(0);
    const [ file, setFile ] = useState<File | null>(null);
    const [ date, setDate ] = useState('');
    
    const disabled = !lat || !lng || !date || !file;

    const handleSubmit = () => {
        dispatch(create({ file: file!, latitude: lat, longitude: lng, sightingDate: new Date(Date.parse(date)) }));
    }
    
    return (
        <div className={ `${sightingsStyles.mapContainer} ${styles.pageContainer}` } >
            <form onSubmit={ handleSubmit } className={ `${styles.form} ${formStyles.formCard}` } >
                <input type="file" onChange={ (e) => setFile(e.target.files?.[0] ?? null) } />

                <div className={ styles.coordinates } >
                    <input 
                        className={ formStyles.input }
                        type="number" 
                        value={ lat } 
                        onChange={(e) => setLat(Number(e.target.value))} 
                    />

                    <input 
                        className={ formStyles.input }
                        type="number" 
                        value={ lng } 
                        onChange={(e) => setLng(Number(e.target.value))} 
                    />
                </div>

                <input type="datetime-local" value={ date } onChange={ (e) => setDate(e.target.value) } />
                
                <Button type="submit" text="Submit" cover disabled={ disabled } />
            </form>

            <div className={ styles.mapWrapper } >
                <Map />
            </div>
        </div>
    );
};

export default SightingCreation;