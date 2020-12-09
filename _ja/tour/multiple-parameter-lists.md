---
layout: tour
title: 複数パラメータリスト(カリー化)
language: ja

discourse: true

partof: scala-tour

num: 10
next-page: case-classes
previous-page: nested-functions

---

メソッドは複数のパラメータリストを持てます。

# 例

こちらはScalaのコレクションAPIの `TraversableOnce`トレイトで定義されている実例です。

```scala mdoc:fail
def foldLeft[B](z: B)(op: (B, A) => B): B
```
`foldLeft`は、2つのパラメータを取る関数`op`を、初期値`z`とこのコレクションの全要素に対して左から右に適用していきます。
以下はその使い方の例です。

初期値0から始まり、`foldLeft`はここではリスト内の各要素とその一つ前の累積値に関数`(m, n) => m + n`を適用します。

{% scalafiddle %}
```scala mdoc
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
println(res) // 55
```
{% endscalafiddle %}

### ユースケース
推奨される複数パラメータリストのユースケースは次の通りです。

#### パラメータに関数を一つ渡す場合
パラメータに関数を一つだけ渡すのであれば、上記の`foldLeft`のケースでの`op`のように、複数パラメータリストを利用して簡潔な構文でメソッドに無名関数を渡すことができます。
複数パラメータリストがない場合、このコードは以下のようになります。


```scala mdoc:fail
numbers.foldLeft(0, (m: Int, n: Int) => m + n)	
```

複数パラメータリストを使うことで、Scalaの型インターフェースの利点を享受でき、以下のようにコードをより簡潔にすることができるのです。

```scala mdoc
numbers.foldLeft(0)(_ + _)
```
単一のパラメータリストではScalaコンパイラが関数のパラメータを型推論できないので、このようなことはできません。

#### 暗黙のパラメータ
特定のパラメータだけを`implicit`として指定するには、`implicit`のパラメーターリストに入れなければなりません。
こちらが例です。

```scala mdoc
def execute(arg: Int)(implicit ec: scala.concurrent.ExecutionContext) = ???
```

#### 部分適用

メソッドが少ない数のパラメータリストで呼び出された時、不足しているパラメータリストを引数として受け取る関数が生成されます。
これは一般的に[部分適用](https://en.wikipedia.org/wiki/Partial_application)として知られています。

例えば
```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]()) _
val squares = numberFunc((xs, x) => xs :+ x*x)
print(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)
val cubes = numberFunc((xs, x) => xs :+ x*x*x)
print(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```	
