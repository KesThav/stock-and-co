import React, { Fragment, useState } from "react";
import {
  Card,
  CardContent,
  Collapse,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ContextAPI } from "../utils/ContextAPI";

const Orderlist = ({ order }) => {
  const { convertMoney } = useContext(ContextAPI);
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
              <Typography>Commande {order.orderid}</Typography>
              <Typography>CHF {convertMoney(order.total)}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Chip
                label={order.status}
                sx={{
                  bgcolor: order.status === "Paid" ? "#B8E8FC" : "#C8FFD4",
                }}
              />
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
            <Divider />
            {order.products.map((prod) => (
              <>
                <Card
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
