import React from "react";
import { Container, Link } from "@mui/material";
export const MoreInfo = MoreInfoDocsLink;

function MoreInfoItem({ children }: { children: React.ReactNode }) {
  return (
    <Container
      style={{ textAlign: "center", padding: "14px 0", marginTop: "auto" }}
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
      <span>{"Built with the Atlas App Services Edge Server Template"}</span> |{" "}
      <Link
        target="_blank"
        href={docsLink}
      >
        Docs
      </Link>
    </MoreInfoItem>
  );
}
