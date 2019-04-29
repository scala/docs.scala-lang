---
layout: tour
title: 名前付き引数

discourse: true

partof: scala-tour

num: 34
next-page: packages-and-imports
previous-page: default-parameter-values
prerequisite-knowledge: function-syntax

redirect_from: "/tutorials/tour/named-arguments.html"
---

メソッドを呼ぶ時、以下のように引数にパラメータ名でラベル付が可能です。

```tut
def printName(first: String, last: String): Unit = {
  println(first + " " + last)
}

printName("John", "Smith")  // Prints "John Smith"
printName(first = "John", last = "Smith")  // Prints "John Smith"
printName(last = "Smith", first = "John")  // Prints "John Smith"
```

名前付き引数の順序はどのように並び替えられるかに気をつけましょう。ただし、ある引数は名前をつけられ、他の引数には名前がつけられなかった場合、名前が付いていない引数は最初かつメソッドの署名の中にあるパラメーター並び順でなければなりません。

```tut:fail
printName(last = "Smith", "john") // error: positional after named argument
```

名前付き引数はJavaメソッドを呼び出す時は動きません。
