#!/bin/bash
set -eux

cs launch org.scalameta:mdoc_2.13:2.3.3 -- \
  --in . \
  --out /tmp/mdoc-out/ \
  --classpath $(cs fetch -p com.chuusai:shapeless_2.13:2.3.10) \
  --scalac-options "-Xfatal-warnings -feature" \
  --no-link-hygiene \
  --include '**.md'

exit 0
