// src/components/SellerDashboard/SellerProductCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Edit } from "lucide-react";
import {
  fetchProductImages,
  deleteProductImage,
} from "../../api/productImageService";
import { deleteProduct, restoreProduct } from "../../api/productService";

const SellerProductCard = ({ product, onProductUpdate }) => {
  const [images, setImages] = useState([]);

  // Extract product ID safely
  const productId = product?.id || product?.product_id;

  const loadImages = async () => {
    if (!productId) {
      console.warn("Product ID is missing");
      return;
    }
    try {
      const data = await fetchProductImages(productId);
      setImages(data);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  useEffect(() => {
    loadImages();
  }, [productId]);

  const handleImageDelete = async (imageId) => {
    try {
      await deleteProductImage(imageId);
      loadImages(); // instead of reloading page
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleProductDelete = async () => {
    try {
      await deleteProduct(productId);
      onProductUpdate(productId, false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleProductRestore = async () => {
    try {
      await restoreProduct(productId);
      onProductUpdate(productId, true);
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  if (!product || !productId) {
    return <div className="text-red-500">Invalid product data</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-1/3">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img) => (
                <div key={img.image_id} className="relative group">

                  <img
                    src={img.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-24 rounded"
                  />
                 <button
                      onClick={() => handleImageDelete(img.image_id)}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded"
                    >
                      <Trash2 size={18} className="text-white" />
                    </button>

                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500 text-sm">No images</span>
            </div>
          )}
          {/* Add Image Button */}
          {product.activeStatus && (
            <div className="mt-2">
              <Link
                to={`/seller/add-image/${productId}`}
                className="w-full inline-block bg-yellow-500 text-white text-center py-1 rounded hover:bg-yellow-600 transition"
              >
                Add Image
              </Link>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/3 md:pl-6 mt-4 md:mt-0">
          <h3 className="text-2xl font-bold text-gray-800">{product.name}</h3>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-gray-800 mt-2">Price: ₹{product.price_Per_unit}</p>
          <p className="text-gray-800 mt-2">Stock: {product.stock_quantity}</p>
          <p className="text-gray-800 mt-2">Status: {product.status}</p>
          <p className="text-gray-800 mt-2">Category: {product.category}</p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            {product.activeStatus ? (
              <>
                <button
                  onClick={handleProductDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-1"
                >
                  <Trash2 size={18} /> Delete
                </button>
                <Link
                  to={`/seller/update-product/${productId}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
                >
                  <Edit size={18} /> Edit
                </Link>
              </>
            ) : (
              <button
                onClick={handleProductRestore}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Restore
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;
