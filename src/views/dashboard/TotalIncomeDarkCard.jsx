import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import TotalIncomeCard from "../../ui-component/cards/Skeleton/TotalIncomeCard";
import PercentIcon from "@mui/icons-material/Percent";

// assets
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

// Import service
import { getSummary } from "../../service/dashboard/summary.get.service"; // Sesuaikan dengan path yang benar

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.light,
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: "50%",
    top: -30,
    right: -180,
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: "50%",
    top: -160,
    right: -130,
  },
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const TotalIncomeDarkCard = ({ isLoading }) => {
  const theme = useTheme();
  const [averageTransactionAmount, setAverageTransactionAmount] = useState(0); // State untuk average_transaction_amount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSummary(); // Mengambil data dari API
        if (result.code === 200) {
          setAverageTransactionAmount(result.data.average_transaction_amount); // Menyimpan average_transaction_amount
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    fetchData(); // Panggil fungsi fetchData saat komponen dimuat
  }, []);

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: "primary.800",
                      color: "#fff",
                    }}
                  >
                    <PercentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, my: 0.45 }}
                  primary={
                    <Typography variant="h4" sx={{ color: "#fff" }}>
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        averageTransactionAmount
                      )}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "primary.light", mt: 0.25 }}
                    >
                      Rata-rata Transaksi
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalIncomeDarkCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalIncomeDarkCard;
