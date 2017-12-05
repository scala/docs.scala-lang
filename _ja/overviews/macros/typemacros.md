---
layout: multipage-overview
language: ja

discourse: false

title: 型マクロ
---
<span class="label important" style="float: right;">OBSOLETE</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

型マクロ (type macro) は[マクロパラダイス](/ja/overviews/macros/paradise.html)の以前のバージョンから利用可能だったが、マクロパラダイス 2.0 ではサポートされなくなった。
[the paradise 2.0 announcement](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html) に説明と移行のための戦略が書かれている。

## 直観

def マクロがコンパイラが特定をメソッドの呼び出しを見つけた時にカスタム関数を実行させることができるように、型マクロは特定の型が使われた時にコンパイラにフックできる。以下のコードの抜粋は、データベースのテーブルから簡単な CRUD 機能を持ったケースクラスを生成する `H2Db` マクロの定義と使用例を示す。

    type H2Db(url: String) = macro impl

    object Db extends H2Db("coffees")

    val brazilian = Db.Coffees.insert("Brazilian", 99, 0)
    Db.Coffees.update(brazilian.copy(price = 10))
    println(Db.Coffees.all)

`H2Db` マクロの完全なソースコードは [GitHub にて](https://github.com/xeno-by/typemacros-h2db)提供して、本稿では重要な点だけをかいつまんで説明する。まず、マクロは、コンパイル時にデータベースに接続することで静的に型付けされたデータベースのラッパーを生成する。(構文木の生成に関しては[リフレクションの概要](http://docs.scala-lang.org/ja/overviews/reflection/overview.html)にて説明する) 次に、<span class="label success">NEW</span> `c.introduceTopLevel` API を用いて生成されたラッパーをコンパイラによって管理されているトップレベル定義のリストに挿入する。最後に、マクロは生成されたクラスのスーパーコンストラクタを呼び出す `Apply` ノードを返す。<span class="tag">注意</span> `c.Expr[T]` に展開される def マクロとちがって型マクロは `c.Tree` に展開されることに注意してほしい。これは、`Expr` が値を表すのに対して、型マクロは型に展開することによる。

    type H2Db(url: String) = macro impl

    def impl(c: Context)(url: c.Expr[String]): c.Tree = {
      val name = c.freshName(c.enclosingImpl.name).toTypeName
      val clazz = ClassDef(..., Template(..., generateCode()))
      c.introduceTopLevel(c.enclosingPackage.pid.toString, clazz)
      val classRef = Select(c.enclosingPackage.pid, name)
      Apply(classRef, List(Literal(Constant(c.eval(url)))))
    }

    object Db extends H2Db("coffees")
    // equivalent to: object Db extends Db$1("coffees")

合成クラスを生成してその参照へと展開するかわりに、型マクロは `Template` 構文木を返すことでそのホストを変換することもできる。scalac 内部ではクラス定義とオブジェクト定義の両方とも `Template` 構文木の簡単なラッパーとして表現されているため、テンプレートへと展開することで型マクロはクラスやオブジェクトの本文全体を書き換えることができるようになる。このテクニックを活用した例も [GitHub で](https://github.com/xeno-by/typemacros-lifter)みることができる。

    type H2Db(url: String) = macro impl

    def impl(c: Context)(url: c.Expr[String]): c.Tree = {
      val Template(_, _, existingCode) = c.enclosingTemplate
      Template(..., existingCode ++ generateCode())
    }

    object Db extends H2Db("coffees")
    // equivalent to: object Db {
    //   <existing code>
    //   <generated code>
    // }

## 詳細

型マクロは def マクロと型メンバのハイブリッドを表す。ある一面では、型マクロはメソッドのように定義される (例えば、値の引数を取ったり、context bound な型パラメータを受け取ったりできる)。一方で、型マクロは型と同じ名前空間に属し、そのため型が期待される位置においてのみ使うことができるため、型や型マクロなどのみをオーバーライドすることができる。(より網羅的な例は [GitHub](https://github.com/scalamacros/kepler/blob/paradise/macros211/test/files/run/macro-typemacros-used-in-funny-places-a/Test_2.scala) を参照してほしい)

<table>
<thead>
<tr><th>機能</th><th>def マクロ</th><th>型マクロ</th><th>型メンバ</th></tr>
</thead>
<tbody>
<tr><td>定義と実装に分かれている</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>値パラメータを取ることができる</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>型パラメータを取ることができる</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><td>変位指定付きの 〃</td><td>No</td><td>No</td><td>Yes</td></tr>
<tr><td>context bounds 付きの 〃</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>オーバーロードすることができる</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>継承することができる</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><td>オーバーライドしたりされたりできる</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
</tbody>
</table>

Scala のプログラムにおいて型マクロは、type、applied type、parent type、new、そして annotation という 5つ役割 (role) のうちの 1つとして登場する。マクロが使われた役割によって許される展開は異なっている。また、役割は　<span class="label success">NEW</span> `c.macroRole` API  によって検査することができる。

<table>
<thead>
<tr><th>役割</th><th>使用例</th><th>クラス</th><th>非クラス?</th><th>Apply?</th><th>Template?</th></tr>
</thead>
<tbody>
<tr><td>type         </td><td><code>def x: TM(2)(3) = ???</code></td><td>Yes</td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td>applied type </td><td><code>class C[T: TM(2)(3)]</code></td><td>Yes</td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td>parent type  </td><td><code>class C extends TM(2)(3)</code><br/><code>new TM(2)(3){}</code></td><td>Yes</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>new          </td><td><code>new TM(2)(3)</code></td><td>Yes</td><td>No</td><td>Yes</td><td>No</td></tr>
<tr><td>annotation   </td><td><code>@TM(2)(3) class C</code></td><td>Yes</td><td>No</td><td>Yes</td><td>No</td></tr>
</tbody>
</table>

要点をまとめると、展開された型マクロは型マクロの使用をそれが返す構文木に置き換える。ある展開が理にかなっているかどうかを考えるには、頭の中でマクロの使用例を展開される構文木で置き換えてみて結果のプログラムが正しいか確かめてみればいい。

例えば、 `class C extends TM(2)(3)` の中で `TM(2)(3)` のように使われている型マクロは `class C extends B(2)` となるように `Apply(Ident(TypeName("B")), List(Literal(Constant(2))))` と展開することができる。しかし、同じ展開は `TM(2)(3)` が `def x: TM(2)(3) = ???` の中の型として使われた場合は `def x: B(2) = ???` となるため、意味を成さない。(ただし、`B` そのものが型マクロではないとする。その場合は再帰的に展開され、その展開の結果がプログラムの妥当性を決定する。)

## コツとトリック

### クラスやオブジェクトの生成

[StackOverflow](http://stackoverflow.com/questions/13795490/how-to-use-type-calculated-in-scala-macro-in-a-reify-clause) でも説明したが、型マクロを作っていると `reify` がどんどん役に立たなくなっていくことに気付くだろう。その場合は、手で構文木を構築するだけではなく、マクロパラダイスにあるもう1つの実験的機能である準クォートを使うことも検討してみてほしい。
