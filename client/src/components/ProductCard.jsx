import React, { Fragment, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [hoverId, setHoverId] = useState(null);

  const setHovering = (_id, value) => {
    if (value === "in") {
      setHoverId(_id);
    } else {
      setHoverId(null);
    }
  };

  const navigate = useNavigate();

  return (
    <Fragment>
      <Card
        sx={{
          mingWidth: 300,
          minHeight: "450px",
          boxShadow: "none",
          border: "1px solid #ebebeb",
          borderRadius: 0,
          bgcolor: hoverId === product._id ? "#ebebeb" : "white",
          cursor: hoverId === product._id && "pointer",
        }}
        onMouseEnter={() => setHovering(product._id, "in")}
        onMouseLeave={() => setHovering(product._id, "out")}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <CardMedia
          sx={{ objectFit: "contain" }}
          component="img"
          alt="green iguana"
          height="300"
          image={product.images[0].url}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            <strong>CHF {product.price}</strong>
          </Typography>
          <Typography gutterBottom variant="h7" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
          <Typography
            variant="caption"
            sx={{ color: product.quantity > 0 ? "green" : "red" }}
          >
            {product.quantity > 0 ? "Available" : "Out of stock"}
          </Typography>
        </CardContent>
        <CardContent
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Button>
            <AddShoppingCartIcon style={{ marginRight: "20px" }} />
          </Button>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default ProductCard;
