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
  return (
    <MoreInfoItem>
      <span>Built with the Atlas App Services {API_TYPE_NAME} Template</span> |{" "}
      <Link target="_blank" href="https://docs.mongodb.com/realm">
        Docs
      </Link>
    </MoreInfoItem>
  );
}

function appendUrlPath(baseUrl, pathAddition) {
  // "new URL" overrides any existing path, so we need to work around it
  const baseUrlPath = new URL(baseUrl).pathname;
  return new URL(baseUrlPath + pathAddition, baseUrl).href;
}

const graphiqlUrl = appendUrlPath(appUrl, "/graphql/explore");

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
