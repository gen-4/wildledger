import { useEffect, useMemo, useRef, useState } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import { Icon, type IconOptions } from "leaflet";

import type { SightingMarker } from '@/components/sightings/types';

import '@/components/sightings/styles/leaflet.css'

const AnimalMarker = ({ id, individualId, imagePath, name, location, draggable, onDragEnd }: SightingMarker) => {
    const markerRef = useRef<L.Marker | null>(null);
    const map = useMap();
    const [zoom, setZoom] = useState(map.getZoom());
    const iconSize: [number, number] = zoom <= 10 ? [50, 48] : [100, 95];
    const tooltipOffset: [number, number] = zoom <= 10 ? [0, -30] : [0, -60];

    useEffect(() => {
        const onZoom = () => setZoom(map.getZoom());
        map.on('zoomend', onZoom);
        return () => { map.off('zoomend', onZoom); };
    }, [map]);

    const icon: IconOptions = {
        iconUrl: imagePath? imagePath : '/fluke.svg',
        iconSize
    };

    const eventHandlers = useMemo(() => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    const { lat, lng } = marker.getLatLng();
                    if (onDragEnd != undefined) {
                        onDragEnd(lat, lng);
                    }
                }
            },
        }), []
    );

    return (
        <Marker
            key={ id }
            draggable={ draggable }
            eventHandlers={ eventHandlers }
            position={ location }
            ref={ markerRef }
            icon={ new Icon(icon) }
        >
            <Tooltip key={ `${zoom}-${id}` } direction="top" offset={ tooltipOffset } opacity={ 1 } permanent>
                { individualId && <span>#{ individualId }</span> }
                <span className="tooltip-title">{ name }</span>
            </Tooltip>
        </Marker>
    );
};

export default AnimalMarker;