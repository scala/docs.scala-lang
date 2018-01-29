#!/bin/bash

set -eux

COURSIER_CLASSPATH="$(coursier fetch -p org.scala-lang.modules::scala-xml:1.0.3)"

coursier launch -r "https://dl.bintray.com/tpolecat/maven/" org.tpolecat:tut-core_2.11:0.4.4 -- . tut-tmp '.*\.md$' -classpath "$COURSIER_CLASSPATH" -Xfatal-warnings -feature

exit 0
