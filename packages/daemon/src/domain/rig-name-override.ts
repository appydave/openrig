import { isMap, parseDocument } from "yaml";

/**
 * `rig up <spec> --name <rig>`: the spec text with its `name:` set to the chosen rig name, before anything
 * parses it, so validation, the running-name guard, the per-name import lock, the Compose project name,
 * `rigs.name` and seat names all see one name. The file on disk is not changed; comments are kept.
 * Text that does not parse as a mapping is returned as is, for the existing parse error to report.
 */
export function withRigName(rawYaml: string, rigName: string | undefined): string {
  if (rigName === undefined) return rawYaml;
  const doc = parseDocument(rawYaml);
  if (doc.errors.length > 0 || !isMap(doc.contents)) return rawYaml;
  doc.set("name", rigName);
  return doc.toString();
}
