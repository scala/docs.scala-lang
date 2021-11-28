---
title: 型チェッカー
type: section
description: この章では型チェッカーの不具合修正について詳細化します
num: 19
previous-page: incompat-other-changes
next-page: incompat-type-inference
language: ja
---

Scala 2.13の型チェッカーは一部の特定のケースでは挙動がおかしいです。
これにより、予期しない場所で予期しない実行時エラーなどが発生する可能性があります。
Scala 3はより強力な理論的基盤に基づいており、型チェッカーのこれらの不健全なバグは修正されました。

## 分散チェックの不具合修正

Scala 2では、デフォルトのパラメータと内部クラスは分散チェックの対象ではありません。
Scala 3リポジトリでのこの[テスト](https://github.com/lampepfl/dotty/blob/10526a7d0aa8910729b6036ee51942e05b71abf6/tests/neg/variances.scala)で示されているように、健全ではなく、実行時エラーを引き起こす可能性があります。

Scala3コンパイラは以下のコードを許容していません。

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

この種類のそれぞれの問題は特定のケアが必要です。
あなたはケース・バイ・ケースで選択的に解決方法をトライことができます。:
- 型`A`の内部変数を作る
- 型パラメータ`B`の上位、または下位境界を追加する
- 新しいオーバーロードメソッドを追加する

例では、2つの解決策を選択できます。:

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

また、一時的な解決策ですが、`uncheckedVariance` アノテーションを使用することもできます。:

{% highlight diff %}
class Outer[+A](x: A) {
-  class Inner(y: A)
+  class Inner(y: A @uncheckedVariance)
}
{% endhighlight %}

## パターンマッチングの不具合修正

Scala3ではいくつかのパターンマッチによるバグを修正しました、
これはタイプチェックの意味的に間違ったmatch式を防ぎます

たとえば、`combineReq`のmatch式は、Scala 2.13でコンパイルできますが、Scala3ではコンパイルできません。

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

エラーメッセージは次のようになります:

{% highlight text %}
-- [E007] Type Mismatch Error: src/main/scala/pattern-match.scala:9:59 
9 |      case (x @ Fetch(_), y @ Fetch(_)) => combineFetch(x, y)
  |                                                           ^
  |                                                Found:    (y : Fetch[A$2])
  |                                                Required: Fetch[A$1]
{% endhighlight %}

これは`x`と`y`が同じタイプのパラメータ`A`を持っているという証拠にはなりません。

Scala 2から、明らかに間違っているコードを見つけるのに便利な改善です。
この非互換性を解決するには、コンパイラがチェックできる解決策を見つけるようにすることです。
ただし、必ずしも簡単なわけではなく、時には不可能な場合もあり、その場合、コードは実行時に失敗する可能性があります。

この例では、`A`が両方の型引数の共通の親であると宣言することにより、`x`と`y`の制約を緩和すること示します。
これにより、コンパイラはコードを正常に型チェックします。

```scala
def combineFetch[A](x: Fetch[_ <: A], y: Fetch[_ <: A]): Fetch[A] = Fetch(x.ids ++ y.ids)
```

一般的であり安全ではない別の解決策としてはキャストすることです。
