import {useCart} from "../../context/cartContext";

export default function ToggleCartOrder({showModal, setShowModal}) {
    const { cartItems } = useCart();

    return (
      <>
          {/* Overlay */}
          <div
              onClick={() => setShowModal(false)}
              className={`
                  fixed inset-0 bg-black/30 transition-opacity duration-300
                  ${showModal ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}
              `}
          />

          {/* Right Side Modal */}
          <div
              onClick={(e) => e.stopPropagation()}
              className={`
                  fixed top-0 right-0 h-full w-[600px] bg-white shadow-xl z-50
                  transform transition-transform duration-500 ease-in-out
                  ${showModal ? "translate-x-0" : "translate-x-full"}
              `}
          >
              <div className="p-5 h-full">
                  <h2 className="text-xl font-semibold mb-4">Cart</h2>

                  <div className="flex w-full h-full flex-col gap-4 px-4">
                    <div className= "flex gap-6 bg-gray-500/10 w-full justify-end px-4 py-2 font-poppins text-sm font-normal text-gray-500/90 rounded-md">
                        <div>Unit Price</div>
                        <div>Quantity</div>
                        <div>Total Price</div>
                        <div>Actions</div>
                    </div>
                    {cartItems.map((item) => (
                        <>
                        <div className="flex items-center gap-3 w-full bg-gray-500/10 px-2 py-2 rounded-md">
                            <div key={item.id}>
                                <img 
                                    className="w-16 h-16 object-cover rounded-md"
                                    src={item.product.imageUrl} 
                                    alt={item.name} />
                            </div>
                            <div className="w-[110px] font-poppins text-[10px] leading-[12px]">
                                <h1>{item.product.name}</h1>
                                {item.product.description}
                            </div>
                            <div className="flex flex-1 gap-16 justify-center items-center font-poppins">
                                <div>
                                    ₱{item.product.price}
                                </div>
                                <div>
                                    {item.quantity}
                                </div>
                                <div className="text-[#FFA410]">
                                    {`₱${item.product.price * item.quantity}`}
                                </div>
                                <div>
                                    <button>
                                        delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        </>
                    )

                    )}

                    <div className="flex justify-between items-center mt-auto mb-12 px-4 py-2 font-poppins text-sm font-normal w-full bg-gray-500/10 rounded-md">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-[#FFA410] font-semibold text-[17px] flex items-center gap-2">
                               <span className="font-poppins font-normal text-[12px] text-black">Total({cartItems.length} item) : </span>&nbsp;
                                {cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                            </h1>
                        </div>
                        <div>
                            <button className="bg-[#FFA410] text-white px-4 py-2 rounded-md">
                                Check Out
                            </button>
                        </div>
                    </div>
                    
                </div>

            </div>
          </div>
        </>
    )
}

