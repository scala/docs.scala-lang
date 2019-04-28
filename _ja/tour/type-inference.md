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

```tut
val businessName = "Montreux Jazz Café"
```
コンパイラは`businessName`がStringだと検知できます。これはメソッドでも同様に動きます。

```tut
def squareOf(x: Int) = x * x
```
コンパイラは戻り値の型が`Int`だと推論できるので、明示的な戻り値の型は必要ありません。

再帰的メソッドでは、コンパイラは結果の型を推論できません。こちらはこの理由でコンパイラが失敗するプログラムです。

```tut:fail
def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
```

次のような場合は型パラメータを指定することは強制されません。[ポリモーフフィックメソッド](polymorphic-methods.html)が呼ばれる時や[ジェネリッククラス](generic-classes.html) がインスタンス化される時です。Scalaコンパイラは文脈あるいはメソッドやコンストラクタの実際の引数から、指定されていない型パラメータを推論します。

こちらは2つの例です。

```tut
case class MyPair[A, B](x: A, y: B);
val p = MyPair(1, "scala") // type: MyPair[Int, String]

def id[T](x: T) = x
val q = id(1)              // type: Int
```
コンパイラは型`A`と`B`が何であるかを見つけ出すために`MyPair`の引数の型を使用します。`x`の型も同様です。

## パラメータ

コンパイラはメソッドのパラメータを決して推論しません。しかしながら、確かなケースとして、無名関数のパラメータ型を推論できます。それは関数に引数が渡された場合です。

```tut
Seq(1, 3, 4).map(x => x * 2)  // List(2, 6, 8)
```

mapのパラメータは`f: A => B`です。`Seq`に整数値を渡すため、コンパイラは`A`が`Int`だと気づきます(つまり、あの`x`は整数です)。そのためコンパイラは`x * 2`から`B`は型`Int`であると推論できます。

## 型推論に頼ら*ない*時

一般的にパブリックなAPIではメンバーの型宣言を公開するとより読みやすいと考えられます。そのため、コードをユーザーに公開するAPIならば型を明白にすることお勧めします。

また、型推論は特定の型を推論することがあります。次のように書いたとします。

```tut
var obj = null
```

これ以上進められず、再割り当てができません。

```tut:fail
obj = new AnyRef
```

こちらはコンパイルできません。`obj`の型推論は`Null`だからです。その型の唯一の値が`null`だから、他の値を割り当てられません。
