---
layout: cheatsheet
title: Scala Cheatsheet

partof: cheatsheet

by: Dmytro Kazanzhy
about: Ця шпаргалка створена завдяки <a href="https://brenocon.com/">Brendan O'Connor</a>, та призначена для швидкого ознайомлення з синтаксичними конструкціями Scala. Ліцензовано Brendan O'Connor за ліцензією CC-BY-SA 3.0.

language: uk
---

###### Contributed by {{ page.by }}

{{ page.about }}

<table>
  <thead>
    <tr>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span id="variables" class="h2">змінні</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x = 5</code></pre><br /> <span class="label success">Вірно</span><br><pre class="highlight"><code>x = 6</code></pre></td>
      <td>Змінна.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val x = 5</code></pre><br /> <span class="label important">Невірно</span><br><pre class="highlight"><code>x = 6</code></pre></td>
      <td>Константа (значення).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x: Double = 5</code></pre></td>
      <td>Явне вказання типу.</td>
    </tr>
    <tr>
      <td><span id="functions" class="h2">функції</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Вірно</span><br> <pre class="highlight"><code>def f(x: Int) = { x * x }</code></pre><br /> <span class="label important">Невірно</span><br> <pre class="highlight"><code>def f(x: Int)   { x * x }</code></pre></td>
      <td>Визначення функції.<br />Прихована помилка: без <code>=</code> це процедура, що повертає <code>Unit</code> та може ввести в оману. <a href="https://github.com/scala/scala/pull/6325">Не підтримується</a> зі Scala 2.13.</td>
    </tr>
    <tr>
      <td><span class="label success">Вірно</span><br> <pre class="highlight"><code>def f(x: Any) = println(x)</code></pre><br /> <span class="label important">Невірно</span><br> <pre class="highlight"><code>def f(x) = println(x)</code></pre></td>
      <td>Визначення функції.<br />Синтаксична помилка: для кожного аргументу має бути вказано тип.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>type R = Double</code></pre></td>
      <td>Псевдонім (синонім) типу.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def f(x: R)</code></pre> vs.<br /> <pre class="highlight"><code>def f(x: =&gt; R)</code></pre></td>
      <td>Виклик-за-значенням.<br /><br />Виклик-за-іменем (аргумент обчислюється кожен раз як до нього звертаються).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(x: R) =&gt; x * x</code></pre></td>
      <td>Анонімна функція.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(_ * 2)</code></pre> vs.<br /> <pre class="highlight"><code>(1 to 5).reduceLeft(_ + _)</code></pre></td>
      <td>Анонімна функція: підкреслення це позиційний аргумент, тобто місце, куди буде підставлено аргумент функції.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(x =&gt; x * x)</code></pre></td>
      <td>Анонімна функція: щоб використати аргумент двічі, треба його назвати. Зліва від <code>=></code> задається ім'я змінної, якій буде присвоєно аргумент та яку можна використати справа.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map { x =&gt;
  val y = x * 2
  println(y)
  y
}</code></pre></td>
      <td>Анонімна функція: блоковий стиль (фігурні дужки означають блок) повертає останній вираз.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5) filter {
  _ % 2 == 0
} map {
  _ * 2
}</code></pre></td>
      <td>Анонімна функція: конвеєрний стиль.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def compose(g: R =&gt; R, h: R =&gt; R) =
  (x: R) =&gt; g(h(x))</code></pre> <br /> <pre class="highlight"><code>val f = compose(_ * 2, _ - 1)</code></pre></td>
      <td>Анонімна функція: для передачі кількох блоків потрібні зовнішні дужки.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val zscore =
  (mean: R, sd: R) =&gt;
    (x: R) =&gt;
      (x - mean) / sd</code></pre></td>
      <td>Каррування, явний синтакси.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean: R, sd: R) =
  (x: R) =&gt;
    (x - mean) / sd</code></pre></td>
      <td>Каррування, явний синтаксис.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean: R, sd: R)(x: R) =
  (x - mean) / sd</code></pre></td>
      <td>Каррування, синтаксичний цукор. Але:</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val normer =
  zscore(7, 0.4) _</code></pre></td>
      <td>Потрібне кінцеве підкреслення, щоб отримати частково застосовану функцію (лише для версії з синтаксичним цукром).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def mapmake[T](g: T =&gt; T)(seq: List[T]) =
  seq.map(g)</code></pre></td>
      <td>Узагальнений тип (параметричний поліморфізм).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>5.+(3); 5 + 3</code></pre> <br /> <pre class="highlight"><code>(1 to 5) map (_ * 2)</code></pre></td>
      <td>Інфіксний цукор (метод з одним аргументом може бути викликано як оператор).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def sum(args: Int*) =
  args.reduceLeft(_+_)</code></pre></td>
      <td>Varargs (аргументи змінної довжини).</td>
    </tr>
    <tr>
      <td><span id="packages" class="h2">пакети</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection._</code></pre></td>
      <td>Імпорт всього вмісту пакету.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.Vector</code></pre> <br /> <pre class="highlight"><code>import scala.collection.{Vector, Sequence}</code></pre></td>
      <td>Вибірковий імпорт.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.{Vector =&gt; Vec28}</code></pre></td>
      <td>Імпорт з перейменуванням.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import java.util.{Date =&gt; _, _}</code></pre></td>
      <td>Імпорт всього з <code>java.util</code> окрім <code>Date</code>.</td>
    </tr>
    <tr>
      <td><em>На початку файлу:</em> <pre class="highlight"><code>package pkg</code></pre><br /> <em>Пакет в певних межах: </em> <pre class="highlight"><code>package pkg {
  ...
}</code></pre><br /><em>Пакет одиночка (singleton): </em> <pre class="highlight"><code>package object pkg {
  ...
}</code></pre></td>
      <td>Оголошення пакету.</td>
    </tr>
    <tr>
      <td><span id="data_structures" class="h2">структури даних</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1, 2, 3)</code></pre></td>
      <td>Кортеж (Tuple). Трансформується у виклик <code class="highlighter-rouge">Tuple3</code>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var (x, y, z) = (1, 2, 3)</code></pre></td>
      <td>Деструктивна прив'язка: кортеж розпаковується через зіставлення зі зразком (pattern matching).</td>
    </tr>
    <tr>
      <td><span class="label important">Невірно</span><br><pre class="highlight"><code>var x, y, z = (1, 2, 3)</code></pre></td>
      <td>Прихована помилка: кожна змінна прив'язана до всього кортежу.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var xs = List(1, 2, 3)</code></pre></td>
      <td>Список (імутабельний, тобто такий, що не змінюється).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>xs(2)</code></pre></td>
      <td>Індексація через дужки (<a href="https://www.slideshare.net/Odersky/fosdem-2009-1013261/27">slides</a>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 :: List(2, 3)</code></pre></td>
      <td>Додавання елементу до голови списку.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 to 5</code></pre> <em>так само, як і</em> <pre class="highlight"><code>1 until 6</code></pre> <br /> <pre class="highlight"><code>1 to 10 by 2</code></pre></td>
      <td>Синтаксичний цукор для діапазонів.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>()</code></pre></td>
      <td>Пусті дужки це єдине значення для типу Unit.<br />Еквівалентно до <code class="highlighter-rouge">void</code> у C та Java.</td>
    </tr>
    <tr>
      <td><span id="control_constructs" class="h2">управляючі конструкти</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy else sad</code></pre></td>
      <td>Умовний конструкт.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy</code></pre>
      <br><em><strong>так само, як і</strong></em><br>
      <pre class="highlight"><code>if (check) happy else ()</code></pre></td>
      <td>Умовний конструкт (синтаксичний цукор).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>while (x &lt; 5) {
  println(x)
  x += 1
}</code></pre></td>
      <td>Цикл while.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>do {
  println(x)
  x += 1
} while (x &lt; 5)</code></pre></td>
      <td>Цикл do-while.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.util.control.Breaks._
breakable {
  for (x &lt;- xs) {
    if (Math.random &lt; 0.1)
      break
  }
}</code></pre></td>
      <td>Break (<a href="https://www.slideshare.net/Odersky/fosdem-2009-1013261/21">slides</a>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs if x % 2 == 0)
  yield x * 10</code></pre>
      <br><em><strong>так само, як і</strong></em><br>
      <pre class="highlight"><code>xs.filter(_ % 2 == 0).map(_ * 10)</code></pre></td>
      <td>Цикл for: filter/map.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for ((x, y) &lt;- xs zip ys)
  yield x * y</code></pre>
      <br><em><strong>так само, як і</strong></em><br>
      <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre></td>
      <td>Цикл for: деструктивна прив'язка.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys)
  yield x * y</code></pre>
      <br><em><strong>так само, як і</strong></em><br>
      <pre class="highlight"><code>xs flatMap { x =&gt;
  ys map { y =&gt;
    x * y
  }
}</code></pre></td>
      <td>Цикл for: декартів добуток.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys) {
  val div = x / y.toFloat
  println("%d/%d = %.1f".format(x, y, div))
}</code></pre></td>
      <td>Цикл for: імперативізм.<br /><a href="https://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax">стиль<code>sprintf</code></a>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i &lt;- 1 to 5) {
  println(i)
}</code></pre></td>
      <td>Цикл for: ітерація з включенням верхньої межі.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i &lt;- 1 until 5) {
  println(i)
}</code></pre></td>
      <td>Цикл for: ітерація без включення верхньої межі.</td>
    </tr>
    <tr>
      <td><span id="pattern_matching" class="h2">зіставлення із зразком (pattern matching)</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Вірно</span><br> <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre><br /> <span class="label important">Невірно</span><br> <pre class="highlight"><code>(xs zip ys) map {
  (x, y) =&gt; x * y
}</code></pre></td>
      <td>Для зіставлення зі зразком необхідно використати <code>case</code> перед аргументами анонімної функції.</td>
    </tr>
    <tr>
      <td><span class="label important">Невірно</span><br>
      <pre class="highlight"><code>val v42 = 42
