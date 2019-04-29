---
layout: tour
title: デフォルト引数
language: ja

discourse: true

partof: scala-tour

num: 33
next-page: named-arguments
previous-page: annotations
prerequisite-knowledge: named-arguments, function syntax

redirect_from: "/tutorials/tour/default-parameter-values.html"
---

Scalaはパラメータのデフォルト値を与えることができ、呼び出す側はこれらのパラメータを省略できます。

```tut
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // prints INFO: System starting
log("User not found", "WARNING")  // prints WARNING: User not found
```

パラメータ`level`はデフォルト値を持つので、省略可能です。最終行では、引数`"WARNING"`はデフォルト値`"INFO"`を上書きします。Javaで同じ効果を得るのに、省略可能なパラメータをもつメソッドを複数使ってメソッドのオーバーロードをしたようなものです。しかしながら呼び出す側が引数をひとつ省略すると、以降全ての引数は名前つきにする必要があります。

```tut
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```
ここでは、`y = 1`と書かなければなりません。

Javaのコードから呼び出された時、Sclaにおけるデフォルトパラメータはオプショナルではありません。

```tut
// Point.scala
class Point(val x: Double = 0, val y: Double = 0)
```

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        Point point = new Point(1);  // コンパイルされません
    }
}
```
