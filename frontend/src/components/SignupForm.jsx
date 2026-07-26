import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser } from "../service/authService";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Signup = ({ onRegisterSuccess}) => {

    const {register, handleSubmit, setError, formState: {errors}} = useForm({mode: "onTouched", reValidateMode: "onChange"});  
    const [showPass, setShowPass] = useState(false);
    const error = errors.root?.serverError?.message;

    const onSubmit = async (formData) => {
        try{
            await registerUser(formData);

            toast.success("Regitsered Successfully. Please Log in");
           
            if(onRegisterSuccess){
                onRegisterSuccess();
            }
            
        }catch(error){
            const message = error.response?.data?.message || error.message || "Something went wrong";
            setError("root.serverError", {
                type: "server",
                message
            });
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full p-[15px] gap-[20px] justify-center">
            <AnimatePresence>
                {error && (
                    <motion.p
                        key="email-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-red-500 text-[10px] font-poppins mt-[-11px] ml-[5px]"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
            <div className="input-box">
                <Input 
                    type="email" 
                    placeholder="Email address" 
                    id="email"
                    {...register("email", {required: "Email is required", 
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format",
                        }
                    })}
                />
            </div>
            <AnimatePresence>
                {errors.email && (
                    <motion.p
                        key="email-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-red-500 text-[10px] font-poppins mt-[-11px] ml-[5px]"
                    >
                        {errors.email.message}
                    </motion.p>
                )}
            </AnimatePresence>
            <div className="input-box">
                <Input 
                    type="text" 
                    placeholder="Username" 
                    id="username"
                    {...register("username", {required: "Username is required"})}
                />
            </div>
            <AnimatePresence>
                {errors.username && (
                    <motion.p
                        key="username-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-red-500 text-[10px] font-poppins mt-[-11px] ml-[5px]"
                    >
                        {errors.username.message}
                    </motion.p>
                )}
            </AnimatePresence>

            <div className="input-box">
                <Input 
                    placeholder="Password"
                    type={showPass ? "text" : "password"} 
                    id="password"
                    {...register("password", {required: "Password is required"})}
                    />
                      <span
                        onClick={() => setShowPass(!showPass)}
                        className="absolute translate-y-4 -translate-x-9 opacity-[0.6]"
                    >
                        {showPass ? <FaEye size={20}/> : <FaEyeSlash size={20}/>  }
                    </span>
            </div>
            <AnimatePresence>
                {errors.password && (
                    <motion.p
                        key="password-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-red-500 text-[10px] font-poppins mt-[-11px] ml-[5px]"
                    >
                        {errors.password.message}
                    </motion.p>
                )}
            </AnimatePresence>
            <Button type="submit">Sign up</Button>
        </form>
    )
}

export default Signup;   