import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CustomerPagination = ({ page, setPage, totalPages }) => {
    return (
        <div className="flex items-center justify-between bg-white rounded-3xl border border-gray-100 shadow-sm p-3">

            {/* Left */}
            <p className="text-xs text-gray-500">
                Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
                <span className="font-semibold text-gray-900">{totalPages}</span>
            </p>

            {/* Right */}
            <div className="flex items-center gap-2">

                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                    <FiChevronLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                page === pageNumber
                                    ? "bg-orange-500 text-white shadow"
                                    : "border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                    <FiChevronRight size={15} />
                </button>

            </div>

        </div>
    );
};

export default CustomerPagination;