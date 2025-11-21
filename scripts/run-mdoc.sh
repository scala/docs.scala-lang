#!/bin/bash
set -eux

cs launch --scala-version 2.13.17 org.scalameta::mdoc:2.3.3 -- \
  --in . \
  --out /tmp/mdoc-out/ \
  --classpath \
  $(cs fetch --scala-version 2.13.17 -p \
    com.chuusai::shapeless:2.3.10 \
    org.scala-lang::toolkit:0.7.0 \
    org.scala-lang::toolkit-test:0.7.0 \
  ) \
  --scalac-options "-Xfatal-warnings -feature" \
  --no-link-hygiene \
  --include '**.md'

exit 0
