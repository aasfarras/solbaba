import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { getProfile } from "../../../service/sales-route/profile.get.service";
import ProfileSection from "./ProfileSection";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { message } from "antd";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const [userData, setUserData] = useState({
    name: "Johne Doe", // Default name
  });

  const theme = useTheme();

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfile();
        if (response.code === 200) {
          const { data } = response; // Get data from response
          setUserData({
            name: data.name, // Set the user's name
          });
        } else {
          console.error("Failed to fetch profile:", response.message);
          message.error("Failed to fetch profile information.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        message.error("Error fetching profile information.");
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <Typography
        variant="h5"
        // sx={{
        //   fontWeight: "normal",
        // }}
      >
        Halo, {userData.name}
      </Typography>

      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
