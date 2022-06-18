#!/bin/bash

if [ "$VERSION" != "" ]; then
    echo "$VERSION";
    exit 0;
fi

git describe --tags --always --dirty