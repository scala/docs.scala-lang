---
layout: tour
title: 複合型
language: ja

discourse: true

partof: scala-tour

num: 24
next-page: self-types
previous-page: abstract-type-members

---
ときどき、あるオブジェクトの型が、複数の他の型のサブタイプであると表現する必要が生じます。
Scalaでは、これは*複合型*を用いて表現できます。複合型とはオブジェクトの型同士を重ねることです。

2つのトレイト`Cloneable`と`Resetable`があるとしましょう。

```scala mdoc
trait Cloneable extends java.lang.Cloneable {
  override def clone(): Cloneable = {
    super.clone().asInstanceOf[Cloneable]
  }
}
trait Resetable {
  def reset: Unit
}
```

今、関数`cloneAndReset`を書きたいとします。それはオブジェクトを受け取り、それをクローンして、元のオブジェクトをリセットします。

```
def cloneAndReset(obj: ?): Cloneable = {
  val cloned = obj.clone()
  obj.reset
  cloned
}
```

パラメータ`obj`の型は何かという疑問が生じます。もし`Cloneable`であれば、オブジェクトを`clone`することができますが、`reset`することはできません。もし`Resetable`であれば、`reset`することができますが、`clone`の操作はできません。そのような状態で型キャストを回避するために`obj`の型を`Cloneable`と`Resetable`の両方であると指定することができます。Scalaではこの複合型は`Cloneable with Resetable`のように書くことができます。

こちらが書き変えた関数です。

```
def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
  //...
}
```
複合型は複数のオブジェクトの型からなり、一つだけの細別型(refinement)を持てます。細別型は既存オブジェクトのメンバーのシグネチャを絞り込むのに使えます。
一般的な形は`A with B with C ... { refinement }`です。

細別の使い方の例は[ミックスインを用いたクラス合成](mixin-class-composition.html)のページにあります。
