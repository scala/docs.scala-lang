---
layout: tour
title: 変位指定
language: ja

discourse: true

partof: scala-tour

num: 19
next-page: upper-type-bounds
previous-page: generic-classes

---

変位指定は複合型の間の継承関係とそれらの型パラメータ間の継承関係の相関です。
Scalaは[ジェネリッククラス](generic-classes.html)の型パラメータの変位指定アノテーションをサポートしています。
変位指定アノテーションにより共変、反変にでき、アノテーション無しなら非変になります。
型システム上で変位指定を利用すると複合型間の直感的な繋がりを作ることができます。
もし変位指定が無ければ、クラスを抽象化して再利用しにくくなるでしょう。


```scala mdoc
class Foo[+A] // 共変クラス
class Bar[-A] // 反変クラス
class Baz[A]  // 非変クラス
```

### 共変

ジェネリッククラスの型パラメータ`A`はアノテーション`+A`を使うと共変になります。
`class List[+A]`では、`A`が共変になっているので、`A`が`B`のサブタイプであるような`A`と`B`に対して`List[A]`が`List[B]`のサブタイプであることを示します。
これによりジェネリックを利用したとても便利で直感的なサブタイプの関係を作ることができます。

このシンプルなクラス構成を考えてみましょう。

```scala mdoc
abstract class Animal {
  def name: String
}
case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```
`Cat`と`Dog`は`Animal`のサブタイプです。
Scala標準ライブラリにはイミュータブルなジェネリッククラス`sealed abstract class List[+A]`があり、型パラメータ`A`が共変です。
これは`List[Cat]`は`List[Animal]`であり、`List[Dog]`も`List[Animal]`であることを意味します。
猫のリストも犬のリストも動物のリストであり、どちらも`List[Animal]`の代わりにできる、というのは直感的に理解できます。

以下の例では、メソッド`printAnimalNames`は引数に動物のリストを受け取り、新しい行にそれらの名前をプリントします。
もし`List[A]`が共変でなければ、最後の2つのメソッド呼び出しはコンパイルされず、`printAnimalNames`メソッドの使い勝手はひどく制限されます。

```scala mdoc
object CovarianceTest extends App {
  def printAnimalNames(animals: List[Animal]): Unit = {
    animals.foreach { animal =>
      println(animal.name)
    }
  }

  val cats: List[Cat] = List(Cat("Whiskers"), Cat("Tom"))
  val dogs: List[Dog] = List(Dog("Fido"), Dog("Rex"))

  printAnimalNames(cats)
  // Whiskers
  // Tom

  printAnimalNames(dogs)
  // Fido
  // Rex
}
```

### 反変

ジェネリッククラスの型パラメータ`A`はアノテーション`-A`を利用して反変にできます。
これはクラスとその型パラメータの間で、共変と似ていますが反対の意味のサブタイプ関係を作ります。

`class Writer[-A]`では`A`が反変になっているので、`A`が`B`のサブタイプであるような`A`と`B`に対し、`Writer[B]`が`Writer[A]`のサブタイプであることを示します。

先に定義された`Cat`、`Dog`、`Animal`クラスを以下の例で検討してみます。

```scala mdoc
abstract class Printer[-A] {
  def print(value: A): Unit
}
```
`Printer[A]`はある型`A`をどのようにプリントするかを知っている簡単なクラスです。
特定の型でいくつかのサブクラスを定義してみましょう。

```scala mdoc
class AnimalPrinter extends Printer[Animal] {
  def print(animal: Animal): Unit =
    println("The animal's name is: " + animal.name)
}

class CatPrinter extends Printer[Cat] {
  def print(cat: Cat): Unit =
    println("The cat's name is: " + cat.name)
}
```
`Printer[Cat]`はコンソールに任意の`Cat`をプリントする方法を知っています。
そして`Printer[Animal]`はコンソールに任意の`Animal`をプリントする方法を知っています。
それは`Printer[Animal]`も任意の`Cat`をプリントする方法を知っていることを意味します。
逆の関係性は適用されません、それは`Printer[Cat]`がコンソールに任意の`Animal`をプリントする方法を知らないからです。
したがって、私達は必要であれば`Printer[Animal]`を`Printer[Cat]`代わりに使うことができます。これは`Printer[A]`が反変であるからこそ可能なのです。

```scala mdoc
object ContravarianceTest extends App {
  val myCat: Cat = Cat("Boots")

  def printMyCat(printer: Printer[Cat]): Unit = {
    printer.print(myCat)
  }

  val catPrinter: Printer[Cat] = new CatPrinter
  val animalPrinter: Printer[Animal] = new AnimalPrinter

  printMyCat(catPrinter)
  printMyCat(animalPrinter)
}
```

この出力結果は以下のようになります。

```
The cat's name is: Boots
The animal's name is: Boots
```

### 非変

Scalaのジェネリッククラスは標準では非変です。
これは共変でも反変でもないことを意味します。
以下の例の状況では、`Container`クラスは非変です。`Container[Cat]`は`Container[Animal]`_ではなく_、逆もまた同様です。

```scala mdoc
class Container[A](value: A) {
  private var _value: A = value
  def getValue: A = _value
  def setValue(value: A): Unit = {
    _value = value
  }
}
```
`Container[Cat]`が `Container[Animal]`でもあることは自然なように思えるかもしれませんが、ミュータブルジェネリッククラスを共変にするのは安全ではありません。
この例では、`Container`が非変であることは非常に重要です。`Container`が仮に共変だったとするとこのようなことが起こり得ます。

```
val catContainer: Container[Cat] = new Container(Cat("Felix"))
val animalContainer: Container[Animal] = catContainer
animalContainer.setValue(Dog("Spot"))
val cat: Cat = catContainer.getValue // おっと、犬を猫に割り当ててしまった。
```

幸いにも、実行する前にコンパイラが止めてくれます。

### 他の例

変位指定の理解を助けるもう一つの例はScala標準ライブラリの`trait Function1[-T, +R]`です。
`Function1`は1つのパラメータを持つ関数を表します。1つ目の型パラメータ`T`はパラメータの型を表します。
そして2つ目の型パラメータ`R`は戻り値の型を表します。
`Function1`はその引数の型に対して反変であり、戻り値の型に対して共変です。
この例では`Function1[A, B]`を表現するために`A => B`という文字での表記をします。

先ほど利用された`Cat`, `Dog`, `Animal`の継承ツリーに、以下のものを加えましょう：

```scala mdoc
abstract class SmallAnimal extends Animal
case class Mouse(name: String) extends SmallAnimal
```

動物の種類を受け取り、それらが食べる食料の種類を返す関数がいくつかあるとしましょう。
もし（猫は小動物を食べるので）`Cat => SmallAnimal`が欲しい場合に代わりに`Animal => Mouse`を与えられたとしても、私たちのプログラムはまだ動きます。
直感的に、`Cat`は`Animal`なので、`Animal => Mouse` は`Cat`を引数として受け取ります。
そして`SmallAnimal`である`Mouse`を返します。

安全に、そのままで前者に代えて後者を用いることができるため、`Animal => Mouse`は`Cat => SmallAnimal`のサブタイプと言うことができます。

### 他の言語との比較

Scalaに似たいくつかの言語で、変位指定はいろんな方法でサポートされています。
例えば、Scalaの変位指定アノテーションはC#のそれと非常に似ています。C#ではクラスの抽象性を定義する時にアノテーションが追加されます(宣言時の変位指定)。
しかしながら、Javaでは、クラスの抽象性を使う時に変位指定アノテーションが利用側のコードから与えられます(使用時の変位指定)。
