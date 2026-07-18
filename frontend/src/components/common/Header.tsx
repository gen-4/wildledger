import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

import { Button } from '@/components/common';

import styles from '@/components/common/styles/header.module.css';
import type { AppDispatch } from "@/store";
import { isAuthenticatedSelector, isUserSelector, refreshTokenSelector, userSelector } from "@/components/auth/selectors";
import { SubmenuItemType, type SubmenuData } from "@/components/common/types";
import { logout } from "@/components/auth/slices/authSlice";
import { Submenu } from "@/components/common";

const Header = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const headerRef = useRef<HTMLElement>(null);
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const refreshToken = useSelector(refreshTokenSelector);
    const user = useSelector(userSelector);
    const isUser = useSelector(isUserSelector);
    const [displaySubmenu, setDispaySubmenu] = useState(false);

    const navigationLinks: Array<{text: string, link: string, display: boolean}> = [
        {
            text: 'Sightings',
            link: '/sightings',
            display: !!isUser
        }
    ];

    const submenuData: SubmenuData = [
        {
            type: SubmenuItemType.BUTTON,
            text: "Logout",
            action: () => dispatch(logout())
        }
    ];

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

            <nav className={ styles.navigation } >
                { navigationLinks.filter((link) => link.display).map((link, index) => 
                    <NavLink 
                        key={ index } 
                        className={ ({ isActive }) => `${styles.navLink} ${isActive && styles.active}` } 
                        to={ link.link }
                    >{ link.text }</NavLink>
                ) }
            </nav>

            <div className={ styles.userSection}>
                { isAuthenticated && 
                    <div className={ styles.userBadge } onClick={ () => setDispaySubmenu(!displaySubmenu) } >
                        <span className="material-icons-outlined">account_circle</span>
                        { user?.username }
                        { displaySubmenu && <Submenu data={ submenuData } /> }
                    </div> 
                }
                { !isAuthenticated && 
                    location.pathname !== '/login' &&
                    location.pathname !== '/signup' &&
                    !refreshToken &&
                    <Button text="Login" onClick={ () => navigate("/login") } /> }
            </div>
        </header>
    );
};

export default Header;