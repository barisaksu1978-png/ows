#!/usr/bin/env python3
"""DOSYA H paketi — yalnız kopyalama (shutil.copy2). Dry-run veya onaylı kopyalama."""

import argparse
import fnmatch
import os
import shutil
import sys
from pathlib import Path

DOWNLOADS = Path(r"C:\Users\lcq\Downloads")

DEST_CANDIDATES = [
    Path(r"C:\Users\lcq\OneDrive\Masaüstü\DOSYA_H_PAKET"),
    Path(r"C:\Users\lcq\OneDrive\Desktop\DOSYA_H_PAKET"),
    Path(r"C:\Users\lcq\Desktop\DOSYA_H_PAKET"),
]

# (etiket, eşleştirme fonksiyonu)
DOCX_TARGETS = [
    (
        "Masumiyet Dönemi",
        lambda name: name.startswith("fd24e9c6") and fnmatch.fnmatch(name, "*Masumiyet Dönemi İncelemesi.docx"),
    ),
    (
        "Vicdan Dönemi",
        lambda name: (
            name.startswith("cdce49d3")
            and fnmatch.fnmatch(name, "*Vicdan Dönemi İncelemesi.docx")
            and "(1)" not in name
        ),
    ),
    (
        "İnsan Yönetimi Dönemi",
        lambda name: name.startswith("b9e3c3ac")
        and fnmatch.fnmatch(name, "*İnsan Yönetimi Dönemi Üzerine Derinlemesine İnceleme.docx"),
    ),
    (
        "Vaat Dönemi",
        lambda name: name.startswith("9469bc16")
        and fnmatch.fnmatch(name, "*Vaat Dönemi Üzerine Derinlemesine İnceleme.docx"),
    ),
    (
        "MASTER_YOL_HARITASI",
        lambda name: name == "MASTER_YOL_HARITASI.docx",
    ),
]

RESUME_NAME = "SYNTHESIUS_DEVIR_RESUME_v5_DOSYA_H.md"

FORBIDDEN_PATTERNS = [
    "Gemini Karma Üretim İhracat Güvenli Yol Haritası",
    "sirketdosyasi_yol_haritasi_risk_kontrol",
    "Belge Listesi Tematik Haritalaması",
]


def resolve_dest_parent() -> Path:
    for candidate in DEST_CANDIDATES:
        parent = candidate.parent
        if parent.is_dir():
            return candidate
    raise FileNotFoundError("Masaüstü klasörü bulunamadı.")


def list_downloads() -> list[Path]:
    if not DOWNLOADS.is_dir():
        return []
    return [p for p in DOWNLOADS.iterdir() if p.is_file()]


def is_forbidden(name: str) -> bool:
    return any(pat in name for pat in FORBIDDEN_PATTERNS)


def find_docx(files: list[Path], matcher) -> Path | None:
    matches = [p for p in files if matcher(p.name) and not is_forbidden(p.name)]
    if not matches:
        return None
    return max(matches, key=lambda p: p.stat().st_mtime)


def find_resume(files: list[Path]) -> Path | None:
    matches = [p for p in files if p.name == RESUME_NAME]
    return max(matches, key=lambda p: p.stat().st_mtime) if matches else None


def collect_sources() -> tuple[Path, list[tuple[str, Path | None]], Path | None]:
    dest = resolve_dest_parent()
    files = list_downloads()
    docx_hits: list[tuple[str, Path | None]] = []
    for label, matcher in DOCX_TARGETS:
        docx_hits.append((label, find_docx(files, matcher)))
    resume = find_resume(files)
    return dest, docx_hits, resume


def fmt_size(n: int) -> str:
    return f"{n:,} B"


def print_dry_run(dest: Path, docx_hits, resume: Path | None) -> None:
    print("=" * 60)
    print("DRY-RUN — Kopyalama yapılmadı")
    print("=" * 60)
    print(f"Hedef klasör (oluşturulacak): {dest}")
    print(f"Kaynak kök: {DOWNLOADS}")
    print()

    print("--- 5 DOCX ---")
    found = 0
    for label, path in docx_hits:
        if path is None:
            print(f"  [{label}] BULUNAMADI")
        else:
            size = path.stat().st_size
            mtime = path.stat().st_mtime
            from datetime import datetime

            ts = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")
            print(f"  [{label}]")
            print(f"    Yol:   {path}")
            print(f"    Boyut: {fmt_size(size)}")
            print(f"    Tarih: {ts}")
            found += 1
        print()

    print("--- OPSİYONEL MD ---")
    if resume is None:
        print("  resume bulunamadı")
    else:
        size = resume.stat().st_size
        print(f"  Yol:   {resume}")
        print(f"  Boyut: {fmt_size(size)}")
    print()

    resume_note = "+1 md" if resume else "(resume yok)"
    print(f"Özet: {found}/5 docx bulundu {resume_note}")
    print()
    print('Kopyalamak için: python copy_dosya_h_paket.py --copy')


def do_copy(dest: Path, docx_hits, resume: Path | None) -> int:
    dest.mkdir(parents=True, exist_ok=True)
    results: list[tuple[str, Path, Path, int, int]] = []
    errors = 0

    for label, src in docx_hits:
        if src is None:
            print(f"HATA: [{label}] kaynak bulunamadı — kopyalama iptal.")
            return 1
        dst = dest / src.name
        src_size = src.stat().st_size
        shutil.copy2(src, dst)
        dst_size = dst.stat().st_size
        results.append((label, src, dst, src_size, dst_size))

    resume_copied = False
    if resume is not None:
        dst = dest / resume.name
        src_size = resume.stat().st_size
        shutil.copy2(resume, dst)
        dst_size = dst.stat().st_size
        results.append(("RESUME (md)", resume, dst, src_size, dst_size))
        resume_copied = True

    print("=" * 60)
    print("KOPYALAMA TAMAMLANDI")
    print("=" * 60)
    print(f"Hedef: {dest}")
    print()

    mismatch = 0
    for label, src, dst, src_size, dst_size in results:
        ok = src_size == dst_size
        flag = "" if ok else " *** BOYUT UYUMSUZ ***"
        if not ok:
            mismatch += 1
        print(f"  [{label}]")
        print(f"    Kaynak: {src} ({fmt_size(src_size)})")
        print(f"    Hedef:  {dst} ({fmt_size(dst_size)}){flag}")
        print()

    print("--- Hedef klasör içeriği ---")
    for p in sorted(dest.iterdir()):
        if p.is_file():
            print(f"  {p.name}  {fmt_size(p.stat().st_size)}")

    print()
    expected = 6 if resume_copied else 5
    actual = len(list(dest.iterdir()))
    print(f"Dosya sayısı: {actual} (beklenen: {expected})")
    if mismatch:
        print(f"UYARI: {mismatch} dosyada boyut uyumsuzluğu!")
        return 1
    print("Tüm boyutlar eşleşiyor.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="DOSYA H paketi kopyalama")
    parser.add_argument(
        "--copy",
        action="store_true",
        help="Onaylı kopyalama (yoksa dry-run)",
    )
    args = parser.parse_args()

    dest, docx_hits, resume = collect_sources()

    if not args.copy:
        print_dry_run(dest, docx_hits, resume)
        return 0

    return do_copy(dest, docx_hits, resume)


if __name__ == "__main__":
    sys.exit(main())
