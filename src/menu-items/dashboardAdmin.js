// assets
import { IconLayoutDashboard } from "@tabler/icons-react";

// constant
const icons = { IconLayoutDashboard };

const dashboardAdmin = {
  id: "dashboardAdmin",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "defaultAdmin",
      title: "Dashboard",
      type: "item",
      url: "/admin",
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false,
    },
  ],
};

export default dashboardAdmin;
