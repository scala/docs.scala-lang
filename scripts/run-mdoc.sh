#!/bin/bash
set -eux

cs launch org.scalameta:mdoc_2.12:2.2.13 -- \
  --in . \
  --out /tmp/mdoc-out/ \
  --classpath $(cs fetch -p com.chuusai:shapeless_2.12:2.3.3) \
  --scalac-options "-Xfatal-warnings -feature" \
  --no-link-hygiene \
  --include '**.md'

exit 0
