// src/components/SellerDashboard/SellerAddImage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadProductImage } from "../../api/productImageService";

const SellerAddImage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 🆕 Preview support
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile)); // 🆕 Preview logic
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file");
      return;
    }
    setLoading(true);
    try {
      await uploadProductImage(productId, file);
      setLoading(false);
      navigate("/seller/products"); // ✅ Go back after success
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        Upload Product Image
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="image" className="block text-lg font-medium mb-2">
            Select Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {previewUrl && (
          <div className="text-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-40 h-40 object-cover mx-auto rounded border"
            />
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerAddImage;
