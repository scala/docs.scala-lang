---
layout: overview-large

disqus: true

partof: reflection
num: 4
outof: 6
language: ja
title: アノテーション、名前、スコープ、その他
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

## アノテーション

Scala において宣言は `scala.annotation.Annotation` のサブタイプを用いて注釈を付けることができる。
さらに、Scala は [Java のアノテーションシステム](http://docs.oracle.com/javase/7/docs/technotes/guides/language/annotations.html#_top)に統合するため、標準 Java コンパイラによって生成されたアノテーションを取り扱うこともできる。

アノテーションは、それが永続化されていればリフレクションを使ってインスペクトすることができるため、アノテーション付きの宣言を含むクラスファイルから読み込むことができる。カスタムアノテーション型は
`scala.annotation.StaticAnnotation` か
`scala.annotation.ClassfileAnnotation` を継承することで永続化することができる。
その結果、アノテーション型のインスタンスはクラスファイル内の特別な属性として保存される。
実行時リフレクションに必要なメタデータを永続化するには
`scala.annotation.Annotation` を継承するだけでは不十分であることに注意してほしい。さらに、
`scala.annotation.ClassfileAnnotation` を継承しても実行時には Java
アノテーションとしては認識されないことに注意してほしい。そのためには、Java でアノテーションを書く必要がある。

API は 2種類のアノテーションを区別する:

- **Java アノテーション**: Java コンパイラによって生成された定義に付加されたアノテーション、つまりプログラムの定義に付けられた `java.lang.annotation.Annotation` のサブタイプ。Scala リフレクションによって読み込まれると `scala.annotation.ClassfileAnnotation` トレイトが自動的に全ての Java アノテーションに追加される。
- **Scala アノテーション**: Scala コンパイラによって生成された定義や型に付加されたアノテーション。

Java と Scala のアノテーションの違いは
`scala.reflect.api.Annotations#Annotation` に顕著に現れており、これは
`scalaArgs` と `javaArgs` 両方を公開する。
`scala.annotation.ClassfileAnnotation` を継承する
Scala または Java アノテーションに対しては `scalaArgs` は空で
(もしあれば) 引数は `javaArgs` に保持される。他の全ての Scala
アノテーションの場合は、引数は `scalaArgs` に保持され、`javaArgs` は空となる。

`scalaArgs` 内の引数は型付けされた構文木として表される。
これらの構文木はタイプチェッカより後のどのフェーズにおいても変換されないことに注意する必要がある。
`javaArgs` 内の引数は `scala.reflect.api.Names#Name` から
`scala.reflect.api.Annotations#JavaArgument` へのマップとして表現される。
`JavaArgument` のインスタンスは Java アノテーションの引数の様々な型を表現する:

<ul>
<li>リテラル (プリミティブ型と文字列の定数)</li>
<li>配列</li>
<li>入れ子になったアノテーション</li>
</ul>

## 名前

**名前** (name) は文字列の簡単なラッパーだ。
[`Name`](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Names$NameApi)
には 2つのサブタイプ `TermName` と `TypeName` があり (オブジェクトやメンバーのような) 項の名前と
(クラス、トレイト、型メンバのような) 型の名前を区別する。同じオブジェクト内に同名の項と型が共存することができる。別の言い方をすると、型と項は別の名前空間を持つ。

これらの名前はユニバースに関連付けられている。具体例を使って説明しよう。

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val mapName = newTermName("map")
    mapName: scala.reflect.runtime.universe.TermName = map

上のコードでは、実行時リフレクション・ユニバースに関連付けられた `Name` を作成している。
(これはパス依存型である `reflect.runtime.universe.TermName` が表示されていることからも分かる。)

名前は型のメンバの照会に用いられる。例えば、`List` クラス内で宣言されている (項である) `map` メソッドを検索するには以下のようにする:

    scala> val listTpe = typeOf[List[Int]]
    listTpe: scala.reflect.runtime.universe.Type = scala.List[Int]

    scala> listTpe.member(mapName)
    res1: scala.reflect.runtime.universe.Symbol = method map

型メンバを検索するには `newTypeName` を代わりに使って `member` を呼び出す。
暗黙の変換を使って文字列から項もしくは型の名前に変換することもできる:

    scala> listTpe.member("map": TermName)
    res2: scala.reflect.runtime.universe.Symbol = method map

### 標準名

Scala のプログラムにおいて、「`_root_`」のような特定の名前は特殊な意味を持つ。
そのため、それらは Scala の構造物をリフレクションを用いてアクセスするのに欠かすことができない。
例えば、リフレクションを用いてコンストラクタを呼び出すには**標準名** (standard name)
`universe.nme.CONSTRUCTOR` を用いる。これは、JVM 上でのコンストラクタ名である項名「`<init>`」を指す。

- 「`<init>`」、「`package`」、「`_root_`」のような**標準項名** (standard term names) と
- 「`<error>`」、「`_`」、「`_*`」のような**標準型名** (standard type names)

の両方が存在する。

「`package`」のようないくつかの名前は型名と項名の両方が存在する。
標準名は `Universe` クラスの `nme` と `tpnme` というメンバとして公開されている。
全ての標準名の仕様は [API doc](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.StandardNames) を参照。

## スコープ

**スコープ** (scope) は一般にある構文スコープ内の名前をシンボルに関連付ける。
スコープは入れ子にすることもできる。リフレクション API
で公開されているスコープの基底型は [Symbol](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Symbols$Symbol) の iterable という最小限のインターフェイスのみを公開する。

追加機能は
[scala.reflect.api.Types#TypeApi](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Types$TypeApi)
内で定義されている `member` と `declarations`
が返す**メンバスコープ** (member scope) にて公開される。
[scala.reflect.api.Scopes#MemberScope](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Scopes$MemberScope)
は `sorted` メソッドをサポートしており、これはメンバを**宣言順に**ソートする。

以下に `List` クラスでオーバーライドされている全てのシンボルのリストを宣言順に返す具体例をみてみよう:

    scala> val overridden = listTpe.declarations.sorted.filter(_.isOverride)
    overridden: List[scala.reflect.runtime.universe.Symbol] = List(method companion, method ++, method +:, method toList, method take, method drop, method slice, method takeRight, method splitAt, method takeWhile, method dropWhile, method span, method reverse, method stringPrefix, method toStream, method foreach)

## Expr

構文木の基底型である `scala.reflect.api.Trees#Tree` の他に、型付けされた構文木は
[`scala.reflect.api.Exprs#Expr`](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Exprs$Expr) 型によっても表すことができる。
`Expr` は構文木と、その構文木の型に対するアクセスを提供するための型タグをラッピングする。
`Expr` は主にマクロのために便宜的に型付けられた構文木を作るために使われる。多くの場合、これは
`reify` と `splice` メソッドが関わってくる。
(詳細は[マクロ](http://docs.scala-lang.org/ja/overviews/macros/overview.html)を参照)

## フラグとフラグ集合

**フラグ** (flag) は
`scala.reflect.api.Trees#Modifiers` である `flags` を用いて定義を表す構文木に修飾子を与えるのに使われる。
以下に修飾子を受け付ける構文木を挙げる:

- `scala.reflect.api.Trees#ClassDef`。クラスとトレイト。
- `scala.reflect.api.Trees#ModuleDef`。オブジェクト。
- `scala.reflect.api.Trees#ValDef`。`val`、`var`、パラメータ、自分型注釈。
- `scala.reflect.api.Trees#DefDef`。メソッドとコンストラクタ。
- `scala.reflect.api.Trees#TypeDef`。型エイリアス、抽象型メンバ、型パラメータ。

例えば、`C` という名前のクラスを作るには以下のように書く:

    ClassDef(Modifiers(NoFlags), newTypeName("C"), Nil, ...)

ここでフラグ集合は空だ。`C` を private にするには、以下のようにする:

    ClassDef(Modifiers(PRIVATE), newTypeName("C"), Nil, ...)

垂直バー演算子 (`|`) を使って組み合わせることができる。例えば、private final
クラスは以下のように書く:

    ClassDef(Modifiers(PRIVATE | FINAL), newTypeName("C"), Nil, ...)

全てのフラグのリストは
`scala.reflect.api.FlagSets#FlagValues` にて定義されており、
`scala.reflect.api.FlagSets#Flag` から公開されている。
(一般的には、これを
`import scala.reflect.runtime.universe.Flag._` のようにワイルドカードインポートする。)

定義の構文木はコンパイル後にはシンボルとなるため、これらの構文木の修飾子のフラグは結果となるシンボルのフラグへと変換される。
構文木と違ってシンボルはフラグを公開しないが、`isXXX`
というパターンのテストメソッドを提供する
(例えば `isFinal` は final かどうかをテストする)。
特定のフラグはある種類のシンボルでしか使われないため、場合によってはシンボルを
`asTerm`、`asType`、`asClass` といったメソッドを使って変換する必要がある。

**注意:** リフレクションAPI のこの部分は再設計の候補に挙がっている。リフレクションAPI
の将来のリリースにおいてフラグ集合が他のものと置き換わる可能性がある。

## 定数

Scala の仕様において**定数式** (constant expression) と呼ばれる式は
Scala コンパイラによってコンパイル時に評価することができる。
以下に挙げる式の種類はコンパイル時定数だ。
([Scala 言語仕様 の 6.24](http://scala-lang.org/files/archive/spec/2.11/06-expressions.html#constant-expressions) 参照):

1. プリミティブ値クラスのリテラル ([Byte](http://www.scala-lang.org/api/current/index.html#scala.Byte)、 [Short](http://www.scala-lang.org/api/current/index.html#scala.Short)、 [Int](http://www.scala-lang.org/api/current/index.html#scala.Int)、 [Long](http://www.scala-lang.org/api/current/index.html#scala.Long)、 [Float](http://www.scala-lang.org/api/current/index.html#scala.Float)、 [Double](http://www.scala-lang.org/api/current/index.html#scala.Double)、 [Char](http://www.scala-lang.org/api/current/index.html#scala.Char)、 [Boolean](http://www.scala-lang.org/api/current/index.html#scala.Boolean) および [Unit](http://www.scala-lang.org/api/current/index.html#scala.Unit))。これは直接対応する型で表される。
2. 文字列リテラル。これは文字列のインスタンスとして表される。
3. 一般に [scala.Predef#classOf](http://www.scala-lang.org/api/current/index.html#scala.Predef$@classOf[T]:Class[T]) で構築されるクラスへの参照。[型](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Types$Type)として表される。
4. Java の列挙要素。[シンボル](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Symbols$Symbol)として表される。

定数式の用例としては

- 構文木内のリテラル (`scala.reflect.api.Trees#Literal` 参照)
- Java のクラスファイルアノテーションへ渡されるリテラル (`scala.reflect.api.Annotations#LiteralArgument` 参照)

などがある。具体例をみてみよう。

    Literal(Constant(5))

上の式は Scala ソース内での整数リテラル `5` を表す AST を構築する。

`Constant` は「仮想ケースクラス」の一例で、普通のクラスなのだが、あたかもケースクラスであるかのうように構築したりパターンマッチしたりすることができる。
`Literal` と `LiteralArgument` の両方ともがリテラルのコンパイル時定数を返す
`value` メソッドを公開する。

具体例で説明しよう:

    Constant(true) match {
      case Constant(s: String)  => println("A string: " + s)
      case Constant(b: Boolean) => println("A Boolean value: " + b)
      case Constant(x)          => println("Something else: " + x)
    }
    assert(Constant(true).value == true)

クラス参照は `scala.reflect.api.Types#Type` のインスタンスを用いて表される。
この参照は、`scala.reflect.runtime.currentMirror` のような
`RuntimeMirror` の `runtimeClass` メソッドを用いてランタイムクラスへと変換することができる。
(Scala コンパイラがクラス参照の処理を行なっている段階においては、その参照が指すランタイムクラスがまだコンパイルされていない可能性があるため、このように型からランタイムクラスへと変換することが必要となる。)

Java の列挙要素への参照はシンボル (`scala.reflect.api.Symbols#Symbol`)
として表され、対応する列挙要素を JVM 上で返すことができるメソッドを持つ。
`RuntimeMirror` を使って対応する列挙型や列挙値への参照の実行時の値をインスペクトすることができる。

具体例をみてこう:

    // Java ソース:
    enum JavaSimpleEnumeration { FOO, BAR }

    import java.lang.annotation.*;
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.TYPE})
    public @interface JavaSimpleAnnotation {
      Class<?> classRef();
      JavaSimpleEnumeration enumRef();
    }

    @JavaSimpleAnnotation(
      classRef = JavaAnnottee.class,
      enumRef = JavaSimpleEnumeration.BAR
    )
    public class JavaAnnottee {}

    // Scala ソース:
    import scala.reflect.runtime.universe._
    import scala.reflect.runtime.{currentMirror => cm}

    object Test extends App {
      val jann = typeOf[JavaAnnottee].typeSymbol.annotations(0).javaArgs

      def jarg(name: String) = jann(newTermName(name)) match {
        // Constant is always wrapped in a Literal or LiteralArgument tree node
        case LiteralArgument(ct: Constant) => value
        case _ => sys.error("Not a constant")
      }

      val classRef = jarg("classRef").value.asInstanceOf[Type]
      println(showRaw(classRef))         // TypeRef(ThisType(), JavaAnnottee, List())
      println(cm.runtimeClass(classRef)) // class JavaAnnottee

      val enumRef = jarg("enumRef").value.asInstanceOf[Symbol]
      println(enumRef)                   // value BAR

      val siblings = enumRef.owner.typeSignature.declarations
      val enumValues = siblings.filter(sym => sym.isVal && sym.isPublic)
      println(enumValues)                // Scope {
                                         //   final val FOO: JavaSimpleEnumeration;
                                         //   final val BAR: JavaSimpleEnumeration
                                         // }

      val enumClass = cm.runtimeClass(enumRef.owner.asClass)
      val enumValue = enumClass.getDeclaredField(enumRef.name.toString).get(null)
      println(enumValue)                 // BAR
    }

## プリティプリンタ

[`Trees`](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Trees) と
[`Types`](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Types)
を整形して表示するユーティリティを説明しよう。

### 構文木の表示

`show` メソッドは、リフレクションオブジェクトを整形して表示する。
この形式は Scala コードの糖衣構文を展開して Java のようしたものを提供する。具体例をみていこう:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> def tree = reify { final class C { def x = 2 } }.tree
    tree: scala.reflect.runtime.universe.Tree

    scala> show(tree)
    res0: String =
    {
      final class C extends AnyRef {
        def <init>() = {
          super.<init>();
          ()
        };
        def x = 2
      };
      ()
    }

`showRaw` メソッドは、Scala の構文木 (AST) のようなリフレクションオブジェクトの内部構造を表示する。
これは Scala のタイプチェッカが見るものと同じものだ。

ここで注意すべきなのは、この形式どおりに構文木を構築すればマクロの実装でも使えるのじゃないかと思うかもしれないが、うまくいかないことが多いということだ。これはシンボルについての情報などが完全には表示されていないためだ (名前だけが表示される)。
そのため、妥当な Scala コードがあるときにその AST をインスペクトするのに向いていると言える。

    scala> showRaw(tree)
    res1: String = Block(List(
      ClassDef(Modifiers(FINAL), newTypeName("C"), List(), Template(
        List(Ident(newTypeName("AnyRef"))),
        emptyValDef,
        List(
          DefDef(Modifiers(), nme.CONSTRUCTOR, List(), List(List()), TypeTree(),
            Block(List(
              Apply(Select(Super(This(tpnme.EMPTY), tpnme.EMPTY), nme.CONSTRUCTOR), List())),
              Literal(Constant(())))),
          DefDef(Modifiers(), newTermName("x"), List(), List(), TypeTree(),
            Literal(Constant(2))))))),
      Literal(Constant(())))

`showRaw` はインスペクトしたものの `scala.reflect.api.Types` を併記することができる。

    scala> import scala.tools.reflect.ToolBox // requires scala-compiler.jar
    import scala.tools.reflect.ToolBox

    scala> import scala.reflect.runtime.{currentMirror => cm}
    import scala.reflect.runtime.{currentMirror=>cm}

    scala> showRaw(cm.mkToolBox().typeCheck(tree), printTypes = true)
    res2: String = Block[1](List(
      ClassDef[2](Modifiers(FINAL), newTypeName("C"), List(), Template[3](
        List(Ident[4](newTypeName("AnyRef"))),
        emptyValDef,
        List(
          DefDef[2](Modifiers(), nme.CONSTRUCTOR, List(), List(List()), TypeTree[3](),
            Block[1](List(
              Apply[4](Select[5](Super[6](This[3](newTypeName("C")), tpnme.EMPTY), ...))),
              Literal[1](Constant(())))),
          DefDef[2](Modifiers(), newTermName("x"), List(), List(), TypeTree[7](),
            Literal[8](Constant(2))))))),
      Literal[1](Constant(())))
    [1] TypeRef(ThisType(scala), scala.Unit, List())
    [2] NoType
    [3] TypeRef(NoPrefix, newTypeName("C"), List())
    [4] TypeRef(ThisType(java.lang), java.lang.Object, List())
    [5] MethodType(List(), TypeRef(ThisType(java.lang), java.lang.Object, List()))
    [6] SuperType(ThisType(newTypeName("C")), TypeRef(... java.lang.Object ...))
    [7] TypeRef(ThisType(scala), scala.Int, List())
    [8] ConstantType(Constant(2))

### 型の表示

`show` メソッドは型を**可読な**文字列形式で表示することができる:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> def tpe = typeOf[{ def x: Int; val y: List[Int] }]
    tpe: scala.reflect.runtime.universe.Type

    scala> show(tpe)
    res0: String = scala.AnyRef{def x: Int; val y: scala.List[Int]}

`scala.reflect.api.Trees` のための `showRaw` 同様に、
`scala.reflect.api.Types` のための `showRaw`
は Scala タイプチェッカが使う Scala AST を表示する。

    scala> showRaw(tpe)
    res1: String = RefinedType(
      List(TypeRef(ThisType(scala), newTypeName("AnyRef"), List())),
      Scope(
        newTermName("x"),
        newTermName("y")))

この `showRaw` メソッドにはデフォルトでは `false`
になっている名前付きパラメータ `printIds` と `printKinds` を持つ。
`true` を渡すことで `showRaw` はシンボルのユニークID
とシンボルの種類 (パッケージ、型、メソッド、getter その他) を表示することができる。

    scala> showRaw(tpe, printIds = true, printKinds = true)
    res2: String = RefinedType(
      List(TypeRef(ThisType(scala#2043#PK), newTypeName("AnyRef")#691#TPE, List())),
      Scope(
        newTermName("x")#2540#METH,
        newTermName("y")#2541#GET))

## 位置情報

**位置情報** ([`Position`](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.Position))
はシンボルや構文木のノードの出処を追跡するのに使われる。警告やエラーの表示でよく使われ、プログラムのどこが間違ったのかを正確に表示することができる。位置情報はソースファイルの列と行を表す。
(ソースファイルの初めからのオフセットは「ポイント」と呼ばれるが、これは便利ではないことがある)
位置情報はそれが指す行の内容も保持する。全ての構文木やシンボルが位置情報を持つわけではなく、ない場合は
`NoPosition` オブジェクトで表される。

位置情報はソースファイルの 1文字を指すこともできれば、文字の範囲を指すこともできる。
前者の場合は**オフセット位置情報** (offset position)、後者の場合は**範囲位置情報**
(range position) が使われる。範囲位置情報は `start` と `end` オフセットを保持する。
 `start` と `end` オフセットは `focusStart` と `focusEnd`
メソッドを用いて「フォーカス」することができ、これは位置情報を返す
(範囲位置情報では無い位置情報に対して呼ばれた場合は `this` を返す) 。

位置情報はいくつかのメソッドを使って比較することができる。
`precedes` メソッドは、2つの位置情報が定義済みであり (つまり `NoPosition` ではない)、かつ
`this` の位置情報の終点が与えられた位置情報の始点を超えない場合に真を返す。
他にも、範囲位置情報は (`includes` メソッドを用いて) 包含関係を調べたり、
(`overlaps` メソッドを用いて) 交差関係を調べることができる。

範囲位置情報は**透明** (transparent) か**非透明** (opaque) だ。
範囲位置情報を持つ構文木は以下の不変条件を満たす必要があるため、範囲位置情報が透明か非透明であるかは許可される用法に関わってくる:

- オフセット位置情報を持つ構文木は範囲位置情報を持つ部分木を持ってはいけない。
- 範囲位置情報を持つ構文木が範囲位置情報を持つ部分木を持つ場合、部分木の範囲は親の範囲に包含されなくてはいけない。
- 同じノードの部分木の非透明な範囲位置情報同士は交差してはいけない。 (このため、交差は最大で単一の点となる)

`makeTransparent` メソッドを使って非透明な範囲位置情報を透明な他は何も変わらないものに変換することができる。
