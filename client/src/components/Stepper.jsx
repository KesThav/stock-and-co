import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const MyStepper = ({ order, logs }) => {
  let number = 0;
  const mylogs = logs.filter((log) =>
    log.event_order ? log.event_order.includes(order.orderid) : null
  );
  if (mylogs) {
    const allSteps = mylogs.map((log) => log.event_step);
    number = allSteps.includes("Step 5")
      ? 4
      : allSteps.includes("Step 4")
      ? 3
      : allSteps.includes("Step 3")
      ? 3
      : allSteps.includes("Step 2")
      ? 2
      : allSteps.includes("Step 1")
      ? 1
      : allSteps.includes("Step 0")
      ? 1
      : 0;
  }
  const steps =
    order.type === "Point"
      ? [
          `Discount of CHF ${order.discount} applied`,
          "Payment received",
          "Order created",
          "Order shipped",
        ]
      : [
          "Payment received",
          "Order created",
          number > 2
            ? `Get +${Math.floor(order.total / 100)} points`
            : "Update points",
          "Order delivered",
        ];
  return (
    <Box sx={{ width: "100%", mt: 2, mb: 4 }}>
      <Stepper activeStep={number} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default MyStepper;
