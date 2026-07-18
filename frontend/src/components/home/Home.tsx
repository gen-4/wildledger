import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Button } from "@/components/common";
import { isAuthenticatedSelector, refreshTokenSelector } from "@/components/auth/selectors";


const Home = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const refreshToken = useSelector(refreshTokenSelector);

    return (
        <div>

            { !isAuthenticated && !refreshToken && 
                <Button text="Register" onClick={ () => navigate("/signup") } /> 
            }

        </div>
    );
};

export default Home;