---
layout: tour
title: 上限型境界
language: ja

discourse: true

partof: scala-tour
categories: tour
num: 20
next-page: lower-type-bounds
previous-page: variances

redirect_from: "/tutorials/tour/upper-type-bounds.html"
---

Scalaでは [型パラメータ](generic-classes.html)と[抽象型メンバー](abstract-type-members.html) は型境界により制約されることがあります。
型境界は具体的な値を制限し、そのような型のメンバーに関するより多くの情報を明らかにするかもしれません。
_上限型境界_ は型変数`T`が型`A`のサブタイプを参照することを宣言します。

こちらはクラス`PetContainer`の型パラメータの上限型境界を実演する例です。

```tut
abstract class Animal {
 def name: String
}

abstract class Pet extends Animal {}

class Cat extends Pet {
  override def name: String = "Cat"
}

class Dog extends Pet {
  override def name: String = "Dog"
}

class Lion extends Animal {
  override def name: String = "Lion"
}

class PetContainer[P <: Pet](p: P) {
  def pet: P = p
}

val dogContainer = new PetContainer[Dog](new Dog)
val catContainer = new PetContainer[Cat](new Cat)
```

```tut:fail
// これはコンパイルされません
val lionContainer = new PetContainer[Lion](new Lion)
```
`class PetContainer`は型パラメータ`P`を受け取ります。それは`Pet`のサブタイプである必要があります。
 `Dog`と`Cat`は`Pet`のサブタイプです。そのため新たな`PetContainer[Dog]`と`PetContainer[Cat]`を作ることができます。
 しかしながら、もし`PetContainer[Lion]`を作ろうとすると、以下のエラーが返ってきます。

`type arguments [Lion] do not conform to class PetContainer's type parameter bounds [P <: Pet]`

これは`Lion`は`Pet`のサブタイプではないからです。
