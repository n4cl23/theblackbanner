from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader


SOURCE = Path(r"C:\Users\Janderson Santos\Desktop\Chronicles of Asterheim")
REPORT = Path("reports/asterheim-documents-audit.json")

SECRET_PATTERNS = {
    "private_key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "connection_string": re.compile(r"(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/", re.I),
    "api_key_assignment": re.compile(r"(?:api[_ -]?key|secret|token|password)\s*[:=]\s*\S{8,}", re.I),
}

CLASSIFIERS = {
    "character": ("personagem", "character", "biografia", "guardian", "guardião"),
    "creature": ("criatura", "creature", "bestiário", "bestiary", "habitat"),
    "kingdom": ("reino", "kingdom", "ironhold", "stormreach", "frost kingdom"),
    "collection": ("coleção", "collection", "miniatura", "miniature"),
    "timeline": ("timeline", "cronologia", "era", "evento"),
    "chronicle": ("crônica", "chronicle", "chapter", "capítulo"),
    "print-guide": ("impressão", "printing", "resina", "support", "suporte"),
}


def classify(name: str, text: str) -> str:
    haystack = f"{name}\n{text[:12000]}".casefold()
    scores = {
        category: sum(term.casefold() in haystack for term in terms)
        for category, terms in CLASSIFIERS.items()
    }
    category, score = max(scores.items(), key=lambda item: item[1])
    return category if score else "unidentified"


entries: list[dict[str, object]] = []
for pdf in sorted(SOURCE.rglob("*.pdf")):
    entry: dict[str, object] = {
        "path": str(pdf),
        "relativePath": str(pdf.relative_to(SOURCE)),
        "sizeBytes": pdf.stat().st_size,
        "pageCount": None,
        "extractable": False,
        "classification": "unidentified",
        "languages": [],
        "securityRisks": [],
        "error": None,
    }
    try:
        reader = PdfReader(str(pdf), strict=False)
        entry["pageCount"] = len(reader.pages)
        text = "\n".join((page.extract_text() or "") for page in reader.pages)
        entry["extractable"] = bool(text.strip())
        entry["classification"] = classify(pdf.stem, text)
        folded = text.casefold()
        languages: list[str] = []
        if any(token in folded for token in (" the ", " and ", "chapter")):
            languages.append("en")
        if any(token in folded for token in (" de ", " para ", "capítulo", "personagem")):
            languages.append("pt-br")
        entry["languages"] = languages or ["und"]
        entry["securityRisks"] = [
            name for name, pattern in SECRET_PATTERNS.items() if pattern.search(text)
        ]
    except Exception as error:  # audit must retain the affected path without content
        entry["error"] = type(error).__name__
    entries.append(entry)

REPORT.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(
    json.dumps(
        {
            "documents": len(entries),
            "extractable": sum(bool(item["extractable"]) for item in entries),
            "errors": sum(bool(item["error"]) for item in entries),
            "securityRisks": sum(bool(item["securityRisks"]) for item in entries),
            "categories": {
                category: sum(item["classification"] == category for item in entries)
                for category in sorted({str(item["classification"]) for item in entries})
            },
        },
        ensure_ascii=False,
    )
)
