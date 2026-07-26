const ModalForm = ({
    onClose,
    children,
    maxWidth = "max-w-md",
}) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
        >
            <div
                className={`
                    relative
                    flex
                    flex-col
                    w-full
                    ${maxWidth}
                    max-h-[90vh]
                    min-h-0
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    p-8
                    shadow-2xl
                    animate-slide-up
                `}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {children}
            </div>
        </div>
    );
};

export default ModalForm;