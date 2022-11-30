import React, { Fragment, useState } from "react";
import LoginComponent from "../components/login";
import SignupComponent from "../components/signup";
import { Container } from "@mui/material";

const Login = () => {
  const [position, setPosition] = useState(0);

  return (
    <Fragment>
      <Container component="main" maxWidth="sm">
        {position === 0 ? (
          <LoginComponent setPosition={setPosition} />
        ) : (
          <SignupComponent setPosition={setPosition} />
        )}
      </Container>
    </Fragment>
  );
};

export default Login;
