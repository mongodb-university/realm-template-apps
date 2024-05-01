import { ReactNode } from "react";
import { Container, Link } from "@mui/material";
export const MoreInfo = MoreInfoDocsLink;

function MoreInfoItem({ children }: { children: ReactNode }) {
  return (
    <Container
      className="more-info"
      maxWidth="sm"
    >
      {children}
    </Container>
  );
}

export function MoreInfoDocsLink() {
  const docsPath = "docs/atlas/app-services/edge-server/";
  const docsLink = new URL(docsPath, "https://mongodb.com").toString();
  return (
    <MoreInfoItem>
      <p> Built with the Atlas App Services Edge Server Template </p>
      <Link
        target="_blank"
        href={docsLink}
      >
        Docs
      </Link>
    </MoreInfoItem>
  );
}
