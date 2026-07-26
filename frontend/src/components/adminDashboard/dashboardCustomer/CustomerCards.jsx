import { FiUsers } from "react-icons/fi";
import { FiStar } from "react-icons/fi";
import { FiUserPlus } from "react-icons/fi";
import { FiDollarSign } from "react-icons/fi";

const SummaryCard = ({ totalUser, vipUser, newUser, isLoading}) => {
    return (
        <div className="grid grid-cols-4 gap-3">
            <div className="relative flex flex-1 overflow-hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
            
                {/* Decorative Circle */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-50 rounded-full"></div>

                <div className="relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                         <FiUsers size={16}/>
                    </div>

                    <div className="mt-3">
                        <p className="text-gray-500 text-[11px] font-medium">
                            Total Customer
                        </p>

                        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">
                            <span>
                                {isLoading ? (<p className="font-poppins text-[10px] opacity-[.7]">loading...</p>)
                                : totalUser
                                }
                            </span>
                        </h1>

                        <div className="mt-2 h-0.5 w-12 rounded-full bg-blue-500"></div>
                    </div>
                </div>
            </div>

            <div className="relative flex flex-1 overflow-hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
            
                {/* Decorative Circle */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-50 rounded-full"></div>

                <div className="relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                        <FiStar size={16}/>
                    </div>

                    <div className="mt-3">
                        <p className="text-gray-500 text-[11px] font-medium">
                            VIP Customer
                        </p>

                        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">
                            <span>
                                {isLoading ? (<p className="font-poppins text-[10px] opacity-[.7]">loading...</p>)
                                : vipUser
                                }
                            </span>
                        </h1>

                        <div className="mt-2 h-0.5 w-12 rounded-full bg-yellow-500"></div>
                    </div>
                </div>
            </div>

            <div className="relative flex flex-1 overflow-hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
            
                {/* Decorative Circle */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-green-50 rounded-full"></div>

                <div className="relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                        <FiUserPlus size={16}/>
                    </div>

                    <div className="mt-3">
                        <p className="text-gray-500 text-[11px] font-medium">
                            New This Month
                        </p>

                        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">
                            {isLoading ? (<p className="font-poppins text-[10px] opacity-[.7]">loading...</p>)
                                : newUser
                            }
                        </h1>

                        <div className="mt-2 h-0.5 w-12 rounded-full bg-green-500"></div>
                    </div>
                </div>
            </div>

            <div className="relative flex flex-1 overflow-hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
            
                {/* Decorative Circle */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-50 rounded-full"></div>

                <div className="relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                        <FiDollarSign size={16}/>
                    </div>

                    <div className="mt-3">
                        <p className="text-gray-500 text-[11px] font-medium">
                            Average Order value
                        </p>

                        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">
                            <span>100</span>
                        </h1>

                        <div className="mt-2 h-0.5 w-12 rounded-full bg-yellow-500"></div>
                    </div>
                </div>
            </div>

        </div>
        
    );
};

export default SummaryCard;