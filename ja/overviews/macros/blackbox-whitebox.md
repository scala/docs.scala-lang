---
layout: overview-large

language: ja
disqus: true

partof: macros
num: 3
outof: 10

title: blackbox vs whitebox
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

Scala 2.11.0-M6 以降の Scala 2.11 マイルストーンビルドよりマクロを blackbox と whitebox という二つに分かれた実装となった。これは、Scala 2.10.x やマクロパラダイスでは実装されていない。最新の 2.11 マイルストーンをダウンロードして使用するには [http://www.scala-lang.org/download/](http://www.scala-lang.org/download/) に書いてある手順を参照してほしい。

## マクロの成功

マクロが正式な Scala 2.10 リリースの一部になったことで、研究分野でも業界でもプログラマは様々な問題に対して独創的なマクロの利用方法を考えだしていて、我々の当初の期待をはるかに上回る反応を得ている。

エコシステムにおけるマクロがあまりも速く重要なものとなってきているため、Scala 2.10 が実験的機能としてリリースされた数カ月後の Scala 言語チームの会議の中では、Scala 2.12 までにはマクロを標準化して Scala 言語の一人前の機能とすることが決定された。

マクロには多くの種類があるため、それぞれを注意深く調べて、どれを標準に入れるのかを厳選することを決めた。評価するときに必然として出てきた疑問がいくつかある。何故マクロ機能はこれほどまでに成功したのか? マクロが使われる理由は何か?

理解しづらいメタプログラミングという概念が def マクロで表現されることで馴染みやすい型付けされたメソッド呼び出しという概念に乗っかることができるからではないか、というのが我々の仮説だ。これによって、ユーザが書くコードは無闇に肥大化したり、読み易さを犠牲とせずにより多くの意味を吸収できるようになった。

## blackbox と whitebox マクロ

しかし、ときとして def マクロは「ただのメソッド呼び出し」という概念を超越することがある。例えば、展開されたマクロは、元のマクロの戻り値の型よりも特化された型を持つ式を返すことが可能だ。Scala 2.10 では、StackOverflow の [Static return type of Scala macros](http://stackoverflow.com/questions/13669974/static-return-type-of-scala-macros) で解説したように、そのような展開は特化された型を保持し続けることができる。

この興味深い機能がもたらす柔軟性によって、[偽装型プロバイダ](http://meta.plasm.us/posts/2013/07/11/fake-type-providers-part-2/)、[具現化の拡張](/sips/pending/source-locations.html)、[関数従属性の具現化](/ja/overviews/macros/implicits.html#fundep_materialization)、[抽出子マクロ](https://github.com/paulp/scala/commit/84a335916556cb0fe939d1c51f27d80d9cf980dc)などを可能とするけども、書かれたコードの明確さ (人にとってもマシンにとっても) が犠牲になるという側面ある。

普通のメソッド同様に振る舞うマクロと戻り値の型を細別化 (refine) するマクロという決定的な区別を明確にするために、blackbox マクロと whitebox マクロという概念を導入することにした。型シグネチャに忠実に従うマクロは、振る舞いを理解するのに実装を知る必要が無い (ブラックボックスとして扱うことができる) ため、**blackbox マクロ** (blackbox macro) と呼ぶ。Scala の型システムを使ってシグネチャを持つことができないマクロは **whitebox マクロ** (whitebox macro) と呼ぶ。

blackbox マクロと whitebox マクロの両方とも大切なことは認識しているけども、より簡単に説明したり、規格化したり、サポートしやすい blackbox マクロの方に我々としては多くの信頼を置いている。そのため、Scala 2.12 で標準化されてるマクロには blackbox マクロのみが含まれる予定だ。将来の Scala リリースには whitebox マクロも実験的機能扱いでは無い形で入るかもしれないけども、今からは何とも言えない。

## 区別の成文化

まずは 2.11 リリースにおいて、def マクロのシグネチャにおいて blackbox マクロと whitebox マクロを区別して、マクロによって `scalac` が振る舞いを変えれることにすることで標準化への初手とする。これは準備段階の一手で、blackbox も witebox も Scala 2.11 では実験的機能扱いのままだ。

この区別は `scala.reflect.macros.Context` を `scala.reflect.macros.BlackboxContext` と `scala.reflect.macros.WhiteboxContext` によって置き換えることで表現する。もしマクロの実装が第一引数として `BlackboxContext` を受け取る定義ならば、それを使うマクロ def は blackbox となり、 `WhiteboxContext` の方も同様となる。当然のことながら互換性のために素の `Context` も方も存在し続けることになるけども、廃止勧告の警告を出すことで blackbox か whitebox かを選ぶことを推奨していく方向となる。

[マクロバンドル](/ja/overviews/macros/bundles.html) も継承に使われる 2つの異なるトレイト `scala.reflect.macros.BlackboxMacro` と `scala.reflect.macros.WhiteboxMacro` を用意することで区別化をサポートする。説明するまでもないが、前者は `BlackboxContext` を提供してそれを使うユーザを blackbox マクロにして、後者は `WhiteboxContext` することで、それを参照する def マクロを whitebox マクロとする。

blackbox def マクロは Scala 2.10 の def マクロと異なる扱いとなる。Scala の型検査において以下の制限が加わる:

1. blackbox マクロが構文木 `x` に展開するとき、展開される式は型注釈 `(x: T)` でラップされる。この `T` は blackbox マクロの宣言された戻り値の型に、マクロ適用時に一貫性を持つように型引数やパス依存性を適用したものとなる。これによって、blackbox マクロを[型プロバイダ](http://meta.plasm.us/posts/2013/07/11/fake-type-providers-part-2/)のための手段としての利用は無効となる。
1. Scala の型推論アルゴリズムが終わった後でも blackbox マクロの適用に未決定の型パラメータが残る場合、これらの型パラメータは普通のメソッドと同様に強制的に型推論が実行される。これによって blackbox マクロから型推論に影響を与えることが不可能となり、[関数従属性の具現化](/ja/overviews/macros/implicits.html#fundep_materialization)に使うことが無効となる。
1. blackbox マクロの適用が implicit の候補として使われる場合、implicit 検索がそのマクロを選択するまでは展開は実行されない。これによって [implicit マクロの入手可能性を動的に計算する](/sips/pending/source-locations.html)ことが無効となる。
1. blackbox マクロの適用がパターンマッチの抽出子として使われる場合、無条件でコンパイラエラーを発生するようにして、マクロで実装された[パターンマッチングのカスタマイズ](https://github.com/paulp/scala/commit/84a335916556cb0fe939d1c51f27d80d9cf980dc)を無効にした。

whitebox def マクロは Scala 2.10 での def マクロ同様に動作する。一切の制限が無いため、2.10 のマクロで出来ていたことの全てが 2.11 でも行えるはずだ。
