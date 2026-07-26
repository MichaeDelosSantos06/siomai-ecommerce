import { useGetProduct } from "../hooks/useAdminDashoard";
import useProductFilter from "../hooks/useProductFilter";
import { LuSearch } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { useState } from "react";
import ModalForm from "../components/modalForm";
import AddProductForm from "../components/AddProductForm";
import { LuPencil } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import Filter from "../components/adminDashboard/dashboardMenu/Filter";
import EditProductForm from "../components/adminDashboard/EditProductForm";
import DeleteModal from "../components/adminDashboard/dashboardMenu/DeleteModal";
import useUpdateAvailability from "../hooks/Products/useUpdateAvailability";

const AdminMenuItems = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { isLoading, product, refetch } = useGetProduct();
    const [openDelForm, setOpenDelForm] = useState(false);
    const { updateAvailability } = useUpdateAvailability();
    
    const { 
        searchQuery, 
        setSearchQuery, 
        filteredProducts, 
        hasActiveSearch,
    } = useProductFilter(product);

    return (
        <div className="w-full mt-4 flex flex-col items-center h-full">
            <div className="flex justify-between item-center w-[90%] bg-white mt-4 p-4 rounded-2xl shadow">
                <div className="relative flex w-full h-[50px] justify-center items-center">
                    <LuSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={17}
                    />

                    <input
                        type="search"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-1 focus:ring-[#FFA410] font-poppins text-[15px]"
                        aria-label="Search menu items"
                    />
              
                    <div className="bg-[#FFA410] relative rounded-xl h-[80%] w-[150px] ml-4">
                        <button 
                            onClick={() => setIsOpen(true)}
                            className="flex items-center justify-center w-full h-full gap-2 px-2">
                            <LuPlus className="text-white" size={17}/>
                            <p className="font-poppins text-white">
                                Add Item
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {isOpen && (
                <ModalForm maxWidth="max-w-2xl" onClose={() => {setIsOpen(false); refetch();}}>
                    <AddProductForm
                        onClose={() => refetch()}
                    />
                </ModalForm>
            )}

            {openEditForm && selectedProduct && (
                <ModalForm maxWidth="max-w-2xl" onClose={() => {setOpenEditForm(false); setSelectedProduct(null); refetch()}}>
                    <EditProductForm
                        product={selectedProduct}
                        onClose={() => {
                            setOpenEditForm(false);
                            setSelectedProduct(null);
                            refetch();
                        }}
                    />
                </ModalForm>
            )}
            
            {openDelForm && selectedProduct && (
                <ModalForm onClose={() => {setOpenDelForm(false); setSelectedProduct(null); refetch()}}>
                    <DeleteModal
                        productId={selectedProduct}
                        onClose={() => {
                            setOpenDelForm(false);
                            setSelectedProduct(null);
                            refetch();
                        }}
                    />
                </ModalForm>
            )

            }

            {/* FILTERS */}
               <Filter/>

            {/* PRODUCTS */}
            <div className="grid grid-cols-3 w-[90%] items-start mt-4 py-1 gap-4 flex-1 overflow-y-auto scrollbar-hide">
                {isLoading ? (
                    <div className="col-span-3 flex items-center justify-center py-10">
                        <span className="text-gray-500 font-poppins text-[15px]">Loading products...</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-3 flex flex-col items-center justify-center py-10">
                        <p className="text-gray-500 font-poppins text-[15px] text-center">
                            {hasActiveSearch 
                                ? `No products found matching "${searchQuery}"` 
                                : "No products available"}
                        </p>
                    </div>
                ) : (
                    filteredProducts.map((item) => {
                        const isUnavailable = !item.stock || !item.isActive;
                        return (
                            <div key={item.id} className={`bg-white rounded-xl shadow-md relative ${isUnavailable ? 'opacity-40' : ''}`}>
                                {isUnavailable && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                        <span className=" font-poppins text-[20px] font-bold text-black bg-white px-4 py-2 rounded-lg">
                                            Unavailable
                                        </span>
                                    </div>
                                )}
                                <div className="bg-red-500 rounded-xl h-[180px]">
                                    <img 
                                        src={item.imageUrl} 
                                        alt="product-photo" 
                                        className="relative flex object-cover bg-green-500 w-full h-[100%] rounded-tr-xl rounded-tl-xl"
                                    />
                                </div>
                                <div className="w-full h-full p-3">
                                    <div>
                                        <div className="h-[100px]">
                                            <div className="flex justify-between">
                                                <div className="mb-2">
                                                    <span className="font-poppins text-[16px] font-semibold">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-poppins font-semibold text-[#FFA410]">
                                                        ₱{item.price}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-[85%] leading-none">
                                                <span className="font-poppins text-[13px] opacity-[.6]">
                                                    {item.description}
                                                </span>
                                            </div>
                                            <div className="w-full flex mt-5">
                                                <span className="flex ml-auto items-center font-poppins font-normal text-[12px] text-gray-500/70">
                                                    {`Stock: ${item.stock}`}
                                                </span>
                                            </div>
                                        </div>
                                        <hr className="mb-3"/>

                                        {/* Toggle active button */}
                                        <div className=" flex justify-between">
                                            <div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={item.isActive}
                                                        onChange={async () => {
                                                            await updateAvailability(item.id);
                                                            refetch();
                                                        }}
                                                    />

                                                    <div
                                                        className={`
                                                            relative
                                                            w-6 h-3
                                                            rounded-full
                                                            border
                                                            transition-all duration-200
                                                            ${item.isActive 
                                                                ? 'border-green-500 bg-white after:bg-green-500' 
                                                                : 'border-gray-400 bg-gray-200 after:bg-gray-400'
                                                            }

                                                            after:content-['']
                                                            after:absolute
                                                            after:w-2
                                                            after:h-2
                                                            after:rounded-full
                                                            after:top-1/2
                                                            after:left-[1px]
                                                            after:-translate-y-1/2
                                                            after:transition-transform
                                                            peer-checked:after:translate-x-3
                                                            peer-checked:after:-translate-y-1/2
                                                        `}
                                                    ></div>
                                                    <span className={`font-poppins text-[12px] ml-2 ${item.isActive ? '' : 'text-gray-400'}`}>
                                                        {item.isActive ? 'available' : 'unavailable'}
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => {setOpenEditForm(true); setSelectedProduct(item)}}
                                                >
                                                     <LuPencil size={15} className="opacity-[.6]"/>
                                                </button>
                                                <button                                               
                                                    onClick={() => {setOpenDelForm(true); setSelectedProduct(item.id)}}
                                                >
                                                    <LuTrash2 size={15}  className="opacity-[.6]"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}

export default AdminMenuItems;