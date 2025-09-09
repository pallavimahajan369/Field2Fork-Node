import { Routes, Route, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminDashboard/AdminSidebar.jsx";
import BuyerTable from "../components/AdminDashboard/AdminBuyerTable.jsx";
import SellerTable from "../components/AdminDashboard/AdminSellerTable.jsx";
import ReviewsTable from "../components/AdminDashboard/AdminReviewsTable.jsx";
import ProductTable from "../components/AdminDashboard/AdminProductTable.jsx";
import AdminDashboardStats from "../components/AdminDashboard/AdminDashboardStats.jsx";

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activePath={location.pathname} />
      <div className="flex-1 p-8 bg-white shadow-lg rounded-lg m-5">
        <Routes>
          <Route index element={<AdminDashboardStats />} /> {/* ✅ Corrected */}
          <Route path="buyers" element={<BuyerTable />} />
          <Route path="sellers" element={<SellerTable />} />
          <Route path="reviews" element={<ReviewsTable />} />
          <Route path="products" element={<ProductTable />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
