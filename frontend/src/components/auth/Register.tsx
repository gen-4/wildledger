import { useDispatch } from "react-redux";
import { useState } from "react";
import { register } from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store";

function Register() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const dispatch: AppDispatch = useDispatch();

    const onSubmitClick = () => {
        dispatch(register({ username, password }));
    };

    return (
        <div>
            <div>
                <input type="text" value={ username } onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                <input type="password" value={ password } onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                <button onClick={() => onSubmitClick()}>Submit</button>
            </div>
        </div>
    );
};

export default Register;