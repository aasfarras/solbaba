// BottomNavigation.js
import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import { useTheme } from "@mui/material";
import { IconReceipt } from "@tabler/icons-react";
import { IconShoppingCart } from "@tabler/icons-react";

const BottomNav = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = React.useState("dashboard");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <BottomNavigationAction
        label="Dashboard"
        value="/sales"
        icon={<DashboardIcon />}
      />
      <BottomNavigationAction
        label="Pesanan"
        value="menu/pesanan"
        icon={<IconShoppingCart />}
      />
      <BottomNavigationAction
        label="Arsip"
        value="menu/arsip"
        icon={<IconReceipt />}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
