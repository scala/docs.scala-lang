---
layout: multipage-overview

discourse: false

partof: reflection
overview-name: Reflection

num: 5

language: ja
title: 型タグとマニフェスト
---

他の JVM言語同様に、Scala の型はコンパイル時に**消去** (erase) される。
これは、何らかのインスタンスのランタイム型をインスペクトしてもコンパイル時に
Scala コンパイラが持つ型情報を全ては入手できない可能性があることを意味する。

マニフェスト (`scala.reflect.Manifest`) 同様に、**型タグ** (`TypeTag`) はコンパイル時に入手可能な全ての型情報を実行時に持ち込むオブジェクトだと考えることができる。
例えば、`TypeTag[T]` はコンパイル時の型 `T` のランタイム型形式をカプセル化する。
しかし `TypeTag` は、2.10 以前の `Manifest` という概念に比べより豊かで、かつ
Scala リフレクションに統合された代替であることに注意してほしい。

3通りの型タグがある:

1. `scala.reflect.api.TypeTags#TypeTag`。Scala 型の完全な型記述子。例えば、`TypeTag[List[String]]` は型 `scala.List[String]` に関する全ての型情報を持つ。

2. `scala.reflect.ClassTag`。Scala 型の部分的な型記述子。例えば、`ClassTag[List[String]]` は消去されたクラス型の情報のみ (この場合、`scala.collection.immutable.List`) を保持する。`ClassTag` は型のランタイムクラスへのアクセスのみを提供し、`scala.reflect.ClassManifest` に相当する。

3. `scala.reflect.api.TypeTags#WeakTypeTag`。抽象型の型記述子 (以下の節での説明を参照)。

## 型タグの取得

マニフェスト同様、型タグは常にコンパイラによって生成され、以下の 3通りの方法で取得できる。

### `typeTag`、`classTag`、`weakTypeTag` メソッドを使う

`Universe` が公開している `typeTag` を使うことで特定の型の `TypeTag` を直接取得することができる。

例えば、`Int` を表す `TypeTag` を得るには以下のようにする:

    import scala.reflect.runtime.universe._
    val tt = typeTag[Int]

同様に `String` を表す `ClassTag` を得るには以下のように行う:

    import scala.reflect._
    val ct = classTag[String]

これらのメソッドはそれぞれ型引数 `T` の `TypeTag[T]` か `ClassTag[T]` を構築する。

### `TypeTag[T]`、`ClassTag[T]`、もしくは `WeakTypeTag[T]` 型の暗黙のパラメータを使う

`Manifest` 同様にコンパイラに `TypeTag` を生成するように申請することができる。
これは、`TypeTag[T]` 型の暗黙のパラメータを宣言するだけで行われる。
もしコンパイラが implicit の検索時にマッチする implicit の値を探すことができなければ自動的に
`TypeTag[T]` を生成する。

**注意**: 典型的に、これはメソッドかクラスのみに暗黙のパラメータを使うことで達成される。

例えば、任意のオブジェクトを受け取るメソッドを書いて、`TypeTag`
を使ってそのオブジェクトの型引数を表示することができる:

    import scala.reflect.runtime.universe._

    def paramInfo[T](x: T)(implicit tag: TypeTag[T]): Unit = {
      val targs = tag.tpe match { case TypeRef(_, _, args) => args }
      println(s"type of $x has type arguments $targs")
    }

ここで `T` についてパラメータ化された多相メソッド `paramInfo` を暗黙のパラメータ
`(implicit tag: TypeTag[T])` と共に定義する。これで、`TypeTag` の `tpe`
メソッドを使って `tag` が表す (`Type` 型の) 型に直接アクセスすることができる。

実際に `paramInfo` メソッドを使ってみよう:

    scala> paramInfo(42)
    type of 42 has type arguments List()

    scala> paramInfo(List(1, 2))
    type of List(1, 2) has type arguments List(Int)

### 型パラメータの context bound を使う

型パラメータに context bound を付けることで上と同じことをもう少し簡潔に書ける。
独立した暗黙のパラメータを定義する代わりに以下のように型パラメータのリストに
`TypeTag` を付けることができる:

    def myMethod[T: TypeTag] = ...

context bound `[T: TypeTag]` からコンパイラは `TypeTag[T]`
型の暗黙のパラメータを生成して前節の暗黙のパラメータを使った用例のようにメソッドを書き換える。

上の具体例を context bound を使って書きなおしてみる:

    import scala.reflect.runtime.universe._

    def paramInfo[T: TypeTag](x: T): Unit = {
      val targs = typeOf[T] match { case TypeRef(_, _, args) => args }
      println(s"type of $x has type arguments $targs")
    }

    scala> paramInfo(42)
    type of 42 has type arguments List()

    scala> paramInfo(List(1, 2))
    type of List(1, 2) has type arguments List(Int)

## WeakTypeTags

`WeakTypeTag[T]` は `TypeTag[T]` を一般化する。普通の
`TypeTag` と違ってそれが表す型の構成要素は型パラメータか抽象型への参照であることもできる。
しかし、`WeakTypeTag[T]` は可能な限り具象的であろうとするため、
参照された型引数か抽象型の型タグが入手可能ならばそれを使って
`WeakTypeTag[T]` に具象型を埋め込む。

先ほどからの具体例を続けよう:

    def weakParamInfo[T](x: T)(implicit tag: WeakTypeTag[T]): Unit = {
      val targs = tag.tpe match { case TypeRef(_, _, args) => args }
      println(s"type of $x has type arguments $targs")
    }

    scala> def foo[T] = weakParamInfo(List[T]())
    foo: [T]=> Unit

    scala> foo[Int]
    type of List() has type arguments List(T)

## 型タグとマニフェストの比較

型タグ (`TypeTag`) は 2.10 以前のマニフェスト (`scala.reflect.Manifest`) の概念に相当する。
`scala.reflect.ClassTag` は `scala.reflect.ClassManifest`
に相当するもので、
`scala.reflect.api.TypeTags#TypeTag` は `scala.reflect.Manifest`
に相当するものだが、他の 2.10 以前のマニフェスト型には直接対応する 2.10 のタグ型は存在しない。

<ul>
<li><code>scala.reflect.OptManifest</code> はサポートされない。
これはタグが任意の型をレイファイすることができるため、必要無くなったからだ。</li>

<li><code>scala.reflect.AnyValManifest</code> に相当するものは無い。
ある型がプリミティブ値クラスであるかを調べるには、型タグを (基底タグのコンパニオンオブジェクトで定義されている) 基底タグと比較することができる。もしくは、
<code>&lt;tag&gt;.tpe.typeSymbol.isPrimitiveValueClass</code> を使うこともできる。</li>

<li>マニフェストのコンパニオンオブジェクトに定義されるファクトリ・メソッドに相当するものは無い。
代わりに、(クラスの場合は) Java か (型の場合は) Scala によって提供されるリフレクション API を使って対応する型を生成することができる。</li>

<li>いくつかのマニフェスト演算 (具体的には、<code>&lt;:&lt;</code>、 <code>&gt;:&gt;</code>、と <code>typeArguments</code>) はサポートされない。
代わりに、(クラスの場合は) Java か (型の場合は) Scala によって提供されるリフレクション API を使うことができる。</li>
</ul>

`scala.reflect.ClassManifests` は Scala 2.10 から廃止予定となり、将来のマイナーリリースにおいて
`scala.reflect.Manifest` も廃止予定として `TypeTag` と `ClassTag` に道を開けることを予定している。
そのため、マニフェストを使ったコードは型タグを使うものに移行することを推奨する。
