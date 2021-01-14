---
layout: tour
title: 命名参数
partof: scala-tour

num: 32

language: zh-cn

next-page: packages-and-imports
previous-page: default-parameter-values
---

当调用方法时，实际参数可以通过其对应的形式参数的名称来标记：

```scala mdoc
def printName(first: String, last: String): Unit = {
  println(first + " " + last)
}

printName("John", "Smith")  // Prints "John Smith"
printName(first = "John", last = "Smith")  // Prints "John Smith"
printName(last = "Smith", first = "John")  // Prints "John Smith"
```
注意使用命名参数时，顺序是可以重新排列的。 但是，如果某些参数被命名了，而其他参数没有，则未命名的参数要按照其方法签名中的参数顺序放在前面。

```scala mdoc:fail
printName(last = "Smith", "john") // error: positional after named argument
```

注意调用 Java 方法时不能使用命名参数。
