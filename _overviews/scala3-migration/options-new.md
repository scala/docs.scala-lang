---
title: New Compiler Options
type: section
description: This chapter lists all the new compiler options in Scala 3
num: 25
previous-page: options-lookup
next-page: scaladoc-settings-compatibility
---

The current page only contains the options that were added in Scala 3.0.x.

## Standard settings

| 3.0.x | description |
|-|-|
| `-color` | Colored output Default: always. |
| `-doc-snapshot` | Generate a documentation snapshot for the current Dotty version |
| `-explain` | Explain errors in more detail. |
| `-from-tasty` | Compile classes from tasty files. The arguments are .tasty or .jar files. |
| `-indent` | Together with -rewrite, remove {...} syntax when possible due to significant indentation. |
| `-new-syntax` | Require `then` and `do` in control expressions. |
| `-no-indent` | Require classical {...} syntax, indentation is not significant. |
| `-old-syntax` | Require `(...)` around conditions. |
| `-pagewidth` | Set page width Default: 80. |
| `-print-lines` | Show source code line numbers. |
| `-print-tasty` | Prints the raw tasty. |
| `-project` | The name of the project. |
| `-project-logo` | The file that contains the project's logo (in /images). |
| `-project-url` | The source repository of your project. |
| `-project-version` | The current version of your project. |
| `-rewrite` | When used in conjunction with a `...-migration` source version, rewrites sources to migrate to new version. |
| `-siteroot` | A directory containing static files from which to generate documentation. Default: ./docs. |
| `-sourceroot` | Specify workspace root directory. Default: .. |

## Verbose settings

| 3.2.x | description |
|-|-|
| `-Vprofile` | Show metrics about sources and internal representations to estimate compile-time complexity. |
| `-Vprofile-sorted-by:<column-name>` | Show metrics about sources and internal representations sorted by given column name. |
| `-Vprofile-details N` | Like -Vprofile, but also show metrics about sources and internal representations of the N most complex methods |

## Warning settings

| 3.3.x | description |
|-|-|
| `-Wunused:all`       | Enable all warnings |
| `-Wnonunit-statement` |  Warn when block statements are non-Unit expressions (added in 3.3.1) |


## Advanced settings

| 3.0.x | description |
|-|-|
| `-Xignore-scala2-macros` | Ignore errors when compiling code that calls Scala2 macros, these will fail at runtime. |
| `-Ximport-suggestion-timeout` | Timeout (in ms) for searching for import suggestions when errors are reported. |
| `-Xmax-inlined-trees` | Maximal number of inlined trees. Default: 2000000 |
| `-Xmax-inlines` | Maximal number of successive inlines. Default: 32. |
| `-Xprint-diff` | Print changed parts of the tree since last print. |
| `-Xprint-diff-del` | Print changed parts of the tree since last print including deleted parts. |
| `-Xprint-inline` | Show where inlined code comes from. |
| `-Xprint-suspension` | Show when code is suspended until macros are compiled. |
| `-Xrepl-disable-display` | Do not display definitions in REPL. |
| `-Xwiki-syntax` | Retains the Scala2 behavior of using Wiki Syntax in Scaladoc. |

## Private settings

| 3.0.x | description |
|-|-|
| `-Ycheck-all-patmat` | Check exhaustivity and redundancy of all pattern matching (used for testing the algorithm). |
| `-Ycheck-mods` | Check that symbols and their defining trees have modifiers in sync. |
| `-Ycheck-reentrant` | Check that compiled program does not contain vars that can be accessed from a global root. |
| `-Ycook-comments` | Cook the comments (type check `@usecase`, etc.) |
| `-Ydebug-error` | Print the stack trace when any error is caught. |
| `-Ydebug-flags` | Print all flags of definitions. |
| `-Ydebug-missing-refs` | Print a stacktrace when a required symbol is missing. |
| `-Ydebug-names` | Show internal representation of names. |
| `-Ydebug-pos` | Show full source positions including spans. |
| `-Ydebug-trace` | Trace core operations. |
| `-Ydebug-tree-with-id` | Print the stack trace when the tree with the given id is created. Default: -2147483648. |
| `-Ydebug-type-error` | Print the stack trace when a TypeError is caught |
| `-Ydetailed-stats` | Show detailed internal compiler stats (needs Stats.enabled to be set to true). |
| `-YdisableFlatCpCaching` | Do not cache flat classpath representation of classpath elements from jars across compiler instances. |
| `-Ydrop-comments` | Drop comments when scanning source files. |
| `-Ydump-sbt-inc` | For every compiled foo.scala, output the API representation and dependencies used for sbt incremental compilation in foo.inc, implies -Yforce-sbt-phases. |
| `-Yerased-terms` | Allows the use of erased terms. |
| `-Yexplain-lowlevel` | When explaining type errors, show types at a lower level. |
| `-Yexplicit-nulls` | Make reference types non-nullable. Nullable types can be expressed with unions: e.g. String&#124;Null. |
| `-Yforce-sbt-phases` | Run the phases used by sbt for incremental compilation (ExtractDependencies and ExtractAPI) even if the compiler is ran outside of sbt, for debugging. |
| `-Yfrom-tasty-ignore-list` | List of `tasty` files in jar files that will not be loaded when using -from-tasty |
| `-Yindent-colons` | Allow colons at ends-of-lines to start indentation blocks. |
| `-Yinstrument` | Add instrumentation code that counts allocations and closure creations. |
| `-Yinstrument-defs` | Add instrumentation code that counts method calls; needs -Yinstrument to be set, too. |
| `-Yno-decode-stacktraces` | how raw StackOverflow stacktraces, instead of decoding them into triggering operations. |
| `-Yno-deep-subtypes` | Throw an exception on deep subtyping call stacks. |
| `-Yno-double-bindings` | Assert no namedtype is bound twice (should be enabled only if program is error-free). |
| `-Yno-kind-polymorphism` | Disable kind polymorphism. |
| `-Yno-patmat-opt` | Disable all pattern matching optimizations. |
| `-Yplain-printer` | Pretty-print using a plain printer. |
| `-Yprint-debug` | When printing trees, print some extra information useful for debugging. |
| `-Yprint-debug-owners` | When printing trees, print owners of definitions. |
| `-Yprint-pos` | Show tree positions. |
| `-Yprint-pos-syms` | Show symbol definitions positions. |
| `-Yprint-syms` | When printing trees print info in symbols instead of corresponding info in trees. |
| `-Yrequire-targetName` | Warn if an operator is defined without a @targetName annotation |
| `-Yretain-trees` | Retain trees for top-level classes, accessible from ClassSymbol#tree |
| `-Yscala2-unpickler` | Control where we may get Scala 2 symbols from. This is either "always", "never", or a classpath. Default: always. |
| `-Yshow-print-errors` | Don't suppress exceptions thrown during tree printing. |
| `-Yshow-suppressed-errors` | Also show follow-on errors and warnings that are normally suppressed. |
| `-Yshow-tree-ids` | Uniquely tag all tree nodes in debugging output. |
| `-Yshow-var-bounds` | Print type variables with their bounds. |
| `-Ytest-pickler` | Self-test for pickling functionality; should be used with -Ystop-after:pickler. |
| `-Yunsound-match-types` | Use unsound match type reduction algorithm. |
