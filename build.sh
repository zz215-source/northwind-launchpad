#!/usr/bin/env sh
set -eu
test -s index.html
test -s version.json
mkdir -p dist
cp index.html version.json dist/
printf '%s\n' 'Northwind Launchpad build complete: dist/index.html and dist/version.json'
