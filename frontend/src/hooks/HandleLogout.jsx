import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";


const useLogout = () => {
    const navigate = useNavigate();
    const { logout} = useAuth();

    return () => {
        logout();
        toast.success("Logout SUccessfully");
        navigate('/Login');
    }
    
}

export default useLogout;