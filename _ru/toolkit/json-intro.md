---
layout: multipage-overview
partof: toolkit
overview-name: "Scala инструментарий"
title: Обработка JSON с помощью uPickle
type: chapter
description: Описание библиотеки uPickle.
language: ru
num: 16
previous-page:
next-page:
---

uPickle — это облегченная библиотека сериализации для Scala.

В его состав входит uJson — библиотека для работы с JSON, которая может анализировать строки JSON, 
получать доступ к их значениям в памяти или изменять их, а также записывать их обратно.

uPickle может сериализовать и десериализовать объекты Scala напрямую в JSON и из него. 
Он знает, как обрабатывать коллекции Scala, такие как `Map` и `Seq`, 
а также ваши собственные типы данных, такие как case class-ы и перечисления Scala 3.

{% include markdown.html path="_markdown/_ru/install-upickle.md" %}
