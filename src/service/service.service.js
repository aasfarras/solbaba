import axios from "axios";

export const postService = async (serviceData, callback) => {
  try {
    const token = localStorage.getItem("token"); // Pastikan token diambil dengan benar
    const response = await axios.post(
      "https://api.agang-toyota.my.id/api/customer/service/order",
      {
        customer_id: serviceData.customer_id,
        service_type: serviceData.service_type,
        vehicle_model: serviceData.vehicle_model,
        police_number: serviceData.police_number,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token otentikasi jika diperlukan
        },
      }
    );
    callback(response.data.data);
  } catch (error) {
    console.error("Error fetching Service data:", error);
  }
};
