// assets
import { IconDashboard } from "@tabler/icons-react";

// constant
const icons = { IconDashboard };

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
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ],
};

export default dashboardSales;
