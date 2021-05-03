import path from "path";
import { ApiTypeName } from './AppName'
import { Container, Link } from "@material-ui/core";
import { url as realmAppUrl } from "../realm.json"

export function MoreInfo() {
  return (
    <>
      {ApiTypeName === "GraphQL" ? <MoreInfoGraphiQL /> : null}
      <MoreInfoTemplateAndDocs />
    </>
  )
}

function MoreInfoItem({ children }) {
  return (
    <Container style={{ textAlign: "center", padding: "14px 0", marginTop: "auto" }}>
      {children}
    </Container>
  )
}

function MoreInfoTemplateAndDocs() {
  return (
    <MoreInfoItem>
      <span>Built with the MongoDB Realm {ApiTypeName} Template</span> | <Link target="_blank" href="https://docs.mongodb.com/realm">Docs</Link>
    </MoreInfoItem>
  )
}

const graphiqlUrl = path.join(realmAppUrl, "/graphql/explore")
function MoreInfoGraphiQL() {
  return (
    <MoreInfoItem>
      <span>Try some queries in the <Link target="_blank" href={graphiqlUrl}>GraphiQL Explorer</Link></span>
    </MoreInfoItem>
  )
}
