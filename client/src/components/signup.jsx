import React, { Fragment, useState } from "react";
import {
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Signup = ({ setPosition }) => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) return;

    const signMutation = {
      query: `mutation signUser($name: String!, $email: String!, $password: String!) {
      register(name: $name, email: $email, password: $password){
        token
      }
    }`,
      variables: {
        name: `${credentials.firstname} ${credentials.lastname}`,
        email: credentials.email,
        password: credentials.password,
      },
    };

    const headers = {
      "content-type": "application/json",
    };

    axios({
      url: process.env.REACT_APP_base_url,
      method: "post",
      headers: headers,
      data: signMutation,
    })
      .then((response) => {
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        } else {
          return response;
        }
      })
      .then((response) => {
        localStorage.setItem("token", response.data.data.register.token);
        navigate("/");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={(e) => handleSubmit(e)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(e) => handleChanges(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={(e) => handleChanges(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => handleChanges(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => handleChanges(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography
                variant="body2"
                onClick={() => setPosition(0)}
                sx={{ cursor: "pointer" }}
              >
                Already have an account? Sign in
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Fragment>
  );
};

export default Signup;
