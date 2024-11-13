import axios from "axios";

export const updateProfile = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}salesman/profile`,
      {
        name: serviceData.name,
        email: serviceData.email,
        gender: serviceData.gender,
        address: serviceData.address,
        phone: serviceData.phone,
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
