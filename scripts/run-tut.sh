#!/bin/bash

set -eux

coursier launch -r "https://dl.bintray.com/tpolecat/maven/" org.tpolecat:tut-core_2.12:0.6.7 -- . tut-tmp '.*\.md$' -classpath $(coursier fetch -p com.chuusai:shapeless_2.12:2.3.3) -Xfatal-warnings -feature

exit 0
