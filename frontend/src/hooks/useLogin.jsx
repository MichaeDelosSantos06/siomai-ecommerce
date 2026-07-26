import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"
import { useState } from "react";
import { toast } from "sonner";


const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const onSubmit = async (formData) => {
        try{
            setError(null);

            await login(formData);
            toast.success("Successfully Login");

            navigate('/');

        }catch(error){
            setError(
                error.response?.data?.message || 
                error.message ||
                "Invalid Credetials"
            );
        }

    }

    return {
        onSubmit,
        error
    }
}

export default useLogin;