import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { isAuthenticatedSelector, isLoadingSelector } from "@/components/auth/selectors";
import { login } from "@/components/auth/slices/authSlice";
import type { AppDispatch } from "@/store";
import { addMessage } from "@/store/appSlice";
import { MessageType } from "@/store/types";
import { Button } from "@/components/common";

import styles from '@/components/common/styles/form.module.css';

function Login() {
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const isLoading = useSelector(isLoadingSelector);
    const navigate = useNavigate();
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const dispatch: AppDispatch = useDispatch();
    const disabled = !username || !password || isLoading;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);


    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) {
            return;
        }

        dispatch(login({ username, password })).unwrap()
        .then(() => 
            dispatch(addMessage({
                id: '',
                type: MessageType.SUCCESS,
                message: "You have successfully logged in",
                autoDismiss: true,
                dismissing: false
            })))
        .catch((error) => 
            dispatch(addMessage({
                id: '', 
                type: MessageType.ERROR, 
                message: error as string, 
                autoDismiss: true,
                dismissing: false
            })));
    }

    return (
        <form onSubmit={ handleSubmit } className={ styles.formCard }>
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
            <Button type="submit" text="Submit" cover disabled={ disabled } />
        </form>
    );
};

export default Login;