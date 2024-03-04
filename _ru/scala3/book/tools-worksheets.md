---
layout: multipage-overview
title: Рабочие листы
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе рассматриваются рабочие листы — альтернатива проектам Scala.
language: ru
num: 71
previous-page: tools-sbt
next-page: interacting-with-java
---

Worksheet - это файл Scala, который вычисляется при сохранении,
и результат каждого выражения отображается в столбце справа от программы.
Рабочие листы похожи на [сеанс REPL][REPL session] на стероидах
и имеют поддержку редактора 1-го класса: завершение, гиперссылки, интерактивные ошибки при вводе и т.д.
Рабочие листы используют расширение `.worksheet.sc`.

Далее покажем, как использовать рабочие листы в IntelliJ и в VS Code (с расширением Metals).

1. Откройте проект Scala или создайте его:
    - чтобы создать проект в IntelliJ, выберите "File" -> "New" -> "Project...",
      выберите "Scala" в левой колонке и нажмите "Далее", чтобы задать название проекта и каталог.
    - чтобы создать проект в VS Code, выполните команду "Metals: New Scala project",
      выберите начальный `scala/scala3.g8`, задайте местоположение проекта,
      откройте его в новом окне VS Code и импортируйте сборку.
1. Создайте файл с именем `hello.worksheet.sc` в каталоге `src/main/scala/`.
    - в IntelliJ щелкните правой кнопкой мыши на каталоге `src/main/scala/` и выберите "New", а затем "File".
    - в VS Code щелкните правой кнопкой мыши на каталоге `src/main/scala/` и выберите "New File".
1. Вставьте следующее содержимое в редактор:

   ```
   println("Hello, world!")

   val x = 1
   x + x
   ```

1. Запустите worksheet:

    - в IntelliJ щелкните зеленую стрелку в верхней части редактора, чтобы запустить worksheet.
    - в VS Code сохраните файл.

   Вы должны увидеть результат выполнения каждой строки на правой панели (IntelliJ) или в виде комментариев (VS Code).

![]({{ site.baseurl }}/resources/images/scala3-book/intellij-worksheet.png)

Рабочий лист, выполненный в IntelliJ.

![]({{ site.baseurl }}/resources/images/scala3-book/metals-worksheet.png)

Рабочий лист, выполненный в VS Code (с расширением Metals).

Обратите внимание, что worksheet будет использовать версию Scala,
определенную проектом (обычно задается ключом `scalaVersion` в файле `build.sbt`).

Также обратите внимание, что worksheet не имеют [точек входа в программу][program entry point].
Вместо этого операторы и выражения верхнего уровня оцениваются сверху вниз.

[REPL session]: {{ site.baseurl }}/ru/scala3/book/taste-repl.html
[program entry point]: {{ site.baseurl }}/ru/scala3/book/methods-main-methods.html
