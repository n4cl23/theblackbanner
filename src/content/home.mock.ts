import type {
  FeaturedCharacter,
  FeaturedCollection,
  FeaturedCreature,
  FeaturedKingdom,
  FeaturedStory,
} from '@/types/home';

// MOCK CONTENT — presentation-only and explicitly non-canonical.
export const featuredKingdoms: readonly FeaturedKingdom[] = [
  {
    id: 'kingdom-ash',
    name: 'The Ashen Reach',
    epithet: 'Realm beyond the drowned road',
    sigil: 'ᚨ',
    summary:
      'A demonstrative kingdom entry used to establish scale and hierarchy.',
    isMock: true,
  },
  {
    id: 'kingdom-iron',
    name: 'The Iron March',
    epithet: 'Citadels beneath the storm',
    sigil: 'ᛏ',
    summary: 'Mock copy for a severe frontier shaped by old fortifications.',
    isMock: true,
  },
  {
    id: 'kingdom-veil',
    name: 'The Veiled Crown',
    epithet: 'A court without a dawn',
    sigil: 'ᚱ',
    summary: 'Placeholder editorial material; no canonical claim is intended.',
    isMock: true,
  },
] as const;

export const featuredCharacters: readonly FeaturedCharacter[] = [
  {
    id: 'character-watcher',
    name: 'The Far Watcher',
    role: 'Pathfinder',
    allegiance: 'Unassigned',
    summary:
      'A mock figure who reads the road ahead rather than facing the observer.',
    isMock: true,
  },
  {
    id: 'character-bearer',
    name: 'The Banner Bearer',
    role: 'Witness',
    allegiance: 'Unrecorded',
    summary: 'A non-canonical character slot for future approved storytelling.',
    isMock: true,
  },
] as const;

export const featuredCreatures: readonly FeaturedCreature[] = [
  {
    id: 'creature-bone',
    name: 'The Bone Below',
    classification: 'Unclassified remnant',
    threat: 'unknown',
    summary: 'Only traces remain in this mock bestiary record.',
    isMock: true,
  },
  {
    id: 'creature-fog',
    name: 'The Fog Stalker',
    classification: 'Territorial predator',
    threat: 'severe',
    summary:
      'A placeholder creature used to test threat communication without color alone.',
    isMock: true,
  },
] as const;

export const featuredCollections: readonly FeaturedCollection[] = [
  {
    id: 'collection-vanguard',
    name: 'Vanguard Studies',
    format: 'Miniature concept collection',
    itemCount: 6,
    summary: 'A visual placeholder for a future approved miniature collection.',
    isMock: true,
  },
  {
    id: 'collection-relics',
    name: 'Relics of the Road',
    format: 'STL-ready collection placeholder',
    itemCount: 4,
    summary: 'No downloadable files or commercial offer are attached.',
    isMock: true,
  },
] as const;

export const featuredStories: readonly FeaturedStory[] = [
  {
    id: 'story-first-silence',
    name: 'The First Silence',
    chapter: 'Prologue',
    dateLabel: 'Age unknown',
    summary:
      'A non-canonical event demonstrating the future chronology pattern.',
    isMock: true,
  },
  {
    id: 'story-black-road',
    name: 'The Black Road Opens',
    chapter: 'Chapter I',
    dateLabel: 'Year unrecorded',
    summary: 'Mock timeline copy awaiting the official editorial model.',
    isMock: true,
  },
  {
    id: 'story-last-watch',
    name: 'The Last Watch',
    chapter: 'Chapter II',
    dateLabel: 'After the ashfall',
    summary: 'A placeholder story card, not established lore.',
    isMock: true,
  },
] as const;
