---
layout: multipage-overview
language: ja

discourse: false

partof: macros
overview-name: Macros

num: 11

title: ロードマップ
---

<span class="tag" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

今の所、Scala 2.12 におけるリフレクションおよびマクロ関連の新機能の導入の予定は無いため、
バグ修正や安定化を除けば Scala 2.12 とパラダイス 2.12 の機能は Scala 2.11 とパラダイス 2.11 と同じものとなる。

機能的には、目下労力をさいているのは [scala.meta](http://scalameta.org) だ。
これは Scala のメタプログラミングの新しい土台となるもので、現行の `scala.reflect` ベースのものに比べて、よりシンプルに、堅固になり、移植性にも適したものとなる予定だ。
いつの日か scala.meta が scala.reflect を置き換えて、Scala におけるメタプログラミングの新標準となることを目指している。

| 機能                                                                           | Scala 2.10                 | [パラダイス 2.10](/ja/overviews/macros/paradise.html) | Scala 2.11                 | [パラダイス 2.11](/ja/overviews/macros/paradise.html) | Scala 2.12                  | [パラダイス 2.12](/ja/overviews/macros/paradise.html) |
|-----------------------------------------------------------------------------------|----------------------------|--------------------------------------------------|----------------------------|--------------------------------------------------|-----------------------------|--------------------------------------------------|
| [blackbox と whitebox の分化](/ja/overviews/macros/blackbox-whitebox.html)          | No                         | No  <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [def マクロ](/ja/overviews/macros/overview.html)                                     | Yes                        | Yes <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [マクロバンドル](/ja/overviews/macros/bundles.html)                                   | No                         | No  <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [implicit マクロ](/ja/overviews/macros/implicits.html)                               | Yes (since 2.10.2)         | Yes <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [関数従属性の具現化](/ja/overviews/macros/implicits.html#fundep_materialization) | No                         | Yes <sup>2</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [型プロバイダ](/ja/overviews/macros/typeproviders.html)                            | 一部サポート (see docs) | Yes <sup>2</sup>                                 | 一部サポート (see docs) | Yes <sup>2</sup>                                 | 一部サポート (see docs)  | Yes <sup>2</sup>                                 |
| 準クォート                                 | No                         | Yes <sup>1</sup>                                 | Yes                        | Yes <sup>1</sup>                                 | Yes                         | Yes <sup>1</sup>                                 |
| [型マクロ](/ja/overviews/macros/typemacros.html)                                  | No                         | No                                               | No                         | No                                               | No                          | No                                               |
| [型指定の無いマクロ](/ja/overviews/macros/untypedmacros.html)                            | No                         | No                                               | No                         | No                                               | No                          | No                                               |
| [マクロアノテーション](/ja/overviews/macros/annotations.html)                           | No                         | Yes <sup>2</sup>                                 | No                         | Yes <sup>2</sup>                                 | No                          | Yes <sup>2</sup>                                 |

<p><sup>1</sup> この機能は、マクロパラダイスに対してコンパイル時でも実行時でもライブラリ依存性を導入しない。そのため、出てきたバイトコードを使ったコンパイルにも、このバイトコードの実行にもマクロパラダイスをクラスパスに通すことを必要としない。</p>
<p><sup>2</sup> この機能は、マクロパラダイスに対してコンパイル時のライブラリ依存性を導入するが、実行時には必要ない。そのため、出てきたバイトコードを使ったコンパイルをするのにユーザ側のビルドにもプラグインを追加する必要があるが、このバイトコードやこのバイトコードによってマクロ展開されたものを実行するのにクラスパスに追加されるものはない。</p>
<p><sup>3</sup> <code>-Yfundep-materialization</code> フラグが有効になっている場合のみ動作する。</p>
