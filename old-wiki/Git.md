Placeholder testing jekyll.

```
#!/usr/bin/env bash
#
# Source this file to get handy scala github commands
# including completion on svn revisions.  Things to try:
#
#   gh-commit r24396
#   gh-find Global
#   gh-tree src/actors
#

scalaSrcHome=${SCALA_SRC_HOME:-/scala/trunk}
scalaShaMap="${scalaSrcHome}/docs/svn-to-sha1-map.txt"
declare scalaSvnRevs=""

gh-tree () {
  open "http://github.com/scala/scala/tree/master/$1"
}

gh-commit () {
  if [[ $1 = r* ]]; then
    gh-svn "$1"
  else
    gh-sha "$1"
  fi
}

gh-sha () {
  [[ -n "$1" ]] && open "https://github.com/scala/scala/commit/$1"
}

gh-svn () {
  if [[ -f "$scalaShaMap" ]]; then  
    sha=$(egrep "^$1 " "$scalaShaMap" | awk '{ print $2; }' | head -1)
    [[ -n "$sha" ]] && echo "$1 => $sha" && gh-sha $sha
  else
    echo "Can't find sha map (did you set SCALA_SRC_HOME ?)"
  fi
}

gh-find () {
  ( cd "$scalaSrcHome" && 
    for f in $(ack --noenv --scala -f -g "$@" src); do
      gh-tree "$f"
    done
  )
}

_scala_matching_svn_revs () {
  egrep ^$1 "$scalaShaMap" | \
    while read -r svn sha; do
      [[ -n "$sha" ]] && echo $svn;
    done
}

_scala_svn_revs () {
  _get_comp_words_by_ref -n =: cur prev

	# only complete if 3 digits have been given
	if [[ $cur == r[0-9][0-9][0-9]* ]]; then
	  COMPREPLY=( $(compgen -W "$(_scala_matching_svn_revs "$cur")" ) )
  else
    COMPREPLY=( 'r<number>' '(will complete once three digits are present)' )
  fi
} && \
  complete -o default -F _scala_svn_revs gh-commit
```