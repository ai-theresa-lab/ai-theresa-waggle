# Contributing

Thanks for helping improve Waggle.

## Before you start

For a bug fix or a small change, just open a pull request. For a new feature, a new expert lens or connector, or a
larger refactor, open an issue first
([bug report or feature request](https://github.com/ai-theresa-lab/ai-theresa-waggle/issues/new/choose)) so the
approach can be agreed before you put in the work.

Security problems never go in a public issue or pull request — see [Security issues](#security-issues).

## Development

Requirements: Node.js 22.7+ and git (git 2.28+ to run the full test suite).

```bash
npm ci
cp .env.example .env      # add your ANTHROPIC_API_KEY
npm start                 # http://localhost:4317
```

The server runs the TypeScript sources directly with `node --experimental-strip-types` — there is no build step. That
means **erasable TypeScript only**: no `enum`, no parameter properties, no `namespace`; relative imports include the
`.ts` extension.

Before opening a pull request:

```bash
npm run typecheck
npm test
npm run check:english
node --test "telemetry-collector/**/*.test.mjs"
```

CI runs the same commands on Linux. On Windows a few tests are skipped (they need a POSIX shell or permission to create
symlinks); everything else runs the same, and CI on Linux is the reference.

## Submitting a pull request

1. Fork the repository and create a branch from `main`.
2. Make your change. Keep one logical change per pull request, and add or update tests when behaviour changes.
3. Run the checks above.
4. Open a pull request against `main` and fill in the template.

If your change touches the telemetry payload, also read [Telemetry changes](#telemetry-changes).

Leave versioning to the maintainers: do not change the version in `package.json` / `package-lock.json` and do not add
release notes. Maintainers bump the version and cut releases.

## What happens next

- A pull request from a fork may wait until a maintainer approves its CI run (always the case for a first-time
  contributor).
- CI then runs, on Linux: typecheck, unit tests, the English-only check and the telemetry collector tests
  (see [`.github/workflows/test.yml`](.github/workflows/test.yml)).
- A maintainer reviews the change, may ask for changes, and merges it if accepted.

## Where things live

| Path | |
|---|---|
| `src/server.ts` | HTTP server, run lifecycle, connectors, settings API |
| `src/serverUi.ts` | The console (one self-contained HTML page) |
| `src/run/` | Full Scan executor, incremental re-scan, checkpoints, plane selection |
| `src/research/` | The agentic pipeline: comprehension, expert bundles, critique → expert measurement, claim audit, synthesis, report writers |
| `src/sources/` | Read-only data planes (BigQuery, MCP, repo grep, GitHub metadata, OSV, code intelligence, memory) |
| `src/orgMemory.ts`, `src/memory/` | Local memory store, recall and write tools |
| `src/telemetry.ts`, `telemetry-collector/` | Anonymous usage telemetry client and collector |
| `docs/ARCHITECTURE.md` | How the pipeline fits together |

## Guidelines

- **Read-only.** Nothing may write to a scanned repo or a connected data source.
- **Evidence or it did not happen.** A finding needs a resolvable evidence pointer; anything unsettled is an open
  question, not a finding.
- **No secrets at rest** outside the opt-in key / credential files, and never in logs, reports or telemetry.
- **Fail open.** One agent or connector failing must not sink the run; record a degraded stage instead.
- **English only.** UI, prompts, reports, tests and docs (`npm run check:english` enforces it).
- **Value-free prompts.** Expert bundles and seed patterns describe methods, never a particular company's numbers,
  names or conclusions.
- Keep comments short and about *why*.

## Telemetry changes

The telemetry payload is a public contract. Adding a field needs a change to `src/telemetry.ts`,
`telemetry-collector/schema.mjs` (the schema test checks they agree), a column in `telemetry-collector/bq-schema.json`
(the collector tests check every field has one), the README table and the field table in
`telemetry-collector/README.md`. Describe the change in the pull request so the maintainers can note it in the release
notes.

## Security issues

Do not report a vulnerability in a public issue or pull request. Use GitHub's private vulnerability reporting as
described in [SECURITY.md](SECURITY.md).
