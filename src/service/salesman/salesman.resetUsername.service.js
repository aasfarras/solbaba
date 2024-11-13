import axios from "axios";

export const updateSalesResetUsername = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}superadmin/salesman/${id}/update-account`,
      {
        username: serviceData.username,
        email: serviceData.email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating salesman reset pass data:", error);
    throw error;
  }
};
