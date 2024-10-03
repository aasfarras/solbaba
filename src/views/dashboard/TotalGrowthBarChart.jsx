import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TotalGrowthBarChart = ({ isLoading }) => {
  // Data untuk bar chart
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Pertumbuhan",
        data: [65, 59, 80, 81, 56, 55, 40], // Data pertumbuhan
        backgroundColor: "#52b1ff",
        borderColor: "#52b1ff",
        borderWidth: 1,
      },
    ],
  };

  // Opsi konfigurasi chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Arus Pemasukan",
      },
    },
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        {isLoading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Arus Pemasukan
            </Typography>
            <Bar data={data} options={options} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalGrowthBarChart;
