---
title: 工具
type: section
description: This chapter provides an introduction to the available domain modeling tools in Scala 3, including classes, traits, enums, and more.
languages:[en, ru]
num: 20
previous-page: domain-modeling-intro
next-page: domain-modeling-oop

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---

Scala 3提供了许多不同的结构，因此我们可以对周围的世界进行建模：

- 类
- 对象
- 伴生对象
- traits
- 抽象类
- 枚举
- 样例类
- 样例对象

本节简要介绍其中的每种语言功能。

## 类

与其他语言一样，Scala中的 _类_是用于创建对象实例的模板。
下面是一些类的示例：

```scala
class Person(var name: String, var vocation: String)
class Book(var title: String, var author: String, var year: Int)
class Movie(var name: String, var director: String, var year: Int)
```

这些例子表明，Scala有一种非常轻量级的方式来声明类。

我们的示例类的所有参数都定义为 `var` 字段，这意味着它们是可变的：您可以读取它们，也可以修改它们。
如果您希望它们是不可变的---仅读取---请改为将它们创建为 `val` 字段，或者使用样例类。

在Scala 3之前，您使用 `new` 关键字来创建类的新实例：

```scala
val p = new Person("Robert Allen Zimmerman", "Harmonica Player")
//      ---
```

然而，通过[创造者应用][creator]，在 Scala 3 里面不要求使用 `new`：

```scala
val p = Person("Robert Allen Zimmerman", "Harmonica Player")
```

一旦你有了一个类的实例，比如`p`，你就可以访问它的字段，在此示例中，这些字段都是构造函数的参数：

```scala
p.name       // "Robert Allen Zimmerman"
p.vocation   // "Harmonica Player"
```

如前所述，所有这些参数都是作为 `var` 字段创建的，因此您也可以更改它们：

```scala
p.name = "Bob Dylan"
p.vocation = "Musician"
```

### 字段和方法

类还可以具有不属于构造函数的方法和其他字段。
它们在类的主体中定义。
主体初始化为默认构造函数的一部分：

```scala
class Person(var firstName: String, var lastName: String):

  println("initialization begins")
  val fullName = firstName + " " + lastName

  // a class method
  def printFullName: Unit =
    // access the `fullName` field, which is created above
    println(fullName)

  printFullName
  println("initialization ends")
```

以下 REPL 会话演示如何使用这个类创建新的 `Person` 实例：

````
scala> val john = Person("John", "Doe")
initialization begins
John Doe
initialization ends
val john: Person = Person@55d8f6bb

scala> john.printFullName
John Doe
````

类还可以扩展 traits和抽象类，我们将在下面专门部分中介绍这些内容。

### 默认参数值

快速浏览一下其他功能，类构造函数参数也可以具有默认值：

```scala
class Socket(val timeout: Int = 5_000, val linger: Int = 5_000):
  override def toString = s"timeout: $timeout, linger: $linger"
```

此功能的一大优点是，它允许代码的使用者以各种不同的方式创建类，就好像该类有别的构造函数一样：

```scala
val s = Socket()                  // timeout: 5000, linger: 5000
val s = Socket(2_500)             // timeout: 2500, linger: 5000
val s = Socket(10_000, 10_000)    // timeout: 10000, linger: 10000
val s = Socket(timeout = 10_000)  // timeout: 10000, linger: 5000
val s = Socket(linger = 10_000)   // timeout: 5000, linger: 10000
```

创建类的新实例时，还可以使用命名参数。
当许多参数具有相同的类型时，这特别有用，如以下比较所示：

```scala
// option 1
val s = Socket(10_000, 10_000)

// option 2
val s = Socket(
  timeout = 10_000,
  linger = 10_000
)
```

### 辅助构造函数

可以为类定义多个构造函数，以便类的使用者用不同的方式来生成这个类。
例如，假设您需要编写一些代码给大学招生系统中的学生进行建模。
在分析需求时，您已经看到您需要能够以三种方式构建 `Student` 实例：

- 当他们第一次开始招生过程时，带有姓名和政府 ID，
- 当他们提交申请时，带有姓名，政府 ID 和额外的申请日期
- 在他们被录取后，带有姓名，政府 ID 和学生证

在 OOP 风格中处理这种情况的一种方法是使用以下代码：

