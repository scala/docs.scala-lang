---
title: Compiler Options Lookup Table
type: section
description: This section contains the compiler options lookup tables
num: 24
previous-page: options-intro
next-page: options-new
---

This table lists the Scala 2.13 compiler options with their equivalent in Scala 3.
Some options have cross-version support, such as `-Vprint`.
Others have a close equivalent with a different name. A number of Scala 2 options
have no equivalent in Scala 3, such as options for debugging Scala 2 macros.

The compiler options are shown as displayed by the help output `scalac -help`, `scalac -X`, etc.
A few aliases are shown here, but most older aliases, such as `-Xprint` for `-Vprint`,
or `-Ytyper-debug` for `-Vtyper`, are listed by the latest name.

The option groups `-V` and `-W` were introduced in Scala 2.13, for "verbose" options that
request additional diagnostic output and "warnings" that request additional checks which
may or may not indicate errors in code. `-Werror` elevates warnings to errors, and `-Wconf`
allows precise control over warnings by either ignoring them or taking them as errors.
The configuration string for `-Wconf` will likely require adjustment when migrating to Scala 3,
since the configuration syntax and the error messages it matches are different.

| Status | Meaning |
|-|-|
| <i class="fa fa-check fa-lg"></i> | It is available in Scala 3. |
| `<new-name>` | It has been renamed to `<new-name>`. |
| <i class="fa fa-times fa-lg"></i> | It is not yet available but could be added later. |

> The current comparison is based on Scala 2.13.10 and 3.3.0.

## Standard Settings

| 2.13.x | 3.3.x |
|-|-|
| `-Dproperty=value` | <i class="fa fa-check fa-lg"></i> |
| `-J<flag>` | <i class="fa fa-check fa-lg"></i> |
| `-P:<plugin>:<opt>` |<i class="fa fa-check fa-lg"></i>|
| `-V` | <i class="fa fa-check fa-lg"></i> |
| `-W` | <i class="fa fa-check fa-lg"></i> |
| `-X` |<i class="fa fa-check fa-lg"></i>|
| `-Y` |<i class="fa fa-check fa-lg"></i>|
| `-bootclasspath` |<i class="fa fa-check fa-lg"></i>| 
| `-classpath` |<i class="fa fa-check fa-lg"></i>| 
| `-d` |<i class="fa fa-check fa-lg"></i>|
| `-dependencyfile` | <i class="fa fa-times fa-lg"></i> |
| `-deprecation` |<i class="fa fa-check fa-lg"></i>| 
| `-encoding` |<i class="fa fa-check fa-lg"></i>| 
| `-explaintypes` | `-explain-types` | 
| `-extdirs` |<i class="fa fa-check fa-lg"></i>| 
| `-feature` |<i class="fa fa-check fa-lg"></i>|
| `-g` | <i class="fa fa-times fa-lg"></i> |
| `-help` |<i class="fa fa-check fa-lg"></i>| 
| `-javabootclasspath` |<i class="fa fa-check fa-lg"></i>| 
| `-javaextdirs` |<i class="fa fa-check fa-lg"></i>| 
| `-language` |<i class="fa fa-check fa-lg"></i>|
| `-no-specialization` | <i class="fa fa-times fa-lg"></i> |
| `-nobootcp` | <i class="fa fa-times fa-lg"></i> |
| `-nowarn` |<i class="fa fa-check fa-lg"></i>|
| `-opt` | <i class="fa fa-times fa-lg"></i> |
| `-opt-inline-from` | <i class="fa fa-times fa-lg"></i> |
| `-opt-warnings` | <i class="fa fa-times fa-lg"></i> |
| `-optimize` | <i class="fa fa-times fa-lg"></i> |
| `-print` |<i class="fa fa-check fa-lg"></i>| 
| `-release` |<i class="fa fa-check fa-lg"></i>|
| `-rootdir` | <i class="fa fa-times fa-lg"></i> |
| `-sourcepath` |<i class="fa fa-check fa-lg"></i>| 
| `-target` | `-Xtarget` |
| `-toolcp` | <i class="fa fa-times fa-lg"></i> |
| `-unchecked` |<i class="fa fa-check fa-lg"></i>| 
| `-uniqid` |<i class="fa fa-check fa-lg"></i>| 
| `-usejavacp` |<i class="fa fa-check fa-lg"></i>|
| `-usemanifestc` | <i class="fa fa-times fa-lg"></i> |
| `-verbose` |<i class="fa fa-check fa-lg"></i>| 
| `-version` |<i class="fa fa-check fa-lg"></i>|

