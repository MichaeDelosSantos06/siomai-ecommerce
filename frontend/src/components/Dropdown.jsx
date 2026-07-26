import {motion} from 'framer-motion';
import UserDisplayName from './authenticated-navigation/UserDisplay';
import Logout from './navigation-components/Logout';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const DropDown = ({isOpen}) => {
    const variants = {
        closed: {
            opacity: 0,
            y: -20,
            x: -200,
        },
        open: {
            opacity: 1,
            y: -15,
            x: -200,
        },
    };

    const { user } = useAuth();
    const navigate = useNavigate();
    const goToDashboard = () => {
        navigate('/Admin');
    }

    return (
       <motion.div
            variants={variants}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
            className="absolute top-full w-[250px] bg-white shadow-lg rounded-lg p-[20px] text-center"
        >
            <UserDisplayName/>
            <Logout/>
            { user?.role === "ADMIN" &&
                <button
                    onClick={goToDashboard}
                >DASHBOARD</button>
            }
        </motion.div>
    )
}

export default DropDown;