import { describe, it, expect } from "vitest";
import { parse } from "yaml";
import { withRigName } from "../src/domain/rig-name-override.js";

const SPEC = [
  `# team spec`,
  `version: "0.2"`,
  `name: solo # the spec's own name`,
  `pods:`,
  `  - id: work`,
  `    label: Work`,
  `    members: [{id: worker, agent_ref: "builtin:terminal", runtime: terminal, profile: none, cwd: .}]`,
  `    edges: []`,
  `edges: []`,
].join("\n") + "\n";

describe("withRigName", () => {
  it("leaves the text unchanged when no name is given", () => {
    expect(withRigName(SPEC, undefined)).toBe(SPEC);
  });

  it("sets name and keeps every other key", () => {
    const out = withRigName(SPEC, "alpha");
    const { name, ...rest } = parse(out) as Record<string, unknown>;
    const { name: _old, ...before } = parse(SPEC) as Record<string, unknown>;
    expect(name).toBe("alpha");
    expect(rest).toEqual(before);
  });

  it("keeps the spec's comments", () => {
    const out = withRigName(SPEC, "alpha");
    expect(out).toContain("# team spec");
    expect(out).toContain("# the spec's own name");
  });

  it("adds name to a spec that has none", () => {
    expect((parse(withRigName(`version: "0.2"\npods: []\n`, "alpha")) as { name: string }).name).toBe("alpha");
  });

  it("leaves text it cannot parse as a mapping for the existing parse error", () => {
    for (const text of ["pods: [unclosed\n", "- a\n- b\n"]) expect(withRigName(text, "alpha")).toBe(text);
  });
});
