# Private print and model assets

Audit date: 2026-07-18. Source: user-provided `Chronicles of Asterheim` directory.

These assets were inventoried but were **not copied into `public/`**, committed as binaries, uploaded, or exposed through the media manifest.

| Format  | Files |          Bytes | Decision                                                  |
| ------- | ----: | -------------: | --------------------------------------------------------- |
| STL     |   193 | 18,620,369,762 | Private print source; metadata only                       |
| GLB     |   145 | 10,511,736,460 | Withheld pending explicit commercial/public authorization |
| 3MF     |     2 |    105,523,427 | Private print source; metadata only                       |
| CXDLPV4 |     1 |    187,448,804 | Proprietary printer job; quarantined                      |
| EXE     |     1 |      1,438,752 | Executable; quarantined and never executed                |
| WINMD   |     1 |          5,120 | System metadata; quarantined                              |
| CFGX    |     1 |         18,041 | Printer/configuration artifact; quarantined               |
| ZIP     |     1 |          5,849 | Archive; quarantined pending manual review                |

## GLB structural audit

- 145 of 145 files have a valid GLB v2 header and declared length.
- 145 meshes, 145 materials, and 435 texture references were identified.
- No external buffer or image URI was found.
- No animation was declared.
- Geometry was not modified and model binaries were not published.

Full machine-readable metadata is in `reports/asterheim-glb-audit.json`. Source-level paths and risk classifications are in the asset inventory.

## Publication rule

Models and print files require an explicit authorization that identifies which assets are public, their license, delivery channel, and commercial exposure. Private downloads must use authenticated storage with expiring URLs; they must never be served from `public/`.
