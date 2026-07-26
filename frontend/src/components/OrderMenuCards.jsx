import Bag from "../assets/icons/paper-bag.png";
import useAddToCart from "../hooks/useAddToCart";

const OrderMenuCard = ({products}) => {
    const {onClick} = useAddToCart();
    return (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 place-items-center lg:place-items-stretch">
          
             {products.length > 0 ? (
                products.map((product) => (
                    <div 
                        key={product.id}
                        className="w-full rounded-xl bg-white shadow overflow-hidden">
                            
                            {/* PRODUCT IMAGE */}
                            <div className="bg-red-500 h-[135px] w-full ">
                                <img src={product.imageUrl} alt="product image" className="h-full w-full object-cover object-center" />
                            </div>

                            <div className="p-3.5 font-poppins">

                                {/* PRODUCT NAME & STOCK */}
                                <div className="flex justify-between items-center">
                                    <div className="text-[14px]">
                                        {product.name}
                                    </div>
                                    <span className="text-[11px] opacity-50">
                                        {product.stock} items
                                    </span>
                                </div>

                                {/* PRODUCT DESCRIPTION */}
                                <div className="text-[11px] opacity-75 mb-3 leading-tight line-clamp-1">
                                    {product.description}
                                </div>

                                {/* PRODUCT PRICE & ADD BUTTON */}
                                <div className="flex justify-between items-center">
                                    <div className="text-[#FFA410] font-semibold text-[14px]">
                                        ₱{product.price}
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() => onClick(product.id)}
                                            className="bg-[#FFA410] rounded-full text-white flex shadow items-center justify-center gap-[12px] w-[75px] h-[30px] shadow
                                                                transition-all
                                                                duration-300
                                                                hover:scale-[1.03]">
                                                <img src={Bag} alt="bag" className="w-[13px] h-[13px]"/>
                                                <span className="font-poppins text-[13px] font-bold">Add</span>
                                        </button>
                                    </div>
                                       
                                </div>
                            </div>
            
                    </div>
                ))
             ):(
                <div className="col-span-full flex justify-center items-center py-64">
                    <p className="font-poppins font-normal opacity-50 text-[15px]">
                        No Available Products
                    </p>
                </div>
             )}
        </div>
    )
}

export default OrderMenuCard;