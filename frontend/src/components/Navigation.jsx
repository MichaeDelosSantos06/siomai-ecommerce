import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ShoppingIcons from "./navigation-components/ShopIcons";
import NavLinks from "./navigation-components/NavLinks";
import MainLogo from "./navigation-components/MainLogo";
import ToggleDropdown from "./navigation-components/ToggleDropdown";
import { AdminTopbar } from "./adminDashboard/AdminTopBar";

const Navigation = () => {

    const navigate = useNavigate();
    const {isAuthenticated, loading, user} = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner !! TO BE PUT ON COMPONENTS
    }

    return (
        <div className=" fixed bg-[#F3EBDD]/95 w-full z-10 shadow-md">
            <div className="flex items-center h-[80px] justify-center gap-[8%]">
                { isAuthenticated && user.role === 'ADMIN' ? (
                     <div className="flex w-1/2 items-center">
                        <MainLogo/>
                        <NavLinks/>
                     </div>
                ) : (
                    <div className="flex w-1/2 items-center">
                        <MainLogo/>
                        <NavLinks/>
                    </div>
                )}
                
                <div className="flex justify-center items-center">
                    <div className="w-[300px] justify-end  py-[10px] flex gap-[40px]">
                        { isAuthenticated ? (
                            <div className="flex w-full gap-10">
                                <ShoppingIcons/>
                                <ToggleDropdown/>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <ShoppingIcons/>
                                <button 
                                    className="font-poppins text-semibold font-[500] text-[14.5px] opacity-[0.8] w-[100px]  text-gray-800"
                                    onClick={() => navigate('/Login')}
                                    >
                                    Sign In
                                </button>
                                <button 
                                    className="bg-[#FFA410] px-[5%] py-[3%] rounded-full font-poppins text-white font-bold text-[14px] w-[110px]"
                                    onClick={() => navigate('/Login')}
                                    >
                                    Order Now
                                </button>
                            </div >
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default Navigation;