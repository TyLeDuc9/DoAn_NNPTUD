export const SortBook = ({ sort, setSort }) => {
  return (
    <div className="flex items-center gap-3 mr-3 my-3">
      <label className="text-gray-700 text-sm lg:text-base font-medium">Sắp xếp theo:</label>
      <select
        className="px-4 py-2 rounded-sm lg:bg-white bg-[#639eae] shadow-sm lg:text-gray-700 text-white text-sm 
                   cursor-pointer transition-all focus:outline-none focus:ring-1 lg:focus:ring-cyan-800"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
        <option value="a-z">A-Z</option>
        <option value="z-a">Z-A</option>
        <option value="price-asc">Giá thấp → cao</option>
        <option value="price-desc">Giá cao → thấp</option>
      </select>
    </div>
  );
};
