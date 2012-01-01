---
layout: cheatsheet
title: Scalacheat
by: (initial version: Brendan O'Connor) HamsterofDeath
about: Thanks to <a href="http://brenocon.com/">Brendan O'Connor</a>, this cheatsheet aims to be a quick reference of Scala syntactic constructions. Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license. Enriched a lot by HamsterofDeath who wants to help scala spread :)
---

||
| ------                                                                                                   | ------          |
|  <h2 id="declarations">Basic declarations</h2>                                                                       |                 |
|  `var x = 5`<br>`x = 6`                                                                                             |  mutable variable, value can be changed later       |
|  <span class="label success">Good</span> `val x = 5`<br> <span class="label important">Bad</span> `x=6`  |  immutable, cannot be changed       |
|`var x: Double = 5`                                                  |explicit type. if not provided, compiler will pick one (more later)                                                                                                                |
|`var x: Double = 5;val y = 42`                                       |semicolons are optional if a statement is the last one in a line                                                                                                                   |
|  `var x = {5}`<br>`var x = {1+2}`             |  results of expressions can be assigned, too  |
|`def x:String = return "hello world"`                                |method declaration                                                                                                                                                                 |
|`def x(foo:String):String = return foo+"hello world"`                |method declaration with simple parameter                                                                                                                                           |
|`def x(foo:String, bar:String):String = return foo+"hello world"+bar`|method declaration with two parameters                                                                                                                                             |
|  `def x:String = {`<br>&nbsp;&nbsp;`val x = 1`<br>&nbsp;&nbsp;`return "hello world"+1`<br>`}`                 | multiple statements need {} around the code                      |
|`def x = "hello world"`                                              |return keyword and type declaration are optional, but if a method contains return, the return type *must* be specified explicitly. default return value = last value in code block.|
|`def iAcceptVarArgs(i:Int,s:String,d:Double*) = {...}`               |method accepting varargs                                                                                                                                                           |
|`def x = {def y = 7;y}`                                              |nested declarations are possible                                                                                                                                                   |
|<h2 id="primitive types">Primitive types</h2>|
|`Byte, Char, Boolean, Double, Float, Long, Int, Short`|Primitive types. Automatically boxed and unboxed, no special handling like in java (-> int/Integer)|
|<h2 id="syntax details">Syntax details</h2>|
|just a few things that didn't fit anywhere else||
|`instance.bar`           |reading field access or parameterless method call, no difference in scala. val and def can be switched without a change in calling code|
|`instance.bar()`         |convention: methods without () don't change any states. methods with () have side effects                                              |
|`instance bar`           |"." can be skipped in simple cases (instance left, method right). useful for DSLs                                                      |
|`println {"hello world"}`|single param methods can also be called like this. also useful for DSLs                                                                |
|``def `def` = 5``        |method named "def". you can escape names in scala using backticks                                                                      |
|  <h2 id="declarations2">Not so basic declarations</h2>                                                                       |                 |
| `val x = {`<br>&nbsp;&nbsp;`class y(val z: String)`<br>&nbsp;&nbsp;`new y("hello").z`<br>`}`<br><span class="label important">Bad</span>`val foo = new y("does not work outside the block above")`| everything can be nested in anything, but everything can only be accessed in its scope|
|`lazy val x = expensiveOperation()`                           |value is initialized on first access. threadsafe.                                                                                                   |
|`def method(a:String = "hello", b:String = "world") = a+" "+b`|a method with default parameters                                                                                                                    |
|`method("goodbye")`                                           |call to method above, unspecificed parameters will get default values. returns "goodbye world"                                                      |
|`method(b = "friend")`                                        |call to method above, explicitly passes a string to b. a defaults to "hello". returns "hello friend"                                                |
|`def method(param: => String)`                                |"=>" causes the parameter to be wrapped in a function which is executed every time when accessed inside the method body. (see Iterator.continually).|
|`def makeString = method {"hello "+"world" + System.nanoTime}`|example call to method above                                                                                                                        |
|`def method(s:String)(i:Int)`                                 |method with multiple parameter lists (currying)                                                                                                     |
|`val intermediate = method("hello")`<br>`intermediate(5)`|apply parameter lists at different places in your code and pass "the incomplete call" around. in java, you would use a builder for this.|
|  <h2 id="object_orientation">Declarations related to OO</h2>                                                     |                 |
|`class Foo`                          |class declaration - nested declaration also possible                                                                                           |
|`class Foo(var x:String, val y:Int)` |class declaration with 2 public fields, one mutable, one immutable. constructor is automatically generated. only new Foo("1",2) is possible    |
| `class Foo {`<br>&nbsp;&nbsp;`var x = 5`<br>&nbsp;&nbsp;`val y = 6`<br>`}`|class like above, but with default constructor, only new Foo() is possible|
|`class Foo {def x = 5}`              |class with default constructor and one method                                                                                                  |
|  `class C(x: R)` <br>`var c = new C(4)`                         |  constructor params - may become private fields automatically depending on their usage|
|`class C(private val x: R)`          |like above, but becomes a private field, no matter if used anywhere                                                                            |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  constructor params - exposed as public field|
|  `class C(var x: R) {`<br>&nbsp;&nbsp;`assert(x > 0, "positive please") //class body = constructor`<br>&nbsp;&nbsp;`var y = x // public field`<br>&nbsp;&nbsp;`val readonly = 5 // readonly field`<br>&nbsp;&nbsp;`private var secret = 1 // private field`<br>&nbsp;&nbsp;`def this = this(42) // alternative constructor`<br>`}`|all alternative constructors must call the main constructor declared at the class declaration.|
|`new{ ... }`                         |anonymous class. added methods and fields are accessible anyhow (see structural types).                                                        |
|`new Foo {...}`                      |anonymous subclass of Foo. Foo might be a class or a trait                                                                                     |
|`abstract class D { ... }`           |define an abstract class. (non-createable, you have to create a subclass)                                                                      |
|`class C extends D { ... }`          |define an inherited class.                                                                                                                     |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  inheritance and constructor params
|`abstract class Foo {def bar:String}`|skipping the body of a def/val makes it abstract - class needs "abstract" keyword, def/val doesn't.                                            |
|`class SubFoo extends Foo {`<br>&nbsp;&nbsp;`def bar = "no override keyword"`<br>&nbsp;&nbsp;`override def toString = "needs override keyword"`<br>`}`|keyword is required for non-abstract methods|
|`classOf[String]`                    |class literal.                                                                                                                                 |
|`x.isInstanceOf[String]`             |type check (runtime)                                                                                                                           |
|`x.asInstanceOf[String]`             |type cast (runtime)                                                                                                                            |
|`case class Foo; case object Bar`    |keyword "case" makes the compiler generate equals & hashcode methods for that class. also, constructor params are always public readonly fields|
|  <h2 id="functiondeclaration">Declaring functions</h2>                                                                       |                 |
|`(i:Int) => i+1`                                    |creates a function.                                                                                                           |
|`var func = (i:Int) => i+1`                         |creates a function and stores it in a variable                                                                                |
|`func(5)`                                           |executing the function above                                                                                                  |
|`def func = (i:Int) => i+1`                         |creates a function each time the method is called and returns that function, not i+1                                          |
|`val func:(Int) => String = (i:Int) => i.toString`  |just so you know the syntax of a type of a function :)                                                                        |
|`def takesFunction(f:(Int) => String) = f(5)`       |a method that takes the function above as a parameter and calls it. the compiler figures out the return type "string" for you.|
|`def method(i:Int) = t.toString;val func = method _`|"method _" creates a function that delegates its apply-calls to the method                                                    |
|`takesFunction(method)`                             |automatic conversion from method to function                                                                                  |
|`def method(s:String)(s2:String) = s+" "+s2`<br>`val intermediate:(String)=>String = method("hello")`<br>`intermediate("world")`|parameter lists revisited: the intermediate, "incomplete method calls" are functions. the result of the last call is "hello world"|
|`func(5)`<br>`func.apply(5)`|applying parameters to an instance means calling its apply-method|
|`def createFunction = (i:Int) => i+1`<br>`createFunction(5)`|5 is applied to the apply method of the *result* of createfunction|
|  <h2 id="typeinference">Return types and type inference</h2>                                                                       |                 |
|`val x = "hello"`                             |the compiler always picks the most specific type possible, in this case java.lang.String|
|`val x:Serializable = "hello"`                |you can always specify a more general one                                               |
|`def x {print("hello world")}`                |no "=" means the method's return type is Unit, meaning "executable block of code".      |
|  `def x:Unit = {...}`<br>`def x() {...}`|return type Unit can be specified explicitly|
|`val blocks = {{{{5}}}}`                      |return types/values are passed back to the next outer block                             |
|`val block = if (a) foo else bar`             |almost everything is an expression and thus, has a return type.                         |
|`def x = {`<br>&nbsp;&nbsp;`if (System.currentTimeMillis() % 2 == 0) Integer.valueOf(1) else java.lang.Double.valueOf(2)`<br>`}`|the compiler picks the most specific supertype of both Integer and Double which is "java.lang.Number + Comparable"|
|`def x(i:Int):Int = if (i==0) 1 else i*x(i-1)`|recursive methods need an explicit return type. fail.                                   |
|  <h2 id="collections">Scala Collections</h2>                                                                       |                 |
|`1 to 3`<br>`Set(1,2,3)`<br>`Buffer(1,2,3)`<br>`ArrayBuffer(1,2,3)`<br>`ListBuffer(1,2,3)`<br>`List(1,2,3)`<br>`Array(1,2,3)`<br>`Vector(1,2,3)`<br>`Map(1 -> "a", 2 -> "b")`|simple collection creations. scala has mutable and immutable collections.                                                                       |
|`1 :: 2 :: 3 :: Nil`                                                                                                                        |In addition to that, Lists have an alternative syntax                                                                                           |
|`1 #:: 2 #:: 3 #:: Stream.empty`                                                                                                            |Streams also save an alternative syntax                                                                                                         |
|prepend, append, union, remove, insertAll... |the usual methods every collection framework offers are present in scala as well|
|concise versions of common methods:|
|`mutableColl += elem`                                                                                                                       |add element to a collection                                                                                                                     |
|`mutableColl -= elem`                                                                                                                       |remove element                                                                                                                                  |
|`mutableColl ++= elems`                                                                                                                     |add elements                                                                                                                                    |
|`mutableColl --= elems`                                                                                                                     |remove elements                                                                                                                                 |
|`elem +=: mutableColl`                                                                                                                      |adds element at the beginning of a collection                                                                                                   |
|`mutableColl :+= elem`                                                                                                                      |adds element at the end of a collection                                                                                                         |
|`mutableColl(0) = 1`                                                                                                                        |write access by index on mutable collections                                                                                                    |
|`coll(0)`                                                                                                                                   |read access by index                                                                                                                            |
|`coll - elem`                                                                                                                               |create new collection that has all elements of coll except elem                                                                                 |
|`coll ++ elems`                                                                                                                             |create new collection that has all elements of coll and elems                                                                                   |
|`coll -- elems`                                                                                                                             |create new collection that has all elements of coll except elems                                                                                |
|`coll :+ elem`                                                                                                                              |create new collection that has all elements of coll and elem at the end                                                                         |
|`elem +: coll`                                                                                                                              |create new collection that has all elements of coll and elem at the beginning                                                                   |
|`immutableColl +=, -=, ++=, --=, +=:, :+= elem`                                                                                             |same as the operations without "=", but works only if "immutableColl is a var, not a val. the created collection is assigned to "immutableColl".|
|`def isEven(i:Int= if (i%2==0) true else false`<br>`val evenNumbers:List[Int] = List(1,2,3,4).filter(isEven)`|scala collections are a major epic win. they have ~100 methods which operate on the data of a collection and there is *absolutely nothing* you cannot do with them.|
|`val evenNumbers:List[Int] = List(1,2,3,4).filter((i:Int)=> i%2==0)`                                                                        |same as above, just shorter                                                                                                                     |
|`val evenNumbers = List(1,2,3,4).filter(i => i%2==0)`                                                                                       |same as above, just shorter. () can be skipped if there is only one parameter. parameter type(s) can be inferred                                |
|`val evenNumbers = List(1,2,3,4).filter(_ % 2 == 0)`                                                                                        |same as above, just shorter. parameter(s) can be replaced by "_" if every parameter is used once and in order                                   |
|`val doubleNumbers = List(1,2,3,4).map(_ * 2)`                                                                                              |for the non functional programmers: map means convert                                                                                           |
|`listOfManyPersons.filter(_.hasChildren).map(_.getChildren)`                                                                                |collection operations can be chained. anything can be done without loops                                                                        |
|`List(1,2,3,4,5).foreach(println)`                                                                                                          |do something with every element                                                                                                                 |
|`List(1,2,3,4,5).par.filter(_ % 2 == 0)`                                                                                                    |is executed in parallel just like that                                                                                                          |
|`List(1).toSet.toArray.toBuffer.iterator.toStream.toSeq`                                                                                    |conversions are easy                                                                                                                            |
|`Iterator.continually(randomNumber)`                                                                                                        |collections and iterators can also be created from functions and methods                                                                        |
|`Iterator.continually(randomNumber).take(100).max`                                                                                          |highest of 100 random numbers.                                                                                                                  |
|`Iterator.continually(randomThings).take(100).maxBy(comparisonFunction)`                                                                    |highest of 100 random things. as above, but can be used for anything.                                                                           |
|`hashmap.getOrElseUpdate(key, methodThatCreatesTheValueInCaseItDoesNotExist)`                                                               |admit it, you wanted to do this in java for at least a decade                                                                                   |
| <h2 id="fold">The power of collections and functions</h2>|
| using closures, it is possible to avoid repetitions of boilerplate - instead you pass a function to a method that hides the boilerplate. apart from filter and map, two other epic wins are reduce and fold.|
|`List(1,2,3,4,5).reduce((i,i2) => i+i2)`                                  |result: ((((1+2)+3)+4)+5). reduce takes 2 elements and merges them into one. 1,2,3,4,5 -> 3,3,4,5 -> 6,4,5 -> 10,5 -> 15|
|`List(1,2,3,4,5).reduce(_ + _)`                                           |same as above, using "_" for the first and second parameter                                                             |
|`List(1,2,3,4,5).fold(0)((sumSoFar,element) => sumSoFar+element)`         |same as above, but fold uses an explicit start value                                                                    |
|`List(1,2,3,4,5).fold(0)(_ + _)`                                          |same as the fold above, just shorter                                                                                    |
|`"comma separated numbers: " + List(1, 2, 3, 4, 5).fold("")(_ + ", " + _)`|finally, you won't have to fiddle around with the last "," anymore!                                                     |
|in java this would all look like:<br>`Acc acc = ?;`<br>` for (T t: coll) {if (acc==null) {acc = t;} else {acc = doStuff(acc,t);}}`|this is boilerplate code you can avoid *every single time!*. write only what (doStuff) should happen, not "what and how" (boilerplate code + doStuff).|
|where else could you save boilerplate? think about it!<br>try-catch-finally. define your error handling once, and just inject your logic there. no need to copy & paste your try-catch blocks anywhere
| <h2 id="generics">Generics</h2>|
|`def foo[BAR](bar:BAR):BAR = bar`                                   |simple type parameter, can be anything                                                                                                                                       |
|`def foo[BAR <: java.lang.Number](bar: BAR) = bar.doubleValue() + 5`|upper bound, BAR must be a java.lang.Number or a subclass of it                                                                                                              |
|`def foo[BAR >: java.lang.Number](bar: BAR) = bar`                  |lower bound, type must be java.lang.Number or a superclass of it. you can still pass a double, but the type parameter and therefore the return type will be java.lang.Number.|
|`val strings:List[String] = List("hello","generics")`<br>`val objects:List[java.lang.Object] = strings`|type parameters of collections are covariant. they "inherit" the relations of their type parameters. in java, have to do an ugly cast:<br>`List<Integer> ints = new ArrayList<Integer>()`;<br>`List<Number> numbers = ((List<Number)((Object)ints)`|
|`class InVariant[A]`                                                |class having an invariant type parameter, meaning `val InVariant[AnyClass] = inVariantWithAnyOther` does not compile                                                         |
|`class CoVariant[+A]`                                               |class having a covariant type parameter, meaning `val CoVariant[SuperClass] = coVariantWithSubClass` compiles                                                                |
|`class ContraVariant[-A]`                                           |class having a contravariant type parameter, meaning `val ContraVariant[SubClass] = contraVariantWithSuperclass` compiles                                                    |
|where does "-Type" make sense? take a look at functions:<br>`val func:(String) => java.lang.Number`|the return type is +, the parameter is -, so the function can be replaced by one declared like<br>`val func2:(java.lang.Object) => java.lang.Integer`<br>Think about it. a function that can take any object can also take a string. a function that returns an integer automatically returns a number, so the second one can replace the first one in every possible case.|
|`def foo[A, B[A]] (nested: B[A])`                                   |nested type parameters are possible. "nested" must be of a type that has a type parameter, for example List[Int]                                                             |
|`def foo[A, B, C <: B[A]](nested: C))`                              |same as above, using an alias for B[A] named C                                                                                                                               |
|`def foo[C <: Traversable[_]] (nested: C) = nested.head`            |_ means "i don't care what it is". return type still is what you expect                                                                                                      |
|`foo(List(5))`                                                      |call to the method above, returns an Int. the compiler can infer type parameters in many cases.                                                                              |
|`call[String,Int,BigInt,Long](....)`                                |example call to a method with 4 type parameters                                                                                                                              |
|`def foo[A: Manifest] {`<br>&nbsp;&nbsp;`val classAtRuntime = manifest[A].erasure; `<br>&nbsp;&nbsp;`println(classAtRuntime);`<br>`}`|type parameter is available at runtime via `manifest[TYPEPARAM]`|
|`foo[String]`                                                       |call to method above, prints "class java.lang.String"                                                                                                                        |
|`def foo[A <: Bar with Serializable with Foobar]`                   |A must be a subtype of Bar, implement Serializable and also Foobar at the same time                                                                                          |
|<h2 id="option">Option aka "Avoid NullPointerExceptions with type safety"</h2>
|`def neverReturnsNull:Option[Foo] = ....`                                                      |simple convention: if a parameter or return type can be null, wrap it in an Option instead.                                   |
|`if (neverReturnsNull.isEmpty) fail(); else success(neverReturnsNull.get);`                    |now the caller knows a method might return nothing                                                                            |
|`val modified = neverReturnsNull.map(notNullInHere => doStuffAndReturnNewResult(notNullInHere)`|the mapping function is applied to the contained value if there is one.                                                       |
|example:<br>`val maybeString:Option[String] = ....`<br>`val mayBeNumber:Option[Int] = maybeString.map(Integer.parseInt)`|if there was a string like "42", there now is a number 42. if there was an empty option, we still have that empty option. (all empty options are the same instance)|
|`val emptyOption:Option[Foo] = None`                                                           |None is our empty option singleton. by type system magic, it is a subclass of any option and can therefore replace any option.|
|`val filledOption:Option[Foo] = Some(new Foo)`                                                 |Some(x) creates an option around x. if you pass null, None is returned                                                        |
|`val unsafelyAccessed = option.get`                                                            |unsafe access is possible, will throw an exception if option is empty                                                         |
|`val safelyAccessed = option.getOrElse(bar)`                                                   |gets the content of the option or "bar" if the option is empty                                                                |
|`val firstNonEmptyOption = option.orElse(option2).orElse(option3)`                             |no need for if-else here                                                                                                      |
|`option.toList`                                                                                |creates an empty or one element list                                                                                          |
|<h2 id="objects">Objects</h2>|
|`object Foo {val bar = "hello"}`|similar to "static" in java, but it is a real singleton||
|`Foo.bar`                                                         |field access and method calls work like "Foo" is a val pointing at the object instance                |
|`object Foo {def apply(s:String) = Integer.parseInt(s)}`          |Foo("5") becomes Foo.apply("5"). remember Some(x)? it was the same here.                              |
|`class Foo;object Foo`                                            |this is possible. the object Foo is then called a companion object.                                   |
|`object Foo {def apply(i:Int) = new Foo(i+1)}`                    |you can use methods in the object Foo as factory methods to keep the actual constructor nice and clean|
|`def apply[A](x: A): Option[A] = if (x == null) None else Some(x)`|this is what happens when you call Some(x)                                                            |
|<h2 id="Tuples">Tuples</h2>|
|`val x:(Int, Int) = (1,2)`            |Group things together and pass them around as one object without creating a special class          |
|`x._1`                                |access the first element of a tuple                                                                |
|`def takesTuple(p:(Int, String) {...}`|method accepting a tuple                                                                           |
|`takesTuple(5,"hello)`                |the compiler is smart enough to interpret (5, "hello") as a tuple and pass it to the method        |
|`takesTuple((5,"hello))`              |same as above, but explicitly creating the tuple                                                   |
|`coll zip coll2`                      |creates a list of tuples, for example `List(1,2) zip List("a","b")` becomes `List((1,"a"),(2,"b"))`|
|<h2 id="pattermatching">Pattern matching</h2>|
|`x match {`                                                 |scala has a very powerful switch                                                                                                                                                           |
|&nbsp;`case "hello" => {...}`                               |gets executed if x equals "hello". is tested via equals                                                                                                                                    |
|&nbsp;`case s:String => {...}`                              |gets executed if x is any string. s then exists in the code block as a val.                                                                                                                |
|&nbsp;`case i:Int if i < 10 => {...}`                       |gets executed if x is any Int < 10. i then exists in the code block as a val.                                                                                                              |
|&nbsp;`case 11 *pipe* 12 *pipe* 13 => {...}`                |matches on more than one value.                                                                                                                                                            |
|&nbsp;`case _ => `                                          |default case, always matches                                                                                                                                                               |
|`}`                                                         |these were just the boring cases :)                                                                                                                                                        |
|`val matchOnMe = ...`                                       |needed for next match                                                                                                                                                                      |
|`x match {`                                                 |scala can also match on values *inside* x                                                                                                                                                  |
|&nbsp;`case Some(e) => {...}`                               |matches if x is a Some. e then exists as a val inside the following code block                                                                                                             |
|&nbsp;``case Some(`matchOnMe`) => {...}``                   |extracts the value of "x" and compares it to "matchOnMe"                                                                                                                                   |
|&nbsp;`case Some(matchOnMe) => {...}`                       |name shadowing.                                                                                                                                                                            |
|&nbsp;`case List(_, _, 3, y, z) if z == 5 => {...}`         |matches if x is a list of size 5 which has a 3 at index 3 and if the fifth element is 5. the fourth element of the list then exists as "y" inside the code block, the last one does as "z".|
|&nbsp;`case _ :: _ :: 3 :: y :: z :: Nil if z == 5 => {...}`|same as above.                                                                                                                                                                             |
|`}`                                                         |how the hell did that work? see below                                                                                                                                                      |
|<h2 id="unapply">Destructuring</h2>|
|`object Foo { def unapply(i: Int) = if (i%2==2) Some("even") else None`|pattern matching uses unapply                                                                                                        |
|`val Foo(infoString) = 42`                                             |42 is passed to unapply. if the result is an option, its value is now stored in "infoString"                                         |
|`42 match {case Foo(infoText) => {...}}`                               |if some is returned, the match is considered positive and the options value is bound to a val                                        |
|`42 match {case Foo("even") => {...}}`                                 |or it is tested for equality against a given value or instance                                                                       |
|`41 match {case Digits(a,b) if (a == 4) => {...}}`                     |if the returned option contains a tuple instead of a single value, you can access all the tuples fields. (i made up the Digit-object)|
|`unapplySeq(foo:Foo):Option[Seq[Bar]]`                                 |like unapply, but offers special features for matching on sequences                                                                  |
|`val List(a,b@_*) = List("hello","scala","world")`                     |a = "hello", b = List("scala", "world")                                                                                              |
|`val a::tl = List("hello", "scala", "world"`                           |same as above using alternative list syntax                                                                                          |
|`val List(a,_*) = List("hello","scala","world")`                       |sams as above, but discards the last 2 elements, b does not exist                                                                    |
|For case classes, an unapply method is automatically generated|
|<h2 id="traits">Traits</h2>|
|`trait Foo {`                                                   |Like a java interface, but more powerful. you can:                                                                                                       |
|&nbsp;&nbsp;`def getBar():Bar`                                  |define abstract methods like in a java interface                                                                                                         |
|&nbsp;&nbsp;`def predefinedMethod(s:String) = "hello world" + s`|add non-abstract methods as well. the Ordered-trait (look it up) expects has an abstract compare-method and 4 others (<, >, <=, >=) which are based on it|
|&nbsp;&nbsp;`val someVal = "someString"`                        |traits can also contain fields                                                                                                                           |
|`}`                                                             |but that's not all!                                                                                                                                      |
|`trait Plugin extends java.lang.Object {`                       |a trait can "extend" any existing class or trait. "Plugin" here is restricted to classes which it extends                                                |
|&nbsp;&nbsp;`override int hashcode = {....}`<br>&nbsp;&nbsp;`override int equals(other:Object) = {....}`|you can override a method of the class the trait extends. this way, you can add a trait to a class instead of manually overriding the method|
|&nbsp;&nbsp;`override boolean add(t:T) = {`<br>&nbsp;&nbsp;`println(t +" is about to be added to the collection")`<br>`super.add(t)`<br>`}`|example: Logging. Another one: The MultiMap-trait which can extend maps.|
|`}`                                                             |these traits are called mixins. they can also override each other. from inside the trait, "super" refers to whatever they extend.                        |
|`new Foo extends FirstTrait with BarTrait with SomeOtherTrait`  |create a new instance of foo implementing 3 traits. the first one is extended, the next n are "withed".                                                  |
|`class Foo extends BarTrait`                                    |declaring a class which implements Bar directly                                                                                                          |
|`class Foo extends BarTrait with Serializable`                  |first extends, then with                                                                                                                                 |
|`class A extends B with C with D with E`                        |inside E, super refers to D. inside D, super refers to C, and so on.                                                                                     |
|  <h2 id="packages">packages</h2>                                                                         |                 |
|`import scala.collection._`                |wildcard import.                      |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  selective import. |
|`import scala.collection.{Vector => Vec28}`|renaming import.                      |
|`import java.util.{Date => _, _}`          |import all from java.util except Date.|
|  `package pkg` _at start of file_ <br> `package pkg { ... }`                                             |  declare a package. |
|  <h2 id="control_constructs">control constructs</h2>                                                     |                 |
|`if (check) happy else sad`                       |conditional.                                                                                                      |
|  `if (check) happy` _same as_ <br> `if (check) happy else ()`                                            |  conditional sugar. |
|`while (x < 5) { println(x); x += 1}`             |while loop.                                                                                                       |
|`do { println(x); x += 1} while (x < 5)`          |do while loop.                                                                                                    |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>&nbsp;&nbsp;`    for (x <- xs) {`<br>&nbsp;&nbsp;&nbsp;&nbsp;`        if (Math.random < 0.1) break`<br>&nbsp;&nbsp;`    }`<br>`}`|  break. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)) |
|`for (i <- 1 to 10 {doStuffWith(i)}`              |most basic "for loop" aka "for comprehension". the compiler turns it into `1 to 10 foreach {i => *block content*}.|
|`for (i <- 1 to 10 if i % 2 == 0) {}`             |conditions are possible                                                                                           |
|`for (i <- 1 to 10;i2 <- 1 to 10) {println(i+i2)}`|no need for nested fors                                                                                           |
|`val evenNumbers = for (i <- 1 to 10) yield (i*2)`|yield means "the loop should return that". in this case, you get all even numbers from 2 to 20                    |
|  `for (x <- xs if x%2 == 0) yield x*10` _same as_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  what you write, and what the compiler does |
|`for ((x,y) <- xs zip ys) yield x*y`              |pattern matching works in here                                                                                    |
|<h2 id="implicit conversions">Implicits</h2>|
|`implicit`                                             |mystic keyword. can be attached to vals, vars, defs and objects and method parameters                 |
|`def parseInt(s:String) = Integer.parseInt(s)`         |simple string -> int method                                                                           |
|`implicit def parseInt(s:String) = Integer.parseInt(s)`|implicit string -> int method. it still can be used as a normal method, but it has one special feature|
|`val i:Int = "42"`                                     |the code becomes `val i = parseInt("42")` because a matching implicit conversion is in code           |
|`implicit def attachMethod(i:Int) = new {def tenTimes = i*10}`<br>`val i:Int = 42`<br>`println(i.tenTimes)`|the compiler will look for a conversion to make this code valid. this is a common pattern to attach methods to objects. for a great example, take a look at ScalaTest|
|`abstract class GenericAddition[T] {def add(t:T,t2:T):T}`<br>`implicit object IntAddition extends GenericAddition[Int] {`<br>&nbsp;&nbsp;`def add(t:Int, t2:Int) = t+t2`<br>`}`|an implicit object|
|`def addTwoThings[T](t:T, t2:T)(implicit logicToUse:GenericAddition[T]) = `<br>&nbsp;&nbsp;`logicToUse.add(t,t2)`|method using a second implicit parameter list|
|`addTwoThings(1,2)(IntAddition)`                       |call to method above. so far, no magic involved.                                                      |
|`addTwoThings(1,2)`                                    |the compiler will look for a matching implicit object/val in scope                                    |
|<h2 id="types">Abstract types</h2>|
|`type Str = String`                            |simple alias. Str and String are equal for the compiler                                                                                                                |
|`type Complex[A] = (String,String,String,A)`   |"Complex" is called a type contructor, and A is its parameter. declare something as Complex[Int] and its type is equal to that of a (String, String, String, Int)-tuple|
|`type StructualType = {def x:String;val y:Int}`|structural type.                                                                                                                                                       |
|`val st:StructuralType = new Foo`              |possible if Foo has a method x:String and field y:Int, no interface needed                                                                                             |
|`st.x`                                         |calls are made via reflection, but they are safe - you cannot mess it up at compile time                                                                               |
|`class X {type Y <: Foo}`                      |types can be clared in classes and traits and overridden in subclasses. upper and lower bounds apply here, too.                                                        |
|`type X = {type U = Foo}`                      |types can be nested. for a possible use case, see http://etorreborre.blogspot.com/2011/11/practical-uses-for-unboxed-tagged-types.html                                 |
|`this.type`                                    |refers to the type "this" has. example: `def cloneOfMe:this.type`. a subclass will automatically return it's own type, not the parent type.                            |
|<h2 id="freeeeeeedom">For java programmers: Lifted restrictions / Important differences</h2>|
|If you are coming from java, you might have gotten used to several restrictions and might not even try to do it in scala because you expect it not to work. here is what does work in scala, but not in java|
|`a == b`                                                |this is a null safe call to equals. if you want a check by reference, use "eq" instead of "=="                                                                                                                |
|`var x = 0`<br>`1 to 10 foreach {i => {`<br>&nbsp;&nbsp;`println("changing x from inside another class")`<br>&nbsp;&nbsp;`x += i`<br>`}`|in java, you cannot access local variables from anonymous classes unless they are final. in scala, you can.|
|`class Foo {def x = "a"}`<br>`class Bar extends Foo {override val x = "b"}`|parameterless methods can be overridden by readonly fields|
|`def allExceptionsAreEqual = throw new CheckedException`|the compiler handles all exceptions like runtimeexceptions. the common case is that a caller doesn't care about exceptions and just lets them propagate up to the top level where they are logged and handled.|
|`List[Int]`                                             |primitives are possible as generic types. no need to use java.lang.Integer                                                                                                                                    |