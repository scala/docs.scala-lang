---
layout: multipage-overview
language: ja

discourse: false

partof: macros
overview-name: Macros

num: 3

title: def マクロ
---
<span class="tag" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

def マクロは Scala のバージョン 2.10.0 より追加された実験的機能だ。
def マクロ機能の一部が、徹底した仕様が書かれることを条件に将来の Scala のいつかに安定化することが仮予定されている。

<span class="label success">追記</span> このガイドは Scala 2.10.0 向けに書かれたもので、現在は Scala 2.11.x 系リリースサイクルのまっただ中なので当然本稿の内容が古くなっている。
しかしながら、このガイドが廃れたかと言うとそうとも言えなくて、ここで書かれていることの全ては Scala 2.10.x と Scala 2.11.x
の両方で動作するため目を通す価値はあるはずだ。
これを読んだ後で、[準クォート](/overviews/quasiquotes/intro.html)と
[マクロバンドル](/ja/overviews/macros/bundles.html)のガイドからマクロ定義を簡略化する最新情報を仕入れてほしい。
さらに詳しい具体例を調べるには [macro workshop](https://github.com/scalamacros/macrology201)
も参考にしてほしい。

## 直観

以下がマクロ定義のプロトタイプだ:

    def m(x: T): R = macro implRef

一見するとマクロ定義は普通の関数定義と変わらないが、違いが 1つあってそれは本文が条件付きキーワード `macro` で始まり、次に静的なマクロ実装メソッドの識別子が続くことだ。この識別子は qualify されていてもいい (つまり、`.` で区切ってスコープ外の識別子を参照してもいいということ)。

もし、型検査時にコンパイラがマクロ適用 `m(args)` を見つけると、コンパイラはそのマクロに対応するマクロ実装メソッドに `args` の抽象構文木を引数として渡して呼び出すことによってマクロ適用を展開する。マクロ実装の戻り値もまた抽象構文木で、コールサイトにおいてそれはインライン化され、それが再び型検査される。

以下のコードはマクロ実装 `Asserts.assertImpl` を参照するマクロ定義 `assert` を宣言する (`assertImpl` の定義も後でみる):

    def assert(cond: Boolean, msg: Any) = macro Asserts.assertImpl

そのため、`assert(x < 10, "limit exceeded")` の呼び出しはコンパイル時における以下の呼び出しにつながる:

    assertImpl(c)(<[ x < 10 ]>, <[ “limit exceeded” ]>)

ただし、`c` はコールサイトにおいてコンパイラが収集した情報を格納したコンテキスト引数で、残りの 2つの引数は、2つの式 `x < 10` と `"limit exceeded"` を表す抽象構文木。

本稿においては、式 `expr` を表す抽象構文木を `<[ expr ]>` と表記する。今回提唱された Scala 言語の拡張にはこの表記法に対応するものは含まれていない。実際には、構文木は `scala.reflect.api.Trees` トレイト内の型から構築され、上記の 2つの式は以下のようになる:

    Literal(Constant("limit exceeded"))

    Apply(
      Select(Ident(TermName("x")), TermName("$less"),
      List(Literal(Constant(10)))))

ここに `assert` マクロの実装の一例を載せる:

    import scala.reflect.macros.Context
    import scala.language.experimental.macros

    object Asserts {
      def raise(msg: Any) = throw new AssertionError(msg)
      def assertImpl(c: Context)
        (cond: c.Expr[Boolean], msg: c.Expr[Any]) : c.Expr[Unit] =
       if (assertionsEnabled)
          <[ if (!cond) raise(msg) ]>
          else
          <[ () ]>
    }

この例が示すとおり、マクロ実装はいくつかのパラメータリストを持つ。まず `scala.reflect.macros.Context` 型の パラメータを 1つ受け取るリスト。次に、マクロ定義のパラメータと同じ名前を持つパラメータを列挙したリスト。しかし、もとのマクロのパラメータの型 `T` の代わりにマクロ実装のパラメータは `c.Expr[T]` 型を持つ。`Expr[T]` は `Context` に定義され `T` 型の抽象構文木をラッピングする。マクロ実装 `assertImpl` の戻り型もまたラッピングされた構文木で、`c.Expr[Unit]` 型を持つ。

また、マクロは実験的で、高度な機能だと考えられているため、マクロを定義するにはその機能を明示的に有効化する必要があることに注意してほしい。
これは、ファイルごとに `import scala.language.experimental.macros` と書くか、コンパイルごとに (コンパイラスイッチとして) `-language:experimental.macros` を用いることで行われる。
しかし、ユーザ側は特にコンパイラスイッチや追加の設定などで有効化しなくても普通のメソッド同様に見えるし、普通のメソッド同様に使うことができる。

### 多相的なマクロ

マクロ定義とマクロ実装の両方ともジェネリックにすることができる。もしマクロ実装に型パラメータがあれば、マクロ定義の本文において実際の型引数が明示的に渡される必要がある。実装内での型パラメータは context bounds の `WeakTypeTag`　と共に宣言することができる。その場合、適用サイトでの実際の型引数を記述した型タグがマクロの展開時に一緒に渡される。

以下のコードはマクロ実装 `QImpl.map` を参照するマクロ定義 `Queryable.map` を宣言する:

    class Queryable[T] {
      def map[U](p: T => U): Queryable[U] = macro QImpl.map[T, U]
    }

    object QImpl {
      def map[T: c.WeakTypeTag, U: c.WeakTypeTag]
             (c: Context)
             (p: c.Expr[T => U]): c.Expr[Queryable[U]] = ...
    }

ここで、型が `Queryable[String]` である値 `q` があるとして、そのマクロ呼び出し

    q.map[Int](s => s.length)

を考える。この呼び出しは以下の reflective なマクロ呼び出しに展開される。

    QImpl.map(c)(<[ s => s.length ]>)
       (implicitly[WeakTypeTag[String]], implicitly[WeakTypeTag[Int]])

## 完全な具体例

この節ではコンパイル時に文字列を検査して形式を適用する `printf` マクロを具体例として、最初から最後までの実装をみていく。
説明を簡略化するために、ここではコンソールの Scala コンパイラを用いるが、後に説明があるとおりマクロは Maven や sbt からも使える。

マクロを書くには、まずマクロの窓口となるマクロ定義から始める。
マクロ定義はシグネチャに思いつくまま好きなものを書ける普通の関数だ。
しかし、その本文は実装への参照のみを含む。
前述のとおり、マクロを定義するは `scala.language.experimental.macros` をインポートするか、特殊なコンパイラスイッチ `-language:experimental.macros` を用いて有効化する必要がある。

    import scala.language.experimental.macros
    def printf(format: String, params: Any*): Unit = macro printf_impl

マクロ実装はそれを使うマクロ定義に対応する必要がある (通常は 1つだが、複数のマクロ定義を宣言することもできる)。簡単に言うと、マクロ定義のシグネチャ内の全ての型 `T` のパラメータはマクロ実装のシグネチャ内では `c.Expr[T]` となる必要がある。このルールの完全なリストはかなり込み入ったものだが、これは問題とならない。もしコンパイラが気に入らなければ、エラーメッセージに期待されるシグネチャを表示するからだ。

    import scala.reflect.macros.Context
    def printf_impl(c: Context)(format: c.Expr[String], params: c.Expr[Any]*): c.Expr[Unit] = ...

コンパイラ API は `scala.reflect.macros.Context` から使うことができる。そのうち最も重要な部分であるリフレクション API は `c.universe` から使える。
よく使われる多くの関数や型を含むため、`c.universe._` をインポートするのが慣例となっている:

    import c.universe._

まずマクロは渡された書式文字列をパースする必要がある。
マクロはコンパイル時に実行されるため、値ではなく構文木に対してはたらく。
そのため、`printf` マクロの書式文字列のパラメータは `java.lang.String` 型のオブジェクトではなくコンパイル時リテラルとなる。
また、`printf(get_format(), ...)`　だと `format` は文字列リテラルではなく関数の適用を表す AST であるため、以下のコードでは動作しない。

    val Literal(Constant(s_format: String)) = format.tree

典型的なマクロは Scala のコードを表す AST (抽象構文木) を作成する必要がある。(このマクロも例に漏れない)
Scala コードの生成については[リフレクションの概要](http://docs.scala-lang.org/ja/overviews/reflection/overview.html)を参照してほしい。AST の作成の他に以下のコードは型の操作も行う。
`Int` と `String` に対応する Scala 型をどうやって取得しているのかに注目してほしい。
リンクしたリフレクションの概要で型の操作の詳細を説明する。
コード生成の最終ステップでは、全ての生成されたコードを `Block` へと組み合わせる。
`reify` は AST を簡単に作成する方法を提供する。

    val evals = ListBuffer[ValDef]()
    def precompute(value: Tree, tpe: Type): Ident = {
      val freshName = TermName(c.fresh("eval$"))
      evals += ValDef(Modifiers(), freshName, TypeTree(tpe), value)
      Ident(freshName)
    }

    val paramsStack = Stack[Tree]((params map (_.tree)): _*)
    val refs = s_format.split("(?<=%[\\w%])|(?=%[\\w%])") map {
      case "%d" => precompute(paramsStack.pop, typeOf[Int])
      case "%s" => precompute(paramsStack.pop, typeOf[String])
      case "%%" => Literal(Constant("%"))
      case part => Literal(Constant(part))
    }

    val stats = evals ++ refs.map(ref => reify(print(c.Expr[Any](ref).splice)).tree)
    c.Expr[Unit](Block(stats.toList, Literal(Constant(()))))

以下のコードは `printf` マクロの完全な定義を表す。
追随するには、空のディレクトリを作り、コードを `Macros.scala` という名前の新しいファイルにコピーする。

    import scala.reflect.macros.Context
    import scala.collection.mutable.{ListBuffer, Stack}

    object Macros {
      def printf(format: String, params: Any*): Unit = macro printf_impl

      def printf_impl(c: Context)(format: c.Expr[String], params: c.Expr[Any]*): c.Expr[Unit] = {
        import c.universe._
        val Literal(Constant(s_format: String)) = format.tree

        val evals = ListBuffer[ValDef]()
        def precompute(value: Tree, tpe: Type): Ident = {
          val freshName = TermName(c.fresh("eval$"))
          evals += ValDef(Modifiers(), freshName, TypeTree(tpe), value)
          Ident(freshName)
        }

        val paramsStack = Stack[Tree]((params map (_.tree)): _*)
        val refs = s_format.split("(?<=%[\\w%])|(?=%[\\w%])") map {
          case "%d" => precompute(paramsStack.pop, typeOf[Int])
          case "%s" => precompute(paramsStack.pop, typeOf[String])
          case "%%" => Literal(Constant("%"))
          case part => Literal(Constant(part))
        }

        val stats = evals ++ refs.map(ref => reify(print(c.Expr[Any](ref).splice)).tree)
        c.Expr[Unit](Block(stats.toList, Literal(Constant(()))))
      }
    }

`printf` マクロを使うには、同じディレクトリ内に別のファイル `Test.scala` を作って以下のコードをコピーする。
マクロを使用するのは関数を呼び出すのと同じぐらいシンプルであることに注目してほしい。`scala.language.experimental.macros` をインポートする必要も無い。

    object Test extends App {
      import Macros._
      printf("hello %s!", "world")
    }

マクロ機構の重要な一面は別コンパイルだ。マクロ展開を実行するためには、コンパイラはマクロ実装を実行可能な形式で必要とする。そのため、マクロ実装はメインのコンパイルを行う前にコンパイルされている必要がある。
これをしないと、以下のようなエラーをみることになる:

    ~/Projects/Kepler/sandbox$ scalac -language:experimental.macros Macros.scala Test.scala
    Test.scala:3: error: macro implementation not found: printf (the most common reason for that is that
    you cannot use macro implementations in the same compilation run that defines them)
    pointing to the output of the first phase
      printf("hello %s!", "world")
            ^
    one error found

    ~/Projects/Kepler/sandbox$ scalac Macros.scala && scalac Test.scala && scala Test
    hello world!

## コツとトリック

### コマンドライン Scala コンパイラを用いてマクロを使う

このシナリオは前節で説明したとおりだ。つまり、マクロとそれを使用するコードを別に呼び出した `scalac` によってコンパイルすることで、全てうまくいくはずだ。REPL をつかっているなら、さらに都合がいい。なぜなら REPL はそれぞれの行を独立したコンパイルとして扱うため、マクロを定義してすぐに使うことができる。

<a name="using_macros_with_maven_or_sbt">&nbsp;</a>
### Maven か sbt を用いてマクロを使う

本稿での具体例では最もシンプルなコマンドラインのコンパイルを使っているが、マクロは Maven や sbt などのビルドツールからも使うことができる。完結した具体例としては [https://github.com/scalamacros/sbt-example](https://github.com/scalamacros/sbt-example) か [https://github.com/scalamacros/maven-example](https://github.com/scalamacros/maven-example) を見てほしいが、要点は以下の 2点だ:

<ul>
<li>マクロは、scala-reflect.jar をライブラリ依存性として必要とする。</li>
<li>別コンパイル制約により、マクロは別のプロジェクト内で定義する必要がある。</li>
</ul>

### Scala IDE か Intellij IDEA を用いてマクロを使う

別プロジェクトに分かれている限り、Scala IDE と Intellij IDEA の両方において、マクロは正しく動作することが分かっている。

### マクロのデバッグ

マクロのデバッグ、すなわちマクロ展開を駆動している論理のデバッグは比較的容易だ。マクロはコンパイラ内で展開されるため、デバッガ内でコンパイラを実行するだけでいい。そのためには、以下を実行する必要がある:

<ol>
<li>デバッグ設定のクラスパスに Scala home の lib ディレクトリ内の全て (!) のライブラリを追加する。(これは、<code>scala-library.jar</code>、<code>scala-reflect.jar</code>、そして <code>scala-compiler.jar</code> の jar ファイルを含む。</li>
<li><code>scala.tools.nsc.Main</code> をエントリーポイントに設定する。</li>
<li>JVM のシステムプロパティに <code>-Dscala.usejavacp=true</code> を渡す (とても重要!)</li>
<li>コンパイラのコマンドラインの引数を <code>-cp &lt;マクロのクラスへのパス&gt; Test.scala</code></li> に設定する。ただし、<code>Test.scala</code> は展開されるマクロの呼び出しを含むテストファイルとする。
</ol>

上の手順をふめば、マクロ実装内にブレークポイントを置いてデバッガを起動できるはずだ。

ツールによる特殊なサポートが本当に必要なのはマクロ展開の結果 (つまり、マクロによって生成されたコード) のデバッグだ。このコードは手動で書かれていないため、ブレークポイントを設置することはできず、ステップ実行することもできない。Scala IDE と Intellij IDEA のチームはいずれそれぞれのデバッガにこのサポートを追加することになると思うが、それまでは展開されたマクロをデバッグする唯一の方法は `-Ymacro-debug-lite` という print を使った診断だけだ。これは、マクロによって生成されたコードを表示して、また生成されたコードの実行を追跡して println する。

### 生成されたコードの検査

`-Ymacro-debug-lite` を用いることで展開されたコードを準 Scala 形式と生の AST 形式の両方でみることができる。それぞれに利点があり、前者は表層的な解析に便利で、後者はより詳細なデバッグに不可欠だ。

    ~/Projects/Kepler/sandbox$ scalac -Ymacro-debug-lite Test.scala
    typechecking macro expansion Macros.printf("hello %s!", "world") at
    source-C:/Projects/Kepler/sandbox\Test.scala,line-3,offset=52
    {
      val eval$1: String = "world";
      scala.this.Predef.print("hello ");
      scala.this.Predef.print(eval$1);
      scala.this.Predef.print("!");
      ()
    }
    Block(List(
    ValDef(Modifiers(), TermName("eval$1"), TypeTree().setType(String), Literal(Constant("world"))),
    Apply(
      Select(Select(This(TypeName("scala")), TermName("Predef")), TermName("print")),
      List(Literal(Constant("hello")))),
    Apply(
      Select(Select(This(TypeName("scala")), TermName("Predef")), TermName("print")),
      List(Ident(TermName("eval$1")))),
    Apply(
      Select(Select(This(TypeName("scala")), TermName("Predef")), TermName("print")),
      List(Literal(Constant("!"))))),
    Literal(Constant(())))

### 捕獲されない例外を投げるマクロ

マクロが捕獲されない例外を投げるとどうなるだろうか？例えば、`printf` に妥当ではない入力を渡してクラッシュさせてみよう。
プリントアウトが示すとおり、特に劇的なことは起きない。コンパイラは自身を行儀の悪いマクロから守る仕組みになっているため、スタックトレースのうち関係のある部分を表示してエラーを報告するだけだ。

    ~/Projects/Kepler/sandbox$ scala
    Welcome to Scala version 2.10.0-20120428-232041-e6d5d22d28 (Java HotSpot(TM) 64-Bit Server VM, Java 1.6.0_25).
    Type in expressions to have them evaluated.
    Type :help for more information.

    scala> import Macros._
    import Macros._

    scala> printf("hello %s!")
    <console>:11: error: exception during macro expansion:
    java.util.NoSuchElementException: head of empty list
            at scala.collection.immutable.Nil$.head(List.scala:318)
            at scala.collection.immutable.Nil$.head(List.scala:315)
            at scala.collection.mutable.Stack.pop(Stack.scala:140)
            at Macros$$anonfun$1.apply(Macros.scala:49)
            at Macros$$anonfun$1.apply(Macros.scala:47)
            at scala.collection.TraversableLike$$anonfun$map$1.apply(TraversableLike.scala:237)
            at scala.collection.TraversableLike$$anonfun$map$1.apply(TraversableLike.scala:237)
            at scala.collection.IndexedSeqOptimized$class.foreach(IndexedSeqOptimized.scala:34)
            at scala.collection.mutable.ArrayOps.foreach(ArrayOps.scala:39)
            at scala.collection.TraversableLike$class.map(TraversableLike.scala:237)
            at scala.collection.mutable.ArrayOps.map(ArrayOps.scala:39)
            at Macros$.printf_impl(Macros.scala:47)

                  printf("hello %s!")
                        ^

### 警告とエラーの報告

ユーザと対話するための正式な方法は `scala.reflect.macros.FrontEnds` のメソッドを使うことだ。
`c.error` はコンパイルエラーを報告し、`c.warning` は警告を発令し、`c.abort` はエラーを報告しマクロの実行を停止する。

    scala> def impl(c: Context) =
      c.abort(c.enclosingPosition, "macro has reported an error")
    impl: (c: scala.reflect.macros.Context)Nothing

    scala> def test = macro impl
    defined term macro test: Any

    scala> test
    <console>:32: error: macro has reported an error
                  test
                  ^

[SI-6910](https://issues.scala-lang.org/browse/SI-6910) に記述されているとおり、現時点ではある位置から複数の警告やエラーの報告はサポートされていないことに注意してほしい。そのため、ある位置で最初のエラーか警告だけが報告され他は失くなってしまう。(ただし、同じ位置で後から報告されてもエラーは警告よりも優先される)

<a name="writing_bigger_macros">&nbsp;</a>
### より大きなマクロを書く

マクロ実装が実装メソッドの本文におさまりきらなくなって、モジュール化の必要性が出てくると、コンテキストパラメータを渡して回る必要があることに気付くだろう。マクロを定義するのに必要なもののほとんどがこのコンテキストにパス依存しているからだ。

1つの方法としては `Context` 型のパラメータを受け取るクラスを書いて、マクロ実装をそのクラス内のメソッドに分けるという方法がある。これは一見自然でシンプルにみえるが、実は正しく書くのは難しい。以下に典型的なコンパイルエラーを示す。

    scala> class Helper(val c: Context) {
         | def generate: c.Tree = ???
         | }
    defined class Helper

    scala> def impl(c: Context): c.Expr[Unit] = {
         | val helper = new Helper(c)
         | c.Expr(helper.generate)
         | }
    <console>:32: error: type mismatch;
     found   : helper.c.Tree
        (which expands to)  helper.c.universe.Tree
     required: c.Tree
        (which expands to)  c.universe.Tree
           c.Expr(helper.generate)
                         ^

このコードの問題はパス依存型のミスマッチだ。同じ `c` を使って helper を構築したにもかかわらず、Scala コンパイラは `impl` の `c` が `Helper` の `c` と同じものであることが分からない。

幸いなことに、少し助けてやるだけでコンパイラは何が起こっているのか気付くことができる。様々ある解法の1つは細別型 (refinement type) を使うことだ。以下の例はそのアイディアの最も簡単な例だ。例えば、`Context` から `Helper` への暗黙の変換を書いてやることで明示的なインスタンス化を回避して呼び出しを単純化することができる。

    scala> abstract class Helper {
         | val c: Context
         | def generate: c.Tree = ???
         | }
    defined class Helper

    scala> def impl(c1: Context): c1.Expr[Unit] = {
         | val helper = new { val c: c1.type = c1 } with Helper
         | c1.Expr(helper.generate)
         | }
    impl: (c1: scala.reflect.macros.Context)c1.Expr[Unit]

もう1つの方法はコンテキストのアイデンティティを明示的な型パラメータとして渡す方法だ。`Helper` のコンストラクタが `c.type` を用いて `Helper.c` と元の `c` が同じであることを表していることに注目してほしい。Scala の型推論は単独ではこれを解くことができないため、手伝ってあげているわけだ。

    scala> class Helper[C <: Context](val c: C) {
         | def generate: c.Tree = ???
         | }
    defined class Helper

    scala> def impl(c: Context): c.Expr[Unit] = {
         | val helper = new Helper[c.type](c)
         | c.Expr(helper.generate)
         | }
    impl: (c: scala.reflect.macros.Context)c.Expr[Unit]
