const API_BASE_URL = "http://localhost:4000/products";

export const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:4000/products/categories");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json(); // result = { status, data: [...] }

    // 🛠️ Fix: Access result.data instead of result
    return result.data.map((cat) => ({
      id: cat.category,
      name: cat.category.replace(/_/g, " "),
    }));

  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
