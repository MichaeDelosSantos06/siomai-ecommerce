import {
  ShoppingBag,
  Soup,
  CupSoda,
  Package,
  Star,
} from "lucide-react";

const categories = [
  { name: "All", icon: ShoppingBag },
  { name: "Siomai", icon: Soup },
  { name: "Gulaman", icon: CupSoda },
  { name: "Bundle", icon: Package },
  { name: "Popular", icon: Star },
];

const OrderMenuSideBar = () => {
  return (
    <aside className="w-72 bg-white shadow-md sticky top-0 p-5">
      <h2 className="text-lg font-semibold mb-6">Categories</h2>

      <div className="space-y-3">
        {categories.map(({ name, icon: Icon }, index) => (
          <button
            key={name}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition
              ${
                index === 0
                  ? "bg-orange-500 text-white"
                  : "hover:bg-orange-100 text-gray-700"
              }`}
          >
            <Icon size={20} />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default OrderMenuSideBar;