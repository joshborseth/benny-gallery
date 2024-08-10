import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createAsync } from "@solidjs/router";
import { nanoid } from "nanoid";
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
  load: () => presignedUrl(),
};

export default function Home() {
  const url = createAsync(() => presignedUrl());
  return (
    <form
      class="flex flex-col gap-4 items-center justify-center"
      onSubmit={async (e) => {
        e.preventDefault();

        const file = (e.target as HTMLFormElement).file.files?.[0]!;
        if (!file) throw new Error("No file selected");
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
      <input name="file" type="file" accept="image/png, image/jpeg" />
      <Button type="submit">Upload</Button>
    </form>
  );
}
