import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadRazorpayScript, processPayment } from "../api/paymentService";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Home,
  RefreshCcw,
  MapPin,
  Mail,
  User,
  ShoppingCart,
  CreditCard,
  Receipt,
} from "lucide-react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const Checkout = () => {
  const location = useLocation();
  const { orderId, totalAmount, razorpayOrderId } = location.state || {};
  const [address, setAddress] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user")) || {
      name: "John Doe",
      email: "johndoe@example.com",
      address: "123 Main Street, City, Country",
    };
    setUser(storedUser);
    setAddress(storedUser.address);
  }, []);

  const handlePayment = async () => {
    try {
      await loadRazorpayScript();
      const options = {
        key: "rzp_test_kQx4rr9DSjnBdc",
        amount: totalAmount * 100,
        currency: "INR",
        name: "Field2Fork",
        description: "Order Description",
        order_id: razorpayOrderId,
        handler: async (response) => {
          const paymentData = {
            orderId: orderId,
            amount: totalAmount,
            paymentMethod: "RAZORPAY",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            paymentStatus: "SUCCESS",
          };

          setPaymentId(response.razorpay_payment_id);
          const verification = await processPayment(paymentData);

          if (verification.paymentStatus === "SUCCESS") {
            setPaymentStatus("success");
            setMessage(`Your order #${orderId} has been placed successfully.`);
          } else {
            setPaymentStatus("failure");
            setMessage("We couldn't process your payment. Please try again.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const handleRetry = () => {
    setAnimate(false); // Disable animation on retry
    navigate("/checkout"); // Navigate to checkout
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex justify-center items-center relative p-4 bg-gray-100">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://img.freepik.com/free-photo/top-view-desk-with-black-friday-gifts_23-2148288216.jpg?ga=GA1.1.1570994326.1738785388&semt=ais_hybrid"
            alt="Checkout Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-blue-900/40 to-transparent"></div>
        </div>

        {/* Checkout Card */}
        <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6 border border-gray-300 z-10 animate-fade-in">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart
              className="text-blue-500 animate-bounce-slow"
              size={26}
            />
            Checkout
          </h2>
          <p className="text-gray-500 mt-1">
            Complete your order details below
          </p>

          {/* User Details */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-4 mt-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Buyer Details
            </h3>
            <div className="flex items-center gap-3 text-gray-600">
              <User size={16} className="text-gray-500" />
              <p>{user.name}</p>
            </div>
            <div className="flex items-center gap-3 text-gray-600 mt-2">
              <Mail size={16} className="text-gray-500" />
              <p>{user.email}</p>
            </div>
            <div className="flex items-center gap-3 text-gray-600 mt-2">
              <MapPin size={16} className="text-gray-500" />
              <p>{user.address}</p>
            </div>
          </div>

          {/* Address Input */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Enter a different shipping address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
            />
            <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-4 mt-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Order Summary
            </h3>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery:</span>
              <span>₹22.00</span>
            </div>
            <div className="flex justify-between text-md font-bold text-gray-900 mt-2">
              <span>Total:</span>
              <span>₹{totalAmount + 22}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-md font-semibold text-gray-700">
              Payment Methods
            </h3>
            <div className="flex items-center gap-4 mt-3">
              <CreditCard className="text-gray-600" size={20} />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                className="h-5"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="MasterCard"
                className="h-5"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-5"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                alt="Apple Pay"
                className="h-5"
              />
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-semibold 
        hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2
        shadow-emerald-200/50 hover:shadow-emerald-300/50"
          >
            <ShoppingCart className="w-5 h-5" />
            Place Order - ₹{totalAmount}
          </button>
          {paymentStatus && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={animate ? { scale: 1 } : { scale: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col items-center"
              >

                {paymentStatus === "SUCCESS" ? (
                  <>
                    <CheckCircle className="text-green-500 w-20 h-20 animate-bounce" />
                    <h2 className="text-2xl font-semibold mt-4 text-gray-800">
                      Payment Successful!
                    </h2>
                    <p className="text-gray-600 mt-2">{message}</p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-green-500 text-white px-6 py-2 mt-6 rounded-full flex items-center"
                      onClick={() => navigate("/")}
                    >
                      <Home className="w-5 h-5 mr-2" /> Go to Home
                    </motion.button>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 w-20 h-20" />
                    <h2 className="text-2xl font-semibold mt-4 text-gray-800">
                      Payment Failed!
                    </h2>
                    <p className="text-gray-600 mt-2">{message}</p>
                    <div className="flex space-x-4 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-500 text-white px-6 py-2 rounded-full flex items-center"
                        onClick={() => navigate("/")}
                      >
                        <Home className="w-5 h-5 mr-2" /> Go to Home
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center"
                        onClick={handleRetry}
                      >
                        <RefreshCcw className="w-5 h-5 mr-2" /> Retry Payment
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
          .animate-bounce-slow {
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
        `}</style>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
