import React, { Fragment } from "react";
import { Typography } from "@mui/material";

const Benchmark = () => {
  const startBenchmark = async () => {
    
  };
  return (
    <Fragment>
      <Typography variant="h6">Benchmark</Typography>
      <Typography>This page is used to benchmark the web app.</Typography>
      <button onClick={startBenchmark}>Start Benchmark</button>
    </Fragment>
  );
};

export default Benchmark;
