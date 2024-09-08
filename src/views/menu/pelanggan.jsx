import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Tooltip,
  Typography,
  Avatar,
  Card,
  CardContent,
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

const Pelanggan = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    [
      "Agus",
      "agus@gmail.com",
      "08123456789",
      "Laki-laki",
      "https://via.placeholder.com/100",
      "2000-01-01",
      "1234567890123456",
      "Provinsi A, Kabupaten A, Kecamatan A, Desa A, Jalan A",
      "Referal A",
    ],
    [
      "Budi",
      "budi@gmail.com",
      "08129876543",
      "Laki-laki",
      "https://via.placeholder.com/100",
      "2001-02-02",
      "2345678901234567",
      "Provinsi B, Kabupaten B, Kecamatan B, Desa B, Jalan B",
      "Referal B",
    ],
    // Tambahkan data pelanggan lainnya di sini
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create", "Read", "Update"
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    photo: "",
    dob: "",
    nik: "",
    address: "",
    referral: "",
  });

  const handleRead = (rowIndex) => {
    setDialogMode("Read");
    setCurrentRow(data[rowIndex]);
    setFormData({
      name: data[rowIndex][0],
      email: data[rowIndex][1],
      phone: data[rowIndex][2],
      gender: data[rowIndex][3],
      photo: data[rowIndex][4],
      dob: data[rowIndex][5],
      nik: data[rowIndex][6],
      address: data[rowIndex][7],
      referral: data[rowIndex][8],
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    if (dialogMode === "Create") {
      const newData = [
        ...data,
        [
          formData.name,
          formData.email,
          formData.phone,
          formData.gender,
          formData.photo,
          formData.dob,
          formData.nik,
          formData.address,
          formData.referral,
        ],
      ];
      setData(newData);
    } else if (dialogMode === "Update") {
      const newData = data.map((row, index) =>
        index === data.indexOf(currentRow)
          ? [
              formData.name,
              formData.email,
              formData.phone,
              formData.gender,
              formData.photo,
              formData.dob,
              formData.nik,
              currentRow[8],
              currentRow[9],
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

  const columns = [
    { name: "Nama Pelanggan", label: "Nama Pelanggan" },
    { name: "email", label: "email" },
    { name: "No.Telp", label: "No.Telp" },
    { name: "Jenis Kelamin", label: "Jenis Kelamin" },
    {
      name: "Aksi",
      label: "Aksi",
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
            </>
          );
        },
      },
    },
  ];

  return (
    <>
      <MUIDataTable
        title={<Typography variant="h4">Manajemen Pelanggan</Typography>}
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
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              {dialogMode === "Read" && (
                <Card>
                  <CardContent>
                    <Avatar
                      alt="Profile Picture"
                      src={formData.photo}
                      sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Typography variant="h6">Nama: {formData.name}</Typography>
                    <Typography variant="body1">
                      Email: {formData.email}
                    </Typography>
                    <Typography variant="body1">
                      No Telp: {formData.phone}
                    </Typography>
                    <Typography variant="body1">
                      Jenis Kelamin: {formData.gender}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="Nama"
                      name="name"
                      fullWidth
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={dialogMode === "Read"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="Email"
                      name="email"
                      type="email"
                      fullWidth
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={dialogMode === "Read"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="No Telp"
                      name="phone"
                      fullWidth
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={dialogMode === "Read"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="Jenis Kelamin"
                      name="gender"
                      fullWidth
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={dialogMode === "Read"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="Tanggal Lahir"
                      name="dob"
                      type="date"
                      fullWidth
                      value={formData.dob}
                      onChange={handleInputChange}
                      disabled={dialogMode === "Read"}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="NIK"
                      name="nik"
                      fullWidth
                      value={formData.nik}
                      onChange={handleInputChange}
                      disabled={dialogMode === "Read"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="Alamat"
                      name="address"
                      fullWidth
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={dialogMode === "Read"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      label="Referal"
                      name="referral"
                      fullWidth
                      value={formData.referral}
                      onChange={handleInputChange}
                      disabled={dialogMode === "Read"}
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {dialogMode !== "Read" && (
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          )}
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Pelanggan;
