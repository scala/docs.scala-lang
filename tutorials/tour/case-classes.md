---
layout: tutorial
title: Case Classes

disqus: true

tutorial: scala-tour
num: 10
tutorial-next: pattern-matching
tutorial-previous: currying
---

Scala supports the notion of _case classes_. Case classes are just regular classes that are:

* Immutable by default
* Decomposable through [pattern matching](pattern-matching.html)
* Compared by structural equality instead of by reference
* Succinct to instantiate and operate on

Here is an example for a Notification type hierarchy which consists of an abstract super class `Notification` and three concrete Notification types implemented with case classes `Email`, `SMS`, and `VoiceRecording`.

```tut
abstract class Notification
case class Email(sourceEmail: String, title: String, body: String) extends Notification
case class SMS(sourceNumber: String, message: String) extends Notification
case class VoiceRecording(contactName: String, link: String) extends Notification
```

Instantiating a case class is easy: (Note that we don't need to use the `new` keyword)

```tut
val emailFromJohn = Email("john.doe@mail.com", "Greetings From John!", "Hello World!")
```

The constructor parameters of case classes are treated as public values and can be accessed directly. 

```tut
val title = emailFromJohn.title
println(title) // prints "Greetings From John!"
```

With case classes, you cannot mutate their fields directly. (unless you insert `var` before a field, but doing so is generally discouraged). 

```tut:fail
emailFromJohn.title = "Goodbye From John!" // This is a compilation error. We cannot assign another value to val fields, which all case classes fields are by default.
```

Instead, you make a copy using the `copy` method. As seen below, you can replace just some of the fields:

```tut
val editedEmail = emailFromJohn.copy(title = "I am learning Scala!", body = "It's so cool!")

println(emailFromJohn) // prints "Email(john.doe@mail.com,Greetings From John!,Hello World!)"
println(editedEmail) // prints "Email(john.doe@mail.com,I am learning Scala,It's so cool!)"
```

For every case class the Scala compiler generates an `equals` method which implements structural equality and a `toString` method. For instance:

```tut
val firstSms = SMS("12345", "Hello!")
val secondSms = SMS("12345", "Hello!")

if (firstSms == secondSms) {
  println("They are equal!")
}

println("SMS is: " + firstSms)
```

will print

```
They are equal!
SMS is: SMS(12345, Hello!)
```

With case classes, you can utilize **pattern matching** to work with your data. Here's a function that prints out different messages depending on what type of Notification is received:

```tut
def showNotification(notification: Notification): String = {
  notification match {
    case Email(email, title, _) =>
      "You got an email from " + email + " with title: " + title
    case SMS(number, message) =>
      "You got an SMS from " + number + "! Message: " + message
    case VoiceRecording(name, link) =>
      "you received a Voice Recording from " + name + "! Click the link to hear it: " + link
  }
}

val someSms = SMS("12345", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")

println(showNotification(someSms))
println(showNotification(someVoiceRecording))

// prints:
// You got an SMS from 12345! Message: Are you there?
// you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123
```

Here's a more involved example using `if` guards. With the `if` guard, the pattern match branch will fail if the condition in the guard returns false.

```tut
def showNotificationSpecial(notification: Notification, specialEmail: String, specialNumber: String): String = {
  notification match {
    case Email(email, _, _) if email == specialEmail =>
      "You got an email from special someone!"
    case SMS(number, _) if number == specialNumber =>
      "You got an SMS from special someone!"
    case other =>
      showNotification(other) // nothing special, delegate to our original showNotification function   
  }
}

val SPECIAL_NUMBER = "55555"
val SPECIAL_EMAIL = "jane@mail.com"
val someSms = SMS("12345", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")
val specialEmail = Email("jane@mail.com", "Drinks tonight?", "I'm free after 5!")
val specialSms = SMS("55555", "I'm here! Where are you?")

// prints: 
// You got an SMS from 12345! Message: Are you there?
// you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123
// You got an email from special someone!
// You got an SMS from special someone!

```

When programming in Scala, it is recommended that you use case classes pervasively to model/group data as they help you to write more expressive and maintainable code:

* Immutability frees you from needing to keep track of where and when things are mutated
* Comparison-by-value allows you compare instances as if they are primitive values - no more uncertainty regarding whether instances of a class is compared by value or reference
* Pattern matching simplifies branching logic, which leads to less bugs and more readable code. 


