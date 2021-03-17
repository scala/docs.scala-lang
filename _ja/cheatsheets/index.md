---
layout: cheatsheet
title: Scala Cheatsheet

partof: cheatsheet

by: Kenji Ohtsuka
about: Thanks to <a href="https://brenocon.com/">Brendan O'Connor</a>. このチートシートは Scala 構文 のクイックリファレンスとして作成された。 Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license.

language: ja
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
      <td><span id="variables" class="h2">変数</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x = 5</code></pre><br /> <span class="label success">Good</span><br><pre class="highlight"><code>x = 6</code></pre></td>
      <td>変数</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val x = 5</code></pre><br /> <span class="label important">Bad</span><br><pre class="highlight"><code>x = 6</code></pre></td>
      <td>定数</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x: Double = 5</code></pre></td>
      <td>明示的な型</td>
    </tr>
    <tr>
      <td><span id="functions" class="h2">関数</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>def f(x: Int) = { x * x }</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>def f(x: Int)   { x * x }</code></pre></td>
      <td>関数定義<br />落とし穴: <code>=</code> を書かないと <code>Unit</code> を返す手続きになり、大惨事の原因になります。 <a href="https://github.com/scala/scala/pull/6325">Scala 2.13 より非推奨</a>です。</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>def f(x: Any) = println(x)</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>def f(x) = println(x)</code></pre></td>
      <td>関数定義<br />シンタックスエラー: すべての引数に型指定が必要です。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>type R = Double</code></pre></td>
      <td>型エイリアス</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def f(x: R)</code></pre> vs.<br /> <pre class="highlight"><code>def f(x: =&gt; R)</code></pre></td>
      <td>値渡し<br /><br />名前渡し（遅延評価パラメータ）</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(x: R) =&gt; x * x</code></pre></td>
      <td>無名関数</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(_ * 2)</code></pre> vs.<br /> <pre class="highlight"><code>(1 to 5).reduceLeft(_ + _)</code></pre></td>
      <td>無名関数: アンダースコアは位置に応じて引数が代入されます。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(x =&gt; x * x)</code></pre></td>
      <td>無名関数: 引数を2回使用する場合は名前をつけます。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map { x =&gt;
  val y = x * 2
  println(y)
  y
}</code></pre></td>
      <td>無名関数: ブロックスタイルでは最後の式の結果が戻り値になります。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5) filter {
  _ % 2 == 0
} map {
  _ * 2
}</code></pre></td>
      <td>無名関数: パイプラインスタイル (括弧でも同様) 。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def compose(g: R =&gt; R, h: R =&gt; R) =
  (x: R) =&gt; g(h(x))</code></pre> <br /> <pre class="highlight"><code>val f = compose(_ * 2, _ - 1)</code></pre></td>
      <td>無名関数: 複数のブロックを渡す場合は外側の括弧が必要です。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val zscore =
  (mean: R, sd: R) =&gt;
    (x: R) =&gt;
      (x - mean) / sd</code></pre></td>
      <td>カリー化の明示的記法</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean: R, sd: R) =
  (x: R) =&gt;
    (x - mean) / sd</code></pre></td>
      <td>カリー化の明示的記法</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean: R, sd: R)(x: R) =
  (x - mean) / sd</code></pre></td>
      <td>カリー化の糖衣構文、ただしこの場合、</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val normer =
  zscore(7, 0.4) _</code></pre></td>
      <td>部分関数を取得するには末尾にアンダースコアが必要です。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def mapmake[T](g: T =&gt; T)(seq: List[T]) =
  seq.map(g)</code></pre></td>
      <td>ジェネリック型</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>5.+(3); 5 + 3</code></pre> <br /> <pre class="highlight"><code>(1 to 5) map (_ * 2)</code></pre></td>
      <td>中間記法</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def sum(args: Int*) =
  args.reduceLeft(_+_)</code></pre></td>
      <td>可変長引数</td>
    </tr>
    <tr>
      <td><span id="packages" class="h2">パッケージ</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection._</code></pre></td>
      <td>ワイルドカードでインポートします。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.Vector</code></pre> <br /> <pre class="highlight"><code>import scala.collection.{Vector, Sequence}</code></pre></td>
      <td>個別にインポートします。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.{Vector =&gt; Vec28}</code></pre></td>
      <td>別名でインポートします。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import java.util.{Date =&gt; _, _}</code></pre></td>
      <td><code>Date</code>を除いて<code>java.util</code>のすべてをインポートします。</td>
    </tr>
    <tr>
      <td><em>ファイル先頭の:</em> <pre class="highlight"><code>package pkg</code></pre><br /> <em>スコープによるパッケージ: </em> <pre class="highlight"><code>package pkg {
  ...
}</code></pre><br /><em>パッケージシングルトン: </em> <pre class="highlight"><code>package object pkg {
  ...
}</code></pre></td>
      <td>パッケージ宣言</td>
    </tr>
    <tr>
      <td><span id="data_structures" class="h2">data structures</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1, 2, 3)</code></pre></td>
      <td>タイプリテラル (<code class="highlighter-rouge">Tuple3</code>)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var (x, y, z) = (1, 2, 3)</code></pre></td>
      <td>構造化代入: パターンマッチによるタプルの展開。</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br><pre class="highlight"><code>var x, y, z = (1, 2, 3)</code></pre></td>
      <td>落とし穴: 各変数にタプル全体が代入されます。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var xs = List(1, 2, 3)</code></pre></td>
      <td>リスト (イミュータブル)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>xs(2)</code></pre></td>
      <td>括弧を使って添字を書きます。(<a href="https://www.slideshare.net/Odersky/fosdem-2009-1013261/27">slides</a>)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 :: List(2, 3)</code></pre></td>
      <td>先頭に要素を追加</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 to 5</code></pre> <em>上記と同じ</em> <pre class="highlight"><code>1 until 6</code></pre> <br /> <pre class="highlight"><code>1 to 10 by 2</code></pre></td>
      <td><code>Range</code>の糖衣構文</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>()</code></pre></td>
      <td>中身のない括弧は、Unit 型 の唯一の値です。<br /> CやJavaで言う<code class="highlighter-rouge">void</code>にあたります。</td>
    </tr>
    <tr>
      <td><span id="control_constructs" class="h2">制御構文</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy else sad</code></pre></td>
      <td>条件分岐</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy</code></pre>
      <br><em><strong>上記と同様</strong></em><br>
      <pre class="highlight"><code>if (check) happy else ()</code></pre></td>
      <td>条件分岐の省略形</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>while (x &lt; 5) {
  println(x)
  x += 1
}</code></pre></td>
      <td>while ループ</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>do {
  println(x)
  x += 1
} while (x &lt; 5)</code></pre></td>
      <td>do while ループ</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.util.control.Breaks._

