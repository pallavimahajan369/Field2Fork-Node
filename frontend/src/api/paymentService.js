const API_BASE_URL = "http://localhost:4000/payments";

export const processPayment = async (paymentData) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = authDataStr ? JSON.parse(authDataStr).token : "";

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  const response = await fetch(`${API_BASE_URL}/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });
  const responseBody = await response.json();
  console.log(responseBody);
  const orderId = responseBody.orderId;
  const message = responseBody.message;
  const paymentStatus = responseBody.paymentStatus;
  const razorpayOrderId = responseBody.razorpayOrderId;
  const razorpayPaymentId = responseBody.razorpayPaymentId;
  const razorpaySignature = responseBody.razorpaySignature;
  return {
    orderId,
    message,
    paymentStatus,
    razorpayOrderId,
    razorpaySignature,
  };
};

// Razorpay Integration Functions
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