## Verbose Settings

| 2.13.x | 3.3.x |
|-|-|
| `-Vbrowse:<phases>` | <i class="fa fa-times fa-lg"></i> |
| `-Vclasspath` | `-Ylog-classpath` |
| `-Vdebug` | `-Ydebug` |
| `-Vdebug-tasty` | <i class="fa fa-times fa-lg"></i> |
| `-Vdebug-type-error` | <i class="fa fa-times fa-lg"></i> |
| `-Vdoc` | <i class="fa fa-times fa-lg"></i> |
| `-Vfree-terms` | <i class="fa fa-times fa-lg"></i> |
| `-Vfree-types` | <i class="fa fa-times fa-lg"></i> |
| `-Vhot-statistics`| <i class="fa fa-times fa-lg"></i> |
| `-Vide`| <i class="fa fa-times fa-lg"></i> |
| `-Vimplicit-conversions`| <i class="fa fa-times fa-lg"></i> |
| `-Vimplicits`| <i class="fa fa-times fa-lg"></i> |
| `-Vimplicits-max-refined`| <i class="fa fa-times fa-lg"></i> |
| `-Vimplicits-verbose-tree`| <i class="fa fa-times fa-lg"></i> |
| `-Vinline <package/Class.method>` | <i class="fa fa-times fa-lg"></i> |
| `-Vlog:<phases>` | `-Ylog:<phases>`|
| `-Vmacro` | <i class="fa fa-times fa-lg"></i> |
| `-Vmacro-lite` | <i class="fa fa-times fa-lg"></i> |
| `-Vopt <package/Class.method>` | <i class="fa fa-times fa-lg"></i> |
| `-Vpatmat` | <i class="fa fa-times fa-lg"></i> |
| `-Vphases` | <i class="fa fa-check fa-lg"></i> |
| `-Vpos`| <i class="fa fa-times fa-lg"></i> |
| `-Vprint:<phases>` | <i class="fa fa-check fa-lg"></i> |
| `-Vprint-args <file>` | <i class="fa fa-times fa-lg"></i> |
| `-Vprint-pos` | `-Yprint-pos` |
| `-Vprint-types` | `-Xprint-types` |
| `-Vquasiquote` | <i class="fa fa-times fa-lg"></i> |
| `-Vreflective-calls` | <i class="fa fa-times fa-lg"></i> |
| `-Vreify` | <i class="fa fa-times fa-lg"></i> |
| `-Vshow:<phases>` | <i class="fa fa-times fa-lg"></i> |
| `-Vshow-class <class>` | <i class="fa fa-times fa-lg"></i> |
| `-Vshow-member-pos <output style>` | <i class="fa fa-times fa-lg"></i> |
| `-Vshow-object <object>` | <i class="fa fa-times fa-lg"></i> |
| `-Vshow-symkinds` | <i class="fa fa-times fa-lg"></i> |
| `-Vshow-symowners` | <i class="fa fa-times fa-lg"></i> |
| `-Vstatistics <phases>` | <i class="fa fa-times fa-lg"></i> |
| `-Vsymbols` | <i class="fa fa-times fa-lg"></i> |
| `-Vtype-diffs` | <i class="fa fa-times fa-lg"></i> |
| `-Vtyper` | <i class="fa fa-times fa-lg"></i> |

## Warning Settings

| 2.13.x | 3.3.x |
|-|-|
| `-Wconf` | <i class="fa fa-check fa-lg"></i> |
| `-Wdead-code` | <i class="fa fa-times fa-lg"></i> |
| `-Werror` | <i class="fa fa-check fa-lg"></i> |
| `-Wextra-implicit` | <i class="fa fa-times fa-lg"></i> |
| `-Wmacros:<mode>` | <i class="fa fa-times fa-lg"></i> |
| `-Wnonunit-if` | <i class="fa fa-times fa-lg"></i> |
| `-Wnonunit-statement` | <i class="fa fa-check fa-lg"></i> |
| `-Wnumeric-widen` | <i class="fa fa-times fa-lg"></i> |
| `-Woctal-literal` | <i class="fa fa-times fa-lg"></i> |
| `-Wopt` | <i class="fa fa-times fa-lg"></i> |
| `-Wperformance` | <i class="fa fa-times fa-lg"></i> |
| `-Wself-implicit` | <i class="fa fa-times fa-lg"></i> |
| `-Wunused:<warnings>` | <i class="fa fa-check fa-lg"></i> |
| `-Wvalue-discard`| <i class="fa fa-check fa-lg"></i> |

