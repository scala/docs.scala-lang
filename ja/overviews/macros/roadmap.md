---
layout: overview-large
language: ja

disqus: true

partof: macros
num: 10
outof: 10
title: ロードマップ
---

<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**



| 機能                                                                           | Scala 2.10         | [パラダイス 2.10](/ja/overviews/macros/paradise.html)                                         | [パラダイス 2.11](/ja/overviews/macros/paradise.html)                                          | Scala 2.11   |
|-----------------------------------------------------------------------------------|--------------------|------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|--------------|
| [blackbox と whitebox の分化](/ja/overviews/macros/blackbox-whitebox.html)          | No                 | No  <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes          |
| [def マクロ](/ja/overviews/macros/overview.html)                                     | Yes                | Yes <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes          |
| [マクロバンドル](/ja/overviews/macros/bundles.html)                                   | No                 | No  <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes          |
| [implicit マクロ](/ja/overviews/macros/implicits.html)                               | Yes (since 2.10.2) | Yes <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes          |
| [関数従属性の具現化](/ja/overviews/macros/implicits.html#fundep_materialization) | No                 | Yes <sup>2</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes          |
| [準クォート](/ja/overviews/macros/quasiquotes.html)                                 | No                 | Yes <sup>1</sup>                                                                         | Yes <sup>1</sup>                                                                          | Yes          |
| [型マクロ](/ja/overviews/macros/typemacros.html)                                  | No                 | [中止](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html)| [中止](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html) | No           |
| [型指定の無いマクロ](/ja/overviews/macros/untypedmacros.html)                            | No                 | [中止](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html)| [中止](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html) | No           |
| [マクロアノテーション](/ja/overviews/macros/annotations.html)                           | No                 | Yes <sup>2</sup>                                                                         | Yes <sup>2</sup>                                                                          | No           |

<sup>1</sup> この機能は、マクロパラダイスに対してコンパイル時でも実行時でもライブラリ依存性を導入しない。そのため、出てきたバイトコードを使ったコンパイルにも、このバイトコードの実行にもマクロパラダイスをクラスパスに通すことを必要としない。
<sup>2</sup> この機能は、マクロパラダイスに対してコンパイル時のライブラリ依存性を導入するが、実行時には必要ない。そのため、出てきたバイトコードを使ったコンパイルをするのにユーザ側のビルドにもプラグインを追加する必要があるが、このバイトコードやこのバイトコードによってマクロ展開されたものを実行するのにクラスパスに追加されるものはない。
