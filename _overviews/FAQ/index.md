---
layout: singlepage-overview
title: Scala FAQs
permalink: /tutorials/FAQ/index.html
---

Frequently asked questions, with _brief_ answers and/or links to
longer answers.

This list only includes questions that _actually_ come up over and
over again in Scala chat rooms and forums.

## General questions

### Where can I ask Scala questions?

see our [Community page](https://scala-lang.org/community/)

### Should I learn Scala 2, or Scala 3?

The default choice remains Scala 2 for now.  Most Scala jobs are Scala
2 jobs; most Scala books and online learning materials cover Scala 2;
tooling and library support is strongest in Scala 2; and so on.

Scala 3.0 is planned for release in early 2021, and a number of
Scala 3 books will come out in 2021 as well.  In time, there will
be more and more Scala 3 jobs as well.

### What's a good book about Scala?

Our [Books page](https://docs.scala-lang.org/books.html) lists a few
especially popular, well-known books.

We don't have a list of all the Scala books that
are out there; there are many.

You can go on the [Scala room on
Gitter](https://gitter.im/scala/scala) or another community forum and
ask for book recommendations, but note that you'll get more helpful
answers if you provide some information about your background and your
reasons for wanting to learn Scala.

### How do I find what some symbol means or does?

A [Stack Overflow answer](https://stackoverflow.com/a/7890032) lays
out what the different kinds of symbol in Scala are and explains the
most commonly used symbols.

Scala allows symbolic method names.  So if you see a random-looking
operator like `>=@=>` in Scala code, it might simply be a method in
some library, rather than having any special meaning in the language
itself.

You can search for symbols on Google.  For example, if you want to
know what `<:<` means, searching for `scala <:<` works fine.  If you
get poor results, try surrounding the symbol with double quotes.

## Specific technical questions

### Which type of collection should I choose?

see the [Scala Collections Guide](https://docs.scala-lang.org/overviews/collections/introduction.html)

### What are Scala context bounds (`[T : Foo]`)?

[answer on Stack Overflow](https://stackoverflow.com/a/4467012)

### How does `yield` work?

[answer on Stack Overflow](https://stackoverflow.com/a/1059501)

### What is the difference between view, stream and iterator?

[answer on Stack Overflow](https://stackoverflow.com/a/5159356)

### How can I chain/nest implicit conversions?

[answer on Stack Overflow](https://stackoverflow.com/a/5332804)

### Where does Scala look for implicits?

[answer on Stack Overflow](https://stackoverflow.com/a/5598107)

## More questions

{% assign overviews = site.overviews | sort: 'num' %}
<ul>
{% for overview in overviews %}
  {% if overview.partof == "FAQ" %}
    <li><a href="{{ site.baseurl }}{{ overview.url }}">{{ overview.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>
