#!/bin/bash
# Dumps all site source files into a single .txt for easy sharing/review

OUT="site-dump.txt"
cd "$(dirname "$0")/.." || exit 1

echo "# Site dump generated $(date)" > "$OUT"
echo "" >> "$OUT"

find src -type f \( \
  -name "*.astro" -o \
  -name "*.ts" -o \
  -name "*.tsx" -o \
  -name "*.js" -o \
  -name "*.mjs" -o \
  -name "*.css" -o \
  -name "*.md" -o \
  -name "*.mdx" -o \
  -name "*.json" -o \
  -name "*.yaml" -o \
  -name "*.yml" \
\) | sort | while read -r file; do
  echo "================================================================" >> "$OUT"
  echo "FILE: $file" >> "$OUT"
  echo "================================================================" >> "$OUT"
  cat "$file" >> "$OUT"
  echo "" >> "$OUT"
  echo "" >> "$OUT"
done

# Also include config files
for f in astro.config.ts tsconfig.json package.json tailwind.config.mjs .prettierrc; do
  if [ -f "$f" ]; then
    echo "================================================================" >> "$OUT"
    echo "FILE: $f" >> "$OUT"
    echo "================================================================" >> "$OUT"
    cat "$f" >> "$OUT"
    echo "" >> "$OUT"
    echo "" >> "$OUT"
  fi
done

SIZE=$(wc -c < "$OUT" | tr -d ' ')
LINES=$(wc -l < "$OUT" | tr -d ' ')
FILES=$(grep -c "^FILE:" "$OUT")
echo "Done: $OUT ($FILES files, $LINES lines, $SIZE bytes)"
