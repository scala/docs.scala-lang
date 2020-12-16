---
layout: cheatsheet
title: Scala Cheatsheet

partof: cheatsheet

by: Dima Kotobotov
about: Эта шпаргалка создана благодаря <a href="https://brenocon.com/">Brendan O'Connor</a> и предназначена для быстрого ознакомления с синтаксическими конструкциями Scala. Лицензия выдана Brendan O'Connor по лицензии CC-BY-SA 3.0.

language: ru
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
      <td><span id="variables" class="h2">переменные</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">var x = 5</code></td>
      <td>переменная</td>
    </tr>
    <tr>
      <td><span class="label success">Хорошо</span><br><code class="highlighter-rouge">val x = 5</code><br /> <span class="label important">Плохо</span><br><code class="highlighter-rouge">x=6</code></td>
      <td>константа</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">var x: Double = 5</code></td>
      <td>явное указание типа</td>
    </tr>
    <tr>
      <td><span id="functions" class="h2">функции</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Хорошо</span><br> <code class="highlighter-rouge">def f(x: Int) = { x*x }</code><br /> <span class="label important">Плохо</span><br> <code class="highlighter-rouge">def f(x: Int)   { x*x }</code></td>
      <td>объявление функции <br /> незаметная ошибка: без = это процедура с возвращаемым типом "Unit". Такое может ввести в заблуждение</td>
    </tr>
    <tr>
      <td><span class="label success">Хорошо</span><br> <code class="highlighter-rouge">def f(x: Any) = println(x)</code><br /> <span class="label important">Плохо</span><br> <code class="highlighter-rouge">def f(x) = println(x)</code></td>
      <td>объявление функции <br /> синтаксическая ошибка: для каждого аргумента необходимо указывать его тип.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">type R = Double</code></td>
      <td>псевдоним для типа</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def f(x: R)</code> vs.<br /><br /> <code class="highlighter-rouge">def f(x: =&gt; R)</code></td>
      <td>вызов по значению <br /> вызов по имени (вычисление аргумента отложено)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(x:R) =&gt; x*x</code></td>
      <td>анонимная функция</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1 to 5).map(_*2)</code> vs.<br /> <code class="highlighter-rouge">(1 to 5).reduceLeft( _+_ )</code></td>
      <td>анонимная функция: подчеркивание указывает место подставляемого элемента.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1 to 5).map( x =&gt; x*x )</code></td>
      <td>анонимная функция: слева от =&gt; задается имя подставляемого элемента, чтоб его можно было переиспользовать</td>
    </tr>
    <tr>
      <td><span class="label success">Хорошо</span><br> <code class="highlighter-rouge">(1 to 5).map(2*)</code><br /> <span class="label important">Плохо</span><br> <code class="highlighter-rouge">(1 to 5).map(*2)</code></td>
      <td>анонимная функция: запись с использованием инфиксного стиля. Ради четкого понимания лучше использовать явное указание позиции подставляемого элемента в стиле <code class="highlighter-rouge">2*_</code>.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1 to 5).map { x =&gt; val y=x*2; println(y); y }</code></td>
      <td>анонимная функция: стиль блоковой передачи (фигурные скобки обозначают блок), возвращается последнее значение (y).</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1 to 5) filter {_%2 == 0} map {_*2}</code></td>
      <td>анонимные функции: конвейерный стиль. В однострочных выражениях можно использовать простые скобки.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def compose(g:R=&gt;R, h:R=&gt;R) = (x:R) =&gt; g(h(x))</code> <br /> <code class="highlighter-rouge">val f = compose({_*2}, {_-1})</code></td>
      <td>анонимные функции: передача блоков в качестве аргументов</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">val zscore = (mean:R, sd:R) =&gt; (x:R) =&gt; (x-mean)/sd</code></td>
      <td>каррирование, явный синтаксис.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def zscore(mean:R, sd:R) = (x:R) =&gt; (x-mean)/sd</code></td>
      <td>каррирование,  явный синтаксис</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd</code></td>
      <td>каррирование, синтаксический сахар. Но если :</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">val normer = zscore(7, 0.4) _</code></td>
      <td>следом использовать подчеркивание, то мы получим частично определенную функцию.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def mapmake[T](g:T=&gt;T)(seq: List[T]) = seq.map(g)</code></td>
      <td>обобщенный тип.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">5.+(3); 5 + 3</code> <br /> <code class="highlighter-rouge">(1 to 5) map (_*2)</code></td>
      <td>инфиксный стиль.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def sum(args: Int*) = args.reduceLeft(_+_)</code></td>
      <td>функция с переменным числом аргументов.</td>
    </tr>
    <tr>
      <td><span id="packages" class="h2">пакеты</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">import scala.collection._</code></td>
      <td>импорт всех членов пакета.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">import scala.collection.Vector</code> <br /> <code class="highlighter-rouge">import scala.collection.{Vector, Sequence}</code></td>
      <td>выборочный импорт.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">import scala.collection.{Vector =&gt; Vec28}</code></td>
      <td>импорт с переименованием.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">import java.util.{Date =&gt; _, _}</code></td>
      <td>импортировать все из java.util кроме Date.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">package pkg</code> <em>в самом начале файла</em> <br /> <code class="highlighter-rouge">package pkg { ... }</code></td>
      <td>объявление пакета.</td>
    </tr>
    <tr>
      <td><span id="data_structures" class="h2">структуры данных</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1,2,3)</code></td>
      <td>кортеж размера 3. (<code class="highlighter-rouge">Tuple3</code>)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">var (x,y,z) = (1,2,3)</code></td>
      <td>разложение на отдельные элементы: кортеж раскладывается на элементы x, y и z используя сопоставление с образцом.</td>
    </tr>
    <tr>
      <td><span class="label important">Плохо</span><br><code class="highlighter-rouge">var x,y,z = (1,2,3)</code></td>
      <td>незаметная ошибка: каждой переменной будет присвоено по кортежу.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">var xs = List(1,2,3)</code></td>
      <td>список (неизменяемый).</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">xs(2)</code></td>
      <td>получение элемента по индексу в скобках. (<a href="https://www.slideshare.net/Odersky/fosdem-2009-1013261/27">примеры</a>)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">1 :: List(2,3)</code></td>
      <td>добавление к списку.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">1 to 5</code> <em>тоже что и</em> <code class="highlighter-rouge">1 until 6</code> <br /> <code class="highlighter-rouge">1 to 10 by 2</code></td>
      <td>задание диапазона (синтаксический сахар).</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">()</code> <em>(пустые скобки)</em></td>
      <td>одиночный член типа Unit (тоже что и void в C/Java).</td>
    </tr>
    <tr>
      <td><span id="control_constructs" class="h2">управляющие структуры</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">if (check) happy else sad</code></td>
      <td>условие.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">if (check) happy</code>
      <br><em><strong>тоже что и</strong></em><br>
      <code class="highlighter-rouge">if (check) happy else ()</code></td>
      <td>синтаксический сахар (ветка else добавляется автоматически).</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">while (x &lt; 5) { println(x); x += 1}</code></td>
      <td>цикл с условием в блоке while .</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">do { println(x); x += 1} while (x &lt; 5)</code></td>
      <td>цикл с условием и обязательным исполнением в блоке do.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.util.control.Breaks._
