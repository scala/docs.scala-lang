---
layout: overview
title: 给 Java 工程师的 Scala 入门教学
overview: scala-for-java-programmers

discourse: false
multilingual-overview: true
language: zh-cn
---

Michel Schinz 与 Philipp Haller 著
Lightsing 译

## 介绍

此教学将对 Scala 语言以及编译器做一个简易介绍。面向的读者为具有编程经验，并且想简单了解 Scala 的人。本文假设读者有着基本的、最好是 Java 上的面向对象知识。

## 第一个例子

这里用标准的 *Hello world* 程序作为第一个例子。虽然它很无趣，但让我们可以用少量语言特质来演示 Scala 工具。程序如下：

    object HelloWorld {
      def main(args: Array[String]) {
        println("Hello, world!")
      }
    }

Java 程序员应该对这个程序结构感到熟悉：这有一个`main` 函数，该函数接受一个字符串数组作为参数，即命令行参数；函数内容为调用已定义好的函数`println ` 并用Hello world 字符串当参数。 `main` 函数没有返回值 (它是一个过程方法)。因此并不需要声明返回值类型。

Java 程序员不太熟悉的是包着 `main` 函数的 `object` 声明。这种声明引入我们一般称之 *Singleton* 的东西，也就是只有一个实例的类。所以上面的代码同时声明了一个 `HelloWorld` 类和一个该类的实例，也叫做 `HelloWorld`。该实例会在第一次被使用到的时候即时产生。

眼尖的读者可能已经注意到这边 `main` 函数的声明没有带着 `static`。这是因为 Scala 没有静态成员 (函数或属性)。 Scala 程序员将这成员声明在单实例对象中，而不是定义静态成员。

### 编译这个例子

我们用 Scala 编译器 `scalac`来编译这个例子。 `scalac` 就像大多数编译器一样，它接受源代码文件当对象，并接受额外的选项，然后产生一个或多个对象文件。它产出的对象文件为标准 Java class 文件。

如果我们将上面的程序存为文件 `HelloWorld.scala`，编译指令为( `>` 是提示字符，不用打)：

    > scalac HelloWorld.scala

这会在当前目录产生一些 class 文件。其中一个会叫做 `HelloWorld.class`，里面包含着可被 `scala` 直接执行的类。

### 执行示例

一旦编译过后，Scala 程序可以用 `scala` 指令执行。其使用方式非常像执行 Java 程序的 `java` 指令，并且接受同样选项。上面的示例可以用以下指令来执行并得到我们预期的输出：

    > scala -classpath . HelloWorld

    Hello, world!

## 与 Java 互动

Scala 的优点之一是它非常容易跟 Java 代码沟通。Scala 会默认 import `java.lang` 底下之类，其他类则需要明确导入。

让我们看个展示这点的示例。取得当下日期并根据某个特定国家调整成该国格式，如法国。

Java 的标准函数库定义了一些有用的工具类，如 `Date` 跟 `DateFormat`。因为 Scala 可以无缝的跟 Java 互动，这边不需要以 Scala 实作同样类－我们只需要导入对应的 Java 包：

    import java.util.{Date, Locale}
    import java.text.DateFormat
    import java.text.DateFormat._

    object FrenchDate {
      def main(args: Array[String]) {
        val now = new Date
        val df = getDateInstance(LONG, Locale.FRANCE)
        println(df format now)
      }
    }

Scala 的导入表达式跟 Java 非常像，但更为强大。如第一行，同一个 package 下的多个类可以用大括号括起来一起导入。另外一个差别是，当要导入套件或类下所有名称时，用下标 (`_`) 而不是星号 (`*`)。这是因为星号在 Scala 是一个合法的标识符 (如函数名称)。

所以第三行的表达式导入所有 `DateFormat` 类的成员。这让静态方法 `getDateInstance` 跟静态属性 `LONG` 可直接被使用。

在 `main` 函数中我们先创造一个 Java 的 `Date` 类实例，该实例默认拥有现在的日期。接下来用 `getDateInstance` 函数定义日期格式。最后根据地区化的 `DateFormat` 实例对现在日期设定格式并印出。最后一行展现了一个 Scala 有趣特点。只需要一个对象的函数可以用中缀语法调用。就是说，这个表达式

    df format now

