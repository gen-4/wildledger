import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, type ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "@/components/auth/slices/authSlice";
import { type AppDispatch } from "@/store";
import { addMessage } from "@/store/appSlice";
import { MessageType } from "@/store/types";
import { isAuthenticatedSelector, isLoadingSelector } from "@/components/auth/selectors";
import { Button } from "@/components/common";

import styles from '@/components/auth/styles/authentication.module.css';

function Register() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const isLoading = useSelector(isLoadingSelector);
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ secondPassword, setSecondPassword ] = useState("");
    const [ passwordWarning, setPasswordWarning ] = useState("");
    const [ secondPasswordWarning, setSecondPasswordWarning ] = useState("");
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onSubmitClick = async () => {
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

    const disabled = useMemo(() => {
        return !(
            username.length > 0 &&
            password.length > 5 &&
            password === secondPassword
        );
    }, [username, password, secondPassword]);

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>)  => {
        setPassword(e.target.value);
        if (e.target.value.length > 5 || e.target.value.length === 0) {
            setPasswordWarning("");

        } else {
            setPasswordWarning("Password must be at least 6 characters long");
        }
        validateSecondPassword(secondPassword, e.target.value);
    };

    const validateSecondPassword = (value: string, password: string) => {
        if (value === password || value.length === 0) {
            setSecondPasswordWarning("");

        } else {
            setSecondPasswordWarning("Reentered password must be the same as first password");
        }
    };

    const onSecondPasswordChange = (e: ChangeEvent<HTMLInputElement>)  => {
        setSecondPassword(e.target.value);
        validateSecondPassword(e.target.value, password);
    };

    const onUsernameChange = (e: ChangeEvent<HTMLInputElement>)  => {
        setUsername(e.target.value);
    };

    return (
        <div className={ styles.authCard }>
            <input 
                className={ styles.input }
                type="text" 
                value={ username } 
                onChange={ onUsernameChange } 
                placeholder="username" 
            />
            <input 
                className={ `${styles.input} ${styles.withWarning}` }
                type="password" 
                value={ password } 
                onChange={ onPasswordChange } 
                placeholder="password" 
            />
            <span className={ styles.warning }>{ passwordWarning }</span>
            <input 
                className={ `${styles.input} ${styles.withWarning}` }
                type="password" 
                value={ secondPassword } 
                onChange={ onSecondPasswordChange } 
                placeholder="reenter password" 
            />
            <span className={ styles.warning }>{ secondPasswordWarning }</span>
            <Button text="Submit" onClick={() => onSubmitClick()} cover disabled={ disabled || isLoading } />
        </div>
    );
};

export default Register;