import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Paper,
  Pagination,
} from "@mui/material";
import { ContextAPI } from "../utils/ContextAPI";

const Logs = () => {
  const [page, setPage] = useState(1);
  const [lowbound, setLowbound] = useState(0);
  const [upbound, setUpbound] = useState(10);

  const { logs, getLogs } = useContext(ContextAPI);

  useEffect(() => {
    getLogs();
  }, []);

  //compute the number of pages based on the length of the data.
  //want to show 10 users per page
  const pageNumber = () => {
    return logs &&
      logs.length !== 0 &&
      logs.length / 10 > Math.round(logs.length / 10)
      ? Math.round(logs.length / 10 + 1)
      : Math.round(logs.length / 10);
  };

  //function to change page and update shown data
  const handlePageChange = (event, value) => {
    setPage(value);
    setLowbound(value * 10 - 10);
    setUpbound(value * 10);
  };

  const formatStep = (step) => {
    switch (step) {
      case "Step 1":
        return (
          <span
            style={{ background: "#b3e5fc", color: "#0288d1", padding: "3px" }}
          >
            <strong>Step 1</strong>
          </span>
        );
      case "Step 2":
        return (
          <span
            style={{ background: "#c8e6c9", color: "#388e3c", padding: "3px" }}
          >
            <strong>Step 2</strong>
          </span>
        );
      case "Step 3":
        return (
          <span
            style={{ background: "#fff9c4", color: "#fbc02d", padding: "3px" }}
          >
            <strong>Step 3</strong>
          </span>
        );
      case "Step 4":
        return (
          <span
            style={{ background: "#d7ccc8", color: "#5d4037", padding: "3px" }}
          >
            <strong>Step 4</strong>
          </span>
        );
      case "Step 5":
        return (
          <span
            style={{ background: "#ffcdd2", color: "#d32f2f", padding: "3px" }}
          >
            <strong>Step 5</strong>
          </span>
        );
      default:
        return;
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Typography variant="h5">
          <strong>Logs</strong>
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Step</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.slice(lowbound, upbound).map((log) =>
              log.event_step?.includes("Step") ? (
                <TableRow key={log.message}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.event_order}</TableCell>
                  <TableCell>{formatStep(log.event_step)}</TableCell>
                  <TableCell>{log.event_message}</TableCell>
                </TableRow>
              ) : null
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "row-reverse",
        }}
        count={logs && pageNumber()}
        page={page}
        onChange={handlePageChange}
      />
    </div>
  );
};
export default Logs;
