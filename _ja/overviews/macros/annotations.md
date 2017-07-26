---
layout: multipage-overview

language: ja
discourse: false

partof: macros
overview-name: Macros

num: 9

title: マクロアノテーション
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

マクロアノテーションはマクロパラダイスプラグインからのみ利用可能だ (Scala 2.10.x、2.11.x、2.12.x 系列全て同様)。
この機能が正式な Scala に入る可能性は、Scala 2.13 には残されているが、一切保証されていない。
[マクロパラダイス](/ja/overviews/macros/paradise.html)ページの説明にしたがってコンパイラプラグインをダウンロードしてほしい。

## 一巡り

マクロアノテーションは定義レベルでテキスト抽象化を実現する。Scala がマクロだと認識可能な定義であればトップレベルでも入れ子の定義でも、このアノテーションを付けることで (1つまたは複数の) メンバに展開させることができる。マクロパラダイスの以前のバージョンと比較して、2.0 のマクロパラダイスは以下の点を改善した:

<ol>
<li>クラスやオブジェクトだけではなく任意の定義に適用できるようになった。</li>
<li>クラスを展開してコンパニオンオブジェクトを変更もしくは新規に生成できるようになった。</li>
</ol>

これでコード生成に関して様々な可能性が広がったと言える。

この項では、役に立たないけども例としては便利な、注釈対象をログに書き込むこと以外は何もしないマクロを書いてみよう。
最初のステップは、`StaticAnnotation` を継承して、`macroTransform` マクロを定義する。
(この本文の `???` は 2.10.2 以降から使えるものだ。)

    import scala.reflect.macros.Context
    import scala.language.experimental.macros
    import scala.annotation.StaticAnnotation

    class identity extends StaticAnnotation {
      def macroTransform(annottees: Any*) = macro ???
    }

`macroTransform` マクロは型指定の無い (untyped) 注釈対象を受け取り (Scala には他に記法が無いためこのシグネチャの型は `Any` となる)、単数もしくは複数の結果を生成する (単数の結果はそのまま返せるが、複数の結果の場合はリフレクション API に他に良い記法が無いため `Block` にラッピングして返す)。

この時点で、一つの注釈対象に対して単一の結果は分かるが、複数対複数のマッピングがどのようになるのか疑問に思っている方もいるだろう。この過程はルールによって決定される:

<ol>
<li>あるクラスが注釈され、それにコンパニオンがある場合は、両者ともマクロに渡される。　(しかし、逆は真ではない。もしオブジェクトが注釈され、それにコンパニオンクラスがあってもオブジェクトのみが展開される)</li>
<li>あるクラス、メソッド、もしくは型のパラメータが注釈される場合は、そのオーナーも展開される。まずは注釈対象、次にオーナー、そして上記のルールに従ってコンパニオンが渡される。</li>
<li>注釈対象は任意の数および種類の構文木に展開することができ、コンパイラはマクロの構文木を結果の構文木に透過的に置換する。</li>
<li>あるクラスが同じ名前を持つクラスとオブジェクトに展開する場合は、それらはコンパニオンとなる。これにより、コンパニオンが明示的に宣言されていないクラスにもコンパニオンオブジェクトを生成することができるようになる。</li>
<li>トップレベルでの展開は注釈対象の数を、種類、および名前を保持しなくてはいけない。唯一の例外はクラスがクラスと同名のオブジェクトに展開できることだ。その場合は、上記のルールによってそれらは自動的にコンパニオンとなる。</li>
</ol>

以下に、`identity` アノテーションマクロの実装例を示す。
`@identity` が値か型パラメータに適用された場合のことも考慮に入れる必要があるため、ロジックは少し複雑になっている。コンパイラプラグイン側からは容易に標準ライブラリを変更できないため、このボイラープレートをヘルパー内でカプセル化できなかったため、解法がローテクになっていることは許してほしい。
(ちなみに、このボイラープレートそのものも適切なアノテーションマクロによって抽象化できるはずなので、将来的にはそのようなマクロが提供できるかもしれない。)

    object identityMacro {
      def impl(c: Context)(annottees: c.Expr[Any]*): c.Expr[Any] = {
        import c.universe._
        val inputs = annottees.map(_.tree).toList
        val (annottee, expandees) = inputs match {
          case (param: ValDef) :: (rest @ (_ :: _)) => (param, rest)
          case (param: TypeDef) :: (rest @ (_ :: _)) => (param, rest)
          case _ => (EmptyTree, inputs)
        }
        println((annottee, expandees))
        val outputs = expandees
        c.Expr[Any](Block(outputs, Literal(Constant(()))))
      }
    }


<table>
<thead>
<tr><th>コード例</th><th>表示</th></tr>
</thead>
<tbody>
<tr>
  <td><code>@identity class C</code></td>
  <td><code>(&lt;empty&gt;, List(class C))</code></td>
</tr>
<tr>
  <td><code>@identity class D; object D</code></td>
  <td><code>(&lt;empty&gt;, List(class D, object D))</code></td>
</tr>
<tr>
  <td><code>class E; @identity object E</code></td>
  <td><code>(&lt;empty&gt;, List(object E))</code></td>
</tr>
<tr>
  <td><code>def twice[@identity T]<br/>
(@identity x: Int) = x * 2</code></td>
  <td><code>(type T, List(def twice))<br/>
(val x: Int, List(def twice))</code></td>
</tr>
</tbody>
</table>

Scala マクロの精神に則り、マクロアノテーションは柔軟性のために可能な限り型指定を無くし (untyped; マクロ展開前に型検査を必須としないこと)、利便性のために可能な限り型付けた (typed; マクロ展開前に利用可能な型情報を取得すること)。注釈対象は型指定が無いため、後付けでシグネチャ (例えばクラスメンバのリストなど) を変更できる。しかし、Scala マクロを書くということはタイプチェッカと統合するということであり、マクロアノテーションもそれは同じだ。そのため、マクロ展開時には全ての型情報を得ることができる
(例えば、包囲するプログラムに対してリフレクションを使ったり、現行スコープ内から型検査を行ったり、implicit の検索を行うことができる)。

## blackbox vs whitebox

マクロアノテーションは [whitebox](/ja/overviews/macros/blackbox-whitebox.html) である必要がある。
マクロアノテーションを [blackbox](/ja/overviews/macros/blackbox-whitebox.html) だと宣言すると正しく動作しない。