breakable {
  for (x <- xs) {
    if (Math.random < 0.1)
      break
  }
}</code></pre></td>
      <td>выход из цикла с использованием break. (<a href="https://www.slideshare.net/Odersky/fosdem-2009-1013261/21">примеры</a>)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">for (x &lt;- xs if x%2 == 0) yield x*10</code>
      <br><em><strong>тоже что и</strong></em><br>
      <code class="highlighter-rouge">xs.filter(_%2 == 0).map(_*10)</code></td>
      <td>for-выражение: выражается набором с filter/map</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">for ((x,y) &lt;- xs zip ys) yield x*y</code>
      <br><em><strong>тоже что и</strong></em><br>
      <code class="highlighter-rouge">(xs zip ys) map { case (x,y) =&gt; x*y }</code></td>
      <td>for-выражение: извлечение элементов с последующим вычислением</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">for (x &lt;- xs; y &lt;- ys) yield x*y</code>
      <br><em><strong>тоже что и</strong></em><br>
      <code class="highlighter-rouge">xs flatMap {x =&gt; ys map {y =&gt; x*y}}</code></td>
      <td>for-выражение: перекрестное объединение</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x <- xs; y <- ys) {
  println("%d/%d = %.1f".format(x, y, x/y.toFloat))
}</code></pre></td>
      <td>for-выражение: императивно<br /><a href="https://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax">sprintf-style</a></td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i <- 1 to 5) {
  println(i)
}</code></pre></td>
      <td>for-выражение: обход диапазона (от 1 до 5) включая его верхнюю границу </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i <- 1 until 5) {
  println(i)
}</code></pre></td>
      <td>for-выражение: обход диапазона (от 1 до 5) не включая его верхнюю границу</td>
    </tr>
    <tr>
      <td><span id="pattern_matching" class="h2">сопоставление с примером</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Хорошо</span><br> <code class="highlighter-rouge">(xs zip ys) map { case (x,y) =&gt; x*y }</code><br /> <span class="label important">Плохо</span><br> <code class="highlighter-rouge">(xs zip ys) map( (x,y) =&gt; x*y )</code></td>
      <td>используйте ключевое слово case при передачи аргументов в функцию для запуска механизма сопоставления с примером.</td>
    </tr>
    <tr>
      <td><span class="label important">Плохо</span><br>
      <pre class="highlight"><code>val v42 = 42
