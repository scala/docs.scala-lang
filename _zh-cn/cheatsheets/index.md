---
layout: cheatsheet
title: Scalacheat

partof: cheatsheet

by: Brendan O'Connor
about: 感谢 <a href="http://brenocon.com/">Brendan O'Connor</a>, 本速查表可以用于快速地查找Scala语法结构。Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license.

language: "zh-cn"
---

###### Contributed by {{ page.by }}
{{ page.about }}


|  <span id="variables" class="h2">变量</span>                                                                       |                 |
|  `var x = 5`                                                                                             |  可变量       |
|  <span class="label success">Good</span> `val x = 5`<br> <span class="label important">Bad</span> `x=6`  |  常量       |
|  `var x: Double = 5`                                                                                     |  显式类型  |
|  <span id="functions" class="h2">函数</span>                                                                       |                 |
|  <span class="label success">Good</span> `def f(x: Int) = { x*x }`<br> <span class="label important">Bad</span> `def f(x: Int)   { x*x }` |  定义函数 <br> 隐藏出错: 不加“=”号将会是一段返回Unit类型的过程，这将会导致意想不到的错误。 |
|  <span class="label success">Good</span> `def f(x: Any) = println(x)`<br> <span class="label important">Bad</span> `def f(x) = println(x)` |  定义函数 <br> 语法错误: 每个参数都需要指定类型。 |
|  `type R = Double`                                                                                       |  类型别名     |
|  `def f(x: R)` vs.<br> `def f(x: => R)`                                                                  |  传值调用 <br> 传名调用 （惰性参数） |
|  `(x:R) => x*x`                                                                                          |  匿名函数  |
|  `(1 to 5).map(_*2)` vs.<br> `(1 to 5).reduceLeft( _+_ )`                                                |  匿名函数: 下划线是arg参数的占位符。 |
|  `(1 to 5).map( x => x*x )`                                                                              |  匿名函数: 必须命名以后才可以使用一个arg参数两次。 |
|  <span class="label success">Good</span> `(1 to 5).map(2*)`<br> <span class="label important">Bad</span> `(1 to 5).map(*2)` |  匿名函数: 绑定前缀方法，理智的方法是`2*_`。 |
|  `(1 to 5).map { x => val y=x*2; println(y); y }`                                                             |  匿名函数: 程序块风格，最后一个表达式作为返回值。 |
|  `(1 to 5) filter {_%2 == 0} map {_*2}`                                                                  |  匿名函数: 管道风格（或者用圆括号）。 |
|  `def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))` <br> `val f = compose({_*2}, {_-1})`                   |  匿名函数: 要传入多个程序块的话，需要外围括号。 |
|  `val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd`                                                   |  柯里化, 显然的语法。 |
|  `def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd`                                                       |  柯里化, 显然的语法。 |
|  `def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd`                                                           |  柯里化，语法糖。然后:) |
|  `val normer = zscore(7, 0.4) _`                                                                          |  需要在尾部加下划线来变成偏函数（只对语法糖版本适用）。 |
|  `def mapmake[T](g:T=>T)(seq: List[T]) = seq.map(g)`                                                     |  泛型 |
|  `5.+(3); 5 + 3` <br> `(1 to 5) map (_*2)`                                                               |  中缀语法糖 |
|  `def sum(args: Int*) = args.reduceLeft(_+_)`                                                            |  可变参数 |
|  <span id="packages" class="h2">包</span>                                                                         |                 |
|  `import scala.collection._`                                                                             |  通配符导入 |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  选择性导入 |
|  `import scala.collection.{Vector => Vec28}`                                                             |  重命名导入 |
|  `import java.util.{Date => _, _}`                                                                       |  导入java.util包里除Date之外的所有文件. |
|  `package pkg` _at start of file_ <br> `package pkg { ... }`                                             |  声明这是一个包 |
|  <span id="data_structures" class="h2">数据结构</span>                                                           |                 |
|  `(1,2,3)`                                                                                               |  元组字面量 (`Tuple3`) |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  解构绑定：通过模式匹配来解构元组。 |
|  <span class="label important">Bad</span>`var x,y,z = (1,2,3)`                                           |  隐藏出错：每一个变量都被赋值了整个元组。 |
|  `var xs = List(1,2,3)`                                                                                  |  列表 (不可变). |
|  `xs(2)`                                                                                                 |  用括号索引 ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/27)) |
|  `1 :: List(2,3)`                                                                                        |  Cons（构成） |
|  `1 to 5` _等价于_ `1 until 6` <br> `1 to 10 by 2`                                                      |  Range类型（语法糖） |
|  `()` _(空括号)_                                                                                   |  Unit类型的唯一成员 (相当于 C/Java 里的void). |
|  <span id="control_constructs" class="h2">控制结构</span>                                                     |                 |
|  `if (check) happy else sad`                                                                             | 条件 |
|  `if (check) happy` _same as_ <br> `if (check) happy else ()`                                            |  条件（语法糖） |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  while循环 |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  do while循环 |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>`    for (x <- xs) {`<br>`        if (Math.random < 0.1) break`<br>`    }`<br>`}`|  break. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)) |
|  `for (x <- xs if x%2 == 0) yield x*10` _等价于_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  for comprehension （for 导出）: filter/map |
|  `for ((x,y) <- xs zip ys) yield x*y` _等价于_ <br>`(xs zip ys) map { case (x,y) => x*y }`              |  for comprehension （for 导出）: 解构绑定 |
|  `for (x <- xs; y <- ys) yield x*y` _等价于_ <br>`xs flatMap {x => ys map {y => x*y}}`                  |  for comprehension （for 导出）: 叉乘 |
|  `for (x <- xs; y <- ys) {`<br>    `println("%d/%d = %.1f".format(x, y, x/y.toFloat))`<br>`}`                     |  for comprehension （for 导出）: 不可避免的格式<br>[sprintf-style](http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax) |
|  `for (i <- 1 to 5) {`<br>    `println(i)`<br>`}`                                                        |  for comprehension （for 导出）: 包括上边界的遍历 |
|  `for (i <- 1 until 5) {`<br>    `println(i)`<br>`}`                                                     |  for comprehension （for 导出）: 忽略上边界的遍历 |
|  <span id="pattern_matching" class="h2">模式匹配</span>                                                         |                 |
|  <span class="label success">Good</span> `(xs zip ys) map { case (x,y) => x*y }`<br> <span class="label important">Bad</span> `(xs zip ys) map( (x,y) => x*y )` |  在函数的参数中使用模式匹配的例子。 |
|  <span class="label important">Bad</span><br>`val v42 = 42`<br>`Some(3) match {`<br>`  case Some(v42) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  "v42" 被解释为可以匹配任何Int类型值的名称，打印输出"42"。 |
|  <span class="label success">Good</span><br>`val v42 = 42`<br>`Some(3) match {`<br>``    case Some(`v42`) => println("42")``<br>`case _ => println("Not 42")`<br>`}`  |  有反引号的 "\`v42\`" 被解释为已经存在的val `v42`，所以输出的是 "Not 42". |
|  <span class="label success">Good</span><br>`val UppercaseVal = 42`<br>`Some(3) match {`<br>`  case Some(UppercaseVal) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  `UppercaseVal` 被视作已经存在的 val，而不是一个新的模式变量，因为它是以大写字母开头的，所以`UppercaseVal` 所包含的值（42）和检查的值（3）不匹配，输出"Not 42"。|
|  <span id="object_orientation" class="h2">面向对象</span>                                                     |                 |
|  `class C(x: R)` _same as_ <br>`class C(private val x: R)`<br>`var c = new C(4)`                         |  构造器参数 - 私有 |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  构造器参数 - 公有 |
|  `class C(var x: R) {`<br>`assert(x > 0, "positive please")`<br>`var y = x`<br>`val readonly = 5`<br>`private var secret = 1`<br>`def this = this(42)`<br>`}`|<br>构造函数就是类的主体<br>声明一个公有成员变量<br>声明一个可get但不可set的成员变量<br>声明一个私有变量<br>可选构造器|
|  `new{ ... }`                                                                                            |  匿名类 |
|  `abstract class D { ... }`                                                                              |  定义一个抽象类。（不可创建） |
|  `class C extends D { ... }`                                                                             |  定义一个继承子类。 |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  继承与构造器参数（愿望清单: 默认自动传参）
|  `object O extends D { ... }`                                                                            |  定义一个单例（和模块一样） |
|  `trait T { ... }`<br>`class C extends T { ... }`<br>`class C extends D with T { ... }`                  |  特质<br>带有实现的接口，没有构造参数。 [mixin-able]({{ site.baseurl }}/tutorials/tour/mixin-class-composition.html).
|  `trait T1; trait T2`<br>`class C extends T1 with T2`<br>`class C extends D with T1 with T2`             |  （混入）多个特质 |
|  `class C extends D { override def f = ...}`	                                                           |  必须声明覆盖该方法。 |
|  `new java.io.File("f")`                   	                                                           |  创建对象。 |
|  <span class="label important">Bad</span> `new List[Int]`<br> <span class="label success">Good</span> `List(1,2,3)` |  类型错误： 抽象类型<br>相反，习惯上：调用工厂（方法）会自动推测类型 |
|  `classOf[String]`                                                                                       |  类字面量 |
|  `x.isInstanceOf[String]`                                                                                |  类型检查 (运行时) |
|  `x.asInstanceOf[String]`                                                                                |  类型强制转换 (运行时) |
|  `x: String`                                                                                             |  归属 (编译时) |
