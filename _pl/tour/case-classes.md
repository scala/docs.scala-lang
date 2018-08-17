---
layout: tour
title: Klasy przypadków

discourse: false

partof: scala-tour

num: 10
language: pl
next-page: pattern-matching
previous-page: multiple-parameter-lists
---

Scala wspiera mechanizm _klas przypadków_. Klasy przypadków są zwykłymi klasami z dodatkowymi założeniami:

* Domyślnie niemutowalne
* Można je dekomponować poprzez [dopasowanie wzorca](pattern-matching.html)
* Porównywane poprzez podobieństwo strukturalne zamiast przez referencje
* Zwięzła składnia tworzenia obiektów i operacji na nich

Poniższy przykład obrazuje hierarchię typów powiadomień, która składa się z abstrakcyjnej klasy `Notification` oraz trzech konkretnych rodzajów zaimplementowanych jako klasy przypadków `Email`, `SMS` i `VoiceRecording`:

```tut
abstract class Notification
case class Email(sourceEmail: String, title: String, body: String) extends Notification
case class SMS(sourceNumber: String, message: String) extends Notification
case class VoiceRecording(contactName: String, link: String) extends Notification
```

Tworzenie obiektu jest bardzo proste: (Zwróć uwagę na to, że słowo `new` nie jest wymagane)

```tut
val emailFromJohn = Email("john.doe@mail.com", "Greetings From John!", "Hello World!")
```

Parametry konstruktora klasy przypadków są traktowane jako publiczne wartości i można się do nich odwoływać bezpośrednio:

```tut
val title = emailFromJohn.title
println(title) // wypisuje "Greetings From John!"
```

W klasach przypadków nie można modyfikować wartości pól. (Z wyjątkiem sytuacji kiedy dodasz `var` przed nazwą pola)

```tut:fail
emailFromJohn.title = "Goodbye From John!" // Jest to błąd kompilacji, gdyż pola klasy przypadku są domyślnie niezmienne
```

Zamiast tego możesz utworzyć kopię używając metody `copy`:

```tut
val editedEmail = emailFromJohn.copy(title = "I am learning Scala!", body = "It's so cool!")

println(emailFromJohn) // wypisuje "Email(john.doe@mail.com,Greetings From John!,Hello World!)"
println(editedEmail) // wypisuje "Email(john.doe@mail.com,I am learning Scala,It's so cool!)"
```

Dla każdej klasy przypadku kompilator Scali wygeneruje metodę `equals` implementującą strukturalne porównanie obiektów oraz metodę `toString`. Przykład:

```tut
val firstSms = SMS("12345", "Hello!")
val secondSms = SMS("12345", "Hello!")

if (firstSms == secondSms) {
  println("They are equal!")
}

println("SMS is: " + firstSms)
```

Wypisze:

```
They are equal!
SMS is: SMS(12345, Hello!)
```

Jednym z najważniejszych zastosowań klas przypadków (skąd też się wzięła ich nazwa) jest **dopasowanie wzorca**. Poniższy przykład pokazuje działanie funkcji, która zwraca różne komunikaty w zależności od rodzaju powiadomienia:

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

println(showNotification(someSms)) // Wypisuje "You got an SMS from 12345! Message: Are you there?"
println(showNotification(someVoiceRecording)) // Wypisuje "you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123"
```

Poniżej bardziej skomplikowany przykład używający `if` w celu określenia dodatkowych warunków dopasowania:

```tut
def showNotificationSpecial(notification: Notification, specialEmail: String, specialNumber: String): String = {
  notification match {
    case Email(email, _, _) if email == specialEmail =>
      "You got an email from special someone!"
    case SMS(number, _) if number == specialNumber =>
      "You got an SMS from special someone!"
    case other =>
      showNotification(other) // nic szczególnego, wywołaj domyślną metodę showNotification
  }
}

val SPECIAL_NUMBER = "55555"
val SPECIAL_EMAIL = "jane@mail.com"
val someSms = SMS("12345", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")
val specialEmail = Email("jane@mail.com", "Drinks tonight?", "I'm free after 5!")
val specialSms = SMS("55555", "I'm here! Where are you?")

println(showNotificationSpecial(someSms, SPECIAL_EMAIL, SPECIAL_NUMBER)) // Wypisuje "You got an SMS from 12345! Message: Are you there?"
println(showNotificationSpecial(someVoiceRecording, SPECIAL_EMAIL, SPECIAL_NUMBER)) // Wypisuje "you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123"
println(showNotificationSpecial(specialEmail, SPECIAL_EMAIL, SPECIAL_NUMBER)) // Wypisuje "You got an email from special someone!"
println(showNotificationSpecial(specialSms, SPECIAL_EMAIL, SPECIAL_NUMBER)) // Wypisuje "You got an SMS from special someone!"
```

Programując w Scali zachęca się, abyś jak najszerzej używał klas przypadków do modelowania danych, jako że kod, który je wykorzystuje, jest bardziej ekspresywny i łatwiejszy do utrzymania:

* Obiekty niemutowalne uwalniają cię od potrzeby śledzenia zmian stanu
* Porównanie przez wartość pozwala na porównywanie instancji tak, jakby były prymitywnymi wartościami
* Dopasowanie wzorca znacząco upraszcza logikę rozgałęzień, co prowadzi do mniejszej ilości błędów i czytelniejszego kodu


