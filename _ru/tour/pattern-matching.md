---
layout: tour
title: Сопоставление с примером

discourse: true

partof: scala-tour

num: 12
language: ru
next-page: singleton-objects
previous-page: case-classes
prerequisite-knowledge: case-classes, string-interpolation, subtyping

---

Сопоставление с примером (Pattern matching) - это механизм сравнения значений с определенным примером. При успешном совпадении значение может быть разложено на составные части. Мы рассматриваем сопоставление с примером, как более мощную версию `switch` оператора из Java. Eго также можно использовать вместо серии if/else выражений.

## Синтаксис
Синтаксис сопоставления с примером состоит из значения, ключевого слова `match` (сопоставить) и по крайней мере, одного пункта с примером `case`, с которым мы хотим сопоставить наше значение.
```scala mdoc
import scala.util.Random

val x: Int = Random.nextInt(10)

x match {
  case 0 => "zero"
  case 1 => "one"
  case 2 => "two"
  case _ => "many"
}
```
Значение константы `x` выше представляет собой случайное целое число от 0 до 10. `x` становится левым операндом оператора `match`, а справа - выражением с четырьмя примерами (называемые еще _вариантами_). Последний вариант `_` - позволяет "поймать все оставшиеся варианты" т. е. для любого числа больше 2. 

Сопоставление с примером возвращает значение.
```scala mdoc
def matchTest(x: Int): String = x match {
  case 1 => "one"
  case 2 => "two"
  case _ => "many"
}
matchTest(3)  // many
matchTest(1)  // one
```
Это сопоставляющее выражение имеет тип String, так как все варианты сопоставления возвращают String. Поэтому функция `matchTest` возвращает String.

## Сопоставление с классами образцами

Классы образцы особенно полезны для сопоставления. 

```scala mdoc
abstract class Notification

case class Email(sender: String, title: String, body: String) extends Notification

case class SMS(caller: String, message: String) extends Notification

case class VoiceRecording(contactName: String, link: String) extends Notification


```
`Notification` - абстрактный суперкласс, от которого наследуются три конкретных типа реализаций классов образцов `Email`, `SMS`, и `VoiceRecording`. Теперь мы можем делать сопоставление с примером используя в качестве примера один из этих классов образцов. 
При сопоставлении с классом образцом мы можем сразу извлекать параметры из которых состоит класс (благодаря автоматическому использованию [объекта экстрактора](extractor-objects.html)):

```
def showNotification(notification: Notification): String = {
  notification match {
    case Email(email, title, _) =>
      s"You got an email from $email with title: $title"
    case SMS(number, message) =>
      s"You got an SMS from $number! Message: $message"
    case VoiceRecording(name, link) =>
      s"you received a Voice Recording from $name! Click the link to hear it: $link"
  }
}
val someSms = SMS("12345", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")

println(showNotification(someSms))  // выводит "You got an SMS from 12345! Message: Are you there?"

println(showNotification(someVoiceRecording))  // выводит "you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123"
```
Функция `showNotification` принимает в качестве параметра абстрактный тип `Notification` который проверяет по образцам (т.е. выясняет, является ли он классом `Email`, `SMS` или `VoiceRecording`). В `case Email(email, title, _)`поля `email` и `title` используются в возвращаемом значении, а вот поле `body` игнорируется благодаря символу `_`.

## Ограждения примеров
Ограждения примеров - это просто логические выражения, которые используются для того, чтобы сделать выбор более специфичным (убрать лишние варианты). Просто добавьте `if <логическое выражение>` после примера.
```

def showImportantNotification(notification: Notification, importantPeopleInfo: Seq[String]): String = {
  notification match {
    case Email(email, _, _) if importantPeopleInfo.contains(email) =>
      "You got an email from special someone!"
    case SMS(number, _) if importantPeopleInfo.contains(number) =>
      "You got an SMS from special someone!"
    case other =>
      showNotification(other) // в этом варианте считается подходящими параметры любого типа. Значит этот вариант выполняется во всех случаях и передает исходный параметр в функцию showNotification
  }
}

val importantPeopleInfo = Seq("867-5309", "jenny@gmail.com")

val someSms = SMS("867-5309", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")
val importantEmail = Email("jenny@gmail.com", "Drinks tonight?", "I'm free after 5!")
val importantSms = SMS("867-5309", "I'm here! Where are you?")

println(showImportantNotification(someSms, importantPeopleInfo))
println(showImportantNotification(someVoiceRecording, importantPeopleInfo))
println(showImportantNotification(importantEmail, importantPeopleInfo))
println(showImportantNotification(importantSms, importantPeopleInfo))
```

В варианте `case Email(email, _, _) if importantPeopleInfo.contains(email)`, пример сравнивается только если `email` находится в списке `importantPeopleInfo`.

## Сопоставление только с типом
Вы можете сопоставлять только по типу как в примере:
```scala mdoc
abstract class Device
case class Phone(model: String) extends Device {
  def screenOff = "Turning screen off"
}
case class Computer(model: String) extends Device {
  def screenSaverOn = "Turning screen saver on..."
}

def goIdle(device: Device) = device match {
  case p: Phone => p.screenOff
  case c: Computer => c.screenSaverOn
}
```
метод `goIdle` реализует изменение поведения в зависимости от типа `Device`. По соглашению в качестве названия варианта используется первая буква типа (в данном случае `p` и `c`).

## Запечатанные классы
Трейты и классы могут быть помечены как `sealed` это означает, что подтипы должны быть объявлены в одном файле, гарантируя тем самым, что все подтипы будут известны.

```scala mdoc
sealed abstract class Furniture
case class Couch() extends Furniture
case class Chair() extends Furniture

def findPlaceToSit(piece: Furniture): String = piece match {
  case a: Couch => "Lie on the couch"
  case b: Chair => "Sit on the chair"
}
```
Это полезно для сопоставления с примером, ведь мы будем заранее знать все доступные варианты и нам не нужен вариант "все остальные".

## Замечания

Сопоставление с примером наиболее полезно для сопоставления алгебраических типов, выраженных через [классы образцы](case-classes.html).
Scala также позволяет создавать образцы независимо от классов образцов, через использование метода `unapply` в [объектах экстракторах](extractor-objects.html).
