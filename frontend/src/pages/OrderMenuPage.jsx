
import MainLogo from "../components/navigation-components/MainLogo";
import ShoppingIcons from "../components/navigation-components/ShopIcons";
import OrderMenuCard from "../components/OrderMenuCards";
import { useState, useEffect } from "react";
import SearchProduct from "../components/orderMenu/SearchProduct";
import useDisplayMenuList from "../hooks/Products/useFetchProductList";
import CustomerPagination from "../components/adminDashboard/dashboardCustomer/CustomerPagination";

const OrderMenu = () => {
  const [search, setSearch] = useState("");
  const { products } = useDisplayMenuList();
  const [page, setPage] = useState(1);

  const filterProducts = products.filter((product) => 
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  const ITEM_PER_PAGE = 8;
  const totalPages = Math.ceil(filterProducts.length / ITEM_PER_PAGE);
  const startIndex = (page - 1) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const paginatedProducts = filterProducts.slice(startIndex, endIndex);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-orange-500">
          <MainLogo/>
        </h1>
        <SearchProduct
          search={search}
          setSearch={setSearch}
        />
       
        <div className="mr-24">
          <ShoppingIcons/>
        </div>
      </div>

      {/* Menu */}
      <main className="px-6 py-5 flex-1 flex flex-col min-h-0">
        <h2 className="text-xl font-bold mb-4">
          Menu Items
        </h2>

        <OrderMenuCard
          products={paginatedProducts}
        />

        <div className="mt-auto pt-3 flex-shrink-0">
          <CustomerPagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </main>
    </div>
  );
};

export default OrderMenu;
