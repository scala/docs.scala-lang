---
layout: tour
title: Пакеты и Импорт

discourse: true

partof: scala-tour

num: 35
language: ru
previous-page: annotations
next-page: package-objects
---

#  Пакеты и Импорт
Scala использует пакеты для указания пространства имен, они позволяют создавать модульную структуру кода.

## Создание пакета
Пакеты создаются путем объявления одного или нескольких имен пакетов в верхней части файла Scala.

```
package users

class User
```
По соглашению пакеты называют тем же именем, что и каталог, содержащий файл Scala. Однако Scala не обращает внимания на расположение файлов. Структура каталогов sbt-проекта для `package users` может выглядеть следующим образом:
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
Обратите внимание, что каталог `users` находится внутри каталога `scala` и как в пакете содержатся несколько файлов Scala. Каждый файл Scala в пакете может иметь одно и то же объявление пакета. Другой способ объявления пакетов - с помощью фигурных скобок:
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
Как видите, такой способ позволяет вкладывать пакеты друг в друга, а также обеспечивает отличный контроль за областью видимости и возможностью изоляции.

Имя пакета должно быть все в нижнем регистре, и если код разрабатывается в организации имеющей сайт, то следует использовать имя следующего формата: `<домен-верхнего-уровня>.<доменное-имя>.<название-проекта>`. Например, если бы у Google был проект под названием `SelfDrivingCar`, название пакета выглядело бы следующим образом:
```
package com.google.selfdrivingcar.camera

class Lens
```
Что может соответствовать следующей структуре каталога: `SelfDrivingCar/src/main/scala/com/google/selfdrivingcar/camera/Lens.scala`.

## Импорт
Указание `import` открывает доступ к членам (классам, трейтам, функциям и т.д.) в других пакетах. Указание `import` не требуется для доступа к членам одного и того же пакета. Указание `import` избирательны:
```
import users._  // групповой импорт всего пакета users
import users.User  // импортировать только User
import users.{User, UserPreferences}  // импортировать только User, UserPreferences
import users.{UserPreferences => UPrefs}  // импортировать и переименовать
```

Одним из отличий Scala от Java является то, что импорт можно использовать где угодно:

```scala mdoc
def sqrtplus1(x: Int) = {
  import scala.math.sqrt
  sqrt(x) + 1.0
}
```
В случае возникновения конфликта имен и необходимости импортировать что-либо из корня проекта, имя пакета должно начинаться с префикса `_root_`:
```
package accounts

import _root_.users._
```


Примечание: Пакеты `scala` и `java.lang`, а также `object Predef` импортируются по умолчанию.
