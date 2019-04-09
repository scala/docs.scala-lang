---
layout: tour
title: ジェネリッククラス
language: ja

discourse: true

partof: scala-tour

num: 18
next-page: variances
previous-page: for-comprehensions
assumed-knowledge: classes unified-types

redirect_from: "/tutorials/tour/generic-classes.html"
---
ジェネリッククラスはパラメータとして型を1つ受け取るクラスです。それらはコレクションクラスで特に役立ちます。

## ジェネリッククラスの定義
ジェネリッククラスは角カッコ`[]`の中にパラメータとして型を1つ受け取ります。
型引数の識別子として文字`A`を使う習慣がありますが、パラメータ名は任意のものを使うことができます。
```tut
class Stack[A] {
  private var elements: List[A] = Nil
  def push(x: A) { elements = x :: elements }
  def peek: A = elements.head
  def pop(): A = {
    val currentTop = peek
    elements = elements.tail
    currentTop
  }
}
```
この`Stack`クラスの実装はパラメータとして任意の型`A`を受け取ります。
これはメンバーのリスト`var elements: List[A] = Nil`が型`A`の要素のみを格納できることを意味します。
手続き`def push`は型`A`のオブジェクトのみを受け取ります
(注意: `elements = x :: elements`は`elements`に`x`を現在の`elements`の先頭に追加した新しいリストを割り当て直します。)。

## 使い方

ジェネリッククラスの使うには、`A`代わりに角カッコの中に型を入れます。
```
val stack = new Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop)  // prints 2
println(stack.pop)  // prints 1
```
インスタンス`stack`はIntのみを受け取ることができます。
しかしながら、型がサブタイプを持つ場合、それらは以下のように通すことができます。
The instance `stack` can only take Ints. However, if the type argument had subtypes, those could be passed in:
```
class Fruit
class Apple extends Fruit
class Banana extends Fruit

val stack = new Stack[Fruit]
val apple = new Apple
val banana = new Banana

stack.push(apple)
stack.push(banana)
```
クラス`Apple`と`Banana`は共に`Fruit`を継承しています。そのため`Fruit`のスタックには`apple`と`banana`のインスタンスを追加できます。
_注意: ジェネリック型のサブタイプは不変です。もし`Stack[Char]`型の文字スタックがあったとしても、それを`Stack[Int]`型の整数スタックとしては使うことができません。文字スタックに真の整数は入力できるので、このことは不合理に聞こえるかもしれません。最後に、`B = A`の場合に限り、`Stack[A]`はただの`Stack[B]`のサブタイプとなります。これは非常に制限的である場合があり、ジェネリックタイプのサブタイプの振る舞いをコントロールするために、Scalaは[型引数アノテーションの仕組み](variances.html)を提供します。_
