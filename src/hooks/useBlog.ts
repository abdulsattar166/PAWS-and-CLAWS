import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { blogArticles, type BlogArticle } from "@/mocks/blogData";

const FALLBACK_IMAGE =
  "https://readdy.ai/api/search-image?query=professional%20pet%20grooming%20scene%20with%20a%20happy%20fluffy%20dog%20and%20warm%20natural%20light%2C%20editorial%20pet%20photography%2C%20clean%20minimal%20aesthetic&width=1200&height=800&seq=pc-blog-fallback&orientation=landscape";

function formatDate(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function mapRow(row: Record<string, unknown>): BlogArticle {
  const raw = String(row.content ?? "");
  const content = raw.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const words = raw.split(/\s+/).filter(Boolean).length;
  return {
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content: content.length ? content : [String(row.excerpt ?? "")],
    image: (row.cover_image as string) || FALLBACK_IMAGE,
    category: (row.category as string) || "Pet Care",
    author: "Paws and Claws",
    date: formatDate((row.published_at as string) ?? null),
    readTime: String(Math.max(1, Math.round(words / 200))),
    featured: false,
  };
}

/** Published blog posts from the database; falls back to the built-in articles when empty. */
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setPosts(blogArticles);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as Array<Record<string, unknown>>;
      const mapped = rows.length ? rows.map(mapRow) : blogArticles;
      // DB posts carry no "featured" flag — promote the newest so the Featured
      // section on the blog page still renders.
      const anyFeatured = mapped.some((p) => p.featured);
      setPosts(anyFeatured ? mapped : mapped.map((p, i) => (i === 0 ? { ...p, featured: true } : p)));
    } catch {
      setPosts(blogArticles);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { posts, loading };
}

/** A single published post by slug; falls back to the built-in articles. */
export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function run() {
      if (!slug) {
        setLoading(false);
        return;
      }
      if (!supabase) {
        setPost(blogArticles.find((a) => a.slug === slug) ?? null);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();
        if (error) throw error;
        if (!active) return;
        setPost(data ? mapRow(data as Record<string, unknown>) : (blogArticles.find((a) => a.slug === slug) ?? null));
      } catch {
        if (active) setPost(blogArticles.find((a) => a.slug === slug) ?? null);
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [slug]);

  return { post, loading };
}