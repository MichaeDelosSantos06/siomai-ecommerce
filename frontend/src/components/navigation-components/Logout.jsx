import useLogout from "../../hooks/HandleLogout"

const Logout = () => {
    const handleLogout = useLogout();

    return (
        <div>
            <button
                onClick={handleLogout} 
                className="bg-gray-500/50 px-[5%] py-[5%] w-[190px] rounded-full font-poppins text-white font-bold text-[16px] mt-4">
                    Log out
            </button>
        </div>
    )
}

export default Logout;