breakable {
  for (x &lt;- xs) {
    if (Math.random &lt; 0.1)
      break
  }
}</code></pre></td>
      <td>break (<a href="https://www.slideshare.net/Odersky/fosdem-2009-1013261/21">slides</a>)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs if x % 2 == 0)
  yield x * 10</code></pre>
      <br><em><strong>上記と同様</strong></em><br>
      <pre class="highlight"><code>xs.filter(_ % 2 == 0).map(_ * 10)</code></pre></td>
      <td>for 内包記法: filter/map</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for ((x, y) &lt;- xs zip ys)
  yield x * y</code></pre>
      <br><em><strong>上記と同様</strong></em><br>
      <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre></td>
      <td>for 内包表記: 構造化代入</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys)
  yield x * y</code></pre>
      <br><em><strong>上記と同様</strong></em><br>
      <pre class="highlight"><code>xs flatMap { x =&gt;
  ys map { y =&gt;
    x * y
  }
}</code></pre></td>
      <td>for 内包表記: 直積</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys) {
  val div = x / y.toFloat
  println("%d/%d = %.1f".format(x, y, div))
}</code></pre></td>
      <td>for 内包表記: 命令型の記述<br /><a href="https://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax">sprintf-style</a></td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i &lt;- 1 to 5) {
  println(i)
}</code></pre></td>
      <td>for 内包表記: 上限を含んだ走査</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i &lt;- 1 until 5) {
  println(i)
}</code></pre></td>
      <td>for 内包表記: 上限を除いた走査</td>
    </tr>
    <tr>
      <td><span id="pattern_matching" class="h2">パターンマッチング</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>(xs zip ys) map {
  (x, y) =&gt; x * y
}</code></pre></td>
      <td>case をパターンマッチのために関数の引数で使っています。</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br>
      <pre class="highlight"><code>val v42 = 42
