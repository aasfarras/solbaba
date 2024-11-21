import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
  DialogTitle,
  Grid,
  TextField,
  Box,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  IconPencil,
  IconTrash,
  IconEye,
  IconUser,
  IconKey,
  IconAdjustments,
} from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getSalesman } from "../../../service/salesman/salesman.get.service"; // Adjust the import according to your service structure
import { deleteSalesman } from "../../../service/salesman/salesman.delete.service"; // Adjust the import according to your service structure
import { updateSalesResetPass } from "../../../service/salesman/salesman.resetPassword.service";
import { updateSalesResetUsername } from "../../../service/salesman/salesman.resetUsername.service";
import { updateStatusSalesman } from "../../../service/salesman/salesman.editstatus.service";

import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

const Salesman = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [currentSalesmanId, setCurrentSalesmanId] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [resetAccountDialogOpen, setResetAccountDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false); // Add this line

  const statusMapping = {
    active: "Aktif",
    suspended: "Menangguhkan",
    inactive: "Tidak Aktif",
  };

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const result = await getSalesman(page);
      const formattedData = result.data.data.map((item) => [
        item.name,
        item.username,
        item.email,
        // item.gender === "male" ? "Pria" : "Wanita",
        // item.address,
        item.phone,
        item.referral_code,
        statusMapping[item.account_status] || "Status Tidak Diketahui", // Pemetaan status
        item.id,
      ]);
      setData(formattedData);
      setTotal(result.data.total);
      setCurrentPage(result.data.current_page);
    } catch (error) {
      console.error("Failed to fetch salesman data", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleDetail = (rowIndex) => {
    const rowData = data[rowIndex];
    const salesmanId = rowData[6]; // Assuming this is the ID of the product
    // Navigate to detail page with the product ID
    window.location.href = `/super-admin/manajemen/sales/detailsales/${salesmanId}`; // Adjust the path based on your routing setup
  };

  const handleDeleteClick = (rowIndex) => {
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setCurrentSalesmanId(rowData[6]); // Ensure this is the correct index for the salesman ID
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSalesman(currentSalesmanId);
      const updatedData = data.filter((_, index) => index !== currentRowIndex);
      setData(updatedData);
      setDeleteDialogOpen(false);
      message.success("Salesman Berhasil di Hapus");
    } catch (error) {
      console.error(
        "Error deleting salesman:",
        error.response ? error.response.data : error
      );
      message.error("Gagal Menghapus Salesman");
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleResetPasswordClick = (rowIndex) => {
    const rowData = data[rowIndex];
    setCurrentSalesmanId(rowData[6]);
    setResetPasswordDialogOpen(true);
  };

  const handleResetPassword = async () => {
    try {
      await updateSalesResetPass(currentSalesmanId, {
        password: newPassword,
        password_confirmation: passwordConfirmation,
      });
      setResetPasswordDialogOpen(false);
      setNewPassword("");
      setPasswordConfirmation("");
      message.success("berhasil mengganti Password");
      fetchData();
      // Optionally, you can show a success message here
    } catch (error) {
      console.error("Error resetting password:", error);
      // Optionally, you can show an error message here
    }
  };

  const handleResetAccountClick = (rowIndex) => {
    const rowData = data[rowIndex];
    setCurrentSalesmanId(rowData[6]);
    setResetAccountDialogOpen(true);
  };

  const handleResetAccount = async () => {
    try {
      await updateSalesResetUsername(currentSalesmanId, {
        username: newUsername,
        email: newEmail,
      });
      setResetAccountDialogOpen(false);
      setNewUsername("");
      setNewEmail("");
      fetchData();
      message.success("Username and Email Berhasil Diperbarui");
    } catch (error) {
      console.error("Error resetting account:", error);
      message.error("Failed to update username and email");
    }
  };

  const handleEditStatusClick = (rowIndex) => {
    const rowData = data[rowIndex];
    setCurrentSalesmanId(rowData[6]); // ID salesman
    setEditStatusDialogOpen(true);
  };

  const handleChangeStatus = async () => {
    try {
      await updateStatusSalesman(currentSalesmanId, { status: selectedStatus });
      fetchData(currentPage); // Refresh data setelah update
      message.success(`Akun berhasil diubah`);
      setEditStatusDialogOpen(false); // Tutup modal setelah berhasil
    } catch (error) {
      console.error("Error changing status:", error);
      message.error("Gagal mengubah status akun");
    }
  };

  const columns = [
    { name: "name", label: "Nama" },
    { name: "username", label: "Username" },
    { name: "email", label: "Email" },
    // { name: "gender", label: "Jenis Kelamin" },
    // { name: "address", label: "Alamat" },
    { name: "phone", label: "No. Telp" },
    { name: "referral_code", label: "Kode Referral" },
    { name: "account_status", label: "Status Akun" },
    {
      name: "Actions",
      label: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => (
          <Box display="flex" gap={0.25}>
            <Tooltip title="Detail">
              <Button
                onClick={() => handleDetail(tableMeta.rowIndex)}
                sx={{ color: theme.palette.info.main }}
              >
                <IconEye />
              </Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                onClick={() =>
                  navigate(
                    `/super-admin/manajemen/sales/editsales/${data[tableMeta.rowIndex][6]}`
                  )
                }
                sx={{ color: theme.palette.warning.main }}
              >
                <IconPencil />
              </Button>
            </Tooltip>
            <Tooltip title="Hapus">
              <Button
                onClick={() => handleDeleteClick(tableMeta.rowIndex)}
                sx={{ color: theme.palette.error.main }}
              >
                <IconTrash />
              </Button>
            </Tooltip>
            <Tooltip title="Reset Username and Email">
              <Button
                onClick={() => handleResetAccountClick(tableMeta.rowIndex)}
                sx={{ color: theme.palette.info.main }}
              >
                <IconUser />
              </Button>
            </Tooltip>
            <Tooltip title="Reset Password">
              <Button
                onClick={() => handleResetPasswordClick(tableMeta.rowIndex)}
                sx={{ color: theme.palette.success.main }}
              >
                <IconKey />
              </Button>
            </Tooltip>
            <Tooltip title="Edit Status">
              <Button
                onClick={() => handleEditStatusClick(tableMeta.rowIndex)}
                sx={{ color: theme.palette.primary.main }}
              >
                <IconAdjustments />
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    },
  ];

  return (
    <>
      {loading ? ( // Conditional rendering for loading
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="70vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <MUIDataTable
            title={
              <Link to="tambahsales">
                <Button variant="contained">Tambah Sales</Button>
              </Link>
            }
            data={data}
            columns={columns}
            options={{
              selectableRows: "none",
              elevation: 0,
              rowsPerPageOptions: [5, 10, 20, 50],
              textLabels: {
                body: {
                  noMatch: "Maaf, tidak ada catatan yang cocok ditemukan", // Ubah pesan di sini
                },
                pagination: {
                  rowsPerPage: "Baris per Halaman",
                },
              },
            }}
          />
          <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
            <DialogTitle variant="h5">Menghapus Salesman</DialogTitle>
            <DialogContent>
              Apakah Anda yakin ingin menghapus salesman ini?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose}>Cancel</Button>
              <Button onClick={handleDelete} color="error">
                Hapus
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={resetPasswordDialogOpen}
            onClose={() => setResetPasswordDialogOpen(false)}
          >
            <DialogTitle variant="h5">Atur Ulang Kata sandi</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <TextField
                    label="Kata Sandi Baru"
                    type={showNewPassword ? "text" : "password"} // Mengubah tipe input berdasarkan state
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword((prev) => !prev)} // Toggle visibility
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Konfirmasi Kata Sandi"
                    type={showPasswordConfirmation ? "text" : "password"} // Mengubah tipe input berdasarkan state
                    fullWidth
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPasswordConfirmation((prev) => !prev)
                            } // Toggle visibility
                            edge="end"
                          >
                            {showPasswordConfirmation ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setResetPasswordDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleResetPassword} color="primary">
                Atur Ulang Kata Sandi
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={resetAccountDialogOpen}
            onClose={() => setResetAccountDialogOpen(false)}
          >
            <DialogTitle variant="h5">
              Atur Ulang Username and Email
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Username Baru"
                    fullWidth
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email Baru"
                    type="email"
                    fullWidth
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setResetAccountDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleResetAccount} color="primary">
                Mengatur Ulang Akun
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={editStatusDialogOpen}
            onClose={() => setEditStatusDialogOpen(false)}
          >
            <DialogTitle variant="h5">Edit Status Akun</DialogTitle>
            <DialogContent>
              <TextField
                select
                label="edit status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{ width: "300px" }}
                fullWidth
              >
                {[
                  { key: "active", value: "Aktif" },
                  { key: "suspended", value: "Menangguhkan" },
                  { key: "inactive", value: "Tidak Aktif" },
                ].map((status) => (
                  <MenuItem key={status.key} value={status.key}>
                    {status.value}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditStatusDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleChangeStatus} color="primary">
                Simpan
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Salesman;
