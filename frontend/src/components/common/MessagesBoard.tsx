import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearMessage, dismissMessage } from '@/store/appSlice';
import { messagesSelector } from '@/store/appSelectors';
import type { AppDispatch } from '@/store';
import { MessageType } from '@/store/types';

import styles from '@/components/common/styles/messagesboard.module.css';

const TYPE_MAPPING: Record<MessageType, {icon: string, style: string}> = {
    [MessageType.ERROR]: {
        icon: 'error',
        style: styles.error
    },
    [MessageType.WARNING]: {
        icon: 'warning',
        style: styles.warning
    },
    [MessageType.INFO]: {
        icon: 'info',
        style: styles.info
    },
    [MessageType.SUCCESS]: {
        icon: 'check_circle',
        style: styles.success
    }
};

const SECONDS_TO_AUTODISMISS = 4;

const MessagesBoard = () => {
    const autoDismissSetIds = useRef<Set<string>>(new Set());
    const dispatch: AppDispatch = useDispatch();
    const boardRef = useRef<HTMLDivElement>(null);
    const messages = useSelector(messagesSelector);

    useEffect(() => {
        const board = boardRef.current;
        if (!board) {
            return;
        }

        const updateSize = () => {
            const height = board.getBoundingClientRect().height;
            const width = board.getBoundingClientRect().width;
            document.documentElement.style.setProperty('--board-height', `${height}px`);
            document.documentElement.style.setProperty('--board-width', `${width}px`);
        };

        updateSize();

        const observer = new ResizeObserver(updateSize);
        observer.observe(board);

        return () => observer.disconnect();
    }, [dispatch]);

    useEffect(() => {
        messages.map((message) => {
            if (message.autoDismiss && !autoDismissSetIds.current.has(message.id)) {
                autoDismissSetIds.current.add(message.id);
                setTimeout(
                    () => handleMessageDelete(message.id),
                    SECONDS_TO_AUTODISMISS * 1000
                )
            }
        });
    }, [dispatch, messages])

    const handleMessageDelete = (id: string) => {
        if (messages.find((message) => message.id === id)?.dismissing) {
            return; 
        }

        dispatch(dismissMessage(id));
        setTimeout(
            () => {
                dispatch(clearMessage(id));
                autoDismissSetIds.current.delete(id);
            },
            500
        )
    };
    
    return (
        <div className={ styles.board } ref={ boardRef } >
            { messages.map( (message) =>
                <div 
                    className={ `${styles.message} ${TYPE_MAPPING[message.type].style} ${message.dismissing && styles.dismissing}` } 
                    key={ message.id }
                    onClick={ () => handleMessageDelete(message.id) }
                >
                    <span className="material-icons-outlined">{ TYPE_MAPPING[message.type].icon }</span>
                    <span className={ styles.text }>{ message.message }</span>
                </div>
            ) }
        </div>
    );
};

export default MessagesBoard;