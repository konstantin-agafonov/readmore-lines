SHELL := /bin/bash
VERSION_TYPE ?= patch

.PHONY: help bump build test check tag publish

help:
	@echo "Usage: make <target> [VERSION_TYPE=patch|minor|major]"
	@echo ""
	@echo "Targets:"
	@echo "  bump     - bump version in package.json + create git tag (default: patch)"
	@echo "  build    - build dist (js/min) and copy types into dist"
	@echo "  test     - run jest tests"
	@echo "  check    - build + test + npm pack --dry-run (inspect tarball contents)"
	@echo "  tag      - push version commit and v<version> tag to origin"
	@echo "  publish  - full release: check -> bump -> npm publish -> push tag"
	@echo ""
	@echo "Prerequisites:"
	@echo "  - logged in to npm (npm login once)"
	@echo "  - clean git working tree"

bump:
	npm version $(VERSION_TYPE)

build:
	npm run build
	npm run build:types

test:
	npm test

check: build test
	@echo "--- npm pack --dry-run ---"
	npm pack --dry-run

tag:
	git push origin --follow-tags

publish: check
	@npm whoami >/dev/null 2>&1 || { echo "ERROR: not logged in to npm. Run 'npm login' first."; exit 1; }
	npm version $(VERSION_TYPE)
	npm publish
	git push origin --follow-tags
	@echo "Published v$$(node -p "require('./package.json').version")"