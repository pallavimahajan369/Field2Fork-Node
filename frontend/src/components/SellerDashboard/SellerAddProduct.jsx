// src/components/SellerDashboard/SellerAddProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addNewProduct, fetchCategories } from "../../api/productService";

const SellerAddProduct = () => {
  const authData = JSON.parse(sessionStorage.getItem("authData"));
  const sellerId = authData?.user?.id; // ✅ Safe access to user ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerUnit: "",
    stockQuantity: "",
    category: "",
    status: "IN_STOCK",
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await fetchCategories(); // already returns an array of category objects
      console.log("Fetched categories:", res);
      if (Array.isArray(res)) {
        const categoryList = res.map((c) => c.category);
        setCategories(categoryList);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  };
  loadCategories();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     const authDataStr = sessionStorage.getItem("authData");
const authData = authDataStr ? JSON.parse(authDataStr) : null;
const sellerId = authData?.data?.user?.user_id;


console.log("Fetched sellerId:", sellerId);
    if (!sellerId) {
      setError("Seller ID is missing. Please log in again.");
      return;
    }

   const productData = {
  name: formData.name,
  description: formData.description,
  price_Per_unit: parseFloat(formData.pricePerUnit),
  stock_quantity: parseInt(formData.stockQuantity, 10),
  category: formData.category,
  status: formData.status,
  user_id: sellerId,  // ✅ now matches backend
};
console.log("Final productData payload:", productData);


    try {
      await addNewProduct(productData);
      navigate("/seller/products");
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Add New Product</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
          <label
            htmlFor="description"
            className="block text-lg font-medium mb-2"
          >
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
            <label
              htmlFor="pricePerUnit"
              className="block text-lg font-medium mb-2"
            >
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
            <label
              htmlFor="stockQuantity"
              className="block text-lg font-medium mb-2"
            >
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
            <label
              htmlFor="category"
              className="block text-lg font-medium mb-2"
            >
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
              {categories?.map?.((cat, idx) => (
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
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerAddProduct;
