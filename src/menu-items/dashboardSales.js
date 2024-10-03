// assets
import { IconLayoutDashboard } from "@tabler/icons-react";

// constant
const icons = { IconLayoutDashboard };

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
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false,
    },
  ],
};

export default dashboardSales;
