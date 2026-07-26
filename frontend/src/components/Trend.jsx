import Siomai from "../assets/images/pork-siomai.jpg";
import Bag from "../assets/icons/paper-bag.png";
import { FaStar} from "react-icons/fa";
import { useHotPicks } from "../hooks/TrendingProducts";
import useAddToCart from "../hooks/useAddToCart";

const Trend = () => {

    const { product, isLoading} = useHotPicks();
    const { onClick } = useAddToCart();

    if(isLoading){
        return <p>Loading...</p>
    }

    return (
        <div className="bg-[#F3EBDD]/20 w-full h-full pb-[8%] mt-[5%]">
            <div className="flex flex-col mt-[5%] mx-[5%]">
                <div className="flex justify-center items-center flex-col gap-4 mb-[1rem]">
                    <p className="font-poppins font-bold text-[40px]">Trending <span className="text-[#FFA410]">Now</span></p>
                    <p className="font-poppins text-center text-[15px] opacity-[0.7]">Our most-loved siomai picks, chosen by thousands of happy <br />
                    customers.</p>
                </div>
                <div className="flex gap-[2%] justify-center">
                    {product.length === 0 ? (
                        <div className="flex items-center justify-center w-full py-20">
                            <p className="font-poppins text-[18px] text-gray-500">No Featured Product Available</p>
                        </div>
                    ) : (
                        product.map((hot) => (
                            <div key={hot.id}
                                className="group relative flex flex-col items-center rounded-[12px] w-[21%] h-[360px] mt-[4%] bg-white
                                shadow-md
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                hover:shadow-[0px_20px_40px_rgba(0,0,0,0.15)]">
                            {/* TOP PICKS/ORDERS PER WEEK */}
                    
                            <span className="absolute z-10 bg-white/80 text-center left-4 top-4 rounded-full w-[60px] h-[25px] font-poppins font-semibold text-[12px] flex items-center justify-center gap-1">
                                <FaStar className="text-[#FFA410]" size={13}/> 4.9
                            </span>
                            <div className="overflow-hidden flex justify-center rounded-[10px] w-full h-[190px] mb-[2%] rounded-br-[0px] rounded-bl-[0px]">
                                <img src={hot.imageUrl} alt="Siomai" className="rounded-tr-[10px] rounded-tl-[10px] object-cover w-full h-[190px] transition-transform
                                duration-500
                                group-hover:scale-105"/>
                            </div>
                            <div className="flex flex-col py-[15px] px-[20px] w-full h-[41%]">
                                <div >
                                    <p className="font-poppins font-bold text-[18px] mb-[2%]">{hot.name}</p>
                                </div>
                                <div>
                                <p className="font-poppins text-[12px] opacity-[0.7] h-[55px]">
                                {hot.description}
                                </p>
                                </div>
                                <div className="flex mt-[2%] justify-between items-center">
                                    <div>   
                                        <p className="font-poppins font-bold text-[20px] text-[#FFA410]">₱{hot.price}</p>
                                    </div>
                                    <button 
                                    onClick={() => onClick(hot.id)}
                                    className="bg-[#FFA410] rounded-full text-white flex shadow items-center justify-center gap-[12px] w-[90px] h-[35px] shadow
                                                        transition-all
                                                        duration-300
                                                        hover:scale-[1.03]">
                                        <img src={Bag} alt="bag" className="w-[15px] h-[15px]"/>
                                        <span className="font-poppins text-[15px] font-bold">Add</span>
                                    </button>
                                </div>
                                
                            </div>  
                        
                        </div>
                        ))
                    )}
                
                </div>
            </div>
        </div>
    )
}

export default Trend;