# Release Guide

How to publish a new version of `readmore-lines` to npm. All release steps are automated with `make`.

## Full release (one command)

```bash
npm login          # once per machine, required - publish fails without it
make publish
```

`make publish` does: build `dist/` → copy types → run tests → show tarball contents (`npm pack --dry-run`) → bump version in `package.json` → `npm publish`.

## Prerequisites

- Logged in to npm: `npm login` (the target fails with a clear error otherwise).
- Clean git working tree (`git status` empty).
- All feature branches merged/pushed to origin beforehand.

## Commands

| Command | Description |
| --- | --- |
| `make publish` | Full release: check → bump → `npm publish` |
| `make check` | Build + test + `npm pack --dry-run` (inspect contents) |
| `make bump` | Bump version in `package.json` only |
| `make build` | Build `dist/` and copy types (`npm run build && npm run build:types`) |
| `make test` | Run jest tests |

## Options

- Bump type: `make publish VERSION_TYPE=minor` (default `patch`), also `major`.
- `VERSION_TYPE` applies to any target that bumps: `make bump VERSION_TYPE=minor`.

## Manual git steps

`make` does not touch git. After a successful publish, handle git yourself:

```bash
git add package.json package-lock.json
git commit -m "1.0.5"
git tag v1.0.5
git push origin <branch> --follow-tags
```

## Notes

- `npm version --no-git-tag-version` only edits `package.json` (and `package-lock.json`); no commit or tag is created.
- `npm publish` runs `prepublishOnly` (`build` → `build:types` → `test`) automatically, so `dist/` is always fresh even though it is gitignored.
- Version must be bumped: publishing an already-published version fails with `E403`.