---
title: コンパイラオプションのルックアップテーブル
type: section
description: このセクションではコンパイラオプションのルックアップテーブルが含まれています
num: 22
previous-page: options-intro
next-page: options-new
language: ja
---

コンパイラオプションは、Scala 2.13 の名前に従い、分類および順序付けしている。
各 Scala 2.13 オプションは、Scala 3 でのステータスと関連付けている。

| Status | Meaning |
|---|---|
| <i class="fa fa-check fa-lg"></i> | Scala 3で利用可能 |
| `<new-name>` | `<new-name>` に変名した |
| <i class="fa fa-times fa-lg"></i> | 3.0.0 では利用できないが後から追加するだろう |

> 現状の比較に関しては 2.13.4 と 3.0.0-M3 で比較している。 

## 基本設定

| 2.13.x | 3.0.x |
|---|---|
| `-Dproperty=value` | <i class="fa fa-times fa-lg"></i> |
| `-J<flag>` | <i class="fa fa-times fa-lg"></i> |
| `-P:<plugin>:<opt>` |<i class="fa fa-check fa-lg"></i>|
| `-V` | <i class="fa fa-times fa-lg"></i> |
| `-W` | <i class="fa fa-times fa-lg"></i> |
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

## 拡張設定

| 2.13.x | 3.0.x |
|---|---|
| `-X` |<i class="fa fa-check fa-lg"></i>|
| `-Xcheckinit` | `-Ycheck-init` |
| `-Xdev` | <i class="fa fa-times fa-lg"></i> |
| `-Xdisable-assertions` | <i class="fa fa-times fa-lg"></i> |
| `-Xelide-below` | <i class="fa fa-times fa-lg"></i> |
| `-Xexperimental` | <i class="fa fa-times fa-lg"></i> |
| `-Xfuture` | <i class="fa fa-times fa-lg"></i> |
| `-Xgenerate-phase-graph` | <i class="fa fa-times fa-lg"></i> |
| `-Xjline` | <i class="fa fa-times fa-lg"></i> |
| `-Xlint:deprecation` | `-deprecation` |
| `-Xlint:<warnings>` | <i class="fa fa-times fa-lg"></i> |
| `-Xlog-implicit-conversion` | <i class="fa fa-times fa-lg"></i> |
| `-Xlog-implicits` | <i class="fa fa-times fa-lg"></i> |
| `-Xlog-reflective-calls` | <i class="fa fa-times fa-lg"></i> |
| `-Xmacro-settings` | <i class="fa fa-times fa-lg"></i> |
| `-Xmain-class` | <i class="fa fa-times fa-lg"></i> |
| `-Xmaxerrs` | <i class="fa fa-times fa-lg"></i> |
| `-Xmaxwarns` | <i class="fa fa-times fa-lg"></i> |
| `-Xmigration` |<i class="fa fa-check fa-lg"></i>| 
| `-Xmixin-force-forwarders` |<i class="fa fa-check fa-lg"></i>| 
| `-Xno-forwarders` |<i class="fa fa-check fa-lg"></i>|
| `-Xno-patmat-analysis` | <i class="fa fa-times fa-lg"></i> |
| `-Xnojline` | <i class="fa fa-times fa-lg"></i> |
| `-Xplugin` |<i class="fa fa-check fa-lg"></i>| 
| `-Xplugin-disable` |<i class="fa fa-check fa-lg"></i>| 
| `-Xplugin-list` |<i class="fa fa-check fa-lg"></i>| 
| `-Xplugin-require` |<i class="fa fa-check fa-lg"></i>| 
| `-Xpluginsdir` |<i class="fa fa-check fa-lg"></i>|
| `-Xprint-args` | <i class="fa fa-times fa-lg"></i> |
| `-Xprompt` |<i class="fa fa-check fa-lg"></i>|
| `-Xreporter` | <i class="fa fa-times fa-lg"></i> |
| `-Xresident` | <i class="fa fa-times fa-lg"></i> |
| `-Xscript` | <i class="fa fa-times fa-lg"></i> |
| `-Xshow-class <class>` | <i class="fa fa-times fa-lg"></i> |
| `-Xshow-object <object>` | <i class="fa fa-times fa-lg"></i> |
| `-Xsource` | `-source` |
| `-Xsource-reader` | <i class="fa fa-times fa-lg"></i> |
| `-Xverify` | `-Xverify-signatures` |
| `-Xxml` | <i class="fa fa-times fa-lg"></i> |

