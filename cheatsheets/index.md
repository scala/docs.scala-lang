---
layout: cheatsheet
title: Scalacheat
by: (initial version: Brendan O'Connor) HamsterofDeath
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
|  `def x:String = {`<br>&nbsp;&nbsp;`val x = 1`<br>&nbsp;&nbsp;`return "hello world"+1`<br>`}`                 | multiple statements need {} around the code                      |
| `def x = "hello world"`|return keyword and return type declaration are optional, but if a method contains return, the return type *must* be specified explicitly. default return value = last value in code block. 
|`def iAcceptVarArgs(i:Int,s:String,d:Double*) = {...}`|method accepting varargs|
|`def x = {def y = 7;y}` | nested declarations are possible|
|<h2 id="primitive types">Primitive types</h2>|
|`Byte, Char, Boolean, Double, Float, Long, Int, Short`|Primitive types. These are automatically boxed or unboxed, no need to use their java.lang.Number-counterparts anywhere. I use java.lang.Integer and friends in this sheet to be friendly to java devs and because i use their type hierarchy for examples.|
|<h2 id="syntax details">Syntax details</h2>|
|just a few things that didn't fit anywhere else||
|`instance.bar`|bar can be a reading field access or a parameterless method call. scala doesn't make a difference. this means you can easily switch between def and val without the need for a refactoring|
|`instance.bar()`|for method calls, you can add (). by convention, methods without () don't change any states and just return a calculated value. methods with () are called for their effects - for example changing a value, printing something on the console and so on|
|`instance bar`|you can skip the "." if it is obvious to the compiler what you mean. humans and the compiler usually agree if there is an instance on the left and a method of that instance on the right. this is useful for DSLs|
|`println {"hello world"}`|if a method has one parameter, you can also pass a block instead of using (). also useful for DSLs|
|  <h2 id="declarations2">Not so basic declarations</h2>                                                                       |                 |
| `val x = {`<br>&nbsp;&nbsp;`class y(val z: String)`<br>&nbsp;&nbsp;`new y("hello").z`<br>`}`<br><span class="label important">Bad</span>`val foo = new y("does not work outside the block above")`| everything can be nested in anything, but everything can only be accessed in its scope|
| `lazy val x = expensiveOperation()`|the expensive operation is executed once as soon as the value of x is needed, not before. from then on, the calculated value is returned. the access is threadsafe.|
| `def method(a:String = "hello", b:String = "world") = a+" "+b`|a method with default parameters|
| `method("goodbye")`|call to method above, unspecificed parameters will get default values. returns "goodbye world"|
| `method(b = "friend")`|call to method above, explicitly passes a string to b. a defaults to "hello". returns "hello friend"|
|`def method(param: => String)`|"=>" means that when "method" is called, the parameter is wrapped in a parameterless function which is executed inside the method body when the parameter is accessed. the parameter is evaluated every time when needed (see Iterator.continually). the value is not cached. if you want it to be cached, pass something that returns the value of a lazy val.|
|`def makeString = method {"hello "+"world" + System.nanoTime}`|example call to method above|
|`def method(s:String)(i:Int)`|method with multiple parameter lists|
|`val intermediate = method("hello")`<br>`intermediate(5)`|why? because you can apply one parameter list at once and the next ones later and pass "the incomplete call" around. in java, you would use a builder for this.|
|  <h2 id="object_orientation">Declarations related to OO</h2>                                                     |                 |
| `class Foo`| class declaration - nested declaration also possible|
| `class Foo(var x:String, val y:Int)`| class declaration with 2 public fields, one mutable, one immutable. constructor is automatically generated. only new Foo("1",2) is possible|
| `class Foo {`<br>&nbsp;&nbsp;`var x = 5`<br>&nbsp;&nbsp;`val y = 6`<br>`}`|class like above, but with default constructor, only new Foo() is possible|
| `class Foo {def x = 5}`|class with default constructor and one method|
|  `class C(x: R)` <br>`var c = new C(4)`                         |  constructor params - automatically turn into private fields if they used after construction, for example in public methods. if not, the compiler doesn't generate fields for the params|
|`class C(private val x: R)`|like above, but private field forced|
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  constructor params - exposed as public fields (forced)|
|  `class C(var x: R) {`<br>&nbsp;&nbsp;`assert(x > 0, "positive please") //class body = constructor`<br>&nbsp;&nbsp;`var y = x // public field`<br>&nbsp;&nbsp;`val readonly = 5 // readonly field`<br>&nbsp;&nbsp;`private var secret = 1 // private field`<br>&nbsp;&nbsp;`def this = this(42) // alternative constructor`<br>`}`|simple example covering the common use cases. note: all alternative constructors must call the main constructor declared at the class declaration. this might sound restrictive, but it will prevent forgotten initializations|
|  `new{ ... }`                                                                                            |  anonymous class. you can still call methods you add to an anonymous class (see structural types). this is impossible in java.|
|`new Foo {...}`|anonymous subclass of Foo. Foo might be a class or a trait|
|  `abstract class D { ... }`                                                                              |  define an abstract class. (non-createable, you have to create a subclass) |
|  `class C extends D { ... }`                                                                             |  define an inherited class. |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  inheritance and constructor params
|`abstract class Foo {def bar:String}`|skipping the body of a method or value of a val makes the method/val abstract. no need for an "abstract" keyword. overriding an abstract def or val doesn not require an "override" keyword. overriding a non abstract def or val does.|
|  `classOf[String]`                                                                                       |  class literal. |
|  `x.isInstanceOf[String]`                                                                                |  type check (runtime) |
|  `x.asInstanceOf[String]`                                                                                |  type cast (runtime) |
|`case class Foo; case object Bar`|the keyword "case" makes the compiler generate equals & hashcode methods for that class. also, constructor params are always public readonly fields|
|  <h2 id="functiondeclaration">Declaring functions</h2>                                                                       |                 |
| `(i:Int) => i+1`|creates a function.| 
| `var func = (i:Int) => i+1`|creates a function and stores it in a variable|
| `func(5)`|executing the function above|
| `def func = (i:Int) => i+1`|creates a function each time the method is called and returns that function, not i+1|
|`val func:(Int) => String = (i:Int) => i.toString`|just so you know the syntax of a type of a function :)|
|`def takesFunction(f:(Int) => String) = f(5)`| a method that takes the function above as a parameter and calls it. the compiler figures out the return type "string" for you.|
|`def method(i:Int) = t.toString;val func = method _`|appending an "_" converts any method into a function by creating a function with the same parameter and return types which internally calls the method|
|`takesFunction(method)`|is also possible, the compiler does the conversion for you in obvious cases|
|`def method(s:String)(s2:String) = s+" "+s2`<br>`val intermediate:(String)=>String = method("hello")`<br>`intermediate("world")`|parameter lists revisited: the intermediate, "incomplete method calls" are functions. the result of the last call is "hello world"|
|`func(5)`<br>`func.apply(5)`|what you are actually calling is the apply-method of a function instance, but you don't have to explicitly write that. if no method name is given, the compiler assumes you want to call "apply"|
|`def createFunction = (i:Int) => i+1`<br>`createFunction(5)`|if you have read the syntax section above, you can figure out what happens here. first, createFunction is called without () and without a parameter. then, 5 is applied to the apply method of the *result* of createfunction|
|  <h2 id="typeinference">Return types and type inference</h2>                                                                       |                 |
|  `val x = "hello"`|the compiler always picks the most specific type possible, in this case java.lang.String|
|  `val x:Serializable = "hello"`|you can always specify a more general one|
|  `def x {print("hello world")}`                 | no "=" means the method's return type is Unit, meaning "executable block of code". that Unit is either passed around via being wrapped in a function and executed later, or it is executed immediately in which case the return type is void. you cannot do both at the same time.| 
|  `def x:Unit = {...}`<br>`def x() {...}`|leaving out the "=" at a method declaration is the same as specifying "Unit"|
| `val blocks = {{{{5}}}}`|every block has a return type that is passed back to the next outer block|
| `val block = if (a) foo else bar`|almost everything is an expression and thus, has a return type. this includes if-else-structures|
|`def x = {`<br>`if (System.currentTimeMillis() % 2 == 0) Integer.valueOf(1) else java.lang.Double.valueOf(2)`<br>`}`|here, the compiler picks the most specific supertype of both Integer and Double which is java.lang.Number (this is a lie)|
|`def x(i:Int):Int = if (i==0) 1 else i*x(i-1)`|recursive methods need an explicit return type. fail.|
|  <h2 id="collections">Scala Collections</h2>                                                                       |                 |
|`1 to 3, Set(1,2,3), Buffer(1,2,3), ArrayBuffer(1,2,3), ListBuffer(1,2,3), List(1,2,3), Array(1,2,3),Vector(1,2,3), Map(1 -> "a", 2 -> "b")`|simple collection creations. scala has mutable and immutable collections.|
|`1 :: 2 :: 3 :: Nil`|In addition to that, Lists have an alternative syntax|
|`1 #:: 2 #:: 3 #:: Stream.empty`|Streams also save an alternative syntax|
|prepend, append, union, remove, insertAll... |the usual methods every collection framework offers are present in scala as well|
|if you like to use operators instead, there are some scary but concise ones. you'll need some practice to get them right:<br>+,++,++=,++:=-,--,--=,:+,:++,:=+,+=:,:++=,++:=, ++=:|method name rules:<br>"+" means add<br>"-" means remove<br>"++" or "--" mean add/remove many elements, not just one<br>"=" either means "modify mutable collection" or "assign new immutable collection to the var". in the reassign case, "=" is appended to the actual method name, just like "int i=0;i+=1" in java. <br>if a method contains ":" it is an add to an ordered collection, either at the beginning or the end of the collection<br>":" goes on the side of the target collection and is always the first or last character of a method name. if a method ends with :=, the method actually ends with : and = means it's a reassignment|
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
|`hashmap.getOrElseUpdate(key, methodThatCreatesTheValueInCaseItDoesNotExist)`|admit it, you wanted to do this in java for at least a decade|
| <h2 id="fold">The power of collections and functions</h2>|
| using closures, it is possible to avoid repetitions of boilerplate - instead you pass a function to a method that hides the boilerplate. apart from filter and map, two other epic wins are reduce and fold.|
|`List(1,2,3,4,5).reduce((i,i2) => i+i2)`|result: ((((1+2)+3)+4)+5). in human speech, it takes 2 elements and merges them into one. imagine the collection turning from 1,2,3,4,5 into 3,3,4,5. then repeat:6,4,5 -> 10,5 -> 15|
|`List(1,2,3,4,5).reduce(_ + _)`|same as above, using "_" for the first and second parameter|
|`List(1,2,3,4,5).fold(0)((sumSoFar,element) => sumSoFar+element)`|same as above, but fold uses an explicit start value|
|`List(1,2,3,4,5).fold(0)(_ + _)`|same as the fold above, just shorter|
|`"comma separated numbers: " + List(1, 2, 3, 4, 5).fold("")(_ + ", " + _)`|finally, you won't have to fiddle around with the last "," anymore!|
|in java this would all look like:<br>`Acc acc = ?;`<br>` for (T t: coll) {if (acc==null) {acc = t;} else {acc = doStuff(acc,t);}}`|this is boilerplate code you can avoid *every single time!*. write only what (doStuff) should happen, not "what and how" (boilerplate code + doStuff).|
|where else could you save boilerplate? think about it!<br>try-catch-finally. define your error handling once, and just inject your logic there. no need to copy & paste your try-catch blocks anywhere
| <h2 id="generics">Generics</h2>|
| `def foo[BAR](bar:BAR):BAR = bar`|simple type parameter, can be anything|
| `def foo[BAR <: java.lang.Number](bar: BAR) = bar.doubleValue() + 5`|upper bound, BAR must be a java.lang.Number or a subclass of it|
| `def foo[BAR >: java.lang.Number](bar: BAR) = bar`|lower bound, type must be java.lang.Number or a superclass of it, but not a subclass of java.lang.Number. note that you can still pass a double, but the type parameter and therefore the return type will be java.lang.Number. the bound applies to the type parameter itself, not the type of the parameter that is passed to the function|
|`val strings:List[String] = List("hello","generics")`<br>`val objects:List[java.lang.Object] = strings`|in scala, type parameters of collections are covariant. this means they "inherit" the inhertance relations of their type parameters. in java, have to do an ugly cast:<br>`List<Integer> ints = new ArrayList<Integer>()`;<br>`List<Number> numbers = ((List<Number)((Object)ints)`|
|`class InVariant[A]`|class having an invariant type parameter, meaning `val InVariant[AnyClass] = inVariantWithAnyOther` does not compile|
|`class CoVariant[+A]`|class having a covariant type parameter, meaning `val CoVariant[SuperClass] = coVariantWithSubClass` compiles|
|`class ContraVariant[-A]`|class having a contravariant type parameter, meaning `val ContraVariant[SubClass] = contraVariantWithSuperclass` compiles|
|where does "-Type" make sense? take a look at functions:<br>`val func:(String) => java.lang.Number`|the return type is +, the parameter is -, so the function can be replaced by one declared like<br>`val func2:(java.lang.Object) => java.lang.Integer`<br>Think about it. a function that can take any object can also take a string. a function that returns an integer automatically returns a number, so the second one can replace the first one in every possible case.|
|`def foo[A, B[A]] (nested: B[A])`|nested type parameters are possible. nested must be of a type that has a type parameter. for example, you could pass a List[Int]|
|`def foo[A, B, C <: B[A]](nested: C))`|same as above, using an alias for B[A] named C|
|`def foo[C <: Traversable[_]] (nested: C) = nested.head`|if there is no need to access the inner type explicitly, it can be replaced by an _. in this example, the compiler infers that the return type must be whatever _ is, so the actual return type depends on the call site.|
|`foo(List(5))`|call to the method above, returns an Int. the compiler can infer type parameters in many cases. sometimes you have to help it:|
|`call[String,Int,BigInt,Long](....)`|example call to a method with 4 type parameters|
|`def foo[A: Manifest] {`<br>&nbsp;&nbsp;`val classAtRuntime = manifest[A].erasure; `<br>&nbsp;&nbsp;`println(classAtRuntime);`<br>`}`|Adding ":Manifest" will make the compiler add magic so you can get the type parameter at runtime via `manifest[TYPEPARAM]`|
|`foo[String]`|call to method above, prints "class java.lang.String"|
|`def foo[A <: Bar with Serializable with Foobar]`|A must be a subtype of Bar, implement Serializable and also Foobar at the same time|
|<h2 id="option">Option aka "Avoid NullPointerExceptions with type safety"</h2>
|`def neverReturnsNull:Option[Foo] = ....`|in scala, you can use the type system to tell the caller of a method whether or not "null" is a valid return or parameter value. the way scala offers is "Option". you can follow a simple convention: if a parameter or return type can be null, wrap it in an Option instead.|
|`if (neverReturnsNull.isEmpty) fail(); else success(neverReturnsNull.get);`|this forces the caller to at least be aware of the fact that he/she should check for null explicitly.|
|`val modified = neverReturnsNull.map(notNullInHere => doStuffAndReturnNewResult(notNullInHere)`|you can use options like collections. the conversion/mapping function is applied to the contained value if there is one. there is also a toList-method to convert any option into an empty or a one element list.|
|example:<br>`val maybeString:Option[String] = ....`<br>`val mayBeNumber:Option[Int] = maybeString.map(Integer.parseInt)`|this is perfectly safe (let's assume that the string can be parsed, we ignore exceptions here). if there was a string, there now is a number. if there was an empty option, we still have that empty option. (all empty options are actually the same instance)|
|`val emptyOption:Option[Foo] = None`|None is our empty option singleton. by type system magic, it is a subclass of any option and can therefore replace any option.|
|`val filledOption:Option[Foo] = Some(new Foo)`|Some(x) creates an option around x. if you pass null, None is returned|
|`val unsafelyAccessed = option.get`|the compiler does not force you to check if an option is filled|
|`val safelyAccessed = option.getOrElse(bar)`|gets the content of the option or "bar" if the option is empty|
|`val firstNonEmptyOption = option.orElse(option2).orElse(option3)`|no need for if-else|
|<h2 id="objects">Objects</h2>|
|`object Foo {val bar = "hello"}`|declared like a class, but "simply exists", similar to "static" in java. however, it is a real singleton so it can be passed around as an object.|
|`Foo.bar`|field access and method calls work like "Foo" is a val pointing at the object instance. or in java terms "just like static stuff"|
|`object Foo {def apply(s:String) = Integer.parseInt(s)}`|the apply-shortcut works everywhere, Foo("5") becomes Foo.apply("5"). remember Some(x)? it was the same here.
|`class Foo;object Foo`|this is possible. the object Foo is then called a companion object.|
|`object Foo {def apply(i:Int) = new Foo(i+1)}`|you can use methods in the object Foo as factory methods to keep the actual constructor nice and clean|
|`def apply[A](x: A): Option[A] = if (x == null) None else Some(x)`|this is what happens when you call Some(x)|
|<h2 id="Tuples">Tuples</h2>|
|`val x:(Int, Int) = (1,2)`|Sometimes, you want to group things together and pass them around as one object, but creating a class for that would be overkill|
|`x._1`|access the first element of a tuple|
|`def takesTuple(p:(Int, String) {...}`|method accepting a tuple|
|`takesTuple(5,"hello)`|(5, "hello") could be 2 parameters or a tuple. the compiler is smart enough to figure out you meant the tuple one because it looks at the type signature of "takesTuple".|
|`takesTuple((5,"hello))`|same as above, but explicitly creating the tuple|
|`coll zip coll2`|creates a single collection which contains tuples which contain values from coll and coll2, matching by index. for example `List(1,2) zip List("a","b")` becomes `List((1,"a"),(2,"b"))`
|<h2 id="pattermatching">Pattern matching</h2>|
|`x match {`|scala has a very powerful switch|
|&nbsp;`case "hello" => {...}`|gets executed if x equals "hello". is tested via equals
|&nbsp;`case s:String => {...}`|gets executed if x is any string. s then exists in the code block as a val.
|&nbsp;`case i:Int if i < 10 => {...}`|gets executed if x is any Int < 10. i then exists in the code block as a val.
|&nbsp;`case 11 *pipe* 12 *pipe* 13 => {...}`|matches on more than one value. how to escape the pipe character in here?|
|&nbsp;`case _ => `|default case, always matches|
|`}`| these were just the boring cases :)|
|`x match {`|scala can also match on values *inside* x|
|&nbsp;`case Some(e) => {...}`|matches if x is a Some. e then exists as a val inside the following code block|
|&nbsp;`case List(_, _, 3, y, z) if z == 5 => {...}`|matches if x is a list of size 5 which has a 3 at index 3 and if the fifth element is 5. the fourth element of the list then exists as "y" inside the code block, the last one does as "z".|
|&nbsp;`case _ :: _ :: 3 :: y :: z :: Nil if z == 5 => {...}`|same as above. note: the compiler will refuse to compile matches if they are obviously nonsense. for example x must not be something that cannot be a list for this case to compile. try `5 match {case List(5) => ...}`|
|`}`|how the hell did that work? see below|
|<h2 id="unapply">Destructuring</h2>|
|`object Foo { def unapply(i: Int) = if (i%2==2) Some("even") else None`|we need the reverse of an apply method - unapply.|
|`val Foo(infoString) = 42`|here, 42 is passed to unapply. if the result is an option, it's value is now stored in "infoString"|
|`42 match {case Foo(infoText) => {...}}`|if some is returned, the match is considered positive and the options value is bound to a val|
|`42 match {case Foo("even") => {...}}`|or it is tested for equality against a given value or instance|
|`41 match {case Digits(a,b) if (a == 4) => {...}}`|if the returned option contains a tuple instead of a single value, the expected happens: we now can access all the tuples fields. (i made up the Digit-object)|
|one more thing:<br> `unapplySeq(foo:Foo):Option[Seq[Bar]]`|like unapply, but offers special features for matching on sequences|
|`val List(a,b@_*) = List("hello","scala","world")`|a = "hello", b = List("scala", "world")|
|`val a::tl = List("hello", "scala", "world"`|same as above using alternative list syntax|
|`val List(a,_*) = List("hello","scala","world")`|sams as above, but discards the last 2 elements, b does not exist|
|Note: for case classes, an unapply method is automatically generated|
|<h2 id="traits">Traits</h2>|
|`trait Foo {`|Like a java interface, but more powerful. you can:|
|&nbsp;&nbsp;`def getBar():Bar`|define abstract methods like in a java interface|
|&nbsp;&nbsp;`def predefinedMethod(s:String) = "hello world" + s`|add non-abstract methods as well. a good example is the Ordered-trait. is expects you to implement a compare-method and delivers 4 other methods (<, >, <=, >=) which already come with an implementation based on compare|
|&nbsp;&nbsp;`val someVal = "someString"`|traits can also contain fields|
|`}`| but that's not all!|
|`trait Plugin extends java.lang.Object {`|a trait can "extend" any existing class or trait. the difference to the trait Foo above is that our Plugin here is restricted to classes which it extends. in this case java.lang.Object. why might such a thing be useful?|
|&nbsp;&nbsp;`override int hashcode = {....}`<br>`override int equals(other:Object) = {....}`|you can override a method of the class the trait extends. you can selectively replace or extend implementations of existing methods by adding traits. this way, you can say "these 5 classes should use *this* implementation of method foo" instead of manually overriding the method in each class|
|&nbsp;&nbsp;`override boolean add(t:T) = {`<br>`println(t +" is about to be added to the collection")`<br>`super.add(t)`<br>`}`|this is useful for stuff like logging. you can also use this to add features to specific classes. for example, there is a MultiMap-trait in scala which can be attached to maps having sets as values. it adds addBinding- and removeBinding-methods that are based on the original put/remove-methods and handle the details| 
|`}`|these traits are called mixins. a class can have more than one mixin, and they can also override each other. from inside the trait, "super" refers to whatever they extend.|
|`new Foo extends FirstTrait with BarTrait with SomeOtherTrait`|create a new instance of foo implementing 3 traits. the first one is extended, the next n are "withed".|
|`class Foo extends BarTrait`|declaring a class which implements Bar directly|
|`class Foo extends BarTrait with Serializable`|first extends, then with|
|`class A extends B with C with D with E`|inside E, super refers to D. inside D, super refers to C, and so on. keep this in mind when overriding the same method with different traits which call they supers.|
|  <h2 id="packages">packages</h2>                                                                         |                 |
|  `import scala.collection._`                                                                             |  wildcard import. |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  selective import. |
|  `import scala.collection.{Vector => Vec28}`                                                             |  renaming import. |
|  `import java.util.{Date => _, _}`                                                                       |  import all from java.util except Date. |
|  `package pkg` _at start of file_ <br> `package pkg { ... }`                                             |  declare a package. |
|  <h2 id="control_constructs">control constructs</h2>                                                     |                 |
|  `if (check) happy else sad`                                                                             |  conditional. |
|  `if (check) happy` _same as_ <br> `if (check) happy else ()`                                            |  conditional sugar. |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  while loop. |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  do while loop. |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>&nbsp;&nbsp;`    for (x <- xs) {`<br>&nbsp;&nbsp;&nbsp;&nbsp;`        if (Math.random < 0.1) break`<br>&nbsp;&nbsp;`    }`<br>`}`|  break. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)) |
|  `for (i <- 1 to 10 {doStuffWith(i)}`|most basic "for loop". actually it's not a loop but the compiler turns it into `1 to 10 foreach {i => *block content*}. and it is not called for loop, but "for comprehension". it's a higher level construct - loops are low level.|
|  `for (i <- 1 to 10 if i % 2 == 0) {}`|conditions are possible|
|  `for (i <- 1 to 10;i2 <- 1 to 10) {println(i+i2)}`|no need for nested fors|
|  `val evenNumbers = for (i <- 1 to 10) yield (i*2)`|yield means "the loop should return that". in this case, you get all even numbers from 2 to 20|
|  `for (x <- xs if x%2 == 0) yield x*10` _same as_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  what you write, and what the compiler does |
|  `for ((x,y) <- xs zip ys) yield x*y`              |  pattern matching works in here |
|<h2 id="implicit conversions">Implicits</h2>|
|`implicit`|mystic keyword. can be attached to vals, vars, defs and objects and method parameters|
|`def parseInt(s:String) = Integer.parseInt(s)`|simple string -> int method|
|`implicit def parseInt(s:String) = Integer.parseInt(s)`|implicit string -> int method. it still can be used as a normal method, but it has one special feature|
|`val i:Int = "42"`|if there is an implicit method in scope which can convert a "wrong" type (string 42) into a "correct" one, the compiler automatically uses it. the code becomes `val i = parseInt("42")`|
|`implicit def attachMethod(i:Int) = new {def tenTimes = i*10}`|another implicit conversion from "Int" to an anonymous class having a method "tenTimes". the returnes class doesn't need a name.|
|using several implicit conversions attaching methods in a chain, combined with scala's .-inference, you can create code that looks like a text that acually makes sense to a human. for a great example, take a look at ScalaTest|
|`val i:Int = 42`<br>`println(i.tenTimes)`|if there is an implicit method which can convert a type not having a method into one having that method - the compiler uses that conversion to make your code valid. this is a common pattern to attach methods to objects| 
|`abstract class GenericAddition[T] {def add(t:T,t2:T):T}`<br>`implicit object IntAddition extends GenericAddition[Int] {def add(t:Int, t2:Int) = t+t2}`|an implicit object|
|`def addTwoThings[T](t:T, t2:T)(implicit logicToUse:GenericAddition[T]) = logicToUse.add(t,t2)`|method using a second implicit parameter list|
|`addTwoThings(1,2)(IntAddition)`|call to method above. so far, no magic involved.|
|`addTwoThings(1,2)`|if a matching implicit object is in scope, it will automatically be used. you don't have to pass it yourself. it's a nice feature to separate the "what" from "how" and let the compiler pick the "how"-logic automatically.|
|<h2 id="types">Abstract types</h2>|
|`type Str = String`|simple alias. Str and String are equal for the compiler|
|`type Complex[A] = (String,String,String,A)`|if you are too lazy to write a complex type expression because a part of the expression is constant, use this. "Complex" is called a type contructor, and A is its parameter. you can declare something as Complex[Int] and it is considered equal to any Tuple having the type (String, String, String, Int)|
|`type StructualType = {def x:String;val y:Int}`|this is a structural type. is allows type safe duck-typing. if you declare a method that accepts "StructuralType", is accepts all objects that have a method x:String and a field y:Int. at runtime, reflection is used for this, but you cannot mess it up at compile time like in dynamically types languages.| 
|`class X {type Y <: Foo}`|types can be clared in classes and traits and overridden in subclasses. upper and lower bounds apply here, too.|
|`type X = {type U = Foo}`|types can be nested. this is useful for things that are too big to explain here, but i can tease you a bit: you can declare a type that "is an int but with an attached subtype". at runtime, everything is still an int, but at compile time, userids, inches, the number of hairs - everything would have a different type and you would get compile errors if you tried to mix them. for strings, you could tag them with an "is resource key", "is already resolved" or "is already html-escaped"-type to avoid doubly resolved or escaped strings. for details, see http://etorreborre.blogspot.com/2011/11/practical-uses-for-unboxed-tagged-types.html
|`this.type`|this refers to the type "this" has. this is pretty useless as long as you are inside "this". but if you use it as a return type, it get's updated once you use a subclass. simple use case: `def cloneOfMe:this.type`. you'll want a subclass to return it's own type, not the parent type.|
|<h2 id="freeeeeeedom">For java programmers: Lifted restrictions / Important differences</h2>|
|If you are coming from java, you might have gotten used to several restrictions and might not even try to do it in scala because you expect it not to work. here is what does work in scala, but not in java|
|`a == b`|this is a null safe call to equals. if you want a check by reference, use "eq" instead of "=="|
|`var x = 0`<br>`1 to 10 foreach {i => {`<br>`println("changing x from inside another class")`<br>`x += i`<br>`}`|in java, you cannot access local variables from anonymous classes unless they are final. in scala, you can.|
|`class Foo {def x = "a"}`<br>`class Bar extends Foo {override val x = "b"}`|parameterless methods can be overridden by readonly fields|
|`def allExceptionsAreEqual = throw new CheckedException`|in scala, you don't need to declare checked exceptions in your method signature. by default, the compiler handles them just like runtimeexceptions. the common case is that a caller doesn't care about exceptions and just lets them propagate up to the top level where they are logged and handled.|
|`List[Int]`|primitives are possible as generic types. no need to use java.lang.Integer|