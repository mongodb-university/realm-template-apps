import { Container, Link } from "@mui/material";
// :state-start: prod-graphql
import appConfig from "../realm.json";
// :state-end:
// :state-start: development
import { API_TYPE_NAME } from "./AppName";

export function MoreInfo() {
  return (
    <>
      {API_TYPE_NAME === "GraphQL" ? <MoreInfoGraphiQL /> : null}
      <MoreInfoDocsLink />
    </>
  );
}
// :state-end:
// :state-uncomment-start: prod-mql
// export const MoreInfo = MoreInfoDocsLink
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
// export function MoreInfo() {
//   return (
//     <>
//       <MoreInfoGraphiQL />
//       <MoreInfoDocsLink />
//     </>
//   );
// }
// :state-uncomment-end:
// :state-uncomment-start: prod-data-api
// export const MoreInfo = MoreInfoDocsLink;
// :state-uncomment-end:

function MoreInfoItem({ children }) {
  return (
    <Container
      style={{ textAlign: "center", padding: "14px 0", marginTop: "auto" }}
    >
      {children}
    </Container>
  );
}

export function MoreInfoDocsLink() {
  // :state-start: development
  const docsPath =
    {
      MQL: "/docs/atlas/app-services/",
      GraphQL: "/docs/atlas/app-services/graphql/",
      "Data API": "/docs/atlas/app-services/data-api/",
    }[API_TYPE_NAME] ?? "/docs/atlas/app-services/";
  // :state-end:
  // :state-uncomment-start: prod-mql
  // const docsPath = "/docs/atlas/app-services/";
  // :state-uncomment-end:
  // :state-uncomment-start: prod-graphql
  // const docsPath = "/docs/atlas/app-services/graphql/";
  // :state-uncomment-end:
  // :state-uncomment-start: prod-data-api
  // const docsPath = "/docs/atlas/app-services/data-api/";
  // :state-uncomment-end:
  const docsLink = new URL(docsPath, "https://mongodb.com");
  return (
    <MoreInfoItem>
      <span>{
        // :state-start: development
        `Built with the Atlas App Services ${API_TYPE_NAME} Template`
        // :state-end:
        // :state-uncomment-start: prod-mql
        // "Built with the Atlas App Services MQL Template"
        // :state-uncomment-end:
        // :state-uncomment-start: prod-graphql
        // "Built with the Atlas App Services GraphQL Template"
        // :state-uncomment-end:
        // :state-uncomment-start: prod-data-api
        // "Built with the Atlas App Services Data API Template"
        // :state-uncomment-end:
      }</span> |{" "}
      <Link target="_blank" href={docsLink}>
        Docs
      </Link>
    </MoreInfoItem>
  );
}

// :state-start: prod-graphql
function MoreInfoGraphiQL() {
  return (
    <MoreInfoItem>
      <span>
        Try some queries in the{" "}
        <Link
          target="_blank"
          href={new URL("graphql/explore", appConfig.appUrl).href}
        >
          GraphiQL Explorer
        </Link>
      </span>
    </MoreInfoItem>
  );
}
// :state-end:
