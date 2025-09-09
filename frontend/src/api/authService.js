// authService.js

/**
 * Logs in the user by calling the backend API.
 *
 * @param {string} email - The email input by the user.
 * @param {string} password - The password input by the user.
 * @returns {Promise<Object>} - Returns the login response data.
 * @throws {Error} - Throws an error if the login fails.
 */
export async function login(email, password) {
  
  try {
    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
       credentials: "include",
    });

    if (!response.ok) {
      // Clone the response so we can read its body for error details
      const responseClone = response.clone();
      let errorMessage = `Error: ${response.status}`;
      try {
        const errorData = await responseClone.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        try {
          const errorText = await responseClone.text();
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          // fallback remains errorMessage
        }
      }
      throw new Error(errorMessage);
    }

    // Parse the JSON response (this reads the original response)
    const data = await response.json();
console.log("Login response:", data);

    // Store the returned data in sessionStorage
    sessionStorage.setItem("authData", JSON.stringify(data));

    // Check the user role and navigate accordingly
   
    const role = data.data?.role?.toUpperCase();
    console.log("Logged-in role is:", role);


              if (role === "ADMIN") {
            window.location.href = "http://localhost:5173/admin";
          } else if (role === "SELLER") {
            window.location.href = "http://localhost:5173/seller";
          } else if (role === "BUYER") {
            window.location.href = "http://localhost:5173/";
          } else {
            throw new Error("Unknown user role.");
          }


    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}
