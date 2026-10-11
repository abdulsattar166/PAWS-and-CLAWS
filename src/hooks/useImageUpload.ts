import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";

// Shared image-upload primitive used by every Admin Panel screen.
// Uploads straight to the public "media" Supabase Storage bucket and returns a
// public URL — the administrator never has to paste a URL by hand.

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

function extFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ImageUploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progressError, setProgressError] = useState("");

  /** Validate + upload a single image. Returns the public URL on success. */
  const upload = useCallback(async (file: File, folder = "site"): Promise<ImageUploadResult> => {
    setProgressError("");
    if (!supabase) return { ok: false, error: "Backend not configured." };

    const type = (file.type || "").toLowerCase();
    if (!ALLOWED_TYPES.includes(type)) {
      const msg = "Please choose a JPG, PNG, WebP or GIF image.";
      setProgressError(msg);
      return { ok: false, error: msg };
    }
    if (file.size > MAX_BYTES) {
      const msg = "That image is larger than 5 MB — please pick a smaller file.";
      setProgressError(msg);
      return { ok: false, error: msg };
    }

    setUploading(true);
    try {
      const path = `${folder}/${randomId()}.${extFor(type)}`;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { error } = await supabase.storage
        .from("media")
        .upload(path, bytes, { upsert: true, contentType: type });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      return { ok: true, url: data.publicUrl };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed. Please try again.";
      setProgressError(msg);
      return { ok: false, error: msg };
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, progressError };
}