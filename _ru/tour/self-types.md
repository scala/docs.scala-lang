---
layout: tour
title: Самоописываемые типы
partof: scala-tour
num: 25
language: ru
next-page: implicit-parameters
previous-page: compound-types
topics: self-types
prerequisite-knowledge: nested-classes, mixin-class-composition
---

Самоописываемый тип (Self type) - это способ объявить, что трейт должен быть смешан с другим трейтом, даже если он не расширяет его напрямую. Что открывает доступ к членам зависимости без импортирования.

Самоописываемый тип - это способ сузить тип `this` или другого идентификатора, который ссылается на `this`. Синтаксис похож на синтаксис обычной функции, но означает кое-что иное.

Чтобы использовать самоописываемый тип в трейте напишите: идентификатор, тип другого трейта, который хотите добавить и `=>` (например, `someIdentifier: SomeOtherTrait =>`).

{% tabs self-types_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=self-types_1 %}

```scala mdoc
trait User {
  def username: String
}

trait Tweeter {
  this: User =>  // переназначил this
  def tweet(tweetText: String) = println(s"$username: $tweetText")
}

class VerifiedTweeter(val username_ : String) extends Tweeter with User {  // Мы добавили User потому этого требует Tweeter
  def username = s"real $username_"
}

val realBeyoncé = new VerifiedTweeter("Beyoncé")
realBeyoncé.tweet("Just spilled my glass of lemonade")  // выведет "real Beyoncé: Just spilled my glass of lemonade"
```

Поскольку мы указали `this: User =>` в трейте `Tweeter`, теперь переменная `username` находится в пределах видимости для метода `tweet`. Это также означает что `VerifiedTweeter` при наследовании от `Tweeter` должен быть смешан с `User` (используя `with User`).

{% endtab %}
{% tab 'Scala 3' for=self-types_1 %}

```scala
trait User:
  def username: String

trait Tweeter:
  this: User =>  // переназначил this
  def tweet(tweetText: String) = println(s"$username: $tweetText")

class VerifiedTweeter(val username_ : String) extends Tweeter, User:  // Мы добавили User потому этого требует Tweeter
  def username = s"real $username_"

val realBeyoncé = VerifiedTweeter("Beyoncé")
realBeyoncé.tweet("Just spilled my glass of lemonade")  // выведет "real Beyoncé: Just spilled my glass of lemonade"
```

Поскольку мы указали `this: User =>` в трейте `Tweeter`, теперь переменная `username` находится в пределах видимости для метода `tweet`. Это также означает что `VerifiedTweeter` при наследовании от `Tweeter` должен быть смешан с `User` (используя `, User`).

{% endtab %}
{% endtabs %}
