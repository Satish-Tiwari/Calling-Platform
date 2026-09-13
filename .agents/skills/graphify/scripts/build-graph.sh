#!/usr/bin/env bash
set -euo pipefail

# Helper script to execute graphify AST extraction and graph build
echo "=== Building Graphify Knowledge Graph ==="
mkdir -p .graphify

# 1. Detect project files
echo "[1/4] Detecting project files..."
graphify detect . --scope auto --out .graphify/.graphify_detect.json

# 2. Extract AST from code files
echo "[2/4] Performing AST extraction..."
node -e "(async () => {
const fs = require('fs');
const { collectFiles, extract } = require('@sentropic/graphify');

const detect = JSON.parse(fs.readFileSync('.graphify/.graphify_detect.json', 'utf-8'));
let codeFiles = [];
for (const f of (detect.files || {}).code || []) {
    codeFiles = codeFiles.concat(collectFiles(f));
}

if (codeFiles.length > 0) {
    const result = await extract(codeFiles);
    fs.writeFileSync('.graphify/.graphify_ast.json', JSON.stringify(result, null, 2));
    console.log(\`AST extracted: \${result.nodes.length} nodes, \${result.edges.length} edges\`);
} else {
    fs.writeFileSync('.graphify/.graphify_ast.json', JSON.stringify({nodes:[],edges:[],input_tokens:0,output_tokens:0}));
    console.log('No code files found.');
}
})()"

# 3. Add core document nodes and merge
echo "[3/4] Adding semantic document nodes..."
node -e "
const fs = require('fs');
const semNodes = [
  { id: 'doc_readme', label: 'Calling Platform Documentation', file_type: 'document', source_file: 'README.md', source_location: 'L1' },
  { id: 'doc_docker_compose', label: 'Docker Compose Infrastructure', file_type: 'document', source_file: 'docker-compose.yml', source_location: 'L1' },
  { id: 'doc_frontend_index_html', label: 'Frontend HTML Shell', file_type: 'document', source_file: 'frontend/index.html', source_location: 'L1' }
];
const semEdges = [
  { source: 'doc_readme', target: 'src_app', relation: 'references', confidence: 'EXTRACTED', confidence_score: 1.0, source_file: 'README.md', weight: 1.0 },
  { source: 'doc_docker_compose', target: 'src_app_module', relation: 'references', confidence: 'EXTRACTED', confidence_score: 1.0, source_file: 'docker-compose.yml', weight: 1.0 },
  { source: 'doc_frontend_index_html', target: 'frontend_src_main', relation: 'references', confidence: 'EXTRACTED', confidence_score: 1.0, source_file: 'frontend/index.html', weight: 1.0 }
];
fs.writeFileSync('.graphify/.graphify_semantic.json', JSON.stringify({ nodes: semNodes, edges: semEdges, hyperedges: [], input_tokens: 0, output_tokens: 0 }, null, 2));

const ast = JSON.parse(fs.readFileSync('.graphify/.graphify_ast.json', 'utf-8'));
const sem = JSON.parse(fs.readFileSync('.graphify/.graphify_semantic.json', 'utf-8'));
const seen = new Set(ast.nodes.map(n => n.id));
const mergedNodes = [...ast.nodes];
for (const n of sem.nodes) { if (!seen.has(n.id)) { mergedNodes.push(n); seen.add(n.id); } }
const mergedEdges = ast.edges.concat(sem.edges);
fs.writeFileSync('.graphify/.graphify_extract.json', JSON.stringify({ nodes: mergedNodes, edges: mergedEdges, hyperedges: [], input_tokens: 0, output_tokens: 0 }, null, 2));
console.log(\`Merged: \${mergedNodes.length} nodes, \${mergedEdges.length} edges\`);
"

# 4. Cluster, score, and write outputs
echo "[4/4] Generating graph.json, GRAPH_REPORT.md, and analysis..."
node -e "
const fs = require('fs');
const { buildFromJson, cluster, scoreAll, godNodes, surprisingConnections, suggestQuestions, generateReport, toJson } = require('@sentropic/graphify');

const extraction = JSON.parse(fs.readFileSync('.graphify/.graphify_extract.json', 'utf-8'));
const detection = JSON.parse(fs.readFileSync('.graphify/.graphify_detect.json', 'utf-8'));

const G = buildFromJson(extraction);
const communities = cluster(G);
const cohesion = scoreAll(G, communities);
const tokens = {input: extraction.input_tokens || 0, output: extraction.output_tokens || 0};
const gods = godNodes(G);
const surprises = surprisingConnections(G, communities);
const labels = new Map(Array.from(communities.keys(), cid => [cid, 'Community ' + cid]));
const questions = suggestQuestions(G, communities, labels);

const report = generateReport(G, communities, cohesion, labels, gods, surprises, detection, tokens, '.', {suggestedQuestions: questions});
fs.writeFileSync('.graphify/GRAPH_REPORT.md', report);
toJson(G, communities, '.graphify/graph.json');

const analysis = {
    communities: Object.fromEntries(Array.from(communities.entries(), ([k, v]) => [String(k), v])),
    cohesion: Object.fromEntries(Array.from(cohesion.entries(), ([k, v]) => [String(k), v])),
    gods,
    surprises,
    questions,
};
fs.writeFileSync('.graphify/.graphify_analysis.json', JSON.stringify(analysis, null, 2));
console.log(\`Success! Graph built: \${G.order} nodes, \${G.size} edges across \${communities.size} communities.\`);
"
