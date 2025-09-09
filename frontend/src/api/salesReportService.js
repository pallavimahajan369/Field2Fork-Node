const SALES_REPORT_API_BASE_URL = "http://localhost:4000/sales-report";

export const fetchSalesReport = async () => {
  const authDataStr = sessionStorage.getItem("authData");
  if (!authDataStr) {
    console.error("No auth data found in session storage.");
    return;
  }

  const authData = JSON.parse(authDataStr);
  const token = authData?.data?.token;
  const sellerId = authData?.data?.user?.user_id;

  if (!token || !sellerId) {
    console.error("Missing token or sellerId in auth data.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:4000/sales-report/${sellerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch sales report");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    return null;
  }
};
