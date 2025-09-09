import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  PackageCheck,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info,
  CalendarDays,
  Loader2,
  ShoppingCart,
  Hash,
  Tag,
  Clock,
  DollarSign,
  PackageX,
  ChevronRight,
  Wallet,
} from "lucide-react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import {
  CancelOrderById,
  fetchOrderItemsByOrderId,
  fetchOrdersByUserId,
} from "../api/orderService";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchingItems, setFetchingItems] = useState(false);
  const navigate = useNavigate();
  // const authData = sessionStorage.getItem("authData");
  // const userId = authData ? JSON.parse(authData).user?.id : null;
const [userId, setUserId] = useState(null);

useEffect(() => {
  const authData = sessionStorage.getItem("authData");
  if (authData) {
    const parsed = JSON.parse(authData);
    setUserId(parsed.user?.id);
  }
}, []);

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const data = await fetchOrdersByUserId(userId);
  //       setOrders(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, []);

  useEffect(() => {
  const fetchOrders = async () => {
    if (!userId) return; // prevent calling with null userId

    try {
      const data = await fetchOrdersByUserId(userId);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [userId]); // add userId as dependency


  const fetchOrderItems = async (orderId) => {
    setOrderItems([]);
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
      return;
    }
    setFetchingItems(true);
    setSelectedOrder(orderId);

    try {
      const data = await fetchOrderItemsByOrderId(orderId);
      setOrderItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchingItems(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await CancelOrderById(orderId);
        if (response.ok) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderId
                ? { ...order, orderStatus: "CANCELLED" }
                : order
            )
          );
        } else {
          console.error("Failed to cancel order.");
        }
      } catch (error) {
        console.error("Cancel failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-xl">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order History
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Manage and track your recent purchases
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 space-y-4">
            <div className="animate-pulse">
              <Package className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-600">Fetching your orders...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8 bg-red-50 p-6 rounded-xl">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-300" />
            <p className="font-medium">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="mb-6 text-blue-500 mx-auto w-max p-4 bg-blue-50 rounded-full">
              <Package className="w-12 h-12" />
            </div>
            <p className="text-gray-600 mb-4 text-lg">No orders found</p>
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto hover:shadow-lg"
              onClick={() => navigate("/products")}
            >
              <span>Browse Products</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="relative group">
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/50 cursor-pointer hover:border-blue-200 transition-colors"
                  onClick={() => fetchOrderItems(order.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            order.orderStatus === "DELIVERED"
                              ? "bg-green-100"
                              : order.orderStatus === "CANCELLED"
                              ? "bg-red-100"
                              : order.orderStatus === "PENDING"
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                          }`}
                        >
                          {order.orderStatus === "DELIVERED" ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : order.orderStatus === "CANCELLED" ? (
                            <XCircle className="w-6 h-6 text-red-600" />
                          ) : order.orderStatus === "PENDING" ? (
                            <Clock className="w-6 h-6 text-yellow-600" />
                          ) : (
                            <Package className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h2>

                          {/* Status Display */}
                          <div className="mt-2">
                            <div
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm w-fit ${
                                order.orderStatus === "DELIVERED"
                                  ? "bg-green-100/80 border border-green-200 text-green-800"
                                  : order.orderStatus === "PENDING"
                                  ? "bg-yellow-100/80 border border-yellow-200 text-yellow-800"
                                  : order.orderStatus === "CANCELLED"
                                  ? "bg-red-100/80 border border-red-200 text-red-800"
                                  : order.orderStatus === "SHIPPED"
                                  ? "bg-blue-100/80 border border-blue-200 text-blue-800"
                                  : "bg-purple-100/80 border border-purple-200 text-purple-800"
                              }`}
                            >
                              {order.orderStatus === "DELIVERED" ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : order.orderStatus === "PENDING" ? (
                                <Clock className="w-4 h-4" />
                              ) : order.orderStatus === "CANCELLED" ? (
                                <XCircle className="w-4 h-4" />
                              ) : order.orderStatus === "SHIPPED" ? (
                                <Truck className="w-4 h-4" />
                              ) : (
                                <PackageCheck className="w-4 h-4" />
                              )}
                              <span className="font-medium">
                                {order.orderStatus}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                              <CalendarDays className="w-4 h-4 text-gray-500" />
                              {new Date(order.order_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                              <Wallet className="w-4 h-4 text-gray-500" />₹
                              {order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {order.orderStatus === "PENDING" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order.id);
                          }}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            Cancel Order
                          </span>
                        </button>
                      )}
                      <div className="text-blue-500">
                        {selectedOrder === order.id ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {selectedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-12 mr-6 border-l-2 border-blue-100 pl-6 py-4 bg-white/50 backdrop-blur-sm rounded-b-xl">
                        {fetchingItems ? (
                          <div className="flex items-center justify-center gap-3 text-gray-500 py-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading order details...</span>
                          </div>
                        ) : orderItems.length > 0 ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-4 text-sm font-medium text-gray-500 mb-2 px-4">
                              <span className="flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                Product
                              </span>
                              <span className="flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                Quantity
                              </span>
                              <span className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Unit Price
                              </span>
                              <span className="text-right flex items-center gap-2 justify-end">
                                <DollarSign className="w-4 h-4" />
                                Total
                              </span>
                            </div>
                            {orderItems.map((item) => (
                              <div
                                key={item.id}
                                className="grid grid-cols-4 items-center text-sm p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-medium text-gray-900 flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                    <Package className="w-4 h-4 text-blue-600" />
                                  </div>
                                  {item.productName}
                                </span>
                                <span className="text-gray-600">
                                  {item.quantity}x
                                </span>
                                <span className="text-gray-600">
                                  ₹{item.price.toFixed(2)}
                                </span>
                                <span className="text-right font-medium text-blue-600">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}

                            <div className="pt-4 mt-4 space-y-3 bg-white p-6 rounded-xl border border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">
                                  ₹
                                  {orderItems
                                    .reduce(
                                      (sum, item) =>
                                        sum + item.price * item.quantity,
                                      0
                                    )
                                    .toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="font-medium">₹0.00</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Tax (10%):
                                </span>
                                <span className="font-medium">
                                  ₹
                                  {(
                                    orderItems.reduce(
                                      (sum, item) =>
                                        sum + item.price * item.quantity,
                                      0
                                    ) * 0.1
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <span className="text-lg font-bold text-gray-900">
                                  Grand Total:
                                </span>
                                <span className="text-xl font-bold text-blue-600">
                                  ₹
                                  {(
                                    orderItems.reduce(
                                      (sum, item) =>
                                        sum + item.price * item.quantity,
                                      0
                                    ) * 1.1
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 bg-white rounded-xl">
                            <PackageX className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p>No items found in this order</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
