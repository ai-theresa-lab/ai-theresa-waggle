import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// A resumed run replays the findings checkpoint instead of re-running carry-forward; the fixes its targeted re-checks
// confirmed must survive that, or the diff downgrades them to "not confirmed" (Codex review on PR #17).
test('confirmed fixes are written to the findings checkpoint and reloaded on replay', () => {
  const src = readFileSync(new URL('./execute-org-run.ts', import.meta.url), 'utf8');
  const save = src.match(/ctx\.saveCheckpoint\(run, 'findings', \{[^\n]*/)?.[0] ?? '';
  assert.match(save, /confirmedFixed/, 'the findings checkpoint payload carries confirmedFixed');
  assert.match(src, /confirmedFixed\.push\(\.\.\.\(\(fp\.confirmedFixed \?\? \[\]\)/, 'the replay branch reloads it');
  assert.match(src, /confirmedFixed\.push\(\.\.\.co\.confirmedFixed\)/, 'a live run collects it from carry-forward');
});
