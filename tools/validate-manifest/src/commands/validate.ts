import { CommandModule } from "yargs";
import { validateFile } from "../validate";

export type ValidateCommandArgs = { path: string };

const commandModule: CommandModule<unknown, ValidateCommandArgs> = {
  command: "validate <path>",
  handler: async ({ path }) => {
    try {
      const { errors } = await validateFile(path);
      errors.forEach((error) => console.error(error));
      process.exit(errors.length);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  },
  describe: "validate the given manifest file(s)",
};

export default commandModule;
