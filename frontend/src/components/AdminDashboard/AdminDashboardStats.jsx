import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const authDataStr = sessionStorage.getItem("authData");
  console.log("Auth Data String from sessionStorage:", authDataStr);

  if (!authDataStr) {
    console.error("No valid token found in session storage.");
    return;
  }

  const token = JSON.parse(authDataStr).data.token;

  console.log("Extracted Token:", token);

  if (!token) {
    console.error("Token not present in parsed authData.");
    return;
  }

  axios
    .get("http://localhost:4000/admin/dashboard-stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log("Dashboard Stats Response:", response.data); // ✅ Add this
      setStats(response.data.data); // make sure you're accessing `.data.data`
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching dashboard stats:", error);
      setLoading(false);
    });
}, []);


  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!stats)
    return <p className="text-center text-red-500">Failed to load data</p>;

  const colors = ["#4CAF50", "#FF9800", "#2196F3", "#F44336"];

  const userPieData = [
    { name: "Active Users", value: stats.activeUsers },
    { name: "Inactive Users", value: stats.inactiveUsers },
  ];

  const buyersPieData = [
    { name: "Active Buyers", value: stats.activeBuyers },
    { name: "Inactive Buyers", value: stats.inactiveBuyers },
  ];

  const sellersPieData = [
    { name: "Active Sellers", value: stats.activeSellers },
    { name: "Inactive Sellers", value: stats.inactiveSellers },
  ];

  const productsPieData = [
    { name: "Active Products", value: stats.activeProducts },
    { name: "Inactive Products", value: stats.inactiveProducts },
  ];

  const statBoxes = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      bg: "from-purple-500 to-indigo-600",
    },
    {
      label: "Total Buyers",
      value: stats.totalBuyers,
      bg: "from-green-400 to-green-600",
    },
    {
      label: "Total Sellers",
      value: stats.totalSellers,
      bg: "from-blue-400 to-blue-600",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      bg: "from-yellow-400 to-orange-500",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      bg: "from-pink-400 to-red-500",
    },
    {
      label: "Successful Transactions",
      value: stats.successfulTransactions,
      bg: "from-gray-500 to-gray-700",
    },
  ];

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statBoxes.map((item, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${item.bg} text-center`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg font-medium">{item.label}</p>
            <motion.h2
              className="text-4xl font-bold mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {item.value}
            </motion.h2>
          </motion.div>
        ))}
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[
          { title: "User Activity", data: userPieData },
          { title: "Buyers Activity", data: buyersPieData },
          { title: "Sellers Activity", data: sellersPieData },
          { title: "Product Availability", data: productsPieData },
        ].map((chart, index) => (
          <div key={index} className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {chart.title}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {chart.data.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={colors[idx % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardStats;
