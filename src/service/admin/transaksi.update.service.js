import axios from "axios";

export const updateTransaksiAdmin = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}admin/transaction/status/${id}`,
      {
        status: serviceData.status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order data:", error);
    throw error;
  }
};