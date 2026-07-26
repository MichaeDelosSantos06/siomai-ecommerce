import { useAuth } from "../../context/authContext"


export const AdminTopbar = () => {

    const { user } = useAuth();

    return (
        <div className="flex bg-gray-500 w-full h-[90px] justify-between py-3 px-8 items-center">
            <div className="flex flex-col">
                <div className="font-poppins font-bold text-[20px]">
                    <p>
                        Dashboard
                    </p>
                </div>
                <div className="font-poppins opacity-[.8] text-[12px]">
                    <p>
                        Friday, June 26, 2026
                    </p>
                </div>
            </div>
            <div className="flex gap-5 items-center">
                <div className="">
                    <p>BELL</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="bg-pink-500 rounded-full w-[40px] h-[40px]">
                        <div className="text-center"> 
                            <p>
                                PROF
                            </p>
                        </div>
                    </div>
                    <div className="font-poppins font-semibold text-[14px]">
                        <p>
                            {user.username}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}