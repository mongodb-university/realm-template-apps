import { ApiTypeName } from './App'
import { Container, Link } from "@material-ui/core";

export function MoreInfo({ children }) {
  return (
    <Container style={{ textAlign: "center", padding: "14px 0", marginTop: "auto" }}>
      {children}
    </Container>
  )
}

export function MoreInfoTemplateAndDocs() {
  return (
    <MoreInfo>
      <span>Built with the MongoDB Realm {ApiTypeName} Template</span> | <Link target="_blank" href="https://docs.mongodb.com/realm">Docs</Link>
    </MoreInfo>
  )
}

export function MoreInfoGraphiQL() {
  return (
    <MoreInfo>
      <span>Try some queries in the <Link target="_blank" href="https://docs.mongodb.com/realm">GraphiQL console</Link></span>
    </MoreInfo>
  )
}
