
import Siomai from "../assets/video/sio-bg.mp4";
import { motion } from "framer-motion"
import LeftDiv from "../components/LeftDiv";
import RightDiv from "../components/RightDiv";
import Login from "../components/LoginForm";
import { useState } from "react";
import Signup from "../components/SignupForm";

function LoginPage(){

    const [isLogin, setIsLogin] = useState(true)

    const switchToLogin = () => {
        setIsLogin(true);
    }

    return (
        <div className="relative bg-gray-100 h-screen w-full flex justify-center items-center">   
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={Siomai} type="video/mp4" />
            </video>
            <motion.div 
            layout
                transition={{
                    layout: {
                        duration: 0.6
                    }
                }}
            className={`relative z-10 w-[70%] h-[85%] flex rounded-[10px] ${
                isLogin ? "flex-row" : "flex-row-reverse "
            }`}>
                {/* Left Div */}
                
                <LeftDiv/>

                {/* Right Div */}
                 <RightDiv 
                    isLogin={isLogin}  
                    onSwitch={() => setIsLogin(!isLogin)}
                 >
                    {isLogin ? <Login/> : <Signup onRegisterSuccess={switchToLogin}/>}
                </RightDiv>
            </motion.div>
        </div>
    )
}
 
export default LoginPage;