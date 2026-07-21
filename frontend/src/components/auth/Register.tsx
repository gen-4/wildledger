import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "@/components/auth/slices/authSlice";
import { type AppDispatch } from "@/store";
import { addMessage } from "@/store/appSlice";
import { MessageType } from "@/store/types";
import { isAuthenticatedSelector, isLoadingSelector } from "@/components/auth/selectors";
import { Button } from "@/components/common";

import styles from '@/components/common/styles/form.module.css';

function Register() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const isLoading = useSelector(isLoadingSelector);
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ secondPassword, setSecondPassword ] = useState("");
    const dispatch: AppDispatch = useDispatch();

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

        dispatch(register({ username, password })).unwrap()
        .then(() => 
            dispatch(addMessage({
                id: '',
                type: MessageType.SUCCESS,
                message: "Account created",
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

    const passwordWarning =
        password.length > 0 && password.length < 6
            ? "Password must be at least 6 characters long"
            : "";

    const secondPasswordWarning =
        secondPassword.length > 0 && password !== secondPassword
            ? "Reentered password must be the same as first password"
            : "";

    const disabled = isLoading || !username || password.length < 6 || password !== secondPassword;

    return (
        <form onSubmit={ handleSubmit } className={ styles.formCard }>
            <input 
                className={ styles.input }
                type="text" 
                value={ username } 
                onChange={ (e) => setUsername(e.target.value) } 
                placeholder="username" 
            />
            <input 
                className={ `${styles.input} ${styles.withWarning}` }
                type="password" 
                value={ password } 
                onChange={ (e) => setPassword(e.target.value) } 
                placeholder="password" 
            />
            <span className={ styles.warning }>{ passwordWarning }</span>
            <input 
                className={ `${styles.input} ${styles.withWarning}` }
                type="password" 
                value={ secondPassword } 
                onChange={ (e) => setSecondPassword(e.target.value) } 
                placeholder="reenter password" 
            />
            <span className={ styles.warning }>{ secondPasswordWarning }</span>
            
            <Button type="submit" text="Submit" cover disabled={ disabled } />
        </form>
    );
};

export default Register;