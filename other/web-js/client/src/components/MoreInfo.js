import { Container, Link } from "@mui/material";
import { API_TYPE_NAME } from "./AppName";
import appConfig from "../realm.json";

const { appUrl } = appConfig;

export function MoreInfo() {
  return (
    <>
      {API_TYPE_NAME === "GraphQL" ? <MoreInfoGraphiQL /> : null}
      <MoreInfoTemplateAndDocs />
    </>
  );
}

function MoreInfoItem({ children }) {
  return (
    <Container
      style={{ textAlign: "center", padding: "14px 0", marginTop: "auto" }}
    >
      {children}
    </Container>
  );
}

export function MoreInfoTemplateAndDocs() {
  const docsPath =
    {
      "Data API": "/docs/atlas/app-services/data-api/",
      GraphQL: "/docs/atlas/app-services/graphql/",
      MQL: "/docs/atlas/app-services/",
    }[API_TYPE_NAME] ?? "/docs/atlas/app-services/";
  const docsLink = new URL(docsPath, "https://mongodb.com");
  return (
    <MoreInfoItem>
      <span>Built with the Atlas App Services {API_TYPE_NAME} Template</span> |{" "}
      <Link target="_blank" href={docsLink}>
        Docs
      </Link>
    </MoreInfoItem>
  );
}

const graphiqlUrl = new URL("graphql/explore", appUrl).href;

function MoreInfoGraphiQL() {
  return (
    <MoreInfoItem>
      <span>
        Try some queries in the{" "}
        <Link target="_blank" href={graphiqlUrl}>
          GraphiQL Explorer
        </Link>
      </span>
    </MoreInfoItem>
  );
}
