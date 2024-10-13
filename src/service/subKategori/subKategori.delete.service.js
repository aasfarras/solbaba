import axios from "axios";

export const deleteSubKategori = async (id) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API}superadmin/product/subcategory/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting sub kategori:", error);
    throw error;
  }
};
