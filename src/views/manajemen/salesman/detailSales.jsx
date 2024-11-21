import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSalesmanById } from "../../../service/salesman/salesman.getSpesifik.service"; // Import the new service
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
} from "@mui/material";
import MainCard from "../../../ui-component/cards/MainCard";
import { Image } from "antd";

const DetailSales = () => {
  const { id } = useParams(); // Get the salesman ID from the URL
  const navigate = useNavigate();
  const [salesman, setSalesman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesmanDetails = async () => {
    setLoading(true);
    try {
      const data = await getSalesmanById(id); // Use the service to fetch salesman details
      setSalesman(data);
    } catch (error) {
      setError("Failed to fetch salesman details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesmanDetails(); // Fetch salesman details when the component mounts
  }, [id]);

  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

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
        <MainCard title="Detail Salesman">
          <Box>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell>{salesman.data.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>{salesman.data.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{salesman.data.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Telepon</TableCell>
                    <TableCell>{salesman.data.phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jenis Kelamin</TableCell>
                    <TableCell>{salesman.data.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Alamat</TableCell>
                    <TableCell>{salesman.data.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Kode Referral</TableCell>
                    <TableCell>{salesman.data.referral_code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status Akun</TableCell>
                    <TableCell>{salesman.data.account_status}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(-1)} // Navigate back
                sx={{ mt: 2 }} // Optional: Add some margin
              >
                Kembali
              </Button>
            </TableContainer>
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default DetailSales;
