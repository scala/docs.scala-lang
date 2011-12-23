---
layout: cheatsheet
title: Scalacheat
by: (initial version: Brendan O'Connor) HamsterofDea
about: Thanks to <a href="http://brenocon.com/">Brendan O'Connor</a>, this cheatsheet aims to be a quick reference of Scala syntactic constructions. Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license. Pimped by HamsterofDeath who doesn't care about the license and just wants to help scala to spread :)
---

###### Contributed by {{ page.by }}

|note: "this is a lie" means i gave a simplified explanation and left out details which will be covered later                                                                                                          |                 |
| ------                                                                                                   | ------          |
|  <h2 id="declarations">Basic declarations</h2>                                                                       |                 |
|  `var x = 5`<br>`x = 6`                                                                                             |  mutable variable, value can be changed later       |
|  <span class="label success">Good</span> `val x = 5`<br> <span class="label important">Bad</span> `x=6`  |  immutable, cannot be changed       |
|  `var x: Double = 5`                                                                                     |  explicit type. if not provided, compiler will pick one (more later) |
|  `var x: Double = 5;val y = 42`                                                                                     |  semicolons are optional if a statement is the last one in a line |
|  `var x = {5}`<br>`var x = {1+2}`             |  results of expressions can be assigned, too  |
|  `def x:String = return "hello world"`                 | method declaration                      |
|  `def x(foo:String):String = return foo+"hello world"`                 | method declaration with simple parameter                      |
|  `def x(foo:String, bar:String):String = return foo+"hello world"+bar`                 | method declaration with two parameters                      |
|  `def x:String = {val x = 1;return "hello world"+1}`                 | multiple statements need {} around the code                      |
| `def x = "hello world"`|return keyword and return type declaration are optional, but if a method contains return, the return type *must* be specified explicitly. default return value = last value in code block. 
| `def x = {def y = 7;y}` | nested declarations are possible|
| `class Foo`| class declaration - nested declaration also possible|
| `class Foo(var x:String, val y:Int)`| class declaration with 2 public fields, one mutable, one immutable. constructor is automatically generated. only new Foo("1",2) is possible|
| `class Foo {var x = 5;val y = 6}`|class like above, but with default constructor, only new Foo() is possible|
| `class Foo {def x = 5}`|class with default constructor and one method|
|  <h2 id="declarations2">Not so basic declarations</h2>                                                                       |                 |
| `val x = {class y(val z: String); new y("hello").z}`<br><span class="label important">Bad</span>`val foo = new y("does not work outside the block above")`| everything can be nested in anything, but everything can only be accessed in its scope|
| `lazy val x = expensiveOperation()`|the expensive operation is executed once as soon as the value of x is needed, not before|
| `def method(a:String = "hello", b:String = "world") = a+" "+b`|method will default values|
| `method("goodbye")`|call to method above, unspecificed parameters will get default values. returns "goodbye world"|
| `method(b = "friend")`|call to method above, explicitly passes a string to b. a defaults to "hello". returns "hello friend"|
|`def method(param: => String)`|"=>" means that when the method is called, the parameter is wrapped in a function which is executed when accessed. the string is evaluated every time when needed (see Iterator.continually), but not before. the value is not cached, but you can pass a lazy val to make it cached.|
|`def method(s:String)(i:Int)`|method with multiple parameter lists|
|`val intermediate = method("hello")`<br>`intermediate(5)`|why? because you can apply one parameter list at once and the next ones later and pass "the incomplete call" around. in java, you would use a builder for this.|
|  <h2 id="functiondeclaration">Declaring functions</h2>                                                                       |                 |
| `(i:Int) => i+1`|creates a function.| 
| `var func = (i:Int) => i+1`|creates a function and stores it in a variable|
| `func(5)`|executing the function above|
| `def func = (i:Int) => i+1`|creates a function each time the method is called and returns that function, not i+1|
|`val func:(Int) => String = (i:Int) => i.toString`|just so you know the syntax of a type of a function :)|
|`def takesFunction(f:(Int) => String) = f(5)`| method that takes the function above as a parameter and calls it. compiler figures out the return type "string" for you.|
|`def method(i:Int) = t.toString;val func = method _`|appending an "_" converts any method into a function|
|`takesFunction(method)`|is also possible, the compiler does the conversion for you in obvious cases|
|`def method(s:String)(s2:String) = s+" "+s2)`<br>`val intermediate:(String)=>String = method("hello")`<br>`intermediate("world")`|parameter lists revisited: the intermediate, "incomplete method calls" are functions. the result of the last call is "hello world"|
|  <h2 id="typeinference">Return types and type inference</h2>                                                                       |                 |
|  `val x = "hello"`|the compiler always picks the most specific type possible, in this case java.lang.String|
|  `val x:Serializable = "hello"`|you can always specify a more general one|
|  `def x {print("hello world")}`                 | method without "=" means the method has no return type/return type is void (this is a lie)  | 
|  `def x:Unit = {...}`<br>`def x() {...}`|leaving out the "=" at a method declaration is the same as specifying "Unit"|
| `val blocks = {{{{5}}}}`|every block has a return type that is passed back to the next outer block|
| `val block = if (a) foo else bar`|almost everything is an expression and thus, has a return type. this includes if-else-structures|
|`def x = if (System.currentTimeMillis() % 2 == 0) Integer.valueOf(1) else java.lang.Double.valueOf(2)`|here, the compiler picks the most specific supertype of both Integer and Double which is java.lang.Number (this is a lie)|
|`def x(i:Int):Int = if (i==0) 1 else i*x(i-1)`|recursive methods need an explicit return type. fail.|
|  <h2 id="collections">Scala Collections</h2>                                                                       |                 |
|`1 to 3, Set(1,2,3), Buffer(1,2,3), ArrayBuffer(1,2,3), ListBuffer(1,2,3), List(1,2,3), Array(1,2,3),Vector(1,2,3), Map(1 -> "a", 2 -> "b")`|simple collection creations. scala has mutable and immutable collections.|
|prepend, append, union, remove, insertAll... |the usual methods every collection framework offers are present in scala as well|
|if you like to use operators instead, there are some scary but concise ones. you'll need some practice to get them right:<br>+,++,++=,++:=-,--,--=,:+,:++,:=+,+=:,:++=,++:=, ++=:|method name rules:<br>"+" means add<br>"-" means remove<br>"++" or "--" mean add/remove many elements, not just one<br>"=" means modify mutable collection xor assign new immutable collection to var. in the reassign case, "=" is appended to the actual method name, just like "int i=0;i+=1" in java. <br>":" goes on the side of the target collection and is always the first or last character of a method name. if a method end with :=, the method actually ends with : and = means it's a reassignment<br>if method contains ":" it is an add to an ordered collection, either at the beginning or the end of the collection|
|`mutableColl += elem`|add element to a collection|
|`mutableColl -= elem`|remove element|
|`mutableColl ++= elems`|add elements|
|`mutableColl --= elems`|remove elements|
|`elem +=: mutableColl`|adds element at the beginning of a collection|
|`mutableColl :+= elem`|adds element at the end of a collection|
|`mutableColl(0) = 1`|write access by index on mutable collections|
|`coll(0)`|read access by index|
|`coll - elem`|create new collection that has all elements of coll except elem|
|`coll ++ elems`|create new collection that has all elements of coll and elems|
|`coll -- elems`|create new collection that has all elements of coll except elems|
|`coll :+ elem`|create new collection that has all elements of coll and elem at the end|
|`elem +: coll`|create new collection that has all elements of coll and elem at the beginning|
|`immutableColl += elem`<br>`immutableColl -= elem`<br>`immutableColl ++= elems`<br>`immutableColl --= elems`<br>`elem +=: immutableColl`<br>`immutableColl :+= elem`|same as the operations without "=", but works only if "immutableColl is a var, not a val. the created collection is assigned to "immutableColl".|
|`def isEven(i:Int= if (i%2==0) true else false`<br>`val evenNumbers:List[Int] = List(1,2,3,4).filter(isEven)`|scala collections are a major epic win. they have ~100 methods which operate on the data of a collection and there is *absolutely nothing* you cannot do with them.|
|`val evenNumbers:List[Int] = List(1,2,3,4).filter((i:Int)=> i%2==0)`|same as above, just shorter|
|`val evenNumbers = List(1,2,3,4).filter(i => i%2==0)`|same as above, just shorter. you can skip the () if there is only one parameter. you can also skip the type of the parameter(s) because it can be inferred from the usage|
|`val evenNumbers = List(1,2,3,4).filter(_ % 2 == 0)`|same as above, just shorter. you can skip part before "=>" if you use a parameter only once and replace the parameter usage by "_"|
|`val doubleNumbers = List(1,2,3,4).map(_ * 2)`|for the non functional programmers: map means convert|
|`listOfManyPersons.filter(_.hasChildren).map(_.getChildren)`|collection operations can be chained. you can do anything without loops and conditions which makes your code very easy to read|
|`List(1,2,3,4,5).foreach(println)`|do something with every element|
|`List(1,2,3,4,5).par.filter(_ % 2 == 0)`|is executed in parallel just like that|
|`List(1).toSet.toArray.toBuffer.iterator.toStream.toSeq`|conversions are easy|
|`Iterator.continually(randomNumber)`|collections and iterators can also be created from functions and methods|
|`Iterator.continually(randomNumber).take(100).max`|highest of 100 random numbers. again: there are methods for everything you can possibly imagine. many are taking functions so the flexibility is epic :)|
|`Iterator.continually(randomThings).take(100).maxBy(comparisonFunction)`|highest of 100 random things. as above, but can be used for anything.|
| <h2 id="fold">The power of collections and functions</h2>|
| using closures, it is possible to avoid repetitions of boilerplate - instead you pass a function to a method that hides the boilerplate. apart from filter and map, two other epic wins are reduce and fold.|
|`List(1,2,3,4,5).reduce((i,i2) => i+i2)`|result: ((((1+2)+3)+4)+5). in human speech, it takes 2 elements and merges them into one. imagine the collection turning from 1,2,3,4,5 into 3,3,4,5. then repeat:6,4,5 -> 10,5 -> 15|
|`List(1,2,3,4,5).reduce(_ + _)`|same as above, using "_" for the first and second parameter|
|`List(1,2,3,4,5).fold(0)((sumSoFar,element) => sumSoFar+element)`|same as above, but fold uses an explicit start value|
|`List(1,2,3,4,5).fold(0)(_ + _)`|same as the fold above, just shorter|
|`"comma separated numbers: " + List(1, 2, 3, 4, 5).fold("0")(_ + ", " + _)`|finally, you won't have to fiddle around with the last "," anymore!|
|in java this would all look like:<br>`Acc acc = ?;`<br>` for (T t: coll) {if (acc==null) {acc = t;} else {acc = doStuff(acc,t);}}`|this is boilerplate code you can avoid *every single time!*. write only what (doStuff) should happen, not "what and how" (boilerplate code + doStuff).|
|where else could you save boilerplate? think about it!<br>try-catch-finally
| <h2 id="generics">Generics</h2>|
| `def foo[BAR](bar:BAR):BAR = bar`|simple type parameter, can be anything|
| `def foo[BAR <: java.lang.Number](bar: BAR) = bar.doubleValue() + 5`|upper bound, BAR must be a java.lang.Number or a subclass of it|
| `def foo[BAR >: java.lang.Number](bar: BAR) = bar`|lower bound, type must be java.lang.Number or a superclass of it, but not a subclass of java.lang.Number. note that you can still pass a double, but the type parameter and therefore the return type will be java.lang.Number. the bound applies to the type parameter itself, not the type of the parameter that is passed to the function|
|`val strings:List[String] = List("hello","generics")`<br>`val objects:List[java.lang.Object] = strings`|in scala, type parameters of collections are covariant. this means they "inherit" the inhertance relations of their type parameters. in java, have to do an ugly cast:<br>`List<Integer> ints = new ArrayList<Integer>()`;<br>`List<Number> numbers = ((List<Number)((Object)Integer)`|
|`class InVariant[A]`|class having an invariant type parameter, meaning `val InVariant[SuperClass] = inVariantWithAnyOther` does not compile|
|`class CoVariant[+A]`|class having a covariant type parameter, meaning `val CoVariant[SuperClass] = coVariantWithSubClass` compiles|
|`class CoVariant[-A]`|class having a contravariant type parameter, meaning `val CoVariant[SubClass] = coVariantWithSuperclass` compiles|
|where does "-Type" make sense? take a look at functions:<br>`val func:(String) => java.lang.Number`|the return type is +, the parameter is -, so the function can be replaced by one declared like<br>`val func2:(java.lang.Object) => java.lang.Integer`<br>Think about it. a function that can take any object can also take a string. a function that returns an integer automatically returns a number, so the second one can replace the first one in every possible case.|
|`def foo[A, B[A]] (nested: B[A])`|nested type parameters are possible. nested must be of a type that has a type parameter. for example, you could pass a List[Int]|
|`def foo[A, B, C <: B[A]](nested: C))`|same as above, using an alias for B[A] named C|
|`def foo[C <: Traversable[_]] (nested: C) = nested.head`|if there is no need to access the inner type explicitly, it can be replaced by an _. in this example, the compiler infers that the return type must be whatever _ is, so the actual return type depends on the call site.|
|`foo(List(5))`|call to the method above, returns an Int|
|`def foo[A: Manifest] {val classAtRuntime = manifest[A].erasure; println(classAtRuntime);}`|Adding ":Manifest" will make the compiler add magic so you can get the type parameter at runtime via `manifest[TYPEPARAM]`|
|`foo[String]`|call to method above, prints "class java.lang.String"|

