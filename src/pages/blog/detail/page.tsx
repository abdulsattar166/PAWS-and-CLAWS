import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlog";
import NotFound from "@/pages/NotFound";

function RevealWrap({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
}

export default function BlogDetail() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { post: article, loading } = useBlogPost(slug);
  const { posts } = useBlogPosts();

  if (loading) {
    return (
      <main className="min-h-screen bg-background-50 flex items-center justify-center">
        <span className="w-10 h-10 rounded-full border-2 border-primary-500/25 border-t-primary-500 animate-spin block"></span>
      </main>
    );
  }

  if (!article) {
    return <NotFound />;
  }

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        <article>
          {/* Hero with image */}
          <section className="relative pt-28 pb-12 md:pt-48 md:pb-20 px-4 md:px-10">
            <div className="absolute inset-0 top-0 h-[14rem] md:h-[320px] lg:h-[500px]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background-100/70 via-background-50/80 to-background-50"></div>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto pt-20 md:pt-40">
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground-700 hover:text-accent-500 cursor-pointer mb-6"
              >
                <i className="ri-arrow-left-line arrow-nudge" aria-hidden="true"></i>
                {t("blog.back")}
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary-100 text-primary-800">
                  {article.category}
                </span>
                <span className="text-xs text-foreground-500">{article.date}</span>
                <span className="text-xs text-foreground-500">· {article.readTime} {t("blog.min_read")}</span>
              </div>
              <h1 className="font-heading text-2xl md:text-5xl text-foreground-950 leading-tight">{article.title}</h1>
              <p className="mt-4 text-sm text-foreground-600">By {article.author}</p>
            </div>
          </section>

          {/* Content */}
          <RevealWrap>
            <section className="py-10 md:py-16 px-4 md:px-10 bg-background-50/92">
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  {article.content.map((paragraph, i) => (
                    <p key={i} className="text-foreground-700 leading-relaxed text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-16 pt-10 border-t border-background-200/70">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/blog"
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-500 hover:text-accent-600 cursor-pointer"
                    >
                      <i className="ri-arrow-left-line arrow-nudge" aria-hidden="true"></i>
                      {t("blog.back")}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground-500">{t("blog.share")}:</span>
                      {(() => {
                        const shareUrl = typeof window !== "undefined" ? window.location.href : "";
                        const shareText = article?.title ?? "";
                        const links = [
                          { icon: "ri-facebook-fill", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                          { icon: "ri-twitter-x-line", label: "Twitter", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
                          { icon: "ri-whatsapp-line", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}` },
                        ];
                        return links.map((s) => (
                          <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            className="btn-pulse w-9 h-9 rounded-full bg-background-100 border border-background-200/70 text-foreground-600 hover:bg-primary-500 hover:text-foreground-50 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <i className={s.icon} aria-hidden="true"></i>
                          </a>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </RevealWrap>

          {/* Related Articles */}
          <RevealWrap>
            <section className="py-14 md:py-24 px-4 md:px-10 bg-background-100/88">
              <div className="max-w-7xl mx-auto">
                <h2 className="font-heading text-3xl text-foreground-950 text-center mb-10">{t("blog.related")}</h2>
                <div className="reveal-stagger is-visible grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {posts
                    .filter((a) => a.slug !== article.slug)
                    .slice(0, 3)
                    .map((related) => (
                      <Link
                        key={related.slug}
                        to={`/blog/${related.slug}`}
                        className="group card-lift rounded-2xl md:rounded-3xl overflow-hidden bg-background-50 border border-background-200/70 transition-colors hover:border-primary-400 cursor-pointer"
                      >
                        <div className="h-40 md:h-48 overflow-hidden">
                          <img
                            src={related.image}
                            alt={related.title}
                            className="img-zoom w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-5">
                          <p className="text-xs text-foreground-500">{related.category} · {related.readTime} {t("blog.min_read")}</p>
                          <h3 className="mt-2 font-heading text-base text-foreground-950 group-hover:text-accent-500 transition-colors">{related.title}</h3>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </section>
          </RevealWrap>
        </article>
      </PageTransition>
      <Footer />
    </main>
  );
}