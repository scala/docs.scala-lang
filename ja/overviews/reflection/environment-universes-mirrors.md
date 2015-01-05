---
layout: overview-large

disqus: true

partof: reflection
num: 2
outof: 6
language: ja
title: 環境、ユニバース、ミラー
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

## 環境

リフレクションの環境は、リフレクションを用いたタスクが実行時に実行されたのかコンパイル時に実行されたのかによって変わる。
この環境が実行時かコンパイル時かという違いは**ユニバース**と呼ばれるものによってカプセル化されている。
リフレクション環境におけるもう 1つの重要なものにリフレクションを用いてアクセスが可能な実体の集合がある。
この実体の集合は**ミラー**と呼ばれているものによって決定される。

例えば、実行時リフレクションによってアクセス可能な実体は `ClassloaderMirror` によって公開されている。
このミラーは特定のクラスローダによって読み込まれた実体 (パッケージ、型、メンバ) のみへのアクセスを提供する。

ミラーはリフレクションを用いてアクセスすることができる実体の集合を決定するだけではなく、
それらの実体に対するリフレクションを用いた演算を提供する。
例えば、実行時リフレクションにおいて **invoker ミラー**を使うことで任意のクラスのメソッドやコンストラクタを呼び出すことができる。

## ユニバース

実行時とコンパイル時という 2つの主要なリフレクション機能があるため、ユニバースにも 2つのタイプがある。
その時のタスクに応じて適切なユニバースを選ぶ必要がある。

- **実行時リフレクション** のためには `scala.reflect.runtime.universe`
- **コンパイル時リフレクション**のためには `scala.reflect.macros.Universe`

を選ぶ。

ユニバースは、型 (`Type`)、構文木 (`Tree`)、アノテーション (`Annotation`)
といったリフレクションで使われる主要な概念に対するインターフェイスを提供する。

## ミラー

リフレクションによって提供される全ての情報は**ミラー** (mirror) を通して公開されている。
型情報の種類やリフレクションを用いたタスクの種類によって異なるミラーを使う必要がある。
**クラスローダミラー**を使うことで型情報やそのメンバを取得することができる。
クラスローダミラーから、より特殊化された (最も広く使われている) **invoker ミラー**
を取得してリフレクションを使ったメソッドやコンストラクタ呼び出しやフィールドへのアクセスを行うことができる。

要約すると:

- **クラスローダミラー** これらのミラーは (`staticClass`/`staticModule`/`staticPackage` メソッドを使って) 名前をシンボルへと翻訳する。
- **invoker ミラー** これらのミラーは (`MethodMirror.apply` や `FieldMirror.get` といったメソッドを使って) リフレクションを用いた呼び出しを実装する。これらの invoker ミラーは最も広く使われているミラーだ。

### 実行時のミラー

実行時におけるミラーの作り方は `ru.runtimeMirror(<classloader>)` だ (ただし、`ru` は `scala.reflect.runtime.universe`)。

`scala.reflect.api.JavaMirrors#runtimeMirror` の戻り値は
`scala.reflect.api.Mirrors#ReflectiveMirror` 型のクラスローダミラーで、名前 (`name`) からシンボル (`symbol`) を読み込むことができる。

クラスローダミラーから
(`scala.reflect.api.Mirrors#InstanceMirror`、 `scala.reflect.api.Mirrors#MethodMirror`、 `scala.reflect.api.Mirrors#FieldMirror`、`scala.reflect.api.Mirrors#ClassMirror`、そして `scala.reflect.api.Mirrors#ModuleMirror` を含む)
invoker ミラーを作成することができる。

以下に具体例を用いてこれら 2つのタイプのミラーがどう関わっているのかを説明する。

### ミラーの型とその用例

`ReflectiveMirror` は名前を用いてシンボルを読み込むのと、invoker ミラーを作るのに使われる。作り方: `val m = ru.runtimeMirror(<classloader>)`。
具体例:

    scala> val ru = scala.reflect.runtime.universe
    ru: scala.reflect.api.JavaUniverse = ...

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

`InstanceMirror` はメソッド、フィールド、内部クラス、および内部オブジェクトの invoker ミラーを作成するのに使われる。作り方: `val im = m.reflect(<value>)`。
具体例:

    scala> class C { def x = 2 }
    defined class C

    scala> val im = m.reflect(new C)
    im: scala.reflect.runtime.universe.InstanceMirror = instance mirror for C@3442299e

`MethodMirror` はインスタンス・メソッド (Scala にはインスタンス・メソッドのみがある。オブジェクトのメソッドは `ModuleMirror.instance` から取得されるオブジェクト・インスタンスのインスタンス・メソッドだ。) の呼び出しに使われる。作り方: `val mm = im.reflectMethod(<method symbol>)`。
具体例:

    scala> val methodX = ru.typeOf[C].declaration(ru.newTermName("x")).asMethod
    methodX: scala.reflect.runtime.universe.MethodSymbol = method x

    scala> val mm = im.reflectMethod(methodX)
    mm: scala.reflect.runtime.universe.MethodMirror = method mirror for C.x: scala.Int (bound to C@3442299e)

    scala> mm()
    res0: Any = 2

