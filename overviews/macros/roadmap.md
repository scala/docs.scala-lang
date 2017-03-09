---
layout: overview-large
title: Roadmap

disqus: true

partof: macros
num: 12
outof: 13
languages: [ko, ja]
---

<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

At the moment, we don't plan to introduce new reflection- or macro-related features in Scala 2.12,
so the functionality of Scala 2.12 and Paradise 2.12 is going to be the same as Scala 2.11 and Paradise 2.11
modulo bugfixes and stability improvements.

Feature-wise, our main effort is currently targeted at [scala.meta](http://scalameta.org),
the new foundation for metaprogramming Scala, which is simpler, more robust and much more suitable for portability
than the current system based on scala.reflect. We hope that one day scala.meta will supersede scala.reflect
and become the new standard way of doing metaprogramming in Scala.

| Feature                                                                           | Scala 2.10                      | [Paradise 2.10](/overviews/macros/paradise.html) | Scala 2.11                 | [Paradise 2.11](/overviews/macros/paradise.html) | Scala 2.12                  | [Paradise 2.12](/overviews/macros/paradise.html) |
|-----------------------------------------------------------------------------------|---------------------------------|--------------------------------------------------|----------------------------|--------------------------------------------------|-----------------------------|--------------------------------------------------|
| [Blackbox/whitebox separation](/overviews/macros/blackbox-whitebox.html)          | No                              | No  <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [Def macros](/overviews/macros/overview.html)                                     | Yes                             | Yes <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [Macro bundles](/overviews/macros/bundles.html)                                   | No                              | No  <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [Implicit macros](/overviews/macros/implicits.html)                               | Yes (since 2.10.2)              | Yes <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [Fundep materialization](/overviews/macros/implicits.html#fundep_materialization) | Yes (since 2.10.5) <sup>3</sup> | Yes <sup>2</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [Type providers](/overviews/macros/typeproviders.html)                            | Partial support (see docs)      | Yes <sup>2</sup>                                 | Partial support (see docs) | Yes <sup>2</sup>                                 | Partial support (see docs)  | Yes <sup>2</sup>                                 |
| [Quasiquotes](/overviews/quasiquotes/intro.html)                                 | No                              | Yes <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [Type macros](/overviews/macros/typemacros.html)                                  | No                              | No                                               | No                         | No                                               | No                          | No                                               |
| [Untyped macros](/overviews/macros/untypedmacros.html)                            | No                              | No                                               | No                         | No                                               | No                          | No                                               |
| [Macro annotations](/overviews/macros/annotations.html)                           | No                              | Yes <sup>2</sup>                                 | No                         | Yes <sup>2</sup>                                 | No                          | Yes <sup>2</sup>                                 |

<p><sup>1</sup> This feature doesn't bring a compile-time or a runtime dependency on macro paradise. This means that neither compiling against your bytecode that uses this feature, nor running this bytecode requires the macro paradise plugin to be present on classpath.</p>
<p><sup>2</sup> This feature brings a compile-time, but not a runtime dependency on macro paradise. This means that compiling against your bytecode that uses this feature will need the plugin to be added to your users' builds, however running this bytecode or results of macro expansions produced by this bytecode doesn't need additional classpath entries.</p>
<p><sup>3</sup> Only works under <code>-Yfundep-materialization</code>.</p>
