---
layout: tutorial
title: Abstract Types
languages:[en,es,"zh-cn"]

disqus: true

tutorial: scala-tour
num: 2
outof: 35
---

Scala中，类可以按值（构造器参数）和按类型（如果类是[范型](generic-classes.html)）传递参数。为了整齐的缘故，不仅仅可以把值作为对象成员，与值一起的类型也是对象的成员。此外，两种形式的成员都可以被具体化和抽象化。
这里有一个例子，同时将一个后面值的定义和一个抽象类型的定义作为`Buffer`[类](traits.html)的成员。
 
    trait Buffer {
      type T
      val element: T
    }
 

*抽象类型*是指定义不是明确已知的类型。在上述例子中，我们只能知道`Buffer`类的每个对象都有一个类型成员`T`，但是`Buffer`类的定义不需要透露成员类型`T`对应的具体类型。就像值的定义一样，我们能够在子类中重载类型定义。这允许我们通过绑定类型范围（即描述抽象类型可能的具体实例）透露关于抽象类型的更多信息

在下面的程序中，我们派生出一个`SeqBuffer`类，通过声明对于新的抽象类型`U`类型`T`必须是`Seq[U]`的子类型，允许我们只能在缓存中存储序列：
 
    abstract class SeqBuffer extends Buffer {
      type U
      type T <: Seq[U]
      def length = element.length
    }
 
拥有抽象类型成员的特性或者[类](classes.html)通常被用在与匿名类实例的组合中。为了说明这一点，我们现在看一个处理指向整数列表的序列缓存的程序，
 
    abstract class IntSeqBuffer extends SeqBuffer {
      type U = Int
    }
    
    object AbstractTypeTest1 extends App {
      def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
        new IntSeqBuffer {
             type T = List[U]
             val element = List(elem1, elem2)
           }
      val buf = newIntSeqBuf(7, 8)
      println("length = " + buf.length)
      println("content = " + buf.element)
    }

方法`newIntSeqBuf`的返回类型引用一个特殊的`Buffer`，其中类型`U`现在等价于`Int`。我们在方法`newIntSeqBuf`的主体中匿名类实例里面有一个类似的类型别名。这里我们创建`IntSeqBuffer`的一个实例，其中类型`T`引用`List[Int]`。

请注意经常可以将抽象类型成员转化为类的类型参数，反之亦然。这里是上述代码的一个只使用类型参数的版本：
 
    abstract class Buffer[+T] {
      val element: T
    }
    abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
      def length = element.length
    }
    object AbstractTypeTest2 extends App {
      def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
        new SeqBuffer[Int, List[Int]] {
          val element = List(e1, e2)
        }
      val buf = newIntSeqBuf(7, 8)
      println("length = " + buf.length)
      println("content = " + buf.element)
    }

注意我们这里必须使用[型变注释](variances.html)；否则我们不能隐藏方法`newIntSeqBuf`的返回对象的具体序列实现类型。此外，也有不能将抽象类型替换为类型参数的情况。

<a href="http://haoch.me" alt="译：陈浩"/>