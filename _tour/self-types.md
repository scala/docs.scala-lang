---
layout: tour
title: Self-type
partof: scala-tour

num: 27
next-page: implicit-parameters
previous-page: compound-types
topics: self-types
prerequisite-knowledge: nested-classes, mixin-class-composition

redirect_from: "/tutorials/tour/self-types.html"
---
Self-types are a way to declare that a trait must be mixed into another trait, even though it doesn't directly extend it. That makes the members of the dependency available without imports.

A self-type is a way to narrow the type of `this` or another identifier that aliases `this`. The syntax looks like normal function syntax but means something entirely different.

To use a self-type in a trait, write an identifier, the type of another trait to mix in, and a `=>` (e.g. `someIdentifier: SomeOtherTrait =>`).
```tut
trait User {
  def username: String
}

trait Tweeter {
  this: User =>  // reassign this
  def tweet(tweetText: String) = println(s"$username: $tweetText")
}

class VerifiedTweeter(val username_ : String) extends Tweeter with User {  // We mixin User because Tweeter required it
	def username = s"real $username_"
}

val realBeyoncé = new VerifiedTweeter("Beyoncé")
realBeyoncé.tweet("Just spilled my glass of lemonade")  // prints "real Beyoncé: Just spilled my glass of lemonade"
```

Because we said `this: User =>` in `trait Tweeter`, now the variable `username` is in scope for the `tweet` method. This also means that since `VerifiedTweeter` extends `Tweeter`, it must also mix-in `User` (using `with User`).

Giving an alias to `this` can be useful in cases where there's an anonymous inner implementation of the trait that needs to access members of the outer scope. For example:
```tut
trait User {
  def username: String
}

trait Tweeter {
  self: User => // reassign this
  def tweet(tweetText: String) = println(s"$username: $tweetText")

  def withEmotion(emotion: String): Tweeter =
    new Tweeter with User { // required to mix in User
      // Accesses outer username
      val username = self.username

      // Accesses outer tweet method
      override def tweet(tweetText: String): Unit =
        self.tweet(s"I'm so $emotion! $tweetText")
    }
}

class VerifiedTweeter(val username_ : String) extends Tweeter with User { // We mixin User because Tweeter required it
  def username = s"real $username_"
}

val realBeyoncé = new VerifiedTweeter("Beyoncé")

realBeyoncé
  .withEmotion("embarrassed")
  .withEmotion("sad")
  .tweet("Just spilled my glass of lemonade")
```
