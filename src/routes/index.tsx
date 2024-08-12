import { createAsync, RouteDefinition } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { For } from "solid-js";
import { db } from "~/db";
import { media } from "~/db/schema";

async function getPictures() {
  "use server";
  return await db.query.media.findMany({
    where: eq(media.type, "picture"),
  });
}

export const route = {
  preload: () => getPictures(),
} satisfies RouteDefinition;

export default function Home() {
  const pictures = createAsync(() => getPictures());
  return (
    <>
      <h1 class="font-bold text-3xl text-center">Pics of Benny</h1>
      <ul class="flex flex-wrap gap-4 justify-center py-4">
        <For each={pictures()}>{(picture) => <img width={200} height={200} class="object-cover" src={picture.url} alt={picture.url} />}</For>
      </ul>
    </>
  );
}
