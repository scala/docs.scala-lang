---
layout: tour
title: 変位指定
language: ja

discourse: true

partof: scala-tour

num: 19
next-page: upper-type-bounds
previous-page: generic-classes

redirect_from: "/tutorials/tour/variances.html"
---

変位指定は複合型の間の継承関係とそれらの型パラメータ間の継承関係の相関です。
Scalaは[ジェネリッククラス](generic-classes.html)の型パラメータの変位指定アノテーションをサポートしています。
変位指定アノテーションにより共変、反変にでき、アノテーション無しなら不変になります。
型システム上で変位指定を利用すると複合型間の直感的な繋がりを作ることができます。
その一方で変位指定が無いと、クラスを抽象化して再利用しにくくなります。


```tut
class Foo[+A] // 共変クラス
class Bar[-A] // 反変クラス
class Baz[A]  // 不変クラス
```

### 共変

ジェネリッククラスの型パラメータ`A`はアノテーション`+A`を使うと共変になります。
ある`class List[+A]`がある時`A`を共変にすることは、2つの型`A`と`B`に対して`A`が`B`のサブタイプであることをほのめかします。
その時、`List[A]`は`List[B]`のサブタイプとなります。
これによりジェネリックを利用したとても便利で直感的なサブタイプの関係を作ることができます。

このシンプルなクラス構成を考えてみましょう。

```tut
abstract class Animal {
  def name: String
}
case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```
`Cat`と`Dog`は`Animal`のサブタイプです。
型パラメータ`A`が共変である場合、Scalaの標準ライブラリはジェネリックイミュータブル`sealed abstract class List[+A]`クラスを持ちます。
これは`List[Cat]`は`List[Animal]`であり、`List[Dog]`も`List[Animal]`であることを意味します。
直感的に猫のリストと犬のリストはそれれぞれ動物のリストであり、それらを`List[Animal]`で代替できると理解できます。

以下の例では、メソッド`printAnimalNames`は引数に動物のリストを受け取り、新しい行にそれらの名前をプリントします。
もし`List[A]`が共変でなければ、最後の2つのメソッド呼び出しはコンパイルされず、`printAnimalNames`メソッドの使い勝手はひどく制限されます。

```tut
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

型パラメータ`A`のジェネリッククラスはアノテーション`-A`を利用することで、反変にすることができます。
これはクラスとその型パラメータの間でサブタイプ関係を作ります。
それは似ていますが、共変で得られるものとは反対のものになります。

`class Writer[-A]`がある時、`A`を反変とすると、2つの型`A`と`B`に対し、`A`が`B`のサブタイプの場合、`Writer[B]`は`Writer[A]`のサブタイプであることを匂わせます。

先に定義された`Cat`、`Dog`、`Animal`クラスを以下の例で検討してみます。

```tut
abstract class Printer[-A] {
  def print(value: A): Unit
}
```
`Printer[A]`はある型`A`をどのようにプリントするかを知っている簡単なクラスです。
特定の型でいくつかのサブクラスを定義してみましょう。

```tut
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
そのため`Printer[Animal]`を`Printer[Cat]`代わりに使い、`Printer[A]`を反変にすることができます。

```tut
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

### 不変

Scalaのジェネリッククラスは標準では不変です。
これは共変でも反変でもないことを意味します。
以下の例の状況では、`Container`クラスは不変です。`Container[Cat]`は`Container[Animal]`_ではなく_、逆もまた真ではありません。

```tut
class Container[A](value: A) {
  private var _value: A = value
  def getValue: A = _value
  def setValue(value: A): Unit = {
    _value = value
  }
}
```
`Container[Cat]`が `Container[Animal]`でもあることはは当然かもしれませんが、ミュータブルジェネリッククラスが共変であることを許すことは安全ではありません。
このようなことが起こりえます。

```
val catContainer: Container[Cat] = new Container(Cat("Felix"))
val animalContainer: Container[Animal] = catContainer
animalContainer.setValue(Dog("Spot"))
val cat: Cat = catContainer.getValue // おっと、犬に猫に割り当ててしまった。
```

幸いにも、実行する前にコンパイラが止めてくれます。

### 他の例

変位指定を理解することを助けるもう一つの例はScalaの標準ライブラリの`trait Function1[-T, +R]`です。
`Function1`は1つのパラメータを持つ関数を表します。1つ目の型パラメータ`T`はパラメータの型を表します。
そして2つ目の型パラメータ`R`は戻り値の型を表します。
`Function1`はその引数の型に対して反変であり、戻り値の型に対して共変です。
この例では`Function1[A, B]`を表現するために`A => B`という文字での表記をします。

先ほど利用されたものと同様に`Cat`, `Dog`, `Animal`の継承ツリーは以下のものを考えてください。

```tut
abstract class SmallAnimal extends Animal
case class Mouse(name: String) extends SmallAnimal
```

動物の種類を受け取り、それらが食べる食料の種類を返す関数について考えましょう。

仮に（猫は小動物を食べるので）`Cat => SmallAnimal`が欲しいとします。
しかし`Animal => Mouse`を代わりに与えられたとしても、私たちのプログラムはまだ動きます。
直感的に、`Animal => Mouse` はまだ`Cat`を引数として受け取ります。
なぜなら`Cat`は`Animal`であり、`SmallAnimal`である`Mouse`を返すからです。

安全かつ陰で前者に代えて後者を用いることができるため、`Animal => Mouse`は`Cat => SmallAnimal`のサブタイプと言うことができます。

### 他の言語との比較

変位指定はScalaに似たいくつかの言語によって他の方法でサポートされます。
例えば、Scalaの変位指定アノテーションはC#のそれと非常に似ています。C#ではクラスの抽象性を定義する時にアノテーションが追加されます。(宣言時の変位指定)
しかしながら、Javaでは、クラスの抽象化が使われた時(use-site variance)に変位指定アノテーションはクライアントにより与えられます。
