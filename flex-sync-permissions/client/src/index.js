// :state-start: add-collaborators
import { addCollaboratorsExample } from "./addCollaboratorsExample.js";
// :state-end:
// :state-start: tiered
import { tieredExample } from "./tieredExample.js";
// :state-end:
// :state-start: restricted-feed
import { restrictedFeedExample } from "./restrictedFeedExample.js";
// :state-end:
import { appId, baseUrl } from "./realm.json";
// :remove-start:
import { program } from "commander";
const demos = {
  addCollaboratorsExample,
  restrictedFeedExample,
  tieredExample,
};

program
  .usage("[OPTIONS]...")
  .option("--appId <appId>", "Backend app ID")
  .argument("<demo>", "Demo function to run")
  .action(async (demoName, options) => {
    const { appId } = options;

    const demoFunction = demos[demoName];
    if (demoFunction === undefined) {
      throw new Error(
        `Unknown demo: ${demoName}. Options are: ${Object.keys(demos)}`
      );
    }
    try {
      await demoFunction(appId, baseUrl);
      process.exit(0);
    } catch (error) {
      console.error("Received error:", error);
      process.exit(1);
    }
  })
  .parse();
// :remove-end:
// :state-uncomment-start: add-collaborators
// addCollaboratorsExample(appId);
// :state-uncomment-end:
// :state-uncomment-start: tiered
// tieredExample(appId);
// :state-uncomment-end:
// :state-uncomment-start: restricted-feed
// restrictedFeedExample(appId);
// :state-uncomment-end:
