import Parcel from "../assets/images/parcel.png";
import Clock from "../assets/images/clock.png";
import Motor from "../assets/images/motorbike.png";

const HowItWorks = () => {
    return (
        <div className="mt-[6%] mb-[6%]">
            <div className="flex flex-col items-center justify-center   ">
                <div className="font-poppins font-bold text-[40px]">
                    <p>How It <span className="text-[#FFA410]">Works</span></p>
                </div>
                <div className="mt-[15px] font-poppins text-[16px] opacity-[0.7]">
                    <p>Three simple steps to enjoy the best siomai in town.</p>
                </div>
                <div className="flex justify-center mt-[5%] gap-12">
                    <div className="flex justify-center flex-col items-center w-[400px] h-[250px] p-12 rounded-md bg-[#F97D00]/10 shadow-lg">
                        <span
                            className="absolute bg-[#FF9000] w-[33px] h-[33px] 
                                flex justify-center items-center 
                                font-poppins text-white font-bold rounded-full
                                mb-[16.5%] shadow-[0_4px_5px_rgba(0,0,0,0.50)]
                        ">
                            1
                        </span>
                        <div className="bg-[#FFA410]/45 w-[50px] h-[50px] flex justify-center items-center rounded-xl mb-[15px]">
                            <img src={Parcel} alt="parcel" className="w-[35px]"/>
                        </div>
                        <div className="font-poppins font-semibold text-[17px]">
                            <p>Choose Your Cravings</p>
                        </div>
                        <div className="w-[85%] flex justify-center items-center mt-[10px] font-poppins text-[13px] opacity-[.8]">
                            <p className="text-center"> Pick your favorite from our freshly made menu.</p>
                        </div>
                    </div>
                    <div  className="flex justify-center flex-col items-center bg-[#26FF00]/10 w-[400px] p-4 rounded-md shadow-lg"> 
                        <span
                            className="absolute bg-[#0FE600] w-[33px] h-[33px] 
                                flex justify-center items-center 
                                font-poppins text-white font-bold rounded-full
                                mb-[16.5%] shadow-[0_4px_5px_rgba(0,0,0,0.50)]
                        ">
                            2
                        </span>
                        <div className="bg-[#0FE600]/45 w-[50px] h-[50px] flex justify-center items-center rounded-xl mb-[15px]">
                            <img src={Clock} alt="clock" className="w-[35px]"/>
                        </div>
                        <div className="font-poppins font-semibold text-[17px]">
                           <p>Place Your Order</p>
                        </div>
                        <div className="w-[85%] flex justify-center items-center mt-[10px] font-poppins text-[13px] opacity-[.8]">
                           <p className="text-center">Fast and easy ordering for instant cravings satisfaction</p>
                        </div>
                    </div>
                    <div  className="flex justify-center flex-col items-center bg-[#F8F8F8] w-[400px] p-4 rounded-md shadow-lg">
                        <span
                            className="absolute bg-gradient-to-r from-[#EF8801] to-[#FFC892] w-[33px] h-[33px] 
                                flex justify-center items-center 
                                font-poppins text-white font-bold rounded-full
                                mb-[16.5%] shadow-[0_4px_5px_rgba(0,0,0,0.50)]
                        ">
                            3
                        </span>
                        <div className="bg-[#FCD200]/45 w-[50px] h-[50px] flex justify-center items-center rounded-xl mb-[15px]">
                            <img src={Motor} alt="motorbbike" className="w-[35px]"/>
                        </div>
                        <div className="font-poppins font-semibold text-[17px]">
                           <p>Delivered Fresh & Hot</p>
                        </div>
                        <div className="w-[85%] flex justify-center items-center mt-[10px] font-poppins text-[13px] opacity-[.8]">
                            <p className="text-center">Fresh, hot, and dlivered fast right to you.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks;