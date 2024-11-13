import axios from "axios";

export const updateSalesman = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}superadmin/salesman/${id}`,
      {
        name: serviceData.name,
        phone: serviceData.phone,
        gender: serviceData.gender,
        address: serviceData.address,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating salesman data:", error);
    throw error;
  }
};
