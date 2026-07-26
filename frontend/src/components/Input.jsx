import React from "react";

const Input = React.forwardRef((props, ref) => {

    return (
        <input
            ref={ref}
            {...props}
            className="
                w-full
                h-[52px]
                border border-gray-300
                placeholder:font-poppins
                placeholder:text-[13px]
                text-[13px]
                rounded-md
                px-3 py-2
                focus:outline-none
                focus:ring-
                focus:outline-none
                bg-[#F7F7F7]
                shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
            "
        />
    )
})
Input.displayName = "Input";

export default Input;