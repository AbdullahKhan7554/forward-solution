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

/**
 * Uploads a WebP blob to the media bucket and returns its public URL.
 * With onProgress, the upload goes through XHR (fetch can't report upload progress)
 * to the same Storage endpoint supabase-js uses.
 */
export async function uploadWebp(blob: Blob, folder: string, onProgress?: (percent: number) => void): Promise<string> {
  const supabase = createClient();
  const path = `${folder}/${crypto.randomUUID()}.webp`;
  if (onProgress) {
    const { data } = await supabase.auth.getSession();
    await xhrUpload(path, blob, data.session?.access_token, onProgress);
  } else {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
  }
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function xhrUpload(path: string, blob: Blob, token: string | undefined, onProgress: (percent: number) => void) {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`);
    xhr.setRequestHeader("apikey", anon);
    xhr.setRequestHeader("Authorization", `Bearer ${token ?? anon}`);
    xhr.setRequestHeader("Content-Type", "image/webp");
    xhr.setRequestHeader("Cache-Control", "max-age=31536000");
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress((e.loaded / e.total) * 100);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        return resolve();
      }
      let message = xhr.statusText || `HTTP ${xhr.status}`;
      try {
        message = JSON.parse(xhr.responseText).message ?? message;
      } catch {}
      reject(new Error(`Image upload failed: ${message}`));
    };
    xhr.onerror = () => reject(new Error("Image upload failed: network error."));
    xhr.send(blob);
  });
}
