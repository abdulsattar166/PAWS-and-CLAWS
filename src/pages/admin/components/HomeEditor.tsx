import { Card } from "./AdminUi";
import ImageUploader from "./ImageUploader";
import { DEFAULT_HOME } from "@/lib/pageContent";
import {
  IconListEditor,
  NumberField,
  SaveBar,
  SlideListEditor,
  StatListEditor,
  TextAreaField,
  TextField,
  ToggleField,
} from "./PageEditorFields";
import { usePageDraft } from "./usePageDraft";

function Block({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
          <i className={`${icon} text-lg`} aria-hidden="true"></i>
        </span>
        <h3 className="font-heading text-lg text-foreground-950">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

export default function HomeEditor() {
  const { draft, patch, save, saving, saved, error } = usePageDraft("home");
  const s = draft.sections;

  return (
    <div className="space-y-5 admin-fade">
      <Block icon="ri-layout-masonry-line" title="Page sections — show or hide">
        <p className="text-[11px] text-foreground-500">
          Turn any Home page section on or off. Hidden sections disappear from the live website instantly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <ToggleField label="Hero section" checked={s.hero} onChange={(v) => patch({ sections: { ...s, hero: v } })} />
          <ToggleField label="About / introduction" checked={s.about} onChange={(v) => patch({ sections: { ...s, about: v } })} />
          <ToggleField label="Our services" checked={s.services} onChange={(v) => patch({ sections: { ...s, services: v } })} />
          <ToggleField label="How it works" checked={s.howItWorks} onChange={(v) => patch({ sections: { ...s, howItWorks: v } })} />
          <ToggleField label="Why choose us" checked={s.whyUs} onChange={(v) => patch({ sections: { ...s, whyUs: v } })} />
          <ToggleField label="Packages / pricing" checked={s.packages} onChange={(v) => patch({ sections: { ...s, packages: v } })} />
          <ToggleField label="Gallery preview" checked={s.gallery} onChange={(v) => patch({ sections: { ...s, gallery: v } })} />
        </div>
      </Block>

      <Block icon="ri-movie-2-line" title="Hero section">
        <TextField label="Badge text" value={draft.heroBadge} onChange={(v) => patch({ heroBadge: v })} placeholder={DEFAULT_HOME.heroBadge} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Headline — line 1" value={draft.heroTitle1} onChange={(v) => patch({ heroTitle1: v })} placeholder={DEFAULT_HOME.heroTitle1} />
          <TextField label="Headline — line 2 (italic)" value={draft.heroTitle2} onChange={(v) => patch({ heroTitle2: v })} placeholder={DEFAULT_HOME.heroTitle2} />
        </div>
        <TextAreaField label="Subtitle" value={draft.heroSubtitle} onChange={(v) => patch({ heroSubtitle: v })} placeholder={DEFAULT_HOME.heroSubtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Primary button label" value={draft.ctaBook} onChange={(v) => patch({ ctaBook: v })} placeholder={DEFAULT_HOME.ctaBook} />
          <TextField label="Primary button link" value={draft.ctaBookHref} onChange={(v) => patch({ ctaBookHref: v })} placeholder="/booking" />
          <TextField label="Secondary button label" value={draft.ctaExplore} onChange={(v) => patch({ ctaExplore: v })} placeholder={DEFAULT_HOME.ctaExplore} />
          <TextField label="Secondary button link" value={draft.ctaExploreHref} onChange={(v) => patch({ ctaExploreHref: v })} placeholder="/services" />
        </div>
        <SlideListEditor items={draft.heroSlides} onChange={(v) => patch({ heroSlides: v })} folder="home/hero" />
      </Block>

      <Block icon="ri-image-line" title="About / introduction section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Heading" value={draft.aboutHeading} onChange={(v) => patch({ aboutHeading: v })} placeholder={DEFAULT_HOME.aboutHeading} />
          <TextField label="Heading (italic highlight)" value={draft.aboutHeadingItalic} onChange={(v) => patch({ aboutHeadingItalic: v })} placeholder={DEFAULT_HOME.aboutHeadingItalic} />
        </div>
        <TextAreaField label="Paragraph 1" value={draft.aboutP1} onChange={(v) => patch({ aboutP1: v })} placeholder={DEFAULT_HOME.aboutP1} />
        <TextAreaField label="Paragraph 2" value={draft.aboutP2} onChange={(v) => patch({ aboutP2: v })} placeholder={DEFAULT_HOME.aboutP2} />
        <ImageUploader
          value={draft.aboutImage}
          onChange={(url) => patch({ aboutImage: url })}
          label="About section image"
          folder="home/about"
          height="h-48"
        />
        <StatListEditor items={draft.stats} onChange={(v) => patch({ stats: v })} />
      </Block>

      <Block icon="ri-scissors-cut-line" title="Our services section">
        <p className="text-[11px] text-foreground-500">
          The service cards themselves are pulled live from <strong>Services Management</strong> — add or edit a service there and it appears here automatically.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label" value={draft.servicesLabel} onChange={(v) => patch({ servicesLabel: v })} />
          <TextField label="Heading (italic highlight)" value={draft.servicesHeadingItalic} onChange={(v) => patch({ servicesHeadingItalic: v })} />
        </div>
        <TextField label="Heading" value={draft.servicesHeading} onChange={(v) => patch({ servicesHeading: v })} />
        <TextAreaField label="Subtitle" value={draft.servicesSubtitle} onChange={(v) => patch({ servicesSubtitle: v })} />
      </Block>

      <Block icon="ri-list-ordered-2" title="How it works section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label" value={draft.howLabel} onChange={(v) => patch({ howLabel: v })} />
          <TextField label="Heading (italic highlight)" value={draft.howHeadingItalic} onChange={(v) => patch({ howHeadingItalic: v })} />
        </div>
        <TextField label="Heading" value={draft.howHeading} onChange={(v) => patch({ howHeading: v })} />
        <IconListEditor
          items={draft.howSteps}
          onChange={(v) => patch({ howSteps: v })}
          title="Steps"
          desc="Add, edit, reorder or remove each step. The step numbers update automatically."
        />
      </Block>

      <Block icon="ri-award-line" title="Why choose us section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label" value={draft.whyLabel} onChange={(v) => patch({ whyLabel: v })} />
          <TextField label="Heading (italic highlight)" value={draft.whyHeadingItalic} onChange={(v) => patch({ whyHeadingItalic: v })} />
        </div>
        <TextField label="Heading" value={draft.whyHeading} onChange={(v) => patch({ whyHeading: v })} />
        <TextAreaField label="Intro paragraph" value={draft.whySubtitle} onChange={(v) => patch({ whySubtitle: v })} />
        <IconListEditor
          items={draft.whyItems}
          onChange={(v) => patch({ whyItems: v })}
          title="Benefits"
          desc="Each card shown in this section. Add, edit, reorder or remove."
        />
      </Block>

      <Block icon="ri-image-2-line" title="Gallery preview section">
        <p className="text-[11px] text-foreground-500">
          Photos come from <strong>Gallery Management</strong> — featured images show first. Choose how many appear here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label" value={draft.galleryLabel} onChange={(v) => patch({ galleryLabel: v })} />
          <TextField label="Heading (italic highlight)" value={draft.galleryHeadingItalic} onChange={(v) => patch({ galleryHeadingItalic: v })} />
        </div>
        <TextField label="Heading" value={draft.galleryHeading} onChange={(v) => patch({ galleryHeading: v })} />
        <NumberField label="Number of photos to show" value={draft.galleryCount} onChange={(v) => patch({ galleryCount: v })} min={3} max={12} hint="Between 3 and 12." />
      </Block>

      <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  );
}