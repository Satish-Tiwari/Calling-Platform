---
command: /graphify
description: Turn any folder of files into a navigable knowledge graph
---

# Workflow: graphify

## Steps
1. Follow the graphify skill located at `.agents/skills/graphify/SKILL.md` (or run `.agents/skills/graphify/scripts/build-graph.sh`) to run the full TypeScript-backed pipeline.
2. If no path argument is given, use `.` (current directory).
3. To export the static Ontology Studio, run `npm run graphify:studio` or `.agents/skills/graphify/scripts/export-studio.sh`.
