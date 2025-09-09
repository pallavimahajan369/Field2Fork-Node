import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, ShoppingCart, Package } from "lucide-react";

const SellerDashboardStats = () => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const user_id = authData?.data?.user?.user_id;

  console.log("authData from sessionStorage:", authData);
  console.log("user_id:", user_id);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user_id) {
      console.error("Seller ID not available.");
      return;
    }

    const token =authData?.data?.token;

    if (!token) {
      console.error("No valid token found in session storage.");
      return;
    }

    axios
  .get(`http://localhost:4000/sales-report/${user_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((response) => {
    console.log("API Sales Report:", response.data.data); // ✅ should be the full report object
    setReport(response.data.data); // ✅ ensure you're accessing `.data.data`
    setLoading(false);
  })
  .catch((error) => {
    console.error("Error fetching sales report:", error);
    setLoading(false);
  });

  }, [user_id]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading sales report...</p>;
  }

  if (!report) {
    return <p className="text-center text-red-500">Failed to load sales report</p>;
  }

  const colors = ["#4CAF50", "#FF9800", "#2196F3", "#F44336", "#9C27B0", "#3F51B5"];
  const pieData = report.productSales.map((ps) => ({
    name: ps.productName,
    value: ps.revenue,
  }));

  const statCards = [
    {
      label: "Total Orders",
      value: report.totalOrders,
      icon: <ShoppingCart className="w-8 h-8" />,
      bg: "from-blue-500 to-indigo-600",
    },
    {
      label: "Total Revenue",
      value: `₹${report.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="w-8 h-8" />,
      bg: "from-green-500 to-green-700",
    },
    {
      label: "Total Items Sold",
      value: report.totalItemsSold,
      icon: <Package className="w-8 h-8" />,
      bg: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${card.bg} text-center`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center mb-2">{card.icon}</div>
            <p className="text-lg font-medium">{card.label}</p>
            <motion.h2
              className="text-4xl font-bold mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {card.value}
            </motion.h2>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
  <h3 className="text-lg font-semibold mb-4 text-gray-700">
    Product Revenue Breakdown
  </h3>

  {report?.productSales && report.productSales.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={report.productSales.map((ps) => ({
            name: ps.productName,
            value: ps.revenue,
          }))}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {report.productSales.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <p className="text-center text-gray-500">No sales data available to display.</p>
  )}
</div>

    </div>
  );
};

export default SellerDashboardStats;
