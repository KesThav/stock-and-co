import React from "react";
import CardReactFormContainer from "card-react";
import { TextField, Box, Grid } from "@mui/material";

const Debitcard = ({ data }) => {
  return (
    <div>
      <CardReactFormContainer
        // the id of the container element where you want to render the card element.
        // the card component can be rendered anywhere (doesn't have to be in ReactCardFormContainer).
        container="card-wrapper" // required
        // an object contain the form inputs names.
        // every input must have a unique name prop.
        formInputsNames={{
          number: "CCnumber", // optional — default "number"
          expiry: "CCexpiry", // optional — default "expiry"
          cvc: "CCcvc", // optional — default "cvc"
          name: "CCname", // optional - default "name"
        }}
        // initial values to render in the card element
        initialValues={{
          number: data.cardNumber, // optional — default •••• •••• •••• ••••
          cvc: data.cvc, // optional — default •••
          expiry: data.expiry, // optional — default ••/••
          name: data.name, // optional — default FULL NAME
        }}
        // the class name attribute to add to the input field and the corresponding part of the card element,
        // when the input is valid/invalid.
        classes={{
          valid: "valid-input", // optional — default 'jp-card-valid'
          invalid: "invalid-input", // optional — default 'jp-card-invalid'
        }}
        // specify whether you want to format the form inputs or not
        formatting={true} // optional - default true
      >
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Full name"
              type="text"
              name="CCname"
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Card number"
              type="text"
              name="CCnumber"
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              placeholder="MM/YY"
              type="text"
              name="CCexpiry"
              sx={{ mb: 1, mr: "1px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              placeholder="CVC"
              type="text"
              name="CCcvc"
              sx={{ mb: 1, ml: "1px" }}
            />
          </Grid>
        </Grid>
      </CardReactFormContainer>
      <div style={{ marginTop: "20px" }} id="card-wrapper"></div>
    </div>
  );
};

export default Debitcard;
