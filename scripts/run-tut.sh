#!/bin/bash

COURSIER_CLASSPATH="$(coursier fetch -p com.chuusai:shapeless_2.11:2.3.1 org.scala-lang.modules::scala-xml:1.0.3)"

coursier launch -r "https://dl.bintray.com/tpolecat/maven/" org.tpolecat:tut-core_2.11:0.4.4 -- . tut-tmp '.*\.md$' -classpath "$COURSIER_CLASSPATH" -Xfatal-warnings -feature
