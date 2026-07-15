import { useSelector } from "react-redux";
import type { RootState } from '@/store';

const Home = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <div>
            { String(isAuthenticated) }
        </div>
    );
};

export default Home;