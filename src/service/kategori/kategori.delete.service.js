import axios from "axios";

export const deleteKategori = async (id) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API}superadmin/product/category/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting kategori:", error);
    throw error;
  }
};
