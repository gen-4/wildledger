import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Login, Register } from '@/components/auth';
import { Home } from '@/components/home';
import { Header, MessagesBoard } from '@/components/common';
import { SightingCreation, Sightings } from '@/components/sightings';
import styles from '@/app.module.css';
import { isAuthenticatedSelector, isUserSelector, refreshTokenSelector } from '@/components/auth/selectors';
import type { AppDispatch } from '@/store';
import { addMessage } from '@/store/appSlice';
import { MessageType } from '@/store/types';
import { refreshToken as refreshTokenAction } from '@/components/auth/slices/authSlice';

function App() {
    const dispatch: AppDispatch = useDispatch();
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const isUser = useSelector(isUserSelector);
    const refreshToken = useSelector(refreshTokenSelector);

    useEffect(() => {
        if (!isAuthenticated && refreshToken) {
            dispatch(refreshTokenAction()).unwrap()
            .catch((error) => 
                dispatch(addMessage({
                    id: '', 
                    type: MessageType.ERROR, 
                    message: error as string, 
                    autoDismiss: true,
                    dismissing: false
                })));
        }
    }, [dispatch]);

    return (
        <>
            <Header />
            <div className={ styles.body + ' App' }>
                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                    <Route path="/signup" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                    <Route path="/" element={<Home />} />
                    { isUser && <Route path="/sightings" element={<Sightings />} /> }
                    { isUser && <Route path="/sighting/create" element={<SightingCreation />} /> }
                </Routes>
            </div>
            <MessagesBoard />
        </>
    )
}

export default App
