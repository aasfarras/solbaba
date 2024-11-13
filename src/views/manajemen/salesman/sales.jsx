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
} from "@mui/material";
import {
  IconPencil,
  IconTrash,
  // IconAccountCircle,
  IconUser,
  IconKey,
} from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getSalesman } from "../../../service/salesman/salesman.get.service"; // Adjust the import according to your service structure
import { deleteSalesman } from "../../../service/salesman/salesman.delete.service"; // Adjust the import according to your service structure
import { updateSalesResetPass } from "../../../service/salesman/salesman.resetPassword.service";
import { updateSalesResetUsername } from "../../../service/salesman/salesman.resetUsername.service";

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

  const fetchData = async (page) => {
    try {
      const result = await getSalesman(page);
      const formattedData = result.data.data.map((item) => [
        item.name,
        item.username,
        item.email,
        item.gender === "male" ? "Pria" : "Wanita",
        item.address,
        item.referral_code,
        item.id,
      ]);
      setData(formattedData);
      setTotal(result.data.total);
      setCurrentPage(result.data.current_page);
    } catch (error) {
      console.error("Failed to fetch salesman data", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

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
    setCurrentSalesmanId(rowData[6]); // Use rowData[6] for salesman ID
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
    setCurrentSalesmanId(rowData[6]); // Use rowData[6] for salesman ID
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

  const columns = [
    { name: "name", label: "Nama" },
    { name: "username", label: "Username" },
    { name: "email", label: "Email" },
    { name: "gender", label: "Jenis Kelamin" },
    { name: "address", label: "Alamat" },
    { name: "referral_code", label: "Kode Rujukan" },
    {
      name: "Actions",
      label: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => (
          <Box display="flex" gap={0.25}>
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
          </Box>
        ),
      },
    },
  ];

  return (
    <>
      <MUIDataTable
        title={
          <Link to="tambahsales">
            <Button variant="contained">Tambah Produk</Button>
          </Link>
        }
        data={data}
        columns={columns}
        options={{
          selectableRows: "none",
          elevation: 0,
          rowsPerPageOptions: [5, 10, 20, 50],
          textLabels: {
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
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
        <DialogTitle variant="h5">Atur Ulang Username and Email</DialogTitle>
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
    </>
  );
};

export default Salesman;
