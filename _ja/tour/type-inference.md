---
layout: tour
title: 型推論
language: ja

discourse: true

partof: scala-tour

num: 29
next-page: operators
previous-page: polymorphic-methods
---

Scalaコンパイラが式の型を推論できることが多いので、明示的に型を宣言する必要はありません。

## 型の省略

```scala mdoc
val businessName = "Montreux Jazz Café"
```
コンパイラは`businessName`がStringだと検知できます。これはメソッドでも同様に動きます。

```scala mdoc
def squareOf(x: Int) = x * x
```
コンパイラは戻り値の型が`Int`だと推論できるので、明示的な戻り値の型は必要ありません。

再帰的メソッドでは、コンパイラは結果の型を推論できません。こちらはこの理由でコンパイラが失敗するプログラムです。

```scala mdoc:fail
def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
```

[ポリモーフフィックメソッド](polymorphic-methods.html)が呼ばれる時や[ジェネリッククラス](generic-classes.html) がインスタンス化される場合も型パラメータの指定は強制ではありません。Scalaコンパイラは文脈あるいはメソッドやコンストラクタの実際の引数から、指定されていない型パラメータを推論します。

こちらは2つの例です。

```scala mdoc
case class MyPair[A, B](x: A, y: B)
val p = MyPair(1, "scala") // 型: MyPair[Int, String]

def id[T](x: T) = x
val q = id(1)              // 型: Int
```
コンパイラは型`A`と`B`が何であるかを見つけ出すために`MyPair`の引数の型を使用します。`x`の型も同様です。

## パラメータ

コンパイラはメソッドのパラメータ型を決して推論しません。しかし、関数が引数として渡されている場合は、無名関数のパラメータ型を推論できます。

```scala mdoc
Seq(1, 3, 4).map(x => x * 2)  // List(2, 6, 8)
```

mapのパラメータは`f: A => B`です。`Seq`の中に整数が入っているので、コンパイラは`A`が`Int`だと知っています(つまり、この`x`は整数です)。したがってコンパイラは`x * 2`から`B`が型`Int`であると推論できます。

## 型推論に頼ら*ない*時

一般的には、パブリックなAPIで公開されているメンバーの型を宣言したほうが読みやすいと考えられています。そのため、ユーザーに公開するAPIではあなたのコードの型を明示することをお勧めします。

また、型推論は特定の型を推論することがあります。次のように書いたとします。

```scala
var obj = null
```

これ以上進められず、再割り当てができません。

```scala mdoc:fail
obj = new AnyRef
```

こちらはコンパイルできません。`obj`に推論された型は`Null`だからです。その型の唯一の値が`null`なので、他の値を代入できれません。
