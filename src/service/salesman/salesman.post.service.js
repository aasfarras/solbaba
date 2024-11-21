// salesman.service.js
import axios from "axios";

export const postSalesman = async (salesmanData) => {
  const token = sessionStorage.getItem("token"); // Retrieve the token from session storage
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API}superadmin/salesman`, // Adjust the endpoint according to your API
      {
        name: salesmanData.name,
        username: salesmanData.username,
        email: salesmanData.email,
        gender: salesmanData.gender,
        address: salesmanData.address,
        phone: salesmanData.phone,
        referral_code: salesmanData.referral_code,
        password: salesmanData.password,
        password_confirmation: salesmanData.password_confirmation,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers for authentication
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error creating Salesman data:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
