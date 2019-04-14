---
layout: tour
title: 下限型境界
language: ja

discourse: true

partof: scala-tour

num: 21
next-page: inner-classes
previous-page: upper-type-bounds
prerequisite-knowledge: upper-type-bounds, generics, variance

redirect_from: "/tutorials/tour/lower-type-bounds.html"
---

 [上限型境界](upper-type-bounds.html) が型を別の型のサブタイプに制限する一方で、*下限型境界*は型が別の型のスーパータイプになるよう宣言します。表現`B >: A`はパラメータ`B`または抽象型`B`が型`A`のスーパータイプを指すことを表します。ほとんどのケースで`A`はそのクラスの型パラメータであり、`B`はメソッドの型パラメータになります。

以下はこれが役立つ場合の例です。 

```tut:fail
trait Node[+B] {
  def prepend(elem: B): Node[B]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
}
```

このプログラムは片方向リストを実装します。`Nil`は空の要素（すなわち空のリスト）を意味します。
`class ListNode`は型`B` (`head`)の要素と、リストの残りの部分(`tail`)への参照を持つノードです。
`class Node`とそのサブタイプは、`+B`とあるので、共変です。

しかしながら、このプログラムはコンパイル _されません_。`prepend`のパラメータ`elem`が、宣言時に*共* 変と宣言した型`B`になっているからです。
これは動きません、なぜなら関数はそれらの型パラメータの中では*反*変であり、それらの結果型の中では*共*変だからです。

これを解決するためには、`prepend`の中でパラメータ`elem`の型の変位指定を弾く必要があります。
これを実現するには、下限型境界として`B`を持つ新しい型パラメータ`U`を導入します。

```tut
trait Node[+B] {
  def prepend[U >: B](elem: U): Node[U]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
}
```

今、以下のようなことができます。
```tut
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird


val africanSwallowList= ListNode[AfricanSwallow](AfricanSwallow(), Nil())
val birdList: Node[Bird] = africanSwallowList
birdList.prepend(new EuropeanSwallow)
```
`Node[Bird]`は`africanSwallowList`アサインできますが、その際`EuropeanSwallow`を受け取ります。

