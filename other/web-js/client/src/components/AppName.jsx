import React from "react";
import { Typography } from "@mui/material";

// :state-start: development
const API_TYPE = import.meta.env.VITE_API_TYPE;
const API_TYPE_NAMES = {
  graphql: "GraphQL",
  mql: "MQL",
  "data-api": "Data API",
  local: "Local",
};

export const API_TYPE_NAME = API_TYPE_NAMES[API_TYPE];

if (!API_TYPE_NAME) {
  throw new Error(
    `Invalid REACT_APP_API_TYPE: "${API_TYPE}". Specifiy "graphql", "mql", or "local" instead.`
  );
}
// :state-end:
// :state-uncomment-start: prod-mql
// export const API_TYPE_NAME = "MQL"
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
// export const API_TYPE_NAME = "GraphQL"
// :state-uncomment-end:
// :state-uncomment-start: prod-data-api
// export const API_TYPE_NAME = "Data API"
// :state-uncomment-end:

export function AppName() {
  return (
    <Typography className="app-bar-title" component="h1" variant="h5">
      My {API_TYPE_NAME} App
    </Typography>
  );
}
