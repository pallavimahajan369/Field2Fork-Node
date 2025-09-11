const API_BASE_URL = "http://localhost:4000/cart"; // Replace with actual backend URL

export const getCartDetailsById = async (userId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
   
  const token = authData?.data?.token || "";

  if (!token) {
    console.error("⛔ No valid token found in session storage.");
    return;
  }

  try {
    // Step 1: Get user's cart_id
    const cartResponse = await fetch(`http://localhost:4000/cart/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!cartResponse.ok) throw new Error("Failed to fetch cart for user");

    const cartData = await cartResponse.json();
    console.log("📦 cartData response:", cartData); // <---- ADD THIS

    const cartId = cartData?.data?.cart?.cart_id;
    sessionStorage.setItem("cartId", cartId);
    if (!cartId) throw new Error("No cart found for this user");

    // Step 2: Get cart items using correct cart_id
    const itemsResponse = await fetch(`http://localhost:4000/cart/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const itemsData = await itemsResponse.json();
    console.log("data=",itemsData)
    return { cartId, cartItems: itemsData.cartItems };
  } catch (error) {
    console.error("🔥 Error fetching cart items:", error);
    return { cartItems: [] };
  }
};


export const fetchCartTotalQuantity = async (userId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || authData?.token || "";

  if (!token) {
    console.error("No valid token found in session storage.");
    return 0;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Cart Data:", data);

    // ✅ Correct mapping from backend
    const cartItems = data.cartItems;
    if (!Array.isArray(cartItems)) {
      console.warn("Invalid response structure:", data);
      return 0;
    }

    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
console.log("Cart Data:", data);
    return totalQuantity;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return 0;
  }
};


export const fetchCartTotalQuantityByCartId = async (cartId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || authData?.token || "";

  if (!token) {
    console.error("No valid token found in session storage.");
    return 0;
  }

  try {
    const response = await fetch(`http://localhost:4000/cart/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Cart Data:", data);

    const cartItems = data.cartItems;
    if (!Array.isArray(cartItems)) {
      console.warn("Invalid response structure:", data);
      return 0;
    }

    // Total quantity calculation
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return totalQuantity;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return 0;
  }
};


export const getTotalQuantity = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export const deleteCartItem = async (cartId, itemId) => {
  const authDataStr = sessionStorage.getItem("authData");
const authData = authDataStr ? JSON.parse(authDataStr) : null;
const token = authData?.data?.token || authData?.token || "";

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${cartId}/items/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete cart item");
    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    return false;
  }
};

export const checkoutCart = async (cartId) => {
  const authDataStr = sessionStorage.getItem("authData");
const authData = authDataStr ? JSON.parse(authDataStr) : null;
const token = authData?.data?.token || authData?.token || "";


  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/${cartId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to Proceed for Checkout");
    // Parse the response body
    const responseBody = await response.json();
    console.log(response);
    // Extract the order details from the response body
    const orderId = responseBody.orderId;
    const razorpayOrderId = responseBody.razorpayOrderId;
    const amount = responseBody.amount;
    const currency = responseBody.currency;
    const receipt = responseBody.receipt;
    const status = responseBody.status;

    // Return the order details
    return {
      orderId,
      razorpayOrderId,
      amount,
      currency,
      receipt,
      status,
    };
  } catch (error) {
    console.error("Error during checkout:", error);
    return null;
  }
};
export const addToCart = async (cartRequest) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || "";

  if (!token) {
    console.error("⛔ No valid token found in session storage.");
    return {
      success: false,
      message: "Authentication token is missing. Please log in again.",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cartRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error details:", errorData);
      throw new Error(errorData.message || "Failed to add to cart");
    }
    

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("🔥 Error adding to cart:", error);
    return {
      success: false,
      message: error.message || "Unexpected error while adding to cart",
    };
  }
};

export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, quantity }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update quantity");
    }

    return result;
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    return null;
  }
};