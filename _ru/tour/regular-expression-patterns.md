---
layout: tour
title: Регулярные Выражения

discourse: true

partof: scala-tour

num: 15
language: ru
next-page: extractor-objects
previous-page: singleton-objects

---

Регулярные выражения (Regular expression) - это специальный шаблон для поиска данных задаваемый в виде текстовой строки. Любая строка может быть преобразована в регулярное выражение методом `.r`.

```scala mdoc
import scala.util.matching.Regex

val numberPattern: Regex = "[0-9]".r

numberPattern.findFirstMatchIn("awesomepassword") match {
  case Some(_) => println("Password OK")
  case None => println("Password must contain a number")
}
```

В приведенном выше примере `numberPattern` - это `Regex` (регулярное выражение), которое мы используем, чтобы убедиться, что пароль содержит число.

Используя круглые скобки можно объединять сразу несколько групп регулярных выражений.

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
Здесь мы обработали сразу и ключи и значения строки. В каждой совпадении есть подгруппа совпадений. Вот как выглядит результат:
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
