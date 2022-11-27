import React, { Fragment } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import NiceAvatar, { genConfig } from "react-nice-avatar";

const userCard = ({ username, i }) => {
  const myConfig = genConfig({
    sex: "man",
  });

  const review = [
    `This laptop is a powerhouse, it handles all the apps we can throw at it and more. \
    My old surface book was doing ok until I started using it for Power-Bi.. \
     After purchasing one of these to test, I have purchased this model for the rest of the company.`,
    `I love the details and fingerprint scanner. It has worked beautifully, and is so fast!`,
    `I don't really know much about about computers but I needed something for grad school this fall.
       This one checked all the boxes and is doing awesome so far!`,
    `I love this product! We received it so quickly and with great customer service.
    This has everything I need for my team members at our small nonprofit to work efficiently and effectively.
     I feel safe knowing it has spill and drop protection.`,
  ];

  return (
    <Fragment>
      <Card
        sx={{
          borderRadius: 0,
          boxShadow: "none",
          height: "100%",
          border: "1px solid #ebebeb",
        }}
      >
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NiceAvatar
            style={{ width: "150px", height: "150px" }}
            {...myConfig}
          />
          <div style={{ marginTop: "15px" }}>
            <Typography>{username}</Typography>
          </div>
          <Typography sx={{ marginTop: "10px" }}>
            <i>{`"${review[i]}"`}</i>
          </Typography>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default userCard;
