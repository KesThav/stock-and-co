import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Grid, Paper, Button, Box, Typography, Rating } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import LocalPoliceOutlinedIcon from "@mui/icons-material/LocalPoliceOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import IncrementButton from "../components/incrementButton";
import UserCard from "../components/userCard";
import { useContext } from "react";
import { ContextAPI } from "../utils/ContextAPI";

const ProductDetail = () => {
  const [product, setProduct] = useState([]);

  let { productid } = useParams();

  let { basket, setBasket, setCount, count } = useContext(ContextAPI);

  let [quantity, setQuanity] = useState(0);

  useEffect(() => {
    const getProducts = async (productid) => {
      const productQuery = {
        query: `query getOneProduct($id: String){
          product(id: $id) {
            _id
            name
            description
            type
            averageRating
            quantity
            price
            images {
              url
            }
            orderList {
              userDetails {
                name
              }
            }
          }
      }`,
        variables: { id: productid },
      };
      const headers = {
        "content-type": "application/json",
      };
      axios({
        url: process.env.REACT_APP_base_url,
        method: "post",
        headers: headers,
        data: productQuery,
      })
        .then((response) => {
          if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
          } else {
            return response;
          }
        })
        .then((response) => {
          const product = response.data;
          setProduct(product.data.product);
        })
        .catch((error) => console.log(error));
    };

    productid && getProducts(productid);
  }, [count]);

  const Item = (props) => {
    return (
      <Paper
        sx={{
          height: "500px",
          width: "100%",
          bgcolor: "white",
          display: "flex",
          justifyContent: "center",
          borderRadius: 0,
          boxShadow: "none",
        }}
      >
        <img
          src={props.image}
          alt="img"
          style={{ maxWidth: "100%", maxHeight: "auto" }}
        />
      </Paper>
    );
  };

  const handleBasket = (product, quantity) => {
    let arr = JSON.parse(localStorage.getItem("basket")) || [];

    const prod = {
      productid: product._id,
      name: product.name,
      description: product.description,
      images: product.images[0].url,
      quantity,
      price: product.price,
    };

    arr = arr.filter((p) => p.productid !== prod.productid);
    arr.push(prod);
    localStorage.setItem("basket", JSON.stringify(arr));
    setBasket(basket);
    setCount((count) => count + 1);
    window.location.reload();
  };

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          objectFit: "contain",
        }}
      >
        <div>
          <Box
            sx={{
              flexGrow: 1,
              width: "100vw",
              maxWidth: "1600px",
            }}
          >
            <Grid container spacing={2}>
              {product && product.images && (
                <>
                  <Grid item xs={12} sm={7} md={7}>
                    <Carousel style={{ minWidth: "600px" }}>
                      {product.images.map((image, i) => (
                        <Item key={i} image={image.url} />
                      ))}
                    </Carousel>
                  </Grid>
                  <Grid item xs={12} sm={5} md={5}>
                    <Paper
                      sx={{
                        width: "100%",
                        minHeight: "500px",
                        boxShadow: "none",
                        borderRadius: 0,
                        padding: "15px",
                      }}
                    >
                      <Typography variant="h3">
                        <strong>{product.name}</strong>
                      </Typography>

                      <Typography variant="h5">
                        {product.description}
                      </Typography>
                      <Typography
                        sx={{ display: "flex", alignItems: "center" }}
                        variant="caption"
                      >
                        <Rating
                          name="half-rating-read"
                          defaultValue={product.averageRating}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                      </Typography>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row-reverse",
                          marginTop: "50px",
                        }}
                      >
                        <Typography variant="h5">
                          CHF {product.price}
                        </Typography>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                        }}
                      >
                        {product.quantity > 0 && (
                          <IncrementButton
                            maxValue={product.quantity}
                            sq={setQuanity}
                          />
                        )}
                        <Button
                          onClick={() => handleBasket(product, quantity)}
                          variant="contained"
                          sx={{
                            padding: "10px 0",
                            width: "100%",
                            marginLeft: "10px",
                          }}
                          disableElevation
                          disabled={product.quantity <= 0}
                        >
                          Add to cart
                        </Button>
                      </div>
                      <div style={{ marginBottom: "50px" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: product.quantity > 0 ? "green" : "red",
                          }}
                        >
                          {product.quantity > 0 ? "Available" : "Out of stock"}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        {[
                          {
                            icon: (
                              <LocalPoliceOutlinedIcon sx={{ fontSize: 40 }} />
                            ),
                            text: "3-year-warranty",
                          },
                          {
                            icon: <RefreshOutlinedIcon sx={{ fontSize: 40 }} />,
                            text: "Satisfied or refund",
                          },
                          {
                            icon: (
                              <LocalShippingOutlinedIcon
                                sx={{ fontSize: 40 }}
                              />
                            ),
                            text: "Free delivery",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              margin: "5px 5px",
                              width: "100%",
                              aspectRatio: "1/1",
                              border: "1px dashed black",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {item.icon}
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </Paper>
                  </Grid>

                  {product.orderList.length !== 0 && (
                    <>
                      <Typography
                        variant="h5"
                        sx={{ marginBottom: "30px", marginTop: "50px" }}
                      >
                        These people also bought the product
                      </Typography>
                      <Grid container spacing={2}>
                        {product.orderList.slice(0, 4).map((prod, i) => (
                          <Grid item xs={6} sm={3}>
                            <UserCard
                              username={prod.userDetails.name}
                              key={i}
                              i={i}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
          </Box>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductDetail;
