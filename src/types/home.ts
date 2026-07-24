export type FeaturedContent = Readonly<{
  id: string;
  name: string;
  summary: string;
  isMock: boolean;
}>;

export type FeaturedKingdom = FeaturedContent &
  Readonly<{
    epithet: string;
    sigil: string;
  }>;

export type FeaturedCharacter = FeaturedContent &
  Readonly<{
    role: string;
    allegiance: string;
  }>;

export type FeaturedCreature = FeaturedContent &
  Readonly<{
    classification: string;
    threat: 'unknown' | 'severe' | 'extreme';
  }>;

export type FeaturedCollection = FeaturedContent &
  Readonly<{
    format: string;
    itemCount: number;
  }>;

export type FeaturedStory = FeaturedContent &
  Readonly<{
    chapter: string;
    dateLabel: string;
  }>;
