---
layout: singlepage-overview
title: Нові можливості в Scaladoc
language: uk
scala3: true
---

Нова версія Scala 3 поставляється з абсолютно новою реалізацією генератора документації _Scaladoc_, переписаною з нуля.
У цій статті ви можете знайти огляд нових функцій, які є або будуть представлені в Scaladoc.
Для загальної довідки відвідайте [посібник Scaladoc]({% link _overviews/scala3-scaladoc/index.md %}).

## Нові можливості

### Синтаксис Markdown

Найбільшою зміною, внесеною в нову версію Scaladoc, є зміна мови за замовчуванням для docstrings. Поки що Scaladoc підтримував лише синтаксис Wikidoc.
Новий Scaladoc все ще може аналізувати застарілий синтаксис `Wikidoc`, однак Markdown вибрано як основну мову для форматування коментарів.
Щоб повернутися до `Wikidoc`, можна передати глобальний прапор перед запуском `doc` або визначити його для конкретних коментарів за допомогою директиви `@syntax wiki`.

Щоб отримати додаткову інформацію про те, як використовувати повну силу документації, перегляньте [Scaladoc docstrings][scaladoc-docstrings]


### Статичні вебсайти

Scaladoc також забезпечує простий спосіб створення **статичних сайтів** як для документації, так і для публікацій у блозі, подібно до того, як це робить Jekyll.
Завдяки цій функції ви можете зберігати свою документацію разом зі згенерованим API Scaladoc дуже зручним способом.

Щоб отримати додаткову інформацію про те, як налаштувати генерацію статичних сайтів, перегляньте абзац [Статична документація][static-documentation]

![](/resources/images/scala3/scaladoc/static-site.png)

### Публікації в блозі

Дописи в блозі – це особливий тип статичних сайтів. У посібнику Scaladoc ви можете знайти додаткову інформацію про те, як працювати з [публікаціями в блозі][built-in-blog].

![](/resources/images/scala3/scaladoc/blog-post.png)

### Посилання на соціальні мережі

Крім того, Scaladoc надає простий спосіб налаштувати [посилання на соціальні мережі][social-links], наприклад Twitter чи Discord.

![](/resources/images/scala3/scaladoc/social-links.png){: style="width: 180px"}

## Експериментальні особливості

На поточний час (травень 2021 р.) перелічені нижче функції не можуть бути випущені разом із Scaladoc, однак ми будемо раді почути ваші відгуки. 
Кожна функція має власний розділ на сайті учасників scala-lang, де ви можете поділитися своїми думками.

### Компіляція фрагментів

Одним з експериментальних особливостей Scaladoc є компілятор фрагментів (snippets compiler). 
Цей інструмент дозволить вам компілювати фрагменти, які ви додаєте до docstring, щоб перевірити, чи вони насправді поводяться належним чином. 
Ця функція дуже схожа на інструменти `tut` або `mdoc`, але буде поставлятися разом із Scaladoc для легкого налаштування та інтеграції у ваш проєкт. 
Зробити фрагменти інтерактивними --- наприклад, дозволити користувачам редагувати та компілювати їх у браузері --- наразі розглядається.

Вітрина:
* Приховування коду ![]({{ site.baseurl }}/resources/images/scala3/scaladoc/hiding-code.gif)
* Виявлення помилок компіляції ![]({{ site.baseurl }}/resources/images/scala3/scaladoc/assert-compilation-errors.gif)
* Включення фрагментів ![]({{ site.baseurl }}/resources/images/scala3/scaladoc/snippet-includes.png)

Для більш детальної інформації дивіться [Посібники](/scala3/guides/scaladoc/snippet-compiler.html), або перейдіть у [тред Scala Contributors](https://contributors.scala-lang.org/t/snippet-validation-in-scaladoc-for-scala-3/4976)

### Пошук, оснований на типах

Пошук функцій за їх символьними назвами може зайняти багато часу.
Саме тому новий Scaladoc дозволяє шукати методи та поля за їх типами.

Тому для декларації:
```
extension [T](arr: IArray[T]) def span(p: T => Boolean): (IArray[T], IArray[T]) = ...
```
Замість того, щоб шукати `span`, ми можемо шукати `IArray[A] => (A => Boolean) => (IArray[A], IArray[A])`.

Щоб скористатися цією функцією, просто введіть підпис функції, яку ви шукаєте, на панелі пошуку scaladoc. Ось як це працює:

![](/resources/images/scala3/scaladoc/inkuire-1.0.0-M2_js_flatMap.gif)

Ця функція забезпечується пошуковою системою [Inkuire](https://github.com/VirtusLab/Inkuire), яка працює для Scala 3 і Kotlin. Щоб бути в курсі розвитку цього інструменту, підпишіться на оновлення [репозиторію Inkuire](https://github.com/VirtusLab/Inkuire).

Для отримання додаткової інформації дивіться [Посібники](/scala3/guides/scaladoc/search-engine.html)

Зауважте, що ця функція все ще знаходиться на стадії розробки, тому вона може зазнати значних змін.
Якщо ви зіткнулися з помилкою або маєте ідею щодо покращення, не соромтеся створювати проблему на [Inkuire](https://github.com/VirtusLab/Inkuire/issues/new) або [dotty](https://github.com/lampepfl/dotty/issues/new).

[scaladoc-docstrings]: {% link _overviews/scala3-scaladoc/docstrings.md %}
[static-documentation]: {% link _overviews/scala3-scaladoc/static-site.md %}
[built-in-blog]: {% link _overviews/scala3-scaladoc/blog.md %}
[social-links]: {% link _overviews/scala3-scaladoc/settings.md %}#-social-links