```scala
import java.time.*

// [1] the primary constructor
class Student(
  var name: String,
  var govtId: String
):
  private var _applicationDate: Option[LocalDate] = None
  private var _studentId: Int = 0

  // [2] a constructor for when the student has completed
  // their application
  def this(
    name: String,
    govtId: String,
    applicationDate: LocalDate
  ) =
    this(name, govtId)
    _applicationDate = Some(applicationDate)

  // [3] a constructor for when the student is approved
  // and now has a student id
  def this(
    name: String,
    govtId: String,
    studentId: Int
  ) =
    this(name, govtId)
    _studentId = studentId
```

{% comment %}
// for testing that code
override def toString = s"""
|Name: $name
|GovtId: $govtId
|StudentId: $_studentId
|Date Applied: $_applicationDate
""".trim.stripMargin
{% endcomment %}

该类有三个构造函数，由代码中编号的注释给出：

1. 主构造函数，由类定义中的 `name` 和 `govtId` 给出
2. 具有参数 `name` 、 `govtId` 和 `applicationDate` 的辅助构造函数
3. 另一个带有参数 `name` 、 `govtId` 和 `studentId` 的辅助构造函数

这些构造函数可以这样调用：

```scala
val s1 = Student("Mary", "123")
val s2 = Student("Mary", "123", LocalDate.now)
val s3 = Student("Mary", "123", 456)
```

虽然可以使用此技术，但请记住，构造函数参数也可以具有默认值，这使得一个类看起来具有多个构造函数。
这在前面的 `Socket` 示例中所示。

## 对象

对象是一个正好有一个实例的类。
当其成员是引用类时，它会延迟初始化，类似于 `lazy val` 。
Scala 中的对象允许在一个命名空间下对方法和字段进行分组，类似于我们在 Java，Javascript（ES6）中使用 `static` 方法或在 Python 中使用 `@staticmethod` 方法。

声明 `object` 类似于声明 `class` 。
下面是一个“字符串实用程序”对象的示例，其中包含一组用于处理字符串的方法：

```scala
object StringUtils:
  def truncate(s: String, length: Int): String = s.take(length)
  def containsWhitespace(s: String): Boolean = s.matches(".*\\s.*")
  def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty
```

我们可以这样使用对象：

```scala
StringUtils.truncate("Chuck Bartowski", 5)  // "Chuck"
```

在 Scala 中导入非常灵活，并允许我们导入对象的 _所有_ 成员：

```scala
import StringUtils.*
truncate("Chuck Bartowski", 5)       // "Chuck"
containsWhitespace("Sarah Walker")   // true
isNullOrEmpty("John Casey")          // false
```

或者只是 _部分_ 成员：

```scala
import StringUtils.{truncate, containsWhitespace}
truncate("Charles Carmichael", 7)       // "Charles"
containsWhitespace("Captain Awesome")   // true
isNullOrEmpty("Morgan Grimes")          // Not found: isNullOrEmpty (error)
```

对象还可以包含字段，这些字段也可以像静态成员一样访问：

```scala
object MathConstants:
  val PI = 3.14159
  val E = 2.71828

println(MathConstants.PI)   // 3.14159
```


## 伴生对象

与类同名且在与类在相同的文件中声明的 `object` 称为 _“伴生对象”_。
同样，相应的类称为对象的伴生类。
伴生类或对象可以访问其伴生的私有成员。

伴生对象用于不特定于伴生类实例的方法和值。
例如，在下面的示例中，类 `Circle` 具有一个名为 `area` 的成员，该成员特定于每个实例，其伴生对象具有一个名为 `calculateArea` 的方法，该方法(a)不特定于实例，并且(b)可用于每个实例：

```scala
import scala.math.*

case class Circle(radius: Double):
  def area: Double = Circle.calculateArea(radius)

object Circle:
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)

val circle1 = Circle(5.0)
circle1.area
```

在此示例中，每个实例可用的 `area` 方法使用伴生对象中定义的 `calculateArea` 方法。
再一次， `calculateArea` 类似于Java中的静态方法。
此外，由于 `calculateArea` 是私有的，因此其他代码无法访问它，但如图所示，它可以被 `Circle` 类的实例看到。

### 其他用途

伴生对象可用于多种用途：

