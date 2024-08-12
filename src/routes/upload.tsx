import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { action, redirect, useAction } from "@solidjs/router";
import { nanoid } from "nanoid";
import { createResource, createSignal, Show } from "solid-js";
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
  const [url, { refetch }] = createResource(async () => await presignedUrl());
  let inputRef: unknown;
  const [uploadedImageUrl, setUploadedImageUrl] = createSignal("");
  const submit = useAction(saveToDb);
  return (
    <div>
      <h1 class="font-bold text-3xl text-center">Upload</h1>
      <form
        class="flex flex-col gap-4 items-center justify-center pt-6"
        onSubmit={(e) => {
          e.preventDefault();
          submit(uploadedImageUrl());
        }}
      >
        <div class="flex gap-2">
          <input
            name="file"
            type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return setUploadedImageUrl("");
              await refetch();
              try {
                const image = await fetch(url() as string, {
                  body: file,
                  method: "PUT",
                  headers: {
                    "Content-Type": file.type,
                    "Content-Disposition": `attachment; filename="${file.name}"`,
                  },
                });

                const imageUrl = image.url.split("?")[0];
                setUploadedImageUrl(imageUrl);
              } catch (e) {
                if (e instanceof Error) toast.error(e.message);
                toast.error("Something went wrong");
              }
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
          <Button disabled={!uploadedImageUrl()} type="submit">
            Upload
          </Button>
        </div>
        <Show fallback={<p>Nothing selected.</p>} when={uploadedImageUrl()}>
          <img src={uploadedImageUrl()} alt="uploaded image" height={250} width={250} />
        </Show>
      </form>
    </div>
  );
}
