#!/bin/bash
set -ex
pongo2-runner /usr/share/nginx/html/config.json.j2 > /usr/share/nginx/html/config.json
nginx -g "daemon off;"