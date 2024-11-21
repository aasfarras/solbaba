import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import SkeletonTotalOrderCard from "../../ui-component/cards/Skeleton/EarningCard";
import EarningIcon from "../../assets/images/icons/earning.svg";

// Import service
import { getPeriod } from "../../service/dashboard-admin/period.get.service"; // Sesuaikan dengan path yang benar

// assets
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Visibility from "@mui/icons-material/Visibility"; // Tambahkan ini
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Tambahkan ini

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();

  const [timeValue, setTimeValue] = React.useState("daily"); // Default ke bulanan
  const [incomeData, setIncomeData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    annual: 0,
  });
  const [loading, setLoading] = useState(true); // State untuk loading

  const handleChangeTime = (value) => {
    setTimeValue(value);
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      const result = await getPeriod(); // Menggunakan getPeriod dari service
      if (result.code === 200) {
        setIncomeData(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading ke false setelah fetch selesai
    }
  };

  useEffect(() => {
    fetchData(); // Panggil fungsi fetchData saat komponen dimuat
  }, []);

  return (
    <>
      {loading || isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: "orange.main",
            color: "#fff",
            overflow: "hidden",
            position: "relative",
            "&>div": {
              position: "relative",
              zIndex: 5,
            },
            "&:after": {
              content: '""',
              position: "absolute",
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: "50%",
              top: { xs: -105, sm: -85 },
              right: { xs: -140, sm: -95 },
            },
            "&:before": {
              content: '""',
              position: "absolute",
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: "50%",
              top: { xs: -155, sm: -125 },
              right: { xs: -70, sm: -15 },
              opacity: 0.5,
            },
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        bgcolor: "secondary.800",
                        color: "#fff",
                        mt: 1,
                      }}
                    >
                      <img src={EarningIcon} alt="Notification" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Button
                      disableElevation
                      variant={timeValue === "daily" ? "contained" : "text"}
                      size="small"
                      sx={{ color: "inherit" }}
                      onClick={() => handleChangeTime("daily")}
                    >
                      Harian
                    </Button>
                    <Button
                      disableElevation
                      variant={timeValue === "weekly" ? "contained" : "text"}
                      size="small"
                      sx={{ color: "inherit" }}
                      onClick={() => handleChangeTime("weekly")}
                    >
                      Mingguan
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography
                          sx={{
                            fontSize: "2.125rem",
                            fontWeight: 500,
                            mr: 1,
                            mt: 1.75,
                            mb: 1.1,
                          }}
                        >
                          {timeValue === "daily"
                            ? `Rp ${new Intl.NumberFormat("id-ID").format(incomeData.daily)}`
                            : `Rp ${new Intl.NumberFormat("id-ID").format(incomeData.weekly)}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: "primary.200",
                          }}
                        >
                          Jumlah Penghasilan
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default EarningCard;
