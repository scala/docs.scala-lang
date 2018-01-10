---
layout: singlepage-overview
title: Value Classes and Universal Traits

partof: value-classes

language: zh-cn

discourse: false
---

**Mark Harrah 著**

## 引言

Value classes是在[SIP-15](http://docs.scala-lang.org/sips/pending/value-classes.html)中提出的一种通过继承AnyVal类来避免运行时对象分配的新机制。以下是一个最简的value class。

    class Wrapper(val underlying: Int) extends AnyVal

它仅有一个被用作运行时底层表示的公有val参数。在编译期，其类型为Wrapper，但在运行时，它被表示为一个Int。Value class可以带有def定义，但不能再定义额外的val、var，以及内嵌的trait、class或object：

    class Wrapper(val underlying: Int) extends AnyVal {
      def foo: Wrapper = new Wrapper(underlying * 19)
    }

Value class只能继承universal traits，但其自身不能再被继承。所谓universal trait就是继承自Any的、只有def成员，且不作任何初始化工作的trait。继承自某个universal trait的value class同时继承了该trait的方法，但是（调用这些方法）会带来一定的对象分配开销。例如：

    trait Printable extends Any {
      def print(): Unit = println(this)
    }
    class Wrapper(val underlying: Int) extends AnyVal with Printable

    val w = new Wrapper(3)
    w.print() // 这里实际上会生成一个Wrapper类的实例

本文后续篇幅将介绍相关用例和与对象分配时机相关的细节，并给出一些有关value class自身限制的具体实例。

## 扩展方法

关于value类的一个用例，是将它们和隐含类联合（[SIP-13](http://docs.scala-lang.org/sips/pending/implicit-classes.html)）以获得免分配扩展方法。使用隐含类可以提供便捷的语法来定义扩展方法，同时 value 类移除运行时开销。一个好的例子是在标准库里的RichInt类。RichInt 继承自Int类型并附带一些方法。由于它是一个 value类，使用RichInt 方法时不需要创建一个RichInt 的实例。

下面有关RichInt的代码片段示范了RichInt是如何继承Int来允许3.toHexString的表达式：

    implicit class RichInt(val self: Int) extends AnyVal {
      def toHexString: String = java.lang.Integer.toHexString(self)
    }

在运行时，表达式3.toHexString 被优化并等价于静态对象的方法调用 （RichInt$.MODULE$.extension$toHexString(3)），而不是创建一个新实例对象，再调用其方法。

## 正确性

关于value类的另一个用例是：不增加运行时开销的同时，获得数据类型的类型安全。例如，一个数据类型片断代表一个距离 ，如：

    class Meter(val value: Double) extends AnyVal {
      def +(m: Meter): Meter = new Meter(value + m.value)
    }

代码：对两个距离进行相加，例如：

    val x = new Meter(3.4)
    val y = new Meter(4.3)
    val z = x + y

实际上不会分配任何Meter实例，而是在运行时仅使用原始双精浮点数（double） 。

注意：在实践中，可以使用条件类（case）and/or 扩展方法来让语句更清晰。

## 必须进行分配的情况

由于JVM不支持value类，Scala 有时需要真正实例化value类。详细细节见[SIP-15]。

### 分配概要

value类在以下情况下，需要真正实例化：

1. value类作为另一种类型使用时。
2. value类被赋值给数组。
3. 执行运行时类型测试，例如模式匹配。

### 分配细节

无论何时，将value类作为另一种类型进行处理时（包括universal trait），此value类实例必须被实例化。例如，value类Meter ：

    trait Distance extends Any
    case class Meter(val value: Double) extends AnyVal with Distance

接收Distance类型值的方法需要一个正真的Meter实例。下面的例子中，Meter类真正被实例化。

    def add(a: Distance, b: Distance): Distance = ...
    add(Meter(3.4), Meter(4.3))

如果替换add方法的签名：

    def add(a: Meter, b: Meter): Meter = ...

那么就不必进行分配了。此规则的另一个例子是value类作为类型参数使用。例如：即使是调用identity方法，也必须创建真正的Meter实例。

    def identity[T](t: T): T = t
    identity(Meter(5.0))

必须进行分配的另一种情况是：将它赋值给数组。即使这个数组就是value类数组，例如：

    val m = Meter(5.0)
    val array = Array[Meter](m)

数组中包含了真正的Meter 实例，并不只是底层基本类型double。

最后是类型测试。例如，模式匹配中的处理以及asInstanceOf方法都要求一个真正的value类实例：

    case class P(val i: Int) extends AnyVal

    val p = new P(3)
    p match { // 在这里，新的P实例被创建
      case P(3) => println("Matched 3")
      case P(x) => println("Not 3")
    }

## 限制

目前Value类有一些限制，部分原因是JVM不提供value类概念的原生支持。value类的完整实现细节及其限制见[SIP-15]。

### 限制概要

一个value类 ...

1. ... 必须只有一个public的构造函数。并有且只有一个public的，类型不为value类的val参数。
2. ... 不能有特殊的类型参数.
3. ... 不能有嵌套或本地类、trait或对象。
4. ... 不能定义equals或hashCode方法。
5. ... 必须是一个顶级类，或静态访问对象的一个成员
6. ... 仅能有def为成员。尤其是，成员不能有惰性val、val或者var 。
7. ... 不能被其它类继承。

### 限制示例

本章节列出了许多限制下具体影响， 而在“必要分配”章节已提及的部分则不再敖述。

构造函数不允许有多个参数：

    class Complex(val real: Double, val imag: Double) extends AnyVal

则Scala编译器将生成以下的错误信息：

    Complex.scala:1: error: value class needs to have exactly one public val parameter
    （Complex.scala:1: 错误：value类只能有一个public的val参数。）
    （译者注：鉴于实际中编译器输出的可能是英文信息，在此提供双语。）
    class Complex(val real: Double, val imag: Double) extends AnyVal
          ^

由于构造函数参数必须是val，而不能是一个按名（by-name）参数：

    NoByName.scala:1: error: `val' parameters may not be call-by-name
    （NoByName.scala:1: 错误: `val' 不能为 call-by-name）
    class NoByName(val x: => Int) extends AnyVal
                          ^

Scala不允许惰性val作为构造函数参数， 所以value类也不允许。并且不允许多个构造函数。

    class Secondary(val x: Int) extends AnyVal {
      def this(y: Double) = this(y.toInt)
    }

    Secondary.scala:2: error: value class may not have secondary constructors
    （Secondary.scala:2: 错误：value类不能有第二个构造函数。）
      def this(y: Double) = this(y.toInt)
          ^

value class不能将惰性val或val作为成员，也不能有嵌套类、trait或对象。

    class NoLazyMember(val evaluate: () => Double) extends AnyVal {
      val member: Int = 3
      lazy val x: Double = evaluate()
      object NestedObject
      class NestedClass
    }

    Invalid.scala:2: error: this statement is not allowed in value class: private[this] val member: Int = 3
    （Invalid.scala:2: 错误: value类中不允许此表达式：private [this] val member: Int = 3）
      val member: Int = 3
          ^
    Invalid.scala:3: error: this statement is not allowed in value class: lazy private[this] var x: Double = NoLazyMember.this.evaluate.apply()
    （Invalid.scala:3: 错误：value类中不允许此表达式： lazy private[this] var x: Double = NoLazyMember.this.evaluate.apply()）
      lazy val x: Double = evaluate()
               ^
    Invalid.scala:4: error: value class may not have nested module definitions
    （Invalid.scala:4: 错误: value类中不能定义嵌套模块）
      object NestedObject
             ^
    Invalid.scala:5: error: value class may not have nested class definitions
    （Invalid.scala:5: 错误：value类中不能定义嵌套类）
      class NestedClass
            ^

注意：value类中也不允许出现本地类、trait或对象，如下：

    class NoLocalTemplates(val x: Int) extends AnyVal {
      def aMethod = {
        class Local
        ...
      }
    }

在目前value类实现的限制下，value类不能嵌套：

    class Outer(val inner: Inner) extends AnyVal
    class Inner(val value: Int) extends AnyVal

    Nested.scala:1: error: value class may not wrap another user-defined value class
    （Nested.scala:1:错误：vlaue类不能包含另一个用户定义的value类）
    class Outer(val inner: Inner) extends AnyVal
                    ^

此外，结构类型不能使用value类作为方法的参数或返回值类型。

    class Value(val x: Int) extends AnyVal
    object Usage {
      def anyValue(v: { def value: Value }): Value =
        v.value
    }

    Struct.scala:3: error: Result type in structural refinement may not refer to a user-defined value class
    （Struct.scala:3: 错误: 结构细化中的结果类型不适用于用户定义的value类）
      def anyValue(v: { def value: Value }): Value =
                                   ^

value类不能继承non-universal trait，并且其本身不能被继承：

    trait NotUniversal
    class Value(val x: Int) extends AnyVal with notUniversal
    class Extend(x: Int) extends Value(x)

    Extend.scala:2: error: illegal inheritance; superclass AnyVal
     is not a subclass of the superclass Object
     of the mixin trait NotUniversal
    （Extend.scala:2: 错误：非法继承：父类AnyVal不是一个父类对象（混入trait NotUniversal）的子类）
    class Value(val x: Int) extends AnyVal with NotUniversal
                                                ^
    Extend.scala:3: error: illegal inheritance from final class Value
    （Extend.scala:3: 错误: 从Value类（final类）非法继承）
    class Extend(x: Int) extends Value(x)
                                 ^

第二条错误信息显示：虽然value类没有显式地用final关键字修饰，但依然认为value类是final类。

另一个限制是：一个类仅支持单个参数的话，则value类必须是顶级类，或静态访问对象的成员。这是由于嵌套value类需要第二个参数来引用封闭类。所以不允许下述代码：

    class Outer {
      class Inner(val x: Int) extends AnyVal
    }

    Outer.scala:2: error: value class may not be a member of another class
    （Outer.scala:2: 错误：value类不能作为其它类的成员）
    class Inner(val x: Int) extends AnyVal
          ^

但允许下述代码，因为封闭对象是顶级类：

    object Outer {
      class Inner(val x: Int) extends AnyVal
    }
