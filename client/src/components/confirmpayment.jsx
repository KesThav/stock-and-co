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

const Confirmpayment = ({ total }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { userData, basket } = useContext(ContextAPI);
  const [paymentType, setPaymentType] = useState("Card");
  const [points, setPoints] = useState(0);
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

  const getQueryPoint = () => {
    const queryPoints = {
      query: `query getUserPoints($id: String) {
          user(_id:$id){
            points
        }
    }`,
      variables: { id: userData._id },
    };

    const headers = {
      "content-type": "application/json",
    };

    axios({
      url: process.env.REACT_APP_base_url,
      method: "post",
      headers: headers,
      data: queryPoints,
    })
      .then((response) => {
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        } else {
          setPoints(response.data.data.user.points);
          return response.data.data.user.points;
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getQueryPoint();
  }, []);

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
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirm your payment method"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
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
            <Divider />
          </Box>
          {paymentType === "Card" && <Debitcard data={creditCard} />}
          <Box style={{ color: points < total ? "#ff6a57" : "#0C6A57" }}>
            {paymentType === "Point" && points < total
              ? `Not enough points. Only ${points} Left.`
              : paymentType === "Point" && points > total
              ? `${points} points Left.`
              : null}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            autoFocus
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => startPayment(paymentType)}
            autoFocus
            sx={{ mr: 2 }}
            disabled={paymentType === "Point" && points < total}
          >
            Validate payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Confirmpayment;