是这个表达式的简略版本

    df.format(now)

它看起来也许只是语法上的小细节，但却有着重要的影响，其中一个影响将会在下一节做介绍。

最后值得一提的是，Scala 可以直接继承 Java 类或者实现 Java 接口。

## 一切都是对象

Scala 是一个纯粹的面向对象语言，这句话的意思是说，*所有东西*都是对象，包括数字、函数。因为 Java 将基本类型 (如 `boolean` 与 `int` ) 跟参照类型分开，而且没有办法像操作变量一样操作函数，从这角度来看 Scala 跟 Java 是不同的。

### 数字是对象

因为数字是对象，他们也有函数。事实上，一个像底下的算数表达式：

    1 + 2 * 3 / x

只有使用函数调用，因为像前一节一样，该式等价于

    (1).+(((2).*(3))./(x))

这也表示着 `+`、`*` 之类的在 Scala 里是合法的标识符。

因为Scala的词法分析器对于符号采用最长匹配，在第二版的表达式当中，那些括号是必要的。也就是说分析器会把这个表达式：

    1.+(2)

拆成 `1.`、`+`、`2` 这三个标记。会这样拆分是因为 `1.` 既是合法匹配的同时又比 `1` 长。 `1.` 会被解释成字面常数 `1.0`，使得它被视为 `Double` 而不是 `Int`。把表达式写成：

    (1).+(2)

可以避免 `1` 被解释成 `Double`。

### 函数是对象

可能令 Java 程序员更为惊讶的会是，Scala 中函数也是对象。因此，将函数当做对象传递、把它们存入变量、从其他函数返回函数都是可能的。能够像操作变量一样的操作函数这点是*函数式编程*这一非常有趣的程序设计思想的基石之一。

为何把函数当做变量一样的操作会很有用呢，让我们考虑一个定时函数，功能是每秒执行一些动作。我们要怎么将这动作传给它？最直接的便是将这动作视为函数传入。应该有不少程序员对这种简单传递函数的行为很熟悉：通常在用户界面相关的程序上，用来注册一些当事件发生时被调用的回调函数。

在接下来的程序中，定时函数叫做 `oncePerSecond` ，它接受一个回调函数做参数。该函数的类型被写作 `() => Unit` ，这个类型便是所有无对象且无返回值函数的类型( `Unit` 这个类型就像是 C/C++ 的 `void` )。此程序的主函数只是调用定时函数并带入回呼函数，回呼函数输出一句话到终端上。也就是说这个程序会不断的每秒输出一次 "time flies like an arrow"。

    object Timer {
      def oncePerSecond(callback: () => Unit) {
        while (true) { callback(); Thread sleep 1000 }
      }
      def timeFlies() {
        println("time flies like an arrow...")
      }
      def main(args: Array[String]) {
        oncePerSecond(timeFlies)
      }
    }

值得注意的是，在打印字符串时，我们使用的是 Scala 预定义的方法 `println`，而不是 `System.out` 中的。

#### 匿名函数

这程序还有改进空间。第一点，函数 `timeFlies` 只是为了能够被传递进 `oncePerSecond` 而定义的。赋予一个只被使用一次的函数名字似乎是没有必要的，最好能够在传入 `oncePerSecond` 时构造出这个函数。Scala 可以借由*匿名函数*来达到这点。利用匿名函数的改进版本程序如下：

    object TimerAnonymous {
      def oncePerSecond(callback: () => Unit) {
        while (true) { callback(); Thread sleep 1000 }
      }
      def main(args: Array[String]) {
        oncePerSecond(() =>
          println("time flies like an arrow..."))
      }
    }

这例子中的右箭头 `=>` 告诉我们有一个匿名函数，右箭头将函数对象跟函数内容分开。这个例子中，在箭头左边那组空的括号告诉我们对象列是空的。函数内容则是跟先前的 `timeFlies` 里一样。

## 类

