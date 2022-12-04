import React, { useContext, Fragment, useState } from "react";
import { ContextAPI } from "../utils/ContextAPI";
import { Avatar, Typography, Card, Box } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import Orderlist from "../components/orderlist";

const Profile = () => {
  const { userData, user, getUser } = useContext(ContextAPI);

  const [orders, setOrders] = useState([]);

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
            }
          }
          status
          _id
          
          total
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

  useEffect(() => {
    getOrders(userData._id);
    getUser(userData._id);
  }, []);

  return (
    <Fragment>
      <Typography>My data</Typography>
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

      <Typography>Orders</Typography>
      {orders &&
        orders.map((order, idx) => <Orderlist key={order._id} order={order} />)}
    </Fragment>
  );
};

export default Profile;
