from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

from pypdf import PdfReader

SOURCE = Path(r"C:\Users\Janderson Santos\Desktop\Chronicles of Asterheim")
OUTPUT = Path("src/content/asterheim-editorial-import.generated.json")


def slug(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    ascii_value = "".join(char for char in normalized if unicodedata.category(char) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", ascii_value.casefold()).strip("-")


def locale(text: str) -> str:
    folded = f" {text.casefold()} "
    pt = sum(token in folded for token in (" de ", " para ", " reino ", " personagem ", " criatura "))
    en = sum(token in folded for token in (" the ", " and ", " kingdom ", " character ", " creature "))
    return "pt-BR" if pt > en else "en" if en > pt else "und"


records: list[dict[str, object]] = []
seen_hashes: set[str] = set()
for pdf in sorted(SOURCE.rglob("*.pdf")):
    reader = PdfReader(str(pdf), strict=False)
    text = "\n\n".join((page.extract_text() or "").strip() for page in reader.pages).strip()
    content_hash = __import__("hashlib").sha256(text.encode("utf-8")).hexdigest()
    if not text or content_hash in seen_hashes:
        continue
    seen_hashes.add(content_hash)
    records.append(
        {
            "id": f"import-{slug(pdf.stem)}-{content_hash[:8]}",
            "title": pdf.stem.replace("_", " "),
            "slug": slug(pdf.stem),
            "locale": locale(text),
            "status": "review",
            "sourceType": "pdf",
            "sourcePath": str(pdf.relative_to(SOURCE)),
            "pageCount": len(reader.pages),
            "contentHash": content_hash,
            "body": text,
            "provenance": "user-provided-final-source",
        }
    )

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"documents": len(records), "duplicatesSkipped": 31 - len(records)}, ensure_ascii=False))
