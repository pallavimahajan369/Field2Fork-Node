import { useEffect, useState } from "react";
import {
  Trash2,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingCart,
  Receipt,
  Leaf,
  Sparkles,
  Truck,
  BadgeCheck,
  ShoppingBasket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCartTotalQuantity } from "../api/cartService";
import {
  getCartDetailsById,
  checkoutCart,
  deleteCartItem,
} from "../api/cartService";
// const authData = sessionStorage.getItem("authData");
// const cartId = authData ? JSON.parse(authData).user?.id : null;


const CartTable = ({ cartId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalQuantity: 0,
    tax: 0,
    subtotal: 0,
  });
  const [promoCode, setPromoCode] = useState("");
  const [cartQuantity, setCartQuantity] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!cartId) {
      console.error("cartId is undefined!");
      return;
    }
    fetchCartDetails();
  }, [cartId]);

  const fetchCartDetails = async () => {
  const data = await getCartDetailsById(cartId);
  console.log("Cart response:", data);

  const items = data?.cartItems || [];
  setCartItems(items);
  window.dispatchEvent(new CustomEvent("cartUpdated"));

  calculateSummary(items);
};

useEffect(() => {
  const fetchCartQuantity = async () => {
    const authData = sessionStorage.getItem("authData");
    const userId = authData ? JSON.parse(authData).data?.user_id : null;

    if (userId) {
      const totalQuantity = await fetchCartTotalQuantity(userId);
      setCartQuantity(totalQuantity);
    }
  };

  fetchCartQuantity(); // Initial call

  // Listen for custom "cartUpdated" events
  window.addEventListener("cartUpdated", fetchCartQuantity);

  return () => window.removeEventListener("cartUpdated", fetchCartQuantity);
}, []);

  const calculateSummary = (items) => {
    let totalQuantity = 0,
      subtotal = 0;
    items.forEach((item) => {
      totalQuantity += item.quantity;
      subtotal += item.price * item.quantity;
    });
    const tax = subtotal * 0.1;
    setSummary({
      totalItems: items.length,
      totalQuantity: subtotal,
      tax,
      subtotal: subtotal + tax,
    });
  };

  const handleCheckout = async () => {
    const response = await checkoutCart(cartId);
    if (response && response.orderId) {
      navigate("/checkout", {
        state: {
          orderId: response.orderId,
          totalAmount: response.amount,
          razorpayOrderId: response.razorpayOrderId,
        },
      });
    } else {
      alert("Failed to create order. Please try again.");
    }
  };

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      const success = await deleteCartItem(cartId, itemId); // Pass both cartId and itemId
      if (success) {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
        window.dispatchEvent(new CustomEvent("cartUpdated"));

        calculateSummary(cartItems.filter((item) => item.id !== itemId)); // Recalculate summary
      } else {
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
  if (newQuantity < 1) return; // Don't allow 0 or negative

  try {
    const response = await fetch(`http://localhost:4000/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, quantity: newQuantity }),
    });

    if (response.ok) {
      const updatedCart = await getCartDetailsById(cartId);
      setCartItems(updatedCart.cartItems);
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      calculateSummary(updatedCart.cartItems);
      // ✅ Trigger header update
     
    } else {
      alert("Failed to update cart quantity");
    }
  } catch (err) {
    console.error("Error updating quantity:", err);
  }
};

  return (
    <div className="flex flex-col md:flex-row w-full p-4 gap-4 bg-gradient-to-br from-green-50/80 to-amber-50/80">
      {/* Left Column - Cart Items */}
      <div className="flex-1 bg-white/90 backdrop-blur-sm shadow-sm p-4 rounded-xl border border-emerald-200/80">
        <h2 className="text-2xl font-bold mb-6 pb-4 text-gray-800 flex items-center gap-3 border-b border-gray-200">
          <ShoppingCart className="h-8 w-8 text-emerald-600 stroke-[1.5]" />
          <span className="bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
            Your Harvest Basket
          </span>
        </h2>

        {cartItems.length > 0 ? (
          <div className="space-y-5">
            {cartItems.map((item) => (
              <div
               key={item.cart_item_id}
                className="group relative p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div className="flex gap-5 items-start">
                  <div className="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden border border-gray-300 shadow-inner">
                    <img
                      src={`http://localhost:4000/product-images/image/${item.product_id}`}
                      alt={item.name}
                      className="w-full h-full object-cover scale-[1.01]"
                      onError={(e) => {
                        e.target.src = "/CartImages/productMissing.png";
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <div className="text-sm text-gray-600 mt-2 space-y-2">
                          <div className="flex gap-2 items-center">
                            <span className="bg-emerald-100 px-3 py-1 rounded-full text-emerald-800 text-xs font-medium flex items-center gap-1">
                              <Leaf className="h-3.5 w-3.5" />
                              Organic
                            </span>
                            <span className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 text-xs font-medium flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5" />
                              Fresh Harvest
                            </span>
                          </div>
                          <div className="flex gap-2 items-center text-sm">
                            <span className="font-medium text-gray-700">
                              {item.quantity} kg
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="font-medium text-yellow-700">
                              ₹{Number(item.price).toFixed(2)}/kg
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center mt-4 gap-2">
                          <button
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-blue-600 hover:text-blue-700 transition-colors"
                                onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                              >
                                <Minus className="h-5 w-5" />
                           </button>

                          <span className="w-8 text-center text-gray-800 font-medium">
                            {item.quantity}
                          </span>
                          <button
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-blue-600 hover:text-blue-700 transition-colors"
                              onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                            >
                                  <Plus className="h-5 w-5" />
                                </button>

                        </div>
                      </div>

                      <div className="text-right ml-3">
                        <p className="text-lg font-semibold text-gray-800">
                         ₹{(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                        <button
                          className="text-rose-500 hover:text-rose-700 mt-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-8 p-6">
            <ShoppingBasket className="h-24 w-24 mx-auto mb-4 text-gray-300 stroke-1" />
            <p className="text-xl text-gray-800 font-semibold mb-2">
              Your Harvest Basket Awaits
            </p>
            <p className="text-gray-600 text-sm">
              Add fresh, organic produce to get started
            </p>
          </div>
        )}

        {/* Promotional Banners */}
        <div className="mt-8 flex flex-row gap-4 w-full">
          <div className="flex-1 flex items-center gap-4 bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <img
              src="/CartImages/tractor.webp"
              className="h-12 w-12"
              alt="Tractor"
            />
            <div>
              <h4 className="font-semibold text-green-800">
                Free Farm Delivery
              </h4>
              <p className="text-sm text-green-600">On orders above ₹2000</p>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-4 bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
            <img
              src="/CartImages/organic.png"
              className="h-12 w-16 rounded-full"
              alt="Organic"
            />
            <div>
              <h4 className="font-semibold text-amber-800">Organic Discount</h4>
              <p className="text-sm text-amber-600">
                15% off on certified organic products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full md:w-80 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-green-200/80">
        <h3 className="text-xl font-bold mb-4 text-green-800/90 flex items-center gap-2">
          <Receipt className="h-6 w-6 text-green-700/90" />
          <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            Farm Total
          </span>
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-800/90">
            <span>Items:</span>
            <span className="font-medium">{summary.totalItems}</span>
          </div>
          <div className="flex justify-between text-gray-800/90">
            <span>Price:</span>
            <span className="font-medium">₹{summary.totalQuantity}</span>
          </div>
          <div className="flex justify-between text-gray-800/90">
            <span>Farm Tax:</span>
            <span className="font-medium">₹{summary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-green-200/50 pt-3 text-gray-800/90">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold text-lg">
              ₹{summary.subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          className="w-full mt-6 bg-gradient-to-br from-red-400 to-red-700 text-white/95 py-3 rounded-xl hover:shadow-md transition-all font-medium flex items-center justify-center gap-2 text-sm duration-200 transform hover:scale-[1.005]"
          onClick={handleCheckout}
        >
          <ShoppingCart className="h-4 w-4" />
          Checkout - ₹{summary.subtotal.toFixed(2)}
        </button>

        {/* Payment Section */}
        <div className="mt-6">
          <div className="text-center text-xs text-green-700/90 mb-3">
            Supporting sustainable farming 🌾
          </div>
          <div className="flex gap-2 justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-4 opacity-90"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="Paypal"
              className="h-4 opacity-90"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              alt="Visa"
              className="h-4 opacity-90"
            />
            <img
              src="http://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
              alt="Apple Pay"
              className="h-4 opacity-90"
            />
          </div>

          <div className="mt-4 text-center text-xs text-green-600/90 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-700/90" />
            <span>Secure SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTable;
