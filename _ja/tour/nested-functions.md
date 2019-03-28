---
layout: tour
title: ネストしたメソッド
language: ja

discourse: true

partof: scala-tour

num: 9
next-page: multiple-parameter-lists
previous-page: higher-order-functions

redirect_from: "/tutorials/tour/nested-functions.html"
---

Scalaではメソッドの定義をネストすることができます。
以下のオブジェクトは与えられた数値の階乗を演算するための`factorial`メソッドを提供します。

{% scalafiddle %}
```tut
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
