---
layout: tour
title: 複数パラメータリスト(カリー化)
language: ja

discourse: true

partof: scala-tour

num: 10
next-page: case-classes
previous-page: nested-functions

redirect_from: "/tutorials/tour/multiple-parameter-lists.html"
---

メソッドは複数パラメータリストを持てます。

# 例

こちらはScalaのコレクションの[Traversable](/overviews/collections/trait-traversable.html) トレイトで定義されている実例です。

```
def foldLeft[B](z: B)(op: (B, A) => B): B
```
`foldLeft`は初期値`z`とこのコレクションの全ての要素に対し左から右に2つのパラメータを取る関数`op`を適用していきます。
以下はその使い方の例です。

初期値0から始まり、`foldLeft`はここではリスト内の各要素とその一つ前の累積値に関数`(m, n) => m + n`を適用します。

{% scalafiddle %}
```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
println(res) // 55
```
{% endscalafiddle %}

### ユースケース
推奨される複数パラメータリストのユースケースは次の通りです。

#### 単一の関数パラメータ
関数のパラメータが一つの場合、上記の`foldLeft`のケースでの`op`のように、複数パラメータリストを使うと簡潔な構文でメソッドに無名関数を渡すことができます。
複数パラメータリストがない場合、このコードは以下のようになります。


```
numbers.foldLeft(0, (m: Int, n: Int) => m + n)	
```

複数パラメータリストを使うことで、Scalaの型インターフェースの利点を享受でき、以下のようにコードをより簡潔にすることができるのです。

```
numbers.foldLeft(0)(_ + _)
```
らScalaコンパイラは関数のパラメータの型推論することができないので、このようなことは単一パラメータリストではできません。

#### 暗黙のパラメータ
特定のパラメータを`implicit`として指定するには、それらはそれら自身を`暗黙の`パラメーターリストに置かなければなりません。
こちらが例です。

```
def execute(arg: Int)(implicit ec: scala.concurrent.ExecutionContext) = ???
```

#### 部分適用

メソッドが少ない数のパラメータリストで呼び出された時、不足しているパラメータリストを引数として受け取る関数が生成されます。
これは一般的に[部分適用](https://en.wikipedia.org/wiki/Partial_application)として知られています。

例えば
```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]()) _
val squares = numberFunc((xs, x) => xs :+ x*x)
print(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)
val cubes = numberFunc((xs, x) => xs :+ x*x*x)
print(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```	
