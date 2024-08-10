import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createAsync, RouteDefinition } from "@solidjs/router";
import { nanoid } from "nanoid";
import { createSignal, Show } from "solid-js";
import { toast } from "solid-sonner";
import { Resource } from "sst";
import { Button } from "~/components/ui/button";

async function presignedUrl() {
  "use server";
  const command = new PutObjectCommand({
    Key: nanoid(),
    Bucket: Resource.MyBucket.name,
  });
  return await getSignedUrl(new S3Client({}), command);
}

export const route = {
  preload: () => presignedUrl(),
} satisfies RouteDefinition;

export default function Home() {
  const url = createAsync(() => presignedUrl());
  let inputRef: unknown;
  const [fileName, setFileName] = createSignal("");
  return (
    <div>
      <h1 class="font-bold text-3xl text-center">Upload</h1>
      <form
        class="flex flex-col gap-4 items-center justify-center pt-6"
        onSubmit={async (e) => {
          e.preventDefault();

          const file = (e.target as HTMLFormElement).file.files?.[0]!;
          if (!file) toast.error("No file selected");
          const image = await fetch(url() as string, {
            body: file,
            method: "PUT",
            headers: {
              "Content-Type": file.type,
              "Content-Disposition": `attachment; filename="${file.name}"`,
            },
          });
          window.location.href = image.url.split("?")[0];
        }}
      >
        <div class="flex gap-2">
          <input
            name="file"
            type="file"
            onChange={(e) => {
              setFileName(e.target.files?.[0]?.name ?? "");
            }}
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
          <Button type="submit">Upload</Button>
        </div>
        <Show fallback="Nothing selected." when={fileName()}>
          {fileName()}
        </Show>
      </form>
    </div>
  );
}
