const API_BASE_URL = "http://localhost:4000/products";

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch products");

    const result = await response.json();
    return (result.data || []).map((p) => ({
      id: p.product_id,
      name: p.name,
      description: p.description,
      pricePerUnit: p.price_per_unit, // ✅ Correct casing
      stockQuantity: p.stock_quantity,
      status: p.status,
      category: p.category,
      activeStatus: p.active_status ?? true,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`);
    if (!response.ok) throw new Error("Product not found");

    const result = await response.json();
    console.log("Product data:", result);

    if (result.status !== "success" || !result.data) return null;

    const p = result.data;

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      pricePerUnit: p.pricePerUnit, // ✅ already formatted in backend
      stockQuantity: p.stockQuantity,
      status: p.status,
      category: p.category,
      userId: p.user_id, // ✅ important for seller validation
      activeStatus: p.activeStatus === 1 || p.active_status === 1, // support both just in case
    };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const deleteProduct = async (productId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || "";
  console.log("token", token);

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

// PUT /products/restore/:productId
export const restoreProduct = async (productId) => {
  const token = JSON.parse(sessionStorage.getItem("authData"))?.data?.token;
  const response = await fetch(
    `http://localhost:4000/products/restore/${productId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to restore product");
  return await response.json();
};

export const fetchProductsBySeller = async (sellerId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || "";
  console.log("token", token);
  if (!token) {
    console.error("No valid token found in session storage.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/seller/${sellerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch products for seller");

    const result = await response.json();
    return (result.data || []).map((p) => ({
      id: p.product_id,
      name: p.name,
      description: p.description,
      price_per_unit: p.price_per_unit,
      stock_quantity: p.stock_quantity,
      status: p.status,
      category: p.category,
      activeStatus: p.active_status === 1, // ✅ normalize
    }));
    // ✅ Fix applied here
    // console.log("Returning products:", result);
  } catch (error) {
    console.error("Error fetching products by seller:", error);
    return [];
  }
};

export const addNewProduct = async (productData) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || "";
  console.log("token", token);

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Failed to add product");
    return await response.json();
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};
export const updateProductDetails = async (productData, productId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || "";

  console.log("token", token);

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  const authDataStr = sessionStorage.getItem("authData");
  const authData = authDataStr ? JSON.parse(authDataStr) : null;
  const token = authData?.data?.token || "";

  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error("Failed to fetch categories");

    const result = await response.json();
    return result?.data || []; // Safely return category list
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchProductsByCategories = async (categoryName) => {
  try {
    // Transform the categoryName to the desired format
    const formattedCategoryName = categoryName.toUpperCase().replace(/\s+/g, "_");

    // const response = await fetch(
    //   `${API_BASE_URL}/category?category=${formattedCategoryName}`
    // );
    const response = await fetch(
      `${API_BASE_URL}/category/${formattedCategoryName}`
    );

    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