not yet pimped part of the cheat sheet:

|  <h2 id="functions">functions</h2>                                                                       |                 |
|  <span class="label success">Good</span> `def f(x: Int) = { x*x }`<br> <span class="label important">Bad</span> `def f(x: Int)   { x*x }` |  define function <br> hidden error: without = it's a Unit-returning procedure; causes havoc |
|  <span class="label success">Good</span> `def f(x: Any) = println(x)`<br> <span class="label important">Bad</span> `def f(x) = println(x)` |  define function <br> syntax error: need types for every arg. |
|  `type R = Double`                                                                                       |  type alias     |
|  `def f(x: R)` vs.<br> `def f(x: => R)`                                                                  |  call-by-value <br> call-by-name (lazy parameters) |
|  `(x:R) => x*x`                                                                                          |  anonymous function  |
|  `(1 to 5).map(_*2)` vs.<br> `(1 to 5).reduceLeft( _+_ )`                                                |  anonymous function: underscore is positionally matched arg. |
|  `(1 to 5).map( x => x*x )`                                                                              |  anonymous function: to use an arg twice, have to name it. |
|  <span class="label success">Good</span> `(1 to 5).map(2*)`<br> <span class="label important">Bad</span> `(1 to 5).map(*2)` |  anonymous function: bound infix method. Use `2*_` for sanity's sake instead. |
|  `(1 to 5).map { val x=_*2; println(x); x }`                                                             |  anonymous function: block style returns last expression. |
|  `(1 to 5) filter {_%2 == 0} map {_*2}`                                                                  |  anonymous functions: pipeline style. (or parens too). |
|  `def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))` <br> `val f = compose({_*2}, {_-1})`                   |  anonymous functions: to pass in multiple blocks, need outer parens. |
|  `val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd`                                                   |  currying, obvious syntax. |
|  `def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd`                                                       |  currying, obvious syntax |
|  `def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd`                                                           |  currying, sugar syntax. but then: |
|  `val normer = zscore(7, 0.4)_`                                                                          |  need trailing underscore to get the partial, only for the sugar version. |
|  `def mapmake[T](g:T=>T)(seq: List[T]) = seq.map(g)`                                                     |  generic type. |
|  `5.+(3); 5 + 3` <br> `(1 to 5) map (_*2)`                                                               |  infix sugar. |
|  `def sum(args: Int*) = args.reduceLeft(_+_)`                                                            |  varargs. |
|  <h2 id="packages">packages</h2>                                                                         |                 |
|  `import scala.collection._`                                                                             |  wildcard import. |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  selective import. |
|  `import scala.collection.{Vector => Vec28}`                                                             |  renaming import. |
|  `import java.util.{Date => _, _}`                                                                       |  import all from java.util except Date. |
|  `package pkg` _at start of file_ <br> `package pkg { ... }`                                             |  declare a package. |
|  <h2 id="data_structures">data structures</h2>                                                           |                 |
|  `(1,2,3)`                                                                                               |  tuple literal. (`Tuple3`) |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  destructuring bind: tuple unpacking via pattern matching. |
|  <span class="label important">Bad</span>`var x,y,z = (1,2,3)`                                           |  hidden error: each assigned to the entire tuple. |
|  `var xs = List(1,2,3)`                                                                                  |  list (immutable). |
|  `xs(2)`                                                                                                 |  paren indexing. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/27)) |
|  `1 :: List(2,3)`                                                                                        |  cons. |
|  `1 to 5` _same as_ `1 until 6` <br> `1 to 10 by 2`                                                      |  range sugar. |
|  `()` _(empty parens)_                                                                                   |  sole member of the Unit type (like C/Java void). |
|  <h2 id="control_constructs">control constructs</h2>                                                     |                 |
|  `if (check) happy else sad`                                                                             |  conditional. |
|  `if (check) happy` _same as_ <br> `if (check) happy else ()`                                            |  conditional sugar. |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  while loop. |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  do while loop. |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>`    for (x <- xs) {`<br>`        if (Math.random < 0.1) break`<br>`    }`<br>`}`|  break. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)) |
|  `for (x <- xs if x%2 == 0) yield x*10` _same as_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  for comprehension: filter/map |
|  `for ((x,y) <- xs zip ys) yield x*y` _same as_ <br>`(xs zip ys) map { case (x,y) => x*y }`              |  for comprehension: destructuring bind |
|  `for (x <- xs; y <- ys) yield x*y` _same as_ <br>`xs flatMap {x => ys map {y => x*y}}`                  |  for comprehension: cross product |
|  `for (x <- xs; y <- ys) {`<br>    `println("%d/%d = %.1f".format(x,y, x*y))`<br>`}`                     |  for comprehension: imperative-ish<br>[sprintf-style](http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax) |
|  <h2 id="pattern_matching">pattern matching</h2>                                                         |                 |
|  <span class="label success">Good</span> `(xs zip ys) map { case (x,y) => x*y }`<br> <span class="label important">Bad</span> `(xs zip ys) map( (x,y) => x*y )` |  use case in function args for pattern matching. |
|  <span class="label important">Bad</span><br>`val v42 = 42`<br>`Some(3) match {`<br>`  case Some(v42) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  "v42" is interpreted as a name matching any Int value, and "42" is printed.
|  <span class="label success">Good</span><br>`val v42 = 42`<br>`Some(3) match {`<br>``    case Some(`v42`) => println("42")``<br>`case _ => println("Not 42")`<br>`}`  |  "\`v42\`" with backticks is interpreted as the read-only variable v42, and "Not 42" is printed.
|  <h2 id="object_orientation">object orientation</h2>                                                     |                 |
|  `class C(x: R)` _same as_ <br>`class C(private val x: R)`<br>`var c = new C(4)`                         |  constructor params - private |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  constructor params - public |
|  `class C(var x: R) {`<br>`assert(x > 0, "positive please")`<br>`var y = x`<br>`val readonly = 5`<br>`private var secret = 1`<br>`def this = this(42)`<br>`}`|<br>constructor is class body<br>declare a public member<br>declare a gettable but not settable member<br>declare a private member<br>alternative constructor|
|  `new{ ... }`                                                                                            |  anonymous class |
|  `abstract class D { ... }`                                                                              |  define an abstract class. (non-createable) |
|  `class C extends D { ... }`                                                                             |  define an inherited class. |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  inheritance and constructor params. (wishlist: automatically pass-up params by default)
|  `object O extends D { ... }`                                                                            |  define a singleton. (module-like) |
|  `trait T { ... }`<br>`class C extends T { ... }`<br>`class C extends D with T { ... }`                  |  traits.<br>interfaces-with-implementation. no constructor params. [mixin-able]({{ site.baseurl }}/tutorials/tour/mixin-class-composition.html).
|  `trait T1; trait T2`<br>`class C extends T1 with T2`<br>`class C extends D with T1 with T2`             |  multiple traits. |
|  `class C extends D { override def f = ...}`                                                             |  must declare method overrides. |
|  `new java.io.File("f")`                   	                                                           |  create object. |
|  <span class="label important">Bad</span> `new List[Int]`<br> <span class="label success">Good</span> `List(1,2,3)` |  type error: abstract type<br>instead, convention: callable factory shadowing the type |
|  `classOf[String]`                                                                                       |  class literal. |
|  `x.isInstanceOf[String]`                                                                                |  type check (runtime) |
|  `x.asInstanceOf[String]`                                                                                |  type cast (runtime) |
