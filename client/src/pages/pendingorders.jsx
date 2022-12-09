import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import axios from "axios";
import Orderlist from "../components/orderlist";

const Pendingorder = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [lowbound, setLowbound] = useState(0);
  const [upbound, setUpbound] = useState(4);

  const pageNumber = () => {
    return pendingOrders &&
      pendingOrders.length !== 0 &&
      pendingOrders.length / 4 > Math.round(pendingOrders.length / 4)
      ? Math.round(pendingOrders.length / 4 + 1)
      : Math.round(pendingOrders.length / 4);
  };

  //function to change page and update shown data
  const handlePageChange = (event, value) => {
    setPage(value);
    setLowbound(value * 4 - 4);
    setUpbound(value * 4);
  };

  useEffect(() => {
    const getPendingOrders = async () => {
      const pendingOrdersQuery = {
        query: `query {
          userTasksAndRelatedOrders {
            taskid
            orderid
            order {
              orderid
              userDetails {
                name
              }
              
              products {
                price
                quantity
                productDetails {
                  name
                  description
                }
              }
              total
              createdAt
              type
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
        data: pendingOrdersQuery,
      })
        .then((response) => {
          if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
          } else {
            return response;
          }
        })
        .then((response) => {
          const pendingOrders = response.data;
          setPendingOrders(pendingOrders.data.userTasksAndRelatedOrders);
        })
        .catch((error) => console.log(error));
    };

    getPendingOrders();
  }, []);
  return (
    <Fragment>
      <Typography variant="h6">
        <strong>Pending orders</strong>
      </Typography>
      {pendingOrders &&
        pendingOrders
          .slice(lowbound, upbound)
          .map((porder, idx) => (
            <Orderlist
              key={porder.order.orderid}
              order={porder.order}
              type={"pending"}
              taskid={porder.taskid}
            />
          ))}
      <Pagination
        sx={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "row-reverse",
        }}
        count={pendingOrders && pageNumber()}
        page={page}
        onChange={handlePageChange}
      />
    </Fragment>
  );
};

export default Pendingorder;
