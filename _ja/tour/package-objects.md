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

パッケージオブジェクトは、変数やメソッド定義だけでなく、任意の定義を含むことができます。
例えば、それらはパッケージ全体で使われる型エイリアスと暗黙の変換を保有するためによく使われます。
パッケージオブジェクトはScalaクラスやトレイトを継承することもできます。

慣習として、パッケージオブジェクトのソースコードは通常`package.scala`という名のソースファイルに設置されます。

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

利用側がどのようになるかの例としては、以下のオブジェクト`PrintPlanted`は、ワイルドカードインポートでクラス`Fruit`と全く同様に`planted`と`showFruit`をインポートしています。

```
// ファイル PrintPlanted.scala の中
import gardening.fruits._
object PrintPlanted {
  def main(args: Array[String]): Unit = {
    for (fruit <- planted) {
      showFruit(fruit)
    }
  }
}
```

パッケージオブジェクトは他のオブジェクトのように、継承を利用して構成できます。例えば、一つのパッケージオブジェクトが２つのトレイトをミックスインしている例を示します。

```
package object fruits extends FruitAliases with FruitHelpers {
  // ヘルパーと変数がここに続きます。
}
```
