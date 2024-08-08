// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html class="h-full" lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body class="h-full">
          <div class="bg-slushyNoobzDarkBg text-slushyNoobzPurple h-full" id="app">
            {children}
          </div>
          {scripts}
        </body>
      </html>
    )}
  />
));
