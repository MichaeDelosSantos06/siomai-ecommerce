import Muff from "../assets/images/bgMuffin.png";
import Fire from "../assets/images/fire.png";
import Fresh from "../assets/images/leaf.png";
import Thunder from "../assets/images/thunder.png";
import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";
import { Leaf } from "lucide-react";
import { Flame } from "lucide-react";

const Service = () => {
        const container = {
            hidden: {},
            show: {
                transition: {
                    staggerChildren: 0.3,
                },
            },
        };

           const item = {
            hidden: {
                opacity: 0,
            },
            show: {
                opacity: 1,
                transition: {
                    duration: 0.5,
                    ease: "easeOut",
                },
            },
        };
    return(
        <motion.div className="flex gap-8 px-10 py-2 justify-center mt-[5%]"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.3, once: false }}
        > 
            <motion.div className="group bg-[#F9F9F9] flex flex-col gap-6 px-[2.5%] py-[2.5%] rounded-[10px] w-[27%] bg-cover bg-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.50)]"
                    style={{backgroundImage: `url(${Muff})`}}
                    variants={item}
                    whileHover={{ y: -3}}
                    transition={{ stiffness: 300 }}
            >
                <div className="flex bg-orange-500/20 justify-center w-[70px] p-4 rounded-2xl transition-all duration-300
                     group-hover:bg-[#FFA410]">
                    <FiZap size={30} className="text-[#FFA410] transition-all duration-300
                        group-hover:text-white" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="tittle">
                        <p className="font-poppins font-bold text-[20px]">Lightning Fast Delivery</p>
                    </div>
                    <div className="subs">
                        <p className="font-poppins font-medium text-[13px] opacity-[0.5]">Get your favorite siomai delivered to your <br /> 
                            doorstep in under 30 minutes. Hot, fresh, and <br />
                            ready to enjoy.</p>
                    </div>
                </div>
            </motion.div>
            
              <motion.div className="group bg-[#F9F9F9] flex flex-col gap-6 px-[2.5%] py-[2.5%] rounded-[10px] w-[27%] bg-cover bg-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.50)]"
                    style={{backgroundImage: `url(${Muff})`}}
                    variants={item}
                    whileHover={{ y: -3}}
                    transition={{ stiffness: 300 }}
            >
                <div className="flex bg-orange-500/20 justify-center w-[70px] p-4 rounded-2xl transition-all duration-300
                     group-hover:bg-[#FFA410]">
                    <Leaf size={30} className="text-[#FFA410]  transition-all duration-300
                        group-hover:text-white" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="tittle">
                        <p className="font-poppins font-bold text-[20px]">Fresh Ingredients Daily</p>
                    </div>
                    <div className="subs">
                        <p className="font-poppins font-medium text-[13px] opacity-[0.5]">We source premium ingredients every morning. No shortcuts, no preservatives — just real, honest food.</p>
                    </div>
                </div>
            </motion.div>

              <motion.div className="group bg-[#F9F9F9] flex flex-col gap-6 px-[2.5%] py-[2.5%] rounded-[10px] w-[27%] bg-cover bg-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.50)]"
                    style={{backgroundImage: `url(${Muff})`}}
                    variants={item}
                    whileHover={{ y: -3}}
                    transition={{stiffness: 300 }}
            >
                <div className="flex bg-orange-500/20 justify-center w-[70px] p-4 rounded-2xl transition-all duration-300
                     group-hover:bg-[#FFA410]">
                    <Flame size={30} className="text-[#FFA410] transition-all duration-300
                        group-hover:text-white" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="tittle">
                        <p className="font-poppins font-bold text-[20px]">Authentic Filipino Taste</p>
                    </div>
                    <div className="subs">
                        <p className="font-poppins font-medium text-[13px] opacity-[0.5]">Recipes passed down through generations. Every bite is a taste of home, crafted with passion and tradition.</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Service;