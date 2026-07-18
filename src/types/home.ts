export type MockContent = Readonly<{
  id: string;
  name: string;
  summary: string;
  isMock: true;
}>;

export type FeaturedKingdom = MockContent &
  Readonly<{
    epithet: string;
    sigil: string;
  }>;

export type FeaturedCharacter = MockContent &
  Readonly<{
    role: string;
    allegiance: string;
  }>;

export type FeaturedCreature = MockContent &
  Readonly<{
    classification: string;
    threat: 'unknown' | 'severe' | 'extreme';
  }>;

export type FeaturedCollection = MockContent &
  Readonly<{
    format: string;
    itemCount: number;
  }>;

export type FeaturedStory = MockContent &
  Readonly<{
    chapter: string;
    dateLabel: string;
  }>;
