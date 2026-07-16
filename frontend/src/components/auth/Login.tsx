import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { isAuthenticatedSelector } from "@/components/auth/selectors";
import { login } from "@/components/auth/slices/authSlice";
import type { AppDispatch } from "@/store";
import { Button } from "@/components/common";

import styles from '@/components/auth/styles/authentication.module.css';

function Login() {
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const navigate = useNavigate();
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated) {
            console.log("authenticated", isAuthenticated)
            navigate('/');
        }
    }, [isAuthenticated, navigate]);


    const onSubmitClick = async () => {
        dispatch(login({ username, password }));
    };

    return (
        <div className={ styles.authCard }>
            <input 
                className={ styles.input }
                type="text" 
                value={ username } 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="username" 
            />
            <input 
                className={ styles.input }
                type="password" 
                value={ password } 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="password" 
            />
            <Button text="Submit" onClick={() => onSubmitClick()} />
        </div>
    );
};

export default Login;