import React from "react";
import { Typography } from "@material-ui/core";

export const API_TYPE_NAME = "GraphQL"

export function AppName() {
  return (
    <Typography className="app-bar-title" component="h1" variant="h5">
      My {API_TYPE_NAME} App
    </Typography>
  );
}
