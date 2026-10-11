import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import HeroCarousel from "@/components/feature/HeroCarousel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useBlogPosts } from "@/hooks/useBlog";

const blogSlides = [
  {
    image: "https://readdy.ai/api/search-image?query=cozy%20warm%20reading%20corner%20with%20deep%20purple%20throw%20blanket%20draped%20over%20an%20armchair%2C%20several%20pet%20care%20and%20dog%20grooming%20books%20stacked%20on%20a%20rustic%20wooden%20coffee%20table%2C%20soft%20natural%20window%20light%20streaming%20in%2C%20calm%20peaceful%20aesthetic%2C%20editorial%20home%20photography&width=1920&height=900&seq=blog-hero-slide-01&orientation=landscape&nocache=true",
    alt: "Cozy pet care reading corner",
  },
  {
    image: "https://readdy.ai/api/search-image?query=professional%20pet%20grooming%20tools%20and%20brushes%20arranged%20beautifully%20on%20a%20warm%20wooden%20surface%20with%20deep%20purple%20background%2C%20scissors%20combs%20and%20natural%20grooming%20products%2C%20editorial%20product%20photography%2C%20clean%20minimal%20aesthetic%2C%20warm%20lighting&width=1920&height=900&seq=blog-hero-slide-02&orientation=landscape&nocache=true",
    alt: "Professional grooming tools arrangement",
  },
  {
    image: "https://readdy.ai/api/search-image?query=happy%20fluffy%20golden%20retriever%20lying%20peacefully%20next%20to%20an%20open%20laptop%20on%20a%20deep%20purple%20rug%20in%20a%20cozy%20modern%20living%20room%2C%20warm%20afternoon%20sunlight%2C%20suggesting%20online%20pet%20care%20research%2C%20calm%20home%20atmosphere%2C%20lifestyle%20pet%20photography&width=1920&height=900&seq=blog-hero-slide-03&orientation=landscape&nocache=true",
    alt: "Happy dog with pet care content",
  },
];

function RevealWrap({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
}

export default function BlogListing() {
  const { t } = useTranslation();
  const { posts } = useBlogPosts();
  const featured = posts.filter((a) => a.featured);
  const rest = posts.filter((a) => !a.featured);

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        {/* Hero with carousel background */}
        <HeroCarousel slides={blogSlides} interval={4500}>
          <div className="animate-text-reveal" style={{ animationDelay: "0.2s" }}>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground-700 font-semibold flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-foreground-700"></span>
              BLOG
            </p>
          </div>
          <h1 className="font-heading text-2xl md:text-5xl text-foreground-950 leading-tight animate-text-reveal" style={{ animationDelay: "0.35s" }}>
            {t("blog.hero_title")}
          </h1>
          <p className="mt-6 text-foreground-900/90 text-lg leading-relaxed max-w-2xl mx-auto animate-text-reveal" style={{ animationDelay: "0.5s" }}>
            {t("blog.hero_subtitle")}
          </p>
        </HeroCarousel>

        {/* Featured Articles */}
        <RevealWrap>
          <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
            <div className="max-w-7xl mx-auto">
              {featured.length > 0 && (
              <div className="reveal-stagger is-visible grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
                {featured.map((article) => (
                  <Link
                    key={article.slug}
                    to={`/blog/${article.slug}`}
                    className="group card-lift rounded-2xl md:rounded-3xl overflow-hidden bg-background-100 border border-background-200/70 transition-colors hover:border-primary-400 cursor-pointer"
                  >
                    <div className="h-44 md:h-64 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="img-zoom w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 md:p-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-accent-100 text-accent-800">
                          {t("blog.featured")}
                        </span>
                        <span className="text-xs text-foreground-500">{article.date}</span>
                        <span className="text-xs text-foreground-500">· {article.readTime} {t("blog.min_read")}</span>
                      </div>
                      <h2 className="font-heading text-xl md:text-2xl text-foreground-950 group-hover:text-accent-500 transition-colors">{article.title}</h2>
                      <p className="mt-3 text-foreground-700 leading-relaxed text-sm">{article.excerpt}</p>
                      <p className="mt-4 text-xs text-foreground-500">By {article.author}</p>
                    </div>
                  </Link>
                ))}
                </div>
              )}

              {/* All Articles */}
              <div className="reveal-stagger is-visible grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {rest.map((article) => (
                  <Link
                    key={article.slug}
                    to={`/blog/${article.slug}`}
                    className="group card-lift rounded-2xl md:rounded-3xl overflow-hidden bg-background-100 border border-background-200/70 transition-colors hover:border-primary-400 cursor-pointer"
                  >
                    <div className="h-40 md:h-52 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="img-zoom w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-foreground-500">{article.category}</span>
                        <span className="text-xs text-foreground-400">·</span>
                        <span className="text-xs text-foreground-500">{article.readTime} {t("blog.min_read")}</span>
                      </div>
                      <h3 className="font-heading text-lg text-foreground-950 group-hover:text-accent-500 transition-colors">{article.title}</h3>
                      <p className="mt-2 text-foreground-700 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                      <p className="mt-3 text-xs text-foreground-500">By {article.author} · {article.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </RevealWrap>
      </PageTransition>
      <Footer />
    </main>
  );
}