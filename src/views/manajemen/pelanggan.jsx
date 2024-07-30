import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { IconEye, IconLock, IconCheck, IconTrash } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

const Pelanggan = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    ["1", "Reza", "100000", "Not Verified", "Password123"],
    ["2", "Hasbullah", "200000", "Verified", "Password456"],
    ["3", "Farras", "50000", "Not Verified", "Password789"],
    ["4", "Putri", "300000", "Verified", "Password000"],
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create", "Read", "Update"
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    city: "",
    state: "",
  });

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({ name: "", company: "", city: "", state: "" });
    setDialogOpen(true);
  };

  const handleRead = (rowIndex) => {
    setDialogMode("Read");
    setCurrentRow(data[rowIndex]);
    setFormData({
      name: data[rowIndex][1],
      company: data[rowIndex][2],
      city: data[rowIndex][3],
      state: data[rowIndex][4],
    });
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRow(data[rowIndex]);
    setFormData({
      name: data[rowIndex][1],
      company: data[rowIndex][2],
      city: data[rowIndex][3],
      state: data[rowIndex][4],
    });
    setDialogOpen(true);
  };

  const handleDelete = (rowIndex) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setResetDialogOpen(false);
    setNewPassword("");
  };

  const handleSave = () => {
    if (dialogMode === "Create") {
      const newData = [
        ...data,
        [
          (data.length + 1).toString(),
          formData.name,
          formData.company,
          "Not Verified", // Default status
          data[0][4], // Placeholder for Password
        ],
      ];
      setData(newData);
    } else if (dialogMode === "Update") {
      const newData = data.map((row, index) =>
        index === data.indexOf(currentRow)
          ? [
              currentRow[0],
              formData.name,
              formData.company,
              row[3], // Preserve existing Status
              row[4], // Preserve existing Password
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

  const handleVerify = (rowIndex) => {
    const newData = data.map((row, index) =>
      index === rowIndex
        ? [
            row[0],
            row[1],
            row[2],
            row[3] === "Verified" ? "Not Verified" : "Verified", // Toggle status
            row[4], // Preserve existing Password
          ]
        : row
    );
    setData(newData);
  };

  const handleResetPassword = () => {
    if (selectedRowIndex !== null) {
      const newData = data.map((row, index) =>
        index === selectedRowIndex
          ? [row[0], row[1], row[2], row[3], newPassword] // Update Password
          : row
      );
      setData(newData);
      setNewPassword("");
      setResetDialogOpen(false);
    }
  };

  const columns = [
    { name: "No", label: "No" },
    { name: "Nama", label: "Nama" },
    { name: "Harga", label: "Harga" },
    { name: "Status", label: "Status" },
    { name: "Password", label: "Password" },
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
              <Tooltip title="Read">
                <Button onClick={() => handleRead(tableMeta.rowIndex)}>
                  <IconEye />
                </Button>
              </Tooltip>
              <Tooltip title="Verify">
                <Button
                  onClick={() => handleVerify(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.success.main }}
                >
                  <IconCheck />
                </Button>
              </Tooltip>
              <Tooltip title="Reset Password">
                <Button
                  onClick={() => {
                    setSelectedRowIndex(tableMeta.rowIndex);
                    setResetDialogOpen(true);
                  }}
                  sx={{ color: theme.palette.warning.main }}
                >
                  <IconLock />
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
            </>
          );
        },
      },
    },
  ];

  return (
    <div>
      <MUIDataTable
        title={
          <Typography variant="h3" sx={{ fontWeight: 500 }}>
            Daftar Produk
          </Typography>
        }
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
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Harga"
            name="company"
            fullWidth
            value={formData.company}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Rating"
            name="city"
            fullWidth
            value={formData.city}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Password"
            name="state"
            fullWidth
            value={formData.state}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          {dialogMode !== "Read" && (
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={resetDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Enter the new password for the selected user.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResetPassword} color="primary">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Pelanggan;
