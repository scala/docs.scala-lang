---
layout: singlepage-overview
title: Розмови
partof: scala3-talks
language: uk
scala3: true
versionSpecific: true
---

Серія "Поговорімо про Scala 3"
-------------------------------

[Поговорімо про Scala 3](https://www.youtube.com/playlist?list=PLTx-VKTe8yLxYQfX_eGHCxaTuWvvG28Ml) є серією
коротких (близько 15 хвилин) розмов про Scala 3. Він охоплює різноманітні теми, наприклад, як почати, як застосувати
переваги нових функцій мови, або як перейти з Scala 2.

Talks on Scala 3
----------------
- (ScalaDays 2019, Lausanne) [Тур по Scala 3](https://www.youtube.com/watch?v=_Rnrx2lo9cw) 
  від [Martin Odersky](http://x.com/odersky)

- (ScalaDays 2016, Berlin) [Попереду дорога Scala](https://www.youtube.com/watch?v=GHzWqJKFCk4) 
  від [Martin Odersky](http://x.com/odersky) 
  [\[слайди\]](http://www.slideshare.net/Odersky/scala-days-nyc-2016)

- (JVMLS 2015) [Compilers are Databases](https://www.youtube.com/watch?v=WxyyJyB_Ssc) 
  від [Martin Odersky](http://x.com/odersky) 
  [\[слайди\]](http://www.slideshare.net/Odersky/compilers-are-databases)

- (Scala World 2015) [Dotty: Досліджуємо майбутнє Scala](https://www.youtube.com/watch?v=aftdOFuVU1o) 
  від [Dmitry Petrashko](http://x.com/darkdimius) 
  [\[слайди\]](https://d-d.me/scalaworld2015/#/).
  Розповідь Дмітрія охоплює багато нових функцій, які приносить Dotty, наприклад типи Intersection та Union, покращена ініціалізація lazy val тощо.
  Дмітрій також розповідає внутрішню архітектуру Dotty і, зокрема, високий рівень контекстуальних абстракцій Dotty. Ви 
  ознайомитесь з багатьма базовими поняттями, такими як «Denotations» та їх особливостями.

Deep Dive with Scala 3
----------------------
- (ScalaDays 2019, Lausanne) [Метапрограмування in Dotty](https://www.youtube.com/watch?v=ZfDS_gJyPTc) 
  від [Nicolas Stucki](https://github.com/nicolasstucki).

- (ScalaDays 2019, Lausanne) [Future-proofing в Scala: проміжна репрезентація TASTY](https://www.youtube.com/watch?v=zQFjC3zLYwo) 
  від [[Guillaume Martres](http://guillaume.martres.me/)](http://guillaume.martres.me/).

- (Mar 21, 2017) [Dotty Internals 1: Trees та Symbols](https://www.youtube.com/watch?v=yYd-zuDd3S8) 
  від [Dmitry Petrashko](http://x.com/darkdimius) 
  [\[meeting notes\]](https://nightly.scala-lang.org/docs/internals/dotty-internals-1-notes.html).
  Це запис зустрічі EPFL та Waterloo, де були представлені перші нотатки про Dotty: Trees та Symbols.

- (Mar 21, 2017) [Dotty Internals 2: Types](https://www.youtube.com/watch?v=3gmLIYlGbKc) 
  від [Martin Odersky](http://x.com/odersky) та [Dmitry Petrashko](http://x.com/darkdimius).
  Це запис зустрічі EPFL та Waterloo, де були представлено як представлені типи всередині Dotty.

- (Jun 15, 2017) [Dotty Internals 3: Denotations](https://youtu.be/9iPA7zMRGKY) 
  від [Martin Odersky](http://x.com/odersky) та [Dmitry Petrashko](http://x.com/darkdimius).
  Це запис зустрічі EPFL та Waterloo, де були представлена денотація в Dotty.

- (JVM Language Summit) [Як зробити компілятор Dotty швидким](https://www.youtube.com/watch?v=9xYoSwnSPz0) 
  від [Dmitry Petrashko](http://x.com/darkdimius).
  Дмітрій дає високорівневий вступ до того, що було зроблено для створення Dotty .

- (Typelevel Summit Oslo, May 2016) [Dotty та типи: поки що історія](https://www.youtube.com/watch?v=YIQjfCKDR5A) 
  від [Guillaume Martres](http://guillaume.martres.me/) 
  [\[слайди\]](http://guillaume.martres.me/talks/typelevel-summit-oslo/).
  Гійом зосередився на деяких практичних вдосконаленнях системи типів, які робить Dotty. Це новий алгоритм параметру типу, 
  який здатний робити висновки про безпеку типів для більшої кількості ситуацій ніж scalac.

- (flatMap(Oslo) 2016) [AutoSpecialization в Dotty](https://vimeo.com/165928176) 
  від [Dmitry Petrashko](http://x.com/darkdimius) 
  [\[слайди\]](https://d-d.me/talks/flatmap2016/#/).
  Компонувальник Dotty аналізує вашу програму та її залежності, щоб застосувати нову схему спеціалізації. 
  Віна ґрунтується на нашому досвіді з Specialization, Miniboxing та Valhalla Project,
  і різко зменшує розмір байт-коду. І, що найкраще, це завжди ввімкнено, відбувається за кулісами без анотацій, 
  що призводить до прискорення понад 20 разів. Крім того, він «просто працює» на колекціях Scala.

- (ScalaSphere 2016) [Hacking on Dotty: жива демонстрація](https://www.youtube.com/watch?v=0OOYGeZLHs4) 
  від [Guillaume Martres](http://guillaume.martres.me/) 
  [\[слайди\]](http://guillaume.martres.me/talks/dotty-live-demo/).
  Прийоми Гійома для Dotty: демонстрація в реальному часі, під час якої він створює просту фазу компілятора для відстеження викликів методів під час виконання.

- (Scala By the Bay 2016) [Dotty: що це і як працює](https://www.youtube.com/watch?v=wCFbYu7xEJA)
  від [Guillaume Martres](http://guillaume.martres.me/) 
  [\[слайди\]](http://guillaume.martres.me/talks/dotty-tutorial/#/).
  Гійом демонструє високорівневе представлення пайплайну компіляції в Dotty.

- (ScalaDays 2015, Amsterdam) [Як зробити ваші програми на Scala меншими та швидшими за допомогою компонувальника Dotty](https://www.youtube.com/watch?v=xCeI1ArdXM4)
  від [Dmitry Petrashko](http://x.com/darkdimius)
  [\[слайди\]](https://d-d.me/scaladays2015/#/).
  Дмитрій представляє алгоритм аналізу графу виклик у Dotty та переваги продуктивності, які ми можемо отримати з точки зору кількості методів, 
  розміру байт-коду, розміру коду JVM і кількість об'єктів, виділених в кінці.
