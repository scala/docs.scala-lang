#!/bin/bash -
. /usr/local/rvm/scripts/rvm
bundle install
./scripts/run-tut.sh
rm -r tut-tmp
bundle exec jekyll build