3 match {
  case v42 =&gt; println("42")
  case _   =&gt; println("Not 42")
}</code></pre></td>
      <td><code>v42</code> は任意の Int の値とマッチする変数名として解釈され、 “42” が表示されます。</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br>
      <pre class="highlight"><code>val v42 = 42
3 match {
  case `v42` =&gt; println("42")
  case _     =&gt; println("Not 42")
}</code></pre></td>
      <td>バッククオートで囲んだ <code>`v42`</code> は既に存在する <code>v42</code> として解釈され、 “Not 42” が表示されます。</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br>
      <pre class="highlight"><code>val UppercaseVal = 42
3 match {
  case UppercaseVal =&gt; println("42")
  case _            =&gt; println("Not 42")
}</code></pre></td>
      <td>大文字から始まる <code>UppercaseVal</code> は既に存在する定数として解釈され、新しい変数としては扱われません。 これにより <code>UppercaseVal</code> は <code>3</code> とは異なる値と判断され、 “Not 42” が表示されます。</td>
    </tr>
    <tr>
      <td><span id="object_orientation" class="h2">オブジェクト指向</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(x: R)</code></pre></td>
      <td>コンストラクタの引数。<code>x</code> はクラス内部からのみ利用できます。（private）</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(val x: R)</code></pre><br /><pre class="highlight"><code>var c = new C(4)</code></pre><br /><pre class="highlight"><code>c.x</code></pre></td>
      <td>コンストラクタの引数。自動的に公開メンバとして定義されます。（public）</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(var x: R) {
  assert(x > 0, "positive please")
  var y = x
  val readonly = 5
  private var secret = 1
  def this = this(42)
}</code></pre></td>
      <td>コンストラクタはクラスの body 部分 です。<br />public メンバ の宣言<br />読取可能・書込不可なメンバの宣言<br />private メンバ の宣言<br />代替コンストラクタ</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new {
  ...
}</code></pre></td>
      <td>無名クラス</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>abstract class D { ... }</code></pre></td>
      <td>抽象クラスの定義 (生成不可)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { ... }</code></pre></td>
      <td>継承クラスの定義</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class D(var x: R)</code></pre><br /><pre class="highlight"><code>class C(x: R) extends D(x)</code></pre></td>
      <td>継承とコンストラクタのパラメータ (要望: 自動的にパラメータを引き継げるようになってほしい)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>object O extends D { ... }</code></pre></td>
      <td>シングルトンオブジェクトの定義 (モジュールに似ている)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T { ... }</code></pre><br /><pre class="highlight"><code>class C extends T { ... }</code></pre><br /><pre class="highlight"><code>class C extends D with T { ... }</code></pre></td>
      <td>トレイト<br />実装を持ったインターフェースで、コンストラクタのパラメータを持つことができません。<a href="{{site.baseurl}}/tutorials/tour/mixin-class-composition.html">mixin-able</a>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T1; trait T2</code></pre><br /><pre class="highlight"><code>class C extends T1 with T2</code></pre><br /><pre class="highlight"><code>class C extends D with T1 with T2</code></pre></td>
      <td>複数のトレイトを組み合わせられます。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { override def f = ...}</code></pre></td>
      <td>メソッドの override は明示する必要があります。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new java.io.File("f")</code></pre></td>
      <td>オブジェクトの生成</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br> <pre class="highlight"><code>new List[Int]</code></pre><br /> <span class="label success">Good</span><br> <pre class="highlight"><code>List(1, 2, 3)</code></pre></td>
      <td>型のエラー: 抽象型のオブジェクトは生成できません。<br />代わりに、習慣として、型を隠蔽するファクトリを使います。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>classOf[String]</code></pre></td>
      <td>クラスの情報取得</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.isInstanceOf[String]</code></pre></td>
      <td>型のチェック (実行時)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.asInstanceOf[String]</code></pre></td>
      <td>型のキャスト (実行時)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x: String</code></pre></td>
      <td>型帰属 (コンパイル時)</td>
      <td> </td>
    </tr>
    <tr>
      <td><span id="options" class="h2">Option型</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Some(42)</code></pre></td>
      <td>空ではないオプション値</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>None</code></pre></td>
      <td>空のオプション値のシングルトン</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Option(null) == None