`FieldMirror` はインスタンス・フィールドの get と set を行うのに使われる (メソッド同様に Scala はインスタンス・フィールドのみがある。)。作り方: `val fm = im.reflectMethod(<field or accessor symbol>)`。
具体例:

    scala> class C { val x = 2; var y = 3 }
    defined class C

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

    scala> val im = m.reflect(new C)
    im: scala.reflect.runtime.universe.InstanceMirror = instance mirror for C@5f0c8ac1

    scala> val fieldX = ru.typeOf[C].declaration(ru.newTermName("x")).asTerm.accessed.asTerm
    fieldX: scala.reflect.runtime.universe.TermSymbol = value x

    scala> val fmX = im.reflectField(fieldX)
    fmX: scala.reflect.runtime.universe.FieldMirror = field mirror for C.x (bound to C@5f0c8ac1)

    scala> fmX.get
    res0: Any = 2

    scala> fmX.set(3)

    scala> val fieldY = ru.typeOf[C].declaration(ru.newTermName("y")).asTerm.accessed.asTerm
    fieldY: scala.reflect.runtime.universe.TermSymbol = variable y

    scala> val fmY = im.reflectField(fieldY)
    fmY: scala.reflect.runtime.universe.FieldMirror = field mirror for C.y (bound to C@5f0c8ac1)

    scala> fmY.get
    res1: Any = 3

    scala> fmY.set(4)

    scala> fmY.get
    res2: Any = 4

`ClassMirror` はコンストラクタの invoker ミラーを作成するのに使われる。作り方: 静的クラスは `val cm1 = m.reflectClass(<class symbol>)`、内部クラスは `val mm2 = im.reflectClass(<module symbol>)`。
具体例:

    scala> case class C(x: Int)
    defined class C

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

    scala> val classC = ru.typeOf[C].typeSymbol.asClass
    classC: scala.reflect.runtime.universe.Symbol = class C

    scala> val cm = m.reflectClass(classC)
    cm: scala.reflect.runtime.universe.ClassMirror = class mirror for C (bound to null)

    scala> val ctorC = ru.typeOf[C].declaration(ru.nme.CONSTRUCTOR).asMethod
    ctorC: scala.reflect.runtime.universe.MethodSymbol = constructor C

    scala> val ctorm = cm.reflectConstructor(ctorC)
    ctorm: scala.reflect.runtime.universe.MethodMirror = constructor mirror for C.<init>(x: scala.Int): C (bound to null)

    scala> ctorm(2)
    res0: Any = C(2)

`ModuleMirror` はシングルトン・オブジェクトのインスタンスにアクセスするのに使われる。作り方: 静的なオブジェクトは `val mm1 = m.reflectModule(<module symbol>)`、内部オブジェクトは `val mm2 = im.reflectModule(<module symbol>)`。
具体例:

    scala> object C { def x = 2 }
    defined module C

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

    scala> val objectC = ru.typeOf[C.type].termSymbol.asModule
    objectC: scala.reflect.runtime.universe.ModuleSymbol = object C

    scala> val mm = m.reflectModule(objectC)
    mm: scala.reflect.runtime.universe.ModuleMirror = module mirror for C (bound to null)

    scala> val obj = mm.instance
    obj: Any = C$@1005ec04

### コンパイル時ミラー

コンパイル時ミラーは名前からシンボルを読み込むクラスローダミラーだけが使われる。

クラスローダミラーは `scala.reflect.macros.Context#mirror` を用いて作る。
クラスローダミラーを使う典型的なメソッドには `scala.reflect.api.Mirror#staticClass`、
`scala.reflect.api.Mirror#staticModule`、
そして `scala.reflect.api.Mirror#staticPackage` がある。具体例で説明すると:

    import scala.reflect.macros.Context

    case class Location(filename: String, line: Int, column: Int)

    object Macros {
      def currentLocation: Location = macro impl

      def impl(c: Context): c.Expr[Location] = {
        import c.universe._
        val pos = c.macroApplication.pos
        val clsLocation = c.mirror.staticModule("Location") // get symbol of "Location" object
        c.Expr(Apply(Ident(clsLocation), List(Literal(Constant(pos.source.path)), Literal(Constant(pos.line)), Literal(Constant(pos.column)))))
      }
    }

**注意**: 手動でシンボルを照会する代わりに他の高レベルな方法もある。例えば、文字列を使わなくてもよいため型安全な
`typeOf[Location.type].termSymbol` (もしくは `ClassSymbol` が必要ならば `typeOf[Location].typeSymbol`) がある。