## プライベート設定

| 2.13.x | 3.0.x |
|---|---|
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
| `-Yhot-statistics` | <i class="fa fa-times fa-lg"></i> |
| `-Yide-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Yimports` | <i class="fa fa-times fa-lg"></i> |
| `-Yissue-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Yjar-compression-level` | <i class="fa fa-times fa-lg"></i> |
| `-YjarFactory` | <i class="fa fa-times fa-lg"></i> |
| `-Ymacro-debug-lite` | <i class="fa fa-times fa-lg"></i> |
| `-Ymacro-debug-verbose` | <i class="fa fa-times fa-lg"></i> |
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
| `-Yopt-log-inline <package/Class.method>` | <i class="fa fa-times fa-lg"></i> |
| `-Yopt-trace <package/Class.method>` | <i class="fa fa-times fa-lg"></i> |
| `-Ypatmat-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Ypatmat-exhaust-depth` | <i class="fa fa-times fa-lg"></i> |
| `-Ypos-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-any-thread` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-delay` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-locate-source-file` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-log` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-strict` | <i class="fa fa-times fa-lg"></i> |
| `-Ypresentation-verbose` | <i class="fa fa-times fa-lg"></i> |
| `-Yprint-trees` | <i class="fa fa-times fa-lg"></i> |
| `-Yprofile-destination` |<i class="fa fa-check fa-lg"></i>| 
| `-Yprofile-enabled` |<i class="fa fa-check fa-lg"></i>|
| `-Yprofile-trace` | <i class="fa fa-times fa-lg"></i> |
| `-Yquasiquote-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Yrangepos` | <i class="fa fa-times fa-lg"></i> |
| `-Yrecursion` | <i class="fa fa-times fa-lg"></i> |
| `-Yreify-copypaste` | <i class="fa fa-times fa-lg"></i> |
| `-Yreify-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Yrepl-class-based` | <i class="fa fa-times fa-lg"></i> |
| `-Yrepl-outdir` | <i class="fa fa-times fa-lg"></i> |
| `-Yrepl-use-magic-imports` | <i class="fa fa-times fa-lg"></i> |
| `-Yresolve-term-conflict` |<i class="fa fa-check fa-lg"></i>|
| `-Yscriptrunner` | <i class="fa fa-times fa-lg"></i> |
| `-Yskip` |<i class="fa fa-check fa-lg"></i>| 
| `-Yshow:<phases>` | <i class="fa fa-times fa-lg"></i> |
| `-Yshow-member-pos <output style>` | <i class="fa fa-times fa-lg"></i> |
| `-Yshow-symkinds` | <i class="fa fa-times fa-lg"></i> |
| `-Yshow-symowners` | <i class="fa fa-times fa-lg"></i> |
| `-Yshow-syms` | <i class="fa fa-times fa-lg"></i> |
| `-Ystatistics <phases>` | <i class="fa fa-times fa-lg"></i> |
| `-Ystop-after` |<i class="fa fa-check fa-lg"></i>| 
| `-Ystop-before` |<i class="fa fa-check fa-lg"></i>| 
| `-Ytyper-debug` | <i class="fa fa-times fa-lg"></i> |
| `-Yvalidate-pos` | <i class="fa fa-times fa-lg"></i> |
| `-Ywarn-dead-code` | <i class="fa fa-times fa-lg"></i> |
| `-Ywarn-numeric-widen` | <i class="fa fa-times fa-lg"></i> |
| `-Ywarn-unused:<warnings>` | <i class="fa fa-times fa-lg"></i> |
| `-Ywarn-value-discard` | <i class="fa fa-times fa-lg"></i> |

