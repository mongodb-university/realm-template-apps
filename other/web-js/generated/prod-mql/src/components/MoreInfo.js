import { Container, Link } from "@mui/material";
export const MoreInfo = MoreInfoDocsLink

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
  const docsPath = "/docs/atlas/app-services/";
  const docsLink = new URL(docsPath, "https://mongodb.com");
  return (
    <MoreInfoItem>
      <span>{
        "Built with the Atlas App Services MQL Template"
      }</span> |{" "}
      <Link target="_blank" href={docsLink}>
        Docs
      </Link>
    </MoreInfoItem>
  );
}

