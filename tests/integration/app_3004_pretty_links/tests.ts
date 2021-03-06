import members from "../../members.ts";
import { Rhum } from "../../deps.ts";
import { Drash } from "../../../mod.ts";

export const server = new Drash.Http.Server({
  directory: "./tests/integration/app_3004_pretty_links",
  response_output: "text/html",
  pretty_links: true,
  static_paths: ["/public"],
});

server.run({
  hostname: "localhost",
  port: 3004,
});

console.log(`Server listening: http://${server.hostname}:${server.port}`);
console.log("\nIntegration tests: testing server with pretty links.\n");

Rhum.testPlan("pretty_links", () => {
  Rhum.testSuite("/pretty/index.html", () => {
    Rhum.testCase("converts to /pretty", async () => {
      const response = await members.fetch.get(
        "http://localhost:3004/public/pretty",
      );
      let text = await response.text();
      console.log(text);
      Rhum.asserts.assertEquals(
        true,
        text.includes("Pretty links!"),
      );
    });
  });
});

Rhum.run();

Deno.test({
  name: "\b\b\b\b\b     \nStop the server",
  async fn() {
    await server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
