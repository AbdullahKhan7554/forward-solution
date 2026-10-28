import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 1000;
const BUCKET = "media";

/** Browser-only: re-encodes an image file as WebP, longest side capped at maxSize (default 1000px). */
export async function toWebp(file: File, maxSize = MAX_SIZE): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("This image couldn't be read. Try a JPG, PNG or WebP file.");
  });
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  if (!blob || blob.type !== "image/webp") {
    throw new Error("Your browser can't convert images to WebP. Try Chrome, Edge or Firefox.");
  }
  return blob;
}

/** Uploads a WebP blob to the media bucket and returns its public URL. */
export async function uploadWebp(blob: Blob, folder: string): Promise<string> {
  const supabase = createClient();
  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
