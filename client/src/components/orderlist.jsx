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
  CardMedia,
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
import ShoppingCard from "./shoppingCard";

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
          border: "1px solid #0C6A57",
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
                <span style={{ color: "#0C6A57" }}>
                  <strong>Order</strong>
                </span>{" "}
                {order.orderid} /{" "}
                {moment(+order.createdAt).format("DD-MM-YYYY HH:MM")}
              </Typography>
              {type === "pending" && (
                <Typography>
                  <span style={{ color: "#0C6A57" }}>
                    <strong>User</strong>
                  </span>{" "}
                  {order.userDetails.name}
                </Typography>
              )}
              <Typography>CHF {convertMoney(order.total)}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {type === "profile" && (
                <Chip
                  label={order.status}
                  sx={{
                    bgcolor: order.status === "Paid" ? "#78c0df" : "#C8FFD4",
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
                  sx={{
                    boxShadow: "none",
                    borderRadius: 0,
                    mt: 1,
                    mb: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ height: "100px", width: "100px", mr: 4 }}>
                    <CardMedia
                      sx={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                      component="img"
                      alt="some product"
                      height="100"
                      image={prod.productDetails.images[0].url}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#0C6A57",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/product/${prod.productid}`)}
                    >
                      {prod.productDetails.name}
                    </Typography>
                    <Typography variant="caption">
                      {prod.productDetails.description}
                    </Typography>
                    <Typography variant="caption">
                      Price: CHF {convertMoney(prod.price)}
                    </Typography>
                    <Typography variant="caption">
                      Quantity : {prod.quantity}
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
