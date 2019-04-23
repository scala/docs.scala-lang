---
layout: tour
title: ポリモーフフィックメソッド

discourse: true

partof: scala-tour

num: 28

next-page: type-inference
previous-page: implicit-conversions
prerequisite-knowledge: unified-types

redirect_from: "/tutorials/tour/polymorphic-methods.html"
---

Scalaのメソッドは値と同様に型によってパラメータ化することができます。構文はジェネリッククラスの構文と似ています。
値パラメータは丸括弧で囲まれるのに対して、型パラメータは角カッコで囲まれます。

こちらが例です。

```tut
def listOfDuplicates[A](x: A, length: Int): List[A] = {
  if (length < 1)
    Nil
  else
    x :: listOfDuplicates(x, length - 1)
}
println(listOfDuplicates[Int](3, 4))  // List(3, 3, 3, 3)
println(listOfDuplicates("La", 8))  // List(La, La, La, La, La, La, La, La)
```

メソッド`listOfDuplicates`は型パラメータ`A`と値パラメータ`x`と`length`を受け取ります。値`x`の型は`A`です。もし`length < 1`なら空のリストを返します。それ以外の場合は`x`を再帰呼び出しで返された複写リストの先頭に追加します。(`::`の意味は、左辺の要素を右辺のリストの先頭に追加することです。)

最初の呼び出し例では、`[Int]`と書いて明示的に型引数を渡しています。そのため最初の引数は`Int`でなければならず、戻される型は`List[Int]`となります。

2つ目の呼び出し例では必ずしも明示的に型パラメータを渡す必要がないことが判ります。コンパイラはしばしばコンテキストか値引数の型に基づき、型パラメータを推論できます。この例では`"La"`は`String`であり、コンパイラは`A`が`String`でなければならないと気づきます。
