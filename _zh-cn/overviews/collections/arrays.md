---
layout: multipage-overview
title: 数组

discourse: false

partof: collections
overview-name: Collections

num: 10
language: zh-cn
---

在Scala中，[数组](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/Array.html)是一种特殊的collection。一方面，Scala数组与Java数组是一一对应的。即Scala数组Array[Int]可看作Java的Int[]，Array[Double]可看作Java的double[]，以及Array[String]可看作Java的String[]。但Scala数组比Java数组提供了更多内容。首先，Scala数组是一种泛型。即可以定义一个Array[T]，T可以是一种类型参数或抽象类型。其次，Scala数组与Scala序列是兼容的 - 在需要Seq[T]的地方可由Array[T]代替。最后，Scala数组支持所有的序列操作。这里有个实际的例子：

    scala> val a1 = Array(1, 2, 3)
    a1: Array[Int] = Array(1, 2, 3)
    scala> val a2 = a1 map (_ * 3)
    a2: Array[Int] = Array(3, 6, 9)
    scala> val a3 = a2 filter (_ % 2 != 0)
    a3: Array[Int] = Array(3, 9)
    scala> a3.reverse
    res0: Array[Int] = Array(9, 3)

既然Scala数组表现的如同Java的数组，那么Scala数组这些额外的特性是如何运作的呢？实际上，Scala 2.8与早期版本在这个问题的处理上有所不同。早期版本中执行打包/解包过程时，Scala编译器做了一些“神奇”的包装/解包的操作，进行数组与序列对象之间互转。其中涉及到的细节相当复杂，尤其是创建一个新的泛型类型数组Array[T]时。一些让人迷惑的罕见实例以及数组操作的性能都是不可预测的。

Scala 2.8设计要简单得多，其数组实现系统地使用隐式转换，从而基本去除了编译器的特殊处理。Scala 2.8中数组不再看作序列，因为本地数组的类型不是Seq的子类型。而是在数组和 `scala.collection.mutable.WrappedArray`这个类的实例之间隐式转换，后者则是Seq的子类。这里有个例子：

    scala> val seq: Seq[Int] = a1
    seq: Seq[Int] = WrappedArray(1, 2, 3)
    scala> val a4: Array[Int] = s.toArray
    a4: Array[Int] = Array(1, 2, 3)
    scala> a1 eq a4
    res1: Boolean = true

上面的例子说明数组与序列是兼容的，因为数组可以隐式转换为WrappedArray。反之可以使用Traversable提供的toArray方法将WrappedArray转换为数组。REPL最后一行表明，隐式转换与toArray方法作用相互抵消。

数组还有另外一种隐式转换，不需要将数组转换成序列，而是简单地把所有序列的方法“添加”给数组。“添加”其实是将数组封装到一个ArrayOps类型的对象中，后者支持所有序列的方法。ArrayOps对象的生命周期通常很短暂，不调用序列方法的时候基本不会用到，其内存也可以回收。现代虚拟机一般不会创建这个对象。

