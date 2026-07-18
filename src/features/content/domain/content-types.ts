import type { z } from 'zod';

import type {
  categorySchema,
  characterSchema,
  collectionSchema,
  contentDatasetSchema,
  creatureSchema,
  crownSchema,
  editorialCoreSchema,
  editorialStatusSchema,
  entityReferenceSchema,
  factionSchema,
  galleryItemSchema,
  guardianSchema,
  kingdomSchema,
  locationSchema,
  loreArticleSchema,
  mediaAssetSchema,
  printProfileSchema,
  regionSchema,
  relationshipSchema,
  tagSchema,
  timelineEventSchema,
  weaponSchema,
} from '@/features/content/domain/content-schemas';

export type EditorialStatus = z.infer<typeof editorialStatusSchema>;
export type EditorialCore = z.infer<typeof editorialCoreSchema>;
export type EntityReference = z.infer<typeof entityReferenceSchema>;
export type Character = z.infer<typeof characterSchema>;
export type Creature = z.infer<typeof creatureSchema>;
export type Kingdom = z.infer<typeof kingdomSchema>;
export type Region = z.infer<typeof regionSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type Weapon = z.infer<typeof weaponSchema>;
export type Crown = z.infer<typeof crownSchema>;
export type Guardian = z.infer<typeof guardianSchema>;
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type LoreArticle = z.infer<typeof loreArticleSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type PrintProfile = z.infer<typeof printProfileSchema>;
export type Faction = z.infer<typeof factionSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ContentDataset = z.infer<typeof contentDatasetSchema>;
