import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import Products from "./pages/products";
import ProductDetail from "./pages/productDetail";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    button: {
      textTransform: "none",
    },
  },
});

function App() {
  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/product/:productid" element={<ProductDetail />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Fragment>
  );
}

export default App;
