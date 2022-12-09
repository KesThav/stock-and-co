import { Typography, Button, Box, Grid, Divider } from "@mui/material";
import React, { Fragment, useContext, useState } from "react";
import { ContextAPI } from "../utils/ContextAPI";
import ShoppingCard from "../components/shoppingCard";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Shopping = () => {
  const navigate = useNavigate();
  const { basket, userData, convertMoney } = useContext(ContextAPI);
  const [paymentType, setPaymentType] = useState("Card");
  const [loading, setLoading] = useState(false);

  const mapShoppingCard = (basket) => {
    return [
      basket.map((prod, i) => <ShoppingCard product={prod} key={i} />),
      basket.reduce((total, prod) => total + prod.price * prod.quantity, 0),
    ];
  };
  const StyledFormControlLabel = styled((props) => (
    <FormControlLabel {...props} />
  ))(({ theme, checked }) => ({
    ".MuiFormControlLabel-label": checked && {
      color: theme.palette.primary.main,
    },
  }));

  function MyFormControlLabel(props) {
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
      checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const startPayment = (paymentType) => {
    setLoading(true);
    sleep(3000);
    const orderid = uuidv4();
    const products = basket.map((b) => ({
      quantity: b.quantity,
      price: b.price,
      productid: b.productid,
    }));
    const paymentMutation = {
      query: `mutation startOrderInstance($userid: String, $order : OrderInput, $ptype : String,$orderid: String) {
        startOrder(userid:$userid, order: $order, ptype: $ptype, orderid: $orderid){
          message
        }
      }`,
      variables: {
        userid: userData._id,
        orderid: orderid,
        order: { products: products, userid: userData._id, orderid: orderid },
        ptype: paymentType,
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
    setLoading(false);
    localStorage.removeItem("basket");
    navigate("/profile");
    window.location.reload();
  };

  const handleChange = (event) => {
    setPaymentType(event.target.value);
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
                    <strong>{mapShoppingCard(basket)[1]}</strong>
                  </Typography>
                </Box>
                <Divider sx={{ mt: 1, mb: 2 }} />
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography sx={{ mr: 2 }}>Payment method :</Typography>
                  <RadioGroup
                    name="use-radio-group"
                    defaultValue="Card"
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <MyFormControlLabel
                      value="Card"
                      label="With card"
                      control={<Radio />}
                      onChange={handleChange}
                    />
                    <MyFormControlLabel
                      value="Point"
                      label="With points"
                      control={<Radio />}
                      onChange={handleChange}
                    />
                  </RadioGroup>
                </Box>
                <Divider />
                <Button
                  variant="contained"
                  onClick={() => startPayment(paymentType)}
                  sx={{ width: "100%" }}
                  loading={loading}
                >
                  Pay
                </Button>
                ,
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
};

export default Shopping;
