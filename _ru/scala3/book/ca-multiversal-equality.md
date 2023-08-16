---
layout: multipage-overview
title: Многостороннее равенство
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице демонстрируется, как реализовать многостороннее равенство в Scala 3.
language: ru
num: 65
previous-page: ca-type-classes
next-page: ca-implicit-conversions
versionSpecific: true
---

Раньше в Scala было _универсальное равенство_ (_universal equality_):
два значения любых типов можно было сравнивать друг с другом с помощью `==` и `!=`.
Это произошло из-за того факта, что `==` и `!=` реализованы в терминах метода `equals` Java,
который также может сравнивать значения любых двух ссылочных типов.

Универсальное равенство удобно, но оно также опасно, поскольку подрывает безопасность типов.
Например, предположим, что после некоторого рефакторинга осталась ошибочная программа,
в которой значение `y` имеет тип `S` вместо правильного типа `T`:

```scala
val x = ...   // типа T
val y = ...   // типа S, но должно быть типа T
x == y        // результат проверки типов всегда будет false
```

Если `y` сравнивается с другими значениями типа `T`, программа все равно будет проверять тип,
так как значения всех типов можно сравнивать друг с другом.
Но это, вероятно, даст неожиданные результаты и завершится ошибкой во время выполнения.

Типобезопасный язык программирования может работать лучше, а многостороннее равенство —
это дополнительный способ сделать универсальное равенство более безопасным.
Он использует класс двоичного типа `CanEqual`, чтобы указать, что значения двух заданных типов можно сравнивать друг с другом.

## Разрешение сравнения экземпляров класса

По умолчанию в Scala 3 все ещё можно сравнивать на равенство следующим образом:

```scala
case class Cat(name: String)
case class Dog(name: String)
val d = Dog("Fido")
val c = Cat("Morris")

d == c  // false, но он компилируется
```

Но в Scala 3 такие сравнения можно отключить.
При (а) импорте `scala.language.strictEquality` или (б) использовании флага компилятора `-language:strictEquality`
это сравнение больше не компилируется:

```scala
import scala.language.strictEquality

val rover = Dog("Rover")
val fido = Dog("Fido")
println(rover == fido)   // ошибка компиляции

// сообщение об ошибке компиляции:
// Values of types Dog and Dog cannot be compared with == or !=
```

## Включение сравнений

Есть два способа включить сравнение с помощью класса типов `CanEqual`.
Для простых случаев класс может _выводиться_ (_derive_) от класса `CanEqual`:

```scala
// Способ 1
case class Dog(name: String) derives CanEqual
```

Как вы вскоре увидите, когда нужна большая гибкость, вы также можете использовать следующий синтаксис:

```scala
// Способ 2
case class Dog(name: String)
given CanEqual[Dog, Dog] = CanEqual.derived
```

Любой из этих двух подходов позволяет сравнивать экземпляры `Dog` друг с другом.

## Более реалистичный пример

В более реалистичном примере представим, что есть книжный интернет-магазин
и мы хотим разрешить или запретить сравнение бумажных, печатных и аудиокниг.
В Scala 3 для начала необходимо включить многостороннее равенство:

```scala
// [1] добавить этот импорт или command line flag: -language:strictEquality
import scala.language.strictEquality
```

Затем создать объекты домена:

```scala
// [2] создание иерархии классов
trait Book:
    def author: String
    def title: String
    def year: Int

case class PrintedBook(
    author: String,
    title: String,
    year: Int,
    pages: Int
) extends Book

case class AudioBook(
    author: String,
    title: String,
    year: Int,
    lengthInMinutes: Int
) extends Book
```

Наконец, используем `CanEqual`, чтобы определить, какие сравнения необходимо разрешить:

```scala
// [3] создайте экземпляры класса типов, чтобы определить разрешенные сравнения.
//     разрешено `PrintedBook == PrintedBook`
//     разрешено `AudioBook == AudioBook`
given CanEqual[PrintedBook, PrintedBook] = CanEqual.derived
given CanEqual[AudioBook, AudioBook] = CanEqual.derived

// [4a] сравнение двух печатных книг разрешено
val p1 = PrintedBook("1984", "George Orwell", 1961, 328)
val p2 = PrintedBook("1984", "George Orwell", 1961, 328)
println(p1 == p2)         // true

// [4b] нельзя сравнивать печатную книгу и аудиокнигу
val pBook = PrintedBook("1984", "George Orwell", 1961, 328)
val aBook = AudioBook("1984", "George Orwell", 2006, 682)
println(pBook == aBook)   // ошибка компиляции
```

Последняя строка кода приводит к следующему сообщению компилятора об ошибке:

```
Values of types PrintedBook and AudioBook cannot be compared with == or !=
```

Вот как многостороннее равенство отлавливает недопустимые сравнения типов во время компиляции.

### Включение “PrintedBook == AudioBook”

Если есть необходимость разрешить сравнение "печатной книги" (`PrintedBook`) с аудио-книгой (`AudioBook`),
то достаточно создать следующие два дополнительных сравнения равенства:

```scala
// разрешить `PrintedBook == AudioBook` и `AudioBook == PrintedBook`
given CanEqual[PrintedBook, AudioBook] = CanEqual.derived
given CanEqual[AudioBook, PrintedBook] = CanEqual.derived
```

Теперь можно сравнивать печатную книгу с аудио-книгой без ошибки компилятора:

```scala
println(pBook == aBook)   // false
println(aBook == pBook)   // false
```

#### Внедрите "equals", чтобы они действительно работали

Хотя эти сравнения теперь разрешены, они всегда будут ложными,
потому что их методы `equals` не знают, как проводить подобные сравнения.
Чтобы доработать сравнение, можно переопределить методы `equals` для каждого класса.
Например, если переопределить метод `equals` для `AudioBook`:

```scala
case class AudioBook(
    author: String,
    title: String,
    year: Int,
    lengthInMinutes: Int
) extends Book:
    // переопределить, чтобы разрешить сравнение AudioBook с PrintedBook
    override def equals(that: Any): Boolean = that match
        case a: AudioBook =>
            this.author == a.author
            && this.title == a.title
            && this.year == a.year
            && this.lengthInMinutes == a.lengthInMinutes
        case p: PrintedBook =>
            this.author == p.author && this.title == p.title
        case _ =>
            false
```

Теперь можно сравнить `AudioBook` с `PrintedBook`:

```scala
println(aBook == pBook)   // true (работает из-за переопределенного `equals` в `AudioBook`)
println(pBook == aBook)   // false
```

Книга `PrintedBook` не имеет метода `equals`, поэтому второе сравнение возвращает `false`.
Чтобы включить это сравнение, достаточно переопределить метод `equals` в `PrintedBook`.

Вы можете найти дополнительную информацию о [многостороннем равенстве][ref-equal] в справочной документации.

[ref-equal]: {{ site.scala3ref }}/contextual/multiversal-equality.html
