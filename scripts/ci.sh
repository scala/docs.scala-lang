#!/bin/bash

. /usr/local/rvm/scripts/rvm

set -eux

bundle install
./scripts/run-mdoc.sh
rm -r /tmp/mdoc-out/
bundle exec jekyll build

# Checking for docs.scala-lang/blob/master leads to a chicken and egg problem because of the edit links of new pages.
# The docs at http://dotty.epfl.ch/api/scala/tasty/ are temporarily not available.
bundle exec htmlproofer ./_site/\
  --only-4xx\
  --http-status-ignore "400,401,429"\
  --empty-alt-ignore\
  --allow-hash-href\
  --url-ignore '/https://github.com/scala/docs.scala-lang/blob/master/.*/,/www.oracle.com/'

exit 0
