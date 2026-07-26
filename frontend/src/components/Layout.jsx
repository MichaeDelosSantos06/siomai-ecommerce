import { Outlet, useLocation } from "react-router-dom"
import Navigation from "./Navigation"
import OrderMenuSideBar from "./navigation-components/OrderMenuSideBar"

const Layout = () => {
    const location = useLocation();
    const isOrderMenu = location.pathname === "/OrderMenu";

    return (
        <div className="relative w-full h-screen">   
            {isOrderMenu ? (
                <div className="flex">
                    <OrderMenuSideBar/>
                    <div className="flex-1">
                        <Outlet/>
                    </div>
                </div>
            ) : (
                <>
                    <Navigation/>
                    <div>
                        <Outlet/>
                    </div>
                </>
            )}
        </div>
    )
}
export default Layout;
