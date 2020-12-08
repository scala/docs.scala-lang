---
layout: tour
title: 統合された型
language: ja

discourse: true

partof: scala-tour

num: 3
next-page: classes
previous-page: basics
prerequisite-knowledge: classes, basics

---
Scalaでは数値や関数を含め、全ての値は型を持ちます。
以下の図は型階層の一部を説明しています。

<a href="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg" alt="Scala Type Hierarchy"></a>

## Scalaの型階層 ##

[`Any`](https://www.scala-lang.org/api/2.12.1/scala/Any.html) は全ての型のスーパータイプであり、トップ型とも呼ばれます。
Anyは `equals`、`hashCode`、そして `toString`のようないくつかの普遍的なメソッドを定義しています。
そして`AnyVal`と`AnyRef` という2つの直系のサブクラスを持ちます。

`AnyVal` は値型に相当します。
事前に定義された9つの値型が存在し、それら`Double`、`Float`、`Long`、`Int`、`Short`、`Byte`、`Char`、`Unit`、`Boolean`は
null非許容です。
`Unit`は意味のある情報をもたない値型です。`Unit`型のインスタンスはただ1つだけあり、`()`というリテラルで宣言することができます。
全ての関数は必ず何かを返さなければなりません。そのため`Unit`は戻り値の型として時々役立ちます。

`AnyRef` は参照型を意味します。全ての値型でない型は参照型として定義されます。Scalaでは全てのユーザー定義型は`AnyRef`のサブタイプになります。
もしScalaがJava実行環境上で利用されるなら、`AnyRef` は `java.lang.Object` に相当します。

以下にstring、integer、character、boolean、関数が他のオブジェクトと同様に全てオブジェクトであるという例を示します。

```scala mdoc
val list: List[Any] = List(
  "a string",
  732,  // integer
  'c',  // character
  true, // boolean value
  () => "文字列を返す無名関数"
)

list.foreach(element => println(element))
```

これは`List[Any]`型の`list`という値を定義します。
このlistは様々な型の要素で初期化されています。しかしそれぞれの要素は `scala.Any` のインスタンスなのでlistに追加することができています。

こちらは先程のプログラムの出力です。

```
a string
732
c
true
<function>
```

## 型キャスト
値型は以下の順序でキャストできます。

<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scalaの型階層"></a>

例えば、

```scala mdoc
val x: Long = 987654321
val y: Float = x  // 9.8765434E8 (この場合精度が落ちることに注意してください)

val face: Char = '☺'
val number: Int = face  // 9786
```

型変換は一方向です。これはコンパイルができないでしょう。

```
val x: Long = 987654321
val y: Float = x  // 9.8765434E8
val z: Long = y  // 一致しない
```

参照型をサブタイプにキャストすることもできます。こちらはツアーの中で後ほど紹介します。

## Nothing と Null
`Nothing`は全ての型のサブタイプであり、ボトム型とも呼ばれます。`Nothing`型を持つ値は存在しません。
一般的に例外のスロー、プログラム終了、無限ループなど終了していないことを示すのに使われます。
(すなわち、値として評価されない式や正常に返らないメソッドなどです。)


`Null` は全ての参照型のサブタイプ(すなわち、全てのAnyRefのサブタイプ)です。`null`というキーワードリテラルが指す値を1つだけもちます。
`Null` は、ほぼ他のJVM言語との相互運用性のためだけに提供されているので、Scalaのコード内ではほとんどの場合、使われるべきではありません。
`null`の代替手段については、後のツアーで説明します。
