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

## End markers <span class="tag tag-inline">Scala 3 only</span>

In Scala 3 using curly braces is discouraged in favor of significant indentation. 
The `end` keyword allows to provide a visual cue on where a particular block ends and can be useful especially in cases 
of long method/class definitions or many nested control structures:

{% tabs end_marker_1 %}
{% tab 'Scala 3 Only' for=end_marker_1 %}
```scala
class LongClass:
// many fields, methods etc.
  def longMethod =
    val x = 0
    // a large block of code
  end longMethod
end LongClass
```
{% endtab %}
{% endtabs %}

The `end` marker should be indented with the same number of spaces as the element it closes:

{% tabs end_marker_2 %}
{% tab 'Scala 3 Only' for=end_marker_2 %}
```scala
for x <- 1 to 10 do
  if x > 5 then
    while foo do
      ...
    end while
  end if
end for
```
{% endtab %}
{% endtabs %}

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
