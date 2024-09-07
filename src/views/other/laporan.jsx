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
import { IconEye, IconCalculator } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

const Laporan = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    ["1", "Reza", "100000", "5", "1"],
    ["2", "Hasbullah", "200000", "4", "2"],
    ["3", "Farras", "50000", "3", "3"],
    ["4", "Putri", "300000", "2", "4"],
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

  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);

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
    setIncomeDialogOpen(false);
  };

  const handleSave = () => {
    if (dialogMode === "Create") {
      const newData = [
        ...data,
        [
          (data.length + 1).toString(),
          formData.name,
          formData.company,
          formData.city,
          formData.state,
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
              formData.city,
              formData.state,
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

  const calculateTotalIncome = () => {
    return data.reduce((total, row) => total + parseFloat(row[2] || 0), 0);
  };

  const handleCalculateIncome = () => {
    setTotalIncome(calculateTotalIncome());
    setIncomeDialogOpen(true);
  };

  const columns = [
    { name: "No", label: "No" },
    { name: "Nama", label: "Nama" },
    { name: "Harga", label: "Harga" },
    { name: "Rating", label: "Rating" },
    { name: "Terjual", label: "Terjual" },
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
              <Tooltip title="Calculate Income">
                <Button onClick={handleCalculateIncome}>
                  <IconCalculator />
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
            Laporan
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
            name="Harga"
            fullWidth
            value={formData.company}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Rating"
            name="Rating"
            fullWidth
            value={formData.city}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Terjual"
            name="Terjual"
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

      <Dialog open={incomeDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Total Pendapatan</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            Total Pendapatan:{" "}
            {totalIncome.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Laporan;
