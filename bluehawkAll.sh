#!/bin/bash -ex

pushd "$(dirname "$0")"

find . -name bluehawk.sh | while read ln; do $ln; done

popd
