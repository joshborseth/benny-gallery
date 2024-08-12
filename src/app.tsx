// @refresh reload
import { A, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Toaster } from "~/components/ui/sonner";
import "./app.css";
import { Menubar, MenubarItem, MenubarMenu } from "./components/ui/menubar";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <header class="flex justify-center p-4">
            <Menubar>
              <MenubarMenu>
                <A href="/">
                  <MenubarItem>Browse</MenubarItem>
                </A>
                <A href="/upload">
                  <MenubarItem>Upload</MenubarItem>
                </A>
              </MenubarMenu>
            </Menubar>
          </header>
          <Suspense>
            <main class="max-w-4xl w-full mx-auto pt-4">{props.children}</main>
            <Toaster />
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
