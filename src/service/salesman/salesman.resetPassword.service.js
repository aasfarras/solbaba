import axios from "axios";

export const updateSalesResetPass = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}superadmin/salesman/${id}/reset-password`,
      {
        password: serviceData.password,
        password_confirmation: serviceData.password_confirmation,
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
