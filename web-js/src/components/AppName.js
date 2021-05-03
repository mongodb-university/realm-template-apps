import React from "react"
// :state-start: development
const API_TYPE = process.env.REACT_APP_API_TYPE;
const TitleCaseNames = {
  graphql: "GraphQL",
  mql: "MQL",
  local: "Local",
};

export const ApiTypeName = TitleCaseNames[API_TYPE];

if (!ApiTypeName) {
  throw new Error(
    `Invalid REACT_APP_API_TYPE: "${API_TYPE}". Specifiy "graphql", "mql", or "local" instead.`
  );
}
// :state-end:
// :state-uncomment-start: prod-mql
// export const ApiTypeName = "MQL"
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
// export const ApiTypeName = "GraphQL"
// :state-uncomment-end:

export function AppName() {
  return (
    <Typography className="app-bar-title" component="h1" variant="h5">
      My {ApiTypeName} App
    </Typography>
  );
}
