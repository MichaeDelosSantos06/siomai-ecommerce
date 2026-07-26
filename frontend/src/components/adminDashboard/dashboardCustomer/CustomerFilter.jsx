
import { FiSearch } from "react-icons/fi";

const CustomerFilters = ({search, setSearch, filter, setFilter}) => {
    const filters = ["All", "VIP", "REGULAR", "NEW"];

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">

                {/* Search */}
                <div className="relative flex-1">
                    <FiSearch
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />

                    <input
                        type="search"
                        placeholder="Search customers..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Sliding Filter */}
                <div className="relative flex bg-gray-100 rounded-xl p-1">

                    {/* Orange Indicator */}
                    <div
                        className={`absolute top-1 bottom-1 w-20 bg-orange-500 rounded-lg shadow transition-all duration-300 ease-in-out
                        ${
                            filter === "All"
                                ? "left-1"
                                : filter === "VIP"
                                ? "left-[83px]"
                                : filter === "REGULAR"
                                ? "left-[165px]"
                                : "left-[247px]"
                        }`}
                    />

                    {filters.map((customer) => (
                        <button
                            key={customer}
                            onClick={() => setFilter(customer)}
                            className={`relative z-10 w-20 py-2 text-sm font-medium transition-colors duration-300
                                ${
                                    filter === customer
                                        ? "text-white"
                                        : "text-gray-600"
                                }`}
                        >
                            {customer}
                        </button>
                    ))}

                </div>

            </div>
        </div>
    );
};

export default CustomerFilters;