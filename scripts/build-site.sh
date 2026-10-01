#!/usr/bin/env bash
# Assembles the GitHub Pages site: a launcher at the root, Chapter One at
# /chapter-one/ (built from this branch), and The Parris Quilt at /quilt/
# (the single-file version on origin/master).
set -euo pipefail
cd "$(dirname "$0")/.."
out="${1:-site-dist}"
rm -rf "$out"
npm run build
mkdir -p "$out/chapter-one" "$out/quilt"
cp -r dist/. "$out/chapter-one/"
git fetch -q origin master
git show origin/master:index.html > "$out/quilt/index.html"
cp site/launcher.html "$out/index.html"
touch "$out/.nojekyll"
echo "Site assembled in $out"
