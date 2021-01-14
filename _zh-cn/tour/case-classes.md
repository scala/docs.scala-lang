---
layout: tour
title: 案例类（Case Classes）
partof: scala-tour

num: 10

language: zh-cn

next-page: pattern-matching
previous-page: multiple-parameter-lists
---

案例类（Case classes）和普通类差不多，只有几点关键差别，接下来的介绍将会涵盖这些差别。案例类非常适合用于不可变的数据。下一节将会介绍他们在[模式匹配](pattern-matching.html)中的应用。
 
## 定义一个案例类
一个最简单的案例类定义由关键字`case class`，类名，参数列表（可为空）组成：
```scala mdoc
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```
注意在实例化案例类`Book`时，并没有使用关键字`new`，这是因为案例类有一个默认的`apply`方法来负责对象的创建。

当你创建包含参数的案例类时，这些参数是公开（public）的`val`
```
case class Message(sender: String, recipient: String, body: String)
val message1 = Message("guillaume@quebec.ca", "jorge@catalonia.es", "Ça va ?")

println(message1.sender)  // prints guillaume@quebec.ca
message1.sender = "travis@washington.us"  // this line does not compile
```
你不能给`message1.sender`重新赋值，因为它是一个`val`（不可变）。在案例类中使用`var`也是可以的，但并不推荐这样。

## 比较
案例类在比较的时候是按值比较而非按引用比较：
```
case class Message(sender: String, recipient: String, body: String)

val message2 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val message3 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val messagesAreTheSame = message2 == message3  // true
```
尽管`message2`和`message3`引用不同的对象，但是他们的值是相等的，所以`message2 == message3`为`true`。

## 拷贝
你可以通过`copy`方法创建一个案例类实例的浅拷贝，同时可以指定构造参数来做一些改变。
```
case class Message(sender: String, recipient: String, body: String)
val message4 = Message("julien@bretagne.fr", "travis@washington.us", "Me zo o komz gant ma amezeg")
val message5 = message4.copy(sender = message4.recipient, recipient = "claire@bourgogne.fr")
message5.sender  // travis@washington.us
message5.recipient // claire@bourgogne.fr
message5.body  // "Me zo o komz gant ma amezeg"
```
上述代码指定`message4`的`recipient`作为`message5`的`sender`，指定`message5`的`recipient`为"claire@bourgogne.fr"，而`message4`的`body`则是直接拷贝作为`message5`的`body`了。

