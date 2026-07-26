import { motion } from "framer-motion";
import Google from "../assets/images/Google.png";
import Facebook from "../assets/images/Facebook.png";
import Logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useGoogleAuth from "../hooks/GoogleLogin";

const RightDiv = ({children, isLogin, onSwitch}) => {

    const login = "flex flex-col justify-center items-center w-[75%] h-full gap-4 bg-white rounded-tr-[10px] rounded-br-[10px]"
    const notLogin = "flex flex-col justify-center items-center w-[75%] h-full gap-4 bg-white rounded-tl-[10px] rounded-bl-[10px]"
    const googleLogin = useGoogleAuth();

    return (
        <motion.div 
                    layout
                    className={isLogin ? login : notLogin}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="flex w-full justify-center items-center">
                <img src={Logo} alt="logo" className="w-[120px]" />
            </div>
            <div className="flex flex-col justify-start w-[75%] gap-[3px] mt-[1.5rem]">
                <div>
                    <span className="font-poppins text-[15px] opacity-[87%]">Sign up your account</span>
                </div>
                <div>
                    <span className="font-poppins text-[10px] opacity-[87%]">Welcome back! Log in With Email</span>
                </div>
            </div>
            <div className="w-full px-[10%] mb-[1rem]">
                <div className="flex flex-col justify-center items-center">
                    {children}
                </div>
                <div className="flex flex-col justify-center gap-[2rem]">
                    <div className="flex justify-center items-center gap-5">
                        <hr className="border-gray-500 w-[15%] opacity-50"/>
                        <span className="font-poppins font-normal text-[12px] text-black/50">Or method to log in</span>
                        <hr className="border-gray-500 w-[15%] opacity-50"/>
                    </div>
                    <div className="flex justify-center items-center gap-[20%]">
                        <button onClick={googleLogin} className="flex gap-[10%] cursor-pointer items-center justify-center">
                            <img src={Google} alt="google" className="w-[20px] h-[20px]"/>
                            <span className="font-poppins text-[12px]">Google</span>
                        </button>
                        <div className="flex gap-[10%] cursor-pointer items-center justify-center">
                            <img src={Facebook} alt="facebook" className="w-[20px] h-[20px]"/>
                            <span className="font-poppins text-[12px]">Facebook</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-[5px]">
                        <span className="font-poppins text-[10px]">
                            {isLogin ? "You don't have an account?" : "Do you have an account? "}
                        </span>

                        <span className="font-poppins text-[10px] text-[#FFA410] cursor-pointer"
                               onClick={onSwitch}
                        >
                            {isLogin ? "Register" : "Login"}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div> 
    )
}

export default RightDiv;