之前已讲过，Scala 是一个面向对象语言，因此它有着类的概念 (更精确的说，的确有一些面向对象语言没有类的概念，但是 Scala 不是其中之一）。Scala 声明类的语法跟 Java 很接近。一个重要的差别是，Scala 的类可以有参数。如下面展示的复数的定义：

    class Complex(real: Double, imaginary: Double) {
      def re() = real
      def im() = imaginary
    }

这个复数类接受两个参数，分别为实跟虚部。在创造 `Complex` 的实例时，必须传入这些参数： `new Complex(1.5, 2.3)`。这个类有两个函数分别叫做 `re` 跟 `im` 让我们取得这两个部分。

值得注意的是，这两个函数的回传值并没有被明确给定。编译器将会自动的推断，它会查看这些函数的右侧并推导出这两个函数都会回传类型为 `Double` 的值。

编译器并不一定每次都能够推断出类型，而且很不幸的是我们并没有简单规则以分辨哪种情况能推断，哪种情况不能。实践上这通常不是问题，因为当编译器无法推断未明确给定的类型时，它会报错。Scala 初学者在遇到那些看起来很简单就能推导出类型的情况时，应该尝试着忽略类型声明并看看编译器是不是也觉得可以推断。多尝试几次之后程序员应该能够体会到何时忽略类型、何时该明确指定。

### 无对象函数

函数 `re`、`im` 有个小问题，为了调用函数，我们必须在函数名称后面加上一对空括号，如这个例子：

    object ComplexNumbers {
      def main(args: Array[String]) {
        val c = new Complex(1.2, 3.4)
        println("imaginary part: " + c.im())
      }
    }

最好能够在不需要加括号的情况下取得实虚部，这样便像是在取得属性。Scala完全可以做到这件事，需要的只是在定义函数的时候*不要定义参数*。这种函数跟零参数函数是不一样的，不论是定义或是调用，它们都没有括号跟在名字后面。我们的 `Complex` 可以改写成：

    class Complex(real: Double, imaginary: Double) {
      def re = real
      def im = imaginary
    }

### 继承与重写

Scala 中所有的类都继承自一个父类。像前一节的 `Complex` 这种没有指定的例子，Scala 会默认使用 `scala.AnyRef`。

Scala 中可以重写继承自父类的函数。但是为了避免意外重写，必须加上 `override` 修饰字来明确表示要重写函数。我们以重写 `Complex` 类中来自 `Object` 的  `toString` 作为示例。

    class Complex(real: Double, imaginary: Double) {
      def re = real
      def im = imaginary
      override def toString() =
        "" + re + (if (im < 0) "" else "+") + im + "i"
    }


## Case Class 跟模式匹配(pattern matching)

树是常见的数据结构。如：解译器跟编译器内部常见的表示程序方式便是树；XML文件是树；还有一些容器基于树，如红黑树。

接下来我们会通过一个小型计算程序来看看 Scala 是如何表示并操作树。这个程序将足以操作仅含有整数常数、整数变量跟加法的简单算术式。`1+2` 跟 `(x+x)+(7+y)` 为两个例子。

我们得先决定这种表达式的表示法。最自然表示法便是树，其中节点是操作、叶节点是值。

Java 中我们会将这个树用一个抽象父类表示，然后每种节点跟叶节点分别有各自的实际类。在函数编程里会用代数数据类型。Scala 则是提供了介于两者之间的 *case class*。这是用其定义这样数据类型的示例：

    abstract class Tree
    case class Sum(l: Tree, r: Tree) extends Tree
    case class Var(n: String) extends Tree
    case class Const(v: Int) extends Tree

`Sum`、`Var`、`Const` 类定义成 case class 代表着它们跟一般类有所差别：

- 在创建类实例时不需要用 `new` (也就是说我们可以写 `Const(5)`，而不是 `new Const(5)`)。
- 对应所有构造参数，Scala 会自动定义对应的取值函数 (即，对于 `Const` 类的实例，我们可以直接用 `c.v` 来取得建构式中的 `v` 参数)。
- `equals` 跟 `hashCode` 会有预设定义。该定义会根据实例的*结构*而不是个别实例的识别来运作。
- `toString` 会有预设定义。会印出"原始型态" (即，`x+1` 的树会被印成`Sum(Var(x),Const(1))`)。
- 这些类的实例可以借由*模式匹配*来拆解。

现在我们有了算术表达式的数据类型，可以开始定义各种运算。我们将从一个可以在*环境*内对运算式求值的函数起头。环境的用处是赋值给变量。举例来说，运算式 `x+1` 在一个将 `x` 赋与 `5` 的环境 (写作 `{ x -> 5 }` ) 下求值会得到 `6`。

因此我们需要一个表示环境的方法。当然我们可以用一些像是哈希表的关连性数据结构，但是我们也可以直接用函数！环境就只是一个将值对应到 (变量) 名称的函数。之前提到的环境 `{ x -> 5 }` 在 Scala 中可以简单的写作：

    { case "x" => 5 }

这个标记定义了一个当输入是字符串 `"x"` 时回传整数 `5`，其他输入则是用例外表示失败的函数。

开始之前，让我们先给环境类型一个名字。当然，我们可以直接用 `String => Int`，但是给这类型名字可以让我们简化程序，而且在未来要改动时较为简便。在 Scala 中我们这样做：

    type Environment = String => Int

于是类型 `Environment` 便可以当做输入 `String` 回传 `Int` 函数的类型之代名。

现在我们可以给出求值函数的定义。概念上非常简单：两个表达式和的值是两个表达式值的和；变量的值直接从环境取值；常数的值就是常数本身。表示这些在 Scala 里并不困难：

    def eval(t: Tree, env: Environment): Int = t match {
      case Sum(l, r) => eval(l, env) + eval(r, env)
      case Var(n)    => env(n)
      case Const(v)  => v
    }

这个求值函数借由对树 `t` 做*模式匹配*来求值。上述实作的意思应该从直观上便很明确：

1. 首先检查树 `t` 是否为 `Sum`，如果是的话将左跟右侧子树绑定到新变量 `l`跟 `r`，然后再对箭头后方的表达式求值；这一个表达式可以使用(而且这边也用到)根据箭头左侧模式所绑定的变量，也就是 `l` 跟 `r`，
2. 如果第一个检查失败，也就是说树不是 `Sum`，接下来检查 `t` 是否为 `Var`，如果是的话将 `Var` 所带的名称绑定到变量 `n` 并求值右侧表达式，
3. 如果第二个检查也失败，表示树不是 `Sum` 也不是 `Var`，那便检查是不是 `Const`，如果是的话将 `Const` 所带的名称绑定到变量 `v`  并求值右侧表达式，
4. 最后，如果全部检查都失败，会抛出异常表示匹配失败；这只会在有更多 `Tree` 的子类时发生。

如上，模式匹配基本上就是尝试将一个值对一系列模式做匹配，并在一个模式成功匹配时抽取并命名该值的各部分，最后对一些代码求值，而这些代码通常会利用被命名到的部分。

一个经验丰富的面向对象程序员也许会疑惑为何我们不将 `eval` 定义成 `Tree` 类跟子类的*方法*。由于 Scala 允许在 case class 中跟一般类一样定义函数，事实上我们可以这样做。要用模式匹配或是函数只是品味的问题，但是这会对扩充性有重要影响。

- 当使用函数时，增加新的节点类型是相当容易的，只要定义新的 `Tree` 子类即可。不过另一方面，为树增加新操作很麻烦，因为它需要修改 `Tree` 的所有子类。
- 当使用模式匹配时情况则反过来：增加新节点需要修改所有对树做模式匹配的函数将新节点纳入考虑；增加新操作则很简单，定义新函数就好。

让我们定义新操作以更进一步的探讨模式匹配：对符号求导数。读者们可能还记得这个操作的规则：

1. 和的导数是导数的和
2. 如果是对变量 `v` 取导数，变量 `v` 的导数是1，不然就是0
3. 常数的导数是0

这些规则几乎可以从字面上直接翻成 Scala 代码：

    def derive(t: Tree, v: String): Tree = t match {
      case Sum(l, r) => Sum(derive(l, v), derive(r, v))
      case Var(n) if (v == n) => Const(1)
      case _ => Const(0)
    }

这个函数引入两个关于模式匹配的新观念。首先，变量的 `case` 运算式有一个*看守*，也就是 `if` 关键字之后的表达式。除非表达式求值为真，不然这个看守会让匹配直接失败。在这边是用来确定我们只在取导数变量跟被取导数变量名称相同时才回传常数 `1`。第二个新特征是可以匹配任何值的*万用字符* `_`。

我们还没有探讨完模式匹配的全部功能，不过为了让这份文件保持简短，先就此打住。我们还是希望能看到这两个函数在真正的示例如何作用。因此让我们写一个简单的 `main` 函数，对表达式 `(x+x)+(7+y)` 做一些操作：先在环境 `{ x -> 5, y -> 7 }` 下计算结果，然后在对 `x` 接着对 `y` 取导数。

    def main(args: Array[String]) {
      val exp: Tree = Sum(Sum(Var("x"),Var("x")),Sum(Const(7),Var("y")))
      val env: Environment = { case "x" => 5 case "y" => 7 }
      println("Expression: " + exp)
      println("Evaluation with x=5, y=7: " + eval(exp, env))
      println("Derivative relative to x:\n " + derive(exp, "x"))
      println("Derivative relative to y:\n " + derive(exp, "y"))
    }

执行这程序，得到预期的输出：

    Expression: Sum(Sum(Var(x),Var(x)),Sum(Const(7),Var(y)))
    Evaluation with x=5, y=7: 24
    Derivative relative to x:
     Sum(Sum(Const(1),Const(1)),Sum(Const(0),Const(0)))
    Derivative relative to y:
     Sum(Sum(Const(0),Const(0)),Sum(Const(0),Const(1)))

研究这输出我们可以发现，取导数的结果应该在输出前更进一步化简。用模式匹配实现一个基本化简函数是一个很有趣 (但是意外的棘手) 的问题，在这边留给读者当练习。

## 特质 (Traits)

除了由父类继承行为以外，Scala 类还可以从一或多个*特质*导入行为。

对一个 Java 程序员最简单去理解特质的方式应该是视它们为带有实例的接口。在 Scala 里，当一个类继承特质时，它实现了该特质的接口并继承所有特质带有的功能。

为了理解特质的用处，让我们看一个经典示例：有序对象。大部分情况下，一个类所产生出来的对象之间可以互相比较大小是很有用的，如排序它们。在Java里可比较大小的对象实作 `Comparable` 介面。在Scala中借由定义等价于 `Comparable` 的特质 `Ord`，我们可以做的比Java稍微好一点。

当在比较对象的大小时，有六个有用且不同的谓词 (predicate)：小于、小于等于、等于、不等于、大于等于、大于。但是把六个全部都实现很烦，尤其是当其中有四个可以用剩下两个表示的时候。也就是说，(举例来说) 只要有等于跟小于谓词，我们就可以表示其他四个。在 Scala 中这些观察可以很漂亮的用下面的特质声明呈现：

    trait Ord {
      def < (that: Any): Boolean
      def <=(that: Any): Boolean =  (this < that) || (this == that)
      def > (that: Any): Boolean = !(this <= that)
      def >=(that: Any): Boolean = !(this < that)
    }

这份定义同时创造了一个叫做 `Ord` 的新类型，跟 Java 的 `Comparable` 接口有着同样定位，且给了一份以第一个抽象谓词表示剩下三个谓词的预设实作。因为所有对象预设都有一份等于跟不等于的谓词，这边便没有定义。

上面使用了一个 `Any` 类型，在 Scala 中这个类型是所有其他类型的父类型。因为它同时也是基本类型如 `Int`、`Float` 的父类型，可以将其视为更为一般化的 Java `Object` 类型。

因此只要定义测试相等性跟小于的谓词，并且加入 `Ord`，就可以让一个类的对象们互相比较大小。让我们实作一个表示阳历日期的 `Date` 类来做为例子。这种日期是由日、月、年组成，我们将用整数来表示这三个资料。因此我们可以定义 `Date` 类为：

    class Date(y: Int, m: Int, d: Int) extends Ord {
      def year = y
      def month = m
      def day = d
      override def toString(): String = year + "-" + month + "-" + day

这边要注意的是声明在类名称跟参数之后的 `extends Ord`。这个语法声明了 `Date` 继承 `Ord` 特质。

然后我们重新定义继承自 `Object` 的 `equals` 函数好让这个类可以正确的根据每个属性来比较日期。因为在 Java 中 `equals` 直接比较实际对象本身，并不能在这边用。于是我们有下面的例子：

    override def equals(that: Any): Boolean =
      that.isInstanceOf[Date] && {
        val o = that.asInstanceOf[Date]
        o.day == day && o.month == month && o.year == year
      }

这个函数使用了预定义函数 `isInstanceOf` 跟 `asInstanceOf`。`isInstanceOf` 对应到 Java 的 `instanceof` 运算子，只在当使用它的对象之类型跟给定类型一样时传回真。 `asInstanceOf` 对应到 Java 的转型运算子，如果对象是给定类型的实例，该对象就会被视为给定类型，不然就会丢出 `ClassCastException` 。

最后我们需要定义测试小于的谓词如下。

    def <(that: Any): Boolean = {
      if (!that.isInstanceOf[Date])
        error("cannot compare " + that + " and a Date")

      val o = that.asInstanceOf[Date]
      (year < o.year) ||
      (year == o.year && (month < o.month ||
                         (month == o.month && day < o.day)))
    }

这边使用了另外一个预定义函数 `error`，它会丢出带着给定错误信息的例外。这便完成了 `Date` 类。这个类的实例可被视为日期或是可比较对象。而且它们通通都定义了之前所提到的六个比较谓词： `equals` 跟 `<` 直接出现在类定义当中，其他则是继承自 `Ord` 特质。

特质在其他场合也有用，不过详细探讨它们的用途并不在本文件目标内。

## 泛型

在这份教学里，我们最后要探讨的 Scala 特性是泛型。Java 程序员应该相当清楚在 Java 1.5 之前缺乏泛型所导致的问题。

泛型指的是能够将类型也作为程序参数。举例来说，当程序员在为链表写函数库时，它必须决定列表的元素类型为何。由于这列表是要在许多不同场合使用，不可能决定列表的元素类型为如 `Int` 一类。这样限制太多。

Java 程序员采用所有对象的父类 `Object`。这个解决办法并不理想，一方面这并不能用在基础类型 (`int`、`long`、`float` 之类)，再来这表示必须靠程序员手动加入大量的动态转型。

Scala 借由可定义泛型类 (跟函数) 来解决这问题。让我们借由最简单的类容器来观察这点：引用，它可以是空的或者指向某类型的对象。

    class Reference[T] {
      private var contents: T = _
      def set(value: T) { contents = value }
      def get: T = contents
    }

类 `Reference` 带有一个类型参数 `T`，这个参数会是容器内元素的类型。此类型被用做 `contents` 变量的类型、 `set` 函数的对象类型、 `get` 函数的回传类型。

上面代码使用的 Scala 变量语法应该不需要过多的解释。值得注意的是赋与该变量的初始值是 `_`，该语法表示预设值。数值类型预设值是0，`Boolean` 类型是 `false`， `Unit` 类型是 `()` ，所有的对象类型是 `null`。

为了使用 `Reference` 类型，我们必须指定 `T`，也就是这容器所包容的元素类型。举例来说，创造并使用该容器来容纳整数，我们可以这样写：

    object IntegerReference {
      def main(args: Array[String]) {
        val cell = new Reference[Int]
        cell.set(13)
        println("Reference contains the half of " + (cell.get * 2))
      }
    }

如例子中所展现，并不需要先将 `get` 函数所回传的值转型便能当做整数使用。同时因为被声明为储存整数，也不可能存除了整数以外的东西到这一个容器中。

## 结语

本文件对Scala语言做了快速的概览并呈现一些基本的例子。对 Scala 有更多兴趣的读者可以阅读有更多进阶示例的 *Scala By Example*，并在需要的时候参阅 *Scala Language Specification* 。
