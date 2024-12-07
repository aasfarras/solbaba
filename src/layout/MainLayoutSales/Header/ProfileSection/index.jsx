import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  Modal,
  ListItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "axios";
import MainCard from "../../../../ui-component/cards/MainCard";
import { message } from "antd";
import Transitions from "../../../../ui-component/extended/Transitions";
// import User1 from "../../../../assets/images/user.png"; // Placeholder gambar
import Usere from "../../../../assets/images/usere.png";
import { getProfile } from "../../../../service/sales-route/profile.get.service"; // Import service
import { updateProfile } from "../../../../service/sales-route/profile.update.service"; // Import service untuk reset password
import { updatePassword } from "../../../../service/sales-route/profile.updatepass.service";

import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // State untuk menyimpan data pengguna dan gambar profil
  const [userData, setUserData] = useState({
    name: "Johne Doe",
    username: "johne doe",
    email: "johndoe@example.com",
    gender: "laki-laki",
    address: "Minasa Upa",
    referralCode: "hq6dqy",
    profileImage: Usere, // Gambar profil default
    phone: "1234",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const anchorRef = useRef(null);

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

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = async (event, index) => {
    setSelectedIndex(index);
    handleClose(event);

    if (index === 0) {
      // Mengambil data dari service ketika Pengaturan Akun ditekan
      try {
        const response = await getProfile();
        if (response.code === 200) {
          const { data } = response; // Ambil data dari response
          setUserData({
            id: data.id,
            name: data.name,
            username: data.username,
            email: data.email,
            gender: data.gender,
            address: data.address,
            referralCode: data.referral_code,
            profileImage: data.photo_url || Usere, // Gunakan gambar dari API atau gambar default
            phone: data.phone,
          });
          setOpenModal(true); // Membuka modal ketika data berhasil diambil
        } else {
          console.error("Failed to fetch profile:", response.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditMode(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData({ ...userData, profileImage: reader.result });
      };
      reader.readAsDataURL(file); // Mengubah file gambar menjadi data URL
    }
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile(userData.id, userData); // Panggil service updateProfile
      if (response.code === 200) {
        message.success("Profile berhasil diperbarui!");
        setIsEditMode(false);
      } else {
        console.error("Failed to update profile:", response.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await updatePassword(userData.id, passwordData);
      if (response.code === 200) {
        message.success("Password berhasil diperbarui!");
        setPasswordData({
          old_password: "",
          password: "",
          password_confirmation: "",
        }); // Reset form
      } else {
        console.error("Failed to reset password:", response.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(true);
  };

  const toggleResetPasswordModal = () => {
    setOpenResetPasswordModal((prev) => !prev);
  };

  const handleCloseResetPasswordModal = () => {
    setOpenResetPasswordModal(false);
  };

  return (
    <>
      <Avatar
        src={userData.profileImage} // Gambar profil yang bisa berubah
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
                  <Box sx={{ p: 2, pt: 0 }}>
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
                      <ListItemButton
                        selected={selectedIndex === 0}
                        onClick={(event) => handleListItemClick(event, 0)}
                      >
                        <ListItemIcon>
                          <IconSettings stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              Pengaturan Akun
                            </Typography>
                          }
                        />
                      </ListItemButton>
                      <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">Keluar</Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>

      {/* Modal untuk Account Settings */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="account-settings-modal"
        aria-describedby="account-settings-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              src={userData.profileImage}
              sx={{ width: 100, height: 100 }}
            />
          </div>
          {isEditMode ? (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nama"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="No.Hp"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                margin="normal"
                type="number"
              />
              <TextField
                fullWidth
                label="Jenis Kelamin"
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Alamat"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Kode Referral"
                name="referralCode"
                value={userData.referralCode}
                onChange={handleInputChange}
                margin="normal"
                disabled
              />
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                mt={2}
              >
                <Button variant="contained" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outlined" onClick={toggleResetPasswordModal}>
                  Reset Password
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box>
              <TextField
                fullWidth
                label="Nama"
                name="name"
                value={userData.name}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={userData.username}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={userData.email}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="No.Hp"
                name="phone"
                value={userData.phone}
                margin="normal"
                disabled
                type="number"
              />
              <TextField
                fullWidth
                label="Gender"
                name="gender"
                value={userData.gender}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={userData.address}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Referral Code"
                name="referralCode"
                value={userData.referralCode}
                margin="normal"
                disabled
              />
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                mt={2}
              >
                <Button variant="outlined" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button variant="outlined" onClick={toggleEditMode}>
                  Edit
                </Button>
                <Button variant="outlined" onClick={toggleResetPasswordModal}>
                  Reset Password
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Modal untuk Reset Password */}
      <Modal
        open={openResetPasswordModal}
        onClose={handleCloseResetPasswordModal}
        aria-labelledby="reset-password-modal"
        aria-describedby="reset-password-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Reset Password
          </Typography>
          <TextField
            fullWidth
            label="Old Password"
            name="old_password"
            type={showPassword ? "text" : "password"}
            value={passwordData.old_password}
            onChange={handlePasswordChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={passwordData.password}
            onChange={handlePasswordChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="password_confirmation"
            type={showPassword ? "text" : "password"}
            value={passwordData.password_confirmation}
            onChange={handlePasswordChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Button variant="outlined" onClick={handleCloseResetPasswordModal}>
              Close
            </Button>
            <Button variant="contained" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileSection;
