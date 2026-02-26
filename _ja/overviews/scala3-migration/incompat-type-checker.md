---
title: 型検査
type: section
description: この章では型検査の不具合修正について詳細化します
num: 19
previous-page: incompat-other-changes
next-page: incompat-type-inference
language: ja
---

Scala 2.13 の型検査は一部の特定のケースでは挙動がおかしい。
これにより、予期しない場所で実行時エラーなどが発生する可能性がある。
Scala 3 はより強力な理論的基盤に基づいており、型検査のこれらの不健全なバグは修正された。

## 分散チェックの不具合修正

Scala 2 では、デフォルトのパラメータと内部クラスは分散チェックの対象ではない。
Scala 3 リポジトリでのこの[テスト](https://github.com/lampepfl/dotty/blob/10526a7d0aa8910729b6036ee51942e05b71abf6/tests/neg/variances.scala)で示されているように、健全ではなく、実行時エラーを引き起こす可能性がある。

Scala3 コンパイラは以下のコードを許容していない。

```scala
class Foo[-A](x: List[A]) {
  def f[B](y: List[B] = x): Unit = ???
}

class Outer[+A](x: A) {
  class Inner(y: A)
}
```

{% highlight text %}
-- Error: src/main/scala/variance.scala:2:8 
2 |  def f[B](y: List[B] = x): Unit = y
  |        ^^^^^^^^^^^^^^^^^
  |contravariant type A occurs in covariant position in type [B] => List[A] of method f$default$1
-- Error: src/main/scala/variance.scala:6:14 
6 |  class Inner(y: A)
  |              ^^^^
  |covariant type A occurs in contravariant position in type A of parameter y
{% endhighlight %}

この種類の各問題は特定のケアが必要だ。
ケース・バイ・ケースで選択的に解決方法をトライことができる:
- 型 `A` の内部変数を作る
- 型パラメータ `B` の上位、または下位境界を追加する
- 新しいオーバーロードメソッドを追加する

例では、2つの解決策を選択可能だ:

{% highlight diff %}
class Foo[-A](x: List[A]) {
-  def f[B](y: List[B] = x): Unit = ???
+  def f[B](y: List[B]): Unit = ???
+  def f(): Unit = f(x)
}

class Outer[+A](x: A) {
-  class Inner(y: A)
+  class Inner[B >: A](y: B)
}
{% endhighlight %}

また、一時的な解決策だが、`uncheckedVariance` アノテーションを使用することもできる:

{% highlight diff %}
class Outer[+A](x: A) {
-  class Inner(y: A)
+  class Inner(y: A @uncheckedVariance)
}
{% endhighlight %}

## パターンマッチングの不具合修正

Scala 3 ではいくつかのパターンマッチによるバグを修正した。
これは型検査の意味的に間違ったmatch式を防ぐ

例えば、`combineReq` の match 式は、Scala 2.13 でコンパイルできるが、Scala 3 ではコンパイルできない。

```scala
trait Request
case class Fetch[A](ids: Set[A]) extends Request

object Request {
  def combineFetch[A](x: Fetch[A], y: Fetch[A]): Fetch[A] = Fetch(x.ids ++ y.ids)

  def combineReq(x: Request, y: Request): Request = {
    (x, y) match {
      case (x @ Fetch(_), y @ Fetch(_)) => combineFetch(x, y)
    }
  }
}
```

エラーメッセージは次のようになる:

{% highlight text %}
-- [E007] Type Mismatch Error: src/main/scala/pattern-match.scala:9:59 
9 |      case (x @ Fetch(_), y @ Fetch(_)) => combineFetch(x, y)
  |                                                           ^
  |                                                Found:    (y : Fetch[A$2])
  |                                                Required: Fetch[A$1]
{% endhighlight %}

これは `x` と `y` が同じ型のパラメータ `A` を持っているということにはならない。

Scala 2 から、明らかに間違っているコードを見つけるのに便利な改善だ。
この非互換性を解決するには、コンパイラがチェックできる解決策を見つけるようにすることだ。
ただし、それは必ずしも簡単なわけではなく、時には不可能な場合もあり、その場合、コードは実行時に失敗する可能性がある。

この例では、`A` が両方の型引数の共通の親であると宣言することにより、`x` と `y` の制約を緩和すること示す。
これにより、コンパイラはコードを正常に型検査する。

```scala
def combineFetch[A](x: Fetch[_ <: A], y: Fetch[_ <: A]): Fetch[A] = Fetch(x.ids ++ y.ids)
```

一般的であり安全ではない別の解決策としてはキャストすることだ。
