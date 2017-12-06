#!/bin/bash

. /usr/local/rvm/scripts/rvm

set -eux

bundle install
./scripts/run-tut.sh
rm -r tut-tmp
bundle exec jekyll build
bundle exec htmlproofer ./_site/ --only-4xx --empty-alt-ignore --allow-hash-href

exit 0
