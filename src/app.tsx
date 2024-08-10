// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <header class="flex justify-center p-4">
            <nav class="p-10 flex gap-4">
              <a href="/">Browse</a>
              <a href="/upload">Upload</a>
            </nav>
          </header>
          <Suspense>
            <main class="max-w-4xl w-full mx-auto">{props.children}</main>
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
