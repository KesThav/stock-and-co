import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

export const LoadingComponent = ({ loading }) => {
  return (
    <Backdrop
      sx={{
        color: "#ffffff",
        bgcolor: "#fffffff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      invisible={true}
      open={loading}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};
