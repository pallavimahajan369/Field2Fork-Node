// src/components/SellerDashboard/SellerSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Box,
  PlusCircle,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

const SellerSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/seller", icon: <Home size={20} /> },
    { name: "My Products", path: "/seller/products", icon: <Box size={20} /> },
    {
      name: "Add Product",
      path: "/seller/add-product",
      icon: <PlusCircle size={20} />,
    },
    {
      name: "Sales Report",
      path: "/seller/sales",
      icon: <TrendingUp size={20} />,
    },
    { name: "Orders", path: "/seller/orders", icon: <ShoppingBag size={20} /> },
  ];

  return (
    <div className="w-72 bg-gradient-to-br from-gray-900 to-gray-800 text-white h-screen p-6 shadow-2xl rounded-r-2xl flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-semibold mb-6 tracking-wide text-gray-200">
          Seller Panel
        </h2>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-3">
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="text-lg font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <Link
          to="/"
          className="flex items-center justify-center gap-3 p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition shadow-lg"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Go to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default SellerSidebar;
