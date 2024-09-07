// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// // material-ui
// import ButtonBase from "@mui/material/ButtonBase";

// // project imports
// import config from "../../../config";
// // import Logo from "../../../ui-component/Logo";
import Logo2 from "../../../assets/images/logoreal.png";
// import { MENU_OPEN } from "../../../store/actions";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  // const defaultId = useSelector((state) => state.customization.defaultId);
  // const dispatch = useDispatch();
  return (
    // <ButtonBase
    //   disableRipple
    //   onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
    //   // component={Link}
    //   to={config.defaultPath}
    // >
    //   <img src={Logo2} alt="Logo" style={{ width: "120px", height: "64px" }} />
    // </ButtonBase>
    <img src={Logo2} alt="Logo" style={{ width: "120px" }} />
  );
};

export default LogoSection;
