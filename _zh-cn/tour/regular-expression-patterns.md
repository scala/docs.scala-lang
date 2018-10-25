---
layout: tour
title: 正则表达式

discourse: false

partof: scala-tour

num: 13

language: zh-cn

next-page: extractor-objects
previous-page: singleton-objects
---

正则表达式是一类特殊的字符串，可以用来在数据中寻找特定模式.  任何字符串都可以通过调用 `.r` 方法来转换成正则表达式

```tut
import scala.util.matching.Regex

val numberPattern: Regex = "[0-9]".r

numberPattern.findFirstMatchIn("awesomepassword") match {
  case Some(_) => println("Password OK")
  case None => println("Password must contain a number")
}
```

在上例中,  常量 `numberPattern` 是一个 `Regex` 类型的实例 (正则表达式) , 这里用来确保密码中含有一个数字. 

你也可以用圆括号括起多个正则表达式，以便一次寻找多个值.

```tut
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
此例中我们从字符串中解析出多组键值对.  每一个匹配值都包含一组子匹配值.  结果如下:
```
key: background-color value: #A03300
key: background-image value: url(img
key: background-position value: top center
key: background-repeat value: repeat-x
key: background-size value: 2160px 108px
key: margin value: 0
key: height value: 108px
key: width value: 100
```
