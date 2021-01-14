---
layout: tour
title: 自类型
partof: scala-tour

num: 23

language: zh-cn

next-page: implicit-parameters
previous-page: compound-types
---
自类型用于声明一个特质必须混入其他特质，尽管该特质没有直接扩展其他特质。 这使得所依赖的成员可以在没有导入的情况下使用。

自类型是一种细化 `this` 或 `this` 别名之类型的方法。 语法看起来像普通函数语法，但是意义完全不一样。

要在特质中使用自类型，写一个标识符，跟上要混入的另一个特质，以及 `=>`（例如 `someIdentifier: SomeOtherTrait =>`）。
```scala mdoc
trait User {
  def username: String
}

trait Tweeter {
  this: User =>  // 重新赋予 this 的类型
  def tweet(tweetText: String) = println(s"$username: $tweetText")
}

class VerifiedTweeter(val username_ : String) extends Tweeter with User {  // 我们混入特质 User 因为 Tweeter 需要
	def username = s"real $username_"
}

val realBeyoncé = new VerifiedTweeter("Beyoncé")
realBeyoncé.tweet("Just spilled my glass of lemonade")  // 打印出 "real Beyoncé: Just spilled my glass of lemonade"
```

因为我们在特质 `trait Tweeter` 中定义了 `this: User =>`，现在变量 `username` 可以在 `tweet` 方法内使用。 这也意味着，由于 `VerifiedTweeter` 继承了 `Tweeter`，它还必须混入 `User`（使用 `with User`）。
