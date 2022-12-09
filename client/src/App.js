import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import Products from "./pages/products";
import ProductDetail from "./pages/productDetail";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./pages/login";
import { ContextAPI } from "./utils/ContextAPI";
import Profile from "./pages/profile";
import jwtDecode from "jwt-decode";
import Layout from "./components/Layout";
import axios from "axios";
import Shopping from "./pages/shopping";
import Logs from "./pages/logs";
import moment from "moment";
import PendingOrders from "./pages/pendingorders";

var userData;
const token = localStorage.getItem("token");
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/";
    localStorage.removeItem("token");
  } else {
    userData = decodedToken;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#116A57",
    },
  },
  shadows: Array(25).fill("none"),
});

function App() {
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );

  const [user, setUser] = useState([]);

  const getUser = async (userid) => {
    const userQuery = {
      query: `query getUser($_id : String){
        user(_id :$_id){
          _id
          name
          email
          points
        }
      }`,
      variables: { _id: userid },
    };

    const headers = {
      "content-type": "application/json",
    };

    axios({
      url: process.env.REACT_APP_base_url,
      method: "post",
      headers: headers,
      data: userQuery,
    })
      .then((response) => {
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        } else {
          return response;
        }
      })
      .then((response) => {
        const user = response.data.data.user;
        setUser(user);
      })
      .catch((error) => console.log(error));
  };

  const convertMoney = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1'");
  };

  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState([]);

  const getLogs = async () => {
    const logsQuery = {
      query: `query {
        queryLogs {
          message
          level
          timestamp
        }
      }`,
      variables: {},
    };

    const headers = {
      "content-type": "application/json",
    };

    axios({
      baseURL: process.env.REACT_APP_base_url,
      method: "post",
      headers: headers,
      data: logsQuery,
    })
      .then((response) => {
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        } else {
          return response;
        }
      })
      .then((response) => {
        let tmp = [];
        response.data.data.queryLogs.forEach((log) => {
          let message = log.message.split(" | ");
          tmp.push({
            message: log.message,
            level: log.level,
            timestamp: moment(new Date(+log.timestamp)).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            events_id: message[0],
            event_order: message[1],
            event_step: message[2],
            event_message: message[3],
          });
        });
        setLogs(tmp);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Fragment>
      <ContextAPI.Provider
        value={{
          basket,
          setBasket,
          userData,
          getUser,
          user,
          setUser,
          convertMoney,
          setCount,
          count,
          logs,
          getLogs,
        }}
      >
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout d={false}>
                    <Products />
                  </Layout>
                }
              />
              <Route
                path="/product/:productid"
                element={
                  <Layout d={false}>
                    <ProductDetail />
                  </Layout>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <Layout d={true}>
                    <Profile />
                  </Layout>
                }
              />
              <Route
                path="/logs"
                element={
                  <Layout d={true}>
                    <Logs />
                  </Layout>
                }
              />
              <Route
                path="/shopping"
                element={
                  <Layout d={false}>
                    <Shopping />
                  </Layout>
                }
              />
              <Route
                path="/pending-orders"
                element={
                  <Layout d={true}>
                    <PendingOrders />
                  </Layout>
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </ContextAPI.Provider>
    </Fragment>
  );
}

export default App;
