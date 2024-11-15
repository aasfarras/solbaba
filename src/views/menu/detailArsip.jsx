import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArsipSalesmanById } from "../../service/sales-route/arsip.detail.service"; // Import the new service
import { updateDonePesanan } from "../../service/admin/pesanan.doneUpdate.service"; // Ganti dengan path yang sesuai
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
} from "@mui/material";
import MainCard from "../../ui-component/cards/MainCard";
import { Image, message } from "antd";

const DetailArsip = () => {
  const { id } = useParams(); // Get the transaction ID from the URL
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactionDetails = async () => {
    try {
      const data = await getArsipSalesmanById(id); // Use the service to fetch transaction details
      setTransaction(data);
    } catch (error) {
      setError("Failed to fetch transaction details");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    try {
      await updateDonePesanan(id); // Panggil fungsi untuk mengupdate status pesanan
      message.success("Pesanan Berhasil Diperbarui");
      // Anda bisa menambahkan logika lain di sini, seperti navigasi atau refresh data
      navigate(-1);
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Gagal memperbarui pesanan."); // Tampilkan pesan error
    }
  };

  useEffect(() => {
    fetchTransactionDetails(); // Fetch transaction details
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  return (
    <MainCard title="Detail Pesanan">
      <Box>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Kode Pesanan</TableCell>
                <TableCell>{transaction.data.transaction_code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nama Pelanggan</TableCell>
                <TableCell>{transaction.data.customer_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Alamat Pelanggan</TableCell>
                <TableCell>{transaction.data.customer_address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Metode Pengambilan</TableCell>
                <TableCell>{transaction.data.pickup_method}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>
                  {statusTranslations[transaction.data.status] ||
                    transaction.data.status}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Harga</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(transaction.data.total_price)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Catatan</TableCell>
                <TableCell>{transaction.data.note}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Kode Rujukan</TableCell>
                <TableCell>{transaction.data.referral_code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tanggal Pesanan</TableCell>
                <TableCell>
                  {new Date(transaction.data.created_at).toLocaleString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Daftar Item</TableCell>
                <TableCell>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nama Produk</TableCell>
                        <TableCell>Kategori Produk</TableCell>
                        <TableCell>Sub Kategori Produk</TableCell>
                        <TableCell>Jumlah</TableCell>
                        <TableCell>Harga</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transaction.data.order_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.product_category}</TableCell>
                          <TableCell>
                            {item.product_subcategory || "-"}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(item.price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid
          container
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ mt: 2 }}
        >
          <Grid item>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Kembali
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSave}>
              Simpan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default DetailArsip;
