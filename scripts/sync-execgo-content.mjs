import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const execgoRoot = path.join(projectRoot, "execgo");
const outputRoot = path.join(projectRoot, "content", "execgo-branches");

const branches = [
  {
    id: "main",
    refs: ["main", "origin/main"],
  },
  {
    id: "feat-add-cluster",
    refs: ["origin/feat-add-cluster", "feat-add-cluster"],
  },
];

const exportPaths = ["README.md", "CHANGELOG.md", "pkg/version/version.go", "docs"];

function runGit(args, options = {}) {
  return execFileSync("git", ["-C", execgoRoot, ...args], {
    encoding: "utf8",
    env: {
      ...process.env,
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
    },
    ...options,
  });
}

function resolveRef(refs) {
  for (const ref of refs) {
    try {
      runGit(["rev-parse", "--verify", ref]);
      return ref;
    } catch {
      continue;
    }
  }

  throw new Error(`Unable to resolve any git ref from: ${refs.join(", ")}`);
}

function listFiles(ref) {
  return runGit(["ls-tree", "-r", "--name-only", ref, ...exportPaths])
    .split(/\r?\n/)
    .filter(Boolean);
}

function writeBranchSnapshot(branch) {
  const ref = resolveRef(branch.refs);
  const branchRoot = path.join(outputRoot, branch.id);

  fs.rmSync(branchRoot, { recursive: true, force: true });
  fs.mkdirSync(branchRoot, { recursive: true });

  const files = listFiles(ref);

  for (const relativeFile of files) {
    const content = runGit(["show", `${ref}:${relativeFile}`], { encoding: "buffer" });
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

  fs.writeFileSync(
    path.join(branchRoot, "snapshot.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

for (const branch of branches) {
  writeBranchSnapshot(branch);
}

console.log(`Synced execgo content snapshots to ${outputRoot}`);
