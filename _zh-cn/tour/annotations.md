---
layout: tour
title: 注解
partof: scala-tour

num: 30

language: zh-cn

next-page: packages-and-imports
previous-page: by-name-parameters
---

注解将元信息与定义相关联。 例如，方法之前的注解 `@deprecated` 会导致编译器在该方法被使用时打印警告信息。
```
object DeprecationDemo extends App {
  @deprecated("deprecation message", "release # which deprecates method")
  def hello = "hola"

  hello  
}
```
这个程序可以编译，但编译器将打印一个警告信息: "there was one deprecation warning"。

注解作用于其后的第一个定义或声明。 在定义和声明之前可以有多个注解。 这些注解的顺序并不重要。

## 确保编码正确性的注解
如果不满足条件，某些注解实际上会导致编译失败。 例如，注解 `@tailrec` 确保方法是 [尾递归](https://en.wikipedia.org/wiki/Tail_call)。 尾递归可以保持内存需求不变。 以下是它在计算阶乘的方法中的用法：
```scala mdoc
import scala.annotation.tailrec

def factorial(x: Int): Int = {

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int = {
    if (x == 1) accumulator else factorialHelper(x - 1, accumulator * x)
  }
  factorialHelper(x, 1)
}
```
方法 `factorialHelper` 使用注解 `@tailrec` 确保方法确实是尾递归的。 如果我们将方法 `factorialHelper` 的实现改为以下内容，它将编译失败：
```
import scala.annotation.tailrec

def factorial(x: Int): Int = {
  @tailrec
  def factorialHelper(x: Int): Int = {
    if (x == 1) 1 else x * factorialHelper(x - 1)
  }
  factorialHelper(x)
}
```
我们将得到一个错误信息 "Recursive call not in tail position".


## 影响代码生成的注解
像 `@inline` 这样的注解会影响生成的代码(即你的 jar 文件可能与你没有使用注解时有不同的字节)。 内联表示在调用点插入被调用方法体中的代码。 生成的字节码更长，但有希望能运行得更快。 使用注解 `@inline` 并不能确保方法内联，当且仅当满足某些生成代码大小的启发式算法时，它才会触发编译器执行此操作。

### Java 注解 ###
在编写与 Java 互操作的 Scala 代码时，注解语法中存在一些差异需要注意。
**注意：** 确保你在开启 `-target:jvm-1.8` 选项时使用 Java 注解。

Java 注解有用户自定义元数据的形式 ，参考 [annotations](https://docs.oracle.com/javase/tutorial/java/annotations/) 。 注解的一个关键特性是它们依赖于指定 name-value 对来初始化它们的元素。 例如，如果我们需要一个注解来跟踪某个类的来源，我们可以将其定义为
```
@interface Source {
  public String URL();
  public String mail();
}
```

并且按如下方式使用它

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Scala 中的注解应用看起来像构造函数调用，要实例化 Java 注解，必须使用命名参数：

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

如果注解只包含一个元素(没有默认值)，则此语法非常繁琐，因此，按照惯例，如果将元素名称指定为 `value`，则可以使用类似构造函数的语法在 Java 中应用它：
```
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

然后按如下方式使用

```
@SourceURL("https://coders.com/")
public class MyClass extends HisClass ...
```

在这种情况下， Scala 提供了相同的可能性

```
@SourceURL("https://coders.com/")
class MyScalaClass ...
```

`mail` 元素在定义时设有默认值，因此我们不需要显式地为它提供值。 但是，如果我们需要显示地提供值，我们则不能在 Java 中混合使用这两种方式：

```
@SourceURL(value = "https://coders.com/",
           mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Scala 在这方面提供了更大的灵活性

```
@SourceURL("https://coders.com/",
           mail = "support@coders.com")
    class MyScalaClass ...
```
