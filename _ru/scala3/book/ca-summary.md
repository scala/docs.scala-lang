---
layout: multipage-overview
title: Обзор
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице представлен краткий обзор уроков по контекстуальным абстракциям.
language: ru
num: 67
previous-page: ca-implicit-conversions
next-page: concurrency
---

В этой главе представлено введение в большинство тем контекстных абстракций, в том числе:

- [Методы расширения](ca-extension-methods.html)
- [Экземпляры given и параметры контекста](ca-context-parameters.html)
- [Контекстные границы](ca-context-bounds.html)
- [Импорт given](ca-given-imports.html)
- [Классы типов](ca-type-classes.html)
- [Многостороннее равенство](ca-multiversal-equality.html)
- [Неявные преобразования](ca-implicit-conversions.html)

Все эти функции являются вариантами основной идеи **вывода термов**: 
учитывая тип, компилятор синтезирует “канонический” терм, который имеет этот тип.

Несколько более сложных тем здесь не рассматриваются, в том числе:

- Условные given экземпляры
- Вывод класса типов
- Контекстные функции
- Контекстные параметры по имени
- Связь с имплицитами Scala 2

Эти темы подробно обсуждаются в [справочной документации][ref].

[ref]: {{ site.scala3ref }}/contextual
