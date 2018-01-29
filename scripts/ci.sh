#!/bin/bash

. /usr/local/rvm/scripts/rvm

set -eux

bundle install
./scripts/run-tut.sh
rm -r tut-tmp
bundle exec jekyll build

# Checking for docs.scala-lang/blob/master leads to a chicken and egg problem because of the edit links of new pages.
bundle exec htmlproofer ./_site/ --only-4xx --empty-alt-ignore --allow-hash-href --url-ignore '/https://github.com/scala/docs.scala-lang/blob/master/.*/'

exit 0
