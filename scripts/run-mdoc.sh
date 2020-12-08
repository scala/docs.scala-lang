#!/bin/bash
set -eux

coursier launch org.scalameta:mdoc_2.12:2.2.13 -- \
  --in . \
  --out /tmp/mdoc-out/ \
  --classpath $(coursier fetch -p com.chuusai:shapeless_2.12:2.3.3) \
  --scalac-options "-Xfatal-warnings -feature" \
  --no-link-hygiene
  --exclude _overviews/contributors/index.md

exit 0
