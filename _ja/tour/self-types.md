---
layout: tour
title: 自分型
language: ja

discourse: true

partof: scala-tour

num: 25
next-page: implicit-parameters
previous-page: compound-types
topics: self-types
prerequisite-knowledge: nested-classes, mixin-class-composition

---
自分型は、直接継承していなくてもトレイトが他のトレイトにミックスインされていることを宣言する方法です。
これにより依存先のメンバーをimportなしで利用できます。

自分型は`this`、または`this`の別名となる他の識別子の型を絞り込む方法です。
その構文は普通の関数構文のように見えますが、全く異なる意味があります。

トレイトで自分型を使うには、識別子、ミックスインする他のトレイトの型、`=>`を書きます(例えば `someIdentifier: SomeOtherTrait =>`)。
```scala mdoc
trait User {
  def username: String
}

trait Tweeter {
  this: User =>  // thisが再割り当てされます
  def tweet(tweetText: String) = println(s"$username: $tweetText")
}

class VerifiedTweeter(val username_ : String) extends Tweeter with User {  // TweeterがUserを必要とするためミックスインします。
	def username = s"real $username_"
}

val realBeyoncé = new VerifiedTweeter("Beyoncé")
realBeyoncé.tweet("Just spilled my glass of lemonade")  // "real Beyoncé: Just spilled my glass of lemonade"と出力します。
```
`trait Tweeter`の中で`this: User =>`と記述したので、今は変数`username`は`tweet`メソッドのスコープ内にあります。これはさらに、`VerifiedTweeter`が`Tweeter`を継承する際、(`with User`を使って)`User`もミックスインしなければならいことを意味します。
