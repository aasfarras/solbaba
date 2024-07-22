import PropTypes from "prop-types";

// material-ui
import Box from "@mui/material/Box";

// project import
import { Card } from "@mui/material";

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({ children, ...other }) => (
  <Card sx={{ width: { xs: 2, md: 473 } }}>
    <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>{children}</Box>
  </Card>
);

AuthCardWrapper.propTypes = {
  children: PropTypes.node,
};

export default AuthCardWrapper;
