import React, { useEffect, useState } from "react";
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
import { getMonthly } from "../../service/dashboard/monthly.get.service"; // Sesuaikan dengan path yang benar

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
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Omset",
        data: [],
        backgroundColor: "#52b1ff",
        borderColor: "#52b1ff",
        borderWidth: 1,
      },
    ],
  });

  // Fetch data from API
  const fetchMonthlyData = async () => {
    try {
      const result = await getMonthly(); // Mengambil data dari API
      if (result.code === 200) {
        const monthlyData = result.data;
        const labels = Object.keys(monthlyData); // Mendapatkan nama bulan
        const data = Object.values(monthlyData); // Mendapatkan nilai pertumbuhan

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Total Omset",
              data: data,
              backgroundColor: "#52b1ff",
              borderColor: "#52b1ff",
              borderWidth: 1,
              borderRadius: 8,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyData(); // Panggil fungsi fetchMonthlyData saat komponen dimuat
  }, []);

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
    <Card
      sx={{
        borderRadius: 3,
        backgroundColor: "#fff",
        height: "calc(100% + 2px)",
      }}
    >
      <CardContent>
        {isLoading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : (
          <Box>
            <Typography variant="h6">Arus Pemasukan</Typography>
            <Bar data={chartData} options={options} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalGrowthBarChart;
