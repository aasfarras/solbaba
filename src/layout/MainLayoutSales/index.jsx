// MainLayout.js
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";

// project imports
import { CssBaseline, styled, useTheme } from "@mui/material";
import Header from "./Header";
import Customization from "../Customization";
import Breadcrumbs from "../../ui-component/extended/Breadcrumbs";
import { SET_MENU } from "../../store/actions";

// assets
import { IconChevronRight } from "@tabler/icons-react";
import BottomNav from "./BottomNav"; // Import the BottomNav component

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "theme",
})(({ theme }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0, // Pastikan padding ini ditambahkan
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          zIndex: theme.zIndex.drawer + 1, // Ensure the AppBar is above other components
        }}
      >
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      {/* main content */}
      <Main theme={theme}>
        {/* breadcrumb */}
        <Breadcrumbs
          separator={IconChevronRight}
          navigation={navigation}
          icon
          title
          rightAlign
        />
        <Outlet />
      </Main>
      {/* Bottom Navigation */}
      <BottomNav /> {/* Menambahkan margin-top pada BottomNav */}
      <Customization />
    </Box>
  );
};

export default MainLayout;
