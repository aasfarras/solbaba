import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import axios from "axios";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "../../../../ui-component/cards/MainCard";
import Transitions from "../../../../ui-component/extended/Transitions";
import UpgradePlanCard from "./UpgradePlanCard";
// import User1 from "../../../../assets/images/users/user-round.svg";
import Usere from "../../../../assets/images/usere.png";

// assets
import {
  IconLogout,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState("");
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_APP_API}logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        sessionStorage.removeItem("token");

        navigate("/");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleListItemClick = (event, index, route = "") => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== "") {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Avatar
        src={Usere}
        sx={{
          ...theme.typography.mediumAvatar,
          margin: "8px 0 8px 8px !important",
          cursor: "pointer",
          width: "40px",
          height: "40px",
        }}
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={handleToggle}
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4" sx={{ fontWeight: 500 }}>
                          Selamat Datang,
                        </Typography>
                        <Typography
                          component="span"
                          variant="h4"
                          sx={{ fontWeight: 400 }}
                        >
                          Super Admin
                        </Typography>
                      </Stack>
                    </Stack>
                    <Divider />
                  </Box>
                  <PerfectScrollbar
                    style={{
                      height: "100%",
                      maxHeight: "calc(100vh - 250px)",
                      overflowX: "hidden",
                    }}
                  >
                    <Box sx={{ p: 2, pt: 0 }}>
                      {/* <Divider /> */}
                      <List
                        component="nav"
                        sx={{
                          width: "100%",
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: "10px",
                          [theme.breakpoints.down("md")]: {
                            minWidth: "100%",
                          },
                          "& .MuiListItemButton-root": {
                            mt: 0.5,
                          },
                        }}
                      >
                        <Button
                          onClick={handleLogout}
                          startIcon={<IconLogout stroke={1.5} size="1.3rem" />}
                          variant="text"
                          color="inherit"
                          sx={{
                            borderRadius: `${customization.borderRadius}px`,
                            textAlign: "left",
                            padding: "12px 16px",
                            justifyContent: "flex-start",
                            width: "100%",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <Typography variant="body2">Keluar</Typography>
                        </Button>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
