import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import PerfectScrollbar from "react-perfect-scrollbar";
import MainCard from "../../../../ui-component/cards/MainCard";
import Transitions from "../../../../ui-component/extended/Transitions";
import User1 from "../../../../assets/images/users/user-round.svg"; // Placeholder gambar

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  // State untuk menyimpan data pengguna dan gambar profil
  const [userData, setUserData] = useState({
    name: "Johne Doe",
    email: "johndoe@example.com",
    gender: "laki-laki",
    address: "Minasa Upa",
    referralCode: "hq6dqy",
    profileImage: User1, // Gambar profil default
  });

  const anchorRef = useRef(null);

  const handleLogout = () => {
    navigate("/");
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    handleClose(event);

    if (index === 0) {
      setOpenModal(true); // Membuka modal ketika Account Settings ditekan
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

  // Mengubah gambar profil
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

  const handleSave = () => {
    console.log("Data berhasil disimpan:", userData);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(true);
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
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Selamat Pagi,</Typography>
                        <Typography
                          component="span"
                          variant="h4"
                          sx={{ fontWeight: 400 }}
                        >
                          {userData.name}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">Sales</Typography>
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
                      <Divider />
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
                  </PerfectScrollbar>
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
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Ubah Foto Profil
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
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
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                margin="normal"
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
                label="Email"
                name="email"
                value={userData.email}
                margin="normal"
                disabled
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
              </Stack>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ProfileSection;
