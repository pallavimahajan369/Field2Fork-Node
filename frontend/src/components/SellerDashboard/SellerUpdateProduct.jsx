// src/components/SellerDashboard/SellerUpdateProduct.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProductDetails,
  fetchCategories,
} from "../../api/productService";

const SellerUpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const authData = JSON.parse(sessionStorage.getItem("authData"));
 const sellerId = authData?.data?.user?.user_id;
console.log("sellerId:", sellerId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerUnit: "",
    stockQuantity: "",
    category: "",
    status: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sellerId) {
      setError("Unauthorized: Please login as a seller.");
      setLoading(false);
      return;
    }

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
       setCategories(data.map((c) => c.category)); // ✅ just strings

      } catch (err) {
        console.error("Error loading categories:", err);
        setCategories([]);
      }
    };

    const loadProduct = async () => {
      try {
        const product = await getProductById(productId);
        console.log("Fetched product:", product); // Debug log

        if (!product) {
          setError("Product not found.");
          setLoading(false);
          return;
        }

        const productOwnerId = Number(product.userId); // ✅ correct
        console.log("Product owner ID:", productOwnerId);
        if (productOwnerId !== sellerId) {
          setError("Unauthorized: You do not have permission to edit this product.");
          setLoading(false);
          return;
        }

        setFormData({
          name: product.name || "",
          description: product.description || "",
          pricePerUnit: product.pricePerUnit || "",
          stockQuantity: product.stockQuantity || "",
          category: product.category || "",
          status: product.status || "IN_STOCK",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product details.");
        setLoading(false);
      }
    };

    loadCategories();
    loadProduct();
  }, [productId, sellerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const productData = {
    name: formData.name,
    description: formData.description,
    price_Per_unit: parseFloat(formData.pricePerUnit), // ✅ matches backend
    stock_quantity: parseInt(formData.stockQuantity, 10), // ✅ matches backend
    status: formData.status,
    category: formData.category,
    user_id: sellerId, // ✅ optional but safe to include
  };

  try {
    await updateProductDetails(productData, productId);
    navigate("/seller/products");
  } catch (err) {
    console.error("Error updating product:", err);
    setError("Failed to update product. Please try again.");
  }
};


  if (loading) return <p className="text-center">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Update Product Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium mb-2">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="pricePerUnit" className="block text-lg font-medium mb-2">
              Price
            </label>
            <input
              id="pricePerUnit"
              name="pricePerUnit"
              type="number"
              step="0.01"
              value={formData.pricePerUnit}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="stockQuantity" className="block text-lg font-medium mb-2">
              Stock Quantity
            </label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-lg font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) &&
                categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-lg font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="IN_STOCK">IN_STOCK</option>
              <option value="LOW_STOCK">LOW_STOCK</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerUpdateProduct;
