---
layout: tour
title: 名前渡しパラメータ
language: ja

discourse: true

partof: scala-tour

num: 31
next-page: annotations
previous-page: operators

---

*名前渡しのパラメータ*は使用された時に評価されます。それらは*値渡しパラメータ*とは対照的です。名前渡しのパラメータを作るには、単純に`=>`を型の前につけます。
```scala mdoc
def calculate(input: => Int) = input * 37
```

名前渡しパラメータの利点は関数本体の中で使わなければ評価されない点です。一方で、値渡しパラメータの利点は1度しか評価されない点です。

こちらはwhileループをどのように実装するかの例です。

```scala mdoc
def whileLoop(condition: => Boolean)(body: => Unit): Unit =
  if (condition) {
    body
    whileLoop(condition)(body)
  }

var i = 2

whileLoop (i > 0) {
  println(i)
  i -= 1
}  // prints 2 1
```

このメソッド`whileLoop`は条件とループの本体を受け取るために複数パラメータリストを使います。もし`condition`がtrueならば、`body`が実行され、次にwhileLoopが再帰的に呼ばれます。`condition`がfalseならば、bodyは決して評価されません。それは`body`の型の前に`=>`をつけたからです。

ここで、`condition`に`i > 0`、`body`に`println(i); i-= 1`を渡した場合、多くの言語で一般的なwhileループと同じ振る舞いをします。

パラメータが使われるまで評価を遅延する機能はパフォーマンスの助けになることがあります。それはパラメータを評価するのに多くの計算が必要な場合や、URLの取得のような時間がかかるコードブロックの場合です。
