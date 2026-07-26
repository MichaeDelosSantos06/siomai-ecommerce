import { useGetBanner } from "../hooks/useGetBanner";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Promotion = () => {
    const { activeBanner} = useGetBanner();
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
            staggerChildren: 0.18,
            delayChildren: 0.2,
            },
        },
        };

        const itemVariants = {
        hidden: {
            opacity: 0,
            x: -40,
            filter: "blur(8px)",
        },
        visible: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1], // premium ease
            },
        },
    };
    return (
        <div className="bg-black w-full h-[480px] flex items-center justify-between ">   
            { activeBanner ? (
                <>
                    <motion.div className="flex w-[46%] h-[70%] ml-[8%] p-4 flex-col gap-6"
                          variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                    >
                        <motion.div 
                        variants={itemVariants}
                        className="
                            bg-[#FFA410]/10 flex w-[25%] justify-center 
                            items-center font-poppins text-[#FFA410]
                            rounded-full p-[4px] border border-[#FFA410]/30
                            font-medium text-[14px] py-[7px]
                        ">
                            Limited Time Offer
                        </motion.div>
                        <motion.div
                        variants={itemVariants} 
                        className="
                            font-poppins text-white leading-none 
                            text-[50px] font-bold
                        ">
                            {activeBanner.titlePrefix} <span className="text-[#FFA410]">
                                {activeBanner.highlightedWord}
                            </span>
                        </motion.div>
                        <motion.div 
                        variants={itemVariants}
                        className="
                            font-poppins text-white text-[17px] 
                            w-[65%] opacity-[0.7]
                        ">
                            {activeBanner.description}
                        </motion.div>
                        <motion.div 
                        variants={itemVariants}
                        className="
                            font-poppins text-white font-semibold
                        ">
                            <button className="
                                bg-[#FFA410] w-[30%] h-[55px] rounded-full
                                flex justify-center items-center
                                gap-4
                            ">
                                Claim Promo <FaArrowRight/>
                            </button>
                        </motion.div>
                    </motion.div>
                     <div className="w-[35%] h-[75%] flex justify-center items-center bg-white rounded-lg mr-[9%]">
                        <img 
                            className="flex w-full h-full object-fit rounded-lg"
                            src={activeBanner.imageUrl}
                            alt="promotion banner"
                        /> 
                    </div>
                </>
            ): (
                <div className="w-full h-full flex justify-center items-center">
                    <span className="font-poppins text-white text-[15px]">
                        Not Available
                    </span>
                </div>
            )
        }
        </div>
    )
}

export default Promotion;