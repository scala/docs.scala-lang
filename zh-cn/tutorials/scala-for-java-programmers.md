---
layout: overview
title: Java程序员的Scala指南
overview: scala-for-java-programmers

disqus: true
multilingual-overview: true
languages: [es, ko, de, zh-cn]
---

作者：Michel Schinz and Philipp Haller 译者：[陈浩](http://haoch.me)

## 介绍

本文档是Scala语言及其编译器的一个快速介绍。其目标读者是已经有一定编程经验并且希望大概知道Scala可用来做什么。本文默认读者已具备面向对象尤其是Java的基础知识。

### 第一个示例

作为第一个例子，我们将使用*Hello World*程序。也许它并不吸引人，但是可以很容易在无需对这门语言太多了解的情况下展示Scala工具的用法。具体内容如下：

    object HelloWorld {
      def main(args: Array[String]) {
        println("Hello, world!")
      }
    }

对于Java程序员，这个结构应该非常熟悉：它由一个叫`main`的方法组成，以命令行参数，即一个字符串数组，作为参数；the  这个方法的主体是对预定义的方法`println`的单一调用，并以友好的问候作为参数。这个`main`方法不返回值(它是一个过程方法)，因此，无需申明返回类型。

对于Java程序员，不熟悉的是包含`main`方法的`object`的声明。这种声明方式，通常称之为*单例对象*，是指拥有单一实例的类。以上同时声明了一个名为`HelloWorld`的类以及这个类的一个实例，同样叫`HelloWorld`，这个实例需要时才会创建，即第一次使用的时候。

机敏的读者也许注意到这里`main`方法没有声明为`static`。因为Scala中不存在静态成员（方法或者字段）。对于静态成员，Scala程序员会在单例对象中定义。

### 编译示例

我们利用`scalac`，即Scala编译器，来编译这个例子。`scalac`工作原理与大多数编译器类似：它以一个源文件作为参数，可能带有一些选项，然后生成一个活着多个对象文件。这些生成的对象文件是标准的Java class文件。

如果我们将上述程序保存至一个叫`HelloWorld.scala`的文件中，我们便能通过输入以下命令编译它（这个较大的符号`>`表示命令行提示，无需输入）：

    > scalac HelloWorld.scala

当前目录中会生成一些class文件。其中有一个名为`HelloWorld.class`，它包含了能够直接使用`scala`命令执行的类，正如下一段中将讲述。

### 运行示例

一旦编译，Scala程序就可以通过`scala`命令运行。
它的用法与`java`命令运行java程序类似，并接受相同的选项。以上示例能够利用以下命令执行，并产生预期输出：

    > scala -classpath . HelloWorld

    Hello, world!

## 与Java交互

Scala的强项之一是易于与Java代码交互。所有`java.lang`包下面的类默认引入，其他的则需要显式引入。

让我们来看一个例子展示这一点。我们希望获取并根据特定国家，比如法国，的约定来格式化当前日期。（其他地区比如瑞士的法语区遵循相同的约定。）

Java的类库定义了许多强大的工具类，如Date和DateFormat。因为Scala可以与Java无缝交互，没必要在Scala类库中实现相同的类－我们可以简单地引入对应Java包的类：

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
 

Scala的引入声明与Java的看起来非常相似。然而，它更加强大。同一个包的多个类可以将他们放在第一行的花括号中同时引入。另外一个不同在于引入一个包或者class的所有成员时，应该使用下划线字符（`_`）而非星号（`*`）。因为星号是一个合法的Scala标识符（如方法名），我们将稍后提到。

第三行的引入声明引入了`DateFormat类`的所有成员。使得静态方法`getDateInstance`和静态字段`LONG`直接可见。

在`main`方法中，我们首先创建一个Java的`Date`类的实例，它默认包含当前日期。然后，我们通过预先引入的静态方法`getDateInstance`定义一个日期格式。最后，我们将根据对应区域的`DateFormat`的实例格式化后的当前日期打印出来。最后一行显示Scala语法的一个有趣的属性。接受一个参数的方法能够以中缀语法使用。表达式如下

    df format now

仅仅是下面表达式略为不啰嗦的另一种写法

    df.format(now)

这似乎是一个微不足道的语法细节，但是具有重要的影响，其中之一将在下节探讨。

结束关于Java交互的这一节之前，值得注意的是在Scala中也可能直接继承Java类和实现Java接口。

## 一切都是对象

Scala是一个纯粹的面向对象语言，因为一起都是对象，包括数字或者函数。它和Java有所不同，Java区分原始类型（例如`boolean`和`int`）和引用类型，而且不能够将函数当为值来操作。

## 数字是对象

因为数字是对象，它们也有方法。而且事实上，如下这种算术表达式：

    1 + 2 * 3 / x

专门由方法调用组成，因为它等价于下面的表达式，正如上节所述：

    (1).+(((2).*(3))./(x))

这也意味着`+`，`*`等在Scala中均是合法的标识符。

第二版本中数字周围的圆括号是必须的，因为Scala的词法分析器采用最长匹配规则来处理分词。因此，以下表达式将被拆分：

    1.+(2)

成单词`1.`, `+`和 `2`。选择这种分词方式的原因在于`1.`相对与`1`是一个更长的合法匹配。单词`1.`被解析成了文本`1.0`，进而变成一个`Double`而非`Int`。像这样写这个表达式：

	(1).+(2)

可避免`1`被解析成`Double`。

### 函数是对象

对于Java程序员，更意外的是Scala中函数也是对象。以至于将函数作为参数传递，以变量存储，以及从其他其他函数中返回成为了可能。这种将函数当作值操作的能力是一个非常有趣的被称之为`函数式编程(functional programming)`的编程范式的基础之一。

我们以一个非常简单的用于在每秒执行某个行为的定时器函数为例，来说明为什么将函数作为值使用是非常有用 的。我们如何传递给它这个行为以执行呢 ？非常合乎逻辑的是作为一个函数。这种非常简单的函数传递对于许多程序员而言应该很熟悉：经常被用于用户接口代码，用于注册回调函数，当某些事件发生时被调用。

在接下来的程序中，这个计时器函数叫做`oncePerSecond`，它以一个回调函数作为参数。这个函数的类型写作`() => Unit`，指所有无需参数并且不返回任何值（类型`Unit`类似于C/C++中的`void`）的函数的类型。这个程序的主函数简单调用这个计时器函数，并传入在终端中答应一句话的回调函数。换言之，这个程序不断地每秒打印一次这句"time flies like an arrow"(光阴似箭) 。

	object Timmer {
		def oncePerSecond(callback:() => Unit) {
			while(true) { callback();Thread sleep 1000 }
		}
		def timeFlies(){
			println("time flies like an arrow...")
		}
		def main(args: Array[String]){
			oncePerSecond(timeFlies)
		}
	}	

注意为了打印这个字符串，我们使用了预定义的方法`println`而非`System.out`中的那个。

#### 匿名函数

虽然这个程序非常易于理解，但依然可略微优化一下。
首先，注意函数`timeFlies`仅仅是为了稍后传入`oncePerSecond`函数而定义。对仅仅被使用一次的函数命名也许并非必要的，事实上，更好的是能够只在传入`oncePerSecond`时构造这个函数。在Scala中使用*匿名函数*可以做到，准确来讲：没有名字的函数。我们的计时器程序的修订版本采用匿名函数代替*timeFlies*，如下：

    object TimerAnonymous {
      def oncePerSecond(callback: () => Unit) {
        while (true) { callback(); Thread sleep 1000 }
      }
      def main(args: Array[String]) {
        oncePerSecond(() =>
          println("time flies like an arrow..."))
      }
    }

该例中匿名函数是通过右箭头`=>`声明的，将函数的参数列表与主体分离。在这个例子中，由箭头左侧那对空的圆括号可见，参数列表为空。函数的主体与上述`timeFlies`相同。

## 类

如我们上述所见，Scala是一个面向对象语言，同样它有类的概念。（为了完整性，应该注意到有些面向对象语言没有类的概念，但Scala不是其中之一）
Scala中的类采用近似Java语法的方式声明。一个重要的不同在于Scala中的类允许有参数，以下面这个复数的定义为例。

    class Complex(real: Double, imaginary: Double) {
      def re() = real
      def im() = imaginary
    }

这个复数类有两个参数，即复数的实数和虚数部分。这些参数必须在创建`Complex`类的实例时传递，比如：`new Complex(1.5,2.3)`。这个类包含两个方法，名为`re`和`im`，提供对这两部分的访问。

应该注意到这两个方法的返回类型没有显式给出。编译器会自动推测，它会看这些方法的右侧并推测出都返回一个`Doube`类型的值。

编译器并不是总能够像这样推测出类型，而且不幸的是也没有简单的规则可以准确的知道什么时候能，什么时候不能。事实上，这通常并不是问题，因为当不能推测出没有显式指定的类型时，编译器会发出警告。作为一个简单的规则，Scala的初学者应该尝试省略似乎易于从上下文中推断出来的类型声明，并且看是否编译器认可。一段时间后，这个程序员应该会对何时省略类型何时显式指定类型有一个好的体会。

### 无参方法

方法`re`和`im`存在一个小问题是，为了调用他们，必须将一对空的圆括号紧跟在他们名字后面，如下面这个例子：

    object ComplexNumbers {
      def main(args: Array[String]) {
        val c = new Complex(1.2, 3.4)
        println("imaginary part: " + c.im())
      }
    }

如果能够像他们是字段一样，访问实数和虚数部分，而无需加上这对空的圆括号将会更好。这在Scala中完全可行的，只需简单地将它们定义为*无参数*方法即可。这类方法不同于有零个参数的方法，他们名字后面不需要圆括号，无论是定义还是使用。我们的`Complex`类可以像下面这样重写：

    class Complex(real: Double, imaginary: Double) {
      def re = real
      def im = imaginary
    }

### 继承和重载

Scala中所有的类都继承至一个父类。当没有指定父类时，如上一节的`Complex`例子，隐式默认使用`scala.AnyRef`。

Scala中可以重载继承至父类的方法。然而强制需要使用`override`修饰符显式指定一个方法重载另一个，为了避免意外重载。例如，我们的`Complex`类可以通过重定义继承至`Object`的`toString`方法来扩展。

    class Complex(real: Double, imaginary: Double) {
      def re = real
      def im = imaginary
      override def toString() =
        "" + re + (if (im < 0) "" else "+") + im + "i"
    }

## 实例类和模式匹配

有一种经常在程序中出现的数据结构是树。例如，解析器和编译器经常在程序内部表示树；XML文档是树；而且很多类型的容器是基于树，如红黑树。

我们现在将通过一个计算器的小程序来检测在Scala中这些树如何表示和操作。这个程序的目的是操作由和，整数常数和变量组成的非常小的代数表达式。这类表达式的两个例子是：`1+2`和`(x+x)+(7+y)`。

首先，我们需要决定这些表达式的表示方法。最自然的便是树，节点代表操作（这里是指加法）而叶子代表值（这里是指常数和变量）。

Java中，这样一个树会用一个树的抽象父类，和节点或者叶子各自一个具体的子类来表示。在函数式语言中，则会用一个代数数据类型来达到相同的目的。Scala提供*实例类*的概念，某种程度上介于两者之间。以下便是我们的例子中如何利用他们来定义树的类型：

    abstract class Tree
    case class Sum(l: Tree, r: Tree) extends Tree
    case class Var(n: String) extends Tree
    case class Const(v: Int) extends Tree

这些类`Sum`，`Var`和`Const`被声明为实例类，意味着他们与标准类存在着许多方面的区别：

- 创建这些类的实例不需要强制使用`new`关键字（即，可以写作`Const(5)`，而非`new Const(5)`），
- 构造器参数的getter函数自动定义（即，可以通过`c.v`获取`Const`类的某个实例`c`的构造器参数`v`的值），
- 方法`equals`和`hasCode`默认提供定义，作用于实例的*结构*而非他们本身。
- 方法`toString`默认提供定义，并且以`源格式`打印其值（如，表达式`x+1`的树结构可打印为`Sum(Var(x),Const(1))`）
- 这些类的实例能通过*模式匹配(pattern-matching)*分解，正如后面将看到的.

至此我们已经定义了表示我们的代数表达式的数据类型，我们能够开始定义操作来控制他们。我们将从一个在某`环境(environment)`下计算一个表达式的函数开始。这个环境的目的是指定变量的值。例如，表达式`x+1`在一个将`5`和`x`关联，写作`{ x -> 5 }`，的环境下结果为`6`。

因此我们必须找到一个方式表示环境。我们当然可以使用一些关联的数据结构，比如散列表（hash table）。但是我们也能直接的使用函数！一个环境真的仅仅只不过是一个函数而已，它将一个值与一个（变量）名称关联。上面提到的环境`{ x -> 5 }`在Scala 中可以简单的写成：

    { case "x" => 5 }


这个语句定义了一个函数，当传入字符串`"x"`作为参数时，它返回整数`5`，否则失败并抛出一个异常。

在写这个计算函数之前，让我们给这个环境的类型命个名。当然我们总能够使用`String => Int`作为环境的类型，但是如果我们为这个类型引入一个名称，程序将得以简化，后续修改也变得更加容易。Scala中可通过以下语句实现：

    type Environment = String => Int

从此以后，这个`Environment`类型可用作从`String`到`Int`的函数类型的一个别名。

我们现在可以给出这个计算函数的定义了。
从概念上来讲，非常简单：两个表达式的和的值就是两个表达式的值的和；一个变量的值直接从环境获得；一个常数的值就是常数本身。在Scala中表达这些并不更难：

    def eval(t: Tree, env: Environment): Int = t match {
      case Sum(l, r) => eval(l, env) + eval(r, env)
      case Var(n)    => env(n)
      case Const(v)  => v
    }

这个计算函数通过在树`t`上执行*模式匹配（pattern matching）*来完成工作。直观地来讲，以上定义应该相当清楚：

1. 首先，检查这个树`t`是否是一个`Sum`，如果是，则将左边子树绑定至一个新的名为`l`的变量而右边子树至一个名为`r`的变量，然后利用箭头后的表达式的计算来处理；这个表达式能够（并且确实）使用了箭头左侧的模式所约定的变量，即，`l`和`r`，
2. 如果第一次检查不成功，也就是，如果树不是一个`Sum`，将继续检查`t`是否是一个`Var`；如果是，则将`Var`节点中的名称绑定至一个变量`n`，然后采用右边表达式处理，
3. 如果到第二次检查也失败了，也就是，如果`t`不是一个`Sum`也不是一个`Var`，将检查是否是一个`Const`，如果是，则将`Const`节点中的值绑定至一个变量`v`并利用右边处理，
4. 最后，如果所有检查失败，将抛出一个异常，标志着这个模式匹配表达式失败；这里仅可能在更多`Tree`的子类被声明的情况下。	

我们看到模式匹配的基本思想是企图在一系列的模式中匹配一个值，并且只要某一个模式匹配上，便提取并命名这个值的各个部分，然后最终执行某些代码，典型的代码是使用这些被命名的部分。

经验丰富的面向对象程序员也许想知道为何我们不定义`eval`作为`Tree`类及其子类的一个*方法（method）*。事实上，我们也可以这么做，因为Scala允许在实例类中定义方法，就像普通类一样。决定使用模式匹配还是方法因此只是一个喜好的问题，但是在扩展性上具有重要涵义：

- 当使用方法时，像这样增加一个新类型的节点很容易，只需要为之定义一个`Tree`的子类；否则，增加一个新的操作来操控这个树会非常繁琐，因为需要修改`Tree`的所有子类，
- 当使用模式匹配时，情况便逆转了：增加一个新类型的节点需要修改树中所有的执行模式匹配的函数，以将新的节点考虑进来；否则，增加一个新的操作很容易，只需要定义一个独立的函数。

为了进一步探讨模式匹配，让我们定义另一个代数表达式的操作：符号求导（symbolic derivation）。读者可能记得这个操作的下述规则：

1. 和的导数是导数的和
2. 某个变量`v`的导数在`v`是与求导过程相关的变量时为1，否则为0
3. 常数的导数为0.

这些规则几乎可以逐字翻译为Scala代码，得到的定义如下：

    def derive(t: Tree, v: String): Tree = t match {
      case Sum(l, r) => Sum(derive(l, v), derive(r, v))
      case Var(n) if (v == n) => Const(1)
      case _ => Const(0)
    }

这个函数介绍了模式匹配的两个新的概念。首先，变量的`case`表达式有一层*保护（guard）*，即`if`关键字之后的那个表达式。这层保护可阻止成功地模式匹配，除非这个表达式为真。我们这里是用来确保只有被求导的变量名与派生变量`v`相同的情况下，才返回常数`1`。这里用到的第二个模式匹配的新特性是*通配符(wildcard)*，写作`_`，这个模式可以匹配任何值，不需要指定名称。

虽然我们还没有探索完模式匹配的所有功能，但是为了控制篇幅，我们就此浅尝则止。我们依然想了解一下以上两个函数在实例中表现如何。为了这个目的，让我们写一个简单的`main`函数，根据表达式`(x+x)+(7+y)`执行这几步操作：首先计算它在`{ x -> 5, y -> 7 }`的环境下的值，然后分别计算对`x`和`y`的导数。

    def main(args: Array[String]) {
      val exp: Tree = Sum(Sum(Var("x"),Var("x")),Sum(Const(7),Var("y")))
      val env: Environment = { case "x" => 5 case "y" => 7 }
      println("Expression: " + exp)
      println("Evaluation with x=5, y=7: " + eval(exp, env))
      println("Derivative relative to x:\n " + derive(exp, "x"))
      println("Derivative relative to y:\n " + derive(exp, "y"))
    }

执行这个程序，我们得到这些期望的输出：

    Expression: Sum(Sum(Var(x),Var(x)),Sum(Const(7),Var(y)))
    Evaluation with x=5, y=7: 24
    Derivative relative to x:
     Sum(Sum(Const(1),Const(1)),Sum(Const(0),Const(0)))
    Derivative relative to y:
     Sum(Sum(Const(0),Const(0)),Sum(Const(0),Const(1)))

通过测试这个输出，我们看到导数结果应该在呈现给用户之前简化一下。
使用模式匹配定义一个基本的简化函数是个有趣的（但是极其微妙的）的问题，
留给读者作为练习。

## 特性

除了从父类继承代码，Scala类也能够从一个或者多个*特性（Traits）*

也许对于Java程序员而言，理解*特性*是什么最简单的方式是将它们看作也能包含代码的接口。
Scala中，当一个类继承一个特性时，它实现这个特新的接口，同时继承这个特新包含的所有代码。

为了展示特性的有用之处，我们看一个经典的例子：有序对象。能够在给定类的对象之间进行比较是通常是很有用的，比如对他们进行排序。Java中，可比较的对象继承接口`Comparable`。Scala中，我们能够比Java中做得稍微好点，将等价的`Comparable`定义为特性，称为`Ord`。

比较对象的时候，六个不同的谓语是可用的：小于，小于或等于，等于，不等于，大于或等于，以及大于。然而，将它们全部定义一遍属于下策，特别是这六个中的四个可以用剩下的两个来表示。也就是给出等于和小于（比如），其他的都可以表示。Scala中，所有这些观察结果均可以通过以下trait的声明涵盖：

    trait Ord {
      def < (that: Any): Boolean
      def <=(that: Any): Boolean =  (this < that) || (this == that)
      def > (that: Any): Boolean = !(this <= that)
      def >=(that: Any): Boolean = !(this < that)
    }	

抽象来讲，这个定义创建了一个叫`Ord`的新类型，担任与Java的`Comparable`相同的角色，同时根据第四个默认定义了其他三个谓语。等于和不等于的谓语这里并没出现，因为他们默认包含在所有对象中。

上面用到的类型`Any`是Scala中所有其他类型的父类型。可看作Java的`Object`类型更一般化的版本，因为它也是基础类型比如`Int`，`Float`等的父类型。

为了使得一个类的对象可比的，定义检测等于和不等于的谓语，然后和上述`Ord`类混合就可以充分满足。作为一个例子，我们定义一个`Date`类表示格列高利历（阳历）。这样的日期由日，月和年组成，我们都用整数表示。因此我们如下定义这个`Date`类：

    class Date(y: Int, m: Int, d: Int) extends Ord {
      def year = y
      def month = m
      def day = d
      override def toString(): String = year + "-" + month + "-" + day

这里重要部分是类名和参数之后`extends Ord`的声明，它声明`Date`类继承至`Ord`特性。

接下来，我们重新定义继承至`Object`的`equals`方法，以便可以通过比较各个字段来正确地比较日期。`equals`的默认实现是不可用的，因为Java中它比较对象本省。我们的定义是：

    override def equals(that: Any): Boolean =
      that.isInstanceOf[Date] && {
        val o = that.asInstanceOf[Date]
        o.day == day && o.month == month && o.year == year
      }

这个方法利用了预定义的`isInstanceOf`和`asInstanceOf`方法。第一个，`isInstanceOf`，对应Java的`instanceOf`操作，并在当且仅当它所应用的对象是给出类型的实例才返回真。第二个，`asInstanceOf`，对应Java的转换操作：如果对象是给出类型的实例，则当作这个类型看待，否则抛出`ClassCastException`。

最后，要定义的最后一个方法是检测小于的谓语，如下。用到了另一个预定义的方法`error`，它抛出给定错误消息的异常。

    def <(that: Any): Boolean = {
      if (!that.isInstanceOf[Date])
        error("cannot compare " + that + " and a Date")

      val o = that.asInstanceOf[Date]
      (year < o.year) ||
      (year == o.year && (month < o.month ||
                         (month == o.month && day < o.day)))
    }

这也完成了对`Date`类的定义。这个类的实例可被视为日期或者可比较对象。此外，它们定义了上面提到的离歌比较谓语：`equals`和`<`，因为他们直接出现在`Date`类和其他的的定义中，因为他们都继承至`Ord`特性。

当然，特性在其他场景中比这里展示的更加有用，但是深入讨论它们的应用超出了本文的范围。


## 泛型

本指南要探讨的最后一个Scala的特性是*范型(Genericity)*。Java程序员应该能最为清楚他们的语言中因缺少范型所造成的问题，直到Java 1.5这一缺陷才被完善。

范型是指能够代码中允许以类型作为参数的能力。例如，一个程序员写一个链表的库，会面临一个难题，他需要决定赋予这个链表的元素哪一种类型。因为这个链表打算用于许多不同的上下文中，不可能确定元素必须属于的类型，假设`Int`。这将是完全随意的的而且过于限制的。

Java程序员往往借助于`Object`，它是所有对象的父类型。然而这种解决方案远不理想，因为对于基本类型（`int`，`long`，`float`等）是无效的，而且意味着程序员必须插入大量的动态类型转换。

Scala能够通过定义范型类（和方法）来解决这个问题。让我们用一个尽可能简单的容器类的例子来测试：一个引用，可以为空或者执行某种类型的一个对象。

    class Reference[T] {
      private var contents: T = _
      def set(value: T) { contents = value }
      def get: T = contents
    }

这个`Reference`类以一个类型为参数，称之为`T`,即元素的类型。这个类型在这个类的主体中用作变量`content`的类型，`set`方法的参数以及`get`函数的返回类型。

上面的代码实例引进了Scala的变量，不需要进一步解释了。然而有趣的是看到赋予那个变量的初始值是`_`，表示一个默认值。这个默认值对于数值类型为0，对于`Boolean`类型为`false`，对于`Unit`为`()`,而对于所有对象类型表示`null`。

为了使用这个`Reference`类，需要指定这个类型参数`T`使用哪个类型，也就是单元中容纳元素的类型。例如，为了创建和使用一个容纳一个整数的单元，我们可以像下面这样写：

    object IntegerReference {
      def main(args: Array[String]) {
        val cell = new Reference[Int]
        cell.set(13)
        println("Reference contains the half of " + (cell.get * 2))
      }
    }

正如这个例子中所看到的，`get`方法返回的值用作整数前，不需要转换。同样在这个特别单元中也不可能存储除了整数外的任何东西，因为它已经被声明容纳一个整数。

## 总结

本文档提供了对Scala语言的一个快速的概述，并介绍了一些基本示例。感兴趣的读者可以继续，对于实例，请阅读文档 *Scala实例（Scala By Example）*，包含更多更高级的例子，如有需要，可参考 *Scala语言规范（Scala Language Specification）* 。
