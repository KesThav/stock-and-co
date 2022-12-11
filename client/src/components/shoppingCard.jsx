import React, { useContext } from "react";
import { Card, Typography, Box, Button, CardMedia } from "@mui/material";
import IncrementButton from "./incrementButton";
import { ContextAPI } from "../utils/ContextAPI";
import { useNavigate } from "react-router-dom";

const ShoppingCard = ({ product }) => {
  const { convertMoney } = useContext(ContextAPI);
  const navigate = useNavigate();

  const removeFromBasket = (productid) => {
    let basket = JSON.parse(localStorage.getItem("basket"));
    basket = basket.filter((p) => p.productid !== productid);
    localStorage.setItem("basket", JSON.stringify(basket));
    window.location.reload();
  };

  return (
    <Card
      sx={{
        boxShadow: "none",
        borderTop: "1px solid #dfdddd",
        borderRadius: 0,
        mt: 1,
        mb: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", pl: 2 }}>
        <Box sx={{ height: "200px", width: "200px", mr: 4 }}>
          <CardMedia
            sx={{ objectFit: "contain", width: "100%", height: "100%" }}
            component="img"
            alt="some product"
            height="300"
            image={product.images}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            pt: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#0C6A57", cursor: "pointer" }}
            onClick={() => navigate(`/product/${product.productid}`)}
          >
            <strong>{product.name}</strong>
          </Typography>
          <Typography variant="caption">{product.description}</Typography>
          <Typography variant="body">
            Price: CHF {convertMoney(product.price)}
          </Typography>
          <Typography variant="body">Quantity : {product.quantity}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography
          variant="body2"
          sx={{ mr: 1, cursor: "pointer" }}
          onClick={() => removeFromBasket(product.productid)}
        >
          X
        </Typography>
      </Box>
    </Card>
  );
};

export default ShoppingCard;
