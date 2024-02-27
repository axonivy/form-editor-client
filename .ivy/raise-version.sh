#!/bin/bash
set -e

npm install
npx lerna version ${1/SNAPSHOT/next} --no-git-tag-version --no-push --ignore-scripts --exact --yes
npm install