Option(obj.unsafeMethod)</code></pre>
      <em><strong>しかし以下のケースは同じではない</strong></em>
      <pre class="highlight"><code>Some(null) != None</code></pre></td>
      <td>Null安全なオプション値の生成</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val optStr: Option[String] = None</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>val optStr = Option.empty[String]</code></pre></td>
      <td>空のオプション値の明示的な型<br />空のオプション値の生成</td>
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
      <td>パイプラインスタイル</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val upper = for {
  name &lt;- request.getParameter("name")
  trimmed &lt;- Some(name.trim)
    if trimmed.length != 0
  upper &lt;- Some(trimmed.toUpperCase)
} yield upper
println(upper.getOrElse(""))</code></pre></td>
      <td>for 内包表記構文</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.map(f(_))</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(f(x))
  case None    =&gt; None
}</code></pre></td>
      <td>オプション値への関数の適用</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.flatMap(f(_))</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; None
}</code></pre></td>
      <td>上記の<code>map</code> と同様だが、関数は戻り値としてオプション値を返す必要がある。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>optionOfOption.flatten</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>optionOfOption match {
  case Some(Some(x)) =&gt; Some(x)
  case _             =&gt; None
}</code></pre></td>
      <td>ネストされたオプション値の展開</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.foreach(f(_))</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; ()
}</code></pre></td>
      <td>オプション値へのプロシージャの適用</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.fold(y)(f(_))</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; y
}</code></pre></td>
      <td>オプション値への関数の適用。空であればデフォルト値（<code>y</code>）を返す</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.collect {
  case x =&gt; ...
}</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f.isDefinedAt(x) =&gt; ...
  case Some(_)                     =&gt; None
  case None                        =&gt; None
}</code></pre></td>
      <td>オプション値への部分的なパターンマッチの適用</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isDefined</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td>空のオプション値でなければ<code>true</code>を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isEmpty</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; false
  case None    =&gt; true
}</code></pre></td>
      <td>空のオプション値であれば<code>true</code>を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.nonEmpty</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td>空のオプション値でなければ<code>true</code>を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.size</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; 1
  case None    =&gt; 0
}</code></pre></td>
      <td>空であれば<code>0</code> を返し、そうでなければ<code>1</code>を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orElse(Some(y))</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(x)
  case None    =&gt; Some(y)
}</code></pre></td>
      <td>値を評価し、空のオプション値であれば代替のオプション値を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.getOrElse(y)</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; y
}</code></pre></td>
      <td>値を評価し、空のオプションであればデフォルトの値を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.get</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; throw new Exception
}</code></pre></td>
      <td>値を返すが、空であれば例外を投げる。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orNull</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; null
}</code></pre></td>
      <td>値を返すが、空であれば<code>null</code>を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filter(f)</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; Some(x)
  case _               =&gt; None
}</code></pre></td>
      <td><code>f</code>を満たすオプション値</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filterNot(f(_))</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if !f(x) =&gt; Some(x)
  case _                =&gt; None
}</code></pre></td>
      <td><code>f</code>を満たさないオプション値</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.exists(f(_))</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; true
  case Some(_)         =&gt; false
  case None            =&gt; false
}</code></pre></td>
      <td>オプション値が<code>f</code>を満たす場合は<code>true</code>を返す。そうでない場合、あるいは空であれば<code>false</code>を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.forall(f(_))</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; true
  case Some(_)         =&gt; false
  case None            =&gt; true
}</code></pre></td>
      <td>オプション値が<code>f</code>を満たす場合は<code>true</code>を返す。そうでない場合は<code>false</code>を返すが、空であれば<code>true</code>を返す。</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.contains(y)</code></pre>
      <em><strong>上記と同様</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x == y
  case None    =&gt; false
}</code></pre></td>
      <td>オプション値が値と同じか判別する。空であれば<code>false</code>を返す。</td>
    </tr>
  </tbody>
</table>
