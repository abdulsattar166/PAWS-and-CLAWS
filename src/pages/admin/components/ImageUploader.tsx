import { useRef, useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { btnGhost, inputCls, labelCls } from "./AdminUi";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  label?: string;
  hint?: string;
  folder?: string;
  height?: string;
}

/**
 * Reusable drag-and-drop image uploader used everywhere in the Admin Panel.
 * Accepts a drop or a file-library pick, shows a live preview, and lets the
 * administrator replace or remove the image — no manual URLs, ever.
 */
export default function ImageUploader({
  value,
  onChange,
  alt,
  onAltChange,
  label = "Image",
  hint = "Drag & drop, or choose a file. JPG, PNG or WebP · up to 5 MB.",
  folder = "site",
  height = "h-40",
}: ImageUploaderProps) {
  const { upload, uploading, progressError } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setError("");
    const res = await upload(file, folder);
    if (res.ok && res.url) onChange(res.url);
    else setError(res.error ?? "Upload failed.");
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>

      {value ? (
        <div className="rounded-xl border border-background-200 bg-background-50 p-2">
          <div className={`relative w-full ${height} rounded-lg overflow-hidden bg-background-100`}>
            <img src={value} alt={alt || label} className="w-full h-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-foreground-950/50 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full border-2 border-foreground-50/30 border-t-foreground-50 animate-spin"></span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <button type="button" onClick={() => inputRef.current?.click()} className={`${btnGhost} px-3 py-2 text-xs`}>
              <i className="ri-refresh-line" aria-hidden="true"></i> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 cursor-pointer"
            >
              <i className="ri-delete-bin-line" aria-hidden="true"></i> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`w-full ${height} rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
            dragging ? "border-primary-400 bg-primary-50/60" : "border-background-300 bg-background-50 hover:border-primary-300"
          }`}
        >
          {uploading ? (
            <>
              <span className="w-8 h-8 rounded-full border-2 border-primary-500/25 border-t-primary-500 animate-spin"></span>
              <span className="text-xs text-foreground-600">Uploading…</span>
            </>
          ) : (
            <>
              <span className="w-11 h-11 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                <i className="ri-upload-cloud-2-line text-xl" aria-hidden="true"></i>
              </span>
              <span className="text-sm font-semibold text-foreground-900">Drop image here or click to upload</span>
              <span className="text-[11px] text-foreground-500 px-4 text-center">{hint}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {onAltChange && (
        <div className="mt-2">
          <input
            value={alt ?? ""}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Alt text (for accessibility & SEO)"
            className={inputCls}
          />
        </div>
      )}

      {(error || progressError) && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <i className="ri-error-warning-line" aria-hidden="true"></i>
          {error || progressError}
        </p>
      )}
    </div>
  );
}