在接下来REPL中展示数组的这两种隐式转换的区别：

    scala> val seq: Seq[Int] = a1
    seq: Seq[Int] = WrappedArray(1, 2, 3)
    scala> seq.reverse
    res2: Seq[Int] = WrappedArray(3, 2, 1)
    scala> val ops: collection.mutable.ArrayOps[Int] = a1
    ops: scala.collection.mutable.ArrayOps[Int] = [I(1, 2, 3)
    scala> ops.reverse
    res3: Array[Int] = Array(3, 2, 1)

注意seq是一个WrappedArray，seq调用reverse方法也会得到一个WrappedArray。这是没问题的，因为封装的数组就是Seq，在任意Seq上调用reverse方法都会得到Seq。反之，变量ops属于ArrayOps这个类，对其调用reverse方法得到一个数组，而不是Seq。

上例直接使用ArrayOps仅为了展示其与WrappedArray的区别，这种用法非常不自然。一般情况下永远不要实例化一个ArrayOps，而是在数组上调用Seq的方法：

    scala> a1.reverse
    res4: Array[Int] = Array(3, 2, 1)

ArrayOps的对象会通过隐式转换自动的插入，因此上述的代码等价于

    scala> intArrayOps(a1).reverse
    res5: Array[Int] = Array(3, 2, 1)

这里的intArrayOps就是之前例子中插入的隐式转换。这里引出一个疑问，上面代码中，编译器为何选择了intArrayOps而不是WrappedArray做隐式转换？毕竟，两种转换都是将数组映射到支持reverse方法的类型，并且指定输入。答案是两种转换是有优先级次序的，ArrayOps转换比WrappedArray有更高的优先级。前者定义在Predef对象中，而后者定义在继承自Predef的`scala.LowPriorityImplicits`类中。子类、子对象中隐式转换的优先级低于基类。所以如果两种转换都可用，Predef中的会优先选取。字符串的情况也是如此。

数组与序列兼容，并支持所有序列操作的方法，你现在应该已经了然于胸。那泛型呢？在Java中你不可以定义一个以T为类型参数的`T[]`。那么Scala的`Array[T]`是如何做的呢？事实上一个像`Array[T] `的泛型数组在运行时态可任意为Java的八个原始数组类型像`byte[]`, `short[]`, `char[]`, `int[]`, `long[]`, `float[]`, `double[]`, `boolean[]`,甚至它可以是一个对象数组。最常见的运行时态类型是AnyRef ，它包括了所有的这些类型（相当于java.lang.Object），因此这样的类型可以通过Scala编译器映射到`Array[T]`.在运行时，当`Array[T]`类型的数组元素被访问或更新时，就会有一个序列的类型测试用于确定真正的数组类型，随后就是java中的正确的数组操作。这些类型测试会影响数组操作的效率。这意味着如果你需要更大的性能，你应该更喜欢具体而明确的泛型数组。代表通用的泛型数组是不够的，因此，也必然有一种方式去创造泛型数组。这是一个更难的问题，需要一点点的帮助你。为了说明这个问题，考虑下面用一个通用的方法去创造数组的尝试。

    //这是错的！
    def evenElems[T](xs: Vector[T]): Array[T] = {
      val arr = new Array[T]((xs.length + 1) / 2)
      for (i <- 0 until xs.length by 2)
        arr(i / 2) = xs(i)
      arr
    }

evenElems方法返回一个新数组，该数组包含了参数向量xs的所有元素甚至在向量中的位置。evenElems 主体的第一行构建了结果数组，将相同元素类型作为参数。所以根据T的实际类型参数，这可能是一个`Array[Int]`，或者是一个`Array[Boolean]`，或者是一个在java中有一些其他基本类型的数组，或者是一个有引用类型的数组。但是这些类型有不同的运行时表达，那么Scala如何在运行时选择正确的呢？事实上，它不是基于信息传递做的，因为与类型参数T相对应的实际类型在运行时已被抹去。这就是为什么你在编译上面的代码时会出现如下的错误信息：

    error: cannot find class manifest for element type T
      val arr = new Array[T]((arr.length + 1) / 2)
                ^

这里需要你做的就是通过提供一些运行时的实际元素类型参数的线索来帮助编译器处理。这个运行时的提示采取的形式是一个`scala.reflect.ClassTag`类型的类声明。一个类声明就是一个类型描述对象，给对象描述了一个类型的顶层类。另外，类声明也有`scala.reflect.Manifest`类型的所有声明，它描述了类型的各个方面。但对于数组创建而言，只需要提供类声明。

如果你指示编译器那么做它就会自动的构建类声明。“指示”意味着你决定一个类声明作为隐式参数，像这样：

    def evenElems[T](xs: Vector[T])(implicit m: ClassTag[T]): Array[T] = ...
    
使用一个替换和较短的语法。通过用一个上下文绑定你也可以要求类型与一个类声明一起。这种方式是跟在一个冒号类型和类名为ClassTag的后面，想这样：

    import scala.reflect.ClassTag
    // this works
    def evenElems[T: ClassTag](xs: Vector[T]): Array[T] = {
      val arr = new Array[T]((xs.length + 1) / 2)
      for (i <- 0 until xs.length by 2)
        arr(i / 2) = xs(i)
      arr
    }

这两个evenElems的修订版本意思是完全相同的。当Array[T] 构造时，在任何情况下会发生的是，编译器会寻找类型参数T的一个类声明，这就是说，它会寻找ClassTag[T]一个隐式类型的值。如果如此的一个值被发现，声明会用来构造正确的数组类型。否则，你就会看到一个错误信息像上面一样。

下面是一些使用evenElems 方法的REPL 交互。

    scala> evenElems(Vector(1, 2, 3, 4, 5))
    res6: Array[Int] = Array(1, 3, 5)
    scala> evenElems(Vector("this", "is", "a", "test", "run"))
    res7: Array[java.lang.String] = Array(this, a, run)

在这两种情况下，Scala编译器自动的为元素类型构建一个类声明（首先，Int,然后String）并且通过它传递evenElems 方法的隐式参数。编译器可以对所有的具体类型构造，但如果论点本身是另一个没有类声明的类型参数就不可以。例如，下面的错误：

    scala> def wrap[U](xs: Vector[U]) = evenElems(xs)
    <console>:6: error: No ClassTag available for U.
         def wrap[U](xs: Vector[U]) = evenElems(xs)
                                               ^

这里所发生的是，evenElems 需要一个类型参数U的类声明，但是没有发现。这种情况下的解决方案是，当然，是为了U的另一个隐式类声明。所以下面起作用了：

    scala> def wrap[U: ClassTag](xs: Vector[U]) = evenElems(xs)
    wrap: [U](xs: Vector[U])(implicit evidence$1: scala.reflect.ClassTag[U])Array[U]

这个实例还显示在定义U的上下文绑定里这仅是一个简短的隐式参数命名为`ClassTag[U]`类型的`evidence$1`。

总结，泛型数组创建需要类声明。所以每当创建一个类型参数T的数组，你还需要提供一个T的隐式类声明。最简单的方法是声明类型参数与ClassTag的上下文绑定，如 `[T: ClassTag]`。
