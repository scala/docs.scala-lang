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

メソッドは複数パラメータリストを定義できます。
メソッドが少ない数のパラメータリストで呼び出された時、不足しているパラメータリストを引数として受け取る関数が生成されます。
これは一般的に[部分適用](https://en.wikipedia.org/wiki/Partial_application)として知られています。

こちらはScalaのコレクションの[Traversable](/overviews/collections/trait-traversable.html) トレイトで定義されている実例です。

```
def foldLeft[B](z: B)(op: (B, A) => B): B
```
`foldLeft`は初期値`z`とこの走査可能な全ての要素に対し左から右に二項演算子`op`を適用していきます。
以下はその使い方の例です。

初期値0から始まり、`foldLeft`はここではリスト内の各要素とその一つ前の累積値に関数`(m, n) => m + n`を適用します。

```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
print(res) // 55
```
複数パラメータリストにはより冗長な読み出し構文があり、それゆえ控えめに使う必要があります。
推奨されるユースケースは次の通りです。

#### 単一機能パラメータ
   単一機能パラメータの場合、上記の`foldLeft`のケースでの`op`のように、複数パラメータリストを使うと簡潔な構文でメソッドに無名関数を渡すことができます。
   複数パラメータリストがない場合、このコードは以下のようになります。

```
numbers.foldLeft(0, {(m: Int, n: Int) => m + n})
```

   複数パラメータリストを使うことで、以下のようにコードをより簡潔にすることができ、Scalaの型インターフェースの利点を享受できることに注意してください。
   それはカリー化されていない定義ではできません。
    
```
numbers.foldLeft(0)(_ + _)
```
   上記の`numbers.foldLeft(0)(_ + _)`はパラーメーター`z`を固定し、以下のように部分函数を渡し、再利用することができます。

```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]())_

val squares = numberFunc((xs, x) => xs:+ x*x)
print(squares.toString()) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs:+ x*x*x)
print(cubes.toString())  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

   最後に、`foldLeft`と`foldRight`は以下のいずれかの表現で使うことができます。

```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

numbers.foldLeft(0)((sum, item) => sum + item) // 一般形式
numbers.foldRight(0)((sum, item) => sum + item) // 一般形式

numbers.foldLeft(0)(_+_) // カリー化形式
numbers.foldRight(0)(_+_) // カリー化形式

(0 /: numbers)(_+_) // foldLeft内での利用
(numbers :\ 0)(_+_) // foldRight内での利用
```   

   
#### 暗黙のパラメータ
   `implicit`としてパラメータリストの中の特定のパラメータを指定するには、複数パラメータリストが使えます。
   こちらの例は以下のようになります。
```
def execute(arg: Int)(implicit ec: ExecutionContext) = ???
```
    
