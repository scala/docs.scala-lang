---
layout: style-guide
title: Nested Blocks

partof: style
overview-name: "Style Guide"

num: 5

previous-page: types
next-page: files
---

## Curly Braces

Opening curly braces (`{`) must be on the same line as the declaration
they represent:

    def foo = {
      ...
    }

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

    (this + is a very ++ long *
      expression)

Parentheses also serve to disable semicolon inference, and so allow the developer
to start lines with operators, which some prefer:

    (  someCondition
    || someOtherCondition
    || thirdCondition
    )

A trailing parenthesis on the following line is acceptable in this case, for
aesthetic reasons.
