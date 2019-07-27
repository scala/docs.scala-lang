---
layout: cheatsheet
title: Scala Cheatsheet

partof: cheatsheet

by: Brendan O'Connor
about: Thanks to <a href="http://brenocon.com/">Brendan O'Connor</a>, this cheatsheet aims to be a quick reference of Scala syntactic constructions. Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license.

languages: [ba, fr, ja, pl, pt-br, zh-cn, th, ru]
---

<!-- ###### Contributed by {{ page.by }} -->

{{ page.about }}

<table>
  <thead>
    <tr>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span id="variables" class="h2">variables</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x = 5</code></pre><br /> <span class="label success">Good</span><br><pre class="highlight"><code>x = 6</code></pre></td>
      <td>Variable.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val x = 5</code></pre><br /> <span class="label important">Bad</span><br><pre class="highlight"><code>x = 6</code></pre></td>
      <td>Constant.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x: Double = 5</code></pre></td>
      <td>Explicit type.</td>
    </tr>
    <tr>
      <td><span id="functions" class="h2">functions</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>def f(x: Int) = { x * x }</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>def f(x: Int)   { x * x }</code></pre></td>
      <td>Define function.<br />Hidden error: without <code>=</code> it’s a procedure returning <code>Unit</code>; causes havoc.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>def f(x: Any) = println(x)</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>def f(x) = println(x)</code></pre></td>
      <td>Define function.<br />Syntax error: need types for every arg.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>type R = Double</code></pre></td>
      <td>Type alias.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def f(x: R)</code></pre> vs.<br /> <pre class="highlight"><code>def f(x: =&gt; R)</code></pre></td>
      <td>Call-by-value.<br /><br />Call-by-name (lazy parameters).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(x: R) =&gt; x * x</code></pre></td>
      <td>Anonymous function.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(_ * 2)</code></pre> vs.<br /> <pre class="highlight"><code>(1 to 5).reduceLeft(_ + _)</code></pre></td>
      <td>Anonymous function: underscore is positionally matched arg.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(x =&gt; x * x)</code></pre></td>
      <td>Anonymous function: to use an arg twice, have to name it.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map { x =&gt;
  val y = x * 2
  println(y)
  y
}</code></pre></td>
      <td>Anonymous function: block style returns last expression.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5) filter {
  _ % 2 == 0
} map {
  _ * 2
}</code></pre></td>
      <td>Anonymous functions: pipeline style (or parens too).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def compose(g: R =&gt; R, h: R =&gt; R) =
  (x: R) =&gt; g(h(x))</code></pre> <br /> <pre class="highlight"><code>val f = compose(_ * 2, _ - 1)</code></pre></td>
      <td>Anonymous functions: to pass in multiple blocks, need outer parens.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val zscore =
  (mean: R, sd: R) =&gt;
    (x: R) =&gt;
      (x - mean) / sd</code></pre></td>
      <td>Currying, obvious syntax.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean: R, sd: R) =
  (x: R) =&gt;
    (x - mean) / sd</code></pre></td>
      <td>Currying, obvious syntax.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean: R, sd: R)(x: R) =
  (x - mean) / sd</code></pre></td>
      <td>Currying, sugar syntax. But then:</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val normer =
  zscore(7, 0.4) _</code></pre></td>
      <td>Need trailing underscore to get the partial, only for the sugar version.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def mapmake[T](g: T =&gt; T)(seq: List[T]) =
  seq.map(g)</code></pre></td>
      <td>Generic type.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>5.+(3); 5 + 3</code></pre> <br /> <pre class="highlight"><code>(1 to 5) map (_ * 2)</code></pre></td>
      <td>Infix sugar.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def sum(args: Int*) =
  args.reduceLeft(_+_)</code></pre></td>
      <td>Varargs.</td>
    </tr>
    <tr>
      <td><span id="packages" class="h2">packages</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection._</code></pre></td>
      <td>Wildcard import.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.Vector</code></pre> <br /> <pre class="highlight"><code>import scala.collection.{Vector, Sequence}</code></pre></td>
      <td>Selective import.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.{Vector =&gt; Vec28}</code></pre></td>
      <td>Renaming import.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import java.util.{Date =&gt; _, _}</code></pre></td>
      <td>Import all from <code>java.util</code> except <code>Date</code>.</td>
    </tr>
    <tr>
      <td><em>At start of file:</em> <pre class="highlight"><code>package pkg</code></pre><br /> <em>Packaging by scope: </em> <pre class="highlight"><code>package pkg {
  ...
}</code></pre><br /><em>Package singleton: </em> <pre class="highlight"><code>package object pkg {
  ...
}</code></pre></td>
      <td>Declare a package.</td>
    </tr>
    <tr>
      <td><span id="data_structures" class="h2">data structures</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1, 2, 3)</code></pre></td>
      <td>Tuple literal (<code class="highlighter-rouge">Tuple3</code>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var (x, y, z) = (1, 2, 3)</code></pre></td>
      <td>Destructuring bind: tuple unpacking via pattern matching.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br><pre class="highlight"><code>var x, y, z = (1, 2, 3)</code></pre></td>
      <td>Hidden error: each assigned to the entire tuple.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var xs = List(1, 2, 3)</code></pre></td>
      <td>List (immutable).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>xs(2)</code></pre></td>
      <td>Paren indexing (<a href="http://www.slideshare.net/Odersky/fosdem-2009-1013261/27">slides</a>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 :: List(2, 3)</code></pre></td>
      <td>Cons.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 to 5</code></pre> <em>same as</em> <pre class="highlight"><code>1 until 6</code></pre> <br /> <pre class="highlight"><code>1 to 10 by 2</code></pre></td>
      <td>Range sugar.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>()</code></pre></td>
      <td>Empty parens is singleton value of the Unit type.<br />Equivalent to <code class="highlighter-rouge">void</code> in C and Java.</td>
    </tr>
    <tr>
      <td><span id="control_constructs" class="h2">control constructs</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy else sad</code></pre></td>
      <td>Conditional.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy</code></pre>
      <br><em><strong>same as</strong></em><br>
      <pre class="highlight"><code>if (check) happy else ()</code></pre></td>
      <td>Conditional sugar.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>while (x &lt; 5) {
  println(x)
  x += 1
}</code></pre></td>
      <td>While loop.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>do {
  println(x)
  x += 1
} while (x &lt; 5)</code></pre></td>
      <td>Do-while loop.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.util.control.Breaks._

breakable {
  for (x &lt;- xs) {
    if (Math.random &lt; 0.1)
      break
  }
}</code></pre></td>
      <td>Break (<a href="http://www.slideshare.net/Odersky/fosdem-2009-1013261/21">slides</a>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs if x % 2 == 0)
  yield x * 10</code></pre>
      <br><em><strong>same as</strong></em><br>
      <pre class="highlight"><code>xs.filter(_ % 2 == 0).map(_ * 10)</code></pre></td>
      <td>For-comprehension: filter/map.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for ((x, y) &lt;- xs zip ys)
  yield x * y</code></pre>
      <br><em><strong>same as</strong></em><br>
      <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre></td>
      <td>For-comprehension: destructuring bind.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys)
  yield x * y</code></pre>
      <br><em><strong>same as</strong></em><br>
      <pre class="highlight"><code>xs flatMap { x =&gt;
  ys map { y =&gt;
    x * y
  }
}</code></pre></td>
      <td>For-comprehension: cross product.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys) {
  val div = x / y.toFloat
  println("%d/%d = %.1f".format(x, y, div))
}</code></pre></td>
      <td>For-comprehension: imperative-ish.<br /><a href="http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax"><code>sprintf</code> style</a>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i &lt;- 1 to 5) {
  println(i)
}</code></pre></td>
      <td>For-comprehension: iterate including the upper bound.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i &lt;- 1 until 5) {
  println(i)
}</code></pre></td>
      <td>For-comprehension: iterate omitting the upper bound.</td>
    </tr>
    <tr>
      <td><span id="pattern_matching" class="h2">pattern matching</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>(xs zip ys) map {
  (x, y) =&gt; x * y
}</code></pre></td>
      <td>Use case in function args for pattern matching.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br>
      <pre class="highlight"><code>val v42 = 42
