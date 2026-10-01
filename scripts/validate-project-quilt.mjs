import fs from "node:fs/promises";

const quilt = JSON.parse(await fs.readFile("data/project-quilt.json", "utf8"));
const graph = JSON.parse(await fs.readFile("data/project-graph.json", "utf8"));
const errors = [];
const warnings = [];

function dupes(values) {
  const counts = new Map();
  for (const v of values.filter(Boolean)) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([v]) => v);
}

const ids = quilt.projects.map((p) => p.id);
for (const id of dupes(ids)) errors.push(`Duplicate project id: ${id}`);

const fullNames = quilt.projects.filter(p=>p.full_name).map((p) => p.full_name.toLowerCase());
for (const name of dupes(fullNames)) errors.push(`Duplicate public source repo: ${name}`);

const primaryUrls = quilt.projects.filter(p=>p.live_url).map((p) => p.live_url.replace(/\/$/, "").toLowerCase());
for (const url of dupes(primaryUrls)) errors.push(`Duplicate primary live URL: ${url}`);

const fullSet = new Set(quilt.projects.filter(p=>p.full_name).map(p=>p.full_name));
for (const fam of quilt.families || []) {
  if (fam.canonical && !fullSet.has(fam.canonical)) errors.push(`Family ${fam.id} canonical repo is missing: ${fam.canonical}`);
  for (const member of fam.members || []) {
    if (!fullSet.has(member)) errors.push(`Family ${fam.id} member is missing: ${member}`);
  }
}

const nodeIds = new Set(graph.nodes.map(n=>n.id));
for (const e of graph.edges) {
  if (!nodeIds.has(e.from)) errors.push(`Graph edge source is missing: ${e.from}`);
  if (!nodeIds.has(e.to)) errors.push(`Graph edge target is missing: ${e.to}`);
}
if (graph.node_count !== graph.nodes.length) errors.push("graph.node_count does not match nodes.length");
if (graph.edge_count !== graph.edges.length) errors.push("graph.edge_count does not match edges.length");

for (const p of quilt.projects) {
  if (p.live_url && !/^https:\/\//i.test(p.live_url)) errors.push(`Non-HTTPS promoted live URL on ${p.id}`);
  for (const alt of p.alternate_live_urls || []) {
    if (!/^https:\/\//i.test(alt.url)) errors.push(`Non-HTTPS alternate URL on ${p.id}`);
  }
  if (!p.repo_url && p.full_name) warnings.push(`Node ${p.id} has full_name but no repo_url`);
}

console.log(`Validated ${quilt.projects.length} Quilt nodes, ${quilt.families.length} families and ${graph.edges.length} graph edges.`);
for (const w of warnings) console.warn("WARN:", w);
if (errors.length) {
  for (const e of errors) console.error("ERROR:", e);
  process.exit(1);
}
console.log("Project Quilt structure is valid.");
