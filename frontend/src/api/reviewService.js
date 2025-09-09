const API_BASE_URL = "http://localhost:4000/reviews";

export const fetchReviews = async () => {
  const authDataStr = sessionStorage.getItem("authData");
   const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch reviews");
    const result = await response.json();

return (result.data || []).map((r) => ({
  id: r.review_id,
  reviewText: r.review_text,
  rating: r.rating,
  reviewDate: r.review_date,
  productName: r.product_name,
  reviewer: r.reviewer,
  activeStatus: r.active_status ?? true, // Optional, if using soft delete or status
}));

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const deleteReviewById = async (id) => {
  const authDataStr = sessionStorage.getItem("authData");
   const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete review");
    return await response.json(); // Optionally return the response
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const fetchReviewByProductId = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`);
    if (!response.ok) throw new Error("Fetch failed");

    const result = await response.json();
    
    // Check response format from util.createResult()
    if (result.status === "success" && Array.isArray(result.data)) {
      return result.data;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};


export const addReview = async (reviewData) => {
  const authDataStr = sessionStorage.getItem("authData");
   const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error("Error adding review");
    }
    return await 201;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error; // Rethrow the error to be handled in the component
  }
};
