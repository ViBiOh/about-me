SHELL = /usr/bin/env bash -o nounset -o pipefail -o errexit -c

APP_NAME = about

## help: Display list of commands
.PHONY: help
help: Makefile
	@sed -n 's|^##||p' $< | column -t -s ':' | sort

## name: Output app name
.PHONY: name
name:
	@printf "$(APP_NAME)"

## version: Output last commit sha in short version
.PHONY: version
version:
	@printf "$(shell git rev-parse --short HEAD)"

## version-full: Output last commit sha
.PHONY: version-full
version-full:
	@printf "$(shell git rev-parse HEAD)"

## version-date: Output last commit date
.PHONY: version-date
version-date:
	@printf "$(shell git log -n 1 "--date=format:%Y%m%d%H%M" "--pretty=format:%cd")"
