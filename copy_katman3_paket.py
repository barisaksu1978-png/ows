#!/usr/bin/env python3
"""KATMAN3 paket dosyalarını bul ve Masaüstü/KATMAN3_PAKET'e kopyala."""

import os
import shutil
import sys
from pathlib import Path

USER_HOME = Path(r"C:\Users\lcq")
DOWNLOADS = USER_HOME / "Downloads"

DESKTOP_CANDIDATES = [
    USER_HOME / "OneDrive" / "Desktop",
    USER_HOME / "OneDrive" / "Masaüstü",
    USER_HOME / "Desktop",
    USER_HOME / "Masaüstü",
]


def resolve_desktop() -> Path:
    for candidate in DESKTOP_CANDIDATES:
        if candidate.is_dir():
            return candidate
    raise FileNotFoundError("Masaüstü klasörü bulunamadı.")


def hermenotik_roots() -> list[Path]:
    roots: list[Path] = []
    for base in (USER_HOME, USER_HOME / "OneDrive"):
        if not base.is_dir():
            continue
        try:
            for entry in base.iterdir():
                if entry.is_dir() and entry.name.lower().startswith("hermenötik"):
                    roots.append(entry)
        except PermissionError:
            pass
    return roots


def search_roots() -> list[Path]:
    roots = [DOWNLOADS]
    roots.extend(hermenotik_roots())
    return [r for r in roots if r.is_dir()]


def walk_files(roots: list[Path]):
    for root in roots:
        for dirpath, _, filenames in os.walk(root):
            for name in filenames:
                yield Path(dirpath) / name


def newest(paths: list[Path]) -> Path | None:
    if not paths:
        return None
    return max(paths, key=lambda p: p.stat().st_mtime)


def find_exact(roots: list[Path], filename: str) -> Path | None:
    matches = [p for p in walk_files(roots) if p.name == filename]
    return newest(matches)


def find_katman3_v2(roots: list[Path]) -> Path | None:
    matches = []
    for p in walk_files(roots):
        name = p.name
        if name == "KATMAN3_YAZIM_PROMPT_v2.md":
            matches.append(p)
        elif "v2" in name.lower() and name.startswith("KATMAN3_YAZIM_PROMPT") and name.endswith(".md"):
            if "v1" not in name.lower():
                matches.append(p)
    return newest(matches)


def find_b70adfc8_dispensasyonal(roots: list[Path]) -> Path | None:
    matches = []
    for p in walk_files(roots):
        if not p.suffix.lower() == ".docx":
            continue
        if not p.name.lower().startswith("b70adfc8"):
            continue
        if "DİSPENSASYONAL" in p.name or "DISPENSASYONAL" in p.name.upper():
            matches.append(p)
    return newest(matches)


def copy_file(src: Path, dest_dir: Path) -> Path:
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / src.name
    shutil.copy2(src, dest)
    return dest


def main() -> int:
    desktop = resolve_desktop()
    dest_dir = desktop / "KATMAN3_PAKET"
    roots = search_roots()

    print("=== KATMAN3 PAKET KOPYALAMA ===")
    print(f"Masaüstü: {desktop}")
    print(f"Hedef:    {dest_dir}")
    print(f"Arama kökleri ({len(roots)}):")
    for r in roots:
        print(f"  - {r}")
    print()

    tasks = [
        ("KATMAN3_YAZIM_PROMPT_v2.md", lambda: find_katman3_v2(roots)),
        ("DENETIM_RAPORU_04.md", lambda: find_exact(roots, "DENETIM_RAPORU_04.md")),
        (
            'b70adfc8*DİSPENSASYONAL*.docx',
            lambda: find_b70adfc8_dispensasyonal(roots),
        ),
        (
            "Dispensasyonal_Hermeneutik_Anglo-Amerikan_Teopolitigi.docx",
            lambda: find_exact(
                roots, "Dispensasyonal_Hermeneutik_Anglo-Amerikan_Teopolitigi.docx"
            ),
        ),
        (
            "Dispensasyonal_Hermeneutik_Tam_Arastirma.docx",
            lambda: find_exact(roots, "Dispensasyonal_Hermeneutik_Tam_Arastirma.docx"),
        ),
    ]

    copied = 0
    missing = 0

    for label, finder in tasks:
        print(f"--- {label} ---")
        src = finder()
        if src is None:
            print("  DURUM: BULUNAMADI")
            missing += 1
        else:
            try:
                dest = copy_file(src, dest_dir)
                mtime = src.stat().st_mtime
                from datetime import datetime

                ts = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")
                print(f"  KAYNAK: {src}")
                print(f"  TARİH:  {ts}")
                print(f"  HEDEF:  {dest}")
                print("  DURUM:  KOPYALANDI")
                copied += 1
            except OSError as exc:
                print(f"  KAYNAK: {src}")
                print(f"  DURUM:  KOPYALAMA HATASI — {exc}")
                missing += 1
        print()

    print("=== ÖZET ===")
    print(f"Kopyalanan: {copied}/5")
    print(f"Bulunamayan/hatalı: {missing}/5")
    print(f"Hedef klasör: {dest_dir}")

    return 0 if missing == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
