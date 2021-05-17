---
layout: tour
title: 运算符
partof: scala-tour

num: 28

language: zh-cn

next-page: by-name-parameters
previous-page: type-inference
---
在Scala中，运算符即是方法。 任何具有单个参数的方法都可以用作 _中缀运算符_。 例如，可以使用点号调用 `+`：
```
10.+(1)
```

而中缀运算符则更易读:
```
10 + 1
```

## 定义和使用运算符
你可以使用任何合法标识符作为运算符。 包括像 `add` 这样的名字或像 `+` 这样的符号。
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
类 Vec 有一个方法 `+`，我们用它来使 `vector1` 和 `vector2` 相加。 使用圆括号，你可以使用易读的语法来构建复杂表达式。 这是 `MyBool` 类的定义，其中有方法 `and` 和 `or`：

```scala mdoc
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```

现在可以使用 `and` 和 `or` 作为中缀运算符：

```scala mdoc
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```

这有助于让方法 `xor` 的定义更具可读性。

## 优先级
当一个表达式使用多个运算符时，将根据运算符的第一个字符来评估优先级：
```
(characters not shown below)
* / %
+ -
:
= !
< >
&
^
|
(all letters)
```
这也适用于你自定义的方法。 例如，以下表达式：
```
a + b ^? c ?^ d less a ==> b | c
```
等价于
```
((a + b) ^? (c ?^ d)) less ((a ==> b) | c)
```
`?^` 具有最高优先级，因为它以字符 `?` 开头。 `+` 具有第二高的优先级，然后依次是 `==>`， `^?`， `|`， 和 `less`。
