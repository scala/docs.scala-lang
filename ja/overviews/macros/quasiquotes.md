---
layout: overview-large
language: ja

disqus: true

partof: macros
num: 5
title: 準クォート
---
<a href="/ja/overviews/macros/paradise.html"><span class="label important" style="float: right;">MACRO PARADISE</span></a>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

準クォート (quasiquote) は 2.11.0-M4 以降の Scala 2.11 のマイルストーン版から含まれる機能だ。Scala 2.10 からもマクロパラダイスプラグインを使うことによって利用可能だ。詳細は[マクロパラダイス](/ja/overviews/macros/paradise.html)ページの説明にしたがってコンパイラプラグインをダウンロードしてほしい。

## 直観

例として、あるクラスかオブジェクトを受け取り、その全てのメソッドを `future` でラッピングした非同期版の複製を作る `async` という[マクロアノテーション](/ja/overviews/macros/annotations.html)を考える。

    @async
    class D {
      def x = 2
      // def asyncX = future { 2 }
    }

    val d = new D
    d.asyncX onComplete {
      case Success(x) => println(x)
      case Failure(_) => println("failed")
    }

そのようなマクロの実装は以下のコードの抜粋のようにできる。この取得、分解、生成コードでラッピング、再構築という流れはマクロ作者にとっては見慣れたものだ。

    case ClassDef(_, _, _, Template(_, _, defs)) =>
      val defs1 = defs collect {
        case DefDef(mods, name, tparams, vparamss, tpt, body) =>
          val tpt1 = if (tpt.isEmpty) tpt else AppliedTypeTree(
            Ident(newTermName("Future")), List(tpt))
          val body1 = Apply(
            Ident(newTermName("future")), List(body))
          val name1 = newTermName("async" + name.capitalize)
          DefDef(mods, name1, tparams, vparamss, tpt1, body1)
      }
      Template(Nil, emptyValDef, defs ::: defs1)

しかし、ベテランのマクロ作者でもこのコードは、かなりシンプルであることは確かだが、例えば、`AppliedTypeTree` と `Apply` の違いなどコードの内部表現の詳細に理解していることを必要とした必要以上に冗長なものであることを認めるだろう。準クォートはパラメータ化された Scala のコードを Scala を使って表現できるドメイン特化言語を提供する:

    val q"class $name extends Liftable { ..$body }" = tree

    val newdefs = body collect {
      case q"def $name[..$tparams](...$vparamss): $tpt = $body" =>
        val tpt1 = if (tpt.isEmpty) tpt else tq"Future[$tpt]"
        val name1 = newTermName("async" + name.capitalize)
        q"def $name1[..$tparams](...$vparamss): $tpt1 = future { $body }"
    }

    q"class $name extends AnyRef { ..${body ++ newdefs} }"

現行の準クォートは [SI-6842](https://issues.scala-lang.org/browse/SI-6842) のため、上記のようには簡潔に書くことができない。[多くのキャスト](https://gist.github.com/7ab617d054f28d68901b)を適用して使えるようになる。

## 詳細

準クォートは `scala.reflect.api.Universe` cake の一部として実装されているため、マクロから準クォートを使うには `import c.universe._` とするだけでいい。公開されている API は `q`、`tq`、`cq`、そして `pq` [文字列補間子](/ja/overviews/core/string-interpolation.html)を提供し (値と型の準クォートに対応する)、構築と分解の両方をサポートする。つまり、普通のコードとパターンケースの左辺値において使うことができる。

<table>
<thead>
<tr><th>補間子</th><th>対象</th><th>構築</th><th>分解</th></tr>
</thead>
<tbody>
<tr><td><code>q</code></td><td>値構文木</td><td><code>q"future{ $body }"</code></td><td><code>case q"future{ $body }" =&gt;</code></td></tr>
<tr><td><code>tq</code></td><td>型構文木</td><td><code>tq"Future[$t]"</code></td><td><code>case tq"Future[$t]" =&gt;</code></td></tr>
<tr><td><code>cq</code></td><td>ケース</td><td><code>cq"x =&gt; x"</code></td><td><code>case cq"$pat =&gt; ${_}" =&gt;</code></td></tr>
<tr><td><code>pq</code></td><td>パターン</td><td><code>pq"xs @ (hd :: tl)"</code></td><td><code>case pq"$id @ ${_}" =&gt;</code></td></tr>
</tbody>
</table>

普通の文字列補間子と違い、準クォートは単独の構文木、構文木のリスト、構文木のリストのリストの挿入または抽出を区別するために複数のスプライシングの方法をサポートしている。スプライス対象とスプライス演算子の基数のミスマッチはコンパイル時のエラーとなる。

    scala> val name = TypeName("C")
    name: scala.reflect.runtime.universe.TypeName = C

    scala> val q"class $name1" = q"class $name"
    name1: scala.reflect.runtime.universe.Name = C

    scala> val args = List(Literal(Constant(2)))
    args: List[scala.reflect.runtime.universe.Literal] = List(2)

    scala> val q"foo(..$args1)" = q"foo(..$args)"
    args1: List[scala.reflect.runtime.universe.Tree] = List(2)

    scala> val argss = List(List(Literal(Constant(2))), List(Literal(Constant(3))))
    argss: List[List[scala.reflect.runtime.universe.Literal]] = List(List(2), List(3))

    scala> val q"foo(...$argss1)" = q"foo(...$argss)"
    argss1: List[List[scala.reflect.runtime.universe.Tree]] = List(List(2), List(3))

## コツとトリック

### Liftable

非構文木のスプライシングを簡易化するために、準クォートは `Lifttable` 型クラスを提供して、値がスプライスされたときにどのように構文木に変換されるかを定義する。プリミティブ型と文字列を `Literal(Constant(...))` にラッピングする `Liftable` インスタンスは提供されている。簡単なケースクラスやリストのための独自のインスタンスを定義することをお勧めする。

    trait Liftable[T] {
      def apply(universe: api.Universe, value: T): universe.Tree
    }
