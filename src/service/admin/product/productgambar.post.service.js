import axios from "axios";

export const postProductImage = async (id, imageFile) => {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();

  // Tambahkan file gambar ke FormData
  formData.append("image", imageFile); // Sesuaikan nama field dengan yang diharapkan oleh API

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API}admin/product/image/${id}`, // Pastikan URL lengkap dan benar
      formData, // Kirim FormData, bukan objek
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // Sesuaikan ini dengan struktur data respons dari API Anda
  } catch (error) {
    console.error(
      "Error uploading Product image:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
