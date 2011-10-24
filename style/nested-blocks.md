---
layout: overview-large
title: Nested Blocks

partof: style-guide
num: 5
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
opening and closing parentheses should be unspaced and kept on the same
lines as their content (Lisp-style):

    (this + is a very ++ long *
      expression)

The only exception to this rule is when defining grammars using parser
combinators:

    lazy val e: Parser[Int] = (
        e ~ "+" ~ e  ^^ { (e1, _, e2) => e1 + e2 }
      | e ~ "-" ~ e  ^^ { (e1, _, e2) => e1 - e2 }
      | """\d+""".r  ^^ { _.toInt }
    )

Parser combinators are an internal DSL, however, meaning that many of
these style guidelines are inapplicable.

