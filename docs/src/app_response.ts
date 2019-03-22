import Drash from "../bootstrap.ts";
import * as ResponseService from "./response_service.ts";

class AppResponse extends Drash.Http.Response {
  /**
   * Send a response to the client.
   */
  public async send(): Promise<any> {
    const conf = Drash.getEnvVar("DRASH_CONF").toArray().value;
    let body;

    switch (this.headers.get("Content-Type")) {
      // Handle HTML
      case "text/html":
        let indexEjsFile = `${conf.paths.docs_root}/src/templates/index.ejs`;
        Drash.Vendor.ConsoleLogger.debug("Rendering HTML response.");
        try {
          body = await ResponseService.getAppDataInHtml(indexEjsFile);
        } catch (error) {
          Drash.Vendor.ConsoleLogger.debug("WTF... tried rendering an HTML response, but I don't even know.");
          Drash.Vendor.ConsoleLogger.debug(`Attempted rendering file: ${indexEjsFile}`);
          Drash.Vendor.ConsoleLogger.debug("Error below:");
          let error500template = `<!DOCTYPE html>
<html class="w-full h-full">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, user-scalable=no"/>
    <title>Drash</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i"/>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="w-full h-full">
    <div class="flex justify-center w-full h-full">
      <div class="self-center max-w-sm rounded overflow-hidden shadow-lg">
        <img class="w-full" src="/public/assets/img/meme-congrats-you-fucked-up.jpg">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">Error</div>
          <p class="text-grey-darker text-base">${error}</p>
        </div>
        <div class="px-6 py-4">
          <span class="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">#haha</span>
          <span class="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">#dang</span>
          <span class="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker">#fixme</span>
        </div>
      </div>
    </div>
  </body>
</html>
`;
          body = error500template;
        }
        break;
      // Handle JSON
      case "application/json":
        Drash.Vendor.ConsoleLogger.debug("Stringifying JSON response.");
        body = JSON.stringify({
          status_code: this.status_code,
          body: this.body
        });
        break;
    }

    this.request.respond({
      status: this.status_code,
      headers: this.headers,
      body: new TextEncoder().encode(body)
    });
  }
}

Drash.Http.Response = AppResponse;