## 詳細設定

2.13 では詳細設定が導入されていた。
その殆どはScala 3 ではまだ実装されていない。

| 2.13.x | 3.0.x |
|---|---|
| `-Vbrowse:<phases>` | <i class="fa fa-times fa-lg"></i> |
| `-Vdebug-tasty` | <i class="fa fa-times fa-lg"></i> |
| `-Vdoc` | <i class="fa fa-times fa-lg"></i> |
| `-Vfree-terms` | <i class="fa fa-times fa-lg"></i> |
| `-Vfree-types` | <i class="fa fa-times fa-lg"></i> |
| `-Vhot-statistics`| <i class="fa fa-times fa-lg"></i> |
| `-Vide`| <i class="fa fa-times fa-lg"></i> |
| `-Vimplicit-conversions`| <i class="fa fa-times fa-lg"></i> |
| `-Vimplicits`| <i class="fa fa-times fa-lg"></i> |
| `-Vinline <package/Class.method>` | <i class="fa fa-times fa-lg"></i> |
| `-Vissue`| <i class="fa fa-times fa-lg"></i> |
| `-Vmacro` | <i class="fa fa-times fa-lg"></i> |
| `-Vmacro-lite` | <i class="fa fa-times fa-lg"></i> |
| `-Vopt <package/Class.method>` | <i class="fa fa-times fa-lg"></i> |
| `-Vpatmat` | <i class="fa fa-times fa-lg"></i> |
| `-Vpos`| <i class="fa fa-times fa-lg"></i> |
| `-Vprint:<phases>` | `-Xprint:<phases>` |
| `-Vphases` | `-Xshow-phases` |
| `-Vclasspath` | `-Ylog-classpath` |
| `-Vlog:<phases>` | `-Ylog:<phases>`|
| `-Vdebug` | `-Ydebug` |
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
| `-Vtyper` | <i class="fa fa-times fa-lg"></i> |

## Warning設定

Warningの設定は 2.13 で導入されていた。
その殆どは Scala 3 ではまだ実装されていない。

| 2.13.x | 3.0.x |
|-|-|
| `-Wconf` | <i class="fa fa-times fa-lg"></i> |
| `-Wdead-code` | <i class="fa fa-times fa-lg"></i> |
| `-Werror` | `-Xfatal-warnings` |
| `-Wextra-implicit` | <i class="fa fa-times fa-lg"></i> |
| `-Wmacros:<mode>` | <i class="fa fa-times fa-lg"></i> |
| `-Wnumeric-widen` | <i class="fa fa-times fa-lg"></i> |
| `-Woctal-literal` | <i class="fa fa-times fa-lg"></i> |
| `-Wunused:<warnings>` | <i class="fa fa-times fa-lg"></i> |
| `-Wvalue-discard`| <i class="fa fa-times fa-lg"></i> |
| `-Wself-implicit` | <i class="fa fa-times fa-lg"></i> |

## コンパイラプラグイン

いくつかの便利な Scala 2.13 コンパイラプラグインは Scala 3 コンパイラに同梱されている。
いくつかの新しいネイティブオプションを使用して、有効にできる。

### Scala.js

| 2.13.x | 3.0.x |
|---|---|
| `-Xplugin:scalajs-compiler_<version>.jar` | `-scalajs` |
| `-P:scalajs:genStaticForwardersForNonTopLevelObjects` | `-scalajs-genStaticForwardersForNonTopLevelObjects` |
| `-P:scalajs:mapSourceURI`| `-scalajs-mapSourceURI`|

### SemanticDB

| 2.13.x | 3.0.x |
|---|---|
| `-Xplugin:semanticdb-scalac_<version>.jar`| `-Xsemanticdb` |
| `-P:semanticdb:targetroot:<path>` | `-semanticdb-target:<path>` |

### Kind-Projector

| 2.13.x | 3.0.x |
|---|---|
| `-Xplugin:kind-projector_<version>.jar` | `-Ykind-projector` |
