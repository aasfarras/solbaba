import axios from "axios";

export const updateStatusSalesman = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}superadmin/salesman/${id}/update-status`,
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
    console.error("Error updating status salesman data:", error);
    throw error;
  }
};
