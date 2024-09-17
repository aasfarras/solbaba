// assets
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

// constant
const icons = { DashboardOutlinedIcon };

const dashboardSales = {
  id: "dashboardSales",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "defaultSales",
      title: "Dashboard",
      type: "item",
      url: "/sales",
      icon: icons.DashboardOutlinedIcon,
      breadcrumbs: false,
    },
  ],
};

export default dashboardSales;
