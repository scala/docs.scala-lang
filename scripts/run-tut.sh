#!/bin/bash

set -eux

# black-list _overviews/contributors/index.md because it embeds a Markdown snippet which embeds Scala code that does not compile
mv _overviews/contributors/index.md /tmp/_overviews_contributors_index.md

coursier launch -r "https://dl.bintray.com/tpolecat/maven/" org.tpolecat:tut-core_2.12:0.6.7 -- . tut-tmp '.*\.md$' -classpath $(coursier fetch -p com.chuusai:shapeless_2.12:2.3.3) -Xfatal-warnings -feature

# restore _overviews/contributors/index.md file
mv /tmp/_overviews_contributors_index.md _overviews/contributors/index.md

exit 0
