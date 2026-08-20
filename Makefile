SHELL := /bin/bash
VERSION_TYPE ?= patch

.PHONY: help bump build test check publish

help:
	@echo "Usage: make <target> [VERSION_TYPE=patch|minor|major]"
	@echo ""
	@echo "Targets:"
	@echo "  bump     - bump version in package.json only (default: patch)"
	@echo "  build    - build dist (js/min) and copy types into dist"
	@echo "  test     - run jest tests"
	@echo "  check    - build + test + npm pack --dry-run (inspect tarball contents)"
	@echo "  publish  - full release: check -> bump -> npm publish"
	@echo ""
	@echo "Prerequisites:"
	@echo "  - logged in to npm (npm login once)"
	@echo "  - clean git working tree"

bump:
	npm version $(VERSION_TYPE) --no-git-tag-version

build:
	npm run build
	npm run build:types

test:
	npm test

check: build test
	@echo "--- npm pack --dry-run ---"
	npm pack --dry-run

publish: check
	@npm whoami >/dev/null 2>&1 || { echo "ERROR: not logged in to npm. Run 'npm login' first."; exit 1; }
	npm version $(VERSION_TYPE) --no-git-tag-version
	npm publish
	@echo "Published v$$(node -p "require('./package.json').version")"