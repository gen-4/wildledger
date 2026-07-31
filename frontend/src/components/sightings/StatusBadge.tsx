import { SightingStatus } from "@/components/sightings/types";

import styles from "@/components/sightings/styles/status_badge.module.css";

const statusMapping = {
    [SightingStatus.PENDING]: {
        icon: <span className="material-icons-outlined">schedule</span>,
        class: styles.pending,
        text: 'pending'
    },
    [SightingStatus.REJECTED]: {
        icon: <span className="material-icons-outlined">thumb_down</span>,
        class: styles.rejected,
        text: 'rejected'
    },
    [SightingStatus.CANCELLED]: {
        icon: <span className="material-icons-outlined">do_not_disturb_on</span>,
        class: styles.cancelled,
        text: 'cancelled'
    },
    [SightingStatus.UNRECOGNIZED]: {
        icon: <span className="material-icons-outlined">question_mark</span>,
        class: styles.unrecognized,
        text: 'unrecognized'
    },
    [SightingStatus.UNKNOWN_SPECIES]: {
        icon: <span className="material-icons-outlined">question_mark</span>,
        class: styles.unknownSpecies,
        text: 'unrecognized species'
    },
    [SightingStatus.FAILED]: {
        icon: <span className="material-icons-outlined">error</span>,
        class: styles.failed,
        text: 'failed'
    },
    [SightingStatus.FAILED_IMAGE]: {
        icon: <span className="material-icons-outlined">hide_image</span>,
        class: styles.failedImage,
        text: 'unaccepted image'
    },
    [SightingStatus.PROCESSING]: {
        icon: <span className="material-icons-outlined">manufacturing</span>,
        class: styles.processing,
        text: 'processing'
    },
    [SightingStatus.PROCESSED]: {
        icon: <span className="material-icons-outlined">list_alt_check</span>,
        class: styles.processed,
        text: 'processed'
    },
    [SightingStatus.CONFIRMED]: {
        icon: <span className="material-icons-outlined">check_circle</span>,
        class: styles.confirmed,
        text: 'confirmed'
    }
} // TODO: Add fallback

const StatusBadge = ({ status }: { status: SightingStatus }) => {
    const statusProperties = statusMapping[status];
    
    return (
        <div className={ `${styles.badge} ${statusProperties.class}` }>
            { statusProperties.icon } <span className={ styles.text } >{ statusProperties.text }</span>
        </div>
    )
};

export default StatusBadge;