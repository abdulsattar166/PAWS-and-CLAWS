import { Card } from "./AdminUi";
import { DEFAULT_CONTACT } from "@/lib/pageContent";
import {
  SaveBar,
  SlideListEditor,
  SocialListEditor,
  StringListEditor,
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

export default function ContactEditor() {
  const { draft, patch, save, saving, saved, error } = usePageDraft("contact");
  const s = draft.sections;

  return (
    <div className="space-y-5 admin-fade">
      <Block icon="ri-layout-masonry-line" title="Page sections — show or hide">
        <p className="text-[11px] text-foreground-500">
          Turn any Contact page section on or off. Hidden sections disappear from the live website instantly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <ToggleField label="Hero section" checked={s.hero} onChange={(v) => patch({ sections: { ...s, hero: v } })} />
          <ToggleField label="Contact information" checked={s.info} onChange={(v) => patch({ sections: { ...s, info: v } })} />
          <ToggleField label="Message form" checked={s.form} onChange={(v) => patch({ sections: { ...s, form: v } })} />
          <ToggleField label="Follow us section" checked={s.follow} onChange={(v) => patch({ sections: { ...s, follow: v } })} />
          <ToggleField label="Service area / map" checked={s.map} onChange={(v) => patch({ sections: { ...s, map: v } })} />
          <ToggleField label="Booking call-to-action" checked={s.bookCta} onChange={(v) => patch({ sections: { ...s, bookCta: v } })} />
        </div>
      </Block>

      <Block icon="ri-movie-2-line" title="Hero section">
        <TextField label="Hero title" value={draft.heroTitle} onChange={(v) => patch({ heroTitle: v })} placeholder={DEFAULT_CONTACT.heroTitle} />
        <TextAreaField label="Hero subtitle" value={draft.heroSubtitle} onChange={(v) => patch({ heroSubtitle: v })} placeholder={DEFAULT_CONTACT.heroSubtitle} />
        <SlideListEditor items={draft.heroSlides} onChange={(v) => patch({ heroSlides: v })} folder="contact/hero" />
      </Block>

      <Block icon="ri-contacts-line" title="Section headings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Info column title" value={draft.infoTitle} onChange={(v) => patch({ infoTitle: v })} placeholder={DEFAULT_CONTACT.infoTitle} />
          <TextField label="Form column title" value={draft.formTitle} onChange={(v) => patch({ formTitle: v })} placeholder={DEFAULT_CONTACT.formTitle} />
        </div>
        <p className="text-[11px] text-foreground-500">
          The contact phone, WhatsApp, email, address and opening hours are managed under <strong>Website Settings</strong>.
        </p>
      </Block>

      <Block icon="ri-map-pin-line" title="Service area & map">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Section title" value={draft.mapTitle} onChange={(v) => patch({ mapTitle: v })} placeholder={DEFAULT_CONTACT.mapTitle} />
          <TextField label="Map search query" value={draft.mapQuery} onChange={(v) => patch({ mapQuery: v })} placeholder={DEFAULT_CONTACT.mapQuery} hint="Leave as-is to pin both Abu Dhabi and Al Ain. Enter any other place to centre the map there instead." />
        </div>
        <StringListEditor
          items={draft.serviceAreaItems}
          onChange={(v) => patch({ serviceAreaItems: v })}
          title="Areas we serve"
          desc="The list of neighbourhoods and cities shown beside the map."
          placeholder="e.g. Yas Island"
          addLabel="Add area"
        />
      </Block>

      <Block icon="ri-share-line" title="Follow us section">
        <TextField label="Label" value={draft.followLabel} onChange={(v) => patch({ followLabel: v })} />
        <TextField label="Section title" value={draft.followTitle} onChange={(v) => patch({ followTitle: v })} />
        <TextAreaField label="Section subtitle" value={draft.followSubtitle} onChange={(v) => patch({ followSubtitle: v })} />
        <SocialListEditor items={draft.socials} onChange={(v) => patch({ socials: v })} />
      </Block>

      <Block icon="ri-calendar-check-line" title="Booking call-to-action">
        <TextField label="Label" value={draft.bookLabel} onChange={(v) => patch({ bookLabel: v })} />
        <TextField label="Heading" value={draft.bookHeading} onChange={(v) => patch({ bookHeading: v })} />
        <TextAreaField label="Subtitle" value={draft.bookSubtitle} onChange={(v) => patch({ bookSubtitle: v })} />
        <TextField label="Button label" value={draft.bookButton} onChange={(v) => patch({ bookButton: v })} hint="The button always links to the booking page." />
      </Block>

      <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  );
}