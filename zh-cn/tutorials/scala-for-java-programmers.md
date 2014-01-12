---
layout: overview
title: A Scala Tutorial for Java Programmers
overview: scala-for-java-programmers

disqus: true
multilingual-overview: true
languages: [es, ko, de, zh-cn]
---

By Michel Schinz and Philipp Haller

## Introduction

This document gives a quick introduction to the Scala language and
compiler. It is intended for people who already have some programming
experience and want an overview of what they can do with Scala. A
basic knowledge of object-oriented programming, especially in Java, is
assumed.

作者：Michel Schinz and Philipp Haller 译者：[陈浩](http://haoch.me)

## 介绍
本文档是Scala语言及其编译器的一个快速介绍。其目标读者是已经有一定编程经验并且希望大概知道Scala可用来做什么。本文默认读者已具备面向对象尤其是Java的基础知识。

## A First Example

As a first example, we will use the standard *Hello world* program. It
is not very fascinating but makes it easy to demonstrate the use of
the Scala tools without knowing too much about the language. Here is
how it looks:

    object HelloWorld {
      def main(args: Array[String]) {
        println("Hello, world!")
      }
    }

The structure of this program should be familiar to Java programmers:
it consists of one method called `main` which takes the command
line arguments, an array of strings, as parameter; the body of this
method consists of a single call to the predefined method `println`
with the friendly greeting as argument. The `main` method does not
return a value (it is a procedure method). Therefore, it is not necessary
to declare a return type.

What is less familiar to Java programmers is the `object`
declaration containing the `main` method. Such a declaration
introduces what is commonly known as a *singleton object*, that
is a class with a single instance. The declaration above thus declares
both a class called `HelloWorld` and an instance of that class,
also called `HelloWorld`. This instance is created on demand,
the first time it is used.

The astute reader might have noticed that the `main` method is
not declared as `static` here. This is because static members
(methods or fields) do not exist in Scala. Rather than defining static
members, the Scala programmer declares these members in singleton
objects.

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

### Compiling the example

To compile the example, we use `scalac`, the Scala compiler. `scalac`
works like most compilers: it takes a source file as argument, maybe
some options, and produces one or several object files. The object
files it produces are standard Java class files.

If we save the above program in a file called
`HelloWorld.scala`, we can compile it by issuing the following
command (the greater-than sign `>` represents the shell prompt
and should not be typed):

    > scalac HelloWorld.scala

This will generate a few class files in the current directory. One of
them will be called `HelloWorld.class`, and contains a class
which can be directly executed using the `scala` command, as the
following section shows.

### 编译示例 ###
我们利用`scalac`，即Scala编译器，来编译这个例子。`scalac`工作原理与大多数编译器类似：它以一个源文件作为参数，可能带有一些选项，然后生成一个活着多个对象文件。这些生成的对象文件是标准的Java class文件。

如果我们将上述程序保存至一个叫`HelloWorld.scala`的文件中，我们便能通过输入以下命令编译它（这个较大的符号`>`表示命令行提示，无需输入）：

    > scalac HelloWorld.scala

当前目录中会生成一些class文件。其中有一个名为`HelloWorld.class`，它包含了能够直接使用`scala`命令执行的类，正如下一段中将讲述。

### Running the example

Once compiled, a Scala program can be run using the `scala` command.
Its usage is very similar to the `java` command used to run Java
programs, and accepts the same options. The above example can be
executed using the following command, which produces the expected
output:

    > scala -classpath . HelloWorld

    Hello, world!

### 运行示例

一旦编译，Scala程序就可以通过`scala`命令运行。
它的用法与`java`命令运行java程序类似，并接受相同的选项。以上示例能够利用以下命令执行，并产生预期输出：

    > scala -classpath . HelloWorld

    Hello, world!

## Interaction with Java

One of Scala's strengths is that it makes it very easy to interact
with Java code. All classes from the `java.lang` package are
imported by default, while others need to be imported explicitly.

Let's look at an example that demonstrates this.  We want to obtain
and format the current date according to the conventions used in a
specific country, say France. (Other regions such as the
French-speaking part of Switzerland use the same conventions.)

Java's class libraries define powerful utility classes, such as
`Date` and `DateFormat`. Since Scala interoperates
seemlessly with Java, there is no need to implement equivalent
classes in the Scala class library--we can simply import the classes
of the corresponding Java packages:

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

Scala's import statement looks very similar to Java's equivalent,
however, it is more powerful. Multiple classes can be imported from
the same package by enclosing them in curly braces as on the first
line. Another difference is that when importing all the names of a
package or class, one uses the underscore character (`_`) instead
of the asterisk (`*`). That's because the asterisk is a valid
Scala identifier (e.g. method name), as we will see later.

The import statement on the third line therefore imports all members
of the `DateFormat` class. This makes the static method
`getDateInstance` and the static field `LONG` directly
visible.

Inside the `main` method we first create an instance of Java's
`Date` class which by default contains the current date. Next, we
define a date format using the static `getDateInstance` method
that we imported previously. Finally, we print the current date
formatted according to the localized `DateFormat` instance. This
last line shows an interesting property of Scala's syntax. Methods
taking one argument can be used with an infix syntax. That is, the
expression

    df format now

is just another, slightly less verbose way of writing the expression

    df.format(now)

This might seem like a minor syntactic detail, but it has important
consequences, one of which will be explored in the next section.

To conclude this section about integration with Java, it should be
noted that it is also possible to inherit from Java classes and
implement Java interfaces directly in Scala.

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

## Everything is an Object

Scala is a pure object-oriented language in the sense that
*everything* is an object, including numbers or functions. It
differs from Java in that respect, since Java distinguishes
primitive types (such as `boolean` and `int`) from reference
types, and does not enable one to manipulate functions as values.

## 一切都是对象
Scala是一个纯粹的面向对象语言，因为一起都是对象，包括数字或者函数。它和Java有所不同，Java区分原始类型（例如`boolean`和`int`）和引用类型，而且不能够将函数当为值来操作。

### Numbers are objects

Since numbers are objects, they also have methods. And in fact, an
arithmetic expression like the following:

    1 + 2 * 3 / x

consists exclusively of method calls, because it is equivalent to the
following expression, as we saw in the previous section:

    (1).+(((2).*(3))./(x))

This also means that `+`, `*`, etc. are valid identifiers
in Scala.

The parentheses around the numbers in the second version are necessary
because Scala's lexer uses a longest match rule for tokens.
Therefore, it would break the following expression:

    1.+(2)

into the tokens `1.`, `+`, and `2`.  The reason that
this tokenization is chosen is because `1.` is a longer valid
match than `1`.  The token `1.` is interpreted as the
literal `1.0`, making it a `Double` rather than an
`Int`.  Writing the expression as:

    (1).+(2)

prevents `1` from being interpreted as a `Double`.

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

### Functions are objects

Perhaps more surprising for the Java programmer, functions are also
objects in Scala. It is therefore possible to pass functions as
arguments, to store them in variables, and to return them from other
functions. This ability to manipulate functions as values is one of
the cornerstone of a very interesting programming paradigm called
*functional programming*.

As a very simple example of why it can be useful to use functions as
values, let's consider a timer function whose aim is to perform some
action every second. How do we pass it the action to perform? Quite
logically, as a function. This very simple kind of function passing
should be familiar to many programmers: it is often used in
user-interface code, to register call-back functions which get called
when some event occurs.

In the following program, the timer function is called
`oncePerSecond`, and it gets a call-back function as argument.
The type of this function is written `() => Unit` and is the type
of all functions which take no arguments and return nothing (the type
`Unit` is similar to `void` in C/C++). The main function of
this program simply calls this timer function with a call-back which
prints a sentence on the terminal. In other words, this program
endlessly prints the sentence "time flies like an arrow" every
second.

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

Note that in order to print the string, we used the predefined method
`println` instead of using the one from `System.out`.

### 函数是对象

对于Java程序员，更意外的是Scala中函数也是对象。以至于将函数作为参数传递，以变量存储，以及从其他其他函数中返回成为了可能。这种将函数当作值操作的能力是一个非常有趣的被称之为`函数式编程`的编程范式的基础之一。

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

#### Anonymous functions

While this program is easy to understand, it can be refined a bit.
First of all, notice that the function `timeFlies` is only
defined in order to be passed later to the `oncePerSecond`
function. Having to name that function, which is only used once, might
seem unnecessary, and it would in fact be nice to be able to construct
this function just as it is passed to `oncePerSecond`. This is
possible in Scala using *anonymous functions*, which are exactly
that: functions without a name. The revised version of our timer
program using an anonymous function instead of *timeFlies* looks
like that:

    object TimerAnonymous {
      def oncePerSecond(callback: () => Unit) {
        while (true) { callback(); Thread sleep 1000 }
      }
      def main(args: Array[String]) {
        oncePerSecond(() =>
          println("time flies like an arrow..."))
      }
    }

The presence of an anonymous function in this example is revealed by
the right arrow `=>` which separates the function's argument
list from its body. In this example, the argument list is empty, as
witnessed by the empty pair of parenthesis on the left of the arrow.
The body of the function is the same as the one of `timeFlies`
above.

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

## Classes

As we have seen above, Scala is an object-oriented language, and as
such it has a concept of class. (For the sake of completeness,
  it should be noted that some object-oriented languages do not have
  the concept of class, but Scala is not one of them.)
Classes in Scala are declared using a syntax which is close to
Java's syntax. One important difference is that classes in Scala can
have parameters. This is illustrated in the following definition of
complex numbers.

    class Complex(real: Double, imaginary: Double) {
      def re() = real
      def im() = imaginary
    }

This complex class takes two arguments, which are the real and
imaginary part of the complex. These arguments must be passed when
creating an instance of class `Complex`, as follows: `new
  Complex(1.5, 2.3)`. The class contains two methods, called `re`
and `im`, which give access to these two parts.

It should be noted that the return type of these two methods is not
given explicitly. It will be inferred automatically by the compiler,
which looks at the right-hand side of these methods and deduces that
both return a value of type `Double`.

The compiler is not always able to infer types like it does here, and
there is unfortunately no simple rule to know exactly when it will be,
and when not. In practice, this is usually not a problem since the
compiler complains when it is not able to infer a type which was not
given explicitly. As a simple rule, beginner Scala programmers should
try to omit type declarations which seem to be easy to deduce from the
context, and see if the compiler agrees. After some time, the
programmer should get a good feeling about when to omit types, and
when to specify them explicitly.

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

### Methods without arguments

A small problem of the methods `re` and `im` is that, in
order to call them, one has to put an empty pair of parenthesis after
their name, as the following example shows:

    object ComplexNumbers {
      def main(args: Array[String]) {
        val c = new Complex(1.2, 3.4)
        println("imaginary part: " + c.im())
      }
    }

It would be nicer to be able to access the real and imaginary parts
like if they were fields, without putting the empty pair of
parenthesis. This is perfectly doable in Scala, simply by defining
them as methods *without arguments*. Such methods differ from
methods with zero arguments in that they don't have parenthesis after
their name, neither in their definition nor in their use. Our
`Complex` class can be rewritten as follows:

    class Complex(real: Double, imaginary: Double) {
      def re = real
      def im = imaginary
    }

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

### Inheritance and overriding

All classes in Scala inherit from a super-class. When no super-class
is specified, as in the `Complex` example of previous section,
`scala.AnyRef` is implicitly used.

It is possible to override methods inherited from a super-class in
Scala. It is however mandatory to explicitly specify that a method
overrides another one using the `override` modifier, in order to
avoid accidental overriding. As an example, our `Complex` class
can be augmented with a redefinition of the `toString` method
inherited from `Object`.

    class Complex(real: Double, imaginary: Double) {
      def re = real
      def im = imaginary
      override def toString() =
        "" + re + (if (im < 0) "" else "+") + im + "i"
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

这个函数介绍了模式匹配的两个新的概念。首先，变量的`case`表达式有一个*防护（guard）*，紧随`if`关键字后的表达式。





## Case Classes and Pattern Matching

    def derive(t: Tree, v: String): Tree = t match {
      case Sum(l, r) => Sum(derive(l, v), derive(r, v))
      case Var(n) if (v == n) => Const(1)
      case _ => Const(0)
    }

This function introduces two new concepts related to pattern matching.
First of all, the `case` expression for variables has a
*guard*, an expression following the `if` keyword. This
guard prevents pattern matching from succeeding unless its expression
is true. Here it is used to make sure that we return the constant `1`
only if the name of the variable being derived is the same as the
derivation variable `v`. The second new feature of pattern
matching used here is the *wildcard*, written `_`, which is
a pattern matching any value, without giving it a name.

We did not explore the whole power of pattern matching yet, but we
will stop here in order to keep this document short. We still want to
see how the two functions above perform on a real example. For that
purpose, let's write a simple `main` function which performs
several operations on the expression `(x+x)+(7+y)`: it first computes
its value in the environment `{ x -> 5, y -> 7 }`, then
computes its derivative relative to `x` and then `y`.

    def main(args: Array[String]) {
      val exp: Tree = Sum(Sum(Var("x"),Var("x")),Sum(Const(7),Var("y")))
      val env: Environment = { case "x" => 5 case "y" => 7 }
      println("Expression: " + exp)
      println("Evaluation with x=5, y=7: " + eval(exp, env))
      println("Derivative relative to x:\n " + derive(exp, "x"))
      println("Derivative relative to y:\n " + derive(exp, "y"))
    }

Executing this program, we get the expected output:

    Expression: Sum(Sum(Var(x),Var(x)),Sum(Const(7),Var(y)))
    Evaluation with x=5, y=7: 24
    Derivative relative to x:
     Sum(Sum(Const(1),Const(1)),Sum(Const(0),Const(0)))
    Derivative relative to y:
     Sum(Sum(Const(0),Const(0)),Sum(Const(0),Const(1)))

By examining the output, we see that the result of the derivative
should be simplified before being presented to the user. Defining a
basic simplification function using pattern matching is an interesting
(but surprisingly tricky) problem, left as an exercise for the reader.

## Traits

Apart from inheriting code from a super-class, a Scala class can also
import code from one or several *traits*.

Maybe the easiest way for a Java programmer to understand what traits
are is to view them as interfaces which can also contain code. In
Scala, when a class inherits from a trait, it implements that trait's
interface, and inherits all the code contained in the trait.

To see the usefulness of traits, let's look at a classical example:
ordered objects. It is often useful to be able to compare objects of a
given class among themselves, for example to sort them. In Java,
objects which are comparable implement the `Comparable`
interface. In Scala, we can do a bit better than in Java by defining
our equivalent of `Comparable` as a trait, which we will call
`Ord`.

When comparing objects, six different predicates can be useful:
smaller, smaller or equal, equal, not equal, greater or equal, and
greater. However, defining all of them is fastidious, especially since
four out of these six can be expressed using the remaining two. That
is, given the equal and smaller predicates (for example), one can
express the other ones. In Scala, all these observations can be
nicely captured by the following trait declaration:

    trait Ord {
      def < (that: Any): Boolean
      def <=(that: Any): Boolean =  (this < that) || (this == that)
      def > (that: Any): Boolean = !(this <= that)
      def >=(that: Any): Boolean = !(this < that)
    }

This definition both creates a new type called `Ord`, which
plays the same role as Java's `Comparable` interface, and
default implementations of three predicates in terms of a fourth,
abstract one. The predicates for equality and inequality do not appear
here since they are by default present in all objects.

The type `Any` which is used above is the type which is a
super-type of all other types in Scala. It can be seen as a more
general version of Java's `Object` type, since it is also a
super-type of basic types like `Int`, `Float`, etc.

To make objects of a class comparable, it is therefore sufficient to
define the predicates which test equality and inferiority, and mix in
the `Ord` class above. As an example, let's define a
`Date` class representing dates in the Gregorian calendar. Such
dates are composed of a day, a month and a year, which we will all
represent as integers. We therefore start the definition of the
`Date` class as follows:

    class Date(y: Int, m: Int, d: Int) extends Ord {
      def year = y
      def month = m
      def day = d
      override def toString(): String = year + "-" + month + "-" + day

The important part here is the `extends Ord` declaration which
follows the class name and parameters. It declares that the
`Date` class inherits from the `Ord` trait.

Then, we redefine the `equals` method, inherited from
`Object`, so that it correctly compares dates by comparing their
individual fields. The default implementation of `equals` is not
usable, because as in Java it compares objects physically. We arrive
at the following definition:

    override def equals(that: Any): Boolean =
      that.isInstanceOf[Date] && {
        val o = that.asInstanceOf[Date]
        o.day == day && o.month == month && o.year == year
      }

This method makes use of the predefined methods `isInstanceOf`
and `asInstanceOf`. The first one, `isInstanceOf`,
corresponds to Java's `instanceof` operator, and returns true
if and only if the object on which it is applied is an instance of the
given type. The second one, `asInstanceOf`, corresponds to
Java's cast operator: if the object is an instance of the given type,
it is viewed as such, otherwise a `ClassCastException` is
thrown.

Finally, the last method to define is the predicate which tests for
inferiority, as follows. It makes use of another predefined method,
`error`, which throws an exception with the given error message.

    def <(that: Any): Boolean = {
      if (!that.isInstanceOf[Date])
        error("cannot compare " + that + " and a Date")

      val o = that.asInstanceOf[Date]
      (year < o.year) ||
      (year == o.year && (month < o.month ||
                         (month == o.month && day < o.day)))
    }

This completes the definition of the `Date` class. Instances of
this class can be seen either as dates or as comparable objects.
Moreover, they all define the six comparison predicates mentioned
above: `equals` and `<` because they appear directly in
the definition of the `Date` class, and the others because they
are inherited from the `Ord` trait.

Traits are useful in other situations than the one shown here, of
course, but discussing their applications in length is outside the
scope of this document.

## Genericity

The last characteristic of Scala we will explore in this tutorial is
genericity. Java programmers should be well aware of the problems
posed by the lack of genericity in their language, a shortcoming which
is addressed in Java 1.5.

Genericity is the ability to write code parametrized by types. For
example, a programmer writing a library for linked lists faces the
problem of deciding which type to give to the elements of the list.
Since this list is meant to be used in many different contexts, it is
not possible to decide that the type of the elements has to be, say,
`Int`. This would be completely arbitrary and overly
restrictive.

Java programmers resort to using `Object`, which is the
super-type of all objects. This solution is however far from being
ideal, since it doesn't work for basic types (`int`,
`long`, `float`, etc.) and it implies that a lot of
dynamic type casts have to be inserted by the programmer.

Scala makes it possible to define generic classes (and methods) to
solve this problem. Let us examine this with an example of the
simplest container class possible: a reference, which can either be
empty or point to an object of some type.

    class Reference[T] {
      private var contents: T = _
      def set(value: T) { contents = value }
      def get: T = contents
    }

The class `Reference` is parametrized by a type, called `T`,
which is the type of its element. This type is used in the body of the
class as the type of the `contents` variable, the argument of
the `set` method, and the return type of the `get` method.

The above code sample introduces variables in Scala, which should not
require further explanations. It is however interesting to see that
the initial value given to that variable is `_`, which represents
a default value. This default value is 0 for numeric types,
`false` for the `Boolean` type, `()` for the `Unit`
type and `null` for all object types.

To use this `Reference` class, one needs to specify which type to use
for the type parameter `T`, that is the type of the element
contained by the cell. For example, to create and use a cell holding
an integer, one could write the following:

    object IntegerReference {
      def main(args: Array[String]) {
        val cell = new Reference[Int]
        cell.set(13)
        println("Reference contains the half of " + (cell.get * 2))
      }
    }

As can be seen in that example, it is not necessary to cast the value
returned by the `get` method before using it as an integer. It
is also not possible to store anything but an integer in that
particular cell, since it was declared as holding an integer.

## Conclusion

This document gave a quick overview of the Scala language and
presented some basic examples. The interested reader can go on, for example, by
reading the document *Scala By Example*, which
contains much more advanced examples, and consult the *Scala
  Language Specification* when needed.