3 match {
  case v42 =&gt; println("42")
  case _   =&gt; println("Not 42")
}</code></pre></td>
      <td><code>v42</code> is interpreted as a name matching any Int value, and “42” is printed.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br>
      <pre class="highlight"><code>val v42 = 42
3 match {
  case `v42` =&gt; println("42")
  case _     =&gt; println("Not 42")
}</code></pre></td>
      <td><code>`v42`</code> with backticks is interpreted as the existing val <code>v42</code>, and “Not 42” is printed.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br>
      <pre class="highlight"><code>val UppercaseVal = 42
3 match {
  case UppercaseVal =&gt; println("42")
  case _            =&gt; println("Not 42")
}</code></pre></td>
      <td><code>UppercaseVal</code> is treated as an existing val, rather than a new pattern variable, because it starts with an uppercase letter. Thus, the value contained within <code>UppercaseVal</code> is checked against <code>3</code>, and “Not 42” is printed.</td>
    </tr>
    <tr>
      <td><span id="object_orientation" class="h2">object orientation</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(x: R)</code></pre></td>
      <td>Constructor params - <code>x</code> is only available in class body.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(val x: R)</code></pre><br /><pre class="highlight"><code>var c = new C(4)</code></pre><br /><pre class="highlight"><code>c.x</code></pre></td>
      <td>Constructor params - automatic public member defined.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(var x: R) {
  assert(x > 0, "positive please")
  var y = x
  val readonly = 5
  private var secret = 1
  def this = this(42)
}</code></pre></td>
      <td>Constructor is class body.<br />Declare a public member.<br />Declare a gettable but not settable member.<br />Declare a private member.<br />Alternative constructor.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new {
  ...
}</code></pre></td>
      <td>Anonymous class.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>abstract class D { ... }</code></pre></td>
      <td>Define an abstract class (non-createable).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { ... }</code></pre></td>
      <td>Define an inherited class.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class D(var x: R)</code></pre><br /><pre class="highlight"><code>class C(x: R) extends D(x)</code></pre></td>
      <td>Inheritance and constructor params (wishlist: automatically pass-up params by default).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>object O extends D { ... }</code></pre></td>
      <td>Define a singleton (module-like).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T { ... }</code></pre><br /><pre class="highlight"><code>class C extends T { ... }</code></pre><br /><pre class="highlight"><code>class C extends D with T { ... }</code></pre></td>
      <td>Traits.<br />Interfaces-with-implementation. No constructor params. <a href="{{site.baseurl}}/tutorials/tour/mixin-class-composition.html">mixin-able</a>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T1; trait T2</code></pre><br /><pre class="highlight"><code>class C extends T1 with T2</code></pre><br /><pre class="highlight"><code>class C extends D with T1 with T2</code></pre></td>
      <td>Multiple traits.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { override def f = ...}</code></pre></td>
      <td>Must declare method overrides.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new java.io.File("f")</code></pre></td>
      <td>Create object.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br> <pre class="highlight"><code>new List[Int]</code></pre><br /> <span class="label success">Good</span><br> <pre class="highlight"><code>List(1, 2, 3)</code></pre></td>
      <td>Type error: abstract type.<br />Instead, convention: callable factory shadowing the type.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>classOf[String]</code></pre></td>
      <td>Class literal.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.isInstanceOf[String]</code></pre></td>
      <td>Type check (runtime).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.asInstanceOf[String]</code></pre></td>
      <td>Type cast (runtime).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x: String</code></pre></td>
      <td>Ascription (compile time).</td>
      <td> </td>
    </tr>
    <tr>
      <td><span id="options" class="h2">options</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Some(42)</code></pre></td>
      <td>Construct a non empty optional value.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>None</code></pre></td>
      <td>The singleton empty optional value.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Option(null) == None
