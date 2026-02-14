---
layout: singlepage-overview
title: Обсуждения
partof: scala3-scaladoc
scala3: true
language: ru
versionSpecific: true
---

Серия "Давайте поговорим о Scala 3"
-------------------------------

[Давайте поговорим о Scala 3](https://www.youtube.com/playlist?list=PLTx-VKTe8yLxYQfX_eGHCxaTuWvvG28Ml) — это серия 
коротких (около 15 минут) докладов о Scala 3. Они охватывают различные темы, например, как начать работу, 
как воспользоваться преимуществами новых языковых функций или как перейти со Scala 2.

Обсуждения Scala 3
----------------
- (ScalaDays 2019, Lausanne) [Тур по Scala 3](https://www.youtube.com/watch?v=_Rnrx2lo9cw) от [Martin Odersky](http://x.com/odersky)

- (ScalaDays 2016, Berlin) [Развитие Scala](https://www.youtube.com/watch?v=GHzWqJKFCk4) от [Martin Odersky](http://x.com/odersky) [\[слайды\]](http://www.slideshare.net/Odersky/scala-days-nyc-2016)

- (JVMLS 2015) [Компиляторы — это базы данных](https://www.youtube.com/watch?v=WxyyJyB_Ssc) от [Martin Odersky](http://x.com/odersky) [\[слайды\]](http://www.slideshare.net/Odersky/compilers-are-databases)

- (Scala World 2015) [Dotty: изучение будущего Scala](https://www.youtube.com/watch?v=aftdOFuVU1o) от [Dmitry Petrashko](http://x.com/darkdimius) [\[слайды\]](https://d-d.me/scalaworld2015/#/).
  Дмитрий рассказывает о многих новых функциях, которые предлагает Dotty, таких как типы пересечения и объединения, 
  улучшенная инициализация lazy val и многое другое. Дмитрий также рассказывает о внутреннем устройстве Dotty 
  и, в частности, о высоком уровне контекстных абстракций Dotty. 
  Вы познакомитесь со многими основными понятиями, такими как `Denotations`, их эволюция во времени (компиляции), 
  их преобразования и многое другое.

Глубокое погружение в Scala 3
----------------------
- (ScalaDays 2019, Lausanne) [Метапрограммирование в Dotty](https://www.youtube.com/watch?v=ZfDS_gJyPTc) от [Nicolas Stucki](https://github.com/nicolasstucki).

- (ScalaDays 2019, Lausanne) [Scala, ориентированная на будущее: промежуточное представление TASTY](https://www.youtube.com/watch?v=zQFjC3zLYwo) от [Guillaume Martres](http://guillaume.martres.me/).

- (Mar 21, 2017) [Dotty Internals 1: Trees & Symbols](https://www.youtube.com/watch?v=yYd-zuDd3S8) от [Dmitry Petrashko](http://x.com/darkdimius) [\[заметки\]](https://nightly.scala-lang.org/docs/internals/dotty-internals-1-notes.html).
  Это записанная встреча между EPFL и Waterloo, на которой мы представляем первые понятия внутри Dotty: деревья и символы.

- (Mar 21, 2017) [Dotty Internals 2: Types](https://www.youtube.com/watch?v=3gmLIYlGbKc) от [Martin Odersky](http://x.com/odersky) и [Dmitry Petrashko](http://x.com/darkdimius).
  Это записанная встреча между EPFL и Waterloo, на которой мы рассказываем, как типы представлены внутри Dotty.

- (Jun 15, 2017) [Dotty Internals 3: Denotations](https://youtu.be/9iPA7zMRGKY) от [Martin Odersky](http://x.com/odersky) и [Dmitry Petrashko](http://x.com/darkdimius).
  Это записанная встреча между EPFL и Waterloo, где мы вводим обозначения в Dotty.

- (JVM Language Summit) [How do we make the Dotty compiler fast](https://www.youtube.com/watch?v=9xYoSwnSPz0) от [Dmitry Petrashko](http://x.com/darkdimius).
  [Dmitry Petrashko](http://x.com/darkdimius) в общих чертах рассказывает о том, что было сделано для создания Dotty.

- (Typelevel Summit Oslo, May 2016) [Dotty and types: the story so far](https://www.youtube.com/watch?v=YIQjfCKDR5A) от
  Guillaume Martres [\[слайды\]](http://guillaume.martres.me/talks/typelevel-summit-oslo/).
  Guillaume сосредоточился на некоторых практических улучшениях системы типов, реализованных в Dotty, 
  таких как новый алгоритм вывода параметров типа, 
  который может принимать решения о безопасности типов в большем количестве ситуаций, чем scalac.

- (flatMap(Oslo) 2016) [AutoSpecialization in Dotty](https://vimeo.com/165928176) от [Dmitry Petrashko](http://x.com/darkdimius) [\[слайды\]](https://d-d.me/talks/flatmap2016/#/).
  Dotty Linker анализирует вашу программу и ее зависимости, чтобы применить новую схему специализации.
  Он основан на нашем опыте Specialization, Miniboxing и проекта Valhalla и значительно уменьшает размер создаваемого байт-кода. 
  И, что лучше всего, он всегда включен, выполняется за кулисами без аннотаций и приводит к ускорению более чем в 20 раз. 
  Кроме того, он "просто работает" с коллекциями Scala.

- (ScalaSphere 2016) [Hacking on Dotty: A live demo](https://www.youtube.com/watch?v=0OOYGeZLHs4) от Guillaume Martres [\[слайды\]](http://guillaume.martres.me/talks/dotty-live-demo/).
  Guillaume взламывает Dotty: живая демонстрация, во время которой он создает простую фазу компиляции 
  для трассировки вызовов методов во время выполнения.

- (Scala By the Bay 2016) [Dotty: what is it and how it works](https://www.youtube.com/watch?v=wCFbYu7xEJA) от Guillaume
  Martres [\[слайды\]](http://guillaume.martres.me/talks/dotty-tutorial/#/). 
  Guillaume предоставляет высокоуровневое представление о конвейере компиляции Dotty.

- (ScalaDays 2015, Amsterdam) [Making your Scala applications smaller and faster with the Dotty linker](https://www.youtube.com/watch?v=xCeI1ArdXM4) от Dmitry Petrashko [\[слайды\]](https://d-d.me/scaladays2015/#/).
  Дмитрий представляет алгоритм анализа графа вызовов, который реализует Dotty, и преимущества производительности, 
  которые мы можем получить с точки зрения количества методов, размера байт-кода, размера кода JVM 
  и количества объектов, выделенных в конце.
