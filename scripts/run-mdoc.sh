#!/bin/bash
set -eux

cs launch --scala-version 2.13.15 org.scalameta::mdoc:2.3.3 -- \
  --in . \
  --out /tmp/mdoc-out/ \
  --classpath \
  $(cs fetch --scala-version 2.13.15 -p \
    com.chuusai::shapeless:2.3.10 \
    org.scala-lang::toolkit:0.1.7 \
    org.scala-lang::toolkit-test:0.1.7 \
  ) \
  --scalac-options "-Xfatal-warnings -feature" \
  --no-link-hygiene \
  --include '**.md'

exit 0
