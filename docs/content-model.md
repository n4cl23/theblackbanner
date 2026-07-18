# Content model

## Localized editorial variants

Future CMS documents retain an `originalLocale` and `originalId`. Every locale variant owns its status, slug, title, body, alt text, translation link, and incompleteness flag. Previewable locales are explicit.

Supported locale statuses are `unavailable`, `draft`, `review`, and `published`. Interface copy never falls back to another language. Editorial fallback is allowed only through an explicit unavailable or identified fallback state; Sprint 10 implements the unavailable state and does not silently substitute content.

Sprint 3 defines local, versioned editorial contracts only. There is no database, ORM, migration, CMS connection, authentication, or administrative workflow.

All records in the current dataset use `provenance: "mock"`, `noIndex: true`, and provisional copy. They validate architecture and do not establish official canon.

## Editorial core

Every entity shares:

- `id`, globally unique `slug`, `title`, `subtitle`, `excerpt`, and `description`;
- `status`: `draft`, `review`, `published`, or `archived`;
- `locale`, `featured`, `order`, and tag references;
- SEO title, description, provisional canonical path, and index policy;
- optional cover plus gallery media references;
- `createdAt` and `updatedAt` ISO timestamps;
- mock provenance for this local dataset.

## Entities

| Entity        | Editorial responsibility                                     |
| ------------- | ------------------------------------------------------------ |
| Character     | People, affiliations, events, weapons, and relationships     |
| Creature      | Bestiary classification, threat, habitats, and encounters    |
| Kingdom       | Political territory, regions, factions, ruler, and diplomacy |
| Region        | Geographic subdivision, climate, kingdom, and locations      |
| Collection    | Curated character/creature set and optional print profile    |
| Weapon        | Weapon classification and character ownership                |
| Crown         | Kingdom regalia and optional bearer                          |
| Guardian      | Exactly one character or creature guarding a location        |
| TimelineEvent | Ordered event joining two or more entity references          |
| LoreArticle   | Structured body, categories, and polymorphic citations       |
| GalleryItem   | Media presentation connected to arbitrary entities           |
| MediaAsset    | Local media metadata and dimensions/duration                 |
| PrintProfile  | STL/OBJ/3MF scale and support strategy                       |
| Faction       | Kingdom affiliation and member characters                    |
| Location      | Region placement and optional map coordinates                |
| Relationship  | Typed source/target link with reciprocal policy              |
| Tag           | Cross-domain editorial vocabulary                            |
| Category      | Hierarchical editorial classification                        |

## Relationships

- A character belongs to one kingdom and zero or more factions.
- A character may join many timeline events, own many weapons, and participate in typed relationships.
- A creature inhabits one or more regions and may appear in one or more kingdom bestiaries.
- Collections contain only character or creature references.
- Timeline events join at least two arbitrary entities.
- Lore articles cite arbitrary entity references.
- Explicit relationship records support character–character, creature–character, and kingdom–kingdom edges.
- Regions belong to kingdoms; locations belong to regions.
- Referential integrity is validated separately from shape validation so the same rules apply to every future source.

## Dataset

The initial local mock set contains exactly:

- 3 kingdoms;
- 4 characters;
- 4 creatures;
- 2 collections;
- 5 timeline events;
- 2 lore articles.

Supporting records exist only to validate relationships. Content from V1 was not imported.

## Validation and access

Zod schemas in `src/features/content/domain/content-schemas.ts` own runtime validation. TypeScript models are inferred from those schemas. `validateContentIntegrity` verifies global slug uniqueness and cross-record references.

Consumers depend on `ContentRepository`, never on local files. `LocalContentAdapter` validates the versioned dataset. Database and CMS adapters define future boundaries through injected loaders but establish no connection in this sprint.
