import { Card } from "./AdminUi";
import ImageUploader from "./ImageUploader";
import { DEFAULT_ABOUT } from "@/lib/pageContent";
import {
  IconListEditor,
  JourneyListEditor,
  SaveBar,
  SlideListEditor,
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

export default function AboutEditor() {
  const { draft, patch, save, saving, saved, error } = usePageDraft("about");
  const s = draft.sections;

  return (
    <div className="space-y-5 admin-fade">
      <Block icon="ri-layout-masonry-line" title="Page sections — show or hide">
        <p className="text-[11px] text-foreground-500">
          Turn any About page section on or off. Hidden sections disappear from the live website instantly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <ToggleField label="Hero section" checked={s.hero} onChange={(v) => patch({ sections: { ...s, hero: v } })} />
          <ToggleField label="Mission & vision" checked={s.mission} onChange={(v) => patch({ sections: { ...s, mission: v } })} />
          <ToggleField label="Our story" checked={s.story} onChange={(v) => patch({ sections: { ...s, story: v } })} />
          <ToggleField label="Our journey (timeline)" checked={s.journey} onChange={(v) => patch({ sections: { ...s, journey: v } })} />
          <ToggleField label="Why choose us" checked={s.why} onChange={(v) => patch({ sections: { ...s, why: v } })} />
          <ToggleField label="Our core values" checked={s.core} onChange={(v) => patch({ sections: { ...s, core: v } })} />
          <ToggleField label="What we believe in" checked={s.values} onChange={(v) => patch({ sections: { ...s, values: v } })} />
        </div>
      </Block>

      <Block icon="ri-movie-2-line" title="Hero section">
        <TextField label="Hero title" value={draft.heroTitle} onChange={(v) => patch({ heroTitle: v })} placeholder={DEFAULT_ABOUT.heroTitle} />
        <TextAreaField label="Hero subtitle" value={draft.heroSubtitle} onChange={(v) => patch({ heroSubtitle: v })} placeholder={DEFAULT_ABOUT.heroSubtitle} />
        <SlideListEditor items={draft.heroSlides} onChange={(v) => patch({ heroSlides: v })} folder="about/hero" />
      </Block>

      <Block icon="ri-focus-2-line" title="Mission & Vision">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Mission title" value={draft.missionTitle} onChange={(v) => patch({ missionTitle: v })} />
          <TextField label="Vision title" value={draft.visionTitle} onChange={(v) => patch({ visionTitle: v })} />
        </div>
        <TextAreaField label="Mission text" value={draft.missionText} onChange={(v) => patch({ missionText: v })} />
        <TextAreaField label="Vision text" value={draft.visionText} onChange={(v) => patch({ visionText: v })} />
      </Block>

      <Block icon="ri-book-open-line" title="Our story">
        <TextField label="Story heading" value={draft.storyTitle} onChange={(v) => patch({ storyTitle: v })} />
        <TextAreaField label="Paragraph 1" value={draft.storyP1} onChange={(v) => patch({ storyP1: v })} />
        <TextAreaField label="Paragraph 2" value={draft.storyP2} onChange={(v) => patch({ storyP2: v })} />
        <TextAreaField label="Paragraph 3" value={draft.storyP3} onChange={(v) => patch({ storyP3: v })} />
        <ImageUploader
          value={draft.storyImage}
          onChange={(url) => patch({ storyImage: url })}
          label="Story image"
          folder="about/story"
          height="h-48"
        />
      </Block>

      <Block icon="ri-history-line" title="Our journey (timeline)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label" value={draft.journeyLabel} onChange={(v) => patch({ journeyLabel: v })} />
          <TextField label="Heading" value={draft.journeyTitle} onChange={(v) => patch({ journeyTitle: v })} />
        </div>
        <TextAreaField label="Subtitle" value={draft.journeySubtitle} onChange={(v) => patch({ journeySubtitle: v })} />
        <JourneyListEditor
          items={draft.journeyItems}
          onChange={(v) => patch({ journeyItems: v })}
          title="Milestones"
          desc="Add, edit, reorder or remove timeline entries."
        />
      </Block>

      <Block icon="ri-award-line" title="The Paws & Claws difference">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label" value={draft.whyLabel} onChange={(v) => patch({ whyLabel: v })} />
          <TextField label="Section title" value={draft.whyTitle} onChange={(v) => patch({ whyTitle: v })} />
        </div>
        <TextAreaField label="Section subtitle" value={draft.whySubtitle} onChange={(v) => patch({ whySubtitle: v })} />
        <IconListEditor items={draft.whyItems} onChange={(v) => patch({ whyItems: v })} title="Feature items" desc="Add, edit, reorder or remove individual features." />
      </Block>

      <Block icon="ri-medal-line" title="Our core values">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label" value={draft.coreLabel} onChange={(v) => patch({ coreLabel: v })} />
          <TextField label="Section title" value={draft.coreTitle} onChange={(v) => patch({ coreTitle: v })} />
        </div>
        <TextAreaField label="Section subtitle" value={draft.coreSubtitle} onChange={(v) => patch({ coreSubtitle: v })} />
        <IconListEditor items={draft.coreItems} onChange={(v) => patch({ coreItems: v })} title="Value items" desc="Each core value shown in the grid." />
      </Block>

      <Block icon="ri-heart-3-line" title="What we believe in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label" value={draft.valuesLabel} onChange={(v) => patch({ valuesLabel: v })} />
          <TextField label="Section title" value={draft.valuesTitle} onChange={(v) => patch({ valuesTitle: v })} />
        </div>
        <IconListEditor items={draft.valuesItems} onChange={(v) => patch({ valuesItems: v })} title="Belief items" desc="The belief cards shown at the bottom." />
      </Block>

      <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  );
}