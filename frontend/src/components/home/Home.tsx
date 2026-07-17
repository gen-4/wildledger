import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Button } from "@/components/common";
import { isAuthenticatedSelector } from "@/components/auth/selectors";


const Home = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(isAuthenticatedSelector);

    return (
        <div>
            { !isAuthenticated && <Button text="Register" onClick={ () => navigate("/signup") } /> }
        </div>
    );
};

export default Home;