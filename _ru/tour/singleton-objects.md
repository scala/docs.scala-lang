---
layout: tour
title: Одноэлементные Объекты

discourse: true

partof: scala-tour

num: 13
language: ru
next-page: regular-expression-patterns
previous-page: pattern-matching
prerequisite-knowledge: classes, methods, private-methods, packages, option
---
Объект - это класс, существующий в единственном экземпляре. Он создается лениво, когда на него ссылаются, также как ленивые значения (lazy val).

На самом верхнем уровне объект является одноэлементным.

Как член класса или как локальная переменная, он ведет себя точно так же как ленивое значение (lazy val).
# Объявление одноэлементного объекта
Объект - это значение. Объявление объекта происходит похожим с классом образом, но используется ключевое слово `object`:
```tut
object Box
```

Вот пример объекта с методом:
```
package logging

object Logger {
  def info(message: String): Unit = println(s"INFO: $message")
}
```
Метод `info` может быть импортирован из любой точки программы. Создание подобных методов является распространенным вариантом использования одноэлементных объектов.

Давайте посмотрим, как использовать `info` в другом пакете:

```
import logging.Logger.info

class Project(name: String, daysToComplete: Int)

class Test {
  val project1 = new Project("TPS Reports", 1)
  val project2 = new Project("Website redesign", 5)
  info("Created projects")  // Prints "INFO: Created projects"
}
```

Метод `info` виден благодаря указанию импорта `import logging.Logger.info`.

Замечание: Если `object` не является объектом верхнего уровня, но вложен в другой класс или объект, то объект, как и любой другой член, "зависим от пути". Это означает, что при двух видах напитков, `class Milk` and `class OrangeJuice`, член класса `object NutritionInfo` "зависит" от окружающего класса, либо milk либо orange juice. `milk.NutritionInfo` полностью отделен от `orangejuice.NutritionInfo`.

## Объекты компаньоны

Объект с тем же именем, что и класс, называется _объект компаньон_. И наоборот, класс является классом-компаньоном объекта. Класс или объект компаньон может получить доступ к приватным членам своего спутника. Используйте объект компаньон для методов и значений, которые не специфичны для экземпляров класса компаньона.
```
import scala.math._

case class Circle(radius: Double) {
  import Circle._
  def area: Double = calculateArea(radius)
}

object Circle {
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)
}

val circle1 = new Circle(5.0)

circle1.area
```

Класс `Circle` имеет член `area`, который специфичен для каждого экземпляра, и одноэлементный `object Circle` с методом `calculateArea`, который доступен для каждого экземпляра.

Объект компаньон может также содержать методы производящие экземпляры класса спутника:
```tut
class Email(val username: String, val domainName: String)

object Email {
  def fromString(emailString: String): Option[Email] = {
    emailString.split('@') match {
      case Array(a, b) => Some(new Email(a, b))
      case _ => None
    }
  }
}

val scalaCenterEmail = Email.fromString("scala.center@epfl.ch")
scalaCenterEmail match {
  case Some(email) => println(
    s"""Registered an email
       |Username: ${email.username}
       |Domain name: ${email.domainName}
     """)
  case None => println("Error: could not parse email")
}
```
`object Email` содержит производящий метод `fromString`, который создает экземпляр `Email` из строки. Мы возвращаем результат как опцию `Option[Email]` на случай возникновения ошибок парсинга.

Примечание: Если у класса или объекта есть компаньон, они должны быть размещены в одном и том же файле. Чтобы задать компаньонов в REPL, либо определите их на той же строке, либо перейдите в режим `:paste`.

## Примечания для Java-программистов ##

`static` члены в Java смоделированы как обычные члены объекта компаньона в Scala.

При использовании объекта компаньона из Java-кода, члены будут определены в сопутствующем классе компаньоне с `static` модификатором. Это называется _пробрасывание статики_. Такое происходит, даже если вы сами не определили класс компаньон.
