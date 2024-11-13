import axios from "axios";

export const getCustomer = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}superadmin/customer`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};
