---
layout: tour
title: パッケージオブジェクト
language: ja

discourse: true

partof: scala-tour

num: 36
previous-page: packages-and-imports
---

# パッケージオブジェクト

Scalaはパッケージ全体を通して共有される便利なコンテナとしてパッケージオブジェクトを提供します。

パッケージオブジェクトは任意の定義を含むことができます。それは変数だけではなくメソッド定義も含みます。
例えば、それらはパッケージ全体の型エイリアスと暗黙の変換を保有するために頻繁に使われます。
パッケージオブジェクトはScalaクラスとトレイトさえ受け継げます。

習慣として、パッケージオブジェクトのソースコードは通常`package.scala`という名のソースファイルに設置されます。

1つのパッケージはパッケージオブジェクトを1つ持てます。パッケージオブジェクト内の全ての定義はパッケージ自体のメンバーと見なされます。

以下の例を見てみましょう。まず1つのクラス`Fruit`と3つの`Fruit`オブジェクトがパッケージ`gardening.fruits`にあるとします。

```
// ファイル gardening/fruits/Fruit.scala の中
package gardening.fruits

case class Fruit(name: String, color: String)
object Apple extends Fruit("Apple", "green")
object Plum extends Fruit("Plum", "blue")
object Banana extends Fruit("Banana", "yellow")
```

ここで、変数`planted`とメソッド`showFruit`を直接パッケージ`gardening.fruits`内に置きたいとします。
こちらがその方法になります。

```
// ファイル gardening/fruits/package.scala の中
package gardening
package object fruits {
  val planted = List(Apple, Plum, Banana)
  def showFruit(fruit: Fruit): Unit = {
    println(s"${fruit.name}s are ${fruit.color}")
  }
}
```

利用方法で見た例の通り、以下のオブジェクト`PrintPlanted`は`planted`と`showFruit`をインポートします。
それはをクラス`Fruit`をインポートするのと全く同じ方法で、パッケージgardening.fruitsでワイルドカードインポートしています。

```
// ファイル PrintPlanted.scala の中
import gardening.fruits._
object PrintPlanted {
  def main(args: Array[String]): Unit = {
    for (fruit <- fruits.planted) {
      showFruit(fruit)
    }
  }
}
```

パッケージオブジェクトは他のオブジェクトと似ています。それはビルドのために継承を利用できるという意味です。例えば、一対のトレイトの中でパッケージオブジェクトをミックスします。

```
package object fruits extends FruitAliases with FruitHelpers {
  // ヘルパーと変数がここに続きます。
}
```
メソッドオーバーライドはパッケージオブジェクト内では動作しないので気をつけましょう。
