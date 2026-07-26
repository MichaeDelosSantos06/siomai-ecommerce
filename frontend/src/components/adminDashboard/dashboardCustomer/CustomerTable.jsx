

import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiShoppingBag,
    FiUser
} from "react-icons/fi";


const CustomerTable = ({userInfo}) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                    {/* Table Header */}

                    <thead className="bg-gray-50 border-b">
                        <tr className="text-left text-xs font-semibold text-gray-600 uppercase">

                            <th className="px-6 py-3">Customer</th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Orders</th>
                            <th className="px-4 py-3">Total Spent</th>
                            <th className="px-4 py-3">Status</th>

                        </tr>
                    </thead>

                    {/* Table Body */}

                    <tbody>

                        {userInfo.map((customer) => (

                            <tr
                                key={customer.id}
                                className="border-b last:border-none hover:bg-orange-50/30 transition"
                            >

                                {/* Customer */}

                                <td className="px-6 py-3">

                                    <div className="flex items-center gap-3">

                                    {customer?.imageUrl ? (
                                        <img
                                            src={customer.imageUrl}
                                            alt=""
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <div className="bg-gray-200 p-1.5 rounded-full">
                                                <FiUser size={16}/>
                                            </div>
                                        </>
                                    )
                                }
                                        

                                        <div>

                                            <h3 className="font-semibold text-gray-900 text-sm">
                                                {customer.username}
                                            </h3>

                                            <p className="text-xs text-gray-500">
                                                {
                                                    `Joined ${new Date(customer.createdAT).toLocaleString("en-US", {
                                                        month: "long",
                                                        year: "numeric"
                                                    })}`
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </td>

                                {/* Contact */}

                                <td className="px-4 py-3">

                                    <div className="space-y-1">

                                        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                                            <FiMail size={13} />
                                            <span className="text-xs">{customer.email}</span>
                                        </div>

                                        {/* <div className="flex items-center gap-2 text-gray-600">
                                            <FiPhone size={15} />
                                            <span>{customer.phone}</span>
                                        </div> */}

                                    </div>

                                </td>

                                {/* Location */}

                                <td className="px-4 py-3">

                                    <div className="flex items-center gap-1.5 text-gray-700 text-sm">

                                        <FiMapPin size={14} />
                                        <span className="text-xs">{customer.addresses?.[0] ? 
                                            `${customer.addresses[0].street}, ${customer.addresses[0].barangay}`
                                            : "not available"
                                        }</span>

                                    </div>

                                </td>

                                {/* Orders */}

                                <td className="px-4 py-3">

                                    <div className="flex items-center gap-1.5 font-semibold text-gray-900 text-sm">

                                        <FiShoppingBag size={14} />
                                        <span>{customer.orders?.[0] ?
                                                `${customer.orders}`
                                                : <span className="text-gray-700 text-xs font-normal">
                                                        No Order Yet
                                                    </span>
                                            }
                                        </span>

                                    </div>

                                </td>

                                {/* Total Spent */}

                                <td className="px-4 py-3">

                                    <span className="font-bold text-base text-orange-500">
                                        {customer.spent?.[0] ?
                                            customer.spent : 
                                            <span className="text-gray-700 text-xs font-normal" >
                                                Not Available
                                            </span>
                                        }
                                    </span>

                                </td>

                                {/* Status */}

                                <td className="px-4 py-3">

                                    <span
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                            customer.status === "VIP"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {customer.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default CustomerTable;