import { useState } from "react";
import DropDown from "../Dropdown";
import { FaBars } from "react-icons/fa";

const ToggleDropdown = () => {

    const [isSidebarOpen, setisSidebarOpen] = useState(false);

    return (
        <div className="flex ml-auto">
            <button 
                onClick={() => setisSidebarOpen(prev => !prev)}>
                <FaBars/>
            </button>
                <DropDown 
                isOpen={isSidebarOpen}
                onClose={() => setisSidebarOpen(false)}
            />
        </div>
    )
}

export default ToggleDropdown;