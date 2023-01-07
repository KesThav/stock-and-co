import React, { useContext, Fragment, useState } from "react";
import { ContextAPI } from "../utils/ContextAPI";
import { Avatar, Typography, Card, Box, Pagination } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import Orderlist from "../components/orderlist";

const Profile = () => {
  const { userData, user, getUser, setLoading } = useContext(ContextAPI);

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [lowbound, setLowbound] = useState(0);
  const [upbound, setUpbound] = useState(4);

  const getOrders = (userid) => {
    const ordersQuery = {
      query: `query getOrderbyUser($userid : String){
        orderByUser(userid : $userid){
          products {
            productid
            price
            quantity
            productDetails {
              _id
              name
              description
              type
            	images {
                url
              }
            }
          }
          status
          orderid
          type
          total
          discount
          createdAt
        }
      }`,
      variables: { userid: userid },
    };

    const headers = {
      "content-type": "application/json",
    };

    axios({
      url: process.env.REACT_APP_base_url,
      method: "post",
      headers: headers,
      data: ordersQuery,
    })
      .then((response) => {
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        } else {
          return response;
        }
      })
      .then((response) => {
        const orders = response.data.data.orderByUser;
        setOrders(orders);
      })
      .catch((error) => console.log(error));
  };

  const pageNumber = () => {
    return orders &&
      orders.length !== 0 &&
      orders.length / 4 > Math.round(orders.length / 4)
      ? Math.round(orders.length / 4 + 1)
      : Math.round(orders.length / 4);
  };

  //function to change page and update shown data
  const handlePageChange = (event, value) => {
    setPage(value);
    setLowbound(value * 4 - 4);
    setUpbound(value * 4);
  };

  useEffect(() => {
    setLoading(true);
    getOrders(userData._id);
    getUser(userData._id);
    setLoading(false);
  }, []);

  return (
    <Fragment>
      <Typography variant="h5">
        <strong>My data</strong>
      </Typography>
      {user && (
        <Card
          sx={{
            pt: 2,
            pb: 2,
            display: "flex",
            alignItems: "center",
            mt: 1,
            mb: 2,
            boxShadow: "none",
          }}
        >
          <Avatar sx={{ width: 63, height: 63, mr: 2, ml: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="caption">
              <strong>ID:</strong> {user._id}
            </Typography>
            <Typography variant="caption">
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography variant="caption">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="caption">
              <strong>Points:</strong> {user.points}
            </Typography>
          </Box>
        </Card>
      )}

      <Typography variant="h5">
        <strong>Orders</strong>
      </Typography>
      {orders &&
        orders
          .slice(lowbound, upbound)
          .map((order, idx) => (
            <Orderlist key={order.orderid} order={order} type={"profile"} />
          ))}
      <Pagination
        sx={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "row-reverse",
        }}
        count={orders && pageNumber()}
        page={page}
        onChange={handlePageChange}
      />
    </Fragment>
  );
};

export default Profile;
