---
layout: tour
title: Pakiety i importy
language: pl
partof: scala-tour

num: 34
previous-page: annotations
next-page: package-objects
language: pl
---

# Pakiety i importy
Scala używa pakietów do tworzenia przestrzeni nazw (namespaces), które umożliwiają modularyzację programów.

## Tworzenie pakietu
Pakiety są tworzone przez zadeklarowanie jednej lub więcej nazw pakietów w górnej części pliku Scali.

```
package users

class User
```

Jedną z konwencji jest nadawanie pakietowi takiej samej nazwy, jak nazwa katalogu zawierającego plik źródłowy. Jednak Scala jest niezależna od układu plików. Struktura katalogów projektu SBT dla `package users` może wyglądać następująco:

```
- ExampleProject
  - build.sbt
  - project
  - src
    - main
      - scala
        - users
          User.scala
          UserProfile.scala
          UserPreferences.scala
    - test
```

Zwróć uwagę, że katalog `users` znajduje się w katalogu `scala`, a w pakiecie znajduje się wiele plików Scali. Każdy plik Scali w pakiecie może mieć tę samą deklarację pakietu. Innym sposobem deklarowania pakietów jest użycie nawiasów klamrowych:

```
package users {
  package administrators {
    class NormalUser
  }
  package normalusers {
    class NormalUser
  }
}
```

Jak widać, pozwala to na zagnieżdżanie pakietów i zapewnia większą kontrolę nad zakresem i hermetyzacją. Nazwa pakietu powinna być zapisana małymi literami, a jeśli kod jest tworzony w organizacji, która posiada witrynę internetową, powinna mieć następującą konwencję formatu: `<top-level-domain>.<domain-name>.<project-name>`. Na przykład, gdyby firma Google miała projekt o nazwie `SelfDrivingCar`, nazwa pakietu wyglądałaby następująco:

```
package com.google.selfdrivingcar.camera

class Lens
```

Może to odpowiadać następującej strukturze katalogów: `SelfDrivingCar/src/main/scala/com/google/selfdrivingcar/camera/Lens.scala`.

## Import

Deklaracje `import` służą do uzyskiwania dostępu do elementów składowych (members, tzn.: klasy, cechy, funkcje itp.) w innych pakietach. Aby uzyskać dostęp do elementów tego samego pakietu, nie jest wymagana deklaracja `import`. Deklaracje `import` są selektywne.

```
import users._  // zaimportuj wszystko z pakietu użytkowników
import users.User  // zaimportuj klasę User
import users.{User, UserPreferences}  // zaimportuj tylko wybrane elementy
import users.{UserPreferences => UPrefs}  // zaimportuj i zmień nazwę dla wygody
```

Jedną z różnic w Scali od Javy jest to, że deklarację `import` można umieścić w dowolnym miejscu:

```scala mdoc
def sqrtplus1(x: Int) = {
  import scala.math.sqrt
  sqrt(x) + 1.0
}
```

W przypadku konfliktu nazw i konieczności podania pełnej ścieżki w hierarchii nazw pakietów, poprzedź nazwę pakietu przedrostkiem `_root_`:

```
package accounts

import _root_.users._
```

Uwaga: pakiety `scala` i `java.lang` oraz `object Predef` są domyślnie importowane.
