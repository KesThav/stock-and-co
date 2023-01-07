import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ContextAPI } from "../utils/ContextAPI";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useEffect } from "react";
import Debitcard from "./debitcard";
import Grid from "@mui/material/Grid";

const Confirmpayment = ({ total, discount }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { userData, basket } = useContext(ContextAPI);
  const [paymentType, setPaymentType] = useState("Card");
  const [creditCard, setCreditCard] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const updateCard = (event) => {
    setCreditCard({ ...creditCard, [event.target.name]: event.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    setPaymentType("Card");
  };

  const handleClose = () => {
    setOpen(false);
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const startPayment = (paymentType) => {
    sleep(3000);
    const orderid = uuidv4();
    const products = basket.map((b) => ({
      quantity: b.quantity,
      price: b.price,
      productid: b.productid,
    }));
    const paymentMutation = {
      query: `mutation startOrderInstance($userid: String, $order : OrderInput, $ptype : String,$orderid: String,$discount: Int) {
      startOrder(userid:$userid, order: $order, ptype: $ptype, orderid: $orderid,discount: $discount){
        message
      }
    }`,
      variables: {
        userid: userData._id,
        orderid: orderid,
        order: { products: products, userid: userData._id, orderid: orderid },
        ptype: discount > 0 ? "Point" : "Card",
        discount: +discount,
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
          return response.data.user.points;
        }
      })
      .catch((err) => console.log(err));
    localStorage.removeItem("basket");
    navigate("/profile");
    window.location.reload();
  };

  const handleChange = (event) => {
    setPaymentType(event.target.value);
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

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{ width: "100%" }}
        disabled={!userData}
      >
        {!userData ? "Please login to continue" : "Confirm order"}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "600px",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#ffcc00",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ mb: 2, mt: 2 }}>
                  {"MyBank: Confirm your payment"}
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Debitcard data={creditCard} />
                <Button
                  variant="contained"
                  onClick={() => startPayment(paymentType)}
                  autoFocus
                  color="success"
                  sx={{ mb: 1, mt: 3 }}
                  fullWidth
                >
                  Validate payment
                </Button>
                <Button
                  variant="outlined"
                  autoFocus
                  onClick={handleClose}
                  color="success"
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Confirmpayment;
