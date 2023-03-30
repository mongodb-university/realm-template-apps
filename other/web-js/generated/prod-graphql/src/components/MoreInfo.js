import { Container, Link } from "@mui/material";
import appConfig from "../realm.json";
export function MoreInfo() {
  return (
    <>
      <MoreInfoGraphiQL />
      <MoreInfoDocsLink />
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

export function MoreInfoDocsLink() {
  const docsPath = "/docs/atlas/app-services/graphql/";
  const docsLink = new URL(docsPath, "https://mongodb.com");
  return (
    <MoreInfoItem>
      <span>{
        "Built with the Atlas App Services GraphQL Template"
      }</span> |{" "}
      <Link target="_blank" href={docsLink}>
        Docs
      </Link>
    </MoreInfoItem>
  );
}

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
