import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { action, createAsync, redirect, useAction } from "@solidjs/router";
import { nanoid } from "nanoid";
import { createSignal, Show } from "solid-js";
import { toast } from "solid-sonner";
import { Resource } from "sst";
import { Button } from "~/components/ui/button";
import { db } from "~/db";
import { media } from "~/db/schema";

async function presignedUrl() {
  "use server";
  const command = new PutObjectCommand({
    Key: nanoid(),
    Bucket: Resource.MyBucket.name,
  });
  return await getSignedUrl(new S3Client({}), command);
}

const saveToDb = action(async (url: string) => {
  "use server";
  await db.insert(media).values({ url, type: "picture" });
  throw redirect(`/`);
});

export default function Home() {
  const url = createAsync(() => presignedUrl());
  let inputRef: unknown;
  const [file, setFile] = createSignal<File>();
  const [loading, setLoading] = createSignal(false);
  const submit = useAction(saveToDb);
  return (
    <div>
      <h1 class="font-bold text-3xl text-center">Upload</h1>
      <form
        class="flex flex-col gap-4 items-center justify-center pt-6"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!file()) return;
          setLoading(true);
          try {
            const image = await fetch(url() as string, {
              body: file(),
              method: "PUT",
              headers: {
                //we check earlier if file is undefined so its okay to use !
                "Content-Type": file()!.type,
                "Content-Disposition": `attachment; filename="${file()!.name}"`,
              },
            });
            const imageUrl = image.url.split("?")[0];
            await submit(imageUrl);
          } catch (e) {
            if (e instanceof Error) {
              toast.error(e.message);
            } else {
              toast.error("Something went wrong");
            }
            setLoading(false);
          }
        }}
      >
        <div class="flex gap-2">
          <input
            onChange={(e) => {
              setFile(e.target.files?.[0]);
            }}
            name="file"
            type="file"
            ref={inputRef as HTMLInputElement}
            hidden
            accept="image/png, image/jpeg"
          />
          <Button
            onClick={() => {
              const ref = inputRef as HTMLInputElement;
              ref.click();
            }}
          >
            Choose File
          </Button>
          <Button disabled={!file()} type="submit">
            Upload
          </Button>
        </div>
        <Show fallback={<p>Nothing selected.</p>} when={file()}>
          <p>{file()?.name}</p>
        </Show>
        <Show when={loading()}>
          <p class="text-primary/60">Loading...</p>
        </Show>
      </form>
    </div>
  );
}
