import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPesananSalesById } from "../../service/sales-route/pesanansales.getSpesifik.service"; // Ganti dengan path yang sesuai
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
import { message } from "antd";

const DetailPesanan = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactionDetails = async () => {
    try {
      const data = await getPesananSalesById(id); // Mengambil detail pesanan berdasarkan ID
      setTransaction(data.data); // Mengatur data transaksi
    } catch (error) {
      setError("Gagal mengambil detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionDetails(); // Memanggil fungsi untuk mengambil detail pesanan
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  return (
    <Box sx={{ pb: 8 }}>
      <MainCard title="Detail Pesanan">
        <Box>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Kode Pesanan</TableCell>
                  <TableCell>{transaction.transaction_code}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nama Pelanggan</TableCell>
                  <TableCell>{transaction.customer_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Alamat Pelanggan</TableCell>
                  <TableCell>{transaction.customer_address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Metode Pengambilan</TableCell>
                  <TableCell>{transaction.pickup_method}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Harga</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(transaction.total_price)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Catatan</TableCell>
                  <TableCell>{transaction.note}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Kode Rujukan</TableCell>
                  <TableCell>{transaction.referral_code}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tanggal Pesanan</TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
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
                        {transaction.order_items.map((item) => (
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
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(-1)}
            >
              Kembali
            </Button>
          </Grid>
        </Box>
      </MainCard>
    </Box>
  );
};

export default DetailPesanan;