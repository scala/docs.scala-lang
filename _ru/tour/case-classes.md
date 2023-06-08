---
layout: tour
title: Классы Образцы
partof: scala-tour
num: 11
language: ru
next-page: pattern-matching
previous-page: multiple-parameter-lists
prerequisite-knowledge: classes, basics, mutability
---

Классы образцы (Case classes) похожи на обычные классы с несколькими ключевыми отличиями, о которых мы поговорим ниже.
Классы образцы хороши для моделирования неизменяемых данных.
На следующей странице обзора вы увидите, насколько они полезны для участия в [сопоставлении с примером](pattern-matching.html).

## Объявление класса образца

Минимальный вариант объявления класса образца: указание ключевого слова `case class`, название и список параметров (которые могут быть пустыми). Пример:

{% tabs case-classe_Book %}

{% tab 'Scala 2 и 3' for=case-classe_Book %}

```scala mdoc
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```

{% endtab %}

{% endtabs %}

Обратите внимание, что ключевое слово `new` не было использовано для создания экземпляра класса `Book`.
Это связано с тем, что классы образцы по умолчанию имеют объект компаньон с методом `apply`,
который берет на себя заботу о создании экземпляра класса.

При создании класса образца с параметрами, эти параметры являются публичными и неизменяемыми.

{% tabs case-classe_Message_define %}

{% tab 'Scala 2 и 3' for=case-classe_Message_define %}

```
case class Message(sender: String, recipient: String, body: String)
val message1 = Message("guillaume@quebec.ca", "jorge@catalonia.es", "Ça va ?")

println(message1.sender)  // prints guillaume@quebec.ca
message1.sender = "travis@washington.us"  // эта строка не компилируется
```

{% endtab %}

{% endtabs %}

Вы не можете переназначить `message1.sender`, потому что это `val` (т.е. константа). Возможно использовать `var` в классах образцах, но это не рекомендуется.

## Сравнение

Классы образцы сравниваются по структуре, а не по ссылкам:

{% tabs case-classe_Message_compare %}

{% tab 'Scala 2 и 3' for=case-classe_Message_compare %}

```scala mdoc
case class Message(sender: String, recipient: String, body: String)

val message2 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val message3 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val messagesAreTheSame = message2 == message3  // true
```

{% endtab %}

{% endtabs %}

Даже если `message2` и `message3` ссылаются на разные объекты, значения каждого из них равны.

## Копирование

Вы можете создать копию экземпляра класса образца, просто воспользовавшись методом `copy`. При этом по желанию можно изменить аргументы конструктора.

{% tabs case-classe_Message_copy %}

{% tab 'Scala 2 и 3' for=case-classe_Message_copy %}

```
case class Message(sender: String, recipient: String, body: String)
val message4 = Message("julien@bretagne.fr", "travis@washington.us", "Me zo o komz gant ma amezeg")
val message5 = message4.copy(sender = message4.recipient, recipient = "claire@bourgogne.fr")
message5.sender  // travis@washington.us
message5.recipient // claire@bourgogne.fr
message5.body  // "Me zo o komz gant ma amezeg"
```

{% endtab %}

{% endtabs %}

Получатель `message4` использует в качестве отправителя `message5`, кроме параметра `body` который был скопирован из `message4`.

## Дополнительные ресурсы

- Дополнительная информация о классах образцах доступна в [Scala Book](/ru/scala3/book/domain-modeling-tools.html#case-class-ы)
