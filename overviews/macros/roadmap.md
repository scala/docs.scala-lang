---
layout: overview-large
title: Roadmap

disqus: true

partof: macros
num: 11
languages: [ja]
---

<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

Scala team is currently busy with the release of Scala 2.11.0-final, and at the moment we don't have concrete plans for Scala 2.12.
Consequently, roadmaps for Scala 2.12 and Paradise 2.12 don't exist yet. We will update this page once the information becomes available.

| Feature                                                                           | Scala 2.10         | [Paradise 2.10](/overviews/macros/paradise.html)                                         | [Paradise 2.11](/overviews/macros/paradise.html)                                          | Scala 2.11      |
|-----------------------------------------------------------------------------------|--------------------|------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|-----------------|
| [Blackbox/whitebox separation](/overviews/macros/blackbox-whitebox.html)          | No                 | No  <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes             |
| [Def macros](/overviews/macros/overview.html)                                     | Yes                | Yes <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes             |
| [Macro bundles](/overviews/macros/bundles.html)                                   | No                 | No  <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes             |
| [Implicit macros](/overviews/macros/implicits.html)                               | Yes (since 2.10.2) | Yes <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes             |
| [Fundep materialization](/overviews/macros/implicits.html#fundep_materialization) | No                 | Yes <sup>2</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes             |
| [Type providers](/overviews/macros/typeproviders.html)                            | Partial support    | Yes <sup>2</sup>                                                                         | Yes <sup>2</sup>                                                                          | Partial support |
| [Quasiquotes](/overviews/macros/quasiquotes.html)                                 | No                 | Yes <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes             |
| [Type macros](/overviews/macros/typemacros.html)                                  | No                 | [Discontinued](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html)| [Discontinued](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html) | No              |
| [Untyped macros](/overviews/macros/untypedmacros.html)                            | No                 | [Discontinued](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html)| [Discontinued](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html) | No              |
| [Macro annotations](/overviews/macros/annotations.html)                           | No                 | Yes <sup>2</sup>                                                                         | Yes <sup>2</sup>                                                                          | No              |

<p><sup>1</sup> This feature doesn't bring a compile-time or a runtime dependency on macro paradise. This means that neither compiling against your bytecode that uses this feature, nor running this bytecode requires the macro paradise plugin to be present on classpath.</p>
<p><sup>2</sup> This feature brings a compile-time, but not a runtime dependency on macro paradise. This means that compiling against your bytecode that uses this feature will need the plugin to be added to your users' builds, however running this bytecode or results of macro expansions produced by this bytecode doesn't need additional classpath entries.</p>