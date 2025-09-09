import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Package,
  Leaf,
  Clock,
  PenLine,
  Edit,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProductById } from "../../api/productService";
import { addReview, fetchReviewByProductId } from "../../api/reviewService";
import { addToCart } from "../../api/cartService";
import { fetchProductImages } from "./../../api/productImageService";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const authData = sessionStorage.getItem("authData");
  console.log("📂 sessionStorage authData:", authData);
  const userId = authData ? JSON.parse(authData).data?.user_id : null;
console.log("id=",userId)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        console.log(data);
        setProduct(data);
        console.log(product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await fetchReviewByProductId(id);
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchProduct();
    fetchReviews();
  }, [id]);
  useEffect(() => {
    const fetchProductImagesById = async () => {
      try {
        const data = await fetchProductImages(id);
        setProductImages(data);
      } catch (error) {
        console.error(`Error fetching images for product ${id}:`, error);
        imagesMap[product.id] = null;
      }
    };

    if (id) fetchProductImagesById();
  }, [id]);

  const handleAddToCart = async () => {
    const cartItem = {
      product_id: product.id,
      quantity: quantity,
    };

    const cartRequest = {
      userId: userId,
      cartItems: [cartItem],
    };

    console.log("🛒 Product ID:", product?.id);
console.log("👤 User ID:", userId);
console.log("📦 Quantity:", quantity);
console.log("🛒 Cart Request:", cartRequest);

    try {
      await addToCart(cartRequest);
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart.");
    }
  };

  const handleAddReview = async () => {
    const reviewData = {
      reviewText: newReview,
      rating,
      productId: Number(id),
      userId: 1,
    };

    try {
      const response = await addReview(reviewData);
      if (response === 201) {
        // Fetch the updated list of reviews after adding a new review
        const updatedReviews = await fetchReviewByProductId(id);
        setReviews(updatedReviews);
        setNewReview(""); // Clear the input field
        setRating(0); // Reset the rating
      } else {
        console.error("New review data is missing fields:", response);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const [zoomStyle, setZoomStyle] = useState({});

  const handleMouseMove = (e) => {
    const { offsetWidth, offsetHeight } = e.currentTarget;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const xPercent = (x / offsetWidth) * 100;
    const yPercent = (y / offsetHeight) * 100;

    setZoomStyle({
      backgroundImage: `url(${images[selectedImage]})`,
      backgroundSize: "200%", // Adjust zoom level
      backgroundPosition: `${xPercent}% ${yPercent}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex items-center justify-center"
      >
        <p className="text-center text-lg">Loading...</p>
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex items-center justify-center"
      >
        <p className="text-center text-red-500">{error}</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-5"
    >
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="mx-auto px-4 sm:px-6 lg:px-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-xl rounded-3xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            {" "}
            {/* Reduced padding */}
            {/* Image Section */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-2xl overflow-hidden h-[430px]  "
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={zoomStyle}
            >
              {productImages.length > 0 && (
                <img
                  src={productImages[selectedImage].imageUrl}
                  alt={`Product Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
                />
              )}
            </motion.div>
            {/* Product Details */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-5"
            >
              <div className="border-b border-emerald-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-teal-600">
                  ${product.pricePerUnit}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    product.status === "IN_STOCK"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Category: {product.category.replace("_", " ")}</span>
                <span className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {product.stock} units available
                </span>
              </div>

              {/* Quantity Selector and Add to Cart Button */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl w-70">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    {" "}
                    {/* Reduced space-x from 3 to 2 */}
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      <Minus className="text-teal-600" size={18} />
                    </button>
                    <span className="text-lg font-medium w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      <Plus className="text-teal-600" size={18} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all" // Added px-6 for padding
                >
                  <ShoppingCart size={20} />
                  <span className="text-base font-semibold">Add to Cart</span>
                </motion.button>
              </div>

              {/* Product Highlights */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                  <Leaf className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm">100% Organic</span>
                </div>
                <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600 mr-2" />
                  <span className="text-sm">Fresh Daily</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Thumbnail Gallery and Reviews Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Thumbnail Gallery */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                More Views
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-30 h-30 rounded-xl overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-teal-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Reviews Section */}
            <div className="bg-gray-50 rounded-2xl p-6 mt-[-80px]">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <Star className="w-5 h-5 text-amber-500 mr-2" />
                Customer Reviews
              </h2>

              <div className="space-y-5">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.review_id}
                      className="p-4 bg-white rounded-xl shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">
                          {review.userName}
                        </span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span key={index} className="mr-1">
                              {index < review.rating ? (
                                <Star className="w-4 h-4 text-amber-500 fill-current" />
                              ) : (
                                <Star className="w-4 h-4 text-gray-300" />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {review.reviewText}
                      </p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {new Date(review.review_date).toString() !==
                        "Invalid Date"
                          ? new Date(review.review_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Date not available"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <PenLine className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Be the first to review this product
                    </p>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Edit className="w-5 h-5 text-teal-600 mr-2" />
                  Write a Review
                </h3>
                <textarea
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows="4"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your experience with this product..."
                />
                <div className="flex items-center mt-4 space-x-2">
                  <span className="text-sm text-gray-600">Your Rating:</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setRating(index + 1)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        {index < rating ? (
                          <Star className="w-5 h-5 text-amber-500 fill-current" />
                        ) : (
                          <Star className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddReview}
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-xl text-sm font-medium transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
