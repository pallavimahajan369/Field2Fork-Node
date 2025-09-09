

const API_BASE_URL = "http://localhost:4000/users";

export const getBuyers = async () => {
  const authDataStr = sessionStorage.getItem("authData");
 const token = JSON.parse(authDataStr).data.token;  // <— adjust if needed

  if (!token) {
    console.error("No valid token found in session storage.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/buyers/after/0`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch buyers");

    const result = await response.json();

    // 🔑 Map API fields to the ones your table expects
    return (result.data || []).map((b) => ({
      id: b.user_id,                 // map user_id → id
      username: b.username,
      email: b.email,
      contactNumber: b.contact_number || "N/A",  // default if backend has no number
      address: b.address,
      activeStatus: b.active_status ?? true,     // default true if missing
    }));
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return [];
  }
};

export const fetchMoreBuyers = async (lastFetchedId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/buyers/after/${lastFetchedId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch more buyers");
   const result = await response.json();
     return (result.data || []).map((b) => ({
      id: b.user_id,                 // map user_id → id
      username: b.username,
      email: b.email,
      contactNumber: b.contact_number || "N/A",  // default if backend has no number
      address: b.address,
      activeStatus: b.active_status ?? true,     // default true if missing
    }));
  } catch (error) {
    console.error("Error fetching more buyers:", error);
    return [];
  }
};

export const fetchPrevBuyers = async (firstBuyerId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/buyers/before/${firstBuyerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch previous buyers");
   const result = await response.json();
     return (result.data || []).map((b) => ({
      id: b.user_id,                 // map user_id → id
      username: b.username,
      email: b.email,
      contactNumber: b.contact_number || "N/A",  // default if backend has no number
      address: b.address,
      activeStatus: b.active_status ?? true,     // default true if missing
    }));
  } catch (error) {
    console.error("Error fetching previous buyers:", error);
    return [];
  }
};

export const getBuyerById = async (id) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr)?.data?.token;

  if (!token) {
    console.error("No valid token found in session storage.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/buyers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();

    if (response.ok && result.status === "success" && result.data) {
      const b = result.data;
      const mappedBuyer = [{
        id: b.user_id,
        username: b.username,
        email: b.email,
         contactNumber: b.contact_number || "N/A",
        address: b.address,
      }];
      return mappedBuyer;
    } else {
      console.warn("Buyer not found or error status", result);
      return [];
    }
  } catch (error) {
      console.error("Error fetching seller:", error);
      alert("Something went wrong. See console.");
    }
};

export const getSellers = async () => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/sellers/after/0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch sellers");
    const result = await response.json();
     return (result.data || []).map((b) => ({
      id: b.user_id,                 // map user_id → id
      username: b.username,
      email: b.email,
      contactNumber: b.contact_number || "N/A",  // default if backend has no number
      location: b.location,
       rating:b.rating,
      activeStatus: b.active_status ?? true,     // default true if missing
    }));
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return [];
  }
};

export const fetchMoreSellers = async (lastFetchedId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/sellers/after/${lastFetchedId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch more sellers");
    const result = await response.json();
     return (result.data || []).map((b) => ({
      id: b.user_id,                 // map user_id → id
      username: b.username,
      email: b.email,
      contactNumber: b.contact_number || "N/A",  // default if backend has no number
      location: b.location,
      rating:b.rating,
      activeStatus: b.active_status ?? true,     // default true if missing
    }));
  } catch (error) {
    console.error("Error fetching more sellers:", error);
    return [];
  }
};

export const fetchPrevSellers = async (firstSellerId) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/sellers/before/${firstSellerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch previous sellers");
    const result = await response.json();
     return (result.data || []).map((b) => ({
      id: b.user_id,                 // map user_id → id
      username: b.username,
      email: b.email,
      contactNumber: b.contact_number || "N/A",  // default if backend has no number
      location: b.location,
       rating:b.rating,
      activeStatus: b.active_status ?? true,     // default true if missing
    }));
  } catch (error) {
    console.error("Error fetching previous sellers:", error);
    return [];
  }
};

export const getSellerById = async (id) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr)?.data?.token;

  if (!token) {
    console.error("No valid token found in session storage.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/sellers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();
    console.log("Fetched seller result:", result);

    if (response.ok && result.status === "success" && result.data) {
      const s = result.data;
      const sellerArray = [{
        id: id, // manually include ID if not in result
        username: s.username,
        email: s.email,
        contactNumber: s.contact_number || "N/A",
        location: s.location,
        rating: s.rating,
      }];
      return sellerArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching seller by ID:", error);
    return [];
  }
};


export const deleteUser = async (id) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return await response.json(); // Return the response if needed
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const restoreUser = async (id) => {
  const authDataStr = sessionStorage.getItem("authData");
  const token = JSON.parse(authDataStr).data.token;

  // If there's no token, log an error and don't make the request.
  if (!token) {
    console.error("No valid token found in session storage.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/restore`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to restore user");
    return await response.json(); // Return the response if needed
  } catch (error) {
    console.error("Error restoring user:", error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const registerBuyer = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/buyers/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        contact_number: formData.contactNumber,
        address: formData.address,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error(data.message || "Buyer registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};


export const registerSeller = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sellers/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: "SELLER",
        contact_number: formData.contactNumber,
        location: formData.location,
        rating: 0.1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
