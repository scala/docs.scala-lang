---
layout: tour
title: ネストしたメソッド
language: ja

discourse: true

partof: scala-tour

num: 9
next-page: multiple-parameter-lists
previous-page: higher-order-functions

---

Scalaではメソッドの定義をネストする（_訳注：入れ子にする_）ことができます。
以下のコードは与えられた数値の階乗を計算するための`factorial`メソッドを提供します。

{% scalafiddle %}
```scala mdoc
 def factorial(x: Int): Int = {
    def fact(x: Int, accumulator: Int): Int = {
      if (x <= 1) accumulator
      else fact(x - 1, x * accumulator)
    }  
    fact(x, 1)
 }

 println("Factorial of 2: " + factorial(2))
 println("Factorial of 3: " + factorial(3))
```
{% endscalafiddle %}

このプログラムの出力は以下の通りです。

```
Factorial of 2: 2
Factorial of 3: 6
```