Some(3) match {
  case Some(v42) => println("42")
  case _ => println("Not 42")
}</code></pre></td>
      <td>“v42” интерпретировано как имя для <b>новой</b> константы любого типа, поэтому напечатано “42”.</td>
    </tr>
    <tr>
      <td><span class="label success">Хорошо</span><br>
      <pre class="highlight"><code>val v42 = 42
Some(3) match {
  case Some(`v42`) => println("42")
  case _ => println("Not 42")
}</code></pre></td>
      <td>”`v42`” с обратными кавычками интерпретируется как указание на значение существующей константы <code class="highlighter-rouge">v42</code>, напечатано “Not 42”.</td>
    </tr>
    <tr>
      <td><span class="label success">Хорошо</span><br>
      <pre class="highlight"><code>val UppercaseVal = 42
Some(3) match {
  case Some(UppercaseVal) => println("42")
  case _ => println("Not 42")
}</code></pre></td>
      <td><code class="highlighter-rouge">UppercaseVal</code> однако константы, имена которых начинаются с заглавной буквы, сопоставляются по значению. Поэтому при сопоставлении <code class="highlighter-rouge">UppercaseVal</code> с <code class="highlighter-rouge">3</code>, выводится “Not 42”.</td>
    </tr>
    <tr>
      <td><span id="object_orientation" class="h2">Работа с объектами</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class C(x: R)</code></td>
      <td>параметр конструктора - <code class="highlighter-rouge">x</code> доступен только внутри тела класса</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class C(val x: R)</code><br /><code class="highlighter-rouge">var c = new C(4)</code><br /><code class="highlighter-rouge">c.x</code></td>
      <td>параметр конструктора - доступен публично, автоматически</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(var x: R) {
  assert(x > 0, "positive please")
  var y = x
  val readonly = 5
  private var secret = 1
  def this() = this(42)
}</code></pre></td>
      <td>конструктор является телом класса<br /> объявление публичного члена класса<br />объявление члена с гетером но без сеттера<br />объявление приватного члена<br />объявление альтернативного конструктора без аргумента</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">new{ ... }</code></td>
      <td>анонимный класс</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">abstract class D { ... }</code></td>
      <td>объявление абстрактного класса (не создаваемого, только наследуемого)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class C extends D { ... }</code></td>
      <td>объявление класса с наследованием.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class D(var x: R)</code><br /><code class="highlighter-rouge">class C(x: R) extends D(x)</code></td>
      <td>наследование класса с конструированием параметров. </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">object O extends D { ... }</code></td>
      <td>объявление объекта одиночки (Singleton) на основе другого класса.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">trait T { ... }</code><br /><code class="highlighter-rouge">class C extends T { ... }</code><br /><code class="highlighter-rouge">class C extends D with T { ... }</code></td>
      <td>трейты<br /> описывают какие функции и данные должны быть в классе, возможно также указание конкретной (или общей) реализации а также указание значений переменных. 
      у трейта нет конструктора.  <a href="{{site.baseurl}}/tutorials/tour/mixin-class-composition.html">их можно смешивать</a>.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">trait T1; trait T2</code><br /><code class="highlighter-rouge">class C extends T1 with T2</code><br /><code class="highlighter-rouge">class C extends D with T1 with T2</code></td>
      <td>множественные трейты.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class C extends D { override def f = ...}</code></td>
      <td>при наследовании и создании методов с одинаковыми именами необходимо указывать override.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">new java.io.File("f")</code></td>
      <td>создание объекта.</td>
    </tr>
    <tr>
      <td><span class="label important">Плохо</span><br> <code class="highlighter-rouge">new List[Int]</code><br /> <span class="label success">Хорошо</span><br> <code class="highlighter-rouge">List(1,2,3)</code></td>
      <td>ошибка: List - это абстрактный класс<br />по соглашению используется объект с именем как у абстрактного класса, который уже создает конкретные экземпляры</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">classOf[String]</code></td>
      <td>описание класса.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">x.isInstanceOf[String]</code></td>
      <td>проверка типа (при исполнении)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">x.asInstanceOf[String]</code></td>
      <td>приведение типа (при исполнении)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">x: String</code></td>
      <td>приписывание типа (во время компиляции)</td>
    </tr>
  </tbody>
</table>
