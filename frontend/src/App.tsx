import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Login, Register } from '@/components/auth';
import { Home } from '@/components/home';
import { Header } from '@/components/common';
import styles from '@/app.module.css';
import { isAuthenticatedSelector, refreshTokenSelector } from '@/components/auth/selectors';
import { addMessage, type AppDispatch } from '@/store';
import { MessageType } from '@/store/types';
import { refreshToken as refreshTokenAction } from '@/components/auth/slices/authSlice';

function App() {
    const dispatch: AppDispatch = useDispatch();
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const refreshToken = useSelector(refreshTokenSelector);

    useEffect(() => {
        if (!isAuthenticated && refreshToken) {
            dispatch(refreshTokenAction()).unwrap()
            .catch((error) => 
                dispatch(addMessage({id: '', type: MessageType.ERROR, message: error as string})));
        }
    }, [dispatch]);

    return (
        <>
            <Header />
            <div className={ styles.body }>
                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                    <Route path="/signup" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </>
    )
}

export default App
