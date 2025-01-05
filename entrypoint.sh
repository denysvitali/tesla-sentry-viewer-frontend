#!/bin/bash
set -ex
envsubst < /usr/share/nginx/html/config.json.template > /usr/share/nginx/html/config.json
nginx -g "daemon off;"
