import { validateJson } from "./validate";

describe("validate", () => {
  const manifestPath = "./";
  it("validates json schema", async () => {
    const json = `{"x": {}}`;
    const { errors } = await validateJson({ json, manifestPath });
    expect(errors).toStrictEqual(["must have required property 'name'"]);
  });
  it("asserts complete client config", async () => {
    const json = `{
  "x": {
    "name": "x",
    "repo_owner": "x",
    "repo_name": "x",
    "backend_path": "x",
    "client_path": "<implies the existence of other client config keys>"
  }
}`;
    const { errors } = await validateJson({ json, manifestPath });
    expect(errors).toStrictEqual(["must have required property 'file_format'"]);
  });
  it("asserts no additional properties on backend-only config", async () => {
    const json = `{
  "x": {
    "name": "x",
    "repo_owner": "x",
    "repo_name": "x",
    "backend_path": "x",
    "metadata_path": "<implies this is a backend-only config>"
  }
}`;
    const { errors } = await validateJson({ json, manifestPath });
    expect(errors).toStrictEqual(["must NOT have additional properties"]);
  });

  it("checks that backend_path actually looks like a backend configuration", async () => {
    const json = `{
  "x": {
    "name": "x",
    "repo_owner": "mongodb-university",
    "repo_name": "realm-template-apps",
    "backend_path": "commands"
  }
}`;
    const { errors } = await validateJson({ json, manifestPath });
    expect(errors).toStrictEqual([
      "x: commands does not appear to be a backend configuration",
    ]);
  });

  it("checks config problems", async () => {
    const json = `{
  "x": {
    "name": "<unchecked>",
    "repo_owner": "anything but mongodb-university",
    "repo_name": "anything but realm-template-apps",
    "backend_path": "./no/leading/dot/slashes",
    "client_path": "/no/leading/slash",
    "metadata_path": "no/trailing/slash",
    "metadata_filename": "Realm",
    "file_format": "plist"
  }
}`;
    const { errors } = await validateJson({ json, manifestPath });
    expect(errors[0]).toBe(
      "x: Expected anything but realm-template-apps === realm-template-apps!"
    );
    expect(errors[1]).toBe(
      "x: Expected anything but mongodb-university === mongodb-university!"
    );
    expect(errors[2]).toBe(
      "x: paths should not have leading or trailing slashes!"
    );
    expect(errors[3]).toMatch(
      "x: ./no/leading/dot/slashes does not appear to be a backend configuration"
    );
    expect(errors[4]).toMatch("no/leading/slash: Not a directory");
    expect(errors[5]).toMatch("no/trailing/slash/Realm.plist: Not a file");
    expect(errors[6]).toBe(
      "x: metadata_path 'no/trailing/slash' must be equal to or subdirectory of client_path '/no/leading/slash'"
    );
    expect(errors[7]).toBe(
      "x: paths should not have leading or trailing slashes!"
    );
  });
});
