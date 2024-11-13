import axios from "axios";

// Function to get product by ID
export const getCustomerById = async (id) => {
  try {
    const token = sessionStorage.getItem("token"); // Get token from sessionStorage
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}superadmin/customer/${id}`, // Use the specific product ID in the URL
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include authorization header if needed
        },
      }
    );
    return response.data; // Return the product data
  } catch (error) {
    console.error("Error fetching customer data by ID:", error);
    throw error; // Propagate the error for handling in the component
  }
};
