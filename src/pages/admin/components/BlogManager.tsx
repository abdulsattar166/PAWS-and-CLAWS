import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDateTime, type BlogPostRow } from "@/lib/adminTypes";
import { Card, EmptyState, ErrorState, Spinner, StatusPill, Modal, btnPrimary, btnGhost, btnDanger } from "./AdminUi";
import BlogForm from "./BlogForm";

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<BlogPostRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<BlogPostRow | null>(null);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const { data, error: err } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setPosts((data ?? []) as BlogPostRow[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load posts.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => posts.filter((p) => filter === "all" || p.status === filter),
    [posts, filter],
  );

  const togglePublish = async (p: BlogPostRow) => {
    if (!supabase) return;
    setBusyId(p.id);
    const publishing = p.status !== "published";
    const { error: err } = await supabase
      .from("blog_posts")
      .update({
        status: publishing ? "published" : "draft",
        published_at: publishing ? (p.published_at ?? new Date().toISOString()) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", p.id);
    setBusyId("");
    if (!err) {
      setPosts((prev) =>
        prev.map((x) =>
          x.id === p.id
            ? { ...x, status: publishing ? "published" : "draft", published_at: publishing ? (x.published_at ?? new Date().toISOString()) : null }
            : x,
        ),
      );
    }
  };

  const doDelete = async () => {
    if (!supabase || !confirmDelete) return;
    setBusyId(confirmDelete.id);
    const { error: err } = await supabase.from("blog_posts").delete().eq("id", confirmDelete.id);
    setBusyId("");
    if (!err) {
      setPosts((prev) => prev.filter((x) => x.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap cursor-pointer capitalize ${filter === f ? "bg-primary-500 text-foreground-50 border-primary-500" : "bg-background-50 text-foreground-700 border-background-200 hover:border-primary-300"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setCreating(true)} className={btnPrimary}>
          <i className="ri-add-line" aria-hidden="true"></i> New post
        </button>
      </Card>

      <Card>
        {status === "loading" && <Spinner label="Loading posts…" />}
        {status === "error" && <ErrorState text={error} onRetry={load} />}
        {status === "ready" && filtered.length === 0 && <EmptyState icon="ri-article-line" title="No blog posts" text="Write your first article to share grooming tips and news." />}
        {status === "ready" && filtered.length > 0 && (
          <ul className="divide-y divide-background-200/70">
            {filtered.map((p) => (
              <li key={p.id} className="px-4 md:px-5 py-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground-950">{p.title}</span>
                      {p.status === "published" ? <StatusPill label="Published" tone="ok" icon="ri-check-line" /> : <StatusPill label="Draft" tone="warn" icon="ri-draft-line" />}
                      {p.category && <StatusPill label={p.category} tone="neut" />}
                    </div>
                    <p className="mt-1 text-sm text-foreground-700 truncate">/{p.slug}</p>
                    <p className="mt-0.5 text-[11px] text-foreground-500">Updated {formatDateTime(p.updated_at)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => togglePublish(p)} disabled={busyId === p.id} className={btnGhost}>
                      <i className={p.status === "published" ? "ri-eye-off-line" : "ri-send-plane-line"} aria-hidden="true"></i>
                      {p.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" onClick={() => setEditing(p)} className={btnGhost}>
                      <i className="ri-edit-line" aria-hidden="true"></i> Edit
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(p)} className={`${btnDanger} px-3`}>
                      <i className="ri-delete-bin-line" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {(creating || editing) && (
        <BlogForm post={editing} onClose={() => { setCreating(false); setEditing(null); }} onSaved={load} />
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete post"
        footer={
          <>
            <button type="button" onClick={() => setConfirmDelete(null)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={doDelete} disabled={busyId === confirmDelete?.id} className={btnDanger}>
              <i className="ri-delete-bin-line" aria-hidden="true"></i> Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-700">Delete <strong>{confirmDelete?.title}</strong>? This cannot be undone.</p>
      </Modal>
    </div>
  );
}