#!/usr/bin/env bash

# Exit script when any command fails.
set -e

yarn lint
yarn build

source .env
export AZCOPY_SPA_CLIENT_SECRET=$AZ_AD_SP_CLIENT_SECRET
azcopy login --service-principal --application-id $AZ_AD_SP_APP_ID --tenant-id $AZ_AD_SP_TENANT_ID
azcopy copy "./build/*" "$AZ_BLOB_ENDPOINT/\$web" --recursive