## Advanced Settings

| 2.13.x | 3.3.x |
|-|-|
| `-Xasync` | <i class="fa fa-times fa-lg"></i> |
| `-Xcheckinit` | `-Wsafe-init` |
| `-Xdev` | <i class="fa fa-times fa-lg"></i> |
| `-Xdisable-assertions` | <i class="fa fa-times fa-lg"></i> |
| `-Xelide-below` | <i class="fa fa-times fa-lg"></i> |
| `-Xexperimental` | <i class="fa fa-times fa-lg"></i> |
| `-Xfuture` | <i class="fa fa-times fa-lg"></i> |
| `-Xgenerate-phase-graph` | <i class="fa fa-times fa-lg"></i> |
| `-Xjline` | <i class="fa fa-times fa-lg"></i> |
| `-Xlint:deprecation` | `-deprecation` |
| `-Xlint:<warnings>` | <i class="fa fa-times fa-lg"></i> |
| `-Xmacro-settings` | <i class="fa fa-times fa-lg"></i> |
| `-Xmain-class` | <i class="fa fa-times fa-lg"></i> |
| `-Xmaxerrs` | <i class="fa fa-times fa-lg"></i> |
| `-Xmaxwarns` | <i class="fa fa-times fa-lg"></i> |
| `-Xmigration` |<i class="fa fa-check fa-lg"></i>|
| `-Xmixin-force-forwarders` |<i class="fa fa-check fa-lg"></i>|
| `-Xno-forwarders` |<i class="fa fa-check fa-lg"></i>|
| `-Xno-patmat-analysis` | <i class="fa fa-times fa-lg"></i> |
| `-Xnon-strict-patmat-analysis` | <i class="fa fa-times fa-lg"></i> |
| `-Xnojline` | <i class="fa fa-times fa-lg"></i> |
| `-Xplugin` |<i class="fa fa-check fa-lg"></i>|
| `-Xplugin-disable` |<i class="fa fa-check fa-lg"></i>|
| `-Xplugin-list` |<i class="fa fa-check fa-lg"></i>|
| `-Xplugin-require` |<i class="fa fa-check fa-lg"></i>|
| `-Xpluginsdir` |<i class="fa fa-check fa-lg"></i>|
| `-Xprompt` |<i class="fa fa-check fa-lg"></i>|
| `-Xreporter` | <i class="fa fa-times fa-lg"></i> |
| `-Xresident` | <i class="fa fa-times fa-lg"></i> |
| `-Xscript` | <i class="fa fa-times fa-lg"></i> |
| `-Xsource` | `-source` |
| `-Xsource-reader` | <i class="fa fa-times fa-lg"></i> |
| `-Xverify` | `-Xverify-signatures` |
| `-Xxml` | <i class="fa fa-times fa-lg"></i> |

## Private settings

