import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Map from '@/components/sightings/Map';
import StatusBadge from '@/components/sightings/StatusBadge';
import type { SightingMarker } from '@/components/sightings/types';
import { getMySightings } from '@/components/sightings/slices/sightingsSlice';
import { addMessage } from '@/store/appSlice';
import { isLoadingSelector, mySightingPageSelector, mySightingLastPageSelector, mySightingsSelector } from '@/components/sightings/selectors';
import { userSelector } from '@/components/auth/selectors';

import type { AppDispatch } from '@/store';
import { MessageType } from '@/store/types';

import sightingsStyles from '@/components/sightings/styles/sightings.module.css';
import styles from '@/components/sightings/styles/my_resources.module.css';

const PAGE_SIZE = 5;

const MySightings = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const tableRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const sightings = useSelector(mySightingsSelector);
    const page = useSelector(mySightingPageSelector);
    const isLastPage = useSelector(mySightingLastPageSelector)
    const isLoading = useSelector(isLoadingSelector);
    const user = useSelector(userSelector)
    const [ initialPageLoaded, setInitialPageLoaded ] = useState(false);
    const markers: Array<SightingMarker> = sightings.map((sighting) => ({
        ...sighting,
        draggable: false
    }));

    const loadNewPage = useCallback(() => {
        if (isLastPage || !user || isLoading) {
            return;
        }

        dispatch(getMySightings({ userId: user.id, page: page + 1, size: PAGE_SIZE })).unwrap()
        .then(() => dispatch(addMessage({
            id: '',
            message: 'New sightings page retrieved',
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
    }, [dispatch, isLastPage, page, user, isLoading]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const root = tableRef.current;
        if (!sentinel || !root || isLastPage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadNewPage();
                }
            },
            { root, rootMargin: '0px 0px 50px 0px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadNewPage]);

    useEffect(() => {
        if (!user) {
            return;
        }
        dispatch(getMySightings({ userId: user.id, page: 0, size: PAGE_SIZE })).unwrap()
        .then(() => {
            setInitialPageLoaded(true);
            dispatch(addMessage({
                id: '',
                message: 'Sightings retrieved',
                type: MessageType.INFO,
                autoDismiss: true,
                dismissing: false
            }));
        })
        .catch((error) => dispatch(addMessage({
            id: '',
            message: error as string,
            type: MessageType.ERROR,
            autoDismiss: true,
            dismissing: false
        })));
    }, [dispatch]);
    
    return ( // TODO: Add spinner. In the date append Z or parse as UTC somehow...
        <div className={ `${sightingsStyles.mapContainer} ${styles.mapContainer}` }>
            <div ref={ tableRef } className={ styles.table }>
                {
                    sightings.map(sighting => 
                        <div key={ sighting.id } className={ styles.sighting }>
                            <div className={ styles.imageWrapper }>
                                <img className={ styles.image } src={ sighting.imagePath } />
                            </div>
                            <div className={ styles.info }>
                                <div className={ styles.details }>
                                    <div className={ styles.row }>
                                        <span className={ `${styles.detail} ${styles.id}` }>@{ sighting.id }</span>
                                        <span className={ styles.detail }>
                                            { sighting.individualId && `#${ sighting.individualId } ${ sighting.name }` }
                                        </span>
                                    </div>

                                    <div className={ styles.row }>
                                        <span className={ styles.detail }><StatusBadge status={ sighting.status!! } /></span>
                                        <span className={ `${styles.detail} ${styles.date}` }>
                                            { sighting.createdAt?.toDateString() }
                                        </span>
                                    </div>
                                </div>
                                <div className={ styles.actions }></div>
                            </div>
                        </div>
                    )
                }
                { !isLastPage && initialPageLoaded && 
                    <div ref={ sentinelRef } className={ styles.sentinel }>
                        <div className={ styles.spinner } />
                    </div>
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