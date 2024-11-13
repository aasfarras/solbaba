import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { IconClipboardList, IconEye } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getCustomer } from "../../service/pelanggan/pelanggan.get.service"; // Adjust the import path
import { useNavigate } from "react-router-dom";
import { getCustomerById } from "../../service/pelanggan/pelanggan.getSpesifik.service"; // Adjust the import path

const Customer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const statusTranslations = {
    active: "Aktif",
    inactive: "Tidak Aktif",
  };

  const statuses = ["active", "inactive"];

  const fetchData = async () => {
    try {
      const result = await getCustomer();
      const formattedData = result.data.data.map((item) => [
        item.customer_name,
        item.customer_email,
        item.phone,
        item.gender,
        item.customer_address,
        item.created_at,
        item.id,
      ]);
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch customer data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDetail = async (rowIndex) => {
    const rowData = data[rowIndex];
    const customerId = rowData[6];

    try {
      await getCustomerById(customerId);
      navigate(
        `/super-admin/manajemen/pelanggan/detailpelanggan/${customerId}`
      );
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Terjadi kesalahan saat mengambil detail pelanggan.");
      }
      setErrorDialogOpen(true);
    }
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const columns = [
    { name: "customer_name", label: "Nama Pelanggan" },
    { name: "customer_email", label: "Email Pelanggan" },
    { name: "phone", label: "Telepon" },
    { name: "gender", label: "Jenis Kelamin" },

    {
      name: "Actions",
      label: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <>
              <Tooltip title="Detail">
                <Button
                  onClick={() => handleDetail(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.info.main }}
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
        title={<Typography variant="h3">Pelanggan</Typography>}
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
    </>
  );
};

export default Customer;
