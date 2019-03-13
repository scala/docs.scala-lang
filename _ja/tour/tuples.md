---
layout: tour
title: タプル
language: ja

discourse: true

partof: scala-tour

num: 6
next-page: mixin-class-composition
previous-page: traits
topics: tuples

redirect_from: "/tutorials/tour/tuples.html"
---

Scalaではタプルは異なる型の要素を複数持つことができるクラスです。
タプルは不変です。

タプルは関数から複数の値を返す際に役立ちます。

タプルは以下のように作ることができます

```tut
val ingredient = ("Sugar" , 25):Tuple2[String, Int]
```
ここではString要素を1つとInt要素を1つ含むタプルを作っています。

Scalaではタプルは Tuple2, Tuple3, … Tuple22 までの一連のクラス群です。
そのためn個の要素（nは2から22）でタプルを作成する時、

Scalaは基本的に構成要素の型でパラメーター化されたグループに対応するクラスを1つインスタンス化します。
例えば、 値 ingredient は Tuple2 [String, Int]型です。

## 要素へのアクセス

タプル要素にはアンダースコア記法を用いてアクセスします。
（要素がたくさんあることを考えると）'tuple._n' はn番目の要素を与えます。

```tut
println(ingredient._1) // Sugar

println(ingredient._2) // 25
```

## タプルのデータの分割代入

Scalaのタプルは分割代入にも対応しています。

```tut
val (name, quantity) = ingredient

println(name) // Sugar

println(quantity) // 25
```

タプルの分割代入はパターンマッチングでも使われます。

```tut
val planetDistanceFromSun = List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6 ), ("Mars", 227.9), ("Jupiter", 778.3))

planetDistanceFromSun.foreach{ tuple => {
  
  tuple match {
    
      case ("Mercury", distance) => println(s"Mercury is $distance millions km far from Sun")
      
      case p if(p._1 == "Venus") => println(s"Venus is ${p._2} millions km far from Sun")
      
      case p if(p._1 == "Earth") => println(s"Blue planet is ${p._2} millions km far from Sun")
      
      case _ => println("Too far....")
      
    }
    
  }
  
}
```

また、for内包表記においては、

```tut
val numPairs = List((2, 5), (3, -7), (20, 56))

for ((a, b) <- numPairs) {

  println(a * b)
  
}
```

Unit型の値 () は概念的には Tuple0 型の () の値と同じです。
要素が無いため、この型の値は1つだけになりえます。

ユーザーは時々タプルとケースクラスを選ぶのが難しいと感じる時があるかもしれません。
原則として、要素に意味をもたせる場合にはケースクラスが好まれます。
