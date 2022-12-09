import React, { Fragment, useState } from "react";
import {
  Card,
  CardContent,
  Collapse,
  Typography,
  Box,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ContextAPI } from "../utils/ContextAPI";
import MyStepper from "./Stepper";
import { useEffect } from "react";
import moment from "moment";
import axios from "axios";

const Orderlist = ({ order, type, taskid }) => {
  const { convertMoney, logs, getLogs } = useContext(ContextAPI);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  useEffect(() => {
    getLogs();
  }, []);

  const confirmShipment = async (taskid) => {
    const confirmShipmentMutation = {
      query: `mutation confirmShipment($taskid: String) {
        completeTask(taskid: $taskid) {
          message
        }
      }`,
      variables: {
        taskid,
      },
    };

    const headers = {
      "content-type": "application/json",
    };

    axios({
      url: process.env.REACT_APP_base_url,
      method: "post",
      headers: headers,
      data: confirmShipmentMutation,
    })
      .then((response) => {
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        } else {
          return response;
        }
      })
      .catch((err) => console.log(err));
    window.location.reload();
  };

  return (
    <Fragment>
      <Card
        sx={{
          margin: "10px 0 10px 0",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          boxShadow: "none",
          border: "1px solid #78909c",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
              <Typography>
                Commande {order.orderid} /{" "}
                {moment(+order.createdAt).format("DD-MM-YYYY HH:MM")}
              </Typography>
              <Typography>CHF {convertMoney(order.total)}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {type === "profile" && (
                <Chip
                  label={order.status}
                  sx={{
                    bgcolor: order.status === "Paid" ? "#B8E8FC" : "#C8FFD4",
                  }}
                />
              )}
              {type === "pending" && (
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ mr: 2 }}
                  onClick={() => confirmShipment(taskid)}
                >
                  Confirm the shipment
                </Button>
              )}
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </Box>
          </CardContent>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {type === "profile" && <MyStepper order={order} logs={logs} />}
            <Divider />
            {order.products.map((prod, idx) => (
              <>
                <Card
                  key={idx}
                  sx={{
                    mt: 2,
                    mb: 2,
                    boxShadow: "none",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      onClick={() => navigate(`/product/${prod.productid}`)}
                      sx={{
                        cursor: "pointer",
                        color: "#1F6A57",
                      }}
                    >
                      {prod.productDetails.name}
                    </Typography>
                    <Typography variant="caption">
                      {prod.productDetails.description} /{" "}
                      {prod.productDetails.type}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption">
                      CHF {convertMoney(prod.price)}
                    </Typography>
                  </Box>
                </Card>
                <Divider />
              </>
            ))}
          </Collapse>
        </Box>
      </Card>
    </Fragment>
  );
};

export default Orderlist;
