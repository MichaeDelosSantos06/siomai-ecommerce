import SummaryCard from "../components/adminDashboard/dashboardCustomer/CustomerCards";
import CustomerFilters from "../components/adminDashboard/dashboardCustomer/CustomerFilter";
import CustomerTable from "../components/adminDashboard/dashboardCustomer/CustomerTable";
import CustomerPagination from "../components/adminDashboard/dashboardCustomer/CustomerPagination";
import { useState } from "react";
import useGetUserInfo from "../hooks/Customer/useUserInfo";

const AdminCustomerPage = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [page, setPage] = useState(1);

    const { totalUser, userInfo, vipUser, newUser, isLoading} = useGetUserInfo();
    
    const filteredCustomers = userInfo.filter((customer) => {
        const matchesSearch = 
            customer.username.toLowerCase().includes(search.toLowerCase()) ||
            customer.email.toLowerCase().includes(search.toLowerCase())
        
        const matchesFilter = 
            filter === "All" || customer.status === filter

        return matchesFilter && matchesSearch;
    
    });


    const ITEM_PER_PAGE = 5;
    const totalPages = Math.ceil(filteredCustomers.length / ITEM_PER_PAGE);
    const startIndex = (page - 1) * ITEM_PER_PAGE;
    const endIndex = startIndex + ITEM_PER_PAGE;
    const paginatedCustomer = filteredCustomers.slice(startIndex, endIndex);
    
    // API call here later

    return (
        <div className="mt-4 flex flex-col gap-4">

            <SummaryCard
                totalUser={totalUser}
                isLoading={isLoading}
                userInfo={userInfo}
                vipUser={vipUser}
                newUser={newUser}
            />

            <CustomerFilters
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
            />

            <CustomerTable
                userInfo={paginatedCustomer}
            />

            <CustomerPagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />

        </div>
    );
};

export default AdminCustomerPage;