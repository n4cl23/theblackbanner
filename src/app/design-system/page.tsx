import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  BannerTitleTreatment,
  CinematicSection,
  FramedArtwork,
  KingdomSigil,
  LoreChapterHeading,
  MetallicNavigation,
  ParchmentBlock,
  RuneMarker,
} from '@/components/shared/asterheim';
import {
  Drawer,
  ImageWithFallback,
  Modal,
  Tabs,
} from '@/components/ui/interactive';
import {
  Accordion,
  Badge,
  Breadcrumb,
  Button,
  Container,
  Divider,
  EmptyState,
  ErrorState,
  Eyebrow,
  FullBleedSection,
  IconButton,
  LinkButton,
  LoadingState,
  LorePanel,
  MediaFrame,
  OrnamentalDivider,
  QuoteBlock,
  SectionHeading,
  Skeleton,
  SkipLink,
  Surface,
  Tag,
  Tooltip,
  VideoFrame,
} from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Internal showcase for the Asterheim visual language.',
  robots: { index: false, follow: false },
};

const colors = [
  ['Black', '#050505'],
  ['Coal', '#0a0a09'],
  ['Iron', '#262724'],
  ['Stone', '#67675f'],
  ['Parchment', '#d4c8ab'],
  ['Ivory', '#eee9dc'],
  ['Aged gold', '#a88a45'],
  ['Bronze', '#79572f'],
  ['Blood', '#681d1d'],
  ['Ember', '#a83d1f'],
] as const;

const tokenGroups = [
  {
    title: 'Spacing',
    values: ['4', '8', '12', '16', '24', '32', '48', '64', '96'],
  },
  { title: 'Radii', values: ['0', '2px', '4px'] },
  { title: 'Motion', values: ['140ms', '260ms', '560ms'] },
  {
    title: 'Layers',
    values: ['0 base', '20 sticky', '60 overlay', '80 modal', '100 toast'],
  },
] as const;

function ShowcaseGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="scroll-mt-24 py-16"
      id={title.toLowerCase().replaceAll(' ', '-')}
    >
      <SectionHeading eyebrow="Component family" title={title} />
      <div className="mt-10">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  if (process.env.DESIGN_SYSTEM_ENABLED === 'false') notFound();

  return (
    <>
      <SkipLink />
      <MetallicNavigation
        items={[
          { label: 'Tokens', href: '#tokens' },
          { label: 'Primitives', href: '#primitives' },
          { label: 'Interactive', href: '#interactive' },
          { label: 'Asterheim', href: '#asterheim-components' },
        ]}
      />
      <main id="main-content">
        <FullBleedSection className="min-h-[70vh] border-b border-stone-600/20 bg-[radial-gradient(circle_at_50%_20%,rgba(168,138,69,0.12),transparent_32%)]">
          <Container>
            <Breadcrumb
              items={[
                { label: 'Internal', href: '/' },
                { label: 'Design system' },
              ]}
            />
            <BannerTitleTreatment
              eyebrow="System codex · Sprint 01"
              title="Asterheim"
              subtitle="A visual grammar forged from iron, ash, and memory."
            />
            <p className="text-parchment-200/60 mx-auto max-w-2xl text-center text-sm">
              This route contains mock labels and technical examples only. It
              does not establish official lore.
            </p>
          </Container>
        </FullBleedSection>

        <Container>
          <section className="scroll-mt-24 py-20" id="tokens">
            <SectionHeading
              eyebrow="Foundation"
              title="Tokens"
              description="A restrained palette and sharp geometry keep the interface cinematic without becoming ornamental noise."
            />
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {colors.map(([name, value]) => (
                <div key={name}>
                  <div
                    className="aspect-[4/3] border border-stone-600/30"
                    style={{ backgroundColor: value }}
                  />
                  <p className="text-ivory-100 mt-3 text-sm">{name}</p>
                  <code className="text-parchment-200/45 text-xs">{value}</code>
                </div>
              ))}
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <Surface>
                <Eyebrow>Typography</Eyebrow>
                <p className="font-display mt-5 text-5xl leading-tight">
                  Monumental title
                </p>
                <p className="font-subtitle text-parchment-200 mt-4 text-3xl italic">
                  A literary subtitle in the margins
                </p>
                <p className="text-parchment-200/70 mt-5 max-w-xl text-base">
                  Reading text remains clear, calm, and generous even when the
                  surrounding interface carries weight and atmosphere.
                </p>
              </Surface>
              <div className="grid grid-cols-2 gap-3">
                {tokenGroups.map((group) => (
                  <Surface className="p-4" key={group.title}>
                    <p className="text-aged-gold-500 text-xs font-bold tracking-wider uppercase">
                      {group.title}
                    </p>
                    <ul className="text-parchment-200/60 mt-3 space-y-1 text-xs">
                      {group.values.map((value) => (
                        <li key={value}>{value}</li>
                      ))}
                    </ul>
                  </Surface>
                ))}
              </div>
            </div>
          </section>

          <Divider />
          <ShowcaseGroup title="Primitives">
            <div className="grid gap-10">
              <Surface>
                <Eyebrow>Actions</Eyebrow>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button tone="gold">Primary action</Button>
                  <Button tone="blood">Danger action</Button>
                  <Button>Iron action</Button>
                  <Button disabled>Disabled</Button>
                  <LinkButton href="#tokens">Link action</LinkButton>
                  <Tooltip label="A compact accessible control">
                    <IconButton aria-label="Mark location">✦</IconButton>
                  </Tooltip>
                </div>
              </Surface>
              <div className="grid gap-8 lg:grid-cols-2">
                <Surface>
                  <SectionHeading
                    eyebrow="Eyebrow"
                    title="Section heading"
                    description="Hierarchy remains readable over quiet surfaces."
                  />
                  <OrnamentalDivider className="mt-8" />
                  <Divider className="mt-8" />
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Tag>Creature</Tag>
                    <Tag>Archive</Tag>
                    <Badge>New</Badge>
                    <Badge tone="blood">Threat</Badge>
                  </div>
                </Surface>
                <LorePanel title="Lore panel">
                  <p>
                    Mock editorial copy demonstrates hierarchy without asserting
                    canonical facts.
                  </p>
                </LorePanel>
                <QuoteBlock
                  quote="A placeholder line carried through the ash."
                  cite="Mock inscription"
                />
                <Accordion
                  items={[
                    {
                      title: 'First archive entry',
                      content:
                        'Native details preserve keyboard operation without client JavaScript.',
                    },
                    {
                      title: 'Second archive entry',
                      content:
                        'Expanded state is communicated structurally and visually.',
                    },
                  ]}
                />
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <LoadingState label="Loading archive" />
                <EmptyState
                  title="No records"
                  description="No approved content is available."
                />
                <ErrorState
                  title="Archive unavailable"
                  description="Try again when the signal returns."
                />
              </div>
              <Surface>
                <div className="grid gap-3">
                  <Skeleton className="h-7 w-2/5" />
                  <Skeleton className="w-full" />
                  <Skeleton className="w-4/5" />
                </div>
              </Surface>
              <div className="grid gap-8 lg:grid-cols-2">
                <MediaFrame caption="Neutral media frame">
                  <div className="from-iron-800 text-parchment-200/50 grid aspect-video place-items-center bg-gradient-to-br to-black">
                    Media placeholder
                  </div>
                </MediaFrame>
                <VideoFrame title="Video frame — no official media" />
              </div>
            </div>
          </ShowcaseGroup>

          <Divider />
          <ShowcaseGroup title="Interactive">
            <div className="grid gap-8 lg:grid-cols-2">
              <Surface>
                <Eyebrow>Overlays</Eyebrow>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Modal
                    title="Codex entry"
                    trigger={<Button>Open modal</Button>}
                  >
                    <p>
                      This dialog uses the native dialog element for focus
                      management, Escape handling, and modal semantics.
                    </p>
                  </Modal>
                  <Drawer
                    title="Archive drawer"
                    trigger={<Button>Open drawer</Button>}
                  >
                    <p>
                      A compact side surface for contextual navigation and
                      secondary information.
                    </p>
                  </Drawer>
                </div>
              </Surface>
              <Surface>
                <Tabs
                  items={[
                    {
                      label: 'Runes',
                      content:
                        'Arrow keys, Home, and End move focus between tabs.',
                    },
                    {
                      label: 'Sigils',
                      content:
                        'Selection is never communicated by color alone.',
                    },
                    {
                      label: 'Relics',
                      content:
                        'Only the active panel participates in reading order.',
                    },
                  ]}
                />
              </Surface>
              <Surface className="lg:col-span-2">
                <Eyebrow>Image fallback</Eyebrow>
                <div className="mt-5 max-w-lg">
                  <ImageWithFallback
                    alt="Unavailable mock artwork"
                    fallback="Artwork unavailable"
                    height={450}
                    src="/images/intentional-missing-showcase.webp"
                    width={800}
                  />
                </div>
              </Surface>
            </div>
          </ShowcaseGroup>
        </Container>

        <CinematicSection
          eyebrow="Authored pattern"
          title="Environment before ornament"
        >
          <p>
            The cinematic section reserves broad negative space for interface
            and atmosphere. Its treatment is CSS-only and contains no canonical
            artwork.
          </p>
        </CinematicSection>

        <Container>
          <ShowcaseGroup title="Asterheim components">
            <div className="grid gap-12">
              <div className="flex flex-wrap items-end justify-around gap-10">
                <RuneMarker label="Mock fire rune" symbol="ᚲ" />
                <KingdomSigil name="Mock kingdom" mark="♜" />
                <KingdomSigil name="Unassigned realm" mark="✦" />
              </div>
              <LoreChapterHeading
                chapter="Chapter marker"
                title="The Shape of an Unwritten Age"
              />
              <div className="grid gap-8 lg:grid-cols-2">
                <FramedArtwork caption="Framed artwork placeholder">
                  <div className="text-parchment-200/45 grid min-h-80 place-items-center bg-[radial-gradient(circle_at_60%_40%,rgba(168,61,31,0.22),transparent_25%),linear-gradient(145deg,#262724,#050505)] text-sm">
                    Artwork pending
                  </div>
                </FramedArtwork>
                <ParchmentBlock>
                  <Eyebrow className="text-bronze-600">Parchment block</Eyebrow>
                  <h3 className="font-display mt-4 text-3xl">
                    An editorial surface
                  </h3>
                  <p className="mt-4">
                    Reserved for deliberate excerpts and archival context. High
                    contrast protects long-form readability.
                  </p>
                </ParchmentBlock>
              </div>
            </div>
          </ShowcaseGroup>

          <section className="py-20">
            <SectionHeading
              eyebrow="Motion policy"
              title="Quiet movement, clear purpose"
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Surface className="section-reveal">
                <strong>Section reveal</strong>
                <p className="text-parchment-200/60 mt-2 text-sm">
                  Opacity and short vertical travel.
                </p>
              </Surface>
              <Surface className="fade-in">
                <strong>Fade</strong>
                <p className="text-parchment-200/60 mt-2 text-sm">
                  For contextual appearance.
                </p>
              </Surface>
              <Surface className="text-reveal">
                <strong>Text reveal</strong>
                <p className="text-parchment-200/60 mt-2 text-sm">
                  Restricted to major titles.
                </p>
              </Surface>
              <Surface className="light-parallax">
                <strong>Light parallax</strong>
                <p className="text-parchment-200/60 mt-2 text-sm">
                  Transform-only and optional.
                </p>
              </Surface>
            </div>
            <p className="text-parchment-200/55 mt-8 text-sm">
              All motion tokens collapse to near-zero duration under{' '}
              <code>prefers-reduced-motion: reduce</code>.
            </p>
          </section>
        </Container>
      </main>
    </>
  );
}
