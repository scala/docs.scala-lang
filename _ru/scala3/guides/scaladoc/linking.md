---
layout: multipage-overview
title: Ссылки в документации
partof: scala3-scaladoc
language: ru
num: 3
previous-page: docstrings
next-page: static-site
---

Основная функция Scaladoc — создание API документации из комментариев к коду.

По умолчанию комментарии к коду понимаются как Markdown, хотя мы также поддерживаем старый Scaladoc синтаксис 
[Wiki](https://docs.scala-lang.org/style/scaladoc.html).

## Синтаксис

### Определение ссылок

Наш синтаксис определения ссылки очень близок к синтаксису Scaladoc, хотя мы внесли некоторые улучшения.

#### Основной синтаксис

Определение ссылки выглядит следующим образом: `[[scala.collection.immutable.List]]`.

Другими словами, определение ссылки представляет собой последовательность идентификаторов, разделенных знаком `.`. 
Идентификаторы также могут быть разделены с помощью `#`.

По умолчанию идентификатор `id` ссылается на первую (в исходном порядке) сущность с именем `id`. 
Идентификатор может заканчиваться на `$`, что заставляет его ссылаться на значение (объект, значение, given); 
идентификатор также может заканчиваться на `!`, что заставляет его ссылаться на тип (класс, псевдоним типа, член типа).

Ссылки разрешаются относительно текущего местоположения в источнике. То есть при документировании класса ссылки относятся к сущности, включающей класс (пакет, класс, объект); то же самое относится к документированию определений.

Специальные символы в ссылках могут быть экранированы обратной косой чертой, что вместо этого делает их частью идентификаторов. Например, [[scala.collection.immutable\.List]] ссылается на класс immutable.List, указанный в package scala.collection.




The links are resolved relative to the current location in source. That is, when
documenting a class, the links are relative to the entity enclosing the class (a
package, a class, an object); the same applies to documenting definitions.

Special characters in links can be backslash-escaped, which makes them part of
identifiers instead. For example, `` [[scala.collection.immutable\.List]] ``
references the class named `` `immutable.List` `` in package `scala.collection`.

#### New syntax

We have extended Scaladoc definition links to make them a bit more pleasant to
write and read in source. The aim was also to bring the link and Scala syntax
closer together. The new features are:

1. `package` can be used as a prefix to reference the enclosing package
    Example:
    ```
    package utils
    class C {
      def foo = "foo".
    }
    /** See also [[package.C]]. */
    class D {
      def bar = "bar".
    }
    ```
    The `package` keyword helps make links to the enclosing package shorter
    and a bit more resistant to name refactorings.
1. `this` can be used as a prefix to reference the enclosing classlike
    Example:
    ```
    class C {
      def foo = "foo"
      /** This is not [[this.foo]], this is bar. */
      def bar = "bar"
    }
    ```
    Using a Scala keyword here helps make the links more familiar, as well as
    helps the links survive class name changes.
1. Backticks can be used to escape identifiers
    Example:
    ```
    def `([.abusive.])` = ???
    /** TODO: Figure out what [[`([.abusive.])`]] is. */
    def foo = `([.abusive.])`
    ```
    Previously (versions 2.x), Scaladoc required backslash-escaping to reference such identifiers. Now (3.x versions),
    Scaladoc allows using the familiar Scala backtick quotation.

#### Why keep the Wiki syntax for links?

There are a few reasons why we've kept the Wiki syntax for documentation links
instead of reusing the Markdown syntax. Those are:

1. Nameless links in Markdown are ugly: `[](definition)` vs `[[definition]]`
    By far, most links in documentation are nameless. It should be obvious how to
    write them.
2. Local member lookup collides with URL fragments: `[](#field)` vs `[[#field]]`
3. Overload resolution collides with MD syntax: `[](meth(Int))` vs `[[meth(Int)]]`
4. Now that we have a parser for the link syntax, we can allow spaces inside (in
    Scaladoc one needed to slash-escape those), but that doesn't get recognized
    as a link in Markdown: `[](meth(Int, Float))` vs `[[meth(Int, Float)]]`

None of these make it completely impossible to use the standard Markdown link
syntax, but they make it much more awkward and ugly than it needs to be. On top
of that, Markdown link syntax doesn't even save any characters.
