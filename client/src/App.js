import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import Products from "./pages/products";
import ProductDetail from "./pages/productDetail";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./pages/login";
import { ContextAPI } from "./utils/ContextAPI";

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
});

function App() {
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  return (
    <Fragment>
      <ContextAPI.Provider value={{ basket, setBasket }}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/product/:productid" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </ContextAPI.Provider>
    </Fragment>
  );
}

export default App;
