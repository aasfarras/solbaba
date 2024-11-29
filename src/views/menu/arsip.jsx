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
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import moment from "moment";
import "moment/locale/id";
import { IconClipboardList, IconEye } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getArsipSalesman } from "../../service/sales-route/arsip.get.service"; // Ganti dengan path yang sesuai
import { useNavigate } from "react-router-dom";
import { updatePesanan } from "../../service/admin/pesanan.update.service"; // Ganti dengan path yang sesuai
import { getArsipSalesmanById } from "../../service/sales-route/arsip.detail.service";
import { Card } from "antd";

const ArsipAdmin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPesananId, setCurrentPesananId] = useState(null); // Definisikan state ini
  const [errorMessage, setErrorMessage] = useState(""); // State untuk menyimpan pesan kesalahan
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // State untuk mengontrol modal kesalahan
  const [loading, setLoading] = useState(false); // Add this line

  const statusTranslations = {
    received: "Diterima",
    pending_payment: "Menunggu Pembayaran",
    payment_verified: "Pembayaran Terverifikasi",
    processing: "Sedang Diproses",
    shipped: "Dikirim",
    completed: "Selesai",
    canceled: "Dibatalkan",
    returned: "Dikembalikan",
  };

  const statuses = [
    "received",
    "pending_payment",
    "payment_verified",
    "processing",
    "shipped",
    "completed",
    "canceled",
    "returned",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getArsipSalesman();
      setData(result.data.data);
      // const formattedData = result.data.data.map((item) => [
      //   item.transaction_code,
      //   item.customer_name,
      //   item.customer_address,
      //   item.total_price,
      //   item.status,
      //   item.created_at,
      //   item.id,
      // ]);
      // setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch transaction data", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDetail = async (rowIndex) => {
    // const rowData = data[rowIndex];
    // const PesananId = rowData[6];

    try {
      // Panggil fungsi untuk mendapatkan detail pesanan berdasarkan ID
      await getArsipSalesmanById(PesananId); // Ganti dengan fungsi yang sesuai untuk mendapatkan detail
      navigate(`/sales/menu/arsip/detailarsip/${PesananId}`);
    } catch (error) {
      // Tangkap kesalahan dan simpan pesan kesalahan
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); // Ambil pesan dari respons kesalahan
      } else {
        setErrorMessage("Terjadi kesalahan saat mengambil detail pesanan.");
      }
      setErrorDialogOpen(true); // Buka modal kesalahan
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleOpenStatusDialog = (rowIndex) => {
    const rowData = data[rowIndex];
    setCurrentPesananId(rowData[6]);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSubmitStatus = async () => {
    try {
      await updatePesanan(currentPesananId, { status: selectedStatus });
      // Refresh data setelah update
      fetchData();
      handleCloseStatusDialog();
    } catch (error) {
      console.error("Failed to update transaction status", error);
    }
  };

  const columns = [
    { name: "transaction_code", label: "Kode Pesanan" },
    { name: "customer_name", label: "Nama Pelanggan" },
    { name: "customer_address", label: "Alamat Pelanggan" },
    {
      name: "total_price",
      label: "Total Harga",
      options: {
        customBodyRender: (value) => formatPrice(value),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          return statusTranslations[value] || value; // Menggunakan pemetaan untuk menampilkan status dalam bahasa Indonesia
        },
      },
    },
    {
      name: "created_at",
      label: "Tanggal Pesanan",
      options: {
        customBodyRender: (value) => {
          const date = new Date(value); // Mengubah string menjadi objek Date
          return new Intl.DateTimeFormat("id-ID", {
            year: "numeric",
            month: "long", // Menggunakan 'long' untuk nama bulan
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(date);
        },
      },
    },
    {
      name: "Actions",
      label: " Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowData = data[tableMeta.rowIndex];
          const status = rowData[4]; // Ambil status dari data

          return (
            <>
              <Tooltip title="Detail">
                <span>
                  <Button
                    onClick={() => handleDetail(tableMeta.rowIndex)}
                    sx={{ color: theme.palette.info.main }}
                  >
                    <IconEye />
                  </Button>
                </span>
              </Tooltip>
            </>
          );
        },
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
        <Box sx={{ pb: 8 }}>
          {/* <MUIDataTable
            title={<Typography variant="h3">Pesanan</Typography>}
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
                rowStyle: (data, index) => ({
                  padding: theme.breakpoints.down("sm") ? "16px 0" : "0", // Add padding for mobile view
                  marginBottom: theme.breakpoints.down("sm") ? "16px" : "0", // Add margin for mobile view
                }),
              },
            }}
          /> */}
          {data.map((dat, index) => {
            return (
              <>
                <Card
                  key={index}
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  bodyStyle={{
                    paddingBottom: 0, // Atur padding bottom menjadi 0 // Atur padding atas, kanan, dan kiri
                    paddingRight: 0, // Atur padding bottom menjadi 0 // Atur padding atas, kanan, dan kiri
                    overflow: "hidden",
                  }}
                >
                  <TableContainer>
                    <Table
                      sx={{
                        border: "none",
                        "& .MuiTableCell-root": {
                          border: "none",
                          padding: "8px 16px",
                        },
                      }}
                    >
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap", // Agar teks tidak terpotong
                              fontSize: "14px",
                            }}
                          >
                            Tanggal
                          </TableCell>
                          <TableCell
                            sx={{
                              wordBreak: "break-word", // Tentukan lebar minimum agar cell lebih konsisten
                              textAlign: "left", // Ratakan teks ke kiri
                              fontSize: "14px",
                            }}
                          >
                            {moment(dat.created_at)
                              .locale("id")
                              .format("DD MMM YYYY HH:mm")}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: "14px",
                            }}
                          >
                            Kode Pesanan
                          </TableCell>
                          <TableCell
                            sx={{
                              wordBreak: "break-word",
                              fontSize: "14px",
                            }}
                          >
                            {dat.transaction_code}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: "14px",
                            }}
                          >
                            Nama Pelanggan
                          </TableCell>
                          <TableCell
                            sx={{
                              wordBreak: "break-word",
                              fontSize: "14px",
                            }}
                          >
                            {dat.customer_name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: "14px",
                            }}
                          >
                            Status
                          </TableCell>
                          <TableCell sx={{ fontSize: "14px" }}>
                            {statusTranslations[dat.status] || dat.status}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ padding: 0 }}></TableCell>
                          <TableCell
                            sx={{
                              position: "relative",
                              textAlign: "right",
                              fontSize: "14px",
                            }}
                          >
                            <Button
                              variant="text"
                              onClick={() => handleDetail(dat.id)}
                            >
                              Lihat Selengkapnya
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
                <Box sx={{ height: 5 }}></Box>
              </>
            );
          })}
          <Dialog
            fullWidth
            open={statusDialogOpen}
            onClose={handleCloseStatusDialog}
          >
            <DialogTitle>Pilih Status Pesanan</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {statusTranslations[status]}{" "}
                      {/* Menggunakan pemetaan untuk menampilkan status dalam bahasa Indonesia */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseStatusDialog} color="primary">
                Batal
              </Button>
              <Button
                onClick={handleSubmitStatus}
                color="primary"
                disabled={!selectedStatus}
              >
                Kirim
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            fullWidth
            open={errorDialogOpen}
            onClose={() => setErrorDialogOpen(false)}
          >
            <DialogTitle>Kesalahan</DialogTitle>
            <DialogContent>
              <Typography>{errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                Tutup
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default ArsipAdmin;
