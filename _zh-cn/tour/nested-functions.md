---
layout: tour
title: 嵌套方法
partof: scala-tour

num: 8

language: zh-cn

next-page: multiple-parameter-lists
previous-page: higher-order-functions
---

在Scala中可以嵌套定义方法。例如以下对象提供了一个`factorial`方法来计算给定数值的阶乘：

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

程序的输出为:

```
Factorial of 2: 2
Factorial of 3: 6
```
