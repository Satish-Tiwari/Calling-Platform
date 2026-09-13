#!/usr/bin/env bash
set -euo pipefail

echo "=== Exporting Graphify Ontology Studio ==="
mkdir -p .graphify/studio

graphify studio export .graphify/studio

echo ""
echo "Static studio generated at .graphify/studio/studio.html"
echo "To explore, open .graphify/studio/studio.html in any browser or serve with npx serve .graphify/studio"