- 如图所示，它们可用于将“静态”方法分组到命名空间下
  - 这些方法可以是公共的，也可以是私有的
  - 如果 `calculateArea` 是公开的，它将被访问为 `Circle.calculateArea` 
- 它们可以包含 `apply` 方法，这些方法---感谢一些语法糖---作为工厂方法来构建新实例
- 它们可以包含 `unapply` 方法，用于解构对象，例如模式匹配

下面快速了解如何将 `apply` 方法当作工厂方法来创建新对象：

```scala
class Person:
  var name = ""
  var age = 0
  override def toString = s"$name is $age years old"

object Person:

  // a one-arg factory method
  def apply(name: String): Person =
    var p = new Person
    p.name = name
    p

  // a two-arg factory method
  def apply(name: String, age: Int): Person =
    var p = new Person
    p.name = name
    p.age = age
    p

end Person

val joe = Person("Joe")
val fred = Person("Fred", 29)

//val joe: Person = Joe is 0 years old
//val fred: Person = Fred is 29 years old
```

此处不涉及 `unapply` 方法，但在 [参考文档][unapply] 中对此进行了介绍。

## Traits

如果你熟悉Java，Scala trait 类似于Java 8+中的接口。特质可以包含：

- 抽象方法和成员
- 具体方法和成员

在基本用法中，trait 可以用作接口，仅定义将由其他类实现的抽象成员：

```scala
trait Employee:
  def id: Int
  def firstName: String
  def lastName: String
```

但是，traits 也可以包含具体成员。
例如，以下 traits定义了两个抽象成员---`numLegs` 和 `walk()`---并且还具有`stop()`方法的具体实现：

```scala
trait HasLegs:
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")
```

下面是另一个具有抽象成员和两个具体实现的 trait：

```scala
trait HasTail:
  def tailColor: String
  def wagTail() = println("Tail is wagging")
  def stopTail() = println("Tail is stopped")
```

请注意，每个 trait 只处理非常特定的属性和行为： `HasLegs` 只处理腿，而 `HasTail` 只处理与尾部相关的功能。
Traits可以让你构建这样的小模块。

在代码的后面部分，类可以混合多个 traits 来构建更大的组件：

```scala
class IrishSetter(name: String) extends HasLegs, HasTail:
  val numLegs = 4
  val tailColor = "Red"
  def walk() = println("I’m walking")
  override def toString = s"$name is a Dog"
```

请注意，`IrishSetter` 类实现了在 `HasLegs` 和 `HasTail` 中定义的抽象成员。
现在，您可以创建新的 `IrishSetter` 实例：

```scala
val d = IrishSetter（“Big Red”） // “Big Red is a Dog”
```

这只是你对 trait 可以完成的事情的一种体验。
有关更多详细信息，请参阅这些建模课程的其余部分。

## 抽象类

{% comment %}
LATER: If anyone wants to update this section, our comments about abstract classes and traits are on Slack. The biggest points seem to be:
- The `super` of a trait is dynamic
- At the use site, people can mix in traits but not classes
- It remains easier to extend a class than a trait from Java, if the trait has at least a field
- Similarly, in Scala.js, a class can be imported from or exported to JavaScript. A trait cannot
- There are also some point that unrelated classes can’t be mixed together, and this can be a modeling advantage
{% endcomment %}

当你想写一个类，但你知道它将有抽象成员时，你可以创建一个 trait 或一个抽象类。
在大多数情况下，你会使用 trait，但从历史上看，有两种情况，使用抽象类比使用 trait 更好：

- 您想要创建一个使用构造函数参数的基类
- 代码将从 Java 代码调用

### 使用构造函数参数的基类

在 Scala 3 之前，当基类需要使用构造函数参数时，你可以将其声明为`abstract class`：

```scala
abstract class Pet(name: String):
  def greeting: String
  def age: Int
  override def toString = s"My name is $name, I say $greeting, and I’m $age"

class Dog(name: String, age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

但是，在 Scala 3 中，trait 现在可以具有[参数][trait-params]，因此您现在可以在相同情况下使用 trait：

```scala
trait Pet(name: String):
  def greeting: String
  def age: Int
  override def toString = s"My name is $name, I say $greeting, and I’m $age"

