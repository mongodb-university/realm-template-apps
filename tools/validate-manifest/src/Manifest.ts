import Ajv, { JSONSchemaType } from "ajv";

/**
  A Manifest maps template IDs to template app specifications.
 */
export type Manifest = { [id: string]: TemplateSpec };

/**
  A template app is a backend configuration plus (optionally) some frontend
  client source code.
 */
export type TemplateSpec = BackendOnlyTemplateSpec &
  Partial<ClientTemplateSpec>;

/**
  A template app can be just a backend configuration without a client.
 */
export type BackendOnlyTemplateSpec = {
  /**
    The friendly name of the template app.
   */
  name: string;

  /**
    Obsolete. The name of the GitHub org or user with the template source.
   */
  repo_owner: string;

  /**
    Obsolete. The name of the GitHub repo where the template source can be found.
   */
  repo_name: string;

  /**
    The path to the exported App Services backend configuration directory.
   */
  backend_path: string;
};

/**
  A template app can have a client.
 */
export type ClientTemplateSpec = BackendOnlyTemplateSpec & {
  /**
    The path to the client source code.
   */
  client_path: string;

  /**
    The name of the metadata file (without extension) that the server populates
    with the app ID. Usually "realm" or "Realm".
   */
  metadata_filename: string;

  /**
    The path from the root of the repo to the directory containing the metadata
    file.
   */
  metadata_path: string;

  /**
    The format (and extension) of the metadata file.
   */
  file_format: "json" | "plist" | "xml";
};

const ajv = new Ajv();

/**
  Returns an array of error messages resulting from schema validation.
 */
export const getSchemaValidationErrors = (manifest: Manifest): string[] => {
  const manifestSchemaValidate = ajv.compile(schema);
  if (!manifestSchemaValidate(manifest)) {
    return (
      manifestSchemaValidate.errors?.map(
        (error) => error.message as string
      ) ?? ["unknown manifest schema validation error"]
    );
  }
  const backendOnlyTemplateSpecValidate = ajv.compile(
    backendOnlyTemplateSpecSchema
  );
  const clientTemplateSpecValidate = ajv.compile(clientTemplateSpecSchema);
  return Object.values(manifest)
    .map((spec) => {
      // If client_path is defined, so should all other client-related keys.
      // Otherwise, no client-related keys should be defined.
      const hasClient = spec.client_path !== undefined;
      const validate = hasClient
        ? clientTemplateSpecValidate
        : backendOnlyTemplateSpecValidate;
      if (validate(spec)) {
        return [];
      }
      return (
        validate.errors?.map((error) => error.message as string) ?? [
          "unknown spec schema validation error",
        ]
      );
    })
    .flat(1);
};

// --- shortcuts ---
// Ignore this. This is a bunch of shortcuts to have type-safe JSON schemas
// based on the TypeScript types without having to repeat myself.
type PropertyDefinition = { type: "string"; enum?: ["json", "plist", "xml"] };
type Properties<T extends { [K in keyof T]: PropertyDefinition }> = {
  [K in keyof T]: PropertyDefinition;
};
// Infers a typesafe-JSON-schema-friendly type from a given JS object.
const makeProperties = <T extends Properties<T>>(properties: T) => properties;

// Adds {nullable: true} statically to both the type and the value of the given
// object.
type NullablePropertyDefinition = PropertyDefinition & { nullable: true };
const nullablize = <T extends Properties<T>>(
  properties: T
): { [K in keyof T]: NullablePropertyDefinition } =>
  Object.fromEntries(
    Object.entries<PropertyDefinition>(properties).map(([k, v]) => [
      k,
      { ...v, nullable: true },
    ])
  ) as { [K in keyof T]: NullablePropertyDefinition };

// --- end shortcuts ---

const backendOnlyTemplateSpecProperties = makeProperties({
  name: {
    type: "string",
  },
  repo_owner: {
    type: "string",
  },
  repo_name: {
    type: "string",
  },
  backend_path: {
    type: "string",
  },
});

const clientTemplateSpecProperties = makeProperties({
  client_path: {
    type: "string",
  },
  metadata_filename: {
    type: "string",
  },
  file_format: {
    enum: ["json", "plist", "xml"],
    type: "string",
  },
  metadata_path: {
    type: "string",
  },
});

export const schema: JSONSchemaType<Manifest> = {
  additionalProperties: {
    properties: {
      ...backendOnlyTemplateSpecProperties,
      ...nullablize(clientTemplateSpecProperties),
    },
    type: "object",
    additionalProperties: false,
    required: ["name", "repo_owner", "repo_name", "backend_path"],
  },
  type: "object",
  required: [],
};

export const backendOnlyTemplateSpecSchema: JSONSchemaType<BackendOnlyTemplateSpec> =
  {
    type: "object",
    properties: backendOnlyTemplateSpecProperties,
    additionalProperties: false,
    required: ["backend_path", "name", "repo_name", "repo_owner"],
  };

export const clientTemplateSpecSchema: JSONSchemaType<ClientTemplateSpec> = {
  type: "object",
  properties: {
    ...backendOnlyTemplateSpecProperties,
    ...clientTemplateSpecProperties,
  },
  additionalProperties: false,
  required: [
    "backend_path",
    "client_path",
    "file_format",
    "metadata_filename",
    "metadata_path",
    "name",
    "repo_name",
    "repo_owner",
  ],
};
