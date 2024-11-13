import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../../service/pelanggan/pelanggan.getSpesifik.service"; // Adjust the import path
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
} from "@mui/material";
import MainCard from "../../ui-component/cards/MainCard"; // Adjust the import path

const DetailPelanggan = () => {
  const { id } = useParams(); // Get the customer ID from the URL
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomerDetails = async () => {
    try {
      const data = await getCustomerById(id); // Use the service to fetch customer details
      setCustomer(data);
    } catch (error) {
      setError("Failed to fetch customer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails(); // Fetch customer details when the component mounts
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  return (
    <MainCard title="Detail Pelanggan">
      <Box>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Nama Pelanggan</TableCell>
                <TableCell>{customer.data.customer_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>{customer.data.customer_email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Telepon</TableCell>
                <TableCell>{customer.data.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jenis Kelamin</TableCell>
                <TableCell>{customer.data.gender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Alamat</TableCell>
                <TableCell>{customer.data.customer_address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tanggal Lahir</TableCell>
                <TableCell>{customer.data.date_of_birth}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tanggal Bergabung</TableCell>
                <TableCell>
                  {new Date(customer.data.created_at).toLocaleDateString(
                    "id-ID"
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)} // Navigate back
            sx={{ mt: 5 }} // Optional: Add some margin
          >
            Kembali
          </Button>
        </TableContainer>
      </Box>
    </MainCard>
  );
};

export default DetailPelanggan;
