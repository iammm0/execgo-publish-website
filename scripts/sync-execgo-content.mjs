import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const stagingRoot = path.join(projectRoot, ".staging");

// --- execgo repo (branch snapshots) ---
const execgoRoot = path.join(stagingRoot, "execgo");
const execgoBranchesOutput = path.join(projectRoot, "content", "execgo-branches");

const branches = [
  { id: "main", refs: ["main", "origin/main"] },
  { id: "feat-add-cluster", refs: ["origin/feat-add-cluster", "feat-add-cluster"] },
];

const exportPaths = ["README.md", "CHANGELOG.md", "pkg/version/version.go", "docs"];

function runGit(repoDir, args, options = {}) {
  return execFileSync("git", ["-C", repoDir, ...args], {
    encoding: "utf8",
    env: { ...process.env, LANG: "C.UTF-8", LC_ALL: "C.UTF-8" },
    ...options,
  });
}

function resolveRef(repoDir, refs) {
  for (const ref of refs) {
    try {
      runGit(repoDir, ["rev-parse", "--verify", ref]);
      return ref;
    } catch {
      continue;
    }
  }
  throw new Error(`Unable to resolve any git ref from: ${refs.join(", ")}`);
}

function listFiles(repoDir, ref, paths) {
  return runGit(repoDir, ["ls-tree", "-r", "--name-only", ref, ...paths])
    .split(/\r?\n/)
    .filter(Boolean);
}

function writeBranchSnapshot(branch) {
  const ref = resolveRef(execgoRoot, branch.refs);
  const branchRoot = path.join(execgoBranchesOutput, branch.id);

  fs.rmSync(branchRoot, { recursive: true, force: true });
  fs.mkdirSync(branchRoot, { recursive: true });

  const files = listFiles(execgoRoot, ref, exportPaths);

  for (const relativeFile of files) {
    const content = runGit(execgoRoot, ["show", `${ref}:${relativeFile}`], { encoding: "buffer" });
    const targetFile = path.join(branchRoot, relativeFile);
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, content);
  }

  const manifest = {
    branch: branch.id,
    ref,
    generatedAt: new Date().toISOString(),
    files,
  };

  fs.writeFileSync(path.join(branchRoot, "snapshot.json"), JSON.stringify(manifest, null, 2), "utf8");
}

// --- execgo-runtime repo ---
const runtimeRoot = path.join(stagingRoot, "execgo-runtime");
const runtimeOutput = path.join(projectRoot, "content", "execgo-runtime", "docs", "zh");

function syncRuntime() {
  fs.rmSync(runtimeOutput, { recursive: true, force: true });
  fs.mkdirSync(runtimeOutput, { recursive: true });

  const ref = resolveRef(runtimeRoot, ["main", "origin/main"]);
  const files = listFiles(runtimeRoot, ref, ["docs"]);

  for (const relativeFile of files) {
    if (!relativeFile.endsWith(".md")) continue;
    const content = runGit(runtimeRoot, ["show", `${ref}:${relativeFile}`], { encoding: "buffer" });
    const basename = path.basename(relativeFile);
    fs.writeFileSync(path.join(runtimeOutput, basename), content);
  }

  console.log(`Synced execgo-runtime docs (${files.length} files) to ${runtimeOutput}`);
}

// --- execgo-playground project ---
const playgroundRoot = path.join(projectRoot, "..", "execgo-playground");
const playgroundOutput = path.join(projectRoot, "content", "execgo-playground", "docs", "zh");

const playgroundDocs = [
  { source: "README.md", target: "README.md" },
  { source: "docs/getting-started.md", target: "getting-started.md" },
  { source: "docs/architecture.md", target: "architecture.md" },
  { source: "docs/scenarios.md", target: "scenarios.md" },
  { source: "docs/benchmarks.md", target: "benchmarks.md" },
  { source: "docs/chaos.md", target: "chaos.md" },
  { source: "docs/observability.md", target: "observability.md" },
  { source: "desktop-client/README.md", target: "desktop-client.md" },
];

function syncPlayground() {
  fs.rmSync(playgroundOutput, { recursive: true, force: true });
  fs.mkdirSync(playgroundOutput, { recursive: true });

  const synced = [];
  for (const doc of playgroundDocs) {
    const sourceFile = path.join(playgroundRoot, doc.source);
    if (!fs.existsSync(sourceFile)) continue;
    const targetFile = path.join(playgroundOutput, doc.target);
    fs.copyFileSync(sourceFile, targetFile);
    synced.push(doc.source);
  }

  console.log(`Synced execgo-playground docs (${synced.length} files) to ${playgroundOutput}`);
}

// --- Run ---
if (fs.existsSync(execgoRoot)) {
  fs.rmSync(execgoBranchesOutput, { recursive: true, force: true });
  fs.mkdirSync(execgoBranchesOutput, { recursive: true });
  for (const branch of branches) {
    writeBranchSnapshot(branch);
  }
  console.log(`Synced execgo branch snapshots to ${execgoBranchesOutput}`);
} else {
  console.log(`Skipping execgo sync (${execgoRoot} not found)`);
}

if (fs.existsSync(runtimeRoot)) {
  syncRuntime();
} else {
  console.log(`Skipping runtime sync (${runtimeRoot} not found)`);
}

if (fs.existsSync(playgroundRoot)) {
  syncPlayground();
} else {
  console.log(`Skipping playground sync (${playgroundRoot} not found)`);
}
