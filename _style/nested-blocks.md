---
layout: style-guide
title: Nested Blocks
partof: style
overview-name: Style Guide
num: 5
previous-page: types
next-page: declarations
---

## Curly Braces

Opening curly braces (`{`) must be on the same line as the declaration
they represent:

{% tabs braces %}
{% tab 'Scala 2 and 3' for=braces %}
```scala
def foo = {
  ...
}
```
{% endtab %}
{% endtabs %}

Technically, Scala's parser *does* support GNU-style notation with
opening braces on the line following the declaration. However, the
parser is not terribly predictable when dealing with this style due to
the way in which semi-colon inference is implemented. Many headaches
will be saved by simply following the curly brace convention
demonstrated above.

## Parentheses

In the rare cases when parenthetical blocks wrap across lines, the
opening and closing parentheses should be unspaced and generally kept on the same
lines as their content (Lisp-style):

{% tabs parentheses %}
{% tab 'Scala 2 and 3' for=parentheses %}
```scala
(this + is a very ++ long *
  expression)
```
{% endtab %}
{% endtabs %}

Parentheses also serve to disable semicolon inference, and so allow the developer
to start lines with operators, which some prefer:

{% tabs parentheses_2 %}
{% tab 'Scala 2 and 3' for=parentheses_2 %}
```scala
(  someCondition
|| someOtherCondition
|| thirdCondition
)
```
{% endtab %}
{% endtabs %}

A trailing parenthesis on the following line is acceptable in this case, for
aesthetic reasons.
