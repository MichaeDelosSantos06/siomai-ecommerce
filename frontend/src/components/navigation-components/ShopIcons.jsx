import { FiSearch } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/cartContext";
import { Link, useLocation } from "react-router-dom";

const ShoppingIcons = () => {
    const location = useLocation();
    const isOrderMenu = location.pathname === "/OrderMenu";
    const icons = "text-gray-700";
    const { cartItems } = useCart();
    const totalQuantity = (cartItems || []).reduce(
        (sum, item) => sum + (item.productId || 1),
        0
        );

    return (
        <div className="flex gap-8">
            {!isOrderMenu && (
                <button>
                    <FiSearch size={17} className={icons}/>
                </button>
            )}
            <Link to='/Cart'>
                <FiShoppingCart size={17} className={icons}/>
                <span
                    className="absolute bg-[#FFA410] rounded-full w-[18px] h-[10px] p-[10px] flex items-center justify-center text-white font-poppins font-semibold text-[12px] top-[20px] ml-[10px]"
                >{totalQuantity}
                </span>
            </Link>
        </div>
    )
}

export default ShoppingIcons;
