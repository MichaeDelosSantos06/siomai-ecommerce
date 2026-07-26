import { motion } from "framer-motion"
import BgSiomai from "../assets/images/siomaii2.png";

const LeftDiv = ({isLogin}) => {

    const login = "w-full h-full object-fit rounded-tl-[10px] rounded-bl-[10px]"
    const notLogin = "w-full h-full object-fit rounded-tr-[10px] rounded-br-[10px]"

    return (
        <motion.div 
                    layout
                    className="w-full"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <img src={BgSiomai} alt="siomai" className={isLogin ? login : notLogin}/>
        </motion.div>
    )
}

export default LeftDiv;