24 match {
  case v42 =&gt; println("42")
  case _   =&gt; println("Not 42")
}</code></pre></td>
      <td><code>v42</code> буде інтерпретовано як ім'я змінної у зразку, яка буде вірно зіставлена з будь-яким Int значенням, і буде виведено “42”.</td>
    </tr>
    <tr>
      <td><span class="label success">Вірно</span><br>
      <pre class="highlight"><code>val v42 = 42
24 match {
  case `v42` =&gt; println("42")
  case _     =&gt; println("Not 42")
}</code></pre></td>
      <td><code>`v42`</code> у зворотних галочках буде інтерпретовано як значення наявної змінної <code>v42</code>, і буде виведено “Not 42”.</td>
    </tr>
    <tr>
      <td><span class="label success">Вірно</span><br>
      <pre class="highlight"><code>val UppercaseVal = 42
24 match {
  case UppercaseVal =&gt; println("42")
  case _            =&gt; println("Not 42")
}</code></pre></td>
      <td><code>UppercaseVal</code> буде інтерпретовано так само як наявна змінна, а не нова змінна в патерні. Тому значення, що міститься в <code>UppercaseVal</code> буде порівняно з <code>24</code>, і буде виведено “Not 42”.</td>
    </tr>
    <tr> 
      <td><span id="object_orientation" class="h2">об'єктна орієнтація</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(x: R)</code></pre></td>
      <td>Параметри конструктора - тільки <code>x</code> доступний в тілі класу.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(val x: R)</code></pre><br /><pre class="highlight"><code>var c = new C(4)</code></pre><br /><pre class="highlight"><code>c.x</code></pre></td>
      <td>Параметри конструктора - автоматичне створення публічного об'єкта.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(var x: R) {
  assert(x > 0, "positive please")
  var y = x
  val readonly = 5
  private var secret = 1
  def this = this(42)
}</code></pre></td>
      <td>Тіло класу є конструктором.<br />Оголосити відкритий (public) атрибут.<br />Оголосити атрибут, доступний тільки на читання.<br />Оголосити закритий (private) атрибут.<br />Альтернативний конструктор.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new {
  ...
}</code></pre></td>
      <td>Анонімний клас.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>abstract class D { ... }</code></pre></td>
      <td>Визначити абстрактний клас (без можливості створення об'єкту).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { ... }</code></pre></td>
      <td>Визначити клас, що наслідує інший.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class D(var x: R)</code></pre><br /><pre class="highlight"><code>class C(x: R) extends D(x)</code></pre></td>
      <td>Наслідування та параметри конструктора (за замовчуванням відбувається передача аргументів).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>object O extends D { ... }</code></pre></td>
      <td>Визначити єдиний екземпляр (singleton).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T { ... }</code></pre><br /><pre class="highlight"><code>class C extends T { ... }</code></pre><br /><pre class="highlight"><code>class C extends D with T { ... }</code></pre></td>
      <td>Риси - трейти (traits).<br />Інтерфейси-з-імплементацією. У трейту немає параметрів конструктора. <a href="{{site.baseurl}}/tutorials/tour/mixin-class-composition.html">композиція з домішками (mixin)</a>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T1; trait T2</code></pre><br /><pre class="highlight"><code>class C extends T1 with T2</code></pre><br /><pre class="highlight"><code>class C extends D with T1 with T2</code></pre></td>
      <td>Множинні трейти.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { override def f = ...}</code></pre></td>
      <td>При реалізації вже наявного методу необхідно вказати <code>overrides</code>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new java.io.File("f")</code></pre></td>
      <td>Створення об'єкту.</td>
    </tr>
    <tr>
      <td><span class="label important">Невірно</span><br> <pre class="highlight"><code>new List[Int]</code></pre><br /> <span class="label success">Вірно</span><br> <pre class="highlight"><code>List(1, 2, 3)</code></pre></td>
      <td>Помилка типу: абстрактний тип.<br />Натомість, існує конвенція у таких випадках використовувати фабричний метод обʼєкту компаньйону, що приховує конкретний тип.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>classOf[String]</code></pre></td>
      <td>Літерал класу (<code>Class[String] = class java.lang.String</code>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.isInstanceOf[String]</code></pre></td>
      <td>Перевірка типу під час виконання (runtime).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.asInstanceOf[String]</code></pre></td>
      <td>Приведення типу під час виконання (runtime).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x: String</code></pre></td>
      <td>Приписування типу під час компіляції (compile time).</td>
      <td> </td>
    </tr>
    <tr>
      <td><span id="options" class="h2">опції (options)</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Some(42)</code></pre></td>
      <td>Конструктор для непустого опціонального значення (тип <code>Some[T]</code>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>None</code></pre></td>
      <td>Одинак (Singleton) пустого опціонального значення (тип <code>None</code>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Option(null) == None
Option(24) == Some(24)</code></pre>
      <pre class="highlight"><code>obj.unsafeMethod // number or null
Option(obj.unsafeMethod) // Some or None</code></pre>
      <em><strong>проте</strong></em>
      <pre class="highlight"><code>Some(null) != None</code></pre></td>
      <td>Null-safe фабрика опціональних значень.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val optStr: Option[String] = None</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>val optStr = Option.empty[String]</code></pre></td>
      <td>Явна типізація опціонального значення.<br /> Фабричний метод для створення пустих опціональних значень.</td>
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
      <td>Конвеєрний стиль.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val upper = for {
  name &lt;- request.getParameter("name")
  trimmed &lt;- Some(name.trim)
    if trimmed.length != 0
  upper &lt;- Some(trimmed.toUpperCase)
} yield upper
println(upper.getOrElse(""))</code></pre></td>
      <td>Синтаксис for-виразу.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.map(f(_))</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(f(x))
  case None    =&gt; None
}</code></pre></td>
      <td>Застосування функції до опціонального значення.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.flatMap(f(_))</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; None
}</code></pre></td>
      <td>Так само, як і <code>map</code>б але функція має повернути опціональне значення.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>optionOfOption.flatten</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>optionOfOption match {
  case Some(Some(x)) =&gt; Some(x)
  case _             =&gt; None
}</code></pre></td>
      <td>Вилучення вкладених опціональних значень.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.foreach(f(_))</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; ()
}</code></pre></td>
      <td>Застосувати процедуру на опціональному значенні.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.fold(y)(f(_))</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; y
}</code></pre></td>
      <td>Застосувати функцію на опціональному значенні та повернути значення, якщо воно порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.collect {
  case x =&gt; ...
}</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f.isDefinedAt(x) =&gt; ...
  case Some(_)                     =&gt; None
  case None                        =&gt; None
}</code></pre></td>
      <td>Виконати часткове зіставлення зі зразком опціонального значення.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isDefined</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td><code>true</code> якщо не порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isEmpty</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; false
  case None    =&gt; true
}</code></pre></td>
      <td><code>true</code> якщо порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.nonEmpty</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td><code>true</code> якщо не порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.size</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; 1
  case None    =&gt; 0
}</code></pre></td>
      <td><code>0</code> якщо порожнє, інакше <code>1</code>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orElse(Some(y))</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(x)
  case None    =&gt; Some(y)
}</code></pre></td>
      <td>Обчислити та повернути альтернативне опціональне значення, якщо порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.getOrElse(y)</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; y
}</code></pre></td>
      <td>Обчислити та повернути значення за замовчуванням, якщо порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.get</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; throw new Exception
}</code></pre></td>
      <td>Повернути значення, або згенерувати виключення, якщо порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orNull</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; null
}</code></pre></td>
      <td>Повернути значення, <code>null</code> якщо порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filter(f)</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; Some(x)
  case _               =&gt; None
}</code></pre></td>
      <td>Фільтрація опціонального значення. Повернути значення, якщо предикат істинний.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filterNot(f(_))</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if !f(x) =&gt; Some(x)
  case _                =&gt; None
}</code></pre></td>
      <td>Фільтрація опціонального значення. Повернути значення, якщо предикат хибний.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.exists(f(_))</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; true
  case Some(_)         =&gt; false
  case None            =&gt; false
}</code></pre></td>
      <td>Повернути значення предикату на опціональному значенні або <code>false</code> якщо порожнє.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.forall(f(_))</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; true
  case Some(_)         =&gt; false
  case None            =&gt; true
}</code></pre></td>
      <td>Повернути значення предикату на опціональному значенні або <code>true</code> якщо порожнє..</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.contains(y)</code></pre>
      <em><strong>так само, як і</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x == y
  case None    =&gt; false
}</code></pre></td>
      <td>Перевіряє чи дорівнює опціональне значення параметру, <code>false</code> якщо порожнє.</td>
    </tr>
  </tbody>
</table>