| 2.13.x | 3.0.x |
|-|-|
| `-Ybackend-parallelism` | <i class="fa fa-times fa-lg"></i> |
| `-Ybackend-worker-queue` | <i class="fa fa-times fa-lg"></i> |
| `-Ybreak-cycles` | <i class="fa fa-times fa-lg"></i> |
| `-Ycache-macro-class-loader` | <i class="fa fa-times fa-lg"></i> |
| `-Ycache-plugin-class-loader` | <i class="fa fa-times fa-lg"></i> |
| `-Ycheck` |<i class="fa fa-check fa-lg"></i>|
| `-Ycompact-trees` | <i class="fa fa-times fa-lg"></i> |
| `-Ydelambdafy` | <i class="fa fa-times fa-lg"></i> |
| `-Ydump-classes` |<i class="fa fa-check fa-lg"></i>|
| `-Ygen-asmp` | <i class="fa fa-times fa-lg"></i> |
| `-Yimports` | <i class="fa fa-times fa-lg"></i> |
| `-Yissue-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Yjar-compression-level` | <i class="fa fa-times fa-lg"></i> |
| `-YjarFactory` | <i class="fa fa-times fa-lg"></i> |
| `-Ymacro-annotations` | <i class="fa fa-times fa-lg"></i> |
| `-Ymacro-classpath` | <i class="fa fa-times fa-lg"></i> |
| `-Ymacro-expand` | <i class="fa fa-times fa-lg"></i> |
| `-Ymacro-global-fresh-names` | <i class="fa fa-times fa-lg"></i> |
| `-Yno-completion` | <i class="fa fa-times fa-lg"></i> |
| `-Yno-flat-classpath-cache` | <i class="fa fa-times fa-lg"></i> |
| `-Yno-generic-signatures` |<i class="fa fa-check fa-lg"></i>| 
| `-Yno-imports` |<i class="fa fa-check fa-lg"></i>|
| `-Yno-predef` |<i class="fa fa-check fa-lg"></i>|
| `-Yopt-inline-heuristics` | <i class="fa fa-times fa-lg"></i> |
| `-Ypatmat-exhaust-depth` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-any-thread` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-delay` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-locate-source-file` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-log` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-replay` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-strict` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-verbose` | <i class="fa fa-times fa-lg"></i> |
| `-Yprint-trees` | <i class="fa fa-times fa-lg"></i> |
| `-Yprofile-destination` |<i class="fa fa-check fa-lg"></i>|
| `-Yprofile-enabled` |<i class="fa fa-check fa-lg"></i>|
| `-Yprofile-external-tool` |<i class="fa fa-check fa-lg"></i>|
| `-Yprofile-run-gc` |<i class="fa fa-check fa-lg"></i>|
| `-Yprofile-trace` | <i class="fa fa-times fa-lg"></i> |
| `-Yrangepos` | <i class="fa fa-times fa-lg"></i> |
| `-Yrecursion` | <i class="fa fa-times fa-lg"></i> |
| `-Yreify-copypaste` | <i class="fa fa-times fa-lg"></i> |
| `-Yrepl-class-based` | <i class="fa fa-times fa-lg"></i> |
| `-Yrepl-outdir` | <i class="fa fa-times fa-lg"></i> |
| `-Yrepl-use-magic-imports` | <i class="fa fa-times fa-lg"></i> |
| `-Yresolve-term-conflict` |<i class="fa fa-check fa-lg"></i>|
| `-Yscala3-implicit-resolution` | <i class="fa fa-times fa-lg"></i> |
| `-Yscriptrunner` | <i class="fa fa-times fa-lg"></i> |
| `-Yskip` |<i class="fa fa-check fa-lg"></i>|
| `-Ystop-after` |<i class="fa fa-check fa-lg"></i>|
| `-Ystop-before` |<i class="fa fa-check fa-lg"></i>|
| `-Ytasty-no-annotations` | <i class="fa fa-times fa-lg"></i> |
| `-Ytasty-reader` | <i class="fa fa-times fa-lg"></i> |
| `-Ytrack-dependencies` | <i class="fa fa-times fa-lg"></i> |
| `-Yvalidate-pos` | <i class="fa fa-times fa-lg"></i> |

## Compiler Plugins

Some useful Scala 2.13 compiler plugins are now shipped into the compiler.
You can enable and configure them with some new native options.

### Scala.js

| 2.13.x | 3.0.x |
|-|-|
| `-Xplugin:scalajs-compiler_<version>.jar` | `-scalajs` |
| `-P:scalajs:genStaticForwardersForNonTopLevelObjects` | `-scalajs-genStaticForwardersForNonTopLevelObjects` |
| `-P:scalajs:mapSourceURI`| `-scalajs-mapSourceURI`|

### SemanticDB

| 2.13.x | 3.0.x |
|-|-|
| `-Xplugin:semanticdb-scalac_<version>.jar`| `-Xsemanticdb` |
| `-P:semanticdb:targetroot:<path>` | `-semanticdb-target:<path>` |

### Kind-Projector

| 2.13.x | 3.0.x |
|-|-|
| `-Xplugin:kind-projector_<version>.jar` | `-Ykind-projector` |
