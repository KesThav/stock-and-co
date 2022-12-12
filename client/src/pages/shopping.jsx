import { Typography, Button, Box, Grid, Divider } from "@mui/material";
import React, { Fragment, useContext, useState } from "react";
import { ContextAPI } from "../utils/ContextAPI";
import ShoppingCard from "../components/shoppingCard";
import Confirmpayment from "../components/confirmpayment";

const Shopping = () => {
  const { basket, userData, convertMoney } = useContext(ContextAPI);

  const mapShoppingCard = (basket) => {
    return [
      basket.map((prod, i) => <ShoppingCard product={prod} key={i} />),
      basket.reduce((total, prod) => total + prod.price * prod.quantity, 0),
    ];
  };

  return (
    <Fragment>
      <Typography variant="h6">
        <strong>Shopping card</strong>
      </Typography>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sm={12} md={8} sx={{ pr: 2, pl: 2 }}>
          {basket && basket.length > 0
            ? mapShoppingCard(basket)[0]
            : "Shopping card is empty."}
        </Grid>
        {basket && basket.length > 0 && (
          <Grid item xs={12} sm={12} md={4} elevation={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                maxHeight: "400px",
                bgcolor: "#FAFAFB",
              }}
            >
              <Typography variant="h6" sx={{ mb: 3 }}>
                <strong>Order summary</strong>
              </Typography>
              <Box sx={{ width: "100%", pl: 1, pr: 2 }}>
                {basket &&
                  basket.length > 0 &&
                  basket.map((basket) => (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>{`${basket.name} (x${basket.quantity})`}</Typography>
                      <Typography>
                        {`CHF ${convertMoney(basket.quantity * basket.price)}`}
                      </Typography>
                    </Box>
                  ))}
                <Divider sx={{ mt: 2 }} />
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    <strong>Total</strong>
                  </Typography>
                  <Typography>
                    <strong>{`CHF ${convertMoney(mapShoppingCard(basket)[1])}`}</strong>
                  </Typography>
                </Box>
                <Divider sx={{ mt: 1, mb: 2 }} />

                {userData && (
                  <Confirmpayment total={mapShoppingCard(basket)[1]} />
                )}
                {!userData && (
                  <Button variant="contained" fullWidth disabled={true}>
                    Please login to continue
                  </Button>
                )}
                <br />
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
};

export default Shopping;
