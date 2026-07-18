# Asterheim design system

The system translates dark-fantasy atmosphere into an accessible interface language. It is intentionally sharp, restrained, and environmental; it must not drift toward SaaS dashboards, generic rounded cards, neon, or glassmorphism.

## Palette

| Token     | Value                 | Role                                   |
| --------- | --------------------- | -------------------------------------- |
| Black     | `#050505`             | deepest background                     |
| Coal      | `#0a0a09` / `#121210` | primary surfaces                       |
| Iron      | `#262724`             | raised metal surfaces                  |
| Stone     | `#67675f`             | muted structure                        |
| Parchment | `#d4c8ab`             | warm reading surfaces                  |
| Ivory     | `#eee9dc`             | primary dark-mode text                 |
| Aged gold | `#a88a45`             | scarce emphasis and focus              |
| Bronze    | `#79572f`             | secondary warm detail                  |
| Blood     | `#681d1d`             | danger and high narrative tension      |
| Ember     | `#a83d1f`             | active danger and environmental warmth |

Gold is reserved for focus, key hierarchy, and rare primary actions. Blood and ember never communicate state without text, iconography, or structure.

## Typography

- Titles: Cinzel-style classical serif stack, monumental and tightly led.
- Subtitles and excerpts: Cormorant-style literary serif stack.
- Reading and interface: Inter-style system sans stack.
- Fluid title sizes use `clamp`; body copy keeps a generous `1.7` line height.
- Uppercase labels use measured tracking and remain short.
- System fallbacks keep builds deterministic until approved font assets are available.

## Foundations

Tokens in `src/styles/globals.css` cover color, typography, spacing, sharp radii, shadows, borders, procedural textures, opacity, durations, easing, breakpoints, and z-index. The showcase is available at `/design-system` unless `DESIGN_SYSTEM_ENABLED=false`.

## Component families

- Primitives: Button, IconButton, LinkButton, headings, dividers, containers, surfaces, editorial blocks, tags, navigation, tooltip, accordion, media, states, skeleton, and skip link.
- Interactive: Modal, Drawer, Tabs, and ImageWithFallback. These are isolated Client Components.
- Asterheim: rune marker, kingdom sigil, lore chapter heading, cinematic section, framed artwork, parchment block, metallic navigation, and banner title treatment.

## Accessibility

- Every action target is at least 44px tall.
- Global focus indicators use aged gold with an offset.
- Native `dialog` and `details` semantics are preferred.
- Tabs support arrows, Home, End, and roving tab index.
- Decorative marks are hidden; meaningful marks receive names.
- Text contrast is protected by opaque or near-opaque surfaces.
- Skip links and semantic headings establish navigation landmarks.

## Motion

- Section entry: opacity plus a maximum 20px vertical movement.
- Fade: contextual appearance only.
- Parallax: optional, transform-only, and deliberately light.
- Text reveal: major titles only; never long-form text.
- Hover: color, border, opacity, or subtle transform under 260ms.
- Page transitions: reserved for a future routing sprint.
- `prefers-reduced-motion` reduces animation and transition duration to near zero and removes parallax transforms.

## Content policy

All showcase prose, sigils, runes, and artwork placeholders are explicitly mock material. They establish presentation contracts, not official lore.
