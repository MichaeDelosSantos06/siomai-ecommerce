import { Search } from "lucide-react";

const SearchProduct = ({search, setSearch}) => {
    return (
        <div className="relative w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            placeholder="Search menu items..."
            className="w-full rounded-full border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-orange-400"
            values={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
    )
}

export default SearchProduct;