import {
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  TextField,
  Chip,
} from "@mui/material";
import React, {
  Fragment,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { ContextAPI } from "../utils/ContextAPI";
import ShoppingCard from "../components/shoppingCard";
import Confirmpayment from "../components/confirmpayment";
import axios from "axios";

const Shopping = () => {
  const { basket, userData, convertMoney } = useContext(ContextAPI);
  const [discount, setDiscount] = useState(0);
  const inputRef = useRef(null);
  const [points, setPoints] = useState(0);
  const [inputValue, setInputValue] = useState(0);

  const mapShoppingCard = (basket) => {
    return [
      basket.map((prod, i) => <ShoppingCard product={prod} key={i} />),
      basket.reduce((total, prod) => total + prod.price * prod.quantity, 0),
    ];
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
    userData && getQueryPoint();
  }, []);

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
              <Divider sx={{ mt: 1 }} />

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "right",
                  mb: 1,
                  pl: 1,
                  pr: 2,
                }}
              >
                {userData && (
                  <Chip
                    label={`Points left: ${points}`}
                    variant="outlined"
                    color="primary"
                  />
                )}
                {discount > 0 && (
                  <Chip
                    label={`Discount: ${discount}CHF`}
                    color="secondary"
                    variant="outlined"
                    onDelete={() => setDiscount(0)}
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", width: "100%", pl: 1, pr: 2 }}>
                {userData && (
                  <>
                    <TextField
                      placeholder="discount"
                      fullWidth
                      type="number"
                      inputRef={inputRef}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={() => setDiscount(inputRef.current.value)}
                      disabled={inputValue > points}
                      sx={{ ml: 1 }}
                    >
                      Apply
                    </Button>
                  </>
                )}
              </Box>
              <Divider sx={{ mt: 1 }} />
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
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {discount > 0 && (
                    <>
                      <Typography>
                        <strong>Discount</strong>
                      </Typography>

                      <Typography>
                        <strong>{`- CHF ${discount}`}</strong>
                      </Typography>
                    </>
                  )}
                </Box>
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
                    <strong>
                      {discount > 0
                        ? `CHF ${convertMoney(
                            mapShoppingCard(basket)[1] - discount
                          )}`
                        : `CHF ${convertMoney(mapShoppingCard(basket)[1])}`}
                    </strong>
                  </Typography>
                </Box>
                <Divider sx={{ mt: 1, mb: 2 }} />

                {userData && (
                  <Confirmpayment
                    total={mapShoppingCard(basket)[1]}
                    discount={discount}
                  />
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
