import { HiOutlineBell, HiOutlineCog } from "react-icons/hi";

const PageTopBar = () => {
    return (
      <div className="flex justify-between items-center p-4 text-gray-300 ">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="hover:text-white transition-all duration-300">
            <HiOutlineBell size={22} />
          </button>
          <button className="hover:text-white transition-all duration-300">
            <HiOutlineCog size={22} />
          </button>
        </div>
  
        {/* Download Reports Button */}
        <button className="bg-purple-600 hover:bg-purple-700 rounded-mflex items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md">
          Download Reports
        </button>
      </div>
    );
  };
  
  export default PageTopBar;
  