import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopBar";

const AdminPageLayout = () => {
    return (
        <div className="flex w-full h-screen overflow-hidden">
            <div className="flex">
                <AdminSidebar />
            </div>

            <div className="flex flex-col w-[90%] items-center h-full">
                <AdminTopbar />

                {/* Scrollable Outlet */}
                <div className="flex-1 w-[95%] rounded-lg overflow-y-auto scrollbar-hide">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminPageLayout;