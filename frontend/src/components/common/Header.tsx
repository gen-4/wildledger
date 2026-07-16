import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from '@/components/common';

import styles from '@/components/common/styles/header.module.css';
import { isAuthenticatedSelector, userSelector } from "@/components/auth/selectors";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const headerRef = useRef<HTMLElement>(null);
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const user = useSelector(userSelector);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const updateHeight = () => {
            const height = header.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--header-height', `${height}px`);
        };

        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        observer.observe(header);
        return () => observer.disconnect();
    }, []);

    return (
        <header className={ styles.header } ref={ headerRef }>
            <div className={ styles.logo } onClick={ () => navigate("/") } >Wild Ledger</div>

            <nav></nav>

            <div className={ styles.userSection}>
                { isAuthenticated && <div className={ styles.userBadge }>{ user?.username }</div> }
                { !isAuthenticated && 
                    location.pathname !== '/login' &&
                    location.pathname !== '/signup' &&
                    <Button text="Login" onClick={ () => navigate("/login") } /> }
            </div>
        </header>
    );
};

export default Header;