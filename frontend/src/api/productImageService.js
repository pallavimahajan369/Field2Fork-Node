// src/api/productImageService.js
const PRODUCT_IMAGE_API_BASE_URL = "http://localhost:4000/product-images";

// ✅ 1. Fetch image IDs for a given product
export const fetchProductImages = async (productId) => {
  try {
    const response = await fetch(`${PRODUCT_IMAGE_API_BASE_URL}/product/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product images");

    const result = await response.json();
    const images = result.data || [];

    // Add image URL for frontend rendering
    return images.map((img) => ({
      ...img,
      imageUrl: getImageUrlById(img.image_id), // 👈 add this!
    }));
  } catch (error) {
    console.error("Error fetching product images:", error);
    return [];
  }
};


// ✅ 2. Delete a specific image by ID
export const deleteProductImage = async (imageId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || "";

  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }

  try {
    const response = await fetch(`${PRODUCT_IMAGE_API_BASE_URL}/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete product image");
    return await response.json();
  } catch (error) {
    console.error("Error deleting product image:", error);
    throw error;
  }
};

// ✅ 3. Upload an image (stored as binary into DB)
export const uploadProductImage = async (productId, file) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || "";

  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("image", file);

    const response = await fetch(`${PRODUCT_IMAGE_API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type manually for multipart/form-data
      },
    });

    if (!response.ok) throw new Error("Failed to upload image");

    return await response.json();
  } catch (error) {
    console.error("Error uploading product image:", error);
    throw error;
  }
};

// ✅ 4. Get image by ID for <img src="..."> usage
export const getImageUrlById = (imageId) => {
  return `${PRODUCT_IMAGE_API_BASE_URL}/image/${imageId}`;
};
