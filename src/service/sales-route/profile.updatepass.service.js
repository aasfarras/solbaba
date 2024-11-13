import axios from "axios";

export const updatePassword = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}salesman/profile/change-password`,
      {
        old_password: serviceData.old_password,
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
    console.error("Error updating product data:", error);
    throw error;
  }
};
