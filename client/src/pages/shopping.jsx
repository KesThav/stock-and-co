import { Typography, Button, Box } from "@mui/material";
import React, { Fragment, useContext } from "react";
import { ContextAPI } from "../utils/ContextAPI";
import ShoppingCard from "../components/shoppingCard";
import axios from "axios";

const Shopping = () => {
  const { basket, userData } = useContext(ContextAPI);

  const mapShoppingCard = (basket) => {
    return [
      basket.map((prod) => <ShoppingCard product={prod} />),
      basket.reduce((total, prod) => total + prod.price * prod.quantity, 0),
      <Button variant="contained" onClick={() => startPayment()}>
        Pay
      </Button>,
    ];
  };

  const startPayment = () => {
    const products = basket.map((b) => ({
      quantity: b.quantity,
      price: b.price,
      productid: b.productid,
    }));
    const paymentMutation = {
      query: `mutation startOrderInstance($userid: String, $order : OrderInput, $ptype : String) {
        startOrder(userid:$userid, order: $order, ptype: $ptype){
          message
        }
      }`,
      variables: {
        userid: userData._id,
        order: { products: products, userid: userData._id },
        ptype: "Card",
      },
    };

    const headers = {
      "content-type": "application/json",
    };

    axios({
      url: process.env.REACT_APP_base_url,
      method: "post",
      headers: headers,
      data: paymentMutation,
    })
      .then((response) => {
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        } else {
          return response;
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <Typography>Shopping card</Typography>
      {basket && basket.length > 0
        ? mapShoppingCard(basket)[0]
        : "Shopping card is empty."}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>{mapShoppingCard(basket)[1]}</Typography>
        <Typography>{mapShoppingCard(basket)[2]}</Typography>
      </Box>
    </Fragment>
  );
};

export default Shopping;
