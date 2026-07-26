import { FaStar } from "react-icons/fa";

const FeedBack = () => {
    return (
        <div className="w-full h-[600px] flex flex-col mt-[5%] bg-[#F3EBDD]/20 pt-[5rem]">
            <div className="text-center flex flex-col justify-center items-center">
                <div>
                    <p className="font-poppins font-bold text-[40px]">
                        Filipino <span className="text-[#FFA410]">Stories</span>
                    </p>
                </div>
                <div className="w-1/2">
                    <p className="font-poppins text-[16px] opacity-[.7] mt-[12px]">
                        Hear what our customers have to say about their siomai <br /> 
                        experience.
                    </p>
                </div>
            </div>
            <div className="flex justify-center items-center gap-7 mt-[5%]">
                <div className="w-[28%] h-[240px] rounded-xl p-8 shadow-lg bg-white">
                    <div className="flex flex-col gap-5 mb-6">
                        <div className="flex gap-3">
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                        </div>
                        <div>
                            <p className="font-poppins text-[14px] italic opacity-[.8]">
                                &quot;The best siomai I have ever tasted! It reminds me of my grandmother&#34;s cooking. Fresh, flavorful, and always delivered on time.&quot;
                            </p>
                        </div>
                    </div>
                    <hr className="border-1 border-gray/40 mb-[15px]"/>
                    <div className="flex gap-4">
                        <div className="bg-gray-500 rounded-full w-[45px] h-[45px] flex justify-center items-center">
                            picture
                        </div>
                        <div>
                            <div>
                                <p className="font-poppins text-[15px] font-semibold">
                                    Kyla Marie
                                </p>
                            </div>
                            <div>
                                <p className="font-poppins text-[12px] opacity-[.8]">
                                    Manila
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className=" w-[28%] h-[240px] rounded-xl p-8 shadow-lg bg-white">
                    <div className="flex flex-col gap-5 mb-6">
                        <div className="flex gap-3">
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                        </div>
                        <div>
                            <p className="font-poppins text-[14px] italic opacity-[.8]">
                                &quot;The best siomai I have ever tasted! It reminds me of my grandmother&#34;s cooking. Fresh, flavorful, and always delivered on time.&quot;
                            </p>
                        </div>
                    </div>
                    <hr className="border-1 border-gray/40 mb-[15px]"/>
                    <div className="flex gap-4">
                        <div className="bg-gray-500 rounded-full w-[45px] h-[45px] flex justify-center items-center">
                            picture
                        </div>
                        <div>
                            <div>
                                <p className="font-poppins text-[15px] font-semibold">
                                    Kyla Marie
                                </p>
                            </div>
                            <div>
                                <p className="font-poppins text-[12px] opacity-[.8]">
                                    Manila
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className=" w-[28%] h-[240px] rounded-xl p-8 shadow-lg bg-white">
                    <div className="flex flex-col gap-5 mb-6">
                        <div className="flex gap-3">
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                            <FaStar className="text-orange-500"/>
                        </div>
                        <div>
                            <p className="font-poppins text-[14px] italic opacity-[.8]">
                                &quot;The best siomai I have ever tasted! It reminds me of my grandmother&#34;s cooking. Fresh, flavorful, and always delivered on time.&quot;
                            </p>
                        </div>
                    </div>
                    <hr className="border-1 border-gray/40 mb-[15px]"/>
                    <div className="flex gap-4">
                        <div className="bg-gray-500 rounded-full w-[45px] h-[45px] flex justify-center items-center">
                            picture
                        </div>
                        <div>
                            <div>
                                <p className="font-poppins text-[15px] font-semibold">
                                    Kyla Marie
                                </p>
                            </div>
                            <div>
                                <p className="font-poppins text-[12px] opacity-[.8]">
                                    Manila
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedBack;