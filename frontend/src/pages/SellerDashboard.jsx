// src/pages/SellerDashboard.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import SellerSidebar from "../components/SellerDashboard/SellerSidebar.jsx";
import SellerDashboardStats from "../components/SellerDashboard/SellerDashboardStats.jsx";
import SellerProductTable from "../components/SellerDashboard/SellerProductTable.jsx";
import SellerSalesReport from "../components/SellerDashboard/SellerSalesReport.jsx";
import SellerOrdersTable from "../components/SellerDashboard/SellerOrdersTable.jsx";
import SellerAddProduct from "../components/SellerDashboard/SellerAddProduct.jsx";
import SellerUpdateProduct from "../components/SellerDashboard/SellerUpdateProduct.jsx";
import SellerAddImage from "../components/SellerDashboard/SellerAddImage.jsx";

const SellerDashboard = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      <SellerSidebar activePath={location.pathname} />
      <div className="flex-1 p-8 bg-white shadow-lg rounded-lg m-5">
        <Routes>
          <Route index element={<SellerDashboardStats />} />
          <Route path="products" element={<SellerProductTable />} />
          <Route path="sales" element={<SellerSalesReport />} />
          <Route path="orders" element={<SellerOrdersTable />} />
          <Route path="add-product" element={<SellerAddProduct />} />
          <Route
            path="update-product/:productId"
            element={<SellerUpdateProduct />}
          />
          <Route path="add-image/:productId" element={<SellerAddImage />} />
        </Routes>
      </div>
    </div>
  );
};

export default SellerDashboard;
