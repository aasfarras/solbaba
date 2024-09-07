import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
  Typography,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  IconEye,
  IconPencil,
  IconTrash,
  IconKey,
  IconEyeOff,
} from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

const Sales = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    [
      "1",
      "Agus",
      "agus@gmail.com",
      "08123456789",
      "Laki-laki",
      "/path/to/agus.jpg",
      100,
      "AGUSREF123",
      "password123",
    ],
    [
      "2",
      "Budi",
      "budi@gmail.com",
      "08129876543",
      "Laki-laki",
      "/path/to/budi.jpg",
      150,
      "BUDREF456",
      "password123",
    ],
    [
      "3",
      "Citra",
      "citra@gmail.com",
      "08125678901",
      "Perempuan",
      "/path/to/citra.jpg",
      200,
      "CITREF789",
      "password123",
    ],
    [
      "4",
      "Dewi",
      "dewi@gmail.com",
      "08127890123",
      "Perempuan",
      "/path/to/dewi.jpg",
      250,
      "DEWREF012",
      "password123",
    ],
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create", "Detail", "Update"
  const [currentRow, setCurrentRow] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    noTelp: "",
    jenisKelamin: "",
    fotoProfil: "",
    jumlahPenjualan: "",
    kodeReferal: "",
    password: "",
  });

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({
      name: "",
      email: "",
      noTelp: "",
      jenisKelamin: "",
      fotoProfil: "",
      jumlahPenjualan: "",
      kodeReferal: "",
      password: "",
    });
    setDialogOpen(true);
  };

  const handleRead = (rowIndex) => {
    setDialogMode("Detail");
    setCurrentRow(data[rowIndex]);
    setFormData({
      name: data[rowIndex][1],
      email: data[rowIndex][2],
      noTelp: data[rowIndex][3],
      jenisKelamin: data[rowIndex][4],
      fotoProfil: data[rowIndex][5],
      jumlahPenjualan: data[rowIndex][6],
      kodeReferal: data[rowIndex][7],
      password: data[rowIndex][8],
    });
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRow(data[rowIndex]);
    setFormData({
      name: data[rowIndex][1],
      email: data[rowIndex][2],
      noTelp: data[rowIndex][3],
      jenisKelamin: data[rowIndex][4],
      fotoProfil: data[rowIndex][5],
      jumlahPenjualan: data[rowIndex][6],
      kodeReferal: data[rowIndex][7],
      password: data[rowIndex][8],
    });
    setDialogOpen(true);
  };

  const handleDelete = (rowIndex) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
  };

  const handleResetPassword = (rowIndex) => {
    const salesName = data[rowIndex][1];
    alert(`Reset kata sandi untuk ${salesName}`);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    if (dialogMode === "Create") {
      const newData = [
        ...data,
        [
          (data.length + 1).toString(),
          formData.name,
          formData.email,
          formData.noTelp,
          formData.jenisKelamin,
          formData.fotoProfil,
          formData.jumlahPenjualan,
          formData.kodeReferal,
          formData.password,
        ],
      ];
      setData(newData);
    } else if (dialogMode === "Update") {
      const newData = data.map((row, index) =>
        index === data.indexOf(currentRow)
          ? [
              currentRow[0],
              formData.name,
              formData.email,
              formData.noTelp,
              formData.jenisKelamin,
              formData.fotoProfil,
              formData.jumlahPenjualan,
              formData.kodeReferal,
              formData.password,
            ]
          : row
      );
      setData(newData);
    }
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const columns = [
    { name: "No", label: "No" },
    { name: "Nama Sales", label: "Nama Sales" },
    { name: "email", label: "email" },
    { name: "No.Telp", label: "No.Telp" },
    { name: "Jenis Kelamin", label: "Jenis Kelamin" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <Tooltip title="Detail">
                <Button
                  onClick={() => handleRead(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.success.dark }}
                >
                  <IconEye />
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  onClick={() => handleUpdate(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.warning.main }}
                >
                  <IconPencil />
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  onClick={() => handleDelete(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.error.main }}
                >
                  <IconTrash />
                </Button>
              </Tooltip>
              <Tooltip title="Reset Password">
                <Button
                  onClick={() => handleResetPassword(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.info.main }}
                >
                  <IconKey />
                </Button>
              </Tooltip>
            </>
          );
        },
      },
    },
  ];

  return (
    <>
      <MUIDataTable
        title={<Typography variant="h4">Manajemen Sales</Typography>}
        search={false}
        data={data}
        columns={columns}
        options={{
          selectableRows: "none",
          elevation: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: [5, 10, 20, 50, 100],
        }}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              alt={formData.name}
              src={formData.fotoProfil}
              sx={{ width: 80, height: 80, marginRight: 2 }}
            />
            <Typography variant="h6">{formData.name}</Typography>
          </Box>
          <TextField
            margin="dense"
            label="Nama"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="No. Telp"
            name="noTelp"
            fullWidth
            value={formData.noTelp}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Jenis Kelamin"
            name="jenisKelamin"
            fullWidth
            value={formData.jenisKelamin}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Jumlah Penjualan"
            name="jumlahPenjualan"
            fullWidth
            value={formData.jumlahPenjualan}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Kode Referal"
            name="kodeReferal"
            fullWidth
            value={formData.kodeReferal}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            type={showPassword ? "text" : "password"}
            disabled={dialogMode === "Detail"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <IconEye /> : <IconEyeOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Batal</Button>
          {dialogMode !== "Detail" && (
            <Button onClick={handleSave} color="primary">
              Simpan
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sales;
