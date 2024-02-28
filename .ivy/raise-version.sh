#!/bin/bash
set -e

npm install
npm exec -- lerna version ${1/SNAPSHOT/next} --no-git-tag-version --no-push --ignore-scripts --exact --yes
npm install
