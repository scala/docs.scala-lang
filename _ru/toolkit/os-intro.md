---
layout: multipage-overview
partof: toolkit
overview-name: "Scala инструментарий"
title: Работа с файлами и процессами с помощью OS-Lib
type: chapter
description: Введение в библиотеку OS-lib
language: ru
num: 10
previous-page:
next-page:
---

OS-Lib — это библиотека для работы с файлами и процессами. Она является частью Scala Toolkit.

OS-Lib стремится заменить API `java.nio.file` и `java.lang.ProcessBuilder`. 
Скорее всего, вам не понадобиться напрямую использовать какие-либо низкоуровневые Java API.

OS-Lib также нацелена на то, чтобы вытеснить устаревшие API `scala.io` и `scala.sys` из стандартной библиотеки Scala.

OS-Lib не имеет зависимостей.

Весь функционал OS-Lib находится в пространстве имён `os.*`.

{% include markdown.html path="_markdown/_ru/install-os-lib.md" %}
