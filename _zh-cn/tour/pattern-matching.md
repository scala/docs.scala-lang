---
layout: tour
title: 模式匹配
partof: scala-tour

num: 11

language: zh-cn

next-page: singleton-objects
previous-page: case-classes
---

模式匹配是检查某个值（value）是否匹配某一个模式的机制，一个成功的匹配同时会将匹配值解构为其组成部分。它是Java中的`switch`语句的升级版，同样可以用于替代一系列的 if/else 语句。

## 语法
一个模式匹配语句包括一个待匹配的值，`match`关键字，以及至少一个`case`语句。

```scala mdoc
import scala.util.Random

val x: Int = Random.nextInt(10)

x match {
  case 0 => "zero"
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
```
上述代码中的`val x`是一个0到10之间的随机整数，将它放在`match`运算符的左侧对其进行模式匹配，`match`的右侧是包含4条`case`的表达式，其中最后一个`case _`表示匹配其余所有情况，在这里就是其他可能的整型值。

`match`表达式具有一个结果值
```scala mdoc
def matchTest(x: Int): String = x match {
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
matchTest(3)  // other
matchTest(1)  // one
```
这个`match`表达式是String类型的，因为所有的情况（case）均返回String，所以`matchTest`函数的返回值是String类型。

## 案例类（case classes）的匹配

案例类非常适合用于模式匹配。

```scala mdoc
abstract class Notification

case class Email(sender: String, title: String, body: String) extends Notification

case class SMS(caller: String, message: String) extends Notification

case class VoiceRecording(contactName: String, link: String) extends Notification


```

`Notification` 是一个虚基类，它有三个具体的子类`Email`, `SMS`和`VoiceRecording`，我们可以在这些案例类(Case Class)上像这样使用模式匹配：

```
def showNotification(notification: Notification): String = {
  notification match {
    case Email(sender, title, _) =>
      s"You got an email from $sender with title: $title"
    case SMS(number, message) =>
      s"You got an SMS from $number! Message: $message"
    case VoiceRecording(name, link) =>
      s"you received a Voice Recording from $name! Click the link to hear it: $link"
  }
}
val someSms = SMS("12345", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")

println(showNotification(someSms))  // prints You got an SMS from 12345! Message: Are you there?

println(showNotification(someVoiceRecording))  // you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123
```
`showNotification`函数接受一个抽象类`Notification`对象作为输入参数，然后匹配其具体类型。（也就是判断它是一个`Email`，`SMS`，还是`VoiceRecording`）。在`case Email(sender, title, _)`中，对象的`sender`和`title`属性在返回值中被使用，而`body`属性则被忽略，故使用`_`代替。

## 模式守卫（Pattern gaurds）
为了让匹配更加具体，可以使用模式守卫，也就是在模式后面加上`if <boolean expression>`。
```

def showImportantNotification(notification: Notification, importantPeopleInfo: Seq[String]): String = {
  notification match {
    case Email(sender, _, _) if importantPeopleInfo.contains(sender) =>
      "You got an email from special someone!"
    case SMS(number, _) if importantPeopleInfo.contains(number) =>
      "You got an SMS from special someone!"
    case other =>
      showNotification(other) // nothing special, delegate to our original showNotification function
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

在`case Email(sender, _, _) if importantPeopleInfo.contains(sender)`中，除了要求`notification`是`Email`类型外，还需要`sender`在重要人物列表`importantPeopleInfo`中，才会匹配到该模式。
 

## 仅匹配类型
也可以仅匹配类型，如下所示：
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
当不同类型对象需要调用不同方法时，仅匹配类型的模式非常有用，如上代码中`goIdle`函数对不同类型的`Device`有着不同的表现。一般使用类型的首字母作为`case`的标识符，例如上述代码中的`p`和`c`，这是一种惯例。

## 密封类

特质（trait）和类（class）可以用`sealed`标记为密封的，这意味着其所有子类都必须与之定义在相同文件中，从而保证所有子类型都是已知的。

```scala mdoc
sealed abstract class Furniture
case class Couch() extends Furniture
case class Chair() extends Furniture

def findPlaceToSit(piece: Furniture): String = piece match {
  case a: Couch => "Lie on the couch"
  case b: Chair => "Sit on the chair"
}
```
这对于模式匹配很有用，因为我们不再需要一个匹配其他任意情况的`case`。

## 备注

Scala的模式匹配语句对于使用[案例类（case classes）](case-classes.html)表示的类型非常有用，同时也可以利用[提取器对象（extractor objects）](extractor-objects.html)中的`unapply`方法来定义非案例类对象的匹配。

