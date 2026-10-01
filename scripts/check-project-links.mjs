import fs from "node:fs/promises";

const manifestPath = process.argv[2] || "data/project-quilt.json";
const candidatePath = process.argv[3] || "data/project-live-candidates.json";
const data = JSON.parse(await fs.readFile(manifestPath, "utf8"));

const targets = data.projects
  .filter((p) => p.live_url)
  .map((p) => ({ id: p.id, name: p.name, url: p.live_url, source: "manifest" }));

try {
  const candidateData = JSON.parse(await fs.readFile(candidatePath, "utf8"));
  for (const c of candidateData.candidates || []) {
    if (c.url) targets.push({ id: c.id, name: c.name, url: c.url, source: "candidate" });
  }
} catch {
  // Candidate file is optional.
}

const unique = [];
const seen = new Set();
for (const t of targets) {
  const key = t.url.replace(/\/$/, "").toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(t);
}

async function check(target) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const started = Date.now();
  try {
    const response = await fetch(target.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Signal-Beneath-Link-Check/2.0" },
    });
    try { await response.body?.cancel(); } catch {}
    return {
      ...target,
      ok: response.ok,
      status: response.status,
      final_url: response.url,
      ms: Date.now() - started,
      error: null,
    };
  } catch (error) {
    return {
      ...target,
      ok: false,
      status: null,
      final_url: null,
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

const results = [];
const concurrency = 8;
for (let i = 0; i < unique.length; i += concurrency) {
  results.push(...await Promise.all(unique.slice(i, i + concurrency).map(check)));
}

await fs.mkdir("artifacts", { recursive: true });
await fs.writeFile(
  "artifacts/project-link-check.json",
  JSON.stringify({ checked_at: new Date().toISOString(), results }, null, 2) + "\n",
);

const failed = results.filter((r) => !r.ok);
const manifestResults = results.filter((r) => r.source === "manifest");
const candidateResults = results.filter((r) => r.source === "candidate");
const candidatePassed = candidateResults.filter((r) => r.ok);
const lines = [
  "# SIGNAL BENEATH project-link check",
  "",
  `Checked **${results.length}** unique URLs; **${results.length - failed.length}** passed and **${failed.length}** failed.`,
  `Manifest: **${manifestResults.filter(r=>r.ok).length}/${manifestResults.length}** passed. Candidate discoveries: **${candidatePassed.length}/${candidateResults.length}** passed.`,
  "",
  "| Source | Project | Status | Final URL | Time |",
  "|---|---|---:|---|---:|",
  ...results.map((r) =>
    `| ${r.source} | ${r.name.replaceAll("|", "\\|")} | ${r.ok ? "✅ " + r.status : "❌ " + (r.status ?? r.error)} | ${r.final_url ?? r.url} | ${r.ms}ms |`
  ),
];

const summary = lines.join("\n") + "\n";
await fs.writeFile("artifacts/project-link-check.md", summary);
await fs.writeFile(
  "artifacts/passed-candidates.json",
  JSON.stringify({ candidates: candidatePassed }, null, 2) + "\n",
);
if (process.env.GITHUB_STEP_SUMMARY) {
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}
console.log(summary);
if (failed.length) process.exitCode = 1;
