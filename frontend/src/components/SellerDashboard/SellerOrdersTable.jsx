// src/components/SellerDashboard/SellerOrdersTable.jsx
import React, { useEffect, useState } from "react";
import { fetchOrdersBySeller } from "../../api/orderService";

const SellerOrdersTable = () => {
  const authData = JSON.parse(sessionStorage.getItem("authData"));
  const sellerId = authData?.user?.id;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!sellerId) return;

    const loadOrders = async () => {
      try {
        const data = await fetchOrdersBySeller(sellerId);
        console.log("Fetched orders:", data); // Debug log
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    loadOrders();
  }, [sellerId]);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white uppercase text-sm leading-normal">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Order Date</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="p-3">{order.order_id}</td>
                  <td className="p-3">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">₹{order.total_amount}</td>
                  <td className="p-3">{order.order_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrdersTable;
