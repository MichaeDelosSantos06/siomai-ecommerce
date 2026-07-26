import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useLogin from "../hooks/useLogin";

const Login = () => {

    const {register, handleSubmit, formState: {errors}} = useForm({mode: 'onSubmit', reValidateMode: 'onChange'});
    const {onSubmit, error} = useLogin();
    const [showPass, setShowPass] = useState(false);
   const firstError = errors.email?.message || errors.password?.message;
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full p-[15px] gap-[20px] justify-center">
            <AnimatePresence>
                 {error && (
                    <motion.p 
                    key="input-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-orange-500 text-[12px] bg-orange-200 py-[5px] px-[10px] rounded ">
                        {error}
                    </motion.p>
                )}

               {firstError && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-orange-500 text-[12px] bg-orange-200 py-[5px] px-[10px] rounded"
                    >
                        {firstError}
                    </motion.p>
                )}
            </AnimatePresence>


            <div className="input-box">
                <Input 
                    type="text" 
                    placeholder="Email" 
                    id="email"
                    {...register("email", {required: "Email is required"})}
                />
            </div>
            

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
            
            <Button type="submit">Login</Button>
        </form>
    )
}

export default Login;   