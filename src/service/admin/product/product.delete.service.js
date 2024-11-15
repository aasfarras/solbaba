import axios from "axios";

export const deleteProduct = async (id) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API}admin/product/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
