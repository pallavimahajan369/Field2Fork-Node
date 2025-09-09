// src/components/AdminDashboard/ReviewsTable.jsx
import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import {
  fetchReviews,
  deleteReviewById,
  fetchReviewByProductId,
} from "../../api/reviewService";

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);
  const [searchId, setSearchId] = useState("");

  /* ---------- initial load ---------- */
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await fetchReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    }
  };

  /* ---------- search ---------- */
  const handleSearch = async () => {
  if (!searchId) return;

  try {
    const data = await fetchReviewByProductId(searchId);
    if (Array.isArray(data) && data.length > 0) {
      setReviews(data);
    } else {
      alert("No reviews found for this Product ID");
      loadReviews(); // fallback to full list
    }
  } catch (err) {
    console.error("Error fetching reviews:", err);
    alert("Error fetching reviews. Please try again.");
  }
};


  /* ---------- delete ---------- */
  const handleDeleteReview = async (id) => {
    try {
      await deleteReviewById(id);
      setReviews((prev) => prev.filter((r) => r.review_id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Could not delete review. See console.");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>

      {/* Search bar */}
      <div className="mb-6 flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2 w-full max-w-md">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by Product ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full px-3 py-1 text-gray-700 bg-transparent focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 transition"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white uppercase text-sm leading-normal">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Review</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
  {reviews.length ? (
    reviews.map((rv) => (
      <tr
        key={rv.id}
        className="border-b transition duration-300 ease-in-out transform hover:scale-102 hover:bg-teal-100"
      >
        <td className="p-3">{rv.id}</td>
        <td className="p-3">{new Date(rv.reviewDate).toLocaleDateString()}</td>
        <td className="p-3">{rv.rating} ⭐</td>
        <td className="p-3">{rv.reviewText}</td>
        <td className="p-3">{rv.productName}</td>
        <td className="p-3">{rv.reviewer}</td>
        <td className="p-3">
          <button
            onClick={() => handleDeleteReview(rv.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition flex items-center gap-1"
          >
            <Trash2 size={16} /> Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="p-4 text-center text-gray-400">
        No reviews found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default ReviewsTable;
