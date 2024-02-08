import { promises as fs, Stats } from "fs";
import {
  Manifest,
  getSchemaValidationErrors,
  ClientTemplateSpec,
} from "./Manifest";
import * as Path from "path";

export type ValidateResult = {
  errors: string[];
};

export const validateFile = async (
  manifestPath: string
): Promise<ValidateResult> => {
  return validateJson({
    json: await fs.readFile(manifestPath, "utf8"),
    manifestPath,
  });
};

export const validateJson = async ({
  json,
  manifestPath,
}: {
  json: string;
  manifestPath: string;
}): Promise<ValidateResult> => {
  const manifest = JSON.parse(json) as Manifest;
  return validate({ manifest, manifestPath });
};

export const validate = async ({
  manifest,
  manifestPath,
}: {
  manifest: Manifest;
  manifestPath: string;
}): Promise<ValidateResult> => {
  // First of all, validate against schema
  const schemaErrors = getSchemaValidationErrors(manifest);
  if (schemaErrors.length !== 0) {
    return { errors: schemaErrors };
  }

  const errors: string[] = [];

  // Now check some details
  const promises = Object.entries(manifest).map(
    async ([templateSpecId, templateSpec]) => {
      console.log("Checking spec:", templateSpecId);
      const checker = new CheckReporter({
        templateSpecId,
        errors,
        manifestPath,
      });
      const { repo_name, repo_owner, backend_path } = templateSpec;

      // These are probably obsolete but should be equal to this repo
      checker.checkEqual(repo_name, "realm-template-apps");
      checker.checkEqual(repo_owner, "mongodb-university");

      checker.checkPathFormat(backend_path);
      await checker.checkIsActuallyBackend(backend_path);

      const hasClient = templateSpec.client_path !== undefined;
      if (hasClient) {
        const { client_path, metadata_path, metadata_filename, file_format } =
          templateSpec as ClientTemplateSpec;
        await checker.checkDirectoryExists(client_path);
        await checker.checkFileExists(
          Path.join(metadata_path, `${metadata_filename}.${file_format}`)
        );

        // Ensure metadata file is actually within client path
        checker.checkSync(() => {
          const relative = Path.relative(client_path, metadata_path);
          return !relative.startsWith("..") && !Path.isAbsolute(relative);
        }, `metadata_path '${metadata_path}' must be equal to or subdirectory of client_path '${client_path}'`);

        checker.checkPathFormat(client_path);
        checker.checkPathFormat(metadata_path);
      }
    }
  );

  await Promise.all(promises);

  return {
    errors,
  };
};

// Helper for checking assertions and reporting errors on a template spec.
class CheckReporter {
  errors: string[];
  templateSpecId: string;
  basePath: string;
  constructor({
    templateSpecId,
    errors,
    manifestPath,
  }: {
    templateSpecId: string;
    errors: string[];
    manifestPath: string;
  }) {
    this.errors = errors;
    this.templateSpecId = templateSpecId;
    this.basePath = Path.resolve(Path.dirname(manifestPath));
  }

  checkSync = (expression: boolean | (() => boolean), failMessage: string) => {
    const result = typeof expression === "function" ? expression() : expression;
    if (!result) {
      this.errors.push(`${this.templateSpecId}: ${failMessage}`);
    }
    return result;
  };

  check = async (expression: () => Promise<boolean>, failMessage: string) => {
    const result = await expression();
    return this.checkSync(result, failMessage);
  };

  checkEqual = <T>(a: T, b: T) =>
    this.checkSync(a === b, `Expected ${a} === ${b}!`);

  checkStats = async (
    pathIn: string,
    predicate: (stats: Stats, fullPath: string) => boolean,
    failMessage: string
  ) => {
    const path = Path.resolve(this.basePath, pathIn);
    return this.check(async () => {
      try {
        const stats = await fs.stat(path);
        return predicate(stats, path);
      } catch (e) {
        console.error(e);
        return false;
      }
    }, `${path}: ${failMessage}`);
  };

  checkFileExists = async (path: string) =>
    this.checkStats(path, (s) => s.isFile(), "Not a file");

  checkDirectoryExists = async (path: string) =>
    this.checkStats(path, (s) => s.isDirectory(), "Not a directory");

  checkDirectoryContents = async (
    path: string,
    predicate: (contents: string[]) => Promise<boolean> | boolean,
    failMessage: string
  ) => {
    return this.check(async () => {
      try {
        const contents = await fs.readdir(Path.resolve(this.basePath, path));
        return predicate(contents);
      } catch (e) {
        console.error(e);
        return false;
      }
    }, failMessage);
  };

  checkRegex = (r: RegExp, v: string, failMessage: string) =>
    this.checkSync(r.test(v), failMessage);

  checkPathFormat = (path: string) =>
    this.checkRegex(
      /^[^(..?)?/].*[^/]$/,
      path,
      "paths should not have leading or trailing slashes!"
    );

  checkIsActuallyBackend = async (path: string) =>
    this.checkDirectoryContents(
      path,
      (contents) =>
        contents.includes("app_config.json") ||
        contents.includes("realm_config.json") ||
        contents.includes("root_config.json"),
      `${path} does not appear to be a backend configuration`
    );
}
