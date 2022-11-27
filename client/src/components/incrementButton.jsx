import React, { useState } from "react";
import { ButtonGroup, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const IncrementButton = ({ maxValue }) => {
  const [counter, setCounter] = useState(1);

  const handleIncrement = () => {
    setCounter((counter) => counter + 1);
  };

  const handleDecrement = () => {
    setCounter((counter) => counter - 1);
  };

  return (
    <ButtonGroup size="small" aria-label="small outlined button group">
      <Button onClick={handleDecrement} disabled={counter === 1}>
        <RemoveIcon />
      </Button>
      <Button disabled>{counter}</Button>
      <Button onClick={handleIncrement} disabled={counter === maxValue}>
        <AddIcon />
      </Button>
    </ButtonGroup>
  );
};

export default IncrementButton;
