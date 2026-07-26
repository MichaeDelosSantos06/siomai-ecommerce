import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const useGoogleAuth = () => {

    //renaming googleLogin function
    const { googleLogin } = useAuth();
    const navigate = useNavigate();


    // Receive the response of OAuth ot google after login (token and user data)
    const login = useGoogleLogin({

        //this onSuccess run when you successfully logged in to google
        // the parameter tokenRespomse stores the google response object (token + metadata) after loggged in.
        onSuccess: async (tokenResponse) => {
            try{
                // calls the authGoogleLogin function that handles http reuest to send to the backend.
                // Baically this function send the access_token from the google to the backend.
                 await googleLogin(
                    // hold the google access token
                    tokenResponse.access_token
                )

                navigate('/')
            }catch(error){
                console.error('Google login error:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                }
            }
        },
        // onSuccess & onError is a built in configuration properties used by the useGoogleLogin, they are act on this as Callback funtions
        onError: (errorResponse) => {
            console.error("Google login error:", errorResponse);
        },
        // gives limited access from the google data response.
        scope: 'openid email profile'
    })

    return login
};



export default useGoogleAuth;