class Dog(name: String, var age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

trait 的组成更加灵活---您可以混合多个 trait，但只能扩展一个类---并且大多数时候应该优先于类和抽象类。
经验法则是，每当要创建特定类型的实例时，就使用类;如果要分解和重用行为时，应使用trait。

## 枚举

枚举可用于定义由一组有限的命名值组成的类型（在[FP建模][fp-modeling]一节中，我们将看到枚举比这更灵活）。
基本枚举用于定义常量集，如一年中的月份、一周中的天数、北/南/东/西方向等。

例如，这些枚举定义了与披萨饼相关的属性集：

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

若要在其他代码中使用它们，请先导入它们，然后使用它们：

```scala
import CrustSize.*
val currentCrustSize = Small
```

枚举值可以使用等于 （`==`） 进行比较，也可以用匹配的方式：

```scala
// if/then
if (currentCrustSize == Large)
  println("You get a prize!")

// match
currentCrustSize match
  case Small => println("small")
  case Medium => println("medium")
  case Large => println("large")
```

### 其他枚举特性

枚举也可以参数化：

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

它们还可以具有成员（如字段和方法）：

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =
    otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // more planets here ...
```

### 与 Java 枚举的兼容性

如果要将 Scala 定义的枚举用作 Java 枚举，可以通过扩展类 `java.lang.Enum`（默认情况下导入）来实现，如下所示：

```scala
enum Color extends Enum[Color] { case Red, Green, Blue }
```

类型参数来自 Java `enum` 定义，并且应与枚举的类型相同。
在扩展时，无需向`java.lang.Enum`提供构造函数参数（如Java API文档中所定义的那样）---编译器会自动生成它们。

像这样定义 `Color` 之后，你可以像使用 Java 枚举一样使用它：

````
scala> Color.Red.compareTo（Color.Green）
val res0： Int = -1
````

关于[代数数据类型][adts]和[参考文档][ref-enums]的部分更详细地介绍了枚举。

## 样例类

样例类用于对不可变数据结构进行建模。
举个例子：

```scala
case class Person(name: String, relation: String)
```

由于我们将 `Person` 声明为样例类，因此默认情况下，字段 `name` 和 `relation` 是公共的和不可变的。
我们可以创建 样例类的实例，如下所示：

```scala
val christina = Person("Christina", "niece")
```

请注意，这些字段不能发生更改：

```scala
christina.name = "Fred"   // error: reassignment to val
```

由于 样例类的字段被假定为不可变的，因此 Scala 编译器可以为您生成许多有用的方法：

* 生成一个 `unapply` 方法，该方法允许您对样例类执行模式匹配（即，`case Person（n， r） => ...`）。
* 在类中生成一个 `copy` 方法，这对于创建实例的修改副本非常有用。
* 生成使用结构相等的 `equals` 和 `hashCode` 方法，允许您在 `Map` 中使用样例类的实例。
* 生成默认的 `toString` 方法，对调试很有帮助。

以下示例演示了这些附加功能：

```scala
// Case classes can be used as patterns
christina match
  case Person(n, r) => println("name is " + n)

// `equals` and `hashCode` methods generated for you
val hannah = Person("Hannah", "niece")
christina == hannah       // false

// `toString` method
println(christina)        // Person(Christina,niece)

// built-in `copy` method
case class BaseballTeam(name: String, lastWorldSeriesWin: Int)
val cubs1908 = BaseballTeam("Chicago Cubs", 1908)
val cubs2016 = cubs1908.copy(lastWorldSeriesWin = 2016)
// result:
// cubs2016: BaseballTeam = BaseballTeam(Chicago Cubs,2016)
```

### 支持函数式编程

如前所述，样例类支持函数式编程 （FP）：

- 在FP中，您尽量避免改变数据结构。
  因此，构造函数字段默认为 `val` 是有道理的。
  由于无法更改样例类的实例，因此可以轻松共享它们，而不必担心突变或争用条件。
- 您可以使用 `copy` 方法作为模板来创建新的（可能已更改的）实例，而不是改变实例。
  此过程可称为“复制时更新”。
- 自动为您生成 `unapply` 方法，还允许以模式匹配的高级方式使用样例类。

{% comment %}
NOTE: We can use this following text, if desired. If it’s used, it needs to be updated a little bit.

### 一种 `unapply` 的方法

样例类的一大优点是，它可以为您的类自动生成一个 `unapply` 方法，因此您不必编写一个方法。

为了证明这一点，假设你有这个 trait：

```scala
trait Person:
  def name: String
```

然后，创建以下样例类以扩展该 trait：

```scala
case class Student(name: String, year: Int) extends Person
case class Teacher(name: String, specialty: String) extends Person
```

由于它们被定义为样例类---并且它们具有内置的 `unapply` 方法---因此您可以编写如下匹配表达式：

```scala
def getPrintableString(p: Person): String = p match
  case Student(name, year) =>
    s"$name is a student in Year $year."
  case Teacher(name, whatTheyTeach) =>
    s"$name teaches $whatTheyTeach."
```

请注意 `case` 语句中的以下两种模式：

```scala
case Student(name, year) =>
case Teacher(name, whatTheyTeach) =>
```

这些模式之所以有效，是因为 `Student` 和 `Teacher` 被定义为具有 `unapply` 方法的样例类，其类型签名符合特定标准。
从技术上讲，这些示例中显示的特定类型的模式匹配称为_结构模式匹配_。

> Scala 标准是， `unapply` 方法在包装在 `Option` 中的元组中返回 样例类构造函数字段。
> 解决方案的“元组”部分在上一课中进行了演示。

要显示该代码的工作原理，请创建一个 `Student` 和 `Teacher` 的实例：

```scala
val s = Student("Al", 1)
val t = Teacher("Bob Donnan", "Mathematics")
```

接下来，这是当您使用这两个实例来调用 `getPrintableString` 时，REPL 中的输出如下所示：

```scala
scala> getPrintableString(s)
res0: String = Al is a student in Year 1.

scala> getPrintableString(t)
res1: String = Bob Donnan teaches Mathematics.
```

>所有这些关于 `unapply` 方法和提取器的内容对于这样的入门书来说都有些先进，但是因为样例类是一个重要的FP主题，所以似乎最好涵盖它们，而不是跳过它们。

#### 将模式匹配添加到任何具有 unapply 的类型

Scala 的一个很好的特性是，你可以通过编写自己的 `unapply` 方法来向任何类型添加模式匹配。
例如，此类在其伴生对象中定义了一个 `unapply` 方法：

```scala
class Person(var name: String, var age: Int)
object Person:
  def unapply(p: Person): Tuple2[String, Int] = (p.name, p.age)
```

因为它定义了一个 `unapply` 方法，并且因为该方法返回一个元组，所以您现在可以将 `Person` 与 `match` 表达式一起使用：

```scala
val p = Person("Astrid", 33)

p match
  case Person(n,a) => println(s"name: $n, age: $a")
  case null => println("No match")

// that code prints: "name: Astrid, age: 33"
```
{% endcomment %}


## 样例对象

样例对象之于对象，就像 样例类之于类：它们提供了许多自动生成的方法，以使其更加强大。
每当您需要需要少量额外功能的单例对象时，它们特别有用，例如在 `match` 表达式中与模式匹配一起使用。

当您需要传递不可变消息时，样例对象非常有用。
例如，如果您正在处理音乐播放器项目，您将创建一组命令或消息，如下所示：

```scala
sealed trait Message
case class PlaySong(name: String) extends Message
case class IncreaseVolume(amount: Int) extends Message
case class DecreaseVolume(amount: Int) extends Message
case object StopPlaying extends Message
```

然后在代码的其他部分，你可以编写这样的方法，这些方法使用模式匹配来处理传入的消息（假设方法 `playSong` ， `changeVolume` 和 `stopPlayingSong` 在其他地方定义）：

```scala
def handleMessages(message: Message): Unit = message match
  case PlaySong(name)         => playSong(name)
  case IncreaseVolume(amount) => changeVolume(amount)
  case DecreaseVolume(amount) => changeVolume(-amount)
  case StopPlaying            => stopPlayingSong()
```

[ref-enums]: {{ site.scala3ref }}/enums/enums.html
[adts]: {% link _zh-cn/overviews/scala3-book/types-adts-gadts.md %}
[fp-modeling]: {% link _zh-cn/overviews/scala3-book/domain-modeling-fp.md %}
[creator]: {{ site.scala3ref }}/other-new-features/creator-applications.html
[unapply]: {{ site.scala3ref }}/changed-features/pattern-matching.html
[trait-params]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
