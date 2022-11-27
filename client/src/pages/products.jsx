import React, { Fragment } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import AppBar from "../components/appbar";
import ProductCard from "../components/ProductCard";
import { Grid, Box } from "@mui/material";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const productQuery = {
        query: `query{
          products {
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
          }
        }`,
        variables: {},
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
          const products = response.data;
          setProducts(products.data.products);
        })
        .catch((error) => console.log(error));
    };

    getProducts();
  }, []);

  return (
    <Fragment>
      <AppBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <Box sx={{ flexGrow: 1, maxWidth: "1600px" }}>
            <Grid container spacing={2}>
              {products.length !== 0 &&
                products.map((prod, i) => (
                  <Grid item xs={6} sm={4} md={3}>
                    <ProductCard key={i} product={prod} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </div>
      </div>
    </Fragment>
  );
};

export default Products;
