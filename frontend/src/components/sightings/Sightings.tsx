import Map from '@/components/sightings/Map';
import type { SightingMarker } from '@/components/sightings/types';

import styles from '@/components/sightings/styles/sightings.module.css';

const markers: Array<SightingMarker> = [
    {
        id: 1,
        name: "Eli's whale",
        location: { lat: 42.88075187924244, lng: -8.544497134456442  },
        draggable: true
    }
]

const Sightings = () => {
    return (
        <div className={ styles.mapContainer }>
            <Map markers={ markers } />
        </div>
    );
};

export default Sightings;