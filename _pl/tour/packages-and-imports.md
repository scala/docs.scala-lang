---
layout: tour
title: Paczki i importy
language: pl
partof: scala-tour

num: 34
previous-page: annotations
next-page: package-objects
language: pl
---

# Paczki i importy
Scala używa pakietów do tworzenia przestrzeni nazw (namespaces), które umożliwiają modularyzację programów.

## Tworzenie pakietu
Pakiety są tworzone przez zadeklarowanie jednej lub więcej nazw pakietów w górnej części pliku Scali.

```
package users

class User
```

Jednym z założeń jest nadanie paczce takiej samej nazwy, jak katalog zawierający plik Scali. Jednak Scala jest niezależna od układu plików. Struktura katalogów projektu SBT dla użytkowników pakietu (`package users`) może wyglądać następująco:

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

Zwróć uwagę, że katalog `users` znajduje się w katalogu `scala` i jak w pakiecie znajduje się wiele plików Scali. Każdy plik Scali w pakiecie może mieć tę samą deklarację pakietu. Innym sposobem deklarowania pakietów jest użycie nawiasów klamrowych:

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

Jak widać, pozwala to na zagnieżdżanie pakietów i zapewnia większą kontrolę nad zakresem i hermetyzacją. Nazwa pakietu powinna być zapisana małymi literami, a jeśli kod jest opracowywany w organizacji, która posiada witrynę internetową, powinna mieć następującą konwencję formatu: `<top-level-domain>.<domain-name>.<project-name>`. Na przykład, gdyby firma Google miała projekt o nazwie `SelfDrivingCar`, nazwa pakietu wyglądałaby następująco:

```
package com.google.selfdrivingcar.camera

class Lens
```

Może to odpowiadać następującej strukturze katalogów: `SelfDrivingCar/src/main/scala/com/google/selfdrivingcar/camera/Lens.scala`.

## Import

Deklaracje `import` służą do uzyskiwania dostępu do członków (members, tzn.: klasy, cechy, funkcje itp.) w innych pakietach. Aby uzyskać dostęp do członków tego samego pakietu, nie jest wymagana deklaracja `import`. Deklaracje `import` są selektywne.

```
import users._  // zaimportuj wszystko z pakietu użytkowników
import users.User  // zaimportuj klasę User
import users.{User, UserPreferences}  // zaimportuj tylko wybranych członków
import users.{UserPreferences => UPrefs}  // zaimportuj i zmień nazwę dla wygody
```

Jedną z różnic w Scali od Javy jest to, że `import` można używać wszędzie:

```tut
def sqrtplus1(x: Int) = {
  import scala.math.sqrt
  sqrt(x) + 1.0
}
```

W przypadku konfliktu nazw i konieczności zaimportowania czegoś z katalogu głównego projektu, poprzedź nazwę pakietu przedrostkiem `_root_`:

```
package accounts

import _root_.users._
```

Uwaga: pakiety `scala` i `java.lang` oraz `object Predef` są domyślnie importowane.
