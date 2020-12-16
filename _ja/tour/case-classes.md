---
layout: tour
title: ケースクラス
language: ja

discourse: true

partof: scala-tour

num: 11
next-page: pattern-matching
previous-page: multiple-parameter-lists
prerequisite-knowledge: classes, basics, mutability

---

ケースクラスはこれから論じるいくつかの差異はあるものの普通のクラスと似ています。
ケースクラスは不変なデータを作るのに適しています。
このツアーの次のステップでは、[パターンマッチング](pattern-matching.html)でのそれらの有用性を解説します。

## ケースクラスの宣言

最小のケースクラスにはキーワード`case class`、識別子、パラメータリスト(空かもしれません)が必要です。
```scala mdoc
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```
ケースクラス`Book`をインスタンス化する時キーワード`new`が使われていないことに気をつけてください。
これはケースクラスがオブジェクトの生成を行う`apply`メソッドを標準で保有するためです。

パラメータ有りでケースクラスを作ると、パラメータはパブリックの`val`となります。
```
case class Message(sender: String, recipient: String, body: String)
val message1 = Message("guillaume@quebec.ca", "jorge@catalonia.es", "Ça va ?")

println(message1.sender)  // guillaume@quebec.ca が出力されます
message1.sender = "travis@washington.us"  // この行はコンパイルされません
```
`message1.sender` に再代入することはできません、なぜなら`val`（つまりイミュータブル）だからです。
ケースクラスでは`var`も使うことができますが、推奨されません。

## 比較
ケースクラスは参照ではなく、構造で比較されます。
```
case class Message(sender: String, recipient: String, body: String)

val message2 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val message3 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val messagesAreTheSame = message2 == message3  // true
```
たとえ`message2`と`message3`が異なるオブジェクトを参照していたとしても、それぞれのオブジェクトの値は等価となります。

## コピー
`copy`メソッドを使うことで簡単にケースクラスのインスタンスの（浅い）コピーを作ることができます。
必要に応じて、コンストラクタ引数を変更することもできます。
```
case class Message(sender: String, recipient: String, body: String)
val message4 = Message("julien@bretagne.fr", "travis@washington.us", "Me zo o komz gant ma amezeg")
val message5 = message4.copy(sender = message4.recipient, recipient = "claire@bourgogne.fr")
message5.sender  // travis@washington.us
message5.recipient // claire@bourgogne.fr
message5.body  // "Me zo o komz gant ma amezeg"
```
`message4`のrecipientは`message5`のsenderとして使われますが、`message4`の定数`body`は直接コピーされます。
