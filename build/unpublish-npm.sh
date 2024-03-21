#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/form-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/form-editor-core@${1}" --registry $REGISTRY
npm unpublish "@axonivy/form-editor-protocol@${1}" --registry $REGISTRY
