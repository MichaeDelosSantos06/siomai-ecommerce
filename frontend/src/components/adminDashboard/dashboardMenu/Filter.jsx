

const Filter = () => {
    return (
         <div className=" w-[90%] mt-5 py-4">
            <div className="relative flex gap-4 font-poppins">
                <button className="bg-white shadow rounded-xl px-4 py-1 text-[15px] opacity-[.7]">
                    <span>
                        ALL
                    </span>
                </button>   
                <button  className="bg-white shadow rounded-xl px-4 py-1 text-[15px] opacity-[.7]">
                    <span>
                        Siomai
                    </span>
                </button>
                <button  className="bg-white shadow rounded-xl px-4 py-1 text-[15px] opacity-[.7]">
                    <span>
                        Drinks
                    </span>
                </button>
                <button  className="bg-white shadow rounded-xl px-4 py-1 text-[15px] opacity-[.7]">
                    <span>
                        Combo
                    </span>
                </button>
            </div>
        </div>
    )
}

export default Filter;