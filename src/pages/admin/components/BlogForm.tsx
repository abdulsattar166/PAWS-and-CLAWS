import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { BlogPostRow } from "@/lib/adminTypes";
import { Modal, Field, inputCls, btnPrimary, btnGhost } from "./AdminUi";
import ImageUploader from "./ImageUploader";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
}

export default function BlogForm({
  post,
  onClose,
  onSaved,
}: {
  post: BlogPostRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !post;
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    cover_image: post?.cover_image ?? "",
    category: post?.category ?? "",
    tags: (post?.tags ?? []).join(", "),
    status: post?.status ?? "draft",
    seo_title: post?.seo_title ?? "",
    seo_description: post?.seo_description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!supabase) return;
    setError("");
    if (!form.title.trim()) { setError("Please enter a title."); return; }
    const slug = (form.slug.trim() || slugify(form.title)).toLowerCase();
    if (!slug) { setError("Please enter a valid URL slug."); return; }

    setSaving(true);
    const publishing = form.status === "published";
    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      cover_image: form.cover_image.trim() || null,
      category: form.category.trim() || null,
      tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
      status: form.status,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      published_at: publishing ? (post?.published_at ?? new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    };

    const { error: err } = isNew
      ? await supabase.from("blog_posts").insert(payload)
      : await supabase.from("blog_posts").update(payload).eq("id", post!.id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={isNew ? "New blog post" : `Edit: ${post?.title}`}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
            {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save post</>}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {error && (
          <p className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
            <i className="ri-error-warning-line mt-0.5" aria-hidden="true"></i>{error}
          </p>
        )}

        <Field label="Title">
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="URL slug" hint="Leave blank to auto-generate from the title.">
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} placeholder="my-post-url" />
          </Field>
          <Field label="Category">
            <input value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls} placeholder="e.g. Grooming Tips" />
          </Field>
        </div>

        <Field label="Excerpt / summary">
          <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} maxLength={500} className={`${inputCls} resize-none`}></textarea>
        </Field>

        <ImageUploader
          value={form.cover_image}
          onChange={(url) => set("cover_image", url)}
          label="Cover image"
          folder="blog"
          height="h-40"
        />

        <Field label="Content" hint="Plain text. Line breaks are preserved and each line becomes a paragraph.">
          <textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={10} className={`${inputCls} resize-y font-mono text-[13px]`}></textarea>
        </Field>

        <Field label="Tags" hint="Comma separated.">
          <input value={form.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} placeholder="dogs, grooming, care" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="SEO title (optional)">
            <input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={`${inputCls} cursor-pointer`}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>

        <Field label="SEO meta description (optional)">
          <textarea value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} rows={2} maxLength={300} className={`${inputCls} resize-none`}></textarea>
        </Field>
      </div>
    </Modal>
  );
}