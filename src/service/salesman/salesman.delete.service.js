import axios from "axios";

export const deleteSalesman = async (id) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API}superadmin/salesman/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting salesman:", error);
    throw error;
  }
};
