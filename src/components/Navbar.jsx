import Input from "./Input";
import { Search } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div className="flex items-center justify-center gap-2">
        <div className='h-20 overflow-hidden'>
          <img src="/logo2.png" alt="logo" className='object-contain h-20 w-20 md:w-36'/>
        </div>
        <h1 className="text-lg font-bold text-center whitespace-nowrap lg:mr-20">Trading Platform</h1>
      </div>

      <div className="flex w-full justify-between items-center">
        <button className="sm:hidden" onClick={toggleSidebar}>
          ☰
        </button>

        <div className="flex-1 mx-4 hidden sm:block mt-5 ">
          <div className="w-full max-w-md"></div>
          {/* <Input
            type="text"
            placeholder="Search..."
            icon={Search}
            otherStyles="w-full max-w-md px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          /> */}
        </div>

        <div className="flex space-x-3">
          <span>🔔</span>
          <span>👤</span>
        </div>
      </div>

      {/* <div className="w-full mt-3 sm:hidden">
        <Input
          type="text"
          icon={Search}
          placeholder="Search..."
          otherStyles="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div> */}
    </nav>
  );
};

export default Navbar;
