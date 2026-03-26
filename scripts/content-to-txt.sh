#!/bin/bash
# Dumps all blog posts and about content into a single .txt

OUT="content-dump.txt"
cd "$(dirname "$0")/.." || exit 1

echo "# Content dump generated $(date)" > "$OUT"
echo "" >> "$OUT"

find src/content -type f \( -name "*.md" -o -name "*.mdx" \) | sort | while read -r file; do
  echo "================================================================" >> "$OUT"
  echo "FILE: $file" >> "$OUT"
  echo "================================================================" >> "$OUT"
  cat "$file" >> "$OUT"
  echo "" >> "$OUT"
  echo "" >> "$OUT"
done

SIZE=$(wc -c < "$OUT" | tr -d ' ')
LINES=$(wc -l < "$OUT" | tr -d ' ')
FILES=$(grep -c "^FILE:" "$OUT")
echo "Done: $OUT ($FILES files, $LINES lines, $SIZE bytes)"
