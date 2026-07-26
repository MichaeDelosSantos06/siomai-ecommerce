import { Link } from "react-router-dom"
import SecondLogo from "../../assets/images/secondLogo.png"
import { LuLayoutGrid } from "react-icons/lu";
import { LuPackage } from "react-icons/lu";       
import { LuUtensilsCrossed } from "react-icons/lu"; 
import { LuUsers } from "react-icons/lu";         
import { LuChartColumn } from "react-icons/lu";  
import { LuSettings } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";

export const AdminSidebar = () => {

    return (
        <div className="bg-black flex flex-col w-[305px] h-full gap-2">
            <div className="flex justify-center items-center h-[90px]">
                <img src={SecondLogo} alt="text-logo" className="w-1/2 object-contain"/>
            </div>
            <hr  className="border-t border-white/30"/>
            <div className="flex flex-col py-5 px-7 gap-1 text-white">
                <Link className="flex jutify-center items-center gap-4 p-4 font-poppins opacity-[.8]">
                    <LuLayoutGrid size={19}/>
                    Dashboard
                </Link>
                <Link className="flex jutify-center items-center gap-4 p-4 font-poppins opacity-[.8]">
                    <LuPackage size={19}/>
                    Orders
                </Link>
                <Link to='/Menu' className="flex jutify-center items-center gap-4 p-4 font-poppins opacity-[.8]">
                    <LuUtensilsCrossed size={19}/>
                    Menu Items
                </Link>
                <Link to='/Customer' className="flex jutify-center items-center gap-4 p-4 font-poppins opacity-[.8]">
                    <LuUsers/>
                    Customers
                </Link>
                <Link className="flex jutify-center items-center gap-4 p-4 font-poppins opacity-[.8]">
                    <LuChartColumn size={19}/>
                    Analytics
                </Link>
                <Link className="flex jutify-center items-center gap-4  p-4 font-poppins opacity-[.8]">
                    <LuSettings size={19}/>
                    Settings
                </Link>
            </div>
            <hr className="border-t border-white/30"/>
            <div className="flex text-white bg-white/10 w-[260px] m-auto rounded-xl">
                <div className="flex justify-between items-center w-full py-3 px-4">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
                        Prof
                        </div>
                        <div className="leading-tight font-poppins">
                            <p className="text-[13px] font-semibold">
                                Admin User
                            </p>
                            <p className="text-[10px] opacity-[.6] font-normal">
                                admin@gnaiul.com
                            </p>
                        </div>
                    </div>
                    <div>
                        <LuLogOut size={18} className="opacity-[.6]"/>
                    </div>
                </div>
            </div>
        </div>
    )
}