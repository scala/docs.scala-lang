---
layout: tour
title: 名前付き引数
language: ja

discourse: true

partof: scala-tour

num: 34
next-page: packages-and-imports
previous-page: default-parameter-values
prerequisite-knowledge: function-syntax

---

メソッドを呼ぶ時、以下のように引数にパラメータ名でラベル付が可能です。

```scala mdoc
def printName(first: String, last: String): Unit = {
  println(first + " " + last)
}

printName("John", "Smith")  // Prints "John Smith"
printName(first = "John", last = "Smith")  // Prints "John Smith"
printName(last = "Smith", first = "John")  // Prints "John Smith"
```

名前付き引数の順序はどのように並び替えられるかに気をつけましょう。ただし、名前つき引数と名前つきでない引数がある場合は、名前つきでない引数は引数リストの最初に置かれ、かつメソッドシグネチャのパラメーター順でなければなりません。

```scala mdoc:fail
printName(last = "Smith", "john") // error: positional after named argument
```

名前付き引数はJavaメソッドを呼び出す時には使えません。
