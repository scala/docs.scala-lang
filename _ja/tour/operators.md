---
layout: tour
title: 演算子
language: ja

discourse: true

partof: scala-tour

num: 30
next-page: by-name-parameters
previous-page: type-inference
prerequisite-knowledge: case-classes

---
Scalaでは演算子はメソッドです。パラメータを1つだけ持つメソッドであれば*中置演算子*として使えます。例えば、`+`はドット記法で呼び出せます。

```
10.+(1)
```

しかしながら、中置演算子の方が読みやすいです。

```
10 + 1
```

## 演算子の定義方法と使い方

有効な識別子であれば演算子として使用できます。これは `add`のような名前も`+`のような記号も含みます。
```scala mdoc
case class Vec(x: Double, y: Double) {
  def +(that: Vec) = Vec(this.x + that.x, this.y + that.y)
}

val vector1 = Vec(1.0, 1.0)
val vector2 = Vec(2.0, 2.0)

val vector3 = vector1 + vector2
vector3.x  // 3.0
vector3.y  // 3.0
```
クラスVecはメソッド`+`を持ち、 `vector1`と`vector2`を足しわせるのに使います。丸括弧を用いて、複雑な式を読みやすい構文で作ることができます。
こちらはクラス`MyBool`の定義です。クラス`MyBool`はメソッド`and`と`or`を含みます。

```scala mdoc
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```

この時、`and`と`or`を中置演算子として使えます。

```scala mdoc
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```

これにより`xor`の定義がより読みやすくなります。

## 優先順位

式が複数の演算子を使う時、それらの演算子は最初の文字の（以下に挙げる）優先度に基づき評価されます。
```
(以下に表示されていない記号)
* / %
+ -
:
= !
< >
&
^
|
(全ての文字)
```
これはあなたが定義した関数にも適用できます。
たとえば、以下の式
```
a + b ^? c ?^ d less a ==> b | c
```
は以下と同じ意味です。
```
((a + b) ^? (c ?^ d)) less ((a ==> b) | c)
```
`?^`は最も高い優先順位を持ちます。`?^`は`?`から始まるからです。`+`は二番目に高い優先順位を持ち、その後に`==>`、 `^?`、 `|`、 そして`less`が続きます。
