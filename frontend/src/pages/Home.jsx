import paperBag from "../assets/icons/paper-bag.png";
import siomai from "../assets/images/siomai.png";
import spices from "../assets/images/spices.png";
import pepper from "../assets/images/pepper.png";
import sale from "../assets/images/sale.png";
import chilli from "../assets/images/chilli.png";
import shadow from "../assets/images/chilli_shadow.png";
import Left from "../assets/images/left-bg.png";
import Right from "../assets/images/right-bg.png";
import { motion } from "framer-motion";
import Service from '../components/Service';
import Trend from "../components/Trend";
import Promotion from "../components/Promotion";
import HowItWorks from "../components/HowItWorks";
import FeedBack from "../components/Feeback";

const Home = () => {
    return (
        <div className="flex flex-col h-fullscreen">
            <div className="relative bg-[#F3EBDD] flex w-full overflow-hidden">
                <img src={Left} alt="left-bg" className="absolute mt-[7%] left-[-1.3%]" />
                <div className="flex flex-col w-1/2 justify-center items-center relative">
                    <motion.div 
                            // Styling
                            className="flex flex-col w-[600px] gap-[15px] p-[20px] ml-[10rem] mb-[2%]" 
                            // Animation
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                             viewport={{amount: 0.3, once: false}}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                        <div 
                            // Styling
                            className="bg-[#E00000] w-[236px] h-[25px] rounded-[5px] flex justify-center text-white font-medium text-[13px] font-poppins items-center
                            [clip-path:polygon(0_0,100%_0,90%_50%,100%_100%,0_100%)]">
                            <p>Free Home Delivery</p>
                        </div>
                        <div className="flex flex-col gap-5">
                            <h1 className="text-4xl font-semibold text-[50px] leading-[61px] font-poppins">
                                Fresh steamed <br />
                                <span className="text-[#FFA410]">siomai,</span> ready in <br />
                                minutes.
                            </h1>
                            <p className="font-poppins opacity-[0.7]">
                                Experience authentic Filipino flavors crafted with the freshest <br />
                                ingredients. 
                                From our kitchen to your table — fast, flavorful, and unforgettable.
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <button className="font-poppins shadow-md bg-[#FFA410] px-6 py-3 rounded-full text-white flex items-center gap-4 mt-9">
                                <img src={paperBag} alt="" className="w-5 h-5" />
                                <span>Order Now</span>
                            </button>
                             <button className="text-black font-[500] border-2 border-black/20  font-poppins px-6 py-3 rounded-full flex items-center gap-4 mt-9">
                                <span>View Menu</span>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{amount: 0.3, once: false}}
                        transition={{ duration: 0.7, 
                                      delay: 0.8,
                                      ease: "easeOut" }}
                    >
                        <img src={shadow} alt="chilli-shadow" className="absolute w-[105px] left-[12%] bottom-[8.7%] rotate-[-2deg] z-0"/>
                        <img src={chilli} alt="chilli" className="absolute w-[157.4px] left-[10%] bottom-[5%] rotate-[30deg] "/>
                    </motion.div>
                   
                </div>
                <div className="w-1/2 flex justify-center items-center ">
                    <motion.div 
                        // Styling
                        className="relative h-[600px] mb-[25%]" 
                        // Animation
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                         viewport={{amount: 0.3, once: false}}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <img src={spices} alt="spices" className="absolute bottom-[-45%] left-[5%] w-[530px] rotate-[100deg]"/>
                        <motion.img src={pepper} alt="pepper" className="absolute w-[143px] top-[35%] left-[64%] rotate-[10deg]"
                         animate={{
                            y: [0, -70, -70, -70, -70, 0], // floating
                            rotate: [0, -90, 0, -90, 1, 0, 0, 0, 0], // shaking
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        />
                        <motion.img src={siomai} alt="siomai" className="w-[900px] mt-[17%]  relative"
                              animate={{
                                rotate: [0, -1, 1, -1, 1, 0, 0, 0, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        <motion.img src={sale} alt="sale" className="absolute w-[178px] top-[35%] left-[1%]"
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.div>
                </div>
                <img src={Right} alt="Right-bg" className="absolute right-[-2.1%] mt-[8%]" />
            </div>
            <Service/>
            <Trend/>
            <Promotion/>
            <HowItWorks/>
            <FeedBack/>
        </div>
        
    )
}

export default Home;