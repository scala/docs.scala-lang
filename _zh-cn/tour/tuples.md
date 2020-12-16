---
layout: tour
title: 元组
partof: scala-tour

num: 

language: zh-cn

next-page: mixin-class-composition
previous-page: traits
topics: tuples
---

在 Scala 中，元组是一个可以容纳不同类型元素的类。
元组是不可变的。

当我们需要从函数返回多个值时，元组会派上用场。

元组可以创建如下：

```scala mdoc
val ingredient = ("Sugar" , 25):Tuple2[String, Int]
```
这将创建一个包含一个 String 元素和一个 Int 元素的元组。

Scala 中的元组包含一系列类：Tuple2，Tuple3等，直到 Tuple22。
因此，当我们创建一个包含 n 个元素（n 位于 2 和 22 之间）的元组时，Scala 基本上就是从上述的一组类中实例化
一个相对应的类，使用组成元素的类型进行参数化。
上例中，`ingredient` 的类型为 `Tuple2[String, Int]`。

## 访问元素

使用下划线语法来访问元组中的元素。
'tuple._n' 取出了第 n 个元素（假设有足够多元素）。

```scala mdoc
println(ingredient._1) // Sugar

println(ingredient._2) // 25
```

## 解构元组数据

Scala 元组也支持解构。

```scala mdoc
val (name, quantity) = ingredient

println(name) // Sugar

println(quantity) // 25
```

元组解构也可用于模式匹配。

```scala mdoc
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

或者，在 'for' 表达式中。

```scala mdoc
val numPairs = List((2, 5), (3, -7), (20, 56))

for ((a, b) <- numPairs) {

  println(a * b)
  
}
```

类型 `Unit` 的值 `()` 在概念上与类型 `Tuple0` 的值 `()` 相同。 `Tuple0` 只能有一个值，因为它没有元素。

用户有时可能在元组和 case 类之间难以选择。 通常，如果元素具有更多含义，则首选 case 类。
