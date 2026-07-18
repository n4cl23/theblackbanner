# Content model

Status: intentionally deferred. No official content, CMS schema, database model, or migration exists in Sprint 0.

Future modelling will distinguish narrative domains, editorial workflow, localization, media assets, and commerce concerns before persistence is introduced.

## Sprint 2 presentation contracts

The temporary Home defines typed presentation-only records: `FeaturedKingdom`, `FeaturedCharacter`, `FeaturedCreature`, `FeaturedCollection`, and `FeaturedStory`. Every record requires `isMock: true`. These interfaces are not database or CMS schemas and must not be treated as canonical editorial modelling.
