import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { loginUser, registerUser } from "../service/authService";
import { googleLogin as googleLoginService} from "../service/authService";

//          FLOW
// Basically it create a shared storage.
// Then, the AuthContext.Provider below privide the data. 
// Lastly, the useContext part acess those provided data. 

// Context(createContext) is Global Storage box that that every components can access without prop drilling.
const AuthContext = createContext(null);


// Custom Hooks 
// Imported if need to use
export const useAuth = () => {

    // It ask the current value stored inside AuthContext as its parameter.
    // For exmaple the AuthContext user value has "Mic"
    // so the context return {user: "Mic"}
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAth must be used inside AuthProvider");
    }
    return context;
}


// Since this AuthProvider is going to wrap the App, all the pages can access the Authcontext.Provider that has all the needed functions, that can also stored on the AuthContext above, and retrieve the data by the useContext.

// Imported to the main.jsx
export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This restore user session from the local storage aftert being refreshed.
    useEffect(() => {
        // Get the item (string formated somewhere) being set from the lcoalStorage.
        const storeduser = localStorage.getItem('user');
        if(storeduser){
            try{
                // Parsing it to turn into object form to access properties.
                setUser(JSON.parse(storeduser));
            }catch(error){
                // Should remove becuase if it fails it store invalid data that cause error later
                localStorage.removeItem('user');
                setUser(null);
                throw error;
            }
        }
        setLoading(false)
    }, []);

    const login = useCallback(async (formDataApi) => {
     
            const response = await loginUser(formDataApi);
            const userData = response.data;
            const token = response.data.token;

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);


            return userData;
    

    }, []);

    const register = useCallback(async (formDataApi) => {
    
            const response = await registerUser(formDataApi);

            const userData = response.data;
            const token = response.data.token;

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);

            return userData;
   

    }, []);

    const googleLogin = useCallback( async (accessToken) => {
    
            const response = await googleLoginService(accessToken);
            const userData = response.user;
            const token = response.token;

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);

            return userData;
      
    }, []);
  
    const logout = useCallback( async () => {

        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');

    }, []);

    const value = {
        user,
        loading,
        googleLogin,
        register,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}