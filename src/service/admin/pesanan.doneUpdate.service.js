import axios from "axios";

export const updateDonePesanan = async (id) => {
  const token = sessionStorage.getItem("token");
  console.log(token);
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}admin/order/${id}`,
      {},
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
