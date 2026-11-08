import { createConfig } from "@wkovacs64/oxlint-config";

export default createConfig({
  overrides: [
    {
      files: ["playwright/**"],
      rules: {
        // expectValues wraps several expect() calls
        "playwright/expect-expect": [
          "error",
          { assertFunctionNames: ["expect", "expectValues"] },
        ],
      },
    },
  ],
});
