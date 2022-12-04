import React from "react";
import { Card, Typography, Box } from "@mui/material";
import IncrementButton from "./incrementButton";

const shoppingCard = ({ product }) => {
  return (
    <Card
      sx={{
        boxShadow: "none",
        border: "1px solid black",
        borderRadius: 0,
        mt: 1,
        mb: 1,
      }}
    >
      <Box>
        <Typography>{product.name}</Typography>
        <Typography>{product.description}</Typography>
        <Typography>
          {product.quantity +
            " x CHF " +
            product.price +
            " = " +
            product.price * product.quantity}
        </Typography>
      </Box>
    </Card>
  );
};

export default shoppingCard;
