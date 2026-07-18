import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "@/components/auth/slices/authSlice";
import { type AppDispatch } from "@/store";
import { addMessage } from "@/store/appSlice";
import { MessageType } from "@/store/types";
import { isAuthenticatedSelector } from "@/components/auth/selectors";
import { Button } from "@/components/common";

import styles from '@/components/auth/styles/authentication.module.css';

function Register() { // TODO: Doube password. Controll password has more than 6 characters
    const navigate = useNavigate();
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onSubmitClick = async () => 
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
            <Button text="Submit" onClick={() => onSubmitClick()} cover />
        </div>
    );
};

export default Register;