Option(obj.unsafeMethod)</code></pre>
      <em><strong>but</strong></em>
      <pre class="highlight"><code>Some(null) != None</code></pre></td>
      <td>Null-safe optional value factory.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val optStr: Option[String] = None</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>val optStr = Option.empty[String]</code></pre></td>
      <td>Explicit type for empty optional value.<br /> Factory for empty optional value.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val name: Option[String] =
  request.getParameter("name")
val upper = name.map {
  _.trim
} filter {
  _.length != 0
} map {
  _.toUpperCase
}
println(upper.getOrElse(""))</code></pre></td>
      <td>Pipeline style.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val upper = for {
  name &lt;- request.getParameter("name")
  trimmed &lt;- Some(name.trim)
    if trimmed.length != 0
  upper &lt;- Some(trimmed.toUpperCase)
} yield upper
println(upper.getOrElse(""))</code></pre></td>
      <td>For-comprehension syntax.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.map(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(f(x))
  case None    =&gt; None
}</code></pre></td>
      <td>Apply a function on the optional value.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.flatMap(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; None
}</code></pre></td>
      <td>Same as map but function must return an optional value.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>optionOfOption.flatten</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>optionOfOption match {
  case Some(Some(x)) =&gt; Some(x)
  case _             =&gt; None
}</code></pre></td>
      <td>Extract nested option.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.foreach(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; ()
}
()</code></pre></td>
      <td>Apply a procedure on optional value. Returns <code>Unit</code>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.fold(y)(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; y
}</code></pre></td>
      <td>Apply function on optional value, return default if empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.collect {
  case x =&gt; ...
}</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x)
    if f.isDefinedAt(x) =&gt; ...
  case _                =&gt; None
}</code></pre></td>
      <td>Apply partial pattern match on optional value.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isDefined</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td><code>true</code> if not empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isEmpty</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; false
  case None    =&gt; true
}</code></pre></td>
      <td><code>true</code> if empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.nonEmpty</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td><code>true</code> if not empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.size</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; 1
  case None    =&gt; 0
}</code></pre></td>
      <td><code>0</code> if empty, otherwise <code>1</code>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orElse(Some(y))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(x)
  case None    =&gt; Some(y)
}</code></pre></td>
      <td>Evaluate and return alternate optional value if empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.getOrElse(y)</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; y
}</code></pre></td>
      <td>Evaluate and return default value if empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.get</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; throw new Exception
}</code></pre></td>
      <td>Return value, throw exception if empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orNull</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; null
}</code></pre></td>
      <td>Return value, <code>null</code> if empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filter(f)</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; Some(x)
  case _               =&gt; None
}</code></pre></td>
      <td>Optional value satisfies predicate.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filterNot(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if !f(x) =&gt; Some(x)
  case _                =&gt; None
}</code></pre></td>
      <td>Optional value doesn't satisfy predicate.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.exists(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; false
}</code></pre></td>
      <td>Apply predicate on optional value or <code>false</code> if empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.forall(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; true
}</code></pre></td>
      <td>Apply predicate on optional value or <code>true</code> if empty.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.contains(y)</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x == y
  case None    =&gt; false
}</code></pre></td>
      <td>Checks if value equals optional value or <code>false</code> if empty.</td>
    </tr>
  </tbody>
</table>
