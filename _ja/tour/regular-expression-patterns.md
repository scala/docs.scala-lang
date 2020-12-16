---
layout: tour
title: 正規表現パターン
language: ja

discourse: true

partof: scala-tour

num: 15

next-page: extractor-objects
previous-page: singleton-objects

---
正規表現はデータの中からパターン（またはその欠如）を探すために使うことができる文字列です。
どんな文字列も`.r`メソッドを使うことで、正規表現に変換できます。

```scala mdoc
import scala.util.matching.Regex

val numberPattern: Regex = "[0-9]".r

numberPattern.findFirstMatchIn("awesomepassword") match {
  case Some(_) => println("Password OK")
  case None => println("Password must contain a number")
}
```
上記の例では、`numberPattern`は`Regex`(正規表現)型で、パスワードに数字が含まれていることを確認するのに使います。

括弧を使うことで、正規表現のグループを探すこともできます。

```scala mdoc
import scala.util.matching.Regex

val keyValPattern: Regex = "([0-9a-zA-Z-#() ]+): ([0-9a-zA-Z-#() ]+)".r

val input: String =
  """background-color: #A03300;
    |background-image: url(img/header100.png);
    |background-position: top center;
    |background-repeat: repeat-x;
    |background-size: 2160px 108px;
    |margin: 0;
    |height: 108px;
    |width: 100%;""".stripMargin

for (patternMatch <- keyValPattern.findAllMatchIn(input))
  println(s"key: ${patternMatch.group(1)} value: ${patternMatch.group(2)}")
```
ここでは、文字列のキーと値を解析しています。
それぞれのマッチはサブマッチのグループを持ちます。こちらが出力結果です。
```
key: background-color value: #A03300
key: background-image value: url(img/header100.png)
key: background-position value: top center
key: background-repeat value: repeat-x
key: background-size value: 2160px 108px
key: margin value: 0
key: height value: 108px
key: width value: 100
```
