import axios from "axios";

export const deleteVariantImage = async (id) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found. User may not be authenticated.");
  }

  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API}superadmin/product/variant/${id}`, // URL endpoint untuk delete
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Sesuaikan ini dengan struktur data respons dari API Anda
  } catch (error) {
    console.error(
      "Error deleting product image:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      `Failed to delete product image. ${error.response ? error.response.data : error.message}`
    );
  }
};
