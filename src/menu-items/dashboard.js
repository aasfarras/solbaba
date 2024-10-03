// assets
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { IconLayoutDashboard } from "@tabler/icons-react";

// constant
// const icons = { DashboardOutlinedIcon };

const icons = { IconLayoutDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Dashboard",
      type: "item",
      url: "/super-admin",
      icon: icons.IconLayoutDashboard, // gunakan icons.DashboardIcon
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
